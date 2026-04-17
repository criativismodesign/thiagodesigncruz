'use client'
import { useState } from 'react'
import Link from 'next/link'

interface Produto {
  id: string
  nome: string
  tipo: string
  categoria: string
  precoAtual: number
  status: string
  sku: string | null
  colecao?: { nome: string } | null
  imagens?: { url: string }[]
}

interface Props {
  produtos: Produto[]
}

export default function ProdutosLista({ produtos }: Props) {
  const [busca, setBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    try {
      const response = await fetch(`/api/admin/produtos/${id}`, { method: 'DELETE' })
      if (response.ok) window.location.reload()
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
    }
  }

  const produtosFiltrados = produtos.filter(p => {
    const matchBusca = busca === '' || 
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(busca.toLowerCase()))
    const matchTipo = filtroTipo === '' || p.tipo === filtroTipo
    return matchBusca && matchTipo
  })

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>
          Produtos <span style={{ fontSize: 14, color: '#888', fontWeight: 400 }}>({produtos.length} total)</span>
        </h1>
        <Link href="/login-usekin/dashboard/produtos/novo"
          style={{ background: '#DAA520', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
          + Novo Produto
        </Link>
      </div>

      {/* Filtros */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 20, marginBottom: 24, display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Buscar por nome ou SKU</label>
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Nome do produto ou SKU..."
            style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14, color: '#292929', boxSizing: 'border-box' as const }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setFiltroTipo('')}
            style={{ padding: '8px 16px', borderRadius: 999, border: '1px solid #E5E5E5', cursor: 'pointer', fontSize: 13, fontWeight: filtroTipo === '' ? 700 : 400, background: filtroTipo === '' ? '#292929' : '#fff', color: filtroTipo === '' ? '#DAA520' : '#888' }}>
            Todos
          </button>
          <button onClick={() => setFiltroTipo('camiseta')}
            style={{ padding: '8px 16px', borderRadius: 999, border: '1px solid #E5E5E5', cursor: 'pointer', fontSize: 13, fontWeight: filtroTipo === 'camiseta' ? 700 : 400, background: filtroTipo === 'camiseta' ? '#F3E8FF' : '#fff', color: filtroTipo === 'camiseta' ? '#6B21A8' : '#888' }}>
            &#128083; Camisetas
          </button>
          <button onClick={() => setFiltroTipo('mousepad')}
            style={{ padding: '8px 16px', borderRadius: 999, border: '1px solid #E5E5E5', cursor: 'pointer', fontSize: 13, fontWeight: filtroTipo === 'mousepad' ? 700 : 400, background: filtroTipo === 'mousepad' ? '#FFF3E0' : '#fff', color: filtroTipo === 'mousepad' ? '#E65100' : '#888' }}>
            &#128071; Mousepads
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9F9F9' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#888', borderBottom: '1px solid #E5E5E5' }}>Produto</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#888', borderBottom: '1px solid #E5E5E5' }}>SKU</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#888', borderBottom: '1px solid #E5E5E5' }}>Tipo</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#888', borderBottom: '1px solid #E5E5E5' }}>Coleção</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#888', borderBottom: '1px solid #E5E5E5' }}>Preço</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#888', borderBottom: '1px solid #E5E5E5' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#888', borderBottom: '1px solid #E5E5E5' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.map((produto) => (
              <tr key={produto.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {produto.imagens?.[0]?.url && (
                      <img src={produto.imagens[0].url} alt={produto.nome}
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                    )}
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#292929' }}>{produto.nome}</div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {produto.sku ? (
                    <span style={{ fontSize: 13, fontFamily: 'monospace', background: '#F5F5F5', padding: '3px 8px', borderRadius: 4, color: '#292929' }}>
                      {produto.sku}
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: '#CCC' }}>sem SKU</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                    background: produto.tipo === 'mousepad' ? '#FFF3E0' : '#F3E8FF',
                    color: produto.tipo === 'mousepad' ? '#E65100' : '#6B21A8',
                  }}>
                    {produto.tipo === 'mousepad' ? 'MousePad' : 'Camiseta'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 14, color: '#888' }}>
                  {produto.colecao?.nome || '-'}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#292929' }}>
                  R$ {produto.precoAtual.toFixed(2).replace('.', ',')}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                    background: produto.status === 'ativo' ? '#DCFCE7' : '#FEE2E2',
                    color: produto.status === 'ativo' ? '#16A34A' : '#DC2626',
                  }}>
                    {produto.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <Link href={`/login-usekin/dashboard/produtos/${produto.id}`}
                      style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #E5E5E5', background: '#fff', fontSize: 12, cursor: 'pointer', color: '#292929', textDecoration: 'none', fontWeight: 500 }}>
                      Editar
                    </Link>
                    <button onClick={() => handleExcluir(produto.id)}
                      style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #FFCCCC', background: '#FFF0F0', fontSize: 12, cursor: 'pointer', color: '#CC0000', fontWeight: 500 }}>
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {produtosFiltrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
            <div style={{ fontSize: 16, marginBottom: 8 }}>Nenhum produto encontrado</div>
            <div style={{ fontSize: 14 }}>Tente ajustar os filtros ou adicione um novo produto</div>
          </div>
        )}
      </div>
    </div>
  )
}
