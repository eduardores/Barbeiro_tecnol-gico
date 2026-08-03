DROP VIEW public.vw_resumo_mensal;
DROP TABLE public.movimentos;
DROP TABLE public.agendamentos;
DROP TYPE public.movimento_categoria;

CREATE TABLE public.agendamentos (
  id TEXT PRIMARY KEY,
  cliente TEXT NOT NULL,
  servico TEXT NOT NULL,
  valor NUMERIC(10,2) NOT NULL DEFAULT 0,
  data DATE NOT NULL,
  hora TEXT NOT NULL,
  status public.agendamento_status NOT NULL DEFAULT 'agendado',
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_agend_data ON public.agendamentos (data);
CREATE INDEX idx_agend_status ON public.agendamentos (status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agendamentos TO anon, authenticated;
GRANT ALL ON public.agendamentos TO service_role;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "agendamentos_public_all" ON public.agendamentos FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_agend_updated BEFORE UPDATE ON public.agendamentos
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.movimentos (
  id TEXT PRIMARY KEY,
  tipo public.movimento_tipo NOT NULL,
  categoria TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  valor NUMERIC(10,2) NOT NULL DEFAULT 0,
  data DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_mov_data ON public.movimentos (data);
CREATE INDEX idx_mov_tipo_data ON public.movimentos (tipo, data);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.movimentos TO anon, authenticated;
GRANT ALL ON public.movimentos TO service_role;
ALTER TABLE public.movimentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "movimentos_public_all" ON public.movimentos FOR ALL USING (true) WITH CHECK (true);

CREATE VIEW public.vw_resumo_mensal WITH (security_invoker = on) AS
SELECT
  date_trunc('month', data)::date AS mes,
  SUM(CASE WHEN tipo='entrada' THEN valor ELSE 0 END) AS entradas,
  SUM(CASE WHEN tipo='saida' THEN valor ELSE 0 END) AS saidas,
  SUM(CASE WHEN tipo='entrada' THEN valor ELSE -valor END) AS lucro
FROM public.movimentos
GROUP BY 1
ORDER BY 1 DESC;
GRANT SELECT ON public.vw_resumo_mensal TO anon, authenticated;
GRANT ALL ON public.vw_resumo_mensal TO service_role;