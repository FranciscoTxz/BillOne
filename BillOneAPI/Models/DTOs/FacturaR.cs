using System.ComponentModel.DataAnnotations;

namespace BillOneAPI.Models.DTOs;

/// <summary>
/// Modelo de request para generar una factura
/// </summary>
public class FacturaRequest
    {
        [Required(ErrorMessage = "El ID de usuario es obligatorio")]
        public int UsuarioID { get; set; }

        [Required(ErrorMessage = "Se requiere al menos un token")]
        [MinLength(1, ErrorMessage = "Debe incluir al menos un token")]
        public List<int> TokensIDs { get; set; } = new List<int>();

        [Required(ErrorMessage = "El tipo de servicio es obligatorio")]
        public string Servicio { get; set; } = string.Empty;
    }