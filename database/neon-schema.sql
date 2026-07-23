-- ============================================================
-- Fabio Barber — Esquema completo (Neon / PostgreSQL)
-- Cole este arquivo inteiro no SQL Editor do Neon e execute.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------- CONFIGURAÇÃO ----------
CREATE TABLE IF NOT EXISTS config (
  id              INT PRIMARY KEY DEFAULT 1,
  pct_salario     NUMERIC(5,2) NOT NULL DEFAULT 50,
  pct_investimento NUMERIC(5,2) NOT NULL DEFAULT 30,
  pct_reserva     NUMERIC(5,2) NOT NULL DEFAULT 20,
  moeda           TEXT NOT NULL DEFAULT 'BRL',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT config_single_row CHECK (id = 1)
);
INSERT INTO config (id) VALUES (1) ON CONFLICT DO NOTHING;

-- ---------- SERVIÇOS (catálogo opcional) ----------
CREATE TABLE IF NOT EXISTS servicos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT NOT NULL,
  preco       NUMERIC(10,2) NOT NULL DEFAULT 0,
  duracao_min INT NOT NULL DEFAULT 30,
  ativo       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- CLIENTES ----------
CREATE TABLE IF NOT EXISTS clientes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       TEXT NOT NULL,
  telefone   TEXT,
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON clientes (lower(nome));

-- ---------- AGENDAMENTOS ----------
CREATE TYPE agendamento_status AS ENUM ('agendado','concluido','cancelado');

CREATE TABLE IF NOT EXISTS agendamentos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente     TEXT NOT NULL,
  servico     TEXT NOT NULL,
  valor       NUMERIC(10,2) NOT NULL DEFAULT 0,
  data        DATE NOT NULL,
  hora        TIME NOT NULL,
  status      agendamento_status NOT NULL DEFAULT 'agendado',
  observacao  TEXT,
  cliente_id  UUID REFERENCES clientes(id) ON DELETE SET NULL,
  servico_id  UUID REFERENCES servicos(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_agend_data       ON agendamentos (data);
CREATE INDEX IF NOT EXISTS idx_agend_status     ON agendamentos (status);
CREATE INDEX IF NOT EXISTS idx_agend_data_hora  ON agendamentos (data, hora);

-- ---------- MOVIMENTOS FINANCEIROS ----------
CREATE TYPE movimento_tipo     AS ENUM ('entrada','saida');
CREATE TYPE movimento_categoria AS ENUM (
  'atendimento','extra','produto',
  'aluguel','insumos','marketing','equipamento','imposto','outros'
);

CREATE TABLE IF NOT EXISTS movimentos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo            movimento_tipo NOT NULL,
  categoria       movimento_categoria NOT NULL,
  descricao       TEXT NOT NULL,
  valor           NUMERIC(10,2) NOT NULL CHECK (valor >= 0),
  data            DATE NOT NULL,
  agendamento_id  UUID REFERENCES agendamentos(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mov_data      ON movimentos (data);
CREATE INDEX IF NOT EXISTS idx_mov_tipo_data ON movimentos (tipo, data);
CREATE INDEX IF NOT EXISTS idx_mov_categoria ON movimentos (categoria);

-- ---------- TRIGGER updated_at ----------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_agend_updated ON agendamentos;
CREATE TRIGGER trg_agend_updated BEFORE UPDATE ON agendamentos
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- VIEW: resumo mensal ----------
CREATE OR REPLACE VIEW vw_resumo_mensal AS
SELECT
  date_trunc('month', data)::date            AS mes,
  SUM(CASE WHEN tipo='entrada' THEN valor ELSE 0 END) AS entradas,
  SUM(CASE WHEN tipo='saida'   THEN valor ELSE 0 END) AS saidas,
  SUM(CASE WHEN tipo='entrada' THEN valor ELSE -valor END) AS lucro
FROM movimentos
GROUP BY 1
ORDER BY 1 DESC;
