import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

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

  const pedido = await prisma.order.update({ where: { id }, data })
  return NextResponse.json({ success: true, pedido })
}
