# ADR-002: Database Schema Design

## Status
Accepted

## Date
2024-05-18

## Context
The platform requires a clear and extensible database schema to manage users, households, donations, events, and mosque operations.

## Decision
We will use a relational schema in PostgreSQL via InsForge. The core entities and their relationships are defined as follows:

*   **`users`**: Central identity table storing profile information.
*   **`roles`**: Defines access tiers (Admin, Imam, Treasurer, Member).
*   **`households`**: Groups users for family-based membership and donation tracking.
*   **`memberships`**: Links users to households with specific relationships.
*   **`donors`**: Tracks donor-specific metadata and levels.
*   **`donations`**: Records financial contributions (Sadaqah, Zakat, etc.) with status and gateway references.
*   **`campaigns`**: Manages specific fundraising goals.
*   **`events`**: Scheduled mosque activities.
*   **`event_attendees`**: Tracks RSVPs and attendance.
*   **`announcements`**: Public communication.
*   **`receipts`**: Records of donations for users.
*   **`audit_logs`**: Mandatory tracking of administrative and financial actions.

## Consequences
*   **Relational Integrity**: Using PostgreSQL ensures strong consistency and relationship management between complex entities like households and donations.
*   **Scalability**: The schema is designed to support multi-tenancy and future growth in community features.
*   **Compliance**: The `audit_logs` table ensures accountability for sensitive operations.
