import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Scissors, CalendarDays, Wallet, Calculator, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLocalStorage, defaultConfig, type Config } from "@/lib/storage";

const nav = [
  { to: "/", label: "Painel", icon: LayoutDashboard },
  { to: "/agendamentos", label: "Agenda", icon: CalendarDays },
  { to: "/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/calculos", label: "Cálculos", icon: Calculator },
] as const;

export function AppShell({ children }: { children?: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [config] = useLocalStorage<Config>("config", defaultConfig);


  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className="border-b border-border/60 sticky top-0 z-40 backdrop-blur bg-background/80"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center text-primary-foreground shadow-[var(--shadow-glow)] overflow-hidden"
              style={config.logoUrl ? undefined : { background: "var(--gradient-navy)" }}
            >
              {config.logoUrl ? (
                <img
                  src={config.logoUrl}
                  alt={`Logo ${config.nomeEmpresa}`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Scissors className="h-5 w-5" />
              )}
            </div>
            <div className="leading-tight">
              <div className="font-display text-xl">{config.nomeEmpresa}</div>
              <div className="text-xs text-muted-foreground -mt-0.5">
                {config.subtitulo}
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )}
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
            <div className="ml-1"><ThemeToggle /></div>
          </nav>
          <div className="md:hidden"><ThemeToggle /></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-12">
        {children ?? <Outlet />}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur">
        <div className="grid grid-cols-4">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 text-xs transition-colors",
                  active ? "text-accent" : "text-muted-foreground",
                )}
              >
                <n.icon className="h-5 w-5" />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
