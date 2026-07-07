import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value]);

  return [value, setValue] as const;
}

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
  percentualSalario: number;   // % do lucro para salário do dono
  percentualInvestimento: number; // % do lucro para reinvestir
  reservaEmergencia: number;   // % reserva
};
