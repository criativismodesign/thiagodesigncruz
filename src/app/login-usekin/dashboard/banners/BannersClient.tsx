'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

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

export default function BannersClient() {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div>Carregando...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Header navegação */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#292929' }}>Use KIN Admin</span>
        <Link href="/login-usekin/dashboard" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Dashboard</Link>
        <Link href="/login-usekin/dashboard/produtos" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Produtos</Link>
        <Link href="/login-usekin/dashboard/colecoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Coleções</Link>
        <Link href="/login-usekin/dashboard/banners" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Banners</Link>
        <Link href="/login-usekin/dashboard/banners-categoria" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Banners Categoria</Link>
        <Link href="/login-usekin/dashboard/pedidos" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Pedidos</Link>
        <Link href="/login-usekin/dashboard/dados-envio" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Dados de Envio</Link>
        <Link href="/login-usekin/dashboard/configuracoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Configurações</Link>
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={async () => {
              await fetch('/api/admin/logout', { method: 'POST' })
              window.location.href = '/login-usekin'
            }}
            style={{ color: '#888', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14 }}
          >
            Sair
          </button>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '32px'
        }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Banners Hero</h1>
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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
              <th style={{ textAlign: 'left', padding: '12px', fontSize: 14, color: '#666666' }}>Título</th>
              <th style={{ textAlign: 'left', padding: '12px', fontSize: 14, color: '#666666' }}>Super Título</th>
              <th style={{ textAlign: 'center', padding: '12px', fontSize: 14, color: '#666666' }}>Ordem</th>
              <th style={{ textAlign: 'center', padding: '12px', fontSize: 14, color: '#666666' }}>Status</th>
              <th style={{ textAlign: 'center', padding: '12px' }}></th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                <td style={{ padding: '12px', fontSize: 14, color: '#292929' }}>{banner.titulo}</td>
                <td style={{ padding: '12px', fontSize: 14, color: '#666666' }}>
                  {banner.supertitulo || '-'}
                </td>
                <td style={{ textAlign: 'center', padding: '12px', fontSize: 14, color: '#666666' }}>
                  {banner.ordem}
                </td>
                <td style={{ textAlign: 'center', padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: 12,
                    background: banner.ativo ? '#D4EDDA' : '#F8D7DA',
                    color: banner.ativo ? '#155724' : '#721C24'
                  }}>
                    {banner.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td style={{ textAlign: 'center', padding: '12px' }}>
                  <button 
                    onClick={() => handleEdit(banner)}
                    style={{
                      background: '#007BFF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      marginRight: '8px',
                      cursor: 'pointer',
                      fontSize: 12
                    }}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
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
                  Super Título
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
                    fontSize: 14,
                    color: '#292929'
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
                    fontSize: 14,
                    color: '#292929'
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
                    resize: 'vertical',
                    color: '#292929'
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
                    fontSize: 14,
                    color: '#292929'
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
                    fontSize: 14,
                    color: '#292929'
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Ordem *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.ordem}
                  onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontSize: 14,
                    color: '#292929'
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Imagem
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
                    <img src={formData.imagem} alt="Preview" style={{ maxWidth: '200px', height: 'auto', borderRadius: '8px' }} />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
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
