'use client'
import { useState, useEffect } from 'react'

interface OrderItem {
  id: string
  quantity: number
  price: number
  size?: string
  color?: string
  produto: { nome: string }
}

interface Pedido {
  id: string
  status: string
  total: number
  subtotal: number
  shipping: number
  discount: number
  paymentMethod?: string
  paymentId?: string
  trackingCode?: string
  shippingAddress: string
  createdAt: string
  user?: { name: string; email: string }
  items: OrderItem[]
}

const STATUS_LABELS: Record<string, string> = {
  aguardando_pagamento: 'Aguardando Pagamento',
  pago: 'Pago',
  pagamento_confirmado: 'Pagamento Confirmado',
  em_producao: 'Em Produção',
  em_logistica: 'Em Logística',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
  pending: 'Aguardando Pagamento',
  approved: 'Pago',
}

const STATUS_CORES: Record<string, string> = {
  aguardando_pagamento: '#F59E0B',
  pending: '#F59E0B',
  pago: '#3B82F6',
  approved: '#3B82F6',
  pagamento_confirmado: '#8B5CF6',
  em_producao: '#EC4899',
  em_logistica: '#06B6D4',
  enviado: '#DAA520',
  entregue: '#46A520',
  cancelado: '#EF4444',
}

const STATUS_ATIVOS = ['aguardando_pagamento', 'pending', 'pago', 'approved', 'pagamento_confirmado', 'em_producao', 'em_logistica', 'enviado']
const STATUS_HISTORICO = ['entregue', 'cancelado']

const PROXIMOS_STATUS: Record<string, string[]> = {
  aguardando_pagamento: ['pago', 'cancelado'],
  pending: ['pagamento_confirmado', 'cancelado'],
  pago: ['pagamento_confirmado', 'cancelado'],
  approved: ['pagamento_confirmado', 'cancelado'],
  pagamento_confirmado: ['em_producao'],
  em_producao: ['em_logistica'],
  em_logistica: ['enviado'],
  enviado: ['entregue'],
  entregue: [],
  cancelado: [],
}

