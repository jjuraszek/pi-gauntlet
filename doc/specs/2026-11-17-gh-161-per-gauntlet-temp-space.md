# Per-gauntlet scratch folders: stage files under the worktree's git dir, one folder per gate run, exact-path teardown

**Goal:** Every gauntlet stage writes its scratch files under `gauntlet/tmp/` of its own checkout's git dir, every PR gate run writes all of its files into one run folder under the repository's common git dir, and gate teardown deletes exactly that folder by its absolute path, so ending one run never touches another run's files or any kept reply or coverage draft.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Ticket:** #161
**Date:** 2026-11-17
**Predecessor:** `doc/specs/2026-11-04-gatekeep-fix-loop-engine.md` - supersedes the OS-temp row output path in "Row dispatch" only; the rule that the finding spec and ledger live beside the continuation record stays live.

## Problem

Request, verbatim: `#161 each gauntlet should have its own temp space. we could derive this name mechanically. any cleanup in gatekeep-pr should be selective one and should take care only this gauntlet (PR along any leftovers after impl process if available)`

Ticket #161 (OPEN, no labels, one `Reporter note:` comment) reports that a gate run's end-of-run cleanup deleted other runs' temp files. Every gate helper output is minted as `mktemp "${TMPDIR:-/tmp}/gatekeep-<role>.XXXXXX"` (`skills/gatekeep-pr/SKILL.md:42`), the saved-progress record as `gatekeep-state.XXXXXX` (`skills/gatekeep-pr/reference/post-selection-loop.md:7`), and Teardown lists what to delete without a command or an ownership boundary (`post-selection-loop.md:269`). All runs on a machine share one folder and one name prefix, so an agent that composes its own delete command reaches other runs. The gauntlet stages outside the gate mint bare random names in the same OS temp folder; several never delete them.

Reported incident, taken as given (description of the input, not a target): a 2026-11-17 cleanup deleted 785 temp paths, including six other runs' saved-progress records whose sessions were active within minutes (five also lost their finding spec and ledger) and reply and coverage drafts earlier runs had reported as kept; 18 earlier sessions between 2026-10-22 and 2026-11-15 used wildcard cleanup. Environment: pi harness, pi-gauntlet 8.7.1. Commands the reporter note records:

- `for p in $D/gatekeep-*; do [ "$p" = "$KEEP" ] && continue; rm -rf -- "$p"; done` (2026-11-17, `D` the shared OS temp directory)
- `rm -f <tmp>/gatekeep-*` (2026-10-23), `rm -f <tmp>/gatekeep-*.*` (2026-10-25)
- 16 sessions with per-role wildcards such as `gatekeep-verify.*` and `gatekeep-review.*`

Reporter-note requirements carried into Design: each run gets its own temp folder and deletes only that folder at the end (fix sketch, marked untested); the triage premise "no rule limits deletion" is corrected by `skills/gatekeep-pr/reference/batch.md:95` ("delete only that PR's other helper/log files and record"); the run record has no field listing every temp path the run created; sharing a PR identifier alone does not establish that two runs own the same files; kept drafts must survive both their own run's exit and later runs' cleanup; the ticket's rows cover handled terminal exits only.

Framing: kept

The scout's smaller alternative (forbid cross-run wildcard deletes, delete only tracked paths) was weighed and not adopted: `batch.md:95` already carries that kind of rule, the record has no complete inventory, and every run's files would still share the name prefix the reported commands matched.

### Decisions from the questionary

| # | Question | Answer (verbatim) | Decision |
|---|---|---|---|
| 1 | Reach of the own-folder rule: every stage / gate plus stages that leave files / gate only | `A, but make sure eval is very narrow and selective for this change only` | Every gauntlet stage (brainstorm, spec council, both implement engines, verify, finish, PR gate) writes under the gauntlet's folder. Model evals stay narrow: only samples that exercise this change, no target-wide runs, no sample for an edit that only relocates a temp path. |
| 2 | Who removes the folder of a gauntlet that never meets the gate | `A` | The folder shares the worktree's lifetime on squash-merge and discard; PR, draft PR and keep leave it in place. |
| 3 | Location: checkout's git dir / OS temp named from repo and branch / bin-owned | `A, but never commit temp content to worktree, right?` | The checkout's git dir. Hard constraint: no temp content is ever committable or visible in the working tree. |
| Round 1 | Architecture | `approve` | Approved, with the third teardown step later dropped (claim 35). |
| 4 | Scope size after the round 2 presentation: as designed / gate only / gate plus leave-behind stages | `A` | Scope stays as designed in rounds 1 and 2; recorded as the round 2 approval. |

Decisions made in place of yes/no questions and stated to the user: standalone skills that are not gauntlet stages keep their own temp use; the gate's run folder sits under the primary's git dir; kept drafts leave the run folder for individually named OS-temp files; the recipe is a new section in `skills/loop-implementation/reference/return-file.md`; teardown is two steps and no step deletes a worktree's stage folder; an unhandled exit leaves the run folder for a manual delete.

Decisions made at spec-writing, inside one component: the temp-path lint rule takes its own scope list instead of widening `STAGE_SKILL_DIRS`, because that list also drives the `cd` and `--show-toplevel` rules (`scripts/stage-skill-lint.mjs:8-15`); a helper's `log_path` is a file in the directory of its own output path, so helpers need no new input; the kept-draft file prefix is `gate-kept.`, which none of the reported wildcard commands match; the jobs file has no OS-temp fallback because worker and driver must derive the same path.

Decisions changed by the spec council, for ratification at the gate: the run folder is minted from the session checkout before the continuation record, not after provisioning; the record gains no `run_dir` field, because its own directory is the run folder; a record outside a run folder (an earlier package version, the existing eval fixtures) keeps today's validation, keeps writing beside itself and is never deleted; a gate row task passes `scratch: <run folder>`, so the fix worker's logs and jobs file leave with the run folder; Teardown is one marked shell block that checks ownership against the primary before it moves or deletes anything, and a deterministic test executes it; a multi-PR parent keeps its folder while any child folder remains; the plain-jj fallback needs `jj root` to succeed.

### Checked claims

