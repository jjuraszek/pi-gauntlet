# Saved-answer and text-check repair for the gauntlet entry tree

**Goal:** The fifteen tests that fail on PR #176 in the `npm test` regression group, and the two approval-menu tests outside that group that fail for the same reason, pass on the branch: two text assertions follow the reworded instruction sentences, three pre-move saved answers are accepted through the existing accepted-fingerprint list, twelve saved answers are re-recorded by the eval runner, and the release notes name the two behavior changes a porter meets.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** waves
**Ticket:** #174
**Predecessor:** doc/specs/2026-11-23-gh-174-gauntlet-entry-phase-tree.md, `### Eval` bullet "Three new samples, the only model-eval runs of this change" and the model-eval row of `### Paid and external actions` only

## Problem

PR jjuraszek/pi-gauntlet#176 - Fold the eleven gauntlet run steps into one hidden entry skill. Stated intent: the package registers eleven skills instead of 22, one hidden entry skill `gauntlet` holds the run's steps in a five-phase tree, the phase tracker names the next instruction file, and the old entry command, step names, gate ids, overrides headings and overrides file name stop working with no alias, as a major. The PR binds ticket #174 (first tracker reference in the PR body's first line; the title names none). PR-carried spec: `doc/specs/2026-11-23-gh-174-gauntlet-entry-phase-tree.md`.

constraints added since fork: none - the fork point is base HEAD `590bb884eaaff246d10e169cf0fcff70cba9a732`.

Request, verbatim: "we need hotfix of those test", then "fold it any code concerns, don't question the setup itself", then at the second question "just make also short sweep of this change. it shouldn't materially affect normal gauntlet usage (after using new skill and porting override md of course)".

Both hosted `test` jobs fail on head `97a48eebcb0450175a2051328a60616a3b6b9174`. In the `scripts/ci.mjs` regression group, 15 tests in 8 files fail on the branch and pass on `590bb884`:

| Count | What the test reads | First failing assertion |
|---|---|---|
| 2 | `scripts/gatekeep-comment-reconcile.test.mjs:181,540` against `skills/gatekeep-pr/reference/batch.md:49` and `skills/gatekeep-pr/reference/findings.md:144` | the pattern expects a sentence commit `cbf5b397` reworded |
| 2 | `spec-gate/all-none`, `spec-gate/flag-replies` in `scripts/brainstorming-bare-approve.test.mjs` | saved `factsSha` differs from `sha256(expected.md)` |
| 3 | `shape-ticket/pr-body-proof`, `gauntlet/pr-body-drafted-row`, `gauntlet/post-action-sorted` in `scripts/delivery-stage-authoring.test.mjs` | stale candidate or stale judgment |
| 5 | `conformance-reviewer/{ci-step-is-the-change,legs-verification-line,prompt-stage-sentence,stage-only-sentences,mixed-row}` in four `eval/conformance-reviewer/*.test.mjs` files | stale or failed replay |
| 1 | `spec-council-applier/pr-description-finding` in its test | stale or failed candidate |
| 2 | `gatekeep-pr/no-arg-discovery-cc-multi`, `gatekeep-pr/typed-list-note` in `scripts/gatekeep-comment-reconcile.test.mjs` | stale facts hash; the saved `typed-list-note` output runs `git show origin/main:.pi/gauntlet-overrides.md` where the test expects `.pi/gauntlet.md` |

Outside that group, `scripts/brainstorming-council-reply.test.mjs` (saved `spec-gate/row-3-reply`) and `scripts/brainstorming-draft-publication.test.mjs` (saved `spec-gate/option-6-handoff`) fail on the branch for the same reason and pass on base; nothing runs them, which is why they went stale unreported.

The branch edited instruction text, sample inputs and expected facts and re-recorded no saved answer. A saved answer carries the hash of the text it ran against (`eval/lib/records.mjs` `cellReusable`, `judgmentCurrent`), so the tests reject it. Copying new hashes onto old answers is not a repair: base `eval/README.md` forbids it, and in a scratch copy it left `typed-list-note` and `pr-description-finding` failing.

Framing: kept - the user instructed not to question the setup, and ticket #174 records the no-alias, no-fallback, no-warning decisions. The scout's objection (re-recording every stale record is the wrong repair) names no alternative to the ask, which covers the samples the tests read, not the 588 stale ones.

### Decisions taken in the brainstorm

| Question | Answer |
|---|---|
| Ticket row 37 beside re-recording move-only samples (cut question, options A in-scope with a reading, B deviates, C deferred, D repair the ticket) | A - the row limits what counts as evidence for the move; the three named samples stay the only evidence, and re-recording saved answers is upkeep of the regression tests |
| Reach over the four test files failing outside the check | B - include the two that read saved approval-menu answers; exclude the two recorded resume sessions |
| How stale saved answers are repaired | B - accept the three approved samples `spec-gate/all-none`, `spec-gate/flag-replies` and `spec-gate/option-6-handoff` through the `archived` map in `scripts/replay-facts.mjs`; re-record the other twelve. The three are the approved list, not every sample whose reader fails only on a facts hash: `gatekeep-pr/no-arg-discovery-cc-multi` fails the same way and stays in the approved twelve-run set |
| Design round 1, including adding the two approval-menu tests to `scripts/ci.mjs` | approved without correction |
| Design round 2, including the rule for a fresh answer that still fails | approved without correction - restore, leave the test red, return to the human; no instruction text is reworded |

Row 3's `deferred: #174` disposition is carried from the PR body and the PR-carried spec (line 81; line 525 "AC 3: only the pre-merge live proof is deferred to the maintainer if impractical here"). Neither records a cut question or a user answer for it, and this brainstorm did not ask it. The row text and the two-engine behavior requirement stand under every answer; the disposition is settled at the gate (Open questions).

### Checked claims