export default function PedidosClient() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [aba, setAba] = useState<'ativos' | 'historico'>('ativos')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroBusca, setFiltroBusca] = useState('')
  const [pedidoExpandido, setPedidoExpandido] = useState<string | null>(null)
  const [trackingInput, setTrackingInput] = useState<Record<string, string>>({})

  useEffect(() => { carregarPedidos() }, [])

  const carregarPedidos = async () => {
    try {
      const response = await fetch('/api/admin/pedidos')
      if (response.ok) setPedidos(await response.json())
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const atualizarStatus = async (id: string, status: string) => {
    const body: any = { status }
    if (status === 'enviado' && trackingInput[id]) {
      body.trackingCode = trackingInput[id]
    }
    const response = await fetch(`/api/admin/pedidos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (response.ok) carregarPedidos()
  }

  const pedidosFiltrados = pedidos.filter(p => {
    const isHistorico = STATUS_HISTORICO.includes(p.status)
    if (aba === 'ativos' && isHistorico) return false
    if (aba === 'historico' && !isHistorico) return false
    if (filtroStatus && p.status !== filtroStatus) return false
    if (filtroBusca) {
      const busca = filtroBusca.toLowerCase()
      const nome = p.user?.name?.toLowerCase() || ''
      const email = p.user?.email?.toLowerCase() || ''
      const id = p.id.toLowerCase()
      if (!nome.includes(busca) && !email.includes(busca) && !id.includes(busca)) return false
    }
    return true
  })

  if (loading) return (
    <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>Carregando pedidos...</div>
  )

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: '0 0 24px 0' }}>Pedidos</h1>

      {/* Abas */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['ativos', 'historico'] as const).map(a => (
          <button key={a} onClick={() => setAba(a)} style={{
            padding: '8px 20px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
            background: aba === a ? '#292929' : '#F5F5F5',
            color: aba === a ? '#fff' : '#888',
          }}>
            {a === 'ativos' ? `Ativos (${pedidos.filter(p => STATUS_ATIVOS.includes(p.status)).length})` : `Histórico (${pedidos.filter(p => STATUS_HISTORICO.includes(p.status)).length})`}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 20, marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por nome, email ou ID..."
          value={filtroBusca}
          onChange={e => setFiltroBusca(e.target.value)}
          style={{ flex: 1, minWidth: 200, border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}
        />
        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}
          style={{ border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14, color: '#292929', background: '#fff' }}>
          <option value="">Todos os status</option>
          <option value="pending">Aguardando Pagamento</option>
          <option value="pago">Pago</option>
          <option value="approved">Pago (MP)</option>
          <option value="pagamento_confirmado">Pagamento Confirmado</option>
          <option value="em_producao">Em Produção</option>
          <option value="em_logistica">Em Logística</option>
          <option value="enviado">Enviado</option>
          <option value="entregue">Entregue</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {pedidosFiltrados.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 48, textAlign: 'center', color: '#888' }}>
            Nenhum pedido encontrado
          </div>
        ) : pedidosFiltrados.map(pedido => (
          <div key={pedido.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', overflow: 'hidden' }}>
            {/* Header do pedido */}
            <div
              onClick={() => setPedidoExpandido(pedidoExpandido === pedido.id ? null : pedido.id)}
              style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: '#888' }}>#{pedido.id.slice(-8).toUpperCase()}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#292929' }}>{pedido.user?.name || 'Cliente'}</div>
                <div style={{ fontSize: 13, color: '#888' }}>{pedido.user?.email}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#292929' }}>R$ {pedido.total.toFixed(2)}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</div>
              </div>
              <div>
                <span style={{
                  display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                  background: STATUS_CORES[pedido.status] || '#6B7280', color: '#fff'
                }}>
                  {STATUS_LABELS[pedido.status] || pedido.status}
                </span>
              </div>
              <div style={{ fontSize: 18, color: '#888' }}>{pedidoExpandido === pedido.id ? '^^' : 'v'}</div>
            </div>

            {/* Detalhes expandidos */}
            {pedidoExpandido === pedido.id && (
              <div style={{ borderTop: '1px solid #E5E5E5', padding: '20px' }}>
                {/* Itens */}
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#292929', marginBottom: 12 }}>Itens do Pedido</h3>
                {pedido.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F5F5F5', fontSize: 14 }}>
                    <div>
                      <span style={{ fontWeight: 500 }}>{item.produto.nome}</span>
                      {item.size && <span style={{ color: '#888', marginLeft: 8 }}>Tam: {item.size}</span>}
                      {item.color && <span style={{ color: '#888', marginLeft: 8 }}>Cor: {item.color}</span>}
                      <span style={{ color: '#888', marginLeft: 8 }}>Qtd: {item.quantity}</span>
                    </div>
                    <div style={{ fontWeight: 600 }}>R$ {(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}

                {/* Totais */}
                <div style={{ marginTop: 12, fontSize: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', marginBottom: 4 }}>
                    <span>Subtotal</span><span>R$ {pedido.subtotal.toFixed(2)}</span>
                  </div>
                  {pedido.shipping > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', marginBottom: 4 }}>
                      <span>Frete</span><span>R$ {pedido.shipping.toFixed(2)}</span>
                    </div>
                  )}
                  {pedido.discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#46A520', marginBottom: 4 }}>
                      <span>Desconto</span><span>- R$ {pedido.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginTop: 8, paddingTop: 8, borderTop: '1px solid #E5E5E5' }}>
                    <span>Total</span><span>R$ {pedido.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Endereço */}
                <div style={{ marginTop: 16, padding: 12, background: '#F9F9F9', borderRadius: 8, fontSize: 13, color: '#555' }}>
                  <strong>Endereço de entrega:</strong> {pedido.shippingAddress}
                </div>

                {/* Tracking */}
                {pedido.trackingCode && (
                  <div style={{ marginTop: 12, padding: 12, background: '#E6F4EA', borderRadius: 8, fontSize: 13, color: '#2E7D32' }}>
                    <strong>Código de rastreio:</strong> {pedido.trackingCode}
                  </div>
                )}

                {/* Ações de status */}
                {PROXIMOS_STATUS[pedido.status]?.length > 0 && (
                  <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    {pedido.status === 'em_logistica' && (
                      <div>
                        <label style={{ fontSize: 13, display: 'block', marginBottom: 4, color: '#292929' }}>Código de rastreio</label>
                        <input
                          type="text"
                          placeholder="Digite o código..."
                          value={trackingInput[pedido.id] || ''}
                          onChange={e => setTrackingInput(prev => ({ ...prev, [pedido.id]: e.target.value }))}
                          style={{ border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14, width: 220 }}
                        />
                      </div>
                    )}
                    {PROXIMOS_STATUS[pedido.status].map(proximoStatus => (
                      <button key={proximoStatus} onClick={() => atualizarStatus(pedido.id, proximoStatus)}
                        style={{
                          padding: '8px 20px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                          background: proximoStatus === 'cancelado' ? '#FFF0F0' : '#DAA520',
                          color: proximoStatus === 'cancelado' ? '#CC0000' : '#fff',
                        }}>
                        {STATUS_LABELS[proximoStatus] || proximoStatus}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resumo */}
      <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Total de Pedidos', valor: pedidos.length, cor: '#292929' },
          { label: 'Ativos', valor: pedidos.filter(p => STATUS_ATIVOS.includes(p.status)).length, cor: '#DAA520' },
          { label: 'Entregues', valor: pedidos.filter(p => p.status === 'entregue').length, cor: '#46A520' },
          { label: 'Cancelados', valor: pedidos.filter(p => p.status === 'cancelado').length, cor: '#EF4444' },
        ].map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 16, flex: 1, minWidth: 150 }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{card.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: card.cor }}>{card.valor}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
