import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Protected routes that require authentication
  const protectedRoutes = [
    '/account-opening',
    '/queue-management',
    '/banking-services',
    '/admin',
    '/(dashboard)'
  ];

  // Admin routes that require admin role
  const adminRoutes = ['/admin'];

  const { pathname } = req.nextUrl;

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // For now, we'll handle auth checks on the client side
    // In a real app, you'd check Supabase auth here
    
    // Redirect to login if not authenticated
    // This is a simplified check - in production you'd verify the session
    const authToken = req.cookies.get('auth-token');
    
    if (!authToken && !pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Additional admin check for admin routes
    if (isAdminRoute) {
      // In production, verify admin role from session
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