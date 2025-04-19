using System.ComponentModel.DataAnnotations;

namespace BillOneAPI.Models.Entities;

public class Emisor
{
    [Key]
    public int EmisorID { get; set; }
    public string RFC { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string RegimenFiscal { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string CodigoPostal { get; set; } = string.Empty;
    public string Ciudad { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public ICollection<AdminEmisor> AdminEmisores { get; set; } = new List<AdminEmisor>();
}