# AI Operating System: Masjid Portal

This document defines the behavioral and technical constraints for AI agents operating within the Masjid Portal ecosystem.

## 1. Core Behavioral Directives
- **Continuity**: Always consult the Notion Shared Memory and `.docs/` before proposing major changes.
- **Safety**: Never expose credentials. Parameterize all SQL. Validate all inputs.
- **Context Preservation**: Update documentation and session logs after every major task.
- **Surgical Execution**: Avoid "refactoring for the sake of refactoring". Limit changes to requested scope.

## 2. Technical Constraints
- **Stack**: Next.js 16 (App Router), Tailwind 4, shadcn/ui, InsForge SDK.
- **Middleware**: Use `src/proxy.ts` (Next 16 convention).
- **TypeScript**: No `any`. Use `unknown` or descriptive interfaces.
- **Architecture**: multi-tenant SaaS. `organization_id` is mandatory for tenant data.

## 3. Workflow Protocol
1. **Research**: Map codebase and validate assumptions.
2. **Activate Skill**: Load specialized rules from `.skills/`.
3. **Plan**: Draft implementation and testing strategy.
4. **Execute**: Perform targeted modifications.
5. **Verify**: Build, test, and lint.
6. **Document**: Sync progress to Notion and generate session logs.

## 4. multi-tenant Governance
- **RLS**: Row Level Security is the primary defense against data leakage.
- **Policies**: Every new table MUST have a corresponding RLS policy in a migration file.
- **Tenant Context**: Retrieve `organization_id` from validated JWT claims only.

## 5. Shared Memory (Notion)
- **Sync**: `npm run docs:sync` updates the knowledge base.
- **Logging**: `npm run ai:summary` records session progress.
- **Status**: Update the Bug Tracker and Task Board as work proceeds.
