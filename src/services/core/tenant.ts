import { User } from '@/types/auth';

/**
 * Tenant Context utility.
 * Ensures that organization isolation is handled consistently.
 */

export interface TenantContext {
  organizationId: string;
  userId: string;
}

/**
 * Helper to extract tenant context from a User session.
 * In a future phase, this will also include permissions.
 */
export function getTenantContext(user: User): TenantContext {
  return {
    organizationId: user.organization_id || 'default_org',
    userId: user.id
  };
}

/**
 * Validates if the given ID matches the current tenant.
 */
export function validateTenant(id: string, context: TenantContext): boolean {
  return id === context.organizationId;
}
