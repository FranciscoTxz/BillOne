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
        var emisorExistente = await _context.Emisores.FirstOrDefaultAsync();
        if (emisorExistente != null)
        {
            _context.Emisores.Remove(emisorExistente);
        }

        _context.Emisores.Add(emisor);
        await _context.SaveChangesAsync();

        return Ok(emisor);
    }

    [HttpGet]
    public async Task<IActionResult> ObtenerDatosEmisor()
    {
        var emisor = await _context.Emisores.FirstOrDefaultAsync();
        if (emisor == null)
        {
            return NotFound();
        }

        return Ok(emisor);
    }
}