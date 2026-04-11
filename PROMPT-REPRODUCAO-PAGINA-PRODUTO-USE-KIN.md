# PROMPT — Reproduzir Página de Produto Use KIN

Cole este documento inteiro em um novo chat do Claude para reproduzir a página de produto com o mesmo padrão.

---

## CONTEXTO DO PROJETO

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Estilização:** inline styles (sem Tailwind nas páginas de produto)
- **Imagens:** next/image com `fill` e `objectFit: cover`
- **Compra:** botão WhatsApp direto (não usa carrinho/checkout)
- **Número WhatsApp:** `5562981316462`

---

## ARQUITETURA DA ROTA

```
src/app/produto/camiseta/[slug]/page.tsx        → Server Component
src/app/produto/mousepad/[slug]/page.tsx        → Server Component
src/app/produto/[colecao]/camiseta/[slug]/page.tsx
src/app/produto/[colecao]/mousepad/[slug]/page.tsx
```

Todos os 4 routes usam o mesmo componente client: `ProdutoPageClient`.

**page.tsx (Server Component — idêntico para camiseta e mousepad):**
```tsx
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProdutoPageClient from '@/components/ProdutoPageClient'

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string; colecao?: string }>
}) {
  const { slug } = await params

  const produto = await prisma.produto.findFirst({
    where: { slug },
    include: {
      imagens: { orderBy: { ordem: 'asc' } },
      estoque: true,
      colecao: true,
    }
  })

  if (!produto) redirect('/')

  return <ProdutoPageClient produto={produto as any} />
}
```

---

## INTERFACES DE DADOS

```tsx
interface Estoque {
  id: string
  tamanho: string | null
  cor: string | null
  quantidade: number
}

interface Produto {
  id: string
  nome: string
  slug: string
  tipo: string           // 'camiseta' | 'mousepad'
  categoria: string
  precoAtual: number
  precoDe: number | null // preço riscado (de)
  descricaoCurta: string | null
  descricaoLonga: string | null
  status: string
  colecaoId: string | null
  imagens: { id: string; url: string; ordem: number; isPrincipal: boolean }[]
  estoque?: Estoque[]
  colecao?: { id: string; nome: string; slug: string }
}
```

---

## COMPONENTE PRINCIPAL — ProdutoPageClient.tsx

**Localização:** `src/components/ProdutoPageClient.tsx`

```tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface Estoque {
  id: string
  tamanho: string | null
  cor: string | null
  quantidade: number
}

interface Produto {
  id: string
  nome: string
  slug: string
  tipo: string
  categoria: string
  precoAtual: number
  precoDe: number | null
  descricaoCurta: string | null
  descricaoLonga: string | null
  status: string
  colecaoId: string | null
  imagens: { id: string; url: string; ordem: number; isPrincipal: boolean }[]
  estoque?: Estoque[]
  colecao?: { id: string; nome: string; slug: string }
}

interface Props {
  produto: Produto
}

export default function ProdutoPageClient({ produto }: Props) {
  const [imagemSelecionada, setImagemSelecionada] = useState(0)
  const [corSelecionada, setCorSelecionada] = useState<string>('')
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string>('')
  const [quantidade, setQuantidade] = useState(1)
  const [abaAtiva, setAbaAtiva] = useState('descricao')

  const imagemPrincipal = produto.imagens.find(img => img.isPrincipal) || produto.imagens[0]
  const imagensOrdenadas = [...produto.imagens].sort((a, b) => a.ordem - b.ordem)

  // Cores únicas — só para camiseta
  const coresUnicas = produto.tipo === 'camiseta'
    ? [...new Set(produto.estoque?.map(e => e.cor).filter((c): c is string => Boolean(c)) || [])]
    : []

  // Tamanhos disponíveis para a cor selecionada
  const tamanhosDisponiveis = corSelecionada
    ? produto.estoque?.filter(e => e.cor === corSelecionada && e.quantidade > 0) || []
    : produto.estoque?.filter(e => !e.cor && e.quantidade > 0) || []

  const estoqueTotal = tamanhosDisponiveis.reduce((sum, item) => sum + item.quantidade, 0)

  const formatarPreco = (valor: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)

  // Mensagem WhatsApp
  const gerarMensagemWhatsApp = () => {
    const texto = `Olá! Gostaria de comprar:\n\n*${produto.nome}*\n${produto.colecao?.nome ? `Coleção: ${produto.colecao.nome}\n` : ''}${corSelecionada ? `Cor: ${corSelecionada}\n` : ''}${tamanhoSelecionado ? `Tamanho: ${tamanhoSelecionado}\n` : ''}Quantidade: ${quantidade}\n\nValor: ${formatarPreco(produto.precoAtual * quantidade)}\n\nPodem me ajudar com o pedido?`
    return `https://wa.me/5562981316462?text=${encodeURIComponent(texto)}`
  }

  // Tabela de medidas fixa — camiseta
  const tabelaMedidasCamiseta = [
    { tamanho: 'P',  peito: '96-104',  comprimento: '68', ombro: '44' },
    { tamanho: 'M',  peito: '104-112', comprimento: '72', ombro: '48' },
    { tamanho: 'G',  peito: '112-120', comprimento: '76', ombro: '52' },
    { tamanho: 'GG', peito: '120-128', comprimento: '80', ombro: '56' },
  ]

  return (
    <div style={{ display: 'flex', gap: '60px', padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* ── COLUNA ESQUERDA: Galeria ── */}
      <div style={{ flex: 1 }}>
        {/* Imagem principal */}
        <div style={{
          position: 'relative', width: '100%', height: '600px',
          marginBottom: '20px', background: '#fff', borderRadius: '12px', overflow: 'hidden'
        }}>
          <Image
            src={imagensOrdenadas[imagemSelecionada]?.url || imagemPrincipal?.url || '/images/products/placeholder-430x575.jpg'}
            alt={produto.nome}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Miniaturas */}
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
          {imagensOrdenadas.map((imagem, index) => (
            <button
              key={imagem.id}
              onClick={() => setImagemSelecionada(index)}
              style={{
                border: imagemSelecionada === index ? '2px solid #2563eb' : '2px solid #E5E5E5',
                borderRadius: '8px', padding: '4px', background: '#fff',
                cursor: 'pointer', flexShrink: 0
              }}
            >
              <div style={{ width: '80px', height: '80px', position: 'relative' }}>
                <Image src={imagem.url} alt={`${produto.nome} - ${index + 1}`} fill style={{ objectFit: 'cover' }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── COLUNA DIREITA: Informações ── */}
      <div style={{ flex: 1, minWidth: '400px' }}>
        <div style={{ background: '#fff', padding: '32px', borderRadius: '12px' }}>

          {/* Nome */}
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#292929', marginBottom: '8px', lineHeight: '1.2' }}>
            {produto.nome}
          </h1>

          {/* Coleção */}
          {produto.colecao && (
            <p style={{ fontSize: '16px', color: '#888', marginBottom: '20px' }}>
              Coleção: {produto.colecao.nome}
            </p>
          )}

          {/* Preços */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#292929' }}>
                {formatarPreco(produto.precoAtual)}
              </span>
              {produto.precoDe && (
                <>
                  <span style={{ fontSize: '18px', color: '#888', textDecoration: 'line-through' }}>
                    {formatarPreco(produto.precoDe)}
                  </span>
                  <span style={{
                    fontSize: '14px', color: '#F0484A', background: '#FEE2E2',
                    padding: '4px 8px', borderRadius: '4px', fontWeight: 600
                  }}>
                    {Math.round((1 - produto.precoAtual / produto.precoDe) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Descrição curta */}
          {produto.descricaoCurta && (
            <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6', marginBottom: '32px' }}>
              {produto.descricaoCurta}
            </p>
          )}

          {/* Seletor de Cores — só camiseta */}
          {produto.tipo === 'camiseta' && coresUnicas.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#292929', marginBottom: '12px', textTransform: 'uppercase' }}>
                Cor
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {coresUnicas.map(cor => (
                  <button
                    key={cor}
                    onClick={() => { setCorSelecionada(cor); setTamanhoSelecionado('') }}
                    style={{
                      border: corSelecionada === cor ? '2px solid #2563eb' : '2px solid #E5E5E5',
                      background: corSelecionada === cor ? '#EFF6FF' : '#fff',
                      padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                      fontSize: '14px', color: '#292929'
                    }}
                  >
                    {cor}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Seletor de Tamanhos — só camiseta */}
          {produto.tipo === 'camiseta' && tamanhosDisponiveis.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#292929', marginBottom: '12px', textTransform: 'uppercase' }}>
                Tamanho
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['P', 'M', 'G', 'GG'].map(tamanho => {
                  const disponivel = tamanhosDisponiveis.find(e => e.tamanho === tamanho)
                  return (
                    <button
                      key={tamanho}
                      onClick={() => setTamanhoSelecionado(tamanho || '')}
                      disabled={!disponivel}
                      style={{
                        border: tamanhoSelecionado === tamanho ? '2px solid #2563eb' : '2px solid #E5E5E5',
                        background: tamanhoSelecionado === tamanho ? '#EFF6FF' : disponivel ? '#fff' : '#F9FAFB',
                        padding: '8px 16px', borderRadius: '8px',
                        cursor: disponivel ? 'pointer' : 'not-allowed',
                        fontSize: '14px', color: disponivel ? '#292929' : '#CCC',
                        opacity: disponivel ? 1 : 0.5
                      }}
                    >
                      {tamanho}
                      {disponivel && (
                        <span style={{ fontSize: '12px', color: '#888', marginLeft: '4px' }}>
                          ({disponivel.quantidade})
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quantidade */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#292929', marginBottom: '12px', textTransform: 'uppercase' }}>
              Quantidade
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                style={{ width: '40px', height: '40px', border: '2px solid #E5E5E5', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', color: '#292929' }}
              >−</button>
              <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: '80px', height: '40px', border: '2px solid #E5E5E5', borderRadius: '8px', textAlign: 'center', fontSize: '16px', color: '#292929' }}
              />
              <button
                onClick={() => setQuantidade(quantidade + 1)}
                style={{ width: '40px', height: '40px', border: '2px solid #E5E5E5', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', color: '#292929' }}
              >+</button>
            </div>
          </div>

          {/* Botão Comprar WhatsApp */}
          <a
            href={gerarMensagemWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', width: '100%', padding: '16px',
              background: '#25D366', color: '#fff', textAlign: 'center',
              borderRadius: '12px', fontSize: '16px', fontWeight: 600,
              textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#128C7E'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#25D366'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            COMPRAR VIA WHATSAPP
          </a>

          {/* Estoque */}
          <p style={{ fontSize: '14px', color: '#666', marginTop: '16px', textAlign: 'center' }}>
            {estoqueTotal > 0 ? `${estoqueTotal} unidades em estoque` : 'Produto esgotado'}
          </p>
        </div>
      </div>

      {/* ── SEÇÃO INFERIOR: Abas ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 40px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>

          {/* Nav das abas */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E5E5E5', background: '#F9FAFB' }}>
            {['descricao', 'entrega', produto.tipo === 'camiseta' ? 'tamanhos' : 'informacoes'].map((aba) => (
              <button
                key={aba}
                onClick={() => setAbaAtiva(aba)}
                style={{
                  flex: 1, padding: '16px', border: 'none',
                  background: abaAtiva === aba ? '#fff' : 'transparent',
                  borderBottom: abaAtiva === aba ? '2px solid #2563eb' : '2px solid transparent',
                  fontSize: '14px', fontWeight: 600,
                  color: abaAtiva === aba ? '#2563eb' : '#666', cursor: 'pointer'
                }}
              >
                {aba === 'descricao' ? 'Descrição' : aba === 'entrega' ? 'Entrega e Prazo' : produto.tipo === 'camiseta' ? 'Guia de Tamanhos' : 'Informações'}
              </button>
            ))}
          </div>

          {/* Conteúdo das abas */}
          <div style={{ padding: '32px' }}>

            {abaAtiva === 'descricao' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#292929', marginBottom: '16px' }}>Descrição do Produto</h3>
                <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
                  {produto.descricaoLonga || produto.descricaoCurta || 'Descrição não disponível para este produto.'}
                </p>
              </div>
            )}

            {abaAtiva === 'entrega' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#292929', marginBottom: '16px' }}>Entrega e Prazo</h3>
                <div style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
                  <p style={{ marginBottom: '12px' }}><strong>Prazo de Produção:</strong> 3 a 5 dias úteis após confirmação do pagamento.</p>
                  <p style={{ marginBottom: '12px' }}><strong>Prazo de Entrega:</strong></p>
                  <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>
                    <li>Sudeste: 2 a 4 dias úteis</li>
                    <li>Sul/Centro-Oeste: 3 a 5 dias úteis</li>
                    <li>Norte/Nordeste: 5 a 7 dias úteis</li>
                  </ul>
                  <p><strong>Formas de Envio:</strong> Correios (PAC/SEDEX) ou Transportadora para pedidos maiores.</p>
                </div>
              </div>
            )}

            {abaAtiva === 'tamanhos' && produto.tipo === 'camiseta' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#292929', marginBottom: '16px' }}>Guia de Tamanhos - Camiseta</h3>
                {/* Imagem de referência: /imagens/hero/PAG-PRODUTOS-MEDIDAS-CAMISETAS-SITE-USE-KIN-SESSAO-INFO-PRODUTO.jpg */}
                {/* Diagrama mostra: Comprimento Manga (lateral esquerda), Lagura (horizontal no peito), Comprimento (vertical abaixo do peito) */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ background: '#F9FAFB' }}>
                        <th style={{ padding: '12px', border: '1px solid #E5E5E5', textAlign: 'left' }}>Tamanho</th>
                        <th style={{ padding: '12px', border: '1px solid #E5E5E5', textAlign: 'left' }}>Peito (cm)</th>
                        <th style={{ padding: '12px', border: '1px solid #E5E5E5', textAlign: 'left' }}>Comprimento (cm)</th>
                        <th style={{ padding: '12px', border: '1px solid #E5E5E5', textAlign: 'left' }}>Ombro (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tabelaMedidasCamiseta.map((medida) => (
                        <tr key={medida.tamanho}>
                          <td style={{ padding: '12px', border: '1px solid #E5E5E5', fontWeight: 600 }}>{medida.tamanho}</td>
                          <td style={{ padding: '12px', border: '1px solid #E5E5E5' }}>{medida.peito}</td>
                          <td style={{ padding: '12px', border: '1px solid #E5E5E5' }}>{medida.comprimento}</td>
                          <td style={{ padding: '12px', border: '1px solid #E5E5E5' }}>{medida.ombro}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ fontSize: '14px', color: '#666', marginTop: '16px' }}>
                  <strong>Dica:</strong> Para medir, use uma camiseta que você gosta e compare com as medidas da tabela.
                </p>
              </div>
            )}

            {abaAtiva === 'informacoes' && produto.tipo === 'mousepad' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#292929', marginBottom: '16px' }}>Informações - Mousepad</h3>
                <div style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
                  <p style={{ marginBottom: '12px' }}><strong>Material:</strong> Borracha antideslizante de alta qualidade com superfície de tecido.</p>
                  <p style={{ marginBottom: '12px' }}><strong>Dimensões:</strong> 80cm x 30cm (tamanho padrão).</p>
                  <p style={{ marginBottom: '12px' }}><strong>Acabamento:</strong> Bordas refiladas para maior durabilidade.</p>
                  <p style={{ marginBottom: '12px' }}><strong>Impressão:</strong> Sublimação, garantindo cores vibrantes e duradouras.</p>
                  <p style={{ marginBottom: '12px' }}><strong>Base:</strong> Antideslizante, mantendo o mousepad firme na superfície.</p>
                  <p><strong>Cuidados:</strong> Limpar com pano úmido e sabão neutro. Não usar produtos químicos fortes.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  )
}
```

---

## TOKENS DE DESIGN (cores usadas)

| Elemento                  | Cor       |
|---------------------------|-----------|
| Fundo geral               | `#F5F5F5` |
| Cards / painéis           | `#fff`    |
| Texto principal           | `#292929` |
| Texto secundário          | `#666`    |
| Texto muted               | `#888`    |
| Borda padrão              | `#E5E5E5` |
| Azul ativo (seleção/aba)  | `#2563eb` |
| Azul claro (bg seleção)   | `#EFF6FF` |
| Verde WhatsApp            | `#25D366` |
| Verde WhatsApp hover      | `#128C7E` |
| Vermelho desconto texto   | `#F0484A` |
| Vermelho desconto bg      | `#FEE2E2` |
| Fundo aba inativa         | `#F9FAFB` |
| Disabled bg               | `#F9FAFB` |
| Disabled text             | `#CCC`    |

---

## IMAGEM DE REFERÊNCIA — MEDIDAS CAMISETA

Arquivo: `public/imagens/hero/PAG-PRODUTOS-MEDIDAS-CAMISETAS-SITE-USE-KIN-SESSAO-INFO-PRODUTO.jpg`

Diagrama técnico (ilustração de camiseta branca) com 3 indicadores:
- **Comprimento Manga** — seta vertical na lateral esquerda (manga)
- **Lagura** — seta horizontal no peito (largura total)
- **Comprimento** — seta vertical descendo do peito até a barra

---

## REGRAS DE NEGÓCIO

- Seletores de **cor** e **tamanho** aparecem **apenas** para `tipo === 'camiseta'`
- Tamanhos fixos na ordem: `['P', 'M', 'G', 'GG']`
- Botão de tamanho fica **desabilitado** (opacidade 0.5, cursor not-allowed) se `quantidade === 0` no estoque
- Ao trocar a cor, o tamanho selecionado é **resetado**
- Desconto percentual calculado: `Math.round((1 - precoAtual / precoDe) * 100)`
- Estoque total exibido é a **soma** de todos os tamanhos disponíveis da cor selecionada
- Aba 3 muda dinamicamente: `'Guia de Tamanhos'` (camiseta) ou `'Informações'` (mousepad)
- Botão de compra abre WhatsApp com mensagem pré-montada incluindo: nome do produto, coleção, cor, tamanho, quantidade e valor total

---

## INFORMAÇÕES DO MOUSEPAD (aba Informações)

- Material: Borracha antideslizante + superfície de tecido
- Dimensões: 80cm x 30cm
- Acabamento: Bordas refiladas
- Impressão: Sublimação
- Base: Antideslizante
- Cuidados: pano úmido + sabão neutro

## MEDIDAS DA CAMISETA (aba Guia de Tamanhos)

| Tamanho | Peito (cm) | Comprimento (cm) | Ombro (cm) |
|---------|------------|------------------|------------|
| P       | 96–104     | 68               | 44         |
| M       | 104–112    | 72               | 48         |
| G       | 112–120    | 76               | 52         |
| GG      | 120–128    | 80               | 56         |

## PRAZOS DE ENTREGA (aba Entrega e Prazo)

- Produção: 3 a 5 dias úteis
- Sudeste: 2 a 4 dias úteis
- Sul/Centro-Oeste: 3 a 5 dias úteis
- Norte/Nordeste: 5 a 7 dias úteis
- Envio: Correios PAC/SEDEX ou Transportadora
