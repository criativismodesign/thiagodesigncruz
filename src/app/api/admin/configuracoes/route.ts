import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

async function verificarAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  return session === process.env.ADMIN_SESSION_TOKEN
}

export async function PUT(request: Request) {
  if (!await verificarAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
  try {
    const body = await request.json()
    
    for (const [chave, valor] of Object.entries(body)) {
      await prisma.configSite.upsert({
        where: { chave },
        update: { valor: valor as string },
        create: { chave, valor: valor as string }
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
