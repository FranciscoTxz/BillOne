using System.ComponentModel.DataAnnotations;

namespace BillOneAPI.Models.DTOs;

public class AdminPostRequest
{
    [Required]
    public string Correo { get; set; } = null!;
    [Required]
    public string Nombre { get; set; } = null!;
    [Required]
    public string Contrasena { get; set; } = null!;
}


public class AdminGetRequest
{
    [Required]
    public string Correo { get; set; } = null!;
    [Required]
    public string Contrasena { get; set; } = null!;
}