import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// LAUNCH DATE: May 30, 2026 at 3:00 PM IST (09:30 UTC)
const LAUNCH_DATE = new Date('2026-05-30T09:30:00.000Z');

export function middleware(request: NextRequest) {
  const now = new Date();
  const isLaunched = true;
  const { pathname } = request.nextUrl;

  // Always allow Next.js internal assets, API routes, and public files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Logic if the app has ALREADY launched
  if (isLaunched) {
    // Once launched, the root URL (/) should serve the Landing Page natively
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/preview', request.url));
    }
    return NextResponse.next();
  }

  // Logic if the app is NOT YET launched
  if (!isLaunched) {
<<<<<<< HEAD
    // Allow the Launch page (root) and the Preview Landing Page
    if (pathname !== '/' && pathname !== '/preview') {
=======
    // Allow the Launch page (root), Preview Landing Page, and Student Community Page
    if (pathname !== '/' && pathname !== '/preview' && pathname !== '/student-community') {
>>>>>>> 6556f79a (Fix course progress calculation bug by accurately tracking fully completed units instead of topics.)
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }
}

// Match all routes so we can strictly enforce the lock
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
