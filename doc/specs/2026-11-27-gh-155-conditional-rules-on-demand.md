# Conditional gauntlet rules load on demand; always-read satellite files fold back

**Goal:** A gauntlet run stops loading rules for situations it never reaches. The rules for pushing rework to an open pull request, for a loop human stop or spec amendment, and for a failed, escalated, rebuilt or resumed wave move out of `ship.md`, `loop.md` and `waves.md` into four files, each one meaningful group of related instructions read when any of its listed triggers is entered. Three small files that every run of their engine reads anyway fold back into their main file, so they stop costing a read call. No rule changes meaning; only where it lives and when it is read.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Ticket:** #155
**Predecessor:** none

## Problem

`skills/gauntlet/ship/ship.md` (49,573 bytes), `skills/gauntlet/implement/loop/loop.md` (43,856) and `skills/gauntlet/implement/waves/waves.md` (48,337) each carry a block of rules that binds only a rare situation. Every run reads its engine file and the ship file whole, so every run loads those blocks. `ship.md` sits 427 bytes under the 50,000-byte cap.

At the same time three small files are read unconditionally by every run of their engine (`loop.md:46`, `loop.md:63`, `waves.md:39`): `implement/loop/driver-holds.md` (1,437 bytes), `implement/loop/empty-child-stagnation.md` (1,370) and `implement/waves/prerequisites.md` (2,408). Each costs one `read` call and saves nothing. Their history shows size pressure, not a trigger boundary (`40679a67` "Repair loop driver size ...", `e123d2b9`).

Framing: kept

### User constraints (verbatim)

- Initial prompt: `#155 but keep in mind that we don't want to have too much md granularity. each md should hold meanigful chunk of the process instructions so we won't split it by paragraph. each linked reading is a cost as this require extra tool call from llm right?`
- On folding the three always-read files: `B, just make sure to understand that 50k limit is due to partial reading side effect where md was readed in 2 passes. the rule for this repo is that each md has to be read in one go`
- On grouping the waves rules into two files: `A, make sure all refs are updated and there is correct level for each (owned place)`

### Ticket context carried

- The ticket's Idea suggests one reference per conditional block. The acceptance rows constrain who reads what and when, not the file count; the approved design groups the six blocks by read trigger into four files.
- The ticket's Out of scope excludes the stop-mechanics redesign of #170 and says to refresh the `## Human stop` size and rows if #170 lands first. #170 is open; `## Human stop` is unchanged from the ticket's measurement.
- The one `Reporter note:` comment restores wording displaced by the 2026-11-26 ticket repair (old file names, old byte counts, interrupted recovery as a load trigger). It is provenance; the current body is the contract.
- Byte counts in the acceptance rows describe the input at filing. They are not targets or limits.

### Checked claims

Measured in the worktree at `1add9a73`.

| Claim | Source | Lookup | Result |
|---|---|---|---|
| Loop `## Human stop` is 7,102 bytes | ticket row 3 | byte count of `loop.md` from `## Human stop` (L119) to `## Gate set` | held |
| The four waves sections total 8,529 bytes | ticket row 5 | byte count per heading in `waves.md` | held: `### Chain stopped or failed` 3,056 (L247), `### Recovery` 1,338 (L273), `### Escalation and funding` 2,447 (L172), `### Rebuild` 1,688 (L168) |
| Ship `#### PR-subject row 1` is 8,043 bytes | ticket row 1 | byte count of `ship.md` L246-293 | corrected: 8,284 bytes today |
| The three main files total 139,896 bytes | ticket Problem | `wc -c` | corrected: 141,766 today |
| One run loads all 23.7 KB | ticket title | `brainstorm/spec-finalization.md` (the gate selects one engine) | corrected: file reads are not exclusive by engine. A waves run reads `waves.md` and `ship.md` and sheds about 16.8 KB gross (8,529 + 8,284). A loop run that reaches verify reads `loop.md`, then `waves.md` in full at `loop.md:160`, then `ship.md`, and sheds about 23.9 KB gross (7,102 + 8,529 + 8,284). Gross is before the kept rules and the pointers are counted; no benchmark is run |
| Five kept rules exist verbatim | ticket row 7 | substring search | held: `loop.md:138` paragraph, `loop.md:142` first sentence, `loop.md:146` paragraph, `waves.md:179` sentence, `waves.md:291` second sentence |
| Row-1 gate marker, question and rows | ticket row 2 | `ship.md:247,282-289` | held; `ship.md` asks nothing when no member qualifies or the rework holds one PR |
| The row-1 block binds only row 1 | council | `ship.md:293` | disproved: its closing rule names untouched member PRs on rows 2-6, a withheld or failed ancestry proof, a withheld or rejected push and a failed body fetch or edit |
| Conditional rules already live in on-demand files | ticket Context | `loop.md:113,117` | held: `interrupted-recovery.md`, `unreachable-returns.md`, `coordinated-legs.md` |
| `skill_reads` entries exist in the run record | ticket row 1 | `doc/configuration.md:338` | held: one `{path, bytes}` entry per successful main-session `read` of Markdown under `skills/`; an absence claim needs `skill_read_coverage: complete` |
| Only three tests read the moved sections | ticket row 9 | `rg` over `scripts/` | corrected: twelve test files slice a moved heading, search the whole loop driver for a moved rule, or open a folded file, and `scripts/stage-skill-lint.test.mjs:13` hard-codes the `STAGE_FILES` count (listed in D6) |
| The tree lint maps gates to files | recon | `scripts/gauntlet-tree-lint.mjs:100-160` | corrected: that function maps retired gate ids to current ids and needs no edit; the gate-to-file binding is the row table in `doc/gate-contract.md`, checked by `scripts/gate-contract-lint.mjs:73-77` |
| Docs and skills that point at moved sections | ticket row 8 | `rg` over the tree | held: listed in D5 |
| Instruction files stay under 50,000 bytes | AGENTS.md Testing | `scripts/skill-size-lint.mjs:22`; `CHANGELOG.md:536` | held: the cap is "the `read` tool's single-call cap" |
| Folding the three files breaks the cap | question one | `wc -c` | held only without the move: waves plus `prerequisites.md` is 50,745 today; after the move it is about 42,700 and loop about 41,000 |
| Folding breaks forge-skill guidance | question one | `skills/forge-skill/SKILL.md:59` | disproved: the oversized-file rule triggers over 500 lines; `loop.md` has 181 and `waves.md` 354 |
| A clean wave knows each observation format without `### Recovery` | round 2 | `waves.md:113-120` | held: the wave-loop steps name every format inline; the list under `### Recovery` is the resume grammar |
| Eval replay proves a run-time read | recon | `eval/README.md` "Files per target" | disproved: text replay is tool-free; a read is judged from the reply narrating it |
| #170 has not landed | ticket Out of scope | `gh issue view 170 --json state` | held: OPEN |

