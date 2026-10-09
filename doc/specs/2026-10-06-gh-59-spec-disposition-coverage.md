# Spec dispositions govern the PR gate and the conformance handoff

> **Superseded by:** [doc/specs/2026-10-09-ac-coverage-dispositions.md](./2026-10-09-ac-coverage-dispositions.md) - the cross-repo `deferred: <ref>` authoring clause and the ask-when-observable rule in `ticket-acceptance.md` only

**Goal:** The approved spec is the pre-merge scope contract: `/skill:gatekeep-pr` honors its `deferred: <ref>` and `deviates: <why>` rows as settled, falls back to the PR description when no spec applies, and uses the ticket only as the cross-check source its rows were copied from; the ship-time conformance handoff carries settled rows as one informational line; two post-merge menu rows post the rendered `AC coverage` text only on an explicit pick; `/skill:check-delivery` is untouched.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Ticket:** jjuraszek/pi-gauntlet#59
**Supersedes:** `doc/specs/2026-10-01-gatekeep-pr-capability-gate-compact-report.md`, D2 ticket-AC scope and impossible-AC lifecycle, D3 scope creep source, D4/D6 `Delivers` and menu rows that derive from them; `doc/specs/2026-10-02-gh-57-gatekeep-pr-production-gate.md`, D8 tracker-only split rule. Both specs stay live for every clause not named here.
**Amends:** `doc/specs/2026-09-20-gh-41-ticket-acs-carried-into-spec.md` - the operates-without-it deferral test and the conformance reporting of recorded drift (no banner: that spec's design stays in force, two clauses are narrowed below).

## Problem

Framing: kept (ticket #59). The ticket records the decisions; this spec designs them.

The gauntlet already carries a ticket's acceptance criteria into the spec verbatim, one disposition per row, approved by the human at the spec gate (`skills/brainstorming/reference/ticket-acceptance.md`). Downstream, that decision is ignored twice:

1. `/skill:gatekeep-pr` re-fetches the live ticket in step 2, hands its rows to the reviewer as judging context (`skills/gatekeep-pr/verification-brief.md` Section C) and to step 5, where `skills/gatekeep-pr/reference/findings.md` "Whole or part" says "Only the tracker waives an obligation: a spec `deferred: <where>` ... is a lead to check the tracker, never a waiver". A row the human already deferred in the approved spec becomes a `gap` blocker, and the only exits are a tracker edit or the `impossible` ticket-change lifecycle. The ticket, written before design, outranks the design the human approved.
2. At ship time, `agents/conformance-reviewer.md` already yields no requirement row for `deferred:`/`deviates:` rows and reports them under Origin drift, but neither the durable `## Closure / conformance` block (`skills/verification-before-completion/reference/conformance-check.md`) nor `skills/finishing-a-development-branch/SKILL.md` Step 3.5 carries them, so the operator sees nothing that says those rows were settled on purpose. #59 reports a run where such rows surfaced as decision items; whether the dispositions were present in that run is not verifiable from its description, so this spec adds the missing handoff line and does not claim to fix a reproduced reviewer defect.

Human decisions recorded during the questionary (verbatim replies in the commit history of this file):

- The spec at the assessed head is the document of human will. A deferral or deviation recorded in the gauntlet flow is honored without a second approval record. The ticket is input to the spec and the contract only at `/skill:check-delivery`.
- With no applicable spec, the PR gate judges the PR's stated intent. Code quality (`REVIEW.md` over `review-baseline.md`), claim checks, verification evidence, CI dispositions, and merge preconditions stay independent of scope.
- The ticket is read at the gate to cross-check the spec's verbatim rows and resolve references; it never adds a requirement.
- The change is minimal and follows `/skill:forge-skill`.

## Acceptance criteria

Ticket jjuraszek/pi-gauntlet#59, "Acceptance criteria", rows verbatim:

- [ ] Given a PR whose spec at the assessed head marks rows 3 and 5 `deferred: <ticket or spec ref>` and rows 1, 2, 4 `in-scope` with mechanism present, `/skill:gatekeep-pr` renders `Delivers: ACs 1, 2, 4; 3, 5 deferred per spec to <ref>`, lists zero `gap` blockers for rows 3 and 5, and offers `merge`.
  in-scope
- [ ] Given a PR whose spec marks row 2 `deviates: <why>` and the deviating mechanism is present, the gate renders `2 deviates per spec: <why>`, lists zero blockers for row 2, and offers `merge`.
  in-scope
- [ ] Given a PR whose spec marks row 3 `deferred:` with no reference, the gate judges row 3 `gap` and withholds `merge`.
  in-scope
- [ ] Given a spec marking rows 3 and 5 `deferred: <ref>` and row 2 `deviates: <why>`, the ship-time conformance report renders zero decision items for rows 2, 3, and 5 and lists them under one `Deferred/deviates per spec` line.
  in-scope
- [ ] Given a spec whose `deferred: <ref>` names a slice this PR depends on (directional dependency), the gate still offers `merge` and the ship menu still appears; `/skill:check-delivery` on the ticket stops with a per-row gap for the undelivered rows.
  in-scope - `/skill:check-delivery` is unchanged; the row is satisfied by its existing Stage 3 `unexplained gap` verdict on a row with no sanctioned explanation, exercised by the eval sample `directional-dependency` (D7).
- [ ] After `merge` in `/skill:gatekeep-pr`, the menu offers `post coverage to ticket` and `post coverage to PR`; picking one posts the `AC coverage` text as a comment on the source ticket or on the PR respectively; with no pick, nothing is posted.
  in-scope
- [ ] `skills/brainstorming/reference/ticket-acceptance.md` states that a row another repo or workflow delivers is `deferred: <that ticket or spec ref>`.
  in-scope
- [ ] `skills/gatekeep-pr/reference/findings.md` no longer states that only the tracker waives an obligation; the replacement rule names the spec disposition and the no-reference `gap` case.
  in-scope
- [ ] `eval/gatekeep-pr/` holds samples `deferred-with-ref`, `deferred-without-ref`, `deviates`, and `mixed-coverage` with `expected.md` facts for the `Delivers` line, the blocker count, and the offered menu rows; `eval/conformance-check/` holds samples `deferred-with-ref` and `deviates` with facts for the decision-item count and the `Deferred/deviates per spec` line.
  deviates: `eval/README.md` "Adding a target" requires at least five samples per new target; both targets are new, so each ships the named samples plus the extra samples D8 lists. The named samples and facts ship exactly as written. Location only: the target lives at `eval/gatekeep-pr-scope/`, because `main` took `eval/gatekeep-pr/` for the #58 rebase-sync narration eval while this change was in flight (the sibling `eval/gatekeep-pr-merge-state/` follows the same naming).

## Design

### D1 - Scope contract selection (gatekeep-pr step 2)

`skills/gatekeep-pr/reference/assessment.md` gains one paragraph after "Fetch the ticket", "Select the scope contract", and the digest gains one field:

```text
- scope: { source: spec | pr, path, rows[ { n, text, disposition, ref } ], design: <the spec's ## Design section text>, cross_check: matched | differs: <rows> | not run: <reason> }
```

Spec dirs: `gauntlet_setting({ key: "flowGuards" })` -> `specDirs`; on a harness without that tool, `doc/specs` and `docs/specs` (the resolver default). Selection, first match wins, every candidate read from the assessed head with `git -C <worktree> show <headRefOid>:<path>`:

1. A spec-dir path named in the PR body -> that file; absent at the head -> one blocker ("the PR names a spec that is not at its head").
2. Else the spec-dir file the diff adds.
3. Else a spec-dir file the diff modifies on lines other than `> **Superseded by:**` banner lines (a predecessor banner edit is not a candidate).
4. Two or more candidates after 2-3 -> STOP and ask which one, never guess. None -> `source: pr`, `rows` empty, `design` empty, the PR title and body as the stated intent.

`rows` are the `## Acceptance criteria` rows verbatim with their disposition token; a section whose body is a `none - <reason>` line gives empty `rows`. `ref` is the text after `deferred:` when it contains a tracker ref (`#N`, `owner/repo#N`, `[A-Z][A-Z0-9]+-\d+`), a repo-relative path under a spec dir, or an `http(s)://` URL; otherwise `ref` is empty - a prose destination (`deferred: follow-up ticket "..."`) is empty. `design` is the whole `## Design` section: the spec's own requirements, the chosen readings of ambiguous rows, and the clauses a `deviates:` reason adopts all live there (`ticket-acceptance.md`), so the judged contract is `rows` plus `design`, never `rows` alone.

The ticket fetch stays as it is, minus the author-bearing comment re-fetch and `author: unreadable` recording that served only the deleted split rule (D3). Its one remaining use at the gate is the cross-check, run when `source: spec` and `rows` is non-empty: `issue.acceptance_criteria[]` compared to `rows[].text`; equal -> `matched`; a differing or missing ticket row -> `differs: <row numbers>`; `issue: null` -> `not run: <issue_note>`. The cross-check is informational: it renders one `show evidence` line (`cross-check: differs on rows 2, 4 - the spec governs here; /skill:check-delivery judges the ticket`) and never a blocker, so a ticket edit after approval adds no pre-merge obligation. The gate never judges a ticket row the spec does not carry.

Freshness: every head move re-runs this selection before step 3 or step 4 runs (an external push re-enters step 3, an own push re-enters step 4 - `post-selection-loop.md`), so a spec amended on the new head is the contract for that head and a stale `deferred:` never authorizes a newer diff.

### D2 - Reviewer context (verification-brief Section C)

The sentence "the Reviewer's judging context still narrows to the ticket's actual acceptance criteria when one is linked, and to the PR's stated intent alone when none is" becomes: the judging context is the digest's `scope` block - the spec's `in-scope` and `venue:` rows plus its `design` when `source: spec`, the PR's stated intent when `source: pr`; a `source: spec` with empty `rows` is judged on `design` plus the stated intent. The Inputs list replaces "The ticket's AC rows from step 2, or `issue: null`" with "The digest's `scope` block". Nothing else in the brief changes; `REVIEW.md` over `review-baseline.md`, claim checks, and the evidence table are untouched.

### D3 - AC outcomes (findings.md)

Replace the AC-row source and the waiver rule; keep the mechanism/observation split, `covered`/`gap`/`not judged here`, the one-defect-one-blocker rule, dispositions, and payloads.

| Row disposition | Outcome | Renders as | Blocks |
|---|---|---|---|
| `in-scope` | `covered` / `gap` / `not judged here` as today | as today | `gap` blocks |
| `venue: <env> - <observation>` | mechanism half judged as today; observation half `not judged here` | as today | mechanism `gap` blocks |
| `deferred: <ref>` (non-empty `ref`) | `deferred per spec` | one `Delivers` clause `<n> deferred per spec to <ref>` | no |
| `deferred:` (empty `ref`) | `gap` | one `Blockers` item naming the missing reference | yes |
| `deviates: <why>` | `deviates per spec`; the Design clauses the `<why>` text names or quotes are judged for mechanism like an `in-scope` row; a `<why>` that names none adds nothing - the `design` section is judged as a whole in every case, so no mechanism is exempted | one `Delivers` clause `<n> deviates per spec: <why>`; a missing adopted clause is one `Blockers` item | only an adopted clause's `gap` blocks |

The `design` section is always part of the judged contract: a Design requirement with no mechanism in the diff is a `gap` blocker whether or not an AC row points at it.

The "Whole or part" paragraph becomes the `Delivers` grammar (D4): with `source: spec`, `Delivers` lists the covered rows, then the settled rows, then the observation halves; any other uncovered row is `gap`. The tracker split, human-authored-comment, cross-repo-PR, and author-unreadable rules are deleted. With `source: pr`, or `source: spec` with empty `rows`, "No ticket" applies as today (stated intent plus `design`, no AC rows).

The `impossible` outcome, its four conditions, the Impossible-AC lifecycle, and the `Ticket changes` section are deleted: their `resolved` state is a ticket-body edit that lifts a pre-merge withhold, which makes the ticket the contract here; an `in-scope` row the repository cannot satisfy is corrected in the spec (`deviates: <why>` through `brainstorming` "Amending an approved spec"), and the ticket is corrected for `/skill:check-delivery` by `/skill:shape-ticket`, outside this gate.

The Namespaces sentence "Behavior the ticket promises is a blocker or an explicit tracker split" becomes "Behavior the spec keeps in scope is a blocker until its mechanism ships; a row the spec defers or deviates is settled". Scope creep is diff content traceable to no `in-scope` row, no `design` clause, and no stated intent.

### D4 - Report, menu, loop

`report.md`: the `Delivers` second sentence with `source: spec` is built from these clauses in order, each present only when it applies, `;`-joined: covered rows `ACs <n>, <n>, <n>` (`ACs 1-5` when every row is covered, `no ACs` when none); deferred rows grouped by `ref`, `<n>, <n> deferred per spec to <ref>` (one clause per distinct `ref`, in row order); deviating rows `<n> deviates per spec: <why>`; observation halves `<n>'s observable half (<what>) is checked after merge, not here`. AC1's fixture renders `Delivers: <intent>. ACs 1, 2, 4; 3, 5 deferred per spec to <ref>.` The `The PR covers the whole <ref>` / `covers AC1-2 of <ref>` / split clauses and the `Ticket changes` section with its worked-example lines are removed. `SKILL.md` Red flags: the "Deferring behavior the ticket promises" line becomes "Judging a ticket row the spec does not carry, or treating a spec `deferred: <ref>` row as a gap - owner: `reference/findings.md` `## AC outcomes`"; the parenthetical "(a merged or closed PR offers `show evidence` and `stop` only)" becomes "(a PR already merged or closed at step 1 offers `show evidence` and `stop` only)".

`decision-menu.md`: `propose ticket change`, `merge anyway - accept AC<n> as impossible`, and the `impossible AC` overlay are removed from Verbs, Availability, Consent table, Overlays, and Fixtures (Fixture 2 drops its `Ticket changes` block and the two `Not offered` clauses). Two verbs are added: `post coverage to ticket` - post the rendered `AC coverage` block as a comment on the source ticket via the resolved tracker verb (`gh issue comment`, the overrides mapping, or `/skill:linear`); `post coverage to PR` - post the same block with `gh pr comment`. A new overlay row `own merge`, placed above the `merged or closed PR` row (the higher row wins): trigger - this run's `merge` pick ran and the post-merge read below returned `state: MERGED`; effect - the menu is `post coverage to ticket` (when `issue` is non-null and `rows` is non-empty), `post coverage to PR`, `show evidence`, `stop`, with `stop` `[recommended]`; each post row renders once and leaves the menu after its post succeeds; a failed post keeps its row and prints the `gh` error. The `merged or closed PR` row's trigger narrows to "`state` was not `OPEN` at step 1".

`post-selection-loop.md`: the step-7 exit (its line 3 and `SKILL.md` step 7) becomes "Loop until `stop`". "Merge course": after `gh pr merge` returns, read `gh pr view <N> --json state,mergeCommit`; `state: MERGED` -> render the `AC coverage` block once (below, `<sha>` = `mergeCommit.oid`) and re-render the menu under the `own merge` overlay; any other state (a merge queue) -> one `PR comments` line `The merge is queued, so coverage posts wait. (<state>)` and the menu `wait` (re-run the read) / `show evidence` / `stop`. No compare-and-swap before a coverage post: the PR is merged and the block is the one rendered for the assessed head. The Teardown row `Merge success` becomes "tear down when the own-merge menu exits on `stop` or after the last post row leaves it". The output done-check gains one exception: the `AC coverage` block posts verbatim, heading and checkbox rows included. The `AC coverage` block:

```markdown
## AC coverage
Informational - the ticket's rows are unchanged. PR <url>, merged <sha>, spec <path>
- [ ] <row 1 text verbatim> - covered
- [ ] <row 3 text verbatim> - deferred per spec to <ref>
- [ ] <row 2 text verbatim> - deviates per spec: <why>
- [ ] <row 4 text verbatim> - venue: <env> - <observation>, checked after deploy
```

With `source: pr`, or empty `rows`, the block has no rows and the `post coverage to ticket` row is not offered. `/skill:check-delivery` reads a posted block as any other comment; its Stage 0 rule for comments that amend or contradict a body AC is unchanged, and the first line above states that the block amends nothing.

### D5 - Authoring (ticket-acceptance.md, spec-council-member)

`skills/brainstorming/reference/ticket-acceptance.md`: after "Defer a row only when the shipped change operates without it - cost is never a reason", add "a row another repo or workflow delivers is `deferred: <that ticket or spec ref>` - a tracker ref (`#N`, `owner/repo#N`, `ABC-123`), a spec path, or a URL; a prose destination with none of these is a gap at the PR gate". "Operates without it" means the shipped change's own promised mechanism works with the row absent; a slice that depends on the deferred work being delivered later still qualifies. `agents/spec-council-member.md` applies the same reading when it challenges a `deferred:` row; its frontmatter is byte-identical.

### D6 - Conformance handoff

`skills/verification-before-completion/reference/conformance-check.md` "Handoff sentinel": the sentinel gains one optional line after `happy-path:` (or after `audited-base:` when no happy-path line exists), present exactly when the spec carries at least one `deferred:` or `deviates:` row:

```text
Deferred/deviates per spec: AC3 deferred to <ref>; AC5 deferred to <ref>; AC2 deviates: <why>
```

The sentinel paragraph's "two lines (three when a happy-path run happened)" becomes "two lines, plus `happy-path:` when a run happened, plus `Deferred/deviates per spec:` when the spec has such rows"; sentinel validation accepts the line. It is informational: `N` and the card count ignore it, it never triggers a re-audit, and those rows never produce a concern card. `skills/finishing-a-development-branch/SKILL.md` Step 3.5 prints it verbatim as one line directly under the `happy-path:` line when present, else directly under the header, and above the `whole-diff minors` line (both paths); the PR body block in Option 1 keeps listing `venue:`/`deferred:` rows as today. `agents/conformance-reviewer.md` is unchanged: its Origin drift output already lists these rows, and the orchestrator builds the line from the spec rows, not from the reviewer.

### D7 - check-delivery

Unchanged. AC5's second clause rests on its existing Stage 3 row `unexplained gap` ("AC not met, no sanctioned explanation"). The eval sample `directional-dependency` (D8) appends `skills/check-delivery/SKILL.md` to its bundle and fixes the preconditions that select that verdict: the deferred row is a mechanism row with no mechanism shipped, the ticket has no comment explaining it, no `## Delivery` block is configured, and the model is asked for the gate report and menu, then the Stage 3 verdict table for the same ticket.

### D8 - Evals

Two new targets, `eval/gatekeep-pr-scope/` and `eval/conformance-check/`, per `eval/README.md`, layout copied from `eval/spec-gate/`: `README.md`, `reviewer-prompt.md`, `run.mjs`, `run.test.mjs`, `sample/<slug>/{source.md,expected.md}`. `run.mjs` renders the target's skill files in order (`SKILL.md`, `verification-brief.md`, `reference/*.md` for gatekeep-pr; `conformance-check.md`, `finishing-a-development-branch/reference/disposition-protocol.md`, and `finishing-a-development-branch/SKILL.md` Steps 3.5 through 4 - the slice from the `### Step 3.5` heading to the `### Step 5` heading, so the disposition grammar and the options menu the prompt asks for are in the bundle - for conformance-check) as the loaded arm's instruction bundle; a sample's `source.md` may open with one `bundle+: <repo-relative path>` line that appends a file to its bundle (used by `directional-dependency`). `source.md` is a fixture digest (PR body, diff summary, spec text, ticket rows) and the prompt asks for the rendered report and menu. Samples:

| Target | Sample | Facts |
|---|---|---|
| gatekeep-pr | `deferred-with-ref` | `Delivers` names `3, 5 deferred per spec to <ref>`; 0 blockers; `merge` offered |
| gatekeep-pr | `deferred-without-ref` | row 3 `gap`; 1 blocker; `merge` not offered |
| gatekeep-pr | `deviates` | `2 deviates per spec: <why>`; 0 blockers; `merge` offered |
| gatekeep-pr | `mixed-coverage` | rows 1, 4 covered, 2 deviates, 3, 5 deferred; 0 blockers; `merge` offered |
| gatekeep-pr | `directional-dependency` | spec defers the slice this PR depends on; `merge` offered; with the appended check-delivery bundle, the Stage 3 table over the same ticket yields `unexplained gap` for that row |
| gatekeep-pr | `no-spec-quality` | the contract is `source: pr`, observed as a `Delivers` line that states the PR's own intent and names no ticket row; a `REVIEW.md` blocking concern still mints a blocker; no ticket AC judged |
| gatekeep-pr | `ticket-drifted` | ticket row text differs from the spec row; 0 blockers from the drift; the sample picks `show evidence`, whose output carries the `cross-check: differs` line; `merge` offered |
| gatekeep-pr | `post-merge-menu` | after merge the menu offers both post rows and `stop` recommended; `stop` posts nothing |
| conformance-check | `deferred-with-ref` | 0 decision items for rows 3, 5; one `Deferred/deviates per spec` line in the closure sentinel and one in the Step 3.5 render, nowhere else |
| conformance-check | `deviates` | 0 decision items for row 2; the line names row 2 |
| conformance-check | `in-scope-gap` | an in-scope row with no mechanism stays a decision item |
| conformance-check | `no-dispositions` | spec with only `in-scope` rows: the line is absent |
| conformance-check | `mixed` | rows 2, 3, 5 settled on the line; row 4 in-scope gap is the single decision item |
| conformance-check | `directional-dependency` | the spec defers the slice the change depends on; the line names it; zero decision items; the Step 3.5 render reaches the first line of Step 4 (the eval prompt stops there; the menu itself is Step 4) |

Facts are drafted by a fresh model and approved by the human before the baseline; the baseline runs on the pre-edit wording (`git show <base sha>:<file>`) before any skill edit lands. A fact or fixture input found wrong after a run (a Design clause the fixture diff does not satisfy, a fact naming an internal field the report never prints, a rubric copied from another target) is corrected, and both arms re-run on the corrected input before the record is committed; the human's delegation of that judgment is recorded in the README row.

### D9 - Deterministic tests

`scripts/gatekeep-comment-reconcile.test.mjs` drops the assertions that pin deleted rules: the `drafted`/`proposed`/`resolved` match and the `ticket body ... lifts` match (findings test), the whole "split rule fails closed on commit references and unreadable authors" test, `Ticket changes` in the report order array, and `menu.includes('merge anyway - accept AC')`. It adds: `findings.md` contains `deferred per spec` and not `Only the tracker waives`; `assessment.md` contains `Select the scope contract` and the `doc/specs`/`docs/specs` fallback; `verification-brief.md` Section C names the `scope` block and not the ticket's acceptance criteria; `report.md` order array is `Delivers`, `PR comments`, `Nits`, `Blockers`, `Verdict:`; `decision-menu.md` lists `post coverage to ticket`, `post coverage to PR`, an `own merge` overlay row above `merged or closed PR`, and not `propose ticket change`; `post-selection-loop.md` reads `gh pr view <N> --json state,mergeCommit` after merge; `conformance-check.md` sentinel names `Deferred/deviates per spec:`. `scripts/ci.mjs` line 460's explicit `--test` list gains `eval/gatekeep-pr-scope/run.test.mjs` and `eval/conformance-check/run.test.mjs`.

## Errors and edge cases

- Two candidate specs in the diff: STOP and ask (D1). A spec named in the PR body that is absent at the assessed head: one blocker, never `source: pr`. A supersession-banner-only edit to a predecessor is not a candidate.
- `source: spec` with `issue: null` (no reference, fetch failed): `rows` stay the contract, `cross_check: not run`, `post coverage to ticket` not offered. `source: spec` with a `none - <reason>` AC section: `design` plus stated intent is the contract, no cross-check.
- `deferred:` whose ref is a path or URL: the gate verifies the text shape only, never that the destination shipped - delivery is `/skill:check-delivery`'s job.
- `gh pr merge` returns but `state` is not `MERGED` (merge queue): no coverage block, `wait`/`show evidence`/`stop`.
- `deviates:` with an adopted Design clause missing from the diff: one blocker on the clause; the row still renders `deviates per spec`.
- Settled scope never lifts a `REVIEW.md` blocker, a failed check, a contradicted claim, or a merge precondition.
- A coverage post that fails (`gh` non-zero): row stays, error printed, nothing retried without a pick. A post that succeeded leaves the menu; it cannot be picked twice in one run.
- A ticket edited after spec approval: `cross_check: differs` renders under `show evidence`; the spec stays the contract and `/skill:check-delivery` judges the ticket as edited.
- `source: pr` on a PR that closes a ticket: `Delivers` states the PR intent; the ticket is not judged; `post coverage to ticket` is not offered.

## Tests

- `npm test` (D9 assertions, stage-skill lint, skill lint).
- Baseline then loaded eval runs for both targets (D8), two arms each, first-run records committed under `eval/<target>/`.
- Post-landing check, outside this change's verify gate (rescoped at the finish gate: it needs a real PR merged with `gh`, which exists only after this lands): `/skill:gatekeep-pr` on a disposable fixture PR whose spec defers one row, through `merge`, then `post coverage to PR`; confirm the comment body equals the rendered block.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` - "What a run looks like" and the gatekeep-pr entry under "Architecture" state that the spec is the pre-merge contract, the PR description is the fallback, the ticket is the delivery contract, and coverage posts are opt-in after merge; `CHANGELOG.md` - `## Unreleased` entry for the contract change (#59)
- Derived / memory docs invalidated: none

Materiality bar: `reference/documentation-impact.md`.

## Out of scope

- Any change to `/skill:check-delivery`.
- Any tracker or PR write without an explicit menu pick.
- An `AC coverage` block in the ship-gate report or the squash commit message.
- A settings key, a new helper persona, a parser bin, or an approval record for dispositions.
- `REVIEW.md` convention, thin-wrapper contract, `doc/configuration.md`.

## Open questions

none
