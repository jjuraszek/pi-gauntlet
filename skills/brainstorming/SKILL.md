---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation."
---

> **Related skills:** Use `/skill:using-git-worktrees` **before** writing the spec — the spec is the worktree's first artifact. Then `/skill:writing-plans` for implementation planning.

# Brainstorming Ideas Into Designs

## Overview

Help turn ideas into fully formed designs and specs through natural collaborative dialogue.

Identify the target project → set up an isolated worktree → understand current project context → ask questions one at a time → propose 2-3 approaches with trade-offs → present the design in 200-300-word sections, validating each → write spec to disk inside the worktree → user reviews before any implementation.

## HARD CONSTRAINT

While this skill is active, do **not** take any implementation action until you have presented a design and the user has approved it. This applies to **every** change regardless of perceived simplicity. An implementation-heavy request ("test it end-to-end", "push a request to rabbit", "run the service") does not lift this gate — it just tells you what the spec must cover.

You **may**:

- Read code and docs
- Run the existing system to observe its **current** behaviour — this is research and feeds the spec (boot a local service, replay a sample request, capture a baseline classification, etc.)
- Write to the project's `doc/specs/` directory

You may **not**:

- Write or edit code outside `doc/specs/`
- Scaffold a project, or take any action that builds, deploys, or validates the **proposed change** — running new/edited code, exercising behaviour that doesn't exist yet, or "testing the fix" before there is one
- Run implementation skills (`/skill:test-driven-development`, `/skill:subagent-driven-development`, etc.)
- Commit the spec directly on `main` in the primary checkout — it must land inside the worktree (see [Worktree First](#worktree-first))
- Start writing the plan (that's `/skill:writing-plans` — separate phase)

The line: exercising the system **as it is today** is research; exercising the **change you're proposing** is implementation and waits for the gate.

This skill ends with a **written, user-reviewed spec inside a worktree**. Nothing else.

## Checklist

Work through the items below **in order**. This is your own checklist to follow, not a `plan_tracker` plan — brainstorming is open-ended exploration, and `plan_tracker` is execution-only (the implement phase). The terminal state is the user review gate; after approval the **only** next skill is `/skill:writing-plans`. Do not jump to implementation, and do not silently drop the critique pass.

1. **Start brainstorm tracking (fresh epoch)** — as the **first action on entry**, before reading code, setting up the worktree, or answering the user, reset **both** trackers and then start the phase. A new brainstorm is a new flow, so it owns a clean slate — clear any stale phases *and* tasks left in the session by earlier work:

   ```
   phase_tracker({ action: "reset" })   // clears all phases
   plan_tracker({ action: "clear" })    // clears all tasks
   phase_tracker({ action: "start", phase: "brainstorm" })
   ```

   Re-entering while a brainstorm is already in progress is safe: mid-brainstorm there are no tasks or later phases to lose, so the reset just re-establishes the same clean slate.
2. **Set up the worktree** — see [Worktree First](#worktree-first)
3. **Explore project context** — files, docs, recent commits, current behaviour
4. **Ask clarifying questions** — one at a time
5. **Propose 2-3 approaches** — with trade-offs and a recommendation
6. **Present the design** — in sections, get approval after each
7. **Write the spec** — to `doc/specs/` (see [Filename Convention](#filename-convention))
8. **Spec self-review (lint)** — placeholder scan + internal consistency + documentation named, run inline
9. **Critique pass (auto-dispatched)** — scope + ambiguity; the spec council via `/skill:roasting-the-spec` when `gauntlet_setting` returns verdict `council`, else a fresh `worker` (see [Spec Council](#spec-council-optional))
10. **Re-run placeholder scan** — after the critique pass returns, first inline any `external-ref:` flags it raised (see [Spec Self-Review](#spec-self-review-before-user-review-gate)), then re-scan for placeholders its edits may have introduced; surface any ambiguity the worker could not safely resolve at the user gate
11. **Generate spec summary** — dispatch a fresh, spec-only `spec-summarizer` writing to an absolute temp-dir path via `outputMode: "file-only"`, then `Read` that file back as the **last content-producing** tool call before composing the gate and render its contents **verbatim** at the top of the gate message — do not paraphrase, condense, re-section, or rewrite it (see [User Review Gate](#user-review-gate)); this is part of the existing gate, not a new one
12. **User review gate** — user reviews the committed spec
13. **Transition** — only after approval, invoke `/skill:writing-plans`

## Project Routing

Before brainstorming, identify the target project. The match drives the spec directory, AGENTS.md to read, and verification commands.

Read the repo's top-level `AGENTS.md` (already in pi's context) and any service-level `AGENTS.md` for the area the user mentioned. If the project documents a routing table mapping subprojects to spec directories and verification commands, follow it. Otherwise rely on the conventions you find.

Detection order:

1. Issue tracker reference (Linear, Jira, GitHub Issues) → infer from labels, description, or mentioned file paths
2. cwd inside a service / package directory → use that area
3. Unclear → ask the developer

If the project's `AGENTS.md` calls out additional reading for a specific area (e.g. a TDD workflow doc), read it before brainstorming work in that area.

## Worktree First

The spec is the **first commit in a dedicated worktree**, not a separate commit on `main`. Before drafting any spec content:

1. Invoke `/skill:using-git-worktrees`. Worktrees live under `.worktrees/` at the repo root, or wherever a project-native worktree script places them.
2. Switch into the worktree.
3. From there, write the spec, run self-review, commit, hand off.

Spec doc, plan doc, and implementation are all developed in the same worktree; the squash ships the spec and the implementation, with the ephemeral plan stripped before landing (see `/skill:finishing-a-development-branch`).

**Exception:** trivial one-off edits the user explicitly asks for outside this skill flow (e.g. "fix this typo") do not require a worktree.

## The Process

### 1. Check git state

```bash
git status
git --no-pager log --oneline -5
```

If on a feature branch with uncommitted or unmerged work, ask:

> "You're on `<branch>` with uncommitted changes. Want to finish/merge that first, stash it, or continue here?"

Require one of: finish prior work, stash, or explicit "continue here". If the topic is new, set up the worktree per [Worktree First](#worktree-first) before continuing.

### 2. Scope check

If the request spans multiple independent subsystems (e.g., "build a new ingestion pipeline and a new admin UI and a new auth flow"), stop and flag it:

> "This looks like 2-3 independent specs to me — A, B, C. Should we brainstorm each separately, or is there a tight coupling I'm missing?"

Don't try to design a multi-subsystem monolith in one spec doc.

### 3. Understand the idea

- Check the current project state first: files, docs, recent commits, neighboring services.
- **Check if the codebase or ecosystem already solves this** before designing from scratch. Grep, read existing AGENTS.md, look at `doc/` and `doc/specs/`.
- Ask questions **one at a time** to refine the idea.
- Prefer multiple-choice questions; open-ended is fine when needed.
- One question per message. If a topic needs more exploration, split into multiple turns.
- Focus on: purpose, constraints, success criteria, who/what it touches.

### 4. Explore approaches

- Propose 2-3 different approaches with trade-offs.
- Lead with your recommended option and explain why.
- Present conversationally — don't dump a comparison table unless the user asks.

### 5. Design for clarity and isolation

When sketching the design, prefer:

- **Clear boundaries** — clean interfaces between components, easy to test in isolation.
- **YAGNI ruthlessly** — every component you add is a component you must maintain.
- **Match existing patterns** — if a service has a convention, follow it. Reference the service's `AGENTS.md` and neighboring code.
- **Single source of truth** — point at the schema/contract that owns the data (the migration, type definition, or API contract that defines it); don't invent parallel state.
- **Explicit error and edge cases** — name them. "Out of scope" is a valid answer, but it has to be stated.

### 6. Present the design in sections

Sections of 200-300 words. Ask after each whether it looks right.

Cover at minimum:

- Architecture overview
- Components / responsibilities
- Data flow (or request flow)
- Error handling and edge cases
- Testing approach
- Documentation impact — a required `## Documentation impact` section. Cite the materiality bar in `reference/documentation-impact.md` by relative path rather than restating its categories, and reproduce its template block verbatim:

  ```markdown
  ## Documentation impact
  - Feature / user-facing docs introduced: <list, or "none">
  - Materially amended existing docs: <list, or "none">
  - Derived / memory docs invalidated: <routers / AGENTS.md sections / topic guides / indexes, or "none">
  ```

  Each entry answers with a doc name, "none", or "deferred: <trigger>". A new standalone `.md` appears only where no existing doc already owns the topic. Project-specific doc taxonomy goes in a `## documentation` block in `.pi/gauntlet-overrides.md` (no new settings key; guidance only). Doc updates ship in the same commit and are verified against the spec by the conformance gate.

Be ready to go back and clarify when something doesn't make sense.

## Linear Ticket Handling

When a ticket ID is given, fetch the ticket and treat it as **guidance, not the sole source of truth**. Propose changes to scope, approach, or acceptance criteria when they don't align with the codebase. Surface deviations in the spec doc.

## First-Feature Oversight (Early Project Stages)

For the **first two features** of a new initiative — a new top-level module/package, a new long-lived component, a new persistence/schema area, or any pattern that will repeat — pause and ask the developer to confirm before proceeding on:

- Directory and module structure decisions
- Naming conventions (public types, files, routes, identifiers)
- New shared abstraction (location, responsibility, boundary)
- Persistence/schema design (entity names, field types, indexing)
- Proposed additions to AGENTS.md or doc/ files

If the developer hasn't provided guidance, ask explicitly:
> "This is one of the first features in this initiative. Before I proceed, I need your confirmation on: [list specific decisions]."

After the first two features establish patterns, follow those patterns without gating.

## Anti-Pattern: "Too simple to need a design"

Watch for the rationalization "this is just a small change, let's skip the spec and code it":

- Small changes that touch shared schemas, contracts, or invariants need a spec.
- "Small" often hides assumptions that the spec process would surface.
- A 5-minute spec saves an hour of rework when the assumption was wrong.

If the change truly is mechanical and contained (rename, formatter run, dependency bump), say so explicitly and skip brainstorming. Otherwise: spec first.

## Filename Convention

Spec lives in the project's `doc/specs/` (see [Project Routing](#project-routing)) with one of:

- With Linear ticket: `YYYY-MM-DD-E-12345-<topic>.md`
- Without Linear ticket: `YYYY-MM-DD-<topic>.md`

`<topic>` is a short kebab-case slug (3–6 words). Do **not** append `-design` or any other suffix.

## Spec Self-Review (Before User Review Gate)

After writing the spec to `<project>/doc/specs/<filename>.md` (per [Filename Convention](#filename-convention)) and before showing it to the user, run a self-review pass. **Read all five bullets first, then act:** only the **first three** run here at the main loop (the inline lint); the **last two** (scope + ambiguity) do **not** run inline — they are the dispatched critique pass (checklist item 9). Do not apply scope/ambiguity edits yourself.

- **Placeholder scan.** Any `TODO`, `TBD`, `<fill in>`, `[example]`, `xxx`? Either resolve them or convert to explicit "Open Questions" with names.
- **Internal consistency.** Does Section 4 contradict Section 2? Are component names and field names consistent throughout?
- **Documentation named.** Does the spec name all three classes (feature/user-facing introduced; materially amended; derived/memory invalidated), or an explicit "none" for each? Enforce the materiality bar in `reference/documentation-impact.md` without restating it: each listed doc names the category it clears, none is a code-mirror, amend-over-create was applied, and skill/agent bodies are implementation surface, not doc-impact entries here.
- **Scope check.** Does every paragraph serve the goal? Cut filler. If something is out of scope, say it's out of scope.
- **Ambiguity check.** Is every "we should…" backed by a concrete decision? Replace "we could probably" with "we will" or "we won't".

The first three checks — **placeholder scan**, **internal consistency**, and **documentation named** — are the inline **lint**: run them here at the main loop and fix what they surface. The last two — **scope** and **ambiguity** — are **not** run inline; they are the **critique pass**, auto-dispatched (per [Spec Council](#spec-council-optional)):

- **Council** (`gauntlet_setting({ key: "specCouncil" })` returns verdict `council`) → invoke `/skill:roasting-the-spec`; it runs the critique and proposes dispositions.
- **Otherwise** → dispatch one fresh `worker` that applies the scope + ambiguity checks and fixes them in place:

  ```
  subagent({ agent: "worker", context: "fresh", cwd: "<abs worktree path, from git rev-parse --show-toplevel>", task:
    "Problem statement: <the problem the spec addresses + the user's stated intent>.\n" +
    "Read the spec at <abs path to doc/specs/...>. Edit ONLY that file. Apply two checks and\n" +
    "fix what you find in place: (1) Scope — does every paragraph serve the goal? Cut filler;\n" +
    "state out-of-scope explicitly. (2) Ambiguity — is every 'we should' a concrete decision?\n" +
    "Replace 'we could probably' with 'we will'/'we won't'. Also flag (do NOT fetch) any\n" +
    "load-bearing external reference (ticket AC, commit SHA, doc) the spec relies on but does\n" +
    "not inline, and recommend inlining it. Return a summary of what you changed, and flag any\n" +
    "ambiguity you could NOT safely resolve." })
  ```

  `worker`'s model resolves from `subagents.agentOverrides.worker.model` in `settings.json` (unset → inherits the main loop); the dispatch passes no `model:`.

After the critique pass returns, scan it for load-bearing external references before re-running the placeholder scan: in the council path, look for chair clusters whose theme is prefixed `external-ref:`; in the worker path, look for the worker's external-ref flag. For each, inline the referenced content you have context for (e.g. the ticket fetched during brainstorming) via the normal disposition/edit path - you hold the ticket, the critics do not. Then re-run the placeholder scan to catch anything the edits introduced. If the worker flagged ambiguities it could not safely resolve, surface them in the [User Review Gate](#user-review-gate) message so the user decides - the worker auto-applies fixes but never silently swallows an open question.

## Spec Council (Optional)

After the inline lint and before the user review gate, **brainstorming owns the critique-pass gate**. Resolve the council with `gauntlet_setting({ key: "specCouncil" })` - the tool returns the merged (repo-over-preset) value as `{ verdict, members, chair, malformed, warning, errors }`. **Do not** hand-roll a settings read. When `verdict` is `"council"`, the council *is* the critique pass - invoke `/skill:roasting-the-spec` automatically (no offer, no prompt), passing `members`/`chair`. When `verdict` is `"worker"`, run the fresh-`worker` critique instead (see [Spec Self-Review](#spec-self-review-before-user-review-gate)). If `malformed` is true or `errors` is non-empty, emit the `warning`/error as one line, then branch strictly on `verdict` - `malformed` can accompany *either* verdict (e.g. a bad `chair` with valid `members` still returns `council`), so never infer the worker path from `malformed` alone. If `gauntlet_setting` is unavailable, stop and report - never fall back to a manual bash/JSON settings merge. Approved council edits (or the worker's in-place fixes) ride in the same worktree commit. The conceptual precedence rule lives in `verification-before-completion/reference/settings-precedence.md`.

## User Review Gate

After self-review (and council review, if configured) and after inlining any external-ref flags, dispatch the spec-only summarizer, then commit the spec on the worktree branch and stop. This is the **same** single human gate - the summary is folded into it, not a new gate.

Mint an absolute temp path outside the worktree (so it is never committed), then dispatch the summarizer on a fresh context, reading only the spec, writing to that path via file-only output (no `model:` - it inherits the main loop unless a preset sets `subagents.agentOverrides.spec-summarizer.model`):

```bash
SUMMARY_PATH=$(mktemp "${TMPDIR:-/tmp}/gauntlet-spec-summary.XXXXXX")   # absolute, portable across GNU/BSD mktemp
```

```
subagent({ agent: "spec-summarizer", context: "fresh", cwd: "<abs worktree path, from git rev-parse --show-toplevel>",
  output: "<SUMMARY_PATH>", outputMode: "file-only", task:
  "Summarize the spec at <abs path to doc/specs/...> for the user review gate. Read ONLY that file." })
```

`<SUMMARY_PATH>` above is a placeholder in the dispatch object; it means substitute the value of the shell variable `$SUMMARY_PATH` set above. The steps below use `$SUMMARY_PATH` (the shell form) once the value is in hand.

Then commit the spec — this commit is **unconditional**: the summary is only a gate aid, so a degraded or missing summary never blocks it. Evaluate the summary in two stages (the **Degrade path** referenced in each is defined just below):

1. **From the dispatch tool result, before the `Read`.** If the result is **not** an `"Output saved to: <path> (<N> KB, <M> lines)"` reference (e.g. an exit-0 save error returns the full inline output plus an "Output file error" line — the prunable shape, no file to read), or the reference reports under ~500 bytes, or a size grossly disproportionate to the spec (under ~2% of its byte size), or over ~45 KB (the `Read` truncates at 50KB / 2000 lines, so a larger file cannot render whole) — skip the `Read` and take the degrade path. Use the reference's reported figures; do not re-derive them.
2. **The `Read` itself, as the last content-producing tool call before composing the gate.** `Read` `$SUMMARY_PATH` and paste its contents verbatim at the top of the gate. If the `Read` fails, returns 0 bytes, or reports truncation — take the degrade path. The `Read` must be last: pi-condense does not protect a `/tmp` read, so any turn boundary between the `Read` and the render lets the ~9KB read result be pruned, reproducing the bug.

**Degrade path** — reach the gate with a one-line "summary generation failed" note; never paraphrase from the file-only reference, never render a stub as the canonical summary.

Either way — summary rendered or degraded — then `rm "$SUMMARY_PATH"` (unconditional cleanup; harmless if the file was never created, since it lives outside the worktree under the OS temp dir).

Render the temp file's contents **verbatim** first — paste it as-is, do **not** paraphrase, condense, re-section, drop sections, or merge it with council output. "Fold into the gate" means *place it inside the gate message*, not *rewrite it*. After the verbatim block, append the commit confirmation, then — as their **own** adjacent lines, not edits to the summary — any council outcome, critique-pass-unresolved ambiguities, and every entry from the summarizer's gap/external-context footer (surface **all** of them, not just the top risk):

```
<spec-only summary read back from the temp file — pasted verbatim, unedited>

Spec written and committed to <project>/doc/specs/<filename>.md (worktree: <path>).

<council outcome, if any; unresolved ambiguities; every gap-footer entry from the summary>

Please review. Approve to proceed, or tell me what to change in the spec.
```

If you believe the summary needs correcting, do **not** silently rewrite it — re-dispatch the summarizer or note the discrepancy as an adjacent line beneath the verbatim block.

Wait for the user. On a change request, revise the spec and re-present — mint a **fresh** temp path for the re-dispatched summarizer (never reuse a prior round's path, so stale content can never be mistaken for the new summary). On approval, proceed immediately to `/skill:writing-plans` with no further prompt — the plan and execution mode are mechanical derivatives, so the only human gate here is spec approval itself. Don't land the spec on `main`; it stays in the worktree and ships in the same squash commit as the implementation.

After approval, mark the brainstorm phase complete:

```
phase_tracker({ action: "complete", phase: "brainstorm" })
```

## Key Principles

- **One question at a time.**
- **Multiple choice preferred** when possible.
- **YAGNI ruthlessly.**
- **Design for testability** — clear boundaries enable TDD.
- **Explore 2-3 approaches** before settling.
- **Incremental validation** — present in sections, validate each.
- **Be flexible** — go back and clarify when something doesn't make sense.

## Red Flags — STOP

- About to write code or start a non-spec edit while this skill is active
- About to run, deploy, or validate the **proposed change** (vs. observing current behaviour) before the user approved the design
- About to skip the critique pass (council if configured, else fresh worker)
- Critique dispatch (council or worker) failed to complete and you proceeded to the gate anyway
- About to reach the user gate without re-running the placeholder scan after the critique returned
- About to reach the user gate without rendering the spec-only summary (dispatch `spec-summarizer` to a temp file first; a failed/stub/truncated read degrades to a one-line note, it is not silently skipped)
- About to compose the gate message when the summary `Read` was not the last content-producing tool call before it (a following `rm` of the temp file is fine) — a turn boundary between the `Read` and the render lets pi-condense prune the ~9KB read result, reproducing the original bug
- About to present a paraphrased, condensed, or re-sectioned version of the summarizer's output instead of pasting its returned text verbatim — rewriting the summary counts as not rendering it
- About to run the scope or ambiguity checks inline yourself instead of dispatching them (those two are the critique pass, not the inline lint)
- About to skip the self-review pass
- About to proceed to `/skill:writing-plans` before the user has approved the spec (proceeding *after* approval is correct; skipping the gate is the violation)
- Spec contains `TODO`, `TBD`, or unnamed components
- Spec spans multiple independent subsystems with no decomposition flag
- User said "this is just a small change" and you accepted it without applying the [Anti-Pattern](#anti-pattern-too-simple-to-need-a-design) check

## Project overrides

If `.pi/gauntlet-overrides.md` exists, read it. Any sections relevant to this skill — by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention — override or extend the instructions above. Project-local `AGENTS.md` is already in context — check it for project-specific routing tables, service paths, and verification commands.
