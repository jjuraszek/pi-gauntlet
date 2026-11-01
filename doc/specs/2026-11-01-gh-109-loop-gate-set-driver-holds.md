# Loop engine: gate on the rows' own checks, keep test output out of the driver

**Goal:** Replace every local run of the ledger's full `verification:` command in a loop flow with the gate set - the deduplicated union of the commands the rows' own checks recorded - run per owning checkout with output redirected to log files, so the driver's context holds exit codes and log paths instead of test output; CI on the push owns the full suite. Give the loop worker the same three-scenario TDD and test-economy rules the waves implementer carries, adapted to rows, so the quality bar stays while the loop gets faster.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Ticket:** #109
**Predecessor:** `doc/specs/2026-10-31-gh-106-universal-task-tracking.md` - supersedes its verify-step-1 full-run clause ("the ledger's full verification command runs once per leg at verify step 1") and its `verification_runs` expectation for loop runs only.

## Problem

A loop run re-runs the ledger's full `verification:` command at verify step 1, after every whole-diff fix round, after every conformance repair and in Convergence (a), and again at finish Step 1 unless the skip rule finds a clean verify-phase commit (`skills/loop-implementation/SKILL.md:130-137`, `skills/finishing-a-development-branch/SKILL.md:32-37`). Every run is a foreground command with no redirection, so its full output lands in the driver's tool result, and a failure's output is quoted into the `Problem:` block and into the repair child's task. The requester reports an 80-dispatch run that peaked at 323k tokens with about 51 KB per full run; the figures are a description of the input, not a target - the body records no driver-context source for them.

The loop worker already runs only a targeted check per row and never the full command (`agents/loop-implementer.md:33`), but it records a check name (`ledger cap test; 3 passed`), not a command, so nothing can replay the rows' proof after the loop. The waves engine already routes scoped commands to `gate-<i>.log` and keeps only the exit code in context (`skills/subagent-driven-development/SKILL.md:116-130`); the loop has no such boundary.

Corrected premises, verified in primary code: the implement-exit full run that #109 AC 2 names "while it exists" is gone - #106 landed as `f272cb28` and implement completes from the tracker. The loop worker has no RED-GREEN-REFACTOR order and no test-economy rules: only seed writes a failing test per open row (`agents/loop-implementer.md:47`), and ordinary step 4 says "write or run its evidence check" (line 33); the waves `implementer` carries both as `## Three-scenario TDD` and `## Test economy` (`agents/implementer.md:31-48`). `verification_runs` counts parent bash commands that match the default test-command patterns (`extensions/telemetry.ts:781-786`, `extensions/lib/gauntlet-settings.ts:201-214`), so a selective `node --test <file>` command contributes zero; `doc/configuration.md:249` already states that unmatched ledger commands contribute zero. `doc/implement-engines.md:72` says #106 stays open until a first-run comment is posted; #106 is CLOSED (stale sentence, outside this spec's unit - flagged).

Retry continuity, checked: a failed child still commits its partial work (`loop: row <n> failed`), and the next child receives `previous decision`, reads the whole `## Decisions` section and `git diff <base>` of the target files (`agents/loop-implementer.md:22-33`), so retries build on earlier attempts; only the evidence cell is overwritten per attempt. Hands-free bounds, checked: ordinary rows retry without a human for 3 attempts plus funded N; at the allowance one escalated round runs under amend permission with `escalationLoop.implModel`, else the human is reached; two empty child commits, two consecutive validation misses, the iteration cap, a dirty tree and a seed miss stop earlier. This spec changes none of those bounds.

User direction (prompt): no full test run at all in this engine - it selects relevant tests; a row's own check still gates that row; the loop stays conceptually simple and hands-free; the loop worker works under TDD (test red, implement, green, refactor) and keeps only relevant tests, merging similar ones by parametrization. Ticket decision (comment of 2026-10-31T18:25): CI owns the full run; zero local invocations of the ledger's `verification:` command in a loop flow.

Framing: kept - zero local full runs in a loop flow on every finish route. A PR is the typical route and CI runs on its push; a local squash merge is not a push, so the human pushes `main` afterward and CI runs there; a repo with no CI workflow is a misconfiguration the framework calls out, not a route the engine covers with a local run. The engine adds no local full run anywhere and no `no CI workflow found` variant of the scoped line.

