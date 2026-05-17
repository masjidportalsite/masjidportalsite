import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: Request) {
    // Basic mock webhook for a payment gateway (e.g. Stripe, BillPlz)
    const payload = await req.json();

    console.log('[Webhook] Received payment update:', payload);

    const { donation_id, status, receipt_url } = payload;

    if (status === 'successful') {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('UPDATE donations SET status = $1 WHERE id = $2', ['successful', donation_id]);
            await client.query(
                'INSERT INTO receipts (donation_id, receipt_number, receipt_url) VALUES ($1, $2, $3)',
                [donation_id, `RC-${Date.now()}`, receipt_url]
            );
            await client.query(
                "INSERT INTO audit_logs (action, target_table, record_id, changes) VALUES ($1, $2, $3, $4)",
                ['payment_success', 'donations', donation_id, JSON.stringify({ status: 'successful' })]
            );
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    return NextResponse.json({ received: true });
}
