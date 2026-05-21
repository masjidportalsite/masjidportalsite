# Phase 2 Rollback Strategy: MasjidPortal

## 1. Safety Markers
Before starting each implementation step, ensure a stable commit hash is recorded.

| Phase | Description | Git Marker (Pre-Implementation) |
| :--- | :--- | :--- |
| 2.2 | SDK Transition | `f653381` (Current Stable) |
| 2.3 | RLS Enforcement | TBD |
| 2.4 | JWT Migration | TBD |

## 2. Immediate Rollback (Code)
If a build failure or UI regression occurs:
1.  **Identify Failure**: Use `npm run build --webpack` and `npm test` to confirm.
2.  **Revert**: `git reset --hard <marker>` or `git revert <commit_id>`.
3.  **Deploy**: Trigger immediate re-deploy to Vercel.

## 3. Database Rollback (SQL)
Since RLS policies change the fundamental behavior of database queries:
1.  **Safety Buffer**: Always write migration SQL with a corresponding `UNDO` script.
2.  **Example**:
    ```sql
    -- DO
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    -- UNDO
    ALTER TABLE users DISABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Organization Isolation" ON users;
    ```
3.  **Emergency**: If the SDK fails to connect via RLS, disable RLS on the affected table immediately to restore legacy `pg` pool functionality.

## 4. Hybrid Support Policy
- During Phase 2, the `lib/db.ts` (pg pool) will be kept as a "Shadow Fallback".
- Services will attempt InsForge SDK first; if a critical SDK error occurs, they will log it and fallback to raw SQL until the issue is debugged.
- This policy will be removed only after Phase 2.4 is 100% verified.
