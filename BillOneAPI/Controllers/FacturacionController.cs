using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BillOneAPI.Models.Entities;
using BillOneAPI.Models.Context;
using BillOneAPI.Models.DTOs;
using BillOneAPI.Services;
using System.Text;
using System.Text.Json;
using System.Net.Http.Headers;


namespace BillOneAPI.Controllers;

/// <summary>
/// Controlador para el proceso de facturación
/// </summary>
[ApiController]
[Route("api/[controller]")]  // La ruta base será /api/Facturacion
public class FacturacionController : ControllerBase
{
    private readonly BillOneContext _context;
    private readonly ILogger<FacturacionController> _logger;
    private readonly PdfService _pdfService;

    private readonly HttpClient _httpClient;
    private readonly string _apiUrl;
    private readonly IWebHostEnvironment _env;
    private readonly string _filesDirectory;

    public FacturacionController(BillOneContext context, ILogger<FacturacionController> logger, PdfService pdfService, IHttpClientFactory httpClientFactory, IConfiguration configuration, IWebHostEnvironment env)
    {
        _context = context;
        _logger = logger;
        _pdfService = pdfService;

        // Usar IHttpClientFactory para crear un HttpClient
        _httpClient = httpClientFactory.CreateClient("Facturama");

        // Configuración para el ambiente de pruebas (sandbox)
        _apiUrl = "https://apisandbox.facturama.mx/";

        _env = env;

        // Configurar directorio de archivos
        _filesDirectory = Path.Combine(_env.ContentRootPath, "files");
        
        // Crear directorio si no existe
        if (!Directory.Exists(_filesDirectory))
        {
            Directory.CreateDirectory(_filesDirectory);
        }

        // las credenciales desde la configuración
        var username = configuration["Facturama:Username"];
        var password = configuration["Facturama:Password"];

        if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
        {
            var authToken = Encoding.ASCII.GetBytes($"{username}:{password}");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic",
                Convert.ToBase64String(authToken));
        }
        
    }

    //endpoint para previsualizacion de pdf
    // /api/Facturacion/preview
    [HttpPost("preview")]
    public async Task<IActionResult> GenerarPreviewFactura([FromBody] FacturaPreviewRequest request)
    {
        try
        {
            // Validar que el usuario exista
            var usuario = await _context.Usuarios.FindAsync(request.UsuarioID);
            if (usuario == null)
            {
                return NotFound(new { Error = "Usuario no encontrado" });
            }

            // Obtener emisor (asumimos que hay solo uno)
            var emisor = await _context.Emisores.FirstOrDefaultAsync();
            if (emisor == null)
            {
                return StatusCode(500, new { Error = "Datos del emisor no configurados" });
            }

            // Obtener tokens
            var tokens = await _context.Tokens
                .Where(t => request.TokensIDs.Contains(t.TokenID) && t.FacturaID == null)
                .ToListAsync();

            if (tokens.Count == 0)
            {
                return BadRequest(new { Error = "No se encontraron tokens válidos" });
            }

            // Validar tipo de servicio
            if (request.Servicio.ToLower() != "envio" &&
               request.Servicio.ToLower() != "boletos" &&
               request.Servicio.ToLower() != "comida")
            {
                return BadRequest(new { Error = "Tipo de servicio no válido" });
            }

            // Crear objeto factura temporal (no se guarda en BD)
            var facturaPreview = new Factura
            {
                UsuarioID = usuario.UsuarioID,
                Total = tokens.Sum(t => t.Monto),
                Servicio = request.Servicio,
                CreatedAt = DateTime.UtcNow
            };

            // Generar PDF
            var pdfBytes = _pdfService.GeneratePdf(facturaPreview, usuario, emisor, tokens);

            // Devolver PDF como respuesta
            return File(pdfBytes, "application/pdf", $"FacturaPreview_{DateTime.Now:yyyyMMddHHmmss}.pdf");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al generar previsualización de factura");
            return StatusCode(500, new { Error = "Error interno al generar previsualización" });
        }
    }

    /// <summary>
    /// Endpoint para generar una nueva factura
    /// </summary>
    /// <param name="request">Datos para generar la factura</param>
    /// <returns>Detalles de la factura generada</returns>
    [HttpPost]
    public async Task<IActionResult> GenerarFactura([FromBody] FacturaRequest request)
    {
        try
        {
            // Validar que el usuario exista
            var usuario = await _context.Usuarios.FindAsync(request.UsuarioID);
            if (usuario == null)
            {
                return NotFound(new { Error = "Usuario no encontrado" });
            }

            // Obtener todos los tokens válidos (no facturados previamente)
            var tokens = await _context.Tokens
                .Where(t => request.TokensIDs.Contains(t.TokenID))
                .ToListAsync();

            tokens = tokens.Where(t => t.FacturaID == null).ToList();
            if (tokens.Count == 0)
            {
                return BadRequest(new { Error = "No se encontraron tokens válidos o ya han sido facturados" });
            }

            if (request.Servicio.ToLower() != "envio" && request.Servicio.ToLower() != "boletos" && request.Servicio.ToLower() != "comida")
            {
                return BadRequest(new { Error = "Tipo de servicio no válido" });
            }

            // Crear la nueva factura
            var factura = new Factura
            {
                UsuarioID = usuario.UsuarioID,
                Total = tokens.Sum(t => t.Monto),  // Sumar montos de todos los tokens
                Servicio = request.Servicio,       // Tipo de servicio (envío, boletos, comida)
                CreatedAt = DateTime.UtcNow       // Fecha de creación
            };

            _context.Facturas.Add(factura);
            await _context.SaveChangesAsync();

            // Asociar los tokens a esta factura
            foreach (var token in tokens)
            {
                token.FacturaID = factura.FacturaID;
            }
            await _context.SaveChangesAsync();

            // Registrar en el historial
            var historial = new HistorialFactura
            {
                FacturaID = factura.FacturaID,
                UsuarioID = usuario.UsuarioID,
                Accion = "Generación de factura",
                Fecha = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            _context.HistorialFacturas.Add(historial);
            await _context.SaveChangesAsync();

            // Devolver respuesta con todos los datos relevantes
            return Ok(new
            {
                FacturaID = factura.FacturaID,
                Fecha = factura.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
                Total = factura.Total,
                Servicio = factura.Servicio,
                Tokens = tokens.Select(t => new
                {
                    t.TokenID,
                    t.Concepto,
                    t.Monto
                }),
                DatosFiscales = new
                {
                    usuario.RFC,
                    usuario.Nombre,
                    usuario.RegimenFiscal
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al generar factura");
            return StatusCode(500, new { Error = "Error interno del servidor" });
        }
    }

    [HttpPost("timbrar")]
    public async Task<IActionResult> TimbrarFactura([FromBody] JsonElement cfdiRequest)
    {
        try
        {
            // Convertir el JsonElement a string para tener control total sobre la serialización
            string jsonContent = cfdiRequest.GetRawText();

            // Verificar si el emisor (Issuer) está presente en la solicitud
            if (!jsonContent.Contains("\"Issuer\""))
            {
                return BadRequest("El objeto 'Issuer' es obligatorio en la API multiemisor");
            }

            var content = new StringContent(
                jsonContent,
                Encoding.UTF8,
                "application/json"
            );

            // Log para depuración
            Console.WriteLine($"URL: {_apiUrl}api-lite/3/cfdis");
            Console.WriteLine($"Request: {jsonContent}");

            // Imprimir cabeceras para depuración
            foreach (var header in _httpClient.DefaultRequestHeaders)
            {
                Console.WriteLine($"Header: {header.Key}: {string.Join(", ", header.Value)}");
            }

            // Endpoint para timbrar CFDI - Usando el API Multiemisor
            var response = await _httpClient.PostAsync($"{_apiUrl}api-lite/3/cfdis", content);

            // Obtener el contenido de la respuesta como string
            var responseContent = await response.Content.ReadAsStringAsync();

            // Log para depuración
            Console.WriteLine($"Status: {response.StatusCode}");
            Console.WriteLine($"Response: {responseContent}");

            if (response.IsSuccessStatusCode)
            {
                if (!string.IsNullOrEmpty(responseContent))
                {
                    try
                    {
                        // Intentar deserializar como objeto dinámico
                        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                        var responseObject = JsonSerializer.Deserialize<JsonElement>(responseContent, options);
                        return Ok(responseObject);
                    }
                    catch (JsonException ex)
                    {
                        // Si hay error al deserializar, devolver el contenido en bruto
                        return Ok(new
                        {
                            Message = "Respuesta recibida pero con formato JSON inválido",
                            RawResponse = responseContent,
                            Error = ex.Message
                        });
                    }
                }
                else
                {
                    return Ok(new { Message = "Operación completada, pero la respuesta está vacía" });
                }
            }
            else
            {
                return StatusCode((int)response.StatusCode, new
                {
                    StatusCode = (int)response.StatusCode,
                    ReasonPhrase = response.ReasonPhrase,
                    Content = responseContent
                });
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Excepción: {ex.Message}");
            Console.WriteLine($"StackTrace: {ex.StackTrace}");

            // Si existe una excepción interna, también la mostramos
            if (ex.InnerException != null)
            {
                Console.WriteLine($"InnerException: {ex.InnerException.Message}");
                Console.WriteLine($"InnerStackTrace: {ex.InnerException.StackTrace}");
            }

            return StatusCode(500, new
            {
                Error = "Error al timbrar factura",
                Message = ex.Message,
                StackTrace = ex.StackTrace,
                InnerMessage = ex.InnerException?.Message
            });
        }
    }



    [HttpGet("listar")]
    public async Task<IActionResult> ListarFacturas([FromQuery] string? fechaInicio = null, [FromQuery] string? fechaFin = null)
    {
        try
        {
            string queryParams = "";
            if (!string.IsNullOrEmpty(fechaInicio) && !string.IsNullOrEmpty(fechaFin))
            {
                queryParams = $"?fechaInicial={fechaInicio}&fechaFinal={fechaFin}";
            }

            // Endpoint para listar CFDIs - API Multiemisor
            var response = await _httpClient.GetAsync($"{_apiUrl}api-lite/cfdis{queryParams}");

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                return Ok(JsonSerializer.Deserialize<object>(responseContent));
            }

            return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error al listar facturas: {ex.Message}");
        }
    }

    [HttpGet("obtener/{id}")]
    public async Task<IActionResult> ObtenerFactura(string id)
    {
        try
        {
            // Endpoint para obtener un CFDI por su ID - API Multiemisor
            var response = await _httpClient.GetAsync($"{_apiUrl}api-lite/cfdis/{id}");

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                return Ok(JsonSerializer.Deserialize<object>(responseContent));
            }

            return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error al obtener factura: {ex.Message}");
        }
    }

    [HttpGet("descargar/{format}/{type}/{id}")]
    public async Task<IActionResult> DescargarFactura(string format, string type, string id)
    {
        try
        {
            // Validación de parámetros
            if (string.IsNullOrEmpty(format) || string.IsNullOrEmpty(type) || string.IsNullOrEmpty(id))
                return BadRequest("Todos los parámetros (format, type, id) son requeridos");

            // Validar formatos permitidos (case-insensitive)
            var formatosPermitidos = new[] { "pdf", "html", "xml" };
            if (!formatosPermitidos.Contains(format.ToLower()))
                return BadRequest($"Formato '{format}' no válido. Use: {string.Join(", ", formatosPermitidos)}");

            // Validar tipos permitidos (case-insensitive)
            var tiposPermitidos = new[] { "payroll", "received", "issued", "issuedlite" };
            var typeLower = type.ToLower();
            if (!tiposPermitidos.Contains(typeLower))
                return BadRequest($"Tipo '{type}' no válido. Use: payroll, received, issued, issuedLite");

            // Construir URL según documentación de Facturama
            var url = $"{_apiUrl}api/cfdi/{format.ToLower()}/{typeLower}/{id}";
            Console.WriteLine($"Solicitando documento desde: {url}");

            // Realizar petición
            var response = await _httpClient.GetAsync(url);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Error en la respuesta: {response.StatusCode} - {responseContent}");
                return StatusCode((int)response.StatusCode, JsonSerializer.Deserialize<object>(responseContent));
            }

            // Deserializar respuesta
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var fileResponse = JsonSerializer.Deserialize<FileResponse>(responseContent, options);

            if (fileResponse == null || string.IsNullOrEmpty(fileResponse.Content))
                return StatusCode(500, "La respuesta no contiene datos válidos");

            // Decodificar base64
            var fileBytes = Convert.FromBase64String(fileResponse.Content);

            // Determinar content-type
            var contentType = format.ToLower() switch
            {
                "pdf" => "application/pdf",
                "html" => "text/html",
                "xml" => "application/xml",
                _ => "application/octet-stream"
            };

            // Devolver archivo
            return File(fileBytes, contentType, $"{id}.{format.ToLower()}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al descargar factura: {ex.Message}\n{ex.StackTrace}");
            return StatusCode(500, new
            {
                Error = "Error interno al procesar la solicitud",
                ex.Message,
                StackTrace = ex.StackTrace
            });
        }
    }

    // Clases para deserialización
    public class FileResponse
    {
        public string ContentEncoding { get; set; }
        public string ContentType { get; set; }
        public int ContentLength { get; set; }
        public string Content { get; set; }
    }


    [HttpDelete("cancelar/{id}")]
    public async Task<IActionResult> CancelarFactura(string id, [FromBody] object motivo)
    {
        try
        {
            var content = new StringContent(
                JsonSerializer.Serialize(motivo),
                Encoding.UTF8,
                "application/json"
            );

            // Endpoint para cancelar un CFDI - API Multiemisor
            var response = await _httpClient.DeleteAsync($"{_apiUrl}api-lite/cfdis/{id}");

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                return Ok(JsonSerializer.Deserialize<object>(responseContent));
            }

            return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error al cancelar factura: {ex.Message}");
        }
    }


    /// <summary>
    /// Endpoint para obtener el historial de facturas por RFC
    /// </summary>
    /// <param name="rfc">RFC del cliente</param>
    /// <returns>Lista de facturas con sus detalles</returns>
    [HttpGet("historial/{rfc}")]
    public async Task<IActionResult> ObtenerHistorial(string rfc)
    {
        try
        {
            var facturas = await _context.Facturas
                .Include(f => f.Tokens)       // Incluir tokens asociados
                .Include(f => f.Usuario)      // Incluir datos del usuario
                .Where(f => f.Usuario.RFC == rfc)
                .OrderByDescending(f => f.CreatedAt)  // Ordenar por fecha descendente
                .Select(f => new
                {
                    f.FacturaID,
                    f.CreatedAt,
                    f.Total,
                    f.Servicio,
                    Tokens = f.Tokens.Select(t => new
                    {
                        t.TokenID,
                        t.Concepto,
                        t.Monto
                    }),
                    DatosFiscales = new
                    {
                        f.Usuario.RFC,
                        f.Usuario.Nombre
                    }
                })
                .ToListAsync();

            if (facturas.Count == 0)
            {
                return NotFound(new { Error = "No se encontraron facturas para este RFC" });
            }

            return Ok(facturas);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener historial");
            return StatusCode(500, new { Error = "Error interno del servidor" });
        }
    }
}