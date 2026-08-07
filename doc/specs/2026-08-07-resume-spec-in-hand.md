# Resume with a spec in hand: sanctioned handoff entry + implement-phase write guard

Closes [jjuraszek/pi-gauntlet#6](https://github.com/jjuraszek/pi-gauntlet/issues/6). Scope is issue #6 exactly as roasted; the three contradictions raised during design (block vs advisory, gesture form, execution-mode choice) were each resolved in favor of the roasted design and are recorded in Decisions below.

## Context

`gauntletEntered` arms only when `phase_tracker start` makes brainstorm `in_progress` (`extensions/lib/phase-tracker-helpers.ts`, `nextGauntletEntered`). Every enforcement surface — flow guards, closure-review gate, closure-model guard, plan->implement edge recovery — is marker-first and dormant when unarmed. That fail-open design is deliberate (`doc/specs/2026-07-19-sole-gauntlet-entry-point.md`).

The incident (issue #6): a handoff doc said "Brainstorming is complete. Entry point: `/skill:writing-plans`". The resumed session never called `start brainstorm`, ran fully unarmed, and the executor rationalized around writing-plans' auto-invoke line — implementing the entire plan inline in the main loop (306 direct tool calls, 2 subagent calls, closure gate off). It used neither sequential nor parallel-wave subagent execution; it invented a third mode: main-loop implementation.

Arming alone would not have prevented it: `recoverableEdge` fires only when the agent idles at a phase edge with no phase `in_progress`, and the incident session ran plan-then-implement continuously. Hence the two halves below are mutually dependent, not independently shippable.

## Problem

1. There is no sanctioned path for a session that starts with an approved spec. `skills/writing-plans/SKILL.md` handles only "auto-chained from brainstorming" and "no spec -> go brainstorm"; a spec-in-hand session either re-brainstorms (wasteful) or improvises (unarmed).
2. Even an armed flow has no guard against the parent writing code during implement. Write guards are brainstorm-only (Guard 3, `brainstorm-write`); subagent-driven-development's "you do not write code yourself" contract is prose only.

## Design

### Half 1 — sanctioned resume gesture (prose only, zero extension code)

`skills/writing-plans/SKILL.md` gains one subsection, "Resuming with a spec in hand", inserted immediately after the skill's existing entry/Input handling (the "no spec -> go brainstorm" branch) and before plan decomposition. The skill's header line ("not a direct human entry point") and Input line ("spec produced by /skill:brainstorming") are amended in the same change to admit the handoff entry.

- **Trigger is phase-tracker state, not handoff prose.** Detection lives in the skill, so it works for old or foreign handoff docs that say nothing about arming. On invocation, branch on `phase_tracker status`:

  | brainstorm status | meaning | action |
  |---|---|---|
  | `in_progress` or `complete` | auto-chain from brainstorming | existing flow unchanged |
  | `pending`, no other phase `in_progress` | fresh resume | run the arming sequence below |
  | `skipped` | already resumed earlier in this session (e.g. plan revision, post-STOP re-invocation) | do **not** re-run the sequence (`start brainstorm` errors on a skipped phase without `force: true`); verify plan state and continue |
  | `pending`, another phase `in_progress` | not a fresh resume (`start brainstorm` would error) | stop and ask; do not arm |

- **Approval-assertion rule.** Any unambiguous assertion of spec approval in the prompt, handoff doc, or user message counts ("Brainstorming is complete", "spec approved" are examples, not an allowlist). Ask the user only when no such assertion exists.
- **Spec must exist.** Verify the spec file exists at the given path before arming. Missing -> stop and ask; never arm on a missing spec.
- **Worktree check.** If not already in an isolated worktree, set one up per `/skill:using-git-worktrees` (the spec must live in the worktree, same as the brainstorm path; copy/commit it there if handed over from outside).
- **Arming sequence, verbatim in the skill body:**

  ```
  phase_tracker({ action: "start", phase: "brainstorm" })
  phase_tracker({ action: "skip", phase: "brainstorm", reason: "resume: approved spec at <path>" })
  phase_tracker({ action: "start", phase: "plan" })
  ```

  This is a documented existing capability, not new mechanics: `nextGauntletEntered` arms on the `start`, `skip` preserves the marker, session replay reconstructs it, `reset` disarms. Verified against source at design time.
- **Scoping per the roast:** the subsection states this is a *handoff path* — used when a spec arrives from another session — not a general shortcut around brainstorming. New work still enters via `/skill:brainstorming`.
- After arming, fall through to the existing writing-plans flow (plan, execution-mode auto-selection, auto-chain to `/skill:subagent-driven-development`) — **except** the skill's own `start plan` call, which the arming sequence already performed (a second `start` on an in_progress phase is a harmless no-op reset, but it re-clears the warn-once ledger; skip it).

Handoff-writing guidance (2-3 lines in the same subsection): a well-formed handoff doc names `/skill:writing-plans` as the entry point — never a phase past planning, since the gesture only arms through `start plan` — gives the spec's path, and asserts approval status.

No changes to `skills/brainstorming/SKILL.md`, no new skill, no new `phase_tracker` action (a dedicated `resume`/`enter` action stays deferred as future hardening, per issue #6).

### Half 2 — implement-phase write guard (extension code)

New warn-once advisory in `extensions/phase-tracker.ts`, mirroring Guard 3 (`brainstorm-write`, currently at `extensions/phase-tracker.ts` ~431-444 — warn-once via `firedGuards`, `addGuardWarning`, never blocks):

- **Predicate:** fires when all hold — tool is `write` or `edit` on the parent event bus; the phase window is open: `implement` is `in_progress`, **or** `plan` is `complete` and `implement` is still `pending` (the incident session plausibly never called `start implement`; the widened window covers the armed post-plan gap where neither the old guard shape nor `recoverableEdge` — which needs an idle session — could fire); `gauntletEntered` is true; `firedGuards` has no `implement-write` entry; the process is not a subagent child (`Number(process.env.PI_SUBAGENT_DEPTH ?? "0") === 0` — pi-cohort sets `PI_SUBAGENT_DEPTH` >= 1 in every spawned child via `getSubagentDepthEnv`, foreground and background alike; implementer forks inherit extensions and replay the parent's phase state, so without this gate every implementer's first write would trip a spurious advisory); `piGauntlet.flowGuards.enforce` is not false (lazy settings read, checked after the in-memory conjuncts to preserve marker-first dormancy); target path is outside the exempt dirs — the configured `specDirs` **plus** each spec dir's sibling `plans` dir (default `doc/specs` -> also exempt `doc/plans`; plans live there per writing-plans, and a routine parent plan-doc edit must not burn the one-shot warning). The brainstorm guard's spec-only exemption is unchanged.
- **Effect:** advisory only — prepend a one-paragraph warning to the tool result (same stash-at-`tool_call`, prepend-at-`tool_result` mechanism), set `firedGuards.set("implement-write", true)`. Never blocks.
- **Message content:** names the orchestrator contract ("during implement, the main loop orchestrates; subagents write code — see `/skill:subagent-driven-development`") and the legitimate exception ("if this is merge-conflict resolution between parallel waves, proceed").
- **Ledger lifecycle:** `implement-write` clears with the existing `firedGuards` phase-transition clears; at most one warning per phase window. A warning fired in the plan-complete window followed by `start implement` (which clears the ledger) can yield a second warning during implement — accepted, still bounded.
- **No bash-mutation twin.** Guard 3's bash heuristics (redirect/tee/`sed -i`/`git apply`) are *not* mirrored — minimal by decision; the write/edit surface catches the observed failure mode.
- **No new settings key.** The guard is a flow guard; `piGauntlet.flowGuards.enforce: false` disables it along with the others.
- **Predicate helper convention:** the enable predicate is a pure helper in `phase-tracker-helpers.ts` following the `markerGuardApplies`/`closureGateBlocks` pattern (define-test-then-inline, settings-dependent conjunct supplied by the caller's lazy `enforce()` read) — not `flowGuardApplies`, whose inputs are all in-memory.
- Subagent-executed edits are unaffected via the `PI_SUBAGENT_DEPTH` gate above. Unarmed/ad-hoc sessions see no new behavior (marker-first, same as every other surface).

### Supersession

`doc/specs/2026-07-19-sole-gauntlet-entry-point.md` claims brainstorming is the only skill that arms the flow. This spec explicitly overrides that claim — the sanctioned resume gesture is a second arming path — rather than silently routing around it. The predecessor gets a supersession banner scoped to the sole-arming claim only; its remaining design (marker-first enforcement, fail-open dormancy, reset semantics) stays live and this spec builds on it.

## Decisions (contradictions resolved during design)

1. **Advisory, not block.** The guard stays warn-once advisory per issue #6 and its roast: the parent's merge-conflict edits between parallel waves are legitimate, and a false-positive block mid-wave is worse than a missed warning. The user's "hard no-go" is served by the combination of arming (half 1) + warning (half 2) + the recovery edge and closure gate that arming re-enables.
2. **Prose-only gesture.** No new skill, no new tracker action. The roast killed promoting skip+start as a broadly-encouraged pattern; the writing-plans subsection documents it narrowly as the handoff path.
3. **No execution-mode choice at resume.** Mode selection remains auto-derived from the plan's wave structure. The incident was not a wrong mode choice — the session bypassed both modes; the guard, not a mode picker, addresses that.

## Edge cases

- Spec path missing at resume -> stop, ask for the correct path; never arm.
- No approval assertion in prompt/handoff -> ask once ("is this spec approved as-is?"); on "no", route to brainstorming.
- Brainstorm `in_progress` when writing-plans is invoked -> not a resume; existing behavior (finish the brainstorm gate) unchanged.
- `flowGuards.enforce: false` -> guard silent; resume prose still works (arming is inert but harmless).
- Merge-conflict edits between waves -> at most one advisory, wording says proceed.
- Guard fires on a legitimate parent edit before any dispatch -> acceptable one-time false positive by design.
- Resume-at-implement (handoff doc points past planning) -> out of scope; the documented gesture ends at `start plan`, and the handoff-writing guidance forbids pointing past it. Note: `recoverableEdge` requires `plan.status === "complete"`, so a session that *skips* plan has no recovery net — the half-2 advisory (whose window includes plan-complete-implement-pending, but not plan-skipped) is also silent until implement starts. Accepted residual gap.
- Session that never invokes writing-plans and free-codes from a handoff -> no skill prose can catch it; the handoff-writing guidance (name the skill entry point) is the mitigation, and half 2 fires if it ever starts implement while armed.

## Acceptance criteria (issue #6, verbatim)

- [ ] Resume gesture documented in writing-plans + handoff guidance; following it yields `gauntletEntered=true`; `reset` still disarms; marker survives session replay.
- [ ] With an armed flow, first parent `write`/`edit` during implement triggers the warn-once guard message referencing subagent-driven-development; subagent-executed edits unaffected; unarmed/ad-hoc sessions see no new behavior.
- [ ] Plan->implement edge recovery and closure gate active in a resumed session (regression-covered).
- [ ] 2026-07-19 spec annotated as partially superseded.

## Testing

- `npm test` (`scripts/ci.mjs`) remains the gate; it runs both `extensions/lib/*.test.ts` (pure-helper tables) and the `extensions/phase-tracker.test.ts` integration harness.
- **AC 1:** unit — `nextGauntletEntered` skip-preserves-marker case (`nextGauntletEntered(true, "skip", "skipped") === true`; currently untested); integration — reconstructed start/skip/start replay yields an armed session; `reset` disarms.
- **AC 2:** unit — predicate state table (fires only when window open + armed + enforced + non-exempt path + not fired + not a subagent child); integration in `phase-tracker.test.ts` — first parent write warns, second stays silent, spec-dir and plans-dir paths exempt, `enforce: false` silent, unarmed session silent.
- **AC 3:** integration — in a resumed (skip-brainstorm) session with plan `complete`, `recoverableEdge` fires at an idle implement edge, and the closure gate blocks `complete verify` without a conformance dispatch. This is distinct from AC 1's marker-replay coverage.
- **AC 4:** banner present on the 2026-07-19 spec (already applied in this worktree; verified by review, no automated test).
- Half 1 is prose; manual verification is running the three-call sequence in a scratch session and observing `status`.

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (one line under flow guards describing the implement-write advisory); `doc/configuration.md` (add the guard to the flow-guards list)
- Derived / memory docs invalidated: `doc/specs/2026-07-19-sole-gauntlet-entry-point.md` (supersession banner, sole-arming claim only)
- Ratified as still accurate, no edit: the "brainstorming-entered flow" phrasing in `README.md`, `doc/configuration.md`, and `AGENTS.md` stays literally true — the resume gesture routes through `start brainstorm`, so every armed flow is still brainstorming-entered in the tracker's terms. The writing-plans header/Input amendments are skill-body (implementation surface), covered in Half 1.

## Out of scope

- Dedicated `phase_tracker` `resume`/`enter` action (issue #6 defers it as future hardening).
- Hard block on parent writes during implement (overridden by Decision 1).
- Execution-mode choice at resume (Decision 3).
- Bash-mutation twin for the implement guard (minimal by decision).
- pi-condense pruning starvation observed in the same incident (sibling-repo concern, cut by the roast).
- Predecessor specs in other services' directories: none known.

## Open questions

None.
