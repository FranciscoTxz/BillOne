using Microsoft.EntityFrameworkCore;
using BillOneAPI.Models.Entities;
using System.Text.Json;

namespace BillOneAPI.Models.Context;
public class BillOneContext : DbContext
{
    public BillOneContext(DbContextOptions<BillOneContext> options)
        : base(options) { }

    public DbSet<Usuario> Usuarios { get; set; } = null!;
    public DbSet<Factura> Facturas { get; set; } = null!;
    public DbSet<HistorialFactura> HistorialFacturas { get; set; } = null!;
    public DbSet<TokenE> Tokens { get; set; } = null!;
    public DbSet<Emisor> Emisores { get; set; } = null!;
    public DbSet<Admin> Admins { get; set; } = null!;
    public DbSet<AdminEmisor> AdminEmisores { get; set; } = null!;
     protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configurar la tabla intermedia
        modelBuilder.Entity<AdminEmisor>()
            .HasKey(ae => new { ae.AdminCorreo, ae.EmisorId });

        modelBuilder.Entity<AdminEmisor>()
            .HasOne(ae => ae.Admin)
            .WithMany(a => a.AdminEmisores)
            .HasForeignKey(ae => ae.AdminCorreo);

        modelBuilder.Entity<AdminEmisor>()
            .HasOne(ae => ae.Emisor)
            .WithMany(e => e.AdminEmisores)
            .HasForeignKey(ae => ae.EmisorId);

        modelBuilder.Entity<Admin>()
        .Property(a => a.Metricas)
        .HasConversion(
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
            v => JsonSerializer.Deserialize<Dictionary<string, Dictionary<string, int>>>(v, (JsonSerializerOptions)null)!
        );

        base.OnModelCreating(modelBuilder);
    }
}