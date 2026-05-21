import pool from '@/lib/db';
import { createInsForgeServerClient } from '@/lib/insforge-sdk';
import { TenantContext } from './core/tenant';
import { ServiceResult, createSuccess, createError } from './core/types';

export interface PrayerSettings {
  prayer_location: string;
  prayer_method: string;
  jumuah_time: string;
  [key: string]: string;
}

export class PrayerService {
  private sdk;

  constructor(private context: TenantContext, accessToken?: string) {
    this.sdk = createInsForgeServerClient(accessToken, context.organizationId);
  }

  /**
   * Retrieves prayer-related settings for the current organization.
   */
  async getPrayerSettings(): Promise<ServiceResult<PrayerSettings>> {
    console.log(`[PrayerService.getPrayerSettings] Trace: org=${this.context.organizationId}`);
    
    try {
      // 1. Try SDK (Preparation for RLS)
      const { data, error } = await this.sdk.database
        .from('settings')
        .select('key, value')
        .eq('organization_id', this.context.organizationId)
        .like('key', 'prayer_%')
        .limit(50);

      if (error) {
        console.warn(`[PrayerService.getPrayerSettings] SDK Error: ${error.message}. Falling back to SQL.`);
        throw error;
      }

      const settings = (data || []).reduce((acc: Record<string, string>, row: { key: string; value: string }) => {
        acc[row.key] = row.value;
        return acc;
      }, {});

      return createSuccess(settings as unknown as PrayerSettings);
    } catch (err) {
      // 2. Hybrid Fallback to raw SQL
      try {
        const { rows } = await pool.query(
          "SELECT key, value FROM settings WHERE organization_id = $1 AND key LIKE 'prayer_%' LIMIT 50",
          [this.context.organizationId]
        );

        const settings = rows.reduce((acc: Record<string, string>, row: { key: string; value: string }) => {
          acc[row.key] = row.value;
          return acc;
        }, {});

        return createSuccess(settings as unknown as PrayerSettings);
      } catch (poolError) {
        console.error('[PrayerService.getPrayerSettings] Critical Pool Error:', poolError);
        return createError('DATABASE_ERROR', 'Failed to fetch prayer settings.');
      }
    }
  }

  /**
   * Updates a specific prayer setting.
   */
  async updatePrayerSetting(key: string, value: string): Promise<ServiceResult<boolean>> {
    console.log(`[PrayerService.updatePrayerSetting] Trace: org=${this.context.organizationId}, key=${key}`);
    
    try {
      // 1. Try SDK
      const { error } = await this.sdk.database
        .from('settings')
        .upsert({ organization_id: this.context.organizationId, key, value }, { onConflict: 'organization_id, key' });

      if (error) {
        console.warn(`[PrayerService.updatePrayerSetting] SDK Error: ${error.message}. Falling back to SQL.`);
        throw error;
      }
      return createSuccess(true);
    } catch (err) {
      // 2. Hybrid Fallback to raw SQL
      try {
        await pool.query(
          `INSERT INTO settings (organization_id, key, value) 
           VALUES ($1, $2, $3) 
           ON CONFLICT (organization_id, key) DO UPDATE SET value = $3`,
          [this.context.organizationId, key, value]
        );
        return createSuccess(true);
      } catch (poolError) {
        console.error('[PrayerService.updatePrayerSetting] Critical Pool Error:', poolError);
        return createError('DATABASE_ERROR', `Failed to update setting: ${key}`);
      }
    }
  }
}
