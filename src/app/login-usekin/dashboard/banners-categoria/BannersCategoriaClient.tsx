'use client'
import { useState } from 'react'

interface Props {
  banners: Record<string, string>
  links?: Record<string, string>
}

export default function BannersCategoriaClient({ banners, links }: Props) {
  const [loading, setLoading] = useState(false)
  const [bannersState, setBannersState] = useState(banners)
  const [linksState, setLinksState] = useState<Record<string, string>>(links || {})

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
        body: JSON.stringify({ banners: bannersState, links: linksState })
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
    },
    { 
      chave: 'banner-lateral-mousepads', 
      nome: 'Banner Lateral Mousepads', 
      dimensao: '366x634px',
      descricao: 'Banner lateral na página de mousepads (com link para WhatsApp)'
    }
  ]

  return (
    <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Banners de Categoria</h1>
          <button onClick={handleSalvar} disabled={loading}
            style={{ background: '#DAA520', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            {loading ? 'Salvando...' : 'Salvar Todos'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
          {bannerConfigs.map((config) => (
            <div key={config.chave} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>
                {config.nome}
              </h3>
              <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
                {config.descricao} ({config.dimensao})
              </p>
              
              <div
                onClick={() => document.getElementById(`upload-${config.chave}`)?.click()}
                style={{
                  width: '100%', 
                  height: 120, 
                  border: '2px dashed #E5E5E5', 
                  borderRadius: 8,
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: bannersState[config.chave] ? 'transparent' : '#F9F9F9', 
                  overflow: 'hidden'
                }}
              >
                {bannersState[config.chave]
                  ? <img src={bannersState[config.chave]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ color: '#AAAAAA', fontSize: 13 }}>+ Clique para adicionar imagem {config.dimensao}</span>
                }
              </div>
              
              <input 
                id={`upload-${config.chave}`} 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={e => handleUpload(e, config.chave)} 
              />

              {bannersState[config.chave] && (
                <div style={{ marginTop: 12 }}>
                  <a 
                    href={bannersState[config.chave]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none' }}
                  >
                    Ver imagem atual
                  </a>
                </div>
              )}

              {(config.chave === 'banner-lateral-categorias' || config.chave === 'banner-lateral-mousepads') && (
                <div style={{ marginTop: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
                    Link do banner (abre em nova aba)
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={linksState[config.chave] || ''}
                    onChange={e => setLinksState(prev => ({ ...prev, [config.chave]: e.target.value }))}
                    style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#292929' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
  )
}
