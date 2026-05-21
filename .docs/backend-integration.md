---
title: Backend Integration
domain: backend
status: active
priority: high
tags:
  - insforge
  - sdk
  - pg
last_updated: 2026-05-20
---

# Backend Integration: Masjid Portal

Guide to integrating with InsForge.dev.

## SDK Initialization
Located in `src/lib/insforge-sdk.ts`.
- `insforge`: Browser-side client.
- `createInsForgeServerClient(token)`: Server-side factory.

## Database Access
- **Direct**: Use `pool.query` from `src/lib/db.ts` for server-only aggregations.
- **SDK**: Use `insforge.database.from()` for client-side or authenticated server requests.

## Authentication Flow
1. **Login**: Sign in via `loginAction` using SDK.
2. **Session**: JWT stored in `insforge_session` cookie.
3. **Validation**: Handled by `InsForgeJwtAdapter` in `src/lib/auth/adapters.ts`.

## multi-tenant Support
- Every request must include the `organization_id`.
- RLS policies on InsForge ensure that users only see data for their linked organization.
- See `.skills/multi-tenant.md` for strict rules.
