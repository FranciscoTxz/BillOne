using BillOneAPI.Metrics;
using Microsoft.AspNetCore.Mvc;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

namespace BillOneAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AdminController : ControllerBase
{
    private readonly ILogger<AdminController> _logger;

    public AdminController(ILogger<AdminController> logger)
    {
        _logger = logger;
    }

    // Get : /api/v1/control
    [HttpGet ("metrics")]
    public IActionResult GetMetrics()
    {
        var metrics = CustomMetrics.GetAllMetrics();
        return Ok(metrics);
    }
}