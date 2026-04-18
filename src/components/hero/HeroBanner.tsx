"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  imagem: string | null;
  imagemMobile: string | null;
  supertitulo: string | null;
  titulo: string;
  descricao: string | null;
  textoBotao: string;
  linkBotao: string | null;
  ordem: number;
  ativo: boolean;
}

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/hero-banners')
      .then(r => r.json())
      .then(data => Array.isArray(data) ? setBanners(data) : [])
      .catch(() => {})
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || banners.length === 0) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, banners.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  if (banners.length === 0) return (
    <section className="w-full bg-[#F5F5F5]" style={{ height: '500px' }} />
  )

  const banner = banners[currentSlide]
  const imagemMobileDisponivel = banner.imagemMobile && banner.imagemMobile.length > 0
  const imagemAtual = (isMobile === true && imagemMobileDisponivel) ? banner.imagemMobile : banner.imagem

  return (
    <section className="relative w-full overflow-hidden" style={{ height: isMobile ? '100svh' : '832px', maxHeight: isMobile ? '812px' : '832px' }}>
      
      {imagemAtual && (
        <div className="absolute inset-0">
          <img
            src={imagemAtual}
            alt={banner.titulo}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 100%)' }} />
        </div>
      )}

      <div className={`relative z-10 h-full flex flex-col ${isMobile ? 'justify-start pt-10 px-6' : 'justify-center px-[120px]'}`}>
        <div className={isMobile ? 'max-w-full' : 'max-w-[700px]'}>
          {banner.supertitulo && (
            <p style={{ fontSize: isMobile ? '12px' : '14px', color: '#DAA520', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
              {banner.supertitulo}
            </p>
          )}
          <h1 style={{ fontSize: isMobile ? '36px' : '64px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1, marginBottom: isMobile ? '16px' : '24px', textTransform: 'uppercase' }}>
            {banner.titulo}
          </h1>
          {banner.descricao && (
            <p style={{ fontSize: isMobile ? '13px' : '18px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: isMobile ? '24px' : '40px', maxWidth: isMobile ? '100%' : '500px' }}>
              {banner.descricao}
            </p>
          )}
          {banner.linkBotao && (
            <Link href={banner.linkBotao}
              style={{ display: 'inline-block', background: '#DAA520', color: '#fff', fontWeight: 700, fontSize: isMobile ? '13px' : '15px', padding: isMobile ? '12px 28px' : '16px 40px', borderRadius: '999px', textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {banner.textoBotao}
            </Link>
          )}
        </div>
      </div>

      <button onClick={goToPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition-colors">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition-colors">
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, index) => (
          <button key={index} onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2'}`} />
        ))}
      </div>

    </section>
  )
}
