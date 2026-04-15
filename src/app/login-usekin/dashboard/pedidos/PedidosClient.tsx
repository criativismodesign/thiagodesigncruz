'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: '#F59E0B' },
  paid: { label: 'Pago', color: '#3B82F6' },
  shipped: { label: 'Enviado', color: '#8B5CF6' },
  delivered: { label: 'Entregue', color: '#46A520' },
  cancelled: { label: 'Cancelado', color: '#F0484A' },
}

export default function PedidosClient({ pedidos }: { pedidos: any[] }) {
  const router = useRouter()
  const [pedidosState, setPedidosState] = useState(pedidos)
  const [pedidoExpandido, setPedidoExpandido] = useState<string | null>(null)
  const [trackingInput, setTrackingInput] = useState<Record<string, string>>({})
  const [statusEditado, setStatusEditado] = useState<Record<string, string>>({})

  const handleAtualizarStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/pedidos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    if (res.ok) {
      setPedidosState(prev => 
        prev.map(p => p.id === id ? { ...p, status } : p)
      )
      setStatusEditado(prev => {
        const newStatus = { ...prev }
        delete newStatus[id]
        return newStatus
      })
    }
  }

  const handleSalvarTracking = async (id: string) => {
    const res = await fetch(`/api/admin/pedidos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackingCode: trackingInput[id] })
    })
    if (res.ok) {
      setPedidosState(prev =>
        prev.map(p => p.id === id ? { ...p, trackingCode: trackingInput[id] } : p)
      )
    }
  }

  return (
    <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Pedidos</h1>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#F8F9FA' }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Pedido</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Cliente</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Valor</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Rastreamento</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidosState.map((pedido) => (
                <tr key={pedido.id} style={{ borderBottom: '1px solid #E5E5E5' }}>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>
                    <div style={{ fontWeight: 500 }}>#{pedido.id.slice(-8)}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>
                    <div style={{ fontWeight: 500 }}>{pedido.nome}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{pedido.email}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: '#292929' }}>
                    R$ {Number(pedido.valorTotal).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: 4, 
                      fontSize: 12, 
                      fontWeight: 500,
                      background: statusLabels[pedido.status]?.color + '20',
                      color: statusLabels[pedido.status]?.color
                    }}>
                      {statusLabels[pedido.status]?.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>
                    <input
                      type="text"
                      value={trackingInput[pedido.id] || pedido.trackingCode || ''}
                      onChange={(e) => setTrackingInput(prev => ({ ...prev, [pedido.id]: e.target.value }))}
                      placeholder="Código de rastreamento"
                      style={{ 
                        width: '150px', 
                        padding: '4px 8px', 
                        border: '1px solid #E5E5E5', 
                        borderRadius: 4, 
                        fontSize: 12,
                        color: '#292929'
                      }}
                    />
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>
                    <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                      <button
                        onClick={() => updateTracking(pedido.id)}
                        style={{ 
                          padding: '4px 8px', 
                          background: '#2563eb', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: 4, 
                          fontSize: 12, 
                          cursor: 'pointer'
                        }}
                      >
                        Atualizar
                      </button>
                      <button
                        onClick={() => router.push(`/login-usekin/dashboard/pedidos/${pedido.id}`)}
                        style={{ 
                          padding: '4px 8px', 
                          background: '#6B7280', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: 4, 
                          fontSize: 12, 
                          cursor: 'pointer'
                        }}
                      >
                        Detalhes
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  )
}
