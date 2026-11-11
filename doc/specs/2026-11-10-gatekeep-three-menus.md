# gatekeep-pr: three menus, a judged row 1, one post-merge pick, and plain-language output

**Goal:** A gatekeep-pr run shows at most three kinds of menu (action, final, post); row 1 is always the recommendation and follows the assessment instead of a per-menu rule; one post-merge pick runs any combination of follow-up steps and ends the run with a list of what was not run; every report, menu and posted text reads as plain sentences for a reader without the code open. Verification, repair, sync, CI watch and merge mechanics do not change, and the skill directory gets smaller.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Predecessor:** supersedes `doc/specs/2026-10-16-gatekeep-cleanup-menu.md`, "Menu" section and the re-render and `cleanup_done` clauses of "`cleanup.md` (new reference)"; supersedes `doc/specs/2026-10-25-gatekeep-pr-persistent-disposition.md`, "D5 Menus" section; supersedes `doc/specs/2026-10-23-gh-79-parallel-gatekeep-prs.md`, the summary line form in "Summary" and the terminal pick list in "Pick round"; supersedes `doc/specs/2026-10-01-gatekeep-pr-capability-gate-compact-report.md`, "D4. Report", "D5. Wording rules" and "D6. Menu" sections; supersedes `doc/specs/2026-10-30-gatekeep-pr-default-mine.md`, the `Role:` line form and placement in "Role line" (the role fact and its refresh rule stay); supersedes `doc/specs/2026-11-01-gatekeep-pr-reassess-prior-review.md`, the `Prior review:` line forms and placement in the Design "Report" paragraph (the counts and their inputs stay); supersedes `doc/specs/2026-11-07-gatekeep-pr-bypass-merge.md`, the row text, `Evidence:` clause and `Not offered:` line in the Design "Menu and report" paragraph (the bypass predicate and `--admin` rule stay); supersedes `doc/specs/2026-10-06-gatekeep-ruleset-aware-merge.md`, the `PR comments` and `Not offered:` line forms in "D2" (the binding classification stays).

## Problem

Framing: kept

The human's three goals for this change, in their words: keep mechanics, reduce robo-talk, sanitize menus.

**Menus.** `doc/gate-contract.md:34-46` inventories 11 gatekeep-pr gate templates and 2 questions. Nine of the templates live as separate sections in `skills/gatekeep-pr/reference/menus.md`, and a row is described in three places: the verb list and the availability table in `reference/decision-menu.md`, and each template's prose in `menus.md`. The human expected three menus: one to choose the course, one to merge or approve, one for what follows.

**Recommendations.** Every template hardcodes its recommended row: initial and final by authorship (`menus.md:32`, `:49`), assess terminal and obstacle always `stop` (`:57`, `:65`), contract exception always `preserve contract` (`:71`), own merge `cleanup` then the first post (`:77`), approved and closed `cleanup` then `stop` (`:91`, `:97`). In a sample of recent sessions from a consumer repo (about 15 PRs out of more than 50 sessions with gatekeep menus), 14 of 45 numeric picks overrode the recommendation, nearly all in three directions: `assess` to `deliver` on 5 PRs by another author (one whose single blocker was a wrong PR-body sentence with the correction drafted); `approve` to `merge` on 4 of 4 PRs by another author; `stop` to `deliver` on nearly every obstacle caused by a check still running.

**Post-merge ladder.** After a merge the own-merge menu re-renders after `cleanup` and again after each coverage post, so a merged PR costs one to three further stops; a nested skill's own gate (a delivery check's write confirmation) sat between them in two runs. Three follow-ups were dropped in the sample: a drafted reply was never posted in 3 runs because the own-merge menu has no reply row; a publication to a content branch that the PR body named as still pending was offered by no menu and the human asked for it after the last one; the human asked whether a delivery-check ticket existed after two runs. One human message asked for merge and cleanup as one instruction.

Corrected premise: the scout read "push to orphaned branch" as the telemetry publication. It is a PR-named post-merge step. Telemetry stays out: the extension publishes the gatekeep leg at settlement (`doc/configuration.md`, per-ref settlement contract) and `scripts/ci.mjs:389-391` fails any `skills/gatekeep-pr/**/*.md` that mentions it.

**Output register.** `skills/gatekeep-pr/SKILL.md` `## Wording rules` binds every report, menu and posted payload, and `reference/post-selection-loop.md` `### Output done-check` rereads payloads against it, so one owner exists. The field names and ids the human sees are mandated by the templates, not drift: `menus.md` `## final` and `## obstacle` require an `Evidence:` line naming source, head SHA, each run and check, the binding-pending count and `merge_state_status`; `reference/report.md` renders colon-labeled fields and the `ACs 1-15; 13's observable half` shorthand; obstacle rows carry `rounds 3 of 10, syncs 3 of 10`. In 37 marker-led gatekeep messages from two days of sessions, 36 lines carry raw field names or run ids. None of those messages is fenced; `report.md` and the `AC coverage` block show their templates inside code fences, and whether a posted comment was ever fenced was not confirmed. The model for the target register is `skills/chase-bug/reference/verdict-report.md` `## Register`.

**Constraints.**

