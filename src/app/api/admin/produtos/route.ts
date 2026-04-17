import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { gerarSlug } from '@/lib/slug'

const prisma = new PrismaClient()

function gerarSku(tipo: string): string {
  const prefixo = tipo === 'mousepad' ? 'MSP' : 'CAM'
  const digitos = Math.floor(100000 + Math.random() * 900000).toString()
  return `${prefixo}-${digitos}` 
}

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
    
    const skuGerado = gerarSku(body.tipo || 'camiseta')
    
    const produto = await prisma.produto.create({
      data: {
        nome: body.nome,
        slug: gerarSlug(body.nome),
        tipo: body.tipo || 'camiseta',
        sku: skuGerado,
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

    console.log('Produto criado:', produto.id)
    console.log('Body recebido:', JSON.stringify(body))
    console.log('Estoque recebido:', JSON.stringify(body.estoque))
    console.log('EstoqueMinimo recebido:', body.estoqueMinimo)

    // Salvar estoque
    if (body.estoque && Object.keys(body.estoque).length > 0) {
      console.log('Salvando estoque...')
      for (const [chave, quantidade] of Object.entries(body.estoque)) {
        console.log('Salvando chave:', chave, 'quantidade:', quantidade)
        try {
          if (chave === 'geral') {
            await prisma.estoque.create({
              data: {
                produtoId: produto.id,
                tamanho: null,
                cor: null,
                quantidade: Number(quantidade) || 0,
                minimo: body.estoqueMinimo || 3,
              }
            })
          } else {
            const [tamanho, cor] = chave.split('-')
            await prisma.estoque.create({
              data: {
                produtoId: produto.id,
                tamanho: tamanho || null,
                cor: cor || null,
                quantidade: Number(quantidade) || 0,
                minimo: body.estoqueMinimo || 3,
              }
            })
          }
          console.log('Estoque salvo para:', chave)
        } catch (estoqueError) {
          console.error('Erro ao salvar estoque para', chave, ':', estoqueError)
        }
      }
    } else {
      console.log('Nenhum estoque para salvar - body.estoque vazio ou undefined')
    }

    // Salvar imagens
    if (body.imagemPrincipal) {
      await prisma.imagemProduto.create({
        data: {
          produtoId: produto.id,
          url: body.imagemPrincipal,
          ordem: 0,
          isPrincipal: true,
        }
      })
    }

    if (body.miniaturas?.length > 0) {
      for (let i = 0; i < body.miniaturas.length; i++) {
        await prisma.imagemProduto.create({
          data: {
            produtoId: produto.id,
            url: body.miniaturas[i],
            ordem: i + 1,
            isPrincipal: false,
          }
        })
      }
    }
    
    return NextResponse.json({ success: true, produto })
  } catch (error) {
    console.error('Erro detalhado:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
