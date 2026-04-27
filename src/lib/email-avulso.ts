import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function enviarEmailStatusAvulso({
  pedidoId,
  clienteNome,
  clienteEmail,
  status,
  trackingCode,
}: {
  pedidoId: string
  clienteNome: string
  clienteEmail: string
  status: string
  trackingCode?: string
}) {
  const configs: Record<string, { assunto: string; icone: string; titulo: string; mensagem: string; cor: string }> = {
    aguardando_entrada: {
      assunto: `Pedido #${pedidoId} aguardando pagamento da entrada`,
      icone: '&#128722;',
      titulo: 'Aguardando Pagamento da Entrada',
      mensagem: 'Seu pedido foi criado! Realize o pagamento da entrada para confirmarmos.',
      cor: '#D97706'
    },
    entrada_recebida: {
      assunto: `Pagamento de entrada recebido! Pedido #${pedidoId}`,
      icone: '&#128179;',
      titulo: 'Pagamento de Entrada Recebido!',
      mensagem: 'Recebemos seu pagamento de entrada! Em breve confirmaremos e seu pedido entrará em produção.',
      cor: '#2563EB'
    },
    entrada_confirmada: {
      assunto: `Pagamento de entrada confirmado! Pedido #${pedidoId}`,
      icone: '&#9989;',
      titulo: 'Pagamento de Entrada Confirmado!',
      mensagem: 'Confirmamos seu pagamento de entrada! Seu pedido já está na fila de produção.',
      cor: '#7C3AED'
    },
    em_producao: {
      assunto: `Seu pedido está sendo produzido! #${pedidoId}`,
      icone: '&#128296;',
      titulo: 'Em produção!',
      mensagem: 'Ótimas notícias! Seu pedido está sendo produzido com muito carinho pela nossa equipe.',
      cor: '#DB2777'
    },
    em_logistica: {
      assunto: `Pedido em logística! #${pedidoId}`,
      icone: '&#128230;',
      titulo: 'Pedido em logística!',
      mensagem: 'Seu pedido foi produzido e está sendo preparado para envio!',
      cor: '#0891B2'
    },
    enviado: {
      assunto: `Pedido enviado! #${pedidoId}`,
      icone: '&#128666;',
      titulo: 'Pedido enviado!',
      mensagem: 'Seu pedido saiu para entrega!' + (trackingCode ? ` Código de rastreio: <strong>${trackingCode}</strong>` : ''),
      cor: '#CA8A04'
    },
    entregue: {
      assunto: `Pedido entregue! #${pedidoId}`,
      icone: '&#129395;',
      titulo: 'Pedido entregue!',
      mensagem: 'Seu pedido foi entregue! Esperamos que você adore. Obrigado por comprar na UseKIN!',
      cor: '#16A34A'
    },
  }

  const config = configs[status]
  if (!config) return

  try {
    if (!resend) {
      console.log('Resend não configurado - email status avulso não enviado')
      return
    }
    await resend.emails.send({
      from: 'UseKIN <noreply@usekin.com.br>',
      to: clienteEmail,
      subject: config.assunto,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #292929; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #DAA520; margin: 0; font-size: 24px;">USE KIN</h1>
          </div>

          <div style="background: #fff; border: 1px solid #E5E5E5; padding: 32px; text-align: center;">
            <div style="font-size: 56px; margin-bottom: 16px; line-height: 1;">${config.icone}</div>
            <h2 style="color: ${config.cor}; font-size: 22px; margin: 0 0 16px;">${config.titulo}</h2>
            
            <div style="background: #F9F9F9; border-radius: 8px; padding: 16px; margin: 16px 0; display: inline-block;">
              <p style="color: #888; font-size: 13px; margin: 0 0 4px;">Pedido</p>
              <p style="color: #292929; font-size: 22px; font-weight: 700; font-family: monospace; letter-spacing: 2px; margin: 0;">
                #${pedidoId}
              </p>
            </div>

            <p style="color: #292929; font-size: 16px; margin: 8px 0 4px;">Olá, <strong>${clienteNome}</strong>!</p>
            <p style="color: #555; font-size: 14px; line-height: 1.7; margin: 0 0 24px;">${config.mensagem}</p>

            <a href="https://www.usekin.com.br/acompanhar-avulso/${pedidoId}"
              style="background: #DAA520; color: #fff; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
              Acompanhar Pedido
            </a>

            <p style="color: #888; font-size: 13px; margin-top: 24px; line-height: 1.6;">
              Dúvidas? Entre em contato: contato@usekin.com.br
            </p>
          </div>

          <div style="background: #F9F9F9; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">© 2026 UseKIN. Todos os direitos reservados.</p>
          </div>
        </div>
      `
    })
    console.log(`Email status avulso ${status} enviado para ${clienteEmail}`)
  } catch (error) {
    console.error('Erro ao enviar email status avulso:', error)
  }
}
