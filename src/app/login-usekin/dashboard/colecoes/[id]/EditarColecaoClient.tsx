'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Colecao {
  id: string
  nome: string
  subtitulo: string
  imagemCamiseta: string | null
  imagemMousepad: string | null
  imagemBannerCategoria: string | null
  visivelHome: boolean
  ordemHome: number
  status: string
}

interface Props {
  colecao: Colecao
}

export default function EditarColecaoClient({ colecao }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: colecao.nome || '',
    subtitulo: colecao.subtitulo || '',
    visivelHome: colecao.visivelHome || false,
    ordemHome: colecao.ordemHome || 0,
    status: colecao.status || 'ativa',
  })
  const [imagemCamiseta, setImagemCamiseta] = useState<string>(colecao.imagemCamiseta || '')
  const [imagemMousepad, setImagemMousepad] = useState<string>(colecao.imagemMousepad || '')
  const [imagemBannerCategoria, setImagemBannerCategoria] = useState<string>(colecao.imagemBannerCategoria || '')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, tipo: 'camiseta' | 'mousepad' | 'bannerCategoria') => {
    const file = e.target.files?.[0]
    if (!file) return
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    formDataUpload.append('pasta', 'colecoes')
    const response = await fetch('/api/admin/upload', { method: 'POST', body: formDataUpload })
    const data = await response.json()
    if (data.success) {
      if (tipo === 'camiseta') setImagemCamiseta(data.url)
      else if (tipo === 'mousepad') setImagemMousepad(data.url)
      else if (tipo === 'bannerCategoria') setImagemBannerCategoria(data.url)
    }
  }

  const handleSalvar = async () => {
    if (!formData.nome || !formData.subtitulo) {
      alert('Nome e subtítulo são obrigatórios')
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/colecoes/${colecao.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imagemCamiseta, imagemMousepad, imagemBannerCategoria })
      })
      if (response.ok) {
        router.push('/login-usekin/dashboard/colecoes')
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
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Editar Coleção</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/login-usekin/dashboard/colecoes"
            style={{ background: '#F5F5F5', color: '#292929', borderRadius: 999, padding: '10px 24px', textDecoration: 'none', fontSize: 14 }}>
            Cancelar
          </a>
          <button onClick={handleSalvar} disabled={loading}
            style={{ background: '#DAA520', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Informações básicas */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>Informações</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Nome *</label>
            <input value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})}
              placeholder="Ex: MY LIFE MY STYLE"
              style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929', boxSizing: 'border-box' as const }} />
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Subtítulo *</label>
            <input value={formData.subtitulo} onChange={e => setFormData({...formData, subtitulo: e.target.value})}
              placeholder="Ex: COLLECTION | STREET ART"
              style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929', boxSizing: 'border-box' as const }} />
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Ordem na Home</label>
              <input type="number" value={formData.ordemHome} onChange={e => setFormData({...formData, ordemHome: parseInt(e.target.value) || 0})}
                style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929', boxSizing: 'border-box' as const }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929' }}>
                <option value="ativa">Ativa</option>
                <option value="inativa">Inativa</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="checkbox" id="visivelHome" checked={formData.visivelHome}
              onChange={e => setFormData({...formData, visivelHome: e.target.checked})}
              style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#DAA520' }} />
            <label htmlFor="visivelHome" style={{ fontSize: 14, fontWeight: 500, color: '#292929', cursor: 'pointer' }}>
              Visível na Home
            </label>
          </div>
        </div>
      </div>

      {/* Imagens para a Home */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Imagens da Home</h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>
          Estas imagens aparecem em par na seção de coleções da home. A camiseta fica como fundo e o mousepad sobreposto na parte inferior.
        </p>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* Imagem camiseta */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 8 }}>
              Camiseta (384x512px)
            </label>
            <div onClick={() => document.getElementById('upload-camiseta')?.click()}
              style={{ width: 120, height: 160, border: '2px dashed #E5E5E5', borderRadius: 8, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: imagemCamiseta ? 'transparent' : '#F9F9F9', overflow: 'hidden' }}>
              {imagemCamiseta
                ? <img src={imagemCamiseta} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <><span style={{ fontSize: 24, color: '#AAAAAA' }}>+</span><span style={{ fontSize: 11, color: '#AAAAAA', marginTop: 4 }}>Adicionar</span></>
              }
            </div>
            <input id="upload-camiseta" type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handleUpload(e, 'camiseta')} />
          </div>

          {/* Imagem mousepad */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 8 }}>
              Mousepad (336x158px)
            </label>
            <div onClick={() => document.getElementById('upload-mousepad')?.click()}
              style={{ width: 168, height: 79, border: '2px dashed #E5E5E5', borderRadius: 8, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: imagemMousepad ? 'transparent' : '#F9F9F9', overflow: 'hidden', marginTop: 8 }}>
              {imagemMousepad
                ? <img src={imagemMousepad} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <><span style={{ fontSize: 20, color: '#AAAAAA' }}>+</span><span style={{ fontSize: 11, color: '#AAAAAA', marginTop: 4 }}>Adicionar</span></>
              }
            </div>
            <input id="upload-mousepad" type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handleUpload(e, 'mousepad')} />
          </div>

          {/* Preview do par */}
          {(imagemCamiseta || imagemMousepad) && (
            <div>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 8 }}>
                Preview do Par
              </label>
              <div style={{ position: 'relative', width: 120 }}>
                <div style={{ width: 120, height: 160, background: '#F5F5F5', borderRadius: 8, overflow: 'hidden' }}>
                  {imagemCamiseta && <img src={imagemCamiseta} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                {imagemMousepad && (
                  <div style={{ position: 'relative', marginTop: '-22px', display: 'flex', justifyContent: 'center', zIndex: 10 }}>
                    <img src={imagemMousepad} style={{ width: 100, height: 47, objectFit: 'cover', borderRadius: 4 }} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Banner Categoria */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, marginTop: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 8 }}>
          Imagem Banner Categoria (1920x440px)
        </h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
          Aparece no topo da página de categoria desta coleção. Se excluir a coleção, este banner é removido automaticamente.
        </p>
        <div
          onClick={() => document.getElementById('upload-banner-categoria')?.click()}
          style={{
            width: '100%', height: 120, border: '2px dashed #E5E5E5', borderRadius: 8,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: imagemBannerCategoria ? 'transparent' : '#F9F9F9', overflow: 'hidden'
          }}
        >
          {imagemBannerCategoria
            ? <img src={imagemBannerCategoria} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ color: '#AAAAAA', fontSize: 13 }}>+ Clique para adicionar imagem 1920x440px</span>
          }
        </div>
        <input id="upload-banner-categoria" type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => handleUpload(e, 'bannerCategoria')} />
      </div>
    </div>
  )
}