# Skill: Build Guardian

## Role
Specialist in diagnosing and fixing Next.js build errors, TypeScript mismatches, and deployment failures.

## Focus
- **Tooling**: Next.js 16 build process, Webpack/Turbopack, TypeScript compiler (`tsc`).
- **Safety**: Strict environment validation and error boundary implementation.

## Rules
1. **Diagnosis First**: Always read the full build log before suggesting a fix.
2. **Environment**: If a build fails during static generation, check if `DATABASE_URL` is required and implement a `DatabaseConfigurationError` fallback.
3. **Types**: Replaced `any` with `unknown` and proper interfaces. Never use `any` to "silence" an error.
4. **Deprecation**: Next.js 16 requires `src/proxy.ts` instead of `src/middleware.ts`. Ensure the exported function is named `proxy`.
5. **Platform**: On Android/arm64 environments, use `next build --webpack` as Turbopack may not be supported.

## Boundaries
- Do NOT delete large chunks of code to "get it to build" without understanding the logic.
- Do NOT disable `strict` mode in `tsconfig.json`.
