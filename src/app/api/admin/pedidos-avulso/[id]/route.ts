import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { enviarEmailStatusAvulso } from '@/lib/email-avulso'

async function verificarAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  return session === process.env.ADMIN_SESSION_TOKEN
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await verificarAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
  const { id } = await params
  const body = await request.json()

  const data: any = {}
  if (body.status) data.status = body.status
  if (body.trackingCode !== undefined) data.trackingCode = body.trackingCode
  if (body.transacaoId !== undefined) data.transacaoId = body.transacaoId
  if (body.endereco !== undefined) data.endereco = body.endereco

  try {
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
