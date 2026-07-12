---
name: roasting-the-spec
description: Use after writing a spec, when a spec council is configured (the resolved piGauntlet.specCouncil council, via the gauntlet_setting tool, repo settings over the preset). Auto-dispatched by /skill:brainstorming as the critique pass when members is non-empty (no longer offered). N members on different models critique in parallel, a neutral chair consolidates and adjudicates, the parent applies its own dispositions and returns an audit for the user to ratify at brainstorming's gate.
---

# Roasting the Spec (Spec Council)

## Overview

A multi-model critique pass for a freshly written spec. Each council **member** runs on a different model and critiques the spec independently — different models surface different angles. A neutral **chair** consolidates the critiques and adjudicates disagreements. The parent decides what to apply and applies it before returning; the **user** ratifies (or reverts) the result at brainstorming's single gate. The council never decides on its own what changes land.

Auto-dispatched from `/skill:brainstorming` as the critique pass, after the inline lint and before the user review gate, **only when a council is configured** (`members` non-empty). brainstorming owns that gate; when no council is configured it runs a single fresh-`worker` critique instead and does not invoke this skill.

## Hard constraint

This skill may read anything and edit **only** the spec under `doc/specs/`. It does not write code, does not run implementation skills, and does not land anything on `main`. Applied edits ride in the same worktree spec commit as the rest of brainstorming's output.

## Separation of powers

