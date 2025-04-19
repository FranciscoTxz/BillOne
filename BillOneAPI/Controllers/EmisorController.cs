using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BillOneAPI.Models.Entities;
using BillOneAPI.Models.Context;

namespace BillOneAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmisorController : ControllerBase
{
    private readonly BillOneContext _context;

    public EmisorController(BillOneContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> ConfigurarEmisor([FromBody] Emisor emisor)
    {
        // Eliminar cualquier emisor existente (solo permitimos uno)
        /* var emisorExistente = await _context.Emisores.FirstOrDefaultAsync();
        if (emisorExistente != null)
        {
            _context.Emisores.Remove(emisorExistente);
        } */

        try
        {
            _context.Emisores.Add(emisor);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            return BadRequest($"Error al guardar el emisor: {ex.Message}");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error inesperado: {ex.Message}");
        }
        return Ok(emisor);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> ObtenerEmisor(int id)
    {
        var emisor = await _context.Emisores.FindAsync(id);
        if (emisor == null)
        {
            return NotFound();
        }

        return Ok(emisor);
    }

    [HttpGet]
    public async Task<IActionResult> ObtenerDatosEmisor()
    {
        var emisores = await _context.Emisores.ToListAsync();
        if (emisores == null || !emisores.Any())
        {
            return NotFound();
        }

        return Ok(emisores);
    }
}