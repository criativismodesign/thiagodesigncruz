'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
