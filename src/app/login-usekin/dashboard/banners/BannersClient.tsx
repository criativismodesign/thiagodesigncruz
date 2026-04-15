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
        <Link href="/login-usekin/dashboard" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>
          Dashboard
        </Link>
        <span style={{ color: '#888' }}>|</span>
        <Link href="/login-usekin/dashboard/produtos" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>
          Produtos
        </Link>
        <span style={{ color: '#888' }}>|</span>
        <Link href="/login-usekin/dashboard/colecoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>
          Coleções
        </Link>
        <span style={{ color: '#888' }}>|</span>
        <Link href="/login-usekin/dashboard/banners" style={{ background: '#2563eb', color: '#fff', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>
          Banners
        </Link>
        <span style={{ color: '#888' }}>|</span>
        <Link href="/login-usekin/dashboard/banners-categoria" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>
          Banners Categoria
        </Link>
        <span style={{ color: '#888' }}>|</span>
        <Link href="/login-usekin/dashboard/pedidos" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>
          Pedidos
        </Link>
        <span style={{ color: '#888' }}>|</span>
        <Link href="/login-usekin/dashboard/cupons" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>
          Cupons
        </Link>
        <span style={{ color: '#888' }}>|</span>
        <Link href="/login-usekin/dashboard/dados-envio" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>
          Dados de Envio
        </Link>
        <span style={{ color: '#888' }}>|</span>
        <Link href="/login-usekin/dashboard/configuracoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>
          Configurações
        </Link>
      </div>

      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Banners Hero</h1>
          <button
            onClick={() => setShowModal(true)}
            style={{ background: '#DAA520', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
          >
            + Novo Banner
          </button>
        </div>

        {/* Lista de banners */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {banners.map((banner) => (
            <div key={banner.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24 }}>
              <div style={{ display: 'flex', gap: 24 }}>
                {banner.imagem && (
                  <img
                    src={banner.imagem}
                    alt={banner.titulo}
                    style={{ width: 200, height: 120, objectFit: 'cover', borderRadius: 8 }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>
                    {banner.supertitulo && <span style={{ fontSize: 14, color: '#888', marginRight: 8 }}>{banner.supertitulo}</span>}
                    {banner.titulo}
                  </h3>
                  {banner.descricao && (
                    <p style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>{banner.descricao}</p>
                  )}
                  <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#888' }}>
                    <span>Ordem: {banner.ordem}</span>
                    <span>Status: {banner.ativo ? 'Ativo' : 'Inativo'}</span>
                    {banner.linkBotao && <span>Link: {banner.linkBotao}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleEdit(banner)}
                    style={{ padding: '6px 12px', border: '1px solid #E5E5E5', background: '#fff', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {banners.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
            <div style={{ fontSize: 16, marginBottom: 8 }}>Nenhum banner encontrado</div>
            <div style={{ fontSize: 14 }}>Clique em "Novo Banner" para começar</div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#292929', marginBottom: 20 }}>
                {editingBanner ? 'Editar Banner' : 'Novo Banner'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
                      Imagem
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6 }}
                    />
                    {formData.imagem && (
                      <img
                        src={formData.imagem}
                        alt="Preview"
                        style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6, marginTop: 8 }}
                      />
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
                      Suptítulo
                    </label>
                    <input
                      type="text"
                      value={formData.supertitulo}
                      onChange={(e) => setFormData(prev => ({ ...prev, supertitulo: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
                      Título *
                    </label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
                      Descrição
                    </label>
                    <textarea
                      value={formData.descricao}
                      onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                      rows={3}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
                      Texto do Botão
                    </label>
                    <input
                      type="text"
                      value={formData.textoBotao}
                      onChange={(e) => setFormData(prev => ({ ...prev, textoBotao: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
                      Link do Botão
                    </label>
                    <input
                      type="text"
                      value={formData.linkBotao}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkBotao: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6 }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
                        Ordem
                      </label>
                      <input
                        type="number"
                        value={formData.ordem}
                        onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6 }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
                        Status
                      </label>
                      <select
                        value={formData.ativo ? 'true' : 'false'}
                        onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.value === 'true' }))}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6 }}
                      >
                        <option value="true">Ativo</option>
                        <option value="false">Inativo</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{ padding: '8px 16px', border: '1px solid #E5E5E5', background: '#fff', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '8px 16px', background: '#DAA520', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}
                  >
                    {editingBanner ? 'Atualizar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
