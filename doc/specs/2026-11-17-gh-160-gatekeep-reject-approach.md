# Gatekeep-pr rejects a PR over its approach, lets the developer overrule a blocker, and explains stuck blockers

**Goal:** When a PR's design does not fit the repo, `/skill:gatekeep-pr` names each approach conflict as a blocker, shows a readable rejection note, and offers a `reject` row whose last menu posts that note and closes the PR; the developer can set a named blocker aside with a typed `overrule <n>`, and a blocker the repair could not fix is explained in three headed sections so that decision rests on readable context.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Ticket:** #160
**Date:** 2026-11-17
**Predecessor:** none

## Problem

`/skill:gatekeep-pr` judges a PR finding by finding. Its menus offer repair (`deliver`), a posted review (`assess`), merge, approval and stop. Three gaps follow from that.

1. **No approach judgment.** A PR whose central idea is wrong for the repo (a second mechanism beside an existing one, a responsibility at the wrong owner, a recorded decision reversed without justification) surfaces only as line findings, most of them nits: `skills/gatekeep-pr/reference/findings.md` `## Namespaces` lists "reuse of an existing helper" as a nit. Nothing rejects a PR and nothing closes one (`rg "gh pr close" skills/gatekeep-pr` returns no match).
2. **No developer disposition on a blocker.** The only blocker a developer can lift is a failing check marked `flaky` (`findings.md` `## Dispositions`). A blocker the repair course returns unrepaired ends at the obstacle menu (retry, assess, stop) with merge withheld; the only way past it is merging outside the gate.
3. **Stuck blockers are described thinly.** The obstacle report carries the ordinary one-or-two-sentence finding (`reference/report.md`) plus a terse reason taken from a worker's decision line (`stuck - needs <what>`, `stuck - no progress: <failed prerequisite>`). Nothing says what the repair tried, why it stopped, or what each choice does.

Ticket #160 asks for the first gap: name approach conflicts, carry a rejection justification, offer a `reject` row that posts one review and leaves the PR open, and keep the conflict from withholding merge. The request that opened this spec changes and extends the ticket:

> #160 it should not add another level of menu. its first menu which allow rejecting PR with closing it with note. make sure if this route is selected final menu is rendered with full note draft so developer can verify justification/change his mind. last menu should like always propse clean, pushing note and close the PR (this option should be available only when rejection was selected, right?). rejection is not related to partiuclar code line. recommendation for rejection should be tide to fundamental flaws in desgin: not following architecture, reinveinting idioms or conventions, altering working decisions without justification in spec/body, in short all the heavy problem of PR being horrible fit in current state.

Decisions the user made during the questionary; the questions and answers behind them are inlined under `### Scope decisions` below:

- Ticket row 6 deviates: reject previews the note, then posts it and closes the PR on the last menu.
- Grounds 1-5 of the table in D1 recommend `reject`; ground 6 (needless machinery) does not.
- Ticket row 4 deviates: every approach conflict the developer does not reject is an ordinary blocker that `assess` posts and a delivery course repairs.
- The last menu has a `back` row that returns to the first menu with nothing written. Ticket row 5 stays in-scope as written: that menu no longer offers `reject`, and rejecting after backing out takes a new run.
- A typed overrule lifts an approach blocker at any time and any other finding-based blocker once a repair attempt returned it unrepaired. One spec covers both.
- A blocker with no clear way forward is rendered in the shape and register of `skills/chase-bug/reference/verdict-report.md`.
- Flow constraint (user, verbatim): "does it fundamentally alter the flow? it really shouldn't as there are only refinment in list of blockers, better presentation of stuff couldn't be fixed with human disposition on those and rejection menu with readable explenetaion which has to be accepted or not, right?"

Framing: kept - the scout's alternative (extend `assess` and the severity table only) cannot deliver a previewed PR-level note or a close.

### Scope decisions

Questions and answers from the questionary, verbatim (repo names in one answer were withheld before it reached this spec).

**Cut question 1 (ticket row 6).** Question: Your request changes this ticket row: "Picking `reject` puts one review carrying the justification on the PR at the reviewed commit - requesting changes on someone else's PR, a comment on the viewer's own - and ends the run with no repair; the PR stays open." How should the spec carry it? A) in-scope - as the ticket wrote it: reject posts the review at once, the PR stays open, no preview and no close step B) deviates: the request replaces the immediate post with a previewed note, then post and close on the last menu C) deferred: name the ticket or spec that would own the close step D) repair the ticket - /skill:shape-ticket #160 row 6 says "the PR stays open"; the request previews the note, posts it and closes the PR. Recommendation: D.
Answer: "B, lets also discuss which heavy offenders should block PR. maybe something based on [two sibling private repos, names withheld] changes/documentation/conventions you will find usefull"

**Question (reject grounds).** Six candidate grounds, each counting only when the report cites what exists on the base branch and the remedy replaces the PR's main mechanism: 1 second mechanism, 2 architecture boundary, 3 unjustified reversal, 4 weakened guard, 5 symptom-level fix, 6 needless machinery. Which grounds should recommend reject? A) 1-3 only B) 1-5; needless machinery stays an ordinary finding unless a repo's REVIEW.md adds it C) all six D) other. Recommendation: C.
Answer: "B, and 6th is something to be a blocker for either assess or delivery"

**Cut question 2 (ticket row 4).** Question: That answer changes another ticket row, because the ticket's first row counts needless complexity among the approach conflicts: "The human can pick any other row on that menu: the run then proceeds as it does today and the approach conflict does not withhold merge." How should the spec carry it? A) in-scope - as the ticket wrote it B) deviates: needless machinery with a named smaller change blocks merge until repaired; grounds 1-5 still withhold nothing when another row is picked C) deferred D) repair the ticket. Recommendation: D.
Answer: "B"

**User statement.** "each of those rejecting flaws should be blockers in assessment/delivery option, right?" - confirmed; every approach conflict the developer does not reject is an ordinary blocker (this replaced the reason recorded for row 4; the disposition stays deviates).

**Question (change of mind on the last menu).** A) stop only B) back - a row returns to the first menu with the same report, so deliver, assess or merge can be picked without re-assessing; stop still ends the run with nothing written C) other. Recommendation: B.
Answer: "B"

**Question (what can be overruled).** A) approach blockers only, by a typed command next to the flaky one B) any blocker C) nothing D) other. Recommendation: A.
Answer: "A, in general many session ends up with an issue which can't be fixed without input. I feel that we should reuse it for any blockers without any staright forward way forward, right? check how its orchestrated today"

**Question (stuck-blocker overrule scope).** A) one spec - approach blockers can be overruled at any time; any other blocker once a repair attempt came back without a fix B) two specs C) one spec, widest - any blocker at any time. Recommendation: A.
Answer: "A, just make sure blockers which doesn't have clear way forward are better formated and described than today. check how chase bug explains a bug. this should be simillar. human decision has to be really based on readable and understable context"

**Cut question 3 (ticket row 5), asked after the critique pass.** The row says: "No menu rendered after a pick offers `reject`, and the approach is not judged again after a repair push." The second half holds: once any work starts (a repair, a posted review, an approval, a merge), the approach is not judged again and `reject` is gone. The first half does not hold as approved, because `reject` and `back` are picks, and the first menu that `back` returns to offers `reject` again. How should the spec carry this row? A) in-scope - as the ticket wrote it: `back` still returns to the first menu with the same report, but that menu no longer offers `reject`; rejecting after backing out means running the gate again B) deviates: `back` returns to the first menu unchanged, `reject` included; only a pick that started work removes it C) deferred: name the ticket or spec that would own it D) repair the ticket - /skill:shape-ticket #160 row 5 says no menu after a pick offers `reject`; `back` re-renders the first menu with `reject`. Recommendation: A.
Answer: "A"

**Change request at the review gate, after the critique pass.** User: "is it still allow fixing all the blockers? it should! even bad design might have good idea badly implemented, right?" - the spec then refused to dispatch a repair for an approach remedy that did not fit the payload rule. Changed: a delivery course dispatches the repair of every open approach blocker (D3 Repair).

The flow answer is quoted in the list above.

### Research behind the grounds

