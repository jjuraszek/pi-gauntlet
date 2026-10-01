# gatekeep-pr: mechanism-only AC gate, compact bottom-up report, explicit fixes

**Goal:** gatekeep-pr judges whether a PR delivers the mechanism each acceptance criterion needs (code, unit tests, docs) and renders a short, terminal-friendly report whose last lines are a two-state verdict and a verb menu; post-merge observation stays with `/skill:check-delivery`, which takes no input from the gate.

Supersedes `doc/specs/2026-08-18-gh-9-gatekeep-pr-skill.md`, scope: AC coverage rule, merge-proof claim rule, report template, follow-up category. Supersedes `doc/specs/2026-09-22-gh-43-split-gatekeep-pr-skill.md`, scope: file layout and SKILL.md content split. Supersedes `doc/specs/2026-08-20-gatekeep-pr-output-density.md`, scope: human-visible finding IDs, action-vocabulary grammar, pre-composed course rendering, and output done-check placement (the `C#` ledger it introduced stays, internal only).

## Problem

Six gatekeep-pr runs across two consumer repos on 2026-09-30 and 2026-10-01 blocked merge on things no PR can show before it merges: a staging run of 82 destinations (dashboard #3561), a pinned real-data export and a staging dashboard (customer-ops #152), "Live on stg plant 639" in a Test Plan (customer-ops #129). Two independent rules produce the false blocks: AC coverage is `met` / `partial` / `missing` with only `met` merge-ready (`skills/gatekeep-pr/reference/assessment.md:78-81`), and an `unverifiable-pre-merge` PR-body claim used as merge proof is blocking (`skills/gatekeep-pr/verification-brief.md:207-210`; chosen on purpose by the gh-9 spec, reversed here on the user's instruction). Neither consumer's overrides or `REVIEW.md` asks for pre-merge staging checks.

Four more defects make the gate hard to use as the most important human checkpoint in the flow:

- The skill edits the worktree before any menu pick: blocking doc drift is "applied ... as part of assessment" (`SKILL.md:18-21`, `assessment.md:88-93`), so a run that ends with `stop` leaves the worktree dirty.
- The report mandates seven sections, four ID namespaces (`P#`/`L#`/`C#`/`F#`), `Fix: ... | Action: ... [category]` rows, and ~100 lines of verbatim `raw_tail`, printed top-down with the verdict first (`SKILL.md:127-157`) - in a terminal the verdict scrolls away and the human reads "None" five times.
- A `follow-up` category with an owner column (`findings.md:50-55`) lets promised behavior defer to a PR nobody opened.
- The flow is spread across seven files with four definitions of "what blocks", a Report/Decide cycle, and configuration resolution placed where it cannot run (three reviewers' findings, recorded in the design below).
- `fix` disappears for non-authors when nothing is "worktree-fixable" and on every fork PR (`reference/decision-menu.md:37-52, 73-84`).

## Acceptance criteria

none - no ticket

## Design

### D1. Orchestrator and sibling layout

`skills/gatekeep-pr/SKILL.md` is a seven-step orchestrator: frontmatter, a four-sentence intro (verify-don't-trust, consent gate, residual risk), the step table below, the wording rules (D5), red flags that enforce the revised contract (none cites deleted vocabulary), and the standard Project overrides block. Invariant: under 120 lines (asserted in Tests). Each step has exactly one "read `<sibling>` now" pointer and one output; no step's rule text lives in SKILL.md.

| Step | Reads now | Output | Tracker stage |
|---|---|---|---|
| 1 Gather | `verification-brief.md` Section A | PR digest: PR metadata, diff, checks, comments, worktree discovery - no ticket fetch yet | `gather` |
| 2 Provision + configure | `reference/assessment.md` | provisioned worktree (create/reuse recorded) + config resolved from the merge-base; then the ticket fetched via the resolved issue-fetch command and `issue.acceptance_criteria[]` extracted with the grammar in `skills/brainstorming/reference/ticket-acceptance.md` (cite it, do not restate) | `provision` |
| 3 Verify | `verification-brief.md` Section B | evidence record (CI-first, unchanged) + claim dispositions, one tracker task per material claim | `verify` |
| 4 Review | `verification-brief.md` Section C | reviewer native output + internal comment ledger | `review` |
| 5 Integrate + report | `reference/findings.md`, then `reference/report.md` | integration (D2 AC outcomes, provenance check, severity translation, drafted payloads) and the rendered report (D4) | `report` |
| 6 Menu | `reference/decision-menu.md` | menu appended under the verdict line, exactly one `[recommended]` | `menu` |
| 7 Loop | `reference/post-selection-loop.md` | the executed pick; re-entry per the rule below, until `merge` or `stop` | (re-opens the re-entered stage) |

The ticket fetch sits in step 2 because the issue-fetch command is a ladder-resolved setting read from the merge-base; fetching in step 1 would run an unresolved (PR-controlled) command. Section A of the brief loses the `gh issue view` line; step 2 owns it.

**Re-entry rule.** A pick that moves the head re-enters step 3 only when the new head has no current evidence. A fix wave verifies in the worktree at the SHA it is about to push (one verification pass per wave, the retained contract), so after its own push the evidence is current for the new head and the loop re-enters step 4 (claim re-check, comment refresh, review of the delta) and then step 5. Any other head move (the author pushed, a rebase) re-enters step 3. A pick that leaves the head unchanged re-enters step 5.

Tracker: `plan_tracker` init with `gather`, `provision`, `verify` only. Step 3 adds one task per material claim (`complete` matched, `failed` contradicted, `skipped` unverifiable-pre-merge). Once every claim is terminal and `verify` is closed, add `review`, `report`, `menu`. This order exists because the tracker rejects a verdict recorded behind a still-pending stage. `phase_tracker` is never used. Harness without `plan_tracker`: plain checklist, no behavior change.

Content moves (the flow reviewer's list, applied in full):

- To `reference/assessment.md` (step 2 owner): the worktree state machine, the one `mergeable` re-poll, the configuration ladder (four rungs), the merge-base read recipe, the `## PR gate` overrides schema, the thin-wrapper contract, the inline-vs-dispatch table. SKILL.md keeps one sentence: "Run every step inline; dispatch per `reference/assessment.md` when pi-cohort is present."
- To `reference/post-selection-loop.md` (step 7 owner): the merge preconditions (today `SKILL.md:111-122`), the output done-check (today `SKILL.md:171-185`), the teardown rule. `Define <bin>` (`SKILL.md:124`) is deleted - nothing references it.
- To `reference/report.md` (new, step 5 owner): the report format, section order, item rules, `show evidence` content (D4).
- To `reference/findings.md` (step 5 owner): the D2 outcome table and `impossible` definition, the provenance check, the severity translation, the claim rules, the doc-fix drafting rule (today `assessment.md` Phase 4). `assessment.md` keeps only step 2 content.
- Every reference to "Phase 1-4" in the siblings becomes the step name it maps to (Phase 1 -> step 1, Phase 2 -> step 2, Phase 3 -> steps 3-4, Phase 4 -> step 5).
- Out of `verification-brief.md`: orchestrator sentences ("the orchestrator re-polls", "the orchestrator asserts", the edge-case rules on AC skip and missing evidence) move to their owning step; the brief keeps only what a delegate executing one section needs. The merge-proof rule paragraph is deleted.
- Duplicated rules collapse to one owner each: mergeable re-poll (assessment.md), tracked-only cleanliness (brief B), safety contract (brief B), reviewer-check exception (brief B; findings.md references it), argument fallbacks (brief A), consent gate (SKILL.md intro).
- `reference/findings.md` keeps: namespaces (D3), triage bar, check dispositions with the annotation column only (the merge-course column moves to decision-menu.md's overlay, the fallback-run column to brief B's Failed-CI row), drafted payloads, the internal comment ledger.
- `reference/decision-menu.md` collapses five tables to two: one consent table with an authorship column, one overlay table (fork, pending reviewer, CI check, impossible AC, draft PR, merged/closed PR, bot author). The three retained dispositions keep today's semantics: a draft never carries `[recommended]` on `merge` or `approve`; a merged or closed PR renders the report and `show evidence` / `stop` only; a bot author follows the non-author column. Golden fixtures are rewritten in the D6 form; fixtures 1 and 3 drop the pre-applied `push-docs` premise.

Every changed line follows `/skill:forge-skill` authoring rules (imperative voice, low conditionality, one example per rule, no restated rule in a second place).

### D2. Per-AC verdict (mechanism half only)

Owner: `reference/findings.md`. Inputs: ticket AC rows (step 2), the source behind the diff at the assessed `headRefOid`, tests in the diff and existing tests the diff reaches, docs in the diff and docs the diff makes stale, CI per the brief's Evidence resolution table (unchanged). PR body, PR comments, and a spec inside the PR are leads to verify, never evidence.

Each AC row splits once into a **mechanism half** (code + test + doc that make the behavior possible) and, when the row names an observation that needs an environment, dataset, deployed target, or external system that repository tests cannot reach, an **observation half**. Behavior a unit test can assert ("retries three times then fails", "rejects a nil name") is mechanism, never an observation half. A `venue:` disposition in the PR's spec is a lead to compare against the ticket's own AC text, never proof and never an automatic exemption. The gate judges the mechanism half only.

| Outcome | Condition | Renders as | Blocks |
|---|---|---|---|
| `covered` | evidence matches what the AC promises: executable behavior needs the code path plus a real test that exercises it; a documentation-only AC is judged against the promised doc text; in both cases docs that describe the behavior agree with it | counted in `Delivers` | no |
| `gap` | any part of the mechanism absent in this PR (today's `partial` and `missing` both land here) | one `Blockers` item | yes |
| `not judged here` | the observation half; the mechanism half of the same row is still judged `covered`/`gap` | one `Delivers` clause ("<row>'s observable half is checked after merge, not here"); nothing is written, listed, or handed to check-delivery | no |
| `impossible` | a `gap` whose fix is on the ticket - all four conditions below hold | one `Ticket changes` item with a drafted replacement AC text, in state `drafted` or `proposed` | withholds `merge` until the ticket body changes (lifecycle below) or the human picks `merge anyway - accept AC<n> as impossible` (D6) |

**Impossible-AC lifecycle.** Three states, in order: `drafted` (the proposal exists in the run), `proposed` (`propose ticket change` posted it as a tracker comment; the comment is not an edit), `resolved` (a human edited the ticket body). Every step-5 re-entry re-fetches the ticket and re-extracts the AC rows; a changed row is re-judged on the current head, so a human edit lifts the withhold without a PR head change. `Ticket changes` renders one item per unresolved impossible AC, labeled `drafted` or `proposed`, and drops the item only after the re-extracted row no longer meets the `impossible` conditions.

`impossible` requires all of: (1) no change to this repository can satisfy the mechanism half; (2) the constraint is cited - a vendor/platform doc URL, a dependency's released API at `file:line` or in its changelog, a repo policy at `file:line`, or a second AC in the same ticket whose quoted text contradicts this one; (3) the cited source was read this run; (4) the reason is none of: cost, effort, "needs another PR", "needs a deploy first" (that is `not judged here`), a `deviates:`/`deferred:` disposition in the PR's spec, "the AC is ambiguous" (an ambiguous row stays judged as written). Anything failing a condition is `gap`. Example that passes: the AC asks the export to include the customer's credit score and the vendor API the repository reads returns no such field (vendor doc URL cited). Example that fails: the AC asks for the user's local timezone and the browser sends no timezone header - a request parameter is a repository-side mechanism, so this is `gap`.

No ticket linked, or ticket fetch failed: no AC rows; `Delivers` states the PR's intent as read from its title and body; `not judged here`, `impossible`, `Ticket changes`, and scope creep do not apply.

**Whole or part.** With a ticket linked, `Delivers` names coverage: *whole* when every row is `covered` or is `not judged here` with its mechanism half `covered`; *part, acceptable* when every uncovered row is either an observation half or **explicitly split** - the ticket body or a human-authored ticket comment names another tracker ref for that row, read from the tracker this run. Only the tracker waives an obligation: a spec `deferred: <where>`, a linked follow-up PR, or a `proposed` (not yet `resolved`) ticket change is a lead to check the tracker, never a waiver by itself. Any other uncovered row is `gap` (a blocker): "follow-up PR will add X" in the PR body, an unchecked box with no tracker split, a `deferred:` the ticket does not confirm.

**Claims.** The material-claim check keeps its three dispositions in the Verifier schema. `contradicted` stays a blocker. `unverifiable-pre-merge` is not evidence and renders nothing: a PR whose only proof of a new path is "verified on stg" is blocked by the untested-path rubric row, not by a claim rule. The merge-proof rule is deleted.

### D3. Two namespaces: blocker and nit

`follow-up` and `F#` with its owner column are removed everywhere. Every finding is one of:

| Namespace | Contents | Gates merge |
|---|---|---|
| blocker | code defects, security, untested new path, `contradicted` claim, AC `gap`, scope creep against a linked ticket (diff content traceable to no AC and no stated intent), doc drift beyond wording (a doc now describes behavior the code does not have, or omits an operation/parameter the code adds), failed gate or undispositioned failing check | yes |
| nit | wording-only doc drift (typo, label, phrasing with the same meaning), style, reuse of an existing helper, naming | no; take-or-leave at the menu; untracked after the run |

`review-baseline.md` rows change accordingly: "Doc drift" splits into "beyond wording -> blocking" and "wording-only -> nit"; "Prose/style/label cleanup -> nit"; the severity-axis sentence names blocker vs nit; the Testing row reads "a new executable code path shipped without a real test is blocking; a documentation-only obligation is judged against the promised doc text". Step-5 severity translation: Critical and Moderate -> blocker, Minor -> nit; a repo `REVIEW.md` mapping still overrides, unmapped severities still fail safe to blocker.

Internal IDs (`P#`, `L#`, the comment ledger's `C#` with `id`/`updated_at`) survive as keys for the post-push re-render diff and the fix wave; the human never sees them. A fixed blocker leaves the list on the next render instead of carrying `(fixed in <sha>)`.

**Doc fixes are drafted, never pre-applied.** Step 5 drafts the doc edit for every doc-drift blocker as a payload. The worktree stays tracked-clean at every menu render; the payload is applied only on a `fix` pick (same path as code fixes) and dropped at teardown otherwise. The consent-gate sentence allowing pre-menu doc edits (`SKILL.md:18-21`) and the `push-docs` action are deleted; after a `fix` the ordinary `push` covers doc commits.

### D4. Report (`reference/report.md`)

Rendered bottom-up for a terminal: least important first, verdict and menu last. Empty sections are omitted - never "None". Format:

```
Delivers: <one or two sentences: what the PR does; with a ticket: "Covers the whole <ref>." |
          "Covers AC1-2 of <ref>; AC3's observable half (<what>) is checked after merge, not here." |
          "Covers AC1 of <ref>; AC2 -> <split ref>.">

Ticket changes:          (one item per unresolved `impossible` row)
- AC<n> asks for <X>; <cited constraint>. Proposed wording: "<new AC text>". (drafted | proposed <comment url>)

PR comments:             (only when existing review comments need a reply, or a reviewer run is pending)
- <reviewer>'s comment on <topic>: <one-sentence verdict>. Reply drafted.
- reviewer run in progress; merge waits. (<run url>)

Nits:
- <1-2 sentences>. (<file:line>)

Blockers:                (numbered; menu picks reference these numbers)
1. <1-2 sentences: what is wrong, why it matters>. (<file:line> | <check name> | <doc path>)

Verdict: mergeable - <evidence clause> | fixable - <N> blockers | fixable - <withhold reason>

<menu>
```

The verdict is two-state, as the user named it: `mergeable` or `fixable`. `mergeable` carries the evidence as a clause: `CI green on the assessed head (<check name>)` or `verification command passed locally`. `fixable - <N> blockers` when `Blockers` is non-empty; `fixable - <withhold reason>` when it is empty but a merge prerequisite is unmet (`ticket change pending on AC4`, `reviewer run in progress`, `required check pending`, `failed gate`). Verbatim command output, CI run URLs and conclusions, drafted edits, drafted replies, matched claims, and covered ACs print only under the `show evidence` pick. A clean run with a linked ticket renders `Delivers`, the verdict line, and the menu - about four lines.

Worked example (own PR, ticket gh-45):

```
Delivers: on-demand CSV export from the reports page. Covers AC1-2 of gh-45; AC3
(export completes under 5s on production data) is checked after merge, not here.

Ticket changes:
- AC4 asks for the customer's credit score in the export; the vendor API this
  service reads returns no such field (vendor doc: api.example.com/v2/customers).
  Proposed wording: "Exports include the customer's risk tier." (drafted)

PR comments:
- maria's comment on the missing CSV header: already fixed in 3f2a1c0. Reply drafted.

Nits:
- fetchAll re-implements the paging helper in lib/page.ts. (src/api/export.ts:31)

Blockers:
1. The export endpoint ships with no test, so nothing proves it works and nothing
   catches it breaking. (src/api/export.ts:10-58)
2. The README still says exports run nightly; the PR makes them on-demand, so a
   reader following the docs waits for a job that no longer exists. Doc fix drafted.
   (README.md:88)

Verdict: fixable - 2 blockers.

1. fix - apply both blockers in the worktree, re-run the gate, push        [recommended]
2. fix + nits - same, plus the nit
3. propose ticket change - show the AC4 edit for approval before it posts
4. reply - post the drafted reply to maria
5. show evidence - gate output, CI run, drafted edits
6. stop
Type a number, or compose: "fix 2", "fix nits", "fix 1 + reply".
```

### D5. Wording rules (stated in SKILL.md, bind every render)

1. One item is one or two whole sentences: what is wrong, then why it matters. No fragments, no field separators.
2. Name the behavior, not the artifact: "retries forever" beats "attempts counter not incremented".
3. Locators trail in parentheses (`file:line`, check name, doc path), never inside the sentence.
4. No category tags, severity words, or IDs in prose - the section heading is the severity, the list number is the ID.
5. Report only non-conformance; passing checks, covered ACs, and matched claims print only under `show evidence`.
6. Omit empty sections.
7. `Delivers` is always present and names which ACs this PR covers and which observable half is checked after merge.
8. The verdict is one line in the fixed form.
9. Menu rows start with a verb a human types, carry one clause of consequence, and exactly one row is `[recommended]`; compose grammar lives in the hint line only.
10. ASCII only, American English, no hedges on checked facts, no intensifiers.

A `## comms style` section in the overrides file extends these rules and the external-payload done-check alike - one rule set, one extension point.

### D6. Menu (`reference/decision-menu.md`)

Verbs: `fix`, `push`, `review`, `approve`, `merge`, `merge anyway`, `reply`, `propose ticket change`, `show evidence`, `wait`, `stop`. Rows are `<n>. <verb> - <consequence>`; `stop` is always last before the compose hint; `show evidence` is always offered and never recommended; a row GitHub would refuse renders `(not available: <reason>)` and is never recommended.

`fix` is on every menu, for every author and every PR origin. It applies drafted payloads (code and doc) in the provisioned worktree, runs the verification pass once at the resulting SHA, and - when `push` is available - pushes; the loop then re-enters step 4 per D1's re-entry rule, never a second verification pass in the same wave. Authorship moves only `[recommended]`: author -> `fix` (blocked) or `merge` (clean); non-author -> `review` (blocked) or `approve` (clean). Fork PR: `fix` applies to the local `pr-<N>` worktree; `push` and `merge` render `(not available: fork)`; the report's `fix` consequence clause says what to do with the local commit ("open a PR from `pr-<N>`, or hand the patch to the author").

`propose ticket change` renders only when a row is `impossible`; it shows the drafted AC text verbatim and posts to the tracker on an explicit confirmation reply, via the resolved tracker verb (`gh issue comment`, or the overrides' tracker mapping; Linear via `/skill:linear`). Posting moves the item to `proposed`; only a human edit to the ticket body moves it to `resolved` (D2 lifecycle). No write path -> the proposal renders as a copy-paste block in state `drafted`. Before posting, re-fetch the ticket and compare the AC row text; on drift, re-render the proposal instead of posting.

`merge anyway - accept AC<n> as impossible` renders only while an `impossible` row withholds `merge` and every other merge prerequisite holds; it lifts exactly that AC's withhold and nothing else - ordinary blockers, an unreviewed delta, pending checks, and GitHub-refused states stay in force. It replaces today's `merge-squash anyway` / `merge-commit anyway` as the single sanctioned `anyway` form for this case; the reviewer-withheld `anyway` keeps its existing semantics under the pending-reviewer overlay.

`reply` posts drafted replies under `PR comments`. The reviewer-placeholder, pending-check, and CI-check overlay mechanics keep their current semantics (brief Section C, findings.md dispositions); they render as one `PR comments` line and `wait` as row 1, not as a `C#` state table.

### D7. check-delivery boundary

`skills/check-delivery/SKILL.md`, after "It verifies **delivery**.": "It takes no input from `/skill:gatekeep-pr`: nothing the pre-merge gate rendered is read or trusted here. ACs are re-extracted from the ticket in stage 0 and the shipped SHA is re-derived in stage 1." Red flags gain "Using a PR body, PR review comment, or pre-merge gate report as the AC list or as AC evidence". The rationalization table gains the row "The PR gate already checked this AC" -> "The gate judged the mechanism pre-merge; this control observes delivery at the shipped SHA from the ticket's own ACs." Nothing else in check-delivery changes; its two classifiers (`not externally observable`, `unverified: no delivery target`) and its `proposed descope` path stay independent of the gate's `not judged here` and `impossible`.

## Errors and edge cases

- Impossible AC, no tracker write path: copy-paste block in state `drafted`, merge withheld until the ticket body changes or `merge anyway - accept AC<n> as impossible`; nothing auto-posted.
- Impossible AC, ticket edited since gather: refetch compares row text; drift re-renders the proposal, never posts against stale text.
- Impossible AC, human edits the ticket body: the next step-5 re-entry re-extracts rows, re-judges the changed row, drops the `Ticket changes` item, and lifts the withhold on the same PR head.
- Documentation-only AC: `covered` when the promised doc text exists at the assessed head; no test is demanded.
- Fork PR `fix`: local worktree only; `push`/`merge` not available; the consequence clause names the manual carry-over.
- No ticket: `Delivers` is intent-only; no AC rows, no `Ticket changes`, no scope-creep blocker.
- Doc fix drafted, `fix` not picked: worktree tracked-clean at every render; payload dropped at teardown.
- Reviewer placeholder or pending required check: one `PR comments` line, `wait` first, merge rows `(not available: reviewer still running)` / `(not available: required check pending)`.
- Blocker fixed in a later round: disappears from `Blockers`; internal ID retained for the ledger.
- `## comms style` present: extends D5 and the done-check.
- Head moved by a fix wave's own push: evidence is current at that SHA; re-enter step 4. Head moved by anyone else: re-enter step 3 (stale-head row of the evidence table, unchanged). Same head: re-enter step 5.
- Verdict precondition set is unchanged except: `partial`/`missing` AC and the merge-proof claim rule are removed; AC `gap` and `impossible` (withhold) are added.

## Tests

No runtime harness renders skill output; the contract oracle is `scripts/gatekeep-comment-reconcile.test.mjs` (wired in `scripts/ci.mjs`), **extended, not replaced**: its four existing tests (comment refetch and body-delta reconciliation across `post-selection-loop.md`, `decision-menu.md`, `verification-brief.md`) stay and are retargeted to the moved sentences. New assertions:

- `skills/gatekeep-pr/SKILL.md` is under 120 lines, contains the six stage names, contains no `F#`, `raw_tail`, `push-docs`, `follow-up`, the backticked AC classification tokens `` `met` `` / `` `partial` `` / `` `missing` ``, or "apply the doc fixes" (bare-word "missing" in "missing evidence" is allowed).
- `reference/findings.md` carries the D2 contract sentences: the observation half "is checked after merge, not here" and blocks nothing; a mechanism `gap` "is a blocker"; doc fixes are "applied only on a `fix` pick"; `impossible` has the three states `drafted`, `proposed`, `resolved` and the withhold lifts on a ticket-body change.
- `reference/decision-menu.md` contains `merge anyway - accept AC` and `reference/post-selection-loop.md` contains the one-verification-pass-per-wave sentence and the step-4 re-entry after a fix-wave push.
- `reference/report.md` contains the section order `Delivers`, `Ticket changes`, `PR comments`, `Nits`, `Blockers`, `Verdict:` in that textual order, the two verdict words `mergeable` and `fixable` and no `not mergeable`, and the sentence that empty sections are omitted.
- `reference/decision-menu.md` lists `fix` in the consent table for both authorship values and contains `(not available: fork)` on `push` and `merge`, not on `fix`.
- `verification-brief.md` contains no "Merge-proof rule" heading, no backticked `met` / `partial` / `missing` tokens, and no `gh issue view` line in Section A (the fetch moved to step 2).
- `reference/findings.md` and `review-baseline.md` contain "nit" and no "follow-up".
- `skills/check-delivery/SKILL.md` contains "takes no input from `/skill:gatekeep-pr`".
- The `C#` ledger sentence (`id`, `updated_at`) survives in `reference/findings.md`.

`npm test` stays green; the existing stage-skill lint, `pi.settings` ban, model-literal lint, and AGENTS core check run unchanged. The skill-grep in AGENTS.md "Package rules" (`rg -ni "jjuraszek|/Users/[^/]+" skills/`) returns zero matches.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: README.md - `## What a run looks like` (gatekeep verifies mechanism, not delivery; major procedures), the skill roster line (drop "stable finding IDs (P#/L#/C#/F#)", name the two-list report and universal `fix`; major procedures), `## REVIEW.md convention` starter ("Minor is a non-blocking follow-up" -> "Minor is a nit"; communication contract), `## Thin-wrapper contract` (`## comms style` governs the report too; communication contract); CHANGELOG.md - deferred: release
- Derived / memory docs invalidated: none (`doc/configuration.md` telemetry statement stays true - gatekeep-pr still never touches telemetry)

Guideline: `reference/documentation-impact.md` (pi-gauntlet's brainstorming reference; materiality bar applied above).

## Out of scope

- check-delivery's pipeline, verdict table, `## Delivery` contract, and `descope edits` - unchanged beyond D7.
- The CI-first evidence table (gh-14 scope) and the post-push comment refresh mechanics (gh-46 scope) - unchanged; only their rendering moves.
- A runtime harness for skill output.
- `.claude-plugin/marketplace.json` - both skills stay listed, no packaging change.
- Consumer repos' overrides or `REVIEW.md` files.

## Open questions

none - every decision above was taken in the questionary or the two design rounds.
