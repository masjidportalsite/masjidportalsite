---
title: Deployment Guide
domain: deployment
status: active
priority: high
tags:
  - vercel
  - cicd
last_updated: 2026-05-20
---

# Deployment: Masjid Portal

Integrated deployment strategy using Vercel and InsForge.

## Production URL
[https://masjidportalsite.vercel.app](https://masjidportalsite.vercel.app)

## Deployment Checklist
1. **Local Build**: Always run `npm run build` locally first.
2. **Platform Specifics**: Use `next build --webpack` for Android/Termux environments.
3. **Environment Sync**: Synchronize `NEXT_PUBLIC_*` vars to Vercel via CLI.
4. **Vercel Hook**: Automatic deployments on git push.

## CI/CD Workflow
- **Tests**: `npm test` must pass.
- **Linter**: `npx eslint .` must be error-free.
- **Vercel CLI**: `vercel --prod` for manual promotions.

## Hosting Providers
- **Frontend**: Vercel (Edge Functions enabled).
- **Backend**: InsForge Cloud (Serverless PostgreSQL).
