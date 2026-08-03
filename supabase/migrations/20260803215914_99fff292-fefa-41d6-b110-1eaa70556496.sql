CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE public.config (
  id INT PRIMARY KEY DEFAULT 1,
  pct_salario NUMERIC(5,2) NOT NULL DEFAULT 50,
  pct_investimento NUMERIC(5,2) NOT NULL DEFAULT 20,
  pct_reserva NUMERIC(5,2) NOT NULL DEFAULT 10,
  moeda TEXT NOT NULL DEFAULT 'BRL',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT config_single_row CHECK (id = 1)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.config TO anon, authenticated;
GRANT ALL ON public.config TO service_role;
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "config_public_all" ON public.config FOR ALL USING (true) WITH CHECK (true);
INSERT INTO public.config (id) VALUES (1) ON CONFLICT DO NOTHING;

CREATE TABLE public.servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  preco NUMERIC(10,2) NOT NULL DEFAULT 0,
  duracao_min INT NOT NULL DEFAULT 30,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.servicos TO anon, authenticated;
GRANT ALL ON public.servicos TO service_role;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "servicos_public_all" ON public.servicos FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT,
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_clientes_nome ON public.clientes (lower(nome));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clientes TO anon, authenticated;
GRANT ALL ON public.clientes TO service_role;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clientes_public_all" ON public.clientes FOR ALL USING (true) WITH CHECK (true);

CREATE TYPE public.agendamento_status AS ENUM ('agendado','concluido','cancelado');

CREATE TABLE public.agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente TEXT NOT NULL,
  servico TEXT NOT NULL,
  valor NUMERIC(10,2) NOT NULL DEFAULT 0,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  status public.agendamento_status NOT NULL DEFAULT 'agendado',
  observacao TEXT,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  servico_id UUID REFERENCES public.servicos(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_agend_data ON public.agendamentos (data);
CREATE INDEX idx_agend_status ON public.agendamentos (status);
CREATE INDEX idx_agend_data_hora ON public.agendamentos (data, hora);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agendamentos TO anon, authenticated;
GRANT ALL ON public.agendamentos TO service_role;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "agendamentos_public_all" ON public.agendamentos FOR ALL USING (true) WITH CHECK (true);

CREATE TYPE public.movimento_tipo AS ENUM ('entrada','saida');
CREATE TYPE public.movimento_categoria AS ENUM (
  'atendimento','extra','produto',
  'aluguel','insumos','marketing','equipamento','imposto','outros'
);

CREATE TABLE public.movimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo public.movimento_tipo NOT NULL,
  categoria public.movimento_categoria NOT NULL,
  descricao TEXT NOT NULL,
  valor NUMERIC(10,2) NOT NULL CHECK (valor >= 0),
  data DATE NOT NULL,
  agendamento_id UUID REFERENCES public.agendamentos(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_mov_data ON public.movimentos (data);
CREATE INDEX idx_mov_tipo_data ON public.movimentos (tipo, data);
CREATE INDEX idx_mov_categoria ON public.movimentos (categoria);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.movimentos TO anon, authenticated;
GRANT ALL ON public.movimentos TO service_role;
ALTER TABLE public.movimentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "movimentos_public_all" ON public.movimentos FOR ALL USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_agend_updated BEFORE UPDATE ON public.agendamentos
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE VIEW public.vw_resumo_mensal AS
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