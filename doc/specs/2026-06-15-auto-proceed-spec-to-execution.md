# Auto-Proceed From Approved Spec Through Execution

**Status:** Draft (pending user review)
**Date:** 2026-06-15
**Worktree:** `.worktrees/auto-proceed-spec-to-execution`
**Version impact:** MAJOR (`2.2.1` → `3.0.0`) — deletes the `executing-plans` skill.

## Problem

The spec→plan→implement flow has four human gates:

1. Spec approval (`brainstorming` User Review Gate).
2. Plan handoff: a pause **and** a 3-way execution-mode picker (`writing-plans` Execution Handoff).
3. In-flight STOPs (`BLOCKED` / `NEEDS_CONTEXT` / "plan is wrong" / reviewer stuck) in the executors.
4. End gate (final review + audit + conformance closure + "ready for finishing?").

Gate 2 is the weakest: the picker is a mechanical lookup (the plan's wave structure already determines the only sensible execution mode), and the pause asks the human to choose something they have no new information to decide. It adds latency without adding safety. Gates 1, 3, and 4 carry the real human-meaningful checkpoints.

## Intent

Provide a single, opinionated happy path. After a human approves the spec, the framework auto-writes the plan and auto-proceeds into execution with a deterministically selected mode — no plan-handoff pause, no picker. The plan is an agent-only, mechanically-derived artifact ("the plan is its own contract"); auto-writing and auto-executing it expresses the existing framework philosophy rather than violating it.

Keep gates 1, 3, 4. Collapse gate 2.

## Decisions

| # | Decision | Rationale |
|---|---|---|
| D1 | **Delete `executing-plans` entirely** (not demote). | Never used. Its closing-loop conformance logic is duplicated in `subagent-driven-development`; deleting removes the divergence tax. No escape hatch is retained — manually invoking a skill is out-of-band hacking, not a supported flow. |
| D2 | **No `autoProceed` config flag, no opt-out branch.** | One opinionated path. Control survives via gate 1 (spec approval), gate 3 (in-flight STOPs), gate 4 (end gate). No conditional branch in every skill. |
| D3 | **No plan-critique subagent in the auto-seam.** | Plan integrity rests on (a) `writing-plans`' existing orchestrator Self-Review (incl. spec-coverage) and (b) the gate-4 `conformance-reviewer` backstop. A fresh plan-critique subagent guards a failure gate 4 already catches — redundant machinery against a happy-path flow. |
| D4 | **Deterministic execution-mode auto-selection** from wave structure: parallel-wave if any wave has ≥2 tasks, else sequential. | A pure function of the plan's wave/Files structure — a lookup, not judgment. Both modes are `subagent-driven-development`. |
| D5 | **Strengthen the wave-grouping contract** so multi-task waves are *parallel-safe*, not merely file-disjoint: disjoint files **and** disjoint shared mutable runtime resources. | Makes D4 provably safe. Parallel-safety is a grouping property, not a selection-time judgment. File-disjoint-but-DB-sharing tasks must not co-occupy a wave. |
| D6 | **`brainstorming` is the documented entry point; `writing-plans` and `subagent-driven-development` are marked internal chain steps.** | Even when a spec is provided, the user starts by brainstorming it. This is documented routing intent, **not machine-enforced** — pi's discovery model surfaces every skill's description and cannot hard-block direct invocation. Direct invocation stays technically possible (e.g. re-running SDD after an in-flight STOP); it is simply not the advertised path. |

### Residual cost (accepted)

Collapsing gate 2 trades a cheap early "the plan mistranslated the spec" catch for a more expensive late one: a dropped or mistranslated requirement now surfaces at gate-4 conformance (after a full implementation cycle) instead of pre-execution. This is accepted deliberately — empirically the early catch has never fired, and the gate-4 `conformance-reviewer` confronts the assembled deliverable against the origin (spec + verbatim prompt) and surfaces every gap for user disposition.

## The Auto-Seam

```
brainstorming                writing-plans                 subagent-driven-development
─────────────                ─────────────                 ───────────────────────────
spec written
council roast (roasting-the-spec)
spec committed
[GATE 1: human approves] ───► auto-write plan
                              orchestrator self-review
                              auto-select mode (D4)  ──────► execute (sequential | parallel-wave)
                                                              [GATE 3: in-flight STOPs]
                                                              final review + audit + conformance
                                                              [GATE 4: ready for finishing?]
```

- Gate 1 mechanism is unchanged: present the spec, wait for the human. **What changes is the post-approval behavior** — on approval the orchestrator proceeds automatically (no "which skill next?" menu). The "request changes to the spec" path is preserved.
- After `writing-plans` finishes its Self-Review, it auto-selects the mode and invokes `subagent-driven-development` in the same session. No pause, no picker. The selection is announced for transparency; it does not wait for confirmation.

### Execution-mode selector (D4)

```
parse waves from the plan (## Wave N headers + per-task Files blocks)
if ∃ wave W : count(tasks(W)) ≥ 2:   → Parallel-Wave Mode
else (pure dependency chain):        → Sequential Mode
```

Because the strengthened wave-grouping contract (D5) requires the planner to make any multi-task wave parallel-safe, the selector needs no repo-capability judgment: a multi-task wave is safe to parallelize **by the planner's D5-compliant grouping** — an LLM-reasoned self-review assertion (the mechanism for every skill safety property), not a machine-validated guarantee. The optional inline resource note aids that reasoning but is not required syntax.

## Changes By File

All paths relative to the repo root.

### Delete

- `skills/executing-plans/` (the whole directory: `SKILL.md`).

### `skills/writing-plans/SKILL.md`

1. **Rewrite the `## Execution Handoff` section** from "offer execution choice (3-way picker) → which approach?" into a deterministic auto-select-and-proceed seam:
   - After `phase_tracker({ action: "complete", phase: "plan" })`, run the D4 selector against the plan's waves.
   - Announce the selected mode (one line, transparency).
   - Auto-invoke `/skill:subagent-driven-development` in this session with the selected mode. No pause, no "which approach?" prompt.
   - Remove the three numbered options and the `executing-plans` separate-session option.
2. **Strengthen `## Wave Grouping` (D5):** a wave's tasks must be disjoint in **files AND shared mutable runtime resources** (same DB/schema, port, fixture file, external service, shared temp path). Tasks that contend on a runtime resource — even with disjoint files — belong in different waves. State *why*: the executor auto-selects parallel for every multi-task wave, so the grouping is the sole parallel-safety guarantee. No new mandatory per-task syntax; an optional inline note may record the contended resource when it is the reason two file-disjoint tasks are split across waves.
3. **Extend the `## Self-Review` "Wave disjointness" check** to assert disjointness over files **and** runtime resources (was files only).
4. **Update the Related-skills header line:** drop the `/skill:executing-plans` reference; point only at `/skill:subagent-driven-development`.
5. **Boundaries / Red Flags:** sweep all `executing-plans` references. Beyond the name swap, **rewrite the semantically-stale boundary** `Start executing the plan: no — that's /skill:executing-plans or /skill:subagent-driven-development` (currently ~line 37): the new behavior is that `writing-plans` *does* auto-invoke SDD. Replace with: "never write implementation code inside `writing-plans`; after Self-Review + `phase_tracker` complete, auto-invoke `/skill:subagent-driven-development`."
6. Add a one-line note (and a Related-skills/`description` signal per D6) that `writing-plans` is reached via the auto-chain from `brainstorming`, not a direct human entry point.

### `skills/subagent-driven-development/SKILL.md`

1. **Remove the `## When to Use vs. Executing Plans` comparison table** (and its heading). It compared against a now-deleted skill. Replace with a short note on sequential-vs-parallel-wave selection (the D4 rule) if useful, else delete the section.
2. **`## Integration` → "Alternative" line** (`/skill:executing-plans — use for separate-session execution`): delete it.
3. Sweep remaining `executing-plans` / "Executing Plans" mentions in the body.
4. **Carry the D5 contract into the executor (required — else D5 is enforced in `writing-plans` but silently violated here).** Update `## Parallel-Wave Mode`: its definition ("file-disjoint tasks run concurrently") and its Step 1 independence check both speak only of files. State that the independence check asserts **file** disjointness mechanically from `Files:` blocks **and** trusts the plan's wave grouping for **shared mutable runtime-resource** disjointness (which `writing-plans`' D5 contract guarantees). Add a Red Flag: "parallelizing a wave whose tasks contend on a shared mutable runtime resource (DB/schema, port, fixture, external service, shared temp path) — that wave was mis-grouped; run those tasks as sequential single-task waves."
5. **D6 internal-chain signal:** add a `description`/Related-skills note that SDD is reached via the auto-chain from `writing-plans`, not a direct human entry point (documented intent, not enforced).

