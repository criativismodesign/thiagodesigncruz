import { NextRequest, NextResponse } from 'next/server'
import { authenticator } from 'otplib'
import { existsSync, readFileSync } from 'fs'
import path from 'path'

// Arquivo de configuração local para armazenar o TOTP secret
const CONFIG_FILE = path.join(process.cwd(), 'totp-config.json')

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

    // Verificar se o TOTP está configurado
    if (!existsSync(CONFIG_FILE)) {
      return NextResponse.json(
        { success: false, error: 'TOTP não configurado' },
        { status: 400 }
      )
    }

    // Ler configuração local
    const config = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'))
    const totpSecret = config.secret
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
  }
}
