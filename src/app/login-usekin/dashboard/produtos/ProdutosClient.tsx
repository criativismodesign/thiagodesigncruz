'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import LogoutButton from '@/components/admin/LogoutButton'

interface Produto {
  id: string
  name: string
  type: string
  categoryId?: string
  category?: { id: string; name: string }
  price: number
  comparePrice?: number
  colors: string[] | string
  description?: string
  active: boolean
  createdAt: string
  images?: string[]
}

interface Colecao {
  id: string
  nome: string
  ativa: boolean
  ordemHome: number
}

export default function ProdutosClient() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [colecoes, setColecoes] = useState<Colecao[]>([])
  const [imagensProduto, setImagensProduto] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [showEstoque, setShowEstoque] = useState(false)
  const [estoqueData, setEstoqueData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null)
  const [deletingProduto, setDeletingProduto] = useState<Produto | null>(null)
  const initialFormData = {
    nome: '',
    tipo: 'camiseta',
    categoria: 'avulso',
    colecaoId: '',
    precoAtual: 0,
    precoDe: 0,
    cores: [] as string[],
    descricaoCurta: '',
    descricaoLonga: '',
    entregaPrazo: '',
    informacoes: '',
    status: 'ativo',
    ordemSecao: 0
  }
  
  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
    fetchProdutos()
    fetchColecoes()
  }, [])

  const fetchProdutos = async () => {
    try {
      const response = await fetch('/api/admin/produtos')
      if (response.ok) {
        const data = await response.json()
        // Parse colors JSON string to array
        const produtosComCores = data.map((produto: any) => ({
          ...produto,
          colors: typeof produto.colors === 'string' ? JSON.parse(produto.colors) : produto.colors,
          images: typeof produto.images === 'string' ? JSON.parse(produto.images) : produto.images || []
        }))
        setProdutos(produtosComCores)
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchColecoes = async () => {
    try {
      const response = await fetch('/api/admin/colecoes')
      if (response.ok) {
        const data = await response.json()
        setColecoes(data)
      }
    } catch (error) {
      console.error('Erro ao buscar coleções:', error)
    }
  }

  const handleUploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'produtos')

    try {
      setUploadProgress(0)
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setImagensProduto(prev => [...prev, result.url])
        setUploadProgress(100)
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
    }
  }

  const handleRemoveImage = (index: number) => {
    setImagensProduto(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Validar campos obrigatórios
      if (!formData.nome || !formData.tipo || !formData.categoria || formData.precoAtual === 0) {
        alert('Preencha os campos obrigatórios: Nome, Tipo, Categoria e Preço')
        return
      }
      
      const response = await fetch('/api/admin/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Produto criado:', result)
        
        setShowModal(false)
        setFormData(initialFormData)
        setImagensProduto([])
        setShowEstoque(false)
        setEstoqueData({})
        
        // Recarregar a lista de produtos
        await fetchProdutos()
      } else {
        const error = await response.json()
        console.error('Erro na API:', error)
        alert(`Erro ao criar produto: ${error.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      alert('Erro ao salvar produto. Tente novamente.')
    }
  }

  const handleEdit = (produto: Produto) => {
    setEditingProduto(produto)
    setFormData({
      nome: produto.name,
      tipo: produto.type,
      categoria: produto.categoryId ? 'colecao' : 'avulso',
      colecaoId: produto.categoryId || '',
      precoAtual: produto.price,
      precoDe: produto.comparePrice || 0,
      cores: Array.isArray(produto.colors) ? produto.colors : [],
      descricaoCurta: produto.description || '',
      descricaoLonga: produto.description || '',
      entregaPrazo: '',
      informacoes: '',
      status: produto.active ? 'ativo' : 'inativo',
      ordemSecao: 0
    })
    setImagensProduto(produto.images || [])
    setShowModal(true)
  }

  const handleEstoqueChange = (tamanho?: string, cor?: string, value?: number) => {
    const key = tamanho && cor ? `${tamanho}-${cor}` : 'geral'
    setEstoqueData((prev: any) => ({
      ...prev,
      [key]: {
        quantidade: value || 0,
        minimo: prev[key]?.minimo || 3
      }
    }))
  }

  const handleMinimoChange = (tamanho?: string, cor?: string, value?: number) => {
    const key = tamanho && cor ? `${tamanho}-${cor}` : 'geral'
    setEstoqueData((prev: any) => ({
      ...prev,
      [key]: {
        quantidade: prev[key]?.quantidade || 0,
        minimo: value || 3
      }
    }))
  }

  const handleDelete = async () => {
    if (!deletingProduto) return

    try {
      const response = await fetch(`/api/admin/produtos/${deletingProduto.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProdutos(prev => prev.filter(p => p.id !== deletingProduto.id))
        setShowDeleteModal(false)
        setDeletingProduto(null)
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error)
    }
  }

  const router = useRouter()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 16, color: '#666666' }}>Carregando...</div>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#292929', margin: 0 }}>
            Use KIM Admin
          </h1>
          <nav style={{ display: 'flex', gap: 16 }}>
            <Link 
              href="/login-usekin/dashboard"
              style={{ 
                fontSize: 14, 
                color: '#666666', 
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Dashboard
            </Link>
            <Link 
              href="/login-usekin/dashboard/produtos"
              style={{ 
                fontSize: 14, 
                color: '#FFFFFF', 
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                background: '#007BFF'
              }}
            >
              Produtos
            </Link>
            <Link 
              href="/login-usekin/dashboard/colecoes"
              style={{ 
                fontSize: 14, 
                color: '#666666', 
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Coleções
            </Link>
            <Link 
              href="/login-usekin/dashboard/banners"
              style={{ 
                fontSize: 14, 
                color: '#666666', 
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Banners
            </Link>
          </nav>
        </div>
        <LogoutButton />
      </div>

      <div style={{ padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#292929', margin: 0 }}>
            Produtos
          </h2>
          <button
            onClick={() => {
              setEditingProduto(null)
              setFormData(initialFormData)
              setImagensProduto([])
              setShowEstoque(false)
              setEstoqueData({})
              setShowModal(true)
            }}
            style={{
              background: '#007BFF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007BFF'}
          >
            + Novo Produto
          </button>
        </div>

        <div style={{ 
          background: '#FFFFFF', 
          borderRadius: '12px', 
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#F8F9FA' }}>
              <tr>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#292929' }}>Produto</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#292929' }}>Tipo</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#292929' }}>Preço</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#292929' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#292929' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id} style={{ borderBottom: '1px solid #E5E5E5' }}>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 4 }}>
                        {produto.name}
                      </div>
                      {produto.category && (
                        <div style={{ fontSize: 12, color: '#666666' }}>
                          {produto.category.name}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: 14, color: '#666666' }}>
                    {produto.type === 'camiseta' ? 'Camiseta' : 'Mousepad'}
                  </td>
                  <td style={{ padding: '16px', fontSize: 14, color: '#666666' }}>
                    R$ {produto.price.toFixed(2)}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: 12,
                      fontWeight: 500,
                      background: produto.active ? '#D4EDDA' : '#F8D7DA',
                      color: produto.active ? '#155724' : '#721C24'
                    }}>
                      {produto.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleEdit(produto)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #E5E5E5',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: 12,
                        color: '#666666',
                        cursor: 'pointer',
                        marginRight: 8,
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#F5F5F5'
                        e.currentTarget.style.color = '#292929'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#666666'
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setDeletingProduto(produto)
                        setShowDeleteModal(true)
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid #E5E5E5',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: 12,
                        color: '#666666',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#F8D7DA'
                        e.currentTarget.style.borderColor = '#F5C6CB'
                        e.currentTarget.style.color = '#721C24'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.borderColor = '#E5E5E5'
                        e.currentTarget.style.color = '#666666'
                      }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {produtos.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: 16, color: '#666666', marginBottom: 16 }}>
                Nenhum produto encontrado
              </div>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  background: '#007BFF',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Criar primeiro produto
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Criar/Editar Produto */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #E5E5E5'
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#292929', margin: 0 }}>
                {editingProduto ? 'Editar Produto' : 'Novo Produto'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
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

              {/* Seção de Imagens */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 12, fontSize: 14, color: '#292929', fontWeight: 600 }}>
                  Imagens do Produto
                </label>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                  gap: 12,
                  marginBottom: 16 
                }}>
                  {imagensProduto.map((imagem, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img 
                        src={imagem} 
                        alt={`Preview ${index + 1}`}
                        style={{ 
                          width: '100%', 
                          height: '120px', 
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #E5E5E5'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          background: '#DC3545',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  {imagensProduto.length < (formData.tipo === 'camiseta' ? 5 : 9) && (
                    <button
                      type="button"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      style={{
                        width: '100%',
                        height: '120px',
                        border: '2px dashed #E5E5E5',
                        borderRadius: '8px',
                        background: '#F8F9FA',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        color: '#666666',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#007BFF'
                        e.currentTarget.style.background = '#F0F8FF'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#E5E5E5'
                        e.currentTarget.style.background = '#F8F9FA'
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 4 }}>+</div>
                      <div>Adicionar</div>
                    </button>
                  )}
                </div>

                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files
                    if (files) {
                      Array.from(files).forEach(file => handleUploadImage(file))
                    }
                  }}
                  style={{ display: 'none' }}
                />

                <div style={{ fontSize: 12, color: '#666666' }}>
                  {imagensProduto.length}/{formData.tipo === 'camiseta' ? 5 : 9} imagens
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{
                      height: '4px',
                      background: '#E5E5E5',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${uploadProgress}%`,
                        background: '#007BFF',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Seção de Estoque */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <label style={{ fontSize: 14, color: '#292929', fontWeight: 600 }}>
                    Gestão de Estoque
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowEstoque(!showEstoque)}
                    style={{
                      background: 'transparent',
                      border: '1px solid #E5E5E5',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: 12,
                      color: '#666666',
                      cursor: 'pointer'
                    }}
                  >
                    {showEstoque ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>

                {showEstoque && (
                  <div style={{ background: '#F8F9FA', padding: 16, borderRadius: 8 }}>
                    {formData.tipo === 'camiseta' ? (
                      <div>
                        <div style={{ marginBottom: 12, fontSize: 12, color: '#666666' }}>
                          Tamanhos × Cores
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              <th style={{ padding: 4, fontSize: 11, color: '#666666', textAlign: 'left' }}>Tamanho</th>
                              {['Preto', 'Branco'].map(cor => (
                                <th key={cor} style={{ padding: 4, fontSize: 11, color: '#666666', textAlign: 'center' }}>
                                  {cor}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {['P', 'M', 'G', 'GG'].map(tamanho => (
                              <tr key={tamanho}>
                                <td style={{ padding: 4, fontSize: 11, color: '#666666' }}>{tamanho}</td>
                                {['Preto', 'Branco'].map(cor => (
                                  <td key={cor} style={{ padding: 4, textAlign: 'center' }}>
                                    <input
                                      type="number"
                                      min="0"
                                      placeholder="0"
                                      onChange={(e) => handleEstoqueChange(tamanho, cor, parseInt(e.target.value) || 0)}
                                      style={{
                                        width: '60px',
                                        padding: '4px',
                                        border: '1px solid #E5E5E5',
                                        borderRadius: '4px',
                                        fontSize: 12,
                                        textAlign: 'center',
                                        color: '#292929'
                                      }}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div style={{ marginTop: 12, fontSize: 12, color: '#666666' }}>
                          Mínimo para aviso: 
                          <input
                            type="number"
                            min="1"
                            defaultValue="3"
                            onChange={(e) => handleMinimoChange(undefined, undefined, parseInt(e.target.value) || 3)}
                            style={{
                              width: '60px',
                              padding: '4px',
                              border: '1px solid #E5E5E5',
                              borderRadius: '4px',
                              fontSize: 12,
                              marginLeft: 8,
                              color: '#292929'
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 16 }}>
                        <div>
                          <label style={{ fontSize: 12, color: '#292929', display: 'block', marginBottom: 4 }}>
                            Quantidade:
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            onChange={(e) => handleEstoqueChange(undefined, undefined, parseInt(e.target.value) || 0)}
                            style={{
                              width: '80px',
                              padding: '8px',
                              border: '1px solid #E5E5E5',
                              borderRadius: '4px',
                              fontSize: 12,
                              color: '#292929'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 12, color: '#292929', display: 'block', marginBottom: 4 }}>
                            Mínimo:
                          </label>
                          <input
                            type="number"
                            min="1"
                            defaultValue="3"
                            onChange={(e) => handleMinimoChange(undefined, undefined, parseInt(e.target.value) || 3)}
                            style={{
                              width: '80px',
                              padding: '8px',
                              border: '1px solid #E5E5E5',
                              borderRadius: '4px',
                              fontSize: 12,
                              color: '#292929'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Tipo
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontSize: 14,
                    color: '#292929'
                  }}
                >
                  <option value="camiseta">Camiseta</option>
                  <option value="mousepad">Mousepad</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Categoria
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value, colecaoId: '' }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontSize: 14,
                    color: '#292929'
                  }}
                >
                  <option value="avulso">Avulso</option>
                  <option value="colecao">Coleção</option>
                </select>
              </div>

              {formData.categoria === 'colecao' && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                    Coleção
                  </label>
                  <select
                    value={formData.colecaoId}
                    onChange={(e) => setFormData(prev => ({ ...prev, colecaoId: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E5E5',
                      borderRadius: '8px',
                      fontSize: 14,
                      color: '#292929'
                    }}
                  >
                    <option value="">Selecione uma coleção</option>
                    {colecoes.map((colecao) => (
                      <option key={colecao.id} value={colecao.id}>
                        {colecao.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Preço Atual *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precoAtual}
                  onChange={(e) => setFormData(prev => ({ ...prev, precoAtual: parseFloat(e.target.value) || 0 }))}
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
                  Preço "DE"
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precoDe}
                  onChange={(e) => setFormData(prev => ({ ...prev, precoDe: parseFloat(e.target.value) || 0 }))}
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

              {formData.tipo === 'camiseta' && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                    Cores
                  </label>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {['Preto', 'Branco'].map(cor => (
                      <label key={cor} style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#292929' }}>
                        <input
                          type="checkbox"
                          checked={formData.cores.includes(cor)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({ ...prev, cores: [...prev.cores, cor] }))
                            } else {
                              setFormData(prev => ({ ...prev, cores: prev.cores.filter(c => c !== cor) }))
                            }
                          }}
                          style={{ marginRight: 8 }}
                        />
                        {cor}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Descrição Curta
                </label>
                <textarea
                  value={formData.descricaoCurta}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricaoCurta: e.target.value }))}
                  placeholder="Breve descrição do produto (até 200 caracteres)"
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
                  Descrição Longa
                </label>
                <textarea
                  value={formData.descricaoLonga}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricaoLonga: e.target.value }))}
                  placeholder="Descrição detalhada do produto"
                  rows={5}
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
                  Entrega e Prazo
                </label>
                <input
                  type="text"
                  value={formData.entregaPrazo}
                  onChange={(e) => setFormData(prev => ({ ...prev, entregaPrazo: e.target.value }))}
                  placeholder="Ex: 5 a 10 dias úteis"
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

              {formData.tipo === 'mousepad' && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                    Informações Adicionais
                  </label>
                  <textarea
                    value={formData.informacoes}
                    onChange={(e) => setFormData(prev => ({ ...prev, informacoes: e.target.value }))}
                    placeholder="Informações adicionais sobre o produto"
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
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Status
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
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#292929' }}>
                  Ordem na Seção
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.ordemSecao}
                  onChange={(e) => setFormData(prev => ({ ...prev, ordemSecao: parseInt(e.target.value) || 0 }))}
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

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingProduto(null)
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: 14,
                    color: '#666666',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#007BFF',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007BFF'}
                >
                  {editingProduto ? 'Atualizar' : 'Criar'} Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Exclusão */}
      {showDeleteModal && deletingProduto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '400px'
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>
              Confirmar Exclusão
            </h3>
            <p style={{ fontSize: 14, color: '#666666', marginBottom: 24 }}>
              Tem certeza que deseja excluir o produto "{deletingProduto.name}"? Esta ação não pode ser desfeita.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletingProduto(null)
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: 14,
                  color: '#666666',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                style={{
                  background: '#DC3545',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer'
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
