import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { senhaAtual, novaSenha } = await request.json()

  if (!senhaAtual || !novaSenha) return NextResponse.json({ error: 'Campos obrigatórios' }, { status: 400 })
  if (novaSenha.length < 6) return NextResponse.json({ error: 'Nova senha deve ter pelo menos 6 caracteres' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user?.password) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })

  const senhaCorreta = await bcrypt.compare(senhaAtual, user.password)
  if (!senhaCorreta) return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 })

  const novoHash = await bcrypt.hash(novaSenha, 12)
  await prisma.user.update({ where: { email: session.user.email }, data: { password: novoHash } })

  return NextResponse.json({ success: true })
}
