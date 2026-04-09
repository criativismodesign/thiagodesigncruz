import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

async function verificarAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  return session === process.env.ADMIN_SESSION_TOKEN
}

export async function GET() {
  if (!await verificarAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
  try {
    const produtos = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(produtos)
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!await verificarAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
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
    
    return NextResponse.json({ success: true, produto })
  } catch (error) {
    console.error('Erro detalhado:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
