using Microsoft.EntityFrameworkCore;
using Tmb.Shared.Data;

namespace Tmb.Api.Services;

public class AiService(AppDbContext dbContext, ILogger<AiService> logger)
{
    public async Task<string> ProcessQuestionAsync(string question)
    {
        var sqlQuery = GenerateSqlFromText(question);

        if (string.IsNullOrEmpty(sqlQuery))
        {
            return "Desculpe, não entendi a pergunta. Tente: 'Quantos pedidos pendentes?' ou 'Qual o valor total?'.";
        }

        try
        {
            var result = await GetDatabaseResultAsync(sqlQuery);
            return $"A resposta é: {result}";
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro ao executar query de IA");
            return "Não consegui calcular essa informação agora.";
        }
    }

    private string GenerateSqlFromText(string text)
    {
        var lowerText = text.ToLowerInvariant();
        
        if (lowerText.Contains("quantos") && lowerText.Contains("pendente"))
            return "SELECT COUNT(*) FROM \"Orders\" WHERE \"Status\" = 'Pending'";
        
        if (lowerText.Contains("quantos") && lowerText.Contains("processando"))
            return "SELECT COUNT(*) FROM \"Orders\" WHERE \"Status\" = 'Processing'";

        if (lowerText.Contains("quantos") && lowerText.Contains("finalizado"))
            return "SELECT COUNT(*) FROM \"Orders\" WHERE \"Status\" = 'Completed'";

        if (lowerText.Contains("valor total") || lowerText.Contains("total vendido"))
            return "SELECT COALESCE(SUM(\"Amount\"), 0) FROM \"Orders\"";

        if (lowerText.Contains("média"))
            return "SELECT COALESCE(AVG(\"Amount\"), 0) FROM \"Orders\"";

        if (lowerText.Contains("quantos pedidos") || lowerText.Contains("total de pedidos"))
            return "SELECT COUNT(*) FROM \"Orders\"";
        
        return string.Empty;
    }

    private async Task<string> GetDatabaseResultAsync(string sql)
    {
        using var command = dbContext.Database.GetDbConnection().CreateCommand();
        command.CommandText = sql;
        await dbContext.Database.OpenConnectionAsync();

        var result = await command.ExecuteScalarAsync();
        return result?.ToString() ?? "0";
    }
}