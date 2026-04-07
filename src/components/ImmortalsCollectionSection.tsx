"use client";

import Image from "next/image";
import Link from "next/link";
import SectionHeader from "./SectionHeader";

const products = [
  {
    id: 1,
    image: '/images/products/placeholder-430x575.jpg',
    supertitle: 'ORIGINAL USE KIN - IMMORTALS / COLEETION | INK SERIES',
    name: 'DOCE GUARDIÃ',
    price: 169.90,
    originalPrice: 189.90,
    discount: 8,
    href: '/produto/immortals-doce-guardia',
  },
  {
    id: 2,
    image: '/images/products/placeholder-430x575.jpg',
    supertitle: 'ORIGINAL USE KIN - IMMORTALS / COLEETION | INK SERIES',
    name: 'NOME DO PRODUTO - PODE SER QUE SEJA DUAS LINHAS',
    price: 169.90,
    originalPrice: 189.90,
    discount: 8,
    href: '/produto/immortals-2',
  },
  {
    id: 3,
    image: '/images/products/placeholder-430x575.jpg',
    supertitle: 'ORIGINAL USE KIN - IMMORTALS / COLEETION | INK SERIES',
    name: 'CAÇADOR DE PIRATAS',
    price: 169.90,
    originalPrice: 189.90,
    discount: 8,
    href: '/produto/immortals-cacador-de-piratas',
  },
  {
    id: 4,
    image: '/images/products/placeholder-430x575.jpg',
    supertitle: 'ORIGINAL USE KIN - IMMORTALS / COLEETION | INK SERIES',
    name: 'RAINHA DO CAOS',
    price: 169.90,
    originalPrice: 189.90,
    discount: 8,
    href: '/produto/immortals-rainha-do-caos',
  },
];

export default function ImmortalsCollectionSection() {
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
      <div 
        className="grid"
        style={{ 
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px'
        }}
      >
        {products.map((product) => (
          <div key={product.id} className="w-full">
            {/* Product Image */}
            <div className="relative overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={430}
                height={575}
                className="w-full h-auto object-cover"
              />
            </div>

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
                    DE: {formatCurrency(product.originalPrice)}
                  </span>
                </div>
              )}

              {/* Buy Button */}
              <Link
                href={product.href}
                className="block text-center font-bold text-white rounded-full transition-all hover:brightness-110"
                style={{ 
                  fontSize: '15px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  backgroundColor: '#DAA520',
                  padding: '14px',
                  borderRadius: '999px',
                  width: 'fit-content',
                  minWidth: '45%',
                  maxWidth: '50%',
                  margin: '16px 0 0 0',
                  textDecoration: 'none'
                }}
              >
                COMPRAR
              </Link>
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
