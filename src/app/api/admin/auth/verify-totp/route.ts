import { NextRequest, NextResponse } from 'next/server'
import { authenticator } from 'otplib'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    // Validar se o código foi enviado
    if (!code || code.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Código inválido' },
        { status: 400 }
      )
    }

    // Verificar se o TOTP está configurado no banco
    const config = await prisma.adminConfig.findUnique({
      where: { key: 'totp_configured' }
    })

    if (config?.value !== 'true') {
      return NextResponse.json(
        { success: false, error: 'TOTP não configurado' },
        { status: 400 }
      )
    }

    // Usar TOTP secret fixo do ambiente
    const totpSecret = process.env.ADMIN_TOTP_SECRET
    const sessionToken = process.env.ADMIN_SESSION_TOKEN

    if (!totpSecret || !sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Configuração TOTP não encontrada' },
        { status: 500 }
      )
    }

    // Verificar código TOTP
    const isValid = authenticator.verify({
      token: code,
      secret: totpSecret
    })

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Código inválido ou expirado' },
        { status: 401 }
      )
    }

    // Se código está correto, criar sessão admin
    const response = NextResponse.json({ success: true })

    // Definir cookie httpOnly seguro
    response.cookies.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Erro na verificação TOTP:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
