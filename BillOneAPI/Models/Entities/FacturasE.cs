using System.ComponentModel.DataAnnotations;

namespace BillOneAPI.Models.Entities
{
    public class Factura
    {
        [Key]
        public int FacturaID { get; set; }
        public decimal Total { get; set; }
        public string Servicio { get; set; } = string.Empty;
        public string PDFPath { get; set; } = string.Empty;
        public string XMLPath { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // FK - Relación con Usuario
        public int UsuarioID { get; set; }
        public Usuario Usuario { get; set; } = null!;

        // Relación con HistorialFacturas
        public ICollection<HistorialFactura> HistorialFacturas { get; set; } = new List<HistorialFactura>();
    }
}
