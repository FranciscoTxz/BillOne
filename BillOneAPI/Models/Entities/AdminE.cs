using System.ComponentModel.DataAnnotations;

namespace BillOneAPI.Models.Entities;

public class Admin
{
    [Key]
    [EmailAddress]
    public string Correo { get; set; } = null!;
    
    [Required]
    public string Nombre { get; set; } = null!;

    [Required]
    public string Contrasena { get; set; } = null!;
    public Dictionary<string, Dictionary<string, int>> Metricas { get; set; } = new Dictionary<string, Dictionary<string, int>>();

    public ICollection<AdminEmisor> AdminEmisores { get; set; } = new List<AdminEmisor>();
}