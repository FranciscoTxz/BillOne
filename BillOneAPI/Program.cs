var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
/* builder.Services.AddDbContext<MovieContext>(options =>
                    options.UseSqlServer(builder.Configuration.GetConnectionString("MovieContext"))); */

builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();

// ???
builder.Services.AddOpenApi();

// Background service
// ???

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthorization();
app.MapControllers();

// app.UseHttpsRedirection();

app.Run();