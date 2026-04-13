import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { codigo, total } = await request.json()
    
    const cupom = await (prisma as any).cupom.findUnique({
      where: { codigo: codigo.toUpperCase() }
    })

    if (!cupom) return NextResponse.json({ error: 'Cupom não encontrado' }, { status: 404 })
    if (cupom.status !== 'ativo') return NextResponse.json({ error: 'Cupom inativo' }, { status: 400 })
    if (cupom.validade && new Date(cupom.validade) < new Date()) return NextResponse.json({ error: 'Cupom expirado' }, { status: 400 })
    if (cupom.limiteusos && cupom.totalusado >= cupom.limiteusos) return NextResponse.json({ error: 'Cupom esgotado' }, { status: 400 })

    const desconto = cupom.tipo === 'percentual'
      ? (total * cupom.valor) / 100
      : cupom.valor

    return NextResponse.json({
      success: true,
      cupom: {
        id: cupom.id,
        codigo: cupom.codigo,
        tipo: cupom.tipo,
        valor: cupom.valor,
        desconto: Math.min(desconto, total),
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao validar cupom' }, { status: 500 })
  }
}
