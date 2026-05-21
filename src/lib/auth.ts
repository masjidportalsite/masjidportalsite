import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User, UserRole } from '@/types/auth';
import { InsForgeJwtAdapter, PostgresSessionAdapter, AuthAdapter } from './auth/adapters';

/**
 * Centralized Authentication Logic
 * 
 * Uses an Adapter architecture to support gradual migration from 
 * custom DB sessions to InsForge JWTs.
 */

// Initialize adapters in order of priority
const adapters: AuthAdapter[] = [
    new InsForgeJwtAdapter(),
    new PostgresSessionAdapter()
];

export async function getSession(): Promise<User | null> {
    const cookieStore = await cookies();
    
    // Check for tokens in order of migration priority
    // 1. Check for modern InsForge session first
    const insforgeToken = cookieStore.get('insforge_session')?.value;
    const portalToken = cookieStore.get('portal_session')?.value;

    if (insforgeToken) {
        const user = await adapters[0].getSession(insforgeToken);
        if (user) return user;
    }

    // 2. Fallback to legacy portal session
    if (portalToken) {
        const user = await adapters[1].getSession(portalToken);
        if (user) return user;
    }

    return null;
}

/**
 * Ensures the user is authenticated, otherwise redirects to login.
 * Clears cookies on failure to prevent middleware loops.
 */
export async function requireAuth(): Promise<User> {
    const user = await getSession();
    
    if (!user) {
        const cookieStore = await cookies();
        cookieStore.delete('portal_session');
        cookieStore.delete('insforge_session');
        redirect('/login');
    }
    
    return user;
}

/**
 * Validates if the user has a specific role.
 */
export function hasRole(user: User, roles: UserRole[]): boolean {
    if (!user.role) return false;
    return roles.includes(user.role);
}
