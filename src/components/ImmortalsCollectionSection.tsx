"use client";

import Image from "next/image";
import Link from "next/link";
import SectionHeader from "./SectionHeader";

interface Produto {
  id: string
  nome: string
  tipo: string
  categoria: string
  precoAtual: number
  precoDe: number | null
  status: string
  colecaoId: string | null
  imagens: { id: string; url: string; ordem: number; isPrincipal: boolean }[]
  href?: string
}

interface Props {
  produtos: Produto[]
}

export default function ImmortalsCollectionSection({ produtos }: Props) {
  // Mapear produtos para o formato existente do componente:
  const products = produtos.map(p => ({
    id: p.id,
    image: p.imagens.find(i => i.isPrincipal)?.url || 
           p.imagens[0]?.url || 
           '/images/products/placeholder-430x575.jpg',
    supertitle: 'ORIGINAL USE KIN - IMMORTALS / COLEETION | INK SERIES',
    name: p.nome,
    price: p.precoAtual,
    originalPrice: p.precoDe,
    discount: p.precoDe ? Math.round((1 - p.precoAtual / p.precoDe) * 100) : null,
    href: p.href || `/produto/${p.id}`,
  }))
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <section 
      className="w-full"
      style={{ 
        backgroundColor: '#FFFFFF',
        paddingTop: '100px',
        paddingBottom: '100px',
        paddingLeft: '40px',
        paddingRight: '40px'
      }}
    >
      {/* Section Header */}
      <div className="mb-[60px]">
        <SectionHeader 
          title="IMMORTALS"
          subtitle="COLEETION | INK SERIES"
        />
      </div>

      {/* Products Grid */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '24px',
      }}>
        {products.map((product) => (
          <div key={product.id} style={{ width: '285px', flex: '0 0 285px' }}>
            {/* Product Image */}
            <Link href={product.href}>
              <div className="relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={430}
                  height={575}
                  className="w-full h-auto object-cover transition-transform duration-300 ease hover:scale-105"
                />
              </div>
            </Link>

            {/* Product Info */}
            <div style={{ paddingTop: '16px' }}>
              {/* Supertítulo */}
              <p 
                className="font-normal uppercase"
                style={{ 
                  fontSize: '14px',
                  color: '#292929',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  lineHeight: '1.4'
                }}
              >
                {product.supertitle}
              </p>

              {/* Product Name */}
              <Link href={product.href} style={{ textDecoration: 'none' }}>
                <h3 
                  className="font-semibold uppercase"
                  style={{ 
                    fontSize: '18px',
                    color: '#292929',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    lineHeight: '1.2'
                  }}
                >
                  {product.name}
                </h3>
              </Link>

              {/* Price Line */}
              <div 
                className="flex items-center"
                style={{ 
                  gap: '8px',
                  marginTop: '8px'
                }}
              >
                <span 
                  className="font-semibold"
                  style={{ 
                    fontSize: '18px',
                    color: '#292929',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600
                  }}
                >
                  {formatCurrency(product.price)}
                </span>
                
                {product.discount && (
                  <span 
                    className="font-normal"
                    style={{ 
                      fontSize: '12px',
                      color: '#F0484A',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400
                    }}
                  >
                    -{product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Original Price */}
              {product.discount && (
                <div style={{ marginTop: '4px' }}>
                  <span 
                    className="font-normal"
                    style={{ 
                      fontSize: '14px',
                      color: '#AAAAAA',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      textDecoration: 'line-through'
                    }}
                  >
                    DE: {formatCurrency(product.originalPrice ?? 0)}
                  </span>
                </div>
              )}

              {/* Buy Button */}
              <a
                href={product.href}
                style={{ 
                  display: 'block',
                  textAlign: 'center',
                  fontSize: '15px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  backgroundColor: '#DAA520',
                  color: '#fff',
                  padding: '14px',
                  borderRadius: '999px',
                  width: 'fit-content',
                  minWidth: '45%',
                  maxWidth: '50%',
                  margin: '16px 0 0 0',
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

      {/* Mobile Responsiveness */}
      <style jsx>{`
        @media (max-width: 768px) {
          .section-container {
            padding-top: 60px !important;
            padding-bottom: 60px !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .products-grid {
            grid-template-columns: 1fr !important;
          }
          .product-name {
            font-size: 20px !important;
          }
        }
      `}</style>

      <style jsx global>{`
        .section-container {
          padding-top: 100px;
          padding-bottom: 100px;
          padding-left: 40px;
          padding-right: 40px;
        }
        .products-grid {
          grid-template-columns: repeat(4, 1fr);
        }
        .product-name {
          font-size: 24px;
          color: #292929;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          text-transform: uppercase;
        }
      `}</style>
    </section>
  );
}
