# ADR-004: Idempotent Notion Sync Engine

## Status
Accepted

## Context
The sync engine must push Markdown docs to Notion. Naive implementations create duplicates or hit rate limits with unnecessary rewrites.

## Decision
Develop a **Hash-based Idempotent Sync Engine** using the Notion SDK.

## Consequences
- **Reliability**: Uses MD5 hashes to detect changes; skips unchanged files.
- **Integrity**: Consults a local `.ai/notion-map.json` to reuse existing Page IDs.
- **Efficiency**: Minimizes API calls and respects rate limits.
- **Debuggability**: Produces local sync logs for failure analysis.