| Claim | Lookup | Result |
|---|---|---|
| The check fails on the PR head | `gh pr checks 176`; runs 45364178613 and 45364194529 | held - both `test` jobs fail in `Validate repo` |
| 15 tests fail in 8 files and all pass on main | each of the 42 files of the `scripts/ci.mjs` eval and script group run alone on `97a48eeb` and on a snapshot of `590bb884` | held - branch 596 pass, 15 fail; base all pass |
| Two failures are text assertions the branch outdated | the two test lines against `batch.md:49` and `findings.md:144`; commit `cbf5b397` | held - updating the two patterns in a scratch copy turns both green |
| Thirteen failures read saved answers recorded against pre-move text | hash comparison of each saved record against the current assembly | held - every candidate `skillSha` differs; six also differ in `inputSha`, seven in judgment `factsSha` or `intentSha` |
| Rewriting hashes is not a repair | scratch-copy restamp, then the 8 files rerun | held - 11 of 13 pass; `typed-list-note` and `pr-description-finding` still fail |
| A normal sample run re-records only stale cells | `eval/run.mjs:372-409` | held - a saved candidate whose `skillSha` equals the base text is promoted to baseline, so 7 samples need 2 candidate cells and the rest 4; up to 2 judgments each, one retry, one confirmation replay on a regression |
| Six of the thirteen samples test files whose only change is the move | word diff of base and branch assemblies from `prepareTarget` | held - `conformance-reviewer` (5): one path, one reworded pointer; `spec-council-applier` (1): `roasting-the-spec skill` -> `gauntlet spec council` |
| The other seven test text that changes what the model emits or reads | same word diff | held - gate id `brainstorm/user-review-gate`, `/skill:gauntlet`, overrides file name and block scoping, the gate-id formation rule |
| Ticket row 37 and the carried spec bar a model run for a move-only file | ticket body; carried spec lines 392 and 402 | held - contradicts the six currency assertions; settled by the row 37 reading above |
| The ticket's three behavior samples are recorded and current | stale scan; per-sample reports | corrected (the session first said one sample) - `gauntlet/ordinary-request-no-run`, `gauntlet/handoff-follows-pointer`, `gatekeep-pr/overrides-own-block-only` are current |
| An old-only overrides file ignored silently is a defect | ticket row 33 and Out of scope; `extensions/lib/overrides.ts:4-9` | corrected - required behavior; no change |
| pi-condense does not protect the new overrides file name | pi-condense `src/types.ts:596` | corrected - `**/.pi/gauntlet.md` is protected; root `gauntlet.md` and `doc/gauntlet.md` are not, a companion change per the ticket |
| `scripts/gauntlet-tree-lint.mjs:64` is a leftover old name | `scripts/gauntlet-tree-lint.mjs:62-140` | corrected - it is the lint's retired-names input |
| Earlier run records vanish from the performance report | `src/bins/gauntlet-performance.mjs:63-66`; `CHANGELOG.md:8`; ticket row 34 | held as designed - omitted until `--migrate-records` |
| Two tests outside the check fail on the branch | all 48 test files absent from `scripts/ci.mjs` run on branch and main | corrected - four regress: the two approval-menu tests above, plus `scripts/resume-read-traces.test.mjs` (C1 ledger, C1 plan) and `scripts/resume-coordinated-evidence.test.mjs` (C2), which compare a recorded tool-enabled session; four more fail identically on main (`eval/housekeeping/unpushed-amend-report`, `eval/housekeeping/unpushed-remote-ahead-stop`, `scripts/commit-contract-docs`, `scripts/resume-current-stages`) |
| A broad re-recording is allowed | base `eval/README.md` Iterating on a skill edit; base `AGENTS.md` Change process | held as a constraint - only selected samples; the other stale samples stay stale |
| Sibling repos still name retired surfaces | `pi-cohort/AGENTS.md:120`, `pi-quiver/AGENTS.md:146`, `pi-condense/AGENTS.md:128,157` | held - companion changes per the ticket |
| Re-recording is the branch's only treatment of a pre-move answer | `scripts/replay-facts.mjs` (commit `8b0d1735`) and its 8 importers | corrected - an `archived` map pins `<old skillSha>/<sample>` to the old facts hash for six samples; `brainstorming-bare-approve.test.mjs:33` and `brainstorming-draft-publication.test.mjs:43` still compare `sha256(expected.md)` directly |
| Re-recording one sample touches only its failing test | `rg` of each sample name over the test files | corrected - `spec-gate/flag-replies` is also read by passing `brainstorming-allowance-approval`, `-budget-only-approval`, `-funded-approval`, `-rejected-replies` and out-of-check `-stop-approval`; `gatekeep-pr/typed-list-note` is also read by `scripts/gatekeep-reject.test.mjs`; the others have one reader each |
| Move-only tests demand a current `skillSha` | `eval/conformance-reviewer/legs-verification-line.test.mjs:41-48` | held - `cellReusable` against the working-tree assembly |
| The non-test code changes hold a defect to fold in | read of `git diff 590bb884 97a48eeb` for `extensions/`, `src/bins/`, `eval/run.mjs`, `eval/lib/{hygiene,lint,tracker-replay}.mjs`, `scripts/replay-facts.mjs`, `scripts/ci.mjs`, `.github/workflows/` | none found; no test file left the `ci.mjs` list (87 at base, 90 at head). Not read: `scripts/gauntlet-tree-lint.mjs` (406 new lines), three other lint scripts, skill text beyond the word-diff fragments |
| Pinning the facts hash is enough for the three accepted samples | saved `candidate.json` of `all-none`, `flag-replies`, `option-6-handoff` against every other assertion of the two tests | held - both models `status: ok`, `judge.candidateOutputSha` equals `sha256(output.text)`, every listed fact id `holds`; neither test checks `skillSha` |
| A run leaves other samples' evidence untouched | `eval/README.md`; `eval/run.mjs:426` | corrected - each model-calling run overwrites `eval/<target>/report.md`; `eval/gauntlet/report.md` and `eval/gatekeep-pr/report.md` are row 37 evidence |
| The runner calls models through the local `pi` binary | `eval/run.mjs:20`; `eval/lib/models.mjs` | held - two replay models and one judge, fixed there |
| Runner outcomes | `eval/README.md`; `eval/run.mjs:417-427` | held - exit 0 improved or unchanged; 1 regressed, inconclusive, error or save failure; 2 refused before any model call or write; 130 interrupted with in-flight samples unwritten |
| `eval/README.md` needs an edit | its `## CI` section; `rg "replay-facts"` over the guides | dropped - the repair changes no rule it states; its CI list already omits the eleven `scripts/brainstorming-*.test.mjs` files, a gap that predates this repair |
| An ordinary run after `/skill:gauntlet` and a ported `gauntlet.md` behaves as before (usage sweep of `590bb884..97a48eeb`) | `find skills -name SKILL.md`; entry frontmatter at both revisions; `extensions/phase-tracker.ts:66-88,1212,1326-1331`; `git diff -M --word-diff` per renamed file; `scripts/gauntlet-tree-lint.test.mjs`, `scripts/retired-names.test.mjs` (34 pass); `.claude-plugin/marketplace.json` | held with two ticket-decided changes - eleven skills, same entry description and hidden flag, all six pointer files exist, both engines start verify themselves as at base, largest moved files change 126-194 of 3961-7224 words |
| The release notes tell a porter both changes | `CHANGELOG.md:1-75` grep for `backtick`, `loop engine`, `test entrypoint`, `finding`, `disprov` | not found - neither the review-reception stop (`skills/gauntlet/implement/waves/waves.md:117`, `skills/gauntlet/conformance-check.md` Convergence b-c) nor the loop engine's key-only verification command is mentioned |
| Both replay providers and the judge are signed in | needs a model call | not checked - the first sample run shows it |
| Each re-recorded answer satisfies its test | needs the runs | not checked - Errors and edge cases holds the rule |
| The whole non-eval diff is free of defects | partial read above | not checked beyond the files listed |