## Acceptance criteria

Ticket #109, `## Acceptance criteria`, rows verbatim:

- [ ] `agents/loop-implementer.md` states that the evidence cell of a row the worker closes or fails, and of every row seed closes on baseline, opens with the shell command the worker ran as that row's check, up to the first unescaped semicolon (a test file, test id or filter; a file-assertion row records the assertion as a command such as `test -f doc/plans/x.md`), followed by the existing at-most-three result lines; the worker records a selective check, never the owning checkout's full verification command; the parent's validation stays as it is today (non-empty bounded evidence) and adds no format rule for the command.
  in-scope
- [ ] `skills/loop-implementation/SKILL.md` defines the ledger's gate set as the deduplicated union of (owning checkout, recorded check command) pairs over every non-cut `done` row - home rows in the home checkout, mapped rows in the checkout their leg mapping names, the same command recorded in two checkouts running in both, `failed` rows' commands excluded - each pair run as its own foreground command; the skill runs that set everywhere it runs the full `verification:` command today (the implement-exit run while it exists - #106 removes it, whichever ticket lands second rebases - verify step 1, and after every diff-review and conformance repair), and across all of those sites plus the escalated repair's rerun and finish, a loop flow's shell trace contains zero invocations of the ledger's `verification:` command; the header stays in the ledger as the command CI runs.
  in-scope
- [ ] `skills/finishing-a-development-branch/SKILL.md` runs the ledger's gate set, with the same checkout ownership, at step 1 for a ledger subject, applies its existing skip rule to that set, and renders `Verification: scoped - <commands>; CI on this push holds the full run` in the PR summary for a ledger, the same line its rework route renders.
  in-scope
- [ ] A gate-set failure keeps today's once-per-flow escalated repair and human stop, and never reopens a row; the repair child's task names the failing command and its log path instead of pasted output.
  in-scope
- [ ] After the ledger is seeded, the driver's reads during implement are the ledger, the child's return file and git boundary commands; the loop skill states this boundary in the same form as the waves engine's "Orchestrator holds" section and names the spec, source files, test output and logs as never read by the driver, with the human-stop excerpt below as the only exception.
  in-scope
- [ ] Every gate-set command and the escalated repair's rerun redirect their output to a file under one `mktemp -d`; the driver keeps the exit code and log path, and a human stop quotes at most the last 20 lines of the failing command's log after `Problem:`.
  in-scope
- [ ] `doc/implement-engines.md` documents the gate set, the holds boundary and the log handoff; the `doc/configuration.md` "Loop engine operations" sentence that says the parent runs the full command after all rows close is replaced by the gate-set rule; `README.md`'s overrides table gains no new line; `skills/subagent-driven-development/` is byte-unchanged.
  in-scope
- [ ] `eval/loop-implementation/` gains samples for: a closed row's evidence cell opens with a runnable command and verify step 1 runs the union of those commands, not `verification:`; a coordinated ledger with the same command in two checkouts runs it in both; a diff-review fix round followed by a conformance repair reruns only the gate set (no `verification:` invocation at any site); a gate-set failure hands the repair child the log path, not output; a human stop after a gate-set failure quotes at most 20 lines; `eval/loop-implementer/` gains a sample asserting the command-first evidence cell and a selective, never full, command; `eval/finishing-a-development-branch/` gains a ledger subject that runs the gate set and renders the scoped verification line; `node eval/run.mjs` on each target holds every fact.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-109-loop-gate-set
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: `npm test` run in the worktree (AGENTS.md "Testing"; no `## verification-before-completion` or `## PR gate` section in the overrides file); `npm run build:bins` before it whenever `src/bins/` or `extensions/lib/` changed
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: .pi/gauntlet-overrides.md
Rules: README.md
Rules: CHANGELOG.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: doc/implement-engines.md
Rules: doc/install-internals.md
Rules: doc/gate-contract.md
Rules: eval/README.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: none
design: owns every path in Design; observable outcomes are the AC rows above

## Design

Three owners: the loop worker owns what a row's proof is and records it as a command; the driver owns the gate set and runs it with output redirected; CI owns the full suite. No new settings key, no new ledger column, no migration.

### Worker: `agents/loop-implementer.md`

Add, adapted to rows, the two sections the waves implementer carries (`agents/implementer.md:31-48`), as whole-prompt body text with no skill machinery:

- `## Three-scenario TDD`. New behavior (the common row): RED is the test seed wrote for this row, or a new test when seed named a check instead - run it and confirm it fails for the row's stated reason; GREEN is the smallest change that passes it; REFACTOR keeps the test selecting the row. Modifying tested behavior: extend the existing test first (a new parameter row or a stronger assertion), see it fail, then change the code. Trivial or assertion-only rows (a doc sentence, a file's existence, a token in a skill file): the asserting command is the check (`test -f doc/plans/x.md`, `rg -n '<token>' <file>`); no test file is written. A retry keeps the test built by earlier attempts and extends it; it never starts the test over.
- `## Test economy`. Prefer a parameter row or a stronger assertion on an existing test over a new test; near-identical inputs become table-driven cases; one scenario per operation; the cheapest layer that proves the row; expensive tests go to the repo's slow tier by the convention `AGENTS.md`, the overrides file or the task names; no convention named or discoverable: place the test beside its siblings and say so in the report (the waves fallback at `agents/implementer.md:46`, kept verbatim). A merge touches only tests the target row's own recorded command selects; a test another closed row's recorded command selects stays as it is, because the worker never edits a foreign row (`agents/loop-implementer.md:63`) and so cannot keep a foreign row's command valid. After a merge the target row's command must still select the row's test, and the worker re-records the target row's command whenever it changes.

