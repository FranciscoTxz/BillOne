using BillOneAPI.Metrics;
using BillOneAPI.Models.Context;
using BillOneAPI.Models.DTOs;
using BillOneAPI.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

namespace BillOneAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AdminController : ControllerBase
{
    private readonly BillOneContext _context;

    public AdminController(BillOneContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CrearAdmin([FromBody] AdminPostRequest dto)
    {
        if (await _context.Admins.AnyAsync(a => a.Correo == dto.Correo))
        {
            return Conflict("Ya existe un admin con ese correo.");
        }

        var admin = new Admin
        {
            Correo = dto.Correo,
            Nombre = dto.Nombre,
            Contrasena = HashHelper.ToSha256(dto.Contrasena)
        };

        try
        {
            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            return BadRequest($"Error al crear el admin: {ex.Message}");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error inesperado: {ex.Message}");
        }

        return Ok(new { message = "Admin creado exitosamente" });
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Admin>>> GetAdmin([FromBody] AdminGetRequest dto)
    {
        var admin = await _context.Admins
            .FirstOrDefaultAsync(a => a.Correo == dto.Correo && a.Contrasena == HashHelper.ToSha256(dto.Contrasena));

        if (admin == null)
        {
            return NotFound("Admin no encontrado");
        }

        return Ok(admin);
    }

    [HttpPost ("vincular")]
    public async Task<IActionResult> VincularAdminEmisor([FromBody] AdminEmisorRequest dto)
    {
        var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Correo == dto.CorreoAdmin);
        if (admin == null)
        {
            return NotFound("Admin no encontrado");
        }

        var emisor = await _context.Emisores.FirstOrDefaultAsync(e => e.EmisorID == dto.EmisorId);
        if (emisor == null)
        {
            return NotFound("Emisor no encontrado");
        }

        var adminEmisor = new AdminEmisor
        {
            AdminCorreo = dto.CorreoAdmin,
            EmisorId = dto.EmisorId
        };

        try
        {
            _context.AdminEmisores.Add(adminEmisor);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            return BadRequest($"Error al vincular admin y emisor: {ex.Message}");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error inesperado: {ex.Message}");
        }

        return Ok(new { message = "Admin y Emisor vinculados exitosamente" });
    }

    // Get : /api/v1/control
    [HttpGet("metrics")]
    public IActionResult GetMetrics()
    {
        var metrics = CustomMetrics.GetAllMetrics();
        return Ok(metrics);
    }
}