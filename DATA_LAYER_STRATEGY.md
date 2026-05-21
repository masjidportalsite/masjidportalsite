# Data Layer Strategy: Unifying PG & InsForge

## 1. Current State Analysis
- **Direct PG:** ~90% of data operations use a raw `pg` pool. It lacks automatic multitenancy and RLS.
- **InsForge SDK:** Used for Auth. Provides built-in RLS and multi-tenant isolation but is currently underutilized for domain data.

## 2. Target Architecture: Service Layer
We will introduce a `Service` pattern to abstract the underlying data provider.

### Structure:
```typescript
// Example: src/lib/services/donation-service.ts
export class DonationService {
  constructor(private orgId: string) {}

  async getDonations() {
    // Phase 1: Direct SQL with orgId filter
    // Phase 2: Switch to insforge.db.from('donations').select()
  }
}
```

## 3. Migration Roadmap
### Phase 1: Abstraction (Current Focus)
- Wrap all existing `pool.query` calls into domain services (Donation, Member, Event).
- Pass `organization_id` to every query.
- **Goal:** Zero functional change, but centralized control.

### Phase 2: Dual-Writing (Optional)
- For critical data, write to both legacy tables and InsForge-managed tables.
- **Goal:** Data parity verification.

### Phase 3: SDK Unification
- Update Services to use `@insforge/sdk` methods instead of raw SQL.
- Leverage InsForge Storage for file uploads (replacing local/direct storage).
- **Goal:** Full leverage of InsForge's edge-ready capabilities.

## 4. Multitenancy Enforcement
- All tables MUST have an `organization_id` column.
- The `User` interface in `src/types/auth.ts` will be updated to include `organization_id`.
- Services will extract `orgId` from the authenticated session automatically.

## 5. Persistence Standards
- Use **Snake Case** for database columns (`created_at`).
- Use **Camel Case** for TypeScript interfaces (`createdAt`).
- All services must handle `undefined` or `null` results gracefully without crashing the RSC.
