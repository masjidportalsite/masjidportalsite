# ADR-001: System Architecture

## Status
Accepted

## Date
2024-05-18

## Context
We need a robust, scalable, and maintainable architecture for the MasjidPortalSite platform. The platform serves mosque administrators and community members, requiring high availability, security, and a professional user experience.

## Decision
We will adopt the following architectural stack and principles:

1.  **Frontend**: Next.js using the App Router. React for component-based UI. Tailwind CSS for styling.
2.  **Backend & Database**: InsForge (PostgreSQL, Auth, Storage, Server Functions). This provides a unified backend-as-a-service (BaaS) with PostgreSQL power.
3.  **Hosting**: Vercel for the frontend (leveraging edge functions and global CDN) and InsForge Cloud for the backend.
4.  **Architectural Patterns**:
    *   **A.N.T Architecture**: Architecture, Navigation, Tools.
    *   **B.L.A.S.T Protocol**: Blueprint, Link, Architect, Stylize, Trigger.
5.  **Design System**: "Digital Sanctuary" aesthetic focusing on Emerald and Gold colors, using the Geist font, and emphasizing Minimalism and Glassmorphism.

## Consequences
*   **Next.js App Router** allows for efficient server-side rendering and simplified routing.
*   **InsForge/PostgreSQL** ensures data integrity and powerful querying capabilities while reducing backend boilerplate.
*   **Vercel** provides seamless deployments and high performance.
*   Adherence to **A.N.T** and **B.L.A.S.T** ensures consistency across the engineering team.
*   The **Digital Sanctuary** design system ensures a culturally relevant and professional user experience.
