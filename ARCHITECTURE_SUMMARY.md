# Architecture Summary: MasjidPortal

## Overview
MasjidPortal is a "Digital Sanctuary" for mosque administrators, built with a modern, high-performance stack prioritizing stability, mobile-responsiveness, and elegant aesthetics (Apple/Stripe-inspired).

## Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4, Vanilla CSS
- **Database:** PostgreSQL (direct `pg` pool)
- **SDK:** InsForge SDK (Auth, Database, Storage)
- **Deployment:** Vercel
- **Animations:** Framer Motion (GSAP integrated in package.json, usage pending)
- **UI Components:** Lucide React, Geist Sans

## Key Patterns
- **Layout:** Centralized `src/app/dashboard/layout.tsx` enforces authentication via `requireAuth()`.
- **Authentication:** Dual-adapter strategy (`src/lib/auth.ts`) supporting legacy PostgreSQL sessions and modern InsForge JWTs.
- **Components:** Hybrid usage of Atomic UI components (`src/components/ui`) and specialized dashboard features.
- **Data Fetching:** Direct server-side SQL queries in Page components for maximum performance, transitioning to InsForge SDK for edge capabilities.

## Directory Structure
- `src/app`: Routes, Page components, and Server Actions.
- `src/components`: UI components (Dashboard-specific, Atomic, and 3D scenes).
- `src/lib`: Core logic, SDK initialization, and database utilities.
- `src/types`: Centralized TypeScript definitions.
- `.docs`: Detailed Markdown documentation synced to Notion.