**Selector rule.** A recorded command must exit nonzero when it selects no test, so a stale selector fails at the gate instead of passing on an empty run. A test-file selector does (`node --test <missing file>` exits 1, verified); a name filter does only when the runner fails on an empty selection - `node --test --test-name-pattern '<name>' <file>` exits 0 and reports `tests 0` for a name that matches nothing (verified on node v26), so on this runner the worker records the file, not the filter. The worker verifies the behavior once before recording a filter: run it with a name that matches nothing and require a nonzero exit; otherwise record the file. This is a worker rule; the parent adds no format validation (AC 1).

Change the evidence rule (step 5 and the seed contract) so the evidence cell opens with the command the worker ran as the row's check, up to the first unescaped semicolon, followed by the existing at most three result lines (`node --test extensions/x.test.ts; 3 passed; 0 failed`). The command replaces today's check name, so the segment count and the companion recipe's four-segment bound are unchanged. The command is one selective invocation - a test file, test id or filter, or an asserting command - with no `;` and no `|` or `&&` (use the runner's own filter flags, never a shell pipeline), so the existing semicolon-and-escaped-pipe cell grammar stays. The worker never records the owning checkout's full verification command (the home ledger's `verification:` header, or a leg's recorded command) and never a runner with no file or filter. Seed records the command of the passing check for every row it closes on baseline and writes a failing test for every open row as today.

### Driver: `skills/loop-implementation/SKILL.md`

**Ledger header.** Entry step 4's grammar gains one line directly after `verification:`:

```markdown
verification: <resolved command>
checks: commands
```

The skeleton carries it before seed; the validation table's "reject every other header change" covers it with no table change. Before each dispatch, next to the existing `cap:` requirement, and at every gate-set site (including finish), a ledger without a `checks:` line stops with `ledger has no checks: line - seeded under the old contract` and offers `stop` only; the human restarts the loop by hand on a fresh baseline. No automatic reseed, no migration path and no legacy run of `verification:`.

**Driver holds.** A `## Driver holds` section after `## Entry`, in the form of the waves engine's "Orchestrator holds": after the ledger is seeded, the driver's reads during implement are the ledger, the child's return file (one file reference), git boundary commands (`status --porcelain`, `rev-list --count`, `rev-parse`, `show -s --format=%b` for commit bodies), skill resources at their absolute paths and the overrides file. The driver never reads the spec, source files, test output or logs; the only exception is the human-stop excerpt below. The driver keeps rows by status, iterations, cap, the last decision, the decoded amendment grant and each leg's checkout path for handoff and stops, and never diagnoses a failure's cause.

