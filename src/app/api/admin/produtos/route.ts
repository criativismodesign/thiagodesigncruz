import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { criadoEm: 'desc' },
      include: {
        colecao: {
          select: { id: true, nome: true }
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
    
    const produto = await prisma.produto.create({
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
