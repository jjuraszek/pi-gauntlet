# Move coordinated-legs rules out of the loop-implementation skill into a reference file

**Goal:** Relocate every coordinated-only paragraph and the companion admission script from `skills/loop-implementation/SKILL.md` into `skills/loop-implementation/reference/coordinated-legs.md`, read at exactly two sites gated on the spec's `### Leg:` count, so single-repo loop runs stop carrying ~100 lines of rules they never apply while coordinated fresh runs, resumes, handoffs and finishes behave exactly as before.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.; fund 3 fix rounds
**Engine:** waves
**Ticket:** #107
**Predecessor:** `doc/specs/2026-10-28-multi-repo-coordinated-flow.md` (Design: Implement engines; Handoff and resume) - stays live; this spec relocates its loop-engine text without changing any contract it set.

## Problem

Every single-repo loop run reads the whole coordinated contract on every dispatch decision because it is inlined in the driver: at HEAD `72e69d89`, byte-identical to the PR #105 merge commit `9bb6b398`, `skills/loop-implementation/SKILL.md` is 229 lines, and the coordinated-only spans (lines 21, 46-56, 80, 84, 102-104, the second sentence of 106, 120-177, the first sentence of 181, the companion sentences of 183-185, 206, 216) are roughly 40% of it, including the 60-line node admission script. The wave engine already takes the shape this spec moves toward: `skills/subagent-driven-development/SKILL.md:92-98` is an eight-line `## Leg routing` section that delegates to `brainstorming/reference/legs.md`.

A plain move breaks three things, each with an existing mechanism to absorb it. Every ledger restore, implement or verify/ship, reads the driver in full at reconstruction step 4 and recovers the pending companion return boundary there, before continuing at `Before each dispatch` or `After the loop` (`skills/gauntlet-resume/reference/reconstruction.md:96-99`, `skills/gauntlet-resume/reference/brief-contract.md:200`, `skills/gauntlet-resume/SKILL.md:151-153`); today that full read carries the admission script and the expected-dirt exception (line 56) that step 4's dirty-tree stop needs, so a read that fires only on fresh seeding or only at the dispatch site strands that recovery. The contract test extracts the admission script from the driver body (`scripts/loop-engine-contract.test.mjs:101-106`) and asserts coordinated tokens against the driver (`:51-63`). The eval target bundles only the driver and persona (`eval/loop-implementation/target.json`), so coordinated replays would lose the moved text.

Premises checked: the 229-line baseline and the span list hold (read in full, `git diff 9bb6b398 HEAD -- skills/loop-implementation/SKILL.md` empty); the test extractor and token list hold; the eval lint rule (`eval/lib/lint.mjs:47-49`: a `bundle+` path absent at baseline needs a `new: true` `skillFiles` entry) holds. Implicit dependencies: issue #107 has zero comments (`gh api .../issues/107/comments`, one short page); the spec and docs index binaries ran; the resume routes and reconstruction step 4 were read; handoff reads ledger line 1 and the last decision, never the driver (`skills/gauntlet-handoff/SKILL.md:88`). Nothing load-bearing is unverified.

Framing: kept. The scout's one objection - verify/ship-stage ledger resumes continue at `After the loop` step 1 (`skills/gauntlet-resume/SKILL.md:153`, `brief-contract.md:200-202`) and bypass the dispatch read site - resolves in two parts. The `After the loop` coordinated fan-out paragraph (line 216) stays in the driver as shared routing for per-leg verification and review. The Entry-site read applies on fresh entry and on every ledger restore, so reconstruction step 4's full driver read loads the reference before the generic dirty-tree stop and before the pending companion boundary that `brief-contract.md:200` applies to verify/ship restores too; no resume source changes.

## Acceptance criteria

Ticket #107, Acceptance Criteria, rows verbatim:

- [ ] `skills/loop-implementation/SKILL.md` contains no `## Coordinated Entry and resume` section, no `### Companion commit admission` section, no `pending:` tuple rules and no node admission script; those live in `skills/loop-implementation/reference/coordinated-legs.md`.
  in-scope
- [ ] The main skill contains exactly two conditional read instructions for the reference, at Entry and at "Before each dispatch", each conditioned on the spec's `## Legs` section having more than one `### Leg:` block; other mentions are pointers, not read instructions; a single-leg or legless spec never reads it.
  in-scope
