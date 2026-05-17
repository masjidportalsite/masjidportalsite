# Cloudflare GitHub Deployment Guide

Since you are deploying the Masjid Portal site via GitHub to Cloudflare, you have two highly reliable approaches:

---

## Option A: Automated GitHub Actions (Recommended)

We have pre-configured a GitHub Actions CI/CD pipeline at [.github/workflows/deploy.yml](file:///C:/Projects/MasjidPortalSite/.github/workflows/deploy.yml). Whenever you push or merge code to your `main` or `master` branch, it automatically builds and deploys your Next.js application using OpenNext to Cloudflare Workers.

### Setup Instructions:
1. Ensure `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are configured in your Cloudflare dashboard (see [CLOUDFLARE_MCP.md](file:///C:/Projects/MasjidPortalSite/CLOUDFLARE_MCP.md)).
2. Go to your GitHub repository > **Settings** > **Secrets and variables** > **Actions**.
3. Under **Repository secrets**, click **New repository secret**:
   - **Name**: `CLOUDFLARE_API_TOKEN`
   - **Value**: *[Your Cloudflare API Token]*
4. Add another repository secret:
   - **Name**: `CLOUDFLARE_ACCOUNT_ID`
   - **Value**: *[Your Cloudflare Account ID]*
5. Push the changes to GitHub—that's it! GitHub Actions will take care of the build and deployment automatically.

---

## Option B: Native Cloudflare Pages Dashboard Integration

If you prefer to configure deployment entirely within the Cloudflare Pages UI dashboard:

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create** > **Pages** > **Connect to Git**.
3. Select your GitHub repository.
4. Set the following build settings:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npx @opennextjs/cloudflare build`
   - **Build Output Directory**: `.open-next/assets`
   - **Node.js Version**: Under the environment variables section in the build settings, add `NODE_VERSION` with the value `20`.
5. Under Build Settings > **Compatibility Flags**, add the following flag for **Production**:
   - Value: `nodejs_compat`
6. Click **Save and Deploy**.
