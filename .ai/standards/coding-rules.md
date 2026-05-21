# AI Engineering Standard: Coding Rules

## TypeScript
- **Strictness**: `strict: true` is mandatory in `tsconfig.json`.
- **No `any`**: Never use `any`. Use `unknown` or specific interfaces/types.
- **Enums**: Prefer `enum` for fixed sets of values (e.g., `UserRole`).
- **Inference**: Leverage TypeScript's type inference where obvious; explicit types for exported functions.

## React & Next.js
- **Components**: Prefer Function Components with `FC` or standard `(props: Props)` signatures.
- **Hooks**: Follow the Rules of Hooks. Use `useMemo` and `useCallback` for expensive computations.
- **Server Components**: Default to Server Components for data fetching. Use `'use client'` only for interactive state.
- **Server Actions**: Abstract business logic from UI. Centralize in `actions.ts`.

## AI-Generated Code Consistency
- **Surgical Edits**: Use targeted replacements to avoid changing unrelated code.
- **Idiomatic Quality**: Align with existing naming conventions and project style.
- **No Suppression**: Do not use `eslint-disable` or `@ts-ignore` to hide architectural issues. Fix the root cause.
