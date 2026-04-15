'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Pedido {
  id: string
  numero: string
  status: string
  valorTotal: number
  formaPagamento: string
  statusPagamento: string
  createdAt: string
  cliente: {
    nome: string
    email: string
    telefone?: string
  }
  itens: Array<{
    produto: {
      nome: string
    }
    quantidade: number
    precoUnitario: number
  }>
  endereco?: {
    cep: string
    rua: string
    numero: string
    bairro: string
    cidade: string
    estado: string
  }
  trackingCode?: string
}

export default function PedidosClient() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')

  useEffect(() => {
    carregarPedidos()
  }, [])

  const carregarPedidos = async () => {
    try {
      const response = await fetch('/api/admin/pedidos')
      if (response.ok) {
        const data = await response.json()
        setPedidos(data)
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const atualizarStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (response.ok) {
        carregarPedidos()
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const atualizarTracking = async (id: string, trackingCode: string) => {
    try {
      const response = await fetch(`/api/admin/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingCode })
      })
      if (response.ok) {
        carregarPedidos()
      }
    } catch (error) {
      console.error('Erro ao atualizar tracking:', error)
    }
  }

  const pedidosFiltrados = pedidos.filter(pedido => {
    const matchNumero = pedido.numero.toLowerCase().includes(filtro.toLowerCase())
    const matchNome = pedido.cliente.nome.toLowerCase().includes(filtro.toLowerCase())
    const matchStatus = !filtroStatus || pedido.status === filtroStatus
    
    return (matchNumero || matchNome) && matchStatus
  })

  if (loading) {
    return (
      <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: 16, color: '#888' }}>Carregando pedidos...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Pedidos</h1>
      </div>

      {/* Filtros */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>Filtros</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
              Buscar por número ou cliente
            </label>
            <input
              type="text"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              placeholder="Digite o número do pedido ou nome do cliente..."
              style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14, color: '#292929' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
              Status
            </label>
            <select
              value={filtroStatus}
              onChange={e => setFiltroStatus(e.target.value)}
              style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14, color: '#292929' }}
            >
              <option value="">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="confirmado">Confirmado</option>
              <option value="em_preparacao">Em Preparação</option>
              <option value="enviado">Enviado</option>
              <option value="entregue">Entregue</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9F9F9' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Pedido</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Cliente</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Valor</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Pagamento</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Data</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#292929', borderBottom: '1px solid #E5E5E5' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id} style={{ borderBottom: '1px solid #E5E5E5' }}>
                  <td style={{ padding: '12px' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#292929' }}>{pedido.numero}</div>
                      {pedido.trackingCode && (
                        <div style={{ fontSize: 12, color: '#888' }}>Rastreio: {pedido.trackingCode}</div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div>
                      <div style={{ fontSize: 14, color: '#292929' }}>{pedido.cliente.nome}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{pedido.cliente.email}</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: 14, color: '#292929' }}>
                    R$ {pedido.valorTotal.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <select
                      value={pedido.status}
                      onChange={(e) => atualizarStatus(pedido.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        border: '1px solid #E5E5E5',
                        fontSize: 12,
                        background: getStatusColor(pedido.status),
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="em_preparacao">Em Preparação</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregue">Entregue</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontSize: 12, color: '#888' }}>
                      <div>{pedido.formaPagamento}</div>
                      <div style={{ color: getPaymentStatusColor(pedido.statusPagamento) }}>
                        {pedido.statusPagamento}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: 14, color: '#292929' }}>
                    {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                      <button
                        onClick={() => {
                          const trackingCode = prompt('Digite o código de rastreio:', pedido.trackingCode || '')
                          if (trackingCode !== null) {
                            atualizarTracking(pedido.id, trackingCode)
                          }
                        }}
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
                        Rastreio
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {pedidosFiltrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
            <div style={{ fontSize: 16, marginBottom: 8 }}>Nenhum pedido encontrado</div>
            <div style={{ fontSize: 14 }}>
              {filtro || filtroStatus
                ? 'Tente ajustar os filtros'
                : 'Nenhum pedido realizado ainda'
              }
            </div>
          </div>
        )}
      </div>

      {/* Resumo */}
      <div style={{ marginTop: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 16, flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Total de Pedidos</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#292929' }}>{pedidos.length}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 16, flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Pedidos Pendentes</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#F59E0B' }}>
            {pedidos.filter(p => p.status === 'pendente').length}
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 16, flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Pedidos Entregues</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#46A520' }}>
            {pedidos.filter(p => p.status === 'entregue').length}
          </div>
        </div>
      </div>
    </div>
  )
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'pendente': return '#F59E0B'
    case 'confirmado': return '#3B82F6'
    case 'em_preparacao': return '#8B5CF6'
    case 'enviado': return '#06B6D4'
    case 'entregue': return '#46A520'
    case 'cancelado': return '#EF4444'
    default: return '#6B7280'
  }
}

function getPaymentStatusColor(status: string): string {
  switch (status) {
    case 'pago': return '#46A520'
    case 'pendente': return '#F59E0B'
    case 'cancelado': return '#EF4444'
    default: return '#6B7280'
  }
}
