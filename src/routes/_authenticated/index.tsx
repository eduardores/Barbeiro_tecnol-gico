import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app-shell";
import { useLocalStorage, defaultConfig, type Agendamento, type Movimento, type Config } from "@/lib/storage";
import { brl } from "@/lib/format";
import { exportarRelatorioMensal } from "@/lib/pdf-report";
import { ArrowDownRight, ArrowUpRight, CalendarClock, Download, PiggyBank, TrendingUp, Wallet } from "lucide-react";

export const Route = createFileRoute("/_authenticated/")({ component: Dashboard });


function Dashboard() {
  const [ags] = useLocalStorage<Agendamento[]>("agendamentos", []);
  const [movs] = useLocalStorage<Movimento[]>("movimentos", []);
  const [config] = useLocalStorage<Config>("config", defaultConfig);

  const stats = useMemo(() => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const noMes = (d: string) => {
      const dt = new Date(d + "T00:00");
      return dt.getMonth() === mesAtual && dt.getFullYear() === anoAtual;
    };

    const entradasServicos = ags
      .filter((a) => a.status === "concluido" && noMes(a.data))
      .reduce((s, a) => s + Number(a.valor || 0), 0);

    const entradasExtra = movs
      .filter((m) => m.tipo === "entrada" && noMes(m.data))
      .reduce((s, m) => s + Number(m.valor || 0), 0);

    const saidas = movs
      .filter((m) => m.tipo === "saida" && noMes(m.data))
      .reduce((s, m) => s + Number(m.valor || 0), 0);

    const totalEntradas = entradasServicos + entradasExtra;
    const lucro = totalEntradas - saidas;

    const salario = Math.max(0, (lucro * config.percentualSalario) / 100);
    const investimento = Math.max(0, (lucro * config.percentualInvestimento) / 100);
    const reserva = Math.max(0, (lucro * config.reservaEmergencia) / 100);
    const sobra = lucro - salario - investimento - reserva;

    const hojeStr = hoje.toISOString().slice(0, 10);
    const agHoje = ags
      .filter((a) => a.data === hojeStr && a.status !== "cancelado")
      .sort((a, b) => a.hora.localeCompare(b.hora));

    return {
      totalEntradas,
      saidas,
      lucro,
      salario,
      investimento,
      reserva,
      sobra,
      agHoje,
    };
  }, [ags, movs, config]);

  return (
    <>
      <PageHeader
        title="Painel"
        subtitle="Visão do mês corrente — entradas, saídas e distribuição de lucro."
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                exportarRelatorioMensal(ags, movs, config);
                toast.success("Relatório PDF gerado");
              }}
            >
              <Download className="h-4 w-4 mr-2" /> Exportar PDF
            </Button>
            <Link to="/agendamentos">
              <Button className="bg-primary hover:bg-primary/90">
                <CalendarClock className="h-4 w-4 mr-2" /> Novo agendamento
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Entradas do mês"
          value={brl(stats.totalEntradas)}
          icon={<ArrowUpRight className="h-4 w-4" />}
          tone="success"
        />
        <StatCard
          label="Saídas do mês"
          value={brl(stats.saidas)}
          icon={<ArrowDownRight className="h-4 w-4" />}
          tone="danger"
        />
        <StatCard
          label="Lucro líquido"
          value={brl(stats.lucro)}
          icon={<TrendingUp className="h-4 w-4" />}
          tone="primary"
        />
        <StatCard
          label="Pode retirar (salário)"
          value={brl(stats.salario)}
          icon={<Wallet className="h-4 w-4" />}
          tone="gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card
          className="lg:col-span-2 border-0 text-primary-foreground"
          style={{ background: "var(--gradient-navy)", boxShadow: "var(--shadow-elegant)" }}
        >
          <CardHeader>
            <CardTitle className="font-display text-2xl">
              Distribuição do lucro
            </CardTitle>
            <p className="text-primary-foreground/70 text-sm">
              Baseado nos percentuais em Cálculos.
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MiniStat label={`Salário (${config.percentualSalario}%)`} value={brl(stats.salario)} />
            <MiniStat label={`Investimento (${config.percentualInvestimento}%)`} value={brl(stats.investimento)} />
            <MiniStat label={`Reserva (${config.reservaEmergencia}%)`} value={brl(stats.reserva)} />
            <MiniStat label="Sobra livre" value={brl(stats.sobra)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-xl">Agenda de hoje</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.agHoje.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Sem horários marcados para hoje.
              </p>
            )}
            {stats.agHoje.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between py-2 border-b border-border/60 last:border-0"
              >
                <div>
                  <div className="font-medium">{a.cliente}</div>
                  <div className="text-xs text-muted-foreground">{a.servico}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">{a.hora}</div>
                  <Badge
                    variant="outline"
                    className="text-[10px] mt-1"
                  >
                    {a.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: "success" | "danger" | "primary" | "gold";
}) {
  const toneStyles: Record<string, string> = {
    success: "text-[oklch(0.55_0.15_155)]",
    danger: "text-destructive",
    primary: "text-accent",
    gold: "text-[oklch(0.65_0.13_85)]",
  };
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-wider">
          <span>{label}</span>
          <span className={toneStyles[tone]}>{icon}</span>
        </div>
        <div className={`font-display text-2xl mt-2 ${toneStyles[tone]}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 p-3">
      <div className="text-[11px] uppercase tracking-wider text-primary-foreground/60">
        {label}
      </div>
      <div className="font-display text-lg mt-1">{value}</div>
    </div>
  );
}
