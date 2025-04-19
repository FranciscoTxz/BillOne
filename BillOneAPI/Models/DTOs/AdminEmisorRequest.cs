using System.ComponentModel.DataAnnotations;

namespace BillOneAPI.Models.DTOs;

public class AdminEmisorRequest
{
    [Required]
    public string CorreoAdmin { get; set; } = null!;
    [Required]
    public int EmisorId { get; set; }
}