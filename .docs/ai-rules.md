---
title: AI Operating Rules
domain: agents
status: active
priority: high
tags:
  - governance
  - rules
last_updated: 2026-05-20
---

# AI Operating Rules: Masjid Portal

Rules for AI Collaborators to maintain project integrity.

## 1. Safety & Security
- Never commit secrets to the repo.
- Guard `.env.local` and `.insforge/project.json`.
- Do not log plaintext passwords.

## 2. Skill Activation
- Load relevant skill from `.skills/` before starting a task.
- Follow the **B.L.A.S.T** Protocol and **A.N.T** Architecture.

## 3. Tech Constraints
- **Next.js 16**: Use `src/proxy.ts` for middleware.
- **TypeScript**: No `any`. Use `unknown` or specific interfaces.
- **Tailwind 4**: Utility-first only.
- **InsForge**: Prefer SDK for app logic, CLI for infra.

## 4. Mobile First
- All UI components must be tested for touch-readiness (44px target).
- Prefer bento-grids over complex tables.
