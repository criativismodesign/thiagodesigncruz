import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.redirect(new URL('/login-usekin', process.env.NEXTAUTH_URL || 'https://thiagodesigncruz.com.br'))
  response.cookies.delete('admin-session')
  return response
}
