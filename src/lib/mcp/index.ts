import { defineMcp, auth } from "@lovable.dev/mcp-js";
import calcularDistribuicao from "./tools/calcular-distribuicao";
import simularMes from "./tools/simular-mes";
import metaParaLucro from "./tools/meta-para-lucro";

const supabaseUrl =
  process.env['SUPABASE_URL'] ?? import.meta.env.VITE_SUPABASE_URL ?? "";

export default defineMcp({
  name: "fabio-barber-mcp",
  title: "Fabio Barber — Gestão da Barbearia",
  version: "0.1.0",
  auth: auth.oauth.issuer({
    issuer: `${supabaseUrl}/auth/v1`,
    acceptedAudiences: "authenticated",
    resourceName: "Fabio Barber — Gestão da Barbearia",
  }),
  instructions:
    "Ferramentas de cálculo financeiro para a barbearia Fabio Barber: distribuição de lucro em salário/investimento/reserva, simulação de mês e cálculo de meta de atendimentos para um lucro alvo. Todas as ferramentas são somente leitura e trabalham apenas com os números que o cliente MCP informar — não acessam agendamentos nem lançamentos salvos no banco.",
  tools: [calcularDistribuicao, simularMes, metaParaLucro],
});

