import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { enviarEmailStatusAvulso } from '@/lib/email-avulso'

async function verificarAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  return session === process.env.ADMIN_SESSION_TOKEN
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await verificarAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
  const { id } = await params

  try {
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

    if (!pedido) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ pedido })
  } catch (error) {
    console.error('Erro ao buscar pedido avulso:', error)
    return NextResponse.json({ error: 'Erro ao buscar pedido' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await verificarAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
  const { id } = await params
  const body = await request.json()

  try {
    // Se estiver atualizando itens, precisamos recriá-los
    if (body.items && Array.isArray(body.items)) {
      // Primeiro, deletar todos os itens existentes
      await prisma.orderAvulsoItem.deleteMany({
        where: { orderAvulsoId: id }
      })

      // Depois, criar os novos itens
      if (body.items.length > 0) {
        await prisma.orderAvulsoItem.createMany({
          data: body.items.map((item: any) => ({
            orderAvulsoId: id,
            nomeProduto: item.nomeProduto,
            tamanho: item.tamanho,
            cor: item.cor,
            quantidade: item.quantidade || 1,
            preco: item.preco
          }))
        })
      }
    }

    // Atualizar os dados principais do pedido
    const data: any = {}
    if (body.clienteNome) data.clienteNome = body.clienteNome
    if (body.clienteCpf) data.clienteCpf = body.clienteCpf.replace(/\D/g, '')
    if (body.clienteEmail) data.clienteEmail = body.clienteEmail
    if (body.valorTotal !== undefined) data.valorTotal = body.valorTotal
    if (body.valorEntrada !== undefined) data.valorEntrada = body.valorEntrada
    if (body.valorRestante !== undefined) data.valorRestante = body.valorRestante
    if (body.frete !== undefined) data.frete = body.frete
    if (body.transacaoId !== undefined) data.transacaoId = body.transacaoId
    if (body.endereco !== undefined) data.endereco = body.endereco
    if (body.status) data.status = body.status
    if (body.trackingCode !== undefined) data.trackingCode = body.trackingCode

    const pedido = await prisma.orderAvulso.update({
      where: { id },
      data,
      include: {
        items: true
      }
    })

    // Enviar email se status foi atualizado
    if (body.status) {
      await enviarEmailStatusAvulso({
        pedidoId: pedido.shortId,
        clienteNome: pedido.clienteNome,
        clienteEmail: pedido.clienteEmail,
        status: body.status,
        trackingCode: pedido.trackingCode || undefined,
      })
    }

    return NextResponse.json({ success: true, pedido })
  } catch (error) {
    console.error('Erro ao atualizar pedido avulso:', error)
    return NextResponse.json({ error: 'Erro ao atualizar pedido' }, { status: 500 })
  }
}
