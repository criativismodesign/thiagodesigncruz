import { NextRequest, NextResponse } from 'next/server'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Verificar se já está configurado
    if (process.env.ADMIN_TOTP_SECRET) {
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
      secret,
      qrCode: qrCodeDataUrl
    })

  } catch (error) {
    console.error('Erro no setup TOTP:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
