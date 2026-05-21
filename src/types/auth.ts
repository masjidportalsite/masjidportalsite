/**
 * Shared Authentication and Authorization Types
 * 
 * Synchronized with InsForge PostgreSQL enum 'user_role'
 */

export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    MOSQUE_ADMIN = 'mosque_admin',
    IMAM = 'imam',
    TREASURER = 'treasurer',
    COMMUNITY_MEMBER = 'community_member'
}

export interface User {
    id: string;
    email: string;
    full_name: string | null;
    role: UserRole;
    organization_id: string;
    created_at?: string;
    updated_at?: string;
}

export interface Session {
    id: string;
    user_id: string;
    session_token: string;
    expires: string;
    created_at: string;
}

/**
 * Mapping for display labels in the UI
 */
export const RoleLabels: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'Super Admin',
    [UserRole.MOSQUE_ADMIN]: 'Mosque Administrator',
    [UserRole.IMAM]: 'Imam / Spiritual Leader',
    [UserRole.TREASURER]: 'Treasurer',
    [UserRole.COMMUNITY_MEMBER]: 'Community Member'
};
