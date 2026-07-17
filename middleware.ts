import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, SESSION_VALUE } from '@/lib/auth'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isLogin = pathname === '/admin/login'
  const authed = req.cookies.get(SESSION_COOKIE)?.value === SESSION_VALUE

  // Non authentifié → redirige vers la connexion
  if (!authed && !isLogin) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  // Déjà authentifié et sur la page de connexion → va au tableau de bord
  if (authed && isLogin) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
