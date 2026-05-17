# Masjid Portal Site — Project Law & Architecture

## 1. System Architecture
- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend & Database**: InsForge (PostgreSQL, Auth, Storage, Server Functions)
- **Payments**: Billplz / ToyyibPay / CHIP
- **Messaging**: WhatsApp API, Resend (Email), SMS Provider
- **Hosting**: Vercel (Frontend), InsForge (Backend Cloud)
- **Architecture rules**: A.N.T Architecture (Architecture, Navigation, Tools) and B.L.A.S.T Protocol (Blueprint, Link, Architect, Stylize, Trigger) MUST be followed. Component-driven design, Mobile-first UI.

## 2. Database Schema Proposal (InsForge/PostgreSQL)
- `users`: id, email, full_name, phone_number, role, created_at.
- `roles`: static roles representing access tiers.
- `households`: id, name, primary_contact_id (fk to users), created_at.
- `memberships`: id, household_id, user_id, relationship, joined_at.
- `donors`: id, user_id, donor_level.
- `donations`: id, user_id (nullable), amount, currency, status, type (sadaqah, zakat, campaign), campaign_id, payment_gateway_ref, created_at.
- `events`: id, title, description, start_time, end_time, location, capacity, created_at.
- `announcements`: id, title, content, published_at.
- `receipts`: id, donation_id, receipt_url.
- `event_attendees`: id, event_id, user_id, status (RSVP, Attended, Canceled).
- `campaigns`: id, title, description, goal_amount, current_amount, start_date, end_date.
- `audit_logs`: id, user_id, action, target, changes.

## 3. User Roles & Access Control
1. **Admin**: Full access to all modules, roles, organization settings, and audit logs.
2. **Imam**: Manage educational content, khutbah schedules, and classes.
3. **Treasurer**: Manage donations, receipts, and campaign finances.
4. **Member**: View portal, register for events, make donations, manage household/dependents.

## 4. Security & Privacy Rules
- **Row-Level Security (RLS)**: Mandatory for ALL database tables. Users must only access data relevant to them unless they hold Admin or Treasurer roles.
- **Role-Based Access Control (RBAC)**: Checked dynamically and verified on every API server function and database query.
- **PII Protection**: Strict data handling for sensitive attributes.
- **Audit Logs**: All admin actions and financial operations must be logged in the `audit_logs` table.
- **Secure Secrets Management**: All keys injected via environment vars.
- **API Rate Limiting**: Required for all endpoints.

## 5. B.L.A.S.T & A.N.T Compliance
- **Priorities**: TRUST > SECURITY > COMMUNITY VALUE > AUTOMATION > SPEED
- *Never guess. Always verify.*
