# Gauntlet-bound telemetry: arm on flow entry, write-only until seal at finish

**Goal:** The telemetry record exists only for runs that entered the gauntlet, lives as a git-excluded file in the worktree until `/skill:finishing-a-development-branch` seals and commits it once before landing, and is never read, checked, or stamped by `/skill:gatekeep-pr`.

Ticket: none (free-text origin). Supersedes parts of `doc/specs/2026-09-17-gh-33-run-telemetry-recorder.md` (Binder, Record store, Flusher, Ship, Diff), the `bin/gauntlet-telemetry-salvage.mjs` section of `doc/specs/2026-09-18-gh-35-gauntlet-performance-telemetry-report.md`, and `doc/specs/2026-09-18-telemetry-record-deliverable.md` in full. `doc/specs/2026-09-24-gh-51-jj-telemetry-diff.md` stays in force for plain jj workspaces (see "jj workspaces").

## Problem

`extensions/telemetry.ts` binds a record on any successful `write`/`edit` under `doc/specs/*.md`, on any passing `plan_check`, or on session-start replay (`telemetry.ts:433-446, 469-483, 526-541`), with no check that the gauntlet was entered. A colleague wrote a spec by hand, opened a PR, and `/skill:gatekeep-pr`'s merge course ran `gauntlet-telemetry-salvage.mjs`, which stamps any present `in_progress` record without a ship phase as `status: shipped` (`salvage.mjs:73-97`). The result is a "shipped" gauntlet run that never happened.

Separately, the recorder commits the record at every checkpoint (`commitRecord`, `telemetry.ts:245-278`): phase transitions, `plan_check` passes, ship, discard, shutdown. On squash landings the commits collapse; on PR landings merged with the merge or rebase method every phase leaves a `telemetry: <spec>` commit in main history. The salvage bin exists only to undo a side effect of that policy (agents deleting the separately committed record as scaffolding).

Corrected premise from the questionary: "each update amends the initial telemetry commit" is not implementable - `git commit --amend` rewrites HEAD only. Chosen instead: no checkpoint commits at all, one commit at seal.

## Acceptance criteria

none - no ticket

## Decisions (from the questionary and council)

| # | Decision | Why |
|---|---|---|
| 1 | The recorder binds only while the gauntlet-entered marker is armed | The marker already exists in `phase-tracker-helpers.ts:nextGauntletEntered`; a bare spec write is not a run |
| 2 | No checkpoint commits; the record is an untracked file until seal | Removes per-phase history noise; crash durability is the file on disk, not a commit |
| 3 | Seal is a mandatory finishing step for the PR, draft-PR, and squash-merge landings, before their first git/gh command | Those commands read the branch ref, so the record must be committed first; finishing already owns the plan strip and landing |
| 4 | Keep leaves the record untracked and `in_progress`; Discard deletes the worktree and the record with it; no `abandoned` records are produced any more | A kept branch is sealed by a later finishing run; a discarded run has nothing to report |
| 5 | gatekeep-pr contains no telemetry mention | Its salvage bullet was added to counter deletion; the mention keeps the tendency alive. gatekeep-pr is about the change |
| 6 | `plan_check` outside an armed gauntlet binds nothing | It is a lint, not a run |
| 7 | The salvage bin is repurposed into `bin/gauntlet-telemetry-seal.mjs`; restore mode and the history walk go | No checkpoint history exists to walk; stamping YAML from a skill body with sed is error-prone and the bin already has the parser and tests |
| 8 | The untracked record is hidden from git through `<git-common-dir>/info/exclude`, written by the recorder at bind | One idempotent line makes every bare `git status --porcelain` in the flow - including pi-cohort's `worktree: true` isolation check and `git worktree remove` - blind to the record, with no skill or sibling edits; the seal stages it with `git add -f` |

## Design

### Recorder (`extensions/telemetry.ts`)

**Arming.** The recorder keeps a `gauntletEntered` boolean derived from the same successful `phase_tracker` tool results it already replays and observes live, using the shared `nextGauntletEntered(prev, action, phases.brainstorm.status)` from `extensions/lib/phase-tracker-helpers.ts`. Reconstruction runs on the same lifecycle events phase-tracker uses (`session_start`, `session_switch`, `session_fork`, `session_tree`), walking the branch in order so any session reaches the value the original had. No new file, setting, or channel: `phase-tracker.ts` keeps its own copy in its closure; both derive from the transcript.

