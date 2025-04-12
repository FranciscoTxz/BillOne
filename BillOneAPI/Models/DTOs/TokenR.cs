using System.ComponentModel.DataAnnotations;

namespace BillOneAPI.Models.DTOs;

public class TokenRequest
{
    [Required]
    public string Token { get; set; } = string.Empty;
}