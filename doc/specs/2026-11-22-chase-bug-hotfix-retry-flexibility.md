# chase-bug hotfix: separate seed, row, and repair budgets

Supersedes: `doc/specs/2026-11-01-chase-bug-loop-hotfix.md`, "Attempt budget (steps 4-7)", the no-seed-retry and second-consecutive-miss aborts in "Dispatch (`hotfix.md` step 4)" and "Errors and edge cases", the single-counter wording in "Harness fallback (non-pi path)", and the acceptance row that charges every `target: 1` dispatch to one counter; `doc/specs/2026-11-14-single-commit-message-contract.md`, only the hot-fix seed disposition (an abort before landing with no retry for a clean one-commit seed return whose return file is missing, unreadable, or mismatched) in its out-of-repo-ledger acceptance row, "3. Loop ledger protocol", and "Errors and edge cases" - its return-file transport and cleanup contract stays live.

**Goal:** A hot fix in `skills/chase-bug/hotfix.md` retries a bad seed return, answers two malformed row returns with a hint instead of an abort, and funds repairs after the row first passes from their own budget, so the seed, the row, and the repairs each get `loopEngine.maxIterationsPerRow` dispatches while the hot fix stays one acceptance row, automatic end to end, and without a new setting.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop

## Problem

The request: "hot fix should allow more flexibility like retries for loop and up to 3 steps for the fix ... currently without retries and only single step its very limited in all typical cases".

How the hot fix works at base `c46569c2`:

