# ADR-001: Use InsForge for Backend Services

## Status
Accepted

## Context
The Masjid Portal needs a reliable, serverless backend that supports PostgreSQL, Authentication, and Storage. Traditional setups (custom Express servers) introduce high maintenance overhead for a solo developer.

## Decision
Adopt **InsForge.dev** as the primary Backend-as-a-Service (BaaS) provider.

## Consequences
- **Speed**: Instant provisioning of DB, Auth, and Storage.
- **Cost**: Pay-as-you-go serverless model.
- **Lock-in**: High coupling to InsForge SDK, mitigated by using Adapter patterns.
- **Security**: Leveraging managed RLS and JWT verification.
