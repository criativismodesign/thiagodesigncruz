'use client'
import { useState } from 'react'

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: '#F59E0B' },
  paid: { label: 'Pago', color: '#3B82F6' },
  shipped: { label: 'Enviado', color: '#8B5CF6' },
  delivered: { label: 'Entregue', color: '#46A520' },
  cancelled: { label: 'Cancelado', color: '#F0484A' },
}

export default function PedidosClient({ pedidos }: { pedidos: any[] }) {
  const [pedidoExpandido, setPedidoExpandido] = useState<string | null>(null)
  const [trackingInput, setTrackingInput] = useState<Record<string, string>>({})

  const handleAtualizarStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/pedidos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    window.location.reload()
  }

  const handleSalvarTracking = async (id: string) => {
    await fetch(`/api/admin/pedidos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackingCode: trackingInput[id] })
    })
    window.location.reload()
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
        <a href="/login-usekin/dashboard/pedidos" style={{ background: '#2563eb', color: '#fff', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Pedidos</a>
        <a href="/login-usekin/dashboard/configuracoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Configurações</a>
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={async () => { await fetch('/api/admin/logout', { method: 'POST' }); window.location.href = '/login-usekin' }}
            style={{ color: '#888', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14 }}>Sair</button>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', marginBottom: 24 }}>Pedidos</h1>

        {pedidos.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 12, padding: 48, textAlign: 'center', color: '#888' }}>
            Nenhum pedido encontrado
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {pedidos.map(pedido => {
              const status = statusLabels[pedido.status] || { label: pedido.status, color: '#888' }
              const expandido = pedidoExpandido === pedido.id
              return (
                <div key={pedido.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', overflow: 'hidden' }}>
                  {/* Cabeçalho do pedido */}
                  <div
                    onClick={() => setPedidoExpandido(expandido ? null : pedido.id)}
                    style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
                  >
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, color: '#292929', fontSize: 15, margin: 0 }}>
                        #{pedido.id.slice(-8).toUpperCase()}
                      </p>
                      <p style={{ color: '#888', fontSize: 13, margin: 0 }}>
                        {pedido.user?.name || 'Cliente'} - {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span style={{ background: status.color + '20', color: status.color, padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
                      {status.label}
                    </span>
                    <p style={{ fontWeight: 700, color: '#292929', fontSize: 16, margin: 0 }}>
                      R$ {pedido.total?.toFixed(2).replace('.', ',')}
                    </p>
                    <span style={{ color: '#888', fontSize: 18 }}>{expandido ? 'u25b2' : 'u25bc'}</span>
                  </div>

                  {/* Detalhes expandidos */}
                  {expandido && (
                    <div style={{ borderTop: '1px solid #E5E5E5', padding: '20px 24px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
                        {/* Dados do cliente */}
                        <div>
                          <h4 style={{ fontSize: 14, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Cliente</h4>
                          <p style={{ fontSize: 14, color: '#888', margin: '4px 0' }}>{pedido.user?.name}</p>
                          <p style={{ fontSize: 14, color: '#888', margin: '4px 0' }}>{pedido.user?.email}</p>
                          {pedido.user?.phone && <p style={{ fontSize: 14, color: '#888', margin: '4px 0' }}>{pedido.user.phone}</p>}
                        </div>
                        {/* Endereço de entrega */}
                        <div>
                          <h4 style={{ fontSize: 14, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Endereço de Entrega</h4>
                          {pedido.shippingAddress ? (
                            <div style={{ fontSize: 14, color: '#888' }}>
                              {typeof pedido.shippingAddress === 'string'
                                ? JSON.parse(pedido.shippingAddress)?.street
                                : pedido.shippingAddress?.street
                              }, {typeof pedido.shippingAddress === 'string'
                                ? JSON.parse(pedido.shippingAddress)?.number
                                : pedido.shippingAddress?.number
                              }
                            </div>
                          ) : <p style={{ fontSize: 14, color: '#888' }}>Não informado</p>}
                        </div>
                      </div>

                      {/* Itens do pedido */}
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: '#292929', marginBottom: 8 }}>Itens</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                        {pedido.items?.map((item: any) => (
                          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#888', padding: '8px 0', borderBottom: '1px solid #F5F5F5' }}>
                            <span>{item.quantity}x {item.product?.name || item.name || 'Produto'} {item.size ? `(${item.size})` : ''} {item.color ? `- ${item.color}` : ''}</span>
                            <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                          </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#888' }}>
                          <span>Frete</span>
                          <span>R$ {pedido.shipping?.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: '#292929' }}>
                          <span>Total</span>
                          <span>R$ {pedido.total?.toFixed(2).replace('.', ',')}</span>
                        </div>
                      </div>

                      {/* Ações */}
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        {/* Atualizar status */}
                        <div>
                          <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Status</label>
                          <select
                            value={pedido.status}
                            onChange={e => handleAtualizarStatus(pedido.id, e.target.value)}
                            style={{ border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14, color: '#292929' }}
                          >
                            <option value="pending">Pendente</option>
                            <option value="paid">Pago</option>
                            <option value="shipped">Enviado</option>
                            <option value="delivered">Entregue</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                        </div>

                        {/* Código de rastreamento */}
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: 13, color: '#888', display: 'block', marginBottom: 6 }}>Código de Rastreamento</label>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <input
                              value={trackingInput[pedido.id] ?? (pedido.trackingCode || '')}
                              onChange={e => setTrackingInput({ ...trackingInput, [pedido.id]: e.target.value })}
                              placeholder="Ex: BR123456789BR"
                              style={{ flex: 1, border: '1px solid #E5E5E5', borderRadius: 8, padding: '8px 12px', fontSize: 14, color: '#292929' }}
                            />
                            <button
                              onClick={() => handleSalvarTracking(pedido.id)}
                              style={{ background: '#DAA520', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                            >
                              Salvar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
