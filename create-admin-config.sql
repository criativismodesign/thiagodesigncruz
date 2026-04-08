-- Criar tabela admin_config no Supabase
CREATE TABLE admin_config (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir registro inicial para TOTP
INSERT INTO admin_config (key, value) VALUES ('totp_configured', 'false');