- `skills/chase-bug/hotfix.md` step 4 dispatches `loop-implementer` for `target: seed`, then `target: 1`, against a parent-owned temp ledger fixed at `| 1 | open | 0 | |` with mapping `1 | 1 | hotfix` (`hotfix.md:86-99,111-169`).
- Corrected premise ("no retries"): row 1's `attempts` cell is one shared counter for the first attempt, a red gate retry, a conformance gap fix, and a `FIX_FIRST` repair (`hotfix.md:213-245`). The allowance is `loopEngine.maxIterationsPerRow`, default 4 (`extensions/lib/gauntlet-settings.ts:96-114`), and the last allowed attempt runs on `escalationLoop.implModel`.
- Held, real gaps: any seed miss aborts (`Abort (pre-land), no seed retry`, `hotfix.md:189`); `the second consecutive miss -> abort (pre-land)` on row validation misses (`hotfix.md:210`); every repair after the first pass draws on the same counter the row used to go green, and `hotfix.md:219` forbids a per-stage cap, so a row that passed on attempt 3 of 4 has one repair left for the gate run, the conformance audit, and the review together.
- Held: the hot fix is stricter than the loop driver it copied. The driver redispatches the seed while its `repair seed` count is below the allowance, with `seed miss: <concrete miss>` in `hint:` and row attempts at 0 (`skills/loop-implementation/SKILL.md:105,113`). On two consecutive validation misses it sets a hint and dispatches again (ordered-table rule 3, `:66`, `:115`). It counts exit-verification repairs as `repair verification` lines checked `repairs < allowance`, never charged to a row (`:172-173`). The predecessor justified the hot-fix abort as `no seed retry (loop driver rule)` (`doc/specs/2026-11-01-chase-bug-loop-hotfix.md:161`); that driver rule no longer exists.
- Held ("only single step", read as an acceptance row): a fix not statable as one `<trigger> yields <expected> (was <observed>)` row renders `Implement hotfix now - unavailable: more than one acceptance row` (`skills/chase-bug/SKILL.md:195-205`). One row is one observable outcome, not one edit: an attempt is one commit of any size inside the R3 envelope (`SKILL.md:240-243`).
- Held: more rows would need row selection, per-row counters, multi-row seed admission, and a rule for which row a red gate or finding reopens. Those exist only in the loop driver (`skills/loop-implementation/SKILL.md:61-73`), which the hot fix does not call.
- Held: dirty trees and zero or multiple commits are interrupted returns in the driver and recover by reset (`skills/loop-implementation/SKILL.md:95,100,121`); the hot fix aborts on dirt or more than one commit (`hotfix.md:164-168`) and its Red Flags forbid `git reset --hard` inside the worktree (`hotfix.md:476`).
- Held: a budget-exhausted abort is pre-land, so it removes the worktree and deletes `hotfix/<slug>` (`hotfix.md:375-388`).
- Held: steps 8-10, `## Abort`, and `## Red Flags - STOP` in `hotfix.md` are a user-approved byte-identical constraint (`doc/specs/2026-11-01-chase-bug-loop-hotfix.md:68-74`); the key that maps their generic wording to budget states lives in `## Attempt budget`.
- Held: `hotfix.md` is 480 lines; the authoring rule extracts the touched concern once a file passes 500 (`skills/forge-skill/SKILL.md:39`).
- Corrected (test wiring): `scripts/loop-outside-return.test.mjs:253` asserts `/any other seed miss \| Abort \(pre-land\), no seed retry/` against `hotfix.md`. That script is hand-run (`node --test scripts/loop-outside-return.test.mjs`, cited at `eval/chase-bug/report.md:35`), not part of `npm test`. It also loads the committed `eval/chase-bug/results/hotfix-seed-file-observation/{candidate,baseline}.json` and `results/hotfix-row-return-file/` and requires fact `admission` to hold with verdict `improved` or `unchanged`, validated against each record's own recorded hashes.
- Held: `scripts/commit-message-contract.test.mjs:305-330` runs in `npm test` (`scripts/ci.mjs:587`) and requires the `hotfix-return-file` sample's fact ids to equal `[admission]`, its six case headings, committed results with recorded hashes, and `eval/chase-bug/report.md` to match `/historical/i`.
- Held: `eval/chase-bug/samples/hotfix-seed-file-observation/expected.md` and `hotfix-return-file/expected.md` expect an abort without seed retry; `hotfix-row-return-file` expects one validation miss with attempts +1 and stays correct. Samples load the skill through `bundle+: skills/chase-bug/hotfix.md`. A `bundle+` path absent at the baseline needs a `skillFiles` entry declared `"new": true` in `eval/chase-bug/target.json`, and changed bundle lines need `--baseline-only` before the candidate run (`eval/README.md:48-68`).
- Corrected (eval wiring): `eval/chase-bug/target.json` already declares `skills/finishing-a-development-branch/reference/commit-message.md` `"new": true`, and that file exists at the runner's default baseline (`git merge-base HEAD origin/main`, `c46569c2`), so the baseline-aware lint in `eval/run.mjs:174-182` refuses every `chase-bug` run before replay. A `skillFiles` entry is assembled into every sample of the target, and a `bundle+` line for the same path would assemble it a second time (`eval/lib/replay.mjs:30-60`). `eval/lib/replay.test.mjs:16-20` pins the exact `skillFiles` array and runs in `npm test` (`scripts/ci.mjs:561`). The target's `wordCap` is 700 and an over-cap reply is an error cell (`eval/run.mjs:130`); each selected run overwrites `eval/chase-bug/report.md` with that one sample's rows (`eval/run.mjs:223-229,378-385`).
- Held: both re-recorded seed samples' `case.md` Stop boundaries read `Do not run the first row, retry the seed, mutate counters, simulate cleanup or enter landing`, and neither Fixed inputs names an allowance or a count of prior `repair seed` lines.
- Held: `scripts/ci.mjs:285-287,368-379` asserts `context: "fresh"`, `git -C <WORKTREE>`, and the first-command guard inside the text between `4. **Implement.**` and `5. **Test.**`.
- Held: `doc/configuration.md:61`, the escalation overview paragraph, says the hot fix's one-row ledger uses `loopEngine.maxIterationsPerRow` `as a shared budget for implementation, gate retries, conformance repairs, and review fixes, with implModel on the last allowed attempt`, aborts `when a required repair exhausts that budget`, and runs its non-pi fallback `inline with allowance 4`; the same paragraph holds loop-driver phrases that `scripts/loop-engine-contract.test.mjs:702,729` requires (`at most once per row`, `exit-verification repairs counted against the ledger allowance`, `clamped to the last allowed attempt`) and phrases it forbids (`row's last allowed attempt`, `its last allowed attempt escalates`, `before its last attempt`). `:75` says the hot fix `retains its last allowed attempt rule, independent of escalateAfter`; `:89` describes `maxIterationsPerRow` as a per-row allowance and has no hot-fix sentence. `README.md:174` describes the hot-fix tier without attempt counts and stays correct.
- Not checkable ("very limited in all typical cases"): a hot fix runs in a session with no bound gauntlet record (`hotfix.md:11`) and removes its ledger on every exit (`hotfix.md:103-105`), so the repo holds no record of past hot-fix aborts. Which stop bites in practice is the user's observation; the design closes every stop that is a retry problem.
- Not checkable: the repro and evidence command come from the bug at hand, and `subagent`, `gauntlet_setting`, and the resolved `escalationLoop.implModel` depend on the session. The design keeps today's aborts for each when missing.

Framing: pivoted to loop-style retries plus a separate budget for repairs after row 1 first passes, still one acceptance row - the user picked B at the framing question; up to three rows would make the hot-fix parent carry its own copy of the loop driver's row scheduling (`skills/loop-implementation/SKILL.md:61-73`), while every retry gap closes with rules the driver already has (`:105-115`, `:172-173`).

Approach decision (user, reply A at the approaches question): three budgets counted the way the loop driver counts them. Rejected there: a hot-fix-only attempts setting beside `loopEngine.maxIterationsPerRow`; a human stop on exhaustion.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] When a hot fix's seed dispatch returns a seed miss, the ledger gains one `repair seed | seed miss: <concrete miss> | iteration <consumed>` line, row 1 stays `open` with attempts 0, and, while the count of `repair seed` lines is below the allowance, the next dispatch is `target: seed` with `seed miss: <concrete miss>` in its hint.
  in-scope
- [ ] When the count of `repair seed` lines reaches the allowance, the hot fix aborts pre-land without another seed dispatch.
  in-scope
- [ ] When a second consecutive validation miss lands on row 1 with a dispatch still permitted, the next `target: 1` dispatch carries `two returns broke the contract: <concrete miss>` in its hint and the hot fix does not abort.
  in-scope
- [ ] With allowance 4 and row 1 first admitted `done` on attempt 3, the hot fix issues up to four repair dispatches for red gate runs, conformance gaps, and `FIX_FIRST` findings; a fifth required repair aborts pre-land without a dispatch.
  in-scope
- [ ] On the pi path, the last permitted repair dispatch carries `model: <escalationLoop.implModel>`.
  in-scope
- [ ] A budget-exhausted abort report shows the seed count, row 1's `attempts` cell, the repairs used, and every `## Decisions` line in ledger order.
  in-scope
