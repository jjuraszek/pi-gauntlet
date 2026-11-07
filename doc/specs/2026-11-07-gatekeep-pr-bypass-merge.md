# gatekeep-pr merges a BLOCKED PR on ruleset bypass authority

**Goal:** When GitHub reports the gate's viewer as a ruleset bypass actor, the ordinary `merge` row merges a `BLOCKED` PR and says so; every other merge precondition (CI evidence, binding pending checks, dispositions, comment delta, sync, policy flags) stays as it is.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Predecessor:** `doc/specs/2026-10-06-gatekeep-ruleset-aware-merge.md` - extended, not superseded: it left bypass actors out of scope and its "non-`BLOCKED` means not bound" observation covers `bypass_mode: exempt` only.

## Problem

`gatekeep-pr` withholds `merge` whenever `merge_state_status` is `BLOCKED` (`skills/gatekeep-pr/reference/post-selection-loop.md` `### Merge preconditions`; `reference/decision-menu.md` `## Withhold reason resolver`) and renders the obstacle template with "GitHub reports this actor's merge as blocked, so merge waits" (`reference/findings.md` `## Dispositions`, `reference/report.md`). A ruleset whose bypass list names the viewer (role, team, app, or deploy key, `bypass_mode: always`) keeps reporting `BLOCKED` to that viewer while GitHub would accept the merge, so a green, reviewed PR whose only unmet rule is one the viewer may skip never reaches the `merge` row. A consumer worked around this with a `## gatekeep-pr` override offering a `merge (admin)` row that runs `gh pr merge --squash --admin`; that override hardcodes squash and the `ADMIN` role, contradicts the skill's "merging around a `BLOCKED` merge state" red flag, and belongs in the skill.

Premises checked against primary sources:

- GraphQL `PullRequest.viewerCanMergeAsAdmin` is documented as "Indicates whether the viewer can bypass branch protections and merge the pull request immediately"; it is viewer-relative. `gh pr view --json` rejects the field (`Unknown JSON field`); it is reachable only through `gh api graphql`. Verified limits: one live read on a `bypass_mode: always` ruleset returned `mergeStateStatus: BLOCKED`, `viewerCanMergeAsAdmin: true`; the actor type behind that read is not recorded, and `bypass_mode: pull_request` was not observed. Whether the field is `true` for every non-admin ruleset bypass actor is open (`## Open questions`); the REST rules schema exposes the viewer's ruleset bypass separately as `current_user_can_bypass` (`always | pull_requests_only | never | exempt`).
- `gh pr merge --admin` only disables gh's client-side refusal on `BLOCKED`/`BEHIND` and skips a required merge queue (cli/cli `pkg/cmd/pr/merge/merge.go`); the `mergePullRequest` mutation carries no bypass field (`http.go`), so the server applies the ruleset's bypass list. `--admin` is mutually exclusive with `--auto`, which the gate never passes.
- Unverified: a successful merge by a `viewerCanMergeAsAdmin: true` viewer on a `BLOCKED` PR was not exercised (no live merge during brainstorm). The existing "report a `gh pr merge` refusal verbatim" rule is the backstop.
- Implicit dependencies: `gh` with API auth - found; eval replay loader and `eval/gatekeep-pr-merge-state` fixtures - found; `npm test` (`scripts/ci.mjs`, `scripts/gatekeep-comment-reconcile.test.mjs` pins the `BLOCKED` texts at lines 236-239, 516, 528, 530) - found, not executed.

Decisions recorded during the questionary: bypass is normal operation on the ordinary `merge` row, no separate row; the concept is "ruleset bypass eligibility", never "admin" - the GitHub field and gh flag appear only as the mechanism; bypass lifts only the `BLOCKED` precondition (cut question answered A; B "relax pending-check binding" and C "mirror GitHub, skip CI" declined); own PRs included (the gate's step-4 review is the review); no `## PR gate` key - the ruleset's bypass list is the policy. Approach 1 (viewer-relative bit in the digest) chosen over ruleset introspection and attempt-and-report.

Framing: kept

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] A viewer with `bypass_eligible: true` on a `BLOCKED` PR whose CI evidence is green on the assessed head and whose other merge preconditions hold sees the final template with the row `merge - <policy>-merge on ruleset bypass authority; CI evidence stands` and an `Evidence:` line carrying `merge_state_status BLOCKED (bypass eligible; reviewDecision <value>)`, and no "merge waits" PR-comments line.
  in-scope
