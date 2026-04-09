'use client'

import { useState } from 'react'

interface Produto {
  id: string
  nome: string
  tipo: string
  categoria: string
  precoAtual: number
  precoDe?: number | null
  status: string
}

interface Props {
  produtosIniciais: Produto[]
}

export default function ProdutosClient({ produtosIniciais }: Props) {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'camiseta',
    categoria: 'avulso',
    precoAtual: '',
    precoDe: '',
    status: 'ativo',
  })

  const handleSubmit = async () => {
    if (!formData.nome || !formData.precoAtual) {
      alert('Nome e preço são obrigatórios')
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/admin/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setShowModal(false)
        setFormData({ nome: '', tipo: 'camiseta', categoria: 'avulso', precoAtual: '', precoDe: '', status: 'ativo' })
        const listResponse = await fetch('/api/admin/produtos')
        const novosProdutos = await listResponse.json()
        setProdutos(novosProdutos)
      } else {
        alert('Erro: ' + data.error)
      }
    } catch (error) {
      alert('Erro ao salvar: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    
    try {
      await fetch(`/api/admin/produtos/${id}`, { method: 'DELETE' })
      setProdutos(produtos.filter(p => p.id !== id))
    } catch (error) {
      alert('Erro ao excluir: ' + error)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Header navegação */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#292929' }}>Use KIN Admin</span>
        <a href="/login-usekin/dashboard" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Dashboard</a>
        <a href="/login-usekin/dashboard/produtos" style={{ background: '#2563eb', color: '#fff', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Produtos</a>
        <a href="/login-usekin/dashboard/colecoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Coleções</a>
        <a href="/login-usekin/dashboard/banners" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Banners</a>
        <div style={{ marginLeft: 'auto' }}>
          <a href="/api/admin/logout" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Sair</a>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Produtos</h1>
          <button
            onClick={() => setShowModal(true)}
            style={{ background: '#DAA520', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}
          >
            + Novo Produto
          </button>
        </div>

        {/* Tabela */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#292929' }}>Nome</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#292929' }}>Tipo</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#292929' }}>Categoria</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#292929' }}>Preço</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#292929' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, color: '#292929' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#888' }}>Nenhum produto encontrado</td>
                </tr>
              ) : (
                produtos.map(produto => (
                  <tr key={produto.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>{produto.nome}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>{produto.tipo}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>{produto.categoria}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>R$ {produto.precoAtual ? Number(produto.precoAtual).toFixed(2) : '0.00'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>{produto.status}</td>
                    <td style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
                      <button onClick={() => handleExcluir(produto.id)} style={{ background: '#F0484A', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12 }}>Excluir</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal criar produto */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, width: 500, maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: '#292929' }}>Novo Produto</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Nome *</label>
                <input value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929', boxSizing: 'border-box' }} />
              </div>
              
              <div>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Tipo</label>
                <select value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})} style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929' }}>
                  <option value="camiseta">Camiseta</option>
                  <option value="mousepad">Mousepad</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Categoria</label>
                <select value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929' }}>
                  <option value="avulso">Avulso</option>
                  <option value="colecao">Coleção</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Preço Atual *</label>
                <input type="number" value={formData.precoAtual} onChange={e => setFormData({...formData, precoAtual: e.target.value})} style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Preço "DE"</label>
                <input type="number" value={formData.precoDe} onChange={e => setFormData({...formData, precoDe: e.target.value})} style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929' }}>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ background: '#F5F5F5', color: '#292929', border: 'none', borderRadius: 999, padding: '10px 24px', cursor: 'pointer', fontSize: 14 }}>Cancelar</button>
              <button onClick={handleSubmit} disabled={loading} style={{ background: '#DAA520', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                {loading ? 'Salvando...' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
                                                                                                                                                                                                                    