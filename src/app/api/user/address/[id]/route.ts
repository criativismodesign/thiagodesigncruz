import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
  const { id } = await params
  const body = await request.json()
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })

  if (body.isDefault) {
    await prisma.address.updateMany({
      where: { userId: user!.id },
      data: { isDefault: false }
    })
  }

  const address = await prisma.address.update({
    where: { id },
    data: {
      label: body.label,
      street: body.street,
      number: body.number,
      complement: body.complement || null,
      neighborhood: body.neighborhood,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode.replace(/\D/g, ''),
      isDefault: body.isDefault || false,
    }
  })
  return NextResponse.json(address)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
  const { id } = await params
  await prisma.address.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
