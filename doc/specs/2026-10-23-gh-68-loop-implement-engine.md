# Loop implement engine: planless iteration over the acceptance-criteria ledger

**Goal:** Add an experimental second implement engine, selected at the brainstorming approval gate, that skips the plan and runs one fresh, context-guarded `loop-implementer` dispatch per iteration over a ledger seeded from the spec's acceptance criteria, stopping at a plain-words human gate on stagnation.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Ticket:** jjuraszek/pi-gauntlet#68

## Problem

The task engine (`/skill:subagent-driven-development`) needs a plan: a human-approved task list, a `plan_check` stamp, per-task and per-wave reviews. For a spec whose acceptance criteria already enumerate the work, the plan restates the AC rows and the reviews duplicate what the verify phase runs anyway. Ticket #68 asks for an engine that iterates a fresh implementer over the AC rows directly, with the verify phase's whole-diff code review and conformance review as the only review.

The request on top of the ticket: a separately configurable loop model, the spec always read by every iteration, no iteration reasoning carried forward (effects only), an iteration cap, every iteration a `subagent` with a guarded context, and a loop persona.

Framing: pivoted to persona-only model pinning. pi-cohort reads `subagents.agentOverrides.<persona>.model` from the repo's `.pi/settings.json` (`pi-cohort/src/agents/agents.ts:490-503`) and fills only frontmatter-unset fields (`agents.ts:618`), so a model-free `loop-implementer` persona is pinnable per repo with no new `piGauntlet` key; `piGauntlet.loopEngine.maxIterations` is the only new key. A `piGauntlet.loopEngine.model` key would be a second read path beside the one that already owns per-persona models (`doc/configuration.md#dispatch-model-precedence`).

Corrected premises carried from the questionary and the council:

- AC4's "existing implementer model (independent of any parent phase model)": `implementer` ships model-free (`agents/implementer.md:1-11`), so it inherits the main loop, which `phaseModels.implement` switches. Independence holds only through an `agentOverrides` pin; the same holds for `loop-implementer`. Design reads the row that way.
- `implementer` has `defaultContext: fork` (`agents/implementer.md:5`); reusing it would leak the orchestrator's context into every iteration. The loop persona is `defaultContext: fresh`.
- Reasoning bloat: a fresh child never sees earlier iterations. The per-iteration input that grows is the ledger - its `## Decisions` lines and `evidence` cells - so both are bounded (Ledger). The child receives the base SHA, not the diff text, and reads only the hunks of its row's files.
- "The project's verification command" has no settings key. Resolution order, run once by the driver before iteration 0 and printed as `verification command: <command> (<source>)`: the overrides file's `## PR gate` `- verification command:` key (`README.md:384`); else the overrides file's `## verification-before-completion` section when it names exactly one backticked command (`README.md:361-364` is prose naming `make ci`); else test-entrypoint discovery (`README.md:307`). A `## verification-before-completion` section that names zero or several commands stops before iteration 0 as a configuration error; the driver never guesses. This repo's `.pi/gauntlet-overrides.md` has neither section (`## Issue tracker`, `## Release`, `## cleanup`), so `npm test` here comes from discovery.
- "Escalation gate" in the ticket is the SDD stop note (`skills/subagent-driven-development/stop-note.md`), the pause where the human decides; it is not the `escalationLoop.implModel` round.
- The ledger is a plan: the `plan_check` tool handler resolves the spec from the plan's path-only `**Spec:**` header before `checkPlan` runs and fails without it (`extensions/phase-tracker.ts:961-970`), so the ledger carries that header; `checkPlan(planText, specText, fs)` (`extensions/lib/plan-check.ts:1137`) receives the spec text pre-resolved and branches on ledger line 1. The stamp hash is compared only inside the implement-start guard (`phase-tracker.ts:1069-1085`), so children edit the ledger freely once implement starts.
- pi-cohort acceptance: a dispatch without `acceptance` infers `checked` for a write task and `reviewed` for risky wording such as a `security` path (`pi-cohort/skills/pi-cohort/SKILL.md:42`); a one-line reply then fails with "Structured acceptance report not found". The loop dispatch sets `acceptance: { level: "none", reason: "the parent validates the ledger and the commit" }` (`pi-cohort/src/runs/shared/acceptance.ts:157` requires the reason), so the child's reply is the decision line and no review is inferred.
- pi-cohort's completion guard flips a no-edit implementation run to exit 1 (`pi-cohort/src/runs/foreground/attempt-finalization.ts:249-260`); every loop iteration edits the ledger, so the guard stays on and a no-edit child surfaces as a dispatch error.

