import { NextRequest, NextResponse } from 'next/server';
import { verifySession, COOKIE_NAME } from '@/lib/session';

const ROLE_HOME: Record<string, string> = {
  admin: '/admin',
  linecook: '/dashboard',
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookieValue = req.cookies.get(COOKIE_NAME)?.value ?? null;
  const role = cookieValue ? await verifySession(cookieValue) : null;

  // /login — if already authenticated, bounce to role home
  if (pathname === '/login') {
    if (role) {
      return NextResponse.redirect(new URL(ROLE_HOME[role], req.url));
    }
    return NextResponse.next();
  }

  // /admin/* — requires admin role
  if (pathname.startsWith('/admin')) {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  // everything else — requires any valid session
  if (!role) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  // Run on all routes except _next static, favicon, and all /api/* routes
  matcher: ['/((?!_next|favicon\\.ico|api).*)'],
};
