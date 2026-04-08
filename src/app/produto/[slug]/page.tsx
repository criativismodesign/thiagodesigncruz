"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NewsletterSection from "@/components/NewsletterSection";
import BannerBoxSection from "@/components/BannerBoxSection";

export default function ProdutoCamiseta() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  // Array de imagens do produto
  const productImages = [
    "/images/products/produto-grande-816x1093.jpg",
    "/images/products/produto-menor-197x264.jpg",
    "/images/products/produto-grande-816x1093.jpg",
    "/images/products/produto-menor-197x264.jpg",
  ];

  const activeImage = productImages[activeImageIndex];

  const handleImageClick = (index: number) => {
    // Troca a imagem ativa com a clicada
    const newImages = [...productImages];
    [newImages[activeImageIndex], newImages[index]] = [newImages[index], newImages[activeImageIndex]];
    setActiveImageIndex(index);
  };

  return (
    <main>
      {/* LADO ESQUERDO + LADO DIREITO */}
      <div style={{ padding: '100px 120px', display: 'flex', gap: '48px' }}>
        {/* LADO ESQUERDO - IMAGENS */}
        <div style={{ width: '50%' }}>
          {/* Imagem grande */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setZoomOpen(true)}>
            <Image
              src={activeImage}
              alt="Produto"
              width={816}
              height={1093}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          {/* Miniaturas */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '40px' }}>
            {productImages.map((image, index) => (
              <div
                key={index}
                style={{ 
                  cursor: 'pointer',
                  opacity: index === activeImageIndex ? 0.7 : 1,
                  border: index === activeImageIndex ? '2px solid #DAA520' : '1px solid #EFEFEF',
                  overflow: 'hidden',
                  flex: 1
                }}
                onClick={() => handleImageClick(index)}
              >
                <Image
                  src={image}
                  alt={`Miniatura ${index + 1}`}
                  width={197}
                  height={264}
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    objectFit: 'cover'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* LADO DIREITO - INFORMAÇÕES */}
        <div style={{ width: '50%' }}>
          {/* Nome do produto */}
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 700, 
            color: '#292929',
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            CAMISETA OVERSIZED USE KIN
          </h1>

          {/* SKU */}
          <p style={{ 
            fontSize: '14px', 
            color: '#AAAAAA',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '24px'
          }}>
            SKU: CAM-USE-KIN-001
          </p>

          {/* Preço */}
          <div style={{ marginBottom: '32px' }}>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: 700, 
              color: '#292929',
              fontFamily: 'Inter, sans-serif'
            }}>
              R$ 89,90
            </span>
          </div>

          {/* Descrição */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#292929',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '12px'
            }}>
              Descrição
            </h3>
            <p style={{ 
              fontSize: '16px', 
              color: '#AAAAAA',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.6'
            }}>
              Camiseta oversized com design exclusivo Use KIN. Confeccionada em algodão de alta qualidade, 
              proporcionando conforto e estilo. Modelagem ampla com mangas longas e gola redonda.
            </p>
          </div>

          {/* Tamanhos */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#292929',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '12px'
            }}>
              Tamanhos
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['P', 'M', 'G', 'GG'].map((size) => (
                <button
                  key={size}
                  style={{
                    width: '48px',
                    height: '48px',
                    border: '1px solid #292929',
                    backgroundColor: 'transparent',
                    color: '#292929',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#292929';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#292929';
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Cores */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#292929',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '12px'
            }}>
              Cores
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { name: 'Preto', color: '#000000' },
                { name: 'Branco', color: '#FFFFFF' },
                { name: 'Cinza', color: '#808080' }
              ].map((color) => (
                <div
                  key={color.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: color.color,
                    border: '1px solid #CCCCCC',
                    cursor: 'pointer',
                    borderRadius: '50%'
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Botões de ação */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <button
              style={{
                flex: 1,
                padding: '16px 24px',
                backgroundColor: '#292929',
                color: '#FFFFFF',
                border: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DAA520';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#292929';
              }}
            >
              Comprar Agora
            </button>
            <button
              style={{
                padding: '16px 24px',
                backgroundColor: 'transparent',
                color: '#292929',
                border: '1px solid #292929',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#292929';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#292929';
              }}
            >
              Adicionar ao Carrinho
            </button>
          </div>

          {/* Guia de tamanhos */}
          <div style={{ marginBottom: '32px' }}>
            <Link 
              href="#" 
              style={{ 
                color: '#292929', 
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                borderBottom: '1px solid #292929'
              }}
            >
              Guia de Tamanhos
            </Link>
          </div>

          {/* Informações adicionais */}
          <div style={{ 
            borderTop: '1px solid #EFEFEF', 
            paddingTop: '24px',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ 
                fontSize: '16px', 
                color: '#AAAAAA',
                fontFamily: 'Inter, sans-serif'
              }}>
                <strong>Material:</strong> 100% Algodão
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ 
                fontSize: '16px', 
                color: '#AAAAAA',
                fontFamily: 'Inter, sans-serif'
              }}>
                <strong>Estoque:</strong> Disponível
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ 
                fontSize: '16px', 
                color: '#AAAAAA',
                fontFamily: 'Inter, sans-serif'
              }}>
                <strong>Envio:</strong> Frete grátis para compras acima de R$ 200
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Popup de zoom */}
      {zoomOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setZoomOpen(false)}
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setZoomOpen(false);
            }}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              color: '#fff',
              fontSize: 32,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
          <Image 
            src={activeImage} 
            width={816} 
            height={1093} 
            alt="Zoom do produto"
            style={{ maxHeight: '90vh', width: 'auto' }}
          />
        </div>
      )}

      <NewsletterSection source="produto-camiseta" />
      <BannerBoxSection />
    </main>
  );
}