- [ ] `scripts/loop-engine-contract.test.mjs` asserts that "Before each dispatch" instructs coordinated resumes to read the reference before their first dispatch decision, extracts the admission script from the reference file, and passes; `npm test` passes.
  in-scope
- [ ] A new `eval/loop-implementation/` leg-resume sample bundles the reference and checks admission of one attributed companion commit after resume (instructions and replay behavior, not a live runtime file read).
  in-scope
- [ ] `eval/loop-implementation/target.json` bundles the reference for coordinated samples (`leg-iteration` and any sample whose case has more than one leg) and not for single-repo samples; `node eval/run.mjs loop-implementation` holds every existing fact in every sample, including `escalated-row-attempt`, `exit-verification-escalates`, `cap-and-exit-verification` and `commit-boundary`.
  in-scope
- [ ] The coordinated-only spans move to the reference while shared rules remain in the main skill; the PR body records before/after `wc -l` of the main skill against the PR #105 merge commit (229 lines at audit time).
  in-scope

Row 1's "no `pending:` tuple rules" reads as: the driver no longer states how the tuple is written, persisted, admitted or cleared; the retained `After the loop` paragraph mentions no tuple. Row 2's "exactly two conditional read instructions" counts instructions that direct a read of `reference/coordinated-legs.md`: the Entry-site instruction (one read, two apply clauses: fresh entry and ledger restore) and the `Before each dispatch` instruction; the retained `After the loop` fan-out paragraph names no file and is not a read instruction.

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-107-coordinated-legs-reference
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test (discovered from package.json; overrides carry no `## verification-before-completion` or `## PR gate` command); plus `node eval/run.mjs loop-implementation` per AGENTS.md "Change process"
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: .pi/gauntlet-overrides.md
Rules: eval/README.md
Rules: doc/implement-engines.md
Rules: doc/gate-contract.md
Rules: doc/configuration.md
Rules: doc/personas.md
Rules: README.md
Rules: CHANGELOG.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: none
design: owns every path in Design; observable outcomes are the six acceptance rows above.

## Design

### Driver: `skills/loop-implementation/SKILL.md`

Remove: line 21 (coordinated Entry switch), lines 46-56 (`## Coordinated Entry and resume`), line 80 (coordinated targeting), line 84 (coordinated dispatch and `pending:` persistence), lines 102-104 (companion return validation and the parent `loop: record` commit), the second sentence of line 106 ("For coordinated home returns apply it only to home entries/seeded state..."; the retained first sentence "For home-only returns, apply the following boundary and table." stays byte-for-byte), lines 120-177 (`### Companion commit admission` with the `<!-- companion-return-shell -->` script), the first two sentences of line 181 ("For coordinated exit, read each leg's verification ... Require every leg to pass before completing implement."; the retained "For legacy/single-member exit, run the ledger's `verification:` command once foreground in the worktree. Failure uses ..." stays byte-for-byte), the coordinated clauses of 183 and 185 listed below, and line 206 (coordinated amendment reconciliation).

Lines 183 and 185 interleave shared exit repair with coordinated substitutions, so the split is specified by quoting the retained driver text. Post-split line 183: `Apply hard boundaries first; at cap use the cap stop without repair. With amend permission, `iterations < cap`, resolved `escalationLoop.implModel` and no spent `loop: repair verification` identity, bump iterations once and record `HEAD_BEFORE`. Dispatch exactly one `implementer` with `model: <implModel>`, `context: "fresh"`, `async: false`, the implementation worktree as cwd and its Rules, failing output, absolute spec path and the exact verification command. Require a clean tree and exactly one commit after HEAD_BEFORE; dirty/zero/multiple commits use existing boundary stops preserving count and state. Require all ledger rows unchanged, preserving cap and prior decisions. The child's sole commit includes the already-bumped ledger; after validation parent commits `loop: repair verification`, using an empty parent marker when no dirt remains. This marker is once per flow.` Post-split line 185: `Rerun that command once. Never spend verify-phase credits. A second failure retains the original header plus `escalated round spent`, then goes through Human stop. Dispatch error or non-DONE consumes the round before a decision; preserve the consumed count and stop. Recover spent identity from the parent commit on resume; interrupted or unrecoverable identity is spent, never add a carrier or fabricate success. With no permission or spent identity: no reopening and no automatic rerun. Missing settings/model stops with the capability in Problem. On success record verified HEAD and clean status; call `phase_tracker({ action: "complete", phase: "implement" })`, then continue immediately below.` The minimal rewordings are exactly: `bump home iterations once and record `HEAD_BEFORE` in the failing leg` -> `bump iterations once and record `HEAD_BEFORE``; `that leg's cwd/Rules` -> `the implementation worktree as cwd and its Rules`; `absolute home spec path and exact leg verification command` -> `absolute spec path and the exact verification command`; `preserving mapping, cap and prior decisions` -> `preserving cap and prior decisions`; `The home child's sole commit includes the already-bumped home ledger` -> `The child's sole commit includes the already-bumped ledger`; `This marker is once per flow, not per failing leg.` -> `This marker is once per flow.`; `Rerun that command once in the failing leg only. Never spend another leg's verification or verify-phase credits.` -> `Rerun that command once. Never spend verify-phase credits.`; `Success only after every leg passes: record` -> `On success record`. The moved coordinated clauses ("in the failing leg", "that leg's cwd/Rules", "absolute home spec path and exact leg verification command", "preserving mapping", "The home child's sole commit includes the already-bumped home ledger", "A companion child commits its leg only; parent commits the bumped home ledger as `loop: repair verification`, preserving rows and mapping.", "not per failing leg", "in the failing leg only", "Never spend another leg's verification", "Success only after every leg passes") land in the reference's `## Exit verification` as the coordinated substitutions for the same repair. The commit body names each rewording.

