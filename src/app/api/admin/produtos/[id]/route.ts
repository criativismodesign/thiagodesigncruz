import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

async function verificarAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  return session === process.env.ADMIN_SESSION_TOKEN
}

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

    // Atualizar estoque - deletar existente e recriar
    if (data.estoque !== undefined) {
      await prisma.estoque.deleteMany({
        where: { produtoId: id }
      })

      if (Object.keys(data.estoque).length > 0) {
        for (const [chave, quantidade] of Object.entries(data.estoque)) {
          if (chave === 'geral') {
            await prisma.estoque.create({
              data: {
                produtoId: id,
                tamanho: null,
                cor: null,
                quantidade: Number(quantidade) || 0,
                minimo: data.estoqueMinimo || 3,
              }
            })
          } else {
            const [tamanho, cor] = chave.split('-')
            await prisma.estoque.create({
              data: {
                produtoId: id,
                tamanho: tamanho || null,
                cor: cor || null,
                quantidade: Number(quantidade) || 0,
                minimo: data.estoqueMinimo || 3,
              }
            })
          }
        }
      }
    }

    // Atualizar imagens se enviadas
    if (data.imagemPrincipal !== undefined || data.miniaturas !== undefined) {
      // Deletar imagens existentes
      await prisma.imagemProduto.deleteMany({
        where: { produtoId: id }
      })

      // Salvar imagem principal
      if (data.imagemPrincipal) {
        await prisma.imagemProduto.create({
          data: {
            produtoId: id,
            url: data.imagemPrincipal,
            ordem: 0,
            isPrincipal: true,
          }
        })
      }

      // Salvar miniaturas
      if (data.miniaturas?.length > 0) {
        for (let i = 0; i < data.miniaturas.length; i++) {
          await prisma.imagemProduto.create({
            data: {
              produtoId: id,
              url: data.miniaturas[i],
              ordem: i + 1,
              isPrincipal: false,
            }
          })
        }
      }
    }

    // Atualizar guia de tamanhos
    if (data.imagemGuiaTamanhos !== undefined) {
      await prisma.produto.update({
        where: { id },
        data: { imagemGuiaTamanhos: data.imagemGuiaTamanhos }
      })
    }

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
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await verificarAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
  const { id } = await params
  
  try {
    // Deletar estoque vinculado
    await prisma.estoque.deleteMany({
      where: { produtoId: id }
    })
    
    // Deletar imagens vinculadas
    await prisma.imagemProduto.deleteMany({
      where: { produtoId: id }
    })
    
    // Deletar produto
    await prisma.produto.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
