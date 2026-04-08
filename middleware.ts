import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/login-usekin')
  const isLoginPage = pathname === '/login-usekin'
  const isSetupPage = pathname === '/login-usekin/setup'
  const session = request.cookies.get('admin-session')?.value

  if (isAdminRoute && !isLoginPage && !isSetupPage) {
    if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
      return NextResponse.redirect(new URL('/login-usekin', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/login-usekin/:path*']
}
