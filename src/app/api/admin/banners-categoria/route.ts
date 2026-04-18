import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function verificarAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')?.value
  return session === process.env.ADMIN_SESSION_TOKEN
}

export async function GET() {
  if (!await verificarAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
  try {
    const banners = await prisma.bannerConfig.findMany()
    const result: Record<string, { imagem: string, link?: string }> = {}
    for (const banner of banners) {
      result[banner.chave] = { 
        imagem: banner.imagem || '',
        link: (banner as any).link || ''
      }
    }
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!await verificarAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
  try {
    const body = await request.json()
    
    // Suporta tanto formato antigo { chave: imagem } quanto novo { banners: {}, links: {} }
    if (body.banners) {
      // Novo formato
      for (const [chave, imagem] of Object.entries(body.banners)) {
        const link = body.links?.[chave] || ''
        const imagemMobile = body.bannersMobile?.[chave] || null
        await (prisma as any).bannerConfig.upsert({
          where: { chave },
          update: { imagem: imagem as string, link, ...(imagemMobile ? { imagemMobile } : {}) },
          create: { chave, imagem: imagem as string, link, imagemMobile }
        })
      }
    } else {
      // Formato antigo (retrocompatível)
      for (const [chave, imagem] of Object.entries(body)) {
        await prisma.bannerConfig.upsert({
          where: { chave },
          update: { imagem: imagem as string },
          create: { chave, imagem: imagem as string }
        })
      }
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