Implicit dependencies traced: approval menu (`spec-finalization.md:119-151`), `brainstorming/SKILL.md:56` transition, implement-start guard and Guard 4 (`phase-tracker.ts:725-750,1060-1090`; plans dir exempt from Guard 4), `checkPlan` and its placeholder scan (`plan-check.ts:1137-1170`, walks parsed tasks), settings resolver (`extensions/lib/gauntlet-settings.ts`), telemetry event union and `derive` (`extensions/lib/telemetry-record.ts:25,113-125`), the recorder's phase mirror (`extensions/telemetry.ts:423-440`, skip events carry no reason), SDD "After All Tasks Complete" (`subagent-driven-development/SKILL.md:327-336`), finish's hard verification gate and strip step (`finishing-a-development-branch/SKILL.md:37,224-240`), resume candidates and routes (`gauntlet-resume/reference/reconstruction.md:28-50,96-115`; `brief-contract.md:123-149`), amendment aftermath (`brainstorming/reference/amendment-surface.md:140-145`, keyed on "Plan exists"), funded rounds (`subagent-driven-development/reference/fix-loop.md:5-23`), stage-skill lint (`scripts/stage-skill-lint.mjs:8-14`), conformance inputs (`conformance-check.md:21-36`), pi-cohort `outputMode: file-only` (`pi-cohort/skills/pi-cohort/SKILL.md:61`).

## Acceptance criteria

Ticket #68, `Acceptance criteria`, rows verbatim:

- [ ] The brainstorming approval gate renders five numbered options; options 4 and 5 carry the same `; fund N fix rounds` suffix handling and the same amendment semantics as options 1 and 2 (4 stops for every amendment that option 1 stops for, 5 auto-applies amends and still stops on a redraw). Replying 4 or 5 records `engine: loop` in the spec (field placement chosen by the implementer and documented in `doc/configuration.md`) and in the telemetry record's `engine` field; replying 1 or 2 records `engine: waves`.
  in-scope
- [ ] Replying 4 or 5 skips the plan phase: no plan file is written, `phase_tracker` records plan as skipped with a reason naming the engine, and the flow guards admit implement after that skip without a human override.
  in-scope
- [ ] Iteration 0 is one fresh implementer dispatch that seeds the ledger. After it returns, the ledger file (location chosen by the implementer and documented in `doc/configuration.md`) exists in the worktree with one row per spec AC carrying `row`, `status`, `evidence`, and `attempts`; every row names its evidence - a failing test the implementer wrote, a named check (a command or a file assertion) for a row it cannot automate, or baseline evidence for a row the codebase already satisfies, which closes at iteration 0; rows with a failing test are `open` and the project's verification command fails.
  in-scope
- [ ] Each iteration after iteration 0 is one fresh implementer dispatch on the existing implementer model (independent of any parent phase model), given the spec, the ledger, the cumulative diff since the base commit, and the previous iteration's one-line decision note. After it returns, exactly one commit was added, at most one ledger row changed status, that row carries its evidence, its attempt counter advanced, and one decision line was appended; a decision line alone never counts as progress.
  in-scope
- [ ] When every row is `done` and the project's verification command passes, implement completes and verify starts; the telemetry record shows zero spec-reviewer and zero code-reviewer dispatches inside the implement phase, and the verify phase's whole-diff code review and conformance review run as they do under `waves` (that conformance review backstops any row a worker flipped wrongly, and its fix rounds are unchanged). Every row `done` with the verification command failing routes to the escalation gate.
  in-scope
- [ ] Stagnation routes to the existing escalation gate - the pause where the human decides to retry, cut the row, or stop. Fixtures: a spec whose single AC row cannot be satisfied stops at the gate after 3 attempts on that row (iteration 0 not counted); an implementer that twice in a row commits nothing outside the ledger and decision files stops at the gate. `piGauntlet.loopEngine.maxIterations` bounds the total iterations of any run, with its default stated in `doc/configuration.md`.
  in-scope
- [ ] The telemetry record carries `engine` and `iterations`, and `gauntlet-performance` prints both per run; runs recorded before this change print `engine: waves` and an empty `iterations`.
  in-scope
- [ ] `doc/configuration.md` documents the engine options, the ledger location, and the `piGauntlet.loopEngine.*` keys; `README.md#configuring-the-gates` links the section; an `eval/brainstorming` sample renders the five-option gate and a `4` reply, and `node eval/run.mjs brainstorming` passes with the committed `report.md`.
  in-scope

Reporter note (comment 1), carried as requirements: option 5 has option 2's auto-apply-amends semantics under the loop engine; no spec or code reviewer runs inside the loop; the verify phase's reviews are the review.

AC readings (Design clauses, row text unchanged):

