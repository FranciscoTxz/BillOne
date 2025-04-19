using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BillOneAPI.Models.Entities;
using BillOneAPI.Models.Context;
using BillOneAPI.Models.DTOs;
using BillOneAPI.Metrics;

namespace BillOneAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DatosFiscalesController : ControllerBase
{
    private readonly BillOneContext _context;
    private readonly ILogger<DatosFiscalesController> _logger;

    // Inyección de dependencias
    public DatosFiscalesController(BillOneContext context, ILogger<DatosFiscalesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    //api/DatosFiscales
    [HttpPost]
    public async Task<IActionResult> GuardarDatosFiscales([FromBody] DatosFiscalesRequest request)
    {
        try
        {
            // Validación automática de los DataAnnotations
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Buscar usuario existente por RFC
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.RFC == request.RFC);

            // Si no existe, crear nuevo usuario
            if (usuario == null)
            {
                usuario = new Usuario
                {
                    RFC = request.RFC,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Usuarios.Add(usuario);
            }

            // Llamar a PAC para validar el RFC

            // Actualizar datos
            usuario.Nombre = request.Nombre;
            usuario.RegimenFiscal = request.RegimenFiscal;
            usuario.UsoCFDI = request.UsoCFDI;
            usuario.Ciudad = request.Ciudad;
            usuario.Estado = request.Estado;
            usuario.CP = request.CP;
            usuario.CorreosEnvio = request.Correo;
            usuario.TipoPago = request.TipoPago;

            // Guardar cambios en la base de datos
            await _context.SaveChangesAsync();

            return Ok(new { UsuarioID = usuario.UsuarioID });
        }
        catch (Exception ex)
        {
            // Loggear errores y devolver respuesta genérica
            _logger.LogError(ex, "Error al guardar datos fiscales");
            return StatusCode(500, new { Error = "Error interno del servidor" });
        }
    }

    // Endpoint para obtener datos fiscales por RFC
    [HttpGet("{rfc}")]
    public async Task<IActionResult> ObtenerDatosPorRFC(string rfc)
    {
        try
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.RFC == rfc);

            if (usuario == null)
            {
                return NotFound();
            }

            CustomMetrics.Increment("GetByRFC"); // Incrementar métrica
            return Ok(usuario);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener datos fiscales");
            return StatusCode(500, new { Error = "Error interno del servidor" });
        }
    }
}