import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Protected routes that require authentication
  const protectedRoutes = [
    '/admin',
    '/admin/(.*)'
  ];

  // Admin routes that require admin role
  const adminRoutes = ['/admin'];

  const { pathname } = req.nextUrl;

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    const authToken = req.cookies.get('auth-token');
    
    if (!authToken && !pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Additional admin check for admin routes
    if (isAdminRoute) {
      const userRole = req.cookies.get('user-role')?.value;
      
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};