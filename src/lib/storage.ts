import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Agendamento = {
  id: string;
  cliente: string;
  servico: string;
  data: string; // yyyy-mm-dd
  hora: string; // hh:mm
  valor: number;
  status: "agendado" | "concluido" | "cancelado";
};

export type Movimento = {
  id: string;
  tipo: "entrada" | "saida";
  categoria: string;
  descricao: string;
  valor: number;
  data: string; // yyyy-mm-dd
};

export type Config = {
  percentualSalario: number;
  percentualInvestimento: number;
  reservaEmergencia: number;
  nomeEmpresa: string;
  subtitulo: string;
  logoUrl: string | null;
};

/* ------------------------------------------------------------------ */
/* Store simples em memória, sincronizado com o banco na nuvem          */
/* ------------------------------------------------------------------ */

type Store = Record<string, unknown>;

const store: Store = {};
const loaded: Record<string, boolean> = {};
const listeners: Record<string, Set<() => void>> = {};

function emit(key: string) {
  listeners[key]?.forEach((fn) => fn());
}

function subscribe(key: string, fn: () => void) {
  (listeners[key] ??= new Set()).add(fn);
  return () => {
    listeners[key]?.delete(fn);
  };
}

function setStore(key: string, value: unknown) {
  store[key] = value;
  emit(key);
}

/* ---------- leitura inicial ---------- */

async function load(key: string) {
  if (loaded[key]) return;
  loaded[key] = true;
  try {
    if (key === "agendamentos") {
      const { data } = await supabase
        .from("agendamentos")
        .select("id, cliente, servico, data, hora, valor, status")
        .order("data", { ascending: true });
      if (data) {
        setStore(
          key,
          data.map((r) => ({ ...r, valor: Number(r.valor) })) as Agendamento[],
        );
      }
    } else if (key === "movimentos") {
      const { data } = await supabase
        .from("movimentos")
        .select("id, tipo, categoria, descricao, valor, data")
        .order("data", { ascending: false });
      if (data) {
        setStore(
          key,
          data.map((r) => ({ ...r, valor: Number(r.valor) })) as Movimento[],
        );
      }
    } else if (key === "config") {
      const { data } = await supabase
        .from("config")
        .select("pct_salario, pct_investimento, pct_reserva, nome_empresa, subtitulo, logo_url")
        .eq("id", 1)
        .maybeSingle();
      if (data) {
        setStore(key, {
          percentualSalario: Number(data.pct_salario),
          percentualInvestimento: Number(data.pct_investimento),
          reservaEmergencia: Number(data.pct_reserva),
          nomeEmpresa: data.nome_empresa ?? "Minha Barbearia",
          subtitulo: data.subtitulo ?? "Gestão de barbearia",
          logoUrl: data.logo_url ?? null,
        } as Config);
      }
    }
  } catch {
    /* mantém o valor local se o banco não responder */
  }
}

/* ---------- gravação ---------- */

async function persist(key: string, prev: unknown, next: unknown) {
  try {
    if (key === "agendamentos" || key === "movimentos") {
      const before = (prev as { id: string }[]) ?? [];
      const after = (next as { id: string }[]) ?? [];
      const beforeMap = new Map(before.map((r) => [r.id, r]));
      const afterMap = new Map(after.map((r) => [r.id, r]));

      const removed = before.filter((r) => !afterMap.has(r.id)).map((r) => r.id);
      if (removed.length) {
        await supabase.from(key).delete().in("id", removed);
      }

      const changed = after.filter((r) => {
        const old = beforeMap.get(r.id);
        return !old || JSON.stringify(old) !== JSON.stringify(r);
      });
      if (changed.length) {
        await supabase.from(key).upsert(changed as never);
      }
    } else if (key === "config") {
      const c = next as Config;
      await supabase.from("config").upsert({
        id: 1,
        pct_salario: c.percentualSalario,
        pct_investimento: c.percentualInvestimento,
        pct_reserva: c.reservaEmergencia,
        nome_empresa: c.nomeEmpresa,
        subtitulo: c.subtitulo,
        logo_url: c.logoUrl,
      });
    }
  } catch {
    /* ignora falhas de rede; o estado local segue válido */
  }
}

/* ------------------------------------------------------------------ */
/* Hook — mesma API de antes                                           */
/* ------------------------------------------------------------------ */

export function useLocalStorage<T>(key: string, initial: T) {
  if (!(key in store)) store[key] = initial;

  const [value, setLocal] = useState<T>(store[key] as T);

  useEffect(() => {
    const unsub = subscribe(key, () => setLocal(store[key] as T));
    void load(key);
    setLocal(store[key] as T);
    return unsub;
  }, [key]);

  function setValue(next: T) {
    const prev = store[key];
    setStore(key, next);
    void persist(key, prev, next);
  }

  return [value, setValue] as const;
}
