using System.ComponentModel.DataAnnotations;

namespace BillOneAPI.Models.Entities
{
    public class DatosFiscales
    {
        [Key]
        public int DatosFiscalesID { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string RegimenFiscal { get; set; } = string.Empty;
        public string UsuarioCFDI { get; set; } = string.Empty;
        public string Ciudad { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
        public string CP { get; set; } = string.Empty;
        public string TipoPago { get; set; } = string.Empty;
        public string CorreosEnvio { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        // FK - Relación con Usuario
        public int UsuarioID { get; set; }
        public Usuario Usuario { get; set; } = null!;
    }
}