- [ ] A viewer with `bypass_eligible: true` on a `BLOCKED` PR with a binding pending check sees no `merge` row, `Not offered: merge (<check> pending)`, and no bypass claim; a draft, below-`WRITE`, `CONFLICTING`, `BEHIND`, undispositioned failing check, or unreviewed comment delta withholds exactly as before bypass existed.
  in-scope
- [ ] A viewer with `bypass_eligible: false` or `unreadable` on a `BLOCKED` PR sees the obstacle template unchanged, with the "merge waits" line and `Not offered: merge (blocked by GitHub)`.
  in-scope
- [ ] A `merge` pick on the bypass path runs `gh pr merge --match-head-commit <assessed-sha> --<policy flag> --admin`; off the bypass path the command carries no `--admin`; a nonzero `gh pr merge` exit prints gh's error verbatim, consumes the selection with no retry, re-runs the pre-menu refresh, and renders the template the refreshed prerequisites select - final while the merge preconditions still hold, the obstacle template with `Not offered: merge (blocked by GitHub)` when `bypass_eligible` is no longer `true`.
  in-scope
- [ ] No rendered menu, report, or evidence line attributes the `BLOCKED` state to a named rule or describes the viewer as an admin; the only vocabulary is "ruleset bypass".
  in-scope
- [ ] `README.md` states that a viewer GitHub reports as a ruleset bypass actor merges a `BLOCKED` PR on the ordinary `merge` row with CI evidence still binding, and no longer says every other merge precondition withholds regardless of the viewer.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gatekeep-pr-bypass-merge
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test; node eval/run.mjs gatekeep-pr-merge-state <sample> for the samples named in Tests only
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: doc/configuration.md
Rules: eval/README.md
Rules: .pi/gauntlet-overrides.md
Rules: skills/forge-skill/SKILL.md
scope: none
design: skills/gatekeep-pr/ (SKILL.md, verification-brief.md, reference/post-selection-loop.md, reference/decision-menu.md, reference/menus.md, reference/findings.md, reference/report.md), eval/gatekeep-pr-merge-state/, eval/gatekeep-pr/ (two samples, intent.md), eval/gatekeep-pr-scope/intent.md, scripts/gatekeep-comment-reconcile.test.mjs, README.md, CHANGELOG.md

## Design

Minimal diff: every edit below is one field, one clause, or one flag on an existing path; no new row, template, setting, or helper. Skill edits follow `/skill:forge-skill` authoring rules (imperative voice, low conditionality, minimal diff); every `skills/gatekeep-pr/**/*.md` file stays under the instruction-size lint (50,000 bytes, 2,000 lines) - `verification-brief.md` (32 KB) and `post-selection-loop.md` (37 KB) are the largest and gain at most a few lines each.

**Data flow.** Section A's fixed GraphQL call (`verification-brief.md` `gh api graphql ... pullRequest(number:$n){ viewerCanUpdateBranch }`) gains `viewerCanMergeAsAdmin` in the same selection; the GitHub field name is cited there once, as the mechanism. The digest `permissions` block gains `bypass_eligible: true | false | unreadable` (null or an `errors` reply -> `unreadable`, the `viewer_permission` rule). The pre-menu refresh and compare-and-swap (`post-selection-loop.md` `### Pre-menu refresh`, `### Compare-and-swap`) run that GraphQL call beside their `gh pr view` read and replace `bypass_eligible` in the same tuple as `merge_state_status`. `### Compare-and-swap` gains its own clause: a re-read `bypass_eligible` that differs from the value the menu rendered invalidates a selected merge and re-enters Pre-menu refresh - the existing "merge-state change alone invalidates a selected merge" rule keys off `mergeStateStatus` and does not fire while `BLOCKED` is unchanged. Nothing reads rulesets, bypass actors, or team membership.

