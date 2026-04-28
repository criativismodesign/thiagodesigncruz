"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: string
  imagem: string | null
  imagemMobile: string | null
  supertitulo: string | null
  titulo: string
  descricao: string | null
  textoBotao: string | null
  linkBotao: string | null
  ordem: number
  ativo: boolean
}

interface Props {
  slides: Slide[]
}

export default function HeroCarousel({ slides }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentSlideData = slides[currentSlide];
  const imagemAtual = (isMobile && currentSlideData.imagemMobile) ? currentSlideData.imagemMobile : currentSlideData.imagem

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: isMobile ? '9/16' : '1920/832',
      overflow: 'hidden',
      maxHeight: isMobile ? '812px' : 'none',
    }}
    onMouseEnter={() => setIsAutoPlaying(false)}
    onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Container principal - altura proporcional à largura */}
      <div style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}>
        {currentSlideData.imagem ? (
          <Image
            src={imagemAtual || ''}
            alt={currentSlideData.titulo}
            fill
            priority
            fetchPriority="high"
            quality={80}
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center center'
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: '#E5E5E5',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color: '#BBBBBB', fontSize: 24 }}>1920 × 832 px</span>
          </div>
        )}
      </div>

      {/* Text Content Overlay */}
      <div 
        className={`absolute z-10 ${isMobile ? 'top-10 left-6 right-6' : 'top-1/2 left-[120px] transform -translate-y-1/2'}`}
        style={{ maxWidth: isMobile ? 'calc(100% - 48px)' : '400px' }}
      >
        {/* Supertítulo */}
        {currentSlideData.supertitulo && (
          <p style={{
            fontSize: isMobile ? '11px' : '12px',
            fontWeight: 400,
            color: '#292929',
            textTransform: 'uppercase',
            lineHeight: 1.4,
            marginBottom: isMobile ? '12px' : '24px',
            display: '-webkit-box',
            WebkitLineClamp: isMobile ? 3 : 999,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            {currentSlideData.supertitulo}
          </p>
        )}

        {/* Título */}
        <h1 style={{
          fontSize: '40px',
          fontWeight: 600,
          color: '#000000',
          textTransform: 'none', // remover CAPS — só primeiras letras maiúsculas
          lineHeight: 1.1,
          marginBottom: '16px',
        }}>
          {currentSlideData.titulo}
        </h1>

        {/* Descrição */}
        {currentSlideData.descricao && (
          <p style={{
            fontSize: isMobile ? '11px' : '12px',
            fontWeight: 400,
            color: '#292929',
            textTransform: 'uppercase',
            lineHeight: 1.4,
            marginBottom: isMobile ? '12px' : '24px',
            display: '-webkit-box',
            WebkitLineClamp: isMobile ? 3 : 999,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            {currentSlideData.descricao}
          </p>
        )}

        {/* Botão CTA */}
        {currentSlideData.linkBotao && (
          <a href={currentSlideData.linkBotao} style={{
            fontSize: isMobile ? '9px' : '10px',
            fontWeight: 700,
            color: '#FFFFFF',
            background: '#DAA520',
            padding: isMobile ? '10px 20px' : '14px 26px',
            borderRadius: '999px',
            textDecoration: 'none',
            display: isMobile ? 'block' : 'inline-block',
            textTransform: 'uppercase',
            textAlign: 'center' as const,
            marginTop: isMobile ? '8px' : '0',
          }}>
            {currentSlideData.textoBotao || 'VER COLEÇÃO'}
          </a>
        )}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        aria-label="Slide anterior"
        className={`absolute z-20 rounded-full transition-colors ${isMobile ? 'bottom-6 left-6' : 'top-1/2 left-6 transform -translate-y-1/2'}`}
        style={{ 
          width: '48px',
          height: '48px',
          backgroundColor: 'rgba(215,215,215,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(215,215,215,0.6)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(215,215,215,0.3)'}
      >
        <ChevronLeft size={20} color="#FFFFFF" />
      </button>

      <button
        onClick={goToNext}
        aria-label="Próximo slide"
        className={`absolute z-20 rounded-full transition-colors ${isMobile ? 'bottom-6 right-6' : 'top-1/2 right-6 transform -translate-y-1/2'}`}
        style={{ 
          width: '48px',
          height: '48px',
          backgroundColor: 'rgba(215,215,215,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(215,215,215,0.6)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(215,215,215,0.3)'}
      >
        <ChevronRight size={20} color="#FFFFFF" />
      </button>

      {/* Scroll Down Arrow - Mobile only */}
      {isMobile && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            animation: 'scrollBounce 2s infinite',
            cursor: 'pointer',
          }}
          onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
        >
          <span style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.9)',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}>
            Ver mais
          </span>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M7 10L14 17L21 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ marginTop: '-14px', opacity: 0.5 }}>
            <path d="M7 10L14 17L21 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      {/* Dots Indicators - Reutilizando estilo existente */}
      <div className="absolute bottom-6 right-6 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Mobile Responsiveness */}
      <style jsx>{`
        @media (max-width: 768px) {
          .hero-text {
            left: 24px !important;
            max-width: 90% !important;
          }
          .hero-supertitle {
            font-size: 18px !important;
          }
          .hero-title {
            font-size: 36px !important;
          }
          .hero-description {
            font-size: 14px !important;
          }
          .hero-arrow {
            width: 36px !important;
            height: 36px !important;
          }
        }
      `}</style>

      <style jsx global>{`
        .hero-text {
          left: 120px;
        }
        .hero-supertitle {
          font-size: 28px;
          color: '#DAA520';
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          margin-bottom: 8px;
        }
        .hero-title {
          font-size: 70px;
          color: '#000000';
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .hero-description {
          font-size: 18px;
          color: '#292929';
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          text-transform: uppercase;
          line-height: 1.6;
          margin-bottom: 36px;
        }
        .hero-arrow {
          width: 48px;
          height: 48px;
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0px); opacity: 1; }
          50% { transform: translateX(-50%) translateY(8px); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
