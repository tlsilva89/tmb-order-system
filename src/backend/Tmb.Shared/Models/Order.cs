namespace Tmb.Shared.Models;

public enum OrderStatus
{
    Pending,
    Processing,
    Completed
}

public class Order
{
    public Guid Id { get; set; }
    public string Customer { get; set; } = string.Empty;
    public string Product { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}