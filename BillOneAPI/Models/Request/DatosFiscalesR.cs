using System.ComponentModel.DataAnnotations;

namespace BillOneAPI.Models.Request;

// Modelo de request para los datos fiscales
public class DatosFiscalesRequest
{
    [Required]
    public string RFC { get; set; } = string.Empty;

    [Required]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    public string RegimenFiscal { get; set; } = string.Empty;

    [Required]
    public string UsoCFDI { get; set; } = string.Empty;

    [Required]
    public string Ciudad { get; set; } = string.Empty;

    [Required]
    public string Estado { get; set; } = string.Empty;

    [Required]
    public string CP { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Correo { get; set; } = string.Empty;

    [Required]
    public string TipoPago { get; set; } = string.Empty;
}