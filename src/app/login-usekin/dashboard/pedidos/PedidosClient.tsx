'use client'
import { useState, useEffect } from 'react'

interface OrderItem {
  id: string
  quantity: number
  price: number
  size?: string
  color?: string
  productId: string
  product?: { nome: string; sku?: string }
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
  paymentDate?: string
  paymentHour?: string
  payerName?: string
  payerEmail?: string
  payerPhone?: string
  payerCpf?: string
  trackingCode?: string
  shippingAddress: string
  createdAt: string
  user?: { name: string; email: string; phone?: string; cpf?: string }
  items: OrderItem[]
}

const STATUS_CONFIG: Record<string, { label: string; cor: string; corTexto: string }> = {
  aguardando_pagamento: { label: 'Aguardando Pagamento', cor: '#FEF3C7', corTexto: '#D97706' },
  pago:                 { label: 'Pago', cor: '#DBEAFE', corTexto: '#2563EB' },
  paid:                 { label: 'Pago', cor: '#DBEAFE', corTexto: '#2563EB' },
  approved:             { label: 'Pago', cor: '#DBEAFE', corTexto: '#2563EB' },
  pending:              { label: 'Aguardando Pagamento', cor: '#FEF3C7', corTexto: '#D97706' },
  pagamento_confirmado: { label: 'Pagamento Confirmado', cor: '#EDE9FE', corTexto: '#7C3AED' },
  em_producao:          { label: 'Em Produção', cor: '#FCE7F3', corTexto: '#DB2777' },
  em_logistica:         { label: 'Em Logística', cor: '#CFFAFE', corTexto: '#0891B2' },
  enviado:              { label: 'Enviado', cor: '#FEF9C3', corTexto: '#CA8A04' },
  entregue:             { label: 'Entregue', cor: '#DCFCE7', corTexto: '#16A34A' },
  cancelado:            { label: 'Cancelado', cor: '#FEE2E2', corTexto: '#DC2626' },
}

const ABAS = [
  {
    id: 'carrinho',
    label: 'Carrinho',
    subAbas: [
      { id: 'aguardando_pagamento', label: 'Aguardando Pagamento', statuses: ['aguardando_pagamento', 'pending'] }
    ]
  },
  {
    id: 'pagamento',
    label: 'Pagamento',
    subAbas: [
      { id: 'pago', label: 'Pago', statuses: ['pago', 'paid', 'approved'] },
      { id: 'pagamento_confirmado', label: 'Pagamento Confirmado', statuses: ['pagamento_confirmado'] }
    ]
  },
  {
    id: 'producao',
    label: 'Produção',
    subAbas: [
      { id: 'em_producao', label: 'Em Produção', statuses: ['em_producao'] }
    ]
  },
  {
    id: 'logistica',
    label: 'Logística',
    subAbas: [
      { id: 'em_logistica', label: 'Em Logística', statuses: ['em_logistica'] },
      { id: 'enviado', label: 'Enviado', statuses: ['enviado'] }
    ]
  },
  {
    id: 'conclusao',
    label: 'Conclusão',
    subAbas: [
      { id: 'entregue', label: 'Entregues', statuses: ['entregue'] },
      { id: 'cancelado', label: 'Cancelados', statuses: ['cancelado'] }
    ]
  }
]

const PROXIMOS_STATUS: Record<string, string> = {
  pago: 'pagamento_confirmado',
  paid: 'pagamento_confirmado',
  approved: 'pagamento_confirmado',
  pagamento_confirmado: 'em_producao',
  em_producao: 'em_logistica',
  em_logistica: 'enviado',
  enviado: 'entregue',
}

const PODE_CANCELAR = ['aguardando_pagamento', 'pending', 'pago', 'paid', 'approved', 'entregue']

const LABEL_PROXIMO: Record<string, string> = {
  pagamento_confirmado: 'Confirmar Pagamento',
  em_producao: 'Iniciar Produção',
  em_logistica: 'Enviar para Logística',
  enviado: 'Marcar como Enviado',
  entregue: 'Marcar como Entregue',
}