| # | Claim (source) | Lookup | Result |
|---|---|---|---|
| 1 | Gate helper outputs share one prefix (ticket note) | `skills/gatekeep-pr/SKILL.md:42` | held |
| 2 | Record minted the same way, finding spec and ledger beside it (ticket note) | `reference/post-selection-loop.md:7`, `reference/fix-wave.md:34,79` | held - `<record path>-spec.md`, `<record path>-ledger.md`; locators `repair.wave.spec`, `repair.wave.ledger` |
| 3 | Other gate mint points | `reference/assessment.md:101`, `reference/fix-wave.md:85`, `reference/batch.md:29`, `verification-brief.md:10,227,246` | held - all directly in the shared OS temp dir |
| 4 | Single-PR Teardown lists artifacts, gives no ownership rule or command | `reference/post-selection-loop.md:269` | held |
| 5 | Multi-PR retirement limits deletion to that PR (reporter note) | `reference/batch.md:95` | held |
| 6 | Record has no complete inventory of temp paths | `reference/post-selection-loop.md:9` | held with nuance - it persists evidence and helper paths and the finding locators; description files, row outputs and logs are not one inventory |
| 7 | Kept drafts have no location rule beyond OS temp | `reference/post-selection-loop.md:261,267` | held |
| 8 | Re-entry never discovers a record | `reference/post-selection-loop.md:11` | held - lost locator or file -> `stuck - run record unreadable` |
| 9 | "Six instruction files" for a gate-only fix (reporter note) | `rg -n "mktemp\|TMPDIR" skills/gatekeep-pr` | held - `SKILL.md`, `verification-brief.md`, `reference/assessment.md`, `batch.md`, `fix-wave.md`, `post-selection-loop.md` |
| 10 | The location can be derived mechanically (request) | brainstorming checklist order; `reference/assessment.md:9,11` | held - every stage runs after its worktree exists |
| 11 | The gate can clean implementation leftovers (request) | `rg -n "mktemp" skills agents` | corrected - stages mint bare random names with no branch or PR in them; the gate can reach them only once they live under a derived folder |
| 12 | Incident counts (ticket body) | none available; ticket states `scenario: none` | not checked - taken as given |
| 13 | Existing out-of-tree per-flow state | `extensions/lib/telemetry-paths.ts:27-32`, `skills/loop-implementation/reference/return-file.md` | held - recorder state under the common git dir, return files under the checkout-local git dir; `scripts/ci.mjs:406-407` rejects the word `telemetry` in gatekeep-pr markdown |
| 14 | gatekeep-pr is on the Claude Code surface | `.claude-plugin/marketplace.json` | held |
| 15 | Stage files have room for new text (50,000-byte lint) | `wc -c` | corrected - `skills/finishing-a-development-branch/SKILL.md` 48,913; `skills/subagent-driven-development/SKILL.md` 48,603; `skills/gatekeep-pr/reference/post-selection-loop.md` 44,932; `skills/loop-implementation/SKILL.md` 44,918. The recipe lives in one shared file |
| 16 | The gate can read files outside its own skill directory on the Claude Code surface | `.claude-plugin/marketplace.json`; `reference/cleanup.md:9,25` | held - plugin `source` is `./`; the gate already reads `../../finishing-a-development-branch/SKILL.md` |
| 17 | Finish removes temp files when it removes the worktree | `skills/finishing-a-development-branch/SKILL.md:379-405`, `reference/verification-set.md:16` | corrected - Step 6 removes worktree and branch only |
| 18 | A gate cannot run on a branch with a live implement session | `reference/assessment.md:9` | held - reuse stops on divergence, dirt or local-only commits |
| 19 | Teardown runs on every handled exit, non-final stops included | `reference/post-selection-loop.md:263-269`, `reference/cleanup.md:41` | held |
| 20 | Identity available to the gate before provisioning | `reference/assessment.md:9,15` | held |
| 21 | The repo already has a derived per-checkout scratch location | `skills/loop-implementation/reference/return-file.md`, `reference/coordinated-legs.md:27-29` | held - `<git dir>/gauntlet/returns/`, resolved with `git -C "$CHECKOUT" rev-parse --path-format=absolute --git-dir`; callers `skills/gatekeep-pr/reference/fix-wave.md:121`, `skills/chase-bug/hotfix.md:105,127` |
| 22 | Removing a worktree removes files in its checkout-local git dir | scratch repo, git 2.56.0: file under `<git dir>/gauntlet/tmp/` in two linked worktrees; `git worktree remove` on one, `rm -rf` plus `git worktree prune` on the other | held - both admin dirs gone with their files; `git status --porcelain` stayed empty while the files existed |
| 23 | Other worktree-removal sites exist | `skills/housekeeping/reference/select.md:13,32`; `skills/gatekeep-pr/reference/cleanup.md:9,31-39` | held - a git-dir location needs no delete step at any of them |
| 24 | Every flow checkout has a git dir | `skills/finishing-a-development-branch/SKILL.md:238-239` | corrected - a plain jj workspace has none; the recipe states one fallback |
| 25 | A deterministic lint over the stage skills exists | `scripts/stage-skill-lint.mjs:8-15`, `scripts/ci.mjs:447-450,567,605` | held - `STAGE_SKILL_DIRS` lists six directories and excludes gatekeep-pr, roasting-the-spec, verification-before-completion |
| 26 | gatekeep-pr calls no bin today | `rg` over `skills agents` for the three bin names | held |
| 27 | Kept drafts can live inside the gauntlet's folder | `reference/cleanup.md:9` | corrected - the gate can remove the PR worktree and with it that git dir; kept drafts live outside |
| 28 | Files under a git dir cannot be committed (user's constraint) | scratch repo, git 2.56.0: `git add -A`, `git add -f`, `git status --porcelain`, `git ls-files --cached` | held - nothing staged from the primary; from a linked worktree `add -f` exits 128 `is outside repository` |
| 29 | The gate's run files can live in the PR worktree's git dir | `reference/post-selection-loop.md:45-53,261-269`; `reference/cleanup.md:9,41` | corrected - cleanup step 1 and non-final stop remove the PR worktree while the run still writes the record; the run folder sits under the common git dir |
| 30 | Finding spec and ledger location contract | `doc/specs/2026-11-04-gatekeep-fix-loop-engine.md:29,132,140` | held - "beside the record" stays true inside the run folder; `:140` names the OS-temp row output this spec replaces |
| 31 | Deterministic tests pin current temp wording | `rg` over `scripts eval/lib src` | held - `scripts/loop-engine-contract.test.mjs:398-428`, `scripts/finish-verification.test.mjs:20`, `scripts/gatekeep-comment-reconcile.test.mjs:483,718`, `scripts/loop-implementer-process.test.mjs:16` |
| 32 | Existing eval samples carry temp paths as fixtures | `rg -l "/tmp/\|TMPDIR" eval/gatekeep-pr/samples -g case.md`; `rg -n -i "delet\|remov\|teardown" eval/gatekeep-pr/samples -g expected.md` | corrected - 51 of 93 gatekeep-pr `case.md` files supply bare OS-temp locators. Under this change each is a record outside a run folder: content validation is unchanged, so their re-entry facts hold, but facts that expect the record, helper outputs or logs to be retired at Teardown (`course-stop-cleanup` f4, `batch-cleanup-stop` c3, `stop-draft-files` `retained`) no longer match ("Eval scope") |
| 33 | The worker's jobs file is a derived-name contract between worker and driver | `agents/loop-implementer.md:69`; `skills/loop-implementation/SKILL.md:176`; `reference/interrupted-recovery.md:5`; `doc/configuration.md:156`; `doc/implement-engines.md:110` | held - all five move together |
| 34 | Further in-scope mint points | `rg -n "mktemp\|TMPDIR"` over the in-scope skills, `agents`, `doc/configuration.md`, `doc/implement-engines.md` | corrected - also `skills/finishing-a-development-branch/SKILL.md:265`, `skills/loop-implementation/SKILL.md:85`, `skills/verification-before-completion/reference/conformance-check.md:163`, `doc/implement-engines.md:58` |
| 35 | A teardown step that deletes the PR worktree's stage folder is safe | `reference/fix-wave.md:86`, `agents/loop-implementer.md:69`, `reference/cleanup.md:5,35` | corrected - a gate fix worker keeps its log and jobs file there, and when the PR is checked out in the primary that folder is the parent of every run folder; the step is dropped (after the council the gate worker's files route into the run folder; the primary-checkout reason still holds) |
| 36 | The return-file recipe handles a plain jj workspace | `rg -n "jj" skills/loop-implementation/reference/return-file.md`; `extensions/lib/checkout.ts:4-5` | corrected - no jj handling there |
| 37 | CHANGELOG has a home for unreleased entries | `rg -n "^## Unreleased" CHANGELOG.md`; `.agents/skills/release/SKILL.md:60,71` | held - the change adds the heading; the release script promotes it |
| 38 | Product docs that state temp locations | `rg -n "mktemp\|TMPDIR" README.md doc/*.md` | held - `doc/implement-engines.md:58,110`, `doc/configuration.md:156` go stale |
| 39 | Eval runner contract for a narrow run | `eval/README.md:8,33-60` | held - `node eval/run.mjs <target> <sample>`; `--baseline-only` seeds a baseline; target-wide sweeps are forbidden |
| 40 | The hotfix path names the worker's jobs or log location | `rg -n "mktemp\|TMPDIR\|\.jobs" skills/chase-bug` | held as out of scope - hotfix names no jobs path; its worker's files move with the persona edit only |
| 41 | `doc/configuration.md` `### telemetry` clears the materiality bar | `reference/documentation-impact.md` | dropped for that section; the file is admitted for the stale jobs-file line and the new scratch-location paragraph |
| 42 | The repair-base recipe's linked worktree and the scratch index work inside a git dir | scratch repo, git 2.56.0: `git worktree add --detach "<git dir>/gauntlet/tmp/repair.x/tree"`, `apply --index`, `commit`, `GIT_INDEX_FILE` under the same folder with `add -A` and `write-tree` | held - all exit 0; after the owning worktree is removed the nested tree's admin entry stays until `git worktree prune`, which removes it |

