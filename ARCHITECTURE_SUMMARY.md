# Architecture Summary: MasjidPortal

## Overview
MasjidPortal is a "Digital Sanctuary" for mosque administrators, built with a modern, high-performance stack prioritizing stability, mobile-responsiveness, and elegant aesthetics (Apple/Stripe-inspired).

## Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4, Vanilla CSS
- **Database:** PostgreSQL (direct `pg` pool via InsForge)
- **Authentication**: Custom PostgreSQL session authentication
- **Deployment:** Vercel
- **Animations:** Framer Motion, Three.js (@react-three/fiber)
- **UI Components:** Lucide React, Geist Sans

## Key Patterns
- **Layout:** Centralized `src/app/dashboard/layout.tsx` enforces authentication via `requireAuth()`.
- **Authentication:** Custom session-based authentication using the `sessions` table.
- **Components:** Hybrid usage of Atomic UI components (`src/components/ui`) and specialized dashboard features.
- **Data Fetching:** Direct server-side SQL queries in the **Service Layer** (`src/services/`) using a centralized `pg` pool.

## Directory Structure
- `src/app`: Routes, Page components, and Server Actions.
- `src/components`: UI components (Dashboard-specific, Atomic, and 3D scenes).
- `src/services`: Domain-specific logic and data access (Direct SQL).
- `src/lib`: Core utilities and database pool initialization.
- `src/types`: Centralized TypeScript definitions.
- `.docs`: Detailed Markdown documentation synced to Notion.
