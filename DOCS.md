# Shared AI Memory & Documentation System

This project uses a hybrid documentation strategy to ensure "Shared Memory" across AI sessions and a clear roadmap for developers.

## 1. Local Documentation (`.docs/`)
The **Source of Truth**. Markdown files are stored locally for fast AI context loading and offline access.
- `project-overview.md`: Vision and core features.
- `architecture.md`: Technical stack and layers.
- `ai-rules.md`: Operational constraints for AI agents.
- `tasks.md`: Roadmaps and pending items.
- `bugs.md`: Issue tracking.
- `env-vars.md`: Infrastructure requirements.
- `ui-ux-standards.md`: Design guidelines.

## 2. Shared Memory (Notion)
Used for cross-session persistence and collaboration.
- **Sync Command**: `npm run docs:sync`
- **Requirements**:
  - `NOTION_TOKEN`: Integration secret.
  - `NOTION_OVERVIEW_ID`: Page ID for overview.
  - `NOTION_ARCH_ID`: Page ID for architecture.
  - `NOTION_TASKS_ID`: Page ID for task board.
  - `NOTION_BUGS_ID`: Page ID for bug tracking.

## 3. Operational Skills (`.skills/`)
Specialized AI operational guidance. Load these files (e.g., `Activate Frontend`) to change the AI's persona and focus.

## 4. Why Notion?
Notion acts as the "Long-term Memory" where progress, logs, and high-level decisions are archived, allowing new AI instances to "download" the current state of the project beyond what is in the immediate git diff.

---
**Setup**: Create a Notion Integration at [developers.notion.com](https://developers.notion.com) and share your project pages with it.
