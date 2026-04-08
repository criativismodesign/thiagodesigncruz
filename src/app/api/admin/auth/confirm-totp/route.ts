import { NextRequest, NextResponse } from 'next/server'
import { authenticator } from 'otplib'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import path from 'path'

// Arquivo de configuração local para armazenar o TOTP secret
const CONFIG_FILE = path.join(process.cwd(), 'totp-config.json')

export async function POST(request: NextRequest) {
  try {
    const { code, secret } = await request.json()

    // Verificar se já está configurado
    if (process.env.ADMIN_TOTP_CONFIGURED === 'true' || existsSync(CONFIG_FILE)) {
      return NextResponse.json(
        { success: false, error: 'TOTP já configurado' },
        { status: 400 }
      )
    }

    // Verificar se o secret foi fornecido
    if (!secret) {
      return NextResponse.json(
        { success: false, error: 'Secret não fornecido' },
        { status: 400 }
      )
    }

    // Verificar código TOTP
    const isValid = authenticator.verify({
      token: code,
      secret: secret
    })

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Código inválido' },
        { status: 401 }
      )
    }

    // Salvar configuração localmente
    const config = {
      secret: secret,
      configured: true,
      configuredAt: new Date().toISOString()
    }

    writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))

    return NextResponse.json({
      success: true,
      message: 'TOTP configurado com sucesso',
      configured: true
    })

  } catch (error) {
    console.error('Erro ao confirmar setup TOTP:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Verificar se já está configurado
    if (existsSync(CONFIG_FILE)) {
      const config = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'))
      return NextResponse.json({
        configured: config.configured,
        configuredAt: config.configuredAt
      })
    }

    return NextResponse.json({
      configured: false
    })

  } catch (error) {
    console.error('Erro ao verificar configuração TOTP:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
