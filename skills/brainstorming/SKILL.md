---
name: brainstorming
description: "Use only when the user explicitly requests brainstorming or selects a handoff into it."
disable-model-invocation: true
---

# Brainstorming Ideas Into Designs

## Overview

Collaborate on designs.

## HARD CONSTRAINT

Do **not** implement until the design is presented and approved, regardless of simplicity. Implementation-heavy requests define spec scope; they do not lift this gate.

You **may** read code/docs, run the existing system to observe current behavior, write under a resolved spec dir (`gauntlet_setting({ key: "flowGuards" })` -> `specDirs`), and `edit` a predecessor spec there to add a [supersession banner](reference/superseding.md).

You may **not** write outside the resolved spec dirs; build, deploy, validate, or exercise the proposed change; run implementation skills; commit the spec on `main`; or start `/skill:writing-plans`.

The line: current-system observation is research; exercising the proposed change waits for approval.

## Foreground dispatch policy

Set top-level `async: false` on every flow-owned dispatch and leave `forceTopLevelAsync` unset or false. If a dispatch still returns an async handle, stop and report; do not poll, relaunch, or advance. A detached child is incomplete work: use the existing coordination path, never accept or duplicate it. Preserve independent parallel `tasks` batches and await all terminal results before acceptance or tracker/phase advancement.

## Entry consent

Start fresh only on `/skill:brainstorming`, explicit prose requesting brainstorming/the gauntlet, or a human-selected handoff. Ordinary implementation requests, discussion about usefulness, and recommendations are not consent: wait for explicit choice before reset or worktree creation.

Treat the flag as discovery control, not harness authorization. The command reliably discovers this skill; honor prose when already loaded or identified by an available route, never promise otherwise unreachable prose discovery. Continue restored state and amend/redraw at their named steps without fresh entry.

## Checklist

Work through the items below **in order**. This is your own checklist to follow, not a `plan_tracker` plan — brainstorming is open-ended exploration, and `plan_tracker` is execution-only (the implement phase). The terminal state is the user review gate; after approval the **only** next skill is `/skill:writing-plans`. Do not jump to implementation, and do not silently drop the critique pass.

1. **Start brainstorm tracking (fresh epoch)** - as the first action on authorized fresh entry, before reading code, the worktree, or answering the user, reset both trackers and start the phase. A new brainstorm owns a clean slate, so stale phases and tasks from earlier work are cleared; re-entering mid-brainstorm is safe (nothing to lose, same clean slate):

   ```
   phase_tracker({ action: "reset" })   // clears all phases
   plan_tracker({ action: "clear" })    // clears all tasks
   phase_tracker({ action: "start", phase: "brainstorm" })
   ```

