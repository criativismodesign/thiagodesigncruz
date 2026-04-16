'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
  categoria: string
  tipo: string
  colecaoId: string | null
  colecao?: {
    id: string
    nome: string
  }
  imagemCamiseta: string | null
  imagemMousepad: string | null
  imagemCaneca: string | null
  imagemQuadrinho: string | null
  ativo: boolean
  destaque: boolean
  createdAt: string
  updatedAt: string
}

export default function ProdutosClient() {
  const router = useRouter()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroColecao, setFiltroColecao] = useState('')
  const [mostrarInativos, setMostrarInativos] = useState(false)

  useEffect(() => {
    carregarProdutos()
  }, [])

  const carregarProdutos = async () => {
    try {
      const response = await fetch('/api/admin/produtos')
      if (response.ok) {
        const data = await response.json()
        setProdutos(data)
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAtivo = async (id: string, ativo: boolean) => {
    try {
      const response = await fetch(`/api/admin/produtos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: !ativo })
      })
      if (response.ok) {
        carregarProdutos()
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
    }
  }

  const toggleDestaque = async (id: string, destaque: boolean) => {
    try {
      const response = await fetch(`/api/admin/produtos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destaque: !destaque })
      })
      if (response.ok) {
        carregarProdutos()
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
    }
  }

  const excluirProduto = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    
    try {
      const response = await fetch(`/api/admin/produtos/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        carregarProdutos()
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
    }
  }

  const produtosFiltrados = produtos.filter(produto => {
    const matchNome = produto.nome.toLowerCase().includes(filtro.toLowerCase())
    const matchCategoria = produto.categoria.toLowerCase().includes(filtroCategoria.toLowerCase())
    const matchColecao = produto.colecao?.nome.toLowerCase().includes(filtroColecao.toLowerCase()) || false
    const matchAtivo = mostrarInativos || produto.ativo
    
    return matchNome && matchCategoria && matchColecao && matchAtivo
  })

  if (loading) {
    return (
      <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: 16, color: '#888' }}>Carregando produtos...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Produtos</h1>
        <Link href="/login-usekin/dashboard/produtos/novo"
          style={{ background: '#DAA520', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
          + Novo Produto
        </Link>
      </div>

      {/* Filtros */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>Filtros</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
              Buscar por nome
            </label>
            <input
              type="text"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              placeholder="Digite o nome do produto..."
              style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14, color: '#292929' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
              Categoria
            </label>
            <input
              type="text"
              value={filtroCategoria}
              onChange={e => setFiltroCategoria(e.target.value)}
              placeholder="Filtrar por categoria..."
              style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14, color: '#292929' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
              Coleção
            </label>
            <input
              type="text"
              value={filtroColecao}
              onChange={e => setFiltroColecao(e.target.value)}
              placeholder="Filtrar por coleção..."
              style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14, color: '#292929' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={mostrarInativos}
                onChange={e => setMostrarInativos(e.target.checked)}
                style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#DAA520' }}
              />
              <span style={{ fontSize: 14, color: '#292929' }}>Mostrar inativos</span>
            </label>
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9F9F9' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Produto</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Categoria</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Coleção</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Preço</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((produto) => (
                <tr key={produto.id} style={{ borderBottom: '1px solid #E5E5E5' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {produto.imagemCamiseta && (
                        <img
                          src={produto.imagemCamiseta}
                          alt={produto.nome}
                          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }}
                        />
                      )}
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: '#292929' }}>{produto.nome}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{produto.descricao.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
  <span style={{
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    background: produto.tipo === 'mousepad' ? '#FFF3E0' : '#F3E8FF',
    color: produto.tipo === 'mousepad' ? '#E65100' : '#6B21A8',
  }}>
    {produto.tipo === 'mousepad' ? 'MousePad' : 'Camiseta'}
  </span>
</td>
                  <td style={{ padding: '12px', fontSize: 14, color: '#292929' }}>
                    {produto.colecao?.nome || '-'}
                  </td>
                  <td style={{ padding: '12px', fontSize: 14, color: '#292929' }}>
                    R$ {produto.preco.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button
                        onClick={() => toggleAtivo(produto.id, produto.ativo)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 4,
                          border: 'none',
                          fontSize: 12,
                          cursor: 'pointer',
                          background: produto.ativo ? '#46A520' : '#F0484A',
                          color: '#fff'
                        }}
                      >
                        {produto.ativo ? 'Ativo' : 'Inativo'}
                      </button>
                      {produto.destaque && (
                        <span style={{ padding: '4px 8px', background: '#DAA520', color: '#fff', borderRadius: 4, fontSize: 12 }}>
                          Destaque
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button
                        onClick={() => toggleDestaque(produto.id, produto.destaque)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 4,
                          border: '1px solid #E5E5E5',
                          background: '#fff',
                          fontSize: 12,
                          cursor: 'pointer',
                          color: '#292929'
                        }}
                      >
                        {produto.destaque ? 'Remover Destaque' : 'Destaque'}
                      </button>
                      <Link
                        href={`/login-usekin/dashboard/produtos/${produto.id}`}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 4,
                          border: '1px solid #E5E5E5',
                          background: '#fff',
                          fontSize: 12,
                          cursor: 'pointer',
                          color: '#292929',
                          textDecoration: 'none'
                        }}
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => excluirProduto(produto.id)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 4,
                          border: '1px solid #E5E5E5',
                          background: '#fff',
                          fontSize: 12,
                          cursor: 'pointer',
                          color: '#F0484A'
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {produtosFiltrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
            <div style={{ fontSize: 16, marginBottom: 8 }}>Nenhum produto encontrado</div>
            <div style={{ fontSize: 14 }}>
              {filtro || filtroCategoria || filtroColecao
                ? 'Tente ajustar os filtros'
                : 'Comece adicionando seu primeiro produto'
              }
            </div>
          </div>
        )}
      </div>

      {/* Resumo */}
      <div style={{ marginTop: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 16, flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Total de Produtos</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#292929' }}>{produtos.length}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 16, flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Produtos Ativos</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#46A520' }}>
            {produtos.filter(p => p.ativo).length}
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 16, flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Produtos em Destaque</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#DAA520' }}>
            {produtos.filter(p => p.destaque).length}
          </div>
        </div>
      </div>
    </div>
  )
}
