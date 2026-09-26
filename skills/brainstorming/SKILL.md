---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation."
---

> **Related skills:** Use `/skill:using-git-worktrees` **before** writing the spec — the spec is the worktree's first artifact. Then `/skill:writing-plans` for implementation planning.

# Brainstorming Ideas Into Designs

## Overview

Help turn ideas into fully formed designs and specs through natural collaborative dialogue.

Identify the target project → set up an isolated worktree → understand current project context → ask questions one at a time → propose 2-3 approaches with trade-offs → present the design in two rounds → write spec to disk inside the worktree → user reviews before any implementation.

## HARD CONSTRAINT

Do **not** implement until the design is presented and approved, regardless of simplicity. Implementation-heavy requests define spec scope; they do not lift this gate.

You **may** read code/docs, run the existing system to observe current behavior, write under `doc/specs/`, and `edit` a predecessor spec there to add a [supersession banner](reference/superseding.md).

You may **not** write outside `doc/specs/`; build, deploy, validate, or exercise the proposed change; run implementation skills; commit the spec on `main`; or start `/skill:writing-plans`.

The line: current-system observation is research; exercising the proposed change waits for approval.

## Foreground dispatch policy

Set top-level `async: false` on every flow-owned dispatch and leave `forceTopLevelAsync` unset or false. If a dispatch still returns an async handle, stop and report; do not poll, relaunch, or advance. A detached child is incomplete work: use the existing coordination path, never accept or duplicate it. Preserve independent parallel `tasks` batches and await all terminal results before acceptance or tracker/phase advancement.

## Checklist

Work through the items below **in order**. This is your own checklist to follow, not a `plan_tracker` plan — brainstorming is open-ended exploration, and `plan_tracker` is execution-only (the implement phase). The terminal state is the user review gate; after approval the **only** next skill is `/skill:writing-plans`. Do not jump to implementation, and do not silently drop the critique pass.

1. **Start brainstorm tracking (fresh epoch)** - as the first action on entry, before reading code, the worktree, or answering the user, reset both trackers and start the phase. A new brainstorm owns a clean slate, so stale phases and tasks from earlier work are cleared; re-entering mid-brainstorm is safe (nothing to lose, same clean slate):

   ```
   phase_tracker({ action: "reset" })   // clears all phases
   plan_tracker({ action: "clear" })    // clears all tasks
   phase_tracker({ action: "start", phase: "brainstorm" })
   ```

