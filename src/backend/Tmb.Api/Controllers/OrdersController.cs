using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tmb.Api.DTOs;
using Tmb.Api.Services;
using Tmb.Shared.Data;
using Tmb.Shared.DTOs;
using Tmb.Shared.Models;

namespace Tmb.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController(AppDbContext context, ServiceBusProducer producer) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
    {
        var order = new Order
        {
            Id = Guid.NewGuid(),
            Customer = dto.Customer,
            Product = dto.Product,
            Amount = dto.Amount,
            Status = OrderStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        context.Orders.Add(order);
        await context.SaveChangesAsync();

        var eventMessage = new OrderCreatedEvent
        {
            Id = order.Id,
            CreatedAt = order.CreatedAt
        };

        await producer.SendOrderCreatedAsync(eventMessage);

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var orders = await context.Orders
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
            
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var order = await context.Orders.FindAsync(id);
        if (order == null) return NotFound();
        return Ok(order);
    }
}