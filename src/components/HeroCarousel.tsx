"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: '/imagens/hero/img-site-use-kin-hero-full-banner-1920x832px.jpg',
    supertitle: 'Coleção os "Immortals" 2026',
    title: 'Camisetas STYLE',
    description: 'VISTA O ESTILO DOS SOBREVIVENTES MAIS INSANOS DESSE DE TODOS OS TEMPOS. OS IMMORTALS AQUELES QUE SEMPRE SE LEVANTAM.',
    cta: { label: 'VER COLEÇÃO', href: '/colecao/immortals' },
  },
  {
    id: 2,
    image: '/imagens/hero/img-site-use-kin-hero-full-banner-1920x832px.jpg',
    supertitle: 'Slide 2 - Supertítulo',
    title: 'Título do Slide 2',
    description: 'DESCRIÇÃO DO SLIDE 2 EM CAIXA ALTA.',
    cta: { label: 'VER COLEÇÃO', href: '/colecao/slide-2' },
  },
  {
    id: 3,
    image: '/imagens/hero/img-site-use-kin-hero-full-banner-1920x832px.jpg',
    supertitle: 'Slide 3 - Supertítulo',
    title: 'Título do Slide 3',
    description: 'DESCRIÇÃO DO SLIDE 3 EM CAIXA ALTA.',
    cta: { label: 'VER COLEÇÃO', href: '/colecao/slide-3' },
  },
  {
    id: 4,
    image: '/imagens/hero/img-site-use-kin-hero-full-banner-1920x832px.jpg',
    supertitle: 'Slide 4 - Supertítulo',
    title: 'Título do Slide 4',
    description: 'DESCRIÇÃO DO SLIDE 4 EM CAIXA ALTA.',
    cta: { label: 'VER COLEÇÃO', href: '/colecao/slide-4' },
  },
  {
    id: 5,
    image: '/imagens/hero/img-site-use-kin-hero-full-banner-1920x832px.jpg',
    supertitle: 'Slide 5 - Supertítulo',
    title: 'Título do Slide 5',
    description: 'DESCRIÇÃO DO SLIDE 5 EM CAIXA ALTA.',
    cta: { label: 'VER COLEÇÃO', href: '/colecao/slide-5' },
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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

  return (
    <div 
      className="relative w-full overflow-hidden"
      style={{ height: '832px' }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentSlideData.image}
          alt={currentSlideData.title}
          width={1920}
          height={832}
          className="w-full h-full object-cover"
          priority={currentSlide === 0}
          unoptimized
        />
      </div>

      {/* Text Content Overlay */}
      <div 
        className="absolute top-1/2 left-[120px] transform -translate-y-1/2 z-10"
        style={{ maxWidth: '627px' }}
      >
        {/* Supertítulo */}
        <p 
          className="font-light"
          style={{ 
            fontSize: '28px',
            color: '#DAA520',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 300,
            marginBottom: '8px'
          }}
        >
          {currentSlideData.supertitle}
        </p>

        {/* Título */}
        <h1 
          className="font-semibold"
          style={{ 
            fontSize: '70px',
            color: '#000000',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            lineHeight: '1.1',
            marginBottom: '20px'
          }}
        >
          {currentSlideData.title}
        </h1>

        {/* Descrição */}
        <p 
          className="font-normal"
          style={{ 
            fontSize: '18px',
            color: '#292929',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            textTransform: 'uppercase',
            lineHeight: '1.6',
            marginBottom: '36px'
          }}
        >
          {currentSlideData.description}
        </p>

        {/* Botão CTA */}
        <Link
          href={currentSlideData.cta.href}
          className="inline-block font-bold text-white rounded-full transition-all hover:brightness-110"
          style={{ 
            fontSize: '15px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            backgroundColor: '#DAA520',
            padding: '14px 36px',
            borderRadius: '999px',
            border: 'none',
            textDecoration: 'none'
          }}
        >
          {currentSlideData.cta.label}
        </Link>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-6 transform -translate-y-1/2 z-20 rounded-full transition-colors"
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
        className="absolute top-1/2 right-6 transform -translate-y-1/2 z-20 rounded-full transition-colors"
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
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Mobile Responsiveness */}
      <style jsx>{`
        @media (max-width: 768px) {
          .hero-container {
            height: 480px !important;
          }
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
        .hero-container {
          height: 832px;
        }
        .hero-text {
          left: 120px;
        }
        .hero-supertitle {
          font-size: 28px;
          color: #DAA520;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          margin-bottom: 8px;
        }
        .hero-title {
          font-size: 70px;
          color: #000000;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .hero-description {
          font-size: 18px;
          color: #292929;
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
      `}</style>
    </div>
  );
}
