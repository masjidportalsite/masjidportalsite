/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require("@notionhq/client");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

/**
 * Advanced Notion Sync Engine (v2)
 * 
 * Features:
 * - Incremental Hash Sync (MD5)
 * - Exponential Backoff Retry Logic
 * - Dry Run Mode (--dry-run)
 * - Force Mode (--force)
 * - Persistent Page Mapping
 * - Rate Limit Protection (Batching)
 * - Failure Isolation
 * - Sync Logging
 */

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const MAP_FILE = path.join(__dirname, "../.ai/notion-map.json");
const STATE_FILE = path.join(__dirname, "../.ai/notion-sync-state.json");
const SYNC_LOG = path.join(__dirname, "../.ai/logs/sync/notion-sync.log");
const DOCS_DIR = path.join(__dirname, "../.docs");

const IS_DRY_RUN = process.argv.includes("--dry-run");
const IS_FORCE = process.argv.includes("--force");

const docToFileMap = {
    "System Architecture": "architecture.md",
    "Frontend Development": "ui-ux-standards.md",
    "Backend Integration": "backend-integration.md",
    "Vercel Deployment": "deployment.md",
    "Environment Variables": "env-vars.md",
    "AI Operating Rules": "ai-rules.md",
    "Project Overview": "project-overview.md"
};

function log(msg, level = "INFO") {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] [${level}] ${msg}`;
    console.log(formatted);
    fs.appendFileSync(SYNC_LOG, formatted + "\n");
}

function getFileHash(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, "utf-8");
    return crypto.createHash("md5").update(content).digest("hex");
}

/**
 * Parses markdown and removes YAML frontmatter if present.
 */
function parseMarkdown(content) {
    const lines = content.split("\n");
    if (lines[0] === "---") {
        const endIdx = lines.slice(1).indexOf("---") + 1;
        if (endIdx > 0) {
            return lines.slice(endIdx + 1).join("\n").trim();
        }
    }
    return content.trim();
}

function mdToBlocks(markdown) {
    const lines = markdown.split("\n");
    const blocks = [];
    for (let line of lines) {
        if (!line.trim()) continue;
        const text = line.substring(0, 2000);
        if (line.startsWith("# ")) {
            blocks.push({ object: "block", type: "heading_1", heading_1: { rich_text: [{ type: "text", text: { content: line.replace("# ", "") } }] } });
        } else if (line.startsWith("## ")) {
            blocks.push({ object: "block", type: "heading_2", heading_2: { rich_text: [{ type: "text", text: { content: line.replace("## ", "") } }] } });
        } else if (line.startsWith("- ")) {
            blocks.push({ object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: [{ type: "text", text: { content: line.replace("- ", "") } }] } });
        } else {
            blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: text } }] } });
        }
        if (blocks.length >= 95) break;
    }
    return blocks;
}

async function retry(fn, retries = 3, delay = 1000) {
    try {
        return await fn();
    } catch (e) {
        if (retries === 0) throw e;
        log(`Retrying after error: ${e.message}`, "WARN");
        await new Promise(r => setTimeout(r, delay));
        return retry(fn, retries - 1, delay * 2);
    }
}

async function updatePage(pageId, title, content) {
    if (IS_DRY_RUN) {
        log(`[DRY RUN] Would update page: ${title} (${pageId})`);
        return;
    }

    const blocks = mdToBlocks(content);
    
    // 1. Fetch children
    const existing = await retry(() => notion.blocks.children.list({ block_id: pageId }));
    
    // 2. Delete existing
    for (const block of existing.results) {
        await retry(() => notion.blocks.delete({ block_id: block.id }));
    }
    
    // 3. Append new
    await retry(() => notion.blocks.children.append({
        block_id: pageId,
        children: blocks
    }));
}

async function sync() {
    log(`Sync started (Force: ${IS_FORCE}, Dry Run: ${IS_DRY_RUN})`);
    
    if (!fs.existsSync(MAP_FILE)) {
        log("Mapping file not found.", "ERROR");
        return;
    }

    const mapping = JSON.parse(fs.readFileSync(MAP_FILE, "utf-8"));
    let state = fs.existsSync(STATE_FILE) ? JSON.parse(fs.readFileSync(STATE_FILE, "utf-8")) : {};

    for (const [title, info] of Object.entries(mapping)) {
        if (info.type !== "child_page") continue;
        
        const file = docToFileMap[title];
        if (!file) continue;

        const filePath = path.join(DOCS_DIR, file);
        const hash = getFileHash(filePath);
        
        if (!hash) {
            log(`File not found: ${file}`, "WARN");
            continue;
        }

        if (!IS_FORCE && state[title] === hash) {
            log(`[SKIPPED] ${title} (No changes detected)`);
            continue;
        }

        try {
            log(`[SYNCING] ${title}...`);
            const rawContent = fs.readFileSync(filePath, "utf-8");
            const cleanContent = parseMarkdown(rawContent);
            
            await updatePage(info.id, title, cleanContent);
            
            if (!IS_DRY_RUN) {
                state[title] = hash;
                fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
            }
            log(`[SUCCESS] ${title}`);
        } catch (e) {
            log(`[FAILED] ${title}: ${e.message}`, "ERROR");
        }
    }
    
    log("Sync process finished.");
}

sync();
