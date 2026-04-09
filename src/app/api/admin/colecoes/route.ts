import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const colecoes = await prisma.colecao.findMany({
      orderBy: { ordemHome: 'asc' },
      include: {
        produtos: {
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
    
    const colecao = await prisma.colecao.create({
      data: {
        nome: data.nome,
        subtitulo: data.subtitulo,
        imagemCamiseta: data.imagemCamiseta,
        imagemMousepad: data.imagemMousepad,
        visivelHome: data.visivelHome || false,
        ordemHome: data.ordemHome || 0,
        status: data.status || 'ativa'
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
