import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  let produtos = []
  try {
    produtos = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    })
    return NextResponse.json(produtos)
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const produto = await prisma.product.create({
      data: {
        name: body.nome,
        slug: body.nome.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: body.descricaoLonga || '',
        price: parseFloat(body.precoAtual) || 0,
        comparePrice: body.precoDe ? parseFloat(body.precoDe) : null,
        images: JSON.stringify([]),
        categoryId: body.colecaoId || null,
        type: body.tipo || 'camiseta',
        sizes: JSON.stringify(body.tipo === 'camiseta' ? ['P', 'M', 'G', 'GG'] : ['Padrão']),
        colors: JSON.stringify(body.cores || []),
        stock: 0,
        featured: false,
        active: body.status === 'ativo'
      }
    })
    
    return Response.json({ success: true, produto })
  } catch (error) {
    console.error('Erro detalhado:', error)
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
