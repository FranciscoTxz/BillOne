using System.ComponentModel.DataAnnotations;

namespace BillOneAPI.Models.DTOs;

/// <summary>
/// Modelo de request para generar una factura
/// </summary>
public class PdfFileRequest
    {
        [Required(ErrorMessage = "El numero de plantilla es obligatorio")]
        public int Plantilla { get; set; }

        [Required(ErrorMessage = "Se requiere un titulo")]
        public required string Titulo { get; set; }
    }