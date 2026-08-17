import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/app-shell";
import { useLocalStorage, type Agendamento } from "@/lib/storage";
import { brl, uid } from "@/lib/format";
import { Check, Plus, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/agendamentos")({ component: Page });

const servicosPadrao = ["Corte", "Barba", "Corte + Barba", "Sobrancelha", "Pigmentação"];

function Page() {
  const [items, setItems] = useLocalStorage<Agendamento[]>("agendamentos", []);
  const [open, setOpen] = useState(false);
  const hoje = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<Agendamento>({
    id: "",
    cliente: "",
    servico: "Corte",
    data: hoje,
    hora: "09:00",
    valor: 40,
    status: "agendado",
  });

  function salvar() {
    if (!form.cliente.trim()) return toast.error("Informe o nome do cliente");
    setItems([...items, { ...form, id: uid() }]);
    toast.success("Agendamento criado");
    setOpen(false);
    setForm({ ...form, cliente: "" });
  }

  function updateStatus(id: string, status: Agendamento["status"]) {
    setItems(items.map((a) => (a.id === id ? { ...a, status } : a)));
  }
  function remover(id: string) {
    setItems(items.filter((a) => a.id !== id));
  }

  // Agrupa por data (desc) e ordena horários dentro de cada dia (asc)
  const porDia = [...items]
    .sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora))
    .reduce<Record<string, Agendamento[]>>((acc, a) => {
      (acc[a.data] ??= []).push(a);
      return acc;
    }, {});
  const dias = Object.keys(porDia).sort((x, y) => y.localeCompare(x));

  return (
    <>
      <PageHeader
        title="Agenda"
        subtitle="Marque horários, marque como concluídos para lançar no caixa."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" /> Novo horário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Novo agendamento</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Cliente</Label>
                  <Input
                    value={form.cliente}
                    onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                    placeholder="Nome do cliente"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Serviço</Label>
                    <Select
                      value={form.servico}
                      onValueChange={(v) => setForm({ ...form, servico: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {servicosPadrao.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Valor (R$)</Label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      value={form.valor}
                      onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={form.data}
                      onChange={(e) => setForm({ ...form, data: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Hora</Label>
                    <Input
                      type="time"
                      value={form.hora}
                      onChange={(e) => setForm({ ...form, hora: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button onClick={salvar} className="bg-primary hover:bg-primary/90">
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {dias.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum agendamento ainda. Clique em "Novo horário".
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {dias.map((data) => {
          const lista = porDia[data].sort((a, b) => a.hora.localeCompare(b.hora));
          const [y, m, day] = data.split("-");
          const nomeMes = MESES[Number(m) - 1] ?? m;
          const total = lista.reduce((s, a) => s + a.valor, 0);
          return (
            <Card key={data}>
              <CardHeader className="pb-3">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-3xl leading-none text-primary">{day}</span>
                    <div className="leading-tight">
                      <div className="font-display text-lg capitalize">{nomeMes}</div>
                      <div className="text-xs text-muted-foreground font-mono">{y}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {lista.length} {lista.length === 1 ? "horário" : "horários"}
                    </div>
                    <div className="font-mono text-sm">{brl(total)}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="divide-y divide-border/60 pt-0">
                {lista.map((a) => (
                  <div key={a.id} className="flex flex-wrap items-center gap-3 py-4">
                    <div className="min-w-[70px]">
                      <div className="font-display text-xl">{a.hora}</div>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                      <div className="font-medium">{a.cliente}</div>
                      <div className="text-xs text-muted-foreground">{a.servico}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">{brl(a.valor)}</div>
                      <Badge
                        variant={
                          a.status === "concluido"
                            ? "default"
                            : a.status === "cancelado"
                              ? "destructive"
                              : "outline"
                        }
                        className="text-[10px] mt-1"
                      >
                        {a.status}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      {a.status !== "concluido" && (
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            updateStatus(a.id, "concluido");
                            toast.success("Marcado como concluído — entrou no caixa");
                          }}
                          title="Concluir"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {a.status !== "cancelado" && (
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateStatus(a.id, "cancelado")}
                          title="Cancelar"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => remover(a.id)}
                        title="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];