2. **Set up the worktree** - see [Worktree First](#worktree-first).
3. **Gather context** - read [Ticket Handling](#ticket-handling), then follow [`gatherer.md`](gatherer.md) without a human stop.
4. **Understand the idea against the draft** - read [Ticket Handling](#ticket-handling), then see [Understand the idea](#3-understand-the-idea).
5. **Propose 2-3 approaches** - see [Explore approaches](#4-explore-approaches).
6. **Present the design** - see [Present the design in two rounds](#6-present-the-design-in-two-rounds).
7. **Write the spec** - read [Spec Self-Review](#spec-self-review-before-user-review-gate) before writing; follow steps 1-5.
8. **Spec self-review (lint)** - read [Ticket Handling](#ticket-handling), then run the inline checks in [Spec Self-Review](#spec-self-review-before-user-review-gate).
9. **Critique pass (auto-dispatched)** - use [Spec Council](#spec-council).
10. **Re-run placeholder scan** - follow [Spec Self-Review](#spec-self-review-before-user-review-gate).
11. **Generate spec summary** - follow [User Review Gate](#user-review-gate).
12. **User review gate** - follow [User Review Gate](#user-review-gate).
13. **Transition** - after approval, invoke `/skill:writing-plans` per [User Review Gate](#user-review-gate).

## Project Routing

Identify the target project before brainstorming; this determines the spec directory, instructions, and verification commands. Read top-level and relevant service `AGENTS.md`; follow documented routing, otherwise use repository conventions.

Detection order: (1) infer from ticket labels, description, or paths; (2) use the service/package containing cwd; (3) ask if unclear. Read any area-specific material required by `AGENTS.md` before brainstorming.

## Worktree First

The spec is the first commit in a dedicated worktree, never a separate commit on `main`.

Invoke `/skill:using-git-worktrees`; use `.worktrees/` or the project-native location. Carry its `Worktree ready at <full-path>` value: spec path `<full-path>/<spec dir>/<filename>.md`; every dispatch uses that `cwd`; git uses `git -C <full-path>`. Keep the process cwd unchanged.

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

Clarify freely.

`Read` the gathered draft unconditionally before question one. Treat it as a helper, not a fence: verify load-bearing claims from primary code, and confirm whether the codebase or ecosystem already solves the problem.

Ask one question per message, about purpose, constraints, success, and affected actors. Every questionary question offers 2-4 labeled options (`A)`, `B)`, ...), each a different outcome, and ends `Recommendation: <letter> - <why>`; when more outcomes are plausible, the last option is `other - name it` or the question splits in two. This format overrides chat-style rules in `AGENTS.md` (one paragraph, no Options/Recommendation layout). A decision that would be a yes/no or "may I" question is not asked: make it, state it as an assumption in the message that carries the next question or the premise note, and record it in the draft. Before asking, check code, docs, and tracker: look up current-state facts (dispatch a subagent when costly); adopt a ticket-recorded decision and cite the ticket, asking it only when a cited code or API contradiction, or conflicting recorded outcomes, prevents adopting it. Other approvals retain their wording.

Bad: `May I treat those two acceptance criteria as location-only deviations? Recommendation: yes`
Good: `The two ACs name a path that moved; the spec marks them deviates: location only. Which surface owns the refresh? A) the extension B) a new bin C) the existing skill step. Recommendation: A - the extension already holds the poll loop, so no new entrypoint.`

Append only citable findings - schemas, hard constraints, contradictions, and scope-changing answers - to `## Appended during questionary` using `edit`.

Before approaches, state in chat the supported, disproved, corrected, and unverified premises with sources and attempted lookups, in full sentences - no status-keyword lists, no template; if the design depends on no claims, one sentence says so. An unverified claim is not a stop: put it in Open Questions or a stated assumption. If a load-bearing claim is contradicted, the premise note is your next message - even as question one - and states the corrected fact with its source; the design continues on it and the user overrides in reply. Record the corrected fact, and any override, in the draft for `## Problem` or the relevant design decision.

### 4. Explore approaches

Propose 2-3 approaches with trade-offs; lead with the recommendation and explain it. Use conversational prose unless the user asks for a table.

### 5. Design for clarity and isolation

Prefer clear testable boundaries, YAGNI, existing conventions, the owning schema/contract rather than parallel state, and explicit errors and edge cases.

### 6. Present the design in two rounds

Use two rounds, targeting 300-500 words each, with one approval each; revisions remain within that approval point. Ask once per round; round-1 approval without correction confirms the predecessor. Round 1 covers architecture, responsibilities, data flow, and `supersedes <path>, <scope>` when applicable. Round 2 covers errors, edges, tests, and `## Documentation impact`. In round 2, read and apply [Documentation impact](reference/documentation-impact.md), including its verbatim template; cite that portable relative path in the spec; do not restate its categories. Ask the user when doc impact is unclear. Unreadable -> stop the step with a blocking error. Cite the draft's `Docs touched:` entries as candidates for "Materially amended existing docs"; admit or drop each by that owner's materiality bar, never list them automatically.

## Ticket Handling

Read [Ticket Handling](reference/ticket-acceptance.md) before gathering context or step-4/8 entry, even with no ticket; unreadable -> stop with a blocking error, never reconstruct from memory.

## First-Feature Oversight (Early Project Stages)

For the first two features of a new module, long-lived component, schema area, or repeatable pattern, round 1 explicitly lists: directory and module structure; naming of public types, files, routes, and identifiers; each new shared abstraction's location, responsibility, and boundary; persistence/schema entity names, field types, and indexing; proposed AGENTS.md/docs additions. Use no separate confirmation; later features follow established patterns.

## Anti-Pattern: "Too simple to need a design"

Inside an opted-in flow, shared schemas, contracts, and invariants require a spec. If work is mechanical and contained, such as a rename, formatting, or dependency bump, say so explicitly and skip brainstorming; otherwise spec first within that flow.

## Filename Convention

Write under the routed spec dir: pick the routing prose's dir (overrides file, `AGENTS.md`) when it is one of the resolved dirs, else the one resolved dir from `gauntlet_setting({ key: "flowGuards" })` that already exists in the repo, else the first resolved dir (`doc/specs` under the default). Name ticketed files `YYYY-MM-DD-<ticket-id>-<topic>.md`, otherwise `YYYY-MM-DD-<topic>.md`. Use a filename-safe tracker slug (`E-12345`, `gh-123`), but native references in plan headers and commits. `<topic>` is 3-6 kebab-case words without `-design` or another suffix.

Mint the slug once during gather and reuse it. If questionary invalidates it, write to the new path and delete the uncommitted draft.

## Spec Self-Review (Before User Review Gate)

Read [Spec Self-Review](reference/spec-finalization.md#spec-self-review-before-user-review-gate) before spec-writing or restored step 8; unreadable -> stop with a blocking error, never reconstruct from memory.

## Spec Council

Follow [Spec Council](reference/spec-finalization.md#spec-council) for the mandatory critique pass.

## User Review Gate

Follow [User Review Gate](reference/spec-finalization.md#user-review-gate) for summary, commit, approval, and automatic planning.

## Amending an approved spec

Execute in place from any later phase; never invoke `/skill:brainstorming` for it (its entry resets both trackers). Worktree, spec commits, and plan survive.

Classify first. Redraw test: the change alters the problem statement, adds or removes a component, or moves a component boundary -> redraw. A change inside one component (a persistence mechanism, a worker's HTTP client, dropping a fallback and its task) -> amend. State the call; the user overrides either way.

Amend -> load `reference/amendment-surface.md` and follow it (unreadable -> stop with a blocking error; never improvise the grammar). Apply its [Standing grants](reference/amendment-surface.md#standing-grants) boundaries.

Redraw: keep the worktree and the approved spec file. `plan_tracker({ action: "clear" })`, `phase_tracker({ action: "reset" })`, `phase_tracker({ action: "start", phase: "brainstorm" })`, delete the plan file, resume at checklist step 4 with the approved spec as the draft (steps 2-3 skipped). Spec-writing overwrites it; the full gate follows.

## Red Flags — STOP

- Writes outside the resolved spec dirs ([owner](#hard-constraint)).
- Draft overwrite without the same-turn full read, or overwrite via `edit` ([owner](#spec-self-review-before-user-review-gate)).
- Dispatch while line 1 is the context-draft marker ([owner](#spec-self-review-before-user-review-gate)).
- Inline scope or ambiguity checks ([owner](#spec-council)).
- Gate after failed/skipped critique or before placeholder re-scan ([owner](#spec-self-review-before-user-review-gate)).
- Gate without summary `Read` last, or with a paraphrased summary ([owner](#user-review-gate)).
- Human stop between gather and question one ([owner](gatherer.md)).
- Proposed-change execution before approval ([owner](#hard-constraint)).
- Plan before approval; brainstorming invocation for an amend ([owner](#user-review-gate)).
- Missing predecessor banner; invalid multi-spec split ([owner](#spec-self-review-before-user-review-gate); [owner](#2-scope-check)).
- Gate reached without the second predecessor pass ([owner](#spec-self-review-before-user-review-gate)).
- Approaches before the premise note states a contradicted claim's correction ([owner](#3-understand-the-idea)).
- Amend without `reference/amendment-surface.md`; waiting after an amend grant; auto-applying a redraw ([owner](#amending-an-approved-spec)).

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it. Read and apply `## conventions` whenever present, without a relevance judgment. Give this skill's named section precedence over conflicting `## conventions` rules. Use other relevant sections - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - to override or extend the instructions above. Project-local `AGENTS.md` is already in context — check it for project-specific routing tables, service paths, and verification commands.
