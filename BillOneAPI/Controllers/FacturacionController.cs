using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BillOneAPI.Models.Entities;
using BillOneAPI.Models.Context;
using BillOneAPI.Models.DTOs;

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

    public FacturacionController(BillOneContext context, ILogger<FacturacionController> logger)
    {
        _context = context;
        _logger = logger;
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

            if (tokens.Count == 0)
            {
                return BadRequest(new { Error = "No se encontraron tokens válidos" });
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

            return Ok(facturas);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener historial");
            return StatusCode(500, new { Error = "Error interno del servidor" });
        }
    }
}