- AC1 "the same `; fund N fix rounds` suffix handling": parsing and persistence are identical to options 1/2. What a funded loop approval buys is defined under Stagnation and funding: N extra attempts on a stagnant row before the stop note, consumed one per dispatch on that row, never an escalated-model round. A loop approval never carries an inert suffix.
- AC2 "no plan file is written": no task plan is written; the ledger is the engine's stamped artifact and lives in the plan dir.
- AC3 "one row per spec AC": every row of the spec's `## Acceptance criteria` is seeded. A row whose disposition is `in-scope` - explicit or absent (`ticket-acceptance.md:20`: default `in-scope`) - or `venue:` starts `open`; a `venue:` row's evidence is the named check at the venue or the Design enabling change. Only `deviates:`, `deferred:`, and `elsewhere:` start `cut`, with the disposition text as evidence. "Iteration 0 seeds the ledger" reads as seeding evidence: the parent writes the row skeleton before `plan_check`; iteration 0 fills evidence and closes baseline rows under its own validation contract (Driver, iteration 0).
- AC4 "existing implementer model": the model resolved the way `implementer`'s is - `subagents.agentOverrides.loop-implementer.model`, else the main loop; the dispatch passes no `model:`. "Given the cumulative diff" reads as given access to it: the task carries the base SHA and the persona runs `git diff <base>` scoped to its row. "One decision line was appended" is the child appending to the ledger's `## Decisions` section before its commit. "Exactly one commit was added" is enforced by the parent (Driver, commit boundary).
- AC5 "every row `done` with the verification command failing routes to the escalation gate" is read literally: a failing exit verification is a stop note; the driver never reopens rows or reruns the command on its own.
- AC5/AC6 "escalation gate" is the stop note defined in Design.

## Design

### Components

| Component | Path | Status |
|---|---|---|
| Loop persona | `agents/loop-implementer.md` | new |
| Loop driver skill (stage skill) | `skills/loop-implementation/SKILL.md` | new |
| Engine-author contract | `doc/implement-engines.md` | new |
| Setting `loopEngine.maxIterations` | `extensions/lib/gauntlet-settings.ts`, `gauntlet_setting` enum (`extensions/phase-tracker.ts:892`) | new key, new enum value `loopEngine` |
| Ledger grammar in `plan_check` | `extensions/lib/plan-check.ts` (`checkPlan`) | one branch keyed on line 1; ledger placeholder scan |
| Approval menu, reply parsing, Engine persistence, transition | `skills/brainstorming/reference/spec-finalization.md`, `skills/brainstorming/SKILL.md` (step 13, checklist) | options 4 and 5 at every site |
| Ledger amendment aftermath | `skills/brainstorming/reference/amendment-surface.md` section 5 | one clause keyed on the ledger |
| Telemetry `engine` + `iterations` | `extensions/telemetry.ts` (recorder: `engine` event), `extensions/lib/telemetry-record.ts` (event type, `derive`), `src/bins/gauntlet-performance.mjs` (printer) | one event kind, two derived fields |
| Finish strip and hard gate | `skills/finishing-a-development-branch/SKILL.md` strip step and hard verification gate | ledger path and `verification:` line |
| Resume discovery and routes | `skills/gauntlet-resume/SKILL.md`, `reference/reconstruction.md`, `reference/brief-contract.md` | ledger pairing, "Spec with ledger" route, loop brief fields |
| Stage-skill lint | `scripts/stage-skill-lint.mjs` `STAGE_SKILL_DIRS` | add `skills/loop-implementation` |

Conditionality (user constraint: minimal, with ledger line 1 as the discriminant): every added branch keys on one of two discriminants - ledger line 1 (`checkPlan`, finish strip and hard gate, resume discovery, amendment aftermath) or the spec's `**Engine:**` line (approval transition, telemetry). The table above is the whole branch set; the plan treats a branch keyed on anything else as a `Pattern:` violation. The implement-start guard and verify's reviewers are untouched.

### Persona `agents/loop-implementer.md`

Frontmatter: `tools: read, write, edit, bash`; `defaultContext: fresh`; `inheritProjectContext: true`; `inheritSkills: false`; `systemPromptMode: replace`; `completionGuard: true`; no `model`, no `thinking`. Routing-label description: "One loop-engine iteration: closes one acceptance-criteria ledger row with evidence, commits once, appends one decision line."

Task fields the parent passes: `iteration: <i>`, `spec: <abs path>`, `ledger: <abs path>`, `base: <sha>`, `target: <row n | seed>`, `previous decision: <line | none>`, `hint: <human retry hint | none>`.

Prompt body (imperative, in this order):

