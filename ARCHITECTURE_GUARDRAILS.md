# Architecture Guardrails: MasjidPortal

## 1. Data Integrity & Multitenancy
- **No Direct DB Access in UI:** React Server Components (RSC) and Server Actions MUST NOT call `pool.query` or `insforge.db` directly. All data access must go through a **Service Layer**.
- **Mandatory Tenant Context:** Every service method that retrieves or modifies data MUST require an `organization_id` as a parameter.
- **SQL Sanitization:** Direct SQL queries (where permitted in services) MUST use parameterized queries ($1, $2) to prevent SQL injection.

## 2. API & Communication
- **Type-Safe Responses:** All API routes and Server Actions MUST return typed responses using standard result wrappers (e.g., `{ data, error }`).
- **Middleware Enforcement:** Route-level authentication and tenant validation MUST be handled in `middleware.ts`.

## 3. Component Standards
- **Separation of Concerns:** Keep "Sacred UI" (design-heavy components) separate from "Functional UI" (forms, lists).
- **Mobile First:** All layout changes MUST be verified at `375px` width before being committed.
- **Client Components:** Use `'use client'` sparingly. Prefer Server Components for data fetching to minimize client-side bundle size.

## 4. State & Auth
- **Single Source of Truth:** User state MUST be retrieved via `getSession()` in `src/lib/auth.ts`.
- **Stateless Services:** Services must not store internal state; they should be functional and deterministic based on input parameters.

## 5. Development Workflow (Termux/Mobile)
- **Webpack Fallback:** Since Turbopack is unsupported on ARM64 Android, `next build --webpack` is the standard build command.
- **Linting:** `npm run lint` must pass with zero errors.
