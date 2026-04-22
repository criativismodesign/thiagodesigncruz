import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { enviarEmailNovoPedido, enviarEmailConfirmacaoCliente } from '@/lib/email'

async function verificarAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  return session === process.env.ADMIN_SESSION_TOKEN
}

export async function POST(request: NextRequest) {
  if (!await verificarAdmin()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { pedidoId } = await request.json()

  const order = await prisma.order.findUnique({
    where: { id: pedidoId },
    include: {
      items: {
        include: {
          product: { select: { nome: true, sku: true } }
        }
      },
      user: { select: { name: true, email: true, phone: true, cpf: true } }
    }
  })

  if (!order) {
    return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
  }

  const clienteNome = order.payerName || order.user?.name || 'Cliente'
  const clienteEmail = order.payerEmail || order.user?.email || ''

  let enderecoFormatado = order.shippingAddress
  try {
    const e = JSON.parse(order.shippingAddress)
    enderecoFormatado = `${e.street}, ${e.number}${e.complement ? `, ${e.complement}` : ''} - ${e.neighborhood}, ${e.city}/${e.state} - CEP ${e.zipCode}` 
  } catch {}

  const produtos = order.items.map((item: any) => ({
    nome: item.product?.nome || 'Produto',
    sku: item.product?.sku || undefined,
    quantidade: item.quantity,
    tamanho: item.size || undefined,
    cor: item.color || undefined,
    preco: item.price,
  }))

  await Promise.all([
    enviarEmailNovoPedido({
      pedidoId: order.id,
      clienteNome,
      clienteEmail,
      clienteTelefone: order.payerPhone || '',
      clienteCpf: order.payerCpf || '',
      produtos,
      endereco: enderecoFormatado,
      total: order.total,
      frete: order.shipping,
      formaPagamento: order.paymentMethod || 'pix',
    }),
    enviarEmailConfirmacaoCliente({
      pedidoId: order.id,
      clienteNome,
      clienteEmail,
      produtos,
      total: order.total,
      frete: order.shipping,
    })
  ])

  return NextResponse.json({ success: true })
}
