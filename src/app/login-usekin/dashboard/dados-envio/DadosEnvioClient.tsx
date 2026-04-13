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
