using System.ComponentModel.DataAnnotations;

namespace BillOneAPI.Models.Request;

public class TokenRequest
{
    [Required]
    public string Token { get; set; } = string.Empty;
}