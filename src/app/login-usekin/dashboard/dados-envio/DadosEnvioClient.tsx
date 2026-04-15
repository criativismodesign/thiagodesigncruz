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
                onChange={(e) => handleChange('cepOrigem', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
              />
            </div>

            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#292929', margin: '0 0 16px 0' }}>Camiseta</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '6px' }}>
                    Prazo (dias)
                  </label>
                  <input
                    type="number"
                    value={formData.camiseta.prazo}
                    onChange={(e) => handleChange('camiseta.prazo', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '6px' }}>
                    Preço
                  </label>
                  <input
                    type="text"
                    value={formData.camiseta.preco}
                    onChange={(e) => handleChange('camiseta.preco', e.target.value)}
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
                    Prazo (dias)
                  </label>
                  <input
                    type="number"
                    value={formData.mousepad.prazo}
                    onChange={(e) => handleChange('mousepad.prazo', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '6px' }}>
                    Preço
                  </label>
                  <input
                    type="text"
                    value={formData.mousepad.preco}
                    onChange={(e) => handleChange('mousepad.preco', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#292929', margin: '0 0 16px 0' }}>Caneca</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '6px' }}>
                    Prazo (dias)
                  </label>
                  <input
                    type="number"
                    value={formData.caneca.prazo}
                    onChange={(e) => handleChange('caneca.prazo', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#292929', marginBottom: '6px' }}>
                    Preço
                  </label>
                  <input
                    type="text"
                    value={formData.caneca.preco}
                    onChange={(e) => handleChange('caneca.preco', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: 6, fontSize: 14, color: '#292929' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSalvar}
              disabled={loading}
              style={{ 
                padding: '10px 24px', 
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
