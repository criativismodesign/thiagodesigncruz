import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPasswordHash = process.env.ADMIN_PASSWORD
    const sessionToken = process.env.ADMIN_SESSION_TOKEN

    console.log('Variáveis de ambiente:', {
      adminEmail: !!adminEmail,
      adminPasswordHash: !!adminPasswordHash,
      sessionToken: !!sessionToken
    })

    if (!adminEmail || !adminPasswordHash || !sessionToken) {
      console.error('Variáveis faltando:', {
        adminEmail: adminEmail ? 'OK' : 'MISSING',
        adminPasswordHash: adminPasswordHash ? 'OK' : 'MISSING',
        sessionToken: sessionToken ? 'OK' : 'MISSING'
      })
      return NextResponse.json({ success: false, error: 'Configuração inválida' })
    }

    const emailMatch = email === adminEmail
    const passwordMatch = await bcrypt.compare(password, adminPasswordHash)

    if (!emailMatch || !passwordMatch) {
      return NextResponse.json({ success: false, error: 'Credenciais inválidas' })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
  console.error('Erro no login:', error)
  console.error('Erro detalhado:', JSON.stringify(error))
  return NextResponse.json({ success: false, error: String(error) })
  }
}
