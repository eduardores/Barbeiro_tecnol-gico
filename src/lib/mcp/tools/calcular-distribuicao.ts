import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "calcular_distribuicao",
  title: "Calcular distribuição de lucro",
  description:
    "Calcula, a partir do faturamento e das despesas do mês, quanto vai para salário, investimento e reserva de emergência segundo os percentuais informados.",
  inputSchema: {
    entradas: z.number().nonnegative().describe("Total de entradas no mês (R$)."),
    saidas: z.number().nonnegative().describe("Total de despesas no mês (R$)."),
    pct_salario: z.number().min(0).max(100).default(50).describe("% do lucro para salário."),
    pct_investimento: z.number().min(0).max(100).default(30).describe("% do lucro para investimento."),
    pct_reserva: z.number().min(0).max(100).default(20).describe("% do lucro para reserva."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ entradas, saidas, pct_salario, pct_investimento, pct_reserva }) => {
    const lucro = entradas - saidas;
    const base = Math.max(lucro, 0);
    const salario = +(base * (pct_salario / 100)).toFixed(2);
    const investimento = +(base * (pct_investimento / 100)).toFixed(2);
    const reserva = +(base * (pct_reserva / 100)).toFixed(2);
    const soma_pct = pct_salario + pct_investimento + pct_reserva;
    const resumo = [
      `Entradas: R$ ${entradas.toFixed(2)}`,
      `Saídas:   R$ ${saidas.toFixed(2)}`,
      `Lucro:    R$ ${lucro.toFixed(2)}`,
      `— Salário (${pct_salario}%):      R$ ${salario.toFixed(2)}`,
      `— Investimento (${pct_investimento}%): R$ ${investimento.toFixed(2)}`,
      `— Reserva (${pct_reserva}%):       R$ ${reserva.toFixed(2)}`,
      soma_pct !== 100 ? `Atenção: os percentuais somam ${soma_pct}% (ideal 100%).` : "",
    ].filter(Boolean).join("\n");
    return {
      content: [{ type: "text", text: resumo }],
      structuredContent: { entradas, saidas, lucro, salario, investimento, reserva, soma_pct },
    };
  },
});
