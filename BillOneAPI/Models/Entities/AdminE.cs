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

    public ICollection<AdminEmisor> AdminEmisores { get; set; } = new List<AdminEmisor>();
}