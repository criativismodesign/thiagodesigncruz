import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function verificarAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  return session === process.env.ADMIN_SESSION_TOKEN
}

export async function GET() {
  if (!await verificarAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const cupons = await prisma.cupom.findMany({ orderBy: { criadoEm: 'desc' } })
  return NextResponse.json(cupons)
}

export async function POST(request: Request) {
  if (!await verificarAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const body = await request.json()
  
  const codigo = body.codigo.toUpperCase().replace(/[^A-Z0-9]/g, '')
  
  const cupom = await prisma.cupom.create({
    data: {
      codigo,
      tipo: body.tipo || 'fixo',
      valor: parseFloat(body.valor),
      validade: body.validade ? new Date(body.validade) : null,
      limiteUsos: body.limiteUsos ? parseInt(body.limiteUsos) : null,
      status: body.status || 'ativo',
    }
  })
  return NextResponse.json({ success: true, cupom })
}
