using System;
using System.ComponentModel.DataAnnotations;

namespace BillOneAPI.Models.Entities
{
    public class HistorialFactura
    {
        [Key]
        public int HistorialID { get; set; }
        public string Accion { get; set; } = string.Empty;
        public DateTime Fecha { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // FK - Relación con Factura
        public int FacturaID { get; set; }
        public Factura Factura { get; set; } = null!;

        // FK - Relación con Usuario
        public int UsuarioID { get; set; }
        public Usuario Usuario { get; set; } = null!;
    }
}