1. Read the spec at the given path in full. Read the ledger at the given path.
2. Work on the `target:` row only. `previous decision` and `hint` say what not to redo and what to try differently; they never change the target.
3. Run `git diff --stat <base>`; open full hunks only for files the target row's change touches.
4. Implement the row. Write or run the row's evidence check: a test you wrote, or a named command or file assertion for a row you cannot automate. Run only that check; never the project verification command, never the full suite.
5. Edit only the target row: `status` to `done` (check passed) or `failed` (check failed), `attempts` + 1, `evidence` = the check name plus at most three lines of its result (on `failed`: the concrete cause in plain words - the spec-vs-code contradiction, the failing assertion, or the missing capability such as a credential, tool, or fixture). Never paste reasoning, transcripts, or more than three result lines.
6. Append one line to the ledger's `## Decisions` section in the exact shape `row <n> <done|failed> | <one sentence: what was done> | <one sentence: what the next iteration should not redo or should try differently>`; each sentence at most 200 characters.
7. `git add` your changes and the ledger; commit once with the subject `loop: row <n> <status>`. Leave the working tree clean.
8. Reply with the decision line only.

Iteration 0 (`target: seed`): this is the seeding contract and the one iteration that may edit several rows. For every `open` row, write the failing test or name the check and record it in `evidence`; a row the codebase already satisfies gets baseline evidence (the passing check) and `status: done`; `attempts` stays 0 on every row; never set `failed`; the decision line is `row 0 done | seeded <k> rows, closed <m> on baseline | <first row to take>`; commit subject `loop: seed evidence`.

Hard rules: after iteration 0 never edit another row; never edit row text, the spec, or the plan dir outside the ledger; never run the verification command; never touch `main`.

### Ledger

Path: `<resolved plan dir>/<spec stem>-ledger.md` (default `doc/plans/<spec stem>-ledger.md`). Grammar:

```markdown
# Ledger - loop engine
**Spec:** `doc/specs/<spec stem>.md`
base: <sha>
verification: <resolved verification command>
iterations: <dispatches started, iteration 0 included>

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | |
| 2 | cut | 0 | deferred: #70 |

## Decisions
row 0 done | seeded 2 rows, closed 0 on baseline | row 1
```

Line 1 is the discriminant (`^# Ledger - loop engine$`). Line 2 is the path-only `**Spec:**` header the `plan_check` handler, finish, and resume already read. `row` is the 1-based index of the spec's AC row; the row text is not copied (the spec is read every iteration). `status` is one of `open`, `done`, `failed`, `cut`. A `cut` row is closed by the parent only (seeding or a disposition amendment); a `done` row is closed by a child. `attempts` counts child dispatches that targeted the row and is never reset. `evidence` is a check name plus at most three result lines; it may be empty only on an `open` row before iteration 0. `iterations` is bumped by the parent before each dispatch and lands in the child's commit, so the consumed count is durable on the branch. Decision lines are written by children (`row <n> <done|failed> | ... | ...`) and, on a human retry, by the parent (`row <n> retry | <hint> | allowed attempts <m>`).

Finish strips the ledger: the strip step's `PLAN_PATH` candidates are the plan paired by basename and `<sibling plans dir>/<spec stem>-ledger.md`; the `rm` and commit run for each tracked candidate, and `--spec` comes from the `**Spec:**` header of whichever exists. Finish's hard verification gate reads a ledger's `verification:` line where it reads a plan's `**Verification:**` set. Pre-squash history stays on the branch reflog.

`plan_check` on a file whose line 1 is the discriminant (`checkPlan`, using the pre-resolved `specText`): check the table has exactly one row per spec AC row in order, every status is in the vocabulary, every `cut` row corresponds to a `deviates:`/`deferred:`/`elsewhere:` disposition and every `open`/`done`/`failed` row to an `in-scope` (explicit or absent) or `venue:` one, and run the ledger placeholder scan: `<...>`, `TODO`, `TBD`, `etc.`, `probably` in any `evidence` cell is a finding, and an empty `evidence` cell is a finding on any row other than an `open` row (open rows may be empty before seeding). Skip the task-plan checks and the task-plan placeholder scan (`checkPlaceholderScan` walks parsed tasks; a ledger parses to none). Stamp as today.

### Driver skill `skills/loop-implementation/SKILL.md`

A stage skill (dispatches with `cwd: <worktree>`, runs `git -C <worktree>`; `scripts/stage-skill-lint.mjs` `STAGE_SKILL_DIRS` gains it). Entered from the approval gate on `4` or `5`. Steps:

1. `gauntlet_setting({ key: "loopEngine" })` -> `maxIterations`. Resolve the verification command per the Problem ladder; print `verification command: <command> (<source>)`; an unresolvable or ambiguous command stops as a configuration error.
2. `phase_tracker({ action: "skip", phase: "plan", reason: "loop engine" })`.
3. Write the ledger skeleton from the spec's `## Acceptance criteria` (statuses per the AC3 reading), `**Spec:**` = the spec's repo-relative path, `base:` = `git -C <worktree> rev-parse HEAD`, `verification:` = the resolved command, `iterations: 0`, empty `## Decisions`. `plan_check({ planPath })`; a finding stops with it as a configuration error. Commit the ledger (`loop: seed ledger`).
4. `phase_tracker({ action: "start", phase: "implement" })`.
5. Loop. Before each dispatch, in this order:
   - Exit: no row is `open` or `failed` -> step 6.
   - Stagnation (unresolved rows only): a row with status `open` or `failed` whose `attempts` >= its allowance -> stop note. Allowance = 3 + funded N (Stagnation and funding), or the `allowed attempts <m>` of the latest `row <n> retry` decision line for that row when larger. `done` and `cut` rows never stop the loop, so a row that closes on its third attempt exits normally.
   - Empty-commit stagnation: the last two child commits (subjects `loop: row ...`; parent commits `loop: seed ledger`, `loop: repair ...`, `loop: retry ...`, `loop: cut ...` are excluded) each changed no file outside the ledger and no row status -> stop note.
   - Cap: ledger `iterations` >= `maxIterations` -> stop note (iteration 0 counts).
   - Target: iteration 0 -> `seed`; else the row named by the human retry hint when it is still `open`/`failed`; else the row the previous decision line names as `failed`; else the first `failed` row; else the first `open` row. The decision line is a hint; the ledger's durable status selects.
   - Record `HEAD_BEFORE` and keep a copy of the ledger text. Bump `iterations:` in the ledger (working tree, not committed). Dispatch `subagent({ agent: "loop-implementer", context: "fresh", async: false, cwd: <worktree>, output: <abs temp path>, outputMode: "file-only", acceptance: { level: "none", reason: "the parent validates the ledger and the commit" }, task: "iteration: <i>\nspec: <abs spec path>\nledger: <abs ledger path>\nbase: <sha>\ntarget: <n | seed>\nprevious decision: <line or none>\nhint: <hint or none>" })`. No `model:`. An async handle or dispatch error stops per the foreground policy.
   After each return, in this order:
   - Commit boundary: `git -C <worktree> status --porcelain` must be empty and `git rev-list HEAD_BEFORE..HEAD --count` must be 1; otherwise stop note (`Stopped: iteration <i> left the tree dirty` / `added <k> commits`), the changes and commits preserved for the human. Read the ledger from HEAD.
   - Iteration 0 validation: `attempts` all 0; the only status change is `open` -> `done`; every non-`cut` row has non-empty `evidence`; one new decision line `row 0 done | ... | ...`. A miss -> stop note (seeding is not retried automatically).
   - Iteration validation (i >= 1): compared with the pre-dispatch copy, exactly the target row changed and only its `status` (to `done` or `failed`), `attempts` (+1), and `evidence` (non-empty, bounded); `## Decisions` gained exactly one new line matching `^row <target> (done|failed) \| .{1,200} \| .{1,200}$` - an unchanged section is a miss even when an older line still parses. A miss (foreign row changed, wrong target, no new line, bad shape): restore every non-target row from the copy, set the target row `failed` with `attempts` +1 and `evidence` = `iteration <i>: <miss>`, commit `loop: repair row <n>`. Two consecutive misses -> stop note (the child is not following the contract).
   - Previous decision for the next dispatch = the new conforming line, else `none`.
6. Exit verification: run the ledger's `verification:` command once, foreground, from the worktree. Fail -> stop note `Stopped: verification failed with every row closed`, `Problem:` quoting the failing output; no row is reopened, the command is not rerun, further work starts only from the human's decision. Pass -> `phase_tracker({ action: "complete", phase: "implement" })`, then the continuation below.
7. Stop notes leave the phase `implement`; the loop resumes at step 5 from the human's decision (Stop note).

Parent context per iteration: one file-reference return, one ledger read, two git status/rev-list calls. The parent never reads the child transcript.

### After the loop: verify continuation

`verification-before-completion` does not dispatch the whole-diff code review (its requirements step reads a plan; `conformance-check.md:193-197` reviews only fix-round changes), and SDD owns the waves sequence in "After All Tasks Complete" (`subagent-driven-development/SKILL.md:327-336`) without calling that skill. The loop skill carries its own `## After the loop` section that runs SDD steps 0-5 with these substitutions, so AC5's "as they do under `waves`" holds:

