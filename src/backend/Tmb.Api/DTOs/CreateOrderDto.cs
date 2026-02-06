using System.ComponentModel.DataAnnotations;

namespace Tmb.Api.DTOs;

public record CreateOrderDto(
    [Required] string Customer,
    [Required] string Product,
    [Required] decimal Amount
);