Add: two conditional read instructions, each carrying its own stop-on-unreadable clause (the rule line 214 states for the `After the loop` references), and nothing else.

- Entry, in place of line 21: `On fresh entry and on every ledger restore, for a spec whose `## Legs` section has more than one `### Leg:` block, read `reference/coordinated-legs.md` IN FULL now with read; stop on an unreadable reference naming its path, never reconstruct it. On fresh entry apply its `## Entry` section instead of the home-only skeleton and cap calculation below. On a restore apply its `## Resume` section before the dirty-tree stop and before any pending recovery. Keep legacy and single-member ledger bytes unchanged, with no coordinated metadata.` Reconstruction step 4 reads the driver in full on every ledger restore, so this instruction fires there, ahead of step 4's dirty-tree stop and pending companion boundary and ahead of step 5's continuation; no `gauntlet-resume` text changes.
- `Before each dispatch`, as the section's first sentence, ahead of the ordered table: `For a spec whose `## Legs` section has more than one `### Leg:` block, read `reference/coordinated-legs.md` IN FULL now with read; stop on an unreadable reference naming its path, never reconstruct it. Apply its `## Resume`, `## Targeting and dispatch`, `## Companion return validation`, `### Companion commit admission`, `## Exit verification` and `## Amendments` sections together with this driver; never apply `## Entry` here.` The read precedes rule 1 because coordinated targeting (next unseeded leg first) changes what rule 5 selects, and because pending recovery runs before the generic dirty check. Naming `## Resume` and not `## Entry` keeps one-time seeding (scope read, leg mapping, cap formula) out of the per-dispatch path.

Keep: every shared rule byte-for-byte where possible, including `## Before each dispatch`, `## Human stop`, `## Exit verification`, `## After the loop` and their public names (`doc/gate-contract.md:24-25`, `doc/implement-engines.md:40` cite them). Keep line 216 - "For coordinated runs, route each verification and review below to every leg with its own base, checkout, Rules and owned original ACs under home flow policy. Re-verify and re-review any changed leg; invoke coordinated finish once from home after every leg passes. Keep single-member/legacy paths free of a companion loop, leg file, `legs:` brief or `--leg` argument." - in `## After the loop`, because verify/ship ledger resumes enter there. A reworded sentence keeps its instruction's meaning (ticket Idea). Target: roughly 130 lines; the PR body records the measured before/after `wc -l`.

### Reference: `skills/loop-implementation/reference/coordinated-legs.md` (new)

First file under `skills/loop-implementation/reference/`; directory and kebab-case name follow `brainstorming/reference/` and `gauntlet-resume/reference/`. Opens with one sentence naming its consumer (the loop driver, read when `## Legs` has more than one `### Leg:` block) and holds the moved text verbatim under these exact headings, in this order, which the two driver read instructions name:

