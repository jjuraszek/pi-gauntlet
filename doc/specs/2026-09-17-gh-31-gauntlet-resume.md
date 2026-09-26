# gauntlet-resume: human-only re-entry into an interrupted gauntlet flow

> **Superseded by:** [doc/specs/2026-09-17-gh-37-worktree-by-path.md](./2026-09-17-gh-37-worktree-by-path.md) - "<primary>" derivation formula and worktree-path resolution in the entry check only
> **Superseded by:** [doc/specs/2026-09-20-gh-40-gauntlet-handoff-shared-brief-contract.md](./2026-09-20-gh-40-gauntlet-handoff-shared-brief-contract.md) - "Argument grammar" (zero-argument form) and "Cohort drift verification" (provenance) sections only
> **Superseded by:** [doc/specs/2026-09-25-resume-spec-seed.md](./2026-09-25-resume-spec-seed.md) - "never runs `git worktree add`" boundary and the argument classification table only

Ticket: https://github.com/jjuraszek/pi-gauntlet/issues/31
Handoff contract provenance: pi-cohort `doc/handoff-template.md` at worktree `prune-prompts` commit `d737eb9` (not yet on pi-cohort main). The grammar is inlined below; the cohort file is provenance, not a runtime dependency.

**Goal:** A new pi-gauntlet skill, `gauntlet-resume`, that continues an interrupted gauntlet run in a fresh session. It is the **only** resume path: `writing-plans` loses its "Resuming with a spec in hand" subsection entirely. Resume accepts (a) a pi-cohort handoff brief as a file on disk or pasted inline, or (b) a bare worktree name/path whose artifacts (spec, plan) it reconstructs state from. Free-form prompts are not a resume input - they redirect to `/skill:brainstorming`.

## Why

