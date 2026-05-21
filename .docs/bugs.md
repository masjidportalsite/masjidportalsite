---
title: Bug Tracker
domain: management
status: active
priority: high
tags:
  - issues
  - resolved
last_updated: 2026-05-20
---

# Bug Tracking: Masjid Portal

Known issues and resolutions.

## Resolved
1. **Redirect Loop**: Fixed by clearing cookies in `requireAuth`.
2. **Next 16 Build Conflict**: Fixed by renaming `middleware.ts` to `proxy.ts`.
3. **Database URL Missing**: Fixed by adding strict environment validation in `db.ts`.
4. **Enum Misalignment**: Fixed `UserRole` enum to match PostgreSQL `user_role`.

## Open
1. **Google Font Warning**: Next.js 16 reports `google-font-display` block as non-recommended.
2. **Hydration Warning**: Occasional mismatch in Dashboard layout on mobile.
3. **Vitest CJS Warning**: Vite reports CJS build of Node API as deprecated.

## Investigating
- Performance impact of complex CSS patterns in `globals.css` on low-end mobile devices.
