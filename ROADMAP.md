# Masjid Portal Site: Deployment & Production Roadmap

## Overview
This document outlines the path from Local MVP development to a Production-ready environment on Vercel and InsForge Cloud.

## Phase 1: Local Testing & QA (Current)
- Complete Next.js architecture refactoring (App Router, Tailwind v4).
- Verify InsForge Supabase schema (`0001_insforge_schemas.sql`).
- Test multi-tenant JWT parsing and RLS policies locally using Supabase CLI.
- Run UI cross-browser audits focusing on the "Emerald" design system and mobile responsiveness.

## Phase 2: InsForge (Backend) Provisioning
1. **Initialize Project**: Create the production InsForge/Supabase project.
2. **Apply Migrations**: Execute `insforge/migrations` through CI/CD to ensure infrastructure-as-code parity.
3. **Configure Auth**: Set up SMTP credentials (e.g., via Resend) for authentication and magic links.
4. **Environment Secrets**: Map production Database URIs and Anon Keys to Vercel Environment Variables.

## Phase 3: CI/CD Pipeline Configuration
- Set up a **GitHub Actions Workflow**:
  - `lint`: Runs `eslint` and `tsc` on every pull request.
  - `test`: Executes Jest unit tests.
  - `build`: Simulates `next build`.
- **Vercel Deployments**:
  - Map `main` branch to the Production Vercel App.
  - Map feature branches to Preview deployments.
  - Webhooks linked to a dedicated Discord/Slack channel.

## Phase 4: Production Rollout
- **Monitoring setup**: Integrate Sentry for error tracking and Vercel Analytics for Web Vitals (Speed > Trust).
- **Payment Gateways**: Switch from Mock FPX webhook endpoints to Live Billplz/ToyyibPay keys.
- **Data Load**: Seed standard Roles and Admin profiles.
- **Go-Live**: Propagate DNS settings and perform live penetration testing on public endpoints.
