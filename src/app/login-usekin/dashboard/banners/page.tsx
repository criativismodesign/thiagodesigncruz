'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import LogoutButton from '@/components/admin/LogoutButton'

interface HeroBanner {
  id: string
  imagem?: string
  supertitulo?: string
  titulo: string
  descricao?: string
  textoBotao: string
  linkBotao?: string
  ordem: number
  ativo: boolean
}

export default function BannersPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null)
  const [formData, setFormData] = useState({
    imagem: '',
    supertitulo: '',
    titulo: '',
    descricao: '',
    textoBotao: 'VER COLEÇÃO',
    linkBotao: '',
    ordem: 0,
    ativo: true
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/hero-banners')
      if (response.ok) {
        const data = await response.json()
        setBanners(data)
      }
    } catch (error) {
      console.error('Erro ao buscar banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingBanner 
        ? `/api/admin/hero-banners/${editingBanner.id}`
        : '/api/admin/hero-banners'
      
      const method = editingBanner ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowModal(false)
        setEditingBanner(null)
        setFormData({
          imagem: '',
          supertitulo: '',
          titulo: '',
          descricao: '',
          textoBotao: 'VER COLEÇÃO',
          linkBotao: '',
          ordem: 0,
          ativo: true
        })
        fetchBanners()
      }
    } catch (error) {
      console.error('Erro ao salvar banner:', error)
    }
  }

  const handleEdit = (banner: HeroBanner) => {
    setEditingBanner(banner)
    setFormData({
      imagem: banner.imagem || '',
      supertitulo: banner.supertitulo || '',
      titulo: banner.titulo,
      descricao: banner.descricao || '',
      textoBotao: banner.textoBotao,
      linkBotao: banner.linkBotao || '',
      ordem: banner.ordem,
      ativo: banner.ativo
    })
    setShowModal(true)
  }

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('pasta', 'banners')

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, imagem: data.url }))
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Carregando...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <div style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E5E5',
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link 
            href="/login-usekin/dashboard" 
            style={{ 
              textDecoration: 'none', 
              color: '#666666',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span> Voltar ao Dashboard</span>
          </Link>
          <span style={{ fontSize: 20, fontWeight: 600, color: '#292929' }}>
            Gestão de Banners
          </span>
        </div>
        <LogoutButton />
      </div>
      
      <div style={{ padding: '48px 40px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: '#292929', margin: 0 }}>
              Banners Hero
            </h1>
            <p style={{ color: '#AAAAAA', marginTop: 8, margin: 0 }}>
              Gerencie os banners da página inicial
            </p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            style={{
              background: '#DAA520',
              border: 'none',
              borderRadius: 999,
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              color: '#FFFFFF'
            }}
          >
            + Novo Banner
          </button>
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #E5E5E5'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {banners.map((banner) => (
              <div key={banner.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                border: '1px solid #F0F0F0',
                borderRadius: '8px',
                background: '#FAFAFA'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#292929' }}>
                      {banner.ordem}. {banner.titulo}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: 12,
                      background: banner.ativo ? '#D4EDDA' : '#F8D7DA',
                      color: banner.ativo ? '#155724' : '#721C24'
                    }}>
                      {banner.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  {banner.supertitulo && (
                    <p style={{ fontSize: 14, color: '#666666', margin: '0 0 4px 0' }}>
                      {banner.supertitulo}
                    </p>
                  )}
                  {banner.descricao && (
                    <p style={{ fontSize: 13, color: '#999999', margin: 0 }}>
                      {banner.descricao.substring(0, 100)}...
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => handleEdit(banner)}
                  style={{
                    background: '#007BFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: 14
                  }}
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
          
          {banners.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666666' }}>
              Nenhum banner encontrado
            </div>
          )}
        </div>
      </div>

      {/* Modal Criar/Editar */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>
              {editingBanner ? 'Editar Banner' : 'Novo Banner'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Imagem de Fundo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file)
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontSize: 14
                  }}
                />
                {formData.imagem && (
                  <div style={{ marginTop: 8 }}>
                    <img src={formData.imagem} alt="Preview" style={{ maxWidth: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Supertítulo
                </label>
                <input
                  type="text"
                  value={formData.supertitulo}
                  onChange={(e) => setFormData(prev => ({ ...prev, supertitulo: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontSize: 14
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Título *
                </label>
                <input
                  type="text"
                  required
                  value={formData.titulo}
                  onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontSize: 14
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontSize: 14,
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Texto do Botão
                </label>
                <input
                  type="text"
                  value={formData.textoBotao}
                  onChange={(e) => setFormData(prev => ({ ...prev, textoBotao: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontSize: 14
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Link do Botão
                </label>
                <input
                  type="text"
                  value={formData.linkBotao}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkBotao: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontSize: 14
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Ordem
                </label>
                <input
                  type="number"
                  value={formData.ordem}
                  onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontSize: 14
                  }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#292929' }}>
                  <input
                    type="checkbox"
                    checked={formData.ativo}
                    onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                    style={{ marginRight: 8 }}
                  />
                  Banner Ativo
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingBanner(null)
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: '#292929'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#DAA520',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#FFFFFF'
                  }}
                >
                  {editingBanner ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
