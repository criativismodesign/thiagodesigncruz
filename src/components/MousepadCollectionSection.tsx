"use client";

import Image from "next/image";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import { gerarUrlProduto } from "@/lib/produto-url";

interface Produto {
  id: string
  nome: string
  tipo: string
  categoria: string
  precoAtual: number
  precoDe: number | null
  status: string
  colecaoId: string | null
  slug: string | null
  imagens: { id: string; url: string; ordem: number; isPrincipal: boolean }[]
  colecao?: { slug: string } | null
  href?: string
}

interface Props {
  produtos: Produto[]
}

export default function MousepadCollectionSection({ produtos }: Props) {
  // Mapear produtos para o formato existente do componente:
  const products = produtos.map(p => ({
    id: p.id,
    image: p.imagens.find(i => i.isPrincipal)?.url || 
           p.imagens[0]?.url || 
           '/images/products/placeholder-mousepad-600x290.jpg',
    supertitle: 'ORIGINAL USE KIN - MY LIFE MY STYLE / COLEETION | STREET ART',
    name: p.nome,
    price: p.precoAtual,
    originalPrice: p.precoDe,
    discount: p.precoDe ? Math.round((1 - p.precoAtual / p.precoDe) * 100) : null,
    href: p.href || gerarUrlProduto({
      slug: p.slug || '',
      tipo: p.tipo,
      categoria: p.categoria,
      colecao: p.colecao
    }),
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
          title="MOUSE PAD - DESKPAD"
          subtitle="ALL COLLETIONS"
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
          <div key={product.id} style={{ width: '380px', flex: '0 0 380px' }}>
            {/* Product Image */}
            <Link href={product.href}>
              <div className="relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={290}
                  className="w-full h-auto object-cover transition-transform duration-300 ease hover:scale-105"
                />
              </div>
            </Link>

            {/* Product Info - Centered */}
            <div style={{ paddingTop: '16px', textAlign: 'center' }}>
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
                    fontSize: '24px',
                    color: '#292929',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    marginTop: '8px',
                    lineHeight: '1.2'
                  }}
                >
                  {product.name}
                </h3>
              </Link>

              {/* Current Price */}
              <div 
                className="font-semibold"
                style={{ 
                  fontSize: '18px',
                  color: '#292929',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  lineHeight: '1.2'
                }}
              >
                {formatCurrency(product.price)}
              </div>

              {/* Discount Line */}
              {product.discount && (
                <div 
                  className="flex justify-center items-center"
                  style={{ 
                    gap: '8px',
                    marginTop: '4px'
                  }}
                >
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
          .product-price {
            font-size: 18px !important;
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
          grid-template-columns: repeat(3, 1fr);
        }
        .product-name {
          font-size: 24px;
          color: #292929;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          text-transform: uppercase;
        }
        .product-price {
          font-size: 20px;
          color: #292929;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
        }
      `}</style>
    </section>
  );
}
