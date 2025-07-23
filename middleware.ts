import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login', '/signup', '/forgot-password'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;

  // 🔒 Redirect logged-in users *away from* public routes to /admin
  if (publicRoutes.includes(path) && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // 🛡️ Protect private routes — if not logged in, redirect to login
  // const isPrivateRoute = path.startsWith('/admin') || path.startsWith('/dashboard');
  // if (isPrivateRoute && !token) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // ✅ Allow access otherwise
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/signup', '/forgot-password', '/admin/:path*', '/dashboard/:path*'],
};
