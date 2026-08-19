import { useEffect, useState } from "react";
import { Check, Palette as PaletteIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { applyPalette, getSavedPalette, palettes } from "@/lib/palettes";

export function PalettePicker() {
  const [selected, setSelected] = useState<string>("navy");

  useEffect(() => {
    const saved = getSavedPalette();
    setSelected(saved);
    applyPalette(saved);
  }, []);

  function escolher(id: string) {
    setSelected(id);
    applyPalette(id);
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="font-display text-xl flex items-center gap-2">
          <PaletteIcon className="h-5 w-5 text-accent" />
          Cores do sistema
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Escolha a paleta de cores que mais combina com a sua barbearia.
        </p>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {palettes.map((p) => {
          const active = p.id === selected;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => escolher(p.id)}
              className={cn(
                "rounded-xl border p-3 text-left transition-all hover:border-accent",
                active ? "border-accent ring-2 ring-ring/50" : "border-border",
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{p.nome}</span>
                {active && <Check className="h-4 w-4 text-accent" />}
              </div>
              <div className="flex gap-1.5">
                {p.swatches.map((c, i) => (
                  <span
                    key={i}
                    className="h-7 flex-1 rounded-md border border-border/60"
                    style={{ background: c }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
