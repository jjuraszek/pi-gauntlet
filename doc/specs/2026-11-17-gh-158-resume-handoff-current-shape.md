# Resume and handoff read only the current formats, split by engine

**Goal:** `/skill:gauntlet-resume` and `/skill:gauntlet-handoff` accept only the brief and ledger formats the current producers write, and each route reads only the rules it applies: loop restore, plan restore, plan repair and multi-repo rules sit in separate references read on first use. A single-repo loop resume reads at most 42,000 bytes of resume rules and a plan resume at most 37,000 (80,385 today); a handoff reads at most 17,000 (38,148 today).
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Ticket:** #158
**Date:** 2026-11-17
**Predecessor:** `doc/specs/2026-11-01-gh-108-loop-single-allowance.md` - supersedes "Migration" and the acceptance row admitting a `cap:` ledger on resume; the `allowance:` header, retries and escalation stay live.
**Predecessor:** `doc/specs/2026-11-14-single-commit-message-contract.md` - supersedes the legacy conversion in "4. Resume", the legacy-block exemption in "7. Lint" and the two resume conversion sentences; ledger-held returns and every other clause stay live.
**Predecessor:** `doc/specs/2026-10-28-multi-repo-coordinated-flow.md` - supersedes the file that holds the brief leg grammar and coordinated admission in "Handoff and resume"; the rules themselves stay live.
**Predecessor:** `doc/specs/2026-09-17-gh-31-gauntlet-resume.md` - supersedes "File layout" and the files named for "Process-state restore" and "Bare-worktree reconstruction"; the arming order and entry checks stay live.
**Predecessor:** `doc/specs/2026-09-20-gh-40-gauntlet-handoff-shared-brief-contract.md` - supersedes the double-section refusal in "gauntlet-handoff/SKILL.md" and the one-grammar-file rule in "brief-contract.md" and "scripts/ci.mjs" (leg grammar lives in a second file); cohort delegation and the one-section append stay live.
**Predecessor:** `doc/specs/2026-10-13-resume-plan-spec-drift.md` - supersedes the owner file in "Owner section: `## Plan repair` in `brief-contract.md`"; the repair rules stay live.

## Problem

Resume is one main file and three references, 84,577 bytes at `09c9f4e1`. Loop, task-plan, multi-repo and old-format rules are interleaved, so every route reads rules it never applies. A brief with process state reads `SKILL.md` + `brief-contract.md` + `reconstruction.md` = 80,385 bytes whatever its engine. Handoff reads `brief-contract.md` in full (28,837 bytes) to append one section: 38,148 bytes with its own file. The ledger restore sequence is stated three times: `SKILL.md` `## Post-restore continuation`, `brief-contract.md` `## Process-state restore`, `reconstruction.md` `## Spec with ledger`.

The request (verbatim): `#158 make sure both handoff and resume support only current shape. no backward compatibility. moreover there is natural junction here as loop engine and plan engine has different resume logic to be followed, assess if we should split this into 2 path to save some space. remove all which is no longer needed in current state. make sure cleanup provides as savings so at each resume we will have meanigfull less context taken by resume logic itself. follow repo convention regarding ref md's and forge-skill along with 50k limit for each`

Framing: kept - no cited alternative; extending only the first-use gate of `doc/specs/2026-10-31-gh-107-coordinated-legs-reference.md` keeps the old-format rules the request removes.

### Checked claims

| Claim | Lookup | Result |
|---|---|---|
| Resume is four files, 84,577 bytes | `wc -c skills/gauntlet-resume/SKILL.md skills/gauntlet-resume/reference/*.md` | held: 16,834 + 28,837 + 34,714 + 4,192 |
| Handoff reads the whole brief contract | `skills/gauntlet-handoff/SKILL.md:24` | held: 9,311 + 28,837 bytes |
| Loop and plan engines restore differently | `brief-contract.md` call table rows `implement with ledger` / `implement with task plan`; `reconstruction.md` `## Spec with ledger` vs `## Spec with plan`; `## Plan repair` entered only from task-plan rows | held |
| Old-format rules are `### Legacy repair markers` + `### Legacy pending recovery` (13,933 bytes) | read of both references; `rg -i "legacy\|cap:\|returned:"` over `skills`, `extensions`, `scripts`, `doc` | corrected: also `### Returns conversion`, `cap:` admission and migration in `## Spec with ledger` steps 3-4, the decoder selection in `### Pending recovery`, legacy task labels in `## Tracker output grammar`, the task-less ledger brief clause, `extensions/lib/plan-check.ts:1236-1238`, `commit-message.md:95-96`, `scripts/commit-subject-lint.mjs:5-30`, `skills/loop-implementation/SKILL.md:21,48,62,73`, `doc/implement-engines.md:36,66`, `doc/configuration.md:186` |
| Handoff has nothing obsolete | `skills/gauntlet-handoff/SKILL.md` steps 2 and 4; `package.json:65` | corrected: step 4 refuses a brief written by pi-cohort older than 7.1.0; the peer floor is `pi-cohort >= 8.2.0`, and the installed cohort handoff writes nothing after `## Skills loaded` |
| Current ledgers carry `allowance:` and `returned:` | `skills/loop-implementation/SKILL.md:35-36` | held: the seed skeleton writes both |
| Every touched file is under 50,000 bytes | `wc -c`; `scripts/skill-size-lint.mjs:22-23` | held: largest is 34,714; `skills/loop-implementation/SKILL.md` is 44,918, so resume rules cannot move into it |
| No local run needs conversion | header scan of every `doc/plans/*.md` ledger in this checkout, its worktrees and the three sibling repos; listing of `<tmpdir>/pi-handoff/` | held locally: one ledger, already `allowance:` + `returned:`; no briefs |
| Consumer-repo runs with older ledgers | not reachable from this machine | not checked: such a run meets the stop in Design 5 |
| Multi-repo resume rules are all conditioned on a brief `legs:` block | `skills/gauntlet-resume/SKILL.md` checks 3, 3b, 4; `brief-contract.md` `## Coordinated admission`; `reconstruction.md` `## Candidates` | held: a bare worktree with a multi-leg spec gets its leg handling from the engine skills |
| The plan checker accepts `cap:` | `extensions/lib/plan-check.ts:1236-1238` | held for multi-repo ledgers only; the single-repo path validates no budget header |
| The ticket rows are behavior observations | `skills/shape-ticket/SKILL.md` `## AC integrity gate` | held: no row observes CI, a PR or a suite run |

### Consumers of the files that move