Two existing instructions read the spec inside implement today and move out of the loop so the boundary holds: `## Before each dispatch` decodes `**Amend-grant:**` at every rule-2 evaluation (`SKILL.md:60`), and `reference/coordinated-legs.md:5-7` reads `## Legs` on every ledger restore (`SKILL.md:19`). Both values are captured once - the decoded grant and the leg checkout paths - at seed and at an authorized restore, before the dispatch loop is entered, and are refreshed during the existing human-directed amendment action (an amendment commit updates the header; the driver re-decodes it there, outside the loop). Before-dispatch rule 2 and the coordinated restore instruction read the held values. The `**Amend-grant:**` header line itself is unchanged.

**Gate set.** A `## Gate set` section before `## After the loop`:

- Members: the deduplicated union of (owning checkout, command) pairs over every non-cut `done` row, where the command is the row's first evidence segment up to the first unescaped semicolon, ordered by ledger row number after deduplication (the first row that contributes a pair fixes its position). `failed` rows contribute nothing. Ownership comes from the ledger, never the spec: a coordinated ledger's `## Leg mapping` row (`row | ac | leg`, `extensions/plan-tracker.ts:70-78`) names each expanded row's leg, and that leg's checkout owns the command; a single-checkout ledger has no mapping and every row runs at home. Shared ACs expand to one row per leg (`reference/coordinated-legs.md:11`), so two rows of one AC can record the same command in two checkouts, and it runs in both. An all-cut ledger has an empty set: print `gate set empty - every row cut` and continue.
- Run: mint `LOG_DIR=$(mktemp -d)` once at verify step 0 (a resumed session mints a new one); run each pair in order as `(cd "<checkout>" && <command>) > "$LOG_DIR/gate-<i>.log" 2>&1`, foreground, one at a time; print `gate <i> exit <code> <log path>` and keep nothing else. Fail-fast: the first nonzero exit ends the run; later pairs do not run, and that one `gate <i>` line and its log are the stop's and the repair task's single failure. The set passes when every pair ran and exited 0. The driver adds no format rule for the command: a cell whose first segment is not a runnable command fails at the gate like any other command (exit 127 in its log) and takes the failure path below.
- Sites: verify step 1 (replacing the full run; "Commit verification-produced tracked changes" stays in step 1 and applies to gate-produced changes); after every whole-diff fix round (step 2); every conformance site (step 3, below); the escalated repair's rerun (the failing checkout's pairs only); finish Step 1. Across every site a loop flow's shell trace contains zero invocations of the ledger's `verification:` command or any leg's `contract:` `- verification:` command; the header stays as the command CI runs. Delete the sentences that run or rerun "the full command" in steps 1-3, and in `reference/coordinated-legs.md` replace line 7 ("Read each member's verification from the home spec's `## Legs` `contract:` `- verification:` line before dispatch") and line 9 ("For coordinated exit, read each leg's verification ...") with the gate set grouped by `## Leg mapping`; `scripts/loop-engine-contract.test.mjs:58-59` pins both sentences and changes with them.
- Conformance, loop-only override in `skills/verification-before-completion/reference/conformance-check.md`: on a ledger subject every site that runs plan `Verification`, the project's canonical test command or a `SCOPED_TEST_COMMANDS` union - the gap dispatch's `SCOPED_TEST_COMMANDS` (line 154), fix-round step 4's union (line 167) and Convergence (a) (line 191) - runs the gate set in the `LOG_DIR` form instead; the loop path is never the "ad-hoc no-plan" path. A repair or Convergence task carries the failing command, its checkout, the exit code and the log path, never pasted output, and the repair child derives the files to touch from the log at that path (Convergence (c)'s "the files each failing command's output names" is the child's read, not the driver's). The waves path through this reference is unchanged.
- Failure at verify step 1: keep `Stopped: verification failed with every row closed` and its amend/stop menu; `Problem:` names the `gate <i> exit <code> <log path>` line and quotes the last 20 lines of that log (`tail -n 20`), the only log read the driver makes. The once-per-flow escalated `implementer` repair keeps its permission, model and single-commit rules; its task carries the failing command, its checkout, the log path, the spec path and Rules, never pasted output. When the failing command is a stale selector (a merged or renamed test), the task names the row whose command no longer selects its test and the repair restores that selector (the test or its name) so the recorded command selects it again; the repair never edits ledger evidence, because the admission rule keeps every ledger row unchanged (`SKILL.md:133`). A gate-set failure never reopens a row. After the repair the driver reruns the failing checkout's gate pairs only; every other site reruns the complete set. Later sites feed the exit line and log path into the existing fix-round machinery the same way.

