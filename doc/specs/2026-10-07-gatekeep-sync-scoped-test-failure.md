# gatekeep-pr sync: hold the push when a conflict stop's scoped tests fail

**Goal:** When the `--rebase` sync's conflict-stop helper resolves the listed files but the scoped tests fail in a file that replayed cleanly, finish the rebase, keep the rebased head local, carry the failing tests into the digest as blockers, and let the normal step-6 `fix` wave resolve them before the lease push - so a semantic break outside the conflicted files no longer aborts the whole rebase, and no head the run knows is red reaches the remote.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Ticket:** none
**Predecessor:** `doc/specs/2026-10-06-gh-58-gatekeep-pr-rebase-sync.md` - supersedes its Design `### reference/sync.md` "Conflict stop" and "Push" clauses and the edge-table row "implementer returns `open`, leaves residue, or unmerged paths remain" for the red-scoped-test case only; the rest stays live.

## Problem

Observed (customer-ops session 2026-10-06): a rebase stopped on `api.py`; the helper resolved it, ran `SCOPED_TEST_COMMANDS`, and four tests in `tests/test_plant_docs_bundle.py` failed - main's new tests assume the behavior the PR changes. That file replayed cleanly, so the conflict-stop rule (`sync.md` line 37, "never edit a file outside the list") forbids the helper from touching it; it returned `open`, and `## Failure path` ran `git rebase --abort` and recorded `sync: failed - implementer returned open`. The resolution was correct; the run threw it away, and the `Sync:` line never names the failing test or file. The gh-58 edge table has no row for "scoped tests fail in a cleanly replayed file".

The fix wave cannot run inside the rebase: `fix-wave.md` records `pre_wave_head` as a branch HEAD (line 7), has helpers commit on the PR branch (line 35), reviews `<pushed_head>..HEAD` (line 44), and pushes without a lease (line 50); a rebase in progress is detached and uncommitted, and `sync.md` `## Permitted orchestrator git writes` (line 7) allows the orchestrator no `add` or `commit`.

Framing: pivoted to "complete the rebase, withhold the sync push, hand the red scoped test to the normal step-3/step-6 fix wave" - the request's mid-rebase menu has no fix path; the user removed the abort row, so the fix wave is the only resolution offered.

Rejected alternative: widen the helper's file list to the failing test files. That puts a product decision (change the tests or the code?) inside an ungated rebase step and encodes "tests are the thing to change" as the default.

## Acceptance criteria

none - no ticket

## Design

Six existing skill files change; no new file, setting, verb, stage state, or digest field. Skill text follows `/skill:forge-skill` authoring rules: imperative, one clause per new behavior, the single condition "the sync record is `rebased locally`" wherever a rule branches.

### The `rebased locally` head: one identity rule

While the sync record is `rebased locally`, the digest's `headRefOid` is the local rebased SHA (`<new_head>`) and the record carries `<pre_head>`, the remote head. Every consumer that reads `headRefOid` as the assessed head (verification evidence, `findings.md` `## Provenance` `head_sha`, scope-contract reads, helper task text, the wave's `pushed_head`) therefore sees the local head with no further rule. Every consumer that compares the remote head against `headRefOid` to detect a head move (`post-selection-loop.md` `### Pre-menu refresh` and `### Compare-and-swap`, the step-3 first-pass poll) compares it against the record's `<pre_head>` instead; an unchanged remote `<pre_head>` is not a head move. The lease push expects `<pre_head>`.

### `skills/gatekeep-pr/reference/sync.md`

