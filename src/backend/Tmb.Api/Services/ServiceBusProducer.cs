using System.Text.Json;
using Azure.Messaging.ServiceBus;
using Tmb.Shared.DTOs;

namespace Tmb.Api.Services;

public class ServiceBusProducer(IConfiguration configuration, ILogger<ServiceBusProducer> logger)
{
    public async Task SendOrderCreatedAsync(OrderCreatedEvent orderEvent)
    {
        var connectionString = configuration.GetConnectionString("AzureServiceBus");
        var queueName = configuration["ServiceBus:QueueName"];

        if (string.IsNullOrEmpty(connectionString) || string.IsNullOrEmpty(queueName))
        {
            logger.LogWarning("Azure Service Bus não configurado (MOCK MODE). Mensagem não enviada.");
            return;
        }

        await using var client = new ServiceBusClient(connectionString);
        var sender = client.CreateSender(queueName);

        var json = JsonSerializer.Serialize(orderEvent);
        var message = new ServiceBusMessage(json)
        {
            CorrelationId = orderEvent.Id.ToString(),
            Subject = "OrderCreated"
        };

        message.ApplicationProperties.Add("EventType", "OrderCreated");
        message.ApplicationProperties.Add("Version", "1.0");

        try
        {
            await sender.SendMessageAsync(message);
            logger.LogInformation($"Evento enviado para fila: {orderEvent.Id}");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro ao enviar mensagem para o Service Bus");
            throw;
        }
    }
}