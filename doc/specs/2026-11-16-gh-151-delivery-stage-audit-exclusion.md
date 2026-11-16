# Delivery stages and post actions are not requirements: the audit, the plan and the critique applier skip them

**Goal:** A sentence whose only observable is a delivery stage (pull-request text, a CI or review result, a merge, a full-suite run), a commit message, or a step a person performs that no file delivers (after merge or deploy, or at any other time) is never scored, planned, or written as implementation work: the conformance audit emits nothing for it, the plan gives it no task, the critique applier writes an operator step instead of a pull-request obligation, and ticket shaping and spec-writing screen pull-request title and body text the way they screen a CI result today, while a necessary post action stays in the spec with its real actor and timing; the PR gate's post-merge menu offers it only when the PR gate runs and the sentence assigns the merger an action after merge.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Ticket:** #151
**Date:** 2026-11-16
**Predecessor:** `doc/specs/2026-11-06-workflow-stage-acceptance-rows.md` - supersedes the class's observable list in D1, the "applier stays at five and the persona is untouched" bullet in Errors and edge cases, and the Out of scope entries for the applier, writing-plans and the conformance reviewer; the ticket gate drop, the cut-question trigger and the drafted-row rule stay live.

## Problem

The conformance audit turns every spec clause, quotable note and inline prompt sentence into a requirement (`agents/conformance-reviewer.md:33`), gives every `in-scope` and `venue:` acceptance row an `Rn` (`:43`), fails on any row short of `DELIVERED` (`:74`) and proposes `fix` by default. It has one exception, the three-condition over-spec clause (`:35-41`), and no rule for a sentence that no file can deliver. So "ship evidence is green `ci` on the exact PR head", "The PR description carries this step." and "Both pull requests pass CI" become `MISSING` or `PARTIAL` gaps with `recommended: fix`, the fix loop spends capped rounds on them, and they reach the human at the finish menu. On the ordinary route the pull request is opened only after the audit, so the gap cannot close.

Ticket #151 scenario: a single-repo spec whose leg contract says "ship evidence is green `ci` on the exact PR head" and whose edge-case text says "The PR description carries this step.", implementation complete, no pull request opened; five consecutive audits report both sentences missing with a proposal to fix.

Checked premises (lookup - result):

| Premise | Lookup | Result |
|---|---|---|
| The audit has no delivery-stage exception | read `agents/conformance-reviewer.md` in full | held |
| The audit adds requirements to the spec (original prompt wording) | persona frontmatter `tools: read, grep, find, ls, bash`; "Read-only. Never edit." | corrected - the audit never edits; it emits rows and gap blocks the fix loop and finish gate act on. On the council route only the critique applier writes; on the worker route the worker does (row below) |
| The leg contract stores PR-gate policy in the spec | `skills/brainstorming/reference/legs.md:84-86` and template `:157` | held - finish reads the line as authority (`skills/finishing-a-development-branch/reference/legs.md`), so the line stays |
| Rules against CI-result and PR-body obligations already exist (user, at the questionary) | `rg -n -i "pr (body\|description\|title)\|workflow-stage\|delivery-pipeline" skills agents` | CI result, pull request state or review, merge, full-suite run: held (`skills/shape-ticket/SKILL.md:171`). Pull-request title and body text: corrected - not named; the only PR-body rules forbid sourcing a requirement from one (`agents/spec-council-member.md:34`) |
| The applier is the only critique role that writes | `agents/spec-council-member.md`, `agents/spec-council-synthesizer.md`, `agents/spec-council-applier.md` step 3; the worker dispatch in `skills/brainstorming/reference/spec-finalization.md` | held on the council route; corrected for the worker route - the worker payload says "Edit ONLY that file" and "fix what you find in place", so the worker also writes the spec |
| A spec home for post actions exists | `skills/brainstorming/reference/ticket-acceptance.md:56` (`Post-deployment housekeeping` Design clause) | held - reused, no new heading |
| A post action written in the spec is surfaced at merge | `skills/gatekeep-pr/reference/findings.md` `## PR-named steps`; `skills/gatekeep-pr/SKILL.md` description | corrected - that step is unchanged and narrower than "surfaced": it records "every sentence in the PR body or spec at the assessed head assigning the merger an action after merge", only inside a `gatekeep-pr` run, which starts "only when explicitly asked", and it leaves "observation-only acceptance or verification clauses" to `/skill:check-delivery`. A step with another actor (a repository admin), another timing (before merge, after deploy) or an observation stays in the spec and is not collected. The menu promise in Goal and D8 is Open questions item 1 |
| The plan turns a post action into a task | `skills/writing-plans/SKILL.md:277`: one row per normative requirement; a `waived:` row with an inline code span is never waivable | held |
| `plan_check` forces a coverage row per spec clause | `rg -n -i "acceptance\|normative" extensions/lib/plan-check.ts` (acceptance rows are parsed only for leg ownership and the ledger, `:1197-1296`) | held as absent - skipping a row needs no `plan_check` change |
| Consumers that parse the audit report | `rg "Conformance verdict" extensions src scripts` | only `extensions/lib/telemetry-collect.ts:28`; `scripts/ci.mjs:224-306` pins persona literals an edit must keep |
| An eval target covers the audit persona | `ls eval`; `eval/conformance-check/target.json` | not found - `eval/conformance-check` covers the orchestration reference; this spec adds `eval/conformance-reviewer` |
| The pi runtime loads the persona as written | `node_modules/@earendil-works/pi-coding-agent` | not checkable - package absent in the worktree; load behavior read from the persona frontmatter and the dispatch text |
| The ticket's counts (five audits, 27 of 91 reports) | ticket body marks each source unavailable | not checkable - motivation only |
| "Loop-ledger rows: not observed" (ticket, Out of scope) | saved session logs of one consumer repo, last 10 days | corrected - two flows stopped in the loop engine on such a row; that stays out of scope here and is named below |