- Gate ids `gatekeep-pr/<id>` are a published driver contract (`doc/gate-contract.md:34-46`); the terminal outcomes `approved|merged|closed-pr|final|merge-queued|stopped|stuck - .+` are parsed by `extensions/lib/telemetry-leg.ts:36`; `doc/gate-contract.md:126` already tells a driver to send the displayed row number, never a stable index.
- `scripts/gate-contract-lint.mjs:72-87` resolves each gate row to a heading in its file and requires, inside that heading's section, a sentence or table cell starting `Start the message with` that carries the literal marker; several gate ids may share one heading.
- Three eval targets assemble the menu and report files: `eval/gatekeep-pr/` (79 samples), `eval/gatekeep-pr-merge-state/` (9) and `eval/gatekeep-pr-scope/` (14). All three list `reference/decision-menu.md` in `target.json`; four `gatekeep-pr` samples name it in a `bundle-:` line (`loop-worker`, `nit-batch-row`, `per-ref-settlement`, `reviewer-row-reopen`).
- The human requires the change to simplify the skill, follow `/skill:forge-skill` authoring rules and keep every instruction file under the 50,000-byte lint. Baseline at `1aba5977`: the 13 files under `skills/gatekeep-pr/` total 218,934 bytes; `menus.md` 10,940, `decision-menu.md` 5,078, `cleanup.md` 10,052, `report.md` 9,724; the largest file is `post-selection-loop.md` at 38,559.

**Not checkable during design.** No live PR was gated and no multi-PR child dispatch ran. The session sample is not exhaustive.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] On the action, final and post menus the recommended row is row 1 and carries `[recommended]`, the first line carries `recommended=1`, and `stop` is the last row unless it is row 1.
  in-scope
- [ ] On the viewer's own PR with a not-ready first report and `deliver` offered, row 1 is `deliver`.
  in-scope
- [ ] On another author's PR whose only open blocker is a wrong sentence in the PR body, with its correction drafted and a pushable head, row 1 is `deliver`, and the sentence above the menu names that blocker as the reason.
  in-scope
- [ ] On another author's PR with an open blocker that only the author can settle, row 1 is `assess`.
  in-scope
- [ ] At an obstacle where a required check is still running, row 1 is `deliver`; at an obstacle where GitHub blocks the merge, no override applies and no local repair exists, row 1 is `stop`.
  in-scope
- [ ] When a contract change is proposed, row 1 is `preserve contract`.
  in-scope
- [ ] On the final menu with `merge` available, row 1 is `merge`, on the viewer's own PR and on another author's; with `merge` unavailable and `approve` available, row 1 is `approve`.
  in-scope
- [ ] After this run's merge returns merged, exactly one post menu renders: row 1 names a combination of the steps listed below it, every runnable step has its own row showing its exact command or what it posts, and after the reply the run prints its results and ends without another gatekeep-pr menu.
  in-scope
- [ ] On the post menu the reply `2,4` runs exactly rows 2 and 4, `1,5` runs row 1's steps plus row 5, `1,2,3,4,5` runs each step once, and the steps run in the menu's step order whatever order was typed.
  in-scope
- [ ] A post-menu reply that combines `stop` with another number, or names a number outside the menu, gets one clarifying question and runs nothing; a several-number reply on the action or final menu is refused the same way.
  in-scope
- [ ] The closing message lists every post step that was not picked, was skipped or failed, each with its reason and its command or the path of the text it would post.
  in-scope
- [ ] A reply drafted before the merge and not posted appears as a row on the post menu.
  in-scope
- [ ] When the PR body or its spec names a step to run after merge and the base branch's documentation names exactly one command for it, the post menu offers that step as a row showing the command and includes it in row 1.
  in-scope
- [ ] When the base branch's documentation names no command or two commands for such a step, the post menu message and the closing message name the step as open with its source sentence, and the run executes nothing for it, including any command text taken from the PR.
  in-scope
- [ ] In a set of PRs, each merged PR gets exactly one post menu in its own message and retires after its picked set runs; a `## cleanup` item that names no PR, issue or merge commit is part of row 1 only on the last merged PR of the round; the set's closing message lists, per PR, every step not run.
  in-scope
- [ ] For a PR with a blocked merge, a `--rebase` sync and a prior review, the report is three parts of plain sentences, contains none of the labels `Delivers:`, `Role:`, `PR comments:`, `Nits:`, `Blockers:`, `Prior review:`, `Description:`, `Sync:`, `Evidence:`, `Verdict:`, `Not offered:`, and states the viewer's role, the sync result and the prior-review count each as a sentence.
  in-scope
- [ ] That same report and its menu contain none of `merge_state_status`, `mergeStateStatus`, `reviewDecision`, `bypass_eligible`, `headRefOid`, `source: ci`, `source: local`, `source: pending`, no workflow run id, no commit id and no repair or sync counter; `show evidence` on the same run prints the run ids, commit ids, check list and counters.
  in-scope
- [ ] That same report and its menu, a posted review body and a posted thread reply contain no code fence; a posted coverage comment carries the `AC coverage` heading and checkbox rows verbatim and unfenced.
  in-scope
- [ ] A posted review body states each finding in one or two sentences with its file and line trailing in parentheses; a posted thread reply names no field name, run id or commit id.
  in-scope
- [ ] Each of the states initial, obstacle, contract-exception, final, assess-terminal, own-merge, approved, closed-pr and merge-queued starts its message with its existing `gauntlet: gate=gatekeep-pr/<id>` line, and the terminal outcomes and the `#<N>@<head sha>: <outcome>` settlement row are unchanged.
  in-scope
- [ ] At the branch head `cat skills/gatekeep-pr/SKILL.md skills/gatekeep-pr/verification-brief.md skills/gatekeep-pr/review-baseline.md skills/gatekeep-pr/reference/*.md | wc -c` prints less than 218,934, `skills/gatekeep-pr/reference/decision-menu.md` does not exist, and no file in the directory exceeds 50,000 bytes.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gatekeep-three-menus
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: `npm test` (runs `scripts/ci.mjs`); selected eval samples only, `node eval/run.mjs <target> <sample>`, per `eval/README.md` "Iterating on a skill edit"
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: doc/configuration.md
Rules: doc/personas.md
Rules: doc/install-internals.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: eval/README.md
Rules: .pi/gauntlet-overrides.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7, AC 8, AC 9, AC 10, AC 11, AC 12, AC 13, AC 14, AC 15, AC 16, AC 17, AC 18, AC 19, AC 20, AC 21
design: owns `skills/gatekeep-pr/` (all files), `doc/gate-contract.md`, `README.md`, `CHANGELOG.md`, `eval/gatekeep-pr/`, `eval/gatekeep-pr-merge-state/`, `eval/gatekeep-pr-scope/`, `scripts/gatekeep-comment-reconcile.test.mjs`, `scripts/gatekeep-bypass-pick.test.mjs`, and the eight predecessor spec banners; observable outcomes are the 21 AC rows.

