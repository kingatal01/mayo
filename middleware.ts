import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/auth'

// Garde légère (edge) : bloque l'accès à /admin sans cookie de session.
// La validation réelle (session en BD + compte actif + rôle) est faite dans
// le layout admin via getCurrentUser().
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/admin/login') return NextResponse.next()

  const hasCookie = Boolean(req.cookies.get(SESSION_COOKIE)?.value)
  if (!hasCookie) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
