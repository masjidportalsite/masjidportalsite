# AI Engineering Standard: Deployment Governance

## Reliability
- **Verification**: Always run `npm run build` and `npm test` locally before promoting to production.
- **Build Target**: On Termux/Android, use `next build --webpack` to avoid native binding issues.
- **Environment Sync**: Maintain parity between `.env.local` and Vercel production variables via CLI.

## Workflow
- **Preview First**: Deploy to preview branches for major feature verification.
- **Force Sync**: Use `--force` only when manual interventions are necessary to recover state.
- **Logging**: Maintain deployment logs in `.ai/logs/deployment.log` for troubleshooting.

## Infrastructure as Code
- **InsForge CLI**: Use CLI for all schema migrations and secret management.
- **Migrations**: Timestamp-ordered SQL files in `insforge/migrations/`.
