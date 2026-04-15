'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function CuponsClient({ cupons }: { cupons: any[] }) {
  const [cuponsState, setCuponsState] = useState(cupons)
  const [editando, setEditando] = useState<string | null>(null)
  const [formulario, setFormulario] = useState({
    codigo: '',
    tipo: 'fixo',
    valor: '',
    validade: '',
    limiteusos: '',
    status: 'ativo'
  })

  const resetFormulario = () => {
    setFormulario({
      codigo: '',
      tipo: 'fixo',
      valor: '',
      validade: '',
      limiteusos: '',
      status: 'ativo'
    })
    setEditando(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!formulario.codigo.trim()) {
    alert('Código do cupom é obrigatório')
    return
  }
  if (!formulario.valor || isNaN(parseFloat(String(formulario.valor)))) {
    alert('Valor do desconto é obrigatório e deve ser um número')
    return
  }

  try {
    const url = editando ? `/api/admin/cupons/${editando}` : '/api/admin/cupons'
    const method = editando ? 'PUT' : 'POST'

    const payload = {
      codigo: formulario.codigo.toUpperCase().replace(/[^A-Z0-9]/g, ''),
      tipo: formulario.tipo || 'fixo',
      valor: parseFloat(String(formulario.valor)),
      validade: formulario.validade || null,
      limiteusos: formulario.limiteusos ? parseInt(String(formulario.limiteusos)) : null,
      status: formulario.status || 'ativo',
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (res.ok) {
      if (editando) {
        setCuponsState(prev => prev.map(c => c.id === editando ? data.cupom : c))
      } else {
        setCuponsState(prev => [data.cupom, ...prev])
      }
      resetFormulario()
    } else {
      alert(data.error || 'Erro ao salvar cupom - verifique os campos preenchidos')
    }
  } catch (error) {
    console.error('Erro:', error)
    alert('Erro de conexão ao salvar cupom')
  }
}

  const handleEdit = (cupom: any) => {
    setFormulario({
      codigo: cupom.codigo,
      tipo: cupom.tipo,
      valor: cupom.valor.toString(),
      validade: cupom.validade ? new Date(cupom.validade).toISOString().split('T')[0] : '',
      limiteusos: cupom.limiteusos?.toString() || '',
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
    <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Cupons de Desconto</h1>
          <button
            onClick={() => setEditando('novo')}
            style={{ 
              padding: '10px 24px', 
              background: '#DAA520', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              fontSize: 14, 
              fontWeight: 600, 
              cursor: 'pointer' 
            }}
          >
            Novo Cupom
          </button>
        </div>

        {editando && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: '24px', marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', margin: '0 0 20px 0' }}>
              {editando === 'novo' ? 'Novo Cupom' : 'Editar Cupom'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 6 }}>
                    Código *
                  </label>
                  <input
                    type="text"
                    value={formulario.codigo}
                    onChange={(e) => setFormulario(prev => ({ ...prev, codigo: e.target.value }))}
                    required
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 6 }}>
                    Tipo *
                  </label>
                  <select
                    value={formulario.tipo}
                    onChange={(e) => setFormulario(prev => ({ ...prev, tipo: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                  >
                    <option value="fixo">Fixo (R$)</option>
                    <option value="percentual">Percentual (%)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 6 }}>
                    Valor *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formulario.valor}
                    onChange={(e) => setFormulario(prev => ({ ...prev, valor: e.target.value }))}
                    required
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 6 }}>
                    Validade
                  </label>
                  <input
                    type="date"
                    value={formulario.validade}
                    onChange={(e) => setFormulario(prev => ({ ...prev, validade: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 6 }}>
                    Limite de Usos
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formulario.limiteusos}
                    onChange={(e) => setFormulario(prev => ({ ...prev, limiteusos: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 6 }}>
                    Status *
                  </label>
                  <select
                    value={formulario.status}
                    onChange={(e) => setFormulario(prev => ({ ...prev, status: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="submit"
                  style={{ 
                    padding: '10px 24px', 
                    background: '#DAA520', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 8, 
                    fontSize: 14, 
                    fontWeight: 600, 
                    cursor: 'pointer' 
                  }}
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={resetFormulario}
                  style={{ 
                    padding: '10px 24px', 
                    background: '#fff', 
                    color: '#888', 
                    border: '1px solid #E5E5E5', 
                    borderRadius: 8, 
                    fontSize: 14, 
                    fontWeight: 600, 
                    cursor: 'pointer' 
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#292929' }}>Código</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#292929' }}>Tipo</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#292929' }}>Valor</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#292929' }}>Validade</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#292929' }}>Usos</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#292929' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#292929' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {cuponsState.map((cupom) => (
                <tr key={cupom.id} style={{ borderBottom: '1px solid #E5E5E5' }}>
                  <td style={{ padding: '12px', fontSize: 14, color: '#292929' }}>{cupom.codigo}</td>
                  <td style={{ padding: '12px', fontSize: 14, color: '#292929' }}>
                    {cupom.tipo === 'fixo' ? `R$ ${cupom.valor}` : `${cupom.valor}%`}
                  </td>
                  <td style={{ padding: '12px', fontSize: 14, color: '#292929' }}>{cupom.valor}</td>
                  <td style={{ padding: '12px', fontSize: 14, color: '#292929' }}>
                    {cupom.validade ? new Date(cupom.validade).toLocaleDateString('pt-BR') : 'Sem validade'}
                  </td>
                  <td style={{ padding: '12px', fontSize: 14, color: '#292929' }}>
                    {cupom.usos || 0} / {cupom.limiteusos || 'Ilimitado'}
                  </td>
                  <td style={{ padding: '12px', fontSize: 14, color: '#292929' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: 4, 
                      fontSize: 12, 
                      fontWeight: 500,
                      background: cupom.status === 'ativo' ? '#46A520' : '#F0484A',
                      color: '#fff'
                    }}>
                      {cupom.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: 14, color: '#292929' }}>
                    <button
                      onClick={() => {
                        setEditando(cupom.id)
                        setFormulario({
                          codigo: cupom.codigo,
                          tipo: cupom.tipo,
                          valor: cupom.valor.toString(),
                          validade: cupom.validade ? new Date(cupom.validade).toISOString().split('T')[0] : '',
                          limiteusos: cupom.limiteusos?.toString() || '',
                          status: cupom.status
                        })
                      }}
                      style={{ 
                        padding: '4px 8px', 
                        background: '#2563eb', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: 4, 
                        fontSize: 12, 
                        cursor: 'pointer',
                        marginRight: 8
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Tem certeza que deseja excluir este cupom?')) {
                          await fetch(`/api/admin/cupons/${cupom.id}`, { method: 'DELETE' })
                          setCuponsState(prev => prev.filter(c => c.id !== cupom.id))
                        }
                      }}
                      style={{ 
                        padding: '4px 8px', 
                        background: '#F0484A', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: 4, 
                        fontSize: 12, 
                        cursor: 'pointer'
                      }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  )
}
