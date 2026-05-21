# RBAC Strategy: Server-Side Enforcement

## 1. Vision
Role-Based Access Control (RBAC) must move from "Frontend Simulation" to "Server-Side Enforcement." Access should be determined by the token/session and validated at the edge or database layer.

## 2. Role Hierarchy
- **SUPER_ADMIN:** Platform-wide access (all organizations).
- **MOSQUE_ADMIN:** Full control over a single organization.
- **TREASURER:** Financial records and donation management only.
- **IMAM:** Schedule and community engagement management.
- **COMMUNITY_MEMBER:** Read-only access to schedules and personal profiles.

## 3. Enforcement Layers

### Layer 1: Middleware (Route Level)
- Block access to `/dashboard/*` for unauthenticated users.
- Block access to `/dashboard/analytics` for non-admins.

### Layer 2: Service Layer (Data Level)
- Services must check the `UserRole` before executing sensitive queries (e.g., `deleteMember`).

### Layer 3: Database (Row Level Security)
- Transition to InsForge SDK to leverage native PostgreSQL RLS.
- Policies: `organization_id` must match the user's `organization_id`.

## 4. Implementation Pattern
```typescript
// src/lib/auth/rbac.ts
export function can(user: User, action: Action, resource: Resource): boolean {
  const permissions = ROLE_PERMISSIONS[user.role];
  return permissions?.[resource]?.includes(action) ?? false;
}
```

## 5. Migration Roadmap
1.  **Strict Typing:** Ensure all `User` objects have a valid `UserRole`.
2.  **Server-Side Check:** Update `requireAuth()` to optionally accept required roles: `await requireAuth([UserRole.MOSQUE_ADMIN])`.
3.  **UI Sync:** Hide navigation items in `DashboardNav` based on the *actual* server-provided role, removing the "Simulation" cycle logic.
