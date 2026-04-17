import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const STATUS_CONFIG: Record<string, { label: string; icone: string; cor: string; corFundo: string }> = {
  aguardando_pagamento: { label: 'Aguardando Pagamento', icone: ' ', cor: '#D97706', corFundo: '#FEF3C7' },
  pending:              { label: 'Aguardando Pagamento', icone: ' ', cor: '#D97706', corFundo: '#FEF3C7' },
  pago:                 { label: 'Pago', icone: ' ', cor: '#2563EB', corFundo: '#DBEAFE' },
  paid:                 { label: 'Pago', icone: ' ', cor: '#2563EB', corFundo: '#DBEAFE' },
  approved:             { label: 'Pago', icone: ' ', cor: '#2563EB', corFundo: '#DBEAFE' },
  pagamento_confirmado: { label: 'Pagamento Confirmado', icone: ' ', cor: '#7C3AED', corFundo: '#EDE9FE' },
  em_producao:          { label: 'Em Produção', icone: ' ', cor: '#DB2777', corFundo: '#FCE7F3' },
  em_logistica:         { label: 'Em Logística', icone: ' ', cor: '#0891B2', corFundo: '#CFFAFE' },
  enviado:              { label: 'Enviado', icone: ' ', cor: '#CA8A04', corFundo: '#FEF9C3' },
  entregue:             { label: 'Entregue', icone: ' ', cor: '#16A34A', corFundo: '#DCFCE7' },
  cancelado:            { label: 'Cancelado', icone: ' ', cor: '#DC2626', corFundo: '#FEE2E2' },
}

const TIMELINE = [
  'aguardando_pagamento',
  'pago',
  'pagamento_confirmado',
  'em_producao',
  'em_logistica',
  'enviado',
  'entregue',
]

function formatarEndereco(json: string) {
  try {
    const e = JSON.parse(json)
    return `${e.street}, ${e.number}${e.complement ? `, ${e.complement}` : ''} - ${e.neighborhood}, ${e.city}/${e.state} - CEP ${e.zipCode}` 
  } catch {
    return json
  }
}

export default async function AcompanharPedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const pedido = await prisma.order.findFirst({
    where: {
      OR: [
        { id: { endsWith: id.toLowerCase() } },
        { id: id }
      ]
    },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: { select: { nome: true, sku: true, imagens: { where: { isPrincipal: true }, take: 1 } } }
        }
      }
    }
  })

  if (!pedido) notFound()

  const statusAtual = STATUS_CONFIG[pedido.status] || STATUS_CONFIG['aguardando_pagamento']
  const isCancelado = pedido.status === 'cancelado'
  const indexAtual = TIMELINE.indexOf(pedido.status)

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{statusAtual.icone}</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#292929', marginBottom: 8 }}>
          Acompanhamento do Pedido
        </h1>
        <div style={{ fontSize: 14, color: '#888' }}>
          Pedido #{pedido.id.slice(-8).toUpperCase()}
        </div>
        <div style={{ 
          display: 'inline-block', marginTop: 12,
          padding: '8px 20px', borderRadius: 999,
          background: statusAtual.corFundo, color: statusAtual.cor,
          fontSize: 16, fontWeight: 700
        }}>
          {statusAtual.icone} {statusAtual.label}
        </div>
      </div>

      {/* Timeline */}
      {!isCancelado && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E5E5', padding: 32, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#292929', marginBottom: 24 }}>Status do Pedido</h2>
          <div style={{ position: 'relative' }}>
            {TIMELINE.map((status, index) => {
              const cfg = STATUS_CONFIG[status]
              const concluido = indexAtual >= index
              const atual = indexAtual === index
              return (
                <div key={status} style={{ display: 'flex', gap: 16, marginBottom: index < TIMELINE.length - 1 ? 0 : 0 }}>
                  {/* Linha vertical + círculo */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: concluido ? cfg.corFundo : '#F5F5F5',
                      border: `2px solid ${concluido ? cfg.cor : '#E5E5E5'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20,
                      boxShadow: atual ? `0 0 0 4px ${cfg.corFundo}` : 'none',
                      transition: 'all 0.3s'
                    }}>
                      {cfg.icone}
                    </div>
                    {index < TIMELINE.length - 1 && (
                      <div style={{
                        width: 2, height: 40,
                        background: indexAtual > index ? cfg.cor : '#E5E5E5',
                        transition: 'background 0.3s'
                      }} />
                    )}
                  </div>
                  {/* Texto */}
                  <div style={{ paddingTop: 10, paddingBottom: index < TIMELINE.length - 1 ? 40 : 0 }}>
                    <div style={{
                      fontSize: 15, fontWeight: atual ? 700 : 500,
                      color: concluido ? cfg.cor : '#AAAAAA'
                    }}>
                      {cfg.label}
                    </div>
                    {atual && (
                      <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
                        Status atual do seu pedido
                      </div>
                    )}
                    {status === 'enviado' && pedido.trackingCode && concluido && (
                      <div style={{ fontSize: 13, color: '#CA8A04', marginTop: 4, fontWeight: 600 }}>
                        Rastreio: {pedido.trackingCode}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Cancelado */}
      {isCancelado && (
        <div style={{ background: '#FEE2E2', borderRadius: 16, padding: 24, marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}></div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#DC2626' }}>Pedido Cancelado</div>
          <div style={{ fontSize: 14, color: '#888', marginTop: 8 }}>
            Se tiver dúvidas, entre em contato: usekin@gmail.com
          </div>
        </div>
      )}

      {/* Itens do Pedido */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E5E5', padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#292929', marginBottom: 16 }}>Itens do Pedido</h2>
        {pedido.items.map(item => (
          <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F5F5F5' }}>
            {item.product?.imagens?.[0]?.url && (
              <img src={item.product.imagens[0].url} alt={item.product.nome}
                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#292929' }}>{item.product?.nome || 'Produto'}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                {item.size && `Tam: ${item.size}`}
                {item.color && `  Cor: ${item.color}`}
                {`  Qtd: ${item.quantity}`}
                {item.product?.sku && `  SKU: ${item.product.sku}`}
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#292929' }}>
              R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
            </div>
          </div>
        ))}
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #E5E5E5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888', marginBottom: 4 }}>
            <span>Subtotal</span><span>R$ {pedido.subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          {pedido.shipping > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888', marginBottom: 4 }}>
              <span>Frete</span><span>R$ {pedido.shipping.toFixed(2).replace('.', ',')}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#292929', marginTop: 8 }}>
            <span>Total</span><span>R$ {pedido.total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E5E5', padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#292929', marginBottom: 12 }}>Endereço de Entrega</h2>
        <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>{formatarEndereco(pedido.shippingAddress)}</p>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/minha-conta" style={{
          padding: '12px 24px', borderRadius: 999, background: '#DAA520', color: '#fff',
          textDecoration: 'none', fontSize: 14, fontWeight: 700
        }}>
          Minha Conta
        </Link>
        <Link href="/categorias/todos-produtos" style={{
          padding: '12px 24px', borderRadius: 999, border: '1px solid #E5E5E5', color: '#292929',
          textDecoration: 'none', fontSize: 14, fontWeight: 500
        }}>
          Continuar Comprando
        </Link>
      </div>
    </div>
  )
}
