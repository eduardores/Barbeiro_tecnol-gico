import { defineMcp } from "@lovable.dev/mcp-js";
import calcularDistribuicao from "./tools/calcular-distribuicao";
import simularMes from "./tools/simular-mes";
import metaParaLucro from "./tools/meta-para-lucro";

export default defineMcp({
  name: "fabio-barber-mcp",
  title: "Fabio Barber — Gestão da Barbearia",
  version: "0.1.0",
  instructions:
    "Ferramentas de cálculo financeiro para a barbearia Fabio Barber: distribuição de lucro em salário/investimento/reserva, simulação de mês e cálculo de meta de atendimentos para um lucro alvo. Todas as ferramentas são somente leitura e trabalham apenas com os números que o cliente MCP informar — não acessam agendamentos nem lançamentos salvos no navegador do dono.",
  tools: [calcularDistribuicao, simularMes, metaParaLucro],
});
