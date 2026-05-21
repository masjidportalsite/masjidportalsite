import { User } from '@/types/auth';
import pool from '../db';

/**
 * Common interface for authentication adapters.
 */
export interface AuthAdapter {
    name: string;
    getSession(token: string): Promise<User | null>;
}

/**
 * Primary Adapter: Validates sessions against the custom PostgreSQL sessions table.
 */
export class PostgresSessionAdapter implements AuthAdapter {
    name = 'postgres_session';

    async getSession(token: string): Promise<User | null> {
        try {
            const { rows } = await pool.query(
                `SELECT u.id, u.email, u.role, u.full_name, u.organization_id, u.created_at
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
