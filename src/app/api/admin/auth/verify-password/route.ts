import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validar se os campos foram enviados
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar credenciais contra variáveis de ambiente
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPasswordHash = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPasswordHash) {
      return NextResponse.json(
        { success: false, error: 'Configuração do administrador não encontrada' },
        { status: 500 }
      )
    }

    // Verificar email
    if (email !== adminEmail) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, adminPasswordHash)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Se chegou aqui, credenciais estão corretas
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro na verificação de senha:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