- [ ] On the inline path, with neither `subagent` nor `gauntlet_setting`, a hot fix retries a missed seed and counts repairs after the first pass against their own budget, each bounded by allowance 4.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: chase-bug-hotfix-retries
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: eval/README.md
Rules: doc/install-internals.md
Rules: .agents/skills/release/SKILL.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: README.md
Rules: CHANGELOG.md
Rules: .pi/gauntlet-overrides.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/gauntlet-resume/reference/coordinated.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: none
design: owns `skills/chase-bug/hotfix.md`, `skills/chase-bug/reference/attempt-budget.md`, `scripts/loop-outside-return.test.mjs`, `eval/chase-bug/`, `eval/lib/replay.test.mjs`, `doc/configuration.md`, `CHANGELOG.md`; every AC row above is observable in this repo.

## Design

The hot fix keeps its shape: one acceptance row, one parent-owned temp ledger, seed-then-row dispatch of `loop-implementer`, the step 5-7 gates, and the landing, cleanup, and abort machinery. Only the count of dispatches each stage may spend changes. All three budgets read the ledger's `allowance:` line, which step 2 fills from `loopEngine.maxIterationsPerRow`; no setting is added.

### Protected blocks (byte-identical)

Steps 8, 9, and 10, the whole `## Abort` section, and `## Red Flags - STOP` in `skills/chase-bug/hotfix.md` stay byte-identical. `skills/chase-bug/SKILL.md`, `skills/loop-implementation/`, `agents/`, and `extensions/` are unchanged. The menu's `unavailable: more than one acceptance row` rule stays.

### Budgets

| Budget | Counter | A dispatch is permitted while | Escalated dispatch |
|---|---|---|---|
| Seed | count of `repair seed` lines in `## Decisions` | count < allowance | never |
| Row | row 1's `attempts` cell, while no `row 1 passed` line exists | attempts < allowance | attempts == allowance - 1 |
| Repair | `attempts - k`, with `k` read from the `row 1 passed` line | attempts - k < allowance | attempts - k == allowance - 1 |

With allowance 4 the worst case is 4 seed, 4 row, and 4 repair dispatches (12), up from 1 seed and 4 shared attempts (5). The parent recovers every counter from the ledger, the consecutive-miss streak included (see "Two-miss hint"); it keeps no counter outside it. Row 1's `attempts` cell never resets or decreases - a pass, a reopen, and an escalation leave it as is - and `k` is a snapshot written once, so `attempts - k` only grows.

### Seed budget

A seed miss is zero commits, a dispatch error without a commit, a missing, unreadable, or mismatched return file, a malformed row, counts, or decision, or an empty diff that fails the proof below. On a seed miss the parent:

1. Appends `repair seed | seed miss: <concrete miss> | iteration <consumed>` to `## Decisions`, where `<consumed>` is the ledger's bumped `iterations:` value.
2. Clears `pending:` and deletes the return file through the return-file recipe. Row 1 stays `| 1 | open | 0 | |`.
3. Counts the `repair seed` lines. Below the allowance, it dispatches `target: seed` again through the full step 4 dispatch with `previous decision: none` and the seed hint followed by `seed miss: <concrete miss>`. At the allowance it aborts (pre-land) with the exhaustion report.

A missed seed that committed stays on `hotfix/<slug>` and the retry starts on top of it; nothing is reset in the worktree. On squash delivery the landed commit carries whatever of the missed commit's tree changes survive to the final HEAD, without its separate commit; on PR delivery the pushed `hotfix/<slug>` keeps the missed commit in its history even when a later commit reverses its changes. The protected landing text is unchanged.

The empty-diff proof reads the evidence path at the dispatch's `HEAD_BEFORE` (`git -C <WORKTREE> cat-file -e <HEAD_BEFORE>:<path>`) instead of `BASE_SHA`. On the first seed the two are the same commit; on a retry this admits a test written by an earlier missed seed's commit.

Three seed results keep their immediate abort and write no `repair seed` line. A child return whose first line is `BLOCKED:` (the binding mismatch) is checked first and takes precedence over every retryable seed miss, although it arrives as a dispatch error without a commit. The other two are row status `done` (`baseline already passes: repro not captured`), because a retry cannot make a passing test fail; and a boundary failure (dirty worktree or more than one new commit).

