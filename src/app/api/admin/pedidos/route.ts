import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function verificarAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  return session === process.env.ADMIN_SESSION_TOKEN
}

export async function GET() {
  if (!await verificarAdmin()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  try {
    const pedidos = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true, cpf: true } }, 
        items: {
          include: {
            product: { select: { nome: true, sku: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(pedidos)
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}