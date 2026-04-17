import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { enviarEmailStatusAtualizado } from '@/lib/email'

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

  const pedido = await prisma.order.update({
    where: { id },
    data,
    include: {
      user: { select: { name: true, email: true } }
    }
  })

  if (body.status) {
    const clienteNome = pedido.payerName || pedido.user?.name || 'Cliente'
    const clienteEmail = pedido.payerEmail || pedido.user?.email || ''
    if (clienteEmail) {
      await enviarEmailStatusAtualizado({
        pedidoId: pedido.id,
        clienteNome,
        clienteEmail,
        status: body.status,
        trackingCode: pedido.trackingCode || undefined,
      })
    }
  }

  return NextResponse.json({ success: true, pedido })
}
