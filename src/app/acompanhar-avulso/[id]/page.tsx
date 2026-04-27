import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export const revalidate = 30

const STATUS_CONFIG: Record<string, { label: string; icone: string; cor: string; corFundo: string }> = {
  aguardando_entrada: { label: 'Aguardando Pagamento da Entrada', icone: '🛒', cor: '#D97706', corFundo: '#FEF3C7' },
  entrada_recebida: { label: 'Pagamento de Entrada Recebido', icone: '💳', cor: '#2563EB', corFundo: '#DBEAFE' },
  entrada_confirmada: { label: 'Pagamento de Entrada Confirmado', icone: '🤚', cor: '#7C3AED', corFundo: '#EDE9FE' },
  em_producao: { label: 'Em Produção', icone: '🔨', cor: '#DB2777', corFundo: '#FCE7F3' },
  em_logistica: { label: 'Em Logística', icone: '📦', cor: '#0891B2', corFundo: '#CFFAFE' },
  enviado: { label: 'Enviado', icone: '🚚', cor: '#CA8A04', corFundo: '#FEF9C3' },
  entregue: { label: 'Entregue', icone: '🥳', cor: '#16A34A', corFundo: '#DCFCE7' },
}

const TIMELINE = [
  'aguardando_entrada',
  'entrada_recebida',
  'entrada_confirmada',
  'em_producao',
  'em_logistica',
  'enviado',
  'entregue',
]

function formatarCPF(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export default async function AcompanharPedidoAvulsoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const pedido = await prisma.orderAvulso.findFirst({
    where: {
      OR: [
        { shortId: id.toUpperCase() },
        { id: id }
      ]
    },
    include: {
      items: true
    }
  })

  if (!pedido) notFound()

  const statusAtual = STATUS_CONFIG[pedido.status] || STATUS_CONFIG['aguardando_entrada']
  const indexAtual = TIMELINE.indexOf(pedido.status)

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 56, marginBottom: 16, lineHeight: 1 }}>{statusAtual.icone}</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#292929', marginBottom: 8 }}>
          Acompanhamento do Pedido Avulso
        </h1>
        <div style={{ fontSize: 14, color: '#888', marginBottom: 12 }}>
          Pedido #{pedido.shortId}
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
              </div>
            </div>
          )
        })}
      </div>

      {/* Dados do Cliente */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E5E5', padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#292929', marginBottom: 16 }}>Dados do Cliente</h2>
        <div style={{ color: '#555', fontSize: 14, lineHeight: 1.8 }}>
          <div>Nome: <strong>{pedido.clienteNome}</strong></div>
          <div>CPF: <strong>{formatarCPF(pedido.clienteCpf)}</strong></div>
          <div>Email: <strong>{pedido.clienteEmail}</strong></div>
        </div>
      </div>

      {/* Itens do Pedido */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E5E5', padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#292929', marginBottom: 16 }}>Itens do Pedido</h2>
        {pedido.items.map(item => (
          <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F5F5F5' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#292929' }}>{item.nomeProduto}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                {item.tamanho && `Tam: ${item.tamanho}`}
                {item.cor && ` • Cor: ${item.cor}`}
                {` • Qtd: ${item.quantidade}`}
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#292929' }}>
              R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
            </div>
          </div>
        ))}
      </div>

      {/* Valores */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E5E5', padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#292929', marginBottom: 16 }}>Valores</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888', marginBottom: 4 }}>
          <span>Pago (entrada)</span><span>R$ {pedido.valorEntrada.toFixed(2).replace('.', ',')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888', marginBottom: 4 }}>
          <span>A pagar na entrega</span><span>R$ {pedido.valorRestante.toFixed(2).replace('.', ',')}</span>
        </div>
        {pedido.frete > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888', marginBottom: 4 }}>
            <span>Frete</span><span>R$ {pedido.frete.toFixed(2).replace('.', ',')}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#292929', marginTop: 8, paddingTop: 8, borderTop: '1px solid #E5E5E5' }}>
          <span>Total</span><span>R$ {pedido.valorTotal.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      {/* Informações Adicionais */}
      {(pedido.transacaoId || pedido.endereco) && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E5E5', padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#292929', marginBottom: 16 }}>Informações Adicionais</h2>
          {pedido.transacaoId && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>Nº da Transação</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#292929' }}>{pedido.transacaoId}</div>
            </div>
          )}
          {pedido.endereco && (
            <div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>Endereço de Entrega</div>
              <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>{pedido.endereco}</div>
            </div>
          )}
        </div>
      )}

      {/* Links rodapé */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/categorias/todos-produtos" style={{
          padding: '12px 24px', borderRadius: 999, border: '1px solid #E5E5E5', color: '#292929',
          textDecoration: 'none', fontSize: 14, fontWeight: 500
        }}>
          Continuar Comprando
        </a>
      </div>

      {/* Botão atualizar */}
      <div style={{ textAlign: 'center', marginBottom: 16, marginTop: 24 }}>
        <a href={`/acompanhar-avulso/${id}`}
          style={{ fontSize: 13, color: '#888', textDecoration: 'none', padding: '8px 16px', border: '1px solid #E5E5E5', borderRadius: 999, display: 'inline-block' }}>
          Atualizar status
        </a>
      </div>
    </div>
  )
}
