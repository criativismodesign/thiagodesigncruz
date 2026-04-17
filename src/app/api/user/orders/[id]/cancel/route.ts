import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const userId = (session.user as any).id

    const pedido = await prisma.order.findFirst({
      where: { id, userId }
    })

    if (!pedido) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    if (!['pending', 'aguardando_pagamento'].includes(pedido.status)) {
      return NextResponse.json({ error: 'Este pedido não pode ser cancelado' }, { status: 400 })
    }

    await prisma.order.update({
      where: { id },
      data: { status: 'cancelado' }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cancelar pedido' }, { status: 500 })
  }
}
