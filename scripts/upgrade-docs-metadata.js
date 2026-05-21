/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname, "../.docs");
const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith(".md"));

const metadataMap = {
    "architecture.md": { title: "System Architecture", domain: "architecture", priority: "high", tags: ["tech-stack", "layers"] },
    "frontend.md": { title: "Frontend Architecture", domain: "frontend", priority: "medium", tags: ["nextjs", "shadcn"] },
    "backend-integration.md": { title: "Backend Integration", domain: "backend", priority: "high", tags: ["insforge", "sdk", "pg"] },
    "ui-ux-standards.md": { title: "UI/UX Standards", domain: "frontend", priority: "medium", tags: ["design", "sanctuary"] },
    "deployment.md": { title: "Deployment Guide", domain: "deployment", priority: "high", tags: ["vercel", "cicd"] },
    "env-vars.md": { title: "Environment Variables", domain: "infrastructure", priority: "high", tags: ["security", "config"] },
    "ai-rules.md": { title: "AI Operating Rules", domain: "agents", priority: "high", tags: ["governance", "rules"] },
    "project-overview.md": { title: "Project Overview", domain: "general", priority: "medium", tags: ["vision", "roadmap"] },
    "tasks.md": { title: "Pending Tasks", domain: "management", priority: "medium", tags: ["todo", "active"] },
    "bugs.md": { title: "Bug Tracker", domain: "management", priority: "high", tags: ["issues", "resolved"] },
    "changelog.md": { title: "Project Changelog", domain: "general", priority: "low", tags: ["history", "milestones"] },
    "prompt-templates.md": { title: "Prompt Templates", domain: "agents", priority: "low", tags: ["efficiency", "templates"] },
    "vercel-issues.md": { title: "Vercel Troubleshooting", domain: "deployment", priority: "medium", tags: ["errors", "webpack"] }
};

for (const file of files) {
    const filePath = path.join(DOCS_DIR, file);
    let content = fs.readFileSync(filePath, "utf-8");

    if (content.startsWith("---")) {
        console.log(`[SKIPPED] ${file} already has frontmatter.`);
        continue;
    }

    const meta = metadataMap[file] || { title: file.replace(".md", ""), domain: "general", priority: "medium", tags: [] };
    const date = new Date().toISOString().split("T")[0];

    const frontmatter = `---
title: ${meta.title}
domain: ${meta.domain}
status: active
priority: ${meta.priority}
tags:
${meta.tags.map(t => `  - ${t}`).join("\n")}
last_updated: ${date}
---

`;

    fs.writeFileSync(filePath, frontmatter + content);
    console.log(`[UPGRADED] ${file}`);
}
