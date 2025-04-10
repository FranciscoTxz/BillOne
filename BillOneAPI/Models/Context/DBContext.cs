using Microsoft.EntityFrameworkCore;
using BillOneAPI.Models.Entities;

namespace BillOneAPI.Models.Context;
public class BillOneContext : DbContext
{
    public BillOneContext(DbContextOptions<BillOneContext> options)
        : base(options) { }

    public DbSet<Usuario> Usuarios { get; set; } = null!;
    public DbSet<Factura> Facturas { get; set; } = null!;
    public DbSet<HistorialFactura> HistorialFacturas { get; set; } = null!;
    public DbSet<DatosFiscales> DatosFiscales { get; set; } = null!;
}