Not checkable without a live run, and not relied on: a pull request with absorbed members, wave capture files, a run record with complete read coverage for the new files, and the 553 KB consumer run the ticket cites from a private thread.

## Acceptance criteria

Ticket #155, Acceptance Criteria, rows verbatim:

- [ ] A ship run whose subject is not a PR-rework subject reads none of the rules now under `#### PR-subject row 1: Push to the PR branch` (8,043 bytes) in `skills/gauntlet/ship/ship.md`: the main file no longer contains them, and the run's file-read trace (the `skill_reads` entries of its run record) excludes the reference file that holds them.
  in-scope
- [ ] A ship run on a PR-rework subject reads those rules before it renders the push row's gate, and renders the `gauntlet: gate=ship/pr-subject-row-1` marker, the question `Close the absorbed PRs with these comments?`, and the rows `1 - yes, close <absorbed PRs>` and `2 - no, leave them open`.
  in-scope
- [ ] A loop-engine run with no human stop and no spec amendment reads none of the rules now under `## Human stop` (7,102 bytes) in `skills/gauntlet/implement/loop/loop.md`, apart from the three the kept-rules row below names: the main file no longer contains the rest, and the run's file-read trace excludes the reference file that holds them.
  in-scope
- [ ] A loop-engine run that enters a human stop or a spec amendment reads the rules for it before the next human ask, dispatch, or out-of-loop amendment action those rules govern; a run that only recovers an interrupted return reads the existing recovery procedure and none of the moved rules.
  in-scope
- [ ] A waves-engine run in which no chain stops or fails, no dispatched task lacks a structured result, no session is recovered, no task reaches an escalated round (two failed attempts, even when every return is DONE), no BLOCKED or NEEDS_CONTEXT return is routed to the takeable-decision ladder, no hard stop occurs, and no rebuild starts (whether triggered by a repair delta failing to apply or by a human request) reads none of the rules now under `### Chain stopped or failed`, `### Recovery`, `### Escalation and funding`, and `### Rebuild` (8,529 bytes together) in `skills/gauntlet/implement/waves/waves.md`, apart from the two the kept-rules row below names: the main file no longer contains the rest, and the run's file-read trace excludes the reference files that hold them.
  in-scope
- [ ] A waves-engine run that enters any of those situations reads the rules for it before its first matched-stop recovery, missing-result capture read, session-recovery, takeable-decision, escalation, hard-stop, rebuild, or resumed-dispatch action, as applicable; a BLOCKED or NEEDS_CONTEXT return resolved by lookup or by the amendment route triggers no such read.
  in-scope
- [ ] Kept rules: five rules in those blocks bind runs outside the situations above and stay in a file such a run reads. In `## Human stop`: the paragraph that starts `Recover interrupted returns through`, the sentence `Retry, cut, amend, raise-allowance and escalate commits never clear the tuple.`, and the closing paragraph that starts `Never invent a stop`. In `### Escalation and funding`: the closing sentence about the `TRAJECTORY:` block and the `stop-note.md` grammar. In `### Recovery`: the sentence `Print each observation immediately after the operation returns; invent no path, result or SHA.`
  in-scope
- [ ] `doc/gate-contract.md` names the file and heading that carry each gate whose text moved; `doc/implement-engines.md`, `README.md`, `skills/gauntlet/amendment-surface.md`, and `skills/gauntlet/implement/waves/stop-note.md` point to the current file and heading for each moved section they reference.
  in-scope
