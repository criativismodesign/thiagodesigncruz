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
    const data = await request.json()
    
    // Validar campos obrigatórios
    if (!data.nome || !data.tipo || !data.categoria || data.precoAtual === undefined) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: nome, tipo, categoria, precoAtual' },
        { status: 400 }
      )
    }
    
    const produto = await prisma.product.create({
      data: {
        name: data.nome,
        slug: data.nome.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: data.descricaoLonga || '',
        price: data.precoAtual,
        comparePrice: data.precoDe || null,
        images: JSON.stringify([]),
        categoryId: data.colecaoId || null,
        type: data.tipo || 'camiseta',
        sizes: JSON.stringify(data.tipo === 'camiseta' ? ['P', 'M', 'G', 'GG'] : ['Padrão']),
        colors: JSON.stringify(data.cores || []),
        stock: 0,
        featured: false,
        active: data.status === 'ativo'
      }
    })

    return NextResponse.json(produto, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
