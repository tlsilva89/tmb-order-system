using Microsoft.EntityFrameworkCore;
using Tmb.Shared.Data;
using Tmb.Shared.Models;

namespace Tmb.Api.Tests;

public class OrderTests
{
    [Fact]
    public async Task CreateOrder_ShouldSaveToDatabase_WithPendingStatus()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "TmbTestDb")
            .Options;

        var orderId = Guid.NewGuid();

        using (var context = new AppDbContext(options))
        {
            var order = new Order
            {
                Id = orderId,
                Customer = "Teste Unitário",
                Product = "Produto Teste",
                Amount = 99.90m,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            context.Orders.Add(order);
            await context.SaveChangesAsync();
        }

        using (var context = new AppDbContext(options))
        {
            var savedOrder = await context.Orders.FirstOrDefaultAsync(o => o.Id == orderId);

            Assert.NotNull(savedOrder);
            Assert.Equal("Teste Unitário", savedOrder.Customer);
            Assert.Equal(99.90m, savedOrder.Amount);
            Assert.Equal(OrderStatus.Pending, savedOrder.Status);
        }
    }
}