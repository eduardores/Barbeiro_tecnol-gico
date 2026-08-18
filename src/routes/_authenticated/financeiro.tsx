import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/app-shell";
import {
  useLocalStorage,
  type Agendamento,
  type Movimento,
} from "@/lib/storage";
import { brl, uid } from "@/lib/format";
import { ArrowDownRight, ArrowUpRight, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/financeiro")({ component: Page });

const categoriasEntrada = ["Serviço avulso", "Venda de produto", "Gorjeta", "Outro"];
const categoriasSaida = [
  "Aluguel",
  "Produtos/Insumos",
  "Energia/Água",
  "Marketing",
  "Manutenção",
  "Impostos",
  "Outro",
];

function Page() {
  const [movs, setMovs] = useLocalStorage<Movimento[]>("movimentos", []);
  const [ags] = useLocalStorage<Agendamento[]>("agendamentos", []);
  const [open, setOpen] = useState(false);
  const hoje = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<Movimento>({
    id: "",
    tipo: "saida",
    categoria: "Aluguel",
    descricao: "",
    valor: 0,
    data: hoje,
  });

  function salvar() {
    if (!form.valor || form.valor <= 0) return toast.error("Valor inválido");
    setMovs([...movs, { ...form, id: uid() }]);
    toast.success("Lançamento salvo");
    setOpen(false);
    setForm({ ...form, descricao: "", valor: 0 });
  }
  function remover(id: string) {
    setMovs(movs.filter((m) => m.id !== id));
  }

  const totais = useMemo(() => {
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();
    const noMes = (d: string) => {
      const dt = new Date(d + "T00:00");
      return dt.getMonth() === mesAtual && dt.getFullYear() === anoAtual;
    };

    const servicos = ags
      .filter((a) => a.status === "concluido" && noMes(a.data))
      .reduce((s, a) => s + Number(a.valor || 0), 0);
    const entradasExtras = movs
      .filter((m) => m.tipo === "entrada" && noMes(m.data))
      .reduce((s, m) => s + Number(m.valor || 0), 0);
    const saidas = movs
      .filter((m) => m.tipo === "saida" && noMes(m.data))
      .reduce((s, m) => s + Number(m.valor || 0), 0);
    const totalEntradas = servicos + entradasExtras;
    return { servicos, entradasExtras, saidas, totalEntradas, lucro: totalEntradas - saidas };
  }, [ags, movs]);

  const ordenados = [...movs].sort((a, b) => b.data.localeCompare(a.data));
  const categorias =
    form.tipo === "entrada" ? categoriasEntrada : categoriasSaida;

  return (
    <>
      <PageHeader
        title="Financeiro"
        subtitle="Controle o que entrou, o que saiu e quanto sobra."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" /> Novo lançamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Lançamento</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={form.tipo === "entrada" ? "default" : "outline"}
                    onClick={() => setForm({ ...form, tipo: "entrada", categoria: categoriasEntrada[0] })}
                    className={form.tipo === "entrada" ? "bg-primary hover:bg-primary/90" : ""}
                  >
                    <ArrowUpRight className="h-4 w-4 mr-2" /> Entrada
                  </Button>
                  <Button
                    variant={form.tipo === "saida" ? "default" : "outline"}
                    onClick={() => setForm({ ...form, tipo: "saida", categoria: categoriasSaida[0] })}
                    className={form.tipo === "saida" ? "bg-primary hover:bg-primary/90" : ""}
                  >
                    <ArrowDownRight className="h-4 w-4 mr-2" /> Saída
                  </Button>
                </div>
                <div className="grid gap-2">
                  <Label>Categoria</Label>
                  <Select
                    value={form.categoria}
                    onValueChange={(v) => setForm({ ...form, categoria: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categorias.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Descrição</Label>
                  <Input
                    value={form.descricao}
                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                    placeholder="Opcional"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Valor (R$)</Label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      value={form.valor}
                      onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={form.data}
                      onChange={(e) => setForm({ ...form, data: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button onClick={salvar} className="bg-primary hover:bg-primary/90">Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Resumo label="Serviços (agenda)" value={brl(totais.servicos)} />
        <Resumo label="Entradas extras" value={brl(totais.entradasExtras)} />
        <Resumo label="Saídas" value={brl(totais.saidas)} tone="danger" />
        <Resumo label="Lucro do mês" value={brl(totais.lucro)} tone="primary" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl">Movimentações</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border/60">
          {ordenados.length === 0 && (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Nenhum lançamento manual ainda. Os serviços concluídos entram
              automaticamente no caixa.
            </p>
          )}
          {ordenados.map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-3">
              <div
                className={`relative h-10 w-10 rounded-xl flex items-center justify-center ${
                  m.tipo === "entrada"
                    ? "bg-[oklch(0.95_0.05_155)] text-[oklch(0.45_0.15_155)]"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                <CategoriaIcone categoria={m.categoria} tipo={m.tipo} className="h-5 w-5" />
                <span className="absolute -bottom-1 -right-1 rounded-full bg-card p-[2px]">
                  {m.tipo === "entrada" ? (
                    <ArrowUpRight className="h-3 w-3 text-[oklch(0.55_0.15_155)]" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-destructive" />
                  )}
                </span>
              </div>
              <div className="flex-1">
                <div className="font-medium">
                  {m.categoria}
                  {m.descricao ? (
                    <span className="text-muted-foreground font-normal"> — {m.descricao}</span>
                  ) : null}
                </div>
                <div className="text-xs text-muted-foreground">{m.data}</div>
              </div>
              <Badge variant="outline" className="font-mono">
                {m.tipo === "saida" ? "-" : "+"} {brl(m.valor)}
              </Badge>
              <Button size="icon" variant="ghost" onClick={() => remover(m.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}

function Resumo({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "danger" | "primary";
}) {
  const cls =
    tone === "danger"
      ? "text-destructive"
      : tone === "primary"
        ? "text-accent"
        : "text-foreground";
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className={`font-display text-xl mt-1 ${cls}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