### Row budget

Row 1's `attempts` cell counts every `target: 1` dispatch consumed by admission or validation miss, as today. Until the row first passes, a dispatch is permitted while `attempts < allowance`, and the dispatch at `attempts == allowance - 1` is the escalated round, as today.

On the first admitted `done` for row 1, the parent appends `row 1 passed | first done | attempts <k>` to `## Decisions`, with `<k>` the admitted attempts value. The line is written once; a later `done` after a repair adds no second line.

### Repair budget

After the `row 1 passed` line exists, every repair (red gate run, open conformance gap, `FIX_FIRST`) is a `target: 1` dispatch through step 4 that increments `attempts` as today. Repairs used is `attempts - k`. A repair is permitted while `attempts - k < allowance`; otherwise the hot fix aborts (pre-land) with the exhaustion report. A repair admitted `failed` or lost to a validation miss spends one repair like any other.

Only a repair admitted `done` resumes at step 5. A repair admitted `failed`, or lost to a validation miss, leaves row 1 `failed`, writes no second `row 1 reopened` line, and returns to the repair budget check: the next `target: 1` dispatch when one is permitted (with the admitted `failed` line as `previous decision`, or `none` after a miss, as step 4 does today), otherwise the pre-land abort with the exhaustion report. It never advances to a gate run. Every admitted repair commit still invalidates earlier step 6 and step 7 approvals; landing needs a passing gate run, conformance pass, and `SHIP` on the same final HEAD.

Reopening is unchanged and still precedes the budget check: the parent writes row 1 `failed` with the stage evidence, attempts unchanged, and appends `row 1 reopened | <stage>: <bounded reason, 200 chars> | 1`, so the ledger records the reopen even when no repair remains.

Unchanged and outside all three budgets: the reviewers' one-redispatch limits, `REJECT`, invariant-violation aborts, the bounded repair hints, and the same-HEAD rule that every admitted repair invalidates earlier step 6 and step 7 approvals.

### Escalation

The escalated dispatch of the row budget and of the repair budget each adds `model: <implModel>` to the step 4 call and first appends a decision line: `row 1 escalated | implModel round | allowed attempts <allowance>` for the row budget (unchanged text) and `row 1 escalated | implModel repair round | allowed repairs <allowance>` for the repair budget. A run can therefore carry both lines. The escalation line is not a repair hint and never becomes `previous decision`: the escalated dispatch carries the `previous decision` it would carry unescalated, the prior reopen or admitted line. An undefined `implModel` at either escalated dispatch aborts (pre-land) with `Problem: escalationLoop.implModel unavailable`, with no dispatch and no escalation line. Seed dispatches and all other dispatches omit `model:`. At allowance 1 the single row attempt and the single repair are both escalated, and no seed retry exists.

### Two-miss hint

Each row validation miss appends `repair row 1 | <concrete miss> | iteration <consumed>` to `## Decisions`, the loop driver's line for an ordinary miss, next to the existing row write (`failed`, attempts + 1, miss evidence). The consecutive-miss streak is read from the ledger, not kept beside it: among row 1's outcome lines - admitted `row 1 done` or `row 1 failed` decisions and `repair row 1` lines - it is the count of `repair row 1` lines after the last admitted decision. `row 1 reopened`, `row 1 escalated`, and `row 1 passed` markers and every seed line are ignored, so `miss, admitted failed, miss` reads as a streak of 1 and `admitted failed, miss, miss` as a streak of 2 at the same attempts value. An admitted return ends the streak, and seed misses never enter it. From the second consecutive miss on, the next `target: 1` dispatch's hint gains the line `two returns broke the contract: <concrete miss from the latest miss evidence>`, appended after any repair hint lines for that round. The miss still spends one attempt, so the row or repair budget bounds the run. The `second consecutive miss -> abort (pre-land)` rule is removed.

### Exhaustion report

Every budget-exhausted abort, on the pi and inline paths, prints before step 3's ledger teardown: `seed: <s> of <allowance>`, where `<s>` is the count of `repair seed` lines (recorded misses, not seed dispatches, so an admitted first-try seed reports 0), as the loop driver's report counts it; row 1's `attempts` cell verbatim; `repairs: <attempts - k> of <allowance>`, or `repairs: none - row 1 never passed` when no `row 1 passed` line exists; then every `## Decisions` line verbatim in ledger order, including seed, repair seed, repair row 1, admitted, passed, reopened, and escalated entries.

### Where the text lives