- [ ] `scripts/finish-verification.test.mjs`, `scripts/loop-dirty-tree-stop.test.mjs`, and `scripts/implement-failure-paths.test.mjs` read the moved rules from their new files and keep their existing rule-text assertions.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-155-conditional-rules-on-demand
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
design: owns every path named in Design D2-D7 under `skills/`, `scripts/`, `eval/`, `doc/gate-contract.md`, `doc/implement-engines.md`, `README.md` and `CHANGELOG.md`; the observable outcomes are the in-scope rows above and the clauses of Design and Errors and edge cases.

## Design

Paths below are relative to `skills/gauntlet/` unless they start with `scripts/`, `eval/`, `doc/` or a root file name. Line numbers are those at `1add9a73`.

### D1. Grouping rule for this change

1. An on-demand file holds one meaningful group of related instructions and is entered by any one of its listed triggers (D2). `chain-recovery.md` and `escalation.md` each pair two related procedures under one read, as the approved grouping has it. No file per heading or per paragraph.
2. A file that every run of its reader loads is not a separate file; its text lives in that reader.
3. Every instruction file this change creates or grows is read whole in one `read` call: under 50,000 bytes and 2,000 lines, and no pointer names an `offset` or `limit`.
4. A session reads an on-demand file at its first trigger. At a later trigger it reuses the full procedure only if that is still available in the current context; otherwise it reads the file again. A resumed session reads it again at its first trigger. D3 gives the one pointer sentence that carries this.
5. The move is rule-for-rule. A moved sentence changes only where it names or links another section: the reference points to the file and heading that own the target after the move. A target that stays behind gains its file's name (`loop.md`'s `## Before each dispatch`; `ship.md#option-1-push-and-create-pr` for the Option 1 reference at `ship.md:259`, now read from `pr-branch-push.md`). A target that also moves points to its new owner (the ladder reference in the moved capture table at `waves.md:255` uses `escalation.md#escalation-and-funding`). Relative links are rebased to the new location. No rule is reworded, merged or dropped; the only wording that changes beyond references is the status routing D3 names.

### D2. Four on-demand files

| File | `#` title | Holds | Read triggers (any one) | Run readers |
|---|---|---|---|---|
| `ship/pr-branch-push.md` | `# PR-subject row 1: Push to the PR branch` | the body of `ship.md` L246-293: thread refresh, strip and seal call, pre-rework refs, push, description edit, member eligibility, the close-absorbed-PRs gate and its outcomes, and the closing rule that names untouched member PRs on every other outcome | Step 4 identifies a PR-rework subject, before its preflight, menu, outcome report or push gate | `ship/ship.md`, `ship/legs.md` |
| `implement/loop/human-stop.md` | `# Human stop` | the body of `loop.md` `## Human stop` minus the three kept rules: marker rule, stop text and row list, discard authorization, the retry / `rows +N` / amend / stop table, out-of-loop amendment refresh, ledger amendment rules, recommendation and auto-take rules | a stop site listed in D3 is reached (a stop that waits for a human in implement or verify); discard authorization is asked; a spec amendment action starts on a ledger run | `implement/loop/loop.md`, `implement/loop/unreachable-returns.md`, `amendment-surface.md` |
| `implement/waves/chain-recovery.md` | `# Chain recovery` | `## Chain stopped or failed` and `## Recovery`, minus the kept print sentence | a chain failure (a dispatch error or a failed task); a dispatched task has no structured result in `## Outputs` or `## Stop`; the session is resumed, before any dispatch; a re-review finds no prior review-tree transcript line | `implement/waves/waves.md` |
| `implement/waves/escalation.md` | `# Escalation and rebuild` | `## Escalation and funding` and `## Rebuild`, minus the kept `TRAJECTORY:` sentence | before the first escalated or funded round; a `BLOCKED` or `NEEDS_CONTEXT` return reaches the takeable-decision branch of `## Implementer Status`; a hard-stop event listed in D3 occurs; before a rebuild | `implement/waves/waves.md`, `implement/waves/stop-note.md` |

Placement follows `skills/forge-skill/SKILL.md` `### Gauntlet file placement`: each file sits in the lowest directory that holds all its run readers. `amendment-surface.md` also links the funded-rounds rule and reads `human-stop.md` on a ledger run (D3); it sits beside the entry file, which that rule ignores as a reader.

Projected sizes, as expectations and not limits: `pr-branch-push.md` about 8,300 bytes, `human-stop.md` about 6,600, `chain-recovery.md` about 4,300, `escalation.md` about 4,050.

### D3. What stays in the main files

Each main file keeps the moved section's heading. Under it sits one read pointer. Every pointer of this change is the same sentence, with its trigger stated as an observable fact:

> At <trigger>, reuse the full procedure of `<file>` only if it is still available in the current context; otherwise read it in full now with `read` at its absolute path before acting. Stop on an unreadable file naming its path; never reconstruct it.

Two pointers sit outside a kept heading, at the place their situation starts: the ship rework-subject pointer and the ledger pointer in `amendment-surface.md`.