| SDD step | Loop substitution |
|---|---|
| 0 `start verify` | unchanged |
| 1 parent full verification (`**Verification:**` set) | the ledger's `verification:` command; the passing step-6 run is reused when no edit landed since (finish's skip rule); a repair reruns it; no `plan_tracker` reopen (no tasks) |
| 2 whole-diff `code-reviewer` per `requesting-code-review`, fix rounds, `whole-diff minors:` | unchanged; no `plan_tracker` reopen; a repair reruns step 1 |
| 3 happy path, `conformance-reviewer`, fix loop, `complete verify` criterion | unchanged; the happy-path trigger is `## Happy path` in the overrides or the diff selecting a row (no plan header); the conformance checklist is the spec's AC rows against the ledger, and no `plan_tracker` update is awaited |
| 4 summary and `## Closure / conformance` block | "tasks completed" becomes rows closed and iterations consumed |
| 5 immediate `/skill:finishing-a-development-branch <abs worktree path>` | unchanged |

No spec-reviewer or code-reviewer dispatch happens inside implement; the eval lifecycle fixture proves both verify dispatches occur after `complete implement`.

### Stop note

Template and rules from `skills/subagent-driven-development/stop-note.md` (plain words, one screen, no round history, never "skip the row"), header `Stopped on row <n> (<row text>)`, `Stopped: iteration cap <N> reached with rows <list> open`, `Stopped: verification failed with every row closed`, `Stopped: iteration <i> left the tree dirty`, or `Stopped: iteration <i> added <k> commits`. `Problem:` restates the `evidence` cell of the row in one sentence - the concrete contradiction between spec and code, the failing check with its output, or the missing capability - and quotes the last decision line; with a funding token, `budget: <spent> of <N> spent` follows (`fix-loop.md:21`, the only round-history exception). Options: a) retry with a hint - the parent appends `row <n> retry | <hint> | allowed attempts <attempts + 1>` to `## Decisions`, commits `loop: retry row <n>`, and continues at step 5 with `hint:` set; the run-wide `iterations` count is unchanged. An explicit human retry starts a new consecutive-stagnation window: count empty child commits and validation misses only after that `loop: retry row <n>` commit; preserve every row's attempts and the total iteration cap. Funding alone never resets the window; b) amend the spec per `brainstorming/reference/amendment-surface.md` (Ledger amendments); c) stop the loop (phase stays `implement`). For a dirty-tree or extra-commit stop, a) is "discard the uncommitted changes / reset to the last valid commit, then retry" and the parent sets `iterations:` to HEAD's value + 1 before the next bump so the interrupted dispatch stays counted. No automatic disposition change ever.

### Stagnation and funding

The AC6 threshold is 3 attempts on one unresolved row. A `; fund N fix rounds` suffix on `4`/`5` (decoded per `amendment-surface.md#standing-grants`, persisted exactly as for `1`/`2`) raises every row's allowance to 3 + N; a funded attempt is consumed when a dispatch targets a row whose `attempts` is already >= 3, and the driver prints `funded round <k> of <N> for row <n>` before it. Spent per row = `attempts - 3`, durable in the ledger, so resume recovers it without transcript lines. Funding never buys an escalated-model round, never bypasses `maxIterations`, and never applies to the empty-commit stop. A mid-loop grant applies prospectively.

### Ledger amendments

`amendment-surface.md` section 5 aftermath gains one clause ahead of "Plan exists": a ledger exists (line-1 discriminant in the plan dir) -> no `plan-writer` dispatch, no `plan_check`, no `plan_tracker`. The parent reconciles the ledger: a row whose approved disposition is now `deviates:`/`deferred:`/`elsewhere:` becomes `cut` with the disposition as evidence; a factual or requirement-preserving amendment leaves rows as they are (the next iteration reads the amended spec); an amendment that re-bounds a row that is `done` sets it `open` with `evidence` = `reopened by amendment`. Commit spec + ledger together (`loop: cut row <n>` or `loop: amend`). A redraw deletes the ledger where it deletes the plan. Approval semantics (option 4 stops, option 5 auto-applies, redraw always stops) are unchanged.

### Settings and telemetry

`piGauntlet.loopEngine.maxIterations`: integer >= 1, default 30; resolver `resolveLoopEngine` in `gauntlet-settings.ts` with a warning for a non-integer; `gauntlet_setting` enum gains `loopEngine`. Model pin: `subagents.agentOverrides.loop-implementer.model` (pi-cohort), documented as one row under dispatch-model precedence.

Spec record of the engine: every approving reply writes the header line `**Engine:** loop` (`4`/`5`) or `**Engine:** waves` (`1`/`2`) directly below `**Amend-grant:**`, then `git add` + `commit --amend --no-edit` as the grant path does today; the sentence "on a plain approval the commit is untouched" goes, since `1` and `4` now amend for the Engine line. Option 4 leaves `**Amend-grant:** none`; option 5 and funded replies persist their description as `2` and funded `1`/`2` do. The HEAD check reads both lines. A spec without an `**Engine:**` line is `waves` (legacy specs).

