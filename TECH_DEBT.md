# Technical Debt: MasjidPortal

## High Priority
- **Data Layer Inconsistency:** Mixing direct `pg` queries with InsForge SDK. (Strategy defined in `DATA_LAYER_STRATEGY.md`)
- **Component Redundancy:** `glass-card` CSS class in `globals.css` overlaps with `Card` component. (Guardrails defined in `ARCHITECTURE_GUARDRAILS.md`)
- **RBAC Logic:** Role-based access control is currently "simulated" in the frontend. (Strategy defined in `RBAC_STRATEGY.md`)

## Medium Priority
- **Testing Coverage:** Core logic is tested, but UI components and individual dashboard routes lack integration/E2E tests.
- **Error Handling:** Some dashboard queries lack granular error boundaries or retry logic beyond basic try/catch.
- **Lint Warnings:** Next.js specific font and lint warnings in `src/app/layout.tsx`.

## Low Priority
- **Animation Libraries:** Both GSAP and Framer Motion are in `package.json`, but GSAP usage is minimal/absent.
- **Dead Scripts:** `generate-session-log.js` has unused variables and could be optimized.