| Heading | Moved text |
|---|---|
| `## Entry` | lines 48, 50, 52, 54: scope grammar read, retained home skeleton fields, `## Leg mapping`, per-member `base repo-x:` / `seeded repo-x:` pairs, coordinated cap formula - one-time seeding, applied on fresh entry only |
| `## Resume` | line 56: pending companion recovery, expected-dirt admission - applied on every restore and before each dispatch |
| `## Targeting and dispatch` | line 80, line 84 |
| `## Companion return validation` | lines 102-104, the second sentence of 106 |
| `### Companion commit admission` | lines 120-177 including `<!-- companion-return-shell -->` and the fenced script, unchanged |
| `## Exit verification` | the moved sentences of 181 and the coordinated clauses of 183 and 185 quoted above, assembled as the coordinated substitutions for the driver's exit repair |
| `## Amendments` | line 206 |

Relative links re-base one directory deeper: `../brainstorming/reference/legs.md#scope-grammar-and-validation` becomes `../../brainstorming/reference/legs.md#scope-grammar-and-validation`; `../brainstorming/reference/amendment-surface.md` likewise where a moved sentence cites it. Relative prose references that cross the file boundary are retargeted minimally; the only such rewording is line 102's "Apply the evidence and decision bounds below" -> "Apply the evidence and decision bounds in the driver's `## Validate the return` table". Reference-internal references stay as written because the heading order keeps them correct: line 56's "Reapply companion return validation below" (`## Companion return validation` follows `## Resume`) and line 122's "boundary above" / "described above" (lines 102-104 precede the admission section). The admission script is byte-identical. The reference ends with no `## Project overrides` block (it is a reference, not a skill, matching `brainstorming/reference/legs.md`).

### Authoring constraints (driver and reference)

Every line the move adds or rewords in `skills/loop-implementation/SKILL.md` and `skills/loop-implementation/reference/coordinated-legs.md` follows `/skill:forge-skill` `## Authoring rules` (imperative voice, low conditionality, minimal diff, no history, recipe over prohibition, no nuance clauses, one example, ASCII punctuation, compact `|---|` separators). The two read instructions and the reference's opening sentence are the only new prose; moved paragraphs keep their wording, so the rules bind the eight listed rewordings, the one retargeted cross-reference, and the opening sentence. Neither file carries a "previously inlined" or "moved from" clause; that provenance lives in the commit body and the PR body. Both files stay under the instruction-size lint in `scripts/skill-size-lint.mjs` (under 50,000 bytes and 2,000 lines each); the driver is 33,162 bytes today and the split leaves each part roughly half of that, so the lint is a floor check, not a target.

### Contract test: `scripts/loop-engine-contract.test.mjs`

Every assertion that reads the driver is repointed by the post-move owner of its text; no block is deleted or retargeted wholesale. The four driver-reading sites that currently match moved text are `:46`, `:51-63` (in part), `:86-87` inside `companionFixture`, and `:101-106` inside `validateCompanion`.

Stays against `skills/loop-implementation/SKILL.md`:

- `:10-35` unchanged except `:18-19`, including the `action: "complete", phase: "implement"` ordering at `:21` and the `< 500` line guard at `:34`. The two read sentences mention reference headings inline (`## Entry`, `## Resume`, `## Exit verification`, `### Companion commit admission`, ...), so every assertion that locates a driver section matches the heading line, never the first substring: `:18-19` orders `steps` by `driver.indexOf('\n' + step + '\n')`, and `:155` slices Entry as `driver.split('\n## Entry\n')[1].split('\n## Before each dispatch\n')[0]`; `:156` (`## Human stop` / `## After the loop`) keeps its substring split because no read sentence names those headings.
- `:42-45`, `:47-48` unchanged (`Rerun that command once`, `exactly one commit`, `rows unchanged`, `loop: repair verification`, `empty parent marker`, the `no permission or spent identity` sentence all survive the split).
- `:46` becomes `assert.match(driver, /This marker is once per flow\./)`; add the shared repair payload assertions `the implementation worktree as cwd and its Rules`, `absolute spec path and the exact verification command` and `On success record verified HEAD and clean status`.
- From `:54`: `legacy and single-member ledger bytes unchanged`. `:55` persona tokens. `:60-61` legacy skeleton guard. `:62` fan-out token.
- New driver assertions: `reference/coordinated-legs.md` occurs exactly twice, once between `## Entry` and `## Before each dispatch` and once as the first sentence after the `## Before each dispatch` heading and before the ordered table; both occurrences sit in a sentence containing `stop on an unreadable reference`; the first contains `on every ledger restore` and `## Resume`; the second contains `## Resume` and not `## Entry` as an apply target; the driver contains no heading line `^## Coordinated Entry and resume$` or `^### Companion commit admission$` (multiline regex, so the inline mention in the second read sentence does not count), and no occurrence of `pending:`, `companion-return-shell` or `## Leg mapping` (at HEAD `pending:` occurs only inside the moved spans).

