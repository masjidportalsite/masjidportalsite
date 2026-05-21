# RLS Verification Checklist

Before enabling Row Level Security (Phase 2.3), the following checks MUST be performed:

## 1. Schema Completeness
- [ ] Every table has an `organization_id` column of type `UUID`.
- [ ] Every table has at least one RLS policy defined in `insforge/rls/policies.sql`.
- [ ] All `INSERT` operations in services include the `organization_id`.

## 2. SDK Context Verification
- [ ] `createInsForgeServerClient` correctly passes `x-insforge-organization-id` header.
- [ ] Middleware (if any) correctly extracts and validates the organization context.
- [ ] Service constructors are receiving both `TenantContext` and `accessToken`.

## 3. Fallback Integrity
- [ ] Hybrid fallback in all services correctly logs SDK errors without crashing the process.
- [ ] Tracing logs confirm that `organization_id` is present in all requests.

## 4. Security Audit (Dry Run)
- [ ] Confirm that `current_setting('insforge.organization_id', true)` is correctly interpreted by the backend.
- [ ] Verify that `Super Admin` bypass logic is ready.

## 5. Functional Parity
- [ ] UI displays the same data when using SDK vs SQL (visually verified).
- [ ] Pagination and sorting work correctly via SDK `database.from().order().limit()`.
