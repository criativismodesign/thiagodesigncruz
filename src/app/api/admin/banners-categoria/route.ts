import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function verificarAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  return session === process.env.ADMIN_SESSION_TOKEN
}

export async function PUT(request: Request) {
  if (!await verificarAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
  try {
    const body = await request.json()
    for (const [chave, imagem] of Object.entries(body)) {
      await prisma.bannerConfig.upsert({
        where: { chave },
        update: { imagem: imagem as string },
        create: { chave, imagem: imagem as string }
      })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