### Implicit dependencies

| Item | Lookup | Result |
|---|---|---|
| `pi` executable for replays | `command -v pi` | found |
| Baseline revision for the runner | `git merge-base origin/main HEAD` = `590bb884` | found |
| Provider credentials for the replay models and the judge | needs a model call | not checkable |
| Shared `eval/<target>/report.md` per target | `eval/README.md`; three targets take more than one of the twelve samples | found - same-target runs need a serial order |
| `npm test` rebuilds `bin/` in the checkout | `scripts/ci.mjs:478-486`; scratch rebuild and `cmp` | found - bundles byte-identical |

## Acceptance criteria

Ticket #174, Acceptance Criteria, rows verbatim:

- [ ] With the package installed in pi, the skills it registers are exactly `gauntlet`, `shape-ticket`, `gatekeep-pr`, `check-delivery`, `chase-bug`, `linear`, `forge-skill`, `housekeeping`, `gauntlet-handoff`, `gauntlet-resume` and `gauntlet-performance`; the model-visible skill list and the `/skill:` menu show no other pi-gauntlet entry, and `gauntlet` plus the five others hidden from the model today (`chase-bug`, `housekeeping`, `gauntlet-handoff`, `gauntlet-resume`, `gauntlet-performance`) are hidden.
  in-scope
- [ ] Invoking `/skill:gauntlet` starts a run as `/skill:brainstorming` does today: the phase tracker's status reports brainstorm in progress, and the guards that apply only to an entered run apply (for example, completing verify before the conformance review ran is refused).
  in-scope
- [ ] On each engine, a run started with `/skill:gauntlet` goes from the entry command through the ship ending the person selects, and that ending performs its action, without the person typing a step command; the points where the instructions wait for a person - gates and questions, in order - are the same as before the move.
  deferred: #174 - live proof only; the two-engine behavior remains required
- [ ] Under `skills/gauntlet/` the directories directly below the entry file are exactly `brainstorm`, `plan`, `implement`, `verify` and `ship`. A phase's files sit in its directory or in one optional sub-phase directory below it (for example the two ways implementation runs, under `implement`). No directory in the tree carries a retired step's name.
  in-scope
- [ ] The layout rule - directories mirror the run - has one wording in the repo: the skill-authoring guide's placement rule for a skill's supporting files either states it for files under `skills/gauntlet/` or links to it, and no second wording exists. The rule says where a file goes that more than one phase reads, and where a file goes that skills outside the run read (today: the menu layout rules, the commit-message rules, the return-file cleanup).
  in-scope
- [ ] Adding a directory directly under `skills/gauntlet/` other than the five phases, or a second `SKILL.md` anywhere below `skills/gauntlet/`, makes `npm test` fail with a message naming the path.
  in-scope
- [ ] The instructions of all eleven retired steps (`writing-plans`, `subagent-driven-development`, `loop-implementation`, `roasting-the-spec`, `finishing-a-development-branch`, `using-git-worktrees`, `verification-before-completion`, `requesting-code-review`, `receiving-code-review`, `dispatching-parallel-agents`, `test-driven-development`) live in files of that tree, not in a separately registered skill.
  in-scope
- [ ] Comparing each moved file with its text before the move shows changes only in: file paths and link targets; renamed names (entry skill, step, gate id, overrides file); the menu layout rule that says how a gate id is formed from its owner; the removed skill header of each step; sentences that advertise a step's standalone use or tell a person to invoke it as a command; the hand-off and recovery sentences that the phase tracker or `/skill:gauntlet-resume` replaces; and the sentences that say what to read from the overrides file, which follow the regrouped file - including the end of `## conventions`, the commit-subject convention now taken from the repo's agent instructions, and the loop engine's dropped fallback for the verification command. The sole additional change allowed is one pointer to the existing review-reception instructions at each of two sites: the integrated-wave review and the review after a conformance fix. No other instruction is added, removed or reworded.
  in-scope
- [ ] Searching the shipped skills, agent personas, extensions, bin sources and bundles, scripts, tests, `README.md`, `AGENTS.md`, the guides under `doc/`, this repo's own overrides file, and the eval runner, target definitions and sample inputs (specs, plans, the changelog and saved eval results excluded) finds none of the eleven retired step names, no `/skill:brainstorming`, no `skills/brainstorming` path, no gate id or overrides heading named `brainstorming`, and no `gauntlet-overrides`. The one exception is the input of a check that proves an old name is absent or ignored, plus the input key of a one-time record conversion if the spec picks one. No eval target directory carries a retired step's name.
  in-scope
- [ ] The README skill inventory lists exactly the eleven skills the installed `/skill:` menu shows.
  in-scope
- [ ] Given no run in progress, an ordinary implementation request - no `/skill:gauntlet`, no ask for the gauntlet - starts no phase and loads no step instructions.
  in-scope
- [ ] On the task-plan engine, completing brainstorm, completing plan and completing verify each make the phase tracker's reply name the next phase's instruction file (plan, the task-plan engine's file under `implement`, ship); on the loop engine, completing brainstorm and completing verify do (the loop engine's file under `implement`, ship). Each such reply carries the file pointer, not the step's instructions, and contains no `/skill:` command.
  in-scope
- [ ] Given a run in progress, asking the phase tracker for status names the current phase's instruction file; given no run in progress, it names none.
  in-scope
- [ ] For the five hand-offs the phase tracker announces (three on the task-plan engine, two on the loop engine), no instruction file carries a sentence naming the next phase's file or command; the pointer comes from the phase tracker.
  in-scope
- [ ] Each phase tracker message that names a retired skill today (the ship advisory, the two recovery messages, the branch guard, the parent-write warning) names instead a file under `skills/gauntlet/` that exists; what each guard blocks and when each recovery message fires is unchanged.
  in-scope
