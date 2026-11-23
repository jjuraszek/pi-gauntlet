# Handoff brief contract (gauntlet-resume + gauntlet-handoff supplementary)

Consumed by `gauntlet-resume/SKILL.md` (consumer) and `gauntlet-handoff/SKILL.md`
(producer). Brief grammar lives only here; both skills cite this file and inline none of it
(`scripts/ci.mjs` drift lint). The six headings before `## Process state` and the
`## Repo state` fields are pi-cohort's `handoff` skill's; cohort drift is reconciled
here and nowhere else.

## Brief grammar

Headings, fixed order. A consumer keys on headings, never prose.

```markdown
# Handoff: <one line>
## Intent
## Repo state
## Decisions
## Open questions
## Skills loaded
## Process state
```

| Section | Content | Presence |
|---|---|---|
| `## Repo state` | one field per line: `toplevel`, `worktree: yes <path>` or `worktree: no`, `branch` (`detached` when none), `HEAD`, `base` (`unknown` when no remote resolves), `dirty: <porcelain>` or `dirty: clean`, `diff-stat` (`unavailable` when base unknown), `test cmd`; any field `unavailable` when its command failed; heading `## Repo state: not a git repo` outside git | always |
| `## Decisions` | bullets; rejected alternatives marked `rejected:` | always |
| `## Skills loaded` | frontmatter `name`s; `## Skills loaded: none` when none | always |
| `## Process state` | `phase_tracker status` then `plan_tracker status` verbatim; `Active task: <name|none>`; optional one or more consecutive `PR: <owner/repo#N>` / `Pre-rework head: <40-char sha>` pairs, one per record group, home first, in record order, only for a PR subject; optional single `Rework base: <40-char sha>` after all PR pairs; for more than one member only, the coordinated block from `coordinated.md` after that line; the line `Gate history not restored - re-validate before advancing.` | only when a phase is `in_progress` and no hotfix flow is in context |

For a loop ledger (line 1 exactly `# Ledger - loop engine`), replace `Active task` with these two fields, retaining both tracker status outputs and the gate-history line:

```text
Ledger: <path>
Last decision: <line>
```

Use the ledger path relative to the worktree and the last physical decision line, or `none` for an empty Decisions section. Read the ledger on disk; the brief is a pointer, not a second ledger state carrier. Permit task rows beside a ledger: copy `plan_tracker status` verbatim, including the dispatched row's `in_progress` status and any conformance tasks with their observed statuses. Never infer task state from the brief's prose. Reject a block mixing these fields with `Active task` or missing either loop field.

Consumer rules: process state absent -> plain handoff (the consumer starts its
own process from `## Intent`). Give valid ledger fields precedence over `No plan active.` and run ledger admission (`restore-loop.md`). Restore phase-only state for `No plan active.` only with no `Ledger` field. Load named skills as the consumer.

A brief is any text whose first line starts `# Handoff:` - a file on disk or pasted
inline. `## Repo state` is matched by prefix: `## Repo state` or
`## Repo state: not a git repo`.

## Producers

`gauntlet-handoff` is the only writer of `## Process state`; it appends to the file
cohort's `handoff` skill wrote, which ends at `## Skills loaded`. Drop the trailing `Context:` line and the preceding `Instructions:` line, if present. Copy the remaining phase block verbatim. Layout, byte-exact: one blank line, the heading on its own line, a
blank line, that phase status, a blank line, the `plan_tracker status` output
verbatim, a blank line,
`Active task: <name|none>`, then, only for a PR subject, one or more consecutive
`PR: <owner/repo#N>` / `Pre-rework head: <40-char sha>` pairs, one per record group,
home first, in record order, then optional single `Rework base: <40-char sha>` after all PR pairs, then, for more than one member only, the coordinated block from `coordinated.md`, then the gate-history line after the last pair, rework-base line, or block -
unfenced, nothing after.
For a task plan, set `Active task` to the first `→` task name, else `none` (also for `No plan active.`). For a line-1 ledger, read its path and last decision and use the loop alternative above, retaining the optional PR pairs and rework base before the gate-history line. Copy the full rework base only from the top-level record when present; never invent a boundary for incomplete sync. Copy only top-level record pairs, without titles; `Threads:` and record `### PR #<N>` subsections are not brief fields. For N=1 emit one pair; without a Rework record use the ordinary layout.

Example appended block (the fence is documentation; the brief carries no fence):

```text

## Process state

Phases:
  ⊘ brainstorm (resume: <spec path>)
  ⊘ plan (resume: pasted brief)
  → implement(W2)
  ○ verify
  ○ ship

Plan: 1/3 done (1 in progress, 1 pending)

  ✓ [0] W1: contract
  → [1] W2: producer
  ○ [2] W2: consumer

Active task: W2: producer
Gate history not restored - re-validate before advancing.
```

## Tracker output grammar

Must match `formatStatus` in the phase-tracker and plan-tracker extensions.

```
Phases:
  ✓ brainstorm
  → implement(W2)
  ○ verify (reason)
```

Glyphs `✓` complete, `→` in_progress, `⊘` skipped, `○` pending; `(reason)` suffix when
set; `name(substep)` only on the in-progress phase.

```
Plan: 2/5 done (1 in progress, 2 pending)

  ✓ [0] <name>
  → [1] <name>
```

or `No plan active.`. Task glyphs `✓` complete, `→` in_progress, `✗` failed, `⊘` skipped,
`○` pending, mapping 1:1 onto `plan_tracker init` `{name, status}` statuses.

A ledger task row is `row <n>` plus a ` | <description>` display suffix (`restore-loop.md`).

Parse stops (print the offending line, make no tracker call):

- a task line not matching `^\s*[✓→✗⊘○] \[\d+\] .+$` - the "unparsable process-state
  task line" stop;
- a process-state section whose phase block shows all `○` - contradictory (the producer
  emits the section only with an in-progress phase);
- a phase block with more than one `→` line - contradictory (the tracker holds one active
  phase; print both lines).