**Telemetry.** `verification_runs` keeps its matcher (`matchTestStatement` over `DEFAULT_TEST_COMMANDS`: `make test`, `npm test`, `npm run test`, `pytest`, `cargo test`, `go test`; `extensions/lib/gauntlet-settings.ts:201-214`) and its meaning: it counts matcher hits on parent bash statements, and a gate-set pair is a parent bash statement. Zero is therefore conditional, not an engine invariant: a loop run reports 0 when no recorded command matches the patterns - true of this repo's `node --test <file>` commands, which the default list does not contain - and counts a recorded `pytest tests/x.py` or `npm test -- <file>` like any other hit. `doc/configuration.md:249` gains that clause beside its existing "unmatched ledger commands and child checks contribute zero" sentence; the #106 comment below and the Tests row use the same conditional wording. No extension change.

**Ship advisory.** `verify-before-ship` credits a checkout only when a bash statement matches the same patterns (`extensions/verify-before-ship.ts:254-263`), so a loop finish whose gate set does not match them receives the "Ship command ran without verification" warning at `git push`, `gh pr create` and `git merge --squash`. The finish skill's ledger route and `doc/configuration.md` `### verify-before-ship` (plus README line 100's one-clause description) state that this advisory is expected when scoped checks do not match the patterns, does not authorize a full local run, and is answered by the scoped `Verification:` line. Hook and matcher unchanged.

### Finish: `skills/finishing-a-development-branch/SKILL.md`

Extract exactly Step 1's set-resolution paragraph and its skip-rule paragraph (lines 35-36, 1827 bytes measured) to `skills/finishing-a-development-branch/reference/verification-set.md`; the hard-gate sentence (line 32), the coordinated-finish activation (line 33), the rework identity preflight (line 34), the scoping caveat and the failure stop stay in Step 1. Step 1 keeps its gate sentence and one pointer paragraph: resolve the set and the skip rule per that reference, read with `read` at its absolute path. The file is 48,923 bytes and 499 lines before edit; the plan measures `wc -c` and `wc -l` on every touched `.md` after edit and records the numbers, and the 50,000-byte and 2,000-line lint is the gate, not an estimate of headroom.

The reference's ledger row: the set is the loop skill's gate set (same membership, same `## Leg mapping` ownership); a missing `checks:` line takes the loop skill's stop. Finish mints its own `LOG_DIR=$(mktemp -d)` at its first gate-set site and reuses it for that session's reruns; it never relies on a verify-session shell variable. The skip rule applies to that set unchanged. Step 1 records the resolved set as a value: an ordered list of (leg, command) pairs, where the leg's checkout before squash is its worktree and after squash its primary, so Option 3's post-squash rerun becomes one `(cd "<leg primary>" && <command>) > "$LOG_DIR/gate-<i>.log" 2>&1` per pair, never the one-subshell `<the Step 1 set>` form at line 347. Step 1's "commit verification-produced tracked changes, or stop" handling stays for gate-produced changes.

Durable recovery: a fresh-session retry after the ledger is stripped reconstructs the set from the committed pre-strip ledger (`git -C <home> show <strip commit>^:<ledger path>`, the ledger whose rows and `## Leg mapping` were the Step 1 input), never from the spec's `contract:` `- verification:` lines. `reference/legs.md:23` ("Recover commands from the spec's recorded contract, not the absent plan") and `:38` ("run every leg's recorded verification set") gain a ledger-subject clause naming the pre-strip ledger and the gate pairs, and `skills/gauntlet-resume/reference/brief-contract.md` `## Coordinated admission` ("Re-validate unlanded home using recorded contracts") names the same source for a ledger subject. Receipt fields are unchanged; the `fix minors` child (line 224) receives the gate set as `SCOPED_TEST_COMMANDS` for a ledger.

