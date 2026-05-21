import pool from '@/lib/db';
import { TenantContext } from './core/tenant';
import { ServiceResult, createSuccess, createError } from './core/types';

export interface Donation {
  id: number;
  amount: number;
  currency: string;
  status: string;
  type: string;
  created_at: string;
  donor_name: string | null;
}

export class DonationService {
  constructor(private context: TenantContext) {}

  /**
   * Retrieves a list of recent donations for the current organization.
   */
  async getRecentDonations(limit: number = 50): Promise<ServiceResult<Donation[]>> {
    try {
      // In Phase 1, we add organization_id filter to existing SQL
      const { rows } = await pool.query(`
        SELECT d.id, d.amount, d.currency, d.status, d.type, d.created_at, u.full_name as donor_name 
        FROM donations d 
        LEFT JOIN users u ON d.user_id = u.id 
        WHERE d.organization_id = $1
        ORDER BY d.created_at DESC LIMIT $2
      `, [this.context.organizationId, limit]);

      return createSuccess(rows);
    } catch (error) {
      console.error('[DonationService.getRecentDonations] Error:', error);
      return createError('DATABASE_ERROR', 'Failed to fetch donations from the ledger.');
    }
  }

  /**
   * Records a new donation within the tenant context.
   */
  async recordDonation(data: {
    userId: string;
    amount: number;
    type: string;
    status?: string;
  }): Promise<ServiceResult<Donation>> {
    try {
      const { rows } = await pool.query(
        'INSERT INTO donations (user_id, amount, type, status, organization_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [
          data.userId, 
          data.amount, 
          data.type || 'general', 
          data.status || 'successful',
          this.context.organizationId
        ]
      );

      return createSuccess(rows[0]);
    } catch (error) {
      console.error('[DonationService.recordDonation] Error:', error);
      return createError('DATABASE_ERROR', 'Failed to record donation in the ledger.');
    }
  }

  /**
   * Calculates the total donation volume for the current organization.
   */
  async getTotalDonationVolume(): Promise<ServiceResult<number>> {
    try {
      const { rows } = await pool.query(
        "SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE organization_id = $1 AND status = 'successful'",
        [this.context.organizationId]
      );
      return createSuccess(Number(rows[0].total));
    } catch (error) {
      console.error('[DonationService.getTotalDonationVolume] Error:', error);
      return createError('DATABASE_ERROR', 'Failed to calculate donation volume.');
    }
  }
}
