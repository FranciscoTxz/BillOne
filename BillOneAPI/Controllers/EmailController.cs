using Microsoft.AspNetCore.Mvc;
using BillOneAPI.Models.Request;
using BillOneAPI.Services;

namespace BillOneAPI.Controllers;

[ApiController]
[Route("tests/[controller]")] //test/Email
public class EmailController : ControllerBase
{
    private readonly EmailService _emailService;

    public EmailController(EmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
    {
        await _emailService.SendEmailAsync(request);
        return Ok("Correo enviado correctamente.");
    }
}

