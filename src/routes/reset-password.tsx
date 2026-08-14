import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Nova senha — Gestão para Barbearia" },
      {
        name: "description",
        content: "Defina uma nova senha para voltar a acessar a agenda e o caixa da sua barbearia.",
      },
      { property: "og:title", content: "Nova senha — Gestão para Barbearia" },
      {
        property: "og:description",
        content: "Recupere o acesso à sua conta em poucos segundos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [loading, setLoading] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setPronto(Boolean(data.session));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) setPronto(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (senha !== confirma) {
      toast.error("As senhas não são iguais");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: senha });
      if (error) throw error;
      toast.success("Senha alterada! Você já está conectado.");
      void navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível alterar a senha");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div
            className="h-11 w-11 rounded-xl flex items-center justify-center text-primary-foreground shadow-[var(--shadow-glow)]"
            style={{ background: "var(--gradient-navy)" }}
          >
            <KeyRound className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-2xl">Nova senha</div>
            <div className="text-xs text-muted-foreground -mt-0.5">Recupere seu acesso</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Definir nova senha</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!pronto && (
              <p className="text-sm text-muted-foreground">
                Abra esta página pelo link enviado no seu e-mail. Se o link expirou, peça um
                novo em “Esqueci minha senha”.
              </p>
            )}
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="senha">Nova senha</Label>
                <Input
                  id="senha"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="mínimo 6 caracteres"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirma">Confirmar senha</Label>
                <Input
                  id="confirma"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirma}
                  onChange={(e) => setConfirma(e.target.value)}
                  placeholder="repita a senha"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !pronto}>
                {loading ? "Salvando..." : "Salvar nova senha"}
              </Button>
            </form>
            <button
              type="button"
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => void navigate({ to: "/auth" })}
            >
              Voltar ao login
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
