import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPasswordHash = process.env.ADMIN_PASSWORD
    const sessionToken = process.env.ADMIN_SESSION_TOKEN

    if (!adminEmail || !adminPasswordHash || !sessionToken) {
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
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ success: false, error: 'Erro interno' })
  }
}
