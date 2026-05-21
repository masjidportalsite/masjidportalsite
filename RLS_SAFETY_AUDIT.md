# RLS Architectural Safety Audit: Phase 2.3

## 1. Table Enumeration & Isolation Requirements
The following tables require multi-tenant isolation via `organization_id`.

| Table Name | Isolation Level | Tenant Column | Notes |
| :--- | :--- | :--- | :--- |
| `users` | STRICT | `organization_id` | Core user data. |
| `donations` | STRICT | `organization_id` | Financial records. |
| `receipts` | STRICT | `organization_id` | Legal documents. |
| `audit_logs` | STRICT | `organization_id` | System history. |
| `events` | STRICT | `organization_id` | Program data. |
| `event_registrations` | STRICT | `organization_id` | RSVP data. |
| `volunteer_shifts` | STRICT | `organization_id` | Volunteer data. |
| `settings` | STRICT | `organization_id` | System configuration. |
| `branding_settings` | STRICT | `organization_id` | UI customization. |
| `donors` | STRICT | `organization_id` | CRM data. |
| `campaigns` | STRICT | `organization_id` | Fundraising data. |
| `announcements` | STRICT | `organization_id` | Community news. |
| `rewards_inventory` | STRICT | `organization_id` | Loyalty program. |
| `rewards_claims` | STRICT | `organization_id` | Reward redemption. |

## 2. RLS Policy Matrix

| Table | Tenant Column | Expected JWT Claim | Required Policy |
| :--- | :--- | :--- | :--- |
| `*` (All above) | `organization_id` | `org_id` / `headers` | `(organization_id = current_setting('insforge.organization_id', true)::uuid)` |
| `users` | N/A | `user_id` | `(id = current_setting('insforge.user_id', true)::uuid)` (Personal Data) |
| `donations` | N/A | `user_id` | `(user_id = current_setting('insforge.user_id', true)::uuid)` (Personal Records) |

## 3. Explicit Filter Detection
All queries in `src/services/*.service.ts` currently use explicit `.eq('organization_id', ...)` or `WHERE organization_id = ...`.
- **Status**: REDUNDANT but SAFE.
- **Action**: These filters should remain during Phase 2.3 to verify that RLS returns the SAME results as explicit filtering. They will be removed in Phase 3.

## 4. Admin Bypass Requirements
- **SUPER_ADMIN**: Requires a bypass policy to view/manage data across all organizations (e.g. for platform maintenance).
- **Enforcement**: `USING (current_setting('insforge.role', true) = 'super_admin')`.

## 5. Aggregation Compatibility
`AnalyticsService` performs `SUM`, `COUNT`, and `GROUP BY`.
- **Verified**: PostgreSQL RLS is applied *before* aggregations. `COUNT(*)` will naturally return only the tenant's records without code changes.
- **Risk**: Low.

## 6. SQL Policies (Dry-Run Mode)
```sql
-- DRY RUN: Generate policies for organization isolation
DO $$ 
DECLARE 
    t text;
    tables text[] := ARRAY['users', 'donations', 'receipts', 'audit_logs', 'events', 
                           'event_registrations', 'volunteer_shifts', 'settings', 
                           'branding_settings', 'donors', 'campaigns', 
                           'announcements', 'rewards_inventory', 'rewards_claims'];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
        EXECUTE format('DROP POLICY IF EXISTS "Organization Isolation" ON %I;', t);
        EXECUTE format('CREATE POLICY "Organization Isolation" ON %I FOR ALL USING (organization_id = (current_setting(''insforge.organization_id'', true)::uuid)) WITH CHECK (organization_id = (current_setting(''insforge.organization_id'', true)::uuid));', t);
    END LOOP;
END $$;
```

## 7. Rollback Strategy
If RLS causes "Access Denied" or data mismatch:
1.  **Immediate**: Run `UNDO` script to disable RLS on all tables.
2.  **Code**: Revert `src/lib/auth.ts` to prioritize `PostgresSessionAdapter`.
3.  **Database**: `DROP POLICY` and `ALTER TABLE ... DISABLE ROW LEVEL SECURITY`.
