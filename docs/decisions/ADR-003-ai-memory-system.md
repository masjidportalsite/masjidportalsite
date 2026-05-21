# ADR-003: AI Memory System

## Status
Accepted

## Context
Development involves multiple AI sessions. Without a shared memory system, subsequent sessions lose context of architectural decisions, bugs, and operating rules, leading to regressions.

## Decision
Implement a **Hybrid Memory System** combining local Markdown documentation and a **Notion Persistent Layer**.

## Consequences
- **Continuity**: Future AI agents can read the project state from Notion.
- **Speed**: Local `.docs/` files provide instant context for the current session.
- **Transparency**: Humans can monitor AI progress via the Notion dashboard.
- **Maintenance**: Requires an automated sync engine to keep Notion and Git in sync.
