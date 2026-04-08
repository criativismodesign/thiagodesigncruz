"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NewsletterSection from "@/components/NewsletterSection";
import BannerBoxSection from "@/components/BannerBoxSection";

export default function ProdutoCamiseta() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('PRETO');
  const [quantity, setQuantity] = useState(1);
  const [hasDiscount] = useState(true); // Simulando produto com desconto
  const [activeTab, setActiveTab] = useState('descricao'); // Controle de abas

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

        {/* LADO DIREITO - INFORMAÇÕES COMPLETAS */}
        <div style={{ width: '50%' }}>
          {/* 1. BREADCRUMB */}
          <nav style={{ marginBottom: '24px' }}>
            <Link 
              href="/" 
              style={{ 
                fontSize: '12px', 
                color: '#BABABA', 
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#DAA520'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#BABABA'}
            >
              Início
            </Link>
            {' '}
            <span style={{ color: '#BABABA', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>·</span>
            {' '}
            <Link 
              href="/colecao/original-collection" 
              style={{ 
                fontSize: '12px', 
                color: '#BABABA', 
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#DAA520'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#BABABA'}
            >
              Original Collection
            </Link>
            {' '}
            <span style={{ color: '#BABABA', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>·</span>
            {' '}
            <Link 
              href="/colecao/my-life-my-style" 
              style={{ 
                fontSize: '12px', 
                color: '#BABABA', 
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#DAA520'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#BABABA'}
            >
              My Life My Style
            </Link>
            {' '}
            <span style={{ color: '#BABABA', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>·</span>
            {' '}
            <span style={{ color: '#292929', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
              Camiseta Oversized Caçador de Piratas
            </span>
          </nav>

          {/* 2. IDENTIFICAÇÃO DA COLEÇÃO */}
          <p style={{ 
            fontSize: '16px', 
            color: '#AAAAAA', 
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            textTransform: 'uppercase',
            marginTop: '16px'
          }}>
            ORIGINAL USE KIN / MY LIFE MY STYLE - COLEETION | STREET ART
          </p>

          {/* 3. IDENTIFICAÇÃO DO PRODUTO */}
          <p style={{ 
            fontSize: '20px', 
            color: '#292929', 
            fontFamily: 'Inter, sans-serif',
            fontWeight: 900,
            textTransform: 'uppercase',
            marginTop: '8px'
          }}>
            CAMISETA OVERSIZED
          </p>

          {/* 4. NOME DO PRODUTO */}
          <h1 style={{ 
            fontSize: '40px', 
            color: '#292929', 
            fontFamily: 'Inter, sans-serif',
            fontWeight: 900,
            textTransform: 'uppercase',
            lineHeight: '1.1',
            marginTop: '8px'
          }}>
            CAÇADOR DE PIRATAS
          </h1>

          {/* 5. LINHA DE PREÇO */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            marginTop: '16px' 
          }}>
            <span style={{ 
              fontSize: '30px', 
              fontWeight: 600, 
              color: '#292929',
              fontFamily: 'Inter, sans-serif'
            }}>
              R$ 169,90
            </span>
            {hasDiscount && (
              <span style={{ 
                fontSize: '18px', 
                fontWeight: 400, 
                color: '#F0484A',
                fontFamily: 'Inter, sans-serif'
              }}>
                -8% OFF
              </span>
            )}
          </div>

          {/* 6. PREÇO "DE" */}
          {hasDiscount && (
            <div style={{ marginTop: '4px' }}>
              <span style={{ 
                fontSize: '18px', 
                fontWeight: 400, 
                color: '#AAAAAA',
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'line-through'
              }}>
                R$ 189,90
              </span>
            </div>
          )}

          {/* TEXTO DESCRITIVO */}
          <p style={{ 
            fontSize: '20px', 
            color: '#AAAAAA', 
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            textAlign: 'left',
            marginTop: '24px',
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            Mais do que uma camiseta comum: uma peça com presença, personalidade e estética premium. Modelagem oversized, suedine 250g e design exclusivo para quem vive a cultura pop com mais estilo.
          </p>

          {/* 7. ESCOLHA DE TAMANHO */}
          <div style={{ marginTop: '24px' }}>
            <label style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: '#292929',
              fontFamily: 'Inter, sans-serif'
            }}>
              TAMANHO
            </label>
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              marginTop: '12px' 
            }}>
              {['P', 'M', 'G', 'GG'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #DAA520',
                    borderRadius: '8px',
                    backgroundColor: selectedSize === size ? '#DAA520' : '#FFFFFF',
                    color: selectedSize === size ? '#FFFFFF' : '#292929',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 8. ESCOLHA DE COR */}
          <div style={{ marginTop: '24px' }}>
            <label style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: '#292929',
              fontFamily: 'Inter, sans-serif'
            }}>
              COR
            </label>
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              marginTop: '12px' 
            }}>
              {['PRETO', 'BRANCO'].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #DAA520',
                    borderRadius: '8px',
                    backgroundColor: selectedColor === color ? '#DAA520' : '#FFFFFF',
                    color: selectedColor === color ? '#FFFFFF' : '#292929',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* 9. QUANTIDADE */}
          <div style={{ marginTop: '24px' }}>
            <label style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: '#292929',
              fontFamily: 'Inter, sans-serif'
            }}>
              QUANTIDADE
            </label>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              backgroundColor: '#DAA520',
              borderRadius: '8px',
              marginTop: '12px',
              width: 'fit-content'
            }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '30px',
                  cursor: 'pointer',
                  padding: '0 16px'
                }}
              >
                -
              </button>
              <span style={{
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '30px',
                padding: '0 24px'
              }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '30px',
                  cursor: 'pointer',
                  padding: '0 16px'
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* 10. BOTÃO ADICIONAR AO CARRINHO */}
          <button
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#46A520',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '999px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '32px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#DAA520';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#46A520';
            }}
          >
            <Image
              src="/icons/Icones-Site-Use-KIN-carrinho-botao-comprar.svg"
              alt="Carrinho"
              width={24}
              height={24}
            />
            ADICIONAR AO CARRINHO
          </button>

          {/* BOX DE ABAS */}
          <div style={{ 
            width: '100%', 
            border: '1px solid #E5E5E5', 
            borderRadius: '8px', 
            overflow: 'hidden',
            marginTop: '48px'
          }}>
            {/* CABEÇALHO DAS ABAS */}
            <div style={{ 
              display: 'flex', 
              borderBottom: '1px solid #E5E5E5' 
            }}>
              {[
                { id: 'descricao', label: 'Descrição' },
                { id: 'entrega', label: 'Entrega e Prazo' },
                { id: 'tamanhos', label: 'Guia de Tamanhos' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '16px 24px',
                    backgroundColor: '#FFFFFF',
                    border: 'none',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    color: activeTab === tab.id ? '#292929' : '#AAAAAA',
                    borderBottom: activeTab === tab.id ? '2px solid #DAA520' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.color = '#292929';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.color = '#AAAAAA';
                    }
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* CONTEÚDO DAS ABAS */}
            <div style={{ padding: '32px' }}>
              {/* ABA 1 - DESCRIÇÃO */}
              {activeTab === 'descricao' && (
                <div>
                  <p style={{ 
                    fontSize: '20px', 
                    color: '#AAAAAA', 
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    lineHeight: '1.8'
                  }}>
                    Camiseta oversized premium em suedine 250g, com estampa exclusiva e visual marcante. Criada para quem quer mais estilo, identidade e presença no dia a dia.
                  </p>
                  <div style={{ marginTop: '24px' }}>
                    <p style={{ 
                      fontSize: '20px', 
                      color: '#AAAAAA', 
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      lineHeight: '1.8',
                      marginBottom: '16px'
                    }}>
                      <span style={{ 
                        fontWeight: 700, 
                        textDecoration: 'underline',
                        textDecorationColor: '#AAAAAA',
                        textUnderlineOffset: '4px'
                      }}>
                        Modelagem oversized:
                      </span>{' '}
                      caimento amplo, estruturado e marcante...
                    </p>
                    <p style={{ 
                      fontSize: '20px', 
                      color: '#AAAAAA', 
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      lineHeight: '1.8',
                      marginBottom: '16px'
                    }}>
                      <span style={{ 
                        fontWeight: 700, 
                        textDecoration: 'underline',
                        textDecorationColor: '#AAAAAA',
                        textUnderlineOffset: '4px'
                      }}>
                        Estampa em DTF:
                      </span>{' '}
                      aplicação com alta definição, cores vivas...
                    </p>
                    <p style={{ 
                      fontSize: '20px', 
                      color: '#AAAAAA', 
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      lineHeight: '1.8',
                      marginBottom: '16px'
                    }}>
                      <span style={{ 
                        fontWeight: 700, 
                        textDecoration: 'underline',
                        textDecorationColor: '#AAAAAA',
                        textUnderlineOffset: '4px'
                      }}>
                        Alta gramatura:
                      </span>{' '}
                      tecido encorpado de 250g/m²...
                    </p>
                    <p style={{ 
                      fontSize: '20px', 
                      color: '#AAAAAA', 
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      lineHeight: '1.8',
                      marginBottom: '16px'
                    }}>
                      <span style={{ 
                        fontWeight: 700, 
                        textDecoration: 'underline',
                        textDecorationColor: '#AAAAAA',
                        textUnderlineOffset: '4px'
                      }}>
                        Exclusivas e limitadas:
                      </span>{' '}
                      estampas autorais criadas exclusivamente para a KIN
                    </p>
                    <p style={{ 
                      fontSize: '20px', 
                      color: '#AAAAAA', 
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      lineHeight: '1.8'
                    }}>
                      <span style={{ 
                        fontWeight: 700, 
                        textDecoration: 'underline',
                        textDecorationColor: '#AAAAAA',
                        textUnderlineOffset: '4px'
                      }}>
                        Cuidados:
                      </span>{' '}
                      Lavar em água fria, secar à sombra e não passar ferro diretamente sobre a estampa.
                    </p>
                  </div>
                </div>
              )}

              {/* ABA 2 - ENTREGA E PRAZO */}
              {activeTab === 'entrega' && (
                <div>
                  <p style={{ 
                    fontSize: '20px', 
                    color: '#AAAAAA', 
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    lineHeight: '1.8'
                  }}>
                    Após a confirmação do pagamento, o pedido passa por processamento, produção e embalagem. O prazo de envio é de{' '}
                    <span style={{ 
                      fontWeight: 700, 
                      textDecoration: 'underline',
                      textDecorationColor: '#AAAAAA',
                      textUnderlineOffset: '4px'
                    }}>
                      1 a 5 dias úteis
                    </span>
                    , e a entrega ocorre em média entre{' '}
                    <span style={{ 
                      fontWeight: 700, 
                      textDecoration: 'underline',
                      textDecorationColor: '#AAAAAA',
                      textUnderlineOffset: '4px'
                    }}>
                      5 e 15 dias úteis após a postagem
                    </span>
                    , dependendo da região.
                  </p>
                </div>
              )}

              {/* ABA 3 - GUIA DE TAMANHOS */}
              {activeTab === 'tamanhos' && (
                <div>
                  <p style={{ 
                    fontSize: '20px', 
                    color: '#AAAAAA', 
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    marginBottom: '24px'
                  }}>
                    Confira as medidas antes de escolher o tamanho. A modelagem oversized foi pensada para um caimento mais solto, marcante e confortável.
                  </p>
                  
                  <Image 
                    src="/images/products/guia-tamanhos-camiseta.jpg" 
                    width={400} 
                    height={300} 
                    alt="Guia de tamanhos" 
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      marginBottom: '24px' 
                    }} 
                  />

                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse' 
                  }}>
                    <thead>
                      <tr style={{ background: '#DAA520' }}>
                        <th style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 700, 
                          color: '#FFFFFF',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          border: 'none'
                        }}>
                          TAMANHO
                        </th>
                        <th style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 700, 
                          color: '#FFFFFF',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          border: 'none'
                        }}>
                          LARGURA
                        </th>
                        <th style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 700, 
                          color: '#FFFFFF',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          border: 'none'
                        }}>
                          COMPRIMENTO
                        </th>
                        <th style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 700, 
                          color: '#FFFFFF',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          border: 'none'
                        }}>
                          MANGAS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ background: '#F9F9F9' }}>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 400, 
                          color: '#292929',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          borderBottom: '1px solid #E5E5E5'
                        }}>P</td>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 400, 
                          color: '#292929',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          borderBottom: '1px solid #E5E5E5'
                        }}>52cm</td>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 400, 
                          color: '#292929',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          borderBottom: '1px solid #E5E5E5'
                        }}>71cm</td>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 400, 
                          color: '#292929',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          borderBottom: '1px solid #E5E5E5'
                        }}>24cm</td>
                      </tr>
                      <tr style={{ background: '#FFFFFF' }}>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 400, 
                          color: '#292929',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          borderBottom: '1px solid #E5E5E5'
                        }}>M</td>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 400, 
                          color: '#292929',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          borderBottom: '1px solid #E5E5E5'
                        }}>55cm</td>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 400, 
                          color: '#292929',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          borderBottom: '1px solid #E5E5E5'
                        }}>73cm</td>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 400, 
                          color: '#292929',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          borderBottom: '1px solid #E5E5E5'
                        }}>25cm</td>
                      </tr>
                      <tr style={{ background: '#F9F9F9' }}>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 400, 
                          color: '#292929',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          borderBottom: '1px solid #E5E5E5'
                        }}>G</td>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 400, 
                          color: '#292929',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          borderBottom: '1px solid #E5E5E5'
                        }}>58cm</td>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 400, 
                          color: '#292929',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          borderBottom: '1px solid #E5E5E5'
                        }}>75cm</td>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 400, 
                          color: '#292929',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          borderBottom: '1px solid #E5E5E5'
                        }}>26cm</td>
                      </tr>
                      <tr style={{ background: '#FFFFFF' }}>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 400, 
                          color: '#292929',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          borderBottom: '1px solid #E5E5E5'
                        }}>GG</td>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 400, 
                          color: '#292929',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          borderBottom: '1px solid #E5E5E5'
                        }}>61cm</td>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 400, 
                          color: '#292929',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          borderBottom: '1px solid #E5E5E5'
                        }}>77cm</td>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          fontWeight: 400, 
                          color: '#292929',
                          fontFamily: 'Inter, sans-serif',
                          textAlign: 'center',
                          borderBottom: '1px solid #E5E5E5'
                        }}>27cm</td>
                      </tr>
                    </tbody>
                  </table>

                  <p style={{ 
                    fontSize: '14px', 
                    color: '#AAAAAA', 
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    marginTop: '16px'
                  }}>
                    As medidas podem variar 2cm para mais ou para menos. Use uma fita métrica para medir sua camiseta favorita e compare com a tabela acima.
                  </p>
                </div>
              )}
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
