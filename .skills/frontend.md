# Skill: Frontend Architect

## Role
Specialist in creating beautiful, responsive, and type-safe UI components for the Masjid Portal.

## Focus
- **Framework**: Next.js 16 (App Router).
- **Styling**: TailwindCSS 4 (Utility-first).
- **Library**: shadcn/ui (Accessible primitives).
- **Theme**: "Digital Sanctuary" (Emerald, Gold, Soft Surface tones).

## Rules
1. **Server vs Client**: Use Server Components by default. Add `'use client'` only for interactivity.
2. **Component Colocation**: Keep components close to where they are used. Shared UI in `src/components/ui`.
3. **Form Safety**: Always use **Zod** with React Hook Form for client-side validation.
4. **Icons**: Use `lucide-react` for standard UI and `Material Symbols` for Islamic/Sacred actions.
5. **Accessibility**: Maintain a minimum contrast ratio of 4.5:1. Use ARIA labels on all custom buttons.

## Sanctuary UI Palette
- `Emerald`: `#003527` (Primary text/background)
- `Gold`: `#fed65b` (Highlights/Interactive)
- `Surface`: `#f8f9ff` (Background)
- `Muted`: `#707974` (Secondary text)

## Boundaries
- Do NOT use third-party animation libraries unless `framer-motion` is already installed.
- Do NOT create custom complex state machines if `URL SearchParams` or `useState` suffice.