Session evidence, anonymized (one consumer repo, last 10 days): 25 of 52 audit reports carried at least one delivery-stage gap, in 8 of the 13 flows that ran an audit. Sources: the leg `verification:` line (4 flows); sentences written at spec-writing into Design, Tests and external actions, such as "recorded in the PR body only" (5 flows, the most frequent); acceptance rows with a stage half (3 flows, one repeated through five audits and five fix rounds); one after-merge admin step; one commit-message sentence. The audit's own remediation text said "No code change is indicated by the local result" while the row stayed `PARTIAL`, `recommended: fix`.

Decisions from the questionary (user's words where quoted):

- Skipped sentences leave no trace in the audit report.
- The rule is stated inline at each decision point; "rules for not depending on CI results and PR body are already defined ... we shouldn't reinvent the wheel" - the existing class is widened and reused, no second definition.
- "things which can't be expressed as files are never verified as requirements. spec can define post merge actions but they are not actionable during neither plan/impl/conformance ... if there is necessary post merge action it can't be swallowed. its about categorization what is change and what is post action".
- Original prompt: "deliverables are code/docs/tests/data but never post deploy or PR related stuff"; "we need to make surgical change".

Framing: kept (ticket #151) - checked the audit's extraction and closing rules, the leg contract writer and its finish reader, the ticket gate's class table and its two brainstorming consumers, the three critique personas and their dispatch prompts, the plan coverage walk, and the PR gate's post-step collection.

## Acceptance criteria

Ticket #151, Acceptance Criteria, rows verbatim:

- [ ] Given a spec whose `## Legs` contract line reads `- verification: <local commands>; PR gate <command>; ship evidence is green CI on the exact PR head` and a diff that delivers every other requirement, the conformance audit returns `Conformance verdict: CONFORMS` and no coverage row or gap block quotes the `PR gate` or `ship evidence` clause.
  in-scope
- [ ] Given a spec sentence whose only observable is a delivery stage - a pull request's title, body, state or review; a CI or workflow run result; a merge; a full verification-suite run - the audit emits no coverage row and no gap block for it, with no `DELIVERED`, `PARTIAL`, `MISSING` or `DRIFTED` verdict, with or without an existing pull request. Sample sentences: "The PR description carries this step.", "Ship evidence stays green `ci` on the exact PR head.", "The root scan time before and after is recorded in the PR body."
  in-scope
- [ ] Given an `in-scope` acceptance row that joins a behavior and a delivery stage ("`git ls-files <dir>` returns nothing, and the PR description lists every file the folder held"; "`<test>` passes over the full tracked tree, in its venue: the `slow` job on the PR head"), the audit maps the behavior half to the diff and emits no coverage row, gap block or verdict for the stage half.
  in-scope
- [ ] Given a verbatim prompt containing a sentence whose only observable is a delivery stage ("Both pull requests pass CI"), the audit emits no row with a `prompt` origin quoting that sentence.
  in-scope
- [ ] Given a spec whose change is itself a CI or pull-request behavior ("Remove the CI step in `.github/workflows/ci.yml` that installs the browser") and a diff that leaves the step in place, the audit reports the gap as it does today.
  in-scope
- [ ] Given a ticket row or a drafted row whose only observable is a pull request's title or body ("The PR description lists every deleted test file"), ticket shaping and spec-writing treat it as a workflow-stage proof exactly as they treat a CI-result row today, with the same exception for a change whose behavior is the pull-request text itself.
  in-scope
- [ ] Given a critique finding that asks for an operator instruction to be put in the pull-request description, after the critique pass the spec section the finding targets contains the instruction text as an operator step, and the spec contains no sentence that makes a pull request's body, a CI run or a merge an obligation of the implementation.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-151-delivery-stage-out-of-audit
contract:
- create: git worktree add .worktrees/<name> -b <branch>
- destroy: git worktree remove .worktrees/<name> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test (AGENTS.md Testing); node eval/run.mjs <target> <sample> for the samples named in Tests
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: .pi/gauntlet-overrides.md
Rules: README.md
Rules: CHANGELOG.md
Rules: eval/README.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: skills/forge-skill/SKILL.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7
design: owns every path in Design; observable outcomes are the seven AC rows above

## Design

supersedes `doc/specs/2026-11-06-workflow-stage-acceptance-rows.md`, the class's observable list in D1, the applier-untouched bullet in Errors and edge cases, and the Out of scope entries for the applier, writing-plans and the conformance reviewer.

One test, four readers. A **change** is something files can deliver - code, docs, tests, data - whether or not the current diff delivers it yet. Only these three classes are excluded; every other requirement stays subject to gap reporting as today:

- a **workflow-stage proof** - the existing class owned by `skills/shape-ticket/SKILL.md` `## AC integrity gate`, widened by two words in D1;
- an **operator step** - a step a person performs that no file delivers, whatever its timing: before merge, at cutover, or after merge or deploy. The last is a **post action**, the usual case. An observation only possible with the change live in production belongs here too;
- **commit message text**.

None of the three is a requirement for the plan, the implementation or the audit. An operator step stays in the spec with its real actor and timing, never re-timed to fit a rule; a stage proof and commit message text are not written as obligations. A file whose product is pull-request text or a pipeline result (a workflow file, a CI step, a pull-request template, code that writes a pull-request body) is a change, and D1-D5 and the README row each carry that exception.

The class's observable list is one literal fragment, written identically in four files and pinned in D6:

`a CI or workflow run result, a pull request's title, body, state or review, a merge, or a full verification-suite run`

Every added or changed line follows `/skill:forge-skill` `## Authoring rules` (imperative voice, minimal diff, no history clauses); the persona edits also follow its `## Persona rules` (frontmatter byte-identical). No dispatch prompt, report format, verdict line, fix-loop step, ledger rule or settings key changes.

### D1 - the ticket gate owns the widened class

`skills/shape-ticket/SKILL.md`, the `| Workflow-stage proof |` row of the AC integrity gate table:

- Replace `a pull request's state or review` with `a pull request's title, body, state or review`. Keep every other word of the row, the precedence sentence, the deploy-window rule and the `| Post-deployment |` row unchanged.

The row's closing words `not a behavior of the change` already carry the exception AC 6 asks for: a row whose observable is pull-request text the change itself produces (a template, code that writes a pull-request body) names a behavior and stays.

### D2 - brainstorming reads the class and sorts change from post action

`skills/brainstorming/reference/ticket-acceptance.md`:

- Replace, in the cut-question trigger table's third row, `a row whose CI or suite result is itself the behavior under change is not one` with `a row whose CI result, suite result, or pull-request text is itself the behavior under change is not one`.
- Replace, in the drafted-row integrity table's `| Workflow-stage proof |` row, `(a suite command, a CI or workflow result, a PR state, a merge)` with `(a suite command, a CI or workflow result, a PR title, body or state, a merge)`.
- Add, under `## Row production at spec-writing`, directly before the sentence `Branch on the gathered result after reading the draft, before writing the spec:`, this paragraph. The position puts it ahead of the four gathered-result branches, so a ticketed spec (`Ticket rows extracted`) applies it too:

  `**Change or post action.** On every gathered result, sort every commitment of the approved design before writing. A change is something files can deliver (code, docs, tests, data): write it in Design, Tests and drafted acceptance rows. An operator step is a step a person performs that no file delivers, whatever its timing: write it as who does what and when, with its real actor and timing, never as an acceptance row, a Tests line or a Design imperative. Write a step after merge or deploy (a post action) in the `Post-deployment housekeeping` paragraph - a paragraph inside Design opening with the bold label `**Post-deployment housekeeping.**`, never a heading - and any other operator step in the Design subsection it belongs to. Write no sentence that makes pull-request title or body text, a commit message, a CI or review result or a merge an obligation, unless that text or result is itself a behavior of the change (a template, a workflow file, code that writes pull-request text). Ticket rows stay verbatim.`

Keep the four-option cut question, the verbatim-row rule, the `| Post-deployment |` drafting row and every other sentence unchanged. The sort governs the authored Design, Tests and external-actions text and drafted rows; it never edits a ticket row. It keeps a necessary operator step in the spec and removes only the obligation form.

### D3 - the audit skips what no file delivers

`agents/conformance-reviewer.md`, Process step 1:

- Remove the sentence `This is the only exception to "spec is canonical"; "could be cleaner" is still not a reason.`
- Add in its place: `"Could be cleaner" is still not a reason.` followed by a second exception paragraph with this content:

  `Exception - delivery stage and operator step. A requirement is something files can deliver - code, docs, tests, data - whether or not this diff delivers it. A spec sentence, a clause of one, a `## Legs` contract line or a clause of one, an acceptance row, or a prompt sentence is not an `Rn` only when what it asks for is (a) a workflow-stage proof - its sole observable is a delivery-pipeline stage: a CI or workflow run result, a pull request's title, body, state or review, a merge, or a full verification-suite run - not a behavior of the change; (b) an operator step - a step a person performs that no file delivers, whatever its timing (before merge, after merge or after deploy), or an observation only possible with the change live in production; or (c) commit message text. Leave it out of the report: no coverage row, no gap block, no verdict, no origin-drift line, no `UNAUTHORIZED` row, and no note that it was skipped, whether or not a pull request exists. Every other requirement, including one the diff has not delivered, stays an `Rn` and is judged as before. When one sentence, row or contract line joins a behavior with such a clause, keep its one `Rn`, judge it on the behavior alone, and quote only the behavior in `origin`, truncating the rest with `[...]`. A change whose product is a file about the pipeline (a workflow file, a CI step, a pull-request template, code that writes pull-request text) is a behavior of the change and stays an `Rn`. These two exceptions are the only ones to "spec is canonical".`

`agents/conformance-reviewer.md`, Process step 4:

- Replace `This includes the step-1 exception clauses.` with `This includes the step-1 over-spec exception clauses.`
- Replace `For a step-1 clause, start` with `For a step-1 over-spec clause, start`. Step 4 then names only the over-spec exception, so it never asks for an `UNAUTHORIZED` row for a sentence the second exception leaves out.

`agents/conformance-reviewer.md`, `## Rules`:

- Add one bullet directly after `**The spec's `## Acceptance criteria` section is origin, not ticket.**`: `**A delivery stage, an operator step, or commit message text is never a requirement.** The second step-1 exception outranks every rule here that asks for a row, a gap, or a drift line.`

Keep the over-spec exception, the **Spec `## Acceptance criteria`** paragraph (a `venue:` row is `DELIVERED` when its enabling-change Design clauses are, and `MISSING`, `recommended: rescope` when no Design clause names it), the output format, the gap-block fields, the `recommended` policy, and the literals `(over-spec)`, ``use the literal `none (scope creep)` `` and `recorded in spec? yes` unchanged.

A leg `verification:` line is read clause by clause under the mixed rule, never excluded whole: the PR gate command, ship evidence and a full-suite command are (a) and are left out; a clause whose observable is a file in the diff ("regenerated bundles committed", as on the `verification:` line of `doc/specs/2026-10-30-slim-subagent-dispatch.md`) stays a requirement; a targeted local command is classified by its observable, not by its position on the line. `skills/brainstorming/reference/legs.md` and the finish step that reads the line stay unchanged.

Reading of AC 3: a mixed row keeps one `Rn`; "no coverage row for the stage half" means no second row and no stage text in the quoted origin.

### D4 - the critique applier writes an operator step

`agents/spec-council-applier.md`, at the end of `## External references and over-spec`, add one paragraph:

`When a cluster asks for an operator instruction to be carried in the pull-request description, write the instruction itself into the section the cluster targets as an operator step: who does what, and when, keeping the actor and timing the cluster gives. An operator step is a step a person performs that no file delivers, whatever its timing; never turn one into an obligation of the implementation. Never write an acceptance row or a Design clause whose sole observable is commit message text or a CI or workflow run result, a pull request's title, body, state or review, a merge, or a full verification-suite run, unless that observable is itself a behavior of the change (a workflow file, a pull-request template, code that writes pull-request text).`

The step the applier writes is the class D3 (b) leaves out of the audit and D5 gives no plan row, at any timing.

Keep the audit line grammar, the five-class drafted-row permit, the hypothesis rule and the pinned literal `clusters that assert data shape, ordering, or semantics` unchanged. Council findings reach the spec only through the applier, so the member persona, the chair persona and the three dispatch prompts in `skills/roasting-the-spec/SKILL.md` stay unchanged. The worker critique payload in `skills/brainstorming/reference/spec-finalization.md` also stays unchanged, although the worker edits the spec in place: D4's authoring prevention does not reach it, and an obligation the worker writes is covered only by the D3 and D5 exclusions downstream.

### D5 - the plan gives a post action no task

`skills/writing-plans/SKILL.md`, `## Spec Coverage Table`, add directly after the sentence ending `is already a Design clause with its own row.`:

`A `Post-deployment housekeeping` paragraph, any other step a person performs that no file delivers (before merge, after merge or after deploy), commit message text, and a clause whose sole observable is a CI or workflow run result, a pull request's title, body, state or review, a merge, or a full verification-suite run get no table row and no task, unless that text or result is itself a behavior of the change (a workflow file, a pull-request template, code that writes pull-request text), which is tabled as any requirement. A row or clause that joins a behavior with one is tabled for the behavior alone. When the anchored spec line of such a mixed row carries an inline code span in its excluded half, repeat that literal once in the owning task on a line opening `Excluded citation (not work, not an acceptance condition):`, and in no step or acceptance condition.`

Keep the pinned literals `is never waivable` and ``table only `in-scope` and `venue:` rows`` and `reference/plan-contract.md` unchanged. `extensions/lib/plan-check.ts` is unchanged: it has no check that demands a row per spec clause. Its quote-integrity check requires every inline code span of an anchored spec line in the owning task's body, stage half included (the `slow` of the second AC 3 row); the excluded-citation line satisfies it without making the literal task work.

### D6 - deterministic pins

`scripts/ci.mjs`, `tokenChecks`:

- Add four present-checks for the literal fragment above, one each for `skills/shape-ticket/SKILL.md`, `agents/conformance-reviewer.md`, `agents/spec-council-applier.md` and `skills/writing-plans/SKILL.md`.
- Add one absent-check: `agents/conformance-reviewer.md` no longer contains `This is the only exception to`.

`scripts/brainstorming-contract.test.mjs`, the existing test `workflow-stage proof has an owning gate, ticket trigger, drafting rule, and example`:

- Add assertions: the gate row includes `a pull request's title, body, state or review`; the trigger row includes `pull-request text is itself the behavior under change`; `ticket-acceptance.md` includes `**Change or post action.**` and `a PR title, body or state`. Keep every existing assertion, including the 50,000-byte and 2,000-line limits.

### D7 - evals

Per `eval/README.md` and AGENTS.md "Change process": one sample per changed decision, each `samples/<name>/case.md` + `expected.md`, each target's `intent.md` gaining this change's paragraph, results committed sample-scoped. Sample text is synthetic; it names no consumer repo, job or person.

In `eval/writing-plans/target.json`, remove `"new": true` from the `skills/finishing-a-development-branch/reference/commit-message.md` entry: that file exists at the baseline, and the runner refuses every `writing-plans` sample with `new file exists at baseline` while the flag stays. Change nothing else in that file.

Add the target `eval/conformance-reviewer/` on the `eval/_template` layout (`target.json`, `intent.md`, `README.md`, `replay.md`, `samples/`), with `target.json` following `eval/spec-council-member/target.json`:

```json
{
  "kind": "text",
  "skillFiles": [{ "path": "agents/conformance-reviewer.md", "body": true }],
  "assembly": "headed",
  "wordCap": 1500
}
```

Each of its samples supplies a short spec, the verbatim prompt and the diff inline, states that no tool is available, and stops at the conformance report.

| Target | Sample | Must hold |
|---|---|---|
| `eval/conformance-reviewer` | `legs-verification-line` - spec with the AC 1 contract line, whose local-commands part also carries one file clause the diff delivers ("regenerated bundles committed"), and two delivered behavior clauses | f1 `Conformance verdict: CONFORMS`; f2 no coverage row, gap block or drift line quotes `PR gate` or `ship evidence`; f3 both behavior clauses have `DELIVERED` rows; f4 the file clause of the `verification:` line has its own `DELIVERED` row |
| `eval/conformance-reviewer` | `stage-only-sentences` - the three AC 2 sample sentences in Errors and edge cases, Design and Tests; no pull request exists | f1 none of the three sentences is quoted anywhere in the report; f2 `CONFORMS`; f3 the report carries no line listing skipped sentences; f4 the report carries no `UNAUTHORIZED` row |
| `eval/conformance-reviewer` | `mixed-row` - the two AC 3 rows, `in-scope`; the diff empties the directory and adds the test; an open pull request whose body lists nothing | f1 each row has exactly one `Rn`, `DELIVERED`, with diff evidence; f2 neither origin quote contains `PR description` or `job on the PR head`; f3 `CONFORMS` |
| `eval/conformance-reviewer` | `prompt-stage-sentence` - prompt holds "Both pull requests pass CI" and one inline behavior requirement the spec dropped and the diff lacks; the spec's `## Tests` holds one line joining a test file the diff lacks with a suite run (`<behavior> - <test file>, under <suite command>`) | f1 no row or drift line quotes the CI sentence; f2 the dropped behavior is still a gap with a `prompt` origin; f3 `GAPS`; f4 the missing test file is a gap whose origin quotes the Tests line's file clause, and only the suite clause is left out |
| `eval/conformance-reviewer` | `ci-step-is-the-change` - the AC 5 clause, diff leaves the step in place; the spec's leg `verification:` line carries a file clause the diff lacks ("regenerated bundles committed") | f1 `GAPS`; f2 a gap whose origin quotes the CI-step clause; f3 `recommended: fix`; f4 a gap whose origin quotes the `regenerated bundles committed` clause |
| `eval/conformance-reviewer` | `post-merge-action` - Design holds a paragraph opening `**Post-deployment housekeeping.**` ("After merge, a repository admin creates the `DEPLOY_TOKEN` secret.") and a commit-message sentence; all behavior delivered | f1 neither sentence is quoted anywhere in the report; f2 `CONFORMS` |
| `eval/spec-council-applier` | `pr-description-finding` - fixture spec plus a chair report with one cluster asking that a cutover instruction be put in the pull-request description, targeting Errors and edge cases | f1 that section contains the instruction text as an operator step; f2 the spec has no sentence obliging a pull request's body, a CI run or a merge; f3 the cluster is listed under `Applied:`; f4 the step names who performs it and the timing the cluster gives, and is no imperative on the implementation - the form D3 (b) leaves out of the audit and D5 gives no plan row |
| `eval/shape-ticket` | `pr-body-proof` - repair mode, a body with `- [ ] The PR description lists every deleted test file`, one behavior row, and `- [ ] The release script writes the changelog section into the pull request body` | f1 the first row is absent from the drafted ACs; f2 its text is in the Reporter note under `retired workflow-stage proof:`; f3 the release-script row is byte-identical; f4 the behavior row is byte-identical |
| `eval/brainstorming` | `pr-body-drafted-row` - ticketless design whose draft states one behavior's proof as "the PR description lists every deleted test file"; opens with `bundle+: skills/shape-ticket/SKILL.md` | f1 no drafted row whose sole observable is pull-request text; f2 one row per committed behavior; f3 no cut question |
| `eval/brainstorming` | `post-action-sorted` - spec-writing on the `Ticket rows extracted` branch (the gather draft carries verbatim ticket rows) from an approved design holding one behavior, "the release script writes the changelog section into the pull request body", "after merge a repository admin creates the `DEPLOY_TOKEN` secret", and "record the scan time in the PR body" | f1 the secret step is in Design in a paragraph opening `**Post-deployment housekeeping.**`, naming who, what and when; f2 no Tests line or Design imperative obliges pull-request text or a CI result, the release-script behavior aside; f3 the ticket rows are copied character-for-character with their dispositions and no row is added; f4 the release-script behavior is written as a Design requirement |
| `eval/writing-plans` | `post-action-no-task` - a spec with one behavior imperative, the imperative "the release script writes the changelog section into the pull request body", the housekeeping paragraph above, and the second AC 3 mixed row, whose stage half carries the literal `slow` | f1 the coverage table has no row quoting the housekeeping paragraph; f2 no task implements it; f3 the mixed row is tabled with an owning task for the behavior; f4 the behavior imperative has a row; f5 the owning task carries `slow` only on its `Excluded citation` line, in no step or acceptance condition, as the existing `plan_check` quote-integrity check requires; f6 the release-script imperative has a row and an owning task |

`ci-step-is-the-change` is expected to hold on both arms: none of its facts depends on a stage clause being left out. The other five audit samples are expected to move from fails to holds. The missing file clause sits in `ci-step-is-the-change`, not in `legs-verification-line`, because AC 1 needs that sample to end `CONFORMS`.

**External and paid actions.** Each of the eleven samples above runs through `node eval/run.mjs <target> <sample>` (runner: the implementer during implementation and the main loop at verify; inputs: the sample directories and the frozen models in `eval/lib/models.mjs`; each run makes model calls). New samples under `eval/brainstorming` carrying a `bundle+` line also run `node eval/run.mjs brainstorming <sample> --baseline-only` first. Approving this spec authorizes every one of these runs for the whole flow, including reruns of affected samples after a wording fix, across seed, rows, repairs and finish, without per-step permission prompts. No target-wide or cross-target sweep runs.

### D8 - docs

- `README.md`, `## Key concepts` table: add one row `| Post action | A step a person performs after the branch is delivered (after merge or deploy) - the usual case of an operator step, a step a person performs that no file delivers, whatever its timing. The spec records it with its actor and timing; the plan, the implementation and the conformance gate never treat it, a CI or review result, or pull-request text as a requirement, unless producing that text or result is itself a behavior of the change. When the PR gate runs, its post-merge menu offers a step the spec assigns to the merger after merge. |`
- `CHANGELOG.md`: add a `## Unreleased` entry ending `(#151)`; the entry carries the mid-upgrade recovery step from Errors and edge cases.
- `doc/specs/2026-11-06-workflow-stage-acceptance-rows.md`: carries the supersession banner for this spec.

## Errors and edge cases

- A file about the pipeline (a workflow file, a CI step, a pull-request template, a script that writes a pull-request body) is a change: audited, planned, drafted and applied as today, at every decision point.
- A requirement files can deliver that the diff has not delivered is a gap as today; only the three named classes are left out.
- A mixed sentence or row keeps one requirement; origin quote, verdict and plan owner cover the behavior half only. A leg `verification:` line is read the same way, clause by clause: a file clause on it stays a requirement, and a missing one is a gap.
- `venue:` rows are unchanged, whatever the venue: `DELIVERED` with their enabling-change Design clauses, `MISSING`, `recommended: rescope` when no Design clause names them.
- An operator step timed before or at merge ("before merging, a repository admin creates the secret") is the same class as a post action: no `Rn`, no plan row, and the author and the applier write it with its real actor and timing.
- Commit message text a spec or prompt sentence asks for is never an `Rn`, a plan row or an applier-written obligation. A project rule that reads a commit body at its own gate (this repo's AGENTS.md "Change process": the commit body states whether a skill edit changes behavior) is no spec sentence and still runs.
- A spec approved before this ships that carries a stage sentence or a post action anywhere: the audit skips it without a spec edit.
- An older spec whose acceptance row is wholly a stage proof or post action: the audit skips the row; the loop engine still seeds it and may stop on it (Out of scope).
- A flow caught mid-audit with an open `Gn` task for a gap the exception now leaves out: the next audit omits the gap, the re-audit step completes only a `Gn` reported `DELIVERED`, and the task stays `in_progress` and blocks verify completion ("unfinished tasks"); a `CONFORMS` verdict never reaches the finish menu's carried-open path. Recovery is a manual step the person running the flow directs, with existing operations only: confirm the old gap's origin quote is a sentence class (a), (b) or (c) leaves out; mark that one `Gn` task `complete`; drop its carried-open entry from the `## Closure / conformance` block when one was recorded; retry verify completion. A `Gn` the re-audit omits for any other reason stays `in_progress`.
- A prompt sentence the exception removes is not origin drift, whether or not the spec repeats it.
- A post action the design needs is never dropped at spec-writing: it moves to the housekeeping paragraph with its real actor and timing. The PR gate's `## PR-named steps` collection picks it up only when `gatekeep-pr` runs and the sentence assigns the merger an action after merge; other actors, other timings and production-only observations get no handoff claim. `gatekeep-pr` and `check-delivery` stay unchanged, and no actor is relabeled as the merger to fit the collector.
- A critique cluster that only asks for a CI result or pull-request text with no operator instruction inside: the applier rejects or defers it through its existing dispositions; it writes no obligation.
- A stage or commit-message obligation the worker critique route writes into the spec is not prevented at authoring; the audit and the plan leave it out under D3 and D5.
- A `## Tests` line naming a test file is a change (the file is in the diff). A sentence asking that the suite passes is a stage proof and yields no audit row; the suite still runs at verify and at the PR gate as today. A Tests line that joins the two (`<behavior> - <test file>, under <suite command>`) keeps its `Rn` for the file, and a missing file is a gap.
- The main-session fallback self-check in `skills/verification-before-completion/reference/conformance-check.md` is unchanged and does not carry the exception; delegation to the persona is the primary path.

## Tests

- Leg verification line yields `CONFORMS` with the stage clauses unquoted and its delivered file clause still rowed (AC 1) - `eval/conformance-reviewer/samples/legs-verification-line`
- Stage-only sentences yield no row, gap, drift line, `UNAUTHORIZED` row or skip note, with no pull request (AC 2) - `eval/conformance-reviewer/samples/stage-only-sentences`
- Mixed rows are judged on the behavior half, with a pull request open (AC 2, AC 3) - `eval/conformance-reviewer/samples/mixed-row`
- A prompt stage sentence yields no prompt-origin row; a dropped prompt behavior and a Tests line's missing test file are still gaps (AC 4) - `eval/conformance-reviewer/samples/prompt-stage-sentence`
- An undeleted CI step and a missing file clause of a leg `verification:` line are still reported (AC 5) - `eval/conformance-reviewer/samples/ci-step-is-the-change`
- An after-merge step and commit message text yield no row - `eval/conformance-reviewer/samples/post-merge-action`
- A PR-body ticket row drops; a PR-text-as-product row stays (AC 6) - `eval/shape-ticket/samples/pr-body-proof`
- No PR-body drafted row is written (AC 6) - `eval/brainstorming/samples/pr-body-drafted-row`
- On the ticket-rows branch the author sorts an after-merge step into the housekeeping paragraph, writes no PR-body obligation, keeps pull-request text the change produces as a requirement, and leaves ticket rows verbatim - `eval/brainstorming/samples/post-action-sorted`
- The plan has no row or task for a post action, tables a mixed row for its behavior with the stage literal as excluded citation, and tasks pull-request text the change produces - `eval/writing-plans/samples/post-action-no-task`
- The applier writes an operator step with the cluster's actor and timing and no pull-request obligation (AC 7) - `eval/spec-council-applier/samples/pr-description-finding`
- The observable fragment is identical in the owner row, both personas and the plan skill; the retired sentence is gone - `scripts/ci.mjs` `tokenChecks`, under `npm test`
- Widened gate row, trigger carve-out, drafting row and sort paragraph present; size limits hold - `scripts/brainstorming-contract.test.mjs`, under `npm test`
- An already-approved spec is audited without a spec edit - none: every audit sample supplies a spec written before the rule
- A flow caught mid-audit: old `MISSING` gap, new `CONFORMS`, then the manual recovery - none: no in-scope fixture drives a two-audit transition and the recovery uses existing operations only (Open questions item 2)
- A ticket row with a PR-body observable at brainstorming's step 4 - none: the trigger row reads the owner table, and `eval/brainstorming/samples/workflow-stage-ticket-row` covers the trigger
- A critique cluster asking only for a CI result - none: existing reject and defer dispositions, unchanged

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` `## Key concepts` - one "Post action" row (major definitions); `CHANGELOG.md` `## Unreleased` entry (major procedures; operations - the mid-upgrade recovery step)
- Derived / memory docs invalidated: none

The materiality bar is `reference/documentation-impact.md`; skill and persona bodies are implementation surface.

## Out of scope

- A named place in the spec for material the finish step should put into the pull-request body, and the finish step copying post actions into it (ticket #151 follow-up).
- The loop engine skipping or not seeding a row that is wholly a stage proof or post action (seen in two flows; changes ledger seeding).
- A new spec heading for post actions; the existing `Post-deployment housekeeping` Design clause is the home.
- The council member and chair personas, the dispatch prompts in `skills/roasting-the-spec/SKILL.md`, and the worker critique payload (an obligation the worker writes is left out downstream by D3 and D5).
- A rule that completes a `Gn` task because a re-audit omits its gap; mid-upgrade recovery is the manual step in Errors and edge cases.
- `skills/brainstorming/reference/legs.md` and the leg `verification:` line.
- `skills/verification-before-completion/reference/conformance-check.md`, the fix loop, `gatekeep-pr`, `check-delivery`, the wave reviewer and the loop implementer.
- `extensions/lib/plan-check.ts`.

## Open questions

1. **Post-merge menu promise (settled: A).** Goal said a necessary post action "still reaches the post-merge menu" and the D8 README row said "The PR gate offers it on the post-merge menu." Check run: read `skills/gatekeep-pr/reference/findings.md` `## PR-named steps` and the `skills/gatekeep-pr/SKILL.md` description. Outcome: contradicted - the collector records only a sentence "assigning the merger an action after merge", only when `gatekeep-pr` is explicitly run, and leaves observation-only clauses to `/skill:check-delivery`; `check-delivery` reads no handoff from it. A) narrow the promise (the council's adjudication): every operator step stays in the spec with its real actor and timing; the post menu offers it only when `gatekeep-pr` runs and the sentence assigns the merger an action after merge; other actors, other timings and production-only observations get no handoff claim. B) keep the unconditional promise and bring the collector into scope (`gatekeep-pr` leaves Out of scope). Settles: the Goal's last clause, the README row's last sentence in D8, and the post-action bullet in Errors and edge cases. Settlement: A, applied as an amendment under the standing grant after the gate approval left the question unanswered; the three sentences carry the narrowed wording.
2. **Proof of the mid-upgrade recovery (settled: A).** The old-`MISSING`/new-`CONFORMS` transition with the manual recovery in Errors and edge cases has no automated check: a fixture for it is a twelfth sample under `eval/conformance-check` and needs the recovery text in `skills/verification-before-completion/reference/conformance-check.md`, both outside the approved scope (eleven samples; that file is Out of scope). A) accept the documented manual step with the `none` Tests line. B) approve the extra sample and that file. Settles: the mid-audit Tests line and the Out of scope entry for `conformance-check.md`. Settlement: A - the gate approval left the spec as written, so the documented manual step and the `none` Tests line stand.
