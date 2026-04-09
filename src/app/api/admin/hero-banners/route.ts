import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const banners = await prisma.heroBanner.findMany({
      orderBy: { ordem: 'asc' }
    })

    return NextResponse.json(banners)
  } catch (error) {
    console.error('Erro ao buscar banners:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar banners' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const banner = await prisma.heroBanner.create({
      data: {
        imagem: data.imagem,
        supertitulo: data.supertitulo,
        titulo: data.titulo,
        descricao: data.descricao,
        textoBotao: data.textoBotao || 'VER COLEÇÃO',
        linkBotao: data.linkBotao,
        ordem: data.ordem || 0,
        ativo: data.ativo !== undefined ? data.ativo : true
      }
    })

    return NextResponse.json(banner, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar banner:', error)
    return NextResponse.json(
      { error: 'Erro ao criar banner' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
