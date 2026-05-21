import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User, UserRole } from '@/types/auth';
import { PostgresSessionAdapter, AuthAdapter } from './auth/adapters';

/**
 * Centralized Authentication Logic
 * 
 * Realigned to use Custom DB sessions as the primary authentication mechanism.
 */

// Initialize primary adapter
const adapter: AuthAdapter = new PostgresSessionAdapter();

export async function getSession(): Promise<User | null> {
    const cookieStore = await cookies();
    
    // Check for the official portal_session cookie
    const portalToken = cookieStore.get('portal_session')?.value;

    if (portalToken) {
        const user = await adapter.getSession(portalToken);
        if (user) return user;
    }

    return null;
}

/**
 * Ensures the user is authenticated, otherwise redirects to login.
 */
export async function requireAuth(): Promise<User> {
    const user = await getSession();
    
    if (!user) {
        const cookieStore = await cookies();
        cookieStore.delete('portal_session');
        cookieStore.delete('insforge_session'); // Clean up any drift cookies
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
