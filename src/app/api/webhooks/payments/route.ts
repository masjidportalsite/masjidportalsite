import { NextResponse } from 'next/server';
import { BillingService } from '@/services/billing.service';

export async function POST(req: Request) {
    // Basic mock webhook for a payment gateway (e.g. Stripe, BillPlz)
    const payload = await req.json();

    console.log('[Webhook] Received payment update:', payload);

    const { donation_id, status, receipt_url } = payload;

    if (status === 'successful') {
        const billingService = new BillingService();
        const result = await billingService.processSuccessfulPayment(donation_id, receipt_url);
        
        if (result.error) {
            console.error('[Webhook] Failed to process payment:', result.error.message);
            return NextResponse.json({ error: result.error.message }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