2. **Set up the worktree** - see [Worktree First](#worktree-first).
3. **Gather context** - follow [`gatherer.md`](gatherer.md) without a human stop.
4. **Understand the idea against the draft** - see [Understand the idea](#3-understand-the-idea).
5. **Propose 2-3 approaches** - see [Explore approaches](#4-explore-approaches).
6. **Present the design** - see [Present the design in two rounds](#6-present-the-design-in-two-rounds).
7. **Write the spec** - follow [Spec Self-Review](#spec-self-review-before-user-review-gate) steps 1-4.
8. **Spec self-review (lint)** - run the inline checks in [Spec Self-Review](#spec-self-review-before-user-review-gate).
9. **Critique pass (auto-dispatched)** - use [Spec Council](#spec-council-optional).
10. **Re-run placeholder scan** - follow [Spec Self-Review](#spec-self-review-before-user-review-gate).
11. **Generate spec summary** - follow [User Review Gate](#user-review-gate).
12. **User review gate** - follow [User Review Gate](#user-review-gate).
13. **Transition** - after approval, invoke `/skill:writing-plans` per [User Review Gate](#user-review-gate).

## Project Routing

Identify the target project before brainstorming; this determines the spec directory, instructions, and verification commands. Read top-level and relevant service `AGENTS.md`; follow documented routing, otherwise use repository conventions.

Detection order: (1) infer from ticket labels, description, or paths; (2) use the service/package containing cwd; (3) ask if unclear. Read any area-specific material required by `AGENTS.md` before brainstorming.

## Worktree First

The spec is the first commit in a dedicated worktree, never a separate commit on `main`.

1. Invoke `/skill:using-git-worktrees`; use `.worktrees/` or the project-native location.
2. Carry its `Worktree ready at <full-path>` value: spec path `<full-path>/doc/specs/<filename>.md`; every dispatch uses that `cwd`; git uses `git -C <full-path>`. Keep the process cwd unchanged.
3. Write, review, and commit there.

Spec, plan, and implementation share this worktree. The spec and its telemetry record (`<telemetry.dir>/<spec path with .md -> .yaml>`, default `.pi/gauntlet/telemetry/doc/specs/<spec>.yaml`) are deliverables and ship in the squash; only the plan is stripped. `/skill:finishing-a-development-branch` strips the plan, then seals and commits the record before landing. Explicit trivial one-off edits outside this flow need no worktree.

## The Process

### 1. Check git state

In the primary checkout run `git status` and `git --no-pager log --oneline -5`. On a feature branch with uncommitted or unmerged work, ask whether to finish/merge, stash, or continue; require one choice. For a new topic, create the worktree before continuing.

### 2. Scope check

One spec is default. Test seemingly independent concerns against `../shape-ticket/reference/split-axes.md` (identity, outcome, closed axis, release timing). For every proposed split render exactly:

    root cause: <the precipitating failure or missing capability this slice remedies>
    outcome: <what a user observes once it ships>
    axis: <one item from the closed list>

If any test fails, offer no split. Never split by service, package, repo, layer, or team. If all pass, ask whether to brainstorm the independent specs separately or explain their coupling. Decompose a genuinely multi-concern request; never design it as one spec.

### 3. Understand the idea

`Read` the gathered draft unconditionally before question one. Treat it as a helper, not a fence: verify load-bearing claims from primary code, and confirm whether the codebase or ecosystem already solves the problem.

Ask one question per message, preferably multiple choice, about purpose, constraints, success, and affected actors. Before asking, check code, docs, and tracker: look up current-state facts (dispatch a subagent when costly); ask desired-behavior decisions even when a ticket recorded one. Every questionary question, including acceptance of a corrected fact, ends `Recommendation: <answer> - <why>`; other approvals retain their wording.

Append only citable findings - schemas, hard constraints, contradictions, and scope-changing answers - to `## Appended during questionary` using `edit`.

Before approaches, state in chat the supported, disproved, corrected, and unverified premises with sources and attempted lookups, in full sentences - no status-keyword lists, no template; if the design depends on no claims, one sentence says so. An unverified claim is not a stop: put it in Open Questions or a stated assumption. If a load-bearing claim is contradicted, the premise note is your next message - even as question one - and asks the user to accept the corrected fact or override it; ask nothing else and propose nothing until answered. Record the outcome in the draft for `## Problem` or the relevant design decision.

### 4. Explore approaches

Propose 2-3 approaches with trade-offs; lead with the recommendation and explain it. Use conversational prose unless the user asks for a table.

### 5. Design for clarity and isolation

Prefer clear testable boundaries, YAGNI, existing conventions, the owning schema/contract rather than parallel state, and explicit errors and edge cases.

### 6. Present the design in two rounds

Use two rounds, targeting 300-500 words each, with one approval each; revisions remain within that approval point. Ask once per round; round-1 approval without correction confirms the predecessor. Round 1 covers architecture, responsibilities, data flow, and `supersedes <path>, <scope>` when applicable. Round 2 covers errors, edges, tests, and `## Documentation impact`.

`## Documentation impact` is required. Cite `reference/documentation-impact.md` by relative path, do not restate its categories, and reproduce this template verbatim:

  ```markdown
  ## Documentation impact
  - Feature / user-facing docs introduced: <list, or "none">
  - Materially amended existing docs: <list, or "none">
  - Derived / memory docs invalidated: <routers / AGENTS.md sections / topic guides / indexes, or "none">
  ```

Use doc names, `none`, or `deferred: <trigger>`. Apply `reference/documentation-impact.md`; amend the existing owner; create a standalone file only where no doc owns the topic. Put project taxonomy in the overrides file's `## documentation` block (guidance only; no settings key). Doc updates ship in the same commit as the code and the conformance gate verifies them against the spec. Clarify when needed.

## Ticket Handling

A ticket is guidance, not sole truth. Fetch it; propose scope, approach, or acceptance changes when code disagrees, and record deviations in the spec. Implied requirements in the ticket body (Context, Problem, Idea) land in the spec body as any other requirement; the ticket's explicit acceptance criteria land verbatim in the section below.

**Extract the ticket's ACs.** When the ticket body has a heading matching `/acceptance criteria/i`, every list item under it until the next heading is an AC (numbered, bullet, or checkbox) and no other list in the body is. When there is no such heading, every top-level checkbox row in the body is an AC, except rows under a `Post-deployment housekeeping`, `Out of scope`, or `Follow-up` heading. Otherwise the ticket has no ACs. A nested list under an AC row rides with its parent as one row; an AC heading holding prose and no list makes each paragraph one row. Carry checked and unchecked rows alike, all written `- [ ]`. Take the rows from the gather draft's `## Ticket acceptance criteria (verbatim)` heading; when the ticket was not fetched, the gate summary shows the `none` line so the user can paste the rows, which then become rows.

**Write the section in every spec**, after `## Problem`:

```markdown
## Acceptance criteria

Ticket <ref>, <heading or "checkbox list">, rows verbatim:

- [ ] <row text copied verbatim>
  <disposition>
```

The heading `## Acceptance criteria` names the ticket contract only; the spec's own requirements stay in Design. Disposition is exactly one of `in-scope`, `deviates: <why>`, `deferred: <where>`, `venue: <env> - <observation>`; default `in-scope`. Never edit the row text: a wrongly stated row is `deviates: <why>`, an ambiguous row stays `in-scope` with the chosen reading written as a Design clause. Name a `venue:` row's enabling change in Design. An `in-scope` row is a requirement as written; disposition reasons are never normative for the plan or the reviewer, so a `deviates:` reason that adopts part of a row restates that part as a Design clause. Defer a row only when the shipped change operates without it - cost is never a reason; a hard but direct AC stays `in-scope` and ships. Ask every `deviates:`/`deferred:` decision in the questionary and name it in the gate summary; `venue:` states where the observation can happen and is not a scope decision. A disposition changes in any later phase - a reviewer finding `recommended: rescope` at the finish gate, a wrong row noticed mid-implementation, or a ticket edited after approval when the user asks - through [Amending an approved spec](#amending-an-approved-spec) (`reference/amendment-surface.md`); the row text still never changes. With no ticket, or a ticket without ACs, the section body is the single line `none - no ticket`, `none - ticket has no acceptance criteria`, or `none - ticket not fetched (<reason>)`. Never author acceptance criteria on the ticket's behalf; that is `/skill:shape-ticket`'s job.

## First-Feature Oversight (Early Project Stages)

For the first two features of a new module, long-lived component, schema area, or repeatable pattern, round 1 explicitly lists: directory and module structure; naming of public types, files, routes, and identifiers; each new shared abstraction's location, responsibility, and boundary; persistence/schema entity names, field types, and indexing; proposed AGENTS.md/docs additions. Use no separate confirmation; later features follow established patterns.

## Anti-Pattern: "Too simple to need a design"

Shared schemas, contracts, and invariants require a spec. If work is mechanical and contained, such as a rename, formatting, or dependency bump, say so explicitly and skip brainstorming; otherwise spec first.

## Filename Convention

Write under the routed `doc/specs/`: ticketed `YYYY-MM-DD-<ticket-id>-<topic>.md`, otherwise `YYYY-MM-DD-<topic>.md`. Use a filename-safe tracker slug (`E-12345`, `gh-123`), but native references in plan headers and commits. `<topic>` is 3-6 kebab-case words without `-design` or another suffix.

Mint the slug once during gather and reuse it. If questionary invalidates it, write to the new path and delete the uncommitted draft.

## Spec Self-Review (Before User Review Gate)

Spec-writing replaces the context draft, in this exact order:

1. `Read` the draft in full — **immediately before** the overwrite. Without this, a
   pruned questionary plus a full-replacement `write` destroys the only copy of the
   gathered context at the moment it feeds the spec.
2. Write the spec with the `write` tool (**full replacement**) at the spec path.
   Using `edit` at this step is a red flag.
3. **Immediately after the write**, confirm line 1 of the file is no longer
   `# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing` — before
   dispatching lint, critique, council, or summarizer. The phase-tracker commit
   guard is a backstop, not the primary check.
4. **After the line-1 check and before the inline lint**, `edit` any known
   predecessor spec to insert its supersession banner (see
   [Marking superseded specs](reference/superseding.md)). This position is fixed:
   the banner is written after any slug rename, so it always cites the final path.

After writing the spec to `<project>/doc/specs/<filename>.md` (per [Filename Convention](#filename-convention)) and before showing it to the user, run a self-review pass. Read all five bullets first, then act.

- **Placeholder scan.** Any `TODO`, `TBD`, `<fill in>`, `[example]`, `xxx`? Either resolve them or convert to explicit "Open Questions" with names.
- **Internal consistency.** Does Section 4 contradict Section 2? Are component names and field names consistent throughout? If the spec replaces a prior design, confirm the predecessor carries the supersession banner and its href resolves to this spec's final filename.
- **Documentation named.** Does the spec name all three classes (feature/user-facing introduced; materially amended; derived/memory invalidated), or an explicit "none" for each? Enforce the materiality bar in `reference/documentation-impact.md` without restating it: each listed doc names the category it clears, none is a code-mirror, amend-over-create was applied, and skill/agent bodies are implementation surface, not doc-impact entries here.
- **Ticket contract present.** Does `## Acceptance criteria` exist with either verbatim ticket rows plus dispositions or one `none - <reason>` line? Presence is enforced here, at authoring, and nowhere later.
- **Scope check.** Does every paragraph serve the goal? Cut filler. If something is out of scope, say it's out of scope.
- **Ambiguity check.** Is every "we should…" backed by a concrete decision? Replace "we could probably" with "we will" or "we won't".

The first four are the inline **lint**: run them here and fix what they surface. The last two are the **critique pass**, dispatched per [Spec Council](#spec-council-optional). After it returns, re-run the placeholder scan over the applied spec; if a predecessor banner exists, confirm its `<scope>` still matches and reconcile it; carry any ambiguity the critique could not resolve to the [User Review Gate](#user-review-gate).

## Spec Council (Optional)

Before dispatching the worker below, resolve `reference/documentation-impact.md` relative to this loaded skill as one absolute `<DOCUMENTATION_IMPACT_GUIDELINE>` path value. Pass that value in the worker task; do not add it to the spec.

After the inline lint and before the user review gate, **brainstorming owns the critique-pass gate**; council **apply mechanics** live in `/skill:roasting-the-spec` (single source of truth - link, don't restate). Resolve the council with `gauntlet_setting({ key: "specCouncil" })` - the tool returns the merged (repo-over-preset) value as `{ verdict, members, chair, malformed, warning, errors }`. **Do not** hand-roll a settings read. When `verdict` is `"council"`, the council *is* the critique pass - invoke `/skill:roasting-the-spec` automatically (no offer, no prompt), passing `members`/`chair`; also pass the verbatim human input (the original prompt, any ticket AC snapshot - the raw rows under the gather draft's `## Ticket acceptance criteria (verbatim)` heading, never the spec's section, which holds the author's dispositions - and the questionary answers that changed scope) - roasting-the-spec forwards it to members and chair as the `Human input (verbatim; off-limits for over-spec)` block; it applies its apply-set and returns the audit (Applied/Deferred/Rejected). When `verdict` is `"worker"`, dispatch the worker below. If `malformed` is true or `errors` is non-empty, emit the `warning`/error as one line, then branch strictly on `verdict` - `malformed` can accompany *either* verdict (e.g. a bad `chair` with valid `members` still returns `council`), so never infer the worker path from `malformed` alone. If `gauntlet_setting` is unavailable, stop and report - never fall back to a manual bash/JSON settings merge. The already-applied council edits (or the worker's in-place fixes) ride in the same worktree commit. The conceptual precedence rule lives in `verification-before-completion/reference/settings-precedence.md`.

When `verdict` is `"worker"`, dispatch one fresh `worker` that applies the scope + ambiguity checks and fixes them in place:

```
subagent({ agent: "worker", context: "fresh", async: false, cwd: "<abs worktree path, from the using-git-worktrees Step 4 report>", task:
  "Problem statement: <the problem the spec addresses + the user's stated intent>.\n" +
  "Read the spec at <abs path to doc/specs/...>. Edit ONLY that file.\n" +
  "The portable citation `reference/documentation-impact.md` in the spec is the pi-gauntlet guideline at <DOCUMENTATION_IMPACT_GUIDELINE>, not a consumer doc; do not flag it as an external reference, and preserve it - never remove it as redundant or replace it with the resolved absolute path.\n" +
  "Apply two checks and fix what you find in place: (1) Scope — does every paragraph serve the goal? Cut filler;\n" +
  "state out-of-scope explicitly. (2) Ambiguity — is every 'we should' a concrete decision?\n" +
  "Replace 'we could probably' with 'we will'/'we won't'. Also inline any load-bearing\n" +
  "external reference (ticket AC, commit SHA, doc) already given to you in the problem\n" +
  "statement above; if the spec relies on one not provided here, flag it (do NOT fetch) in\n" +
  "your summary. Return a summary of what you changed, and flag any ambiguity you could NOT\n" +
  "safely resolve." })
```

`worker`'s model resolves from `subagents.agentOverrides.worker.model` in `settings.json` (unset → inherits the main loop); the dispatch passes no `model:`.

## User Review Gate

After self-review and the critique pass (council or worker, both already applied to the spec - see [Spec Council](#spec-council-optional)), dispatch the spec-only summarizer over the **applied** spec, then commit the spec on the worktree branch and stop. The summary is folded into the one human gate, not a new gate.

Mint an absolute temp path outside the worktree (so it is never committed), then dispatch the summarizer on a fresh context, reading only the spec, writing to that path via file-only output (no `model:` - it inherits the main loop unless a preset sets `subagents.agentOverrides.spec-summarizer.model`):

```bash
SUMMARY_PATH=$(mktemp "${TMPDIR:-/tmp}/gauntlet-spec-summary.XXXXXX")   # absolute, portable across GNU/BSD mktemp
```

```
subagent({ agent: "spec-summarizer", context: "fresh", async: false, cwd: "<abs worktree path, from the using-git-worktrees Step 4 report>",
  output: "<SUMMARY_PATH>", outputMode: "file-only", task:
  "Summarize the spec at <abs path to doc/specs/...> for the user review gate. Read ONLY that file." })
```

`<SUMMARY_PATH>` above is a placeholder in the dispatch object; it means substitute the value of the shell variable `$SUMMARY_PATH` set above. The steps below use `$SUMMARY_PATH` (the shell form) once the value is in hand.

Then commit the spec — staging any predecessor spec edited per [Marking superseded specs](reference/superseding.md) alongside it; a change request at the gate that renames, materially revises, or drops the spec also reconciles the predecessor's banner before recommitting. This commit is **unconditional**: the summary is only a gate aid, so a degraded or missing summary never blocks it. If the council path ran, include its audit (`Coverage:` when present, then `Applied:` / `Deferred:` / `Rejected:`, verbatim from `/skill:roasting-the-spec`'s return) in the **commit message body** - this is the durable, non-contractual record a finish-time revert reads back; the audit is never a committed spec section. Evaluate the summary in two stages (the **Degrade path** referenced in each is defined just below):

1. **From the dispatch tool result, before the `Read`.** If the result is **not** an `"Output saved to: <path> (<N> KB, <M> lines)"` reference (e.g. an exit-0 save error returns the full inline output plus an "Output file error" line — the prunable shape, no file to read), or the reference reports under ~500 bytes, or a size grossly disproportionate to the spec (under ~2% of its byte size), or over ~45 KB (the `Read` truncates at 50KB / 2000 lines, so a larger file cannot render whole) — skip the `Read` and take the degrade path. Use the reference's reported figures; do not re-derive them.
2. **The `Read` itself, as the last content-producing tool call before composing the gate.** `Read` `$SUMMARY_PATH` and paste its contents verbatim at the top of the gate. If the `Read` fails, returns 0 bytes, or reports truncation — take the degrade path. The `Read` must be last: pi-condense does not protect a `/tmp` read, so any turn boundary between the `Read` and the render lets the ~9KB read result be pruned, reproducing the bug.

**Degrade path** — reach the gate with a one-line "summary generation failed" note; never paraphrase from the file-only reference, never render a stub as the canonical summary.

Either way — summary rendered or degraded — then `rm "$SUMMARY_PATH"` (unconditional cleanup; harmless if the file was never created, since it lives outside the worktree under the OS temp dir).

Paste the summary verbatim, unedited in the template below; use adjacent lines for the audit, unresolved ambiguities, and every gap-footer entry:

```
<spec-only summary read back from the temp file — pasted verbatim, unedited>

Spec written and committed to <project>/doc/specs/<filename>.md (worktree: <path>).

Coverage: <N> of <M> members reported; <slug>: <reason> (line present only when coverage was partial)
Applied: <cluster -> edit>, ...
Deferred: <cluster -> where it belongs>, ...
Rejected: <cluster -> one-line reason>, ...
(omit the audit lines above when the worker path ran, not the council)

<unresolved ambiguities; every gap-footer entry from the summary>

Please review. Approve to proceed, tell me what to change in the spec, or say "revert applied council edit <X>" to undo a specific applied edit. Reply "auto-apply amends" - every later amend-class change in this flow then applies without review, scope changes included; redraws and the spec gate still stop. "approve, auto-apply amends" does both.
```

If you believe the summary needs correcting, do **not** silently rewrite it — re-dispatch the summarizer or note the discrepancy as an adjacent line beneath the verbatim block.

**Revert valve.** "Revert applied council edit X" is a normal change request: revise the spec to undo edit X, re-dispatch the summarizer with a **fresh** temp path (per the re-dispatch rule below), and re-present the gate. This is cheap here - the spec is not yet plan- or code-bearing.

Wait for the user. On a change request (including a revert), revise the spec and re-present — mint a **fresh** temp path for the re-dispatched summarizer (never reuse a prior round's path, so stale content can never be mistaken for the new summary). On approval, proceed immediately to `/skill:writing-plans` with no further prompt (a grant given at or before approval - "approve, auto-apply amends", or a standalone "auto-apply amends" reply earlier at this gate - is first quoted in the spec commit body via `git -C <abs worktree path> commit --amend --no-edit -q --trailer "Amend-grant: <the sentence>"`, so the worktree history shows when the grant began) — the plan and execution mode are mechanical derivatives, so the only human gate here is spec approval itself. Don't land the spec on `main`; it stays in the worktree and ships in the same squash commit as the implementation.

Post-approval changes follow [Amending an approved spec](#amending-an-approved-spec).

After approval, mark the brainstorm phase complete:

```
phase_tracker({ action: "complete", phase: "brainstorm" })
```

## Amending an approved spec

Execute in place from any later phase; never invoke `/skill:brainstorming` for it (its entry resets both trackers). Worktree, spec commits, and plan survive.

Classify first. Redraw test: the change alters the problem statement, adds or removes a component, or moves a component boundary -> redraw. A change inside one component (a persistence mechanism, a worker's HTTP client, dropping a fallback and its task) -> amend. State the call; the user overrides either way.

Amend -> load `reference/amendment-surface.md` and follow it (unreadable -> stop with a blocking error; never improvise the grammar): it holds items unapplied, reviews them with a fresh `spec-council-member`, renders one readable batch for escalations, applies accepted items, runs the plan/tracker aftermath, and commits once. A user instruction in this flow that waives per-diff review for later amends ("auto-apply amends", "auto-apply amends, stop only for redraws", "apply spec fixes without asking") skips the review; it never satisfies the spec gate, and a new brainstorm or a fresh-session resume starts with no grant. Redraws always stop.

Redraw: keep the worktree and the approved spec file. `plan_tracker({ action: "clear" })`, `phase_tracker({ action: "reset" })`, `phase_tracker({ action: "start", phase: "brainstorm" })`, delete the plan file, resume at checklist step 4 with the approved spec as the draft (steps 2-3 skipped). Spec-writing overwrites it; the full gate follows.

## Key Principles

One question at a time, YAGNI, 2-3 approaches, two design rounds, clarify freely - all owned by [The Process](#the-process).

## Red Flags — STOP

- Writes outside `doc/specs/` ([owner](#hard-constraint)).
- Draft overwrite without the same-turn full read, or overwrite via `edit` ([owner](#spec-self-review-before-user-review-gate)).
- Dispatch while line 1 is the context-draft marker ([owner](#spec-self-review-before-user-review-gate)).
- Inline scope or ambiguity checks ([owner](#spec-council-optional)).
- Gate after failed/skipped critique or before placeholder re-scan ([owner](#spec-self-review-before-user-review-gate)).
- Gate without summary `Read` last, or with a paraphrased summary ([owner](#user-review-gate)).
- Human stop between gather and question one ([owner](gatherer.md)).
- Proposed-change execution before approval ([owner](#hard-constraint)).
- Plan before approval; brainstorming invocation for an amend ([owner](#user-review-gate)).
- Missing predecessor banner; invalid multi-spec split ([owner](#spec-self-review-before-user-review-gate); [owner](#2-scope-check)).
- Approaches while a contradicted premise remains unresolved ([owner](#3-understand-the-idea)).
- Amend without `reference/amendment-surface.md`; waiting after an amend grant; auto-applying a redraw ([owner](#amending-an-approved-spec)).

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it. Read and apply `## conventions` whenever present, without a relevance judgment. Give this skill's named section precedence over conflicting `## conventions` rules. Use other relevant sections - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - to override or extend the instructions above. Project-local `AGENTS.md` is already in context — check it for project-specific routing tables, service paths, and verification commands.
