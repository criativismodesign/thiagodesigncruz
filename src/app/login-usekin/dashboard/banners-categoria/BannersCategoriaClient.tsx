'use client'
import { useState } from 'react'

interface Props {
  banners: Record<string, string>
}

export default function BannersCategoriaClient({ banners }: Props) {
  const [loading, setLoading] = useState(false)
  const [bannersState, setBannersState] = useState(banners)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, chave: string) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('pasta', 'banners')
    
    const response = await fetch('/api/admin/upload', { 
      method: 'POST', 
      body: formData 
    })
    
    const data = await response.json()
    if (data.success) {
      setBannersState(prev => ({ ...prev, [chave]: data.url }))
    }
  }

  const handleSalvar = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/banners-categoria', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannersState)
      })
      
      if (response.ok) {
        alert('Banners salvos com sucesso!')
      } else {
        alert('Erro ao salvar banners')
      }
    } catch (error) {
      alert('Erro ao salvar: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const bannerConfigs = [
    { 
      chave: 'banner-categoria-todos-produtos', 
      nome: 'Todos Produtos', 
      dimensao: '1920x440px',
      descricao: 'Banner para página de todos os produtos'
    },
    { 
      chave: 'banner-categoria-oversizeds', 
      nome: 'Oversizeds', 
      dimensao: '1920x440px',
      descricao: 'Banner para página de camisetas oversizeds'
    },
    { 
      chave: 'banner-categoria-mousepads', 
      nome: 'Mousepads', 
      dimensao: '1920x440px',
      descricao: 'Banner para página de mousepads'
    },
    { 
      chave: 'banner-categoria-original-collection', 
      nome: 'Original Collection', 
      dimensao: '1920x440px',
      descricao: 'Banner para página original collection'
    },
    { 
      chave: 'banner-lateral-categorias', 
      nome: 'Banner Lateral Categorias', 
      dimensao: '366x634px',
      descricao: 'Banner lateral na página de categorias'
    }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Header navegação padrão */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
