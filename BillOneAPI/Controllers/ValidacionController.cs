using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BillOneAPI.Models.Context;
using System.Text.RegularExpressions;
using BillOneAPI.Models.DTOs;

namespace BillOneAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ValidacionController : ControllerBase
{
    private readonly BillOneContext _context;
    private readonly ILogger<ValidacionController> _logger;

    public ValidacionController(BillOneContext context, ILogger<ValidacionController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("validar")]
    public async Task<IActionResult> ValidarToken([FromBody] ValidacionRequest request)
    {
        try
        {
            // Validar formato del RFC
            if (!EsRfcValido(request.RFC))
            {
                _logger.LogWarning($"RFC inválido: {request.RFC}");
                return BadRequest(new { Error = "RFC inválido" });
            }

            // Buscar token que no haya sido facturado aún
            var tokenValido = await _context.Tokens
                .FirstOrDefaultAsync(t => t.Token == request.Token && t.FacturaID == null);

            if (tokenValido == null)
            {
                _logger.LogWarning($"Token no encontrado o ya facturado: {request.Token}");
                return NotFound(new { Error = "Token no encontrado o ya facturado" });
            }

            // Devolver datos del token válido
            return Ok(new
            {
                Valido = true,
                TokenID = tokenValido.TokenID,
                Concepto = tokenValido.Concepto,
                Monto = tokenValido.Monto,
                FechaCompra = tokenValido.CreatedAt.ToString("yyyy-MM-dd")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al validar token");
            return StatusCode(500, new { Error = "Error interno del servidor" });
        }
    }

    [HttpPost("agregar-token")]
    public async Task<IActionResult> AgregarToken([FromBody] TokenRequest request)
    {
        try
        {
            var tokenExistente = await _context.Tokens
                .FirstOrDefaultAsync(t => t.Token == request.Token && t.FacturaID == null);

            if (tokenExistente == null)
            {
                return NotFound(new { Error = "Token no válido o ya utilizado" });
            }

            return Ok(new
            {
                TokenID = tokenExistente.TokenID,
                Concepto = tokenExistente.Concepto,
                Monto = tokenExistente.Monto
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al agregar token");
            return StatusCode(500, new { Error = "Error interno del servidor" });
        }
    }

    private bool EsRfcValido(string rfc)
    {
        return !string.IsNullOrWhiteSpace(rfc) &&
               (rfc.Length == 12 || rfc.Length == 13) &&
               Regex.IsMatch(rfc, @"^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{2,3}$");
    }
}