- `skills/finishing-a-development-branch/reference/verification-set.md:28` reads `reconstruction.md#pending-recovery`.
- `skills/loop-implementation/SKILL.md:21,48,62` cites reconstruction's allowance boundary, resume's conversion steps, and stops with `ledger has no returned: line - resume through /skill:gauntlet-resume`.
- `scripts/brief-contract-lint.mjs:6-8,34-48` pins grammar and leg-line ownership to `brief-contract.md`; `scripts/ci.mjs:319-326,342-347,415-454` pins handoff tokens, grant placement and `git -C` discipline in `reconstruction.md`.
- `doc/gate-contract.md:70-72,123` inventories gates by file and heading; `AGENTS.md:141`, `README.md:138-154`, `doc/implement-engines.md:36,66`, `doc/configuration.md:186` cite the references.
- `eval/gauntlet-resume/target.json` slices headings that move; `eval/gauntlet-handoff/target.json` bundles the whole brief contract; samples in `eval/finishing-a-development-branch` and `eval/loop-implementation` add the references with `bundle+`.
- Inside the resume skill: `reference/seed.md:32-35` (step 8) continues in `reconstruction.md` "Spec with plan"; `reconstruction.md:65` cites `brief-contract.md` "Coordinated admission"; `SKILL.md` `## Boundaries` and `## Post-restore continuation` cite `## Plan repair` and "Citation repair" in `brief-contract.md`.

## Acceptance criteria

Ticket #158, "Acceptance Criteria", rows verbatim:

- [ ] Resuming from a single-repo handoff brief: the session transcript's read calls show the main session reads no coordinated-only file or section - none of the rules now under `## Coordinated brief grammar` and `## Coordinated admission` in `skills/gauntlet-resume/reference/brief-contract.md`, and none of the coordinated-brief rules now inline in entry checks 3, 3b, and 4 of `skills/gauntlet-resume/SKILL.md`; the main body keeps only the test needed to choose the single-repo or coordinated route.
  in-scope
- [ ] For the same recorded single-repo brief at each supported stage, the resume at commit 09c9f4e10b9e9f1b6f2852cf9c35dc3e14025134 and the changed resume load the same continuation skill and restore the same phase and task state.
  in-scope
- [ ] Resuming from a coordinated (multi-repo) brief reads the coordinated rules before any tracker write, and each coordinated stop condition at that commit stops on the same recorded input with the same result.
  in-scope
- [ ] Resuming a worktree whose ledger has `returned:` lines reads none of the rules now under `### Legacy repair markers` and `### Legacy pending recovery` in `skills/gauntlet-resume/reference/reconstruction.md`.
  in-scope
- [ ] Resuming the same ledger without `returned:` at that commit and after the change produces the same converted state and continuation result, and the changed resume reads the legacy rules before converting.
  deviates: the request removes backward compatibility, so such a ledger stops instead of converting

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-158-resume-handoff-current-shape
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: `npm test` (runs `scripts/ci.mjs`); `npm run build:bins` after the `extensions/lib/` edit; `node eval/run.mjs <target> <sample>` only for the samples named in Design 9
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: eval/README.md
Rules: doc/configuration.md
Rules: doc/personas.md
Rules: doc/gate-contract.md
Rules: doc/install-internals.md
Rules: doc/implement-engines.md
Rules: .pi/gauntlet-overrides.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5
design: owns `skills/gauntlet-resume/**`, `skills/gauntlet-handoff/SKILL.md`, the sentences named in Design 8 in `skills/loop-implementation/SKILL.md`, `skills/finishing-a-development-branch/reference/verification-set.md` and `commit-message.md`, `extensions/lib/plan-check.ts` with its regenerated `bin/` bundles, the scripts and tests named in Design 8 and Tests, the eval files named in Design 9, and the docs named in Documentation impact.

## Design

Every skill and reference edit follows `/skill:forge-skill` `## Authoring rules`: imperative voice, one path per step, a reference read at the step that needs it through a one-line pointer, no history narration, ASCII punctuation.

### 1. One entry point

`/skill:gauntlet-resume` stays the only resume command and `/skill:gauntlet-handoff` the only producer. This change adds no skill, argument or flag. Arguments, the discovery menu, entry checks 1-6, the hotfix route, the `worktree: no` brainstorming offer and the spec seed keep their rules and their order.

### 2. Files and owners

| File | Owns | Read by |
|---|---|---|
| `skills/gauntlet-resume/SKILL.md` | arguments, entry checks (same-repository binding and the single-repo drift notice included), the engine test and the membership test (Design 3), the facts that fix the arming order, the exact-restoration binding and the pre-`init` feasibility checks, the post-restore table, the closing-line template with its `<task>` substitution | every resume |
| `reference/brief-contract.md` | `## Brief grammar`, `## Producers`, `## Tracker output grammar` with its parse stops; no restore rule | resume from a brief; handoff |
| `reference/reconstruction.md` | `## Base`, `## Candidates` (the `flowGuards` spec-dir and plan-dir resolution and the route table for no spec, more than one spec, and one spec without a plan), `## Spec without plan` (the approval question and its three branches: approved `loop`, approved `waves` or absent engine, unapproved draft), and the PR-pair identity check that today opens `## Process-state restore` | worktree routes, the spec seed, and every brief with `## Process state`, ledger briefs included |
| `reference/restore-loop.md` (new) | `## Ledger admission`, `## Spec with ledger`, the one ordered ledger restore for brief and worktree inputs, verify and ship ledger briefs, `## Pending recovery` | ledger routes only |
| `reference/restore-plan.md` (new) | `## Process-state restore` for every brief without a `Ledger:` field (brainstorm, plan, implement, verify, ship), plan path resolution, `## Spec with plan` | a brief with `## Process state` and no `Ledger:` field; a task-plan candidate; seed step 8 with a plan beside the pinned spec |
| `reference/plan-repair.md` (new) | `## Plan repair`, `### Baseline continuation`, `### Citation repair` through its two `Repair stopped:` lines, the `Repaired plan:` receipt; none of the restore trailer below | only after `plan_check` returns FAIL |
| `reference/coordinated.md` (new) | `## Coordinated brief grammar`, `## Coordinated admission` (with the ship retry for a stripped plan or ledger), and the multi-repo sentences now inline in entry checks 3 and 4 | resume from a brief with a `legs:` block; handoff with more than one member |
| `reference/seed.md` | step 8 names `restore-plan.md` `## Spec with plan` when a plan sits beside the pinned spec, and `reconstruction.md` `## Spec without plan` otherwise; the pinned path and the Candidates bypass stay; nothing else changes | spec seed |

