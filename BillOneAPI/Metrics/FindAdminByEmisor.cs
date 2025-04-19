using BillOneAPI.Models.Context;
using Microsoft.EntityFrameworkCore;

namespace BillOneAPI.Metrics;

public class FindAdminByEmisor
{
    private readonly BillOneContext _context;

    public FindAdminByEmisor(BillOneContext context)
    {
        _context = context;
    }

    public async Task<string?> GetAdminByEmisorId(int emisorId)
    {
        var adminEmisor = await _context.AdminEmisores
            .FirstOrDefaultAsync(ae => ae.EmisorId == emisorId);

        if (adminEmisor == null)
            return null;

        return adminEmisor.AdminCorreo;
    }
}