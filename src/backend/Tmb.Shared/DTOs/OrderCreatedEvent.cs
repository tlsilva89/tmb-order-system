namespace Tmb.Shared.DTOs;

public class OrderCreatedEvent
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
}