Telemetry: the recorder pushes `{ kind: "engine", engine: "loop" | "waves" }` when the brainstorm phase transitions to `complete` or `skip` - the approval moment, and the resume route's skip re-reads the same spec file so the selection survives resume - reading the bound spec's `**Engine:**` line (absent -> `waves`). `derive`: `engine` = the last `engine` event's value, else `waves`; `iterations` = `personas["loop-implementer"].dispatches`, else absent. `gauntlet-performance` prints `engine: <value>` and `iterations: <n | empty>` for every run, so a legacy record prints `engine: waves` and an empty `iterations`. `npm run build:bins` after the lib change.

### Approval menu and routing sites

`spec-finalization.md` renders:

```
4 - approve, loop engine (experimental): skip the plan; iterate a fresh loop-implementer over the acceptance-criteria ledger; amendments stop for your review as under 1.
5 - approve, loop engine, auto-apply amends: as 4 with option 2's amendment grant.
```

Every site that names `1`/`2` or routes to `writing-plans` changes together (the plan enumerates them with `rg -n 'writing-plans|1 or 2|1/2|`1`' skills/brainstorming`): the fund sentence ("to 1, 2, 4, or 5"); the funded-reply table (rows for bare `5`, `5; fund N`, `4` with a budget token, mirroring `2`, `2; fund N`, `1`); the budget-token re-prompt ("asking for 1, 2, 4, or 5"); the `3` rules (`3` plus `4`/`5` prints and re-presents; a reply carrying `3` never grants); mixed replies stay change requests; the approval paragraph (`4` approves without a grant, `5` approves and grants; both persist `**Engine:** loop`); the transition ("proceed immediately to `/skill:writing-plans`" becomes "to `/skill:writing-plans` on 1/2, `/skill:loop-implementation` on 4/5"); `brainstorming/SKILL.md:56` step 13 and the gate checklist. A spec with `none - ...` in `## Acceptance criteria` renders three options and the menu says why.

### Resume

Discovery (`reconstruction.md` Candidates): a plan-dir candidate whose line 1 is the discriminant pairs with the spec on its `**Spec:**` line, not by basename. Routes:

- "Spec with ledger": entry check 6; `start brainstorm`; `skip brainstorm resume: <spec>`; `start plan`; `plan_check` on the ledger (FAIL stops with the findings - never `## Plan repair`, never writing-plans); `skip plan` with reason `resume: <spec> (loop engine)`; `start implement`; no `plan_tracker init`. A dirty tree is the dirty-tree stop note before any dispatch. Render the ledger rows and the last decision line, then continue at loop step 5 (`iterations` from the ledger header).
- "Spec without plan" whose spec carries `**Engine:** loop`: route to loop-implementation step 2 (create the ledger), not writing-plans.
- Handoff brief (`brief-contract.md`): a loop run carries `Ledger: <path>` and `Last decision: <line>` instead of `Active task`, and no `## Plan repair`; the call table's `implement` row for a ledger is the route above.

### Engine contract `doc/implement-engines.md`

