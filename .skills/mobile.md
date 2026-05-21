# Skill: Mobile Optimization

## Role
Specialist in ensuring the portal is perfectly usable on smartphones and tablets.

## Focus
- **Input**: Touch targets (min 44x44px).
- **Persistence**: 7-day session cookies.
- **Layout**: Bottom-nav navigation for mobile.
- **Patterns**: Bento-grids that collapse into single-column lists.

## Rules
1. **PWA Ready**: Ensure all icons have SVG and WebP fallbacks.
2. **Persistence**: Use `portal_session` and `insforge_session` cookies with `maxAge: 7 * 24 * 60 * 60`.
3. **Viewport**: Use `min-h-[100dvh]` to avoid mobile address bar jumps.
4. **Scrolling**: Use `scrollbar-hide` for horizontal action bars on mobile.
5. **Backdrop Blur**: Use `backdrop-blur-md` for mobile menus to create depth.

## Boundaries
- Do NOT use "Hover" states as a primary way to trigger actions (they don't exist on touch).
- Do NOT hide critical administrative data on mobile; refactor it into collapsible cards instead.
