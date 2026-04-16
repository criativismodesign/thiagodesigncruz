import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

async function verificarAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  return session === process.env.ADMIN_SESSION_TOKEN
}

export async function GET() {
  if (!await verificarAdmin()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const pedidos = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: { select: { nome: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(pedidos)
}
