# Authentication Testing Strategy: MasjidPortal

This document outlines the lightweight testing strategy for verifying authentication and session flows. Our goal is high confidence in core security with minimal maintenance overhead.

## 1. Testing Stack
- **Framework:** [Vitest](https://vitest.dev/) (Fast, Next.js compatible, zero-config).
- **Environment:** Node.js (for server logic) and JSDOM (for client/middleware simulation).
- **Mocks:** Standard Vitest mocks for `next/headers` and `pg`.

## 2. Core Test Scenarios

### A. Middleware Protection
- **Scenario:** Accessing `/dashboard` without a cookie.
  - **Expectation:** 307 Redirect to `/login?from=/dashboard`.
- **Scenario:** Accessing `/login` while already authenticated.
  - **Expectation:** Redirect to `/dashboard`.
- **Scenario:** Accessing public assets (`/branding/logo.svg`).
  - **Expectation:** Status 200 (No redirect).

### B. Adapter & Session Logic
- **Scenario:** Valid `portal_session` token provided.
  - **Expectation:** `getSession()` returns a typed `User` object.
- **Scenario:** Invalid or expired token.
  - **Expectation:** `getSession()` returns `null`.
- **Scenario:** Dual-token presence (`insforge_session` + `portal_session`).
  - **Expectation:** `insforge_session` takes priority (Migration safety).

### C. Server Actions (Login/Logout)
- **Scenario:** Correct credentials provided to `loginAction`.
  - **Expectation:** `portal_session` cookie is set, session is recorded in DB.
- **Scenario:** `logoutAction` executed.
  - **Expectation:** Cookie deleted, DB session purged.

### D. Mobile Persistence
- **Scenario:** Cookie `maxAge` verification.
  - **Expectation:** `portal_session` is set with 7-day expiry.
- **Scenario:** Browser restart simulation.
  - **Expectation:** Session remains valid if cookie is persistent.

## 3. Execution Plan
1. **Unit Tests:** Focus on `src/lib/auth.ts` and `src/lib/auth/adapters.ts`.
2. **Integration Tests:** Focus on `src/middleware.ts` logic.
3. **Manual Audit:** Cross-device browser testing (Safari iOS, Chrome Android) for cookie handling.

## 4. Running Tests
```bash
npm test          # Run all tests
npm run test:ui   # Visual test runner
```