Implicit dependencies: `eval/gatekeep-pr/` (`intent.md`, `report.md`, `samples/`) - listed - found. Block-execution tests for the marked shell blocks (`scripts/wave-review.test.mjs`, `scripts/happy-path-run.test.mjs`, `scripts/loop-return-hygiene.test.mjs`, `scripts/loop-outside-return.test.mjs`) - `rg -l` for the block markers - found. `node_modules/pi-cohort` - `test -e` - found. `node_modules/@earendil-works/pi-coding-agent` - `test -e` - not found in this worktree; no extension changes, so it is not needed. Reporting machine's transcripts and temp folder - not checkable: ticket `scenario: none`. A live gate run against real PR state - not checkable in recon.

## Acceptance criteria

Ticket #161, Acceptance Criteria, rows verbatim:

- [ ] With two gate runs' temp files on one machine, when the first run reaches a handled terminal exit, every temp file of the second run remains in place, and the second run's next step reads its saved progress without a "run record unreadable" stop.
  in-scope
- [ ] After a gate run reaches a handled terminal exit, its saved-progress record, finding spec and ledger, helper outputs with their logs, and temporary description files are gone; the reply and coverage drafts its closing message names as kept remain.
  in-scope
- [ ] Reply and coverage drafts that an ended run's closing message named as kept are still present after a different gate run on the same machine reaches a handled terminal exit.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-161-per-gauntlet-temp-space
contract:
- create: git worktree add .worktrees/<name> -b <branch>
- destroy: git worktree remove .worktrees/<name> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test (AGENTS.md Testing); node eval/run.mjs gatekeep-pr teardown-own-run-folder
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: .pi/gauntlet-overrides.md
Rules: README.md
Rules: CHANGELOG.md
Rules: eval/README.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: doc/install-internals.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
Rules: skills/forge-skill/SKILL.md
scope: AC 1, AC 2, AC 3
design: owns every path in Design; observable outcomes are the three AC rows above and the stage-file location in "Stage files"

## Design

Two locations, one rule: scratch files live under a git dir, in `gauntlet/tmp/`. Nothing there can be staged or shown by `git status` (claim 28).

| Owner | Location | Lifetime |
|---|---|---|
| A gauntlet stage (brainstorm, spec council, both implement engines, the loop worker, verify, finish) | `SCRATCH` = `<checkout-local git dir of the checkout that owns the file>/gauntlet/tmp` | Until the stage deletes its own minted path, or the worktree is removed |
| A PR gate run | `RUN_DIR` = `<common git dir>/gauntlet/tmp/gate.XXXXXX` | Until that run's Teardown |
| A reply or coverage draft a gate run reports as kept | `${TMPDIR:-/tmp}/gate-kept.XXXXXX` | Never deleted by any gate run |