`skills/chase-bug/reference/attempt-budget.md` is a new reference consumed only by `hotfix.md`. It holds the budgets table, the seed, row, and repair rules, escalation, the two-miss hint, reopening, the exhaustion report, the bounded repair hints table, the same-HEAD invalidation rule, and the key that maps the protected blocks' generic wording to budget states. It also carries the rules that live only in the removed `## Attempt budget` section: the escalated dispatch keeps the prior reopen or admitted line as `previous decision`, and escalation is not a repair hint; row 1's attempts are never reset or reduced, and `k` is a snapshot. The key reads: "implementer" means the `loop-implementer` child; "the child's status line" means its admitted decision line or the mandated `BLOCKED:` first line; no `NEEDS_CONTEXT` is routed, because no child emits it; "red after retry" means a red gate run with the applicable budget exhausted; "unfixable conformance gap" means a gap still open with the repair budget exhausted; "a non-`SHIP` re-review" means `FIX_FIRST` with the repair budget exhausted, `REJECT`, or an invariant violation. "No attempt remaining" in steps 5-7 means the applicable budget permits no dispatch.

`hotfix.md` step 2 reads that file at its absolute path, resolved against the skill directory, before anything is created; unreadable aborts (pre-land, nothing created), naming the path. Every `Attempt budget` mention in steps 2 and 4-7 and in `## Harness fallback` names that reference. `hotfix.md` ends at or under its current 480 lines.

### Harness fallback

The inline path applies the same three budgets with allowance 4 and no `implModel`. It has no worker and no return file, so inline seed admission reads only the inline commit, the evidence, and the tree, after `binding_check`:

| Inline seed result | Action |
|---|---|
| Exactly one new commit since the attempt's `HEAD_BEFORE`, a clean tree, row 1 `open` at attempts 0 with a selective evidence command that ran and failed, and the empty-diff proof when the commit changes no tracked file | Admit; no return file and no model is required or checked |
| Zero commits, missing or non-selective evidence, or an empty diff that fails the proof | Retryable miss: record the `repair seed` line and redo the seed while the count is below 4; at 4, abort (pre-land) with the exhaustion report |
| The evidence command passes (`baseline already passes: repro not captured`), a dirty tree, more than one new commit, or a failed `binding_check` | Terminal abort as today, no `repair seed` line |

The first `done` records the `row 1 passed` line; repairs draw on `attempts - k`; escalated dispatches are plain inline attempts. The exhaustion report is the same.

### Eval evidence and paid actions

The edit changes what the hot-fix parent does, so `eval/chase-bug/` gains samples and a rewritten `intent.md`. Each sample is an isolated parent decision with a stop boundary; none replays a row implementation, a gate, a reviewer, or a landing.

