import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth/jwt';

// Define route patterns
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/google',
  '/api/auth/google-signin',
  '/api/auth/google/callback',
  '/api/auth/verify-2fa',
];
const freeAccessRoutes = ['/dashboard', '/projects']; // Can view without login, actions require login
const ownerRoutes = ['/admin/owner'];
const adminRoutes = ['/admin'];
const protectedRoutes = ['/settings', '/api/projects', '/api/user']; // Requires authentication for all access

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname === route)) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;

  // Allow free access routes without login (but pass user info if available)
  if (freeAccessRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', payload.userId);
        requestHeaders.set('x-user-email', payload.email);
        requestHeaders.set('x-user-role', payload.role);
        requestHeaders.set('x-user-plan', payload.plan);
        if (payload.accountName) {
          requestHeaders.set('x-user-account', payload.accountName);
        }
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      }
    }
    // No token or invalid token - allow access anyway for free routes
    return NextResponse.next();
  }

  // Redirect to login if no token and accessing protected route
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Verify token
  if (token) {
    const payload = verifyToken(token);

    if (!payload) {
      // Invalid token, clear cookie and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }

    // Check owner-only routes
    if (
      ownerRoutes.some((route) => pathname.startsWith(route)) &&
      payload.role !== 'owner'
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Check admin routes
    if (
      adminRoutes.some((route) => pathname.startsWith(route)) &&
      !['owner', 'admin'].includes(payload.role)
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-email', payload.email);
    requestHeaders.set('x-user-role', payload.role);
    requestHeaders.set('x-user-plan', payload.plan);
    if (payload.accountName) {
      requestHeaders.set('x-user-account', payload.accountName);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