- [ ] Given a run saved by the upgraded package at each supported resume point, invoking `/skill:gauntlet-resume` identifies the recorded phase and directs the agent to its next unfinished step without restarting the brainstorm phase or invoking a retired step as a skill.
  in-scope
- [ ] Every reference to a package-owned file in the retained skills and their reference files, the agent personas and the extension messages resolves from its installed caller; consumer-owned paths and illustrative examples are not package files.
  in-scope
- [ ] Where a retained skill cites a numbered step of a moved file (today `gatekeep-pr` cites Step 6 of the ship step and Steps 1a and 2b of the worktree step), the citation names a heading that exists in the moved file.
  in-scope
- [ ] Installing the plugin in Claude Code from the marketplace lists `shape-ticket`, `gatekeep-pr`, `check-delivery`, `chase-bug`, `linear`, `forge-skill` and `housekeeping`, as it does today, and every relative file reference inside those seven resolves in the plugin checkout.
  in-scope
- [ ] With only the Claude Code plugin installed, the parts of `chase-bug`'s hotfix, `gatekeep-pr`'s fix wave and `housekeeping`'s fix that today read a file from a retired step's directory (the commit-message rules, the return-file cleanup) find that content and complete without the pi phase tracker.
  in-scope
- [ ] A run obtains a reviewer result at each of its three review points - per wave in the task-plan engine, over the whole diff at verify in both engines, and after a conformance fix - and the orchestrating agent checks each finding against the diff before acting on it.
  in-scope
- [ ] Given a reviewer finding that the diff contradicts, the orchestrating agent cites the contradicting evidence and makes no edit for that finding.
  in-scope
- [ ] For every row of `doc/gate-contract.md` filed under `brainstorming` or a retired step's name (today 14 gate and question rows under retired step names, 9 under `brainstorming`, and 6 ending rows under `finishing-a-development-branch`), the gate, question or ending still renders and its row names a rendering file that exists. Each gate and question id is renamed to a name taken from the new tree (the spec picks the exact ids); no row and no emitted id starts with `brainstorming` or a retired step's name; and the phase tracker message and the menu layout rules that quote an id quote the new one.
  in-scope
- [ ] The README shows the recognized overrides file as one outline in place of today's heading table: a `# shared` block and one block per skill that reads settings, headed with that skill's name (for example `# gauntlet`, `# gatekeep-pr`, `# shape-ticket`), each with every section it may hold and who reads it. Block and section names are lowercase and one token (for example `## issue-tracker`), and none is named after `brainstorming` or a retired step. The one-token rule applies to block and section headings, not to setting keys.
  in-scope
- [ ] Each skill's overrides paragraph - in the run's files and in the ten other skills - tells the agent to apply the recognized sections of `# shared` and its own skill's block, without a relevance judgment, and nothing else: no other skill's block, no text directly under `# shared`, and no section of `# shared` that the README outline does not list.
  in-scope
- [ ] The run's block `# gauntlet` holds one section per phase: `## brainstorm`, `## plan`, `## implement`, `## verify` and `## ship`. Each moved step's file names the section of the phase it sits in and no other phase's section, both ways implementation runs read `## implement`, and text directly under `# gauntlet`, above its first section, applies to all five phases.
  in-scope
