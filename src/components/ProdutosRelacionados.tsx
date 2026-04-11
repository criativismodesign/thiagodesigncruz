'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart-store'
import { toast } from 'sonner'

interface Produto {
  id: string
  nome: string
  tipo: string
  slug: string
  precoAtual: number
  precoDe: number | null
  imagens: Array<{ id: string; url: string; ordem: number; isPrincipal: boolean }>
}

interface Props {
  produtos: Produto[]
}

export default function ProdutosRelacionados({ produtos }: Props) {
  const addItem = useCartStore((s) => s.addItem)

  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  const handleAddToCart = (produto: Produto) => {
    addItem({
      id: produto.id,
      productId: produto.id,
      name: produto.nome,
      price: produto.precoAtual,
      image: produto.imagens.find(img => img.isPrincipal)?.url || produto.imagens[0]?.url || '',
      quantity: 1,
      type: produto.tipo,
    })
    
    toast.success("Produto adicionado ao carrinho!")
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '80px auto 0 auto', padding: '0 20px' }}>
      <h2 style={{ 
        fontSize: '32px', 
        fontWeight: 900, 
        color: '#292929', 
        textAlign: 'center', 
        marginBottom: '48px',
        textTransform: 'uppercase'
      }}>
        Produtos Relacionados
      </h2>
      
      <div style={{ 
        display: 'flex', 
        gap: '24px', 
        justifyContent: 'center', 
        flexWrap: 'wrap'
      }}>
        {produtos.map((produto) => {
          const imagemPrincipal = produto.imagens.find(img => img.isPrincipal) || produto.imagens[0]
          const desconto = produto.precoDe ? Math.round((1 - produto.precoAtual / produto.precoDe) * 100) : null
          
          return (
            <div 
              key={produto.id}
              style={{ 
                width: '280px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
              }}
            >
              {/* Imagem do Produto */}
              <Link href={`/${produto.tipo}/${produto.slug}`}>
                <div style={{ 
                  width: '100%', 
                  height: '280px', 
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}>
                  {imagemPrincipal && (
                    <Image
                      src={imagemPrincipal.url}
                      alt={produto.nome}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 280px) 100vw, 280px"
                    />
                  )}
                </div>
              </Link>

              {/* Informações do Produto */}
              <div style={{ padding: '20px' }}>
                {/* Nome */}
                <Link href={`/${produto.tipo}/${produto.slug}`}>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: 700, 
                    color: '#292929', 
                    marginBottom: '8px',
                    lineHeight: 1.3,
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}>
                    {produto.nome}
                  </h3>
                </Link>

                {/* Preço */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      fontSize: '20px', 
                      fontWeight: 600, 
                      color: '#292929' 
                    }}>
                      {formatarPreco(produto.precoAtual)}
                    </span>
                    {desconto && (
                      <span style={{ 
                        fontSize: '14px', 
                        color: '#F0484A', 
                        fontWeight: 400 
                      }}>
                        -{desconto}%
                      </span>
                    )}
                  </div>
                  {produto.precoDe && (
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#AAAAAA', 
                      textDecoration: 'line-through' 
                    }}>
                      {formatarPreco(produto.precoDe)}
                    </span>
                  )}
                </div>

                {/* Botão Comprar */}
                <button
                  onClick={() => handleAddToCart(produto)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#46A520',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#3A8C1A'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#46A520'
                  }}
                >
                  COMPRAR
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
