/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require("@notionhq/client");
const fs = require("fs");
const path = require("path");

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PARENT_PAGE_ID = "6c227479c69b45f29f673662685b66f8";
const MAP_FILE = path.join(__dirname, "../.ai/notion-map.json");

async function createDatabase(title, emoji, properties, mapping) {
    if (mapping[title] && mapping[title].id) {
        console.log(`[EXISTING] Database: ${title} (${mapping[title].id})`);
        return;
    }

    console.log(`[CREATING] Database: ${title}...`);
    try {
        const response = await notion.databases.create({
            parent: { type: "page_id", page_id: PARENT_PAGE_ID },
            title: [{ type: "text", text: { content: title } }],
            icon: { type: "emoji", emoji: emoji },
            properties: properties
        });
        
        mapping[title] = { id: response.id, type: "child_database" };
        console.log(`[SUCCESS] Created ${title}`);
    } catch (e) {
        console.error(`[FAILED] ${title}: ${e.message}`);
    }
}

async function main() {
    if (!process.env.NOTION_TOKEN) return;

    let mapping = fs.existsSync(MAP_FILE) ? JSON.parse(fs.readFileSync(MAP_FILE, "utf-8")) : {};

    // 1. Feature Requests
    await createDatabase("Feature Requests", "💡", {
        "Feature Name": { title: {} },
        "Category": { select: { options: [{ name: "Frontend", color: "blue" }, { name: "Backend", color: "green" }, { name: "Mobile", color: "orange" }] } },
        "Priority": { select: { options: [{ name: "P0", color: "red" }, { name: "P1", color: "yellow" }, { name: "P2", color: "gray" }] } },
        "Status": { status: {} },
        "Requested By": { rich_text: {} }
    }, mapping);

    // 2. Deployment History
    await createDatabase("Deployment History", "🚢", {
        "Deployment ID": { title: {} },
        "Environment": { select: { options: [{ name: "Production", color: "green" }, { name: "Staging", color: "blue" }, { name: "Preview", color: "gray" }] } },
        "Commit Hash": { rich_text: {} },
        "Status": { status: {} },
        "URL": { url: {} }
    }, mapping);

    // 3. AI Session Logs
    await createDatabase("AI Session Logs", "🤖", {
        "Session ID": { title: {} },
        "Timestamp": { date: {} },
        "AI Agent": { select: { options: [{ name: "Gemini CLI", color: "purple" }] } },
        "Task Summary": { rich_text: {} },
        "Files Modified": { multi_select: {} },
        "Result": { status: {} }
    }, mapping);

    fs.writeFileSync(MAP_FILE, JSON.stringify(mapping, null, 2));
    console.log("Database expansion complete.");
}

main();
