
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const { pathname } = request.nextUrl

  if (!token) {
    if (pathname.startsWith('/connect')) {
      // Allow access to connect page to accept invite, will be prompted to login/signup
      return NextResponse.next()
    }
    if (pathname !== '/login' && pathname !== '/signup') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } else {
    if (pathname === '/login' || pathname === '/signup') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/(chat)/:path*', '/login', '/signup', '/connect/:path*'],
}
