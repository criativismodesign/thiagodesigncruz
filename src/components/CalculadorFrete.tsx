'use client'
import { useState } from 'react'

interface Produto {
  tipo: string
  tamanho?: string
  quantidade: number
}

interface Props {
  produtos: Produto[]
}

export default function CalculadorFrete({ produtos }: Props) {
  const [cep, setCep] = useState('')
  const [loading, setLoading] = useState(false)
  const [fretes, setFretes] = useState<any[]>([])
  const [erro, setErro] = useState('')

  const calcular = async () => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) {
      setErro('CEP inválido')
      return
    }
    setLoading(true)
    setErro('')
    setFretes([])
    try {
      const response = await fetch('/api/frete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cepDestino: cepLimpo, produtos })
      })
      const data = await response.json()
      if (data.fretes?.length > 0) {
        setFretes(data.fretes)
      } else {
        setErro('Nenhuma opção de frete encontrada para este CEP')
      }
    } catch {
      setErro('Erro ao calcular frete')
    } finally {
      setLoading(false)
    }
  }

  const formatCep = (value: string) => {
    const nums = value.replace(/\D/g, '').slice(0, 8)
    return nums.length > 5 ? `${nums.slice(0, 5)}-${nums.slice(5)}` : nums
  }

  return (
    <div style={{ marginTop: 16, padding: '16px', background: '#F9F9F9', borderRadius: 8, border: '1px solid #E5E5E5' }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#292929', marginBottom: 8, textTransform: 'uppercase' }}>
        Calcular Frete
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={cep}
          onChange={e => setCep(formatCep(e.target.value))}
          placeholder="00000-000"
          maxLength={9}
          style={{ flex: 1, border: '1px solid #E5E5E5', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#292929' }}
        />
        <button
          onClick={calcular}
          disabled={loading}
          style={{ background: '#292929', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}
        >
          {loading ? '...' : 'Calcular'}
        </button>
      </div>

      {erro && <p style={{ fontSize: 12, color: '#F0484A', marginTop: 8 }}>{erro}</p>}

      {fretes.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {fretes.map(frete => (
            <div key={frete.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#fff', borderRadius: 8, border: '1px solid #E5E5E5' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#292929', margin: 0 }}>{frete.empresa} - {frete.nome}</p>
                <p style={{ fontSize: 12, color: '#888', margin: 0 }}>Prazo: até {frete.prazo} dias úteis</p>
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#292929', margin: 0 }}>
                R$ {frete.preco.toFixed(2).replace('.', ',')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
