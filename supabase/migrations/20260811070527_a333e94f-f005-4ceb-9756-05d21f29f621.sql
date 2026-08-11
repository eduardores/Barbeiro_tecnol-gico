-- Limpa dados públicos antigos
DELETE FROM public.agendamentos;
DELETE FROM public.movimentos;
DELETE FROM public.clientes;
DELETE FROM public.servicos;

ALTER TABLE public.agendamentos ADD COLUMN user_id uuid NOT NULL;
ALTER TABLE public.movimentos ADD COLUMN user_id uuid NOT NULL;
ALTER TABLE public.clientes ADD COLUMN user_id uuid NOT NULL;
ALTER TABLE public.servicos ADD COLUMN user_id uuid NOT NULL;

DROP POLICY IF EXISTS agendamentos_public_all ON public.agendamentos;
DROP POLICY IF EXISTS movimentos_public_all ON public.movimentos;
DROP POLICY IF EXISTS clientes_public_all ON public.clientes;
DROP POLICY IF EXISTS servicos_public_all ON public.servicos;
DROP POLICY IF EXISTS config_public_all ON public.config;

CREATE POLICY agendamentos_own ON public.agendamentos FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY movimentos_own ON public.movimentos FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY clientes_own ON public.clientes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY servicos_own ON public.servicos FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

REVOKE ALL ON public.agendamentos FROM anon;
REVOKE ALL ON public.movimentos FROM anon;
REVOKE ALL ON public.clientes FROM anon;
REVOKE ALL ON public.servicos FROM anon;
REVOKE ALL ON public.config FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agendamentos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.movimentos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clientes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.servicos TO authenticated;
GRANT ALL ON public.agendamentos TO service_role;
GRANT ALL ON public.movimentos TO service_role;
GRANT ALL ON public.clientes TO service_role;
GRANT ALL ON public.servicos TO service_role;

-- config: uma linha por usuário
DROP TABLE public.config;
CREATE TABLE public.config (
  user_id uuid PRIMARY KEY,
  pct_salario numeric NOT NULL DEFAULT 50,
  pct_investimento numeric NOT NULL DEFAULT 20,
  pct_reserva numeric NOT NULL DEFAULT 10,
  moeda text NOT NULL DEFAULT 'BRL',
  nome_empresa text NOT NULL DEFAULT 'Minha Barbearia',
  subtitulo text NOT NULL DEFAULT 'Gestão de barbearia',
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.config TO authenticated;
GRANT ALL ON public.config TO service_role;
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;
CREATE POLICY config_own ON public.config FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER config_set_updated_at BEFORE UPDATE ON public.config FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();