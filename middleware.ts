import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acesso às páginas de login e setup
  if (pathname === '/login-usekin' || pathname === '/login-usekin/setup') {
    return NextResponse.next()
  }

  // Verificar se está tentando acessar rotas protegidas do painel
  if (pathname.startsWith('/login-usekin/')) {
    const sessionToken = request.cookies.get('admin-session')?.value
    const validToken = process.env.ADMIN_SESSION_TOKEN

    // Se não tiver token ou token inválido, redirecionar para login
    if (!sessionToken || sessionToken !== validToken) {
      const loginUrl = new URL('/login-usekin', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/login-usekin/:path*'
}
