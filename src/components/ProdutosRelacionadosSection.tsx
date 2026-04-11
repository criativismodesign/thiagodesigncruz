'use client'

import Image from 'next/image'
import Link from 'next/link'
import SectionHeader from './SectionHeader'
import { useCartStore } from '@/store/cart-store'
import { toast } from 'sonner'

export default function ProdutosRelacionadosSection() {
  const addItem = useCartStore((s) => s.addItem)

  const camisetas = [
    { 
      id: 1, 
      image: '/images/products/placeholder-430x575.jpg', 
      supertitle: 'ORIGINAL USE KIN - MY LIFE MY STYLE / COLEETION | STREET ART', 
      name: 'DOCE GUARDIÃ', 
      price: 169.90, 
      originalPrice: 189.90, 
      discount: 8, 
      href: '/produto/doce-guardia' 
    },
    { 
      id: 2, 
      image: '/images/products/placeholder-430x575.jpg', 
      supertitle: 'ORIGINAL USE KIN - MY LIFE MY STYLE / COLEETION | STREET ART', 
      name: 'VIAJANTE DO FUTURO', 
      price: 169.90, 
      originalPrice: 189.90, 
      discount: 8, 
      href: '/produto/viajante-do-futuro' 
    },
    { 
      id: 3, 
      image: '/images/products/placeholder-430x575.jpg', 
      supertitle: 'ORIGINAL USE KIN - MY LIFE MY STYLE / COLEETION | STREET ART', 
      name: 'CAÇADOR DE PIRATAS', 
      price: 169.90, 
      originalPrice: 189.90, 
      discount: 8, 
      href: '/produto/cacador-de-piratas' 
    },
    { 
      id: 4, 
      image: '/images/products/placeholder-430x575.jpg', 
      supertitle: 'ORIGINAL USE KIN - MY LIFE MY STYLE / COLEETION | STREET ART', 
      name: 'RAINHA DO CAOS', 
      price: 169.90, 
      originalPrice: 189.90, 
      discount: 8, 
      href: '/produto/rainha-do-caos' 
    },
  ]

  const mousepads = [
    { 
      id: 1, 
      image: '/images/products/placeholder-mousepad-600x290.jpg', 
      supertitle: 'ORIGINAL USE KIN - MY LIFE MY STYLE / COLEETION | STREET ART', 
      name: 'DOCE GUARDIÃ', 
      price: 169.90, 
      originalPrice: 189.90, 
      discount: 8, 
      href: '/produto/mousepad-doce-guardia' 
    },
    { 
      id: 2, 
      image: '/images/products/placeholder-mousepad-600x290.jpg', 
      supertitle: 'ORIGINAL USE KIN - MY LIFE MY STYLE / COLEETION | STREET ART', 
      name: 'CAÇADOR DE PIRATAS', 
      price: 169.90, 
      originalPrice: 189.90, 
      discount: 8, 
      href: '/produto/mousepad-cacador-de-piratas' 
    },
    { 
      id: 3, 
      image: '/images/products/placeholder-mousepad-600x290.jpg', 
      supertitle: 'ORIGINAL USE KIN - MY LIFE MY STYLE / COLEETION | STREET ART', 
      name: 'RAINHA DO CAOS', 
      price: 169.90, 
      originalPrice: 189.90, 
      discount: 8, 
      href: '/produto/mousepad-rainha-do-caos' 
    },
  ]

  const handleAddToCart = (produto: any, tipo: string) => {
    addItem({
      id: `${produto.id}-${tipo}`,
      productId: produto.id.toString(),
      name: produto.name,
      price: produto.price,
      image: produto.image,
      quantity: 1,
      type: tipo,
    })
    
    toast.success("Produto adicionado ao carrinho!")
  }

  return (
    <section style={{ backgroundColor: '#FFFFFF', padding: '100px 40px' }}>
      <SectionHeader 
        title="PRODUTOS RELACIONADOS" 
        subtitle="USE KIN | ADICIONE TAMBÉM" 
      />

      {/* BLOCO 1 - 4 Camisetas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '24px',
        marginBottom: '48px'
      }}>
        {camisetas.map((camiseta) => (
          <div key={camiseta.id} style={{ textAlign: 'left' }}>
            {/* Imagem */}
            <Link href={camiseta.href}>
              <div style={{ 
                position: 'relative', 
                width: '100%', 
                height: '575px',
                marginBottom: '16px',
                cursor: 'pointer'
              }}>
                <Image
                  src={camiseta.image}
                  alt={camiseta.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 430px) 100vw, 430px"
                />
              </div>
            </Link>

            {/* Supertítulo */}
            <div style={{ 
              fontSize: '12px', 
              color: '#AAAAAA', 
              fontWeight: 400, 
              marginBottom: '8px',
              lineHeight: 1.4
            }}>
              {camiseta.supertitle}
            </div>

            {/* Nome */}
            <Link href={camiseta.href}>
              <h3 style={{ 
                fontSize: '20px', 
                color: '#292929', 
                fontWeight: 700, 
                marginBottom: '8px',
                lineHeight: 1.2,
                cursor: 'pointer'
              }}>
                {camiseta.name}
              </h3>
            </Link>

            {/* Preço */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px', color: '#292929', fontWeight: 600 }}>
                  R$ {camiseta.price.toFixed(2).replace('.', ',')}
                </span>
                {camiseta.discount && (
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#F0484A', 
                    fontWeight: 400,
                    backgroundColor: '#FFEBEB',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    -{camiseta.discount}%
                  </span>
                )}
              </div>
              {camiseta.originalPrice && (
                <span style={{ 
                  fontSize: '16px', 
                  color: '#AAAAAA', 
                  textDecoration: 'line-through' 
                }}>
                  R$ {camiseta.originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>

            {/* Botão COMPRAR */}
            <button
              onClick={() => handleAddToCart(camiseta, 'camiseta')}
              style={{
                width: 'fit-content',
                minWidth: '45%',
                maxWidth: '50%',
                padding: '12px 24px',
                backgroundColor: '#46A520',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                margin: '16px 0 0 0',
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
        ))}
      </div>

      {/* BLOCO 2 - 3 Mousepads */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '24px'
      }}>
        {mousepads.map((mousepad) => (
          <div key={mousepad.id} style={{ textAlign: 'center' }}>
            {/* Imagem */}
            <Link href={mousepad.href}>
              <div style={{ 
                position: 'relative', 
                width: '100%', 
                height: '290px',
                marginBottom: '16px',
                cursor: 'pointer'
              }}>
                <Image
                  src={mousepad.image}
                  alt={mousepad.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 600px) 100vw, 600px"
                />
              </div>
            </Link>

            {/* Supertítulo */}
            <div style={{ 
              fontSize: '12px', 
              color: '#AAAAAA', 
              fontWeight: 400, 
              marginBottom: '8px',
              lineHeight: 1.4
            }}>
              {mousepad.supertitle}
            </div>

            {/* Nome */}
            <Link href={mousepad.href}>
              <h3 style={{ 
                fontSize: '20px', 
                color: '#292929', 
                fontWeight: 700, 
                marginBottom: '8px',
                lineHeight: 1.2,
                cursor: 'pointer'
              }}>
                {mousepad.name}
              </h3>
            </Link>

            {/* Preço */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <span style={{ fontSize: '20px', color: '#292929', fontWeight: 600 }}>
                  R$ {mousepad.price.toFixed(2).replace('.', ',')}
                </span>
                {mousepad.discount && (
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#F0484A', 
                    fontWeight: 400,
                    backgroundColor: '#FFEBEB',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    -{mousepad.discount}%
                  </span>
                )}
              </div>
              {mousepad.originalPrice && (
                <span style={{ 
                  fontSize: '16px', 
                  color: '#AAAAAA', 
                  textDecoration: 'line-through' 
                }}>
                  R$ {mousepad.originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>

            {/* Botão COMPRAR */}
            <button
              onClick={() => handleAddToCart(mousepad, 'mousepad')}
              style={{
                width: 'fit-content',
                minWidth: '45%',
                maxWidth: '50%',
                padding: '12px 24px',
                backgroundColor: '#46A520',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                margin: '16px auto 0',
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
        ))}
      </div>

      {/* Responsividade */}
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            padding: 100px 24px !important;
          }
          
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          div[style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
