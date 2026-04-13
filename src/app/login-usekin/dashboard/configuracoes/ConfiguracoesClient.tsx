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
        <span style={{ fontWeight: 700, fontSize: 18, color: '#292929' }}>Use KIN Admin</span>
        <a href="/login-usekin/dashboard" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Dashboard</a>
        <a href="/login-usekin/dashboard/produtos" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Produtos</a>
        <a href="/login-usekin/dashboard/colecoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Coleções</a>
        <a href="/login-usekin/dashboard/banners" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Banners</a>
        <a href="/login-usekin/dashboard/banners-categoria" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Banners Categoria</a>
        <a href="/login-usekin/dashboard/pedidos" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Pedidos</a>
        <a href="/login-usekin/dashboard/dados-envio" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Dados de Envio</a>
        <a href="/login-usekin/dashboard/cupons" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Cupons</a>
        <a href="/login-usekin/dashboard/configuracoes" style={{ background: '#2563eb', color: '#fff', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Configurações</a>
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={async () => { await fetch('/api/admin/logout', { method: 'POST' }); window.location.href = '/login-usekin' }}
            style={{ color: '#888', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14 }}>Sair</button>
        </div>
      </div>

      <div style={{ padding: '32px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Configurações</h1>
          <button onClick={handleSalvar} disabled={loading}
            style={{ background: '#DAA520', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>

        {/* Descrição Longa - Camiseta */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>Descrição Longa - Camiseta</h2>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
              Texto padrão para descrição de camisetas
            </label>
            <textarea
              value={formData.descricao_longa_camiseta}
              onChange={(e) => handleChange('descricao_longa_camiseta', e.target.value)}
              rows={12}
              style={{ 
                width: '100%', 
                border: '1px solid #E5E5E5', 
                borderRadius: 8, 
                padding: '10px 14px', 
                fontSize: 14, 
                color: '#292929', 
                boxSizing: 'border-box' as const,
                resize: 'vertical',
                fontFamily: 'monospace'
              }}
              placeholder="Digite a descrição padrão para camisetas..."
            />
          </div>
        </div>

        {/* Entrega e Prazo - Padrão */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>Entrega e Prazo - Padrão</h2>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
              Texto padrão para entrega e prazo (aplicado a todos os produtos)
            </label>
            <textarea
              value={formData.entrega_prazo_padrao}
              onChange={(e) => handleChange('entrega_prazo_padrao', e.target.value)}
              rows={6}
              style={{ 
                width: '100%', 
                border: '1px solid #E5E5E5', 
                borderRadius: 8, 
                padding: '10px 14px', 
                fontSize: 14, 
                color: '#292929', 
                boxSizing: 'border-box' as const,
                resize: 'vertical',
                fontFamily: 'monospace'
              }}
              placeholder="Digite o texto padrão para entrega e prazo..."
            />
          </div>
        </div>

        {/* Descrição Longa - Mousepad */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>Descrição Longa - Mousepad</h2>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
              Texto padrão para descrição de mousepads
            </label>
            <textarea
              value={formData.descricao_longa_mousepad}
              onChange={(e) => handleChange('descricao_longa_mousepad', e.target.value)}
              rows={10}
              style={{ 
                width: '100%', 
                border: '1px solid #E5E5E5', 
                borderRadius: 8, 
                padding: '10px 14px', 
                fontSize: 14, 
                color: '#292929', 
                boxSizing: 'border-box' as const,
                resize: 'vertical',
                fontFamily: 'monospace'
              }}
              placeholder="Digite a descrição padrão para mousepads..."
            />
          </div>
        </div>

        {/* Informações - Mousepad */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>Informações - Mousepad</h2>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#292929', display: 'block', marginBottom: 6 }}>
              Especificações técnicas e informações do mousepad
            </label>
            <textarea
              value={formData.informacoes_mousepad}
              onChange={(e) => handleChange('informacoes_mousepad', e.target.value)}
              rows={8}
              style={{ 
                width: '100%', 
                border: '1px solid #E5E5E5', 
                borderRadius: 8, 
                padding: '10px 14px', 
                fontSize: 14, 
                color: '#292929', 
                boxSizing: 'border-box' as const,
                resize: 'vertical',
                fontFamily: 'monospace'
              }}
              placeholder="Digite as informações técnicas do mousepad..."
            />
          </div></div>)
}


