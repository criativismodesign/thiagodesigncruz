import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function enviarEmailNovoPedido({
  pedidoId,
  clienteNome,
  clienteEmail,
  clienteTelefone,
  clienteCpf,
  produtos,
  endereco,
  total,
  frete,
  formaPagamento,
}: {
  pedidoId: string
  clienteNome: string
  clienteEmail: string
  clienteTelefone?: string
  clienteCpf?: string
  produtos: { nome: string; sku?: string; quantidade: number; tamanho?: string; cor?: string; preco: number }[]
  endereco: string
  total: number
  frete: number
  formaPagamento: string
}) {
  try {
    await resend.emails.send({
      from: 'UseKIN <onboarding@resend.dev>',
      to: 'usekin@gmail.com',
      subject: `Novo Pedido #${pedidoId.slice(-8).toUpperCase()} - R$ ${total.toFixed(2).replace('.', ',')}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #292929; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #DAA520; margin: 0; font-size: 24px;">NOVO PEDIDO!</h1>
            <p style="color: #fff; margin: 8px 0 0; font-size: 16px;">Pedido #${pedidoId.slice(-8).toUpperCase()}</p>
          </div>
          
          <div style="background: #fff; border: 1px solid #E5E5E5; padding: 24px;">
            
            <h2 style="color: #292929; font-size: 16px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid #DAA520;">PRODUTOS</h2>
            ${produtos.map(p => `
              <div style="padding: 12px; background: #F9F9F9; border-radius: 8px; margin-bottom: 8px;">
                <strong style="color: #292929;">${p.nome}</strong>
                ${p.sku ? `<span style="color: #888; font-size: 12px;"> - SKU: ${p.sku}</span>` : ''}
                <div style="color: #555; font-size: 14px; margin-top: 4px;">
                  ${p.tamanho ? `Tamanho: <strong>${p.tamanho}</strong>` : ''}
                  ${p.cor ? ` - Cor: <strong>${p.cor}</strong>` : ''}
                  - Qtd: <strong>${p.quantidade}</strong>
                  - R$ ${(p.preco * p.quantidade).toFixed(2).replace('.', ',')}
                </div>
              </div>
            `).join('')}
            
            <div style="margin-top: 16px; padding: 12px; background: #F0F0F0; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; color: #888; font-size: 14px;">
                Frete: R$ ${frete.toFixed(2).replace('.', ',')}
              </div>
              <div style="font-size: 18px; font-weight: 700; color: #292929; margin-top: 8px;">
                Total: R$ ${total.toFixed(2).replace('.', ',')}
              </div>
              <div style="font-size: 13px; color: #888; margin-top: 4px;">
                Forma de pagamento: ${formaPagamento.toUpperCase()}
              </div>
            </div>

            <h2 style="color: #292929; font-size: 16px; margin: 24px 0 16px; padding-bottom: 8px; border-bottom: 2px solid #DAA520;">CLIENTE</h2>
            <div style="color: #555; font-size: 14px; line-height: 1.8;">
              <div>Nome: <strong>${clienteNome}</strong></div>
              <div>Email: <strong>${clienteEmail}</strong></div>
              ${clienteTelefone ? `<div>WhatsApp: <strong>${clienteTelefone}</strong></div>` : ''}
              ${clienteCpf ? `<div>CPF: <strong>${clienteCpf}</strong></div>` : ''}
            </div>

            <h2 style="color: #292929; font-size: 16px; margin: 24px 0 16px; padding-bottom: 8px; border-bottom: 2px solid #DAA520;">ENDEREÇO DE ENTREGA</h2>
            <div style="color: #555; font-size: 14px; line-height: 1.6; background: #F9F9F9; padding: 12px; border-radius: 8px;">
              ${endereco}
            </div>

            <div style="margin-top: 24px; text-align: center;">
              <a href="https://thiagodesigncruz.vercel.app/login-usekin/dashboard/pedidos" 
                style="background: #DAA520; color: #fff; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 14px;">
                Ver Pedido no Painel
              </a>
            </div>
          </div>

          <div style="background: #F9F9F9; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">useKIN - Painel Administrativo</p>
          </div>
        </div>
      `
    })
    console.log('Email novo pedido enviado com sucesso')
  } catch (error) {
    console.error('Erro ao enviar email novo pedido:', error)
  }
}

