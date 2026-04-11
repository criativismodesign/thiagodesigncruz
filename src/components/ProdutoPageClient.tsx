'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart-store'
import { toast } from 'sonner'

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

interface Props {
  produto: Produto
}

export default function ProdutoPageClient({ produto }: Props) {
  const [activeImage, setActiveImage] = useState(produto.imagens.find(img => img.isPrincipal)?.url || produto.imagens[0]?.url || '')
  const [zoomOpen, setZoomOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [abaAtiva, setAbaAtiva] = useState(produto.tipo === 'camiseta' ? 'descricao' : 'informacoes')
  const [corSelecionada, setCorSelecionada] = useState<string>('')
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string>('')
  
  const addItem = useCartStore((s) => s.addItem)

  // Obter miniaturas ordenadas
  const imagensOrdenadas = [...produto.imagens].sort((a, b) => a.ordem - b.ordem)
  const thumbnails = imagensOrdenadas.map(img => img.url)

  // Tamanhos disponíveis para a cor selecionada
  const tamanhosDisponiveis = corSelecionada
    ? produto.estoque?.filter(e => e.cor === corSelecionada && e.quantidade > 0) || []
    : produto.estoque?.filter(e => !e.cor && e.quantidade > 0) || []

  // Obter cores únicas
  const coresUnicas = produto.tipo === 'camiseta'
    ? [...new Set((produto.cores as string[] || []).map(c => c.trim()))]
    : []

  // Formatar preço
  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  // Calcular desconto
  const desconto = produto.precoDe ? Math.round((1 - produto.precoAtual / produto.precoDe) * 100) : null

  // Renderizar markdown simples
  const renderMarkdown = (texto: string) => {
    return texto.split('\n').map((linha, idx) => {
      if (!linha.trim()) return <br key={idx} />
      const partes = linha.split(/(\*\*__.*?__\*\*|\*\*.*?\*\*)/g)
      return (
        <p key={idx} style={{ marginBottom: 8 }}>
          {partes.map((parte, i) => {
            if (parte.startsWith('**__') && parte.endsWith('__**')) {
              return <strong key={i}><u>{parte.slice(4, -4)}</u></strong>
            }
            if (parte.startsWith('**') && parte.endsWith('**')) {
              return <strong key={i}>{parte.slice(2, -2)}</strong>
            }
            return <span key={i}>{parte}</span>
          })}
        </p>
      )
    })
  }

  // Gerar breadcrumb links
  const getColecaoPath = () => {
    if (!produto.colecao) return '#'
    return `/categorias/${produto.colecao.slug}`
  }

  const handleAddToCart = () => {
    if (produto.tipo === 'camiseta' && !tamanhoSelecionado) {
      toast.error("Selecione um tamanho")
      return
    }

    addItem({
      id: `${produto.id}-${tamanhoSelecionado || 'default'}-${corSelecionada || 'default'}`,
      productId: produto.id,
      name: produto.nome,
      price: produto.precoAtual,
      image: activeImage,
      quantity,
      size: tamanhoSelecionado || undefined,
      color: corSelecionada || undefined,
      type: produto.tipo,
    })
    
    toast.success("Produto adicionado ao carrinho!")
  }

  return (
    <main>
      {/* Seção foto + info */}
      <div style={{ 
        padding: '100px 120px', 
        display: 'flex', 
        gap: '48px', 
        flexDirection: 'column' 
      }}>
        <div style={{ display: 'flex', gap: '48px', flexDirection: 'row' }}>
          {/* LADO ESQUERDO - Imagens */}
          <div style={{ width: '50%' }}>
            {/* Imagem grande */}
            <div 
              style={{ cursor: 'pointer' }}
              onClick={() => setZoomOpen(true)}
            >
              <Image
                src={activeImage}
                alt={produto.nome}
                width={produto.tipo === 'camiseta' ? 816 : 821}
                height={produto.tipo === 'camiseta' ? 1093 : 393}
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Miniaturas */}
            {thumbnails.length > 1 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginTop: '24px'
              }}>
                {thumbnails.map((thumb, index) => (
                  <div
                    key={index}
                    style={{ 
                      cursor: 'pointer',
                      border: activeImage === thumb ? '2px solid #DAA520' : 'none'
                    }}
                    onClick={() => setActiveImage(thumb)}
                  >
                    <Image
                      src={thumb}
                      alt={`Miniatura ${index + 1}`}
                      width={200}
                      height={96}
                      style={{ 
                        width: '100%', 
                        height: 'auto',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Popup de zoom */}
            {zoomOpen && (
              <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.85)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <button 
                  onClick={() => setZoomOpen(false)} 
                  style={{
                    position: 'absolute',
                    top: 24,
                    right: 24,
                    color: '#fff',
                    fontSize: 32,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
                <Image 
                  src={activeImage} 
                  width={produto.tipo === 'camiseta' ? 816 : 821} 
                  height={produto.tipo === 'camiseta' ? 1093 : 393} 
                  alt="Zoom"
                  style={{ maxWidth: '90vw', height: 'auto' }} 
                />
              </div>
            )}
          </div>

          {/* LADO DIREITO - Informações */}
          <div style={{ width: '50%' }}>
            {/* Breadcrumb */}
            <nav style={{ marginBottom: '24px' }}>
              <Link 
                href="/" 
                style={{ 
                  fontSize: '12px', 
                  color: '#BABABA', 
                  textDecoration: 'none',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Início
              </Link>
              {' '}
              <span style={{ color: '#BABABA' }}>·</span>
              {' '}
              <Link 
                href="/categorias/todos-produtos" 
                style={{ 
                  fontSize: '12px', 
                  color: '#BABABA', 
                  textDecoration: 'none',
                  fontFamily: 'Inter, sans-serif'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#DAA520'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#BABABA'}
              >
                Produtos
              </Link>
              {produto.colecao && (
                <>
                  {' '}
                  <span style={{ color: '#BABABA' }}>·</span>
                  {' '}
                  <Link 
                    href={getColecaoPath()} 
                    style={{ 
                      fontSize: '12px', 
                      color: '#BABABA', 
                      textDecoration: 'none',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#DAA520'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#BABABA'}
                  >
                    {produto.colecao.nome}
                  </Link>
                </>
              )}
              {' '}
              <span style={{ color: '#BABABA' }}>·</span>
              {' '}
              <span style={{ 
                fontSize: '12px', 
                color: '#292929',
                fontFamily: 'Inter, sans-serif'
              }}>
                {produto.nome}
              </span>
            </nav>

            {/* Identificação da coleção */}
            {produto.colecao && (
              <div style={{
                fontSize: '16px',
                color: '#AAAAAA',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                textTransform: 'uppercase',
                marginTop: '16px'
              }}>
                {produto.colecao.nome} | {produto.tipo.toUpperCase()}
              </div>
            )}

            {/* Identificação do produto */}
            <div style={{
              fontSize: '20px',
              color: '#292929',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              textTransform: 'uppercase',
              marginTop: '8px'
            }}>
              {produto.tipo === 'camiseta' ? 'CAMISETA' : 'MOUSE PAD / DESCKPAD'}
            </div>

            {/* Nome do produto */}
            <div style={{
              fontSize: '40px',
              color: '#292929',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              textTransform: 'uppercase',
              lineHeight: 1.1,
              marginTop: '8px'
            }}>
              {produto.nome}
            </div>

            {/* Linha de preço */}
            <div style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              marginTop: '16px'
            }}>
              <span style={{
                fontSize: '30px',
                color: '#292929',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600
              }}>
                {formatarPreco(produto.precoAtual)}
              </span>
              {desconto && (
                <span style={{
                  fontSize: '18px',
                  color: '#F0484A',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400
                }}>
                  -{desconto}% OFF
                </span>
              )}
            </div>

            {/* Preço "DE" */}
            {produto.precoDe && (
              <div style={{
                fontSize: '18px',
                color: '#AAAAAA',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                textDecoration: 'line-through',
                marginTop: '4px'
              }}>
                {formatarPreco(produto.precoDe)}
              </div>
            )}

            {/* Texto do produto */}
            {produto.descricaoCurta && (
              <div style={{
                fontSize: '20px',
                color: '#AAAAAA',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                marginTop: '24px',
                marginBottom: '24px'
              }}>
                {produto.descricaoCurta}
              </div>
            )}

            {/* CORES -- só camiseta */}
            {produto.tipo === 'camiseta' && produto.cores?.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <div style={{
                  fontSize: '20px',
                  color: '#292929',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  marginBottom: '12px'
                }}>
                  COR
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {coresUnicas.map(cor => (
                    <button
                      key={cor}
                      onClick={() => {
                        setCorSelecionada(cor)
                        setTamanhoSelecionado('')
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: corSelecionada === cor ? '2px solid #DAA520' : '2px solid #E5E5E5',
                        background: corSelecionada === cor ? '#FFF8E1' : '#fff',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#292929',
                        fontWeight: corSelecionada === cor ? 600 : 400
                      }}
                    >
                      {cor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAMANHOS -- só camiseta */}
            {produto.tipo === 'camiseta' && (
              <div style={{ marginTop: '24px' }}>
                <div style={{
                  fontSize: '20px',
                  color: '#292929',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  marginBottom: '12px'
                }}>
                  TAMANHO
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['P', 'M', 'G', 'GG'].map(tam => {
                    const estq = tamanhosDisponiveis.find(e => e.tamanho === tam)
                    return (
                      <button
                        key={tam}
                        onClick={() => estq && estq.quantidade > 0 && setTamanhoSelecionado(tam)}
                        disabled={!estq || estq.quantidade === 0}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: tamanhoSelecionado === tam ? '2px solid #DAA520' : '2px solid #E5E5E5',
                          background: tamanhoSelecionado === tam ? '#FFF8E1' : (!estq || estq.quantidade === 0) ? '#F5F5F5' : '#fff',
                          cursor: (!estq || estq.quantidade === 0) ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          color: (!estq || estq.quantidade === 0) ? '#AAAAAA' : '#292929',
                          fontWeight: tamanhoSelecionado === tam ? 600 : 400
                        }}
                      >
                        {tam}
                        {estq && (
                          <span style={{ fontSize: '12px', color: '#888', marginLeft: '4px' }}>
                            ({estq.quantidade})
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TAMANHO -- mousepad */}
            {produto.tipo === 'mousepad' && (
              <div style={{ marginTop: '24px' }}>
                <div style={{
                  fontSize: '20px',
                  color: '#292929',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  marginBottom: '12px'
                }}>
                  TAMANHO
                </div>
                <div style={{
                  backgroundColor: '#DAA520',
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '20px',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  display: 'inline-block'
                }}>
                  75 X 35 CM
                </div>
              </div>
            )}

            {/* QUANTIDADE */}
            <div style={{ marginTop: '24px' }}>
              <div style={{
                fontSize: '20px',
                color: '#292929',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                marginBottom: '12px'
              }}>
                QUANTIDADE
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0',
                border: 'none',
                borderRadius: '8px',
                overflow: 'hidden',
                width: '120px'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    backgroundColor: '#DAA520',
                    color: '#FFFFFF',
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  -
                </button>
                <div style={{
                  backgroundColor: '#DAA520',
                  color: '#FFFFFF',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    backgroundColor: '#DAA520',
                    color: '#FFFFFF',
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* BOTÃO ADICIONAR AO CARRINHO */}
            <button 
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#46A520',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                border: 'none',
                borderRadius: '999px',
                cursor: 'pointer',
                marginTop: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}
            >
              <Image
                src="/icons/Icones-Site-Use-KIN-carrinho-botao-comprar.svg"
                alt="Carrinho"
                width={20}
                height={20}
              />
              ADICIONAR AO CARRINHO
            </button>
          </div>
        </div>

        <div style={{ maxWidth: '850px', margin: '64px auto 0 auto', width: '100%' }}>
          {/* Navegação das abas */}
          <div style={{ display: 'flex', borderBottom: '2px solid #E5E5E5', marginBottom: 32 }}>
            {produto.tipo === 'camiseta' ? (
              <>
                {['descricao', 'entrega', 'guia'].map((aba, i) => {
                  const labels = ['Descrição', 'Entrega e Prazo', 'Guia de Tamanhos']
                  return (
                    <button key={aba} onClick={() => setAbaAtiva(aba)} style={{
                      padding: '12px 24px', border: 'none', background: 'transparent', cursor: 'pointer',
                      fontSize: 14, fontWeight: abaAtiva === aba ? 700 : 400,
                      color: abaAtiva === aba ? '#292929' : '#888',
                      borderBottom: abaAtiva === aba ? '2px solid #DAA520' : '2px solid transparent',
                      marginBottom: -2
                    }}>{labels[i]}</button>
                  )
                })}
              </>
            ) : (
              <>
                {['informacoes', 'descricao-entrega'].map((aba, i) => {
                  const labels = ['Informações', 'Descrição / Entrega e Prazo']
                  return (
                    <button key={aba} onClick={() => setAbaAtiva(aba)} style={{
                      padding: '12px 24px', border: 'none', background: 'transparent', cursor: 'pointer',
                      fontSize: 14, fontWeight: abaAtiva === aba ? 700 : 400,
                      color: abaAtiva === aba ? '#292929' : '#888',
                      borderBottom: abaAtiva === aba ? '2px solid #DAA520' : '2px solid transparent',
                      marginBottom: -2
                    }}>{labels[i]}</button>
                  )
                })}
              </>
            )}
          </div>

          {/* Conteúdo das abas */}
          <div style={{ fontSize: 15, color: '#292929', lineHeight: 1.8 }}>
            
            {/* CAMISETA - Descrição */}
            {produto.tipo === 'camiseta' && abaAtiva === 'descricao' && (
              <div>{renderMarkdown(produto.descricaoLonga || '')}</div>
            )}

            {/* CAMISETA - Entrega e Prazo */}
            {produto.tipo === 'camiseta' && abaAtiva === 'entrega' && (
              <div>{renderMarkdown(produto.entregaPrazo || '')}</div>
            )}

            {/* CAMISETA - Guia de Tamanhos */}
            {produto.tipo === 'camiseta' && abaAtiva === 'guia' && (
              <div>
                <p style={{ marginBottom: 24, color: '#292929' }}>
                  Confira as medidas antes de escolher o tamanho. A modelagem oversized foi pensada para um caimento mais solto, marcante e confortável.
                </p>
                <img 
                  src="/imagens/hero/PAG-PRODUTOS-MEDIDAS-CAMISETAS-SITE-USE-KIN-SESSAO-INFO-PRODUTO.jpg"
                  alt="Guia de Tamanhos"
                  style={{ width: '100%', maxWidth: 600, height: 500, objectFit: 'contain', display: 'block', marginBottom: 32, borderRadius: 8 }}
                />
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
                  <thead>
                    <tr style={{ background: '#F5F5F5' }}>
                      {['TAMANHO', 'LARGURA', 'COMPRIMENTO', 'MANGAS'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: '#292929', borderBottom: '2px solid #E5E5E5' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[['P','52cm','71cm','24cm'],['M','55cm','73cm','25cm'],['G','58cm','75cm','26cm'],['GG','61cm','77cm','27cm']].map(row => (
                      <tr key={row[0]} style={{ borderBottom: '1px solid #E5E5E5' }}>
                        {row.map((cell, i) => (
                          <td key={i} style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ fontSize: 13, color: '#888' }}>
                  <strong>OBS:</strong> As medidas podem variar 2cm para mais ou para menos.
                </p>
              </div>
            )}

            {/* MOUSEPAD - Informações */}
            {produto.tipo === 'mousepad' && abaAtiva === 'informacoes' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#292929', marginBottom: 16, textTransform: 'uppercase' }}>MAIS INFORMAÇÕES</h3>
                {renderMarkdown(produto.informacoes || '')}
              </div>
            )}

            {/* MOUSEPAD - Descrição / Entrega e Prazo */}
            {produto.tipo === 'mousepad' && abaAtiva === 'descricao-entrega' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#292929', marginBottom: 16, textTransform: 'uppercase' }}>DESCRIÇÃO</h3>
                {renderMarkdown(produto.descricaoLonga || '')}
                <hr style={{ margin: '32px 0', borderColor: '#E5E5E5' }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#292929', marginBottom: 16, textTransform: 'uppercase' }}>ENTREGA E PRAZO</h3>
                {renderMarkdown(produto.entregaPrazo || '')}
              </div>
            )}
          </div>
        </div>
      </div>

      
      {/* Responsividade */}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="flex-direction: row"] {
            flex-direction: column !important;
          }
          
          div[style*="padding: 32px"] {
            padding: 20px !important;
          }
          
          button[style*="font-size: 16px"] {
            font-size: 13px !important;
          }
          
          div[style*="padding: '100px 120px'"] {
            padding: 40px 20px !important;
          }
          
          div[style*="width: '50%'"] {
            width: 100% !important;
          }
          
          div[style*="fontSize: '40px'"] {
            font-size: 28px !important;
          }
          
          div[style*="fontSize: '30px'"] {
            font-size: 24px !important;
          }
          
          div[style*="fontSize: '20px'"] {
            font-size: 16px !important;
          }
        }
      `}</style>
    </main>
  )
}
