'use client'

import Image from 'next/image'
import Link from 'next/link'
import SectionHeader from './SectionHeader'

interface Produto {
  id: string
  image: string
  supertitle: string
  name: string
  price: number
  originalPrice: number | null
  discount: number | null
  href: string
}

interface Props {
  produtos: Produto[]
}

export default function ProdutosRelacionadosSection({ produtos }: Props) {

  // Separar produtos dinamicamente
  const camisetas = produtos.filter(p => 
    p.href.includes('/camiseta/') || 
    (p.image.includes('430x575') || p.image.includes('camiseta'))
  ).slice(0, 4)

  const mousepads = produtos.filter(p => 
    p.href.includes('/mousepad/') || 
    (p.image.includes('600x290') || p.image.includes('mousepad'))
  ).slice(0, 3)

  
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
            <Link
              href={camiseta.href}
              style={{
                display: 'inline-block',
                width: 'fit-content',
                minWidth: '45%',
                maxWidth: '50%',
                padding: '12px 24px',
                backgroundColor: '#DAA520',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                margin: '16px 0 0 0',
                textDecoration: 'none',
                textAlign: 'center',
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
            </Link>
          </div>
        ))}
      </div>

      {/* BLOCO 2 - 3 Mousepads */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '24px',
        marginTop: '48px'
      }}>
        {mousepads.map((mousepad) => (
          <div key={mousepad.id} style={{ width: '380px', flex: '0 0 380px' }}>
            {/* Product Image */}
            <Link href={mousepad.href}>
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <Image
                  src={mousepad.image}
                  alt={mousepad.name}
                  width={600}
                  height={290}
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                />
              </div>
            </Link>

            {/* Product Info - Centered */}
            <div style={{ paddingTop: '16px', textAlign: 'center' }}>
              {/* Supertítulo */}
              <p style={{ 
                fontSize: '14px',
                color: '#292929',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                lineHeight: '1.4',
                textTransform: 'uppercase'
              }}>
                {mousepad.supertitle}
              </p>

              {/* Product Name */}
              <Link href={mousepad.href} style={{ textDecoration: 'none' }}>
                <h3 style={{ 
                  fontSize: '24px',
                  color: '#292929',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  marginTop: '8px',
                  lineHeight: '1.2',
                  textTransform: 'uppercase'
                }}>
                  {mousepad.name}
                </h3>
              </Link>

              {/* Current Price */}
              <div style={{ 
                fontSize: '18px',
                color: '#292929',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                textTransform: 'uppercase',
                lineHeight: '1.2'
              }}>
                R$ {mousepad.price.toFixed(2).replace('.', ',')}
              </div>

              {/* Discount Line */}
              {mousepad.discount && (
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '4px'
                }}>
                  <span style={{ 
                    fontSize: '12px',
                    color: '#F0484A',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400
                  }}>
                    -{mousepad.discount}% OFF
                  </span>
                  <span style={{ 
                    fontSize: '14px',
                    color: '#AAAAAA',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    textDecoration: 'line-through'
                  }}>
                    DE: R$ {mousepad.originalPrice?.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              )}

              {/* Buy Button */}
              <a
                href={mousepad.href}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  borderRadius: '999px',
                  fontSize: '15px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  backgroundColor: '#DAA520',
                  padding: '14px',
                  width: 'fit-content',
                  minWidth: '45%',
                  maxWidth: '50%',
                  margin: '16px auto 0',
                  textDecoration: 'none',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#46A520'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DAA520'}
              >
                COMPRAR
              </a>
            </div>
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
          
          div[style*="width: '380px'"] {
            width: 100% !important;
            flex: 1 1 100% !important;
          }
        }
      `}</style>
    </section>
  )
}
