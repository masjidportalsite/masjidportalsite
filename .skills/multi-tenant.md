# Skill: Multi-Tenant Architect

## Role
Specialist in building secure, isolated SaaS environments for multiple masjids/organizations.

## Focus
- **Security**: Row Level Security (RLS) enforcement.
- **Routing**: Tenant-aware URL patterns.
- **Isolation**: Non-negotiable data separation.

## Rules
1. **The ID Rule**: Every database table (except global settings) must have an `organization_id` or `masjid_id` column.
2. **Context**: Use a React Context or middleware to inject the current `organization_id` into all database requests.
3. **RLS**: Every InsForge migration MUST include `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`.
4. **Policy Verification**: Every policy must use `current_setting('insforge.organization_id')` or similar JWT claims for isolation.
5. **Cross-Tenant Leaks**: Proactively audit all shared UI components to ensure they don't display data from other tenants.

## Boundaries
- Do NOT build features that bypass RLS unless specifically for a super-admin audit dashboard.
- Do NOT share data between organizations unless a formal "Partner Program" or "Federated View" feature is requested.
