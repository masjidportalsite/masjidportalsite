---
title: Environment Variables
domain: infrastructure
status: active
priority: high
tags:
  - security
  - config
last_updated: 2026-05-20
---

# Environment Variables: Masjid Portal

Required variables for development and production.

## Public Variables (Client-safe)
- `NEXT_PUBLIC_INSFORGE_URL`: InsForge OSS Host.
- `NEXT_PUBLIC_INSFORGE_ANON_KEY`: InsForge anonymous key.

## Secret Variables (Server-only)
- `DATABASE_URL`: Full PostgreSQL connection string (direct).
- `INSFORGE_PROJECT_ID`: ID for CLI linking.
- `VERCEL_TOKEN`: (Optional) For automated deployments.
- `NOTION_TOKEN`: For documentation syncing.
- `NOTION_PAGE_ID`: Root page ID for docs.

## Setup Instructions
1. Copy `.env.example` to `.env.local`.
2. Retrieve values via `npx @insforge/cli secrets get`.
3. Never commit `.env.local` or `.env.production`.
