# Cloudflare Model Context Protocol (MCP) Guide

This guide explains how to connect your AI assistant (Cursor, Claude Desktop, or other MCP-compatible clients) to your Cloudflare account to manage your resources directly using natural language.

---

## 1. Create a Cloudflare API Token

To authenticate the MCP server, you need a Cloudflare API Token.

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Go to **My Profile** > **API Tokens**.
3. Click **Create Token**.
4. Use the **Edit Cloudflare Workers** template, or build a custom token with the following suggested permissions:
   - **Account** > **Workers Scripts** > **Edit**
   - **Account** > **Workers Tail** > **Read**
   - **Account** > **Cloudflare Pages** > **Edit**
   - **Zone** > **DNS** > **Edit** (Optional, for managing domains)
5. Copy the generated token (it will only be displayed once).

---

## 2. Configure Your Client

### Option A: Cursor (Local Workspace)
We have pre-configured a workspace-level MCP file at [.cursor/mcp.json](file:///C:/Projects/MasjidPortalSite/.cursor/mcp.json). 
Open that file and replace `YOUR_CLOUDFLARE_API_TOKEN` with your actual API token. Cursor will automatically detect this file and establish the connection.

### Option B: Cursor (Global Configuration)
If you want to access Cloudflare across all projects in Cursor:
1. Open Cursor Settings (Ctrl + ,).
2. Navigate to **Features > MCP**.
3. Under **MCP Servers**, click **+ Add New MCP Server**.
4. Configure it as follows:
   - **Name**: `cloudflare`
   - **Type**: `command`
   - **Command**: `npx -y @cloudflare/mcp-server-cloudflare`
5. Click **+ Add environment variable** and add:
   - **Key**: `CLOUDFLARE_API_TOKEN`
   - **Value**: *[Your Token]*

### Option C: Claude Desktop
Add the following to your Claude Desktop configuration file located at `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "cloudflare": {
      "command": "npx",
      "args": [
        "-y",
        "@cloudflare/mcp-server-cloudflare"
      ],
      "env": {
        "CLOUDFLARE_API_TOKEN": "YOUR_CLOUDFLARE_API_TOKEN"
      }
    }
  }
}
```

---

## 3. Verify Connection

Once connected, you can ask your AI:
* *"What Pages projects do I have in Cloudflare?"*
* *"List my Cloudflare Workers."*
* *"Deploy the current application to Cloudflare."*