The PR summary for a ledger renders `Verification: scoped - <commands>; CI on this push holds the full run` as the last `## Summary` bullet of Option 1's body template (line 312); `## Test Plan` stays, the byte-identical clause at line 321 holds for the rest of the body, and the trailing `Telemetry: whole PR against <baseRefName>.` suffix stays rework-only (line 276). The squash and discard routes print no verification line.

### Resume: `skills/gauntlet-resume/SKILL.md`

The verify-with-`Ledger:` row (line 152) says "continue from step 1, the ledger gate once per leg"; it becomes "continue from After the loop step 1, the gate set per the loop skill's `## Gate set`", with the loop skill's text owning execution; resume adds no gate run of its own.

### Docs and ticket

Edit targets are the current sentences, quoted: `doc/implement-engines.md:34` "verify step 1 runs the ledger's gate once per leg in its owning checkout" becomes the gate set, the driver-holds boundary and the log handoff; its stops table row at line 58 "then rerun the failing leg's command once" becomes "then rerun the failing checkout's gate pairs once, output to `$LOG_DIR`"; drop the stale "#106 stays open" sentence at line 72. `doc/configuration.md:91` "After all rows close, the tracker completes implement and verify step 1 runs the ledger's gate once per leg in its owning checkout." becomes the gate-set rule; line 249 gains the conditional-zero clause; `### verify-before-ship` (line 220) gains the advisory sentence. `README.md:42` "verify step 1 runs the full gate once per leg in its owning checkout", `:44` "(the ledger's `verification:` command for loop)" and "the parent reruns full verification", and `:100` "verify step 1 runs the ledger's gate once per leg" become the gate set; the overrides table gains no line. `CHANGELOG.md` `## Unreleased` entry.

Post-landing housekeeping, not an AC row: after the PR lands, post one comment on #106 stating that its row "the ledger's full verification command runs once per leg at verify step 1" is superseded by this spec's gate set and that `verification_runs` counts matcher hits on gate-set commands, 0 on this repo's `node --test` commands; the comment text is gated on explicit confirmation. The first post-change loop run's peak context and gate-set run count are the requester's to post on #109.

### Tests and evals

`scripts/loop-engine-contract.test.mjs` and `scripts/finish-verification.test.mjs` pin the wording this spec changes; update their tokens with the skills: the coordinated `verification:` regexes at `loop-engine-contract.test.mjs:58-59`, the `cap-and-exit-verification` expectation at `:152-155` ("failure quotes output"), and the step-1 token list at `:148`.

