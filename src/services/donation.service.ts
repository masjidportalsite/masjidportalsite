import pool from '@/lib/db';
import { createInsForgeServerClient } from '@/lib/insforge-sdk';
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
  private sdk;

  constructor(private context: TenantContext, accessToken?: string) {
    this.sdk = createInsForgeServerClient(accessToken, context.organizationId);
  }

  /**
   * Retrieves a list of recent donations for the current organization.
   */
  async getRecentDonations(limit: number = 50): Promise<ServiceResult<Donation[]>> {
    console.log(`[DonationService.getRecentDonations] Trace: org=${this.context.organizationId}`);
    
    try {
      // 1. Try SDK (using PostgREST join syntax)
      const { data, error } = await this.sdk.database
        .from('donations')
        .select('id, amount, currency, status, type, created_at, users!inner(full_name)')
        .eq('organization_id', this.context.organizationId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn(`[DonationService.getRecentDonations] SDK Error: ${error.message}. Falling back to SQL.`);
        throw error;
      }

      // Map SDK join response to Donation interface
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const donations = (data || []).map((d: any) => ({
        ...d,
        donor_name: Array.isArray(d.users) ? d.users[0]?.full_name : d.users?.full_name || null
      }));

      return createSuccess(donations as Donation[]);
    } catch (err) {
      // 2. Hybrid Fallback
      try {
        const { rows } = await pool.query(`
          SELECT d.id, d.amount, d.currency, d.status, d.type, d.created_at, u.full_name as donor_name 
          FROM donations d 
          LEFT JOIN users u ON d.user_id = u.id 
          WHERE d.organization_id = $1
          ORDER BY d.created_at DESC LIMIT $2
        `, [this.context.organizationId, limit]);

        return createSuccess(rows);
      } catch (poolError) {
        console.error('[DonationService.getRecentDonations] Critical Pool Error:', poolError);
        return createError('DATABASE_ERROR', 'Failed to fetch donations from the ledger.');
      }
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
    console.log(`[DonationService.recordDonation] Trace: org=${this.context.organizationId}, user=${data.userId}`);
    
    try {
      // 1. Try SDK
      const payload = {
        user_id: data.userId,
        amount: data.amount,
        type: data.type || 'general',
        status: data.status || 'successful',
        organization_id: this.context.organizationId
      };

      const { data: newDonation, error } = await this.sdk.database
        .from('donations')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.warn(`[DonationService.recordDonation] SDK Error: ${error.message}. Falling back to SQL.`);
        throw error;
      }

      return createSuccess(newDonation as Donation);
    } catch (err) {
      // 2. Hybrid Fallback
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
      } catch (poolError) {
        console.error('[DonationService.recordDonation] Critical Pool Error:', poolError);
        return createError('DATABASE_ERROR', 'Failed to record donation in the ledger.');
      }
    }
  }

  /**
   * Calculates the total donation volume for the current organization.
   */
  async getTotalDonationVolume(): Promise<ServiceResult<number>> {
    console.log(`[DonationService.getTotalDonationVolume] Trace: org=${this.context.organizationId}`);
    
    try {
      // 1. Try SDK
      const { data, error } = await this.sdk.database
        .from('donations')
        .select('amount')
        .eq('organization_id', this.context.organizationId)
        .eq('status', 'successful');

      if (error) {
        console.warn(`[DonationService.getTotalDonationVolume] SDK Error: ${error.message}. Falling back to SQL.`);
        throw error;
      }

      const total = (data || []).reduce((sum: number, d: { amount: number }) => sum + Number(d.amount), 0);
      return createSuccess(total);
    } catch (err) {
      // 2. Hybrid Fallback
      try {
        const { rows } = await pool.query(
          "SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE organization_id = $1 AND status = 'successful'",
          [this.context.organizationId]
        );
        return createSuccess(Number(rows[0].total));
      } catch (poolError) {
        console.error('[DonationService.getTotalDonationVolume] Critical Pool Error:', poolError);
        return createError('DATABASE_ERROR', 'Failed to calculate donation volume.');
      }
    }
  }
}
