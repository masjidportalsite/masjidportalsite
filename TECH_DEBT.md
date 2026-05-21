# Technical Debt: MasjidPortal

## High Priority
- **RBAC Enforcement**: Server-side validation of roles in the Service Layer is still pending.
- **Component Redundancy**: `glass-card` CSS class in `globals.css` overlaps with the atomic `Card` component.

## Medium Priority
- **Testing Coverage**: Integration and E2E tests for dashboard routes are missing.
- **Error Handling**: Standardize error boundaries across all dashboard sub-routes.

## Low Priority
- **Cleanup**: `generate-session-log.js` has unused variables and could be optimized.