**Precondition.** `### Merge preconditions` `BLOCKED` row becomes: the pre-menu refresh succeeded (`### Pre-menu refresh`) and `merge_state_status` is not `BLOCKED`, `UNKNOWN`, or `unreadable` - or is `BLOCKED` while `bypass_eligible` is `true`, the **bypass path**; the freshness conjunct binds both branches. No other row changes; the bypass path never lifts a row GitHub's bypass would lift.

**Routing.** `### Exit check`'s `Undispositionable BLOCKED` row defines the term once: `merge_state_status` `BLOCKED` with `bypass_eligible` not `true`. The clauses that say "undispositionable BLOCKED" (`post-selection-loop.md` Next action "render obstacle for undispositionable BLOCKED even with course unset", `menus.md` state-map row and `## obstacle` course-unset paragraph, `SKILL.md` step 6) inherit that definition without edits. Eligible `BLOCKED` with a binding pending check is a pending-only withhold: initial template, `Not offered: merge (<check> pending)`, the D3 step-4 watch as today.

**Execution.** `### Merge course` appends `--admin` to `gh pr merge --match-head-commit <sha> --<policy flag>` only on the bypass path; `decision-menu.md` `## Verbs` `merge` line says the same (same command, `--admin` only on the bypass path). A nonzero `gh pr merge` exit is handled before the `MERGED`/queued post-merge read: print gh's error verbatim, consume the selection (no retry, no second attempt with or without `--admin`), re-run `### Pre-menu refresh`, and render the template the refreshed prerequisites select - final while the merge preconditions still hold, the obstacle template when `bypass_eligible` is no longer `true`. Merge queue: on a merge-queue repository the bypass path merges directly (gh's `--admin` skips the queue), so the `merge queued` template never fires on it; stated, not guarded. Batch mode: the child's queued final menu carries the bypass consequence; the parent reads `permissions.bypass_eligible` from the retained child record and applies the same bypass-only `--admin` predicate; a server refusal follows the same verbatim-error and refreshed-routing branch; no new handoff field and no batch compare-and-swap.

**Menu and report.** `decision-menu.md` `## Withhold reason resolver` `BLOCKED` row gains "and `bypass_eligible` is not `true`". `menus.md` `## final`: on the bypass path the `merge` row is `merge - <policy>-merge on ruleset bypass authority; CI evidence stands` (the one consequence string, shared with the first acceptance criterion), and the `Evidence:` line carries `merge_state_status BLOCKED (bypass eligible; reviewDecision <value>)` - the locator rides along, no rule is named. `findings.md` `## Dispositions`: only the obstacle instruction "With BLOCKED and no dispositionable local repair, render the obstacle template ... Render its PR-comments line ..." gains "and `bypass_eligible` is not `true`"; the binding-pending sentence "merge waits until it turns green, or `merge_state_status` leaves `BLOCKED`, or it converts to a failing check" and the brief's Section B binding classification stay byte-identical. `report.md`'s "merge waits" line renders only off the bypass path. SKILL.md red flag "Merging around ... a `BLOCKED`/`UNKNOWN`/`unreadable` merge state" becomes "... a `BLOCKED` merge state without bypass eligibility, or an `UNKNOWN`/`unreadable` one". `verification-brief.md`'s no-attribution rule stays; no rendered text explains which rules produced `BLOCKED`. The GitHub field and gh flag names appear only as mechanisms in skill text, never in rendered output. The `merged` settlement token, `own merge` template, `show evidence` record, and coverage block are unchanged.

