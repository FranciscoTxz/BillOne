using System.ComponentModel.DataAnnotations;

namespace BillOneAPI.Models.Entities
{
    public class Usuario
    {
        [Key]
        public int UsuarioID { get; set; }
        public string RFC { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relaciones
        public DatosFiscales? DatosFiscales { get; set; }
        public ICollection<Factura> Facturas { get; set; } = new List<Factura>();
        public ICollection<HistorialFactura> HistorialFacturas { get; set; } = new List<HistorialFactura>();

    }
}
