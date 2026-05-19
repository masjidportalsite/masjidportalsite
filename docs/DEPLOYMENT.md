# Deployment Procedures

## Overview
MasjidPortalSite is deployed using a modern CI/CD pipeline targeting Vercel for the frontend and InsForge Cloud for the backend.

## Environments
*   **Production**: `main` branch.
*   **Preview/Staging**: All other branches (via Vercel Preview Deployments).

## Deployment Steps

### 1. Prerequisite
*   Ensure all environment variables are configured in the Vercel Dashboard.
*   Required variables include:
    *   `INSFORGE_PROJECT_URL`
    *   `INSFORGE_ANON_KEY`
    *   `INSFORGE_SERVICE_ROLE_KEY`
    *   `DATABASE_URL` (for migrations)
    *   `PAYMENT_GATEWAY_KEYS`

### 2. Frontend Deployment (Vercel)
*   Deployments are automatically triggered on push to GitHub.
*   **Manual Deployment**:
    ```bash
    vercel --prod
    ```

### 3. Backend Deployment (InsForge)
*   Apply database migrations:
    ```bash
    # Example using Supabase/InsForge CLI if available
    insforge db push
    ```
*   Deploy Server Functions.

### 4. Verification
*   Check Vercel deployment logs for build errors.
*   Run the QA smoke test suite against the deployed URL.

## Rollback Procedure
*   **Vercel**: Use the Vercel dashboard to "Promote" a previous stable deployment.
*   **Database**: Roll back migrations using the migration tool if data-compatible, or restore from the latest snapshot if critical.