### `skills/brainstorming/SKILL.md`

1. **HARD CONSTRAINT bullet** listing implementation skills (`/skill:test-driven-development`, `/skill:executing-plans`, etc.): replace `executing-plans` with `subagent-driven-development`.
2. **User Review Gate:** remove the numbered next-step menu ("1. Use /skill:writing-plans... 2. Make changes..."). The gate presents the committed spec and waits for human approval **or** a change request; on approval, proceed immediately to `writing-plans` with no further prompt. Preserve the "request changes to the spec" path and the gate itself (human still approves).

### `skills/requesting-code-review/SKILL.md`

- `:94` contains an `**Executing Plans:**` workflow subsection. Acceptance criterion #2 (grep `skills/` for zero `executing-plans` matches) fails without this edit. Remove the subsection (or fold its content into the `subagent-driven-development` reference).

### `skills/using-git-worktrees/SKILL.md`

- Related-skills header line, `## Integration` "Called by", and the Quick Reference / body mentions: drop `/skill:executing-plans`, keep `/skill:subagent-driven-development`.

### `skills/finishing-a-development-branch/SKILL.md`

- The conformance-restate line referencing "the `subagent-driven-development` / `executing-plans` verify gate": drop `executing-plans`.

### `extensions/phase-tracker.ts`