| Pointer site | Pointer trigger | Target | Also stays at the site |
|---|---|---|---|
| `ship.md` Step 4, opening the `Rework PR subject - preflight and six-row menu` paragraph (L160) | the subject is a PR-rework subject, before the preflight, the menu, any outcome report and any push gate | `pr-branch-push.md` | the paragraph as today |
| `ship.md` `#### PR-subject row 1: Push to the PR branch` | row 1 of the rework menu is the selected row; the push actions of the file run on this row only | `pr-branch-push.md` | nothing |
| `loop.md` `## Human stop` | a stop site listed below is reached, discard authorization is asked, or a spec amendment action starts on a ledger run, including an auto-applied amendment under the grant | `human-stop.md` | the paragraph starting `Recover interrupted returns through`; the sentence `Retry, cut, amend, raise-allowance and escalate commits never clear the tuple.`; the paragraph starting `Never invent a stop` |
| `amendment-surface.md`, ahead of its consent edits (`**Writers.**`) and of `## 1. Prepare` | a loop ledger exists (line 1 `# Ledger - loop engine` in the resolved plan dir) and the surface is about to edit the consent line or prepare a batch; decoding the grant at seed or at a restore is not a trigger | `implement/loop/human-stop.md` | the surface as today |
| `waves.md` `### Chain stopped or failed` | a chain failure (a dispatch error or a failed task), or a dispatched task has no structured result in `## Outputs` or `## Stop`; a status present in the result text is not a trigger | `chain-recovery.md` | nothing |
| `waves.md` `### Recovery` | the session is resumed, before any dispatch; or a re-review finds no prior review-tree transcript line | `chain-recovery.md` | nothing |
| `waves.md` `### Escalation and funding` | before the first escalated or funded round; a `BLOCKED` or `NEEDS_CONTEXT` return reaches the takeable-decision branch of `## Implementer Status`; or a hard-stop event listed below occurs, before the stop action | `escalation.md` | nothing |
| `waves.md` `### Rebuild` | before a rebuild | `escalation.md` | nothing |

The two kept waves rules move to always-read text of `waves.md`: the sentence `The TRAJECTORY: block and stop-note.md grammar bind to the single wave-reviewer line.` (with its code spans as today) directly after the paragraph that follows the transition table, and the sentence `Print each observation immediately after the operation returns; invent no path, result or SHA.` as its own paragraph directly before step 1 of `## The Wave Loop`.

The `### Escalation and funding` pointer names the hard-stop events itself, so the trigger is decidable from always-read text. They are the events of the `Hard stops:` bullet at `waves.md` L177, which moves unchanged: malformed grants, missing `implModel`, unavailable settings tools, dirty-tree or commit-boundary returns, empty-commit stagnation, the round cap in the table, funded re-review `STAGNANT`, `REJECT`, an initial-patch or rebuild-patch apply failure, an oversized compact report, redraws.

Trigger sites keep or gain a link to the kept heading, so a run reaches the pointer from where the situation starts:

- Chain recovery: `waves.md` L19 and L197 keep `#chain-stopped-or-failed`.
- Status routing, the one wording change beyond references: `BLOCKED` and `NEEDS_CONTEXT` statuses, read directly or recovered from a capture, route through `## Implementer Status` first, where the amendment route and lookup come before the ladder (L70-73). Step 3's closing sentence (L115, `-> the takeable-decision ladder below`) routes to `[Implementer Status](#implementer-status)`. The moved capture-table row (L255) sends those statuses to `waves.md`'s `## Implementer Status`; its ladder reference names `escalation.md#escalation-and-funding` and applies only on the takeable-decision branch. L70 and L71 keep `#escalation-and-funding` on their takeable-decision clause, the only status branch that reads `escalation.md`.
- Recovery has two independent entries. Session resume: the `implement with task plan` row of `skills/gauntlet-resume/SKILL.md` (L201) follows `waves.md#recovery` before `the task loop from the first non-complete task`. Missing review tree in a live session: `waves.md` L60 `Recovery's stop-note path` links `#recovery`; it is not the resume route.
- Escalation and rebuild: in the transition table, the first `rebuild` (L155) links `#rebuild` and the first `escalation` (L157) links `#escalation-and-funding`. `## When a Subagent Fails` item 3 and L30 link `#escalation-and-funding`. Step 3's `the rebuild recipe below` (L115) links `#rebuild`.
- Hard stops: each always-read site that takes a listed stop links `#escalation-and-funding` before the stop action: the second-overflow stop naming the oversized path (L17), `Stop for redraws` (L73), the missing-`implModel` stop in `## Model` (L82), the initial-patch apply failure in step 3 (L115), step 5 `REJECT` (L117) and the last transition-table row (L164). A search of `waves.md` at `1add9a73` for the other listed events finds no further always-read stop sentence.
- Loop sites, by line. Already naming `## Human stop` and unchanged: Entry step 4 (L20, dirty tree with no `pending:` tuple), ordered-table rule 2 (L59) and the rule-1 refresh stop (L65). Gaining a reference to `## Human stop`: `## Validate the return` L107 (`Stopped on seed` with the retry/`rows +N` menu), `## Gate set` L150 (the missing-`checks:` stop that offers `stop` only), and in `## After the loop` L167 (`Problem: escalationLoop.implModel unavailable`), L169 (`Stopped: verification failed with every row closed`) and L173 (`Stopped: row <n> reopened by amendment during verify`). The folded `## Driver holds` text names `## Human stop` already. The amendment action in `unreachable-returns.md` (L12) links `human-stop.md` directly.
- Loop sites that gain nothing and stay read-free: the configuration-error exits at L7, L13, L15, L40 and L54, the unreadable-reference stops at L17, L50 and L160, and L172, which takes the conformance reference's own `verify/step-6` gate.
- Ledger amendments that do not pass through `loop.md`, such as a heavy revert at finish (`ship.md:147`), reach `human-stop.md` through the `amendment-surface.md` pointer above.

