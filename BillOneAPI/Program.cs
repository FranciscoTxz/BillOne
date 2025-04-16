using Microsoft.EntityFrameworkCore;
using BillOneAPI.Models.Context;
using BillOneAPI.Services;
using QuestPDF.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
/*
// MAC DB
builder.Services.AddDbContext<BillOneContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("BillOneContextMAC"),
        new MySqlServerVersion(new Version(9, 0, 1))
    ));*/

// WINDOWS Db
builder.Services.AddDbContext<BillOneContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("BillOneContextWIN2"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("BillOneContextWIN2"))));;

builder.Services.AddControllers();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<PdfService>();

QuestPDF.Settings.License = LicenseType.Community;

// ???
builder.Services.AddEndpointsApiExplorer();

// ???
builder.Services.AddOpenApi();

// Background service
// ???

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthorization();
app.MapControllers();

// app.UseHttpsRedirection();

app.Run();