import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Scissors, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Entrar — Gestão para Barbearia" },
      {
        name: "description",
        content:
          "Acesse sua conta e gerencie a agenda, o caixa e a divisão de lucro da sua barbearia.",
      },
      { property: "og:title", content: "Entrar — Gestão para Barbearia" },
      {
        property: "og:description",
        content: "Cada barbearia com seu próprio painel de agenda e finanças.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "signup" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) void navigate({ to: "/" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Conta criada! Bem-vindo.");
        } else {
          toast.success("Conta criada! Confirme seu e-mail para entrar.");
        }
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setEnviado(true);
        toast.success("Enviamos um link de recuperação para seu e-mail.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível continuar");
    } finally {
      setLoading(false);
    }
  }

  const titulo =
    mode === "login"
      ? "Entrar na sua conta"
      : mode === "signup"
        ? "Criar sua conta"
        : "Recuperar senha";

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div
            className="h-11 w-11 rounded-xl flex items-center justify-center text-primary-foreground shadow-[var(--shadow-glow)]"
            style={{ background: "var(--gradient-navy)" }}
          >
            <Scissors className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-2xl">Sua barbearia</div>
            <div className="text-xs text-muted-foreground -mt-0.5">Agenda, caixa e lucro</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{titulo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mode === "forgot" && enviado ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Se existir uma conta com <strong>{email}</strong>, enviamos um link para
                  criar uma nova senha. Verifique também a caixa de spam.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setEnviado(false);
                    setMode("login");
                  }}
                >
                  <ArrowLeft className="h-4 w-4" /> Voltar ao login
                </Button>
              </div>
            ) : (
              <>
                <form onSubmit={submit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="voce@email.com"
                    />
                  </div>
                  {mode !== "forgot" && (
                    <div className="space-y-2">
                      <Label htmlFor="senha">Senha</Label>
                      <Input
                        id="senha"
                        type="password"
                        required
                        minLength={6}
                        autoComplete={mode === "signup" ? "new-password" : "current-password"}
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="mínimo 6 caracteres"
                      />
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading
                      ? "Aguarde..."
                      : mode === "login"
                        ? "Entrar"
                        : mode === "signup"
                          ? "Criar conta"
                          : "Enviar link de recuperação"}
                  </Button>
                </form>

                <div className="space-y-2 text-center">
                  {mode === "login" && (
                    <button
                      type="button"
                      className="block w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setMode("forgot")}
                    >
                      Esqueci minha senha
                    </button>
                  )}
                  <button
                    type="button"
                    className="block w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  >
                    {mode === "login"
                      ? "Não tem conta? Cadastre-se grátis"
                      : "Já tem conta? Fazer login"}
                  </button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
