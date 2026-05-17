# MVP Roadmap & Implementation Tasks

## MVP Roadmap
- **PHASE 1**: Discovery and architecture (Status: Active)
  - Deliverables: Community requirements, Architecture map, Risk report, MVP scope.
- **PHASE 2**: Foundation
  - Deliverables: Authentication, Role-based access, Member database, Admin dashboard.
- **PHASE 3**: Core operations
  - Deliverables: Events, Attendance, Classes, Volunteers.
- **PHASE 4**: Payments
  - Deliverables: Donations, Zakat, Campaign tracking, Receipt system.
- **PHASE 5**: Scale
  - Deliverables: Automation, Analytics, Growth systems, Mobile optimization.

## First Implementation Tasks (Transitioning to Phase 2)
1. Initialize Next.js project with Tailwind CSS and React configuration.
2. Initialize InsForge backend project (Provision Postgres database, Configure storage buckets, Server functions, Enable audit logs).
3. Migrate schemas (users, roles, members, donors, donations, events, announcements, receipts, audit_logs) and RLS in InsForge Postgres.
4. Implement foundational InsForge authentication flow (RBAC, Multi-tenant checking) with secure secrets management and API rate limiting.
5. Implement Role-Based routing and replace any old clients with `insforge sdk`.
6. Run tests on Auth flow, CRUD, File uploads, and Payment webhook logging.
