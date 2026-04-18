import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  try {
    const banners = await prisma.heroBanner.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' }
    })
    return NextResponse.json(banners)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar banners' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