Terms. The **checkout-local git dir** is `git -C "<checkout>" rev-parse --path-format=absolute --git-dir`. The **common git dir** is `git -C "<checkout>" rev-parse --path-format=absolute --git-common-dir`; it is the same path from every checkout of one repository. The **primary** is the parent directory of the common git dir and the checkout the gate session runs in (`skills/gatekeep-pr/reference/cleanup.md:5`). The two git dirs are equal only in the primary; in a linked worktree the checkout-local git dir is `<common git dir>/worktrees/<name>`. A stage's `SCRATCH` and the gate run folders therefore share one `gauntlet/tmp` directory only for a stage that runs in the primary.

Readings of the ticket rows: a "handled terminal exit" is every exit that reaches `post-selection-loop.md` `### Teardown`, non-final stops and per-PR retirement in a multi-PR run included. "Temp files of a run" are the contents of its run folder; the gate routes its fix worker's logs and jobs file there ("Gate run folder"), so the only gate-created file outside it is a return file, which its own recipe deletes at admission.

Reading of the request's "leftovers after impl process": the stage files in the PR worktree's `SCRATCH` leave when gate cleanup removes that worktree. When the gate keeps the worktree they stay: no gate run created them, and none can name them by exact path.

### Scratch recipe

Add: a `## Scratch folder` section in `skills/loop-implementation/reference/return-file.md`, below the return-file recipe, holding:

- The derivation: `GIT_DIR=$(git -C "$CHECKOUT" rev-parse --path-format=absolute --git-dir)`, `SCRATCH="$GIT_DIR/gauntlet/tmp"`, `mkdir -p "$SCRATCH"` before every mint. A non-zero exit of `mkdir` or of a mint stops the stage with the error; a failed git-dir lookup stops it too, except in the plain-jj case below.
- The mint forms: `mktemp "$SCRATCH/<role>.XXXXXX"` for a file, `mktemp -d "$SCRATCH/<role>.XXXXXX"` for a folder.
- `CHECKOUT`, named at every mint site ("Stage files"): the home worktree for flow-level files; the worker's or leg's own checkout for a worker log, the jobs file, and that leg's gate logs; the checkout the skill was invoked in when a stage skill runs outside a flow (the spec council standalone); the home primary on the finish paths where the home worktree is absent, as `skills/finishing-a-development-branch/reference/verification-set.md:30` already does for the ledger.
- The plain-jj fallback: only when the git-dir lookup exits non-zero and `jj -R "$CHECKOUT" root` exits zero (the discriminator at `skills/finishing-a-development-branch/SKILL.md:238`). The stage invocation mints one `SCRATCH=$(mktemp -d "${TMPDIR:-/tmp}/gauntlet.XXXXXX")`, keeps that absolute path across its turns, mints no second fallback folder, and removes that exact path at its handled terminal exit. Every other lookup failure (missing directory, not a repository, `jj` absent or failing) stops the stage with the git error. The jobs file takes no fallback: worker and driver stop with the git error.
- The delete rule: a stage deletes only a path it minted, by that exact path; never a wildcard, a loop over a prefix, or `find` over `gauntlet/tmp` or the OS temp dir.

The existing `gauntlet/returns/` recipe in that file is unchanged.

### Stage files

Remove: every bare `mktemp` and every `${TMPDIR:-/tmp}` mint or read in the lines below. Add: the listed replacement at the same line. A fenced shell block stays self-contained: it derives the scratch folder inline from its own checkout variable and creates it before the mint. Prose mints cite the recipe by relative link instead of restating it. Every edited file stays under 50,000 bytes.

| File | Today | Becomes |
|---|---|---|
| `skills/brainstorming/gatherer.md:12` | `GATHER_DIR=$(mktemp -d)` | `mktemp -d "$SCRATCH/gather.XXXXXX"`, `CHECKOUT` the home worktree; the `rm -rf "$GATHER_DIR"` at `:261` stays |
| `skills/brainstorming/reference/spec-finalization.md:108` | `mktemp "${TMPDIR:-/tmp}/gauntlet-spec-summary.XXXXXX"` | `mktemp "$SCRATCH/spec-summary.XXXXXX"`, `CHECKOUT` the home worktree; the `rm "$SUMMARY_PATH"` stays. `:144` keeps "the `Read` must be last" and states the reason without `/tmp`: pi-condense does not protect a scratch-folder read. `:148` says the file lives in the scratch folder, outside the working tree |
| `skills/roasting-the-spec/SKILL.md:55` | `mktemp -d` | `mktemp -d "$SCRATCH/council.XXXXXX"`, `CHECKOUT` the worktree that holds the spec under review (`<wt>`), which is the invocation checkout when the council runs standalone; the exact-path removal at `:164-166` stays |
| `skills/subagent-driven-development/SKILL.md:119` | test-gate logs to `gate-<i>.log`, no directory named | `<REPORT_DIR>/wave<w>-gate-<i>.log`; `REPORT_DIR` exists from step 2 of the wave and sits under the home worktree's scratch folder (`:246`) |
| `skills/subagent-driven-development/SKILL.md:55` | `FD_INDEX=$(mktemp)` | a file `fix-delta-index.XXXXXX` under the scratch folder of `FD_ROOT`; the `rm -f "$FD_INDEX"` stays |
| `skills/subagent-driven-development/SKILL.md:136` | `RP_DIR=$(mktemp -d)` | a folder `repair.XXXXXX` under the scratch folder of `RP_ROOT` |
| `skills/subagent-driven-development/SKILL.md:246` | `REPORT_DIR` with `mktemp -d` | `mktemp -d "$SCRATCH/reports.XXXXXX"`, `CHECKOUT` the home worktree |
| `skills/subagent-driven-development/reference/happy-path-run.md:16` | `HP_DIR=$(mktemp -d)` | a folder `happy-path.XXXXXX` under the scratch folder of `HP_WORKTREE` |
| `skills/loop-implementation/SKILL.md:85` | output path from `mktemp` outside the repository | `mktemp "$SCRATCH/loop-out.XXXXXX"`, `CHECKOUT` the home worktree |
| `skills/loop-implementation/SKILL.md:172` | `LOG_DIR=$(mktemp -d)` | `mktemp -d "$SCRATCH/gates.XXXXXX"`, `CHECKOUT` the home worktree |
| `skills/loop-implementation/SKILL.md:176`, `reference/interrupted-recovery.md:5` | `${TMPDIR:-/tmp}/loop-<base SHA>-<iteration>.jobs` | `<dir>/loop-<base SHA>-<iteration>.jobs` with `<dir>` = `$(git -C "<dispatched checkout>" rev-parse --path-format=absolute --git-dir)/gauntlet/tmp`. The dispatched checkout per caller: the home worktree for a home row or seed return and the companion leg's checkout for a companion return (`reference/interrupted-recovery.md:5`); the failing leg's checkout for a verification repair (`SKILL.md:176`). A caller that passed `scratch:` to the worker reads the jobs file in that directory instead |
| `agents/loop-implementer.md:69` | log under `${TMPDIR:-/tmp}`; jobs file `${TMPDIR:-/tmp}/loop-<base SHA>-<iteration>.jobs` | Before the controller opens a log or appends a jobs line, the worker resolves one directory - the task's `scratch: <absolute path>` when supplied, else `$(git rev-parse --path-format=absolute --git-dir)/gauntlet/tmp` in its checkout - and runs `mkdir -p` on it; either failure stops the worker, with no OS-temp fallback. Controller files and captured logs go under that directory; the jobs file is `loop-<base SHA>-<iteration>.jobs` in it. The additive-inputs line at `:28` names `scratch:`. The persona states the path itself and cites no skill file |
| `skills/verification-before-completion/reference/conformance-check.md:163` | `LOG_DIR` from the leg's own `mktemp -d` | `mktemp -d "$SCRATCH/gates.XXXXXX"` with `CHECKOUT` that leg's isolated worktree |
| `skills/finishing-a-development-branch/reference/verification-set.md:16` | `LOG_DIR=$(mktemp -d)` | `mktemp -d "$SCRATCH/gates.XXXXXX"`, `CHECKOUT` the home worktree, or the home primary when the home worktree is absent (the fresh-session retry at `:30`); post-squash runs (`:34`) keep writing to that `LOG_DIR` |
| `skills/finishing-a-development-branch/SKILL.md:265` | scratch body file with `mktemp` outside the repo | `mktemp "$SCRATCH/pr-body.XXXXXX"`, `CHECKOUT` `$WORKTREE`, the home worktree that step pushes from |

