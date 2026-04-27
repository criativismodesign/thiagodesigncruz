'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface OrderAvulsoItem {
  nomeProduto: string
  tamanho?: string
  cor?: string
  quantidade: number
  preco: number
}

interface OrderAvulso {
  id: string
  shortId: string
  clienteNome: string
  clienteCpf: string
  clienteEmail: string
  valorTotal: number
  valorEntrada: number
  valorRestante: number
  frete: number
  transacaoId?: string
  endereco?: string
  status: string
  trackingCode?: string
  createdAt: string
  items: OrderAvulsoItem[]
}

export default function EditarPedidoAvulsoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    clienteNome: '',
    clienteCpf: '',
    clienteEmail: '',
    valorTotal: 0,
    valorEntrada: 0,
    frete: 0,
    transacaoId: '',
    endereco: '',
    items: [{ nomeProduto: '', tamanho: '', cor: '', quantidade: 1, preco: 0 }]
  })
  const [shortId, setShortId] = useState('')

  useEffect(() => {
    fetchPedido()
  }, [id])

  const fetchPedido = async () => {
    try {
      const response = await fetch(`/api/admin/pedidos-avulso/${id}`)
      if (response.ok) {
        const data = await response.json()
        const pedido = data.pedido
        
        setShortId(pedido.shortId)
        setFormData({
          clienteNome: pedido.clienteNome,
          clienteCpf: pedido.clienteCpf,
          clienteEmail: pedido.clienteEmail,
          valorTotal: pedido.valorTotal,
          valorEntrada: pedido.valorEntrada,
          frete: pedido.frete,
          transacaoId: pedido.transacaoId || '',
          endereco: pedido.endereco || '',
          items: pedido.items.length > 0 ? pedido.items : [{ nomeProduto: '', tamanho: '', cor: '', quantidade: 1, preco: 0 }]
        })
      } else {
        console.error('Erro ao buscar pedido')
        router.push('/login-usekin/dashboard/pedidos-avulso')
      }
    } catch (error) {
      console.error('Erro ao buscar pedido:', error)
      router.push('/login-usekin/dashboard/pedidos-avulso')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const valorTotalCalculado = calcularTotal()
    const valorRestante = valorTotalCalculado - formData.valorEntrada
    
    const pedidoData = {
      ...formData,
      valorTotal: valorTotalCalculado,
      valorRestante,
      items: formData.items.filter(item => item.nomeProduto && item.preco > 0)
    }

    try {
      const response = await fetch(`/api/admin/pedidos-avulso/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoData)
      })

      if (response.ok) {
        router.push('/login-usekin/dashboard/pedidos-avulso')
      } else {
        console.error('Erro ao atualizar pedido')
      }
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error)
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { nomeProduto: '', tamanho: '', cor: '', quantidade: 1, preco: 0 }]
    }))
  }

  const updateItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const calcularTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.preco * item.quantidade), 0) + formData.frete
  }

  const inputStyle = {
    padding: '12px',
    border: '1px solid #E5E5E5',
    borderRadius: '8px',
    color: '#292929',
    backgroundColor: '#fff'
  }

  const inputPlaceholderStyle = {
    ...inputStyle,
    color: '#888888'
  }

  if (fetching) {
    return (
      <div style={{ padding: '48px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Carregando pedido...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '48px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#292929', marginBottom: '32px' }}>
        Editar Pedido #{shortId}
      </h1>
      
      <form onSubmit={handleSubmit}>
        {/* Dados do Cliente */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E5E5', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#292929', marginBottom: '20px' }}>
            Dados do Cliente
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            <input
              type="text"
              placeholder="Nome do Cliente"
              value={formData.clienteNome}
              onChange={(e) => setFormData(prev => ({ ...prev, clienteNome: e.target.value }))}
              required
              style={inputPlaceholderStyle}
            />
            <input
              type="text"
              placeholder="CPF"
              value={formData.clienteCpf}
              onChange={(e) => setFormData(prev => ({ ...prev, clienteCpf: e.target.value }))}
              required
              style={inputPlaceholderStyle}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.clienteEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, clienteEmail: e.target.value }))}
              required
              style={inputPlaceholderStyle}
            />
          </div>
        </div>

        {/* Itens */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E5E5', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#292929', marginBottom: '20px' }}>
            Itens do Pedido
          </h2>
          {formData.items.map((item, index) => (
            <div key={index} style={{ marginBottom: '20px', padding: '16px', background: '#F9F9F9', borderRadius: '8px', border: '1px solid #E5E5E5', overflow: 'hidden' }}>
              {/* Nome do Produto - Linha 1 */}
              <div style={{ marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Nome do Produto"
                  value={item.nomeProduto}
                  onChange={(e) => updateItem(index, 'nomeProduto', e.target.value)}
                  style={{ ...inputPlaceholderStyle, width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              
              {/* Tamanho | Cor - Linha 2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Tamanho"
                  value={item.tamanho}
                  onChange={(e) => updateItem(index, 'tamanho', e.target.value)}
                  style={{ ...inputPlaceholderStyle, width: '100%', boxSizing: 'border-box' }}
                />
                <input
                  type="text"
                  placeholder="Cor"
                  value={item.cor}
                  onChange={(e) => updateItem(index, 'cor', e.target.value)}
                  style={{ ...inputPlaceholderStyle, width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              {/* Quantidade | Preço - Linha 3 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="number"
                  placeholder="Qtd"
                  value={item.quantidade}
                  onChange={(e) => updateItem(index, 'quantidade', parseInt(e.target.value) || 1)}
                  min="1"
                  style={{ ...inputPlaceholderStyle, width: '100%', boxSizing: 'border-box' }}
                />
                <input
                  type="number"
                  placeholder="Preço"
                  value={item.preco}
                  onChange={(e) => updateItem(index, 'preco', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  style={{ ...inputPlaceholderStyle, width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              {/* Botão Remover - Linha 4 */}
              <div style={{ textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  style={{
                    background: '#DC2626',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Remover Item
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            style={{
              background: '#059669',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Adicionar Item
          </button>
        </div>

        {/* Valores */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E5E5', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#292929', marginBottom: '20px' }}>
            Valores
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#555', marginBottom: '6px' }}>
                Valor Total (calculado)
              </label>
              <input
                type="text"
                value={`R$ ${calcularTotal().toFixed(2).replace('.', ',')}`}
                readOnly
                style={{ ...inputStyle, background: '#F9F9F9' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#555', marginBottom: '6px' }}>
                Valor da Entrada
              </label>
              <input
                type="number"
                value={formData.valorEntrada}
                onChange={(e) => setFormData(prev => ({ ...prev, valorEntrada: parseFloat(e.target.value) || 0 }))}
                step="0.01"
                min="0"
                style={inputPlaceholderStyle}
              />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#555', marginBottom: '6px' }}>
              Frete
            </label>
            <input
              type="number"
              value={formData.frete}
              onChange={(e) => setFormData(prev => ({ ...prev, frete: parseFloat(e.target.value) || 0 }))}
              step="0.01"
              min="0"
              style={inputPlaceholderStyle}
            />
          </div>
          <div style={{ fontSize: '16px', color: '#292929', fontWeight: '600', padding: '12px', background: '#F9F9F9', borderRadius: '8px' }}>
            A pagar na entrega: R$ {(calcularTotal() - formData.valorEntrada).toFixed(2).replace('.', ',')}
          </div>
        </div>

        {/* Opcionais */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E5E5', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#292929', marginBottom: '20px' }}>
            Informações Opcionais
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            <input
              type="text"
              placeholder="Nº da Transação"
              value={formData.transacaoId}
              onChange={(e) => setFormData(prev => ({ ...prev, transacaoId: e.target.value }))}
              style={inputPlaceholderStyle}
            />
            <textarea
              placeholder="Endereço de Entrega"
              value={formData.endereco}
              onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
              rows={3}
              style={{ ...inputPlaceholderStyle, resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => router.push('/login-usekin/dashboard/pedidos-avulso')}
            style={{
              background: '#6B7280',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#9CA3AF' : '#DAA520',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
