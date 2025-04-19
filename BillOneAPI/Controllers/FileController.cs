using Microsoft.AspNetCore.Mvc;
using BillOneAPI.Models.DTOs;
using BillOneAPI.Services;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;

namespace BillOneAPI.Controllers;

[ApiController]
[Route("tests/[controller]")] //test/Email
public class FileController : ControllerBase
{
    private readonly EmailService _emailService;

    public FileController(EmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
    {
        try
        {
            await _emailService.SendEmailAsync(request);
            return Ok("Correo enviado correctamente.");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error al enviar el correo: {ex.Message}");
        }
    }
}
/*
    [HttpGet("generar")]
    public IActionResult GenerarPdf([FromBody] PdfFileRequest request)
    {
        var documento = new PdfService { Plantilla = request.Plantilla, Titulo = request.Titulo };

        byte[] pdfBytes = documento.GeneratePdf();

        return File(pdfBytes, "application/pdf", "documento.pdf");
    }
}
*/