## Design

### D0 Boundaries

Unchanged: steps 1-5 (gather, provision, sync, verify, review, integrate), the delivery body, exit checks, merge preconditions, compare-and-swap, round and sync accounting, the run record's authority rules, row availability conditions, what each row does when picked, non-final stop, the two `--rebase` stops before the first report, and the set-mode dispatch, queue and retry row. This change alters which template a state renders, row order, the recommendation, how post-merge picks are collected and run, and the wording of everything rendered or posted.

Every edited skill file follows `/skill:forge-skill` `## Authoring rules`: a rule is stated once in the section that owns it and linked from elsewhere; no history clauses.

Size target: a row is described once instead of in three places, so the directory total measured by the command in the last acceptance row ends at or below 213,856 bytes, the 218,934-byte baseline minus the 5,078 bytes of the removed `decision-menu.md`, with every preserved mechanic kept and every file under the 50,000-byte lint. Verification reports the measured total against this target. The acceptance row keeps its drafted bound until the user decides otherwise (Open questions).

### D1 One menu file: states, archetypes, rows

Remove: the sections `## initial`, `## final`, `## assess terminal`, `## obstacle`, `## contract exception`, `## own merge`, `## merge queued`, `## approved`, `## closed PR` in `reference/menus.md` with their recommendation sentences and `Evidence:` line rules; the file `reference/decision-menu.md` (`## Verbs`, `## Availability`, `## Withhold reason resolver`); the rule that `[recommended]` may sit on any row.

Add to `reference/menus.md`:

- `## States`: one table, a row per state id, holding the state's entry condition (the precedence of today's state map), its archetype, the rows it switches off, and a cell that starts with the words `Start the message with` and then carries the state's literal marker wrapped in backticks. `scripts/gate-contract-lint.mjs` requires both the opening words and the backticks around the marker; a bare marker fails it.

  | Archetype | States |
  |---|---|
  | action | initial, obstacle, contract-exception |
  | final | final, assess-terminal |
  | post | own-merge, approved, closed-pr, merge-queued |