In two private consumer repos, the repo-root `REVIEW.md` overlay, the root architecture document and every PR closed without merging among the 300 most recently closed were read (dependency bumps and titles marked throwaway, probe, proof or spike skipped). Of 29 PRs examined, 11 were closed over the approach, 13 for scope, ownership or duplicate delivery, 5 with no stated reason. None of the 11 was closed for a line-level defect: the flaw sat in the central idea, the remedy was a different design or owner, and at least three had already passed or repaired a line-level review. Both `REVIEW.md` overlays raise reuse and convention findings to blocker only when the finding cites named evidence (the existing mechanism, the owning layer, the uncovered input, the spec line). The two validity tests in D1 come from this.

### Checked claims

| Claim | Lookup | Result |
|---|---|---|
| The first menu has no reject action | `reference/menus.md` `## action`, `## final`, `## post` | Held |
| Reuse of an existing helper is a nit by default; a repo rubric can raise it | `findings.md` `## Namespaces`; `review-baseline.md` `## Severity axis` | Held |
| The review-posting path exists | `post-selection-loop.md` `### Fix wave` (one review at the assessed head, `COMMENT` on own PR, `REQUEST_CHANGES` otherwise, response `commit_id` checked) | Held |
| There is one first menu (request) | `menus.md` `## States` | Corrected - the first menu is `initial`, `final` or `obstacle`. With approach conflicts as blockers a conflicted PR is never ready, so its first menu is `initial` or `obstacle`. |
| The last menu already offers posting a note and closing (request) | `menus.md` `## post`; `cleanup.md` | Corrected - the post menu offers replies, coverage, cleanup, PR-named steps and overrides, and opens only after own-merge, approval or an already closed PR. The note step, the close step and a reject entry are new. |
| A full drafted note can be shown at a menu | `report.md` `## What stays out` | Held with a carve-out to write - full drafted bodies stay behind `show evidence` today. |
| Close is available only after reject (request) | `menus.md` whole file | Held as a decision - the close step exists only on the menu a reject pick opens. |
| Cleanup works on a closed, unmerged PR | `cleanup.md` steps 1-3 | Held - the worktree is removed when eligible; branch and base steps print `skipped - PR not merged`; no remote branch is deleted. |
| The reviewer's `REJECT` verdict can carry the judgment | `agents/wave-reviewer.md`; `verification-brief.md` Section C | Corrected - `REJECT` is also emitted for an unreadable anchor and gatekeep integrates severities only. The verdict is not an input. |
| The reviewer sees the whole PR on every run | `assessment.md` `## Step-4 review task` | Corrected - with an ancestor prior review, code review is bounded to the fix delta. The approach judgment is defined as whole-PR. |
| The viewer's ability to close a PR is readable | `gh api graphql` introspection of `PullRequest` | Held - `viewerCanClose` exists beside `viewerCanUpdateBranch` and `viewerCanMergeAsAdmin`, which `verification-brief.md` Section A's fixed query already reads. |
| Close command shape | `gh pr close --help` | Held - `gh pr close {<number> \| <url> \| <branch>} [-c] [-d] [-R]`. |
| Multi-PR mode can carry a reject pick | `batch.md` `## Summary and menu round`; `agents/pr-gatekeeper.md` | Held - the parent owns menus and every terminal and post step, queues picks and answers until the round's last pick; the child persona follows the injected procedure and needs no edit. |
| A new menu state needs contract rows | `doc/gate-contract.md`; `scripts/gate-contract-lint.mjs` | Held - every `gauntlet: gate=gatekeep-pr/<id>` and `gauntlet: done <outcome>` literal under `skills/` needs a contract row. |
| Ticket rows hold no workflow-stage proof | `skills/shape-ticket/SKILL.md` `## AC integrity gate` | Held - the posted review and the PR's open or closed state are the behavior under change. |
| A developer can overrule a blocker today (user) | `findings.md` `## Dispositions`; `post-selection-loop.md` `### Merge preconditions` | Corrected - only `check <name> flaky` lifts a blocker. An overrule is new behavior. |
| How an unrepairable blocker is handled today | `fix-wave.md` `### Budgets`, `### Admission`; `post-selection-loop.md` `### Exit check`, `### No-progress obstacle`, `### Contract decision` | Held - four exits: `needs <what>`, contract exception (own menu), no progress or exhausted row, round or sync cap. The obstacle menu offers retry, assess, stop. |
| The repair worker accepts a human hint | `fix-wave.md` `### Row dispatch` (`hint: none`) | Held - the field exists and gatekeep always sends `none`. Out of scope here. |
| The gate skips findings a user dispositioned | `post-selection-loop.md` `### Fix wave` ("Skip findings closed by user disposition") | Held - a delivery course leaves an overruled blocker unrepaired through this existing rule. |
| The human needs a visible handle for a blocker | `findings.md` `## Namespaces` Internal IDs; `report.md`; `post-selection-loop.md` `### Next action` (`reply <n>`) | Held - internal ids are never shown; the command addresses the rendered problem number. |
| chase-bug explains a bug in a fixed readable shape | `skills/chase-bug/reference/verdict-report.md` | Held - three `###` sections, under 180 words, one paragraph or one list per section, role-before-name register. Ticket row 2 already points the note at it. |
| Every part extends a file that already owns the job | `wc -c skills/gatekeep-pr/reference/*.md`; `scripts/skill-size-lint.mjs` | Corrected - `post-selection-loop.md` is 44,932 bytes against a 50,000-byte limit, so the reject and overrule procedures live in a new `reference/reject.md`. |
| `reject` is a course | `post-selection-loop.md` `### Continuation record` | Corrected - a course is standing authority for the delivery body; reject's writes are picked steps. The course list is unchanged. |
| The flow is not fundamentally altered | `SKILL.md` `## Steps`; `assessment.md` `## Helpers`; `menus.md` `## States` | Held - no new step, helper, tracker stage, course or menu archetype. One new edge exists: `back` from the reject menu to the first menu. |
| Eval bundle | `eval/gatekeep-pr/target.json`; `eval/README.md` `## Iterating on a skill edit` | Held - `review-baseline.md` and `batch.md` are outside the default bundle (samples add them with `bundle+:`); a file absent at the baseline needs a `"new": true` entry. |
| Deterministic test convention | `scripts/gatekeep-post-menu.test.mjs`; `rg -o "scripts/gatekeep[a-z-]*\.test\.mjs" scripts/ci.mjs` | Corrected - `scripts/ci.mjs` names only `gatekeep-comment-reconcile.test.mjs` (which imports `gatekeep-bypass-pick.test.mjs` and `gatekeep-post-selection.test.mjs`) and `gatekeep-fix-loop-contract.test.mjs`; `gatekeep-post-menu.test.mjs` and the other gatekeep `node:test` files under `scripts/` are not run by `npm test`. The two new test files are therefore registered explicitly in `scripts/ci.mjs`. |
| Existing assertions the edit must keep true or update in the same change | `scripts/gatekeep-comment-reconcile.test.mjs`; `extensions/telemetry-settlement-contract.test.ts` | Held - the first asserts the `report.md` `## What stays out` sentence "Keep full drafted file edits, description bodies and replies ... behind that command", binds `eval/gatekeep-pr/intent.md`'s `for:` SHA to the assembled bundle, and asserts `fix-wave.md`'s "Mark a finding resolved only from a `resolved` closure line" and "On a locally rewritten head push only when every carried `P#` has a `resolved` closure line"; the second deep-equals the set of gatekeep terminal markers in `doc/gate-contract.md`. |
| A new settlement outcome is parsed and documented outside the skill | `extensions/lib/telemetry-leg.ts`; `doc/configuration.md`; `AGENTS.md` Testing | Held - the gatekeep outcome pattern is `approved\|merged\|closed-pr\|final\|merge-queued\|stopped\|stuck - .+`, the configuration row lists six gatekeep tokens, and an edit under `extensions/lib/` requires `npm run build:bins` with the regenerated bundles committed. |
| The first menu's parser takes several numbers | `post-selection-loop.md` `### Next action`, `### Teardown`; `cleanup.md` `## Non-final stop` | Corrected - a comma-separated set is parsed only on own-merge, approved and closed-pr; `done` markers and the non-final-stop delegation name no reject state. D5 extends those owners. |
| The run record keeps the rendered blocker numbers | `verification-brief.md` gather digest schema; `report.md` `## Report` | Corrected - only `post_steps` retains a rendered mapping; the report numbers findings when two or more block. D6 adds the mapping. |
| CHANGELOG entry point | `CHANGELOG.md` top | Held - the top heading is `## v8.7.1 - 2026-11-16`; no `## Unreleased` heading exists yet. |

Not checked, with what the design assumes:

