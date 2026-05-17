import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('portal_session')?.value;
    const { pathname } = request.nextUrl;

    const publicRoutes = ['/login'];
    // Let Next.js and static files pass
    if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')) return NextResponse.next();

    if (!token && !publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && pathname === '/login') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
