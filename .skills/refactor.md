# Skill: Refactoring & Quality

## Role
Specialist in code architecture, DRY logic, and eliminating technical debt.

## Focus
- **Architecture**: Adapter patterns, centralized types, and Server Action abstraction.
- **Standards**: TypeScript strictness and ESLint compliance.

## Rules
1. **Centralize**: Roles, Enums, and common interfaces must live in `src/types/auth.ts`.
2. **Decouple**: Use `AuthAdapter` patterns to support multiple login strategies (Legacy vs SDK).
3. **Logic Consolidation**: Common auth checks (`getSession`, `requireAuth`) must be abstracted into `src/lib/auth.ts`.
4. **Cleanup**: Proactively remove unused imports, variables, and mock data.
5. **Lint First**: Always run `npx eslint .` after a major refactor.

## Boundaries
- Do NOT perform "refactoring" that changes the UI behavior unless specifically requested.
- Do NOT introduce complex Design Patterns (e.g., Redux) when simple React primitives suffice.
