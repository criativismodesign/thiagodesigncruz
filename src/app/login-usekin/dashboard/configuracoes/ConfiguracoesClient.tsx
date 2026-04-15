'use client'
import { useState } from 'react'
import Link from 'next/link'

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
    <div style={{ padding: '32px' }}>
        <div style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: '0 0 24px 0' }}>Configurações</h1>
          
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '8px' }}>
                Descrição Longa - Camiseta
              </label>
              <textarea
                value={formData.descricao_longa_camiseta}
                onChange={(e) => handleChange('descricao_longa_camiseta', e.target.value)}
                rows={4}
                style={{ width: '100%', padding: '12px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14, color: '#292929', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '8px' }}>
                Prazo de Entrega Padrão
              </label>
              <input
                type="text"
                value={formData.entrega_prazo_padrao}
                onChange={(e) => handleChange('entrega_prazo_padrao', e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14, color: '#292929' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '8px' }}>
                Descrição Longa - Mousepad
              </label>
              <textarea
                value={formData.descricao_longa_mousepad}
                onChange={(e) => handleChange('descricao_longa_mousepad', e.target.value)}
                rows={4}
                style={{ width: '100%', padding: '12px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14, color: '#292929', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '8px' }}>
                Informações Adicionais - Mousepad
              </label>
              <textarea
                value={formData.informacoes_mousepad}
                onChange={(e) => handleChange('informacoes_mousepad', e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '12px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14, color: '#292929', resize: 'vertical' }}
              />
            </div>

            <button
              onClick={handleSalvar}
              disabled={loading}
              style={{ 
                padding: '12px 24px', 
                background: loading ? '#ccc' : '#DAA520', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 8, 
                fontSize: 14, 
                fontWeight: 600, 
                cursor: loading ? 'not-allowed' : 'pointer' 
              }}
            >
              {loading ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </div>
      </div>
  )
}
