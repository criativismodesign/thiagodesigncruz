import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const colecoes = await prisma.colecao.findMany({
    where: { status: 'ativa' },
    select: { id: true, nome: true, slug: true },
    orderBy: { ordemHome: 'asc' }
  })
  return NextResponse.json(colecoes)
}