- Comment at ~line 131 ("the SDD / executing-plans execution preamble"): drop the `executing-plans` mention. Comment-only; no functional change.

### `AGENTS.md`

- The `conformance-reviewer` paragraph ("dispatched by the verify step of `subagent-driven-development` / `executing-plans` / `verification-before-completion`"): drop `executing-plans`.
- Skill-coverage counts: `13 of obra's 14 v5.1.0 skills` → `12 of obra's 14`; `total shipped skills: 14` → `total shipped skills: 13`. (Re-verify the obra-sourced split when editing — `executing-plans` is obra-sourced, so the obra count drops by one and the total drops by one.)

### `README.md`

- "Design & planning" skill list (line 11): remove `executing-plans`.
- Skill count (line 9): `**14 skills**` → `**13 skills**`.

### `CHANGELOG.md` + `package.json`

- Bump `package.json` version `2.2.1` → `3.0.0`.
- Add a `3.0.0` CHANGELOG entry: deletes `executing-plans`; collapses the plan-handoff gate into deterministic auto-select-and-proceed; strengthens the wave-grouping contract to parallel-safety. Note the breaking change (skill removal) and that consumers relying on `executing-plans` must switch to `subagent-driven-development`.

## Out Of Scope

- **Historical spec docs** (`doc/specs/sync-v5.1.0-cleanup.md`, `doc/specs/2026-06-11-closure-review-verify-gate.md`, `doc/specs/2026-05-31-parallel-wave-execution.md`) that mention `executing-plans`: left untouched. They are point-in-time records of past decisions; rewriting them falsifies history. The reference sweep targets live/authoritative surfaces only.
- **No plan-critique subagent / no new agent profile** (D3).
- **No config flag, no opt-out branch, no escape hatch** (D2).
- **No new per-task runtime-resource syntax** in the plan format (D5 is a grouping rule, not a schema change).
- Changes to gates 1, 3, 4 themselves.

## Acceptance Criteria

1. `skills/executing-plans/` does not exist.
2. `rg -n "executing-plans|Executing Plans" skills/ extensions/ README.md` returns **zero** matches. `AGENTS.md` is checked separately: the only permitted match is the deliberate deletion-record in the skills-coverage paragraph (same category as the CHANGELOG `v3.0.0` entry); no live dispatch/list reference may remain. Historical `doc/specs/` and `CHANGELOG.md` are excluded.
3. `writing-plans` Execution Handoff is grep-verifiable on three sub-checks: (a) no numbered options (`1.`/`2.`/`3.`) remain in the section; (b) the D4 rule text is present (≥2 tasks → parallel-wave, else sequential); (c) an auto-invoke statement for `subagent-driven-development` is present.
4. `writing-plans` Wave Grouping requires file **and** runtime-resource disjointness; the Self-Review wave check matches.
5. `brainstorming` User Review Gate auto-proceeds on approval; the implementation-skills constraint references `subagent-driven-development`, not `executing-plans`.
6. `package.json` is `3.0.0`; CHANGELOG has the `3.0.0` entry noting the breaking removal.
7. Generic-skill grep clean: `rg -ni "<company>|<username-paths>|<internal-services>" skills/` (per AGENTS.md) returns zero matches in edited skills.

## Verification

No automated test suite (markdown skills + TS extensions). Verification is the grep-based acceptance criteria above plus a manual read-through of the rewritten `writing-plans` Execution Handoff and Wave Grouping sections for internal consistency.
