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
    const produtos = await prisma.produto.findMany({
      orderBy: { criadoEm: 'desc' }
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
    
    const produto = await prisma.produto.create({
      data: {
        nome: body.nome,
        tipo: body.tipo || 'camiseta',
        categoria: body.categoria || 'avulso',
        precoAtual: parseFloat(body.precoAtual) || 0,
        precoDe: body.precoDe ? parseFloat(body.precoDe) : null,
        cores: body.cores || [],
        descricaoCurta: body.descricaoCurta || null,
        descricaoLonga: body.descricaoLonga || null,
        entregaPrazo: body.entregaPrazo || null,
        informacoes: body.informacoes || null,
        status: body.status || 'ativo',
        ordemSecao: parseInt(body.ordemSecao) || 0,
        colecaoId: body.colecaoId || null,
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
