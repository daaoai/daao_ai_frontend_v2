import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware to handle subdomain routing
export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';

  // Check for the subdomain
  if (host.startsWith('app.')) {
    // Rewrite the request to a specific route for the subdomain
    return NextResponse.rewrite(new URL('/app', req.url));
  }

  // Default behavior: continue to the original request
  return NextResponse.next();
}

// Specify the paths where the middleware applies
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
