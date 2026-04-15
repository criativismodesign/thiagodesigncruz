'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EditarBannerClient({ banner }: { banner: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagem, setImagem] = useState<string>(banner.imagem || '')
  const [formData, setFormData] = useState({
    supertitulo: banner.supertitulo || '',
    titulo: banner.titulo || '',
    descricao: banner.descricao || '',
    textoBotao: banner.textoBotao || '',
    linkBotao: banner.linkBotao || '',
    ordem: banner.ordem || 1,
    ativo: banner.ativo ?? true,
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    formDataUpload.append('pasta', 'banners')
    const response = await fetch('/api/admin/upload', { method: 'POST', body: formDataUpload })
    const data = await response.json()
    if (data.success) setImagem(data.url)
  }

  const handleSalvar = async () => {
    if (!formData.titulo) {
      alert('Título é obrigatório')
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/hero-banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imagem })
      })
      if (response.ok) {
        router.push('/login-usekin/dashboard/banners')
      } else {
        const data = await response.json()
        alert('Erro: ' + data.error)
      }
    } catch (error) {
      alert('Erro ao salvar: ' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '32px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>
            Editar Banner {formData.ordem}
          </h1>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="/login-usekin/dashboard/banners"
              style={{ background: '#F5F5F5', color: '#292929', borderRadius: 999, padding: '10px 24px', textDecoration: 'none', fontSize: 14 }}>
              Cancelar
            </a>
            <button onClick={handleSalvar} disabled={loading}
              style={{ background: '#DAA520', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>

        {/* Imagem de fundo */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>Imagem de Fundo (1920x832px)</h2>
          <div onClick={() => document.getElementById('upload-banner')?.click()}
            style={{ width: '100%', height: 200, border: '2px dashed #E5E5E5', borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: imagem ? 'transparent' : '#F9F9F9', overflow: 'hidden', position: 'relative' }}>
            {imagem
              ? <img src={imagem} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ color: '#AAAAAA', fontSize: 14 }}>+ Clique para adicionar imagem de fundo</span>
            }
          </div>
          <input id="upload-banner" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
          {imagem && (
            <button onClick={() => setImagem('')}
              style={{ marginTop: 8, background: 'transparent', border: 'none', color: '#F0484A', cursor: 'pointer', fontSize: 13 }}>
              Remover imagem
            </button>
          )}
        </div>

        {/* Textos */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>Textos</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Supertítulo</label>
              <input value={formData.supertitulo} onChange={e => setFormData({...formData, supertitulo: e.target.value})}
                placeholder='Ex: Coleção os "Immortals" 2026'
                style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929', boxSizing: 'border-box' as const }} />
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Título *</label>
              <input value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})}
                placeholder="Ex: Camisetas STYLE"
                style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929', boxSizing: 'border-box' as const }} />
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Descrição</label>
              <textarea value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})}
                rows={3} placeholder="Texto descritivo do banner em caixa alta"
                style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929', boxSizing: 'border-box' as const, resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* Botão CTA */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>Botão CTA</h2>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Texto do Botão</label>
              <input value={formData.textoBotao} onChange={e => setFormData({...formData, textoBotao: e.target.value})}
                placeholder="Ex: VER COLEÇÃO"
                style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929', boxSizing: 'border-box' as const }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Link do Botão</label>
              <input value={formData.linkBotao} onChange={e => setFormData({...formData, linkBotao: e.target.value})}
                placeholder="Ex: /colecao/immortals"
                style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929', boxSizing: 'border-box' as const }} />
            </div>
          </div>
        </div>

        {/* Configurações */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>Configurações</h2>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Ordem</label>
              <input type="number" value={formData.ordem} onChange={e => setFormData({...formData, ordem: parseInt(e.target.value) || 1})}
                style={{ width: 80, border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20 }}>
              <input type="checkbox" id="ativo" checked={formData.ativo}
                onChange={e => setFormData({...formData, ativo: e.target.checked})}
                style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#DAA520' }} />
              <label htmlFor="ativo" style={{ fontSize: 14, fontWeight: 500, color: '#292929', cursor: 'pointer' }}>Banner Ativo</label>
            </div>
          </div>
        </div>
      </div>
  )
}
