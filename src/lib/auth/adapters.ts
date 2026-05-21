import { User, UserRole } from '@/types/auth';
import pool from '../db';
import { createInsForgeServerClient } from '../insforge-sdk';

/**
 * Common interface for authentication adapters.
 * Allows for seamless switching or dual-running of different auth strategies.
 */
export interface AuthAdapter {
    name: string;
    getSession(token: string): Promise<User | null>;
}

/**
 * Legacy Adapter: Validates sessions against the custom PostgreSQL sessions table.
 */
export class PostgresSessionAdapter implements AuthAdapter {
    name = 'postgres_session';

    async getSession(token: string): Promise<User | null> {
        try {
            const { rows } = await pool.query(
                `SELECT u.id, u.email, u.role, u.full_name, u.created_at
                 FROM sessions s 
                 JOIN users u ON s.user_id = u.id 
                 WHERE s.session_token = $1 
                 AND s.expires > NOW()`,
                [token]
            );

            return rows.length > 0 ? (rows[0] as User) : null;
        } catch (error) {
            console.error(`[${this.name}] Validation failed:`, error);
            return null;
        }
    }
}

/**
 * Future Adapter: Validates sessions using InsForge JWTs.
 * Uses the official InsForge SDK.
 */
export class InsForgeJwtAdapter implements AuthAdapter {
    name = 'insforge_jwt';

    async getSession(token: string): Promise<User | null> {
        try {
            const client = createInsForgeServerClient(token);
            const { data, error } = await client.auth.getCurrentUser();
            
            if (error || !data?.user) return null;
            
            // Map SDK user to our app's User type
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sdkUser = data.user as any;
            return {
                id: data.user.id,
                email: data.user.email,
                full_name: data.user.profile?.name || null,
                role: (sdkUser.role as UserRole) || UserRole.COMMUNITY_MEMBER,
                created_at: data.user.createdAt
            } as User;
        } catch (error) {
            console.error(`[${this.name}] Validation failed:`, error);
            return null;
        }
    }
}
