import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

interface SessionClaimsMetadata {
  metadata?: {
    role?: string;
  };
}

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();
  const claims = session.sessionClaims as SessionClaimsMetadata | null;
  
  if (isAdminRoute(req) && claims?.metadata?.role !== 'admin') {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }
  if (req.nextUrl.pathname.startsWith('/api/upload/lecture')) {
    return; // Allow the request
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}