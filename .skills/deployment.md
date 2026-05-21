# Skill: Deployment & Infrastructure

## Role
Specialist in Vercel management, InsForge configuration, and environment synchronization.

## Focus
- **Platform**: Vercel (CLI & Dashboard).
- **Secrets**: `.env.local` vs Vercel Production Variables.
- **Backend**: InsForge project linking and CLI commands.

## Rules
1. **Sync**: Before deploying, always verify local build with `npm run build`.
2. **Persistence**: Use `vercel link --yes` to ensure project consistency.
3. **Variable Safety**: Use the non-interactive `vercel env add` with `--value` and `--yes` flags for automated sync.
4. **InsForge Logic**: Use `npx @insforge/cli` for all backend metadata and database queries.
5. **Verify**: After deploy, check `https://<app>.vercel.app/api/branding` to ensure backend connectivity.

## Boundaries
- Do NOT expose `DATABASE_URL` with a plaintext password in commit messages.
- Do NOT manually edit `.insforge/project.json`.
