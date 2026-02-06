using Microsoft.EntityFrameworkCore;
using Tmb.Shared.Data;
using Tmb.Worker;

var builder = Host.CreateApplicationBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Host=localhost;Port=5433;Database=tmb_orders_db;Username=admin;Password=adminpassword";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();