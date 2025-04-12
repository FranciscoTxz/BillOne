using System.ComponentModel.DataAnnotations;

namespace BillOneAPI.Models.DTOs;

public class ValidacionRequest
    {
        [Required]
        public string RFC { get; set; } = string.Empty;

        [Required]
        public string Token { get; set; } = string.Empty;
    }