The document any implement-engine author reads: admission (a file in the plan dir carrying the path-only `**Spec:**` header, selected by `plan_check` from its line 1, hashed by the stamp), what the implement-start guard, verify continuation, finish (strip candidates, `verification:` line), resume (discovery by line 1), and the amendment aftermath read, what ships in the squash (spec and telemetry; the engine's artifact is stripped), the stop-note contract, where the engine's model pin lives, the telemetry `engine` event, and the upgrade path if an engine's artifact cannot be a hashed file (a phase-state `engine` field, deliberately not built now). Lists the task engine and the loop engine as the two instances.

## Errors and edge cases

| Case | Behavior |
|---|---|
| Unresolved row at its allowance (3, 3 + funded N, or the retry's allowed attempts) | stop note; options retry / amend / stop |
| Row closes on its third attempt | normal exit; `done` rows never stop the loop |
| Two consecutive ledger-only child commits | stop note; never funded |
| `maxIterations` reached with rows open (iteration 0 counted) | stop note naming open rows and attempts, before any verification |
| Child commit missing or more than one; dirty tree on return | stop note; changes preserved; retry after a human discard/reset keeps the iteration counted |
| No new conforming decision line, or a foreign row changed after iteration 0 | foreign rows restored, target row `failed` with the miss as evidence, `loop: repair row <n>`; second consecutive -> stop note |
| Iteration 0 sets `failed`, bumps `attempts`, or leaves an `open` row without evidence | stop note |
| Exit verification fails | stop note quoting the output; no reopen, no rerun |
| Dispatch error or async handle | stop; no relaunch |
| `plan_check` finding on the seeded ledger | stop before the loop; configuration error |
| Verification command unresolvable or ambiguous | stop before iteration 0; configuration error |
| Spec with no AC rows | loop options not rendered |
| `deviates:`/`deferred:`/`elsewhere:` amend mid-loop | that row set `cut` by the parent, evidence = disposition; loop continues |
| Requirement-preserving amend mid-loop | rows unchanged; next iteration reads the amended spec |
| Interruption | ledger on disk plus the branch are the whole state; resume renders the ledger and continues at step 5 |

## Tests

- `extensions/lib/plan-check.test.ts`: ledger line 1 selects the ledger checks; missing spec row, bad status word, `cut` on an `in-scope`/absent/`venue:` row, `open` on a `deferred:` row, placeholder or empty evidence on a non-open row each produce a finding; an empty evidence cell on an `open` row passes; a task plan is unaffected.
- `extensions/phase-tracker.test.ts` (tool handler): a ledger with the `**Spec:**` header is admitted and stamped; implement-start passes on the stamped ledger.
- `extensions/lib/gauntlet-settings.test.ts`: `loopEngine.maxIterations` default 30, override honored, non-integer warns and falls back.
- `extensions/lib/telemetry-record.test.ts` and `extensions/telemetry.test.ts`: the `engine` event is recorded on brainstorm complete from the spec header, survives serialization and a resume skip; `derive` yields `engine`/`iterations`; a record without the event derives `waves`.
- `bin/gauntlet-performance.test.mjs`: prints `engine` and `iterations` for a loop run and `engine: waves` with an empty `iterations` for an old record.
- `scripts/stage-skill-lint` runs over `skills/loop-implementation` (in `npm test`).
- `eval/brainstorming`: samples rendering the five-option gate with a `4` reply (plan skipped with reason `loop engine`, `**Engine:** loop` written, `**Amend-grant:** none`), a `1` reply writing `**Engine:** waves`, and `5; fund 2 fix rounds`.
- `eval/loop-implementation`: samples for ledger seeding from a spec with `deviates:`, `venue:`, and disposition-less rows; verification-command resolution (PR gate key, prose section, discovery, ambiguous prose stop); iteration-0 validation with partial and complete baseline closure; third-attempt success exits; stagnation stop-note wording (must hold: no round history, cause quoted from the evidence cell); retry after exhaustion continues once; cutting an exhausted row continues; cap reached with open rows stops before verification; failed exit verification stops without reopening; zero-commit, two-commit, and dirty-return stops; missing or malformed decision line repaired then stopped on the second; funded row prints `funded round k of N`; full lifecycle fixture - zero reviewer dispatches in implement, whole-diff review and conformance in verify.
- `eval/loop-implementer`: samples for reading the spec before code, diff scoped to the row's files, never editing a foreign row after iteration 0, bounded evidence, decision-line shape, one commit and a clean tree.
- `eval/gauntlet-resume`: a modified in-progress ledger restores via "Spec with ledger" (bare worktree and handoff brief) without `plan_tracker init`; a loop-engine spec without a ledger routes to loop-implementation.
- `npm test`: new skill and persona pass the size, stage-skill, and model-literal lints; `doc/personas.md` roster count updated; bins rebuilt.

## Documentation impact
- Feature / user-facing docs introduced: `doc/implement-engines.md` (architecture; communication contract between engines and the phase tracker, verify, finish, resume, amendment aftermath; zero existing docs cover the topic)
- Materially amended existing docs: `doc/configuration.md` (operations: `loopEngine.maxIterations` default and the `loop-implementer` pin row under dispatch-model precedence; engine options; ledger location and grammar; `**Engine:**` header placement; funded-round meaning under the loop engine); `doc/personas.md` (roster row and count); `README.md` (major procedure: approval-menu options 4/5, `#configuring-the-gates` link, one routing row); `CHANGELOG.md - deferred: release`
- Derived / memory docs invalidated: `AGENTS.md` routing table (one row to `doc/implement-engines.md`)

Per `reference/documentation-impact.md`.

## Out of scope

- Engine comparison over several specs and any change of the default engine.
- A scripted iteration driver outside the pi main loop.
- Parallel iterations or best-of-N stagnation attempts.
- Spec or code reviewers inside the loop.
- An escalated-model round on stagnation.
- Automatic reopening of rows from a failed exit verification.
- A `piGauntlet.loopEngine.model` key or a phase-state `engine` field.

## Open questions

none
