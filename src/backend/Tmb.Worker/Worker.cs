using System.Text.Json;
using Azure.Messaging.ServiceBus;
using Tmb.Shared.Data;
using Tmb.Shared.DTOs;
using Tmb.Shared.Models;

namespace Tmb.Worker;

public class Worker(IServiceProvider serviceProvider, IConfiguration configuration, ILogger<Worker> logger) : BackgroundService
{
    private ServiceBusClient? _client;
    private ServiceBusProcessor? _processor;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var connectionString = configuration.GetConnectionString("AzureServiceBus");
        var queueName = configuration["ServiceBus:QueueName"];

        if (string.IsNullOrEmpty(connectionString) || string.IsNullOrEmpty(queueName))
        {
            logger.LogWarning("Azure Service Bus não configurado. O Worker ficará ocioso (MOCK MODE).");
            return;
        }

        _client = new ServiceBusClient(connectionString);
        _processor = _client.CreateProcessor(queueName, new ServiceBusProcessorOptions());

        _processor.ProcessMessageAsync += MessageHandler;
        _processor.ProcessErrorAsync += ErrorHandler;

        await _processor.StartProcessingAsync(stoppingToken);
        
        var tcs = new TaskCompletionSource();
        using var reg = stoppingToken.Register(() => tcs.SetResult());
        await tcs.Task;

        await _processor.StopProcessingAsync(stoppingToken);
    }

    private async Task MessageHandler(ProcessMessageEventArgs args)
    {
        var body = args.Message.Body.ToString();
        var orderEvent = JsonSerializer.Deserialize<OrderCreatedEvent>(body);

        if (orderEvent != null)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var order = await db.Orders.FindAsync(orderEvent.Id);

                if (order != null)
                {
                    if (order.Status != OrderStatus.Pending)
                    {
                        logger.LogInformation($"Pedido {order.Id} ignorado (Status atual: {order.Status}).");
                        await args.CompleteMessageAsync(args.Message);
                        return;
                    }

                    logger.LogInformation($"Processando pedido: {orderEvent.Id}");

                    order.Status = OrderStatus.Processing;
                    await db.SaveChangesAsync();
                    logger.LogInformation($"Pedido {order.Id} -> Processando");

                    await Task.Delay(5000); 

                    order.Status = OrderStatus.Completed;
                    await db.SaveChangesAsync();
                    logger.LogInformation($"Pedido {order.Id} -> Finalizado");
                }
            }
        }

        await args.CompleteMessageAsync(args.Message);
    }

    private Task ErrorHandler(ProcessErrorEventArgs args)
    {
        logger.LogError(args.Exception, "Erro no ServiceBus");
        return Task.CompletedTask;
    }
}