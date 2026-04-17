import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const revalidate = 30

async function buscarRastreio(codigo: string) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'https://www.thiagodesigncruz.com.br'}/api/rastreio?codigo=${codigo}`)
    if (res.ok) return await res.json()
  } catch {}
  return null
}

const STATUS_CONFIG: Record<string, { label: string; icone: string; cor: string; corFundo: string }> = {
  aguardando_pagamento: { label: 'Aguardando Pagamento', icone: '🛒', cor: '#D97706', corFundo: '#FEF3C7' },
  pending:              { label: 'Aguardando Pagamento', icone: '🛒', cor: '#D97706', corFundo: '#FEF3C7' },
  pago:                 { label: 'Pago', icone: '💳', cor: '#2563EB', corFundo: '#DBEAFE' },
  paid:                 { label: 'Pago', icone: '💳', cor: '#2563EB', corFundo: '#DBEAFE' },
  approved:             { label: 'Pago', icone: '💳', cor: '#2563EB', corFundo: '#DBEAFE' },
  pagamento_confirmado: { label: 'Pagamento Confirmado', icone: '🤚', cor: '#7C3AED', corFundo: '#EDE9FE' },
  em_producao:          { label: 'Em Produção', icone: '🔨', cor: '#DB2777', corFundo: '#FCE7F3' },
  em_logistica:         { label: 'Em Logística', icone: '📦', cor: '#0891B2', corFundo: '#CFFAFE' },
  enviado:              { label: 'Enviado', icone: '🚚', cor: '#CA8A04', corFundo: '#FEF9C3' },
  entregue:             { label: 'Entregue', icone: '🥳', cor: '#16A34A', corFundo: '#DCFCE7' },
  cancelado:            { label: 'Cancelado', icone: '❌', cor: '#DC2626', corFundo: '#FEE2E2' },
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
    return `${e.street}, ${e.number}${e.complement ? `, ${e.complement}` : ''} — ${e.neighborhood}, ${e.city}/${e.state} — CEP ${e.zipCode}`
  } catch { return json }
}

export default async function AcompanharPedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const logado = !!session?.user

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

  // Normalizar status
  const statusNormalizado = pedido.status === 'paid' || pedido.status === 'approved' ? 'pago' : 
    pedido.status === 'pending' ? 'aguardando_pagamento' :
    pedido.status === 'cancelled' ? 'cancelado' : pedido.status

  const statusAtual = STATUS_CONFIG[statusNormalizado] || STATUS_CONFIG['aguardando_pagamento']
  const isCancelado = statusNormalizado === 'cancelado'
  const indexAtual = TIMELINE.indexOf(statusNormalizado)

  let rastreioData = null
  if (pedido.trackingCode) {
    rastreioData = await buscarRastreio(pedido.trackingCode)
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 56, marginBottom: 16, lineHeight: 1 }}>{statusAtual.icone}</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#292929', marginBottom: 8 }}>
          Acompanhamento do Pedido
        </h1>
        <div style={{ fontSize: 14, color: '#888', marginBottom: 12 }}>
          Pedido #{pedido.id.slice(-8).toUpperCase()}
        </div>
        <div style={{
          display: 'inline-block',
          padding: '8px 24px', borderRadius: 999,
          background: statusAtual.corFundo, color: statusAtual.cor,
          fontSize: 15, fontWeight: 700
        }}>
          {statusAtual.label}
        </div>
      </div>

      {/* Timeline */}
      {!isCancelado && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E5E5', padding: 32, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#292929', marginBottom: 24 }}>Status do Pedido</h2>
          {TIMELINE.map((status, index) => {
            const cfg = STATUS_CONFIG[status]
            const concluido = indexAtual >= index
            const atual = indexAtual === index
            return (
              <div key={status} style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: concluido ? cfg.corFundo : '#F5F5F5',
                    border: `2px solid ${concluido ? cfg.cor : '#E5E5E5'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, lineHeight: 1,
                    boxShadow: atual ? `0 0 0 4px ${cfg.corFundo}` : 'none',
                  }}>
                    <span role="img" aria-label={cfg.label}>{cfg.icone}</span>
                  </div>
                  {index < TIMELINE.length - 1 && (
                    <div style={{
                      width: 2, height: 36,
                      background: indexAtual > index ? cfg.cor : '#E5E5E5',
                    }} />
                  )}
                </div>
                <div style={{ paddingTop: 10, paddingBottom: index < TIMELINE.length - 1 ? 36 : 0 }}>
                  <div style={{
                    fontSize: 15, fontWeight: atual ? 700 : 500,
                    color: concluido ? cfg.cor : '#AAAAAA'
                  }}>
                    {cfg.label}
                  </div>
                  {atual && (
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                      Status atual do seu pedido
                    </div>
                  )}
                  {status === 'enviado' && pedido.trackingCode && concluido && (
                    <div style={{ fontSize: 13, color: '#CA8A04', marginTop: 4, fontWeight: 600 }}>
                      Rastreio: {pedido.trackingCode}
                    </div>
                  )}

              {rastreioData?.eventos && rastreioData.eventos.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#292929', marginBottom: 12 }}>
                    ð Histórico de Rastreio
                  </h3>
                  {rastreioData.eventos.map((evento: any, index: number) => (
                    <div key={index} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#DAA520', flexShrink: 0, marginTop: 6 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#292929' }}>{evento.descricao}</div>
                        {evento.local && <div style={{ fontSize: 12, color: '#888' }}>{evento.local}</div>}
                        <div style={{ fontSize: 12, color: '#888' }}>
                          {evento.data ? new Date(evento.data).toLocaleString('pt-BR') : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Cancelado */}
      {isCancelado && (
        <div style={{ background: '#FEE2E2', borderRadius: 16, padding: 24, marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>❌</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#DC2626' }}>Pedido Cancelado</div>
          <div style={{ fontSize: 14, color: '#888', marginTop: 8 }}>
            Dúvidas? Entre em contato: usekin@gmail.com
          </div>
        </div>
      )}

      {/* Conteúdo protegido */}
      {logado ? (
        <>
          {/* Itens do Pedido */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E5E5', padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#292929', marginBottom: 16 }}>Itens do Pedido</h2>
            {pedido.items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F5F5F5' }}>
                {item.product?.imagens?.[0]?.url && (
                  <img src={item.product.imagens[0].url} alt="Produto"
                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#292929' }}>{item.product?.nome || 'Produto'}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                    {item.size && `Tam: ${item.size}`}
                    {item.color && ` • Cor: ${item.color}`}
                    {` • Qtd: ${item.quantity}`}
                    {item.product?.sku && ` • SKU: ${item.product.sku}`}
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
        </>
      ) : (
        /* Bloco de login para ver detalhes */
        <div style={{ background: '#fff', borderRadius: 16, border: '2px dashed #E5E5E5', padding: 32, marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#292929', marginBottom: 8 }}>
            Faça login para ver os detalhes
          </h2>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            Entre na sua conta para ver os produtos do pedido, endereço de entrega e valor total.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <Link href={`/login?redirect=/acompanhar/${id}`} style={{
              padding: '12px 28px', borderRadius: 999, background: '#DAA520', color: '#fff',
              textDecoration: 'none', fontSize: 14, fontWeight: 700
            }}>
              Entrar na conta
            </Link>
            <Link href={`/login?redirect=/acompanhar/${id}`} style={{
              padding: '12px 28px', borderRadius: 999, border: '1px solid #DAA520', color: '#DAA520',
              textDecoration: 'none', fontSize: 14, fontWeight: 600
            }}>
              Criar conta grátis
            </Link>
          </div>
          <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 24 }}>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
              Ao criar uma conta você poderá acompanhar todos os seus pedidos em um só lugar.
            </p>
          </div>
        </div>
      )}

      {/* Links rodapé */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {logado && (
          <Link href="/minha-conta" style={{
            padding: '12px 24px', borderRadius: 999, background: '#DAA520', color: '#fff',
            textDecoration: 'none', fontSize: 14, fontWeight: 700
          }}>
            Minha Conta
          </Link>
        )}
        <Link href="/categorias/todos-produtos" style={{
          padding: '12px 24px', borderRadius: 999, border: '1px solid #E5E5E5', color: '#292929',
          textDecoration: 'none', fontSize: 14, fontWeight: 500
        }}>
          Continuar Comprando
        </Link>

      {/* Botão atualizar */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <a href={`/acompanhar/${(await params).id}`}
          style={{ fontSize: 13, color: '#888', textDecoration: 'none', padding: '8px 16px', border: '1px solid #E5E5E5', borderRadius: 999, display: 'inline-block' }}>
          Atualizar status
        </a>
      </div>
      </div>
    </div>
  )
}