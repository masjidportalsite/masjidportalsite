# Phase 2 Implementation Plan: RLS & SDK Integration

## 1. Analysis of Current State
### Authentication Touchpoints
- `src/lib/auth.ts`: Multi-adapter system (JWT + Legacy Session).
- `src/app/login/actions.ts`: Dual-auth login logic.
- `src/app/dashboard/actions.ts`: Logout logic clearing both sessions.

### Database Touchpoints
- `src/services/*.service.ts`: Abstracted Service Layer using direct `pg` pool.
- `src/app/dashboard/announcements/page.tsx`: Direct `pg` pool usage (PENDING Phase 1).
- `src/app/dashboard/volunteers/page.tsx`: Direct `pg` pool usage (PENDING Phase 1).

## 2. Implementation Phases

### Phase 2.1: Infrastructure Preparation (No Code Changes)
- Create `PHASE_2_ROLLBACK.md` with git commit markers.
- Define RLS SQL policies in `insforge/rls_policies.sql`.
- Update `ARCHITECTURE_GUARDRAILS.md` to reflect SDK-only access.

### Phase 2.2: SDK Transition (Service Layer)
- Update `src/lib/insforge-sdk.ts` to support multi-tenant client factories.
- **Incrementally** migrate services from raw SQL to `insforge.db`:
  1. `user.service.ts`
  2. `donation.service.ts`
  3. `event.service.ts`
  4. `prayer.service.ts`
- **Verify parity** between SQL and SDK results.

### Phase 2.3: RLS Enforcement
- Apply `organization_id` policies to all PostgreSQL tables.
- Switch `getSession()` to prioritize InsForge JWT for all dashboard requests.
- Validate that one tenant cannot access another's data via SDK even if `organization_id` is spoofed in code.

### Phase 2.4: JWT Migration Finalization
- Phase out `portal_session` cookie.
- Update `requireAuth()` to exclusively use InsForge JWT.
- Remove legacy `PostgresSessionAdapter`.

## 3. High Regression Risk Areas
- **Auth Flow**: Any break in `getSession()` will lock users out of the dashboard.
- **Service Layer**: Incorrect SDK mapping for complex joins (e.g., donations + users).
- **Organization Isolation**: Bugs in RLS policies could leak data between masjids.

## 4. Rollback Strategy
- **Commits**: Each Phase will be a separate commit branch.
- **Mechanism**: `git revert` + immediate redeploy.
- **Database**: All RLS changes must be reversible via `DROP POLICY`.
- **Hybrid Support**: Maintain `pool.query` as a fallback during the transition period.

## 5. Deliverables (Planned)
- `ARCHITECTURE_GUARDRAILS.md` (Updated)
- `DATA_LAYER_STRATEGY.md` (Updated)
- `RBAC_STRATEGY.md` (Updated)
- `insforge/rls_policies.sql`