**Pins and evals.** `scripts/gatekeep-comment-reconcile.test.mjs`: the Section A query pin (line 428) gains `viewerCanMergeAsAdmin`; the precondition pin (516) and the red-flag pin (528) take the new texts; the "merge waits" string pin (239) and the no-attribution red-flag pin (530) keep passing unchanged. Three new deterministic pins: `### Merge course` carries `--admin` only on the bypass path, `### Compare-and-swap` invalidates on a `bypass_eligible` change, and the nonzero-exit branch precedes the `MERGED`/queued read. `eval/gatekeep-pr-merge-state`: add `bypass_eligible` to the six existing sample digests (`unreadable` in `bound-viewer-green-ci`, `false` elsewhere; expectations unchanged), add the two samples named in Tests, extend `intent.md` and `README.md`'s sample count. `eval/gatekeep-pr`: add the two post-pick samples named in Tests through the replay's `## Entry` block (a rendered final menu, the human's `merge` pick, the compare-and-swap re-read and `gh pr merge` result given as digest facts; no tools, no live merge). `eval/gatekeep-pr/intent.md` and `eval/gatekeep-pr-scope/intent.md` both assemble the edited skill files: their `for:` hashes are updated mechanically, facts and records preserved, with no model run on their other samples.

**Docs.** README `## Architecture` gatekeep-pr sentence gains the bypass clause and drops "every other merge precondition still withhold" as unconditional; CHANGELOG `## Unreleased` entry. No `doc/configuration.md` change (no key).

**Paid or external actions for the whole flow:** `node eval/run.mjs gatekeep-pr-merge-state <sample>` for the three merge-state samples in Tests and `node eval/run.mjs gatekeep-pr <sample>` for the two post-pick samples in Tests, at most two runs each (initial, plus one after wording fixes) through the runner's model-cell pool; `npm test` is deterministic. No live `gh pr merge`, no tracker write, no other model call. The loop treats an action outside this clause as unreachable; adding one needs separate explicit authorization.

Remove: unconditional rendering of the "merge waits" PR-comments line under `BLOCKED` in `findings.md` and `report.md`.
Add: `viewerCanMergeAsAdmin` in the Section A query and the refresh/compare-and-swap re-reads; `permissions.bypass_eligible`; the bypass clause in `### Merge preconditions` (freshness conjunct kept), the `Undispositionable BLOCKED` definition in `### Exit check`, the eligibility clause in `### Compare-and-swap`, `### Merge course` (`--admin`, nonzero-exit branch) and the `## Verbs` `merge` line, the withhold resolver, `menus.md` final consequence and `Evidence:` token, `findings.md` `## Dispositions` obstacle instruction, the SKILL.md red flag; updated and new test pins; two merge-state samples plus the field on six, two gatekeep-pr post-pick samples, three intent files; README and CHANGELOG lines.

## Errors and edge cases

- `bypass_eligible: unreadable` (null field, GraphQL `errors`, failed refresh) fails closed: `BLOCKED` withholds as today and the obstacle render is unchanged; the value sits only in the digest `permissions` block.
- `BLOCKED` + eligible + binding pending check: initial template with the check as the withhold (`Not offered: merge (<check> pending)`); the D3 step-4 watch admits as today.
- Eligibility flips between the rendered menu and the pick: the compare-and-swap re-read's `bypass_eligible` differs from the rendered value, so the selected merge is invalidated and Pre-menu refresh re-entered by the new eligibility clause (the merge-state rule does not fire while `BLOCKED` is unchanged); no `gh pr merge` runs.
- Server refusal (bypass narrower than the blocking rule, ruleset edited mid-run): gh's error verbatim, selection consumed, no retry, pre-menu refresh, template from the fresh prerequisites (final while still ready, obstacle when eligibility is gone), no `stuck`.
- A draft, below-`WRITE` viewer, disabled policy flag, `CONFLICTING`, or `BEHIND` with `bypass_eligible: true`: unchanged withhold; `BEHIND` runs `### Loop sync` under delivery as today.
- The gate still never approves a PR; on an own PR the step-4 review is the review.

## Tests

- eligible `MAINTAIN` viewer, own PR, `BLOCKED`, green CI -> final, `merge - <policy>-merge on ruleset bypass authority; CI evidence stands` recommended, `Evidence: ... BLOCKED (bypass eligible; reviewDecision <value>)`, no "merge waits" line, no rule named, no "admin" - `eval/gatekeep-pr-merge-state/samples/bypass-eligible-green-ci`
- eligible viewer, `BLOCKED`, binding pending check -> initial template, no `merge` row, `Not offered: merge (<check> pending)`, no bypass claim - `eval/gatekeep-pr-merge-state/samples/bypass-eligible-check-pending`
- `bypass_eligible: unreadable` fails closed -> obstacle unchanged - `eval/gatekeep-pr-merge-state/samples/bound-viewer-green-ci` (field added)
- Section A query, precondition, and red-flag texts; `--admin` only on the bypass path; eligibility invalidation; nonzero-exit branch order - `scripts/gatekeep-comment-reconcile.test.mjs` (updated and new pins, deterministic); the "merge waits" and no-attribution pins keep passing
- `merge` pick on the bypass path, compare-and-swap re-read unchanged, mocked `gh pr merge` nonzero exit with stderr -> the narrated command is `gh pr merge --match-head-commit <assessed-sha> --<policy flag> --admin` with the policy flag the digest resolves, the stderr is printed verbatim, no second `gh pr merge`, pre-menu refresh runs, final re-rendered - `eval/gatekeep-pr/samples/bypass-merge-pick-refused` (`## Entry` block; stops at the re-rendered menu)
- `merge` pick on the bypass path, compare-and-swap re-read returns `bypass_eligible: false` with `BLOCKED` unchanged -> no `gh pr merge`, obstacle template, `Not offered: merge (blocked by GitHub)` - `eval/gatekeep-pr/samples/bypass-merge-pick-revoked` (`## Entry` block; stops at the re-rendered menu)
- merge-queue skip - none: stated, not guarded; the conformance check binds the clause to Design
- README clause - none: conformance check

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` `## Architecture` gatekeep-pr sentence (security, data-access and permissions: who may merge a `BLOCKED` PR, with CI evidence still binding); `CHANGELOG.md` `## Unreleased`
- Derived / memory docs invalidated: `README.md` clause "an unknown merge state, and every other merge precondition still withhold" (wrong for a bypass-eligible viewer); `eval/gatekeep-pr-merge-state/README.md` sample count and `intent.md`

## Out of scope

- Reading rulesets, bypass actors, or team membership; attributing `BLOCKED` to a named rule (predecessor pins).
- Relaxing pending-check binding or any CI precondition under bypass (cut question options B and C).
- A `## PR gate` key, a separate `merge (admin)` row, or any "admin" vocabulary.
- Editing the consumer override that offers `merge (admin)`: outside this repo. The finish summary (the `gauntlet: done` message) shows what to alter there: delete the `## gatekeep-pr` override block that adds the `merge (admin)` row and keep its `merge policy` entry. The block is quoted from the user-supplied anonymized override text when given, otherwise described by its heading; no consumer text is invented and no consumer repo is named.

## Open questions

- Does `viewerCanMergeAsAdmin` read `true` for a non-admin ruleset bypass actor (team, app, deploy key, non-admin role) in `bypass_mode: always` and `bypass_mode: pull_request`? Probe: `rg -n --max-count 5 "viewerCanMergeAsAdmin|current_user_can_bypass|bypass_mode"` across the worktree, `doc/`, `scripts/`, `eval/`, `skills/` - not found: the field appears only in this spec; the predecessor records a `bypass_mode: exempt` observation only. Obtain-hint: one read-only `gh api graphql` read of `mergeStateStatus` and `viewerCanMergeAsAdmin` on a `BLOCKED` PR, as a viewer whose only bypass is a non-admin ruleset actor, once per mode. Settles: the `bypass_eligible` source field in Data flow, the Section A query pin, the `bypass-eligible-*` sample digests, the Problem premise. Settlement: the user supplies the observation at the gate, or the first plan task that adds the field performs that read-only read and settles it through brainstorming's amendment path; a `false` reading revises the signal source without actor-list parsing.
- A required commit status that only turns green on approval (never a CI job) would still bind under bypass; no consumer observed today has that shape. Revisit if one appears.
- The merge mutation's success for a bypass-eligible viewer on a `BLOCKED` PR is unverified until the first live merge; the verbatim-refusal rule covers failure.
