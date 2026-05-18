# MasjidPortalSite Security Audit Report

**Date:** 2024
**Auditor:** Security Agent
**Status:** Initial Vulnerability Assessment Complete

---

## Executive Summary

This security audit identifies **5 Critical**, **3 High**, **4 Medium**, and **2 Low** severity vulnerabilities across the MasjidPortalSite codebase. The most critical issues involve exposed database credentials, missing payment webhook signature verification, and incomplete RBAC implementation.

**Priority Fix Order:** TRUST > SECURITY > COMMUNITY VALUE > AUTOMATION > SPEED (B.L.A.S.T Protocol)

---

## Critical Severity Findings

### 🔴 CR-1: Hardcoded Database Credentials Exposed in Source Code

**File:** `src/lib/db.ts` (Line 3)

**Issue:**
```typescript
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:146523c620222f20b6d056d448f4d900@4bpch3kt.ap-southeast.database.insforge.app:5432/insforge?sslmode=require';
```

**Risk:** Database credentials (username `postgres`, password `146523c620222f20b6d056d448f4d900`) are hardcoded and committed to the repository. Anyone with repo access can connect to the production database.

**Recommendation:**
1. Remove the fallback default value entirely
2. Ensure `DATABASE_URL` environment variable is set in all environments
3. Rotate the exposed credentials immediately
4. Add `db.ts` to `.gitignore` if it's environment-specific

**Priority:** IMMEDIATE - Rotate credentials and fix code.

---

### 🔴 CR-2: Payment Webhook Missing Signature Verification

**File:** `src/app/api/webhooks/payments/route.ts`

**Issue:** The webhook endpoint accepts payment updates without verifying the origin or authenticity of the request.

```typescript
export async function POST(req: Request) {
    const payload = await req.json();
    // No signature verification!
```

**Risk:** Anyone can send fake payment success notifications, enabling:
- False donation receipts
- Financial fraud
- Database manipulation

