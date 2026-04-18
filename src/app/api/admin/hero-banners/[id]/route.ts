import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const banner = await prisma.heroBanner.findUnique({
      where: { id }
    })

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(banner)
  } catch (error) {
    console.error('Erro ao buscar banner:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar banner' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const data = await request.json()
    
    const banner = await prisma.heroBanner.update({
      where: { id },
      data: {
        supertitulo: data.supertitulo || null,
        titulo: data.titulo,
        descricao: data.descricao || null,
        textoBotao: data.textoBotao || 'VER COLEÇÃO',
        linkBotao: data.linkBotao || null,
        ordem: parseInt(data.ordem) || 1,
        ativo: data.ativo ?? true,
        imagem: data.imagem || null,
      }
    })

    return NextResponse.json(banner)
  } catch (error) {
    console.error('Erro ao atualizar banner:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar banner' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.heroBanner.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar banner:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar banner' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
