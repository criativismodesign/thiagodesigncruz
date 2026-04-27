import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function enviarEmailNovoPedidoAvulsoAdmin({
  shortId,
  clienteNome,
  clienteCpf,
  clienteEmail,
  items,
  valorTotal,
  valorEntrada,
  valorRestante,
  frete,
  transacaoId,
  endereco,
}: {
  shortId: string
  clienteNome: string
  clienteCpf: string
  clienteEmail: string
  items: any[]
  valorTotal: number
  valorEntrada: number
  valorRestante: number
  frete: number
  transacaoId?: string
  endereco?: string
}) {
  try {
    if (!resend) {
      console.log('Resend não configurado - email admin avulso não enviado')
      return
    }

    const itensHtml = items.map(item => `
      <div style="margin-bottom: 8px; padding: 8px; background: #F9F9F9; border-radius: 4px;">
        <div style="font-weight: 600; color: #292929;">${item.nomeProduto}</div>
        ${item.tamanho || item.cor ? `<div style="font-size: 12px; color: #666;">Tamanho: ${item.tamanho || 'N/A'} | Cor: ${item.cor || 'N/A'}</div>` : ''}
        <div style="font-size: 12px; color: #666;">Qtd: ${item.quantidade} | Preço: R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
      </div>
    `).join('')

    await resend.emails.send({
      from: 'UseKIN <noreply@usekin.com.br>',
      to: 'contatousekin@gmail.com',
      subject: `Novo Pedido Avulso #${shortId} - ${clienteNome}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #292929; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #DAA520; margin: 0; font-size: 24px;">USE KIN</h1>
            <p style="color: #CCC; margin: 8px 0 0; font-size: 14px;">Novo Pedido Avulso Recebido</p>
          </div>

          <div style="background: #fff; border: 1px solid #E5E5E5; padding: 32px;">
            <div style="background: #F9F9F9; border-radius: 8px; padding: 16px; margin: 16px 0; display: inline-block;">
              <p style="color: #888; font-size: 13px; margin: 0 0 4px;">Pedido</p>
              <p style="color: #292929; font-size: 22px; font-weight: 700; font-family: monospace; letter-spacing: 2px; margin: 0;">
                #${shortId}
              </p>
            </div>

            <h3 style="color: #292929; font-size: 18px; margin: 24px 0 16px;">Dados do Cliente</h3>
            <div style="color: #555; font-size: 14px; line-height: 1.8;">
              <div><strong>Nome:</strong> ${clienteNome}</div>
              <div><strong>CPF:</strong> ${clienteCpf}</div>
              <div><strong>Email:</strong> ${clienteEmail}</div>
              ${endereco ? `<div><strong>Endereço:</strong> ${endereco}</div>` : ''}
            </div>

            <h3 style="color: #292929; font-size: 18px; margin: 24px 0 16px;">Itens do Pedido</h3>
            <div style="margin-bottom: 16px;">
              ${itensHtml}
            </div>

            <h3 style="color: #292929; font-size: 18px; margin: 24px 0 16px;">Valores</h3>
            <div style="color: #555; font-size: 14px; line-height: 1.8;">
              <div><strong>Valor Total:</strong> R$ ${valorTotal.toFixed(2).replace('.', ',')}</div>
              <div><strong>Valor da Entrada:</strong> R$ ${valorEntrada.toFixed(2).replace('.', ',')}</div>
              <div><strong>Valor Restante:</strong> R$ ${valorRestante.toFixed(2).replace('.', ',')}</div>
              <div><strong>Frete:</strong> R$ ${frete.toFixed(2).replace('.', ',')}</div>
              ${transacaoId ? `<div><strong>Nº Transação:</strong> ${transacaoId}</div>` : ''}
            </div>

            <div style="text-align: center; margin-top: 32px;">
              <a href="https://www.usekin.com.br/login-usekin/dashboard/pedidos-avulso"
                style="background: #DAA520; color: #fff; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
                Gerenciar Pedido
              </a>
            </div>
          </div>

          <div style="background: #F9F9F9; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">© 2026 UseKIN. Todos os direitos reservados.</p>
          </div>
        </div>
      `
    })
    console.log(`Email admin avulso #${shortId} enviado para contatousekin@gmail.com`)
  } catch (error) {
    console.error('Erro ao enviar email admin avulso:', error)
  }
}

