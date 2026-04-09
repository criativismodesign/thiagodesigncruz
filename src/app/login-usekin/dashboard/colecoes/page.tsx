'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import LogoutButton from '@/components/admin/LogoutButton'

interface Colecao {
  id: string
  nome: string
  subtitulo: string
  imagemCamiseta?: string
  imagemMousepad?: string
  visivelHome: boolean
  ordemHome: number
  status: string
  produtos: { id: string }[]
}

export default function ColecoesPage() {
  const [colecoes, setColecoes] = useState<Colecao[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingColecao, setEditingColecao] = useState<Colecao | null>(null)
  const [deletingColecao, setDeletingColecao] = useState<Colecao | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    subtitulo: '',
    imagemCamiseta: '',
    imagemMousepad: '',
    visivelHome: false,
    ordemHome: 0,
    status: 'ativa'
  })

  useEffect(() => {
    fetchColecoes()
  }, [])

  const fetchColecoes = async () => {
    try {
      const response = await fetch('/api/admin/colecoes')
      if (response.ok) {
        const data = await response.json()
        setColecoes(data)
      }
    } catch (error) {
      console.error('Erro ao buscar coleções:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingColecao 
        ? `/api/admin/colecoes/${editingColecao.id}`
        : '/api/admin/colecoes'
      
      const method = editingColecao ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowModal(false)
        setEditingColecao(null)
        setFormData({
          nome: '',
          subtitulo: '',
          imagemCamiseta: '',
          imagemMousepad: '',
          visivelHome: false,
          ordemHome: 0,
          status: 'ativa'
        })
        fetchColecoes()
      }
    } catch (error) {
      console.error('Erro ao salvar coleção:', error)
    }
  }

  const handleEdit = (colecao: Colecao) => {
    setEditingColecao(colecao)
    setFormData({
      nome: colecao.nome,
      subtitulo: colecao.subtitulo,
      imagemCamiseta: colecao.imagemCamiseta || '',
      imagemMousepad: colecao.imagemMousepad || '',
      visivelHome: colecao.visivelHome,
      ordemHome: colecao.ordemHome,
      status: colecao.status
    })
    setShowModal(true)
  }

  const handleDelete = async () => {
    if (!deletingColecao) return
    
    try {
      const response = await fetch(`/api/admin/colecoes/${deletingColecao.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setShowDeleteModal(false)
        setDeletingColecao(null)
        fetchColecoes()
      }
    } catch (error) {
      console.error('Erro ao deletar coleção:', error)
    }
  }

  const handleImageUpload = async (file: File, type: 'camiseta' | 'mousepad') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('pasta', 'colecoes')

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({
          ...prev,
          [`imagem${type === 'camiseta' ? 'Camiseta' : 'Mousepad'}`]: data.url
        }))
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
            Gestão de Coleções
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
              Coleções
            </h1>
            <p style={{ color: '#AAAAAA', marginTop: 8, margin: 0 }}>
              Gerencie as coleções de produtos Use KIN
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
            + Nova Coleção
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
                <th style={{ textAlign: 'left', padding: '12px', fontSize: 14, color: '#666666' }}>Nome</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: 14, color: '#666666' }}>Subtítulo</th>
                <th style={{ textAlign: 'center', padding: '12px', fontSize: 14, color: '#666666' }}>Visível Home</th>
                <th style={{ textAlign: 'center', padding: '12px', fontSize: 14, color: '#666666' }}>Ordem</th>
                <th style={{ textAlign: 'center', padding: '12px', fontSize: 14, color: '#666666' }}>Status</th>
                <th style={{ textAlign: 'center', padding: '12px', fontSize: 14, color: '#666666' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {colecoes.map((colecao) => (
                <tr key={colecao.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                  <td style={{ padding: '12px', fontSize: 14, color: '#292929' }}>{colecao.nome}</td>
                  <td style={{ padding: '12px', fontSize: 14, color: '#666666' }}>{colecao.subtitulo}</td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: 12,
                      background: colecao.visivelHome ? '#D4EDDA' : '#F8D7DA',
                      color: colecao.visivelHome ? '#155724' : '#721C24'
                    }}>
                      {colecao.visivelHome ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', fontSize: 14, color: '#666666' }}>{colecao.ordemHome}</td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: 12,
                      background: colecao.status === 'ativa' ? '#D4EDDA' : '#F8D7DA',
                      color: colecao.status === 'ativa' ? '#155724' : '#721C24'
                    }}>
                      {colecao.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    <button 
                      onClick={() => handleEdit(colecao)}
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
                    <button 
                      onClick={() => {
                        setDeletingColecao(colecao)
                        setShowDeleteModal(true)
                      }}
                      style={{
                        background: '#DC3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: 12
                      }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {colecoes.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666666' }}>
              Nenhuma coleção encontrada
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
              {editingColecao ? 'Editar Coleção' : 'Nova Coleção'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Nome *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
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
                  Subtítulo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subtitulo}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitulo: e.target.value }))}
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
                  value={formData.ordemHome}
                  onChange={(e) => setFormData(prev => ({ ...prev, ordemHome: parseInt(e.target.value) || 0 }))}
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
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontSize: 14,
                    color: '#292929'
                  }}
                >
                  <option value="ativa">Ativa</option>
                  <option value="inativa">Inativa</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Imagem Camiseta
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'camiseta')
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontSize: 14
                  }}
                />
                {formData.imagemCamiseta && (
                  <div style={{ marginTop: 8 }}>
                    <img src={formData.imagemCamiseta} alt="Preview" style={{ maxWidth: '200px', height: 'auto', borderRadius: '8px' }} />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Imagem Mousepad
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'mousepad')
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontSize: 14
                  }}
                />
                {formData.imagemMousepad && (
                  <div style={{ marginTop: 8 }}>
                    <img src={formData.imagemMousepad} alt="Preview" style={{ maxWidth: '200px', height: 'auto', borderRadius: '8px' }} />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#292929' }}>
                  <input
                    type="checkbox"
                    checked={formData.visivelHome}
                    onChange={(e) => setFormData(prev => ({ ...prev, visivelHome: e.target.checked }))}
                    style={{ marginRight: 8 }}
                  />
                  Visível na Home
                </label>
              </div>

              <div style={{ marginBottom: 16 }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingColecao(null)
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
                  {editingColecao ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Excluir */}
      {showDeleteModal && deletingColecao && (
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
            maxWidth: '400px',
            width: '90%'
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
              Confirmar Exclusão
            </h2>
            <p style={{ fontSize: 14, color: '#666666', marginBottom: 24 }}>
              Tem certeza que deseja excluir a coleção "{deletingColecao.nome}"? Esta ação não pode ser desfeita.
            </p>
            
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletingColecao(null)
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
                onClick={handleDelete}
                style={{
                  background: '#DC3545',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#FFFFFF'
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
