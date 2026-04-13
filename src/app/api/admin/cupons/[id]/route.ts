import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function verificarAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  return session === process.env.ADMIN_SESSION_TOKEN
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await verificarAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { id } = await params
  const body = await request.json()
  
  const codigo = body.codigo.toUpperCase().replace(/[^A-Z0-9]/g, '')
  
  const cupom = await prisma.cupom.update({
    where: { id },
    data: {
      codigo,
      tipo: body.tipo,
      valor: parseFloat(body.valor),
      validade: body.validade ? new Date(body.validade) : null,
      limiteUsos: body.limiteUsos ? parseInt(body.limiteUsos) : null,
      status: body.status,
    }
  })
  return NextResponse.json({ success: true, cupom })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await verificarAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { id } = await params
  await prisma.cupom.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
