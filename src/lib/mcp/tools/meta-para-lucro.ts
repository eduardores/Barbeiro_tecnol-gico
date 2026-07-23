import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "meta_para_lucro",
  title: "Meta de atendimentos para um lucro alvo",
  description:
    "Dado um lucro-alvo mensal, ticket médio e despesas fixas, calcula quantos atendimentos e qual faturamento são necessários.",
  inputSchema: {
    lucro_alvo: z.number().positive().describe("Lucro desejado no mês (R$)."),
    ticket_medio: z.number().positive().describe("Valor médio por atendimento (R$)."),
    despesas_fixas: z.number().nonnegative().default(0).describe("Despesas fixas do mês (R$)."),
    dias_trabalhados: z.number().int().positive().max(31).default(22).describe("Dias trabalhados no mês."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ lucro_alvo, ticket_medio, despesas_fixas, dias_trabalhados }) => {
    const faturamento_necessario = lucro_alvo + despesas_fixas;
    const atendimentos_mes = Math.ceil(faturamento_necessario / ticket_medio);
    const atendimentos_dia = +(atendimentos_mes / dias_trabalhados).toFixed(2);
    const texto = [
      `Para lucrar R$ ${lucro_alvo.toFixed(2)} no mês:`,
      `Faturamento necessário: R$ ${faturamento_necessario.toFixed(2)}`,
      `Atendimentos no mês: ${atendimentos_mes}`,
      `Média por dia (${dias_trabalhados} dias): ${atendimentos_dia}`,
    ].join("\n");
    return {
      content: [{ type: "text", text: texto }],
      structuredContent: { faturamento_necessario, atendimentos_mes, atendimentos_dia },
    };
  },
});
