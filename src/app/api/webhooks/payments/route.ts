import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Simple in-memory rate limiter (resets on server restart)
const webhookCounts = new Map<string, { count: number; resetAt: number }>();

function checkWebhookRateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const entry = webhookCounts.get(identifier);
  
  if (!entry || now > entry.resetAt) {
    webhookCounts.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (entry.count >= limit) {
    return false;
  }
  
  entry.count++;
  return true;
}

// Verify webhook signature from payment providers
async function verifyWebhookSignature(
  payload: string, 
  signature: string | null, 
  provider: string
): Promise<boolean> {
  if (!signature) return false;
  
  try {
    // In production, verify against provider's webhook secret
    // Billplz, ToyyibPay, or CHIP would have their own verification methods
    // For now, we validate the signature format exists
    if (signature.length < 8) return false;
    
    // Provider-specific verification would go here
    return true;
  } catch {
    return false;
  }
}

// Audit log helper for payment events
async function logPaymentAudit(
  action: string,
  donationId: string,
  status: string,
  details: Record<string, unknown>,
  userId?: string
) {
  try {
    await db.query(
      `INSERT INTO audit_logs (action, target_table, record_id, changes, user_id, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [action, 'donations', donationId, JSON.stringify({ status, ...details }), userId || 'webhook']
    );
  } catch (error) {
    console.error("[PaymentAudit] Failed to log payment event:", error);
  }
}

// Validate payment payload structure
function validatePaymentPayload(payload: Record<string, unknown>): { valid: boolean; error?: string } {
  const required = ['donation_id', 'status'];
  
  for (const field of required) {
    if (!(field in payload)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  
  const validStatuses = ['successful', 'failed', 'pending', 'refunded'];
  if (!validStatuses.includes(payload.status as string)) {
    return { valid: false, error: `Invalid status: ${payload.status}` };
  }
  
  return { valid: true };
}

export async function POST(req: Request) {
  const clientIp = req.headers.get("x-forwarded-for") || "unknown";
  
  // Rate limiting for webhook endpoints
  if (!checkWebhookRateLimit(`webhook:${clientIp}`, 60, 60000)) {
    console.warn(`[Webhook] Rate limit exceeded for ${clientIp}`);
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  // Verify content type
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  // Validate payload structure
  const validation = validatePaymentPayload(payload);
  if (!validation.valid) {
    console.warn(`[Webhook] Invalid payload: ${validation.error}`);
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // Verify webhook signature (if provided)
  const signature = req.headers.get("x-webhook-signature") || req.headers.get("x-billplz-signature") || null;
  const provider = payload.provider as string || 'generic';
  
  // In production, enable strict signature verification
  // if (!await verifyWebhookSignature(JSON.stringify(payload), signature, provider)) {
  //   console.warn(`[Webhook] Invalid signature from ${clientIp}`);
  //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  // }

  console.log(`[Webhook:${provider}] Received payment update:`, {
    donation_id: payload.donation_id,
    status: payload.status,
    timestamp: new Date().toISOString()
  });

  const { donation_id, status, receipt_url, provider: _provider, ...extraData } = payload;

  // Handle different payment statuses
  if (status === 'successful') {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      
      // Update donation status
      const updateResult = await client.query(
        'UPDATE donations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        ['successful', donation_id]
      );
      
      if (updateResult.rows.length === 0) {
        console.warn(`[Webhook] Donation not found: ${donation_id}`);
        await client.query('ROLLBACK');
        return NextResponse.json({ error: "Donation not found" }, { status: 404 });
      }
      
      const donation = updateResult.rows[0];
      
      // Generate receipt if receipt_url provided or create one
      const receiptNumber = `RC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const receiptUrl = receipt_url || `https://storage.insforge.app/receipts/${receiptNumber}.pdf`;
      
      await client.query(
        'INSERT INTO receipts (donation_id, receipt_number, receipt_url, created_at) VALUES ($1, $2, $3, NOW())',
        [donation_id, receiptNumber, receiptUrl]
      );
      
      // Log the payment success in audit logs
      await client.query(
        `INSERT INTO audit_logs (action, target_table, record_id, changes, created_at) 
         VALUES ($1, $2, $3, $4, NOW())`,
        [
          'payment_success', 
          'donations', 
          donation_id, 
          JSON.stringify({ 
            status: 'successful', 
            receipt_number: receiptNumber,
            amount: donation.amount,
            currency: donation.currency,
            ...extraData
          })
        ]
      );
      
      await client.query('COMMIT');
      
      console.log(`[Webhook] Payment processed successfully for donation ${donation_id}`);
      
      return NextResponse.json({ 
        received: true, 
        donation_id,
        receipt_number: receiptNumber,
        timestamp: new Date().toISOString()
      });
    } catch (error: unknown) {
      await client.query('ROLLBACK');
      console.error(`[Webhook] Error processing payment for ${donation_id}:`, error);
      
      await logPaymentAudit('payment_error', donation_id, status, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return NextResponse.json({ 
        error: "Failed to process payment",
        code: "PAYMENT_PROCESSING_ERROR"
      }, { status: 500 });
    } finally {
      client.release();
    }
  } else if (status === 'failed') {
    try {
      await db.query(
        'UPDATE donations SET status = $1, updated_at = NOW() WHERE id = $2',
        ['failed', donation_id]
      );
      
      await logPaymentAudit('payment_failed', donation_id, status, extraData);
      
      return NextResponse.json({ 
        received: true, 
        donation_id,
        status: 'recorded',
        timestamp: new Date().toISOString()
      });
    } catch (error: unknown) {
      console.error(`[Webhook] Error updating failed payment:`, error);
      return NextResponse.json({ 
        error: "Failed to record failed payment",
        code: "PAYMENT_RECORDING_ERROR"
      }, { status: 500 });
    }
  } else if (status === 'refunded') {
    try {
      await db.query(
        'UPDATE donations SET status = $1, updated_at = NOW() WHERE id = $2',
        ['refunded', donation_id]
      );
      
      await logPaymentAudit('payment_refunded', donation_id, status, extraData);
      
      return NextResponse.json({ 
        received: true, 
        donation_id,
        status: 'recorded',
        timestamp: new Date().toISOString()
      });
    } catch (error: unknown) {
      console.error(`[Webhook] Error updating refunded payment:`, error);
      return NextResponse.json({ 
        error: "Failed to record refund",
        code: "REFUND_RECORDING_ERROR"
      }, { status: 500 });
    }
  }

  // For pending or other statuses
  return NextResponse.json({ 
    received: true, 
    donation_id,
    status: 'pending_processing',
    timestamp: new Date().toISOString()
  });
}