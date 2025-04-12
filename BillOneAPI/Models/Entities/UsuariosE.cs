using System.ComponentModel.DataAnnotations;

namespace BillOneAPI.Models.Entities;
public class Usuario
{
    [Key]
    public int UsuarioID { get; set; }
    public string RFC { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string RegimenFiscal { get; set; } = string.Empty;
    public string UsoCFDI { get; set; } = string.Empty;
    public string Ciudad { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string CP { get; set; } = string.Empty;
    public string TipoPago { get; set; } = string.Empty;
    public string CorreosEnvio { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relaciones
    public ICollection<Factura> Facturas { get; set; } = new List<Factura>();
    public ICollection<HistorialFactura> HistorialFacturas { get; set; } = new List<HistorialFactura>();

}
