import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('admin-session');

  // Define admin routes that need protection
  const adminRoutes = ['/', '/lawyers', '/analytics', '/settings'];
  const isAdminRoute = adminRoutes.some(route => pathname === route);

  // If trying to access an admin route without a session, redirect to login
  if (isAdminRoute && !session) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If trying to access login while already authenticated, redirect to dashboard
  if (pathname === '/login' && session) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Ensure middleware only runs on relevant paths
export const config = {
  matcher: ['/', '/lawyers', '/analytics', '/settings', '/login'],
};
