import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { orderId, password } = await request.json()

    if (!orderId || !password) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Senha deve ter pelo menos 6 caracteres' }, { status: 400 })
    }

    const pedido = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!pedido) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    if (!pedido.payerEmail) {
      return NextResponse.json({ error: 'Email não encontrado no pedido' }, { status: 400 })
    }

    const usuarioExistente = await prisma.user.findUnique({
      where: { email: pedido.payerEmail }
    })

    if (usuarioExistente) {
      await prisma.order.update({
        where: { id: orderId },
        data: { userId: usuarioExistente.id }
      })
      return NextResponse.json({ success: true, jaExistia: true })
    }

    const senhaHash = await bcrypt.hash(password, 10)

    const novoUsuario = await prisma.user.create({
      data: {
        name: pedido.payerName || 'Cliente',
        email: pedido.payerEmail,
        password: senhaHash,
        phone: pedido.payerPhone || '',
        cpf: pedido.payerCpf || '',
      }
    })

    await prisma.order.update({
      where: { id: orderId },
      data: { userId: novoUsuario.id }
    })

    return NextResponse.json({ success: true, jaExistia: false })
  } catch (error) {
    console.error('Erro ao criar conta:', error)
    return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 })
  }
}
