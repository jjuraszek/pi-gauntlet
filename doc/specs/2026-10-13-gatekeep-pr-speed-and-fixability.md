# gatekeep-pr: one CI watch, fix-applied description corrections, smallest-edit payloads

> **Superseded by:** [doc/specs/2026-10-25-gatekeep-pr-persistent-disposition.md](./2026-10-25-gatekeep-pr-persistent-disposition.md) - D1 (the "Blockers empty" watch guard, the single end-of-step watch, the "menu omits fix at maxFixRounds" rule) and D5/D6 (per-proposal exact-text selection, the 30 s poll loop as the only wait)

**Goal:** Cut gatekeep-pr's per-run time and its unfixable-blocker loops by replacing the inline CI poll with one bounded `gh pr checks --watch` call at the last step before merge, applying PR-description corrections on `fix` like any payload, and bounding every payload to the smallest in-repo edit.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.

Amends `doc/specs/2026-10-11-gh-62-gatekeep-decision-grants.md` (description repair consent and `### Wait course`), `doc/specs/2026-10-08-gatekeep-blocker-only-fix-loop.md` (post-push evidence), and `doc/specs/2026-10-02-gh-57-gatekeep-pr-production-gate.md` (CI polling). The round shape (implementers, one reviewer per round, push) is unchanged.

## Problem

Session logs for 84 gatekeep-pr runs in October 2026, split by the skill version each run loaded, show three regressions against September (median time-to-first-report 8.8 min, n=50):

| Version | Runs | Median first report | Median minutes inside CI-poll commands | Median subagent dispatches per run | Reports ending with only PR-body blockers |
|---|---|---|---|---|---|
| v7.0-7.6 | 55 | 20.3 min | 1.6 | 18 | 5 of 176 |
| v7.7-7.8 | 23 | 28.0 min | 23.0 | 8 | 11 of 65 |
| v7.10 | 6 | 28.1 min | 3.6 | 12 | 4 of 18 |

The attribution is partial: poll minutes explain the v7.7-7.8 jump, not the v7.0 step from 8.8 to 20 min, which coincides with Verify and Review becoming fresh helpers plus a reviewer per round (gh-57) and is kept by decision (D4). The pre/post measurement in Tests sets the bar for whether these cuts are enough.

Three causes, each with an owning rule:

1. **Inline CI poll.** `post-selection-loop.md` `### Wait course` polls `gh pr view` and `gh run list` every 30 s inside the 15-minute `timeout minutes` window, one LLM turn per iteration; `fix-wave.md` `## Evidence after push` repeats it after every wave push, so a three-round run can poll three times before anything is mergeable. A `monitor` helper observed in two runs exists nowhere in the skill text (ad hoc behavior from the poll's cost).
2. **Description corrections need their own consent.** `findings.md` `## Drafted payloads` requires "exact-text selection, even under a broad fix grant" and "renewed selection" on any head or body change, so a `fix` pick leaves `contradicted` claim blockers open and the report re-renders them until the user types the selection; one run rendered the same body-only blockers in four consecutive reports.
3. **No payload-shape rule.** The only "minimal" wording is the Review rubric's row judging the PR; nothing bounds the drafted fix, so a test failing on an image missing from a pull-through cache received an infrastructure-plus-new-service payload instead of an image pin.

Framing: kept. The three symptoms share one root (per-round cost of the fix loop), so this is one spec. `brainstorm` is not a gatekeep-pr menu row; "never route to brainstorm" below means: draft a payload, do not park the finding.

## Acceptance criteria

none - no ticket

## Design

Behavior edits are inside `skills/gatekeep-pr/`; the static oracle `scripts/gatekeep-comment-reconcile.test.mjs`, `eval/gatekeep-pr/`, README, and CHANGELOG change to match. No settings key, helper role, continuation-record field, or eval harness is added. `timeout minutes` (overrides-file `## PR gate`, default 15), `closureReview.maxFixRounds`, and the per-round reviewer stay as they are. Net word count of `skills/gatekeep-pr/` goes down. Edits follow `/skill:forge-skill` authoring rules: imperative voice, branches only on observable runtime facts, minimal diff.

### D1. One CI watch, at the last step

The watch is a wait, not a gate. It runs at the pre-menu refresh (`post-selection-loop.md` `### Pre-menu refresh`) when all of: this is not the first report; Blockers are empty (open nits do not count); a binding check (Section B's existing classification) is pending. It also runs on a `wait` pick. The call itself waits on every check `gh` reports. One bash call, bounded by the remaining `repair.poll_deadline` (set from `timeout minutes` at the first watch of a window; a `wait` pick starts a new window for a check still running, after the expiry step classifies stale placeholders), using the existing bound ladder in `verification-brief.md` Section B Safety contract (harness bash timeout, else `timeout`/`gtimeout`, else background-and-kill), never unbounded:

```bash
gh pr checks <N> -R <base-owner>/<base-repo> --watch
```

After the call returns, for any reason, re-run the step-1 forge reads once (the existing `### Pre-menu refresh`) and apply the existing Section B Evidence resolution table and `findings.md` `## Dispositions` to the refreshed digest: the resolved check set, the inert reviewer check, cancelled and skipped conclusions, and `mergeStateStatus` all keep their current meaning. Three results follow from that table, nothing new:

| Refreshed evidence | Action |
|---|---|
| CI-sufficient | run the Section B claim-check-only helper (already named in `fix-wave.md` `## Evidence after push`) for CI-dependent claims only, recompute merge preconditions, render the menu |
| a failing check in the resolved set | one `P#` per failing check, its failing line read with `gh run view <id> -R <repo> --log-failed`; step 5 drafts a payload for it (D3); the `P#` closes on the reviewer's `resolved` line like any blocker, and the next watch re-mints it when the check still fails |
| still pending (deadline reached) | render the menu with `wait` as row 1 |

Deleted: the 30 s loop body and its per-run `gh run view` iteration in `### Wait course`; the post-push poll in `## Evidence after push`; the first-pass poll in `verification-brief.md` Section B; the sentence "An undispositioned failing check is never a target of `fix`; close it by disposition" in `findings.md` `## Dispositions` and the matching "no drafted edit -> not fixable" clauses in `findings.md` `## Drafted payloads` and `post-selection-loop.md` `### Fix wave`; `sync.md`'s "first pass is the single poll window" sentence. The `ci-infrastructure-broken` disposition stays as the human's way to waive a check no in-repo edit can turn green.

Evidence rows without the window: `Pending` applies to the first report whenever a resolved check is pending (no wait, `wait` recommended); `Fallback` (local run) fires on the first pass when the resolved check set is empty or entirely inert, and otherwise stays off.

Round order is unchanged: implementers with scoped tests (`SCOPED_TEST_COMMANDS`) -> one reviewer over `<pushed_head>..HEAD` -> push -> step 5 -> watch when the guard above holds. The `repair.wave.stage` value `poll` is deleted with the post-push poll (a value removed, no field added). After a wave push the evidence block lists every failing and every pending binding check on the pushed head. A wave push performs no poll; the one `gh pr view` and `gh run list` read of the pre-menu refresh is a read, not a poll. The watch and a `P#` it mints do not count as a round; the round that repairs it counts, as today.

Other wait reasons keep their owners: an `action_required` run renders `approve workflow run` before any watch (the pick then re-enters the refresh); stale reviewer placeholders, comment reconciliation, and merge-state blocks follow the retained `### Re-render` steps.

First pass with pending CI: Verify dispositions every claim it can check from source now and records CI-dependent claims `pending`; no local full command runs; the claim-check-only helper after a green watch covers only the `pending` ones (one dispatch point).

`SKILL.md` red flag "A local verification run while a binding check is pending, or a second push inside one round" becomes "A CI wait while a blocker is open or before the first report, or a second push inside one round" - owner `post-selection-loop.md` `### Pre-menu refresh`.

Retained-grant row "continue bounded Wait" in `### Next action` names the single call.

### D2. Description corrections apply on `fix`

A `contradicted` claim stays a blocker. Its payload is `target: description` with exact old/new text, printed under the blocker in the report (the compact old-to-new form already defined). A `fix` pick or a validated retained fix grant applies it in the same round as the file payloads, through the retained apply step of `### Description repair`: regenerate the replacement from the body read at apply time (never overwrite a body that changed since the proposal - re-propose from the current body instead), write with `gh pr edit`, read back, treat a mismatch as a write failure, then run the affected-only recheck against the current head. What goes is the human selection only. Deleted: in `findings.md` `## Drafted payloads` the sentences "Every new description proposal requires exact-text selection, even under a broad fix grant. Any changed head/body snapshot requires renewed selection, not just a material change." and "decline writes nothing"; in `decision-menu.md` the `fix` row's "and require its selection per `findings.md`"; in `report.md` the "before selection at the rendered consent menu, including a new payload under a held fix grant" clause (the preview stays, under the blocker); in `post-selection-loop.md` `### Next action` and `### Continuation record` every clause that excludes description targets from a retained fix grant. The scope-narrowing contract-decision menu is untouched (a narrowing is a contract change, not a correction).

### D3. Payload shape

One sentence added to `findings.md` `## Drafted payloads`, quoted verbatim in the implementer task of `fix-wave.md` `## Wave`:

> A payload is the smallest in-repo edit that turns the finding green and keeps the behavior the PR promises; it never adds infrastructure, a dependency, or a new module. A failure caused outside the repo (image pull, toolchain, credentials, external service) gets the smallest in-repo workaround with its reason in one sentence; a skip never removes a test an AC row relies on.

Step 5 drafts a payload for every blocker. The one remaining open path: a finding whose smallest fix needs another repo, infrastructure, or a credential; the implementer returns `open - needs <what>` and the finding stays open with that sentence (the existing obstacle handling), never a menu detour.

### D4. Review cadence

Unchanged: one reviewer per round over `<pushed_head>..HEAD` is the only closer of findings; no review after an own push; no final-only variant. Recorded because the brainstorm considered and rejected both "drop the pre-push review" and "final review only" (the implementer's closure is not trusted evidence).

### Data flow after the change

gather -> provision -> verify (CI-dependent claims `pending`) -> review -> first report, no wait -> menu -> `fix` -> N implementers with scoped tests -> one reviewer -> push -> refresh -> Blockers empty -> one watch call -> refresh and resolve evidence -> claim check for `pending` claims -> merge menu (or `P#` -> `fix` -> ... -> watch again).

## Errors and edge cases

- The watch's exit code is not read; the refreshed digest decides (a failed, cancelled, skipped, or still-pending check means what the Evidence table already says). A failed `gh` read is a failed refresh under the existing `### Re-render` rule.
- Empty or all-inert resolved check set on the first pass: `Fallback` local run, as before the poll existed.
- Held workflow run needing approval: `approve workflow run` is a menu row; no watch before that pick.
- Clean first pass with CI pending: report renders at once with `wait` as row 1; no silent wait.
- A declined nit does not block the watch; only Blockers do.
- Head moved during the watch: the refresh sees the new head and the loop re-enters step 3, as today.
- Description payload and a body that changed since the proposal: re-propose from the current body, no write.
- Deadline reached: `wait` row 1; a `wait` pick first applies the expiry step (a completed-success reviewer placeholder becomes `reviewer failed (stale placeholder)` and gets no new window) and starts a new `timeout minutes` window only for a check still running; no unbounded call on any path.
- At `maxFixRounds` the menu omits `fix` as today; a `P#` minted by the watch does not consume a round.

## Tests

`eval/gatekeep-pr/` gains five samples; `intent.md` names each with its must-hold facts; `node eval/run.mjs gatekeep-pr` runs them and the committed `report.md` carries the result.

| Sample | Case | Must hold |
|---|---|---|
| `wave-push-no-poll` | blockers still open after a wave push | no `gh pr checks --watch`; at most one `gh pr view` and one `gh run list` read between the push and the next report |
| `final-watch-red` | Blockers empty, one nit open, one check pending, it fails | exactly one `gh pr checks --watch` call; one `P#` with the failing line from `--log-failed`; a drafted payload; fix menu rendered; no round consumed by the watch |
| `first-report-pending-ci` | clean PR, CI pending on the first pass | report renders with no watch call; `wait` is row 1 |
| `description-fix-same-round` | one `contradicted` claim plus a file blocker, user picks `fix` | `gh pr edit` and the file payload land in the same round; no second selection asked; readback runs |
| `env-failure-smallest-edit` | test red because an image is missing from a pull-through cache | payload is one in-repo line (image pin or skip with reason on a test no AC row relies on); no infrastructure, dependency, or new module file |

Updated facts in `eval/gatekeep-pr/intent.md` and the samples' `expected.md`: `consent-poll-timeout` f5 (expiry comes from one bounded call; obstacle and `wait` row 1 unchanged), `consent-wait-needs-grant` f6 (a resumed entry with no blocker and a pending binding check runs the bounded watch pick-free; `wait` is a pick only after expiry), `continued-conflict-fix-loop` f4 (no poll inside the loop), and the nine description-consent facts that encode the deleted selection - `pr-body-false-claim` f1/f2, `pr-body-new-claim-held-grant` f1/f2, `pr-body-false-claim-missing-test` f4, `pr-body-unverifiable-completion` f4, `pr-body-concurrent-change` f1, `pr-body-head-change` f2, `pr-body-own-push-stale-proposal` f4 - rewritten so the retained grant applies the correction and the concurrent-body and stale-head cases re-propose without writing. Static oracle `scripts/gatekeep-comment-reconcile.test.mjs` pins the deleted sentences (its exact-selection, Wait-course poll, and red-flag assertions) and is updated in the same change; the full suite is green at the base and at the landed commit (intermediate TDD commits may be red).

Pre/post measurement (user condition). The scan scripts from the triage (`/tmp/gk-triage/scan.mjs`, `split.mjs`, `where.mjs`) are committed as `eval/gatekeep-pr/scan/` (outside the tarball; the full suite does not run them), anonymized: the sessions root comes from `PI_SESSIONS_DIR` (default `~/.pi/agent/sessions`), repo names are taken from the session directory basename with no hardcoded prefix, and no private repo name appears in the scripts. Inputs: pi session logs under `~/.pi/agent/sessions/`, a run = one user-invoked `/skill:gatekeep-pr` turn; skill version attributed by the skill text the run loaded; metrics = time from invocation to the first rendered report, subagent dispatches, minutes inside `gh` bash calls, reports whose Blockers are all `target: description`. Protocol: three open PRs (one per repo in the logs), each gated twice on the same head and body with CI already finished, v7.10.0 first then the branch (`pi install -l`), picks scripted as `stop` at the first menu for the first-report metric and one `fix` for the body-blocker metric. Bar: branch median time-to-first-report at or under 15 min and zero body-only reports keeps the change; above 15 min triggers the approach-2 item in Out of scope. Anonymized rows go in the PR body.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` `## PR gate` overrides example - the `timeout minutes` comment says it bounds each `gh pr checks --watch` window (operations / tunable parameters); `CHANGELOG.md` - `## Unreleased` entry (deferred: release)
- Derived / memory docs invalidated: supersession banners on `doc/specs/2026-10-11-gh-62-gatekeep-decision-grants.md` (D5/D6 per-proposal selection, `### Wait course` loop), `doc/specs/2026-10-08-gatekeep-blocker-only-fix-loop.md` (post-push poll), `doc/specs/2026-10-02-gh-57-gatekeep-pr-production-gate.md` (D4 poll, first-pass poll)

Materiality bar per `reference/documentation-impact.md`.

## Out of scope

- Rewriting `post-selection-loop.md`, `fix-wave.md`, and `decision-menu.md` into one file (approach 2); reconsidered only if a plain PR still exceeds ~15 min median to first report after this change.
- A flow-engine bin: dispatch, `plan_tracker`, and consent are model tool calls on both harnesses, so a script could own only the watch, which `gh pr checks --watch` already is.
- Binding-pending classification for external CheckRun apps (`verification-brief.md` Section B); the watch waits on every check `gh` reports.
- The `--rebase` sync path and its own review.
- Session-log telemetry gaps (`durationMs: 0` on early assistant turns).

## Open questions

none