Existing eval facts that assert the removed behavior are superseded, and each named case's `case.md`/`expected.md` and its target's `intent.md` (`for:` SHA bumped) change with the skill: `eval/loop-implementation/samples/tracker-verify` ("Step 1 runs each contract command once in its owning checkout", pasted failing output, "No ... selective checks"), `verify-lifecycle` ("full gate once per leg; repairs trigger full rerun"), `cap-and-exit-verification` ("failure quotes output"), `exit-verification-escalates` ("carrying failing output ... exact make check"); `eval/loop-implementer/samples/row-and-evidence` ("the check name followed by at most three result lines"); `eval/finishing-a-development-branch/samples/loop-ledger` ("Uses ledger verification command", a fixture with no `checks:` line) - this case gains a `checks: commands` header and the gate-set expectation; the legacy stop is its own new sample. `eval/loop-implementation/` gains the AC 8 samples plus `legacy-ledger-stop` (missing `checks:` line, `stop` only) and `gate-set-failure` (fail-fast, 20-line tail, log path to the repair child); `eval/loop-implementer/` gains `command-first-evidence` and `tdd-row` (red, green, refactor into a parametrized table, command still selects the row, foreign rows' selectors untouched); `eval/finishing-a-development-branch/` gains `ledger-step-1` with sample-local `bundle+:` lines for `SKILL.md` and `reference/verification-set.md`, and a fresh-session post-strip recovery case; the target's default Step 6 slice stays as `intent.md:18` requires, and every existing sample with `bundle+: SKILL.md` that depends on Step 1 text gains the reference. Each target's `intent.md` names the changed behavior; `node eval/run.mjs <target>` runs on all three before finish.

AC 7's `skills/subagent-driven-development/` byte-unchanged property is a property of this PR, checked once at closure as `git diff --stat <ledger base>..HEAD -- skills/subagent-driven-development/` (empty) and by the conformance reviewer; no committed test diffs against `main` (absent on a shallow CI checkout, and a permanent freeze would reject future waves edits).

## Errors and edge cases

- A gate command exits nonzero at verify step 1: fail-fast stops the run at that pair; stop with the verify menu, `Problem:` holds that `gate <i>` line and its 20-line tail; one escalated repair under amend permission; rerun the failing checkout's pairs; a second failure adds `escalated round spent` and stops.
- Two or more pairs would fail: only the first in ledger row order runs red and is quoted; the rest surface on the rerun after repair. Home and a companion both red take two rounds only if the human re-grants; the once-per-flow bound holds.
- A command exits 127, or its tail names a missing test file (a refactor merged the row's test and the recorded command no longer selects it): the gate fails as above, and the repair child's task names the row whose command is stale, so the fix restores the selector - never the code at random and never the ledger cell.
- A filtered command whose name no longer matches any test exits 0 on `node --test` with `tests 0`: prevented at record time by the worker's selector rule (file selector on this runner); a ledger seeded before this rule has no such filters because the old contract recorded check names, which the `checks:` stop rejects.
- `checks:` line missing or misspelled (any ledger, including a completed one reaching finish): stop `ledger has no checks: line - seeded under the old contract`; `stop` only; no dispatch, no `verification:` run.
- Evidence cell whose first segment is prose: no parent validation change (AC 1); it fails at the gate with exit 127 and takes the failure path.
- All rows cut: empty gate set, `gate set empty - every row cut`, proceed to review.
- Coordinated run: pairs group by the leg the `## Leg mapping` row names; a shared AC's rows run its command in each leg's checkout; a single-checkout ledger with no mapping runs at home.
- Finish on a stripped ledger (post-squash rerun, coordinated receipt): uses the (leg, command) list recorded at Step 1, each pair in that leg's primary; a fresh session reconstructs the list from the pre-strip ledger commit, never from spec contracts.
- Resume in a fresh session: `LOG_DIR` is minted again at the first gate-set site of the skill that runs it; a log path from an earlier session is never evidence that a gate passed.
- The verify-before-ship advisory fires at finish because no gate command matches the patterns: expected; the scoped `Verification:` line answers it; no full run.
- An amendment or redraw taken at a human stop runs under the amendment surface's own reads; it is a human-directed action, not the driver's implement loop, and it is where the held grant is re-decoded.
- Size lint: every touched `skills/**/*.md` and `agents/*.md` stays under 50,000 bytes and 2,000 lines after edit, measured with `wc -c` and `wc -l`; the finish extraction is the mechanism for the one file near the limit.

## Tests

- AC 1 (command-first evidence, selective never full, no parent format rule) - `scripts/loop-engine-contract.test.mjs` asserts the persona's evidence sentence, the selector rule sentence and the driver's unchanged validation text; eval `loop-implementer/command-first-evidence`.
- AC 2 (gate-set definition, `## Leg mapping` ownership, all sites, zero `verification:` or `contract:` invocations) - `scripts/loop-engine-contract.test.mjs` asserts the `## Gate set` membership text, the `> "$LOG_DIR/gate-<i>.log" 2>&1` form, the `gate <i> exit <code>` line, fail-fast wording, the absence of "Run the ledger's `verification:` command" in After the loop and of the `contract:` `- verification:` reads in `reference/coordinated-legs.md`; eval `loop-implementation/gate-set-verify-step-1`, `loop-implementation/coordinated-same-command` (a shared AC expanded to two legs and an identical command recorded in two checkouts), `loop-implementation/repairs-rerun-gate-set-only`.
- AC 3 (finish runs the gate set, skip rule, scoped line as last `## Summary` bullet) - `scripts/finish-verification.test.mjs` asserts the reference's ledger row, the Step 1 pointer, the per-pair primary rerun form, the pre-strip ledger recovery sentence and the scoped-line text and placement; eval `finishing-a-development-branch/ledger-step-1` and the fresh-session post-strip recovery case.
- AC 4 (failure keeps the once-per-flow repair and human stop, never reopens a row, log path to the child, selector restored not ledger edited) - contract test asserts the repair-task sentence; eval `loop-implementation/gate-set-failure`.
- AC 5 (driver holds, held grant and checkout paths) - contract test asserts the `## Driver holds` section names the spec, source files, test output and logs, and that before-dispatch rule 2 reads the held grant; eval `loop-implementation/gate-set-failure` checks no log read beyond the tail.
- AC 6 (one `mktemp -d` per skill session, exit code and path, 20-line tail) - contract test asserts `LOG_DIR=$(mktemp -d)` and `tail -n 20`; eval `loop-implementation/gate-set-failure`.
- AC 7 (docs, `README.md` table, SDD byte-unchanged) - conformance reviewer checks the three docs and the advisory sentence; `git diff --stat <ledger base>..HEAD -- skills/subagent-driven-development/` empty, observed once at closure; no committed test.
- AC 8 (eval samples) - `node eval/run.mjs loop-implementation`, `node eval/run.mjs loop-implementer`, `node eval/run.mjs finishing-a-development-branch` hold every fact after the superseded facts above are rewritten; committed `report.md` per target.
- Conformance override - `scripts/finish-verification.test.mjs` or the loop contract test asserts the ledger-subject clause in `conformance-check.md` at the three sites and that the waves sentences remain; eval `loop-implementation/repairs-rerun-gate-set-only`.
- `checks:` header and missing-header stop - contract test asserts the Entry grammar line and the stop text with `stop` only; eval `loop-implementation/legacy-ledger-stop`.
- TDD, test economy and selector preservation in the worker - eval `loop-implementer/tdd-row`.
- Stale command after a test merge - eval `loop-implementation/gate-set-failure` variant naming the row; `<observable> - none` for exit-127 detection beyond that: it is the normal failure path, not a separate branch.
- Empty gate set - contract test asserts the `gate set empty - every row cut` text.
- Resume row - `scripts/brief-contract-lint.test.mjs` or the loop contract test asserts the resume row names After the loop step 1 and the gate set, not "once per leg".
- `verification_runs` conditional zero - none: the counter is unchanged; the doc clause is a conformance check.
- Size lint - `npm test` instruction-size lint, existing; measured counts recorded in the plan.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/implement-engines.md` (architecture: the gate set, driver holds, log handoff replace the verify-step-1 once-per-leg gate; stops table rerun row); `doc/configuration.md` (operations: Loop engine paragraph, the `verification_runs` conditional-zero clause, the `verify-before-ship` advisory sentence); `README.md` (major procedure: loop verify step 1 wording at lines 42, 44, 100); `CHANGELOG.md - deferred: release`
- Derived / memory docs invalidated: none (`eval/README.md` describes the eval process this change follows and does not alter)

## Out of scope

- Any local run of the ledger's `verification:` command or a leg's `contract:` `- verification:` command in a loop flow, including a fallback for repos without a CI workflow or for the squash route.
- An automatic reseed of a ledger seeded under the old contract; the human restarts the loop.
- A `check` column, `checked <repo>:` staleness lines, `loop: regress` commits, resume-time reruns or a parent re-check after each row close (the archived designs in #109's reporter notes).
- Changes to `verification_runs`'s matcher, the `verify-before-ship` hook, a new telemetry counter, or a widened `DEFAULT_TEST_COMMANDS`.
- Changes to the loop's retry allowance, escalation permission, cap, stagnation or seed-miss boundaries.
- Spec-anchored whole-diff review (archived in #109's second reporter note).
- The `## Rework` section of the finish skill (5.6 KB extraction candidate outside the touched unit) and the stale `doc/implement-engines.md:72` sentence beyond its deletion.
- A fully automatic handler for a CI failure after the push.
- The waves path through `conformance-check.md`.

## Open questions

- None blocking. Whether `tail -n 20` is enough for a multi-file failure is a first-run observation for #109's follow-up comment.
