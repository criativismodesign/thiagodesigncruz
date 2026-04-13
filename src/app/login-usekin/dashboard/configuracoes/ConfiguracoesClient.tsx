'use client'
import { useState } from 'react'

interface Props {
  configs: Record<string, string>
}

export default function ConfiguracoesClient({ configs }: Props) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    descricao_longa_camiseta: configs.descricao_longa_camiseta || '',
    entrega_prazo_padrao: configs.entrega_prazo_padrao || '',
    descricao_longa_mousepad: configs.descricao_longa_mousepad || '',
    informacoes_mousepad: configs.informacoes_mousepad || '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSalvar = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/configuracoes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        alert('Configurações salvas com sucesso!')
      } else {
        const data = await response.json()
        alert('Erro: ' + data.error)
      }
    } catch (error) {
      alert('Erro ao salvar: ' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Header navegação padrão */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
