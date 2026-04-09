import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const colecao = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          select: { id: true, name: true }
        }
      }
    })

    if (!colecao) {
      return NextResponse.json(
        { error: 'Coleção não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(colecao)
  } catch (error) {
    console.error('Erro ao buscar coleção:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar coleção' },
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
    
    const colecao = await prisma.category.update({
      where: { id },
      data: {
        name: data.nome,
        description: data.subtitulo,
        image: data.imagemCamiseta
      }
    })

    return NextResponse.json(colecao)
  } catch (error) {
    console.error('Erro ao atualizar coleção:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar coleção' },
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
    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar coleção:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar coleção' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
