import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "simular_mes",
  title: "Simular mês de trabalho",
  description:
    "Projeta o faturamento e a distribuição de um mês a partir do ticket médio, número de atendimentos por dia, dias trabalhados e despesas fixas.",
  inputSchema: {
    ticket_medio: z.number().positive().describe("Valor médio por atendimento (R$)."),
    atendimentos_por_dia: z.number().positive().describe("Número médio de atendimentos por dia."),
    dias_trabalhados: z.number().int().positive().max(31).describe("Dias trabalhados no mês."),
    despesas_fixas: z.number().nonnegative().default(0).describe("Total de despesas fixas do mês (R$)."),
    pct_salario: z.number().min(0).max(100).default(50),
    pct_investimento: z.number().min(0).max(100).default(30),
    pct_reserva: z.number().min(0).max(100).default(20),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({
    ticket_medio, atendimentos_por_dia, dias_trabalhados, despesas_fixas,
    pct_salario, pct_investimento, pct_reserva,
  }) => {
    const entradas = +(ticket_medio * atendimentos_por_dia * dias_trabalhados).toFixed(2);
    const lucro = entradas - despesas_fixas;
    const base = Math.max(lucro, 0);
    const salario = +(base * (pct_salario / 100)).toFixed(2);
    const investimento = +(base * (pct_investimento / 100)).toFixed(2);
    const reserva = +(base * (pct_reserva / 100)).toFixed(2);
    const total_atendimentos = atendimentos_por_dia * dias_trabalhados;
    const texto = [
      `Simulação do mês`,
      `Atendimentos: ${total_atendimentos} (${atendimentos_por_dia}/dia × ${dias_trabalhados} dias)`,
      `Faturamento: R$ ${entradas.toFixed(2)}`,
      `Despesas:    R$ ${despesas_fixas.toFixed(2)}`,
      `Lucro:       R$ ${lucro.toFixed(2)}`,
      `— Salário:      R$ ${salario.toFixed(2)}`,
      `— Investimento: R$ ${investimento.toFixed(2)}`,
      `— Reserva:      R$ ${reserva.toFixed(2)}`,
    ].join("\n");
    return {
      content: [{ type: "text", text: texto }],
      structuredContent: {
        total_atendimentos, entradas, despesas: despesas_fixas, lucro,
        salario, investimento, reserva,
      },
    };
  },
});
