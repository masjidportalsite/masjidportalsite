/**
 * RBAC (Role-Based Access Control) Utilities
 * MasjidPortalSite Security Module
 * 
 * Implements access control based on CLAUDE.md specification:
 * - Admin: Full access to all modules, roles, organization settings, and audit logs
 * - Imam: Manage educational content, khutbah schedules, and classes
 * - Treasurer: Manage donations, receipts, and campaign finances
 * - Member: View portal, register for events, make donations, manage household/dependents
 * 
 * B.L.A.S.T Protocol: TRUST > SECURITY > COMMUNITY VALUE > AUTOMATION > SPEED
 */

export type UserRole = 'admin' | 'imam' | 'treasurer' | 'member';

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  organization_id?: string;
}

// Permission definitions by role
const ROLE_PERMISSIONS: Record<UserRole, Set<string>> = {
  admin: new Set([
    'branding:read', 'branding:write', 'branding:delete',
    'users:read', 'users:write', 'users:delete',
    'donations:read', 'donations:write', 'donations:delete',
    'receipts:read', 'receipts:write', 'receipts:delete',
    'campaigns:read', 'campaigns:write', 'campaigns:delete',
    'events:read', 'events:write', 'events:delete',
    'announcements:read', 'announcements:write', 'announcements:delete',
    'volunteers:read', 'volunteers:write', 'volunteers:delete',
    'classes:read', 'classes:write', 'classes:delete',
    'members:read', 'members:write', 'members:delete',
    'audit_logs:read', 'audit_logs:delete',
    'roles:read', 'roles:write',
    'settings:read', 'settings:write',
    'analytics:read',
  ]),
  imam: new Set([
    'branding:read',
    'classes:read', 'classes:write', 'classes:delete',
    'events:read', 'events:write', 'events:delete',
    'announcements:read', 'announcements:write', 'announcements:delete',
    'members:read',
    'analytics:read',
  ]),
  treasurer: new Set([
    'branding:read',
    'donations:read', 'donations:write',
    'receipts:read', 'receipts:write',
    'campaigns:read', 'campaigns:write', 'campaigns:delete',
    'events:read',
    'members:read',
    'analytics:read',
  ]),
  member: new Set([
    'branding:read',
    'events:read',
    'donations:read', 'donations:write',
    'announcements:read',
    'classes:read',
    'members:read',
  ]),
};

/**
 * Check if a user role has a specific permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.has(permission) : false;
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(role: UserRole, permissions: string[]): boolean {
  return permissions.some(p => hasPermission(role, p));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(role: UserRole, permissions: string[]): boolean {
  return permissions.every(p => hasPermission(role, p));
}

/**
 * Get all permissions for a role
 */
export function getPermissions(role: UserRole): string[] {
  return Array.from(ROLE_PERMISSIONS[role] || []);
}

/**
 * Check if a role has admin-level access
 */
export function isAdmin(role: UserRole): boolean {
  return role === 'admin';
}

/**
 * Check if a role has elevated access (admin or treasurer)
 */
export function isElevated(role: UserRole): boolean {
  return role === 'admin' || role === 'treasurer';
}

/**
 * Validate role string against allowed roles
 */
export function isValidRole(role: string): role is UserRole {
  return ['admin', 'imam', 'treasurer', 'member'].includes(role);
}

/**
 * Authorization guard for API routes
 * Throws an error if the user doesn't have the required permission
 */
export function authorize(
  user: SessionUser | null,
  requiredPermission: string
): asserts user is SessionUser {
  if (!user) {
    throw new AuthorizationError('Authentication required', 401);
  }
  
  if (!hasPermission(user.role, requiredPermission)) {
    throw new AuthorizationError(
      `Access denied: '${user.role}' role does not have '${requiredPermission}' permission`,
      403
    );
  }
}

/**
 * Optional authorization - returns false instead of throwing
 */
export function tryAuthorize(
  user: SessionUser | null,
  requiredPermission: string
): boolean {
  if (!user) return false;
  return hasPermission(user.role, requiredPermission);
}

/**
 * Custom error class for authorization failures
 */
export class AuthorizationError extends Error {
  constructor(
    message: string,
    public statusCode: number = 403
  ) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

/**
 * RBAC middleware helper for Next.js API routes
 * Use this to protect routes with required permissions
 */
export function requirePermission(requiredPermission: string) {
  return function withPermission(
    user: SessionUser | null
  ): asserts user is SessionUser {
    authorize(user, requiredPermission);
  };
}

/**
 * Create a session user from InsForge auth response
 */
export function createSessionUser(
  id: string,
  email: string,
  role: string
): SessionUser | null {
  if (!isValidRole(role)) {
    console.warn(`[RBAC] Invalid role "${role}" provided, defaulting to 'member'`);
    return null;
  }
  
  return { id, email, role };
}