- `## action`, `## final`, `## post`: one row table each. A row is defined once: its verb, when it is available, and what the pick does (the content of today's verb list, availability table and template prose, merged). Action rows: `deliver`, `deliver with nits`, `assess`, `approve workflow run`, `accept contract change`, `preserve contract`, `stop`. Final rows: `merge`, `approve`, `fix nits`, `reply`, `deliver`, `stop`. Post rows: D3, which also defines the `merge-queued` variant's two rows, `wait` and `stop`, so `wait` keeps an owner.
- `## Recommendation`: D2.
- A missing-row table replacing the withhold reason resolver: each unavailable row renders as one sentence, for example "Merge is not offered because you lack write access to this repository."
- `## batch summary` stays, with row 1 as its recommended row.

Row verbs keep their names because picks are stored under them. Row order is assessed per render: row 1 is the recommendation, the other available rows follow in the archetype's table order, `stop` is last unless it is row 1. Row 1 carries `[recommended]`; the marker carries `recommended=1`. The line `Pick one:` separates the menu from the text above it; the hint line stays `Type a number; show evidence prints the full record.` with `check <name> flaky | real | ci-broken` appended when a check is failing.

The bypass merge row reads `merge - <policy>-merge using your admin override.`; `--admin` rules are unchanged.

### D2 Recommendation

Three static pins. The first that applies decides row 1 and nothing below overrides it:

1. Contract-exception state: `preserve contract`.
2. No available row other than `stop` can change the outcome: `stop`. The cases: GitHub blocks the merge with no override and no local repair; the merge state is unknown after the re-poll; an obstacle whose failed prerequisite has not changed since the last attempt, including one reached at the round or sync cap, where `deliver` is offered but exits again on the same prerequisite and a raised cap does not change that. A cap reached while the last attempt changed the failed prerequisite is not this pin.
3. Action menu, the viewer is the PR's author, the head is not bot-authored, and `deliver` is offered: `deliver`.

With no pin, these rules decide row 1, first match. They are written into `## Recommendation` as rules, not left as sample expectations:

4. Assess-terminal state: `stop`. The human chose to assess and the review is posted. Another row is row 1 only when something concrete changed after the assess pick (a new head, a blocker cleared, an answer from the author), and the recommendation sentence names that change.
5. The only thing withholding merge is a required check still running or a failing check the human marked flaky, and `deliver` is offered: `deliver`.
6. An open blocker needs the author's decision and `assess` is offered: `assess`.
7. Every open blocker has a drafted repair (a wrong PR-body sentence, a missing doc line), none needs the author's decision, the head is pushable and `deliver` is offered: `deliver`.
8. Final state: `merge` when it is available, by the ordinary path or by the admin override; else `approve` when available.

A blocker needs the author's decision when its repair would change what the PR delivers (behavior, public contract or scope) or must choose between alternatives that the ticket, the spec and the PR's own text do not settle. A blocker whose repair makes the description, the docs or the code match what those sources already commit to does not.

In every other case the model judges: row 1 is the available row that settles the PR with the fewest further stops for the human, decided from this run's findings and state.

One sentence directly above `Pick one:` states the recommendation and its reason, and the reason names a finding or state of this PR: "I recommend deliver, because the only problem is a sentence in the PR description and its correction is ready." A recommendation confers no authority.

### D3 Post menu

Remove: the `cleanup_done` field (`verification-brief.md:100`, `reference/cleanup.md`, `reference/batch.md`); the re-render after `cleanup` and after each post; the consequence clause that folds every `## cleanup` item into the `cleanup` row.

Add: a `post_steps` list in the run record, one entry per step with its label, source, exact command or payload file, whether it was picked, and its result.

The post menu renders once per PR, when this run's merge returns merged, when the approval succeeds, or when the PR is found closed. Steps, in fixed order:

1. post the drafted replies
2. post coverage to the ticket (own-merge with an issue and scope rows)
3. post coverage to the PR (own-merge)
4. cleanup: worktree, local branch, base pull, with today's guards
5. each PR-named step (D4), only when the PR is merged
6. each `## cleanup` item from the merge-base overrides file, in list order, with today's guards and substitutions

**Rows.** Only a step with work to execute is numbered: one row per such step, its text showing the exact command or what is posted and where. A step every guard would skip is not a row; it is listed with its skip reason in one sentence under the rows and again in the closing message. Cleanup (step 4) is a row when at least one of its sub-steps (worktree, branch, base pull) can run, and its row text names the sub-steps that will be skipped and why. The guards and their results are today's.

**Row 1.** Row 1 is a combination of the rows below it and lists their labels and row numbers. By default it holds every runnable step, with two exclusions: the PR copy of coverage when the ticket copy is included, and in a set a shared `## cleanup` item on a PR that D6 does not designate. The model may leave out another step only for a reason from this run's assessment; a runnable PR-named step is never left out. The recommendation sentence above the prompt line (D2) gives the reason for each step row 1 leaves out. With one runnable step, that step is row 1 and no combined row renders. With none, `stop` is the only row.

**Reply.** The prompt line is `Pick one, or several separated by commas:`. The reply is a set of row numbers separated by commas; row 1 expands to its members; duplicates collapse. The exact typed commands are recognized before the set parse, as `### Next action` does today, each on the states that offer it today: `show evidence`, `check <name> flaky | real | ci-broken` and `reply <n>`; `reply <n>` is also accepted on a post menu that lists drafted replies. `show evidence` prints the record and re-renders the same menu; it is inspection, not the pick. `reply <n>` names drafted reply `<n>`, never row `<n>`; on a post menu it is a pick whose set is that one reply.

**Run.** The gate runs the set in step order, prints one result line per step in today's `<label>: <result>` form, and ends the run through `### Teardown`. A picked step that needs the merged change on the local base (a PR-named step, a `/skill:release` item) runs the base pull first when cleanup is not in the set, and its row text says so.

A reply posted to a PR that is still open (the approved state) keeps the pre-write re-fetch of `### Compare-and-swap`. When the head moved past the assessed head the reply is not posted: its result is `skipped - head moved`, its body file is kept, the closing message names it, and the run neither re-enters step 3 nor renders another menu. Posts on a merged or closed PR run no compare-and-swap, as terminal posts do today.

**Nested skill.** A picked step whose resolved text starts `/skill:` invokes that skill with its gates intact, in its place in step order. When the nested skill pauses at its own gate, that turn carries the nested skill's marker and no gatekeep-pr marker. The `post_steps` entries keep which steps were picked and which have results, so the rest of the set, and in a set the other PRs' queued picks, survive the pause. When the nested skill returns, the gate runs the remaining picked steps in step order and then emits the closing message once. The result line reads `invoked /skill:<name> - paused at <where>` while the skill waits and `invoked /skill:<name> - <what it returned>` once it finished; a paused step is never reported as done.

**Closing message.** It starts with `### Teardown`'s existing terminal marker for the PR's outcome - `gauntlet: done merged`, `gauntlet: done approved` or `gauntlet: done closed-pr` - never a gate line. Below it: the settlement row, the result lines, then one sentence per step that was not picked, was skipped or failed, giving its label, the reason, and its command or payload file path ("The handbook was not published because you did not pick it; its command is `scripts/publish-handbook.sh`."). A not-run sentence never takes the `<label>: <outcome>` shape of a result line or a settlement row. Teardown keeps the payload files of posts that were not run or failed and deletes everything else as today. Set mode: D6.

**Stop without a post pick.** `stop` on final, on the merge-queued variant or on a post menu keeps its terminal outcome and marker. Its closing message carries the same not-run sentences for everything known at that point: drafted replies, coverage posts, cleanup, PR-named steps and `## cleanup` items, each with its payload path or command. Each sentence says whether the step could have run now or waits until the merge lands.

**Merge queued.** `merge-queued` is a variant of the post archetype, not a combination menu: its rows are `wait` and `stop`, it takes one number, and `wait` is not a combination step. `wait` re-runs `gh pr view <N> --json state,mergeCommit`. A `MERGED` read records the state and the merge commit and renders the own-merge post menu once; any other state re-renders the variant; no CI watch runs. `stop` behaves as today and ends with `gauntlet: done merge-queued`.

Example (own merge):

```
I recommend every step except the PR copy of the checklist, because the ticket comment already carries it.

Pick one, or several separated by commas:
1. post the reply, post coverage to the ticket, cleanup, publish the handbook, close the ticket - rows 2, 3, 5, 6 and 7. [recommended]
2. post the reply - answer robin's question about retries on the PR.
3. post coverage to the ticket - comment the acceptance checklist on acme/widgets#45.
4. post coverage to the PR - the same checklist as a PR comment.
5. cleanup - remove the worktree at .worktrees/csv-export (untracked files there are deleted) and the branch csv-export, then pull main.
6. publish the handbook - run `scripts/publish-handbook.sh` from the primary checkout. The PR description says: "After merge, publish the handbook."
7. close the ticket - run `gh issue close 45 --comment "Delivered in <pr url>, merged 9f1c2d3."`.
8. stop - run nothing; the closing message lists these steps with their commands.
```

The shipped copy of this example lives in `reference/menus.md` `## post`, unfenced as a block quote.

### D4 PR-named steps

Add to `reference/findings.md`: at step 5 record every sentence in the PR body, or in the spec at the head, that assigns the person merging an action to execute after merge (publish, migrate, run a script, notify). A sentence about what can only be observed after merge, the post-merge half of an acceptance or verification row, or a note about a deploy or release that happens without the merger acting is not a trigger; those stay with `/skill:check-delivery`. The report states each recorded action in one sentence.

The command comes only from merge-base files: the overrides file, `AGENTS.md`, and the documents `AGENTS.md` links, one hop. Text from the PR triggers the step and never supplies a command. A command counts only when the merge-base document names it for that action, in the same sentence, list item or table row. Candidates are counted as distinct command strings: the same string cited in several places is one command. Exactly one makes the step runnable; `<issue>`, `<pr>` and `<merge-sha>` substitute as in `cleanup.md`. No command, two or more distinct commands, or any other unfilled token makes the step open: named with its source sentence in the post menu message and the closing message, never run.

Before rows are numbered, sentences that name the same action become one step that keeps every source sentence. A PR-named action whose resolved command is a `## cleanup` item's text is that item: one row, at the item's place in list order, with no second row. The row of a PR-named step shows its source sentence beside the command.

A runnable step executes through `cleanup.md`'s existing dispatcher, after the base pull reports synced: text starting `/skill:` invokes that skill with its gates intact (D3 Nested skill); any other text runs as a `## cleanup` shell item does, from the primary, non-interactive, bounded by the resolved timeout.

### D5 Plain-language output

Remove: the `Evidence:` line and its exemptions; the fenced report template and the labeled fields in `reference/report.md`; the `ACs 1, 2, 4; 3 deferred per spec` shorthand; the round and sync counters and the `Not offered:` lines in menu text; `## Wording rules` items 3, 4, 5, 7, 8 and 9 in `SKILL.md` as written.

Add:

- `SKILL.md` `## Wording rules`, rewritten as the one owner of the register for every report, menu, review body, reply and tracker comment: write for a reader who has neither the code nor the run's notes open; whole sentences; each claim grounded in a fact this run gathered, with one concrete example per problem; explain a needed term in everyday words before using it; no field names, run ids, commit ids or counters in explanatory prose outside `show evidence`; a file, line or check name appears only where the reader must open or type it (a review body's findings, the check named in the hint line); nothing is fenced. The section states the exceptions once: the exact command a row or the closing message shows, with its substituted values (a merge commit, a PR URL, an issue number), the first-line marker, the settlement row and the per-step result lines keep their exact text. The section carries a translation table with at least these rows:

  | Gate term | Wording |
  |---|---|
  | binding pending check | a required check is still running |
  | merge blocked, no bypass | GitHub reports the merge as blocked for you |
  | bypass eligible | your admin rights can override the block |
  | assessed head | the latest commit |
  | conflicting / behind | the branch conflicts with, or is behind, the base branch |
  | evidence source ci / local | the checks ran in CI / on this machine |
  | cap reached | the repair attempts allowed for this run are used up |
  | nit | a smaller point that does not block merging |
  | contradicted claim | the description says one thing and the code does another |
  | observable half | the part that can only be seen after merge |
  | deferred / deviates / elsewhere | the spec defers it, deliberately differs, or assigns it to another repo |
  | pending reviewer placeholder | an automated review is still running |