- Line 3 `Output:` gains the third outcome: "or the worktree on a rebased, unpushed head with `rebased locally` in the digest".
- `## Conflict stop` - the verbatim helper rule gains "report every failing scoped test with its file and test names; never edit a file outside the list". The implementer persona may not return `done` while a supplied scoped command fails (`agents/implementer.md` hard rules), so the continue condition reads: continue when the helper returned `done`, or returned `open` whose only stated reason is a failing scoped test in a file outside the list; the unmerged-paths, fully-staged, and residue checks are unchanged. `open` for any other reason keeps taking `## Failure path`. A listed file whose own tests fail is the helper's job and stays `open`.
- `## Push` - first sentence: "When any stop reported a failing scoped test, skip the push, set `headRefOid` to the local HEAD, and record `sync: rebased locally <pre_head7>..<new_head7> onto origin/<base>, <n> stop(s) resolved in <files>, <m> commit(s) dropped as already applied, scoped tests red in <file>: <tests>` (one `scoped tests red in` clause per stop; `<pre_head>` stays in the record)." `## Review before push` still runs first.
- `## Re-gather` - on a `rebased locally` head: mint one blocker `P#` per `scoped tests red in` clause before step 3, evidence the helper's scoped-test output, per `findings.md`'s blocker contract (IDs append-only, survive re-renders); skip the step-3 check poll and the local verification run - step 3 records `source: pending` for the local head (no claims), so the first pre-menu refresh after the lease push runs the existing claim-check-only path; the carried blockers are the verification evidence and the verdict is `fixable`; `plan_tracker` closes `sync` `complete`.
- `## Sync record` - add the `rebased locally - ...` form. The plain `rebased ...` form is this record with the `scoped tests red in` clauses removed.

### `skills/gatekeep-pr/SKILL.md`

Step 2b output cell and `## Progress tracking` each gain the clause "or a rebased, unpushed head (`rebased locally`, `complete`)".

### `skills/gatekeep-pr/reference/findings.md`

`## Drafted payloads` - the carried `P#` is drafted like any blocker: a concrete edit from the helper's test output and `git show <stopped commit>`; a `P#` with no draftable edit stays open and `fix` reports it as not fixable, as today. The human sees the draft at the step-6 consent and decides whether code or test expectations change; the implementer never decides it.

### `skills/gatekeep-pr/reference/decision-menu.md`

`## Availability` gains one row: `update branch`, `review`, `merge`, `merge anyway`, `push`, `wait` - omitted while the sync record is `rebased locally` (`Not offered: ... (head not pushed)`); the wave's lease push is the only remote write. `stop` row consequence gains "on a `rebased locally` head: `git reset --hard <pre_head>`, discarding the rewrite and any unpushed fix commits, then teardown" - picking the row with that clause is the consent; the reset runs before `### Teardown`.

### `skills/gatekeep-pr/reference/post-selection-loop.md`

`### Compare-and-swap` and `### Pre-menu refresh` each gain one clause: "while the sync record is `rebased locally`, compare the fetched `headRefOid` against the record's `<pre_head>`"; an unmoved head never re-syncs, keeps `status_checks[]` and `actions_runs[]`, skips the evidence re-resolve, ignores `mergeable` and `mergeStateStatus` changes, and a `state` change to closed or merged renders `stop` and `show evidence` only; the generic head-move and refresh rules apply to any other head. The `stop` reset of `decision-menu.md` runs before `### Teardown`.

### `skills/gatekeep-pr/reference/fix-wave.md`

- Line 3 permitted writes gain `reset --hard <pre_head>` (the lease-refusal path: a refused lease, or a remote head move on a `rebased locally` head).
- `## Evidence after push` - on a `rebased locally` head, push only when every carried `P#` has a `resolved` closure line, with `--force-with-lease=<head_ref>:<pre_head>`; otherwise commits stay unpushed and the menu re-renders. A refusal naming the lease: `git reset --hard <pre_head>`, assert a clean tree, record `sync: failed - push rejected: <first server line>`, render `stop` and `show evidence` only. After a successful push rewrite the record to the plain `rebased ...` form.
- `## Review before push` needs no change: `pushed_head` = `headRefOid` = `<new_head>`, so `## Fix delta` is the fix commits alone (the sync reviewer already covered the rewrite with `range-diff`).

### Data flow

helper report (file, tests) -> `sync` record -> blocker `P#` at sync handoff -> step-5 drafted payload -> step-6 `fix` with consent -> wave helper, scoped command = that test file -> wave reviewer over `<new_head>..HEAD` -> lease push against `<pre_head>` -> normal poll.

The sync transports the fact; the human decides at step 6; the wave helper edits under the existing payload-consent and reviewer gates. Nothing new is dispatched inside the rebase.

## Errors and edge cases

