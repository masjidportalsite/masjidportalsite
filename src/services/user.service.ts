import pool from '@/lib/db';
import { TenantContext } from './core/tenant';
import { ServiceResult, createSuccess, createError } from './core/types';
import { UserRole } from '@/types/auth';

export interface UserSummary {
  id: string;
  full_name: string | null;
  email: string;
  phone_number: string | null;
  role: UserRole;
  created_at: string;
}

export class UserService {
  constructor(private context: TenantContext) {}

  /**
   * Retrieves a list of users belonging to the current organization.
   */
  async getOrganizationUsers(): Promise<ServiceResult<UserSummary[]>> {
    try {
      const { rows } = await pool.query(
        'SELECT id, full_name, email, phone_number, role, created_at FROM users WHERE organization_id = $1 ORDER BY full_name ASC',
        [this.context.organizationId]
      );
      return createSuccess(rows);
    } catch (error) {
      console.error('[UserService.getOrganizationUsers] Error:', error);
      return createError('DATABASE_ERROR', 'Failed to fetch members list.');
    }
  }

  /**
   * Adds a new member to the current organization.
   */
  async addMember(data: {
    fullName: string;
    email: string;
    phoneNumber?: string;
    role?: UserRole;
  }): Promise<ServiceResult<UserSummary>> {
    try {
      const { rows } = await pool.query(
        `INSERT INTO users (full_name, email, phone_number, role, organization_id) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, full_name, email, phone_number, role, created_at`,
        [
          data.fullName,
          data.email,
          data.phoneNumber || null,
          data.role || UserRole.COMMUNITY_MEMBER,
          this.context.organizationId
        ]
      );
      return createSuccess(rows[0]);
    } catch (error) {
      console.error('[UserService.addMember] Error:', error);
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') { // Unique constraint violation
        return createError('VALIDATION_FAILED', 'A member with this email already exists.');
      }
      return createError('DATABASE_ERROR', 'Failed to add new member.');
    }
  }
}
