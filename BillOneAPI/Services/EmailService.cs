using MailKit.Net.Smtp;
using MimeKit;
using BillOneAPI.Models.DTOs;

namespace BillOneAPI.Services;
public class EmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(EmailRequest request)
    {
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_config["SmtpSettings:From"]));
        email.To.Add(MailboxAddress.Parse(request.To));
        email.Subject = request.Subject;

        var bodyBuilder = new BodyBuilder
        {
            // HtmlBody = request.Body
            HtmlBody = "<p>Hola, buena tarde!</p><p>Le hacemos llegar las factuas.</p><p>Saludos!!!</p>"
        };

        // path de los files
        var file1Path = "Files/8831a11a-906a-46c7-8f3d-746c470af67a.pdf";
        var file2Path = "Files/8831a11a-906a-46c7-8f3d-746c470af67a.xml";

        if (File.Exists(file1Path))
            bodyBuilder.Attachments.Add(file1Path);
        else
            throw new FileNotFoundException($"File not found: {file1Path}");
    
        if (File.Exists(file2Path))
            bodyBuilder.Attachments.Add(file2Path);
        else
            throw new FileNotFoundException($"File not found: {file2Path}");

        email.Body = bodyBuilder.ToMessageBody();

        using var smtp = new SmtpClient();
        var portString = _config["SmtpSettings:Port"];
        if (!int.TryParse(portString, out var port))
        {
            throw new InvalidOperationException("Invalid SMTP port configuration.");
        }
        await smtp.ConnectAsync(_config["SmtpSettings:Host"], port, MailKit.Security.SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_config["SmtpSettings:Username"], _config["SmtpSettings:Password"]);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}