Chosen readings of the ticket rows:

- Rows 1 and 2: the read happens when Step 4 identifies a PR-rework subject, which precedes the menu and the gate. The trigger is the subject and not the row, because the block's closing rule (`ship.md:293`) binds rows 2-6 and the withheld and failed outcomes. A run whose subject is not a PR-rework subject meets no pointer trigger. The close question renders only when the rework holds more than one PR and at least one member qualifies, as today.
- Row 4: "a spec amendment" covers the human Amend choice, an amendment auto-applied under the grant, and the cut an unreachable return produces.
- Rows 5 and 6: a `BLOCKED` or `NEEDS_CONTEXT` return resolved by lookup or by the amendment route reads neither waves on-demand file. Its status alone triggers nothing: it routes through `## Implementer Status`, and only the takeable-decision branch reads `escalation.md`. "Matched-stop recovery" is the reconciliation `chain-recovery.md` owns; it applies when the stop accompanies a chain failure or leaves a dispatched task without a structured result, which are triggers independent of the returned status. A `wave-reviewer` verdict read from `## Outputs` or `## Stop` is not a chain stop; it routes through the transition table and reads neither file until that table reaches escalation, a hard stop or a rebuild.
- Rows 5 and 6, "hard stop": the events of the `Hard stops:` list above, each named in the pointer.
- Row 9: the three named tests and the nine others in D6 read the rules from their new files.

### D4. Fold the three always-read files

| Folded file | Lands in | Replaces |
|---|---|---|
| `implement/loop/driver-holds.md` | `loop.md` `## Driver holds` | the pointer at L46 |
| `implement/loop/empty-child-stagnation.md` | `loop.md` `## Before each dispatch` | the pointer at L63 |
| `implement/waves/prerequisites.md` | `waves.md` `## Prerequisites` | the pointer at L39 |

The body lands verbatim without its `#` title line; relative links are rebased. The three files are deleted. The fold is a wording change that keeps every instruction's meaning: the same text reaches the same reader at the same step. The move in D2-D3 changes when rules are read and is the behavior-relevant edit.

### D5. References

Remove:

- the bodies of the six moved sections from `ship/ship.md`, `implement/loop/loop.md` and `implement/waves/waves.md`, except the five kept rules
- `implement/loop/driver-holds.md`, `implement/loop/empty-child-stagnation.md`, `implement/waves/prerequisites.md` and their three read pointers
- those three paths from `STAGE_FILES` in `scripts/stage-skill-lint.mjs`, from the anchor check at `scripts/ci.mjs:250`, and from `skillFiles` in `eval/loop/target.json` and `eval/waves/target.json`

Add:

- the four files of D2 and the eight pointers, the status routing and the site links of D3
- `skills/gauntlet-resume/SKILL.md` L201: the `implement with task plan` row follows `waves.md#recovery` before the task loop
- `amendment-surface.md`: the ledger pointer of D3, ahead of the consent edits and of `## 1. Prepare`
- `implement/waves/stop-note.md` L33: the ladder link becomes `./escalation.md#escalation-and-funding`
- `amendment-surface.md` L22: the funded-rounds link becomes `implement/waves/escalation.md#escalation-and-funding`
- `ship/legs.md` L65: `PR-subject row 1` links `pr-branch-push.md`
- `doc/gate-contract.md`: the rows `implement/human-stop` and `implement/discard-authorization` name `skills/gauntlet/implement/loop/human-stop.md` and `# Human stop`; the row `ship/pr-subject-row-1` names `skills/gauntlet/ship/pr-branch-push.md` and `# PR-subject row 1: Push to the PR branch`; the `loop driver` link at L172 targets `human-stop.md`
- `doc/implement-engines.md`: the `Human stop contract` link at L91 targets `human-stop.md`; the compaction and resume paragraph at L65 (it starts `Compaction and resume recover static state`) links `skills/gauntlet/implement/waves/chain-recovery.md#recovery` as the owner of the Recovery rules; the `Driver holds` link at L71 keeps `loop.md#driver-holds`, which is a real section after the fold
- `README.md` L63: the `finishing owner` link targets `skills/gauntlet/ship/pr-branch-push.md`
- `scripts/stage-skill-lint.mjs` `STAGE_FILES`: the four new paths; `scripts/ci.mjs:250` checks the anchor in `waves.md`
- `CHANGELOG.md`: one entry under `## Unreleased` naming the four on-demand files, the three folded files and ticket `(#155)`

