import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This middleware protects routes that should only be accessible to authenticated users
export async function middleware(request: NextRequest) {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Paths that are public (no auth required)
  const isPublicPath = path === '/';

  // If the user is not authenticated and tries to access a protected route
  if (!session && !isPublicPath) {
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }

  // If the user is authenticated and tries to access the login page
  if (session && isPublicPath) {
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Add the paths that should be checked by the middleware
export const config = {
  matcher: ['/', '/dashboard', '/companies'],
};