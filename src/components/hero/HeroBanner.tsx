"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Palette } from "lucide-react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryText?: string;
  secondaryLink?: string;
  badge?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Sua Arte,",
    subtitle: "Seu Estilo",
    description: "Camisetas e mouse pads com estampas personalizadas. Use nosso editor para criar sua própria arte ou escolha entre nossos designs exclusivos feitos à mão.",
    ctaText: "Ver Produtos",
    ctaLink: "/produtos",
    secondaryText: "Crie Sua Arte",
    secondaryLink: "/criar-design",
    badge: "Crie designs únicos do seu jeito",
  },
  {
    id: 2,
    title: "Camisetas",
    subtitle: "Exclusivas",
    description: "Estampas únicas feitas por artistas nacionais. Qualidade premium e conforto garantido em todas as peças.",
    ctaText: "Explorar Camisetas",
    ctaLink: "/produtos?categoria=camisetas",
    secondaryText: "Ver Todos",
    secondaryLink: "/produtos",
    badge: "Novas coleções disponíveis",
  },
  {
    id: 3,
    title: "Mouse Pads",
    subtitle: "Personalizados",
    description: "Transforme seu workspace com mouse pads personalizados. Designs vibrantes e superfície otimizada para gaming e trabalho.",
    ctaText: "Ver Mouse Pads",
    ctaLink: "/produtos?categoria=mousepads",
    secondaryText: "Criar Design",
    secondaryLink: "/criar-design",
    badge: "Melhore sua produtividade",
  },
  {
    id: 4,
    title: "Designs",
    subtitle: "Limitados",
    description: "Edições especiais e coleções exclusivas. Peças únicas que você não encontra em nenhum outro lugar.",
    ctaText: "Coleções",
    ctaLink: "/produtos?tag=edi%C3%A7%C3%A3o-limitada",
    secondaryText: "Lançamentos",
    secondaryLink: "/produtos?tag=novo",
    badge: "Edições limitadas",
  },
  {
    id: 5,
    title: "Qualidade",
    subtitle: "Garantida",
    description: "Materiais premium e impressão de alta durabilidade. Satisfação garantida ou seu dinheiro de volta.",
    ctaText: "Conheça Mais",
    ctaLink: "/sobre",
    secondaryText: "Garantia",
    secondaryLink: "/politicas",
    badge: "100% satisfação",
  },
];

export default function HeroBanner() {
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
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
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
    <section className="relative overflow-hidden h-[300px] sm:h-[400px] lg:h-[500px]">
      {/* Background gradient and effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 via-transparent to-[var(--accent)]/10" />
      <div className="absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-[var(--primary)]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-96 lg:h-96 bg-[var(--accent)]/10 rounded-full blur-3xl" />

      {/* Slide indicators */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
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

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/20 backdrop-blur-sm p-2 text-white hover:bg-black/30 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/20 backdrop-blur-sm p-2 text-white hover:bg-black/30 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Slide content */}
      <div className="relative h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
            {/* Badge */}
            {currentSlideData.badge && (
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--secondary)] px-4 py-1.5 mb-6">
                <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                <span className="text-sm text-[var(--muted-foreground)]">
                  {currentSlideData.badge}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-6xl xl:text-7xl">
              <span className="block text-white">{currentSlideData.title}</span>
              <span className="block gradient-text mt-2">{currentSlideData.subtitle}</span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base lg:text-lg text-[var(--muted-foreground)] leading-relaxed">
              {currentSlideData.description}
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href={currentSlideData.ctaLink}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 sm:px-8 py-2.5 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-[var(--primary)]/25 hover:shadow-[var(--primary)]/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                {currentSlideData.ctaText}
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              {currentSlideData.secondaryText && currentSlideData.secondaryLink && (
                <Link
                  href={currentSlideData.secondaryLink}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--secondary)] px-6 sm:px-8 py-2.5 sm:py-3.5 text-sm sm:text-base font-semibold text-white hover:bg-[var(--border)] transition-all duration-300"
                >
                  {currentSlideData.secondaryText.includes("Crie") && <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--accent)]" />}
                  {currentSlideData.secondaryText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile swipe hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 sm:hidden">
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-white/50 rounded-full animate-pulse" />
          <div className="w-1 h-1 bg-white/50 rounded-full animate-pulse delay-75" />
          <div className="w-1 h-1 bg-white/50 rounded-full animate-pulse delay-150" />
        </div>
      </div>
    </section>
  );
}
