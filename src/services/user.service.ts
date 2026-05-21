import pool from '@/lib/db';
import { createInsForgeServerClient } from '@/lib/insforge-sdk';
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
  private sdk;

  constructor(private context: TenantContext, accessToken?: string) {
    this.sdk = createInsForgeServerClient(accessToken, context.organizationId);
  }

  /**
   * Retrieves a list of users belonging to the current organization.
   */
  async getOrganizationUsers(): Promise<ServiceResult<UserSummary[]>> {
    console.log(`[UserService.getOrganizationUsers] Trace: org=${this.context.organizationId}`);
    
    try {
      // 1. Try SDK
      const { data, error } = await this.sdk.database
        .from('users')
        .select('id, full_name, email, phone_number, role, created_at')
        .eq('organization_id', this.context.organizationId)
        .order('full_name', { ascending: true });

      if (error) {
        console.warn(`[UserService.getOrganizationUsers] SDK Error: ${error.message}. Falling back to SQL.`);
        throw error;
      }

      return createSuccess(data as UserSummary[]);
    } catch (err) {
      // 2. Hybrid Fallback
      try {
        const { rows } = await pool.query(
          'SELECT id, full_name, email, phone_number, role, created_at FROM users WHERE organization_id = $1 ORDER BY full_name ASC',
          [this.context.organizationId]
        );
        return createSuccess(rows);
      } catch (poolError) {
        console.error('[UserService.getOrganizationUsers] Critical Pool Error:', poolError);
        return createError('DATABASE_ERROR', 'Failed to fetch members list.');
      }
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
    console.log(`[UserService.addMember] Trace: org=${this.context.organizationId}, email=${data.email}`);
    
    try {
      // 1. Try SDK
      const payload = {
        full_name: data.fullName,
        email: data.email,
        phone_number: data.phoneNumber || null,
        role: data.role || UserRole.COMMUNITY_MEMBER,
        organization_id: this.context.organizationId
      };

      const { data: newUser, error } = await this.sdk.database
        .from('users')
        .insert(payload)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') throw error; // Specific unique constraint
        console.warn(`[UserService.addMember] SDK Error: ${error.message}. Falling back to SQL.`);
        throw error;
      }

      return createSuccess(newUser as UserSummary);
    } catch (err: unknown) {
      // 2. Hybrid Fallback
      try {
        if (err && typeof err === 'object' && 'code' in err && err.code === '23505') throw err; // Bypass fallback if it's already a validation failure

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
      } catch (error: unknown) {
        console.error('[UserService.addMember] Error:', error);
        if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
          return createError('VALIDATION_FAILED', 'A member with this email already exists.');
        }
        return createError('DATABASE_ERROR', 'Failed to add new member.');
      }
    }
  }
}
