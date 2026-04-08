import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isSetupPage = pathname === '/login-usekin/setup'
  const isAdminSubRoute = pathname.startsWith('/login-usekin/') && !isSetupPage

  if (isAdminSubRoute) {
    const session = request.cookies.get('admin-session')?.value
    const validToken = process.env.ADMIN_SESSION_TOKEN

    if (!session || !validToken || session !== validToken) {
      return NextResponse.redirect(new URL('/login-usekin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login-usekin/:path+']
}
