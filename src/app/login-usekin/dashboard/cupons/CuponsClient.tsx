'use client'
import { useState } from 'react'

export default function CuponsClient({ cupons }: { cupons: any[] }) {
  const [cuponsState, setCuponsState] = useState(cupons)
  const [editando, setEditando] = useState<string | null>(null)
  const [formulario, setFormulario] = useState({
    codigo: '',
    tipo: 'fixo',
    valor: '',
    validade: '',
    limiteUsos: '',
    status: 'ativo'
  })

  const resetFormulario = () => {
    setFormulario({
      codigo: '',
      tipo: 'fixo',
      valor: '',
      validade: '',
      limiteUsos: '',
      status: 'ativo'
    })
    setEditando(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editando ? `/api/admin/cupons/${editando}` : '/api/admin/cupons'
      const method = editando ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario)
      })

      if (res.ok) {
        const data = await res.json()
        if (editando) {
          setCuponsState(prev => prev.map(c => c.id === editando ? data.cupom : c))
        } else {
          setCuponsState(prev => [data.cupom, ...prev])
        }
        resetFormulario()
      }
    } catch (error) {
      console.error('Erro ao salvar cupom:', error)
    }
  }

  const handleEdit = (cupom: any) => {
    setFormulario({
      codigo: cupom.codigo,
      tipo: cupom.tipo,
      valor: cupom.valor.toString(),
      validade: cupom.validade ? new Date(cupom.validade).toISOString().split('T')[0] : '',
      limiteUsos: cupom.limiteUsos?.toString() || '',
      status: cupom.status
    })
    setEditando(cupom.id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cupom?')) return
    
    try {
      const res = await fetch(`/api/admin/cupons/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCuponsState(prev => prev.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Erro ao excluir cupom:', error)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Header navegação padrão */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#292929' }}>Use KIN Admin</span>
        <a href="/login-usekin/dashboard" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Dashboard</a>
        <a href="/login-usekin/dashboard/produtos" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Produtos</a>
        <a href="/login-usekin/dashboard/colecoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Coleções</a>
        <a href="/login-usekin/dashboard/banners" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Banners</a>
        <a href="/login-usekin/dashboard/banners-categoria" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Banners Categoria</a>
        <a href="/login-usekin/dashboard/pedidos" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Pedidos</a>
        <a href="/login-usekin/dashboard/cupons" style={{ background: '#2563eb', color: '#fff', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Cupons</a>
        <a href="/login-usekin/dashboard/dados-envio" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Dados de Envio</a>
        <a href="/login-usekin/dashboard/configuracoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Configurações</a>
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={async () => { await fetch('/api/admin/logout', { method: 'POST' }); window.location.href = '/login-usekin' }}
            style={{ color: '#888', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14 }}>Sair</button>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', marginBottom: 24 }}>Cupons de Desconto</h1>

        {/* Formulário */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>
            {editando ? 'Editar Cupom' : 'Novo Cupom'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Código</label>
              <input
                type="text"
                value={formulario.codigo.toUpperCase().replace(/[^A-Z0-9]/g, '')}
                onChange={e => setFormulario({ ...formulario, codigo: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                placeholder="CÓDIGO10"
                required
                style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Tipo</label>
              <select
                value={formulario.tipo}
                onChange={e => setFormulario({ ...formulario, tipo: e.target.value })}
                style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}
              >
                <option value="fixo">Valor Fixo (R$)</option>
                <option value="percentual">Percentual (%)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Valor</label>
              <input
                type="number"
                step="0.01"
                value={formulario.valor}
                onChange={e => setFormulario({ ...formulario, valor: e.target.value })}
                placeholder={formulario.tipo === 'fixo' ? '10.00' : '10'}
                required
                style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Validade</label>
              <input
                type="date"
                value={formulario.validade}
                onChange={e => setFormulario({ ...formulario, validade: e.target.value })}
                style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Limite de Usos</label>
              <input
                type="number"
                value={formulario.limiteUsos}
                onChange={e => setFormulario({ ...formulario, limiteUsos: e.target.value })}
                placeholder="Opcional"
                style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Status</label>
              <select
                value={formulario.status}
                onChange={e => setFormulario({ ...formulario, status: e.target.value })}
                style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <button
                type="submit"
                style={{ background: '#DAA520', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
              >
                {editando ? 'Atualizar' : 'Criar'}
              </button>
              {editando && (
                <button
                  type="button"
                  onClick={resetFormulario}
                  style={{ background: 'transparent', border: '1px solid #888', color: '#888', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabela */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#F5F5F5' }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Código</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Tipo</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Valor</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Validade</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Limite</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Usados</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {cuponsState.map(cupom => (
                <tr key={cupom.id} style={{ borderBottom: '1px solid #E5E5E5' }}>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>{cupom.codigo}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>
                    {cupom.tipo === 'fixo' ? 'R$' : '%'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>
                    {cupom.tipo === 'fixo' ? `R$ ${cupom.valor.toFixed(2)}` : `${cupom.valor}%`}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>
                    {cupom.validade ? new Date(cupom.validade).toLocaleDateString('pt-BR') : 'Indefinida'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>
                    {cupom.limiteUsos || 'Ilimitado'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>
                    {cupom.totalUsado} / {cupom.limiteUsos || 'Ilimitado'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      background: cupom.status === 'ativo' ? '#46A52020' : '#F0484A20',
                      color: cupom.status === 'ativo' ? '#46A520' : '#F0484A'
                    }}>
                      {cupom.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleEdit(cupom)}
                        style={{ background: 'transparent', border: '1px solid #888', color: '#888', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: 12 }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(cupom.id)}
                        style={{ background: 'transparent', border: '1px solid #F0484A', color: '#F0484A', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: 12 }}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cuponsState.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: '#888' }}>
              Nenhum cupom encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
