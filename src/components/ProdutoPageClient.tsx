'use client'
import { useState } from 'react'
import Image from 'next/image'

interface Imagem { id: string; url: string; ordem: number; isPrincipal: boolean }
interface Estoque { tamanho: string | null; cor: string | null; quantidade: number }
interface Produto {
  id: string; nome: string; tipo: string; categoria: string
  precoAtual: number; precoDe: number | null; cores: string[]
  descricaoCurta: string | null; descricaoLonga: string | null
  entregaPrazo: string | null; informacoes: string | null
  status: string; imagens: Imagem[]; estoque: Estoque[]
  colecao: { nome: string; slug: string } | null
}

export default function ProdutoPageClient({ produto }: { produto: Produto }) {
  const imagemPrincipal = produto.imagens.find(i => i.isPrincipal) || produto.imagens[0]
  const miniaturas = produto.imagens.filter(i => !i.isPrincipal)
  const [imagemAtiva, setImagemAtiva] = useState(imagemPrincipal?.url || '')
  const [corSelecionada, setCorSelecionada] = useState<string>(produto.cores?.[0] || '')
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string>('')
  const [quantidade, setQuantidade] = useState(1)
  const [abaAtiva, setAbaAtiva] = useState('descricao')

  const tamanhos = produto.tipo === 'camiseta' ? ['P', 'M', 'G', 'GG'] : []
  
  const estoqueDisponivel = (tamanho: string, cor: string) => {
    const item = produto.estoque.find(e => e.tamanho === tamanho && e.cor?.toLowerCase() === cor.toLowerCase())
    return item?.quantidade || 0
  }

  const estoqueMousepad = produto.estoque.find(e => !e.tamanho)?.quantidade || 0

  const precoFormatado = produto.precoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const precoDeFormatado = produto.precoDe?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const desconto = produto.precoDe ? Math.round((1 - produto.precoAtual / produto.precoDe) * 100) : null

  const handleComprar = () => {
    if (produto.tipo === 'camiseta' && !tamanhoSelecionado) {
      alert('Selecione um tamanho')
      return
    }
    const msg = produto.tipo === 'camiseta'
      ? `Olá! Quero comprar: ${produto.nome} - Tamanho: ${tamanhoSelecionado} - Cor: ${corSelecionada} - Quantidade: ${quantidade}` 
      : `Olá! Quero comprar: ${produto.nome} - Quantidade: ${quantidade}` 
    window.open(`https://wa.me/5562981316462?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px' }}>
      <div style={{ display: 'flex', gap: 64, alignItems: 'flex-start' }}>
        
        {/* Coluna esquerda - Imagens */}
        <div style={{ flex: '0 0 500px' }}>
          {/* Imagem principal */}
          <div style={{ width: '100%', aspectRatio: produto.tipo === 'camiseta' ? '816/1093' : '821/393', borderRadius: 12, overflow: 'hidden', background: '#F5F5F5', marginBottom: 12 }}>
            {imagemAtiva && (
              <img src={imagemAtiva} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>
          {/* Miniaturas */}
          {miniaturas.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div
                onClick={() => setImagemAtiva(imagemPrincipal?.url || '')}
                style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: imagemAtiva === imagemPrincipal?.url ? '2px solid #DAA520' : '2px solid #E5E5E5' }}
              >
                {imagemPrincipal && <img src={imagemPrincipal.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              {miniaturas.map(img => (
                <div key={img.id}
                  onClick={() => setImagemAtiva(img.url)}
                  style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: imagemAtiva === img.url ? '2px solid #DAA520' : '2px solid #E5E5E5' }}
                >
                  <img src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coluna direita - Informações */}
        <div style={{ flex: 1 }}>
          {produto.colecao && (
            <p style={{ fontSize: 13, color: '#DAA520', fontWeight: 500, textTransform: 'uppercase', marginBottom: 8 }}>
              {produto.colecao.nome}
            </p>
          )}
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#292929', marginBottom: 16, lineHeight: 1.2 }}>
            {produto.nome}
          </h1>

          {/* Preço */}
          <div style={{ marginBottom: 24 }}>
            {produto.precoDe && (
              <p style={{ fontSize: 14, color: '#888', textDecoration: 'line-through', marginBottom: 4 }}>
                DE: {precoDeFormatado}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <p style={{ fontSize: 32, fontWeight: 700, color: '#292929' }}>{precoFormatado}</p>
              {desconto && (
                <span style={{ background: '#46A520', color: '#fff', padding: '4px 10px', borderRadius: 999, fontSize: 13, fontWeight: 700 }}>
                  -{desconto}%
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
              em até 12x sem juros
            </p>
          </div>

          {produto.descricaoCurta && (
            <p style={{ fontSize: 14, color: '#292929', marginBottom: 24, lineHeight: 1.6 }}>
              {produto.descricaoCurta}
            </p>
          )}

          {/* Cores -- só camiseta */}
          {produto.tipo === 'camiseta' && produto.cores?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 8 }}>
                Cor: <span style={{ fontWeight: 700 }}>{corSelecionada}</span>
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {produto.cores.map(cor => (
                  <button key={cor} onClick={() => setCorSelecionada(cor)}
                    style={{ padding: '8px 16px', borderRadius: 8, border: corSelecionada === cor ? '2px solid #DAA520' : '2px solid #E5E5E5', background: corSelecionada === cor ? '#FFF8E1' : '#fff', cursor: 'pointer', fontSize: 14, color: '#292929', fontWeight: corSelecionada === cor ? 600 : 400 }}>
                    {cor}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tamanhos -- só camiseta */}
          {produto.tipo === 'camiseta' && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 8 }}>Tamanho:</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {tamanhos.map(tam => {
                  const estq = estoqueDisponivel(tam, corSelecionada)
                  return (
                    <button key={tam} onClick={() => estq > 0 && setTamanhoSelecionado(tam)}
                      disabled={estq === 0}
                      style={{ width: 48, height: 48, borderRadius: 8, border: tamanhoSelecionado === tam ? '2px solid #DAA520' : '2px solid #E5E5E5', background: tamanhoSelecionado === tam ? '#FFF8E1' : estq === 0 ? '#F5F5F5' : '#fff', cursor: estq === 0 ? 'not-allowed' : 'pointer', fontSize: 14, color: estq === 0 ? '#AAAAAA' : '#292929', fontWeight: tamanhoSelecionado === tam ? 600 : 400 }}>
                      {tam}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quantidade */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 8 }}>Quantidade:</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => setQuantidade(q => Math.max(1, q - 1))}
                style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #E5E5E5', background: '#fff', cursor: 'pointer', fontSize: 18, color: '#292929' }}>-</button>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#292929', minWidth: 24, textAlign: 'center' }}>{quantidade}</span>
              <button onClick={() => setQuantidade(q => q + 1)}
                style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #E5E5E5', background: '#fff', cursor: 'pointer', fontSize: 18, color: '#292929' }}>+</button>
            </div>
          </div>

          {/* Botão comprar */}
          <button onClick={handleComprar}
            style={{ width: '100%', padding: '16px', background: '#DAA520', color: '#fff', border: 'none', borderRadius: 999, fontSize: 16, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            COMPRAR VIA WHATSAPP
          </button>

          {produto.tipo === 'mousepad' && estoqueMousepad > 0 && (
            <p style={{ fontSize: 13, color: '#46A520', textAlign: 'center' }}>
              {estoqueMousepad} unidades disponíveis
            </p>
          )}
        </div>
      </div>

      {/* Abas de informações */}
      <div style={{ marginTop: 64 }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #E5E5E5', marginBottom: 32 }}>
          {['descricao', 'entrega', produto.tipo === 'mousepad' ? 'informacoes' : 'guia'].map(aba => (
            <button key={aba} onClick={() => setAbaAtiva(aba)}
              style={{ padding: '12px 24px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: abaAtiva === aba ? 700 : 400, color: abaAtiva === aba ? '#292929' : '#888', borderBottom: abaAtiva === aba ? '2px solid #DAA520' : '2px solid transparent', marginBottom: -2 }}>
              {aba === 'descricao' ? 'Descrição' : aba === 'entrega' ? 'Entrega e Prazo' : aba === 'informacoes' ? 'Informações' : 'Guia de Tamanhos'}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: 800 }}>
          {abaAtiva === 'descricao' && (
            <div style={{ fontSize: 15, color: '#292929', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {produto.descricaoLonga || 'Descrição não disponível.'}
            </div>
          )}
          {abaAtiva === 'entrega' && (
            <div style={{ fontSize: 15, color: '#292929', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {produto.entregaPrazo || 'Informações de entrega não disponíveis.'}
            </div>
          )}
          {abaAtiva === 'informacoes' && (
            <div style={{ fontSize: 15, color: '#292929', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {produto.informacoes || 'Informações não disponíveis.'}
            </div>
          )}
          {abaAtiva === 'guia' && produto.tipo === 'camiseta' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F5F5F5' }}>
                  {['Tamanho', 'Largura', 'Comprimento', 'Mangas'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#292929' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[['P', '52cm', '71cm', '24cm'], ['M', '55cm', '73cm', '25cm'], ['G', '58cm', '75cm', '26cm'], ['GG', '61cm', '77cm', '27cm']].map(row => (
                  <tr key={row[0]} style={{ borderBottom: '1px solid #E5E5E5' }}>
                    {row.map((cell, i) => (
                      <td key={i} style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
