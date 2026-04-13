'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  initialData: any
}

export default function DadosEnvioClient({ initialData }: Props) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    cepOrigem: initialData.cepOrigem || '74650030',
    camiseta: {
      comprimento: initialData.camiseta?.comprimento || 27.5,
      largura: initialData.camiseta?.largura || 18,
      altura: initialData.camiseta?.altura || 9.5,
      pesos: {
        P: initialData.camiseta?.pesos?.P || 0.4,
        M: initialData.camiseta?.pesos?.M || 0.4,
        G: initialData.camiseta?.pesos?.G || 0.42,
        GG: initialData.camiseta?.pesos?.GG || 0.43,
      }
    },
    mousepad: {
      comprimento: initialData.mousepad?.comprimento || 37.5,
      largura: initialData.mousepad?.largura || 7,
      altura: initialData.mousepad?.altura || 7.5,
      peso: initialData.mousepad?.peso || 0.710,
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chave: 'dados_envio',
          valor: JSON.stringify(formData)
        })
      })

      if (response.ok) {
        toast.success('Dados de envio salvos com sucesso!')
      } else {
        toast.error('Erro ao salvar dados de envio')
      }
    } catch {
      toast.error('Erro ao salvar dados de envio')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.')
      const newData = { ...prev }
      let current: any = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      {/* Header navegação */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E5', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#292929' }}>Use KIN Admin</span>
        <a href="/login-usekin/dashboard" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Dashboard</a>
        <a href="/login-usekin/dashboard/produtos" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Produtos</a>
        <a href="/login-usekin/dashboard/colecoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Coleções</a>
        <a href="/login-usekin/dashboard/banners" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Banners</a>
        <a href="/login-usekin/dashboard/banners-categoria" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Banners Categoria</a>
        <a href="/login-usekin/dashboard/pedidos" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Pedidos</a>
        <a href="/login-usekin/dashboard/dados-envio" style={{ background: '#2563eb', color: '#fff', padding: '6px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>Dados de Envio</a>
        <a href="/login-usekin/dashboard/configuracoes" style={{ color: '#888', textDecoration: 'none', fontSize: 14 }}>Configurações</a>
      </div>

      <div style={{ padding: '32px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', marginBottom: 32 }}>
          Dados de Envio
        </h1>

        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: 24 }}>
          {/* CEP de Origem */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>CEP de Origem</h3>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 8 }}>CEP</label>
                <input
                  type="text"
                  value={formData.cepOrigem}
                  onChange={(e) => handleInputChange('cepOrigem', e.target.value)}
                  placeholder="00000-000"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14 }}
                />
              </div>
            </div>
          </div>

          {/* Dimensões Camiseta */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>Dimensões Camiseta (cm)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 8 }}>Comprimento</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.camiseta.comprimento}
                  onChange={(e) => handleInputChange('camiseta.comprimento', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 8 }}>Largura</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.camiseta.largura}
                  onChange={(e) => handleInputChange('camiseta.largura', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 8 }}>Altura</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.camiseta.altura}
                  onChange={(e) => handleInputChange('camiseta.altura', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14 }}
                />
              </div>
            </div>

            <h4 style={{ fontSize: 16, fontWeight: 600, color: '#292929', marginTop: 24, marginBottom: 16 }}>Pesos por Tamanho (kg)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16 }}>
              {Object.entries(formData.camiseta.pesos).map(([tamanho, peso]) => (
                <div key={tamanho}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 8 }}>Tamanho {tamanho}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={peso}
                    onChange={(e) => handleInputChange(`camiseta.pesos.${tamanho}`, parseFloat(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14 }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dimensões Mousepad */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#292929', marginBottom: 16 }}>Dimensões Mousepad (cm)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 8 }}>Comprimento</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.mousepad.comprimento}
                  onChange={(e) => handleInputChange('mousepad.comprimento', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 8 }}>Largura</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.mousepad.largura}
                  onChange={(e) => handleInputChange('mousepad.largura', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 8 }}>Altura</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.mousepad.altura}
                  onChange={(e) => handleInputChange('mousepad.altura', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: 8 }}>Peso (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.mousepad.peso}
                  onChange={(e) => handleInputChange('mousepad.peso', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14 }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Salvando...' : 'Salvar Dados de Envio'}
          </button>
        </form>
      </div>
    </div>
  )
}
