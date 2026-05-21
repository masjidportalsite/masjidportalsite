import pool from '@/lib/db';
import { TenantContext } from './core/tenant';
import { ServiceResult, createSuccess, createError } from './core/types';

export interface PrayerSettings {
  prayer_location: string;
  prayer_method: string;
  jumuah_time: string;
  [key: string]: string;
}

export class PrayerService {
  constructor(private context: TenantContext) {}

  /**
   * Retrieves prayer-related settings for the current organization.
   */
  async getPrayerSettings(): Promise<ServiceResult<PrayerSettings>> {
    console.log(`[PrayerService.getPrayerSettings] Trace: org=${this.context.organizationId}`);
    
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
    } catch (error) {
      console.error('[PrayerService.getPrayerSettings] Critical Pool Error:', error);
      return createError('DATABASE_ERROR', 'Failed to fetch prayer settings.');
    }
  }

  /**
   * Updates a specific prayer setting.
   */
  async updatePrayerSetting(key: string, value: string): Promise<ServiceResult<boolean>> {
    console.log(`[PrayerService.updatePrayerSetting] Trace: org=${this.context.organizationId}, key=${key}`);
    
    try {
      await pool.query(
        `INSERT INTO settings (organization_id, key, value) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (organization_id, key) DO UPDATE SET value = $3`,
        [this.context.organizationId, key, value]
      );
      return createSuccess(true);
    } catch (error) {
      console.error('[PrayerService.updatePrayerSetting] Critical Pool Error:', error);
      return createError('DATABASE_ERROR', `Failed to update setting: ${key}`);
    }
  }
}
