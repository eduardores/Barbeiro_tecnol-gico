import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app-shell";
import {
  useLocalStorage,
  type Agendamento,
  type Movimento,
  type Config,
} from "@/lib/storage";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/calculos")({ component: Page });

const defaultConfig: Config = {
  percentualSalario: 50,
  percentualInvestimento: 20,
  reservaEmergencia: 10,
};

function Page() {
  const [config, setConfig] = useLocalStorage<Config>("config", defaultConfig);
  const [ags] = useLocalStorage<Agendamento[]>("agendamentos", []);
  const [movs] = useLocalStorage<Movimento[]>("movimentos", []);

  const soma = config.percentualSalario + config.percentualInvestimento + config.reservaEmergencia;

  const stats = useMemo(() => {
    const m = new Date().getMonth();
    const y = new Date().getFullYear();
    const noMes = (d: string) => {
      const dt = new Date(d + "T00:00");
      return dt.getMonth() === m && dt.getFullYear() === y;
    };
    const entradas =
      ags
        .filter((a) => a.status === "concluido" && noMes(a.data))
        .reduce((s, a) => s + Number(a.valor || 0), 0) +
      movs
        .filter((mv) => mv.tipo === "entrada" && noMes(mv.data))
        .reduce((s, mv) => s + Number(mv.valor || 0), 0);
    const saidas = movs
      .filter((mv) => mv.tipo === "saida" && noMes(mv.data))
      .reduce((s, mv) => s + Number(mv.valor || 0), 0);
    const lucro = entradas - saidas;
    return {
      entradas,
      saidas,
      lucro,
      salario: (lucro * config.percentualSalario) / 100,
      investimento: (lucro * config.percentualInvestimento) / 100,
      reserva: (lucro * config.reservaEmergencia) / 100,
      sobra: lucro - (lucro * soma) / 100,
    };
  }, [ags, movs, config, soma]);

  function set(field: keyof Config, val: number) {
    setConfig({ ...config, [field]: Math.max(0, Math.min(100, val)) });
  }

  function salvar() {
    if (soma > 100) return toast.error("A soma dos percentuais passou de 100%");
    toast.success("Percentuais salvos");
  }

  return (
    <>
      <PageHeader
        title="Cálculos"
        subtitle="Defina como o lucro é dividido entre você, o negócio e a reserva."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl">Regras de divisão</CardTitle>
            <p className="text-xs text-muted-foreground">
              A soma pode ser até 100%. O que sobrar fica como lucro livre.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <PercentField
              label="Meu salário"
              hint="Quanto do lucro do mês você pode retirar como pró-labore."
              value={config.percentualSalario}
              onChange={(v) => set("percentualSalario", v)}
            />
            <PercentField
              label="Reinvestimento no negócio"
              hint="Equipamentos, marketing, novos produtos."
              value={config.percentualInvestimento}
              onChange={(v) => set("percentualInvestimento", v)}
            />
            <PercentField
              label="Reserva de emergência"
              hint="Colchão para meses fracos e imprevistos."
              value={config.reservaEmergencia}
              onChange={(v) => set("reservaEmergencia", v)}
            />

            <div
              className={`text-sm rounded-lg px-3 py-2 border ${
                soma > 100
                  ? "border-destructive/40 text-destructive bg-destructive/5"
                  : "border-border text-muted-foreground bg-secondary/40"
              }`}
            >
              Soma atual: <strong>{soma}%</strong> · Lucro livre: <strong>{Math.max(0, 100 - soma)}%</strong>
            </div>

            <Button onClick={salvar} className="bg-primary hover:bg-primary/90 w-full">
              Salvar percentuais
            </Button>
          </CardContent>
        </Card>

        <Card
          className="border-0 text-primary-foreground"
          style={{ background: "var(--gradient-navy)", boxShadow: "var(--shadow-elegant)" }}
        >
          <CardHeader>
            <CardTitle className="font-display text-2xl">Este mês</CardTitle>
            <p className="text-primary-foreground/70 text-sm">
              Simulação com base nos lançamentos atuais.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Row label="Entradas totais" value={brl(stats.entradas)} />
            <Row label="Saídas totais" value={brl(stats.saidas)} />
            <div className="h-px bg-white/15 my-2" />
            <Row label="Lucro líquido" value={brl(stats.lucro)} big />
            <div className="h-px bg-white/15 my-2" />
            <Row label={`Posso tirar de salário (${config.percentualSalario}%)`} value={brl(stats.salario)} accent />
            <Row label={`Posso investir (${config.percentualInvestimento}%)`} value={brl(stats.investimento)} accent />
            <Row label={`Reserva (${config.reservaEmergencia}%)`} value={brl(stats.reserva)} accent />
            <Row label="Sobra livre" value={brl(stats.sobra)} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function PercentField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between">
        <Label className="text-sm">{label}</Label>
        <span className="font-mono text-sm text-accent">{value}%</span>
      </div>
      <Input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function Row({
  label,
  value,
  big,
  accent,
}: {
  label: string;
  value: string;
  big?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-sm text-primary-foreground/75">{label}</span>
      <span
        className={
          big
            ? "font-display text-2xl"
            : accent
              ? "font-display text-lg text-[oklch(0.85_0.13_85)]"
              : "font-mono"
        }
      >
        {value}
      </span>
    </div>
  );
}
