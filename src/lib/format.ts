export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const uid = () => Math.random().toString(36).slice(2, 10);
