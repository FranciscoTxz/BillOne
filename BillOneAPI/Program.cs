using Microsoft.EntityFrameworkCore;
using BillOneAPI.Models.Context;
using BillOneAPI.Services;
using System;
using System.Runtime.InteropServices;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
/* if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
{
    Console.WriteLine("Estamos en Windows");
    // WINDOWS Db
    builder.Services.AddDbContext<BillOneContext>(options =>
        options.UseMySql(builder.Configuration.GetConnectionString("BillOneContextWIN2"),
            ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("BillOneContextWIN2"))));
}
else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
{
    Console.WriteLine("Estamos en macOS");
    // MAC DB
    builder.Services.AddDbContext<BillOneContext>(options =>
        options.UseMySql(builder.Configuration.GetConnectionString("BillOneContextMAC"),
            new MySqlServerVersion(new Version(9, 0, 1))
        ));
}
else
{
    Console.WriteLine("Otro sistema operativo");
} */

// DB AWS Connection
builder.Services.AddDbContext<BillOneContext>(options =>
        options.UseMySql(builder.Configuration.GetConnectionString("BillOneAWS"),
            new MySqlServerVersion(new Version(8, 4, 4))
            ));

builder.Services.AddControllers();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<PdfService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddHttpClient("Facturama"); // Registra un HttpClient con nombre
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseRouting();
app.UseCors(builder => builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());
app.UseAuthorization();
app.MapControllers();

// app.UseHttpsRedirection();

app.Run();