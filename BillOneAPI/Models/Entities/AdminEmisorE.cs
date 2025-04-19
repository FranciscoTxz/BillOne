namespace BillOneAPI.Models.Entities;
public class AdminEmisor
{
    public string AdminCorreo { get; set; } = null!;
    public Admin Admin { get; set; } = null!;

    public int EmisorId { get; set; }
    public Emisor Emisor { get; set; } = null!;
}
