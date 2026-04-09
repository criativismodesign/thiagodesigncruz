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
}

export default function ProdutosPage() {
  const router = useRouter()
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
          colors: typeof produto.colors === 'string' ? JSON.parse(produto.colors) : produto.colors
        }))
        setProdutos(produtosComCores)
      } else {
        console.error('Erro na resposta da API:', response.status)
        setProdutos([])
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      setProdutos([])
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
    try {
      setUploadProgress(0)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'produtos')
      
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
    try {
      const response = await fetch('/api/admin/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setShowModal(false)
        setFormData({
          nome: '',
          tipo: 'camiseta',
          categoria: 'avulso',
          colecaoId: '',
          precoAtual: 0,
          precoDe: 0,
          cores: [],
          descricaoCurta: '',
          descricaoLonga: '',
          entregaPrazo: '',
          informacoes: '',
          status: 'ativo',
          ordemSecao: 0
        })
        setImagensProduto([])
        setShowEstoque(false)
        setEstoqueData({})
        router.refresh()
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
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
      descricaoCurta: '',
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
        setShowDeleteModal(false)
        setDeletingProduto(null)
        fetchProdutos()
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error)
    }
  }

  const handleCorChange = (cor: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      cores: checked 
        ? [...prev.cores, cor]
        : prev.cores.filter(c => c !== cor)
    }))
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
            Gestão de Produtos
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
              Produtos
            </h1>
            <p style={{ color: '#AAAAAA', marginTop: 8, margin: 0 }}>
              Gerencie os produtos Use KIN
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
            + Novo Produto
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
                <th style={{ textAlign: 'left', padding: '12px', fontSize: 14, color: '#666666' }}>Tipo</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: 14, color: '#666666' }}>Categoria</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: 14, color: '#666666' }}>Coleção</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: 14, color: '#666666' }}>Preço</th>
                <th style={{ textAlign: 'center', padding: '12px', fontSize: 14, color: '#666666' }}>Status</th>
                <th style={{ textAlign: 'center', padding: '12px', fontSize: 14, color: '#666666' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                  <td style={{ padding: '12px', fontSize: 14, color: '#292929' }}>{produto.name}</td>
                  <td style={{ padding: '12px', fontSize: 14, color: '#666666' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: 12,
                      background: produto.type === 'camiseta' ? '#E3F2FD' : '#FFF3E0',
                      color: produto.type === 'camiseta' ? '#1565C0' : '#E65100'
                    }}>
                      {produto.type === 'camiseta' ? 'Camiseta' : 'Mousepad'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: 14, color: '#666666' }}>
                    {produto.category ? 'Coleção' : 'Avulso'}
                  </td>
                  <td style={{ padding: '12px', fontSize: 14, color: '#666666' }}>
                    {produto.category?.name || '-'}
                  </td>
                  <td style={{ padding: '12px', fontSize: 14, color: '#666666' }}>
                    R$ {produto.price.toFixed(2)}
                    {produto.comparePrice && (
                      <span style={{ textDecoration: 'line-through', color: '#999', marginLeft: 8 }}>
                        R$ {produto.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: 12,
                      background: produto.active ? '#D4EDDA' : '#F8D7DA',
                      color: produto.active ? '#155724' : '#721C24'
                    }}>
                      {produto.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    <button 
                      onClick={() => handleEdit(produto)}
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
                        setDeletingProduto(produto)
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
          
          {produtos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666666' }}>
              Nenhum produto encontrado
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
              {editingProduto ? 'Editar Produto' : 'Novo Produto'}
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

              {/* Seção de Imagens */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 12, fontSize: 14, color: '#292929', fontWeight: 600 }}>
                  Imagens do Produto
                </label>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12, marginBottom: 16 }}>
                  {imagensProduto.map((imagem, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={imagem}
                        alt={`Imagem ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100px',
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
                          top: -8,
                          right: -8,
                          background: '#DC3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  {imagensProduto.length < (formData.tipo === 'camiseta' ? 5 : 9) && (
                    <div style={{
                      width: '100%',
                      height: '100px',
                      border: '2px dashed #E5E5E5',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative'
                    }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleUploadImage(file)
                        }}
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                      <div style={{ textAlign: 'center', color: '#666666', fontSize: 12 }}>
                        <div>+</div>
                        <div>Adicionar</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div style={{ fontSize: 12, color: '#666666' }}>
                  {formData.tipo === 'camiseta' 
                    ? `Imagens: ${imagensProduto.length}/5 (1 principal + até 4 adicionais)`
                    : `Imagens: ${imagensProduto.length}/9 (1 principal + até 8 adicionais)`
                  }
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
                    {['Preto', 'Branco'].map((cor) => (
                      <label key={cor} style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
                        <input
                          type="checkbox"
                          checked={formData.cores.includes(cor)}
                          onChange={(e) => handleCorChange(cor, e.target.checked)}
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
                    rows={2}
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
                  value={formData.ordemSecao}
                  onChange={(e) => setFormData(prev => ({ ...prev, ordemSecao: parseInt(e.target.value) || 0 }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontSize: 14
                  }}
                />
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
                      background: showEstoque ? '#007BFF' : 'transparent',
                      color: showEstoque ? 'white' : '#007BFF',
                      border: '1px solid #007BFF',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: 12
                    }}
                  >
                    {showEstoque ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                
                {showEstoque && (
                  <div style={{ padding: 16, background: '#F8F9FA', borderRadius: 8 }}>
                    {formData.tipo === 'camiseta' ? (
                      <div>
                        <div style={{ fontSize: 12, color: '#666666', marginBottom: 12 }}>
                          Grade de Estoque (Tamanho × Cor)
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              <th style={{ padding: 8, fontSize: 12, color: '#666666', textAlign: 'left' }}></th>
                              <th style={{ padding: 8, fontSize: 12, color: '#666666', textAlign: 'center' }}>PRETO</th>
                              <th style={{ padding: 8, fontSize: 12, color: '#666666', textAlign: 'center' }}>BRANCO</th>
                            </tr>
                          </thead>
                          <tbody>
                            {['P', 'M', 'G', 'GG'].map(tamanho => (
                              <tr key={tamanho}>
                                <td style={{ padding: 8, fontSize: 12, color: '#292929' }}>{tamanho}</td>
                                {['preto', 'branco'].map(cor => (
                                  <td key={cor} style={{ padding: 8, textAlign: 'center' }}>
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
                              textAlign: 'center',
                              marginLeft: 8
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: 12, color: '#666666', marginBottom: 12 }}>
                          Estoque Mousepad
                        </div>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
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
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingProduto(null)
                    setFormData(initialFormData)
                    setImagensProduto([])
                    setShowEstoque(false)
                    setEstoqueData({})
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
                  {editingProduto ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Excluir */}
      {showDeleteModal && deletingProduto && (
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
