import { NextRequest, NextResponse } from 'next/server'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Verificar se já está configurado no banco
    const config = await prisma.adminConfig.findUnique({
      where: { key: 'totp_configured' }
    })

    if (config?.value === 'true') {
      return NextResponse.json(
        { success: false, error: 'TOTP já configurado' },
        { status: 400 }
      )
    }

    // Usar TOTP secret fixo do ambiente
    const secret = process.env.ADMIN_TOTP_SECRET
    
    if (!secret) {
      return NextResponse.json(
        { success: false, error: 'TOTP secret não configurado no ambiente' },
        { status: 500 }
      )
    }

    // Gerar URL para QR Code
    const otpauthUrl = authenticator.keyuri(email, 'Use KIN Admin', secret)

    // Gerar QR Code em base64
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl)

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataUrl,
      secret: secret // Enviar secret fixo
    })

  } catch (error) {
    console.error('Erro no setup TOTP:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

