'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface BannerCategoriaProps {
  titulo: string
  breadcrumb: {
    label: string
    href: string
    ativo?: boolean
  }[]
  imagem?: string
  imagemMobile?: string
}

export default function BannerCategoria({ titulo, breadcrumb, imagem = "/images/banners/banner-categoria.jpg", imagemMobile }: BannerCategoriaProps) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  const imagemAtual = (isMobile && imagemMobile) ? imagemMobile : imagem

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      aspectRatio: '1920/560',
      overflow: 'hidden',
      marginBottom: '40px'
    }}>
      {/* Imagem de fundo */}
      <Image
        src={imagemAtual}
        alt="Banner de categoria"
        fill
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />
      
      {/* Container do conteúdo */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
        gap: '16px'
      }}>
        {/* Título */}
        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 50px)',
          fontWeight: 600,
          color: '#292929',
          textTransform: 'uppercase',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          margin: 0
        }}>
          {titulo}
        </h1>
        
        {/* Breadcrumb */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: 'center'
        }}>
          {breadcrumb.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {item.ativo ? (
                <span style={{
                  fontSize: 'clamp(12px, 2vw, 18px)',
                  fontWeight: 700,
                  color: '#F0484A',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  style={{
                    fontSize: 'clamp(12px, 2vw, 18px)',
                    fontWeight: 700,
                    color: '#292929',
                    fontFamily: 'Inter, sans-serif',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#BABABA'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#292929'
                  }}
                >
                  {item.label}
                </Link>
              )}
              
              {/* Separador */}
              {index < breadcrumb.length - 1 && (
                <span style={{
                  fontSize: 'clamp(12px, 2vw, 18px)',
                  fontWeight: 700,
                  color: '#292929',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  /
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
