using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

[ApiController]
[Route("api/[controller]")]
public class FacturamaController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly string _apiUrl;
    private readonly IWebHostEnvironment _env;
    private readonly string _filesDirectory;

    public FacturamaController(IHttpClientFactory httpClientFactory, IConfiguration configuration, IWebHostEnvironment env)
    {
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
}