| Case | Behavior |
|---|---|
| helper `open`, red scoped test outside the list, plus residue outside listed files or unmerged paths | unchanged: `## Failure path` |
| helper `open` for a listed file (unresolved, or its own tests fail) | unchanged: `## Failure path`, `sync: failed - implementer returned open` |
| red scoped tests in two stops | one `scoped tests red in` clause and one blocker `P#` per stop |
| red scoped tests, sync reviewer Critical/Moderate | unchanged: `## Failure path`, restore `<pre_head>` |
| `SCOPED_TEST_COMMANDS` = `none` | no red report possible; unchanged |
| `rebased locally`, user picks `stop` | `git reset --hard <pre_head>`, assert `HEAD == <pre_head>` and clean porcelain; mismatch = existing hard stop; remote untouched |
| `rebased locally`, wave fixes one of two carried `P#` | commits stay unpushed; menu re-renders with the open `P#`; `push` omitted |
| `rebased locally`, wave push lease refused (`stale info`) | reset to `<pre_head>`, `sync: failed - push rejected: ...`, `stop`/`show evidence` only; fix commits discarded - the reason says so |
| wave resolves every carried `P#`, reviewer passes, lease push succeeds | record becomes plain `rebased ...`; normal poll on the pushed head |
| `rebased locally`, wave `## Conflicts` `merge-tree` reports a conflict (base moved again) | existing conflict menu minus `update branch` (`## Availability` row above) |
| remote head moves while `rebased locally` | compare-and-swap against `<pre_head>` detects it: the lease-refusal path of `fix-wave.md` `## Evidence after push` (`git reset --hard <pre_head>`, assert, record `sync: failed - remote head moved`, menu `stop` and `show evidence` only) instead of the head-move re-sync, whose fast-forward cannot land on rewritten history |
| second invocation with a `rebased locally` head left in the worktree | unchanged: `assessment.md` line 9 provisioning stop on local-only commits |

## Tests

- New eval sample `eval/gatekeep-pr/sample/scoped-test-red-sync/`: `source.md` = the `conflicting-file-sync` digest plus a helper `open` report naming one red test in the cleanly replayed file. Must-hold facts S1-S5: `--continue` runs; the range-diff reviewer runs; no `push` before the first menu; the `Sync:` line reads `rebased locally` and names the file and the test; the first menu offers `fix` for a blocker naming that test, omits `update branch`/`merge`/`push` with `Not offered: ... (head not pushed)`, and narrates no local verification run. All five are observable inside the persona the runner loads (`SKILL.md`, `decision-menu.md`, `sync.md`) and before the first menu, where narration stops; the lease push lives in `fix-wave.md` and is covered by `npm test`'s skill lint only. `expected.md` is drafted by a fresh model from `source.md` and user-approved before the baseline arm.
- Existing seven samples: `expected.md` unchanged; `conflicting-file-sync` keeps "the helper touches only the conflicted file".
- `eval/gatekeep-pr/run.test.mjs` slug list and `eval/gatekeep-pr/README.md` sample count and table gain the new sample. The README `## One run` baseline recipe gains a second recipe pinned to this worktree's base commit that also extracts `reference/sync.md`. Run config: narrator `anthropic/claude-opus-5-5`, judges `github-copilot/gpt-6-astra` and `anthropic-fable/claude-fable-5-1:medium` - command-line arguments and a results README row, never a committed default.
- `npm test` (skill lint, stage-skill lint, model-literal lint, `SKILL.md` under 120 lines).

## Documentation impact

Per `reference/documentation-impact.md`:

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` - gatekeep-pr bullet, `--rebase` clause: after "lease-pushes the head before verification" add "or holds the rebased head locally when a conflict stop's scoped tests fail, so the normal `fix` row resolves it before the lease push" (category: major procedures); `CHANGELOG.md` `## Unreleased` entry for this change (the release skill promotes only that section)
- Derived / memory docs invalidated: none (`doc/configuration.md` `maxFixRounds` stays correct - the round cap is unchanged)

## Out of scope

- A mid-rebase menu or any new menu verb.
- Widening the conflict-stop helper's file list.
- An abort row for the red-test case; `stop` is the exit.
- Extending the eval runner past the first menu.
- The stray-file test pollution observed in the customer-ops repro (a consumer issue).

## Open questions

none
