"use client";

import Image from "next/image";
import Link from "next/link";
import SectionHeader from "./SectionHeader";

const products = [
  {
    id: 1,
    image: '/images/products/placeholder-mousepad-600x290.jpg',
    supertitle: 'ORIGINAL USE KIN - MY LIFE MY STYLE / COLEETION | STREET ART',
    name: 'DOCE GUARDIÃ',
    price: 169.90,
    originalPrice: 189.90,
    discount: 8,
    href: '/produto/mousepad-doce-guardia',
  },
  {
    id: 2,
    image: '/images/products/placeholder-mousepad-600x290.jpg',
    supertitle: 'ORIGINAL USE KIN - MY LIFE MY STYLE / COLEETION | STREET ART',
    name: 'CAÇADOR DE PIRATAS',
    price: 169.90,
    originalPrice: 189.90,
    discount: 8,
    href: '/produto/mousepad-cacador-de-piratas',
  },
  {
    id: 3,
    image: '/images/products/placeholder-mousepad-600x290.jpg',
    supertitle: 'ORIGINAL USE KIN - MY LIFE MY STYLE / COLEETION | STREET ART',
    name: 'RAINHA DO CAOS',
    price: 169.90,
    originalPrice: 189.90,
    discount: 8,
    href: '/produto/mousepad-rainha-do-caos',
  },
  {
    id: 4,
    image: '/images/products/placeholder-mousepad-600x290.jpg',
    supertitle: 'ORIGINAL USE KIN - MY LIFE MY STYLE / COLEETION | STREET ART',
    name: 'PRODUTO 4',
    price: 169.90,
    originalPrice: 189.90,
    discount: 8,
    href: '/produto/mousepad-4',
  },
  {
    id: 5,
    image: '/images/products/placeholder-mousepad-600x290.jpg',
    supertitle: 'ORIGINAL USE KIN - MY LIFE MY STYLE / COLEETION | STREET ART',
    name: 'PRODUTO 5',
    price: 169.90,
    originalPrice: 189.90,
    discount: 8,
    href: '/produto/mousepad-5',
  },
  {
    id: 6,
    image: '/images/products/placeholder-mousepad-600x290.jpg',
    supertitle: 'ORIGINAL USE KIN - MY LIFE MY STYLE / COLEETION | STREET ART',
    name: 'PRODUTO 6',
    price: 169.90,
    originalPrice: 189.90,
    discount: 8,
    href: '/produto/mousepad-6',
  },
];

export default function MousepadCollectionSection() {
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
      <div 
        className="grid"
        style={{ 
          gridTemplateColumns: 'repeat(3, 1fr)',
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
                width={600}
                height={290}
                className="w-full h-auto object-cover"
              />
            </div>

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

              {/* Current Price */}
              <div 
                className="font-semibold"
                style={{ 
                  fontSize: '20px',
                  color: '#292929',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  marginTop: '8px'
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
                  margin: '16px auto 0',
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
