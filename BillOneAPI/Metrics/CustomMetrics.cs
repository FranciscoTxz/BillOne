using System.Collections.Concurrent;
using BillOneAPI.Models.Context;
using Microsoft.EntityFrameworkCore;

namespace BillOneAPI.Metrics;

public class CustomMetrics
{
    private readonly BillOneContext _context;

    public CustomMetrics(BillOneContext context)
    {
        _context = context;
    }

    public async Task<bool> ActualizarMetrciasAsync(string correoAdmin, int emisorId, string concepto)
    {
        var admin = await _context.Admins.FindAsync(correoAdmin);

        if (admin == null)
            return false;

        var emisor = await _context.Emisores.FindAsync(emisorId);

        if (emisor == null)
            return false;

        var adminEmisor = await _context.AdminEmisores.FirstOrDefaultAsync(ae => ae.AdminCorreo == correoAdmin && ae.EmisorId == emisorId);

        if (adminEmisor == null)
            return false;

        if (!admin.Metricas.ContainsKey(emisor.Nombre))
            admin.Metricas[emisor.Nombre] = new Dictionary<string, int>();

        if (!admin.Metricas[emisor.Nombre].ContainsKey(concepto))
            admin.Metricas[emisor.Nombre][concepto] = 0;

        admin.Metricas[emisor.Nombre][concepto]++;

        await _context.SaveChangesAsync();
        return true;
    }
}