function formatarEndereco(json: string) {
  try {
    const e = JSON.parse(json)
    return `${e.street}, ${e.number}${e.complement ? `, ${e.complement}` : ''}  ${e.neighborhood}, ${e.city}/${e.state}  CEP ${e.zipCode}` 
  } catch {
    return json
  }
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { label: status, cor: '#F5F5F5', corTexto: '#888' }
  return (
    <span style={{
      display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
      background: cfg.cor, color: cfg.corTexto,
    }}>
      {cfg.label}
    </span>
  )
}

export default function PedidosClient() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState('carrinho')
  const [subAbaAtiva, setSubAbaAtiva] = useState('aguardando_pagamento')
  const [expandido, setExpandido] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [trackingInput, setTrackingInput] = useState<Record<string, string>>({})

  useEffect(() => { carregarPedidos() }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      carregarPedidos()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const carregarPedidos = async () => {
    try {
      const r = await fetch('/api/admin/pedidos')
      if (r.ok) setPedidos(await r.json())
    } finally {
      setLoading(false)
    }
  }

  const atualizarStatus = async (id: string, novoStatus: string) => {
    const body: any = { status: novoStatus }
    if (novoStatus === 'enviado' && trackingInput[id]) body.trackingCode = trackingInput[id]
    const r = await fetch(`/api/admin/pedidos/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    })
    if (r.ok) carregarPedidos()
  }

  const abaConfig = ABAS.find(a => a.id === abaAtiva)!
  const subAbaConfig = abaConfig.subAbas.find(s => s.id === subAbaAtiva) || abaConfig.subAbas[0]

  const pedidosFiltrados = pedidos.filter(p => {
    if (!subAbaConfig.statuses.includes(p.status)) return false
    if (busca) {
      const b = busca.toLowerCase()
      const nome = p.user?.name?.toLowerCase() || ''
      const email = p.user?.email?.toLowerCase() || ''
      if (!nome.includes(b) && !email.includes(b) && !p.id.toLowerCase().includes(b)) return false
    }
    return true
  })

  const contarStatus = (statuses: string[]) => pedidos.filter(p => statuses.includes(p.status)).length

  if (loading) return <div style={{ padding: 32, color: '#888' }}>Carregando pedidos...</div>

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Pedidos</h1>
        <div style={{ fontSize: 14, color: '#888' }}>Total: {pedidos.length} pedidos</div>
      </div>

      {/* Abas principais */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 0, borderBottom: '2px solid #E5E5E5' }}>
        {ABAS.map(aba => {
          const total = aba.subAbas.reduce((acc, s) => acc + contarStatus(s.statuses), 0)
          const ativo = abaAtiva === aba.id
          return (
            <button key={aba.id} onClick={() => {
              setAbaAtiva(aba.id)
              setSubAbaAtiva(aba.subAbas[0].id)
            }} style={{
              padding: '10px 20px', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: ativo ? 700 : 400,
              background: ativo ? '#292929' : '#F5F5F5',
              color: ativo ? '#DAA520' : '#888',
              borderRadius: '8px 8px 0 0',
              borderBottom: ativo ? '2px solid #292929' : 'none',
            }}>
              {aba.label} {total > 0 && <span style={{ fontSize: 12, marginLeft: 4, background: ativo ? '#DAA520' : '#DDD', color: ativo ? '#000' : '#666', borderRadius: 999, padding: '1px 6px' }}>{total}</span>}
            </button>
          )
        })}
      </div>

      {/* Sub-abas */}
      {abaConfig.subAbas.length > 1 && (
        <div style={{ display: 'flex', gap: 4, padding: '12px 0', borderBottom: '1px solid #E5E5E5', marginBottom: 20, background: '#FAFAFA' }}>
          {abaConfig.subAbas.map(sub => {
            const total = contarStatus(sub.statuses)
            const ativo = subAbaAtiva === sub.id
            return (
              <button key={sub.id} onClick={() => setSubAbaAtiva(sub.id)} style={{
                padding: '6px 16px', border: `1px solid ${ativo ? '#292929' : '#E5E5E5'}`, cursor: 'pointer', fontSize: 13,
                fontWeight: ativo ? 600 : 400, borderRadius: 999,
                background: ativo ? '#292929' : '#fff',
                color: ativo ? '#DAA520' : '#888',
              }}>
                {sub.label} ({total})
              </button>
            )
          })}
        </div>
      )}

      {abaConfig.subAbas.length === 1 && <div style={{ marginBottom: 20 }} />}

      {/* Busca */}
      <div style={{ marginBottom: 20 }}>
        <input type="text" placeholder="Buscar por nome, email ou ID..." value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ width: '100%', border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929', boxSizing: 'border-box' as const }} />
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {pedidosFiltrados.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 48, textAlign: 'center', color: '#888' }}>
            Nenhum pedido nesta etapa
          </div>
        ) : pedidosFiltrados.map(pedido => {
          const cfg = STATUS_CONFIG[pedido.status] || { cor: '#F5F5F5', corTexto: '#888', label: pedido.status }
          const proximoStatus = PROXIMOS_STATUS[pedido.status]
          const isExpandido = expandido === pedido.id
          return (
            <div key={pedido.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', overflow: 'hidden' }}>
              <div onClick={() => setExpandido(isExpandido ? null : pedido.id)}
                style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
                {/* Indicador de cor */}
                <div style={{ width: 8, height: 40, borderRadius: 4, background: cfg.corTexto, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#AAA', marginBottom: 2 }}>#{pedido.id.slice(-8).toUpperCase()}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#292929' }}>{pedido.user?.name || 'Cliente'}</div>
                  {pedido.user?.email && <div style={{ fontSize: 12, color: '#888' }}>{pedido.user.email}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#292929' }}>R$ {pedido.total.toFixed(2)}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</div>
                </div>
                <StatusBadge status={pedido.status} />
                <div style={{ fontSize: 14, color: '#888', marginLeft: 8 }}>{isExpandido ? '' : ''}</div>
              </div>

              {isExpandido && (
                <div style={{ borderTop: '1px solid #F0F0F0', padding: '20px' }}>
                  {/* DADOS DO PRODUTO */}
                  <div style={{ marginBottom: 16 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>DADOS DO PRODUTO</h3>
                    {pedido.items.map(item => (
                      <div key={item.id} style={{ padding: '10px 14px', background: '#F9F9F9', borderRadius: 8, marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: '#292929' }}>{item.product?.nome || 'Produto'}</div>
                            {item.product?.sku && <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>SKU: {item.product.sku}</div>}
                            <div style={{ fontSize: 13, color: '#555', marginTop: 4, display: 'flex', gap: 12 }}>
                              {item.size && <span>Tamanho: <strong>{item.size}</strong></span>}
                              {item.color && <span>Cor: <strong>{item.color}</strong></span>}
                              <span>Qtd: <strong>{item.quantity}</strong></span>
                            </div>
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#292929' }}>R$ {(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                    <div style={{ fontSize: 13, color: '#888', padding: '8px 0', borderTop: '1px solid #F0F0F0', marginTop: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}><span>Subtotal</span><span>R$ {pedido.subtotal.toFixed(2)}</span></div>
                      {pedido.shipping > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}><span>Frete</span><span>R$ {pedido.shipping.toFixed(2)}</span></div>}
                      {pedido.discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', marginBottom: 2 }}><span>Desconto</span><span>- R$ {pedido.discount.toFixed(2)}</span></div>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15, color: '#292929', paddingTop: 6, borderTop: '1px solid #E5E5E5', marginTop: 4 }}><span>Total</span><span>R$ {pedido.total.toFixed(2)}</span></div>
                    </div>
                  </div>

                  {/* DADOS DO CLIENTE */}
                  <div style={{ marginBottom: 16, padding: 14, background: '#F0FDF4', borderRadius: 8, borderLeft: '3px solid #16A34A' }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>DADOS DO CLIENTE</h3>
                    <div style={{ fontSize: 14, color: '#292929', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div>
                        <span style={{ color: '#888', fontSize: 12 }}>Nome</span>
                        <div style={{ fontWeight: 600 }}>{pedido.payerName || pedido.user?.name || 'Não informado'}</div>
                      </div>
                      <div>
                        <span style={{ color: '#888', fontSize: 12 }}>Email</span>
                        <div style={{ fontWeight: 600 }}>{pedido.payerEmail || pedido.user?.email || 'Não informado'}</div>
                      </div>
                      <div>
                        <span style={{ color: '#888', fontSize: 12 }}>WhatsApp</span>
                        <div style={{ fontWeight: 600 }}>{pedido.payerPhone || pedido.user?.phone || 'Não informado'}</div>
                      </div>
                      <div>
                        <span style={{ color: '#888', fontSize: 12 }}>CPF</span>
                        <div style={{ fontWeight: 600 }}>{pedido.payerCpf || pedido.user?.cpf || 'Não informado'}</div>
                      </div>
                    </div>
                  </div>

                  {/* DADOS DE ENTREGA */}
                  <div style={{ marginBottom: 16, padding: 14, background: '#FFF7ED', borderRadius: 8, borderLeft: '3px solid #EA580C' }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>DADOS DE ENTREGA</h3>
                    <div style={{ fontSize: 14, color: '#292929', fontWeight: 500 }}>{formatarEndereco(pedido.shippingAddress)}</div>
                    {pedido.trackingCode && (
                      <div style={{ marginTop: 8, fontSize: 13, color: '#EA580C' }}>
                        <strong>Código de Rastreio:</strong> {pedido.trackingCode}
                      </div>
                    )}
                  </div>

                  {/* DADOS DA TRANSAÇÃO */}
                  {(pedido.paymentId || pedido.paymentDate) && (
                    <div style={{ marginBottom: 16, padding: 14, background: '#EEF2FF', borderRadius: 8, borderLeft: '3px solid #4F46E5' }}>
                      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>DADOS DA TRANSAÇÃO</h3>
                      <div style={{ fontSize: 14, color: '#292929', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        {pedido.paymentId && <div><span style={{ color: '#888', fontSize: 12 }}>Código MP</span><div style={{ fontWeight: 600 }}>{pedido.paymentId}</div></div>}
                        {pedido.paymentMethod && <div><span style={{ color: '#888', fontSize: 12 }}>Forma de Pagamento</span><div style={{ fontWeight: 600 }}>{pedido.paymentMethod}</div></div>}
                        {pedido.paymentDate && <div><span style={{ color: '#888', fontSize: 12 }}>Data</span><div style={{ fontWeight: 600 }}>{new Date(pedido.paymentDate).toLocaleDateString('pt-BR')}</div></div>}
                        {pedido.paymentHour && <div><span style={{ color: '#888', fontSize: 12 }}>Horário</span><div style={{ fontWeight: 600 }}>{pedido.paymentHour}</div></div>}
                      </div>
                    </div>
                  )}

                  {/* AÇÕES */}
                  {proximoStatus && (
                    <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                      {pedido.status === 'em_logistica' && (
                        <div>
                          <label style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Código de rastreio</label>
                          <input type="text" placeholder="Digite o código..."
                            value={trackingInput[pedido.id] || ''}
                            onChange={e => setTrackingInput(p => ({ ...p, [pedido.id]: e.target.value }))}
                            style={{ border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14, width: 220 }} />
                        </div>
                      )}
                      <button onClick={() => atualizarStatus(pedido.id, proximoStatus)}
                        style={{ padding: '10px 24px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, background: '#DAA520', color: '#fff' }}>
                        {LABEL_PROXIMO[proximoStatus]}
                      </button>
                    </div>
                  )}
                  {PODE_CANCELAR.includes(pedido.status) && (
                    <div style={{ marginTop: 8 }}>
                      <button onClick={() => atualizarStatus(pedido.id, 'cancelado')}
                        style={{ padding: '8px 20px', borderRadius: 999, border: '1px solid #FFCCCC', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: '#FFF0F0', color: '#CC0000' }}>
                        Cancelar Pedido
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Resumo */}
      <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Total', valor: pedidos.length, cor: '#292929' },
          { label: 'Aguardando', valor: contarStatus(['aguardando_pagamento', 'pending']), cor: '#D97706' },
          { label: 'Em Andamento', valor: contarStatus(['pago', 'paid', 'approved', 'pagamento_confirmado', 'em_producao', 'em_logistica', 'enviado']), cor: '#2563EB' },
          { label: 'Entregues', valor: contarStatus(['entregue']), cor: '#16A34A' },
          { label: 'Cancelados', valor: contarStatus(['cancelado']), cor: '#DC2626' },
        ].map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 16, flex: 1, minWidth: 120 }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{card.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: card.cor }}>{card.valor}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
