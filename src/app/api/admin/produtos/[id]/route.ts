import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
        colecao: {
          select: { id: true, nome: true }
        }
      }
    })

    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(produto)
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produto' },
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
  const { id } = await params
  try {
    const data = await request.json()
    
    const produto = await prisma.produto.update({
      where: { id },
      data: {
        nome: data.nome,
        tipo: data.tipo || 'camiseta',
        categoria: data.categoria || 'avulso',
        colecaoId: data.colecaoId || null,
        precoAtual: data.precoAtual,
        precoDe: data.precoDe || null,
        cores: data.cores || [],
        descricaoCurta: data.descricaoCurta || null,
        descricaoLonga: data.descricaoLonga || null,
        entregaPrazo: data.entregaPrazo || null,
        informacoes: data.informacoes || null,
        status: data.status || 'ativo',
        ordemSecao: data.ordemSecao || 0
      }
    })

    return NextResponse.json(produto)
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
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
  const { id } = await params
  try {
    await prisma.produto.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar produto' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
