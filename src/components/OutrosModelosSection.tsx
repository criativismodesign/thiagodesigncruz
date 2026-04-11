"use client";

import Image from "next/image";
import Link from "next/link";
import SectionHeader from "./SectionHeader";

interface Produto {
  id: string
  nome: string
  tipo: string
  precoAtual: number
  precoDe: number | null
  status: string
  imagens: { id: string; url: string; ordem: number; isPrincipal: boolean }[]
}

interface Props {
  produtos: Produto[]
}

export default function OutrosModelosSection({ produtos }: Props) {
  // Lógica de alternância contínua linha a linha
  const getSupertitle = (index: number) => {
    const lineIndex = Math.floor(index / 5); // qual linha
    const colIndex = index % 5;              // qual coluna
    const startWithMousepad = lineIndex % 2 === 0; // linhas pares começam com mousepad
    const isMousepad = startWithMousepad ? colIndex % 2 === 0 : colIndex % 2 !== 0;
    return isMousepad ? 'MOUSE PAD - DESKPAD' : 'CAMISETA OVERSIZED';
  };

  const products = produtos.map((p, index) => ({
    id: p.id,
    image: p.imagens.find(i => i.isPrincipal)?.url ||
           p.imagens[0]?.url ||
           '/images/products/placeholder-outros-337x393.jpg',
    name: p.nome,
    price: p.precoAtual,
    originalPrice: p.precoDe,
    discount: p.precoDe ? Math.round((1 - p.precoAtual / p.precoDe) * 100) : null,
    href: `/produto/${p.id}`,
    category: p.tipo,
  }))
  return (
    <section 
      className="w-full"
      style={{ 
        paddingTop: '100px',
        paddingBottom: '100px',
        paddingLeft: '40px',
        paddingRight: '40px',
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* Cabeçalho da Seção */}
      <SectionHeader 
        title="OUTROS MODELOS" 
        subtitle="QUEM USA KIN | ENCONTRE O SEU FAVORITO" 
      />

      {/* Grid de Produtos */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '24px',
      }}>
        {products.map((product, index) => (
          <div key={product.id} style={{ width: '220px', flex: '0 0 220px' }}>
            {/* Imagem do Produto */}
            <div className="relative overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={337}
                height={393}
                className="w-full h-auto object-cover transition-transform duration-300 ease hover:scale-105"
              />
            </div>

            {/* Bloco de Texto */}
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
                {getSupertitle(index)}
              </p>

              {/* Nome do Produto */}
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

              {/* Preço Atual */}
              <p 
                className="font-semibold"
                style={{ 
                  fontSize: '20px',
                  color: '#292929',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  marginTop: '8px'
                }}
              >
                R$ {product.price.toFixed(2).replace('.', ',')}
              </p>

              {/* Linha de Desconto */}
              {product.discount && (
                <div 
                  className="flex items-center"
                  style={{ 
                    gap: '8px',
                    marginTop: '4px'
                  }}
                >
                  {/* Badge de Desconto */}
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

                  {/* Preço Original */}
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
                    R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              )}

              {/* Botão COMPRAR */}
              <Link href={product.href} style={{ textDecoration: 'none' }}>
                <button
                  className="font-bold text-white rounded-full transition-all hover:brightness-110"
                  style={{ 
                    fontSize: '15px',
                    color: '#FFFFFF',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    backgroundColor: '#DAA520',
                    padding: '14px',
                    borderRadius: '999px',
                    width: 'fit-content',
                    minWidth: '45%',
                    maxWidth: '50%',
                    margin: '16px 0 0 0',
                    cursor: 'pointer'
                  }}
                >
                  COMPRAR
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Responsividade */}
      <style jsx>{`
        @media (max-width: 768px) {
          .section-container {
            padding-top: 60px !important;
            padding-bottom: 60px !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
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
          grid-template-columns: repeat(5, 1fr);
        }
        .product-name {
          font-size: 24px;
        }
        .product-price {
          font-size: 20px;
        }
      `}</style>
    </section>
  );
}
