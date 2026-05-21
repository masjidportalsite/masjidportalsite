# AI Engineering Standard: Security Rules

## Credential Protection
- **Zero Exposure**: Never log or print secrets, API keys, or JWT tokens.
- **Git Safety**: Ensure `.env.local` and `.insforge/project.json` are in `.gitignore`.
- **Frontend Safety**: Only `NEXT_PUBLIC_*` variables are exposed to the client.

## Data Governance
- **Raw SQL**: Parameterize all queries. Never use string interpolation for SQL.
- **Input Validation**: Use **Zod** or equivalent for all API and Server Action inputs.
- **Session Integrity**: Use `HttpOnly`, `Secure`, and `SameSite: Lax` for auth cookies.

## Compliance
- **Audit Logs**: Record major administrative changes (role changes, financial updates) to `audit_logs`.
- **Rate Limiting**: Apply to all authentication and payment-related endpoints.
