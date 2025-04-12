using Microsoft.AspNetCore.Mvc;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

namespace BillOneAPI.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class ControlController : ControllerBase
{
    private readonly ILogger<ControlController> _logger;

    public ControlController(ILogger<ControlController> logger)
    {
        _logger = logger;
    }

    // Get : /api/v1/control
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("Hello from V1");
    }
}