Finish Step 6, the gate's worktree cleanup and housekeeping gain no delete step: removing the worktree removes its `SCRATCH` (claim 22). A stage that deletes its own minted path today keeps that delete.

### Gate run folder

Add, at the record-mint site in `skills/gatekeep-pr/reference/post-selection-loop.md:7` (`### Continuation record`), after argument admission and before the continuation record and `plan_tracker init`; `skills/gatekeep-pr/SKILL.md:38` is edited with it to say the run folder is minted first, and cites that section instead of restating the command:

```bash
COMMON_GIT=$(git -C "<session checkout>" rev-parse --path-format=absolute --git-common-dir) && mkdir -p "$COMMON_GIT/gauntlet/tmp" && RUN_DIR=$(mktemp -d "$COMMON_GIT/gauntlet/tmp/gate.XXXXXX")
```

A run mints once per invocation, then creates its record at `<RUN_DIR>/state`. A run that was supplied a record path (a multi-PR child) mints nothing: its run folder is the directory of that record. `reference/assessment.md` mints no run folder; the verify and review outputs at `:101` are minted in the existing `RUN_DIR`. A non-zero exit stops the run with the error before any record or tracker exists; the gate never falls back to OS temp. Every file the run creates lives inside `RUN_DIR`:

| File | Path |
|---|---|
| Continuation record | `<RUN_DIR>/state` |
| Finding spec and ledger | `<RUN_DIR>/state-spec.md`, `<RUN_DIR>/state-ledger.md` (the existing `<record path>-spec.md` / `-ledger.md` rule, unchanged) |
| Every helper output (verify, review, row, any other role) | `mktemp "<RUN_DIR>/<role>.XXXXXX"` |
| A helper's captured log (`log_path`) | a file in the directory of that helper's own output path |
| Description body file for `gh pr edit --body-file` (`reference/post-selection-loop.md:110`, no location named today) | `mktemp "<RUN_DIR>/description.XXXXXX"` |
| Merge-message body `LANDED_BODY` (`reference/post-selection-loop.md:190`, an OS-temp file today) | `mktemp "<RUN_DIR>/landed-body.XXXXXX"` |
| Drafted reply and coverage bodies | files in `RUN_DIR` |
| A fix worker's controller files, captured logs and jobs file | files in `RUN_DIR`, through the row task's `scratch:` line (below) |

Remove: the `${TMPDIR:-/tmp}` mints and location statements at `skills/gatekeep-pr/SKILL.md:42`, `verification-brief.md:10,227,246`, `reference/assessment.md:101`, `reference/fix-wave.md:85`, `reference/batch.md:29`, `reference/post-selection-loop.md:7`; the "OS-temp file" wording at `reference/post-selection-loop.md:190`; and "beside the OS-temp continuation record" at `reference/fix-wave.md:34`, which becomes "beside the continuation record in the run folder".

The `state: <absolute-path>` locator in the tracker task name and continuation summaries is unchanged, and the record gains no field: on re-entry the run folder is the directory of the validated `state:` locator. No session derives, lists or scans `gauntlet/tmp` to find a record.

Record outside a run folder. A validated record whose directory is neither a `gate.` folder directly under `<common git dir>/gauntlet/tmp` nor a `pr-<N>` folder inside one was written by an earlier package version. Its content and locator validation are unchanged, and its location alone never exits `stuck - run record unreadable`. Its later helper outputs, logs and `scratch:` directory are the record's own directory, where that session wrote them before the upgrade. Its Teardown does not run the teardown block: it moves and deletes nothing, writes a kept draft that has no file yet to a `gate-kept.` file, names every kept draft at its existing path, and names the record path as left in place.

Multi-PR run (`reference/batch.md`): the parent mints one `RUN_DIR` by citing the same `### Continuation record` command, writes the roster at `<RUN_DIR>/roster`, and for each PR runs `mkdir "<RUN_DIR>/pr-<N>"` before it creates that PR's record at `<RUN_DIR>/pr-<N>/state` and names its report path `<RUN_DIR>/pr-<N>/report`. A child's run folder is `<RUN_DIR>/pr-<N>`, taken from its supplied record path; its helper outputs and logs are minted there, and it never creates a `gate.` folder.

