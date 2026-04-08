'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function CategoriasLadoDireito() {
  const [selectedOrder, setSelectedOrder] = useState('Classificação Padrão')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(16)

  const opcoes = [
    'Classificação Padrão',
    'Ordenar Por Popularidade',
    'Ordenar Por Mais Recente',
    'Ordenar Por Mais Antigas',
    'Ordenar Por Preço: Menor Para Maior',
    'Ordenar Por Preço: Maior Para Menor',
  ]

  const allProducts = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    image: '/images/products/placeholder-categorias-285x332.jpg',
    name: `NOME DO PRODUTO ${i + 1}`,
    price: 169.90,
    originalPrice: 189.90,
    discount: 8,
    href: `/produto/produto-${i + 1}`,
  }))

  const visibleProducts = allProducts.slice(0, visibleCount)
  const hasMore = visibleCount < allProducts.length

  const getSupertitle = (index: number) => {
    return index % 2 === 0 ? 'MousePad' : 'Camiseta'
  }

  return (
    <div style={{
      flex: 1,
      marginTop: '100px',
      marginBottom: '100px'
    }}>
        {/* CABEÇALHO - TOP */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          {/* Texto de visualização */}
          <span style={{
            fontSize: '20px',
            fontWeight: 400,
            color: '#AAAAAA',
            fontFamily: 'Inter, sans-serif'
          }}>
            Visualização de {visibleProducts.length} de {allProducts.length} produtos
          </span>

          {/* Dropdown de ordenação */}
          <div style={{ position: 'relative' }}>
            <span style={{
              fontSize: '20px',
              fontWeight: 400,
              color: '#AAAAAA',
              fontFamily: 'Inter, sans-serif',
              marginRight: '12px'
            }}>
              Ordenar por
            </span>
            
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                padding: '10px 24px',
                backgroundColor: '#EFEFEF',
                border: '1px solid #AAAAAA',
                borderRadius: '999px',
                fontSize: '20px',
                fontWeight: 400,
                color: '#AAAAAA',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {selectedOrder}
              <span style={{ fontSize: '16px' }}>{'\u203a'}</span>
            </button>

            {/* Dropdown aberto */}
            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                zIndex: 100,
                top: '100%',
                right: 0,
                backgroundColor: '#FFFFFF',
                border: '1px solid #C4C4C4',
                borderRadius: '8px',
                minWidth: '300px',
                marginTop: '4px'
              }}>
                {opcoes.map((opcao, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedOrder(opcao)
                      setDropdownOpen(false)
                    }}
                    style={{
                      padding: '14px 20px',
                      fontSize: '20px',
                      fontWeight: 400,
                      color: selectedOrder === opcao ? '#292929' : '#D8D8D8',
                      backgroundColor: selectedOrder === opcao ? '#C4C4C4' : '#FFFFFF',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedOrder !== opcao) {
                        e.currentTarget.style.backgroundColor = '#EFEFEF'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedOrder !== opcao) {
                        e.currentTarget.style.backgroundColor = '#FFFFFF'
                      }
                    }}
                  >
                    {opcao}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LINHA DIVISÓRIA */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          marginBottom: '40px', 
          marginTop: '16px' 
        }}>
          <div style={{ 
            width: '100%', 
            height: '1px', 
            background: '#C4C4C4' 
          }} />
          <div style={{
            position: 'absolute', 
            top: 0, 
            left: 0,
            width: '100px', 
            height: '3px', 
            background: '#DAA520',
            marginTop: '-1px'
          }} />
        </div>

        {/* GRADE DE PRODUTOS - MID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px'
        }}>
          {visibleProducts.map((product, index) => (
            <div key={product.id}>
              <Link href={product.href} style={{ textDecoration: 'none' }}>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={285}
                  height={332}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    marginBottom: '12px'
                  }}
                />
              </Link>
              
              <div style={{ paddingTop: '12px', textAlign: 'left' }}>
                {/* Supertítulo */}
                <p style={{
                  fontSize: '11px',
                  fontWeight: 400,
                  color: '#292929',
                  textTransform: 'uppercase',
                  lineHeight: '1.4',
                  fontFamily: 'Inter, sans-serif',
                  margin: 0
                }}>
                  {getSupertitle(index)}
                </p>
                
                {/* Nome do produto */}
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#292929',
                  textTransform: 'uppercase',
                  marginTop: '5px',
                  fontFamily: 'Inter, sans-serif',
                  margin: '5px 0 0 0'
                }}>
                  {product.name}
                </h3>
                
                {/* Linha de preço */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  marginTop: '8px'
                }}>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#292929',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  
                  {product.discount && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 400,
                      color: '#F0484A',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      -{product.discount}% OFF
                    </span>
                  )}
                </div>
                
                {/* Preço "DE" */}
                {product.originalPrice && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 400,
                    color: '#AAAAAA',
                    textDecoration: 'line-through',
                    marginTop: '4px',
                    display: 'block',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
                
                {/* Botão COMPRAR */}
                <Link href={product.href} style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      width: '55%',
                      padding: '10px',
                      backgroundColor: '#DAA520',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 700,
                      fontFamily: 'Inter, sans-serif',
                      cursor: 'pointer',
                      marginTop: '16px',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#46A520'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#DAA520'
                    }}
                  >
                    COMPRAR
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* SETA REVELAR MAIS - BOT */}
        {hasMore && (
          <div style={{
            marginTop: '120px',
            marginBottom: '100px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => setVisibleCount(prev => prev + 16)}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'rgba(215, 215, 215, 0.3)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.3'
              }}
            >
              <span style={{
                fontSize: '24px',
                color: '#AAAAAA',
                transform: 'rotate(0deg)'
              }}>
                {'\u203a'}
              </span>
            </button>
          </div>
        )}

        {/* RESPONSIVIDADE */}
        <style jsx>{`
          @media (max-width: 768px) {
            div[style*="width: 1365px"] {
              width: 100%;
              margin-right: 24px;
            }
            
            div[style*="width: 1245px"] {
              width: 100%;
            }
            
            div[style*="grid-template-columns: repeat(4, 1fr)"] {
              grid-template-columns: repeat(2, 1fr);
            }
            
            button[style*="min-width: 300px"] {
              min-width: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  )
}
