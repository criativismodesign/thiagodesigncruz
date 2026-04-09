-- Criar tabelas admin para o painel Use KIN
-- Execute este SQL diretamente no Supabase SQL Editor

-- Tabela Colecao
CREATE TABLE IF NOT EXISTS "Colecao" (
  "id" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "subtitulo" TEXT NOT NULL,
  "imagemCamiseta" TEXT,
  "imagemMousepad" TEXT,
  "visivelHome" BOOLEAN NOT NULL DEFAULT false,
  "ordemHome" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'ativa',
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizadoEm" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Colecao_pkey" PRIMARY KEY ("id")
);

-- Tabela Produto
CREATE TABLE IF NOT EXISTS "Produto" (
  "id" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "tipo" TEXT NOT NULL,
  "categoria" TEXT NOT NULL,
  "colecaoId" TEXT,
  "precoAtual" DOUBLE PRECISION NOT NULL,
  "precoDe" DOUBLE PRECISION,
  "descricaoCurta" TEXT,
  "descricaoLonga" TEXT,
  "entregaPrazo" TEXT,
  "informacoes" TEXT,
  "cores" TEXT[],
  "imagemGuiaTamanhos" TEXT,
  "status" TEXT NOT NULL DEFAULT 'ativo',
  "ordemSecao" INTEGER NOT NULL DEFAULT 0,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizadoEm" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- Tabela ImagemProduto
CREATE TABLE IF NOT EXISTS "ImagemProduto" (
  "id" TEXT NOT NULL,
  "produtoId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "ordem" INTEGER NOT NULL DEFAULT 0,
  "isPrincipal" BOOLEAN NOT NULL DEFAULT false,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ImagemProduto_pkey" PRIMARY KEY ("id")
);

-- Tabela Estoque
CREATE TABLE IF NOT EXISTS "Estoque" (
  "id" TEXT NOT NULL,
  "produtoId" TEXT NOT NULL,
  "tamanho" TEXT,
  "cor" TEXT,
  "quantidade" INTEGER NOT NULL DEFAULT 0,
  "minimo" INTEGER NOT NULL DEFAULT 3,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizadoEm" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Estoque_pkey" PRIMARY KEY ("id")
);

-- Tabela ProdutoRelacionado
CREATE TABLE IF NOT EXISTS "ProdutoRelacionado" (
  "id" TEXT NOT NULL,
  "produtoPrincipalId" TEXT NOT NULL,
  "produtoRelacionadoId" TEXT NOT NULL,
  "ordem" INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT "ProdutoRelacionado_pkey" PRIMARY KEY ("id")
);

-- Tabela HeroBanner
CREATE TABLE IF NOT EXISTS "HeroBanner" (
  "id" TEXT NOT NULL,
  "imagem" TEXT,
  "supertitulo" TEXT,
  "titulo" TEXT NOT NULL,
  "descricao" TEXT,
  "textoBotao" TEXT NOT NULL DEFAULT 'VER COLEÇÃO',
  "linkBotao" TEXT,
  "ordem" INTEGER NOT NULL DEFAULT 0,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizadoEm" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "HeroBanner_pkey" PRIMARY KEY ("id")
);

-- Tabela ConfigSite
CREATE TABLE IF NOT EXISTS "ConfigSite" (
  "id" TEXT NOT NULL,
  "chave" TEXT NOT NULL,
  "valor" TEXT NOT NULL,
  "atualizadoEm" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ConfigSite_pkey" PRIMARY KEY ("id")
);

-- Criar índices únicos
CREATE UNIQUE INDEX IF NOT EXISTS "ConfigSite_chave_key" ON "ConfigSite"("chave");

-- Inserir dados iniciais no HeroBanner
INSERT INTO "HeroBanner" ("id", "supertitulo", "titulo", "descricao", "textoBotao", "linkBotao", "ordem", "ativo", "criadoEm", "atualizadoEm")
VALUES 
  ('immortals-2026', 'Coleção os "Immortals" 2026', 'Camisetas STYLE', 'VISTA O ESTILO DOS SOBREVIVENTES MAIS INSANOS DESSE DE TODOS OS TEMPOS. OS IMMORTALS AQUELES QUE SEMPRE SE LEVANTAM.', 'VER COLEÇÃO', '/colecao/immortals', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('slide-2', NULL, 'Slide 2', NULL, 'VER COLEÇÃO', NULL, 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('slide-3', NULL, 'Slide 3', NULL, 'VER COLEÇÃO', NULL, 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('slide-4', NULL, 'Slide 4', NULL, 'VER COLEÇÃO', NULL, 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('slide-5', NULL, 'Slide 5', NULL, 'VER COLEÇÃO', NULL, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
