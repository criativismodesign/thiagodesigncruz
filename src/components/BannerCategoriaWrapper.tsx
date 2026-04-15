'use client'

import { useState, useEffect } from 'react'

interface BannerCategoriaWrapperProps {
  categoria: string
  children: React.ReactNode
}

export default function BannerCategoriaWrapper({ categoria, children }: BannerCategoriaWrapperProps) {
  const [bannerUrl, setBannerUrl] = useState<string>('')

  useEffect(() => {
    // Carregar banner da categoria específica
    const bannerKey = `banner-categoria-${categoria.toLowerCase().replace(/\s+/g, '-')}`
    const storedBanner = localStorage.getItem(bannerKey)
    if (storedBanner) {
      setBannerUrl(storedBanner)
    }
  }, [categoria])

  return (
    <div>
      {bannerUrl && (
        <div style={{ 
          width: '100%', 
          height: '440px', 
          marginBottom: '40px',
          overflow: 'hidden',
          borderRadius: '12px'
        }}>
          <img 
            src={bannerUrl} 
            alt={`Banner ${categoria}`}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }}
          />
        </div>
      )}
      {children}
    </div>
  )
}