| Sample | Fact | Must hold |
|---|---|---|
| `hotfix-seed-file-observation` (re-recorded) | `admission` | A admits the open seed row from the return file with attempts 0. B-D (missing, unreadable, mismatched file) each record one `repair seed` line naming the miss, keep attempts 0, clear pending, delete the return file, and select a seed redispatch with the miss in its hint; none aborts; the commit body never substitutes. |
| `hotfix-return-file` (re-recorded) | `admission` | A admits. B (missing file) records a seed repair and selects a seed redispatch; the commit body never substitutes. |
| `hotfix-seed-retry` (new) | `seed-budget` | With allowance 4: a miss at two prior repairs records the third and redispatches seed; a miss at three prior repairs records the fourth and aborts pre-land with `seed: 4 of 4`; a seed row returned `done` aborts with `baseline already passes: repro not captured` and no repair line; a dirty worktree aborts with no repair line; an empty-diff retry whose evidence path exists at `HEAD_BEFORE` but not at `BASE_SHA` is admitted; on the inline path (neither `subagent` nor `gauntlet_setting`, allowance 4) a seed attempt that left zero commits records one `repair seed` line and is redone, and the next inline seed with one commit, failing selective evidence, and a clean tree is admitted with no return file and no model requirement. |
| `hotfix-two-miss-hint` (new) | `hint` | Each variant supplies a ledger snapshot (row 1's cell and the `## Decisions` lines), never a streak count. With allowance 4: a snapshot at attempts 1 ending in one `repair row 1` line takes a second malformed row return, records a second `repair row 1` line, sets attempts 2, and selects a `target: 1` dispatch whose hint carries `two returns broke the contract: <miss>` with `previous decision: none`; two snapshots at attempts 2 each take one more malformed return to attempts 3 - `repair row 1` then admitted `row 1 failed` (history miss, admitted failed, miss) adds no hint line, admitted `row 1 failed` then `repair row 1` (history admitted failed, miss, miss) adds it; a malformed return at attempts 3 of 4 exhausts the row budget and aborts; a conforming return after one `repair row 1` line ends the streak and adds no hint line. |
| `hotfix-repair-budget` (new) | `budget` | With allowance 4: a first admitted `done` at attempts 3 on a ledger with no `row 1 passed` line appends `row 1 passed | first done | attempts 3`; a later admitted `done` at attempts 4, after a repair, appends no second line and leaves `attempts 3` as the ledger's only marker. With that marker in the ledger: a red gate at attempts 3 reopens and permits a repair without `model:`; `FIX_FIRST` at attempts 6 reopens, appends the repair escalation line, and dispatches with `model: <implModel>`; a conformance gap at attempts 7 records the reopen and aborts pre-land with a report quoting `seed:`, the attempts cell, `repairs: 4 of 4`, and every decision line; a seed dispatch carries no `model:`. |

`eval/chase-bug/target.json` gains a `skillFiles` entry for `skills/chase-bug/reference/attempt-budget.md` declared `"new": true`, and its existing `skills/finishing-a-development-branch/reference/commit-message.md` entry loses its stale `"new": true`, because that file exists at the default baseline. `eval/lib/replay.test.mjs` pins the `skillFiles` array and is updated for both changes.

The reference reaches the samples through that `skillFiles` entry alone: no `case.md` carries a `bundle+` line for it, existing samples' bundle directives stay unchanged, and the extra candidate context in the samples left unrun is accepted. The three new samples carry new bundle directives (`bundle+: skills/chase-bug/hotfix.md`). The two re-recorded samples' `case.md` files change only as listed under "Add"; no other existing sample's `case.md` changes; cells of other samples that go stale are left unrun, per `eval/README.md` "Iterating on a skill edit".

Sample constraint: the target's `wordCap` is 700 and an over-cap reply is an error cell. Each multi-variant sample's Output asks, per variant, only for the changed ledger facts and the next action, never a reproduced ledger. The exhaustion variant of `hotfix-repair-budget`, which must show every decision line in order, uses a short fixture ledger.

Paid action: the implementing agent runs, from the worktree, `node eval/run.mjs chase-bug <sample>` for each of the five samples, preceded by `node eval/run.mjs chase-bug <sample> --baseline-only` for the three new samples (`hotfix-seed-retry`, `hotfix-two-miss-hint`, `hotfix-repair-budget`), whose bundle directives are new, and `--refresh-judgments` for one sample when a saved judgment needs re-judging. Every run uses the runner's default baseline (`git merge-base HEAD origin/main`, `c46569c2`) with no `--base`, so the baseline arm is the `hotfix.md` this change edits. Before the first paid run the agent checks that the baseline-aware target lint (`lintTarget` from `eval/lib/lint.mjs`, given the default merge-base the way `eval/run.mjs:174-182` gives it) returns no error for `eval/chase-bug`; that check makes no model call. Each selected run overwrites `eval/chase-bug/report.md` with one sample's rows, so the agent saves each partial report before the next run writes. Inputs: the sample name; the replay and judge models frozen in `eval/lib/models.mjs`. Approving this spec authorizes these runs for the whole flow across seed, rows, repairs, and finish, without per-step permission prompts; no count is set. No other paid or external action is needed; `npm test` and `node --test scripts/loop-outside-return.test.mjs` make no model call.

### Remove

- `skills/chase-bug/hotfix.md` step 4, seed admission table: the row ending `Abort (pre-land), no seed retry`.
- `skills/chase-bug/hotfix.md` step 4, validation miss: the sentence `the second consecutive miss -> abort (pre-land)`.
- `skills/chase-bug/hotfix.md` step 4, empty-diff row: the `BASE_SHA` path proof.
- `skills/chase-bug/hotfix.md`: the whole `## Attempt budget` section, including the same-counter rule and the `or add a per-stage repair cap` prohibition; the rules named under "Where the text lives" move to the reference, the never-reset rule among them.
- `skills/chase-bug/hotfix.md` `## Harness fallback`: the same-counter wording.
- `scripts/loop-outside-return.test.mjs`: the `no seed retry` assertion.
- `eval/chase-bug/samples/hotfix-seed-file-observation/expected.md` and `eval/chase-bug/samples/hotfix-return-file/expected.md`: the abort-without-retry expectations; their committed `eval/chase-bug/results/` records are replaced by the re-recorded ones.
- `eval/chase-bug/samples/hotfix-seed-file-observation/case.md` and `eval/chase-bug/samples/hotfix-return-file/case.md`: the `retry the seed` and `mutate counters` prohibitions in the Stop boundary, and the Output limit to a classification and one reason in `hotfix-return-file`.
- `eval/chase-bug/target.json`: the stale `"new": true` on the `commit-message.md` entry.
- `doc/configuration.md`: `retains its last allowed attempt rule` in the `loop-implementer` row; in the escalation overview paragraph, the hot fix's `as a shared budget for implementation, gate retries, conformance repairs, and review fixes, with implModel on the last allowed attempt` and `Hotfix aborts before landing when a required repair exhausts that budget`.

### Add

- `skills/chase-bug/reference/attempt-budget.md`: the content listed under "Where the text lives".
- `skills/chase-bug/hotfix.md` step 2: the read of `reference/attempt-budget.md` with its unreadable abort.
- `skills/chase-bug/hotfix.md` step 4: the seed-budget check before every `target: seed` dispatch; the seed-miss table row routing to seed repair; the retry seed hint; the `HEAD_BEFORE` empty-diff proof; the `BLOCKED:` precedence over seed repair; the `row 1 passed` line on first `done`; the `repair row 1` line on each row validation miss; the two-miss hint in place of the abort; the reference pointer in place of "Attempt budget below".
- `skills/chase-bug/hotfix.md` `## Harness fallback`: the three inline budgets and the inline seed admission table.
- `scripts/loop-outside-return.test.mjs`: assertions that `hotfix.md` routes a seed miss to seed repair and names `reference/attempt-budget.md` in step 2, and that the reference carries the `repair seed` and `row 1 passed` line grammars; the saved-replies test title names seed repairs.
- `eval/chase-bug/samples/hotfix-seed-retry/`, `hotfix-two-miss-hint/`, `hotfix-repair-budget/`: `case.md` and `expected.md` each; their `eval/chase-bug/results/` records; the re-recorded records and updated `expected.md` for `hotfix-seed-file-observation` and `hotfix-return-file`.
- `eval/chase-bug/samples/hotfix-seed-file-observation/case.md` and `eval/chase-bug/samples/hotfix-return-file/case.md`: Fixed inputs gain allowance 4 and zero prior `repair seed` lines; Output and Stop boundary permit recording the repair line and selecting the next dispatch without executing it. Both keep the six headings, a Stop boundary matching the tested `Stop ... (output|decision|message)` pattern, the `admission` fact id, and their existing bundle directives.
- `eval/chase-bug/target.json`: the declared-new `skillFiles` entry for `attempt-budget.md`.
- `eval/lib/replay.test.mjs`: the pinned `skillFiles` assertion updated for the added reference entry and the removed stale flag.
- `eval/chase-bug/intent.md`: updated for this change - `for:` set to the new skillFiles-only assembly SHA; one `Expected to move` line per fact above, written `sample/fact: holds|fails -> holds|fails - why`; entries for untouched samples retained.
- `eval/chase-bug/report.md`: consolidated from the five saved partial reports, without a target-wide run, keeping its statement that the other hot-fix records are historical.
- `doc/configuration.md`: in the escalation overview paragraph, the hot fix's one-row ledger applies `loopEngine.maxIterationsPerRow` as three independent bounds (seed, row, repairs after the first pass), uses `implModel` only on the last permitted dispatch of the row budget and of the repair budget, never on a seed dispatch, aborts before landing when any of the three is exhausted, and applies allowance 4 to each on its non-pi inline fallback, with no model dispatch; the paragraph's loop-driver phrases that `scripts/loop-engine-contract.test.mjs` requires stay verbatim and none of its forbidden phrases is introduced. In the `loop-implementer` row, the hot fix escalates the last permitted dispatch of its row budget and of its repair budget, independent of `escalateAfter`; in the `piGauntlet.loopEngine.maxIterationsPerRow` row, the hot fix applies the allowance separately to its seed, its row, and its repairs after the first pass.
- `CHANGELOG.md`: one entry under `## Unreleased`.
- `doc/specs/2026-11-01-chase-bug-loop-hotfix.md`: the supersession banner for this spec.
- `doc/specs/2026-11-14-single-commit-message-contract.md`: a supersession banner for this spec naming only the hot-fix seed-miss disposition; its return-file transport and cleanup contract is not superseded.

## Errors and edge cases

- Seed miss with a commit: the commit stays; no reset; the retry runs on top. Squash delivery lands the surviving tree changes without the separate commit; PR delivery keeps the commit in the pushed branch's history.
- Seed child returns `BLOCKED:` as its first line: abort (pre-land) at once, no `repair seed` line, even though the return is a dispatch error without a commit.
- Repair admitted `failed` or lost to a validation miss: one repair spent, no second reopen line, no gate run; the next repair dispatch when the budget permits, otherwise the abort.
- Seed miss by boundary failure (dirty worktree, more than one commit): abort (pre-land) as today, no `repair seed` line, attempts unchanged.
- Seed returns row status `done`: abort with `baseline already passes: repro not captured`, no retry.
- Seed budget exhausted: abort (pre-land) with the exhaustion report; row 1's attempts are 0.
- Allowance 1: one seed dispatch, one escalated row attempt, one escalated repair.
- Row never passes: no `row 1 passed` line, no repair budget; the row budget's exhaustion aborts.
- Row passes on its escalated attempt (`k == allowance`): the repair budget still holds `allowance` repairs, the last of them escalated.
- Two-miss hint during a repair: appended after the repair's own hint lines; cleared by the next admitted return.
- `row 1 passed` is written once; re-passing after a repair adds no line and does not move `k`.
- Reopen at an exhausted repair budget: the reopen line is written, then the abort; the report shows it.
- `implModel` undefined at an escalated dispatch of either budget: abort (pre-land), `Problem: escalationLoop.implModel unavailable`.
- `reference/attempt-budget.md` unreadable at step 2: abort (pre-land), nothing created.
- Binding checks, return-file teardown on every exit, and ledger teardown as the last action of every exit are unchanged and apply to seed retries like any dispatch.
- `scripts/commit-message-contract.test.mjs` constraints on the re-recorded `hotfix-return-file`: its `expected.md` keeps exactly the fact id `admission`, its `case.md` keeps the six headings, and `eval/chase-bug/report.md` still matches `/historical/i`.
- `scripts/loop-outside-return.test.mjs` constraint on the re-recorded `hotfix-seed-file-observation`: fact id `admission` holds with verdict `improved` or `unchanged`.

## Tests

- A seed miss records one `repair seed` line, keeps row 1 at attempts 0, and redispatches seed with the miss in its hint - `eval/chase-bug/samples/hotfix-seed-file-observation`, `eval/chase-bug/samples/hotfix-return-file`
- The seed budget at the allowance aborts pre-land without another seed dispatch - `eval/chase-bug/samples/hotfix-seed-retry`
- A seed row returned `done` and a dirty worktree abort without a `repair seed` line - `eval/chase-bug/samples/hotfix-seed-retry`
- An empty-diff seed retry is admitted on a path present at `HEAD_BEFORE` - `eval/chase-bug/samples/hotfix-seed-retry`
- A second consecutive validation miss yields the two-miss hint and a dispatch, not an abort - `eval/chase-bug/samples/hotfix-two-miss-hint`
- The streak is read from the ledger's decision lines: `miss, admitted failed, miss` adds no hint and `admitted failed, miss, miss` adds it - `eval/chase-bug/samples/hotfix-two-miss-hint`
- A second consecutive miss with the row budget spent aborts; a conforming return clears the hint - `eval/chase-bug/samples/hotfix-two-miss-hint`
- The first admitted `done` writes `row 1 passed` with the admitted attempts; a later `done` leaves it the only marker - `eval/chase-bug/samples/hotfix-repair-budget`
- A row that passed on attempt 3 gets four repairs; the fifth aborts pre-land - `eval/chase-bug/samples/hotfix-repair-budget`
- The last permitted repair dispatch carries `model: <implModel>` after its escalation line; a seed dispatch carries none - `eval/chase-bug/samples/hotfix-repair-budget`
- The exhaustion report quotes the seed count, the attempts cell, the repairs used, and every decision line, including the final reopen - `eval/chase-bug/samples/hotfix-repair-budget`
- `hotfix.md` routes a seed miss to seed repair and reads `reference/attempt-budget.md` in step 2; the reference carries both decision-line grammars - `scripts/loop-outside-return.test.mjs`
- Saved replies for `hotfix-seed-file-observation` and `hotfix-row-return-file` hold `admission` - `scripts/loop-outside-return.test.mjs`
- `hotfix-return-file` keeps its fact id, headings, and recorded cells - `scripts/commit-message-contract.test.mjs`
- Step 4 keeps `context: "fresh"`, `git -C <WORKTREE>`, and the first-command guard between the step 4 and step 5 headings - `scripts/ci.mjs`
- An inline seed miss is recorded and redone under allowance 4, and the following inline seed is admitted from its commit, evidence, and tree with no return file and no model - `eval/chase-bug/samples/hotfix-seed-retry`
- `eval/chase-bug/target.json` `skillFiles` equals the pinned array with the added reference entry and without the stale flag - `eval/lib/replay.test.mjs`
- The inline path applies the row and repair budgets with allowance 4 - none: after seed admission the inline path has no isolated parent decision distinct from the pi path's samples; the Harness fallback text is read at review
- Row passes on its escalated attempt, allowance 1, and `implModel` undefined at a repair escalation - none: each follows from the budgets table with no separate decision boundary; covered by the table text at review
- Unreadable reference at step 2 aborts with nothing created - none: a file-read failure before any state exists; the step 2 text is read at review
- Protected blocks byte-identical - none: no test pins them; the whole-diff review compares steps 8-10, `## Abort`, and `## Red Flags - STOP` against base

## Documentation impact

Per `reference/documentation-impact.md`:

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` (operations / tunable parameters: the escalation overview paragraph and the `loop-implementer` and `maxIterationsPerRow` table rows - what `loopEngine.maxIterationsPerRow` bounds in a hot fix and which dispatches use `escalationLoop.implModel`); `CHANGELOG.md` (major procedures: the hot fix's retry behavior changes for every user)
- Derived / memory docs invalidated: none

`README.md`'s hot-fix paragraph names no attempt counts and stays as is.

## Out of scope

- More than one acceptance row per hot fix (user decision at the framing question); `skills/chase-bug/SKILL.md` and the menu are untouched.
- A hot-fix-specific attempts setting, and any new `piGauntlet.*` key.
- A human stop, a retry grant, or a kept worktree on budget exhaustion; exhaustion stays a pre-land abort.
- Recovering dirty-tree or multiple-commit returns by reset, as the loop driver does.
- Sharing the retry rules between the hot fix and the loop driver in one file; the rules stay restated in the hot fix's reference.
- The reviewers' redispatch limits, the eligibility predicates, and the landing, cleanup, and abort blocks.
- Re-running `eval/chase-bug` samples other than the five named.

## Open questions

None. Two assumptions stand in for facts that could not be checked: retries are the stop that limits hot fixes in practice (the user's observation, no run history exists), and the session resolves `escalationLoop.implModel` at each escalated dispatch (otherwise today's abort applies).
