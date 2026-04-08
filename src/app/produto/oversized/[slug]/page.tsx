'use client'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NewsletterSection from "@/components/NewsletterSection";
import BannerBoxSection from "@/components/BannerBoxSection";
import ProdutosRelacionadosSection from "@/components/ProdutosRelacionadosSection";

export default function ProdutoOversized() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('PRETO');
  const [quantity, setQuantity] = useState(1);
  const [hasDiscount] = useState(true);
  const [activeTab, setActiveTab] = useState('descricao');

  // Array de imagens do produto
  const productImages = [
    "/images/products/produto-grande-816x1093.jpg",
    "/images/products/produto-menor-197x264.jpg",
    "/images/products/produto-grande-816x1093.jpg",
    "/images/products/produto-menor-197x264.jpg",
  ];

  const activeImage = productImages[activeImageIndex];

  const handleImageClick = (index: number) => {
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

          {/* Popup de zoom */}
          {zoomOpen && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <button 
                onClick={() => setZoomOpen(false)} 
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
                alt="Zoom"
                style={{ maxWidth: '90vw', height: 'auto' }} 
              />
            </div>
          )}

          {/* Miniaturas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginTop: '24px'
          }}>
            {productImages.map((image, index) => (
              <div
                key={index}
                style={{ 
                  cursor: 'pointer',
                  border: activeImageIndex === index ? '2px solid #DAA520' : 'none'
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
          {/* Breadcrumb */}
          <nav style={{ marginBottom: '24px' }}>
            <Link 
              href="/" 
              style={{ 
                fontSize: '12px', 
                color: '#BABABA', 
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Início
            </Link>
            {' '}
            <span style={{ color: '#BABABA' }}>·</span>
            {' '}
            <Link 
              href="/categorias/oversizeds" 
              style={{ 
                fontSize: '12px', 
                color: '#BABABA', 
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#DAA520'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#BABABA'}
            >
              Oversizeds
            </Link>
            {' '}
            <span style={{ color: '#BABABA' }}>·</span>
            {' '}
            <span style={{ 
              fontSize: '12px', 
              color: '#292929',
              fontFamily: 'Inter, sans-serif'
            }}>
              Camiseta Oversized Caçador de Piratas
            </span>
          </nav>

          {/* Identificação da Coleção */}
          <div style={{
            fontSize: '16px',
            color: '#AAAAAA',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            textTransform: 'uppercase',
            marginTop: '16px'
          }}>
            USE KIN
            <br />
            PARA USAR - REPRESENTAR - GUARDAR
          </div>

          {/* Identificação do produto */}
          <div style={{
            fontSize: '20px',
            color: '#292929',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 900,
            textTransform: 'uppercase',
            marginTop: '8px'
          }}>
            CAMISETA OVERSIZED
          </div>

          {/* Nome do produto */}
          <div style={{
            fontSize: '40px',
            color: '#292929',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 900,
            textTransform: 'uppercase',
            lineHeight: 1.1,
            marginTop: '8px'
          }}>
            CAÇADOR DE PIRATAS
          </div>

          {/* Linha de preço */}
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            marginTop: '16px'
          }}>
            <span style={{
              fontSize: '30px',
              color: '#292929',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600
            }}>
              R$ 90,97
            </span>
            <span style={{
              fontSize: '18px',
              color: '#F0484A',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400
            }}>
              -8% OFF
            </span>
          </div>

          {/* Preço "DE" */}
          <div style={{
            fontSize: '18px',
            color: '#AAAAAA',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            textDecoration: 'line-through',
            marginTop: '4px'
          }}>
            R$ 149,90
          </div>

          {/* Texto do produto */}
          <div style={{
            fontSize: '20px',
            color: '#AAAAAA',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            marginTop: '24px',
            marginBottom: '24px'
          }}>
            Mais do que uma camiseta: uma declaração de estilo. A oversized Caçador de Piratas combina design exclusivo com conforto premium para quem busca autenticidade no dia a dia.
          </div>

          {/* CORES */}
          <div style={{ marginTop: '24px' }}>
            <div style={{
              fontSize: '20px',
              color: '#292929',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              marginBottom: '12px'
            }}>
              CORES
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['PRETO', 'BRANCO', 'CINZA'].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    padding: '8px 16px',
                    border: selectedColor === color ? '2px solid #DAA520' : '1px solid #E5E5E5',
                    backgroundColor: selectedColor === color ? '#DAA520' : '#FFFFFF',
                    color: selectedColor === color ? '#FFFFFF' : '#292929',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* TAMANHOS */}
          <div style={{ marginTop: '24px' }}>
            <div style={{
              fontSize: '20px',
              color: '#292929',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              marginBottom: '12px'
            }}>
              TAMANHOS
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['P', 'M', 'G', 'GG'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '8px 16px',
                    border: selectedSize === size ? '2px solid #DAA520' : '1px solid #E5E5E5',
                    backgroundColor: selectedSize === size ? '#DAA520' : '#FFFFFF',
                    color: selectedSize === size ? '#FFFFFF' : '#292929',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTIDADE */}
          <div style={{ marginTop: '24px' }}>
            <div style={{
              fontSize: '20px',
              color: '#292929',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              marginBottom: '12px'
            }}>
              QUANTIDADE
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0',
              border: 'none',
              borderRadius: '8px',
              overflow: 'hidden',
              width: '120px'
            }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  backgroundColor: '#DAA520',
                  color: '#FFFFFF',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  fontSize: '20px',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                -
              </button>
              <div style={{
                backgroundColor: '#DAA520',
                color: '#FFFFFF',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontFamily: 'Inter, sans-serif'
              }}>
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  backgroundColor: '#DAA520',
                  color: '#FFFFFF',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  fontSize: '20px',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* BOTÃO ADICIONAR AO CARRINHO */}
          <button style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#46A520',
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            border: 'none',
            borderRadius: '999px',
            cursor: 'pointer',
            marginTop: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <Image
              src="/icons/Icones-Site-Use-KIN-carrinho-botao-comprar.svg"
              alt="Carrinho"
              width={20}
              height={20}
            />
            ADICIONAR AO CARRINHO
          </button>
        </div>
      </div>

      {/* BOX DE ABAS */}
      <div style={{
        marginTop: '100px',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
        border: '1px solid #E5E5E5',
        borderRadius: '8px'
      }}>
        {/* Cabeçalho das abas */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E5E5E5' }}>
          <button
            onClick={() => setActiveTab('descricao')}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: activeTab === 'descricao' ? '#FFFFFF' : '#FFFFFF',
              color: activeTab === 'descricao' ? '#292929' : '#AAAAAA',
              fontFamily: 'Inter, sans-serif',
              fontWeight: activeTab === 'descricao' ? 600 : 400,
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === 'descricao' ? '2px solid #DAA520' : 'none'
            }}
          >
            Descrição
          </button>
          <button
            onClick={() => setActiveTab('entrega')}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: activeTab === 'entrega' ? '#FFFFFF' : '#FFFFFF',
              color: activeTab === 'entrega' ? '#292929' : '#AAAAAA',
              fontFamily: 'Inter, sans-serif',
              fontWeight: activeTab === 'entrega' ? 600 : 400,
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === 'entrega' ? '2px solid #DAA520' : 'none'
            }}
          >
            Entrega e Prazo
          </button>
          <button
            onClick={() => setActiveTab('tamanhos')}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: activeTab === 'tamanhos' ? '#FFFFFF' : '#FFFFFF',
              color: activeTab === 'tamanhos' ? '#292929' : '#AAAAAA',
              fontFamily: 'Inter, sans-serif',
              fontWeight: activeTab === 'tamanhos' ? 600 : 400,
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === 'tamanhos' ? '2px solid #DAA520' : 'none'
            }}
          >
            Guia de Tamanhos
          </button>
        </div>

        {/* Conteúdo das abas */}
        <div style={{ padding: '32px' }}>
          {activeTab === 'descricao' && (
            <div style={{
              fontSize: '20px',
              color: '#AAAAAA',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              lineHeight: 1.8
            }}>
              <div style={{ 
                fontWeight: 700, 
                marginBottom: '16px',
                color: '#AAAAAA'
              }}>
                DESCRIÇÃO
              </div>
              <p>
                A <strong>Camiseta Oversized Caçador de Piratas</strong> é mais do que uma peça de vestuário - é uma declaração de identidade. Com design exclusivo e acabamento premium, esta camiseta combina conforto e estilo para quem busca autenticidade no dia a dia.
              </p>
              <br />
              <p>
                <strong>Material:</strong> Algodão penteado de alta qualidade, macio e durável.
              </p>
              <br />
              <p>
                <strong>Estampa:</strong> Impressão DTG (Direct to Garment) de alta resolução, cores vibrantes que não desbotam.
              </p>
              <br />
              <p>
                <strong>Modelagem:</strong> Oversized moderna com caimento perfeito, versátil para diversos estilos.
              </p>
              <br />
              <p>
                <strong>Detalhes:</strong> Acabamento reforçado em costuras, gola arredondada, etiqueta térmica para maior conforto.
              </p>
            </div>
          )}

          {activeTab === 'entrega' && (
            <div style={{
              fontSize: '20px',
              color: '#AAAAAA',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              lineHeight: 1.8
            }}>
              <div style={{ 
                fontWeight: 700, 
                marginBottom: '16px',
                color: '#AAAAAA'
              }}>
                ENTREGA E PRAZO
              </div>
              <p>
                Após a <strong>confirmação do pagamento</strong>, o pedido passa por <strong>processamento, produção e embalagem</strong>. O <strong>prazo de envio</strong> é de 1 a 5 dias úteis, e a <strong>entrega</strong> ocorre em média entre 5 e 15 dias úteis após a postagem, dependendo da região.
              </p>
              <br />
              <p>
                <strong>Frete grátis</strong> para compras acima de R$250,00 em todo o território nacional.
              </p>
              <br />
              <p>
                <strong>Rastreamento:</strong> Você receberá o código de rastreamento por e-mail assim que seu pedido for postado.
              </p>
            </div>
          )}

          {activeTab === 'tamanhos' && (
            <div style={{
              fontSize: '20px',
              color: '#AAAAAA',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              lineHeight: 1.8
            }}>
              <div style={{ 
                fontWeight: 700, 
                marginBottom: '16px',
                color: '#AAAAAA'
              }}>
                GUIA DE TAMANHOS
              </div>
              <p>
                <strong>Tabela de Medidas - Camiseta Oversized:</strong>
              </p>
              <br />
              <div style={{ 
                border: '1px solid #E5E5E5', 
                borderRadius: '8px', 
                padding: '16px',
                backgroundColor: '#FAFAFA'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div>
                    <strong>P:</strong> Busto 96cm | Comprimento 68cm
                  </div>
                  <div>
                    <strong>M:</strong> Busto 102cm | Comprimento 72cm
                  </div>
                  <div>
                    <strong>G:</strong> Busto 108cm | Comprimento 76cm
                  </div>
                  <div>
                    <strong>GG:</strong> Busto 114cm | Comprimento 80cm
                  </div>
                </div>
              </div>
              <br />
              <p>
                <strong>Dicas:</strong> A modelo usa tamanho M. Para um look mais oversized, escolha um tamanho acima do habitual.
              </p>
            </div>
          )}
        </div>
      </div>

      <ProdutosRelacionadosSection />
      <NewsletterSection source="produto-oversized" />
      <BannerBoxSection />
    </main>
  )
}
