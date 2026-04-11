'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart-store'
import { toast } from 'sonner'
import NewsletterSection from '@/components/NewsletterSection'
import BannerBoxSection from '@/components/BannerBoxSection'

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
  const [activeTab, setActiveTab] = useState('informacoes')
  const [corSelecionada, setCorSelecionada] = useState<string>(produto.cores?.[0] || '')
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
    ? [...new Set((produto.cores || []).map((c: string) => c.trim().toLowerCase()))]
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
                  {produto.cores.map(cor => (
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

        {/* BOX DE ABAS */}
        <div style={{
          marginTop: '100px',
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto',
          border: '1px solid #E5E5E5',
          borderRadius: '8px'
        }}>
          {/* Cabeçalho das abas */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E5E5E5' }}>
            <button
              onClick={() => setActiveTab('informacoes')}
              style={{
                flex: 1,
                padding: '16px',
                backgroundColor: activeTab === 'informacoes' ? '#FFFFFF' : '#FFFFFF',
                color: activeTab === 'informacoes' ? '#292929' : '#AAAAAA',
                fontFamily: 'Inter, sans-serif',
                fontWeight: activeTab === 'informacoes' ? 600 : 400,
                fontSize: '16px',
                border: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === 'informacoes' ? '2px solid #DAA520' : 'none'
              }}
            >
              Informações
            </button>
            <button
              onClick={() => setActiveTab('descricao')}
              style={{
                flex: 1,
                padding: '16px',
                backgroundColor: activeTab === 'descricao' ? '#FFFFFF' : '#FFFFFF',
                color: activeTab === 'descricao' ? '#292929' : '#AAAAAA',
                fontFamily: 'Inter, sans-serif',
                fontWeight: activeTab === 'descricao' ? 600 : 400,
                fontSize: '16px',
                border: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === 'descricao' ? '2px solid #DAA520' : 'none'
              }}
            >
              Descrição / Entrega e Prazo
            </button>
          </div>

          {/* Conteúdo das abas */}
          <div style={{ padding: '32px' }}>
            {activeTab === 'informacoes' && (
              <div style={{
                fontSize: '20px',
                color: '#AAAAAA',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                lineHeight: 1.8
              }}>
                <div style={{ 
                  fontWeight: 700, 
                  marginBottom: '16px',
                  color: '#AAAAAA'
                }}>
                  MAIS INFORMAÇÕES
                </div>
                <p style={{ fontSize: 15, color: '#292929', lineHeight: 1.8 }}>
                  {renderMarkdown(produto.informacoes || 'Informações não disponíveis para este produto.')}
                </p>
              </div>
            )}

            {activeTab === 'descricao' && (
              <div style={{
                fontSize: '20px',
                color: '#AAAAAA',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                lineHeight: 1.8
              }}>
                {/* Bloco DESCRIÇÃO */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ 
                    fontWeight: 700, 
                    marginBottom: '16px',
                    color: '#AAAAAA'
                  }}>
                    DESCRIÇÃO
                  </div>
                  <p style={{ fontSize: 15, color: '#292929', lineHeight: 1.8 }}>
                    {renderMarkdown(produto.descricaoLonga || produto.descricaoCurta || 'Descrição não disponível para este produto.')}
                  </p>
                </div>

                {/* Bloco ENTREGA E PRAZO */}
                <div>
                  <div style={{ 
                    fontWeight: 700, 
                    marginBottom: '16px',
                    color: '#AAAAAA'
                  }}>
                    ENTREGA E PRAZO
                  </div>
                  <p style={{ fontSize: 15, color: '#292929', lineHeight: 1.8 }}>
                    {renderMarkdown(produto.entregaPrazo || 'Informações de entrega não disponíveis.')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <NewsletterSection source="produto" />
      <BannerBoxSection />

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
