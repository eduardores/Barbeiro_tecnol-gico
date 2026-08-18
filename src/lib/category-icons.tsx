import {
  ArrowDownRight,
  ArrowUpRight,
  Coins,
  Droplets,
  Eye,
  Home,
  Landmark,
  Megaphone,
  Package,
  Paintbrush,
  Scissors,
  ShoppingBag,
  SprayCan,
  Sparkles,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

const categoriaIcons: Record<string, LucideIcon> = {
  // saídas
  Aluguel: Home,
  "Produtos/Insumos": SprayCan,
  "Energia/Água": Zap,
  Marketing: Megaphone,
  Manutenção: Wrench,
  Impostos: Landmark,
  // entradas
  "Serviço avulso": Scissors,
  "Venda de produto": ShoppingBag,
  Gorjeta: Coins,
};

const servicoIcons: Record<string, LucideIcon> = {
  Corte: Scissors,
  Barba: Droplets,
  "Corte + Barba": Sparkles,
  Sobrancelha: Eye,
  Pigmentação: Paintbrush,
};

export function iconeCategoria(categoria: string, tipo: "entrada" | "saida") {
  return (
    categoriaIcons[categoria] ?? (tipo === "entrada" ? ArrowUpRight : ArrowDownRight)
  );
}

export function iconeServico(servico: string) {
  return servicoIcons[servico] ?? Package;
}

export function CategoriaIcone({
  categoria,
  tipo,
  className,
}: {
  categoria: string;
  tipo: "entrada" | "saida";
  className?: string;
}) {
  const Icon = iconeCategoria(categoria, tipo);
  return <Icon className={className ?? "h-4 w-4"} />;
}

export function ServicoIcone({
  servico,
  className,
}: {
  servico: string;
  className?: string;
}) {
  const Icon = iconeServico(servico);
  return <Icon className={className ?? "h-4 w-4"} />;
}
