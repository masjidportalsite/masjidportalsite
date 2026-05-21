import pool from '@/lib/db';
import { TenantContext } from './core/tenant';
import { ServiceResult, createSuccess, createError } from './core/types';

/**
 * Note: BillingService handles platform-wide financial transactions.
 * Some methods (like webhooks) may operate across tenant boundaries initially
 * but must ensure data integrity via record-level tenant validation.
 */
export class BillingService {
  constructor(private context?: TenantContext) {}

  /**
   * Processes a successful payment and generates a receipt.
   * This is a sensitive operation and uses a database transaction.
   */
  async processSuccessfulPayment(donationId: number, receiptUrl: string): Promise<ServiceResult<{ success: boolean }>> {
    console.log(`[BillingService.processSuccessfulPayment] Trace: donationId=${donationId}`);
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Update donation status
      const donationUpdate = await client.query(
        'UPDATE donations SET status = $1 WHERE id = $2 RETURNING organization_id', 
        ['successful', donationId]
      );

      if (donationUpdate.rows.length === 0) {
        await client.query('ROLLBACK');
        return createError('NOT_FOUND', `Donation ${donationId} not found.`);
      }

      const orgId = donationUpdate.rows[0].organization_id;

      // 2. Create receipt
      await client.query(
        'INSERT INTO receipts (donation_id, receipt_number, receipt_url, organization_id) VALUES ($1, $2, $3, $4)',
        [donationId, `RC-${Date.now()}`, receiptUrl, orgId]
      );

      // 3. Audit log
      await client.query(
        "INSERT INTO audit_logs (action, target_table, record_id, changes, organization_id) VALUES ($1, $2, $3, $4, $5)",
        ['payment_success', 'donations', donationId, JSON.stringify({ status: 'successful' }), orgId]
      );

      await client.query('COMMIT');
      return createSuccess({ success: true });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('[BillingService.processSuccessfulPayment] Error:', error);
      return createError('DATABASE_ERROR', 'Failed to process payment transaction.');
    } finally {
      client.release();
    }
  }
}
