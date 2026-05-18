'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import db from '@/lib/db'

// Simple in-memory rate limiter for login attempts
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkLoginRateLimit(identifier: string, limit: number = 5, windowMs: number = 900000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = loginAttempts.get(identifier);
  
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  
  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }
  
  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

// Audit log helper
async function logAuthAudit(
  action: string,
  userId: string | null,
  email: string,
  success: boolean,
  details?: Record<string, unknown>
) {
  try {
    await db.query(
      `INSERT INTO audit_logs (action, target_table, record_id, changes, created_at) 
       VALUES ($1, $2, $3, $4, NOW())`,
      [
        action, 
        'users', 
        userId || 'unknown', 
        JSON.stringify({ 
          email, 
          success, 
          ip: details?.ip || 'unknown',
          userAgent: details?.userAgent || 'unknown',
          timestamp: new Date().toISOString()
        })
      ]
    );
  } catch (error) {
    console.error("[AuthAudit] Failed to log auth event:", error);
  }
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function loginAction(state: unknown, formData: FormData) {
  // Get client identifier for rate limiting
  const clientIp = 'unknown'; // In production, pass this from headers
  const rateLimit = checkLoginRateLimit(clientIp, 5, 900000); // 5 attempts per 15 minutes
  
  if (!rateLimit.allowed) {
    console.warn(`[Login] Rate limit exceeded for IP: ${clientIp}`);
    return { error: 'Too many login attempts. Please try again later.' }
  }

  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  // Validate input
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  if (!isValidEmail(email)) {
    return { error: 'Invalid email format' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  try {
    // Query the user from database
    const { rows } = await db.query(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      [email]
    );

    if (rows.length === 0) {
      // Log failed attempt
      await logAuthAudit('login_failed', null, email, false, { reason: 'user_not_found' });
      return { error: 'Invalid email or password' }
    }

    const user = rows[0];

    // Verify password using PostgreSQL pgcrypto
    // crypt() returns true if password matches the stored hash
    const matchResult = await db.query(
      `SELECT crypt($1, password_hash) = password_hash AS match FROM users WHERE id = $2`,
      [password, user.id]
    );
    const match = matchResult.rows[0]?.match;

    if (!match) {
      // Log failed attempt
      await logAuthAudit('login_failed', user.id, email, false, { reason: 'invalid_password' });
      return { error: 'Invalid email or password. Hint: Use Demo123! for demo accounts.' }
    }

    // Check if user is active
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week

    // Create session in database
    await db.query(
      'INSERT INTO sessions (user_id, session_token, expires_at, created_at) VALUES ($1, $2, $3, NOW())',
      [user.id, sessionToken, expiresAt.toISOString()]
    );

    // Set HTTP-only session cookie
    const cookieStore = await cookies();
    cookieStore.set('portal_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/'
    });

    // Log successful login
    await logAuthAudit('login_success', user.id, email, true);

    // Redirect to dashboard
    redirect('/dashboard')
  } catch (error: unknown) {
    console.error('[Login] Unexpected error:', error);
    
    // Log error
    await logAuthAudit('login_error', null, email, false, { 
      reason: 'server_error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('portal_session')?.value;
    
    if (token) {
      // Delete session from database
      await db.query('DELETE FROM sessions WHERE session_token = $1', [token]).catch(() => {});
      
      // Clear cookie
      cookieStore.delete('portal_session');
    }
  } catch (error) {
    console.error('[Logout] Error during logout:', error);
    // Continue with redirect even if cleanup fails
  }
  
  redirect('/login')
}