**Recommendation:**
1. Implement HMAC signature verification (e.g., Stripe's `stripe-signature` header)
2. Verify webhook source IP allowlist if available
3. Add timestamp validation to prevent replay attacks
4. Validate that the donation_id exists before processing

**Priority:** IMMEDIATE - Implement signature verification before production.

---

### 🔴 CR-3: InsForge SDK is Mock Implementation

**File:** `src/lib/insforge-sdk.ts`

**Issue:** The entire SDK is a mock that:
- Returns hardcoded `mock-jwt-token`
- Returns mock user with `role: 'admin'`
- Database operations do nothing (`select: () => Promise.resolve({ data: [], error: null })`)

**Risk:** Authentication is completely non-functional. Any "authentication" is theater - all users are treated as admin.

**Recommendation:**
1. Install `@insforge/sdk` package
2. Replace mock implementation with real SDK using `createClient()`
3. Configure proper authentication (signIn, signOut, getUser)
4. Remove mock tokens and hardcoded admin role

**Priority:** IMMEDIATE - Implement real authentication before any production use.

---

### 🔴 CR-4: No RBAC (Role-Based Access Control) Implementation

**Files:** `src/app/api/branding/route.ts`, `src/app/dashboard/actions.ts`, `src/app/login/actions.ts`

**Issue:** CLAUDE.md specifies 4 roles (Admin, Imam, Treasurer, Member), but:
- No role checks exist in API routes
- No middleware verifies user permissions
- No row-level security is implemented
- All authenticated users have full access

**Example Missing Check (branding/route.ts):**
```typescript
// No authentication check at all - anyone can read/write branding
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");
```

**Recommendation:**
1. Create RBAC middleware/decorator
2. Verify user role on every API call
3. Implement row-level security based on organization membership
4. Add role checks to dashboard actions

**Priority:** HIGH - RBAC is required per CLAUDE.md spec.

---

### 🔴 CR-5: SQL Injection Vulnerability in Branding API

**File:** `src/app/api/branding/route.ts` (Lines 41-44)

**Issue:** Dynamic column names from user input are used directly in SQL:

```typescript
const setClauses = Object.keys(settings).map(key => {
    values.push(settings[key]);
    return `${key} = $${valueIndex++}`;  // Column name is dynamic!
});
```

While parameterized queries are used for values, the column names (`Object.keys(settings)`) are not validated against an allowlist.

**Recommendation:**
1. Validate column names against a strict allowlist
2. Use an enum or set of permitted branding settings fields
3. Never interpolate user input directly into SQL

**Priority:** HIGH - Fix to prevent SQL injection attacks.

---

## High Severity Findings

### 🟠 HIGH-1: No Rate Limiting on Authentication Endpoints

**File:** `src/app/login/actions.ts`

**Issue:** Login endpoint has no rate limiting, allowing unlimited password guessing.

**Recommendation:**
1. Implement rate limiting middleware (e.g., `upstash/ratelimit`)
2. Add account lockout after failed attempts
3. Log failed login attempts for monitoring

---

### 🟠 HIGH-2: Session Token Not Exposed via InsForge SDK

**File:** `src/app/login/actions.ts` (Lines 33-39)

**Issue:** Custom session management creates security concerns:
- Manual session tokens stored in database
- No JWT validation
- Session doesn't use InsForge's built-in session management

```typescript
const sessionToken = crypto.randomUUID()
await pool.query(
    'INSERT INTO sessions (user_id, session_token, expires) VALUES ($1, $2, $3)',
    [user.id, sessionToken, expires]
)
```

**Recommendation:**
1. Use InsForge's built-in session management
2. Leverage SDK's `getUser()` for authentication state
3. Remove custom session table if redundant

---

### 🟠 HIGH-3: No Input Validation on Login Form

**File:** `src/app/login/actions.ts` (Lines 7-13)

**Issue:** Minimal validation - only checks if fields exist:

```typescript
if (!email || !password) {
    return { error: 'Email and password are required' }
}
```

**Missing:**
- Email format validation
- Password complexity requirements
- SQL injection sanitization

**Recommendation:**
1. Add email format regex validation
2. Sanitize inputs before database queries
3. Implement password strength requirements

---

## Medium Severity Findings

### 🟡 MED-1: No Audit Logging for Sensitive Operations

**Files:** All API routes

**Issue:** Only webhook processing logs to `audit_logs`. Other sensitive operations (branding changes, user data access) have no audit trail.

**Recommendation:**
1. Add audit logging to all admin actions per CLAUDE.md
2. Include user_id, action, target, changes, timestamp
3. Create audit dashboard for admins

---

### 🟡 MED-2: Cookie Security Settings Incomplete

**File:** `src/app/login/actions.ts` (Lines 42-48)

**Issue:**
```typescript
cookieStore.set('portal_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',  // Should be 'strict' for financial apps
    maxAge: 7 * 24 * 60 * 60,
    path: '/'
})
```

**Missing:**
- `sameSite: 'strict'` for CSRF protection
- `__Host-` prefix if subdomain cookies needed
- Path restriction to prevent scope widening

---

### 🟡 MED-3: No HTTPS Enforcement

**Issue:** No HTTP to HTTPS redirect enforcement in place. Cookie `secure` flag is conditional on production, but no HSTS header is set.

**Recommendation:**
1. Add HSTS header in `next.config.ts`
2. Force HTTPS in production
3. Include `includeSubDomains` directive

---

### 🟡 MED-4: Error Messages Leak Information

**File:** `src/app/api/branding/route.ts` (Lines 22-24)

**Issue:**
```typescript
catch (error: unknown) {
    console.error("Error fetching branding settings:", error);
    return NextResponse.json({ error: "Failed to fetch branding settings" }, { status: 500 });
}
```

While the public error is generic, the server logs the full error object which could leak stack traces or database errors in some configurations.

**Recommendation:**
1. Sanitize error logs before production
2. Use structured logging that strips sensitive data
3. Consider error monitoring service (Sentry)

---

## Low Severity Findings

### 🟢 LOW-1: Hardcoded OTP Bypass in Mock SDK

**File:** `src/lib/insforge-sdk.ts` (Line 43)

```typescript
if (token === '123456') return { session: { access_token: 'mock-jwt-token' }, error: null };
```

**Issue:** Test credential hardcoded in code. Will be removed when real SDK is implemented.

---

### 🟢 LOW-2: Demo Password Hint Exposed

**File:** `src/app/login/actions.ts` (Line 30)

```typescript
return { error: 'Invalid password. Hint: Use Demo123! for demo accounts.' }
```

**Issue:** Reveals that demo accounts exist and their password. In production, this should be removed.

---

## Security Recommendations Summary

### Immediate Actions (Before Any Production Use)

1. **Rotate database credentials** - The hardcoded password is committed and exposed
2. **Implement webhook signature verification** - Payment fraud prevention
3. **Replace mock SDK with real InsForge SDK** - Authentication is non-functional
4. **Add RBAC middleware** - Current system has no access control

### Short-term Actions (This Sprint)

5. Add rate limiting to authentication endpoints
6. Implement audit logging for all sensitive operations
7. Validate all user inputs with strict allowlists
8. Strengthen cookie security settings

### Medium-term Actions (Next Phase)

9. Add comprehensive error handling and monitoring
10. Implement HSTS and HTTPS enforcement
11. Add security headers (CSP, X-Frame-Options, etc.)
12. Conduct penetration testing after fixes

---

## Files Requiring Immediate Attention

| File | Issue Count | Priority |
|------|-------------|----------|
| `src/lib/db.ts` | 1 CR | P0 |
| `src/app/api/webhooks/payments/route.ts` | 1 CR | P0 |
| `src/lib/insforge-sdk.ts` | 1 CR | P0 |
| `src/app/api/branding/route.ts` | 1 CR, 1 MED | P1 |
| `src/app/login/actions.ts` | 2 HIGH, 1 LOW | P1 |
| All dashboard pages | Missing RBAC | P2 |

---

## Conclusion

The MasjidPortalSite codebase has **significant security gaps** that must be addressed before any production deployment. The B.L.A.S.T protocol priority of **TRUST > SECURITY** is not currently upheld. The team should focus on:

1. Removing hardcoded credentials (CR-1)
2. Implementing proper authentication via InsForge SDK (CR-3)
3. Adding webhook signature verification (CR-2)
4. Implementing RBAC per specification (CR-4)

All critical issues are directly related to the TRUST priority - without fixing these, users cannot trust the system with their data or money.

---

**Next Steps:**
- Create tickets for each P0 finding
- Schedule emergency security review after fixes
- Implement security scanning in CI/CD pipeline