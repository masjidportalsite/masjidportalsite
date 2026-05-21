import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Production-grade Middleware for MasjidPortal
 * 
 * Features:
 * - Route Protection: Ensures /dashboard is only accessible to authenticated users.
 * - Public Route Access: Allows access to login, branding, and landing pages.
 * - Mobile Persistence Support: Relies on the custom portal_session cookie.
 */

// Define paths that are always accessible
const PUBLIC_FILE_EXTENSIONS = ['.svg', '.webp', '.png', '.jpg', '.ico'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // 1. Allow public files and assets early (Mobile Performance Optimization)
    if (
        PUBLIC_FILE_EXTENSIONS.some(ext => pathname.endsWith(ext)) ||
        pathname.startsWith('/_next') || 
        pathname.startsWith('/branding')
    ) {
        return NextResponse.next();
    }

    // 2. Check for official portal session cookie
    const portalToken = request.cookies.get('portal_session')?.value;
    const hasValidToken = portalToken && portalToken.length > 10;

    // 3. Handle Authenticated Users trying to access /login (UX Optimization)
    if (pathname === '/login' && hasValidToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 4. Handle Unauthenticated Users trying to access protected routes
    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/api/dashboard');
    
    if (isProtectedRoute && !hasValidToken) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        
        // Use a 307 redirect to preserve the HTTP method
        return NextResponse.redirect(loginUrl);
    }

    // 5. Allow all other public paths
    const response = NextResponse.next();
    
    // 6. Security Headers (Best practice for production)
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocations=()');
    
    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/webhooks (Allow external webhooks)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/webhooks|_next/static|_next/image|favicon.ico).*)',
    ],
};
