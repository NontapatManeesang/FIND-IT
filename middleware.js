import { updateSession } from '@/utils/supabase/middleware'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  // Update session first
  const response = await updateSession(request)

  // Basic route protection
  const { pathname } = request.nextUrl
  
  // Routes that require authentication
  const protectedRoutes = ['/lost', '/found', '/chat', '/profile']
  
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Check for session cookie (a naive check, but updateSession ensures it's fresh if valid)
    const supabaseCookie = request.cookies.get('sb-ndcdxwzmwzaqmkfnotot-auth-token') || request.cookies.getAll().find(c => c.name.includes('-auth-token'))
    if (!supabaseCookie) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