- A live `gh pr close` and a live `viewerCanClose` read on a real PR: no PR was closed. A false or unreadable value omits the close step.
- A live multi-PR run: `batch.md` was read, no set was run. The parent queues a reject pick and owns its menu like every other terminal pick.
- "Many sessions end with an issue that cannot be fixed without input" (user): the four exits exist; no run history was read, so frequency is unknown.
- Whether a repair worker can realize a ground 1-5 remedy within the repair budget: no approach repair was run. The design dispatches it like any blocker (D3 Repair); a repair that comes back without a fix takes the existing exits with D7 and D6.
- The exact command that dismisses a pull-request review on GitHub: not looked up. D6 fixes only that the gate shows that action and never runs it; the implementer reads the current GitHub REST documentation for it before writing the sentence.

## Acceptance criteria

Ticket #160, Acceptance Criteria, rows verbatim:

- [ ] When a PR's approach duplicates or contradicts an existing mechanism, convention or architecture rule of the repo, or introduces needless complexity, the first report names each such conflict. For complexity without a written prohibition, the report identifies a concrete simpler alternative that preserves the PR's intended outcome and explains why the added complexity is unnecessary. For other conflicts, it cites the existing mechanism, convention or architecture rule at the PR's base branch.
  in-scope
- [ ] That report carries a rejection justification of under 180 words in three headed sections - what the PR builds, why that does not fit this repo, what to do instead - with one short paragraph or one list per section, written for a reader without the code open (the shape and register of `skills/chase-bug/reference/verdict-report.md`).
  in-scope
- [ ] The first menu of that run offers a `reject` row, whichever state that menu is in. It is listed after `deliver` and `assess`; when it is the recommendation it takes row 1 with one sentence naming the conflict above `Pick one:`, like any recommended row, and no other explanation is added to the menu.
  in-scope
- [ ] The human can pick any other row on that menu: the run then proceeds as it does today and the approach conflict does not withhold merge.
  deviates: an approach conflict the developer does not reject is a blocker - assess posts it and a delivery course repairs it, so it withholds merge until repaired or overruled by the developer
- [ ] No menu rendered after a pick offers `reject`, and the approach is not judged again after a repair push.
  in-scope
- [ ] Picking `reject` puts one review carrying the justification on the PR at the reviewed commit - requesting changes on someone else's PR, a comment on the viewer's own - and ends the run with no repair; the PR stays open.
  deviates: the request replaces the immediate post with a previewed note, then post and close on the last menu
