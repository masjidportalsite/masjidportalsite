import pool from '@/lib/db';
import { TenantContext } from './core/tenant';
import { ServiceResult, createSuccess, createError } from './core/types';

export interface UserSummary {
  id: string;
  full_name: string | null;
  email: string;
}

export class UserService {
  constructor(private context: TenantContext) {}

  /**
   * Retrieves a list of users belonging to the current organization.
   */
  async getOrganizationUsers(): Promise<ServiceResult<UserSummary[]>> {
    try {
      const { rows } = await pool.query(
        'SELECT id, full_name, email FROM users WHERE organization_id = $1 ORDER BY full_name ASC',
        [this.context.organizationId]
      );
      return createSuccess(rows);
    } catch (error) {
      console.error('[UserService.getOrganizationUsers] Error:', error);
      return createError('DATABASE_ERROR', 'Failed to fetch members list.');
    }
  }
}
