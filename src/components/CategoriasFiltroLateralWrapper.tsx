'use client'

import { useState, useEffect } from 'react'

interface CategoriasFiltroLateralWrapperProps {
  children: React.ReactNode
}

export default function CategoriasFiltroLateralWrapper({ children }: CategoriasFiltroLateralWrapperProps) {
  const [bannerLateral, setBannerLateral] = useState<string>('')

  useEffect(() => {
    // Carregar banner lateral das categorias
    const storedBanner = localStorage.getItem('banner-lateral-categorias')
    if (storedBanner) {
      setBannerLateral(storedBanner)
    }
  }, [])

  return (
    <div style={{ display: 'flex', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Banner Lateral */}
      {bannerLateral && (
        <div style={{ 
          width: '366px', 
          height: '634px', 
          flexShrink: 0,
          overflow: 'hidden',
          borderRadius: '12px'
        }}>
          <img 
            src={bannerLateral} 
            alt="Banner Categorias"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }}
          />
        </div>
      )}
      
      {/* Conteúdo Principal */}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  )
}