export async function enviarEmailConfirmacaoCliente({
  pedidoId,
  clienteNome,
  clienteEmail,
  produtos,
  total,
  frete,
}: {
  pedidoId: string
  clienteNome: string
  clienteEmail: string
  produtos: { nome: string; quantidade: number; tamanho?: string; cor?: string; preco: number }[]
  total: number
  frete: number
}) {
  try {
    await resend.emails.send({
      from: 'UseKIN <onboarding@resend.dev>',
      to: clienteEmail,
      subject: `Pedido #${pedidoId.slice(-8).toUpperCase()} confirmado - UseKIN`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #292929; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #DAA520; margin: 0; font-size: 24px;">USE KIN</h1>
            <p style="color: #fff; margin: 8px 0 0; font-size: 16px;">Pedido Confirmado!</p>
          </div>

          <div style="background: #fff; border: 1px solid #E5E5E5; padding: 24px;">
            <p style="color: #292929; font-size: 16px;">Olá, <strong>${clienteNome}</strong>!</p>
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              Recebemos seu pedido e ele já está sendo processado. Assim que confirmarmos o pagamento, seu pedido entrará em produção!
            </p>

            <div style="background: #F9F9F9; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
              <p style="color: #888; font-size: 13px; margin: 0 0 4px;">Número do seu pedido</p>
              <p style="color: #292929; font-size: 24px; font-weight: 700; font-family: monospace; letter-spacing: 2px; margin: 0;">
                #${pedidoId.slice(-8).toUpperCase()}
              </p>
            </div>

            <h2 style="color: #292929; font-size: 16px; margin: 24px 0 16px; padding-bottom: 8px; border-bottom: 1px solid #E5E5E5;">Itens do Pedido</h2>
            ${produtos.map(p => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F5F5F5; font-size: 14px;">
                <div style="color: #292929;">
                  ${p.quantidade}x ${p.nome}
                  ${p.tamanho ? `<span style="color: #888;"> - ${p.tamanho}</span>` : ''}
                  ${p.cor ? `<span style="color: #888;"> / ${p.cor}</span>` : ''}
                </div>
                <div style="color: #292929; font-weight: 600;">R$ ${(p.preco * p.quantidade).toFixed(2).replace('.', ',')}</div>
              </div>
            `).join('')}

            <div style="margin-top: 16px; text-align: right; font-size: 14px; color: #888;">
              Frete: R$ ${frete.toFixed(2).replace('.', ',')}
            </div>
            <div style="text-align: right; font-size: 18px; font-weight: 700; color: #292929; margin-top: 8px;">
              Total: R$ ${total.toFixed(2).replace('.', ',')}
            </div>

            <div style="margin-top: 24px; text-align: center;">
              <a href="https://thiagodesigncruz.vercel.app/acompanhar/${pedidoId.slice(-8).toLowerCase()}"
                style="background: #DAA520; color: #fff; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 14px;">
                Acompanhar Pedido
              </a>
            </div>

            <p style="color: #888; font-size: 13px; text-align: center; margin-top: 24px; line-height: 1.6;">
              Dúvidas? Entre em contato: usekin@gmail.com<br>
              ou WhatsApp: (62) 9 8131-6462
            </p>
          </div>

          <div style="background: #F9F9F9; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">© 2026 UseKIN. Todos os direitos reservados.</p>
          </div>
        </div>
      `
    })
    console.log('Email confirmação cliente enviado com sucesso')
  } catch (error) {
    console.error('Erro ao enviar email confirmação cliente:', error)
  }
}