Resuming an interrupted flow today is unguarded and unaided (#6: an implement phase continued without guards). pi-cohort's `/handoff` produces a brief with a fixed section grammar and an optional `## Process state` section carrying verbatim `phase_tracker status` / `plan_tracker status` output. pi-cohort owns only the template; this spec owns the consumer.

## Design

### File layout (approach B: skill + references)

```
skills/gauntlet-resume/
  SKILL.md                        # argv, entry checks, early stops, procedure dispatch, continuation table
  reference/brief-contract.md     # handoff grammar + tracker output grammar + per-stage restore call table
  reference/reconstruction.md     # bare-worktree artifact reconstruction procedure
```

`reference/brief-contract.md` is the single concentration point for cohort-coupled text so the drift check has one file to compare.

### Frontmatter

- `name: gauntlet-resume`, `description` per repo convention.
- `disable-model-invocation: true` - human-only entry, same key as `chase-bug`, `check-delivery`, `gatekeep-pr`. A model-invoked resume would be a self-arm path around the phase guards (the #6 failure mode). Pi has no `user-invocable` key; `/skill:` invocability is the default.
- `argument-hint: "[<brief-file>] [<worktree-name-or-path>]"`.

### Argument grammar

`/skill:gauntlet-resume [<brief>] [<worktree>]` - zero to two positional tokens, plus optional pasted text after the command line.

| Form | Meaning |
|---|---|
| `<brief-file>` | readable file whose line 1 starts `# Handoff:` |
| pasted text whose first line starts `# Handoff:` | inline brief (equivalent to a file) |
| `<worktree>` alone | bare name resolved as `<primary>/.worktrees/<name>`, or an absolute path; must already be a git worktree |
| `<brief> <worktree>` | brief plus an explicit worktree override (required when the brief's worktree field is `no`/`unavailable`/not a git repo; must equal the brief's worktree after `realpath` otherwise) |
| anything else | not a resume input - stop with "this is a new idea - run /skill:brainstorming" |

`<primary>` is the checkout owning `.worktrees/`: `dirname $(git rev-parse --git-common-dir)` (not `--show-toplevel`, which returns the linked worktree when run inside one). A pasted brief that needs an override uses the file form. This skill never runs `git worktree add`.

### Entry checks (SKILL.md, all before any tracker mutation; each stop prints the offending path/field/line)

1. `phase_tracker({ action: "status" })` - if any phase is not pending, stop: "session already carries flow state - reset is your call". Resume runs only on an idle session.
2. Resolve the target worktree (brief field, override, or bare argument). Stops: path missing or not a git worktree; override and brief worktree differ after `realpath`; brief has no `## Repo state` heading (prefix match: `## Repo state` or `## Repo state: not a git repo`); brief worktree is `no`, `unavailable`, or `not a git repo` and no override was given (a `worktree: no` brief without process state is the brainstorming route, not a stop - see Dispatch).
3. Session cwd binding: `phase_tracker`, `plan_check`, and the flow guards resolve every path against the extension's session cwd (`extensions/phase-tracker.ts:800,832-833`); a child-shell `cd` cannot relocate it. If `realpath $(git rev-parse --show-toplevel)` of the session cwd differs from the resolved worktree, stop: "restart pi in <worktree> and re-run". Every restoration therefore runs with the session rooted in the resolved worktree.
4. Announce HEAD/dirty drift between the brief's `## Repo state` and the live worktree (informational, not a stop).
5. Skills loaded: for each name in `## Skills loaded` (or none for `## Skills loaded: none`), match against `skills/*/SKILL.md` frontmatter `name` in this package; load each match's complete body into the transcript; list non-matches as skipped. Loaded bodies are context only - no skill's entry actions run until Dispatch names one.

### Dispatch

| Input | Route |
|---|---|
| brief with `## Process state` | process-state restore (brief-contract.md) |
| brief without process state, `## Skills loaded` names `chase-bug` | hotfix route (below), before any artifact reconstruction, no tracker calls |
| brief without process state, `worktree: no` | invoke `/skill:brainstorming` with `## Intent` as the idea, in the current directory; resume creates no worktree - brainstorming's own Worktree First applies (a plain handoff is a new flow) |
| brief without process state, worktree present | reconstruction (reconstruction.md) with `## Intent` and `## Decisions` carried into every confirmation prompt |
| bare worktree | reconstruction; confirmation prompts state that no brief context is available (never invent Intent/Decisions) |

Hotfix route: `skills/chase-bug/hotfix.md` consumes only a hotfix record at `$TMPDIR/hotfix-<slug>.md`. If `## Decisions` or `## Intent` names an existing record path, hand it to hotfix.md and skip its worktree-create step when the brief's worktree exists (reuse it). Otherwise invoke `/skill:chase-bug` triage with `## Intent` to re-derive the record.

### Handoff brief grammar (reference/brief-contract.md, inlined from cohort `d737eb9`)

Headings, fixed order; a consumer keys on headings, never prose:

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
| `## Process state` | `phase_tracker status` then `plan_tracker status` verbatim; `Active task: <name|none>`; the line `Gate history not restored - re-validate before advancing.` | only when both tracker tools exist and a phase is `in_progress` |

Consumer rules (cohort): process state absent -> plain handoff; present with `No plan active.` -> phase-only, restore no plan; loading named skills is the consumer's job.

Tracker output grammar (must match `formatStatus` in `extensions/phase-tracker.ts:329-338` and `extensions/plan-tracker.ts:69-78`):

```
Phases:
  ✓ brainstorm
  → implement(W2)
  ○ verify (reason)
```
Glyphs `✓` complete, `→` in_progress, `⊘` skipped, `○` pending; `(reason)` suffix when set; `name(substep)` only on the in-progress phase.

```
Plan: 2/5 done (1 in progress, 2 pending)

  ✓ [0] <name>
  → [1] <name>
```
or `No plan active.`. Task glyphs `✓` complete, `→` in_progress, `✗` failed, `⊘` skipped, `○` pending, mapping 1:1 onto `plan_tracker init` `{name, status}` statuses. A task line not matching `^\s*[✓→✗⊘○] \[\d+\] .+$` is the "unparsable process-state task line" stop; a process-state section whose phase block shows all `○` is contradictory and stops.

### Process-state restore (reference/brief-contract.md)

Facts that fix the order: `nextGauntletEntered` arms only on `start brainstorm` (`extensions/lib/phase-tracker-helpers.ts:114-122`); `plan_check` stamps only when armed, else returns `PASS (no flow to stamp)` (`extensions/phase-tracker.ts:847-854`); `start implement` rejects without a stamp (`:920-923`); `skip` has no state precondition and takes a reason; one phase is active at a time (`:895-909`); `complete verify` is blocked without a conformance-reviewer dispatch when closure review is enforced (`:977-990`); `plan_tracker init` on an in-progress implement with every task complete/skipped auto-completes implement (`:418-428`).

Per-stage call table, keyed by the brief's active phase. `R` = `resume: <brief file or "pasted brief">`.

| Active | Calls, in order |
|---|---|
| brainstorm | `start brainstorm`; `substep` if the brief shows one |
| plan | `start brainstorm`; `skip brainstorm R`; `start plan`; `substep` if shown |
| implement | `start brainstorm`; `skip brainstorm R`; `start plan`; `plan_check({ planPath })`; on FAIL print findings and stop with plan in_progress, no init; on PASS `skip plan R`; `start implement`; `substep` if shown; `plan_tracker init` |
| verify | as implement through `skip plan R`, then `skip implement R`; `start verify`; `plan_tracker init` |
| ship | as verify. Restoration stops at verify in_progress: `complete verify` needs a fresh conformance dispatch and `skip verify` would bypass a real gate. Announce that the closure review re-runs before ship |

`planPath`: the brief carries none. Resolve as in reconstruction - the single spec/plan pair added after base in the worktree, paired by identical basename (`doc/specs/<name>.md` <-> `doc/plans/<name>.md`, the writing-plans contract); zero pairs -> stop; more than one -> human picks.

"Exact" restoration binds: the active phase identity and substep, and the plan task list (names, order, statuses) verbatim. Prior phases show `⊘ (resume: ...)` regardless of the brief's glyph - skip-arming is the ticket's mechanism and completing priors would fabricate gated history. `No plan active.` -> no `init` call. Before `init`, validate feasibility: pending-suffix order (`extensions/plan-tracker.ts:136-146`) and the implement auto-complete edge; an implement brief whose tasks are all complete/skipped is infeasible as stated - propose verify as the target and ask.

Every restore ends with: "Gate history not restored; re-validating `<task>` before any stage advance", where `<task>` is `Active task`, else the first in-progress task, else `none` (whole-deliverable re-validation).

### Bare-worktree reconstruction (reference/reconstruction.md)

- Base = `git merge-base HEAD origin/HEAD`, else `main`/`master`; unresolvable -> ask the human for a base before reading artifacts.
- Candidates: files under the spec/plan dirs (`flowGuards.specDirs`, default `doc/specs` + sibling `doc/plans`) added after base, plus untracked files there. Spec/plan pair by identical basename. Plan commit = first post-base commit adding the plan file.
- No spec candidates -> stop, offer `/skill:brainstorming`, no tracker call. Multiple specs -> human picks one.
- Spec without plan -> one approval question (with `## Intent`/`## Decisions` when brief-derived). Approved: `start brainstorm`; `skip brainstorm resume: <spec path>`; `start plan`; continue in writing-plans. Unapproved: invoke `/skill:brainstorming` with the spec as the draft; arm nothing (using-git-worktrees Step 0 detects the existing worktree and creates none).
- Spec + plan -> show: per-task commits after the plan commit touching its declared `Files:` (strip trailing `:digits[-digits]` before matching `git log -- <path>`), uncommitted files, proposed statuses (`complete` iff >=1 matching commit, else `pending`), proposed stage (`implement` if any pending, else `verify`). The human confirms or edits both in one reply; no tracker calls before. Validate the confirmed snapshot (pending-suffix; all-complete + implement is infeasible) and reject infeasible edits citing the offending rows - never rewrite confirmed state silently.
- After confirmation: `start brainstorm`; `skip brainstorm resume: <spec path>`; `start plan`; `plan_check`; FAIL -> stop with plan in_progress, no init; PASS -> `skip plan`, then for verify `skip implement`; `start <stage>`; `init` the confirmed non-empty list. Both tracker status outputs must match the confirmed active stage and task list.
- Artifact presence never implies approval; task commits never imply review acceptance.

### Post-restore continuation

| Active after restore | Continue in | Entry point |
|---|---|---|
| brainstorm | brainstorming checklist | on-disk state decides the step: draft marker on line 1 -> step 4; spec title -> step 8. Never `/skill:brainstorming` entry (it resets both trackers) |
| plan | writing-plans body | skip its `start plan` call (already in_progress) |
| implement | subagent-driven-development | re-validate `<task>` first (re-run its `Tests:`), then the task loop from the first non-complete task |
| verify | verification-before-completion | full conformance gate; nothing carried over |

### Cross-cutting edits (same change)

- `skills/writing-plans/SKILL.md`: delete "Resuming with a spec in hand" and every mention; the `start plan` call becomes conditional - skip it when plan is already in_progress (the deleted subsection's "no second start" rule survives here; a second `start` clears `firedGuards`, `extensions/phase-tracker.ts:929-938`). Stated entry points: the flow's brainstorm->plan transition, and `gauntlet-resume`.
- Rewrite (not just delete the word) the three `intercom` sentences so no clause dangles: `skills/dispatching-parallel-agents/SKILL.md:209`, `skills/brainstorming/SKILL.md:41`, `doc/configuration.md:93`.
- `scripts/ci.mjs` `tokenChecks`: add absent-probes - `skills/writing-plans/SKILL.md` for `spec in hand` and `Resuming with`; the three files above for `intercom` - so `npm test` enforces the ticket's `rg` assertions.

### Cohort drift verification

Drift already found and applied by inlining `d737eb9` over the cohort spec text: `dirty: clean` literal, `base: unknown` + `diff-stat: unavailable`, `branch: detached`, `## Skills loaded: none` suffix form. Ship-time gate: if pi-cohort main ships `doc/handoff-template.md`, diff it against `reference/brief-contract.md` and reconcile before merge; if it has not landed, surface that at the finish gate for a human decision (merge against `d737eb9`, or wait) - not pre-authorized either way.

## Error handling and edge cases

- All classification, parse, and binding failures stop before any tracker mutation (entry check 1 is read-only).
- `unavailable` fields inside `## Repo state` are legal; only the worktree field being `no`/`unavailable`/non-git without an override is a stop on the process-state route.
- `plan_check` FAIL leaves the session at plan in_progress with no plan init, on both routes; arming has already happened by then (the stamp needs it).
- Confirmation edits override proposals; infeasible edits are rejected with the offending rows, not corrected.
- Gate history, closure-review evidence, and fix rounds are never inferred or restored; a ship-stage brief resumes at verify.

## Testing

- `npm test` (`scripts/ci.mjs`): skill frontmatter/name lint for the new directory; the new `tokenChecks` absent-probes enforce the ticket's two `rg` assertions.
- Manual acceptance: `rg -ni "jjuraszek|/Users/[^/]+" skills/` has no new matches (generic-skill rule from AGENTS.md).
- Plan-task walkthroughs in a scratch session with synthetic briefs: process-state restore at each of the five active stages (ship stops at verify), `No plan active.` phase-only, chase-bug with and without a record path, `worktree: no`, each reconstruction outcome, each early stop (non-idle session, cwd mismatch, override mismatch, missing Repo state, bad task line), asserting tracker end-states.

## Documentation impact

- Feature / user-facing docs introduced: `skills/gauntlet-resume/SKILL.md` + `reference/` (the feature surface itself)
- Materially amended existing docs: `doc/configuration.md` (flow-guards section gains the resume entry point; intercom sentence rewritten), `skills/writing-plans/SKILL.md` (entry points rewritten, conditional `start plan`), `README.md` (skill count 17 -> 18; explicit-invocation-only roster gains `gauntlet-resume`), `AGENTS.md` (routing row: "Resume an interrupted flow" -> the skill), `CHANGELOG.md` `## Unreleased` entry; `.claude-plugin/marketplace.json` is not widened (tracker-tool dependent, pi-only)
- Derived / memory docs invalidated: none

## Open questions

- None blocking. The ship-time cohort check is a gate with a human decision, not an open design question.

---

Supersedes `doc/specs/2026-08-07-resume-spec-in-hand.md`, scope: the sanctioned "spec in hand" entry subsection only. Its arming semantics (start/skip/start) and the implement write-guard remain live and are reused here.
