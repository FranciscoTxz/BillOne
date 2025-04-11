using System;
using System.ComponentModel.DataAnnotations;

namespace BillOneAPI.Models.Entities
{
    public class TokenE
    {
        [Key]
        public int TokenID { get; set; }

        public string Token { get; set; } = string.Empty; // El token en sí

        public string Concepto { get; set; } = string.Empty;

        public decimal Monto { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // FK - Factura (opcional al inicio)
        public int? FacturaID { get; set; }
        public Factura? Factura { get; set; }
    }
}
