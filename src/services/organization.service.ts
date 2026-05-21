import pool from '@/lib/db';
import { createInsForgeServerClient } from '@/lib/insforge-sdk';
import { TenantContext } from './core/tenant';
import { ServiceResult, createSuccess, createError } from './core/types';

export interface BrandingSettings {
  id: string;
  organization_id: string;
  primary_color: string | null;
  secondary_color: string | null;
  logo_url: string | null;
  updated_at: string;
}

export class OrganizationService {
  private sdk;

  constructor(private context: TenantContext, accessToken?: string) {
    this.sdk = createInsForgeServerClient(accessToken, context.organizationId);
  }

  /**
   * Retrieves branding settings for the current organization.
   */
  async getBrandingSettings(): Promise<ServiceResult<BrandingSettings | null>> {
    console.log(`[OrganizationService.getBrandingSettings] Trace: org=${this.context.organizationId}`);
    
    try {
      // 1. Try SDK
      const { data, error } = await this.sdk.database
        .from('branding_settings')
        .select('*')
        .eq('organization_id', this.context.organizationId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is 'not found' for .single()
        console.warn(`[OrganizationService.getBrandingSettings] SDK Error: ${error.message}. Falling back to SQL.`);
        throw error;
      }

      return createSuccess(data as BrandingSettings || null);
    } catch (err) {
      // 2. Hybrid Fallback
      try {
        const { rows } = await pool.query(
          'SELECT * FROM branding_settings WHERE organization_id = $1 LIMIT 1',
          [this.context.organizationId]
        );
        return createSuccess(rows[0] || null);
      } catch (poolError) {
        console.error('[OrganizationService.getBrandingSettings] Critical Pool Error:', poolError);
        return createError('DATABASE_ERROR', 'Failed to fetch branding settings.');
      }
    }
  }

  /**
   * Updates branding settings for the current organization.
   */
  async updateBrandingSettings(settings: Partial<Omit<BrandingSettings, 'id' | 'organization_id'>>): Promise<ServiceResult<BrandingSettings>> {
    console.log(`[OrganizationService.updateBrandingSettings] Trace: org=${this.context.organizationId}`);
    
    try {
      const entries = Object.entries(settings);
      if (entries.length === 0) {
        const current = await this.getBrandingSettings();
        if (current.data) return createSuccess(current.data);
        return createError('VALIDATION_FAILED', 'No settings provided to update.');
      }

      // 1. Try SDK
      const payload = {
        ...settings,
        organization_id: this.context.organizationId,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await this.sdk.database
        .from('branding_settings')
        .upsert(payload, { onConflict: 'organization_id' })
        .select()
        .single();

      if (error) {
        console.warn(`[OrganizationService.updateBrandingSettings] SDK Error: ${error.message}. Falling back to SQL.`);
        throw error;
      }

      return createSuccess(data as BrandingSettings);
    } catch (err) {
      // 2. Hybrid Fallback
      try {
        const entries = Object.entries(settings);
        const values: unknown[] = [this.context.organizationId];
        let valueIndex = 2;

        const setClauses = entries.map(([key, value]) => {
          values.push(value);
          return `${key} = $${valueIndex++}`;
        });

        const updateQuery = `
          UPDATE branding_settings 
          SET ${setClauses.join(', ')}, updated_at = NOW() 
          WHERE organization_id = $1 
          RETURNING *`;
        
        const { rows } = await pool.query(updateQuery, values);

        if (rows.length === 0) {
          const keys = ['organization_id', ...entries.map(([k]) => k)];
          const insertValues = [this.context.organizationId, ...entries.map(([, v]) => v)];
          const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
          const insertQuery = `INSERT INTO branding_settings (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
          
          const insertResult = await pool.query(insertQuery, insertValues);
          return createSuccess(insertResult.rows[0]);
        }

        return createSuccess(rows[0]);
      } catch (poolError) {
        console.error('[OrganizationService.updateBrandingSettings] Critical Pool Error:', poolError);
        return createError('DATABASE_ERROR', 'Failed to update branding settings.');
      }
    }
  }
}
