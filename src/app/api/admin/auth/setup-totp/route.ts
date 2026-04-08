import { NextRequest, NextResponse } from 'next/server'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { existsSync, readFileSync } from 'fs'
import path from 'path'

// Arquivo de configuração local para armazenar o TOTP secret
const CONFIG_FILE = path.join(process.cwd(), 'totp-config.json')

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Verificar se já está configurado (arquivo local)
    if (existsSync(CONFIG_FILE)) {
      return NextResponse.json(
        { success: false, error: 'TOTP já configurado' },
        { status: 400 }
      )
    }

    // Gerar secret TOTP
    const secret = authenticator.generateSecret()

    // Gerar URL para QR Code
    const otpauthUrl = authenticator.keyuri(email, 'Use KIN Admin', secret)

    // Gerar QR Code em base64
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl)

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataUrl,
      secret: secret // Enviar secret apenas para este setup específico
    })

  } catch (error) {
    console.error('Erro no setup TOTP:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

