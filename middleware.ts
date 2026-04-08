import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acesso direto às páginas de login e setup
  const isLoginPage = pathname === '/login-usekin'
  const isSetupPage = pathname === '/login-usekin/setup'
  
  // Se for uma rota admin (começa com /login-usekin/) mas não é login ou setup
  const isAdminRoute = pathname.startsWith('/login-usekin/') && !isLoginPage && !isSetupPage

  if (isAdminRoute) {
    const session = request.cookies.get('admin-session')?.value
    const validToken = process.env.ADMIN_SESSION_TOKEN

    // Se não tiver sessão ou token inválido, redirecionar para login
    if (!session || !validToken || session !== validToken) {
      return NextResponse.redirect(new URL('/login-usekin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login-usekin/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}
