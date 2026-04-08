import { NextRequest, NextResponse } from 'next/server'
import { authenticator } from 'otplib'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

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

    // Salvar status configurado no banco
    await prisma.adminConfig.upsert({
      where: { key: 'totp_configured' },
      update: { value: 'true' },
      create: { key: 'totp_configured', value: 'true' }
    })

    return NextResponse.json({
      success: true,
      message: 'TOTP configurado com sucesso!',
      configured: true
    })

  } catch (error) {
    console.error('Erro ao confirmar setup TOTP:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  try {
    // Verificar se já está configurado no banco
    const config = await prisma.adminConfig.findUnique({
      where: { key: 'totp_configured' }
    })
    
    const isConfigured = config?.value === 'true'
    
    return NextResponse.json({
      configured: isConfigured
    })

  } catch (error) {
    console.error('Erro ao verificar configuração TOTP:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
