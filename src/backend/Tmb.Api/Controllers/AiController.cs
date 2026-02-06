using Microsoft.AspNetCore.Mvc;
using Tmb.Api.DTOs;
using Tmb.Api.Services;

namespace Tmb.Api.Controllers;

[ApiController]
[Route("api/ai")]
public class AiController(AiService aiService) : ControllerBase
{
    [HttpPost("ask")]
    public async Task<IActionResult> Ask([FromBody] AiQuestionDto question)
    {
        if (string.IsNullOrWhiteSpace(question.Text))
            return BadRequest("A pergunta não pode estar vazia.");

        var answer = await aiService.ProcessQuestionAsync(question.Text);
        return Ok(new { answer });
    }
}