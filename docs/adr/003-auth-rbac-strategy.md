# ADR-003: Authentication & RBAC Strategy

## Status
Accepted

## Date
2024-05-18

## Context
Security and data privacy are paramount. We need a robust mechanism to control access to sensitive community and financial data.

## Decision
We will implement a multi-layered security strategy:

1.  **Authentication**: Handled by InsForge Auth, supporting secure login and session management.
2.  **Role-Based Access Control (RBAC)**:
    *   **Admin**: Full access to all modules and settings.
    *   **Imam**: Management of educational and religious content.
    *   **Treasurer**: Management of financial records and donations.
    *   **Member**: Access to personal profile, household, and community participation.
3.  **Row-Level Security (RLS)**: Mandatory for ALL database tables. Policies will be implemented in PostgreSQL to ensure users can only access data they are authorized to see (e.g., their own donations, their household members).
4.  **Verification**: RBAC checks will be performed dynamically on every API server function and verified at the database level via RLS.
5.  **Auditability**: All admin actions and financial operations must be logged.

## Consequences
*   **Defense in Depth**: Combining application-level RBAC with database-level RLS provides strong protection against unauthorized access.
*   **Privacy**: RLS ensures that community members' PII and financial history are isolated.
*   **Operational Security**: Detailed audit logs provide a clear trail for compliance and troubleshooting.
