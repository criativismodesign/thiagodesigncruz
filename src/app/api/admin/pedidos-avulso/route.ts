import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { enviarEmailNovoPedidoAvulsoAdmin, enviarEmailNovoPedidoAvulsoCliente, enviarEmailStatusAvulso } from '@/lib/email-avulso'

async function verificarAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  return session === process.env.ADMIN_SESSION_TOKEN
}

export async function GET() {
  if (!await verificarAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
  try {
    const pedidos = await prisma.orderAvulso.findMany({
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ pedidos })
  } catch (error) {
    console.error('Erro ao buscar pedidos avulsos:', error)
    return NextResponse.json({ error: 'Erro ao buscar pedidos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!await verificarAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
  try {
    const body = await request.json()
    const {
      clienteNome,
      clienteCpf,
      clienteEmail,
      valorTotal,
      valorEntrada,
      valorRestante,
      frete = 0,
      transacaoId,
      endereco,
      items
    } = body

    // Validações básicas
    if (!clienteNome || !clienteCpf || !clienteEmail) {
      return NextResponse.json({ error: 'Dados do cliente são obrigatórios' }, { status: 400 })
    }

    if (!valorTotal || valorEntrada === undefined || valorRestante === undefined) {
      return NextResponse.json({ error: 'Valores financeiros são obrigatórios' }, { status: 400 })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Itens do pedido são obrigatórios' }, { status: 400 })
    }

    // Gerar shortId
    const fullId = `orderavulso_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const shortId = fullId.slice(-8).toUpperCase()

    // Criar pedido
    const pedido = await prisma.orderAvulso.create({
      data: {
        shortId,
        clienteNome,
        clienteCpf: clienteCpf.replace(/\D/g, ''),
        clienteEmail,
        valorTotal,
        valorEntrada,
        valorRestante,
        frete,
        transacaoId,
        endereco,
        items: {
          create: items.map((item: any) => ({
            nomeProduto: item.nomeProduto,
            tamanho: item.tamanho,
            cor: item.cor,
            quantidade: item.quantidade || 1,
            preco: item.preco
          }))
        }
      },
      include: {
        items: true
      }
    })

    // Enviar emails
    await enviarEmailNovoPedidoAvulsoAdmin({
      shortId: pedido.shortId,
      clienteNome,
      clienteCpf,
      clienteEmail,
      items: pedido.items,
      valorTotal,
      valorEntrada,
      valorRestante,
      frete,
      transacaoId,
      endereco
    })

    await enviarEmailNovoPedidoAvulsoCliente({
      shortId: pedido.shortId,
      clienteNome,
      clienteEmail,
      items: pedido.items,
      valorTotal,
      valorEntrada,
      valorRestante,
      frete
    })

    return NextResponse.json({ success: true, pedido })
  } catch (error) {
    console.error('Erro ao criar pedido avulso:', error)
    return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 })
  }
}
