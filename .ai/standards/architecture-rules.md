# AI Engineering Standard: Architecture Rules

## Multi-tenant SaaS Safety
- **Isolation**: Every tenant-specific table MUST have an `organization_id` or `masjid_id`.
- **RLS**: Row Level Security is mandatory for all multi-tenant tables. Policies must verify the user's tenant context from JWT claims.
- **Shared Data**: Global configurations (e.g., branding defaults) live in public schemas; tenant overrides are explicit.

## System Patterns
- **Adapters**: Use Adapter patterns for external integrations (Auth, Payments) to allow seamless provider migration.
- **Centralized Logic**: Core logic (Auth, DB connection) must be centralized in `src/lib/` to prevent duplication.
- **State Flow**: Data flows down from Server Components to Client Components; interactions bubble up via Server Actions.

## Error Handling
- **Typed Errors**: Use custom error classes (e.g., `DatabaseConfigurationError`) for infrastructure failures.
- **Fail Fast**: Validate environment variables at initialization; throw descriptive errors.
- **Safe Fallbacks**: Return typed empty states (e.g., `{ data: null, error: ... }`) instead of silent crashes.