export async function enviarEmailNovoPedidoAvulsoCliente({
  shortId,
  clienteNome,
  clienteEmail,
  items,
  valorTotal,
  valorEntrada,
  valorRestante,
  frete,
}: {
  shortId: string
  clienteNome: string
  clienteEmail: string
  items: any[]
  valorTotal: number
  valorEntrada: number
  valorRestante: number
  frete: number
}) {
  try {
    if (!resend) {
      console.log('Resend não configurado - email cliente avulso não enviado')
      return
    }

    const primeiroNome = clienteNome.split(' ')[0]
    const itensHtml = items.map(item => `
      <div style="margin-bottom: 8px; padding: 8px; background: #F9F9F9; border-radius: 4px;">
        <div style="font-weight: 600; color: #292929;">${item.nomeProduto}</div>
        ${item.tamanho || item.cor ? `<div style="font-size: 12px; color: #666;">Tamanho: ${item.tamanho || 'N/A'} | Cor: ${item.cor || 'N/A'}</div>` : ''}
        <div style="font-size: 12px; color: #666;">Qtd: ${item.quantidade} | Preço: R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
      </div>
    `).join('')

    await resend.emails.send({
      from: 'UseKIN <noreply@usekin.com.br>',
      to: clienteEmail,
      subject: `Pedido #${shortId} criado! Acompanhe aqui`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #292929; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #DAA520; margin: 0; font-size: 24px;">USE KIN</h1>
            <p style="color: #CCC; margin: 8px 0 0; font-size: 14px;">Pedido Criado com Sucesso!</p>
          </div>

          <div style="background: #fff; border: 1px solid #E5E5E5; padding: 32px; text-align: center;">
            <div style="font-size: 56px; margin-bottom: 16px; line-height: 1;">🎉</div>
            
            <div style="background: #F9F9F9; border-radius: 8px; padding: 16px; margin: 16px 0; display: inline-block;">
              <p style="color: #888; font-size: 13px; margin: 0 0 4px;">Pedido</p>
              <p style="color: #292929; font-size: 22px; font-weight: 700; font-family: monospace; letter-spacing: 2px; margin: 0;">
                #${shortId}
              </p>
            </div>

            <p style="color: #292929; font-size: 16px; margin: 8px 0 4px;">Olá, <strong>${primeiroNome}</strong>!</p>
            <p style="color: #555; font-size: 14px; line-height: 1.7; margin: 0 0 24px;">
              Seu pedido foi criado com sucesso! Abaixo estão os detalhes:
            </p>

            <div style="text-align: left; margin: 24px 0;">
              <h3 style="color: #292929; font-size: 16px; margin: 16px 0;">Seus Itens</h3>
              ${itensHtml}
            </div>

            <div style="background: #F9F9F9; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: left;">
              <h3 style="color: #292929; font-size: 16px; margin: 0 0 12px;">Resumo dos Valores</h3>
              <div style="color: #555; font-size: 14px; line-height: 1.8;">
                <div><strong>Valor Total:</strong> R$ ${valorTotal.toFixed(2).replace('.', ',')}</div>
                <div><strong>Entrada Paga:</strong> R$ ${valorEntrada.toFixed(2).replace('.', ',')}</div>
                <div><strong>A Pagar na Entrega:</strong> R$ ${valorRestante.toFixed(2).replace('.', ',')}</div>
                ${frete > 0 ? `<div><strong>Frete:</strong> R$ ${frete.toFixed(2).replace('.', ',')}</div>` : ''}
              </div>
            </div>

            <a href="https://www.usekin.com.br/acompanhar-avulso/${shortId}"
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
    console.log(`Email cliente avulso #${shortId} enviado para ${clienteEmail}`)
  } catch (error) {
    console.error('Erro ao enviar email cliente avulso:', error)
  }
}

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