- [ ] A setting that more than one skill reads is written once, as a section of `# shared` - today the issue tracker, the worktree settings, the verification command, the cleanup steps after a merge (read by the pull-request gate and by the run's ship phase), the sibling repos and the deploy layout - and every skill and extension that reads it reads it there.
  in-scope
- [ ] A setting that one skill reads sits in that skill's block - for example `timeout minutes` and `merge policy` directly under `# gatekeep-pr`, with no `## PR gate` section, and the happy path, which only phases of the run read, under `# gauntlet` - and no skill reads a setting from another skill's block.
  in-scope
- [ ] `## conventions` and `## comms style` are no longer read: no shipped skill, agent persona or guide names either as a section to apply, and the commit-message rules take a repo's commit-subject convention from the repo's agent instructions. The README says where such rules go: a repo-wide rule in the repo's agent instructions, a rule for one skill or for the whole run directly under that block's heading.
  in-scope
- [ ] Given an overrides file with no verification command in `# shared`, the loop engine discovers the project's test entrypoint, the step it takes today when no command is configured; it never takes a command in backticks from the verify section as the verification command.
  in-scope
- [ ] This repo's own overrides file follows the README outline.
  in-scope
- [ ] The package reads project overrides from `gauntlet.md` at the three locations it checks today, in the same order (`.pi/gauntlet.md`, `gauntlet.md` at the repo root, `doc/gauntlet.md`; first found wins): every skill's overrides block, including the seven skills of the Claude Code plugin, and every extension and bin that reads the file use that name.
  in-scope
- [ ] Given a repo that holds both `.pi/gauntlet-overrides.md` and `.pi/gauntlet.md` naming different trackers, the extensions that read the tracker use the one from the `## issue-tracker` section of `# shared` in `gauntlet.md`; given a `gauntlet.md` whose only tracker section sits under another block, they find no tracker; given a repo that holds only `gauntlet-overrides.md`, they find no overrides. The other sections that an extension or a bin parses - today the sibling repos and the spec index's docs list - are read only from the block and section the README outline gives them.
  in-scope
- [ ] After the upgrade a new run's records are stored under the new entry's name; `/skill:gauntlet-performance` reports them and the spec search index lists them. Given a telemetry branch that holds records written before the upgrade, both either show those records under the new name or omit them, and the release notes say which (the spec picks one). Outside a one-time conversion, no shipped code reads or writes records under a `brainstorming` key.
  in-scope
- [ ] For every eval target, after the move, the runner prepares each sample's baseline and working-tree prompts without a refusal or a missing-file error and without a model call - covering structure, hygiene, intent binding, every declared skill file at both revisions, and the rule on where an edit target's files sit - and `npm test` fails when a target would be refused.
  in-scope
- [ ] For a target whose instruction files are no longer a registered skill, the prompt the runner builds contains no `/skill:` command naming them.
  in-scope
- [ ] Model-eval evidence for this change is limited to the behavior it alters: at least one selected sample in which the agent follows the phase tracker's pointer at a hand-off, at least one for the ordinary request with no run in progress, and at least one in which a skill applies the recognized sections of `# shared` and its own block of an overrides file and leaves another skill's block unapplied. A file whose only change is the move gets no model-eval re-run; the review-point, reviewer-finding and resume rows above are checked against the moved text and saved-run fixtures.
  in-scope
- [ ] The release notes of the major list, old to new: the entry command, each retired step name with the file that now holds its instructions, each renamed gate id, the overrides file name, and each heading of today's README table with the block and section that replaces it or the statement that it is no longer read. They also say that a run interrupted before the upgrade is to be finished before upgrading, or on the previous major.
  in-scope

## Rework record

PR: jjuraszek/pi-gauntlet#176 - Fold the eleven gauntlet run steps into one hidden entry skill
Pre-rework head: 97a48eebcb0450175a2051328a60616a3b6b9174
Threads: none
Base: main @ 590bb88 - sync: no-op
Rework base: 97a48eebcb0450175a2051328a60616a3b6b9174
Keeps: the one hidden entry skill, the five-phase tree, the renamed gate ids, the regrouped `gauntlet.md` with no alias, fallback or warning, the run-record key and `--migrate-records`, the renamed eval targets, the three behavior samples and their reports, and row 3's deferral to #174.
Changes: two text assertions in `scripts/gatekeep-comment-reconcile.test.mjs` follow the reworded sentences; two entries join the accepted-fingerprint list and two tests read facts hashes through it; twelve saved answers are re-recorded by the eval runner; two approval-menu tests join the `scripts/ci.mjs` list; two sentences join the upgrade notes; the carried spec's supersession banner, already present below its title, names this spec and the limited scope.
Dropped claims: none
Scoped tests: none run (no documented file-scoped runner in the base overrides file)

### PR #176 - Fold the eleven gauntlet run steps into one hidden entry skill
keeps: One hidden entry, five-phase tree, renamed gate IDs and overrides with no compatibility alias; major-version change and live two-engine proof deferred to #174.
changes: Repair deterministic tests and the selected stale saved evidence through the runner or the existing accepted-fingerprint list, never by restamping a hash.
dropped claims: none

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gauntlet-entry-phase-tree
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: eval/README.md
Rules: doc/configuration.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: doc/install-internals.md
Rules: doc/personas.md
Rules: .pi/gauntlet.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/forge-skill/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/gauntlet-resume/reference/coordinated.md
Rules: skills/gauntlet/legs.md
Rules: skills/gauntlet/ship/legs.md
scope: none
design: owns `scripts/gatekeep-comment-reconcile.test.mjs`, `scripts/replay-facts.mjs`, `scripts/brainstorming-bare-approve.test.mjs`, `scripts/brainstorming-draft-publication.test.mjs`, `scripts/ci.mjs`, `CHANGELOG.md`, `eval/{shape-ticket,gauntlet,conformance-reviewer,spec-council-applier,gatekeep-pr,spec-gate}/results/` and `report.md`, the `for:` line of `eval/{conformance-reviewer,council,forge-skill,gauntlet,gauntlet-resume,loop,waves}/intent.md`, `eval/{ship,gauntlet-resume}/results/deferred-spec-stop/` with the `deferred-spec-stop` lines of `eval/{ship,gauntlet-resume}/intent.md`, and both specs under `doc/specs/`

## Design

The repair is four small edits and twelve runs of the existing eval runner on the PR branch. No file under `skills/`, `agents/`, `extensions/`, `src/bins/` or `bin/`, and no runner code under `eval/run.mjs` or `eval/lib/`, changes. In the six targets of section 3 (`shape-ticket`, `gauntlet`, `conformance-reviewer`, `spec-council-applier`, `gatekeep-pr`, `spec-gate`) no `intent.md`, `target.json`, `judge.md`, `replay.md` or `samples/` file is edited or added: `intentSha` covers the whole `intent.md` body, so an upkeep note there would stale the row 37 judgments. Section 6 records what the review of PR #176 added after these edits: the `for:` line of seven `intent.md` files, ten further runs, and the two `deferred-spec-stop` samples re-recorded for the repaired handoff-only stop.

### Reading of ticket row 37

Row 37 limits what counts as model-eval evidence for the move. `gauntlet/handoff-follows-pointer`, `gauntlet/ordinary-request-no-run` and `gatekeep-pr/overrides-own-block-only` stay the only evidence of the change's behavior. Re-recording a saved answer that a regression test reads is upkeep of that test: it is reported as upkeep and claims nothing about the move. The same reading applies to the carried spec's sentence "A file whose only change is the move gets no model-eval run".

### 1. Text assertions

In `scripts/gatekeep-comment-reconcile.test.mjs`:

- Remove: the pattern `/Resolve all named procedure dependencies relative to this root, never the PR worktree or cwd/` (line 181).
- Add: in its place, a pattern matching the current sentences of `skills/gatekeep-pr/reference/batch.md:49`: `Use this root to locate the installed procedure. Follow each relative link from the file that contains it, never the PR worktree or cwd`.
- Remove: the pattern matching `through SKILL.md` followed by the `## Wording rules` reference (line 540).
- Add: in its place, the same pattern with `through ../SKILL.md`, matching `skills/gatekeep-pr/reference/findings.md:144`.

Each new pattern keeps the full guarantee the old one asserted (the root rule with its "never the PR worktree or cwd" clause; the wording-rules owner), not a shorter substring.

### 2. Accepted pre-move answers

`spec-gate/all-none`, `spec-gate/flag-replies` and `spec-gate/option-6-handoff` keep their pre-move saved answers. Their only failing assertion compares the saved `factsSha` with the hash of the current `expected.md`. These three are the list the user approved, not every sample with that failure mode: the reader of `gatekeep-pr/no-arg-discovery-cc-multi` also fails only a facts-hash assertion, and that sample stays in the approved twelve-run set of section 3.

- Add: two entries to the `archived` map in `scripts/replay-facts.mjs`:
  - `8b65e167301569e59ea6977c0bb1e0099fe49fe3151238db6cdc6629af06ed8a/all-none` -> `bd18e257b5467e29f2e2663085382d8f42f2e2b8135b86ebb1e0eee73136aad6`
  - `bb16ff311a260eadfb4dcd259df3c85c1caa75ac395f9daf147e0096386a0e39/option-6-handoff` -> `69f3a0dec6cab946c7b4cc77cbaed6bbf8c6d9aa93d1be315070431a17644ae3`
- Remove: the direct `sha256(expected.md)` facts comparison in `scripts/brainstorming-bare-approve.test.mjs` (line 33) and `scripts/brainstorming-draft-publication.test.mjs` (line 43).
- Add: in both tests, an import of `replayFactsSha` from `scripts/replay-facts.mjs` and a comparison of the saved `factsSha` with `replayFactsSha(<saved record>, <expected.md text>)`, as `scripts/brainstorming-allowance-approval.test.mjs` does.

The `flag-replies` entry already exists. `flag-replies` is not re-recorded, so the five other tests that read it keep reading the same files.

### 3. Re-recorded answers

Run `node eval/run.mjs <target> <sample>` from the PR worktree for each row below. The runner takes the pre-move text from `git merge-base HEAD origin/main`, replays the stale cells on its configured replay models, has its configured judge compare the arms, and writes `eval/<target>/results/<sample>/{baseline,candidate}.json` and `eval/<target>/report.md`.

| Target | Sample | Read by | Stale replay cells |
|---|---|---|---|
| `shape-ticket` | `pr-body-proof` | `scripts/delivery-stage-authoring.test.mjs` | 2 |
| `gauntlet` | `pr-body-drafted-row` | `scripts/delivery-stage-authoring.test.mjs` | 4 |
| `gauntlet` | `post-action-sorted` | `scripts/delivery-stage-authoring.test.mjs` | 4 |
| `conformance-reviewer` | `ci-step-is-the-change` | `eval/conformance-reviewer/ci-step-is-the-change.test.mjs` | 2 |
| `conformance-reviewer` | `legs-verification-line` | `eval/conformance-reviewer/legs-verification-line.test.mjs` | 2 |
| `conformance-reviewer` | `prompt-stage-sentence` | `eval/conformance-reviewer/prompt-stage-sentence.test.mjs` | 2 |
| `conformance-reviewer` | `stage-only-sentences` | `eval/conformance-reviewer/stage-exclusion.test.mjs` | 2 |
| `conformance-reviewer` | `mixed-row` | `eval/conformance-reviewer/stage-exclusion.test.mjs` | 2 |
| `spec-council-applier` | `pr-description-finding` | `eval/spec-council-applier/pr-description-finding.test.mjs` | 2 |
| `gatekeep-pr` | `no-arg-discovery-cc-multi` | `scripts/gatekeep-comment-reconcile.test.mjs` | 4 |
| `gatekeep-pr` | `typed-list-note` | `scripts/gatekeep-comment-reconcile.test.mjs`, `scripts/gatekeep-reject.test.mjs` | 4 |
| `spec-gate` | `row-3-reply` | `scripts/brainstorming-council-reply.test.mjs` | up to 4 |

- Remove: none.
- Add: the runner-written `baseline.json` and `candidate.json` of the twelve samples; for each sample, a copy of the runner-written `eval/<target>/report.md` at `eval/<target>/results/<sample>/report.md`, made only after that attempt saved both records (runner exit 0) and every test in the sample's "Read by" column passes.
- Before a sample's first attempt, copy `eval/<target>/results/<sample>/` and `eval/<target>/report.md` to a checkout-local scratch folder (`doc/configuration.md#scratch-storage`). Errors and edge cases restores from this snapshot.
- Run samples of one target one after another. At most two targets run at the same time. The one-retry rule of Errors and edge cases is unchanged.
- After every attempt of a `gauntlet`, `gatekeep-pr`, `shape-ticket` or `spec-gate` sample - after the copy above on success, and on every failure exit - restore that target's `report.md` to its content at `97a48eebcb0450175a2051328a60616a3b6b9174`. `eval/gauntlet/report.md` and `eval/gatekeep-pr/report.md` are the row 37 evidence reports; `eval/shape-ticket/report.md` is the curated three-sample index; `eval/spec-gate/report.md` is the only checked-in report bound to the retained `flag-replies` answer. The restore does not wait for the target's last run.
- `eval/conformance-reviewer/report.md` and `eval/spec-council-applier/report.md` keep the content of their last successful run.
- `baseline.json` and `candidate.json` are written only by the runner. No hash, verdict or output in them is edited by hand.
- No other sample is run. No target-wide or cross-target run happens, including at completion.

### 4. Check list and release notes

- Add: `scripts/brainstorming-council-reply.test.mjs` and `scripts/brainstorming-draft-publication.test.mjs` to the test list at `scripts/ci.mjs:558`, beside the other `scripts/brainstorming-*.test.mjs` files.
- Add: two sentences under `## Unreleased` > `### Upgrade from 8.x` in `CHANGELOG.md`, each ending `(#174)`:
  - Reviewer findings, one sentence: at the per-wave review and after a conformance fix, the orchestrating agent checks each reviewer finding against the diff before acting and makes no edit for a disproved finding; only at the per-wave review, on a green `FIX_FIRST` whose findings are all disproved, it records the disputed verdict and stops without committing. The sentence does not attribute that stop to the review after a conformance fix, and does not imply that disproving findings cancels the repair of an independently failing verification command. Word the check from `skills/gauntlet/implement/waves/waves.md:117` and `skills/gauntlet/conformance-check.md` Convergence b, and the stop from `waves.md:117` alone.
  - Loop verification command, one sentence: the loop engine reads its verification command only from a `- verification command:` line under `# shared` > `## verification` and otherwise discovers the project's test entrypoint, so a command in backticks ported into `# gauntlet` > `## verify` is not taken. Word the key-or-discover rule from step 2 of `skills/gauntlet/implement/loop/loop.md`; the backticks clause is the consequence of that rule, not a quotation - the loop file mentions neither backticks nor `## verify`.

### 5. Carried spec

supersedes doc/specs/2026-11-23-gh-174-gauntlet-entry-phase-tree.md, `### Eval` bullet "Three new samples, the only model-eval runs of this change" and the model-eval row of `### Paid and external actions` only

- Add: none. The carried spec already holds the one supersession banner below its title (line 3), naming this spec and that scope; keep that single banner and add no second one. Every other section of the carried spec stands, including its Tests for the ticket rows and its Post-deployment housekeeping paragraph.

### 6. Answers re-recorded after the review repairs

Sections 1-5 are the repair as first approved. The review of PR #176 then found moved instruction text reworded beyond what the carried spec's `### Edits inside moved files` allows, and its repairs restore that text under `skills/gauntlet/`, `skills/gauntlet-resume/SKILL.md`, `skills/forge-skill/SKILL.md` and `agents/conformance-reviewer.md`. Those repairs follow the carried spec, not this one; the sentence above that no file under `skills/` or `agents/` changes describes sections 1-5 only. The restored text changes the candidate fingerprint of seven eval targets, so their `intent.md` `for:` line no longer matches and the saved candidate answers recorded against the earlier text are stale.

- Change: the `for:` line of `eval/<target>/intent.md` for `conformance-reviewer`, `council`, `forge-skill`, `gauntlet`, `gauntlet-resume`, `loop` and `waves`, to the fingerprint the runner reports for the current candidate text. No other line of an `intent.md` changes: the judge does not read the `for:` line and `intentSha` excludes it, so saved judgments stay current.
- Run `node eval/run.mjs <target> <sample>` for each row below, after the review repairs to instruction text are committed, under the rules of section 3 (pre-attempt snapshot, serial order within a target, at most two targets at once, per-sample report copy, report restore to `97a48eeb`, runner-written records only) and the one-retry rule of Errors and edge cases. These ten runs and the two `deferred-spec-stop` samples below are the only widening of section 3's "No other sample is run".

| Target | Sample | Read by |
|---|---|---|
| `conformance-reviewer` | `ci-step-is-the-change` | `eval/conformance-reviewer/ci-step-is-the-change.test.mjs` |
| `conformance-reviewer` | `legs-verification-line` | `eval/conformance-reviewer/legs-verification-line.test.mjs` |
| `conformance-reviewer` | `prompt-stage-sentence` | `eval/conformance-reviewer/prompt-stage-sentence.test.mjs` |
| `conformance-reviewer` | `stage-only-sentences` | `eval/conformance-reviewer/stage-exclusion.test.mjs` |
| `conformance-reviewer` | `mixed-row` | `eval/conformance-reviewer/stage-exclusion.test.mjs` |
| `gauntlet` | `pr-body-drafted-row` | `scripts/delivery-stage-authoring.test.mjs` |
| `gauntlet` | `post-action-sorted` | `scripts/delivery-stage-authoring.test.mjs` |
| `gauntlet` | `handoff-follows-pointer` | `scripts/entry-phase-evals.test.mjs` |
| `gauntlet` | `ordinary-request-no-run` | `scripts/entry-phase-evals.test.mjs` |
| `gatekeep-pr` | `typed-list-note` | `scripts/gatekeep-comment-reconcile.test.mjs`, `scripts/gatekeep-reject.test.mjs` |

- `handoff-follows-pointer` and `ordinary-request-no-run` stay row 37 evidence of the move's behavior, now recorded against the restored text. The other eight runs are upkeep of the tests that read them and claim nothing about the move.
- The `typed-list-note` run replaces a saved judgment that credits one model with the diff and paginated-comment reads its answer does not make. A fresh answer is kept only when each model's saved judgment agrees with what that model's answer shows.
- No other limit of sections 1-5, Errors and edge cases or Out of scope is relaxed: restored instruction text is not reworded again to make a fresh answer pass.

The gate review of PR #176 at `b1a74d48` then found that the handoff-only stop and the related retry instructions named the retired entry (`run brainstorming #N`). Its repair makes them name the registered `/skill:gauntlet #N` command under `skills/gauntlet/` and in `skills/gauntlet-resume/SKILL.md`; like the repairs above it follows the carried spec, not this one. The repair changes what the agent tells the person, so the `AGENTS.md` change process asks for the samples that exercise that sentence.

| Target | Sample | Read by |
|---|---|---|
| `ship` | `deferred-spec-stop` | `scripts/brainstorming-contract.test.mjs` |
| `gauntlet-resume` | `deferred-spec-stop` | `scripts/brainstorming-contract.test.mjs` |

- Run `node eval/run.mjs <target> deferred-spec-stop` for each row under the rules of section 3 (pre-attempt snapshot, per-sample report copy, runner-written records only) and the one-retry rule of Errors and edge cases, once after each committed repair to the stop sentence the sample exercises. Three runs preceded this authorization and are covered by it: `ship` once and `gauntlet-resume` twice, the second after the stop sentence gained a PR-number substitution because one model's first answer did not print the number. One further `gauntlet-resume` run follows the correction that keeps the numbered command off the route where no draft PR exists.
- After every attempt, restore `eval/ship/report.md` and `eval/gauntlet-resume/report.md` to their content at `b1a74d48`. Both are curated multi-sample reports, and `scripts/commit-message-contract.test.mjs` reads the `gauntlet-resume` one.
- Change: `eval/ship/intent.md` and `eval/gauntlet-resume/intent.md` each gain one sentence in the change description and one `deferred-spec-stop/notice` bullet under `## Expected to move`, and their `for:` line follows the candidate text. This is the only widening of "No other line of an `intent.md` changes" above; neither target is one of the six of section 3.
- Change: the expected facts of both `deferred-spec-stop` samples, and the `gauntlet-resume` sample's case and expected facts where they separate the route with a draft PR from the route without one.
- Change, without a run: the samples whose case or expected facts quote the retired command quote the registered one - `gauntlet/spec-pr-publish-legs`, `gauntlet/spec-pr-regate`, `gauntlet/spec-pr-regate-legs` and `worktrees/pr-head-caller-root`. Their saved answers are not re-recorded: staleness alone is not a reason to run a sample (`eval/README.md`). For `gauntlet` this is the only widening of the Design sentence that no `samples/` file of the six section 3 targets is edited.
- From here on the stop sentence is not reworded to make a fresh answer pass. A fresh answer that fails `scripts/brainstorming-contract.test.mjs` is a failed attempt under Errors and edge cases.

### Paid and external actions

Approving this spec authorizes the action below for the whole flow, across seed, rows, repairs and finish, with no per-step permission prompt. Any count in this spec is an estimate, not a limit.

| Action | Runner | Inputs |
|---|---|---|
| Model-eval run `node eval/run.mjs <target> <sample>`, including the runner's own judge retries and confirmation replays and the reruns allowed under Errors and edge cases | the implementing agent, from the PR worktree, through the local `pi` binary with the replay models and judge fixed in `eval/lib/models.mjs` | the twelve target and sample pairs of section 3, the ten of section 6 and the two `deferred-spec-stop` pairs of section 6 |

This table covers the repair work only and replaces only the model-eval row of the carried spec's `### Paid and external actions`. A paid or external action of the repair work that is not named here needs separate explicit authorization that adds it to this section. The carried spec's `gh issue close 174` and `/skill:release major` rows stand with their conditions (the close after merge and both successful live observations, the release after the close): this spec neither authorizes closing #174 or releasing now nor cancels those proof and sequencing gates.

## Errors and edge cases

- Runner exit 2 (refused before any model call or write, for example `origin/main` is not fetched): nothing was written; fix the cause and run the sample again.
- Runner exit 130 (interrupted): in-flight samples are unwritten; run the sample again.
- A failed attempt is any of: a provider or judge error, including a provider that is not signed in; a save failure, including one that leaves a new `baseline.json` beside an old `candidate.json`; a fresh answer the judge calls regressed or inconclusive; a fresh answer that fails a test reading it although the runner succeeded (for example an output that still names the old overrides file). Investigate, then restore `eval/<target>/results/<sample>/` and `eval/<target>/report.md` from the pre-attempt snapshot of section 3 before the one authorized retry. Without the restore an identical rerun reuses the saved candidate and its cached judgment and makes no model call, so confirm from the runner's output that the retry replayed the candidate cells.
- If the retry also fails, restore the snapshot again, leave that test failing, and return to the human with the failing fact, naming the provider on a provider error. No instruction text under `skills/` or `agents/` is reworded under this spec.
- A re-recorded `typed-list-note` answer must keep `scripts/gatekeep-reject.test.mjs` passing; a failure there is a failed attempt under the rule above.
- Two runs of one target at the same time race on `eval/<target>/report.md`; section 3's serial order prevents it.
- The four tests that fail identically on main and the two recorded resume sessions stay failing outside the check; none is in the `scripts/ci.mjs` list.

## Tests

- The batch contract's root sentence and the findings' wording-rules pointer match the current text - `scripts/gatekeep-comment-reconcile.test.mjs` ("multi-PR contract: handoff and foreground batch", "report.md renders three unlabeled parts and delegates the recommendation")
- The two re-recorded `gatekeep-pr` answers are current and `typed-list-note` reads the three `gauntlet.md` paths - `scripts/gatekeep-comment-reconcile.test.mjs` ("discovery and role replay structure: no-arg-discovery-cc-multi", "discovery and role replay structure: typed-list-note")
- The re-recorded `typed-list-note` answer keeps its other reader passing - `scripts/gatekeep-reject.test.mjs`
- `all-none` and `flag-replies` pass through the accepted-fingerprint list - `scripts/brainstorming-bare-approve.test.mjs`
- `option-6-handoff` passes through the accepted-fingerprint list - `scripts/brainstorming-draft-publication.test.mjs`
- The tests that already read `flag-replies` still pass on unchanged files - `scripts/brainstorming-allowance-approval.test.mjs`, `scripts/brainstorming-budget-only-approval.test.mjs`, `scripts/brainstorming-funded-approval.test.mjs`, `scripts/brainstorming-rejected-replies.test.mjs`, and `scripts/brainstorming-stop-approval.test.mjs` (run once by hand; it stays outside the `scripts/ci.mjs` list)
- The re-recorded `row-3-reply` answer shows the approval menu twice with identical `brainstorm/user-review-gate` markers - `scripts/brainstorming-council-reply.test.mjs`
- The three delivery-wording answers are current - `scripts/delivery-stage-authoring.test.mjs`
- The five reviewer answers are current - `eval/conformance-reviewer/ci-step-is-the-change.test.mjs`, `eval/conformance-reviewer/legs-verification-line.test.mjs`, `eval/conformance-reviewer/prompt-stage-sentence.test.mjs`, `eval/conformance-reviewer/stage-exclusion.test.mjs`
- The council-applier answer is current - `eval/spec-council-applier/pr-description-finding.test.mjs`
- The handoff-only stop names the registered command and both `deferred-spec-stop` answers print it with the PR number - `scripts/brainstorming-contract.test.mjs`
- The curated `gauntlet-resume` report still marks its historical records - `scripts/commit-message-contract.test.mjs`
- The row 37 evidence reports, the `shape-ticket` index and the `spec-gate` `flag-replies` report are unchanged from `97a48eeb` - none: `git diff 97a48eeb -- eval/gauntlet/report.md eval/gatekeep-pr/report.md eval/shape-ticket/report.md eval/spec-gate/report.md` prints nothing
- The two approval-menu tests run in the regression group - none: the list in `scripts/ci.mjs` is the group's own input
- The two release-note sentences - none: prose, read at review
- A run that is refused, interrupted, errors or yields a failing answer - none: operator procedure, no file under test
- Ticket rows 1-38 - the tests the carried spec's `## Tests` names, unchanged by this repair

## Documentation impact

Per `reference/documentation-impact.md`.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `CHANGELOG.md` - `## Unreleased` > `### Upgrade from 8.x` gains the reviewer-findings check with its per-wave disputed-verdict stop and the loop engine's `- verification command:` requirement (operations / tunable parameters; major procedures)
- Derived / memory docs invalidated: none

## Out of scope

- `scripts/resume-read-traces.test.mjs` and `scripts/resume-coordinated-evidence.test.mjs`: their recorded tool-enabled sessions need a fresh capture, a separate procedure from the eval runner.
- The four tests that fail identically on main: `eval/housekeeping/unpushed-amend-report`, `eval/housekeeping/unpushed-remote-ahead-stop`, `scripts/commit-contract-docs`, `scripts/resume-current-stages`.
- Every stale saved answer other than the fifteen samples of sections 2 and 3 and the ten runs and two `deferred-spec-stop` samples of section 6.
- Rewording moved instruction text to make a fresh answer pass.
- A warning, fallback or conversion for an old-named overrides file; the ticket excludes all three.
- Sibling repos: the pi-condense protection for root `gauntlet.md` and `doc/gauntlet.md`, and the retired names in the pi-cohort, pi-quiver and pi-condense `AGENTS.md` files, are companion changes per the ticket.
- `eval/README.md` `## CI`, which already omits the `scripts/brainstorming-*.test.mjs` files, and a guide entry for the accepted-fingerprint list.
- The live two-engine proof of row 3, deferred to #174.
- Coverage limit of the short usage sweep: `scripts/gauntlet-tree-lint.mjs`, `scripts/brief-contract-lint.mjs`, `scripts/gate-contract-lint.mjs`, `scripts/stage-skill-lint.mjs` and the skill text beyond the reviewed word-diff fragments were not read in the code-concern sweep. The sweep did not clear those files.

## Open questions

- Whether the replay providers and the judge are signed in on the machine that runs the twelve samples; the first run shows it.
- Whether each fresh answer passes its test; Errors and edge cases holds the rule when one does not.
- Row 3's disposition is settled: `deferred: #174 - live proof only; the two-engine behavior remains required` stands, as the PR body and the carried spec hold it (lines 81 and 525 there). The spec gate stated that approving keeps the live two-engine proof deferred to #174 and that the reply "row 3 in scope" would make this repair owe it; the human approved with option 1. The row text stays verbatim and the two-engine behavior stays required. The disposition line under row 3, the Rework record's `Keeps:` and `keeps:` clauses on row 3, and the Out of scope bullet "The live two-engine proof of row 3, deferred to #174" stand as written.