Moves to a new `reference` test reading `skills/loop-implementation/reference/coordinated-legs.md`:

- The `:54` tokens other than `legacy and single-member ledger bytes unchanged`; `:56` and `:57` regexes; `:58` `doesNotMatch` applied to the reference; `:59` replaced by reference-internal ordering: `## Entry` before `## Resume`, `Recover pending companion work` (under `## Resume`) before `## Targeting and dispatch`, and `### Companion commit admission` after `## Companion return validation`.
- `once per flow, not per failing leg` and `Success only after every leg passes` under `## Exit verification`.
- `:86-87`: `companionFixture` reads the reference for the `After persisting the bump and pending tuple, bind `SAVED_LEDGER` to the durable home ledger` assertion.
- `:101-106`: `validateCompanion` extracts `<!-- companion-return-shell -->` from the reference with the same regex; message `reference must supply executable companion commit admission`. The fixture cases at `:109-150` stay unchanged.

### Eval: `eval/loop-implementation/`

- `target.json`: add `{ "path": "skills/loop-implementation/reference/coordinated-legs.md", "new": true }` to `skillFiles` (`eval/README.md`, `eval/lib/lint.mjs:47-49`); `wordCap` stays 2600. It bounds the replay's reply words (`eval/run.mjs:130`), not the assembled bundle, so bundle growth never justifies raising it; raise it only if an observed coordinated reply exceeds it, with the number and reason recorded in `intent.md`.
- Each of the 13 single-repo samples (`cap-and-exit-verification`, `commit-boundary`, `escalated-row-attempt` and the ten others whose case names no second leg) opens with `bundle-: skills/loop-implementation/reference/coordinated-legs.md`. `leg-iteration` and `exit-verification-escalates` keep it.
- New `samples/leg-resume/{case.md,expected.md}`, bundled with `brainstorming/reference/legs.md` like `leg-iteration` and with `skills/gauntlet-resume/reference/reconstruction.md` (present at baseline, so no `new:` entry): the case starts at reconstruction "Spec with ledger" step 4 on an implement-stage coordinated ledger with durable `pending: 2 | repo-b | bbbbbbb`, iterations already bumped, `M <ledger>` as the only dirt, and one companion commit after that HEAD whose body carries the exact tuple and consumed `iteration:`. Expected facts: the driver reads the reference before pending recovery and before the dirty-tree stop, not merely before its first dispatch decision; it admits the bump and tuple as the only permitted dirt instead of taking the discard-authorization stop; it admits that one commit exactly once in a single `loop: record repo-b row 2` parent commit, clears `pending:` and adds no new dispatch, bump or attempt; it continues at `Before each dispatch`.
- `intent.md` gains a `leg-resume` paragraph and its `for:` line is bumped to the assembly SHA the runner's mismatch refusal prints (adding the reference to `skillFiles` changes the bundle-free assembly hash, `eval/README.md:118`); after the `bundle-` lines land, run `node eval/run.mjs loop-implementation --baseline-only` once, then the full target; commit `report.md`.

### Untouched by design

`skills/gauntlet-handoff/SKILL.md`, `skills/gauntlet-resume/SKILL.md`, `skills/gauntlet-resume/reference/{brief-contract,reconstruction}.md`, `doc/implement-engines.md`, `doc/gate-contract.md`, `README.md`, `agents/loop-implementer.md`, `skills/finishing-a-development-branch/**`: each cites `Before each dispatch`, `After the loop`, `## Human stop`, ledger line 1 or the `pending:` tuple on disk, none of which moves. The ledger bytes, the tuple grammar, the parent-commit subjects and the admission script's argv/stdout contract are byte-identical before and after.

## Errors and edge cases