- `reference/report.md`, rewritten: three unlabeled parts - two descriptive parts, then the recommendation sentence as part three - followed by the menu.
  1. What the PR does, one paragraph of two sentences with the viewer's role folded into either; the second says in everyday words which promised behavior is covered and which is deferred, deliberately different, assigned elsewhere or visible only after merge, naming the behavior and never a row number. Row numbers stay under `show evidence` and in the `AC coverage` checklist.
  2. What stands between the PR and merging. Its first sentence is the standing: nothing, a count of problems to fix, or the one thing it waits on. In a set the child supplies this sentence with its result for the parent's summary (D6). Then one or two sentences per problem with one concrete example (a description fix quotes the sentence as it is and as it will read); a numbered list when two or more problems block. Then what the run is waiting on, the sync result when `--rebase` was passed, the prior-review count ("Two of the three points from the last review are addressed."), each step named for after the merge, and the smaller points.
  3. The recommendation sentence (D2).

  `show evidence` keeps today's content and is exempt from the register.

- Review bodies: each finding in one or two sentences with its file and line trailing in parentheses. Replies: plain sentences, no ids.

Fixed strings, unchanged: the first-line marker, the settlement row, the `AC coverage` block (posted verbatim, unfenced), the typed commands, `[recommended]`, exact commands with their substituted values, the per-step result lines, the set-mode `gauntlet: retired` and `Queued until all picks are collected` lines, and the text of `## cleanup` items, which the repo owns.