Gate fix worker. Add one line, `scratch: <absolute run folder>`, to the row task in `reference/fix-wave.md` `## Wave`, beside `return:`. `agents/loop-implementer.md` writes its controller files, captured logs and jobs file in the supplied `scratch:` directory ("Stage files"), so they leave with the run folder even when the gate keeps the PR worktree. Return files under `gauntlet/returns/` are unchanged. With this routing no gate instruction needs to delete a path outside its run folder.

### Gate teardown

Remove: the sentence at `reference/post-selection-loop.md:261` that saves kept bodies under `${TMPDIR:-/tmp}` and reuses existing body files; the delete-by-list sentence at `:269`; the per-PR delete wording at `reference/batch.md:95`.

Add, in `### Teardown`, one marked shell block (`<!-- gate-teardown-shell -->`, the marker convention of `skills/loop-implementation/reference/return-file.md`). The orchestrator runs it on every handled exit with its inputs substituted and composes no move or delete command of its own.

| Input | Value |
|---|---|
| `PRIMARY` | the primary checkout, which survives cleanup; never the PR worktree, which cleanup step 1 may already have removed (`reference/cleanup.md:5`) |
| `RUN_DIR` | the absolute run folder: the directory of the validated `state:` locator |
| `KEEP` | zero or more absolute paths of body files in the run folder, one per unrun or failed drafted reply and coverage post; a kept draft with no file yet is first written to a file in the run folder |

The block does this, in order, and exits non-zero at the first failure with the path and the failed condition on stderr:

1. **Expected root.** `ROOT="$(git -C "$PRIMARY" rev-parse --path-format=absolute --git-common-dir)/gauntlet/tmp"`, derived from `PRIMARY` alone and never from `RUN_DIR`.
2. **Ownership checks.** `RUN_DIR` is a directory and not a symlink, and one of: its parent is exactly `ROOT` and its basename starts with `gate.`; or its basename is `pr-<digits>`, its parent's basename starts with `gate.`, and that parent's parent is exactly `ROOT`. A `gate.` folder that still contains a `pr-<N>` directory fails. Every `KEEP` path is a file directly inside `RUN_DIR`. A failed check moves and deletes nothing.
3. **Keep drafts.** For each `KEEP` path: `mktemp "${TMPDIR:-/tmp}/gate-kept.XXXXXX"`, move the body file there, print `kept <path>`. A failed mint or move stops before the delete; the run folder stays.
4. **Delete the run folder.** `rm -rf -- "$RUN_DIR"`.

The block runs on `final`, `merge-queued` and `post` stops too, before any kept path is printed. The closing not-run sentences name the printed `gate-kept.` paths. On a non-zero exit the closing message reports the PR outcome, then names the run folder and the block's error.

Every other draft, the record, the finding spec and ledger, helper outputs, logs and description files leave with the folder. No gate instruction deletes a path outside its own run folder, deletes anything under `${TMPDIR:-/tmp}` (kept drafts of this or any earlier run and gate files written by an earlier package version included), or deletes by wildcard, by a loop over a name prefix, or by `find`. No gate step deletes a worktree's `gauntlet/tmp`.

Multi-PR run. At per-PR retirement the parent runs the block with `RUN_DIR` = `<RUN_DIR>/pr-<N>` and that PR's `KEEP` paths, then stores the result in that PR's roster entry: `teardown: removed`, or `teardown: kept <path> - <error>` when the block exited non-zero. Retirement proceeds either way. After every PR has retired, the parent runs the block on its own `RUN_DIR` with no `KEEP` only when every roster entry says `teardown: removed`; otherwise it deletes nothing and its closing message names each kept `pr-<N>` path with its error. The block's `pr-<N>` check refuses the parent folder independently of the roster.

A record outside a run folder never reaches the block ("Gate run folder").

`reference/cleanup.md:41` keeps delegating to Teardown; `reference/assessment.md:101` and `SKILL.md:42` say outputs are removed with the run folder.

### Lint

Add, in `scripts/stage-skill-lint.mjs`: a rule `temp-path` as its own exported function with its own exported scope - the six `STAGE_SKILL_DIRS` plus `skills/gatekeep-pr`, `skills/roasting-the-spec`, `skills/verification-before-completion`, and the file `agents/loop-implementer.md`. `STAGE_SKILL_DIRS`, the three existing rules and `lintStageSkill` are unchanged: `scripts/ci.mjs:450` also calls `lintStageSkill` on the handoff skill, so the new rule stays out of that function and handoff stays out of its scope.

The rule checks each `mktemp` and each `TMPDIR` occurrence, in prose or in a fenced block, not the line that holds it: a gate reference paragraph is one long line that can hold several mints (`reference/post-selection-loop.md:7`). A `mktemp` occurrence is a finding unless its own path argument names an allowed root:

| File | Allowed root in the `mktemp` argument |
|---|---|
| under `skills/gatekeep-pr` | `RUN_DIR`, or the one run-folder mint `gauntlet/tmp/gate.XXXXXX` |
| every other scoped file | `SCRATCH`, or a path containing `gauntlet/tmp` |

A `mktemp` with no path argument is a finding, and so is `SCRATCH` as the root of a gate mint. A `TMPDIR` occurrence is a finding except in the two literals allowed by file: `gauntlet.XXXXXX` in `skills/loop-implementation/reference/return-file.md` and `gate-kept.XXXXXX` in `skills/gatekeep-pr/reference/post-selection-loop.md`. `scripts/ci.mjs` runs the rule over the real scoped files where it runs the existing stage lint. Add fixtures in `scripts/stage-skill-lint.test.mjs`: a finding; one line holding a rooted and an unrooted mint; `SCRATCH` in a gate file; each allowed root; both allowed literals.

Add: updated wording pins in `scripts/loop-engine-contract.test.mjs`, `scripts/finish-verification.test.mjs`, `scripts/gatekeep-comment-reconcile.test.mjs`, `scripts/loop-implementer-process.test.mjs`; any assertion on the temp location in the four block-execution tests named under Implicit dependencies. In addition:

