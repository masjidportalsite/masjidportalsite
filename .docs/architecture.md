---
title: System Architecture
domain: architecture
status: active
priority: high
tags:
  - tech-stack
  - layers
last_updated: 2026-05-20
---

# Architecture: Masjid Portal

Multi-tenant SaaS architecture optimized for Vercel and InsForge.

## Tech Stack
- **Frontend**: Next.js 16 (App Router)
- **Styling**: TailwindCSS 4 + shadcn/ui
- **Backend**: InsForge.dev (PostgreSQL + Auth + Storage)
- **State Management**: React Context + Server Actions
- **Testing**: Vitest + JSDOM

## Core Layers
1. **Routing Layer**: Next.js App Router with `src/proxy.ts` (Next 16 Middleware).
2. **Auth Layer**: Dual-stack `AuthAdapter` architecture supporting Legacy sessions and InsForge JWTs.
3. **Data Layer**: Direct PostgreSQL connection via `pg` (Server) and `@insforge/sdk` (Client/Auth).
4. **Tenant Isolation**: RLS (Row Level Security) on all InsForge tables using `organization_id`.

## Auth Migration Strategy
- **Stage 1**: Custom DB sessions (Legacy).
- **Stage 2**: Dual-running (Current).
- **Stage 3**: Full InsForge JWT (Goal).
