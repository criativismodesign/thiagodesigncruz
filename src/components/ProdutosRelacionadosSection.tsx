'use client'

import Image from 'next/image'
import Link from 'next/link'
import SectionHeader from './SectionHeader'

export default function ProdutosRelacionadosSection() {
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

  return (
    <section style={{ 
      backgroundColor: '#FFFFFF',
      paddingTop: '100px',
      paddingBottom: '100px',
      paddingLeft: '40px',
      paddingRight: '40px'
    }}>
      {/* CABEÇALHO DA SEÇÃO */}
      <SectionHeader 
        title="PRODUTOS RELACIONADOS" 
        subtitle="USE KIN | ADICIONE TAMBÉM" 
      />

      {/* BLOCO 1 - 4 CAMISETAS */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        marginTop: '48px'
      }}>
        {camisetas.map((camiseta) => (
          <div key={camiseta.id} style={{ textAlign: 'left' }}>
            <Link href={camiseta.href} style={{ textDecoration: 'none', display: 'block' }}>
              <Image
                src={camiseta.image}
                alt={camiseta.name}
                width={430}
                height={575}
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  marginBottom: '16px',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              />
            </Link>
            
            <p style={{ 
              fontSize: '16px', 
              color: '#AAAAAA', 
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              textTransform: 'uppercase',
              marginBottom: '8px',
              lineHeight: '1.4'
            }}>
              {camiseta.supertitle}
            </p>
            
            <h3 style={{ 
              fontSize: '24px', 
              color: '#292929', 
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              textTransform: 'uppercase',
              marginBottom: '12px',
              lineHeight: '1.2'
            }}>
              {camiseta.name}
            </h3>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '8px'
            }}>
              <span style={{ 
                fontSize: '24px', 
                fontWeight: 600, 
                color: '#292929',
                fontFamily: 'Inter, sans-serif'
              }}>
                R$ {camiseta.price.toFixed(2).replace('.', ',')}
              </span>
              
              {camiseta.discount && (
                <span style={{ 
                  fontSize: '18px', 
                  fontWeight: 400, 
                  color: '#F0484A',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: 'rgba(240, 72, 74, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  -{camiseta.discount}% OFF
                </span>
              )}
            </div>
            
            {camiseta.originalPrice && (
              <span style={{ 
                fontSize: '18px', 
                fontWeight: 400, 
                color: '#AAAAAA',
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'line-through',
                display: 'block',
                marginBottom: '16px'
              }}>
                R$ {camiseta.originalPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
            
            <Link href={camiseta.href} style={{ textDecoration: 'none' }}>
              <button
                style={{
                  width: 'fit-content',
                  minWidth: '45%',
                  maxWidth: '50%',
                  padding: '12px 24px',
                  backgroundColor: '#DAA520',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '999px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  margin: '16px 0 0 0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#292929'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#DAA520'
                }}
              >
                COMPRAR
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* BLOCO 2 - 3 MOUSEPADS */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        marginTop: '48px'
      }}>
        {mousepads.map((mousepad) => (
          <div key={mousepad.id} style={{ textAlign: 'center' }}>
            <Link href={mousepad.href} style={{ textDecoration: 'none', display: 'block' }}>
              <Image
                src={mousepad.image}
                alt={mousepad.name}
                width={600}
                height={290}
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  marginBottom: '16px',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              />
            </Link>
            
            <p style={{ 
              fontSize: '16px', 
              color: '#AAAAAA', 
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              textTransform: 'uppercase',
              marginBottom: '8px',
              lineHeight: '1.4'
            }}>
              {mousepad.supertitle}
            </p>
            
            <h3 style={{ 
              fontSize: '24px', 
              color: '#292929', 
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              textTransform: 'uppercase',
              marginBottom: '12px',
              lineHeight: '1.2'
            }}>
              {mousepad.name}
            </h3>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              justifyContent: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ 
                fontSize: '24px', 
                fontWeight: 600, 
                color: '#292929',
                fontFamily: 'Inter, sans-serif'
              }}>
                R$ {mousepad.price.toFixed(2).replace('.', ',')}
              </span>
              
              {mousepad.discount && (
                <span style={{ 
                  fontSize: '18px', 
                  fontWeight: 400, 
                  color: '#F0484A',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: 'rgba(240, 72, 74, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  -{mousepad.discount}% OFF
                </span>
              )}
            </div>
            
            {mousepad.originalPrice && (
              <span style={{ 
                fontSize: '18px', 
                fontWeight: 400, 
                color: '#AAAAAA',
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'line-through',
                display: 'block',
                marginBottom: '16px'
              }}>
                R$ {mousepad.originalPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
            
            <Link href={mousepad.href} style={{ textDecoration: 'none' }}>
              <button
                style={{
                  width: 'fit-content',
                  minWidth: '45%',
                  maxWidth: '50%',
                  padding: '12px 24px',
                  backgroundColor: '#DAA520',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '999px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  margin: '16px auto 0',
                  display: 'block'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#292929'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#DAA520'
                }}
              >
                COMPRAR
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* RESPONSIVIDADE */}
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            padding-left: 24px;
            padding-right: 24px;
          }
          
          section > div:first-of-type {
            grid-template-columns: repeat(2, 1fr);
          }
          
          section > div:last-of-type {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
