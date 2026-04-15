'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

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
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#292929', margin: 0 }}>Dados de Envio</h1>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E5E5', padding: '24px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#292929', margin: '0 0 20px 0' }}>Configurações de Envio</h2>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '6px' }}>
              CEP de Origem
            </label>
            <input
              type="text"
              value={formData.cepOrigem}
              onChange={(e) => handleInputChange('cepOrigem', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
            />
          </div>

          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#292929', margin: '0 0 16px 0' }}>Camiseta</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '6px' }}>
                  Comprimento (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.camiseta.comprimento}
                  onChange={(e) => handleInputChange('camiseta.comprimento', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '6px' }}>
                  Largura (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.camiseta.largura}
                  onChange={(e) => handleInputChange('camiseta.largura', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '6px' }}>
                  Altura (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.camiseta.altura}
                  onChange={(e) => handleInputChange('camiseta.altura', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                />
              </div>
            </div>
            
            <h4 style={{ fontSize: 14, fontWeight: 600, color: '#292929', margin: '16px 0 12px 0' }}>Pesos (kg)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '6px' }}>
                  P
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.camiseta.pesos.P}
                  onChange={(e) => handleInputChange('camiseta.pesos.P', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '6px' }}>
                  M
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.camiseta.pesos.M}
                  onChange={(e) => handleInputChange('camiseta.pesos.M', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '6px' }}>
                  G
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.camiseta.pesos.G}
                  onChange={(e) => handleInputChange('camiseta.pesos.G', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '6px' }}>
                  GG
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.camiseta.pesos.GG}
                  onChange={(e) => handleInputChange('camiseta.pesos.GG', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#292929', margin: '0 0 16px 0' }}>Mousepad</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '6px' }}>
                  Comprimento (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.mousepad.comprimento}
                  onChange={(e) => handleInputChange('mousepad.comprimento', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '6px' }}>
                  Largura (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.mousepad.largura}
                  onChange={(e) => handleInputChange('mousepad.largura', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '6px' }}>
                  Altura (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.mousepad.altura}
                  onChange={(e) => handleInputChange('mousepad.altura', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '6px' }}>
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.mousepad.peso}
                  onChange={(e) => handleInputChange('mousepad.peso', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={{ 
              background: loading ? '#ccc' : '#DAA520', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              padding: '10px 20px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: 600, 
              fontSize: 14 
            }}
          >
            {loading ? 'Salvando...' : 'Salvar Dados'}
          </button>
        </div>
      </div>
    </div>
  )
}