- [ ] When no conflict is found, the report and the first menu are the ones rendered today.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-160-gatekeep-reject-approach
contract:
- create: git worktree add .worktrees/<name> -b <branch>
- destroy: git worktree remove .worktrees/<name> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test (AGENTS.md Testing); node eval/run.mjs gatekeep-pr <sample> for the samples named in Tests
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: .pi/gauntlet-overrides.md
Rules: README.md
Rules: CHANGELOG.md
Rules: eval/README.md
Rules: doc/gate-contract.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: doc/install-internals.md
Rules: doc/implement-engines.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7
design: owns `skills/gatekeep-pr/` (SKILL.md, review-baseline.md, verification-brief.md, reference/*.md including the new reference/reject.md), `doc/gate-contract.md`, `doc/configuration.md`, `README.md`, `CHANGELOG.md`, `eval/gatekeep-pr/`, `extensions/lib/telemetry-leg.ts`, `extensions/telemetry-settlement-contract.test.ts`, the `bin/*.mjs` bundles `npm run build:bins` regenerates, and `scripts/gatekeep-reject.test.mjs`, `scripts/gatekeep-overrule.test.mjs`, `scripts/ci.mjs`; delivers every outcome in Design.

## Design

Paths below are relative to `skills/gatekeep-pr/` unless they start with another top-level directory.

### D0 Flow constraint

The change adds no step, helper, tracker stage, course or menu archetype. `course` keeps `null | assess | deliver | deliver-nits`. The delivery body, round and sync caps, re-entry rules and the continuation record's existing fields are unchanged. The additions are: one reviewer output section, one blocker class, one action row, one post-archetype state with its terminal outcome `rejected`, one typed command, one disposition value, three record fields (`reject`, `work_started`, `blocker_numbers`), and one rendering rule for stuck blockers. The only new edge between menus is `back` (D5).

Remove: none.

Add:

- `review-baseline.md`: `## Approach grounds` and one severity row (D1).
- `verification-brief.md`: the approach contract in Section C (D2), `viewer_can_close` in Section A's fixed query and permissions block (D5), the `reject`, `work_started`, `reject_withdrawn` and `blocker_numbers` record fields (D4, D6).
- `reference/assessment.md`: the whole-PR input for the approach judgment in `## Step-4 review task` (D2); in `## Helpers`, the `## Approach conflicts` section as part of the step-4 output contract whenever the approach contract was appended (D3).
- `reference/findings.md`: approach blockers, entry validation, the repair of the `instead:` remedy, the rejection-note payload and its exemption from post-time body composition, the `overruled` disposition (D3, D6).
- `reference/report.md`: the note in the first report, the stuck-blocker sections and the mixed layout, the carve-out in `## What stays out` (D3, D7).
- `reference/menus.md`: the `reject` action row, its recommendation rule and tie-break, the `reject` state and marker, the reject-menu step rows, the overrule hint (D4, D5, D6).
- `reference/reject.md` (new): `## Reject` (pick, menu execution, `back`, settlement) and `## Overrule` (parsing, eligibility, effect) (D5, D6).
- `reference/post-selection-loop.md`, each edit at the section that owns the rule today (D5, D6):
  - `### Next action`: `reject` joins own-merge, approved and closed-pr as a state whose menu parses a comma-separated set against the retained mapping; `back` joins `stop` in the combined-number refusal; `overrule <n>` joins the typed commands recognized before numeric lookup; pointers to `reject.md`.
  - `### Post steps`: a pointer to `reject.md` for the reject menu's steps.
  - `### Merge preconditions`: `overruled` in the first bullet.
  - `### Settlement rows`: `rejected` in the outcome list.
  - `### Teardown`: the `gauntlet: done rejected` branch, `reject` in the non-final-stop delegation list, and the note file in the deletion and retention rules.
  - `### Merge course`: one AC-coverage outcome line.
  The file stays under 50,000 bytes; procedure text beyond these clauses lives in `reject.md`.
- `reference/fix-wave.md`: the approach blocker's derived AC and evidence pack in `### Finding artifacts` (D3); approach blockers as closure-only prior items under their minted ids in `## Review before push` and `## Re-review task` (D2); overruled ids left out of the required closure ids, row reopening, the carried set and `## Evidence after push`'s rewritten-head push condition (D6).
- `reference/cleanup.md`: `reject` among the templates `## Non-final stop` enters for, and the skip of its worktree handling when the cleanup step already ran in the picked set (D5).
- `reference/batch.md`: queueing of a reject pick and an overrule answer (D8).
- `SKILL.md`: wording-table entries (D7).
- `doc/gate-contract.md`, `doc/configuration.md`, `README.md`, `CHANGELOG.md` (D9).
- `extensions/lib/telemetry-leg.ts` and `extensions/telemetry-settlement-contract.test.ts` for the `rejected` outcome, with the `bin/*.mjs` bundles regenerated by `npm run build:bins` and committed (D9).
- `eval/gatekeep-pr/`: `target.json` entry, `intent.md`, samples (D10); `scripts/gatekeep-reject.test.mjs`, `scripts/gatekeep-overrule.test.mjs`, and their entries in `scripts/ci.mjs`.

`agents/wave-reviewer.md` and `agents/pr-gatekeeper.md` are not edited: the approach contract is appended by the caller, as `fix-wave.md` `## Re-review task` already is.

### D1 Approach grounds (`review-baseline.md`)

Add `## Approach grounds`, data like the rest of the file:

| # | Ground | What it is | Evidence the entry must cite | Recommends reject |
|---|---|---|---|---|
| 1 | Second mechanism | A new way to do what the repo or its framework already does | The existing mechanism | yes |
| 2 | Architecture boundary | A responsibility or data path placed across a boundary, or at an owner, the repo's architecture rules exclude | The rule or the owning unit | yes |
| 3 | Unjustified reversal | Replaces a recorded decision or working behavior with no justification in the spec or the PR description | The decision record or the working behavior | yes |
| 4 | Weakened guard | Relaxes a check or invariant at its owner so the change fits, such as prevention replaced by cleanup | The guard and what it prevented | yes |
| 5 | Symptom-level fix | Fixes where the problem shows, or only the reported example, instead of where it starts | The owning layer or an uncovered input | yes |
| 6 | Needless machinery | A lasting mechanism where a named, much smaller change gives the PR's intended outcome | That smaller change and why it preserves the outcome | no |

Two validity tests bind every entry, stated under the table:

1. **Base evidence.** Grounds 1-5 cite, in the entry's `path:` field (D2), a file that exists on the PR's base branch. A mechanism the framework provides, or a decision recorded outside the repo (a ticket, a PR, a commit message), counts only through a base-branch file that configures or records it - the configuration that enables the framework feature, the document or changelog entry that states the decision; with no such file the entry is not an approach conflict. Ground 6 names the concrete smaller change in `smaller:` instead and cites no path.
2. **Main mechanism.** The remedy replaces the PR's main mechanism: the entry's `replaces:` field reads `main mechanism` and its `instead:` removes or replaces what `builds:` names. A remedy that edits part of the diff is an ordinary finding, not an approach conflict.

Add one row to `## Severity axis`: `Approach conflict (an entry under Approach grounds that passes both tests) | blocking`. A repo-root `REVIEW.md` overlays the table like any other baseline entry: it can add a ground, drop one, change the cited evidence, or change the last column. A ground an overlay adds without a `Recommends reject` value is `no`. A ground an overlay maps to non-blocking yields nits and grounds no note and no `reject` row.

### D2 Approach contract (`verification-brief.md` Section C, `assessment.md`, `fix-wave.md`)

Section C gains an approach contract the caller appends to the step-4 Review task on both harnesses whenever `work_started` is false (D4). The reviewer reads the whole `origin/<baseRefName>...<headRefOid>` diff, the source behind it, and the rule documents. The rule documents are a fixed set: the merged rubric and the overrides file as `assessment.md` `## Configuration` and `## PR gate` already resolve them (from the merge-base, unchanged), plus `AGENTS.md` and the documents it links directly (one hop, the convention `findings.md` `## PR-named steps` uses), read at `origin/<baseRefName>` - the revision the diff and D3's path check use. No other document grounds an architecture rule or a recorded decision. The reviewer emits after its native report and any closure lines:

```text
## Approach conflicts
A<n>: <ground name from the rubric>
builds: <the PR's main mechanism, one sentence>
path: <base-branch path[:line]>
conflicts with: <what exists at that path, one sentence>
smaller: <the smaller change and why it preserves the PR's outcome>
instead: <the remedy that replaces the main mechanism>
replaces: main mechanism | part of the diff
```

Each field is one line. `path:` and `conflicts with:` appear exactly for a ground whose rubric evidence is base-branch evidence (grounds 1-5); `path:` holds the path and an optional `:line` and nothing else. `smaller:` appears exactly for needless machinery (ground 6), which carries no `path:`. A ground a repo overlay adds takes `path:` unless its evidence column names a smaller change. The section reads `none` when no entry passes both tests. The reviewer's native verdict (`SHIP`, `FIX_FIRST`, `REJECT`) is never an input to this judgment.

`assessment.md` `## Step-4 review task`: with `delta: ancestor`, supply the whole base...head diff command as a separately labeled input for the approach judgment only. Line review stays bounded to `## Fix delta`; an approach entry is exempt from the outside-delta rule, as the contract judgments in that section already are.

Once `work_started` is true, the approach contract is never appended. `fix-wave.md` `## Review before push`, and any step-4 re-entry after that point, list each open approach blocker among the prior items under its minted `P#`/`L#` contributor ids - the ids the ledger and the closure table in `## Review before push` already key on - with its `builds:` and `instead:` text, and take one closure line per id (`<id>: resolved` or `<id>: open - <why>`). A `resolved` line closes that contributor exactly as it closes any other wave id, and the approach blocker leaves the rendered list once every contributor is resolved or overruled. `A<n>` stays on the blocker as provenance under `show evidence` and is never a closure id. No new approach conflict is minted once `work_started` is true. This is the reading of ticket row 5's "the approach is not judged again after a repair push".

A head move while `work_started` is false re-enters step 3 as today and judges the approach on the new head. A fresh reviewer numbers `A<n>` anew, so each re-emitted entry is matched to the run's approach blockers by its conflict key: the ground name plus the `path:` value without its line (grounds 1-5), or the ground name alone for a ground with no `path:` (ground 6; a second such entry in one judgment merges into the first under the one-defect rule). An entry whose key matches reuses that blocker's `P#` and keeps its `overruled` disposition for the rest of the run. An entry with a new key mints a new blocker. An approach blocker no entry matches is closed as no longer reported; its id stays in the ledger.

### D3 Integration, report and note (`findings.md`, `report.md`)

**Validation.** For each entry the orchestrator checks, in this order:

| Check | Drop reason |
|---|---|
| The ground is in the merged rubric | `unknown ground` |
| Ground with base evidence: `path:` is present | `no base path` |
| Ground with base evidence: `git -C <worktree> cat-file -e origin/<baseRefName>:<path>` succeeds, with any `:line` suffix removed | `base path missing: <path>` |
| Ground 6: `smaller:` is present; no `cat-file` runs | `no smaller change` |
| `instead:` is present | `no remedy` |
| Main mechanism: `replaces:` reads `main mechanism` and `instead:` removes or replaces the mechanism `builds:` names | `remedy edits part of the diff` |

An entry that fails a check mints no approach blocker and prints one `show evidence` line `approach entry dropped - <reason>`; a native finding the reviewer reported for the same code keeps its own severity.

**Blocker.** Each valid entry mints one `P#` blocker carrying its ground, its conflict key (D2) and its `A<n>` as provenance. `## Namespaces` lists approach conflict among blocker contents. The one-defect rule applies: a native finding or an open prior item (`R#`) for the same defect merges into that blocker and keeps its own id in the ledger. A merged contributor is recorded `same flaw` when closing it needs the entry's `instead:` remedy - a native finding on the mechanism `builds:` names, or a prior-review item that posted the same conflict - and shares the approach blocker's eligibility in D6. A contributor the one-defect rule combined for another reason (a requirement gap, a contradicted claim, a failing check) is independent and keeps its own prerequisites.

**Repair.** A delivery course repairs every open approach blocker; step 5 never withholds a dispatch by pre-judging the remedy. The finding to close is the entry's `instead:` remedy, with `builds:`, the base path and the tests in the diff that exercise the replaced mechanism (or `no scoped test`) as its evidence pack. On pi that is the row's derived AC (`fix-wave.md` `### Finding artifacts`) and the worker chooses the fix; on Claude Code the helper works from that text when step 5 drafted no concrete edit. Step 5 drafts a concrete payload only when the remedy is a contained edit. Row dispatch, budgets, admission, round charging, the pre-push review and its closure line (D2) are the ordinary ones. The payload rule is unchanged and read against the remedy: the smallest in-repo edit that realizes `instead:` and keeps the behavior the PR promises, never added infrastructure, a dependency or a new module. A worker that cannot realize the remedy inside those limits returns as any worker does today - `needs <what>`, `contract exception: <why>`, or failed attempts up to the row's allowance - after its attempt, and the blocker takes the existing exit, D7's sections and D6. Picking `deliver` sets `work_started` (D4), so that run does not offer `reject` again.

**Report.** In part two of the first report each approach blocker is one or two sentences naming what the PR builds and what it conflicts with, with the base path trailing the claim (ground 6: the smaller alternative and why the added machinery is unnecessary). Ticket row 1 binds this.

**Note.** While `reject` is offered (D4), step 5 drafts the rejection note and saves it to `mktemp "${TMPDIR:-/tmp}/gatekeep-note.XXXXXX"` before the menu renders. The note has exactly three sections, `### What this PR builds`, `### Why it does not fit this repo`, `### What to do instead`, under 180 words from the first heading to the last word, one short paragraph or one list per section, in the register of `skills/chase-bug/reference/verdict-report.md` `## Register` (a reader with neither the code nor the run's notes open; each component's everyday role before its name; no internal ids; a base path trails the claim it supports). It covers every open approach blocker and nothing else. The first report prints the saved text in full after the problems and before the recommendation sentence, under one plain lead-in sentence. `report.md` `## What stays out` names the note as the one drafted body printed outside `show evidence`; its existing sentence keeping full drafted file edits, description bodies and replies behind that command stays, because `scripts/gatekeep-comment-reconcile.test.mjs` asserts it.

**Frozen bytes.** The note is drafted and passed through SKILL.md `### Output done-check` once, before its first display; the checked text is saved and its SHA-256 recorded in `reject.note_sha256` (D4). From then on the file's bytes are the note: the first report, the reject menu and the note step's `body` all read that file, and nothing rewrites it. `findings.md`'s rule that composes a review body at post time does not apply to the note, and the done-check before the post does not rewrite it.

| Event | Note file and record |
|---|---|
| Step-5 re-entry with the same open approach blockers on the same head (a refresh, `show evidence`, a refused command) | Reuse the file; no redraft. |
| The file is missing or unreadable at a render | Redraft, done-check, save, record the new hash, and display it; that display is a new preview. |
| The set of open approach blockers changes (an overrule, a head-move rejudgment) | Redraft from the remaining blockers the same way and display the new text. |
| No open approach blocker remains, or `work_started` or `reject_withdrawn` becomes true (`back` included) | Delete the file and set `reject` to null; the report carries no note. |
| The note step posted it | Delete the file at teardown. |
| The note step failed or was skipped, or `stop` on the reject menu | Retain the file and name it in teardown's not-run sentences, as for any unrun or failed post payload. |
| Any ending outside the reject menu | `### Teardown` deletes the file with the run's other temporary files. |

**Missing section.** With the approach contract appended, `## Approach conflicts` is part of the step-4 output contract. A reviewer output without it is off-contract helper output and takes the existing failure path in `assessment.md` `## Helpers` (the step stops, the failure is quoted, `stop` is offered); no report or menu is rendered from it, so an unjudged PR never reaches readiness. A section reading `none` is the successful no-conflict result and adds nothing to the report or the menu (ticket row 7).

Example first report (synthetic):

> This PR adds a nightly job that rebuilds the search index from its own copy of the catalog. The indexing behavior the spec asks for is covered; you are a requested reviewer.
>
> One problem blocks merging: the PR keeps a second copy of the catalog in a new table, while every other consumer reads catalog changes from the change feed (`docs/architecture.md`).
>
> If you reject this PR, the author reads this note:
>
> ### What this PR builds
>
> A nightly job that copies the whole catalog into a new table and rebuilds the search index from that copy.
>
> ### Why it does not fit this repo
>
> Catalog data has one owner, and other parts of the system learn about changes from the change feed, the stream that announces every catalog edit, `docs/architecture.md`. A second copy can disagree with the owner between runs, and nothing in the description says why the feed is not enough.
>
> ### What to do instead
>
> Update the search index from the change feed, as the pricing and export parts do, and drop the new table and the nightly copy.
>
> I recommend reject because the second catalog copy breaks the one-owner rule and the fix is a different design.
>
> Pick one:
> 1. reject - show this note again with the steps to post it and close the PR; nothing is written until you pick a step. [recommended]
> 2. deliver - repair the problem, merge main into the branch if it falls behind, watch the checks, and continue until merge is offered.
> 3. assess - post the problem to the PR as a review and make no repairs.
> 4. stop - remove the worktree and leave the PR as it is.
>
> Type a number; show evidence prints the full record; overrule <n> sets problem <n> aside for this run.

### D4 The `reject` row (`menus.md`, `verification-brief.md`)

`## action` gains one row directly after `assess`:

| Row | Availability | Pick |
|---|---|---|
| `reject` | Initial or obstacle state; `work_started` false; `reject_withdrawn` false; at least one open approach blocker; PR `OPEN` | Open the reject menu through `reject.md` `## Reject`. Write nothing. |

**One predicate, one withdrawal.** The continuation record gains `work_started: false | true` and `reject_withdrawn: false | true` (`verification-brief.md`), both initialized false and never reset inside a run. `work_started` is the test for every pick that starts work and for ticket row 5's second clause: D2 appends the approach contract only while it is false, and `reject` is offered only while it is false. `reject_withdrawn` covers the one pick that returns to a menu without starting work: `back` sets it true and persists it (D5), and `reject` is offered only while it is false. Together they make row 5's first clause hold as written: no menu rendered after a numbered pick offers `reject`. A pick sets `work_started` true and persists it before that pick's first dispatch or external write:

| Pick | Sets `work_started` |
|---|---|
| `deliver`, `deliver with nits` | yes - a dispatched repair |
| `fix nits` | yes - a dispatched repair, although `course` stays unchanged |
| `assess` | yes - a posted review |
| `approve workflow run` | yes - an approval |
| `approve` | yes - an approval |
| `merge` | yes |
| `reject`, `back`, `stop`, the reject menu's steps | no - `back` sets `reject_withdrawn` instead |
| Typed commands (`show evidence`, `check <name> ...`, `overrule <n>`) | no |

Assess-terminal, any menu under a set course, final, the post menus, and an initial or obstacle menu rendered after a `fix nits` push or a workflow approval therefore never offer `reject`, and the reject menu itself offers steps, never a second `reject` row. The first menu re-rendered by `back` does not offer it either (D5): rejecting after backing out takes a new run. Availability does not depend on close permission, authorship or draft state.

`## Recommendation` gains a rule matched before rule 1: with `reject` offered and an open approach blocker whose ground recommends reject, recommend `reject`; the sentence above `Pick one:` names that conflict and adds nothing else. With several such blockers open, the sentence names the first one in report order and stays one sentence. With only ground-6 blockers open, `reject` is offered and the existing rules choose the recommendation.

The continuation record also gains `reject: null | { note_path, note_sha256, menu_open: false | true }`, initialized null, set when the note is drafted (D3), and `blocker_numbers` (D6).

### D5 The reject menu (`menus.md`, `reject.md`, `cleanup.md`)

`## States` gains one row after `closed-pr`:

| State | Entry | Archetype | Rows switched off | Marker |
|---|---|---|---|---|
| reject | A `reject` pick, until `back`, `stop` or the picked steps finish | post | Drafted replies, coverage, PR-named steps, cleanup overrides, wait | Start the message with `gauntlet: gate=gatekeep-pr/reject` |

Entering it sets `reject.menu_open` true and runs the pre-menu refresh. The message is: the marker with `recommended=1`, one lead-in sentence, the saved note in full and unfenced, the recommendation sentence, `Pick one, or several separated by commas:`, the rows, the standard hint. Steps, in execution order:

| Step | Availability and pick |
|---|---|
| post the rejection note | Always. Post the saved note as one review at the reviewed commit: requesting changes on someone else's PR, a comment on the viewer's own. |
| close the PR | `permissions.viewer_can_close` true. Run `gh pr close <N> -R <base-owner>/<base-repo>` with no comment and no branch deletion. |
| cleanup | As `## post` defines it; `cleanup.md` steps 1-3 unchanged. |
| back | Always; a single pick only. Return to the first menu, which no longer offers `reject`. |
| stop | Always; last. |

With two or more runnable steps among note, close and cleanup, row 1 is their combination, tagged `[recommended]`; each step keeps its own row below. `post-selection-loop.md` `### Next action` adds `reject` to the states whose menu parses a comma-separated set of displayed numbers against the retained `post_steps` mapping (own-merge, approved and closed-pr today): row 1 expands to its steps and a duplicate step runs once in step order. `back` and `stop` are never part of a combination: either combined with another number takes the existing one clarifying question and runs nothing. When `viewer_can_close` is false or unreadable the close row is omitted with one sentence above the prompt ("GitHub does not let you close this PR", or that the permission could not be read); the note step stays.

`verification-brief.md` Section A adds `viewerCanClose` to the fixed GraphQL query and `viewer_can_close` to `permissions`, decoded like `bypass_eligible`: `true` alone establishes it; false stays false; null, missing, non-boolean or a failed response is `unreadable`. The pre-menu refresh re-reads it.

Example (synthetic):

> gauntlet: gate=gatekeep-pr/reject recommended=1
>
> This is the note the author will read:
>
> (the three sections, as in the report)
>
> I recommend all three steps because the note explains the closure and the worktree is no longer needed.
>
> Pick one, or several separated by commas:
> 1. post the rejection note, close the PR, cleanup - rows 2, 3 and 4. [recommended]
> 2. post the rejection note - post it as a review requesting changes at the commit being reviewed.
> 3. close the PR - close acme/widgets#88 without merging; its branch stays.
> 4. cleanup - remove .worktrees/pr-88 (including untracked files); the local branch stays because the PR is not merged.
> 5. back - return to the previous menu without the reject row; nothing is posted or closed.
> 6. stop - post and close nothing, remove .worktrees/pr-88, and end the run.
>
> Type a number; show evidence prints the full record.

The `stop` row names the worktree removal because the run then ends through `cleanup.md` `## Non-final stop`, which removes an eligible worktree, as the initial menu's `stop` row already says.

**Execution (`reject.md` `## Reject`).** The reject pick passes the same freshness boundary as every pick in `post-selection-loop.md` `### Next action`. Picked steps run note, close, cleanup through `### Post steps` (persisted `post_steps` entries, one result line each, no retry, failed-step continuation), with these rules:

- Before the note, run the compare-and-swap freshness read. A moved head, a changed description or a changed base prints `post the rejection note: skipped - PR changed since review` and the same for close. A PR no longer `OPEN` prints `skipped - PR is <state>` for both.
- Before the note, hash the saved file and compare it with `reject.note_sha256`. A missing file or a different hash prints `post the rejection note: skipped - note changed since preview`; the post never sends text the developer did not see, and a later post needs a new render of the note (D3 `Frozen bytes`). The output done-check ran before the first display and rewrites nothing here.
- The note post is the assess POST (`gh api --method POST repos/<base-owner>/<base-repo>/pulls/<N>/reviews` with `commit_id`, `event`, `body`), with `body` the saved file's bytes and the same response `commit_id` check. No review body is composed at post time.
- A failed or skipped note post prints its reason; a close picked in the same set prints `close the PR: skipped - note not posted`.
- After `gh pr close` exits zero, read `gh pr view <N> --json state` and record `pr.state`. A failed close prints GitHub's error and leaves the PR open with the note on it.
- A close picked alone closes the PR without a note; that is the developer's explicit pick.
- Cleanup runs whenever it was picked and is eligible, alone or after a failed or skipped note or close, under the existing failed-step continuation: it is the developer's explicit pick and its row names the removal. It never counts toward `rejected`. Its `post_steps` result records that it ran.

**Back.** Set `reject_withdrawn` true and persist it, drop the reject menu's `post_steps` entries, delete the note file, set `reject` to null, and run the pre-menu refresh. With head, description and base unchanged, re-render the first menu through the existing unchanged-head re-entry (step 5) with the same problems and standing; no helper runs. The note and the `reject` row are gone, the existing recommendation rules choose row 1, and on this re-render one sentence above the recommendation sentence says the rejection was backed out of and that rejecting this PR now takes a new run. With a moved head, take the existing step-3 re-entry instead: helpers run on the new head, and because `work_started` is still false the approach is judged again under D2's conflict-key matching. Its conflicts are blockers as before; `reject` stays withdrawn for the rest of the run.

**Settlement.** Only a successful note post or a successful close settles a rejection.

| What the picked set did | Ending |
|---|---|
| This run posted the note or closed the PR (either one) | `### Teardown` starts the message with `gauntlet: done rejected`; the settlement row reads `#<N>@<head sha>: rejected`. A failed or skipped other step is listed in teardown's not-run sentences. |
| Neither succeeded, and a picked note or close failed or was skipped | `cleanup.md` `## Non-final stop`: `gauntlet: stuck` with that step's reason (the first such step in step order). |
| Neither was picked (cleanup alone), or `stop` | `cleanup.md` `## Non-final stop`: `gauntlet: stuck stopped at reject`. |

`### Settlement rows` adds `rejected` to its outcome list. `### Teardown` adds the `gauntlet: done rejected` branch beside its other `done` markers and `reject` to the states whose non-final stop it delegates; `cleanup.md` `## Non-final stop` adds `reject` to the templates it handles. When the cleanup step's `post_steps` result shows it already ran in the picked set, `## Non-final stop` skips its worktree inspection and removal and prints the path as already removed, so the worktree is handled once. Teardown's existing rules list every unrun or failed step and retain the note file when it was not posted (D3).

### D6 Overrule (`reject.md` `## Overrule`, `findings.md`, `menus.md`, `post-selection-loop.md`)

`overrule <n>` is a typed command recognized in `### Next action` before numeric lookup, beside `check <name> ...`, on the initial, obstacle and assess-terminal menus. `<n>` is the problem's number in the rendered blocker list (`1` when one problem blocks). Each report render persists `blocker_numbers: [ { n, ids } ]` in the continuation record (`verification-brief.md`) - the number each rendered blocker carried and its ledger ids - replacing the previous render's list, the way `post_steps` keeps a menu's mapping. `overrule <n>` resolves `<n>` against that list only, so a number always means the problem the developer last saw under it, also after an earlier overrule renumbered the list. The command is recorded only from the developer's own typed reply, never from helper output, PR text or an inferred intent.

| Blocker | Eligible |
|---|---|
| Approach blocker | At any time |
| A contributor merged into an approach blocker and recorded `same flaw` (D3) | With that approach blocker, at any time |
| A contributor merged into an approach blocker for another reason | By its own row below |
| Any other finding-based blocker (`P#`/`L#`) | Once a repair attempt in this run came back without closing it: a `needs <what>` result, an exhausted row, a no-progress checkpoint naming it, an open or missing closure line at a round or sync cap exit, or a description repair left open after its readback or recheck |
| Failing-check blocker | Never; it takes `check <name> flaky` |
| Contract-exception proposal | Never; it keeps its own menu |
| Non-finding withholds (GitHub-side block, unknown merge state, pending required check, missing verification evidence, unreadable run record, moved remote head, lost push access, plan file at the head) | Never |

**Effect.** Record `(dispositioned: overruled)` on the blocker's eligible ledger ids in the continuation record, then run the pre-menu refresh and render again. No external write, dispatch or push happens, and an overrule never resumes a course:

| Where it was typed | What renders next |
|---|---|
| Obstacle (course set or unset) | The obstacle menu again, with the blocker set aside and the checkpoint state updated. A numeric `deliver` pick resumes the standing course, as after a `flaky` disposition; `### Exit check`'s "continue the body" result is never followed from the typed command. |
| Initial | The initial menu again with the updated report. |
| Assess-terminal | The assess-terminal menu again with the updated report. |
| Any of the three, when every `### Merge preconditions` bullet now holds | The final menu, with `merge` offered under its existing availability. |

- `### Merge preconditions`: the first bullet reads "every blocker fixed and pushed, or dispositioned `flaky` or `overruled` by the user". Every other precondition stays binding.
- A review this run's `assess` already posted stays on the PR: overrule dismisses nothing. When GitHub still withholds the merge because that review requests changes, the existing GitHub-side block renders instead of `merge`, and its sentence names the review this run posted and the action that lifts it (dismissing that review on GitHub), which the developer performs; the gate never runs it.
- `assess` posts open blockers only, so an overruled blocker is left out of the review. A delivery course leaves it unrepaired through the existing "Skip findings closed by user disposition" rule and never dispatches its row again.
- Inside a repair wave (`fix-wave.md`), an overruled id is neither resolved nor open: it is left out of the closure ids `## Review before push` requires, it reopens no row on an open or missing closure line, it is not in the carried set a retry takes, and it does not count in the rewritten-head push condition ("every carried `P#` has a `resolved` closure line"). The existing sentences that mark a finding resolved only from a `resolved` closure line stay as they are; an overruled id is never marked resolved. The pre-push review still reviews every commit the wave retained, including commits an exhausted repair of the overruled blocker left unpushed, and every finding on them that was not overruled.
- Overruling every blocker a no-progress or `needs` checkpoint names settles that checkpoint; usage counters and caps are unchanged.
- A blocker that combines several contributors loses only the eligible ones; while any contributor stays open, the blocker stays rendered with the remaining problem.
- An overruled requirement gap renders in the after-merge `AC coverage` block as `not covered - overruled in this run`, never `covered`. The phrase applies only to the scope row whose gap `L#` contributor was overruled; every other row keeps today's outcome, and a row with a still-open contributor keeps blocking.
- Part two of every later report names overruled problems in one sentence ("You set aside one problem for this run: <what>"); `show evidence` lists them with their annotation.
- The disposition lives in this run's record only. A later run judges the PR afresh.

**Refusals.** A number outside the list, a blocker that is not eligible, or a missing number gets one sentence saying why (for a not-yet-stuck blocker: it can be set aside only after a repair attempt comes back without a fix; for a failing check: the `check` command) and the same menu again. Nothing is recorded and no `gauntlet: question` marker is emitted.

**Hint.** `menus.md` appends the literal `overrule <n> sets problem <n> aside for this run` (placeholders printed as written, no number substituted) to the hint line only when at least one rendered blocker is eligible, so a first report without an approach conflict keeps today's hint (ticket row 7). Overrule is never the recommendation and adds no menu row.

### D7 Stuck-blocker sections (`report.md`, `SKILL.md`)

At an obstacle or cap exit, every open blocker a repair attempt in this run returned unrepaired is rendered as a plain line `Problem <n>` followed by three sections, under 180 words per blocker from the first heading. The population does not depend on D6 eligibility: it is the blockers meeting D6's second-row condition plus a failing-check blocker whose repair came back without the check passing, including `### Exit check`'s `Same check red twice` exit. A payload-admission failure (D3) counts as returned unrepaired.

- `### What is blocked` - the problem in the reader's terms, keeping the supplied `path:line` and failing-test name.
- `### Why the repair stopped` - what the repair tried and the one observed result (the failing test's output line, or the input that is missing), taken from the row's admitted decision lines, the helper's result, the no-progress checkpoint and the scoped-test output. An unknown cause is stated as unknown; nothing is invented.
- `### What you can do` - one list item per choice actually available for this blocker on the menu below, each with its consequence, and no other: retry with `deliver` once the named input changes, `assess`, `stop`, and the blocker's own typed command. For a blocker D6 makes eligible that command is `overrule <n>`. For a failing-check blocker it is the applicable `check <name> flaky | real | ci-broken` disposition, and `overrule` is not listed.

The register is `verdict-report.md` `## Register`: role before name, no colon-prefixed evidence labels, no internal ids, no decision-line wording. Other open blockers on the same report keep the one-or-two-sentence form. In a mixed report every blocker keeps its number from the one rendered list (`blocker_numbers`, D6): a non-stuck blocker is its numbered one-or-two-sentence item, a stuck blocker is its `Problem <n>` block in the same position. Obstacles that are not finding-based (GitHub-side block, unknown merge state, check timeout, unreadable record, moved remote head) read as today. The recommendation stays the one sentence above `Pick one:`.

Example of a mixed report's problems part (synthetic; problem 1 is not stuck, problem 2 is):

> Two problems block merging.
>
> 1. The import accepts a file with no header row and stores its first data row as column names (`src/import.js:41`).
>
> Problem 2
>
> ### What is blocked
>
> The export still drops rows whose name contains a comma; the test `exports quoted names` in `test/export.test.js` fails.
>
> ### Why the repair stopped
>
> The repair changed how the CSV writer quotes names, twice. Both times the same test failed with "expected 3 rows, got 2". Why a row is still lost is unknown.
>
> ### What you can do
>
> - Pick deliver once the test or its input changes; a retry with nothing changed is refused.
> - Type `overrule 2` to set this problem aside for this run; merge is offered once nothing else blocks.
> - Pick assess to post it to the PR for the author.
> - Pick stop to end the run.

`SKILL.md` `## Wording rules` table gains: approach conflict -> "the PR's design does not fit this repo"; overruled -> "you set this problem aside for this run"; stuck blocker -> "a problem the repair could not fix". The exceptions list in that section adds the note's and the stuck blocker's `###` headings and the `Problem <n>` line.

### D8 Multi-PR mode (`batch.md`)

- A `reject` pick on a child's queued menu is a parent-owned terminal pick: it queues until the round's last pick, then the parent renders that PR's reject menu in its own message, starting with `gauntlet: gate=gatekeep-pr/reject`, from the retained record and note file. The parent runs its picked steps through `reject.md` `## Reject` from the primary checkout, after all children finish.
- `back` with head, description and base unchanged returns the PR to the next round with no child dispatch: the parent re-renders its retained report without the note and its menu without the `reject` row (D5). With a moved head the PR takes the existing step-3 re-entry: the next round dispatches its child on the new head like any other head move, and `work_started` in the retained record decides whether that reassessment judges the approach (D2).
- `overrule <n>` typed at a PR's menu turn queues as that PR's answer for the round, like a check disposition; the child records it and returns the re-rendered report and menu in the next round. It resumes no course there either (D6).
- A rejected PR retires with the `rejected` settlement row.

### D9 Contract and docs

- `doc/gate-contract.md`: gate rows for `gatekeep-pr/reject` (one per file carrying the literal), a terminal row for `gauntlet: done rejected` per file carrying the literal (`post-selection-loop.md` `### Teardown` owns the marker, like the other gatekeep `done` rows), `reject` added to the non-final stop row, and the archetype paragraph names reject as a post variant entered from the action menu. The same `## Gatekeep menus` paragraph's recommendation summary gains the reject rule (an open approach blocker whose ground recommends reject favors `reject` while it is offered). `## Reading a reply`'s `N. rows` row adds the reject menu to the menus that accept a comma-separated set, with `back` and `stop` excluded from a set, and adds `overrule <n>` to the typed commands recognized before numeric parsing, with its eligibility in one clause (an approach blocker at any time; another finding-based blocker once a repair attempt returned it unrepaired).
- `doc/configuration.md`: the gatekeep-pr row of the settlement-token table gains `rejected`.
- `extensions/lib/telemetry-leg.ts`: the gatekeep-pr outcome pattern gains `rejected`, so a `#<N>@<head sha>: rejected` settlement row yields a leg item. `extensions/telemetry-settlement-contract.test.ts`: `gauntlet: done rejected` joins the expected terminal set, `reject` the expected gate ids, and `rejected` the parsed outcomes and the configuration-row expectation. `npm run build:bins` regenerates the `bin/*.mjs` bundles, committed in the same change (AGENTS.md Testing).
- `README.md`: the gatekeep paragraphs on courses and menus gain the approach blockers, the `reject` row and its menu, `overrule <n>` and the stuck-blocker sections; `## REVIEW.md convention` says an overlay can add or retune approach grounds.
- `CHANGELOG.md`: a new `## Unreleased` heading with the entry, trailing `(#160)`.

### D10 Eval, tests and paid actions

`eval/gatekeep-pr/target.json` gains `{ "path": "skills/gatekeep-pr/reference/reject.md", "new": true }`. Samples that need `review-baseline.md`, `batch.md` or `skills/chase-bug/reference/verdict-report.md` add them with `bundle+:`. `eval/gatekeep-pr/intent.md` is rewritten for this change; its `for:` SHA is regenerated for the edited bundle, because `scripts/gatekeep-comment-reconcile.test.mjs` binds that value to the assembled bundle. New samples and the must-hold facts of each are listed in Tests; `consent-no-progress-stop` and `row-exhaustion` get updated `expected.md` files for D7.

**Paid actions.** The implementer runs `node eval/run.mjs gatekeep-pr <sample>` for each sample named in Tests, with `--baseline-only` seeding where `eval/README.md` requires a baseline; these are model calls. Approving this spec authorizes every such run for the whole flow, across seed, rows, repairs and finish, with no per-step prompt. No live PR is reviewed, posted to or closed: the note post and the close are checked by samples and text tests only.

## Errors and edge cases

- Reviewer output has no approach section although the contract was appended: off-contract helper output; the step stops through the existing helper-failure path and no report or menu is rendered. A section reading `none` is the no-conflict result (D3).
- An approach entry names no rubric ground, has no `path:` or a path missing on the base branch (grounds 1-5), has no `smaller:` (ground 6), gives no remedy, or marks its remedy as editing part of the diff: dropped with one `show evidence` line naming the reason (D3).
- A framework mechanism or a decision recorded outside the repo with no base-branch file that configures or records it: not an approach conflict (D1).
- A repo `REVIEW.md` maps a ground to non-blocking: its entries are nits; no note, no `reject` row for them (D1).
- Only ground-6 blockers open: note and `reject` row present, `reject` not recommended (D4).
- Head, description or base changed between the reject menu and the note: note and close are skipped as `PR changed since review` (D5).
- PR closed or merged by someone else while the reject menu waits: the `closed-pr` state takes precedence at the next render; a picked note or close prints `skipped - PR is <state>` (D5).
- Note post fails: close is skipped as `note not posted`; nothing is retried (D5).
- Close fails: the PR stays open with the note posted; the run still ends `rejected` (D5).
- No permission to close, or the permission is unreadable: the close row is omitted with one sentence; reject still posts the note (D5).
- `back` after a head move: the existing step-3 re-entry runs, in multi-PR mode through a child dispatch, and, with `work_started` false, the approach is judged on the new head with overrules kept by conflict key; `reject` stays withdrawn (D2, D5, D8).
- A `fix nits` push or a workflow approval, then a new head: `work_started` is true, so the approach is not judged again and `reject` is not offered (D4).
- The note file is missing or changed between the preview and the post: the note step is skipped as `note changed since preview`, a picked close as `note not posted` (D5).
- Cleanup picked alone, or with a note or close that failed or was skipped: cleanup runs when eligible, the run does not end `rejected`, and `## Non-final stop` does not handle the worktree a second time (D5).
- `overrule` at an obstacle with other repairable blockers open: the obstacle menu renders again; the course resumes only on a numeric `deliver` (D6).
- `overrule` on assess-terminal after this run posted a review requesting changes: the review stays; when GitHub withholds the merge over it, the withhold renders with the dismissal action instead of `merge` (D6).
- An overruled blocker with commits a failed repair left unpushed: its id is left out of the closure and push checks, and the retained commits are still reviewed before any push (D6).
- A failing check the repair returned unrepaired: rendered in the three sections with its `check` command; `overrule` is refused for it (D6, D7).
- `back` or `stop` combined with another number: one clarifying question, nothing runs (D5).
- `overrule` with a wrong number, an ineligible blocker or no number: one sentence, same menu, nothing recorded (D6).
- Every approach blocker overruled: the note file is deleted and the `reject` row disappears (D3, D6).
- A combined blocker with an independent, ineligible contributor: only the eligible contributors are lifted. A `same flaw` contributor (a native finding or prior-review item for the same conflict) is lifted with its approach blocker (D3, D6).
- An overruled blocker in a later run: not remembered; the conflict is judged again (D6).
- A remedy the worker cannot realize: the repair is dispatched and charged like any other; a `needs <what>` return, a contract exception or an exhausted row takes the existing exit, and the blocker takes D7 and D6 (D3).
- A prior review that already posted an approach item: the new entry merges into that item's blocker under the one-defect rule (D3).

## Tests

Eval samples live under `eval/gatekeep-pr/samples/<name>/`; each line names the must-hold fact.

- The first report names each conflict with its base path, and a needless-machinery conflict with its smaller alternative and why the machinery is unnecessary - sample `approach-conflict-report`
- The report carries the note: three headings in order, under 180 words, one paragraph or list per section, no internal ids - sample `approach-conflict-report`
- `reject` is listed after `deliver` and `assess`; with a ground 1-5 conflict it is row 1 with one sentence naming the conflict; with only ground 6 it is offered and not recommended - sample `reject-row-first-menu`
- Picking `assess` posts the approach blocker in the review; picking `deliver` dispatches the repair of every open approach blocker with its `instead:` remedy as the finding to close, including a remedy that replaces the main mechanism and has no drafted edit; a repair returned `needs <what>` exits `stuck - needs <what>` with the three sections; merge is withheld while the blocker is open - sample `approach-blocker-other-row`
- Assess-terminal and an obstacle under a set course offer no `reject`; the pre-push review gives closure lines for approach blockers under their minted `P#`/`L#` ids, a `resolved` line closes the blocker, and no new conflict is minted; after a `fix nits` push a new head is not judged for approach - sample `reject-not-after-pick`
- The reject menu shows the full note text identical to the report's, row 1 combines note, close and cleanup, a comma-separated set runs its steps once in step order, the posted `body` is the saved file's bytes, and the settlement is `rejected` - sample `reject-menu-note-preview`
- A reviewer output whose approach section reads `none` renders today's report, menu and hint - sample `approach-none-unchanged`
- `back` on an unchanged head re-renders the first menu with the same problems, no `reject` row, no note and the one sentence saying a rejection now takes a new run, runs no helper and writes nothing; `back` after a head move re-enters step 3, judges the approach again and still offers no `reject`; `stop` removes the worktree and ends `stuck stopped at reject` - sample `reject-back`
- Failed note post skips close and ends `stuck` with the note's reason; failed close leaves the PR open and ends `rejected`; a changed PR skips both; a note file changed since the preview skips the post; cleanup alone ends `stuck stopped at reject`; a failed note with cleanup removes the worktree once and does not end `rejected`; no close permission omits the row with its sentence - sample `reject-step-failures`
- An entry with a missing base path, no `path:` field or a remedy marked `part of the diff` mints no approach blocker and prints its drop reason; a ground-6 entry runs no path check; a reviewer output without the section stops as off-contract helper output and renders no menu - sample `approach-local-instance`
- `overrule <n>` on an approach blocker removes it from the blocker list, names it as set aside, drops the note and the `reject` row when it was the last, and offers merge when nothing else blocks; a native finding and a prior-review item recorded `same flaw` are set aside with it, an independent contributor stays - sample `overrule-approach`
- `overrule <n>` is refused for a not-yet-stuck defect and for a failing check, accepted after a no-progress exit; at an obstacle with another repairable blocker it re-renders the obstacle and pushes nothing until `deliver` is picked; after an exhausted repair that left unpushed commits the overruled id is not required among the closure lines and the commits are still reviewed; an overruled requirement gap reads `not covered - overruled in this run` on its own scope row only; on assess-terminal the posted review stays and its GitHub withhold renders with the dismissal action - sample `overrule-stuck-blocker`
- A no-progress exit, an exhausted row and a failing check the repair returned unrepaired render `Problem <n>` with the three sections under 180 words, the observed result quoted, and one item per available choice - the check blocker lists its `check` command and no `overrule`; a non-stuck blocker on the same report keeps its numbered short form - samples `stuck-blocker-sections`, `consent-no-progress-stop`, `row-exhaustion`
- In a set, a reject pick queues until the round's last pick, the parent renders the reject menu, `back` on an unchanged head returns the PR to the next round with no child dispatch and no `reject` row, and `back` after a head move dispatches its child - sample `batch-reject-queue`
- The reference files carry the `reject` row, state, marker, step rows, the comma-set and teardown clauses, settlement outcome and the six grounds - `scripts/gatekeep-reject.test.mjs`
- The reference files carry the overrule eligibility table, the merge-precondition wording, the literal hint, the `blocker_numbers` field and the stuck-blocker headings - `scripts/gatekeep-overrule.test.mjs`
- A `#<N>@<head sha>: rejected` settlement row parses to a gatekeep-pr leg item, and the contract's gatekeep terminal set and the configuration token row include `rejected` - `extensions/telemetry-settlement-contract.test.ts` (run by `npm test`)
- The committed `bin/*.mjs` bundles match the edited `extensions/lib/telemetry-leg.ts` - bin bundle freshness (run by `npm test`)
- The `## What stays out` sentence and the `intent.md` `for:` SHA still satisfy their existing assertions - `scripts/gatekeep-comment-reconcile.test.mjs` (run by `npm test`)
- Every new `gauntlet:` literal has a contract row - `scripts/gate-contract-lint.mjs` (run by `npm test`)
- `post-selection-loop.md` and every other skill file stay under the size limit - `scripts/skill-size-lint.mjs` (run by `npm test`)
- A live note post and a live close on GitHub - none: no PR is posted to or closed during verification
- A live multi-PR run - none: set mode is covered by `batch-reject-queue` only

## Documentation impact

Materiality bar: `reference/documentation-impact.md`.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` - gatekeep courses and menus, and `## REVIEW.md convention` (major procedures / conventions; operations / tunable parameters for the overlayable grounds); `doc/gate-contract.md` - gate `gatekeep-pr/reject`, outcome `gauntlet: done rejected`, the reject-menu set reply, `overrule <n>` and the reject recommendation rule (communication contracts / integrations); `doc/configuration.md` - `rejected` among the gatekeep-pr settlement tokens (communication contracts / integrations); `CHANGELOG.md` - `## Unreleased` entry (major procedures / conventions)
- Derived / memory docs invalidated: none

## Out of scope

- Passing a human hint to the repair worker (`hint:` in the row task); a separate ticket can weigh it beside the overrule.
- Overruling a blocker before any repair attempt, other than an approach blocker.
- Undoing an overrule inside a run, or remembering one across runs.
- A ground for "the mechanism cannot achieve the PR's stated purpose"; the contradicted-claim blocker already carries it.
- Deleting the PR's remote branch, or posting the note as a close comment.
- Changes to `agents/wave-reviewer.md` or `agents/pr-gatekeeper.md`.
- Editing ticket #160; rows 4 and 6 are carried as `deviates:` here.

## Open questions

- The unexercised assumptions (a live close, a live set, run-history frequency, repairability of ground 1-5 conflicts, the review-dismissal command) are listed under `### Checked claims` with what the design does when each fails; none blocks.
