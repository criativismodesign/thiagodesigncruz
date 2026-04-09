import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const colecoes = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        products: {
          select: { id: true }
        }
      }
    })

    return NextResponse.json(colecoes)
  } catch (error) {
    console.error('Erro ao buscar coleções:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar coleções' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const colecao = await prisma.category.create({
      data: {
        name: data.nome,
        slug: data.nome.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: data.subtitulo,
        image: data.imagemCamiseta
      }
    })

    return NextResponse.json(colecao, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar coleção:', error)
    return NextResponse.json(
      { error: 'Erro ao criar coleção' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