Example (initial, another author's PR):

```
gauntlet: gate=gatekeep-pr/initial recommended=1
This PR, which you and robin are asked to review, lets the reports page export CSV on demand. It adds the export button, the column picker and the download link the ticket asks for; the spec moves scheduled exports to acme/widgets#46, and the speed target can only be checked after merge.

One problem stands between this PR and merging. The description says exports run nightly, but the code now runs them on demand, so a reader would wait for a job that no longer exists; the corrected sentence is drafted. One smaller point does not block merging: the export repeats paging code that a shared helper already provides.

I recommend deliver, because the only problem is a sentence in the PR description and its correction is ready.

Pick one:
1. deliver - apply the drafted description fix, merge main into the branch if it falls behind, watch the checks, and continue until merge is offered. [recommended]
2. deliver with nits - the same, and also replace the repeated paging code.
3. assess - post the problem to the PR as a review and make no repairs.
4. stop - remove the worktree and leave the PR as it is.

Type a number; show evidence prints the full record.
```

The shipped copy of this example lives in `reference/report.md`, unfenced as a block quote and without the first-line marker: `scripts/gate-contract-lint.mjs` flags a marker line in a skill file outside the section the contract names, and the marker requirement stays in `menus.md` `## States`.

### D6 Set mode

Edit `reference/batch.md`: the summary shows one line per PR, `#<N>` followed by that PR's standing sentence, or a sentence for a conflicting, failed or stopped child. The standing sentence is the first sentence of the report's second part (D5); the child supplies it with its result, as it supplies the verdict text today, and the parent copies it unchanged, never inferring or rewriting it.

Each merged PR gets its post menu once, in its own message, in the round after its merge; picks queue as today. After its picked set runs the PR retires with today's `gauntlet: retired #<N> - <reason>` line, which carries no terminal marker and no settlement row. The terminal marker (`gauntlet: done retired` or `gauntlet: stuck retired`) and the settlement rows belong to the one parent closing message; each PR's not-run sentences are kept with its retained row and printed under it there.

A `## cleanup` item whose text holds none of `<issue>`, `<pr>`, `<merge-sha>` is shared by the set. The parent records its execution for the whole set: it runs at most once, and after it runs no later post menu offers it as a row. Until then it is part of row 1 only on the last merged PR of the round in roster order and stays its own row on the others, so the human can still pick it earlier. A post menu that leaves it out of row 1 says in one sentence that it is scheduled with that later PR; one rendered after it ran says it already ran. A `/skill:` item keeps its own gates.

### D7 Other files

- `SKILL.md`: step 6 reads `reference/menus.md` only; the red flags name the new owners (`menus.md` `## final` for approving your own PR; a menu with a recommendation not on row 1); the `## cleanup` sentence names the post menu pick; the opening sentence that forbids printing a command for the human to paste keeps that rule for picked work and says that a command shown in a row for an informed pick, or in the closing message for a step not run, is information and not an instruction to run it by hand.
- `reference/post-selection-loop.md`: `### Next action` recognizes the exact typed commands first (D3 Reply), then accepts a comma-separated set reply on post states only and owns its parsing: duplicates collapse, a number outside `1`-`N` asks once naming the range; `### Merge course` and the approve path render the post menu once; `### Settlement rows` and `### Teardown` settle after the picked set, and `### Teardown` prints the not-run sentences on a terminal stop (D3); `### Output done-check` points at `## Wording rules` instead of restating it; every reference to a removed template or to `decision-menu.md` names its new owner.
- `reference/cleanup.md`: step execution per D3; the menu consequence clause becomes per-row text.
- `reference/findings.md`, `reference/sync.md`, `reference/fix-wave.md`, `reference/assessment.md`, `verification-brief.md`: references to a removed label, template or file name their new owner; `verification-brief.md` replaces `cleanup_done` with `post_steps`.
- `doc/gate-contract.md`: the nine state rows point at `menus.md` `## States`; the terminal rows read "post pick or stop on <state>"; the reply table names the set reply on post states.
- `README.md`: besides the Architecture text, the overrides-table row for `## cleanup` items and the line describing the `## cleanup` section as "the ordered post-gate steps the `cleanup` menu row runs" name the post menu pick.
- `eval/`: the three `target.json` files drop `decision-menu.md`; the four `bundle-:` lines naming it are deleted; each target's `intent.md` is rewritten for this change; `eval/gatekeep-pr/replay.md` and `eval/gatekeep-pr-scope/replay.md` stop asking for `decision-menu.md`, the sync line, the verdict line and a menu re-render after a pick, and ask for the new report and menu instead; the bundle inventory in `eval/gatekeep-pr-scope/README.md` drops `decision-menu.md`; case premises are fixed per Tests.

### D8 Paid actions

The only paid or external action is `node eval/run.mjs <target> <sample>`, run by the implementing agent, on at most 65 samples across the three targets: the 8 new samples in Tests, and at most 57 existing samples (the candidates listed in Tests; a sample is run only when one of its expected facts is edited, its `bundle-:` line changes, or its target's `replay.md` changes while this branch carries a saved result for it). Count for the whole flow, repairs and finish included: one `--baseline-only` seed plus at most 6 runs per new sample, at most 6 runs per existing sample (`gatekeep-pr/loop-worker`: 7, its seventh a fresh replay after deleting the saved candidate), at most 203 invocations. A sample whose saved result a script test binds to the current skill assembly takes one further run after the conformance repair changes skill text, whatever its per-sample count; the 203 total is unchanged. After the shared-step correction in `batch.md`, `gatekeep-pr/loop-worker` and `gatekeep-pr/per-ref-settlement` take one more run each and `gatekeep-pr/batch-post-menu` at most two. After the review-body pointer correction in `findings.md`, each sample a script test binds to the current skill assembly takes one more run, and one such sample that fails a fact on text the correction did not change takes one fresh replay; at most 12 runs. A sample edited only in its `case.md` premise is not rerun and does not count. Design approval authorizes these runs without per-step prompts. The implementation loop treats any paid or external action without such a clause as unreachable; adding one needs separate explicit authorization. No live PR is gated.

Baseline limitation: the runner assembles both arms from the working-tree `skillFiles` list and has no baseline-only entry, so once `decision-menu.md` is dropped the baseline arm runs without its verb list, availability table and withhold resolver. The runner is not changed. The evidence judges each selected sample's candidate output against its must-hold facts absolutely, states this limitation, and makes no claim from the improved-or-unchanged direction alone. That mechanics are preserved rests on the migrated script assertions (Tests) and the selected candidate facts, not on the comparison.

## Errors and edge cases

- A post step fails: its first error line prints, the remaining steps run, and the closing message lists it. Today's two guards hold: no branch deletion after a failed worktree removal, no release when the base did not sync.
- A set reply holds a number outside the menu, or `stop` with another number: one clarifying question, nothing runs. A second invalid reply leaves the menu waiting.
- A several-number reply on an action or final menu: one clarifying question naming the range.
- One runnable post step: it is row 1; no combined row.
- No runnable post step: `stop` is row 1 and the only row.
- Queued merge: `wait` and `stop` only; the post menu renders once after the merge lands. `stop` there ends with `gauntlet: done merge-queued` and lists the replies, cleanup and follow-up steps as waiting for the merge.
- `stop` on final with drafted replies: the closing message names each reply with its body file.
- Approved or closed-unmerged PR: no coverage rows and no PR-named rows; a step that needs a merge is not a row and is listed under the menu and in the closing message with `skipped - PR not merged`.
- Cleanup with some sub-steps skipped: it stays one row and its text names the skipped sub-steps.
- PR-named step with no single documented command, or an unfilled token: open, listed, never run.
- The same follow-up named in the PR body and in the spec, or documented by the same command in two places: one step, one row.
- A PR-named action whose command is a `## cleanup` item: that item's row only; it runs once.
- A `/skill:` item, from `## cleanup` or resolved for a PR-named step, keeps its place in step order and its own gates. When it pauses, the remaining picked steps and the other PRs' queued picks run after it returns, and the closing message is emitted once, after them.
- A reply picked on an approved, still open PR whose head moved: not posted, `skipped - head moved`, body file kept, no new menu.
- `show evidence` or `check <name> ...` typed at a post menu: handled as today and the same menu waits; `reply 2` posts drafted reply 2, not row 2.
- A picked step needs the merged change and cleanup is not in the set: the base pull runs first; a failed pull skips the step with `skipped - base not synced`.
- A coverage post or reply that was not run or failed: its body file is kept and named in the closing message.
- Own PR at an obstacle no row can change: pin 2 precedes pin 3, so row 1 is `stop`.
- Set mode, two merged PRs and a shared item: recommended once, on the last merged PR. Picked earlier on another PR, it runs then and no later menu in the set offers it again.

## Tests

Eval samples, new, target `gatekeep-pr` (must-hold facts in parentheses):

- Row 1 on the action menu (AC 1-6) - `action-row-one` (own PR -> deliver; body-only blocker on another author's PR -> deliver with the reason naming it; author-only blocker -> assess; check still running -> deliver; GitHub block with no override -> stop row 1; an obstacle whose failed prerequisite is unchanged, on the viewer's own PR -> stop row 1; contract proposal -> preserve contract; `recommended=1` and stop placement on each).
- Row 1 on the final menu (AC 7) - `final-row-one` (merge row 1 on another author's PR with write access; merge row 1 when merge is available only through the admin override; approve row 1 without merge).
- One post menu (AC 8, 12) - `post-menu-combined` (one render; row 1 names its member rows and holds every runnable step except the PR copy of coverage, with the omission's reason stated; every runnable step is a row with its command; a fully skipped step is listed under the rows, not numbered; cleanup with a skipped sub-step is one row naming it; a drafted reply is a row; no menu after the reply).
- Set reply (AC 9, 10, 11) - `post-menu-set-reply` (`2,4`; `1,5`; `1,2,3,4,5`; step order; `stop` plus a number asks once; a failed step does not stop the rest; the closing message starts with `gauntlet: done merged` and lists steps not run as sentences with commands; `show evidence` re-renders the same menu and `reply 2` posts drafted reply 2, not row 2; a reply on an approved PR whose head moved is `skipped - head moved` with no new menu; a picked `/skill:` item that pauses at its own gate is reported as paused, the remaining picked steps run after it returns, and one closing message follows; `stop` on a queued merge ends `gauntlet: done merge-queued` and lists the pending steps as waiting for the merge).
- PR-named steps (AC 13, 14) - `post-step-pr-named` (one documented command -> row and row 1, with the source sentence in the row; none or two distinct commands -> open, not run; PR-supplied command text not executed; the same action named in the PR body and the spec, or the same command cited twice -> one row; an action whose command is a `## cleanup` item -> that item's row only, run once; a note about what is observed after merge -> no step).
- Set mode (AC 15) - `batch-post-menu` (one post menu per merged PR in its own message; each PR retires with `gauntlet: retired #<N>` and no terminal marker; one parent closing message with the per-PR not-run sentences; shared item in row 1 once, run at most once in the set and not offered after it ran; the summary line copies the child's standing sentence unchanged).
- Plain report (AC 16, 17, 18) - `plain-report` (three parts; none of the listed labels, field names, ids, counters or fences; covered and deferred behavior named in words with no row numbers; role, sync and prior review as sentences; `show evidence` still prints ids, counters and the row mapping).
- Plain payloads (AC 18, 19) - `plain-payloads` (review body findings with trailing file and line; reply without ids; coverage comment verbatim and unfenced).

Eval samples, existing: a sample whose expected fact names a recommended row, a removed label, a post-merge row or the re-render is edited to the new behavior and rerun. `course-assess-terminal` keeps `stop` as row 1 after a completed assess with nothing changed (D2 rule 4). A sample whose `case.md` premise starts from a removed menu, the re-render or a removed record field has that premise fixed even when no expected fact changes; it is rerun only when an expected fact is edited. Seven such samples in `gatekeep-pr` sit outside the candidate lists: cleanup-keyed-destroy-recorded, cleanup-keyed-destroy-partial-failure, cleanup-keyed-outside-home (premise: cleanup narrated through the re-rendered terminal menu), course-cap-exhausted, course-deliver-nits, course-deliver-no-mid-menu, course-stop-cleanup (record carries `cleanup_done`). The evidence names every premise-only edit as edited, not rerun. Candidates, from a loose match at `1aba5977`:

- `gatekeep-pr` (37): batch-cleanup-stop, batch-failure-retry, batch-rebase-answers, batch-summary-queue, bypass-merge-pick-refused, bypass-merge-pick-revoked, conflict-free-sync, conflicting-file-sync, consent-contract-change-stop, consent-revoked, continued-conflict-fix-loop, course-assess-terminal, course-obstacle-unknown, course-ready-at-first-report, description-not-a-row, first-report-pending-ci, gate-line-first, loop-worker, menu-after-numbered-findings, menu-rows-omitted, nit-batch-row, nits-only-ready, no-flag-unchanged, other-author-confirm, per-ref-settlement, pr-body-false-claim, pr-body-pending-and-matched, pr-body-write-failure, prior-review-delta, prior-review-force-push, prior-review-same-head, red-ci-no-autofix, reviewer-placeholder, reviewer-row-reopen, role-line-requested, scoped-test-red-sync, wave-push-no-poll.
- `gatekeep-pr-merge-state` (9): all nine samples.
- `gatekeep-pr-scope` (11): cleanup-after-approve, cleanup-merged-at-step-1, cleanup-no-section, cleanup-null-issue, deferred-with-ref, deviates, elsewhere-settled, mixed-coverage, no-spec-quality, post-merge-menu, ticket-drifted.

Samples outside these lists are not run; the evidence names them as not covered.

Script tests (`npm test`):

- Every published gate id resolves to the state table (AC 20) - `scripts/gate-contract-lint.mjs` through `scripts/ci.mjs`, and the heading assertion in `scripts/gatekeep-comment-reconcile.test.mjs`.
- Terminal outcomes and the settlement row are unchanged (AC 20) - `extensions/telemetry-settlement-contract.test.ts`, `extensions/telemetry-leg.test.ts`.
- No file references `decision-menu.md` (AC 21) - `scripts/gatekeep-comment-reconcile.test.mjs`.
- The set-reply rule is in `post-selection-loop.md` `### Next action` and named by the post archetype (AC 9, 10) - `scripts/gatekeep-comment-reconcile.test.mjs`.
- `--admin` stays bound to the bypass path in `menus.md` - `scripts/gatekeep-bypass-pick.test.mjs`.
- Migration of `scripts/gatekeep-comment-reconcile.test.mjs` (44 tests) and `scripts/gatekeep-bypass-pick.test.mjs` (2 tests). The reconcile file reads `decision-menu.md` at load, so the missing file fails every test in it; it also asserts the exact heading list of `menus.md`, slices `menus.md` by the removed headings, and pins `report.md` forms that D5 reverses, beyond the 22 label lines (1 in the bypass file). The plan lists every affected test by name in two classes. Mechanics (D0 keeps them: merge availability, cap extension, guard results such as `skipped - needs a landed change`): the assertion is re-pointed at the section that now owns the rule and keeps what it checks. Rendering: the assertion is rewritten to the sentence that replaces it, or removed, and the plan records the D-clause that authorizes that rendering change. No mechanics assertion is deleted together with its text. The load of the deleted file and the heading and section slicing are part of this migration.
- File size ceiling (AC 21) - the instruction-size lint in `scripts/ci.mjs`.
- Directory total below 218,934 bytes (AC 21) - none: measured once with the command in the AC row at verification; a standing test would block later growth this spec does not forbid.
- Live multi-PR dispatch and a live PR run - none: no PR is gated in this flow; the set-mode samples replay text only.

## Documentation impact

Applied per `reference/documentation-impact.md`.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` - Architecture (three menus, how row 1 is chosen, the single post-merge pick, PR-named steps and where their commands come from, the plain-language report; major procedures and security: the command trust boundary), the overrides-table row for `## cleanup` items and the `## cleanup` section line that names the `cleanup` menu row (both now name the post menu pick); `doc/gate-contract.md` - Gates, Terminals, Reading a reply (states map to archetypes, `recommended=1`, set reply on post states; communication contract); `CHANGELOG.md` - Unreleased
- Derived / memory docs invalidated: none

`doc/configuration.md` is unchanged: the terminal outcomes telemetry parses do not change.

## Out of scope

- Telemetry publication and any mention of it in the skill.
- Renaming gate ids, terminal outcomes or the settlement row.
- Fusing the final and post menus into one pick.
- The wording of other skills' gates, including a nested skill invoked from `## cleanup`.
- The per-step result lines and the set-mode queue lines, which keep their form.
- The two `--rebase` stops before the first report.
- Changing what `check-delivery` proves or when it runs.
- The release that ships this change.

## Open questions

- Whether a posted comment was ever fenced in practice is unconfirmed; the design removes the fenced templates and forbids fences either way.
- The last acceptance row passes on any reduction below 218,934 bytes. D0 sets a design target of 213,856 bytes or less (the baseline minus the removed `decision-menu.md`); an alternative is `menus.md` plus `report.md` below their combined 20,664 bytes. Neither figure was measured against a draft. Whether the acceptance row adopts a target is the user's scope decision at the gate; until then the row binds as drafted and verification reports the measured total against the D0 target.
