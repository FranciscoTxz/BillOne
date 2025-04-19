using System.ComponentModel.DataAnnotations;

namespace BillOneAPI.Models.DTOs;

public class FacturaPreviewRequest
{
    [Required]
    public int UsuarioID { get; set; }
    
    [Required]
    public List<int> TokensIDs { get; set; } = new List<int>();
    
    [Required]
    public string Servicio { get; set; } = string.Empty;
}