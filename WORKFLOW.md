# Code Workflow

<!-- managed:linked-repos -->
## Linked Repositories
- masjidportalsite/masjidportalsite
<!-- /managed:linked-repos -->

## Default Process
1. Members push code to feature branches and create pull requests
2. The team lead reviews and merges PRs
3. Before starting new work, members should pull the latest default branch so they branch from up-to-date code

## CTO Priority Mode — ACTIVE
**Execution Order:**
1. Security
2. Authentication
3. Database integrity
4. Deployment stability
5. UI/UX polish
6. Business growth

**Rule:** NO new feature development until critical infrastructure issues are resolved.

All agents must prioritize in order above. Security Agent leads, all others follow sequence.

## End-of-Cycle Reporting
All agents MUST submit a status report at the end of every engineering cycle.

### Report Format
```
DONE:
- [List of completed tasks with links to PRs/changes]

BLOCKED:
- [Any blockers or dependencies on other agents/work]

NEXT:
- [Prioritized list of next actions for next cycle]
```

### Requirements
- Submit report to team lead via send_message
- Documentation Agent compiles all reports into /home/team/shared/docs/cycle-reports/
- Sync to Notion workspace when available
- Include metrics, task IDs, and relevant details

## Notes
- The team lead can update this file to reflect the owner's preferences (outside the managed block above, which is overwritten when the owner changes the allow-listed repositories)
- If the owner provides specific instructions about code review, branch strategy, or merge policies, update this document accordingly