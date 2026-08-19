export type Palette = {
  id: string;
  nome: string;
  swatches: string[];
  dark: Record<string, string>;
  light: Record<string, string>;
};

export const palettes: Palette[] = [
  {
    id: "navy",
    nome: "Navy & Gold",
    swatches: ["oklch(0.14 0.03 260)", "oklch(0.54 0.15 258)", "oklch(0.74 0.13 258)", "oklch(0.84 0.13 85)"],
    dark: {
      "--background": "oklch(0.14 0.03 260)",
      "--card": "oklch(0.19 0.04 260)",
      "--popover": "oklch(0.19 0.04 260)",
      "--primary": "oklch(0.54 0.15 258)",
      "--secondary": "oklch(0.24 0.05 260)",
      "--muted": "oklch(0.22 0.04 260)",
      "--muted-foreground": "oklch(0.74 0.025 258)",
      "--accent": "oklch(0.74 0.13 258)",
      "--accent-foreground": "oklch(0.16 0.03 260)",
      "--gold": "oklch(0.84 0.13 85)",
      "--border": "oklch(0.3 0.04 260)",
      "--input": "oklch(0.26 0.05 260)",
      "--ring": "oklch(0.54 0.15 258)",
      "--gradient-navy": "linear-gradient(135deg, oklch(0.22 0.08 260), oklch(0.4 0.14 258))",
      "--shadow-glow": "0 0 60px oklch(0.54 0.15 258 / 0.35)",
    },
    light: {
      "--background": "oklch(0.98 0.008 250)",
      "--foreground": "oklch(0.18 0.05 260)",
      "--primary": "oklch(0.28 0.09 260)",
      "--secondary": "oklch(0.94 0.02 250)",
      "--muted": "oklch(0.95 0.015 250)",
      "--accent": "oklch(0.45 0.14 258)",
      "--border": "oklch(0.9 0.02 250)",
      "--input": "oklch(0.92 0.02 250)",
      "--ring": "oklch(0.45 0.14 258)",
      "--gradient-navy": "linear-gradient(135deg, oklch(0.22 0.08 260), oklch(0.35 0.12 258))",
    },
  },
  {
    id: "esmeralda",
    nome: "Esmeralda",
    swatches: ["oklch(0.15 0.03 165)", "oklch(0.52 0.13 163)", "oklch(0.78 0.13 165)", "oklch(0.85 0.12 95)"],
    dark: {
      "--background": "oklch(0.15 0.03 165)",
      "--card": "oklch(0.2 0.04 165)",
      "--popover": "oklch(0.2 0.04 165)",
      "--primary": "oklch(0.52 0.13 163)",
      "--secondary": "oklch(0.25 0.05 165)",
      "--muted": "oklch(0.23 0.04 165)",
      "--muted-foreground": "oklch(0.76 0.03 165)",
      "--accent": "oklch(0.78 0.13 165)",
      "--accent-foreground": "oklch(0.16 0.03 165)",
      "--gold": "oklch(0.85 0.12 95)",
      "--border": "oklch(0.31 0.04 165)",
      "--input": "oklch(0.27 0.05 165)",
      "--ring": "oklch(0.52 0.13 163)",
      "--gradient-navy": "linear-gradient(135deg, oklch(0.22 0.07 165), oklch(0.4 0.13 163))",
      "--shadow-glow": "0 0 60px oklch(0.52 0.13 163 / 0.35)",
    },
    light: {
      "--background": "oklch(0.98 0.01 165)",
      "--foreground": "oklch(0.18 0.04 165)",
      "--primary": "oklch(0.38 0.1 163)",
      "--secondary": "oklch(0.94 0.02 165)",
      "--muted": "oklch(0.95 0.015 165)",
      "--accent": "oklch(0.5 0.12 165)",
      "--border": "oklch(0.9 0.02 165)",
      "--input": "oklch(0.92 0.02 165)",
      "--ring": "oklch(0.5 0.12 165)",
      "--gradient-navy": "linear-gradient(135deg, oklch(0.25 0.07 165), oklch(0.4 0.12 163))",
    },
  },
  {
    id: "vinho",
    nome: "Vinho & Cobre",
    swatches: ["oklch(0.15 0.04 20)", "oklch(0.5 0.16 20)", "oklch(0.76 0.13 40)", "oklch(0.84 0.12 70)"],
    dark: {
      "--background": "oklch(0.15 0.04 20)",
      "--card": "oklch(0.2 0.05 20)",
      "--popover": "oklch(0.2 0.05 20)",
      "--primary": "oklch(0.5 0.16 20)",
      "--secondary": "oklch(0.25 0.06 20)",
      "--muted": "oklch(0.23 0.05 20)",
      "--muted-foreground": "oklch(0.78 0.03 30)",
      "--accent": "oklch(0.76 0.13 40)",
      "--accent-foreground": "oklch(0.17 0.04 20)",
      "--gold": "oklch(0.84 0.12 70)",
      "--border": "oklch(0.31 0.05 20)",
      "--input": "oklch(0.27 0.06 20)",
      "--ring": "oklch(0.5 0.16 20)",
      "--gradient-navy": "linear-gradient(135deg, oklch(0.22 0.09 20), oklch(0.42 0.15 30))",
      "--shadow-glow": "0 0 60px oklch(0.5 0.16 20 / 0.35)",
    },
    light: {
      "--background": "oklch(0.98 0.01 30)",
      "--foreground": "oklch(0.2 0.05 20)",
      "--primary": "oklch(0.38 0.13 20)",
      "--secondary": "oklch(0.94 0.02 30)",
      "--muted": "oklch(0.95 0.015 30)",
      "--accent": "oklch(0.52 0.14 35)",
      "--border": "oklch(0.9 0.02 30)",
      "--input": "oklch(0.92 0.02 30)",
      "--ring": "oklch(0.52 0.14 35)",
      "--gradient-navy": "linear-gradient(135deg, oklch(0.25 0.09 20), oklch(0.42 0.14 30))",
    },
  },
  {
    id: "grafite",
    nome: "Grafite & Âmbar",
    swatches: ["oklch(0.15 0.005 260)", "oklch(0.5 0.02 260)", "oklch(0.8 0.14 75)", "oklch(0.88 0.1 90)"],
    dark: {
      "--background": "oklch(0.15 0.005 260)",
      "--card": "oklch(0.2 0.008 260)",
      "--popover": "oklch(0.2 0.008 260)",
      "--primary": "oklch(0.5 0.02 260)",
      "--secondary": "oklch(0.25 0.008 260)",
      "--muted": "oklch(0.23 0.008 260)",
      "--muted-foreground": "oklch(0.76 0.01 260)",
      "--accent": "oklch(0.8 0.14 75)",
      "--accent-foreground": "oklch(0.17 0.01 260)",
      "--gold": "oklch(0.88 0.1 90)",
      "--border": "oklch(0.31 0.008 260)",
      "--input": "oklch(0.27 0.008 260)",
      "--ring": "oklch(0.8 0.14 75)",
      "--gradient-navy": "linear-gradient(135deg, oklch(0.2 0.01 260), oklch(0.4 0.02 260))",
      "--shadow-glow": "0 0 60px oklch(0.8 0.14 75 / 0.25)",
    },
    light: {
      "--background": "oklch(0.98 0.003 260)",
      "--foreground": "oklch(0.2 0.01 260)",
      "--primary": "oklch(0.3 0.01 260)",
      "--secondary": "oklch(0.94 0.005 260)",
      "--muted": "oklch(0.95 0.005 260)",
      "--accent": "oklch(0.65 0.14 70)",
      "--border": "oklch(0.9 0.005 260)",
      "--input": "oklch(0.92 0.005 260)",
      "--ring": "oklch(0.65 0.14 70)",
      "--gradient-navy": "linear-gradient(135deg, oklch(0.25 0.01 260), oklch(0.45 0.02 260))",
    },
  },
  {
    id: "roxo",
    nome: "Ametista",
    swatches: ["oklch(0.15 0.04 300)", "oklch(0.52 0.16 300)", "oklch(0.76 0.14 305)", "oklch(0.84 0.12 340)"],
    dark: {
      "--background": "oklch(0.15 0.04 300)",
      "--card": "oklch(0.2 0.05 300)",
      "--popover": "oklch(0.2 0.05 300)",
      "--primary": "oklch(0.52 0.16 300)",
      "--secondary": "oklch(0.25 0.06 300)",
      "--muted": "oklch(0.23 0.05 300)",
      "--muted-foreground": "oklch(0.78 0.03 300)",
      "--accent": "oklch(0.76 0.14 305)",
      "--accent-foreground": "oklch(0.17 0.04 300)",
      "--gold": "oklch(0.84 0.12 340)",
      "--border": "oklch(0.31 0.05 300)",
      "--input": "oklch(0.27 0.06 300)",
      "--ring": "oklch(0.52 0.16 300)",
      "--gradient-navy": "linear-gradient(135deg, oklch(0.22 0.09 300), oklch(0.42 0.15 305))",
      "--shadow-glow": "0 0 60px oklch(0.52 0.16 300 / 0.35)",
    },
    light: {
      "--background": "oklch(0.98 0.01 300)",
      "--foreground": "oklch(0.2 0.05 300)",
      "--primary": "oklch(0.4 0.14 300)",
      "--secondary": "oklch(0.94 0.02 300)",
      "--muted": "oklch(0.95 0.015 300)",
      "--accent": "oklch(0.55 0.15 305)",
      "--border": "oklch(0.9 0.02 300)",
      "--input": "oklch(0.92 0.02 300)",
      "--ring": "oklch(0.55 0.15 305)",
      "--gradient-navy": "linear-gradient(135deg, oklch(0.25 0.09 300), oklch(0.42 0.14 305))",
    },
  },
  {
    id: "oceano",
    nome: "Oceano",
    swatches: ["oklch(0.15 0.03 220)", "oklch(0.55 0.12 220)", "oklch(0.8 0.11 200)", "oklch(0.86 0.1 190)"],
    dark: {
      "--background": "oklch(0.15 0.03 220)",
      "--card": "oklch(0.2 0.04 220)",
      "--popover": "oklch(0.2 0.04 220)",
      "--primary": "oklch(0.55 0.12 220)",
      "--secondary": "oklch(0.25 0.05 220)",
      "--muted": "oklch(0.23 0.04 220)",
      "--muted-foreground": "oklch(0.78 0.03 220)",
      "--accent": "oklch(0.8 0.11 200)",
      "--accent-foreground": "oklch(0.16 0.03 220)",
      "--gold": "oklch(0.86 0.1 190)",
      "--border": "oklch(0.31 0.04 220)",
      "--input": "oklch(0.27 0.05 220)",
      "--ring": "oklch(0.55 0.12 220)",
      "--gradient-navy": "linear-gradient(135deg, oklch(0.22 0.07 220), oklch(0.42 0.12 210))",
      "--shadow-glow": "0 0 60px oklch(0.55 0.12 220 / 0.35)",
    },
    light: {
      "--background": "oklch(0.98 0.01 220)",
      "--foreground": "oklch(0.2 0.04 220)",
      "--primary": "oklch(0.4 0.11 220)",
      "--secondary": "oklch(0.94 0.02 220)",
      "--muted": "oklch(0.95 0.015 220)",
      "--accent": "oklch(0.55 0.11 205)",
      "--border": "oklch(0.9 0.02 220)",
      "--input": "oklch(0.92 0.02 220)",
      "--ring": "oklch(0.55 0.11 205)",
      "--gradient-navy": "linear-gradient(135deg, oklch(0.25 0.07 220), oklch(0.42 0.12 210))",
    },
  },
];

export const PALETTE_KEY = "palette";
export const defaultPaletteId = "navy";

function css(vars: Record<string, string>) {
  return Object.entries(vars)
    .map(([k, v]) => `${k}: ${v};`)
    .join("");
}

export function applyPalette(id: string) {
  if (typeof document === "undefined") return;
  const p = palettes.find((x) => x.id === id) ?? palettes[0]!;
  let el = document.getElementById("palette-vars") as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = "palette-vars";
    document.head.appendChild(el);
  }
  el.textContent = `:root{${css(p.light)}}\n.dark{${css(p.dark)}}`;
  try {
    localStorage.setItem(PALETTE_KEY, p.id);
  } catch {
    /* ignora */
  }
}

export function getSavedPalette(): string {
  if (typeof localStorage === "undefined") return defaultPaletteId;
  try {
    return localStorage.getItem(PALETTE_KEY) ?? defaultPaletteId;
  } catch {
    return defaultPaletteId;
  }
}
