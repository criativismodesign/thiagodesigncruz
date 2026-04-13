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
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Header navegação padrão */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#292929' }}>Use KIN Admin</span>
        <Link href="/login-usekin/dashboard" style={{ background: 'transparent', color: '#888', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Dashboard</Link>
        <Link href="/login-usekin/dashboard/produtos" style={{ background: 'transparent', color: '#888', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Produtos</Link>
        <Link href="/login-usekin/dashboard/colecoes" style={{ background: 'transparent', color: '#888', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Coleções</Link>
        <Link href="/login-usekin/dashboard/banners" style={{ background: 'transparent', color: '#888', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Banners</Link>
        <Link href="/login-usekin/dashboard/banners-categoria" style={{ background: 'transparent', color: '#888', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Banners Categoria</Link>
        <Link href="/login-usekin/dashboard/pedidos" style={{ background: '#2563eb', color: '#fff', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Pedidos</Link>
        <Link href="/login-usekin/dashboard/cupons" style={{ background: 'transparent', color: '#888', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Cupons</Link>
        <Link href="/login-usekin/dashboard/dados-envio" style={{ background: 'transparent', color: '#888', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Dados de Envio</Link>
        <Link href="/login-usekin/dashboard/configuracoes" style={{ background: 'transparent', color: '#888', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Configurações</Link>
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={async () => {
              await fetch('/api/admin/logout', { method: 'POST' })
              window.location.href = '/login-usekin'
            }}
            style={{ color: '#888', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14 }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* Conteúdo */}
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
    </div>
  )
}