No gate id, marker, menu row or reply grammar changes. `scripts/gauntlet-tree-lint.mjs` needs no edit.

### D6. Tests and lints

Twelve test files slice a moved heading, search the whole loop driver for a moved rule, or open a folded file. Each reads the rule text from its new owner and keeps its assertions: `scripts/finish-verification.test.mjs`, `scripts/loop-dirty-tree-stop.test.mjs`, `scripts/loop-engine-contract.test.mjs`, `scripts/implement-failure-paths.test.mjs`, `scripts/wave-review.test.mjs`, `scripts/loop-worker-history.test.mjs`, `scripts/loop-home-resume.test.mjs`, `scripts/loop-home-admission.test.mjs`, `scripts/commit-message-contract.test.mjs`, `scripts/implement-amendment.test.mjs`, `scripts/loop-unreachable-cut.test.mjs`, `scripts/loop-verification-repair.test.mjs`.

In `scripts/loop-unreachable-cut.test.mjs` (L28) and `scripts/loop-verification-repair.test.mjs` (L90), only the moved-rule assertions (the post-amendment refresh and the ledger amendment decision) read `human-stop.md`. The assertion on `Retry, cut, amend, raise-allowance and escalate commits never clear the tuple.` (L94) stays on `loop.md`.

`scripts/stage-skill-lint.test.mjs` L13 expects 39 `STAGE_FILES` entries: 38 today, minus the three folded paths, plus the four new ones.

New deterministic assertions:

- each main file lacks the moved rule text (one distinctive sentence per moved section) and holds its pointer and kept rules
- each on-demand file holds its marker or table text
- `pr-branch-push.md` holds the one-PR instruction `Ask nothing when none qualify or N=1`; `scripts/finish-verification.test.mjs` has no such assertion today
- each trigger site of D3 carries its link or reference, in `waves.md`, `loop.md`, `amendment-surface.md` and the `implement with task plan` row of `skills/gauntlet-resume/SKILL.md`, and the read-free loop exits D3 lists carry none
- no path of a deleted file and no retired anchor (`waves.md#escalation-and-funding` from outside `waves.md`, `loop.md#human-stop`, `ship.md#pr-subject-row-1-push-to-the-pr-branch`) remains outside `CHANGELOG.md`, `doc/specs/` and committed eval results

`npm test` is the verification command; its size lint enforces D1.3 and its gate-contract lint resolves the three gate rows.

### D7. Evals and paid actions

Edits under `eval/`, following `eval/README.md`:

- Each extracted file is declared once, as a `skillFiles` entry with `"new": true` in its owning target's `target.json`, and no sample adds it with `bundle+`. The four files are absent at the baseline `1add9a73`; lint refuses a `bundle+` path absent at baseline without a declared-new entry (`eval/lib/lint.mjs:51`), and a path in both `skillFiles` and `bundle+` enters the candidate assembly twice (`eval/lib/replay.mjs:36-47`).
- `eval/ship/target.json`: add `skills/gauntlet/ship/pr-branch-push.md`.
- `eval/loop/target.json`: drop the two folded paths, add `skills/gauntlet/implement/loop/human-stop.md`.
- `eval/waves/target.json`: drop `prerequisites.md`, add `chain-recovery.md` and `escalation.md`.
- A sample on a path that never reads an extracted file drops it with `bundle-`; the three skip samples below do.
- The seventeen `pr-list-*` and `pr-subject-*` ship samples are classified by whether the fixture identifies a PR-rework subject, not by whether it reaches row 1. One that does keeps the declared `pr-branch-push.md`; one that does not drops it with `bundle-`. None carries a `bundle+` line for it.
- Thirteen other samples bundle the whole `loop.md` or `waves.md` (six in `eval/gauntlet-resume`, five in `eval/ship`, one in `eval/plan`, one in `eval/waves`). Each is audited: a sample whose facts exercise a moved rule receives the extracted file that holds it, declared once in that sample's target and never doubled by `bundle+`; every other sample receives none.
- Before any of the seven runs below, baseline and candidate of every touched target prepare without model calls (the preparation tests under `eval/lib/` that `npm test` runs).
- This change leaves the four `"new": true` flags set. Lint refuses a flag once the baseline contains its file (`new file exists at baseline`), so the first later update of each target that runs against such a baseline removes that target's flags.
- `intent.md` for `ship`, `loop` and `waves` records this change and the facts expected to move.
- Four existing samples gain one sentence asking the reply to narrate its reads and one fact that the on-demand file is read before the governed action: `ship/pr-list-push-and-close` (on identifying the rework subject, before the menu and the gate), `loop/human-stop-counts` (before the stop text), `waves/chain-stop-blocked` (reads `chain-recovery.md` for the task with no structured result, and `escalation.md` before its first ladder decision; its existing fact `Route blocked question through ladder` stays), `waves/third-attempt-escalated` (reads `escalation.md` before the escalated round).
- `waves/chain-stop-blocked` also gains a second, separately labeled scenario in the same `case.md`: every dispatched task has a structured result and a `NEEDS_CONTEXT` fact ask is resolved by lookup. Its fact expects no read of `escalation.md` or `chain-recovery.md`. It stays one sample and one paid run.
- Three new samples replay the normal path with the on-demand file dropped by `bundle-` and expect the run to proceed, name no read of that file and report no missing rule: `ship/normal-menu-skips-push-rules`, `loop/clean-dispatch-skips-stop-rules`, `waves/clean-wave-skips-failure-rules`. The ship sample bundles the whole `ship.md` as the seventeen do, so its reply renders the actual Step 4 normal menu; the target's default `### Step 6: Cleanup Workspace` slice cannot show a Step 4 skip.