- `scripts/happy-path-run.test.mjs:32` adds `mkdir` to its restricted `PATH` list (`git`, `mktemp`, `tail` today); the inline `mkdir -p` fails without it.
- `scripts/wave-review.test.mjs:174-187` replaces the assertion that its `TMPDIR` scratch stays empty, which no longer observes the relocated index, with assertions that `<checkout-local git dir>/gauntlet/tmp` of the checkout exists after the block and holds no `fix-delta-index.` file.
- Destination pins for the prose sites the rule cannot see: `reference/post-selection-loop.md:110,190` and `reference/fix-wave.md:34` in `scripts/gatekeep-comment-reconcile.test.mjs`; `skills/subagent-driven-development/SKILL.md:119` in `scripts/wave-review.test.mjs`.
- A pin in `scripts/gatekeep-comment-reconcile.test.mjs` that the run-folder mint appears once across `skills/gatekeep-pr`, beside the sentence that exempts a run with a supplied record, and that `reference/assessment.md` holds no `mktemp -d`.
- A new `scripts/gate-teardown.test.mjs`, listed in `scripts/ci.mjs` with the other block-execution tests, that extracts the marked teardown block and executes it in a scratch repository with a linked worktree ("Tests").

### Eval scope

By the user's instruction (question 1), model evals for this change are one new sample. The stage-file edits and the gate mint edits relocate a path and are covered by the `temp-path` lint and the destination pins; they get no sample, and the commit body says so. The sample runs without tools (`eval/gatekeep-pr/replay.md`, `eval/lib/replay.mjs:59-60`), so it shows that the instructions lead to the right commands; it is not evidence that files were removed or kept. Filesystem acceptance is `scripts/gate-teardown.test.mjs`, which makes no model call.

Existing samples keep their fixture paths and are not edited or rerun. Their bare OS-temp locators read as records outside a run folder (claim 32): re-entry facts hold, while facts that expect the record, helper outputs or logs to be retired at Teardown no longer match - the `rg` of claim 32 finds `course-stop-cleanup` f4, `batch-cleanup-stop` c3 and `stop-draft-files` `retained`. `eval/gatekeep-pr/intent.md` names those samples as stale against this change beside the new sample's entry; whoever next runs one of them moves its fixture into a run folder first.

Add: `eval/gatekeep-pr/samples/teardown-own-run-folder` (`case.md`, `expected.md`), the matching entry in `eval/gatekeep-pr/intent.md`, and its result in `eval/gatekeep-pr/report.md`. The case starts at Teardown with supplied state: this run's folder with a record, finding spec and ledger, verify and review outputs with logs, a description file, one failed reply draft and one unrun coverage draft; a second run's `gate.` folder beside it; and, in the OS temp folder, an earlier run's two `gate-kept.` files plus several `gatekeep-state.` and `gatekeep-verify.` files from an earlier package version. It stops at the closing message. Must-hold facts:

- The only recursive delete is the Teardown block, run with this run's folder as `RUN_DIR` by its literal absolute path and the primary as `PRIMARY`.
- No command contains a wildcard, a loop over a prefix, or `find` over `gauntlet/tmp` or the OS temp folder.
- The second run's folder appears in no delete command.
- Both drafts are passed as `KEEP` paths, so they move to `gate-kept.` files before the delete, and the closing message names those two paths.
- No command deletes a path in the OS temp folder.

**Paid action.** `node eval/run.mjs gatekeep-pr teardown-own-run-folder`, and `node eval/run.mjs gatekeep-pr teardown-own-run-folder --baseline-only` to seed that sample's baseline, run by the implementer from the worktree; inputs are that one sample directory, and each run makes `pi` model calls. Approving this spec authorizes these runs for the whole flow - seed, rows, repairs and finish, reruns of this sample included - without per-step permission prompts. No other sample or target runs.

## Errors and edge cases

- Folder create or mint fails: the stage or the gate stops with the error; no fallback to OS temp outside the recipe's plain-jj case.
- Plain jj workspace (`jj -R "$CHECKOUT" root` succeeds): the recipe's one fallback folder, kept for the stage invocation and removed by exact path at its handled terminal exit. Any other git-dir lookup failure stops the stage.
- Run-folder mint fails: the run stops with the error before any record or tracker exists, so there is nothing to tear down. This is the only exit without a record; initial stop and assess-terminal exits have one and take the ordinary Teardown.
- Teardown ownership check fails (run folder not under the expected root derived from the primary, wrong basename, a symlink, a `KEEP` path outside the folder): the block moves and deletes nothing; the closing message names the path and the failed condition.
- Kept-draft move fails: the run folder stays; the run reports its PR outcome and names the folder and the error. The delete does not run.
- Run-folder delete fails: reported with the path and the error; no retry and no wider delete.
- A multi-PR child's teardown fails: its `pr-<N>` folder stays, the roster records `teardown: kept <path> - <error>`, the parent keeps its own folder, and the parent's closing message names the kept path and the error.
- Unhandled exit (killed session): the run folder stays under the common git dir. Removing it is a manual `rm -rf` of that one folder, described in `doc/configuration.md`.
- Two gate runs on one PR: each has its own `gate.` folder; neither names the other's path.
- PR checked out in the primary: the primary's checkout-local git dir is the common git dir, so its `gauntlet/tmp` holds run folders and that checkout's stage files side by side; Teardown still deletes only its own `gate.` folder. In a linked worktree the two are different directories.
- Gate keeps the worktree (stop, dirty tree, unmerged commits, reused and not landed): that worktree's stage files stay with it; the gate worker's logs and jobs file are in the run folder and leave with it.
- A stage that runs in the primary checkout: files it does not delete itself stay under the common git dir's `gauntlet/tmp`.
- Repair-base worktree inside a scratch folder: when the owning worktree is removed, the nested tree's admin entry stays until the next `git worktree prune`, as it does today when its OS-temp folder disappears.
- A session started on an earlier package version (a record outside a run folder): its record is validated as today and keeps writing beside itself; its OS-temp gate files are never deleted, by its own Teardown or by any other run on this version.

## Tests

Filesystem acceptance comes from `scripts/gate-teardown.test.mjs`, which executes the marked teardown block in a scratch repository with a linked worktree. The one model sample is command narration: it shows the instructions lead to that block, not that files were removed or kept.

