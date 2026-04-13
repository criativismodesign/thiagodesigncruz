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
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Header navegação padrão */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