Paid action: the main session runs `node eval/run.mjs <target> <sample>` for those seven samples, and `node eval/run.mjs <target> <sample> --baseline-only` first for each sample whose `bundle-` lines were added or changed. Inputs are the committed sample files and the replay models configured in the eval. Approving this spec authorizes these runs for the whole flow, across seed, rows, repairs and finish, without per-step permission prompts. No other model run is authorized: no target-wide sweep, and no run for the fold.

The committed `report.md` per target is sample-scoped evidence.

## Integration

- the run's file-read trace (the `skill_reads` entries of its run record) excludes the reference file that holds them
- the run's file-read trace excludes the reference file that holds them
- the run's file-read trace excludes the reference files that hold them
- the commit body states both classifications
- The finish names the seven samples and states partial coverage.
- If #170 merges before this branch lands, the branch rebases and moves whatever `## Human stop` then holds; the kept-rules row is re-checked against that text through the amendment route.

## Errors and edge cases

- An unreadable on-demand file stops the step with a blocking error naming its path. Nothing is reconstructed from memory.
- A ship run whose subject is not a PR-rework subject never reads `pr-branch-push.md`.
- A rework run reads `pr-branch-push.md` once, on identifying the subject and before the preflight. Rows 2-6 (Keep included), a withheld row 1 and a failed ancestry proof run none of its push actions and name untouched member PRs by its closing rule.
- A rework holding one PR asks no close question at row 1.
- A loop run that only recovers an interrupted return reads `interrupted-recovery.md` and not `human-stop.md`.
- A loop stop during verify reads `human-stop.md`, because it holds the marker rule and the row list every stop prints.
- A loop exit on a configuration error (an unavailable settings tool, an unresolved verification entrypoint, `plan_check` findings, an unsupported ledger format) reads no on-demand file.
- `Stopped on seed` at allowance reads `human-stop.md` before its retry/`rows +N` menu.
- A ledger amendment entered directly at finish reads `human-stop.md` at the amendment surface before a consent edit or batch preparation. Decoding the grant at seed or at a restore reads nothing.
- A dirty tree with no dispatch pending at loop entry reads `human-stop.md` before the discard question.
- A `BLOCKED` or `NEEDS_CONTEXT` return answered by lookup or by the amendment route reads neither waves on-demand file. A task with no structured result in the same chain is an independent trigger and reads `chain-recovery.md`.
- A `BLOCKED` or `NEEDS_CONTEXT` return that reaches the takeable-decision branch reads `escalation.md` before the first decision.
- A hard-stop event of the D3 list reads `escalation.md` before the stop action, at whichever site it occurs.
- A rebuild the human requests at a stop reads `escalation.md` before the rebuild recipe runs.
- A wave whose review returns `FIX_FIRST` once and then `SHIP` reads neither waves file.
- A resumed waves session reads `chain-recovery.md` before its first dispatch even when the wave was clean before the interruption; the resume route enters through `waves.md#recovery`.
- A re-review in a live session that finds no prior review-tree transcript line reads `chain-recovery.md` before taking its stop-note path.
- A later trigger in the same session reuses an on-demand file still available in context and reads it again otherwise.

## Tests

