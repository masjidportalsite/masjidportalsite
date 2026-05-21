---
title: Vercel Troubleshooting
domain: deployment
status: active
priority: medium
tags:
  - errors
  - webpack
last_updated: 2026-05-20
---

# Vercel Deployment Issues: Masjid Portal

Troubleshooting guide for Vercel.

## Next.js 16 Compatibility
- Vercel deployments may require `next build --webpack` if using ARM-based build machines or complex native dependencies.
- Ensure `src/proxy.ts` is correctly detected; delete `middleware.ts` to avoid conflicts.

## Environment Sync
- If the build fails during static generation, verify that `DATABASE_URL` is set in the Vercel project settings.
- Run `vercel env ls` to check current remote variables.

## SSL Warnings
- `pg` library may report SSL warnings regarding `sslmode=require`. This is expected in serverless environments; ensure your `DATABASE_URL` includes `?sslmode=require`.

## Deployment Promos
- Use `vercel --prod` to promote a successful preview build to production.