- Unreadable reference at either conditional read: each read instruction carries its own clause - stop with a blocking error naming the path; never reconstruct from memory - mirroring the line 214 rule for the `After the loop` references, without a third read site or any runtime machinery.
- Single-member spec (one `### Leg:` block) or legacy spec (no `## Legs`): the condition is false at both sites on fresh entry and on restore; the file is never read; ledger bytes and the 13 single-repo eval cells change only by the driver edit itself.
- Implement-stage coordinated resume: `reconstruction.md` step 4 reads the driver in full; the Entry-site instruction fires on that restore and loads `## Resume` and `### Companion commit admission` before step 4's dirty-tree stop and its pending companion boundary; step 5 continues at `Before each dispatch`, whose instruction applies the operational sections before rule 1.
- Verify/ship-stage coordinated resume: step 4's full driver read fires the same Entry-site instruction, so the pending boundary `brief-contract.md:200` applies before verification has the admission script and expected-dirt rule in context; continuation at `After the loop` step 1 uses the retained fan-out paragraph for per-leg verification and review.
- A coordinated run reaches `## Exit verification` and `## Human stop` only through the ordered table, after the second read, so the reference's exit and amendment sections are already in context.
- Mixed lines 106, 181, 183-185 split by clause: the single-repo sentence stays verbatim; the coordinated sentence moves. A sentence that cannot be split without rewording is reworded minimally and the commit body names it.
- Contract test failure modes: a coordinated token left in the driver; the reference path appearing other than exactly twice or at the wrong positions; an empty extraction from the reference.
- Eval lint refusals: `new: true` entry already present at baseline; a `bundle-` path not in `skillFiles`; a sample that both adds and drops the same path; a stale `for:` in `intent.md`. Every one of the 16 samples replays because the driver changes - expected cost.
- `reconstruction.md` step 4 states the dirty-tree stop one paragraph before pending recovery; today the step-4 full driver read supplies the expected-dirt exception (line 56) that makes a pending bump admissible. The restore-clause of the Entry-site instruction keeps that exception in context at the same point after the move, so the ordering is unchanged by this spec and needs no `gauntlet-resume` edit.

## Tests

- Driver drops the coordinated sections and script - `scripts/loop-engine-contract.test.mjs` driver test (absent-token assertions)
- Exactly two conditional reads, at Entry and `Before each dispatch`, gated on `### Leg:` count - same test, occurrence count and position assertions
- Contract test extracts the admission script from the reference and passes; `npm test` passes - `scripts/loop-engine-contract.test.mjs` reference test; `npm test`
- New leg-resume sample bundles the reference and `reconstruction.md`, starts at step 4, reads the reference before pending recovery and admits one attributed companion commit - `eval/loop-implementation/samples/leg-resume/`
- Reference bundled for coordinated samples only; every existing fact holds - eval structural lint in `npm test`; committed `eval/loop-implementation/report.md`
- Shared rules stay in the driver; PR body records before/after `wc -l` - none: PR-body artifact, checked at the finish gate
- Each read instruction carries the stop-on-unreadable clause - `scripts/loop-engine-contract.test.mjs` driver test (`stop on an unreadable reference` in both read sentences); the runtime stop itself is not replayable without a file read
- Entry-site instruction applies on every ledger restore and names `## Resume` - same test (`on every ledger restore`, `## Resume` in the first occurrence)
- Mixed-line split keeps the shared exit-repair payload in the driver - `scripts/loop-engine-contract.test.mjs` driver test (existing `:42-45` tokens plus the cwd/Rules, verification-command and `On success` assertions)
- Reference headings exist in the named order - `scripts/loop-engine-contract.test.mjs` reference test

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: none
- Derived / memory docs invalidated: `CHANGELOG.md` - `## Unreleased` entry (`#107`)

The scout's `Docs touched:` candidates (`doc/implement-engines.md` Resume and amendments, `README.md` Multi-repo runs, `eval/README.md` Iterating on a skill edit, `brief-contract.md` Coordinated admission, finishing `legs.md` Activation and authority) each cite a section that stays in the driver or a contract that does not move; none is amended. Skill bodies and the new reference are implementation surface (`reference/documentation-impact.md`).

## Out of scope

- Any change to what coordinated mode does (ticket). The tuple, admission script, parent-commit subjects, cap formula and resume routes keep their current text and meaning.
- Edits to `gauntlet-handoff`, `gauntlet-resume`, `finishing-a-development-branch`, the loop-implementer persona, or `doc/implement-engines.md`.
- A third read site at `After the loop` (rejected at the framing question; the retained paragraph plus the restore clause of the Entry-site instruction cover that route).
- A second leg-resume variant with two companion commits after the recorded HEAD: `eval/loop-implementation/samples/leg-iteration/expected.md` `reject` already holds that two new companion commits stop preserving `pending:` and state, and its case already includes the interrupted restart.
- A manual live coordinated run (ticket: synthetic replays are the required evidence).
