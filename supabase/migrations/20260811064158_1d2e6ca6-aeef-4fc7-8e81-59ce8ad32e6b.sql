ALTER TABLE public.config
  ADD COLUMN IF NOT EXISTS nome_empresa TEXT NOT NULL DEFAULT 'Minha Barbearia',
  ADD COLUMN IF NOT EXISTS subtitulo TEXT NOT NULL DEFAULT 'Gestão de barbearia',
  ADD COLUMN IF NOT EXISTS logo_url TEXT;