The restore trailer. The text that today closes `### Citation repair` (`brief-contract.md:270-291`) is not repair text: the exact-restoration binding (active phase and substep, task names, order and statuses verbatim, priors shown skipped with a `resume:` reason), the two pre-`init` feasibility checks (pending-suffix order; the implement auto-complete edge), and the closing line with its `<task>` substitution apply to every restore, including a first-check PASS and a verify or ship ledger brief. Separate it from `### Citation repair` before assigning owners. `SKILL.md` owns it, beside the arming facts: the closing-line template, the `<task>` substitution (`ledger rows` for a ledger; the brief's `Active task`, else the first in-progress task, else `none` for a task plan), the binding and both checks. `restore-plan.md` applies the binding and checks at each `plan_tracker init` and at the confirmed snapshot of `## Spec with plan`; `restore-loop.md` applies them at its verify and ship `init` and keeps the ledger sentence (the saved mixed list is restored only on verify or ship and then refreshed; implement refreshes without `init`). `plan-repair.md` holds only repair rules and the `Repaired plan:` receipt.

Plan repair citations. `SKILL.md` `## Boundaries` and `## Post-restore continuation` name plan repair as the repair `restore-plan.md` enters on `plan_check` FAIL; they carry no path, link or read instruction for `plan-repair.md`. The only instruction to read `plan-repair.md` sits in `restore-plan.md`, conditioned on FAIL.

State each rule once, in its owner. The ledger restore is stated only in `restore-loop.md`; `SKILL.md` and the other references point to it. Keep these headings, because other files anchor to them: `## Spec without plan` in `reconstruction.md`; `## Ledger admission`, `## Spec with ledger` and `## Pending recovery` in `restore-loop.md`; `## Spec with plan` in `restore-plan.md`. The text of `## Coordinated brief grammar` and `## Coordinated admission` moves unchanged except for link targets and the phrase `Single-member and legacy briefs`, which becomes `Single-member briefs`. `reconstruction.md` `## Candidates` keeps its `For a coordinated brief` paragraph and cites `coordinated.md` `## Coordinated admission` in place of `brief-contract.md`.

### 3. The two tests in `SKILL.md`

Engine test, applied when Dispatch picks a route and, on worktree routes, after `reconstruction.md` `## Candidates` has classified the artifacts. It selects a restore reference only for the first four rows. Candidates keeps the no-spec stop, the multi-spec pick and the one-spec-without-a-plan route, and `## Spec without plan` keeps its approval question and all three branches.

| Observed | Restore reference |
|---|---|
| a brief with `## Process state` and a `Ledger:` field | `restore-loop.md` |
| a brief with `## Process state` and no `Ledger:` field, at any stage | `restore-plan.md` |
| Candidates finds one spec with a ledger: a plan-dir file whose line 1 is `# Ledger - loop engine` (takes precedence over a task plan) | `restore-loop.md` |
| Candidates finds one spec with a task plan only, or seed step 8 finds a plan beside the pinned spec | `restore-plan.md` |
| Candidates finds no spec, more than one spec, or one spec without a plan | none - the route stays in `reconstruction.md`. From `## Spec without plan`, an approved spec with `**Engine:** loop` continues in `/skill:loop-implementation` Entry steps 1-5, an approved spec with `**Engine:** waves` or no engine line continues in writing-plans, and an unapproved spec waits for the explicit brainstorming handoff selection, as today |

The brief rows take precedence over the last row. A brief with `## Process state` and no `Ledger:` field arms only through its `restore-plan.md` call-table row, whatever the spec's `**Engine:**`; the `start brainstorm` / `skip brainstorm` arming of the `**Engine:** loop` branch in `## Spec without plan` applies only to inputs without process state. After a plan-stage brief restores a loop spec that has no ledger, the post-restore table continues in `/skill:loop-implementation` Entry steps 1-5 with no second arming call.

A brief with a `Ledger:` field resolves its spec from the ledger's `**Spec:**` header. It reads `reconstruction.md` like every other process-state brief, before the step that uses a definition owned there: `<base>` from `## Base` (pending recovery scans `<base>..HEAD`), the `flowGuards` spec-dir and plan-dir resolution in `## Candidates`, and the PR-pair check. A `legs:` brief reads it before `coordinated.md` `## Coordinated admission` resolves the home spec through Candidates, with or without `PR:` pairs.

Membership test: a brief that carries a `legs:` block is multi-repo. Read `reference/coordinated.md` in full before entry check 3 and apply it at checks 3, 3b and 4, before any tracker write. Without the block, read nothing from that file. Only the coordinated fragments leave `SKILL.md`: the member-primary sentence of check 3 (`home is <repo>; restart there`), all of check 3b, and the per-leg sentence of check 4. This test and the pointer take their place. Check 3's same-repository binding (the git common directory comparison and the foreign-repository stop, which `seed.md` step 6 also runs) and check 4's single-repo `HEAD` and `dirty` drift notice stay in `SKILL.md` for every route that runs them.

### 4. Route read sets and ceilings

Bytes are `wc -c` over files under `skills/gauntlet-resume/` and `skills/gauntlet-handoff/`. Other skills a route loads (the menu layout, the engine skill, cohort's handoff skill, skills named in `## Skills loaded`) are outside this measure, as they are in the 80,385 and 38,148 baselines.

| Route | Files | Ceiling |
|---|---|---|
| single-repo brief with `Ledger:` | `SKILL.md`, `brief-contract.md`, `reconstruction.md`, `restore-loop.md` | 42,000 |
| worktree with a ledger | `SKILL.md`, `reconstruction.md`, `restore-loop.md` | inside the same 42,000 |
| single-repo brief without a ledger | `SKILL.md`, `brief-contract.md`, `reconstruction.md`, `restore-plan.md` | 37,000 |
| worktree with a task plan | `SKILL.md`, `reconstruction.md`, `restore-plan.md` | inside the same 37,000 |
| any plan route after `plan_check` FAIL | adds `plan-repair.md` | none |
| any brief with a `legs:` block | adds `coordinated.md`; `reconstruction.md` is already in its set, with or without `PR:` pairs | none |
| spec seed with a plan beside the pinned spec | `SKILL.md`, `seed.md`, `reconstruction.md`, `restore-plan.md` | none |
| handoff, one member | `skills/gauntlet-handoff/SKILL.md`, `brief-contract.md` | 17,000 |
| handoff, more than one member | adds `coordinated.md` | none |

The ceilings bind; per-file sizes are the implementer's to balance. No measured split backs them yet (Open questions). Every file stays under 50,000 bytes and 2,000 lines (`scripts/skill-size-lint.mjs`).

### 5. Only the current ledger format

`restore-loop.md` `## Ledger admission` runs when the ledger is first read, for brief and worktree inputs alike, before the confirmation question and before any tracker write. It requires the ledger file to exist, line 1 `# Ledger - loop engine`, a path-only `**Spec:**` header, exactly one `allowance:` holding a positive safe integer, exactly one `returned:`, and no `cap:`.

One input is routed before the checks. A brief with a `legs:` block at ship stage whose `Ledger:` file is absent goes to `coordinated.md` `## Coordinated admission`'s receipt-validated retry, which admits a correctly stripped ledger and recovers gate pairs from the committed pre-strip ledger. `## Ledger admission` opens with that pointer, conditioned on the `legs:` block, so a ledger brief reaches the retry without reading `restore-plan.md`.

Every other input runs the checks in this order. The first miss wins; start the message with `gauntlet: stuck` and its sentence:

1. The ledger file is absent: `ledger not found: <path>`
2. Line 1 is not `# Ledger - loop engine`, or `**Spec:**` is missing or not path-only: `ledger header malformed: <observed header lines>`
3. A `cap:` line is present, with or without `allowance:`: `ledger carries a cap: line - unsupported ledger format; finish this run on the pi-gauntlet release that wrote it`
4. No `allowance:` line: `ledger has no allowance: line - unsupported ledger format; finish this run on the pi-gauntlet release that wrote it`
5. No `returned:` line: `ledger has no returned: line - unsupported ledger format; finish this run on the pi-gauntlet release that wrote it`
6. A duplicate `allowance:` or `returned:`, or an `allowance:` value that is not a positive safe integer: `ledger header malformed: <observed header lines>`

A ledger with `cap:` and neither `allowance:` nor `returned:` therefore prints the `cap:` sentence. Follow each of the three unsupported-format sentences with one line, `recovery: doc/configuration.md "Loop engine operations"`; that section names the release that still converts, and the stop text does not.

Resume writes no migration or conversion commit and reads no commit subject or body. The header check runs once, at admission; the post-migration validation step goes with the migration.

`extensions/lib/plan-check.ts` `coordinatedMetadata` requires exactly one `allowance` header holding a positive safe integer. A `cap` header no longer counts as the budget header, so a multi-repo ledger with `cap:` and no `allowance:` fails the check. The admission every ledger passes also rejects a `cap:` header, so a single-repo ledger carrying one fails the check too; the single-repo ledger check is otherwise unchanged. Run `npm run build:bins` and commit the regenerated bundles.

Briefs get no old-format detection. Remove the numeric-prefix task label form and the `legacy plain names` clause: a ledger task row matching `^(row \d+(?: \(\S+\))?) \| .+$` restores capture 1, and every other task name restores byte-identical. Remove the clause for a ledger brief without task rows; the general rule stays that `No plan active.` means no `init` and a ledger still refreshes.

Spec headers keep their reading, because resume also accepts a spec the human approves at the resume prompt: no `**Amend-grant:**` line means no grant, and an absent `**Engine:**` means `waves`. Drop only the `(legacy spec)` label in entry check 6.

### 6. Behavior kept as at 09c9f4e1

"Recorded brief" in ticket row 2 means a brief in the shape the current handoff writes. For such a brief, and for a worktree holding a current-format ledger or a task plan, the changed resume restores what `09c9f4e1` restores:

| Input | Kept |
|---|---|
| any brief | entry checks 1-6 before any tracker mutation; priors skipped with `resume:` reasons, never completed; `start brainstorm` as the first arming call; the closing line, then the standing-grant line |
| brainstorm or plan stage | the same calls, the substep, and deferred-header admission before `start brainstorm` |
| implement, task plan | `plan_check`, `skip plan`, `start implement`, the substep, `plan_tracker init` with names, order and statuses verbatim; continue in subagent-driven-development at the first non-complete task after re-validating the active task |
| implement, ledger | arming through `skip plan` with reason `resume: <spec> (loop engine)`, `start implement`, pending recovery, one ledger-path `plan_tracker refresh`, no `init`; continue at the driver's `Before each dispatch` |
| implement, ledger with a `pending:` tuple on disk | return admission or interrupted recovery against the pre-dispatch ledger; the consumed iteration is kept and the failed attempt counted once |
| implement, ledger with a committed `returned:` tuple | settled or unsettled classified from the introducing ledger diff and its iterations; the question for later commits or dirt asked before any tracker call |
| verify or ship, ledger | `skip implement`, `start verify`, `plan_tracker init` with the saved mixed list (ledger rows by canonical name, `Gn` gate tasks and conformance tasks byte-identical, `failed` included), pending recovery, one refresh; continue at `After the loop` step 1; `start implement` is never called |
| verify or ship, ledger with `pending: verify` | the repair admission contract of `After the loop` step 1 |
| verify or ship, task plan | restore at verify with the saved task list; ship stops at verify for a fresh conformance review |
| `plan_check` FAIL on a task plan | plan repair with the saved task snapshot, three rounds, the stops and the receipt line |
| brief with `PR:` pairs | the home branch identity check and the rework-record comparison before any tracker write |
| brief with a `legs:` block | ordered membership comparison, per-leg primary, branch and `**Home:**` tuple checks, live receipt validation, per-leg drift notice, the ship retry with a stripped plan |

The loop driver's single `gauntlet_setting({ key: "loopEngine" })` read at the restore boundary stays, for `escalateAfter` only.

Design round 1 condition (verbatim): `make sure you won't regress even for handoff generated during impl or conformance`. A handoff written during implement restores through the four `implement` rows above; one written during conformance restores through the three `verify or ship` rows. Tests maps them to evidence: `clean-pass-unchanged` and `pending-owner-stops` (implement, task plan); `loop-ledger-brief`, `ledger-tracker-recovery` and `returned-line-recovery` (implement, ledger); `ledger-tracker-verify`, `baseline-upgrade-preserves-statuses` and `scripts/loop-verification-repair.test.mjs` (verify); `gauntlet-handoff` `ledger-task-list` for the brief written at implement and at verify.

### 7. Handoff

- Read `brief-contract.md` in full before any other action, as today. Read `coordinated.md` only when the run has more than one member, at the append step.
- Remove step 4 (the refusal of a brief that already has `## Process state`) and its red-flag mention; renumber the steps.
- Keep the stop for a missing cohort `handoff` skill; drop the `pi-cohort >= 7.1.0` text from it. Drop the `(pi-cohort >= 7.1.0, #18)` note from the head of `brief-contract.md`.
- The appended section's layout is unchanged.

### 8. Edits outside the two skills

| File | Edit |
|---|---|
| `skills/loop-implementation/SKILL.md:21` | cite `restore-loop.md`; drop `including legacy allowance migration` |
| `skills/loop-implementation/SKILL.md:48` | resume applies pending recovery before refresh; drop `its allowance and returns conversion steps` |
| `skills/loop-implementation/SKILL.md:62` | both stops use the Design 5 sentences, each with its recovery line, in place of `resume through /skill:gauntlet-resume` |
| `skills/loop-implementation/SKILL.md:73` | drop `After migration,` |
| `skills/finishing-a-development-branch/reference/verification-set.md:28` | link to `restore-loop.md#pending-recovery` |
| `skills/finishing-a-development-branch/reference/commit-message.md:95-96` | remove both conversion rows |
| `scripts/commit-subject-lint.mjs` | remove `LEGACY_FILE`, `LEGACY_BEGIN`, `LEGACY_END` and the exemption |
| `scripts/brief-contract-lint.mjs` | leg lines and the `legs-layout` check are owned by `coordinated.md`; the five process-state grammar lines stay owned by `brief-contract.md`; the gate-history line that ends the leg example is allowed in `coordinated.md` |
| `scripts/ci.mjs` | the `git -C` discipline check covers `reconstruction.md`, `restore-loop.md`, `restore-plan.md` and `plan-repair.md`; register `scripts/resume-routes.test.mjs`, `scripts/loop-home-resume.test.mjs` and `scripts/commit-message-contract.test.mjs` (no command runs the last two today). `scripts/loop-legacy-conversion.test.mjs` has no registration to remove; the file is deleted. Two prose statements in the Citation repair text that moves to `plan-repair.md` match the discipline check's pattern: `Never substitute `git checkout`` and `runs no git command`. Reword only those two, keeping their meaning (for example `git -C <worktree> checkout` and `no Git command`); no other repair text changes |
| `doc/gate-contract.md` | rows 71 and 123 name `restore-loop.md`, row 72 names `restore-plan.md`; add a `gauntlet: stuck` row for the unsupported-ledger stop under `restore-loop.md` `## Ledger admission` |

Old-format test assertions removed. An assertion is old-format when its expected text names `cap:` admission or migration, the post-migration header validation, returns conversion, a legacy decoder, a legacy task label or a task-less ledger brief. Every other assertion that reads a moved file is re-pointed to the new owner and kept.

| File | Removed |
|---|---|
| `scripts/loop-legacy-conversion.test.mjs` | the file, except `an unconverted ledger stops before the ordered dispatch table`, which moves to `scripts/loop-engine-contract.test.mjs` with the Design 5 sentence |
| `scripts/loop-home-resume.test.mjs` | `:73` (`migration changes neither admission ranges`); `:37` slices to the next heading instead of `### Returns conversion` |
| `scripts/loop-verification-repair.test.mjs` | `:24-25`, the two conversion sentence rows |
| `scripts/loop-engine-contract.test.mjs` | `:719` the `replace cap: with allowance:` doc token, `:742` `loop-implementation/legacy-cap`, `:759` `gauntlet-resume/legacy-cap-brief`; `:757` drops the `2/5: row 3` token of `gauntlet-resume/ledger-tracker-verify`; `:772` drops the `legacy-` prefix exemption with no replacement, because `old-ledger-stops` is not in the iterated inventory and every inventory sample is then asserted free of `cap:` |
| `scripts/commit-message-contract.test.mjs` | `:280` the reconstruction row, `:289-290` the legacy-block strip, `:315` `legacy-ledger-conversion` |
| `scripts/commit-subject-lint.test.mjs` | `:12-14` and the test at `:93`; replaced by a test that a marked block is flagged in any file |
| `scripts/brief-contract-lint.test.mjs` | `:95` the token `ledger has no allowance: line - resume through /skill:gauntlet-resume`, replaced by the Design 5 sentence asserted under `## Ledger admission`; `:97-116` the migration ordering tokens, `:134` the legacy label prefix, `:153-154`, `:156` `migration-recovery`, `:165-166` the decoder selection, `:177`, `:178` and every assertion on the `Legacy pending recovery` block, `:204`; `:126` and `:138` keep `pending recovery` then `refresh` |
| `extensions/plan-tracker.test.ts` | nothing: `:551-555` stays as the allowance-absent refresh case (a refresh without an `allowance:` header succeeds and shows unlabeled rows). It pins unchanged extension behavior, not a supported resume input; rename its `legacy` local |
| `extensions/lib/plan-check.test.ts` | `:1452` becomes allowance-only with a `cap:` rejection; `coordinatedLedger()` and `:1486` use `allowance:` |

### 9. Evals and paid actions

Delete these samples with their `results/` directories and every test reference to them: `eval/gauntlet-resume/samples/{legacy-cap-brief,legacy-ledger-conversion,legacy-pending-verification,migration-recovery,durable-cap}` and `eval/loop-implementation/samples/legacy-cap`.

Add `eval/gauntlet-resume/samples/old-ledger-stops`: entry at ledger admission with a supplied ledger; case A lacks `returned:`, case B carries `cap:` and no `allowance:`; the output to inspect is the stop; it stops before any tracker call. Case B expects the `cap:` sentence, per the Design 5 order. Its facts move `fails -> holds`. Change the `missing-line` fact of `eval/loop-implementation/samples/returned-line-admission` to the Design 5 sentence; it moves `fails -> holds`.

Rewrite three selected fixtures to the current format. Their inputs or facts require a decoder this change removes, so the changed resume cannot hold them as written:

| Sample | Obsolete content | Rewrite |
|---|---|---|
| `gauntlet-resume` `ledger-tracker-recovery` | dispatch attribution read from the child commit body (`pending:` and `iteration:` lines, cases A-C and H); the `legacy` label on the implement brief in E | the ledger carries `allowance:` and `returned:`; attribution comes from the ledger-held `returned:` tuple and its introducing ledger diff; H and its `missing-attribution` fact, which exist only for the commit-body decoder, are deleted; E drops the label and keeps `Ledger:` precedence over `No plan active.` with no `init` |
| `gauntlet-resume` `ledger-tracker-verify` | the same commit-body preamble; K's comparison with the numeric-prefix line `2/5: row 3` | ledger-held attribution; K keeps the ` \| ` suffix form, the byte-identical `2/5: G3: pending` name and the coordinated variant; the numeric-prefix comparison leaves the case and the `labels` fact |
| `finishing-a-development-branch` `ledger-pending-return` | the `cap: 14` header; companion attribution read from the child commit body | `allowance:` and `returned:` headers; the companion return file carries the tuple and the consumed count; facts `once` and `rejection` name the allowance in place of `cap 14` |

Every other fact of the three keeps its safety content on the current format: recovery before refresh, the consumed iteration kept, the failed attempt counted once, no `init` on implement, the stop on an unavailable before-image. The `09c9f4e1` text also restores the current format, so the baseline arm replays each rewritten case; run `--baseline-only` first, because the case changed.

Fixture repairs added by amendment under the standing grant after the second whole-diff review. Each repaired case replays on both arms, `--baseline-only` first:

| Sample | Defect | Repair |
|---|---|---|
| `finishing-a-development-branch` `ledger-pending-return` | the `rejection` fact quotes the failed-row evidence that only `skills/loop-implementation/reference/interrupted-recovery.md` step 3 defines, and the case did not bundle that file; the fact's literal `iteration 3: interrupted - 2 commits` contradicted step 3, which writes the dispatch iteration in the row and the consumed count in the decision; cases A and C did not ask for the return-file lookup or the repaired cells the facts check | add `bundle+:` for that reference (byte-identical to `09c9f4e1`); the fact names `iteration 2: interrupted - 2 commits` and the decision `repair row 2 \| interrupted - 2 commits \| iteration 3`; A asks how the return-file path is recomputed and which lines are matched, C asks for both reset targets, the repaired row 2 cells and the repair decision |
| `gauntlet-resume` `ledger-tracker-verify` | the `labels` fact checks the refreshed label of cut row 2, which no instruction file defines and a no-tools replay cannot observe | K asks what the producer wrote and supplies the observed refresh status `row 2 \| Reject malformed allowance replies`, the line `extensions/plan-tracker.ts` renders for a cut row; `expected.md` unchanged |
| `gauntlet-resume` `loop-ledger-brief` | the case's ledger header list had no `returned:` line, an unsupported format under Design 5, while the case says every entry check passed | the header list states one settled `returned:` tuple and no `pending:`; `expected.md` unchanged |

Change the `legacy-route` fact of `eval/loop-implementation/samples/retired-budgets` (case D, `cap: 49` and no `allowance:` header): D stops with the driver's Design 5 sentence and does not route through resume. The sample is not in the run list; its record goes stale until a run is selected (candidate C7 below).

Update `target.json` for `gauntlet-resume` and `gauntlet-handoff` to the new layout following `eval/README.md` "Iterating on a skill edit": list `brief-contract.md` and `reconstruction.md` whole, declare the four new references as new, and re-point `bundle+` and `bundle-` lines. No selected sample drops a pre-existing file that holds its rules at `09c9f4e1`, so its baseline arm replays the old text and every unchanged fact is judged before and after.

Foreign targets. The runner refuses a `bundle+` path absent at the baseline unless that target's own `target.json` lists it in `skillFiles` with `"new": true` (`eval/lib/lint.mjs:51`), and every `skillFiles` entry joins every sample's assembly (`assemble` in `eval/lib/replay.mjs`). Edit `eval/finishing-a-development-branch/target.json` and `eval/loop-implementation/target.json`:

| Target | Declared new in `target.json` | Sample | Bundle lines |
|---|---|---|---|
| `finishing-a-development-branch` | `restore-loop.md`, `coordinated.md` | `ledger-pending-return` (selected) | keeps `bundle+: skills/gauntlet-resume/reference/reconstruction.md`, which holds its rules at `09c9f4e1`; reads `restore-loop.md`; drops `coordinated.md` with `bundle-` |
| | | `ledger-post-strip` | keeps `bundle+: skills/gauntlet-resume/reference/brief-contract.md`; reads `coordinated.md`, where the post-strip retry text moves; drops `restore-loop.md` with `bundle-` |
| | | every other sample | drops both with `bundle-`, so its assembly stays as it is |
| `loop-implementation` | `restore-loop.md` | `companion-interrupted-recovery`, `interrupted-child-redispatch`, `leg-resume`, `verify-repair-count` | keep `bundle+: skills/gauntlet-resume/reference/reconstruction.md`; read `restore-loop.md` |
| | | every other sample, `returned-line-admission` included | drops `restore-loop.md` with `bundle-` |

The unselected samples' records go stale and are not rerun. Rewrite `intent.md` for the four targets that run.

Paid external action: model eval runs, `node eval/run.mjs <target> <sample>`, preceded by `node eval/run.mjs <target> <sample> --baseline-only` where a sample's bundle or case changed. Runner: the implementing agent, from the worktree. Inputs: the sample directories below and the frozen models in `eval/lib/models.mjs`.

| Target | Samples |
|---|---|
| `gauntlet-resume` | `clean-pass-unchanged`, `pending-owner-stops`, `loop-ledger-brief`, `ledger-tracker-recovery`, `returned-line-recovery`, `ledger-tracker-verify`, `baseline-upgrade-preserves-statuses`, `legs-ok`, `legs-receipt`, `old-ledger-stops` |
| `gauntlet-handoff` | `ledger-task-list`, `multi-repo` |
| `finishing-a-development-branch` | `ledger-pending-return` |
| `loop-implementation` | `returned-line-admission` |

Approving this spec authorizes these runs for the whole flow, across seed, rows, repairs and finish, with no per-step permission prompt. Fourteen samples is advisory, not a budget. Each existing sample must hold every expected fact on the changed files, except the intended moves: the `old-ledger-stops` and `missing-line` facts above, the facts rewritten with the three fixtures, and `retired-budgets` `legacy-route`. No target-wide or cross-target run.

Additional paid runs C1-C4 are authorized by the user's implementation-stop answer: `A, continue without bothering! you have ammend permissions!`. The primary session runs these checks and supplies their evidence to the implementer; the worker prepares fixtures and implementation without launching Pi. Authorization covers setup, baseline and changed runs, repairs and finish without another permission prompt. Missing fixtures are deliverables to create, not evidence that the outcome is unreachable. C5-C7 remain optional and unselected. Text replays run with `--no-tools`, so none of the fourteen can observe a read call.

C8, added by amendment under the standing grant after the user's instruction to continue without further questions: removing the two conversion rows from `commit-message.md` changes the assembled input of every eval target that bundles that file, and two contract tests bind saved records to the current assembly: `scripts/delivery-stage-authoring.test.mjs` (target `brainstorming`) and `scripts/gatekeep-comment-reconcile.test.mjs` (target `gatekeep-pr`). For `brainstorming`, replay the two samples that test names (`pr-body-drafted-row`, `post-action-sorted`) against base `3171d0e1`, the base whose baseline assembly matches the saved baseline records, and update its `intent.md`. For `gatekeep-pr`, rebind `intent.md` to the current assembly and replay nothing: its saved `loop-worker` record predates the fix-wave return contract that an earlier change introduced, a replay fails three of its facts on both models for that older reason, and bringing that sample to the current contract is separate work outside this spec. Runner: the implementing agent. No other sample of either target runs. These actions are listed at the finish gate.

Reseeds that follow from the owner move, added by amendment under the standing grant: moving the restore rules gives five samples outside the fourteen a new owner file in their assembled input, so their saved records are replayed too: `loop-implementation` `companion-interrupted-recovery`, `interrupted-child-redispatch`, `leg-resume` and `verify-repair-count`, and `finishing-a-development-branch` `ledger-post-strip`. They are replayed again after any later edit to a file they assemble. `leg-resume` holds all four facts on both models after the change, while one model failed them at base; this is recorded as observed and is not an acceptance condition of this spec.

| # | Run | Evidence it would supply |
|---|---|---|
| C1 | a tool-enabled `/skill:gauntlet-resume <brief>` session in a scratch checkout on a recorded single-repo brief, one with `Ledger:` and one with a task plan; the transcript's read calls are captured | ticket row 1: the read calls name no `coordinated.md` |
| C2 | the same session on a recorded brief with a `legs:` block; read calls and the first tracker call are captured | ticket row 3: `coordinated.md` is read before any tracker write |
| C3 | new paired `gauntlet-resume` samples for a single-repo brief at brainstorm, plan and ship stage | ticket row 2 at the stages no selected sample covers |
| C4 | the five unselected `gauntlet-resume` `legs-*` stop samples | ticket row 3: each coordinated stop on the same recorded input |
| C5 | `gauntlet-resume` `loop-no-ledger` | the approved `**Engine:** loop` branch of `## Spec without plan` |
| C6 | `gauntlet-resume` `pr-subject-brief`, `pr-list-brief`, `loop-ledger-worktree` | both PR mismatch stops after the owner move; worktree order admission, question, arming |
| C7 | `loop-implementation` `retired-budgets` | case D's driver stop |

**Post-deployment housekeeping.** Before the release that ships this change, the maintainer runs the README smoke walkthrough, including its new step: a single-repo brief resume whose transcript read calls name `SKILL.md`, `brief-contract.md`, `reconstruction.md` and one restore reference, and never `coordinated.md`. The walkthrough is a release check; it is not the acceptance evidence for ticket rows 1 and 3.

### 10. Remove and Add

Remove:

- `### Returns conversion`, `### Legacy repair markers`, `#### Conversion recipe`, `### Legacy pending recovery` and the `legacy-commit-labels` markers.
- `cap:` admission, the allowance migration, the post-migration header validation, and the `cap +N` sentence in the ledger restore.
- The numeric-prefix and legacy plain task label clauses, and the task-less ledger brief clause.
- The two duplicate statements of the ledger restore.
- `cap` acceptance in `extensions/lib/plan-check.ts`.
- Both conversion rows in `commit-message.md`.
- The exemption in `scripts/commit-subject-lint.mjs`.
- `scripts/loop-legacy-conversion.test.mjs` and the assertions listed in Design 8.
- The six eval samples in Design 9.
- Handoff step 4 and both `pi-cohort >= 7.1.0` texts; the cohort note in `brief-contract.md`.
- The `(legacy spec)` label in entry check 6.
- The four `skills/loop-implementation/SKILL.md` phrases in Design 8.
- `## Coordinated brief grammar`, `## Coordinated admission`, `## Process-state restore`, `## Plan repair` from `brief-contract.md`; `## Spec with ledger`, `### Pending recovery`, `## Spec with plan` from `reconstruction.md` (moved, not deleted).
- The restore trailer that closes `### Citation repair` in `brief-contract.md` (moved to `SKILL.md`, not deleted).

Add:

- `skills/gauntlet-resume/reference/restore-loop.md`, `restore-plan.md`, `plan-repair.md`, `coordinated.md`.
- The engine test and the membership test in `SKILL.md`.
- `## Ledger admission` with its ordered checks, five stop sentences and the recovery line.
- The allowance-only rule in `coordinatedMetadata`, and the regenerated `bin/` bundles.
- `scripts/resume-routes.test.mjs` and its `scripts/ci.mjs` registration; the registrations of `scripts/loop-home-resume.test.mjs` and `scripts/commit-message-contract.test.mjs`.
- The second owning file in `scripts/brief-contract-lint.mjs`.
- The re-pointed citations in `skills/gauntlet-handoff/SKILL.md`, `reference/seed.md` step 8, `reconstruction.md` `## Candidates`, `verification-set.md`, `skills/loop-implementation/SKILL.md`, `scripts/ci.mjs`, `doc/gate-contract.md`, the contract tests and the eval files.
- `eval/gauntlet-resume/samples/old-ledger-stops`.
- The declared-new `skillFiles` entries and `bundle-` lines in `eval/finishing-a-development-branch` and `eval/loop-implementation`; the three rewritten fixtures.
- The doc edits in Documentation impact.

## Errors and edge cases

- A spec with both a ledger and a task plan takes the loop restore, as today.
- A ledger converted by an earlier release is current format. Its Decisions section can hold `cap +N` and `converted <sha7>` lines; they are inert, because the effective allowance counts only `row <n> retry` decisions.
- A brief written before the current formats is not detected. A numeric-prefix task label restores as a plain task name and stays beside the refreshed ledger rows. Write a new handoff.
- A brief without a `legs:` block for a multi-leg spec reads no multi-repo rules, as today.
- A brief with a `legs:` block entered from a member primary stops at entry check 3 and prints `home is <repo>; restart there`; that sentence lives in `coordinated.md`.
- A brief whose `Ledger:` file is absent stops with `ledger not found: <path>`, except a ship-stage brief with a `legs:` block, which takes the receipt-validated retry in `coordinated.md` first.
- A ledger with `cap:` and neither `allowance:` nor `returned:` matches three admission checks; the Design 5 order prints the `cap:` sentence.
- A plan-stage brief for a spec with `**Engine:** loop` and no ledger arms through its `restore-plan.md` call-table row, not through `## Spec without plan`.
- A worktree with no spec, more than one spec, or one spec without a plan reads no restore reference; Candidates and `## Spec without plan` decide it.
- A missing or unreadable reference stops the route naming its path; resume never reconstructs a reference from memory.
- `plan_check` FAIL on a ledger stops with the findings and never enters plan repair.
- The loop driver keeps its own per-dispatch header requirement; it stops with the Design 5 sentences on a ledger that reached it without resume.
- A file over a ceiling fails `scripts/resume-routes.test.mjs`; raising a ceiling is a spec amendment backed by the measured sizes.

## Tests

Structural and byte assertions (`scripts/*.test.mjs`) and text replays are separate kinds of evidence. Token presence never stands in for the read observations of ticket rows 1 and 3 or for the recorded-input equivalence of rows 2 and 3; Design 9 runs C1-C4 supply those observations under the user's explicit authorization; C5-C7 remain unselected.

- A single-repo route's file set excludes `coordinated.md` (the Design 4 sets, and every mention of `coordinated.md` outside that file sits in a sentence conditioned on a `legs:` block or on more than one member), no leg grammar line sits outside it, and entry checks 3 and 4 keep the same-repository binding and the single-repo drift notice while carrying no coordinated rule beyond the `legs:` test and its pointer - `scripts/resume-routes.test.mjs`, `scripts/brief-contract-lint.test.mjs`
- Ticket row 1, the read calls of a single-repo brief resume name no `coordinated.md` - authorized C1 tool-observed traces for ledger and task-plan briefs; text replays cannot substitute.
- Ticket row 3, a resume from a brief with a `legs:` block reads `coordinated.md` before its first tracker write - a tool-observed trace, required before acceptance; authorized C2
- Single-repo brief, implement with a task plan, restores the same calls and task list - `eval/gauntlet-resume` `clean-pass-unchanged`, `pending-owner-stops`
- Single-repo brief, implement with a ledger, restores the same calls, recovery and continuation - `eval/gauntlet-resume` `loop-ledger-brief`, `ledger-tracker-recovery`, `returned-line-recovery`; `scripts/loop-home-resume.test.mjs`
- Single-repo brief at verify restores the mixed task list, never starts implement, and keeps `pending: verify` admission - `eval/gauntlet-resume` `ledger-tracker-verify`, `baseline-upgrade-preserves-statuses`; `scripts/loop-verification-repair.test.mjs`
- Brainstorm, plan and ship stage call sequences are present in `restore-plan.md` and `restore-loop.md` - `scripts/brief-contract-lint.test.mjs` (re-pointed row assertions), `scripts/resume-routes.test.mjs`; structural only - the paired restore of ticket row 2 at those stages uses authorized C3
- A brief with a `legs:` block admits or retries as before - `eval/gauntlet-resume` `legs-ok`, `legs-receipt`
- Each multi-repo stop sentence of `## Coordinated admission` is present unchanged in `coordinated.md` - `scripts/resume-routes.test.mjs`; structural only - the same-input stop results of ticket row 3 on the five `legs-*` stop samples use authorized C4
- `## Ledger admission` sends an absent ledger on a ship-stage `legs:` brief to `coordinated.md` before the `ledger not found` stop, and `coordinated.md` keeps `for a ledger subject, recover gate pairs from the committed pre-strip ledger` - `scripts/resume-routes.test.mjs`; `legs-receipt` covers only the task-plan retry
- The engine test names `restore-plan.md` only for a process-state brief without `Ledger:`, a task-plan candidate and seed step 8; `reconstruction.md` keeps the Candidates rows for no spec, more than one spec and one spec without a plan, and `## Spec without plan` keeps the approval question with its `loop`, `waves` or absent, and unapproved branches - `scripts/resume-routes.test.mjs`; a model run of `loop-no-ledger` awaits the gate (C5)
- `seed.md` step 8 names `restore-plan.md` `## Spec with plan` for a pinned spec with a plan and keeps the pinned path and the Candidates bypass - `scripts/resume-routes.test.mjs`
- A ledger route's read set includes `reconstruction.md`, and `## Candidates` cites `coordinated.md` `## Coordinated admission` - `scripts/resume-routes.test.mjs`
- `SKILL.md` holds the closing-line template, the `<task>` substitution, the exact-restoration binding and both feasibility checks; `plan-repair.md` holds none of them; `restore-plan.md` and the verify and ship `init` step of `restore-loop.md` point to them - `scripts/resume-routes.test.mjs`
- Both PR stops, `brief names PR #N on <headRefName>, worktree is on <branch>` and `brief lists <brief order>, record lists <record order>`, are present in `reconstruction.md` ahead of any tracker call - `scripts/resume-routes.test.mjs`; model runs of `pr-subject-brief` and `pr-list-brief` await the gate (C6)
- On the worktree ledger route, `## Ledger admission` precedes the confirmation question, which precedes the first arming call - `scripts/resume-routes.test.mjs` (step order in `restore-loop.md`); a model run of `loop-ledger-worktree` awaits the gate (C6)
- No file under `skills/gauntlet-resume/` or `skills/gauntlet-handoff/` matches `legacy`, `migrat` or `conversion` case-insensitively, and the four removed headings are absent - `scripts/resume-routes.test.mjs`
- A ledger without `returned:`, without `allowance:`, or with `cap:` stops before any tracker call with the Design 5 sentence and its recovery line; the six checks appear in the Design 5 order, `cap:` ahead of the missing-header checks - `eval/gauntlet-resume` `old-ledger-stops`; `scripts/resume-routes.test.mjs`
- A multi-repo ledger with `cap:` fails `plan_check`; one with `allowance:` passes - `extensions/lib/plan-check.test.ts`
- The loop driver stops on a ledger without `returned:` with the Design 5 sentence - `eval/loop-implementation` `returned-line-admission`; `scripts/loop-engine-contract.test.mjs`
- The loop and plan route sets stay within 42,000 and 37,000 bytes and handoff within 17,000 - `scripts/resume-routes.test.mjs`
- Among the files under `skills/gauntlet-resume/`, the string `plan-repair.md` appears only in `restore-plan.md`, in a sentence conditioned on `plan_check` FAIL; `SKILL.md` `## Boundaries` and `## Post-restore continuation` name plan repair without that path; `restore-loop.md` is named in no plan-only file - `scripts/resume-routes.test.mjs`
- A ledger beside a task plan takes the loop restore - `scripts/resume-routes.test.mjs` (engine test rows)
- Handoff appends the same section for a ledger run at implement and at verify, and the leg block for more than one member - `eval/gauntlet-handoff` `ledger-task-list`, `multi-repo`
- Handoff carries no double-section refusal and no cohort version text - `scripts/resume-routes.test.mjs`
- Finish reads pending recovery from `restore-loop.md` - `eval/finishing-a-development-branch` `ledger-pending-return`; `scripts/finish-verification.test.mjs`
- A legacy-marked block is flagged in every file - `scripts/commit-subject-lint.test.mjs`
- `commit-message.md` carries no conversion sentence - `scripts/commit-message-contract.test.mjs`
- Every gate inventory row resolves to its file and heading - `scripts/gate-contract-lint.test.mjs`
- Every instruction file is under 50,000 bytes and 2,000 lines - `scripts/skill-size-lint.test.mjs`
- A brief older than the current formats is not detected - none: no rule exists to exercise
- A converted ledger's `cap +N` history stays inert - `extensions/plan-tracker.test.ts` (existing `cap +20 | historical` fixture)

## Documentation impact

Materiality bar: `reference/documentation-impact.md`.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` "Loop engine operations" (operations: the conversion route becomes the unsupported-ledger stop, with the recovery - finish the run on the release that wrote the ledger; pi-gauntlet 8.7.1 still converts); `CHANGELOG.md` `## Unreleased` (operations: breaking change and the same recovery, `(#158)`); `README.md` "Smoke walkthrough" (procedure: the read-set step, and the pi-cohort 7.1.0 literal removed)
- Derived / memory docs invalidated: `AGENTS.md` routing row for handoff and resume; `README.md` "Handoff and resume" lead paragraph (one grammar file); `doc/gate-contract.md` resume rows; `doc/implement-engines.md` "Resume and amendments" and the legacy task-name sentence

## Out of scope

- The loop driver's dirty-tree stop sentence keeps the words `finish eligible migration` in this change. Resume no longer migrates a ledger, so the words describe a step that never runs; Design 8 names four driver edits and this sentence is not one of them, and each further driver edit forces a replay of ten saved eval samples. Rewording it rides with the next change to that file.
- Converting, migrating or hand-repairing an old ledger; a converter tool. Ticket row 5 is cut by the request.
- Detecting or rejecting old briefs.
- Specs without `## Legs`, `**Amend-grant:**` or `**Engine:**`; their readers in brainstorming, finishing and using-git-worktrees keep their rules.
- The loop driver's `checks:` stop, its rules for history lines in a converted ledger, and the `legacy and single-member` sentence.
- `extensions/plan-tracker.ts`; it reads only `allowance:` already.
- pi-cohort's `handoff` skill.
- Model runs beyond the fourteen samples, authorized C1-C4, C8 and the five owner-move reseeds named in Design 9; C5-C7 remain unselected.

## Open questions

- Consumer-repo runs that still hold a ledger without `returned:` or `allowance:` could not be counted from here. They meet the Design 5 stop; the recovery is in `doc/configuration.md` and `CHANGELOG.md`.
- Byte ceilings: whether the Design 10 removals fit 42,000, 37,000 and 17,000 bytes is unmeasured. Probe: `rg --max-count 3 'dry[- ]split|restore-loop\.md|resume-routes'` over `skills`, `scripts`, `doc/configuration.md`, `doc/gate-contract.md`, `doc/implement-engines.md`, `eval/README.md`, `README.md`, `AGENTS.md` - no match; no split or per-file allocation exists, and the only way to obtain one is to perform the split. A council member's section-based estimate (plan route about 38.7 KB, loop route about 42.0 KB, error about 1.5 KB) is unverified, and the read-set and trailer moves in Designs 2-4 change it. Settles: the three Design 4 ceilings and the Tests ceiling line. Path: the user supplies an allocation at the gate, or the first plan task performs a dry split, records the per-file bytes, and names the kept prose it compresses without changing a rule. A split that cannot fit goes back to the user through brainstorming's amendment path; never raise a ceiling silently or delete a kept rule to fit.
- C1-C4 are authorized: the primary session supplies the tool-observed traces and paired replay evidence without another prompt. C5-C7 remain optional model coverage on top of the static assertions already named.
