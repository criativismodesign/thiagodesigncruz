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
    const cupons = await (prisma as any).cupom.findMany({
      orderBy: { criadoEm: 'desc' }
    })
    return NextResponse.json(cupons)
  } catch (error) {
    console.error('Erro ao buscar cupons:', error)
    return NextResponse.json({ error: 'Erro ao buscar cupons: ' + String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!await verificarAdmin()) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  try {
    const body = await request.json()
    
    const codigo = String(body.codigo).toUpperCase().replace(/[^A-Z0-9]/g, '')
    const valor = parseFloat(body.valor)
    
    if (!codigo) return NextResponse.json({ error: 'Código é obrigatório' }, { status: 400 })
    if (isNaN(valor)) return NextResponse.json({ error: 'Valor inválido' }, { status: 400 })

    const cupom = await (prisma as any).cupom.create({
      data: {
        codigo,
        tipo: body.tipo || 'fixo',
        valor,
        validade: body.validade ? new Date(body.validade) : null,
        limiteusos: body.limiteusos ? parseInt(body.limiteusos) : null,
        status: body.status || 'ativo',
      }
    })
    return NextResponse.json({ success: true, cupom })
  } catch (error: any) {
    console.error('Erro ao criar cupom:', error)
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Já existe um cupom com este código' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao criar cupom: ' + String(error) }, { status: 500 })
  }
}
