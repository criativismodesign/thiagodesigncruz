'use client'

import Image from 'next/image'
import Link from 'next/link'

interface BannerCategoriaProps {
  titulo: string
  breadcrumb: {
    label: string
    href: string
    ativo?: boolean
  }[]
}

export default function BannerCategoria({ titulo, breadcrumb }: BannerCategoriaProps) {
  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      aspectRatio: '1920/440',
      overflow: 'hidden',
      marginBottom: '100px'
    }}>
      {/* Imagem de fundo */}
      <Image
        src="/images/banners/banner-categoria.jpg"
        alt="Banner de categoria"
        fill
        style={{ objectFit: 'contain', objectPosition: 'center' }}
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
        gap: '16px'
      }}>
        {/* Título */}
        <h1 style={{
          fontSize: '70px',
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
                  fontSize: '18px',
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
                    fontSize: '18px',
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
                  fontSize: '18px',
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