- ship main file lacks the row-1 rules, holds the rework-subject pointer ahead of the preflight in Step 4 and the row-1 pointer under the row-1 heading, and holds no pointer in the normal or detached-HEAD menu text - `scripts/finish-verification.test.mjs`
- `pr-branch-push.md` holds the marker, the question and both rows - `scripts/finish-verification.test.mjs`
- a rework subject reads the push file before the menu and before the gate - eval `ship/pr-list-push-and-close`
- a normal ship menu proceeds without the push file - eval `ship/normal-menu-skips-push-rules` (whole `ship.md` bundled, the Step 4 normal menu rendered)
- loop main file lacks the stop rules and holds the pointer and the three kept rules - `scripts/loop-dirty-tree-stop.test.mjs`, `scripts/loop-engine-contract.test.mjs`
- a human stop reads `human-stop.md` before the stop text - eval `loop/human-stop-counts`
- a clean dispatch cycle proceeds without `human-stop.md` - eval `loop/clean-dispatch-skips-stop-rules`
- an interrupted-return recovery names `interrupted-recovery.md` and not `human-stop.md` - `scripts/loop-engine-contract.test.mjs` (pointer text under `## Interrupted recovery` unchanged)
- waves main file lacks the four sections' rules and holds four pointers and the two kept sentences - `scripts/implement-failure-paths.test.mjs`, `scripts/wave-review.test.mjs`
- a task with no structured result reads `chain-recovery.md`, and a blocked question reads `escalation.md` before its first ladder decision - eval `waves/chain-stop-blocked`
- a `NEEDS_CONTEXT` return resolved by lookup, with every task's result present, reads neither waves file - eval `waves/chain-stop-blocked` (second scenario)
- direct and recovered `BLOCKED` / `NEEDS_CONTEXT` statuses route through `## Implementer Status`, and only its takeable-decision clause links `#escalation-and-funding` - `scripts/implement-failure-paths.test.mjs`
- a third failed attempt reads `escalation.md` before the escalated round - eval `waves/third-attempt-escalated`
- a clean wave proceeds without either waves file - eval `waves/clean-wave-skips-failure-rules`
- the five kept rules sit verbatim in `loop.md` and `waves.md` - `scripts/loop-engine-contract.test.mjs`, `scripts/implement-failure-paths.test.mjs`
- gate rows name the new files and headings - `scripts/gate-contract-lint.mjs` in `npm test`
- no deleted path or retired anchor remains - new assertion in `scripts/implement-failure-paths.test.mjs`
- folded text sits in `loop.md` and `waves.md` and the three files are gone - `scripts/loop-engine-contract.test.mjs`, `scripts/implement-amendment.test.mjs`, `scripts/stage-skill-lint.mjs`
- the stage roster holds 39 files - `scripts/stage-skill-lint.test.mjs`
- the post-amendment refresh and the ledger amendment decision sit in `human-stop.md`, and the tuple sentence in `loop.md` - `scripts/loop-unreachable-cut.test.mjs`, `scripts/loop-verification-repair.test.mjs`
- every eval target prepares baseline and candidate without a model call, each extracted file declared once with `"new": true` - the preparation tests under `eval/lib/` in `npm test`
- every instruction file reads in one call - `scripts/skill-size-lint.mjs` in `npm test`
- each pointer states its trigger and the stop on an unreadable file - `scripts/finish-verification.test.mjs`, `scripts/loop-dirty-tree-stop.test.mjs`, `scripts/implement-failure-paths.test.mjs` (one assertion per pointer of D3, each holding the canonical reuse-or-read sentence)
- Keep and a withheld or failed preflight on a rework subject name untouched members - `scripts/finish-verification.test.mjs` (the `Rows 2-6 ... never offer` rule is asserted in `pr-branch-push.md`, and the rework-subject pointer precedes the preflight table and the menu in `ship.md`)
- a one-PR rework asks no close question - `scripts/finish-verification.test.mjs` (new assertion on `Ask nothing when none qualify or N=1` in `pr-branch-push.md`)
- a verify stop and the dirty-tree discard question read `human-stop.md` - `scripts/loop-dirty-tree-stop.test.mjs` (pointer trigger names discard authorization and the listed stop sites)
- each listed loop stop site references `## Human stop`, `Stopped on seed` in `## Validate the return` included, and the configuration-error exits carry no reference - `scripts/loop-engine-contract.test.mjs`
- a ledger amendment entered at finish reads `human-stop.md` before a consent edit or batch preparation, and seed-time grant decoding does not - `scripts/implement-amendment.test.mjs` (the `amendment-surface.md` pointer, its position and its trigger)
- a human-requested rebuild and a hard stop read `escalation.md` - `scripts/implement-failure-paths.test.mjs` (pointer triggers under `### Rebuild` and `### Escalation and funding`, the hard-stop events named in the pointer, and the six hard-stop site links of D3)
- a resumed waves session reads `chain-recovery.md` before dispatch - `scripts/implement-failure-paths.test.mjs` (pointer trigger under `### Recovery`, and the `implement with task plan` row of `skills/gauntlet-resume/SKILL.md` linking `waves.md#recovery` before the task loop)
- a re-review with no prior review-tree line reads `chain-recovery.md` - `scripts/implement-failure-paths.test.mjs` (the `### Recovery` pointer names the case and `waves.md` L60 links `#recovery`)
- a review that returns `FIX_FIRST` then `SHIP` reads neither waves file - none: no pointer trigger names a reviewer verdict, which the pointer assertions above fix
- docs and skills link the new files and headings - the retired-anchor assertion above and `scripts/gate-contract-lint.mjs`

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: CHANGELOG.md (major procedures: where conditional run rules live and when they load)
- Derived / memory docs invalidated: doc/gate-contract.md (three gate rows and the loop-driver link), doc/implement-engines.md (the Human stop contract link and the compaction and resume paragraph), README.md (ship row 1 link)

The bar is `documentation-impact.md`.

## Out of scope

- The stop-mechanics redesign of #170.
- Rewording, merging or shortening any moved or folded rule, beyond the reference and status-routing edits D1.5 and D3 name.
- Writing the D1 grouping rule into `skills/forge-skill/SKILL.md`; it binds this change only.
- Other large instruction files and other always-read satellite files.
- A live-run measurement of tokens, latency or price.
- Target-wide or cross-target eval sweeps.

## Open questions

- None blocks the design. Follow-up not filed: codify the D1 grouping rule in forge-skill.