**Epochs.** `phase_tracker reset` ends an epoch: it unbinds (unchanged), clears the event buffer, the pending usage accumulator, and the replay bind candidates (`planCheckSpec`, `lastSpecWrite`), and disarms the marker. While the marker is down nothing is buffered or accumulated - activity outside the gauntlet is never charged to the next run. Bind eligibility also ends when the ship phase completes or the record is frozen (below), until the next `start brainstorm`.

**Bind rule.** An unbound, eligible recorder binds on the first of:

- a successful `write`/`edit` under `**/doc/specs/*.md` (live, or replayed - replay recognises `edit` as well as `write`);
- a passing `plan_check` (its `specPath`);
- a successful plan-file read or write whose `**Spec:**` header names a spec;
- a successful `phase_tracker skip brainstorm` whose reason is `resume: <spec path>` - the call gauntlet-resume's reconstruction always makes, so every resume route binds without editing the spec.

Binding to a spec whose record already exists on disk and is still `in_progress` reloads that record; a record that is already sealed (`status` not `in_progress`) is never bound - the recorder stays unbound and eligible, and the interaction is ignored; otherwise it creates one. Draft-to-final rename (`rebind`, gated on a draft or missing bound spec) is unchanged, `git mv` included. A spec write, `plan_check`, or plan read while the marker is down is ignored: no file, no buffer, only the existing debug line.

**Exclude line.** On bind in a git checkout the recorder appends `<telemetry.dir>/` to `$(git rev-parse --git-common-dir)/info/exclude` if the line is absent. Excluded untracked files are invisible to `git status --porcelain` (with or without `--untracked-files=all`), are not swept by `git add -A`, and do not block `git worktree remove`. Records already tracked on `main` are unaffected (exclude governs untracked paths only). A jj checkout skips this step.

**Persistence.** `commitRecord` and every call to it are deleted, and with them the `index.lock` retry and the jj "written, not committed" warning. `flush(checkpoint)` becomes `flush()`: serialize and write the YAML to `<toplevel>/<telemetry.dir>/<spec .md -> .yaml>`; that is the whole store. Phase transitions, `plan_check` passes, bind, and `session_shutdown` all end in `flush()`. `bind()` keeps its existing metadata git calls (`checkoutOf`, `config user.name/email`, `rev-parse --abbrev-ref`); the recorder never runs `git add` or `git commit`.

**Ship detection removed (git).** The `tool_call` hook's recognition of `git merge --squash`, `git push`, `gh pr create`, `git worktree remove`, and `git branch -D` (`telemetry.ts:735-773`), `shipAttempt`, and the git branch of the keep-path seal (`onShipKeep` on `phase complete ship`) are deleted. `shipped_at`, `status`, `derived.diff`, `derived.modified_files`, `derived.duration_s`, and `gates.ship_option` are written by the seal bin. `abandoned_at` is no longer produced (the field stays declared for old records).

**jj workspaces.** Finishing is git-only (its Input step runs `git rev-parse --git-common-dir`), so the seal bin never runs in a plain jj workspace. The keep-path seal of `doc/specs/2026-09-24-gh-51-jj-telemetry-diff.md` therefore stays, restricted to `checkoutVia === "jj"`: on `phase complete ship` the recorder stamps `status: shipped`, `shipped_at`, computes the jj diff through the extracted diff module, re-derives, and writes (jj snapshots the working copy, so no commit step exists). gh-51's contract is unchanged in that branch; its git-side trigger is gone.

**Sealed-record freeze.** Before every `flush()` the recorder re-reads the on-disk record; if it parses and its `status` is not `in_progress`, the recorder sets `frozen` and skips the write for the rest of the session, so a shutdown flush cannot overwrite the seal with the stale in-memory record. The existing shipped-spec write guard (`telemetry-ship.ts`) keeps reading `status` from disk and is unaffected; the recorder no longer increments `spec_edits_after_ship` (the field stays declared for old records).

### Diff module (`extensions/lib/telemetry-diff.ts`)

