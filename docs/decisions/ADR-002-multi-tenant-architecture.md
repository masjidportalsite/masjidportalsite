# ADR-002: Multi-tenant Architecture via RLS

## Status
Accepted

## Context
The platform must support multiple independent mosques (organizations) on a single infrastructure. Data leakage between organizations is a critical security risk.

## Decision
Implement a **Multi-tenant SaaS** model using PostgreSQL **Row Level Security (RLS)**.

## Consequences
- **Integrity**: Every table includes an `organization_id`.
- **Performance**: Managed at the database level, avoiding complex app-layer filtering.
- **Safety**: SQL policies ensure that even if app code is compromised, cross-tenant data access is blocked by the database engine.
- **Complexity**: Requires careful migration management and JWT claim injection.
