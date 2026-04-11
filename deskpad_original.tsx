'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import NewsletterSection from '@/components/NewsletterSection'
import BannerBoxSection from '@/components/BannerBoxSection'

export default function ProdutoDeskpad() {
  const [activeImage, setActiveImage] = useState('/images/products/deskpad-grande-821x393.jpg')
  const [zoomOpen, setZoomOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('informacoes')

  // Mock thumbnails - todas usam a mesma imagem por enquanto
  const thumbnails = Array(8).fill('/images/products/deskpad-menor-200x96.jpg')

  return (
    <main>
      {/* Se├º├úo foto + info */}
      <div style={{ 
        padding: '100px 120px', 
        display: 'flex', 
        gap: '48px', 
        flexDirection: 'column' 
      }}>
        <div style={{ display: 'flex', gap: '48px', flexDirection: 'row' }}>
          {/* LADO ESQUERDO - Imagens */}
          <div style={{ width: '50%' }}>
            {/* Imagem grande */}
            <div 
              style={{ cursor: 'pointer' }}
              onClick={() => setZoomOpen(true)}
            >
              <Image
                src={activeImage}
                alt="Deskpad Ca├ºador de Piratas"
                width={821}
                height={393}
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Miniaturas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              marginTop: '24px'
            }}>
              {thumbnails.map((thumb, index) => (
                <div
                  key={index}
                  style={{ 
                    cursor: 'pointer',
                    border: activeImage === thumb ? '2px solid #DAA520' : 'none'
                  }}
                  onClick={() => setActiveImage(thumb)}
                >
                  <Image
                    src={thumb}
                    alt={`Miniatura ${index + 1}`}
                    width={200}
                    height={96}
                    style={{ 
                      width: '100%', 
                      height: 'auto',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
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
                  ├ù
                </button>
                <Image 
                  src={activeImage} 
                  width={821} 
                  height={393} 
                  alt="Zoom"
                  style={{ maxWidth: '90vw', height: 'auto' }} 
                />
              </div>
            )}
          </div>

          {/* LADO DIREITO - Informa├º├Áes */}
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
                In├¡cio
              </Link>
              {' '}
              <span style={{ color: '#BABABA' }}>┬À</span>
              {' '}
              <Link 
                href="/categorias/original-collection" 
                style={{ 
                  fontSize: '12px', 
                  color: '#BABABA', 
                  textDecoration: 'none',
                  fontFamily: 'Inter, sans-serif'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#DAA520'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#BABABA'}
              >
                Original Collection
              </Link>
              {' '}
              <span style={{ color: '#BABABA' }}>┬À</span>
              {' '}
              <Link 
                href="/categorias/original-collection/my-life-my-style" 
                style={{ 
                  fontSize: '12px', 
                  color: '#BABABA', 
                  textDecoration: 'none',
                  fontFamily: 'Inter, sans-serif'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#DAA520'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#BABABA'}
              >
                My Life My Style
              </Link>
              {' '}
              <span style={{ color: '#BABABA' }}>┬À</span>
              {' '}
              <span style={{ 
                fontSize: '12px', 
                color: '#292929',
                fontFamily: 'Inter, sans-serif'
              }}>
                Deskpad Ca├ºador de Piratas
              </span>
            </nav>

            {/* Identifica├º├úo da cole├º├úo */}
            <div style={{
              fontSize: '16px',
              color: '#AAAAAA',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              textTransform: 'uppercase',
              marginTop: '16px'
            }}>
              ORIGINAL USE KIN / MY LIFE MY STYLE - COLLETION | STREET ART
            </div>

            {/* Identifica├º├úo do produto */}
            <div style={{
              fontSize: '20px',
              color: '#292929',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              textTransform: 'uppercase',
              marginTop: '8px'
            }}>
              MOUSE PAD / DESCKPAD
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
              CA├çADOR DE PIRATAS
            </div>

            {/* Linha de pre├ºo */}
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

            {/* Pre├ºo "DE" */}
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
              Mais do que um acess├│rio de mesa: uma pe├ºa com identidade. O desk pad 75x35cm da KIN combina tecido speed, base antiderrapante e acabamento premium para entregar desempenho e estilo no dia a dia.
            </div>

            {/* TAMANHO */}
            <div style={{ marginTop: '24px' }}>
              <div style={{
                fontSize: '20px',
                color: '#292929',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                marginBottom: '12px'
              }}>
                TAMANHO
              </div>
              <div style={{
                backgroundColor: '#DAA520',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '20px',
                padding: '10px 20px',
                borderRadius: '8px',
                display: 'inline-block'
              }}>
                75 X 35 CM
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

            {/* BOT├âO ADICIONAR AO CARRINHO */}
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
          {/* Cabe├ºalho das abas */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E5E5E5' }}>
            <button
              onClick={() => setActiveTab('informacoes')}
              style={{
                flex: 1,
                padding: '16px',
                backgroundColor: activeTab === 'informacoes' ? '#FFFFFF' : '#FFFFFF',
                color: activeTab === 'informacoes' ? '#292929' : '#AAAAAA',
                fontFamily: 'Inter, sans-serif',
                fontWeight: activeTab === 'informacoes' ? 600 : 400,
                fontSize: '16px',
                border: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === 'informacoes' ? '2px solid #DAA520' : 'none'
              }}
            >
              Informa├º├Áes
            </button>
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
              Descri├º├úo / Entrega e Prazo
            </button>
          </div>

          {/* Conte├║do das abas */}
          <div style={{ padding: '32px' }}>
            {activeTab === 'informacoes' && (
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
                  MAIS INFORMA├ç├òES
                </div>
                <p>
                  O <strong style={{ fontWeight: 700, textDecoration: 'underline' }}>MOUSEPAD - ORIGINAL COLLECTION SERIES - use KIN</strong> mais do que usar, ├® carregar no dia-a-dia aquilo que faz parte de quem voc├¬ ├®. Cada detalhe foi pensado para conectar performance e identidade.
                </p>
                <br />
                <p>
                  <strong style={{ fontWeight: 700, textDecoration: 'underline' }}>Dimens├Áes:</strong> 750 x 350 mm - superf├¡cie ampla para movimentos livres e precisos, ideal para gamers e profissionais que exigem o m├íximo de seu espa├ºo.
                </p>
                <br />
                <p>
                  <strong style={{ fontWeight: 700, textDecoration: 'underline' }}>Artistas:</strong> Por tr├ís de cada pe├ºa da useKIN est├úo criativos que entendem de cultura urbana e design funcional, transformando simples acess├│rios em declara├º├Áes de estilo.
                </p>
                <br />
                <p>
                  <strong style={{ fontWeight: 700, textDecoration: 'underline' }}>Superf├¡cie e acabamento:</strong> Impress├úo dur├ível com tecnologia sublim├ítica que garante cores vibrantes e resist├¬ncia ao desgaste di├írio, mantendo a qualidade est├®tica por muito mais tempo.
                </p>
                <br />
                <p>
                  <strong style={{ fontWeight: 700, textDecoration: 'underline' }}>Uso e versatilidade:</strong> Ideal para trabalho, gaming, design e qualquer atividade que exija precis├úo e conforto. Compat├¡vel com todos os tipos de mouse e superf├¡cies de mesa.
                </p>
                <br />
                <p>
                  <strong style={{ fontWeight: 700, textDecoration: 'underline' }}>Tend├¬ncia Deskpad:</strong> Os mousepads tradicionais est├úo evoluindo para formatos maiores que protegem toda a ├írea de trabalho, combinando funcionalidade e est├®tica em um ├║nico produto.
                </p>
              </div>
            )}

            {activeTab === 'descricao' && (
              <div style={{
                fontSize: '20px',
                color: '#AAAAAA',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                lineHeight: 1.8
              }}>
                {/* Bloco DESCRI├ç├âO */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ 
                    fontWeight: 700, 
                    marginBottom: '16px',
                    color: '#AAAAAA'
                  }}>
                    DESCRI├ç├âO
                  </div>
                  <p>
                    <strong style={{ fontWeight: 700, textDecoration: 'underline' }}>Material:</strong> Tecido speed + base emborrachada
                  </p>
                  <br />
                  <p>
                    <strong style={{ fontWeight: 700, textDecoration: 'underline' }}>Espessura:</strong> 3 mm
                  </p>
                  <br />
                  <p>
                    <strong style={{ fontWeight: 700, textDecoration: 'underline' }}>Tamanho:</strong> 75 x 35 cm
                  </p>
                  <br />
                  <p>
                    <strong style={{ fontWeight: 700, textDecoration: 'underline' }}>Tecido:</strong> speed para deslizamento suave
                  </p>
                  <br />
                  <p>
                    <strong style={{ fontWeight: 700, textDecoration: 'underline' }}>Base:</strong> emborrachada antiderrapante
                  </p>
                  <br />
                  <p>
                    <strong style={{ fontWeight: 700, textDecoration: 'underline' }}>Bordas:</strong> costura preta
                  </p>
                  <br />
                  <p>
                    <strong style={{ fontWeight: 700, textDecoration: 'underline' }}>Lav├ível:</strong> sim
                  </p>
                  <br />
                  <p>
                    <strong style={{ fontWeight: 700, textDecoration: 'underline' }}>Impress├úo:</strong> Sublima├º├úo - Alta durabilidade
                  </p>
                  <br />
                  <p>
                    Mais conforto e estabilidade no uso
                  </p>
                </div>

                {/* Bloco ENTREGA E PRAZO */}
                <div>
                  <div style={{ 
                    fontWeight: 700, 
                    marginBottom: '16px',
                    color: '#AAAAAA'
                  }}>
                    ENTREGA E PRAZO
                  </div>
                  <p>
                    Ap├│s a <strong>confirma├º├úo do pagamento</strong>, o pedido passa por <strong>processamento, produ├º├úo e embalagem</strong>. O <strong>prazo de envio</strong> ├® de 1 a 5 dias ├║teis, e a <strong>entrega</strong> ocorre em m├®dia entre 5 e 15 dias ├║teis ap├│s a postagem, dependendo da regi├úo.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

            <NewsletterSection source="produto-deskpad" />
      <BannerBoxSection />

      {/* Responsividade */}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="flex-direction: row"] {
            flex-direction: column !important;
          }
          
          div[style*="padding: 32px"] {
            padding: 20px !important;
          }
          
          button[style*="font-size: 16px"] {
            font-size: 13px !important;
          }
          
          div[style*="padding: '100px 120px'"] {
            padding: 40px 20px !important;
          }
          
          div[style*="width: '50%'"] {
            width: 100% !important;
          }
          
          div[style*="fontSize: '40px'"] {
            font-size: 28px !important;
          }
          
          div[style*="fontSize: '30px'"] {
            font-size: 24px !important;
          }
          
          div[style*="fontSize: '20px'"] {
            font-size: 16px !important;
          }
        }
      `}</style>
    </main>
  )
}
