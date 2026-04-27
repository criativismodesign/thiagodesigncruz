'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cookies } from 'next/headers'

// Função para verificar admin (será movida para server component)
async function verificarAdmin() {
  if (typeof window === 'undefined') return false
  const cookie = document.cookie.split(';').find(c => c.trim().startsWith('admin-session='))
  return cookie?.split('=')[1] === process.env.NEXT_PUBLIC_ADMIN_SESSION_TOKEN
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
  items: {
    id: string
    nomeProduto: string
    tamanho?: string
    cor?: string
    quantidade: number
    preco: number
  }[]
}

const STATUS_OPTIONS = [
  { value: 'aguardando_entrada', label: 'Aguardando Pagamento da Entrada' },
  { value: 'entrada_recebida', label: 'Pagamento de Entrada Recebido' },
  { value: 'entrada_confirmada', label: 'Pagamento de Entrada Confirmado' },
  { value: 'em_producao', label: 'Em Produção' },
  { value: 'em_logistica', label: 'Em Logística' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregue', label: 'Entregue' },
]

const STATUS_COLORS: Record<string, string> = {
  aguardando_entrada: '#D97706',
  entrada_recebida: '#2563EB',
  entrada_confirmada: '#7C3AED',
  em_producao: '#DB2777',
  em_logistica: '#0891B2',
  enviado: '#CA8A04',
  entregue: '#16A34A',
}

export default function PedidosAvulsoPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [pedidos, setPedidos] = useState<OrderAvulso[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedPedido, setSelectedPedido] = useState<OrderAvulso | null>(null)
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

  useEffect(() => {
    checkAdminAndLoad()
  }, [])

  const checkAdminAndLoad = async () => {
    const admin = await verificarAdmin()
    setIsAdmin(admin)
    if (admin) {
      loadPedidos()
    } else {
      setLoading(false)
    }
  }

  const loadPedidos = async () => {
    try {
      const response = await fetch('/api/admin/pedidos-avulso')
      if (response.ok) {
        const data = await response.json()
        setPedidos(data.pedidos)
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const valorRestante = formData.valorTotal - formData.valorEntrada
    
    const pedidoData = {
      ...formData,
      valorRestante,
      items: formData.items.filter(item => item.nomeProduto && item.preco > 0)
    }

    try {
      const response = await fetch('/api/admin/pedidos-avulso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoData)
      })

      if (response.ok) {
        setShowModal(false)
        setFormData({
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
        loadPedidos()
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
    }
  }

  const updatePedidoStatus = async (id: string, status: string, trackingCode?: string) => {
    try {
      const response = await fetch(`/api/admin/pedidos-avulso/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingCode })
      })

      if (response.ok) {
        loadPedidos()
        setShowDetailsModal(false)
      }
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error)
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

  const copyLink = (shortId: string) => {
    const link = `https://www.usekin.com.br/acompanhar-avulso/${shortId}`
    navigator.clipboard.writeText(link)
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <h1>Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <h1>Carregando...</h1>
      </div>
    )
  }

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#292929' }}>
          Pedidos Avulsos
        </h1>
        <button
          onClick={() => router.push('/login-usekin/dashboard/pedidos-avulso/novo')}
          style={{
            background: '#DAA520',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Novo Pedido Avulso
        </button>
      </div>

      {/* Tabela de Pedidos */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E5E5', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9F9F9' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#292929' }}>Pedido</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#292929' }}>Cliente</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#292929' }}>Total</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#292929' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#292929' }}>Data</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#292929' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} style={{ borderBottom: '1px solid #E5E5E5' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: '600', color: '#292929' }}>#{pedido.shortId}</div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ color: '#555' }}>{pedido.clienteNome}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{pedido.clienteEmail}</div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: '600', color: '#292929' }}>
                    R$ {pedido.valorTotal.toFixed(2).replace('.', ',')}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    Entrada: R$ {pedido.valorEntrada.toFixed(2).replace('.', ',')}
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#fff',
                    background: STATUS_COLORS[pedido.status] || '#888'
                  }}>
                    {STATUS_OPTIONS.find(s => s.value === pedido.status)?.label || pedido.status}
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ color: '#555' }}>
                    {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <button
                    onClick={() => router.push(`/login-usekin/dashboard/pedidos-avulso/${pedido.id}/editar`)}
                    style={{
                      background: '#2563EB',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '12px',
                      cursor: 'pointer',
                      marginRight: '8px'
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPedido(pedido)
                      setShowDetailsModal(true)
                    }}
                    style={{
                      background: '#6B7280',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '12px',
                      cursor: 'pointer',
                      marginRight: '8px'
                    }}
                  >
                    Detalhes
                  </button>
                  <button
                    onClick={() => copyLink(pedido.shortId)}
                    style={{
                      background: '#059669',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Copiar Link
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Novo Pedido */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#292929', marginBottom: '24px' }}>
              Novo Pedido Avulso
            </h2>
            
            <form onSubmit={handleSubmit}>
              {/* Dados do Cliente */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#292929', marginBottom: '16px' }}>
                  Dados do Cliente
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Nome do Cliente"
                    value={formData.clienteNome}
                    onChange={(e) => setFormData(prev => ({ ...prev, clienteNome: e.target.value }))}
                    required
                    style={{ padding: '12px', border: '1px solid #E5E5E5', borderRadius: '8px' }}
                  />
                  <input
                    type="text"
                    placeholder="CPF"
                    value={formData.clienteCpf}
                    onChange={(e) => setFormData(prev => ({ ...prev, clienteCpf: e.target.value }))}
                    required
                    style={{ padding: '12px', border: '1px solid #E5E5E5', borderRadius: '8px' }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.clienteEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, clienteEmail: e.target.value }))}
                    required
                    style={{ padding: '12px', border: '1px solid #E5E5E5', borderRadius: '8px' }}
                  />
                </div>
              </div>

              {/* Itens */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#292929', marginBottom: '16px' }}>
                  Itens do Pedido
                </h3>
                {formData.items.map((item, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      placeholder="Nome do Produto"
                      value={item.nomeProduto}
                      onChange={(e) => updateItem(index, 'nomeProduto', e.target.value)}
                      style={{ padding: '8px', border: '1px solid #E5E5E5', borderRadius: '4px' }}
                    />
                    <input
                      type="text"
                      placeholder="Tamanho"
                      value={item.tamanho}
                      onChange={(e) => updateItem(index, 'tamanho', e.target.value)}
                      style={{ padding: '8px', border: '1px solid #E5E5E5', borderRadius: '4px' }}
                    />
                    <input
                      type="text"
                      placeholder="Cor"
                      value={item.cor}
                      onChange={(e) => updateItem(index, 'cor', e.target.value)}
                      style={{ padding: '8px', border: '1px solid #E5E5E5', borderRadius: '4px' }}
                    />
                    <input
                      type="number"
                      placeholder="Qtd"
                      value={item.quantidade}
                      onChange={(e) => updateItem(index, 'quantidade', parseInt(e.target.value) || 1)}
                      min="1"
                      style={{ padding: '8px', border: '1px solid #E5E5E5', borderRadius: '4px' }}
                    />
                    <input
                      type="number"
                      placeholder="Preço"
                      value={item.preco}
                      onChange={(e) => updateItem(index, 'preco', parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                      style={{ padding: '8px', border: '1px solid #E5E5E5', borderRadius: '4px' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      style={{
                        background: '#DC2626',
                        color: '#fff',
                        padding: '8px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItem}
                  style={{
                    background: '#059669',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Adicionar Item
                </button>
              </div>

              {/* Valores */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#292929', marginBottom: '16px' }}>
                  Valores
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                      Valor Total (calculado)
                    </label>
                    <input
                      type="text"
                      value={`R$ ${calcularTotal().toFixed(2).replace('.', ',')}`}
                      readOnly
                      style={{ padding: '12px', border: '1px solid #E5E5E5', borderRadius: '8px', background: '#F9F9F9' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                      Valor da Entrada
                    </label>
                    <input
                      type="number"
                      value={formData.valorEntrada}
                      onChange={(e) => setFormData(prev => ({ ...prev, valorEntrada: parseFloat(e.target.value) || 0 }))}
                      step="0.01"
                      min="0"
                      style={{ padding: '12px', border: '1px solid #E5E5E5', borderRadius: '8px' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                    Frete
                  </label>
                  <input
                    type="number"
                    value={formData.frete}
                    onChange={(e) => setFormData(prev => ({ ...prev, frete: parseFloat(e.target.value) || 0 }))}
                    step="0.01"
                    min="0"
                    style={{ padding: '12px', border: '1px solid #E5E5E5', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ marginTop: '12px', fontSize: '14px', color: '#555' }}>
                  A pagar na entrega: R$ {(calcularTotal() - formData.valorEntrada).toFixed(2).replace('.', ',')}
                </div>
              </div>

              {/* Opcionais */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#292929', marginBottom: '16px' }}>
                  Informações Opcionais
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Nº da Transação"
                    value={formData.transacaoId}
                    onChange={(e) => setFormData(prev => ({ ...prev, transacaoId: e.target.value }))}
                    style={{ padding: '12px', border: '1px solid #E5E5E5', borderRadius: '8px' }}
                  />
                  <textarea
                    placeholder="Endereço de Entrega"
                    value={formData.endereco}
                    onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                    rows={3}
                    style={{ padding: '12px', border: '1px solid #E5E5E5', borderRadius: '8px', resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Botões */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    background: '#6B7280',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#DAA520',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Criar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalhes */}
      {showDetailsModal && selectedPedido && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#292929', marginBottom: '24px' }}>
              Detalhes do Pedido #{selectedPedido.shortId}
            </h2>

            {/* Status */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#292929', marginBottom: '8px' }}>
                Status
              </label>
              <select
                value={selectedPedido.status}
                onChange={(e) => setSelectedPedido(prev => prev ? { ...prev, status: e.target.value } : null)}
                style={{ padding: '12px', border: '1px solid #E5E5E5', borderRadius: '8px', width: '100%', color: '#292929' }}
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value} style={{ color: '#292929' }}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Tracking Code */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#292929', marginBottom: '8px' }}>
                Código de Rastreio
              </label>
              <input
                type="text"
                value={selectedPedido.trackingCode || ''}
                onChange={(e) => setSelectedPedido(prev => prev ? { ...prev, trackingCode: e.target.value } : null)}
                placeholder="Adicionar código de rastreio"
                style={{ padding: '12px', border: '1px solid #E5E5E5', borderRadius: '8px', width: '100%' }}
              />
            </div>

            {/* Link do Cliente */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#292929', marginBottom: '8px' }}>
                Link do Cliente
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={`https://www.usekin.com.br/acompanhar-avulso/${selectedPedido.shortId}`}
                  readOnly
                  style={{ padding: '12px', border: '1px solid #E5E5E5', borderRadius: '8px', flex: 1, background: '#F9F9F9' }}
                />
                <button
                  onClick={() => copyLink(selectedPedido.shortId)}
                  style={{
                    background: '#059669',
                    color: '#fff',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Copiar
                </button>
              </div>
            </div>

            {/* Informações do Pedido */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#292929', marginBottom: '12px' }}>
                Informações do Pedido
              </h3>
              <div style={{ fontSize: '14px', color: '#555', lineHeight: 1.6 }}>
                <div><strong>Cliente:</strong> {selectedPedido.clienteNome}</div>
                <div><strong>Email:</strong> {selectedPedido.clienteEmail}</div>
                <div><strong>CPF:</strong> {selectedPedido.clienteCpf}</div>
                <div><strong>Total:</strong> R$ {selectedPedido.valorTotal.toFixed(2).replace('.', ',')}</div>
                <div><strong>Entrada:</strong> R$ {selectedPedido.valorEntrada.toFixed(2).replace('.', ',')}</div>
                <div><strong>Restante:</strong> R$ {selectedPedido.valorRestante.toFixed(2).replace('.', ',')}</div>
                {selectedPedido.transacaoId && <div><strong>Transação:</strong> {selectedPedido.transacaoId}</div>}
                {selectedPedido.endereco && <div><strong>Endereço:</strong> {selectedPedido.endereco}</div>}
              </div>
            </div>

            {/* Itens */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#292929', marginBottom: '12px' }}>
                Itens
              </h3>
              {selectedPedido.items.map((item) => (
                <div key={item.id} style={{ padding: '8px 0', borderBottom: '1px solid #E5E5E5', fontSize: '14px' }}>
                  <div><strong>{item.nomeProduto}</strong></div>
                  <div style={{ color: '#888' }}>
                    {item.tamanho && `Tam: ${item.tamanho}`}
                    {item.cor && ` • Cor: ${item.cor}`}
                    {` • Qtd: ${item.quantidade}`}
                    {` • R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}`}
                  </div>
                </div>
              ))}
            </div>

            {/* Botões */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  background: '#6B7280',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  if (selectedPedido) {
                    updatePedidoStatus(selectedPedido.id, selectedPedido.status, selectedPedido.trackingCode)
                  }
                }}
                style={{
                  background: '#DAA520',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