- **Members** — independent witnesses. One per configured model, fresh context, read-only.
- **Chair** — judge of the testimony. Fresh context (never saw the spec authored); consolidates and resolves member-vs-member conflicts. Final say on conflicts; no say on what gets applied.
- **Parent (you)** — advocate, and now also executor. You decide apply / defer / reject per finding on scope grounds, then apply the apply-set yourself (you hold the `edit`/`write` tools; this was always the main-loop model's job, just moved earlier). Cannot suppress findings — every finding lands in the audit as applied, deferred, or rejected.
- **User** — sole jury. Ratifies (or reverts) the finished spec at brainstorming's one gate — after the apply, not before.

## Configuration and gating

The caller (`/skill:brainstorming`) already resolved the council via `gauntlet_setting({ key: "specCouncil" })` and dispatched this skill only when `verdict` was `"council"`, passing the resolved `members` and `chair`. This skill therefore receives `members`/`chair` from that resolved value and does **not** read settings files itself. The resolved config looks like:

```json
{
  "piGauntlet": {
    "specCouncil": {
      "members": ["<provider/model>", "<provider/model>"],
      "chair": "<provider/model>"
    }
  }
}
```

- `members` — array of `provider/model` strings. Council size = array length.
- `chair` — optional model for the synthesizer; if omitted, the synthesizer inherits the parent's model.

brainstorming owns the gate: it resolves this config via `gauntlet_setting`, emits any malformed-config warning, and decides whether to invoke this skill. This skill is dispatched **only after** brainstorming confirms `verdict` is `council`, so it runs the council unconditionally on entry — no offer, no numbered choice. Absent/empty/malformed config never reaches here (brainstorming runs the fresh-`worker` critique instead). Ownership of "should the council run" lives in brainstorming, not here.

## The council run

### 1 — Fan out to members

Create an absolute temp dir outside the worktree so member files are never tracked by git:

```bash
mktemp -d   # absolute path, e.g. /tmp/tmp.XXXXXX
```

Dispatch one member per configured model, in parallel, each writing its critique into that dir. Do **not** read these files yourself — they are for the chair.

Capture the worktree path once (`git rev-parse --show-toplevel`, run from inside the worktree) and pass it as `cwd:` on every dispatch below — a child otherwise inherits pi's launch dir (the primary checkout), not the worktree.

```
subagent({
  control: { needsAttentionAfterMs: 600000 },
  tasks: members.map((model, i) => ({
    agent: "spec-council-member",
    model,
    cwd: "<abs worktree path>",
    task: "Problem statement: <the problem the spec addresses, from its Context section and the user's stated intent>.\n" +
          "Read the spec at <abs path to doc/specs/...>. Critique it on your five axes and emit your template.",
    output: "<tmpdir>/member-" + i + "-" + slug(model) + ".md"
  }))
})
```

`control` is a **run-level** field: it must sit beside `tasks`, not inside the `members.map(...)` task objects (the per-task schema has no `control` field and would silently drop it). The 10-minute `needsAttentionAfterMs` suppresses false-positive "no observed activity" idle notices — members do one long, tool-less reasoning turn that crosses the 60s default with zero activity events — while still letting a genuinely wedged run surface eventually.

`slug(model)` = the model string with `/` and any other non-alphanumeric character replaced by `-` (so `provider/model` → `provider-model`); the chair recovers this slug from each filename for `raised-by` attribution. Relative `output:` paths in parallel mode resolve against the worktree and would get committed — always use the absolute temp dir.

If a member fails (e.g. its model is unreachable in this preset), skip it and continue as long as at least one member succeeded. If **all** members fail, abort the council, say so, and return to the user gate.

### 2 — Synthesize and adjudicate

Dispatch the chair once. It reads the member files (not you), the spec, and the problem statement, and returns one consolidated, conflict-resolved report. You ingest **only** this report.

```
subagent({
  agent: "spec-council-synthesizer",
  model: <chair from config, else omit to inherit>,
  cwd: "<abs worktree path>",
  control: { needsAttentionAfterMs: 600000 },
  reads: [ <the member file paths under the temp dir> ],
  task: "Problem statement: <paste>. Spec: <abs path>.\n" +
        "Member critiques (already injected via reads — do not search for them):\n" +
        members.map((model, i) => "<tmpdir>/member-" + i + "-" + slug(model) + ".md").join("\n") + "\n" +
        "Consolidate and adjudicate the member critiques."
})
```

The chair runs one long single-turn synthesis (one observed false positive ran 506s); `control: { needsAttentionAfterMs: 600000 }` raises the idle threshold to 10 minutes so the healthy run is not flagged stale, without disabling attention tracking entirely.

List the exact member paths in the task text. The `reads:` array injects their contents, but the chair's prompt expects the paths explicitly; without them it scans the tree for `*.md` and stalls.

If the configured `chair` model is unreachable, retry once with the inherited model.

### 3 — Decide and apply

For each cluster in the chair's report, decide one of:

- **apply** — make the concrete edit to the spec under `doc/specs/` now.
- **defer** — out of scope for this spec; name where it belongs. Do not edit the spec.
- **reject** — one-line reason. Do not edit the spec.

Also inline any `external-ref:` cluster you have context for (e.g. a ticket fetched during brainstorming) as part of the apply-set — this is your call, same as any other cluster.

You are the advocate — decide on scope grounds — and, unlike a dispatched subagent, also the executor: you hold `edit`/`write` tools directly, so apply the edit yourself instead of proposing it for someone else to make. Do this **before** returning to brainstorming.

### 4 — Emit the audit

Return a structured audit, gate-only (not a committed spec section) — three labelled lists:

- `Applied:` — cluster -> the concrete edit made.
- `Deferred:` — cluster -> where it belongs.
- `Rejected:` — cluster -> one-line reason.

Hand this audit to brainstorming along with the now-final spec. brainstorming writes it into the **spec commit message body** (git-native, readable pre-squash) so it survives for finish-time revert visibility, then shows it to the user alongside the final spec at its one review gate. The user can revert any applied edit there — that gate, not this skill, is where ratification happens.

### 5 — Clean up

Re-run brainstorming's placeholder scan over the applied result. Remove the temp dir (`rm -rf` the `mktemp -d` path). Nothing council-related (member files) is ever staged.

Single pass — no automatic re-roast loop. The user can invoke this skill again after the gate for another round.

## Red flags — STOP

- Running the council when `piGauntlet.specCouncil.members` is absent or empty (brainstorming owns the gate and should have used the worker fallback).
- Reading member critique files yourself instead of routing them through the chair.
- Writing member files to a relative path (they land in the worktree).
- Applying edits without surfacing the audit at brainstorming's gate — apply-before-the-gate is correct; apply-without-the-gate is not.
- Suppressing a finding instead of routing it to applied, deferred, or rejected in the audit.
- Surfacing member-vs-member disagreements to the user instead of letting the chair adjudicate.
- Editing anything other than the spec under `doc/specs/`.

## Project overrides

If `.pi/gauntlet-overrides.md` exists, read it. Any sections relevant to this skill — by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention — override or extend the instructions above. Project-local `AGENTS.md` is already in context — check it for project-specific routing tables, service paths, and verification commands.