`computeGitDiff`, `computeJjDiff`, `JJ_MAINLINE`, and `aggregateNumstat` move out of the `telemetry.ts` closure into a lib module with a runner seam `(args: string[], cwd: string) => RunResult | Promise<RunResult>` (`RunResult = { code, stdout, stderr }`, the recorder's existing `GitResult` shape), so the recorder passes its async `deps.git`/`deps.jj` and the bin passes a `spawnSync` adapter. The diff shape is unchanged: `{ base, commits, buckets: { <bucket>: { files, insertions, deletions } } }` with buckets from `piGauntlet.telemetry.buckets`, `commits` from `git rev-list --count --invert-grep --grep='^telemetry: ' <base>..HEAD`, and the `<telemetry.dir>` and plan exclusions of `modifiedFilesFrom`.

### Seal bin (`src/bins/gauntlet-telemetry-seal.mjs` -> `bin/gauntlet-telemetry-seal.mjs`)

Replaces `gauntlet-telemetry-salvage.mjs` (source, bundle, test, `package.json#bin`, `scripts/build-bins.mjs` entry, `scripts/ci.mjs` assertions, `scripts/packed-install-smoke.test.mjs` invocations). Invocation:

```
node <package>/bin/gauntlet-telemetry-seal.mjs --worktree <abs path> --option <pr|squash> --base <ref> [--spec <spec path: repo-relative, ./-relative, or absolute inside the checkout>] [--dir <telemetry dir>]
```

Behaviour, in order:

0. Malformed invocation (missing `--worktree`, `--option`, or `--base`; unknown option value; `--spec` outside the checkout or not a `doc/specs/*.md` path): usage on stderr, exit 1. `--spec` is normalized to its repo-relative form first; the record path is always repo-relative (`<telemetry.dir>/<spec>.yaml`), never derived from an absolute path. Resolve `piGauntlet.telemetry` from the two settings layers exactly as salvage does (`--dir` overrides `dir`). `enabled: false` -> print `telemetry disabled`, exit 0. `--worktree` not a git checkout -> `not a git checkout`, exit 1. `--base` unresolvable -> `no base ref <ref>`, exit 1.
1. Candidates. With `--spec`: that one record path. Without: the records that exist under `<telemetry.dir>` for specs changed in `git diff --name-only <base>...HEAD`. Zero candidates -> `no telemetry run`, exit 0 (a non-gauntlet branch, or a run whose spec finishing could not name and that has no record).
2. Per candidate. Missing file (only possible with `--spec`) -> `no record at <path>`, exit 2. Unparseable -> the parser message, exit 2. `status: shipped` and the record is tracked with no diff against HEAD (`git ls-files --error-unmatch` and `git diff --quiet HEAD -- <record>`) -> `already sealed <path>`, continue. `status: shipped` but untracked or modified -> a previous seal's commit failed: go to step 4 with the file as is. Any other status not `in_progress` (a legacy `abandoned` record) -> `already sealed <path>`, continue - never restamped.
3. Stamp `status: shipped`, `shipped_at: <now ISO>`, append a `ship` event with `option: <pr|squash>`, compute `derived.diff` and `derived.modified_files` through the diff module, then run `derive(rec, shipped_at)` so `duration_s`, `gates.ship_option` (a string, as `gauntlet-performance` reads it), and every other derived field are consistent at the seal timestamp.
4. Write the record, `git add -f -- <record>`, `git commit -q -m "telemetry: <spec>" -- <record>`. On add/commit failure restore the pre-seal bytes (as salvage's `stampPresent` does), unstage, print the git error on stderr, exit 1. Success -> `sealed <path>`.

Exit codes: 0 sealed, already sealed, disabled, or nothing to seal; 2 a named record is missing or a candidate is unparseable; 1 usage, environment, or git failure. The bin never deletes, restores, or walks history.

### Finishing (`skills/finishing-a-development-branch/SKILL.md`)

The "Strip the plan, keep the record (Options 1-3)" block keeps the plan strip and replaces the salvage call with the seal call. `--option` is `pr` for Option 1 (PR) and Option 2 (draft PR), `squash` for Option 3 (squash-merge); the detached-HEAD menu's "push as new branch" rows are `pr`, its Keep and Discard rows run no seal. `--base` is the block's `<base-branch>`. `--spec` is the plan header's `**Spec:**` value when a plan exists in the worktree or session; otherwise omitted. Any nonzero exit stops the flow before the first landing command, quoting the bin's line - exit 2 means a gauntlet run whose recorder never armed, exit 1 an environment or git failure; the user decides. Option 4 (Keep As-Is) and Option 5 (Discard) run no seal; Discard's `git worktree remove` needs no `--force` because the record is excluded. The Quick Reference column "Plan strip + record salvage", the Common Mistakes entries naming salvage, and the "Telemetry record" lines under each option are rewritten to name the seal; each option block still names the record as a deliverable (the `scripts/ci.mjs` assertion at line 301 stays).

### gatekeep-pr

Remove the telemetry clauses only, leaving the surrounding rules intact: `reference/assessment.md` lines 70-82 (the `Telemetry record` bullet), `reference/post-selection-loop.md` line 17 (the "never delete ... telemetry" child-contract clause), line 21 (the pre-push salvage run), and line 27 (the merge-course exception - the sentence collapses to the bare "never bundled into one selection" invariant), and `reference/decision-menu.md` line 16 (the footnote). The word `telemetry` does not appear anywhere under `skills/gatekeep-pr/` afterwards. `scripts/ci.mjs` drops `skills/gatekeep-pr` from the bin path-resolution loop (lines 289-291) and replaces its two post-selection-loop assertions (lines 305-306) with one: `rg -i telemetry skills/gatekeep-pr` returns no match.

### Cleanliness checks (verified, no edits)

With the record excluded, every check in the flow that reads git status sees a clean tree. Verified against the source:

| Check | Sees the record? |
|---|---|
| pi-cohort `worktree: true` isolation (`src/runs/shared/worktree.ts:107-110`, bare porcelain) - dispatched by subagent-driven-development, dispatching-parallel-agents, the conformance fix wave, and finishing's fix loop | no - excluded untracked paths are not listed |
| `using-git-worktrees` Step 0 bare porcelain | no |
| `verification-before-completion/reference/conformance-check.md:379-380` freshness pair (`diff --stat <base> -- .` and `--untracked-files=all`) | no - untracked and not swept, so never tracked before seal |
| `gauntlet-resume/SKILL.md:76-78` drift notice and `reference/reconstruction.md:74` uncommitted-files list; pi-cohort handoff's `dirty:` line | no |
| finishing Step 6 `git worktree remove "$WORKTREE"` (no `--force`) | no - excluded files do not block removal |
| finishing's skip rule `':!<telemetry.dir>'` | already excluded; unchanged |
| gatekeep-pr, chase-bug (`--untracked-files=no`), chase-bug hotfix baseline delta, subagent-driven-development happy-path snapshot pair, dispatching-parallel-agents reviewer precondition | no |

A consumer repo that already gitignores `<telemetry.dir>` behaves identically; the seal's `git add -f` covers both.

### Resume and handoff

gauntlet-resume's reconstruction begins with `phase_tracker start brainstorm` (arms) and `skip brainstorm resume: <spec path>` (binds - creates or reloads the record). The brief's phase history backfills phases as today. gauntlet-handoff and pi-cohort's `handoff` are untouched; their `dirty:` line is clean because the record is excluded.

### Brainstorming

The Worktree First paragraph keeps naming the record as a deliverable that ships in the squash and drops the salvage sentence: "`/skill:finishing-a-development-branch` strips the plan, then seals and commits the record before landing."

## Errors and edges

- **Marker down, spec written** (the incident): no bind, no file. gatekeep-pr lands the PR with no telemetry involvement.
- **Reset mid-run**: unbind, buffers and candidates cleared, marker down. The next `start brainstorm` + spec write binds a fresh run (or reloads the same spec's record on a same-spec redraw).
- **Second run in one session** (spec A shipped, reset, spec B): A's record is frozen; B binds a new record; nothing from A's epoch is charged to B.
- **Session navigation** (`pi -c`, `session_switch`, fork, tree): marker and candidates are rebuilt from the target branch in order; a branch with no `start brainstorm` stays unbound even if a record exists on disk. Running gauntlet-resume arms and binds it.
- **Seal commit fails** (hook, lock): pre-seal bytes restored, exit 1, finishing stops. If restoration itself fails the file is `shipped` but untracked; the retry's step 2 detects that and commits it.
- **Seal succeeds, push fails**: the record is `shipped` on the branch; the retried finish prints `already sealed` and lands. `shipped_at` is the first attempt's time; accepted.
- **Supersession edits**: the branch touches a predecessor spec with no record; with `--spec` it is not a candidate, without `--spec` only existing records are candidates. Never a stop.
- **Telemetry disabled**: `telemetry disabled`, exit 0, landing proceeds.
- **Gitignored `<telemetry.dir>`** in a consumer repo: identical behaviour; `git add -f` stages the record.
- **Keep As-Is**: record stays untracked and `in_progress` in the worktree; a later finishing run on that worktree seals it.
- **Hand-run `plan_check`** with the marker down: lint only, no record.
- **PR landings** (Options 1-2): the seal commit reaches main per the repository's merge method (one commit under merge or rebase, folded under squash). Option 3 folds it.
- **Old records on main** carrying `abandoned_at` or `status: abandoned`: readers (`gauntlet-performance`, `gauntlet-spec-index`) keep parsing them; no migration.
- **Recorder write failure**: unchanged - warn once, drop the event, never throw into the tool pipeline.

## Tests

- `extensions/telemetry.test.ts` (harness with `Deps`): spec write with the marker down creates no file and buffers nothing; `start brainstorm` then spec write binds; `skip brainstorm resume: <spec>` binds to an existing spec and reloads its record; passing `plan_check` with the marker down binds nothing; replay of a branch containing `start brainstorm` before the spec write binds, the same branch without it does not; reset then `start brainstorm` + write of spec B binds B with an empty event buffer; the recorded git calls contain no `add` or `commit` at bind, phase transition, `plan_check`, shutdown, or on `git push`/`gh pr create` tool calls; the exclude line is written once and not duplicated on rebind; a sealed on-disk record freezes the recorder and shutdown does not overwrite it; jj checkout `phase complete ship` still seals through the diff module.
- `extensions/lib/telemetry-diff.test.ts`: the moved git/jj diff computations against a fake runner, same shape as before.
- `bin/gauntlet-telemetry-seal.test.mjs` (real temp git repos, replacing the salvage test): seals with `status`, `shipped_at`, string `ship_option`, `diff`, `modified_files`, and a `duration_s` re-derived at the seal time (a record derived earlier and sealed 10 minutes later reports the longer duration) plus one `telemetry: <spec>` commit touching only the record; idempotent on a sealed committed record; a `shipped` untracked record is committed on retry; exit 2 on a `--spec` with no record and on an unparseable record; `no telemetry run` when a predecessor spec without a record is the only spec change; `telemetry disabled` exit 0; gitignored dir is staged with `-f`; commit failure (a rejecting pre-commit hook) restores the bytes and exits 1; usage and no-base exit 1; the diff commit count excludes the seal commit.
- `scripts/ci.mjs`: bin map, bundle freshness, and packed-install smoke target `gauntlet-telemetry-seal` (smoke runs the no-arg path and expects exit 1 with usage); finishing must contain `gauntlet-telemetry-seal.mjs`; `skills/gatekeep-pr` must contain no `telemetry` match.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` (telemetry section: arm-on-entry bind rule, exclude line, no checkpoint commits, seal at finish with re-derive - replacing "the stamp never re-derives" - bin rename and invocation), `README.md` (workflow overview sentence naming the salvage bin), `CHANGELOG.md` (`## Unreleased`)
- Derived / memory docs invalidated: `AGENTS.md` Testing paragraph (names `bin/gauntlet-telemetry-salvage.mjs`), `.pi/gauntlet-overrides.md` if it names salvage

Per `reference/documentation-impact.md`. Skill bodies (finishing, gatekeep-pr, brainstorming, `skills/gauntlet-performance/SKILL.md:21` "salvage stamped it at landing") and the `src/bins/gauntlet-performance.mjs:51` comment are implementation surface, updated in the same change but not listed above.

## Out of scope

- Changing what the record collects (events, accumulators, `derived` shape) beyond retiring the `spec_edits_after_ship` producer.
- `gauntlet-performance` and `gauntlet-spec-index` readers.
- jj diff computation rules (owned by `doc/specs/2026-09-24-gh-51-jj-telemetry-diff.md`; only its producer module moves).
- Any change to pi-cohort (`handoff` skill, `worktree: true` isolation check).

## Open questions

- Slack thread with the colleague's sessions was not readable (HTTP 403, no client); the incident description from the user is taken as fact.