- First run exits, second run's folder untouched and its record still readable (AC 1) - `scripts/gate-teardown.test.mjs`: two sibling `gate.` folders; after the block runs on the first, every file of the second is unchanged and its `state` record is read back at its locator with the content written. Eval `gatekeep-pr/teardown-own-run-folder`: the second folder appears in no command
- Record, finding spec, ledger, helper outputs, logs and description files gone after exit, kept drafts remain (AC 2) - `scripts/gate-teardown.test.mjs`: the run folder is absent after the block and each `KEEP` draft sits at its printed `gate-kept.` path with its content. Every gate mint rooted in the run folder - the `temp-path` rule that `scripts/ci.mjs` runs over the real scoped files, and the destination pins in `scripts/gatekeep-comment-reconcile.test.mjs`
- Kept drafts untouched by another run's exit (AC 3) - `scripts/gate-teardown.test.mjs`: `gate-kept.` files that exist before a different run's block are present with their content after it. Eval `gatekeep-pr/teardown-own-run-folder`: the closing message names the kept paths and no command touches the OS temp folder
- A failed ownership check moves and deletes nothing - `scripts/gate-teardown.test.mjs`: a folder outside the expected root, a wrong basename, a symlinked folder, a `KEEP` path outside the folder
- A failed draft move keeps the run folder - `scripts/gate-teardown.test.mjs`: a `TMPDIR` that does not exist
- The expected root comes from the surviving primary - `scripts/gate-teardown.test.mjs`: the block succeeds with `PRIMARY` after the linked PR worktree is removed
- Multi-PR: the block on `<RUN_DIR>/pr-<N>` removes only that child folder; the parent folder is refused while a `pr-<N>` folder remains and removed once none does - `scripts/gate-teardown.test.mjs`
- A multi-PR child never mints a `gate.` folder - the run-folder-mint pin in `scripts/gatekeep-comment-reconcile.test.mjs`
- A `mktemp` occurrence without its allowed root, or a `TMPDIR` occurrence outside the two allowed literals, in a scoped file fails CI; a gate mint rooted in `SCRATCH` fails - `scripts/stage-skill-lint.test.mjs`
- Wave test-gate logs and the fix-delta index land under the scratch folder - `scripts/wave-review.test.mjs`
- Existing `cd` and `--show-toplevel` rules keep their six-directory scope - `scripts/stage-skill-lint.test.mjs`
- Worker and driver name the same jobs-file path - `scripts/loop-engine-contract.test.mjs`, `scripts/loop-implementer-process.test.mjs`
- Verify and finish logs under the scratch folder - `scripts/finish-verification.test.mjs`
- Finding spec and ledger beside the record inside the run folder - `scripts/gatekeep-comment-reconcile.test.mjs`
- Marked shell blocks still run with the inline scratch derivation - `scripts/wave-review.test.mjs`, `scripts/happy-path-run.test.mjs`, `scripts/loop-return-hygiene.test.mjs`, `scripts/loop-outside-return.test.mjs`
- Every edited instruction file under 50,000 bytes - instruction-size lint in `scripts/ci.mjs`
- Worktree removal deletes the stage folder; nothing under a git dir can be staged - none: git's own behavior, observed in a scratch repo (claims 22, 28)
- Plain-jj fallback, failed run-folder delete, failed run-folder mint - none: instruction text with no jj workspace or failing filesystem in CI, and kept out of the eval to hold it at one sample
- Record outside a run folder keeps today's validation and is never deleted - none: instruction text; the existing samples that would exercise it are not rerun ("Eval scope")
- Roster `teardown:` value and the parent's closing sentences - none: orchestrator prose; the block's refusal of a parent folder with a remaining `pr-<N>` is the tested boundary, and a second sample is outside the user's narrow-eval instruction
- Unhandled exit leaves the run folder - none: no handled step runs

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` (operations: where stage and gate scratch files live, their lifetime, and removing a run folder a killed session left); `CHANGELOG.md` (`## Unreleased` entry)
- Derived / memory docs invalidated: `doc/implement-engines.md` (verify log folder at `:58`, worker log and jobs-file path at `:110`); `doc/configuration.md` (jobs-file path at `:156`); `AGENTS.md` (Testing: the stage-skill lint description gains the temp-path rule and its scope)

Materiality bar: `reference/documentation-impact.md`.

## Out of scope

- Temp use of skills that are not gauntlet stages: the hotfix path (`$TMPDIR/hotfix-<slug>*`), `gauntlet-resume`, `dispatching-parallel-agents`, `shape-ticket`, `housekeeping`, `check-delivery`, `gauntlet-handoff`.
- Return files under `gauntlet/returns/` and recorder state under the common git dir.
- Automatic reclaim of run folders left by unhandled exits, and any cleanup or migration of gate files an earlier package version left in OS temp.
- Any deletion of a worktree's stage folder by the gate.
- A discovery path for records: no session finds a run by deriving or scanning a folder name.
- Model eval samples for the path relocations, and a second sample for multi-PR retirement.
- Editing or rerunning the existing gatekeep-pr samples whose OS-temp fixtures no longer match Teardown ("Eval scope").
- A bin or extension that owns minting or cleanup.

## Open questions

- The incident counts in the ticket are not reproducible from the repository; the design does not depend on them.
- No live gate run against real PR state was made during design; the one eval sample and the block-execution test are the evidence.
- Claude Code writes under `.git/gauntlet/tmp` (council hypothesis, not confirmed). Probe: `rg --max-count 3 -n -i "claude-code|permission-mode|permissionMode|sensitive" scripts doc .claude-plugin package.json AGENTS.md -g '!*.md'` found only the pinned dev dependency `@anthropic-ai/claude-code` 2.1.319 (`package.json:71`); `rg -n "claude" scripts/ci.mjs` found the smoke harness `scripts/claude-plugin-smoke.test.mjs` (`ci.mjs:758`), which AGENTS.md describes as loading and cached-upgrade checks with no model calls, so it performs no Write-tool or Bash write. Outcome: inconclusive - a council member found a protected-directory list containing `.git` in the pinned build, but whether a record or helper-output write under `<common git dir>/gauntlet/tmp` prompts or is refused in the supported permission mode is unverified. Obtain: run the pinned Claude Code build in an isolated home, as the smoke harness sets one up, and attempt one Write-tool write and one Bash write to a file under `.git/gauntlet/tmp/`; that check makes Claude Code model calls, which "Paid action" does not cover. Settles: the run-folder location in "Gate run folder", every gate mint under it, and the record writes on the Claude Code surface (claims 14, 16). Settlement: the user supplies the fact at the gate, or the first plan task that makes those two writes settles it through brainstorming's amendment path before any gate file is edited. The location the user approved (question 3) is not changed without that decision.
