bundle+: skills/shape-ticket/SKILL.md
bundle+: skills/shape-ticket/reference/ticket-wording.md

Use only the inline snapshots, documents and audit files below. Tools are disabled; describe prescribed calls and writes, never claim live execution. Treat each independent checkpoint separately. Keep the entire reply at most 1200 words; use one diff per changed body, not a second full copy.

Start Gather audit dispatch for nine distinct refs ABC-601 through ABC-609 in that order. All serial tracker fetches succeeded. `git rev-parse --show-toplevel` resolved /tmp/report-repo. One temp root is /tmp/shape-ticket-audit; snapshots exist at /tmp/shape-ticket-audit/<ref>/snapshot.md with body/comments/link summaries fenced as untrusted. Ticket metadata is clean; snapshots each contain:
## Context
A support review triggered this request. Today exports download report rows.
## Problem
Recipients must retry empty downloads. Example: a 12-row report downloads as zero rows.
source: https://example.test/report/12
## Idea
reporter proposes preserving report rows on download.
## Acceptance Criteria
- [ ] Given a 12-row report, downloading produces 12 rows.
Root AGENTS.md routes exports to docs/export.md. Installed scout: inheritSkills false; tools read,grep,find,ls,bash,write; no browser; default # Code Context/context.md. Parent capabilities: tracker reads `tracker issue get <ref> --json`; PR reads `gh pr list --search "<ref>" --limit 20`; authorized staging read `reports read <id>`. Resolved overrides ## shape-ticket contains `- sibling: ../viewer`. Each brief receives no sibling read path and the parent-retained line `Sibling: ../viewer - not a clone url; use git@host:owner/name.git or https://host/owner/name.git`, copied verbatim by each scout. agentOverrides owns scout model.
Installed cohort source facts: src/shared/types.ts:951 default parallel.maxTasks 8; src/runs/foreground/subagent-executor.ts:1558-1563 rejects >8 top-level tasks with Max 8 tasks and zero results; src/runs/foreground/chain-execution.ts:757-779 single parallel chain step has no cap but any failed task fails the step.
Prescribe exact top-level calls and nine output paths, not live calls. Give one shared self-contained brief expanded by ref/path (include all six required labels and capability commands), not nine repeated briefs. Every expected valid audit has:
Claims: none
Repo-fit: kept
AC-fit: clear
Sibling: ../viewer - not a clone url; use git@host:owner/name.git or https://host/owner/name.git
In-motion: none
Scenario: none (nothing to observe - new capability)
Disk checkpoint after terminal results: ABC-601 missing audit; ABC-602 empty; ABC-603 file missing Scenario line; ABC-604 valid six-label file above despite a failed tool-result label; remaining five valid. State per-ticket fold-in disposition. Independent dispatch checkpoints: returned async handle; erroneous nine-task call rejected Max 8 tasks. Do not poll, retry or change consumer config.
