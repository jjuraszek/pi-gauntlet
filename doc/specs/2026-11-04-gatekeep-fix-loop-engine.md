# gatekeep-pr fix wave on the loop-implementer

**Goal:** Replace the plan-bound `implementer` worker in gatekeep-pr's fix wave with the autonomous `loop-implementer` driven from a parent-owned companion ledger, one row per selected blocker finding and one batched row for `fix nits`, without changing the wave's round accounting, sync, review-before-push, push, prior-review tracking, or multi-PR handling.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop

## Problem

A gatekeep-pr delivery course closes file findings by dispatching one fresh `implementer` per drafted payload (`skills/gatekeep-pr/reference/fix-wave.md` `## Wave`). That persona is contractually plan-bound: `agents/implementer.md` opens with "You execute an approved plan ... do not redesign or expand scope", ships `completionGuard: false`, and owns no check of its own; the wave compensates by pre-drafting the exact edit and telling the helper never to re-solve the finding. `agents/loop-implementer.md` is the opposite contract: it reads the spec and the ledger, chooses its approach against prior failed attempts recorded in `## Decisions`, runs its own selective check, and commits once (`completionGuard: true`); its driver escalates the model on the threshold attempt (`skills/loop-implementation/SKILL.md` `## Before each dispatch`). The user's rationale, adopted: current models close a finding faster and better when given the finding and autonomy than when handed a drafted edit through a worker that may not deviate.

Hotfix already uses this shape. `skills/chase-bug/hotfix.md` step 4 writes a one-row companion ledger under `$TMPDIR`, points `**Spec:**` at the handoff record, and dispatches `loop-implementer` with `target: 1` (shipped by `doc/specs/2026-11-01-chase-bug-loop-hotfix.md`). Hotfix is out of scope here.

Corrected premises recorded during the questionary: a gatekeep finding is not already an acceptance row - today the human authorizes a drafted edit at the course pick, after this change the human authorizes a finding to close, and the worker chooses the edit; description-target, reply, and claim-recheck payloads are not code work and keep their path. Both personas ship with model and thinking unset in frontmatter; the observed capability gap between them is the persona contract, not a package model choice. Unverified: wall-clock per finding for either worker - no timing exists (Open questions).

Framing: kept (user override after the framing question) - gatekeep-pr's fix wave moves to `loop-implementer`; hotfix untouched; no model pin.

supersedes doc/specs/2026-10-08-gatekeep-blocker-only-fix-loop.md, the per-payload `implementer` worker and the carried-set re-dispatch sentence in `fix-wave.md` `## Wave` and `## Review before push` only; its blocker-only selection, scoped-test resolution, closure-line and push rules stay live.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] On pi, a delivery course or a terminal `fix nits` pick dispatches `loop-implementer` with `target: <row>` for every selected file finding; `implementer` is dispatched by the fix wave only for the sync conflict-stop and base-merge helpers.
  in-scope
- [ ] Each selected blocker finding becomes exactly one acceptance row of the wave's derived spec, carrying its `P#`/`L#` id and the finding's evidence pack, indexed by exactly one ledger row; a `fix nits` pick produces exactly one such row holding every selected nit.
  in-scope
- [ ] The wave ledger and derived spec live beside the run's continuation record (`<record path>-ledger.md`, `<record path>-spec.md`); `git -C <worktree> status --porcelain` never lists them, and no PR-branch commit contains them.
  in-scope
- [ ] After the round's `wave-reviewer` pass, a row with any required id on an `<id>: open - <why>` line or without a closure line is reopened once with attempts unchanged, one `row <n> reopened | review: <unresolved ids> - <why> | <reviewer's why>` line is appended to `## Decisions`, and that row is the next carried-set retry's dispatch target; a row whose required ids all read `resolved` stays `done` and dispatches nothing.
  in-scope
- [ ] A row stops being retried at `loopEngine.maxIterationsPerRow` attempts or when the wave reaches `repair.rounds_cap`, whichever comes first, and is reported under its `P#`/`L#` as `open - <last decision line>`.
  in-scope
- [ ] Description-target and reply payloads are applied exactly as before the change and never become ledger rows.
  in-scope
- [ ] The Claude Code native helper prompt and the pi row task share one context block (worktree path, head check, `SCOPED_TEST_COMMANDS`, PR-edit limits, output path); that shared block contains neither "re-solve" nor "apply the payload" and no commit or reply rule; the harness-specific tail (solve instruction, commit subject and body, failure handling, reply shape) is the only text that differs.
  in-scope
- [ ] `agents/loop-implementer.md` and `skills/chase-bug/hotfix.md` are byte-identical before and after the change.
  in-scope
- [ ] A run that reaches the gate without a delivery course creates no ledger, and a second gatekeep-pr run on the same PR still selects the viewer's newest posted review as `prior_review` and reviews code only in `prior_review.commit..head`.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gatekeep-hotfix-loop-engine
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test; node eval/run.mjs gatekeep-pr <sample> for the samples named in Tests
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: .pi/gauntlet-overrides.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: doc/implement-engines.md
Rules: eval/README.md
Rules: CHANGELOG.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7, AC 8, AC 9
design: owns skills/gatekeep-pr/reference/fix-wave.md, skills/gatekeep-pr/SKILL.md, skills/gatekeep-pr/reference/batch.md, skills/gatekeep-pr/reference/post-selection-loop.md, skills/gatekeep-pr/reference/findings.md, agents/pr-gatekeeper.md, extensions/phase-tracker.ts, extensions/phase-tracker.test.ts, scripts/ci.mjs, scripts/gatekeep-fix-loop-contract.test.mjs, doc/implement-engines.md, doc/configuration.md, doc/personas.md, CHANGELOG.md, eval/gatekeep-pr/; observable outcome: a pi delivery course closes file findings through loop-implementer rows and the Claude Code route is unchanged.

## Design

Approach 1 of the questionary: an inline adapter in `fix-wave.md` `## Wave`, written in the wave's own vocabulary, independent of hotfix's adapter. No shared reference file.

### Responsibilities

The gatekeep orchestrator keeps everything it owns today - assessment, drafting, course pick, sync, round and sync accounting, residue stops, review before push, push, menus, continuation record - and adds two artifacts: the derived spec and the wave ledger. `loop-implementer` replaces `implementer` as the worker for file findings only. `wave-reviewer` stays the single judge per round. The sync conflict-stop helper and the base-merge helper (`fix-wave.md` `## Sync`) stay on `implementer`: they resolve merges, not findings. The orchestrator is the loop driver for these rows: it writes the ledger, admits each result commit, charges attempts, and applies the escalation threshold; `loop-implementer` runs unchanged in companion mode.

### Derived spec

The unchanged persona closes a spec acceptance row, not ledger row text (`doc/configuration.md` Ledger and recovery: rows index spec ACs; row text lives only in the spec). Pointing `**Spec:**` at the PR's own spec would bind finding ordinals to unrelated ACs, so the wave writes one finding-derived spec at `<record path>-spec.md`, where `<record path>` is the run's `mktemp` continuation record (`post-selection-loop.md` `### Continuation record`):

```markdown
# Findings spec - gatekeep-pr <owner/repo>#<N>

## Scope
<PR title and body verbatim; `scope.original_intent` from assessment; when `scope.source: spec`, the carried spec path at the assessed head as the authoritative scope contract>

## Acceptance criteria
- [ ] <P#/L#>: <evidence pack: symptom, location, failing test or `no scoped test`>
- [ ] fix nits: <id>: <nit text>; <id>: <nit text>; ...
```

Exactly one AC per selected blocker finding, in review order, then one AC for the selected nit batch. The original PR spec or body stays authoritative for scope; the derived ACs are the work items. A newly carried finding gets its AC appended before its ledger row is added. The file is written together with the ledger and never read by anything but the worker and the orchestrator.

### Ledger

Written once per wave, after the course pick authorizes payloads and before the first row dispatch, at `<record path>-ledger.md` in companion mode (ledger outside the checkout, `pending:` tuple on the commit body, as `hotfix.md` step 3 does). Skeleton:

```markdown
# Ledger - loop engine
**Spec:** `<absolute <record path>-spec.md>`
base: <MB>
verification: <the brief's resolved verification command, or none>
checks: commands
iterations: 0
allowance: <maxIterationsPerRow>

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | |
| ... | open | 0 | |

## Leg mapping

| row | ac | leg |
|---|---|---|
| <n> | <n> | gatekeep |

## Decisions
```

| Field | Value |
|---|---|
| `**Spec:**` | the derived spec above |
| `base` | `MB` = `git -C <worktree> merge-base origin/<baseRefName> <headRefOid>` (the assessed `base...head` merge-base the scoped-test resolution already reads), so the worker's `git diff <base>` shows the PR's own changes; the per-attempt commit boundary is `HEAD_BEFORE` in `pending:`, not `base` |
| `verification:` | the resolved `verification command` from `../verification-brief.md`, the command the wave never runs; the persona's evidence rule rejects it as evidence for the same reason |
| `allowance:` | `loopEngine.maxIterationsPerRow` from `gauntlet_setting({ key: "loopEngine" })`; the same read retains `escalateAfter` for Budgets |
| `checks:` | `commands` |
| rows | one per derived AC, in AC order, `open`, attempts 0, evidence empty; row n indexes AC n |
| `## Leg mapping` | `<n> \| <n> \| gatekeep` for every row |
| `iterations:` | bumped by the orchestrator before every row dispatch |
| `## Decisions` | the admitted `row <n> <done\|failed> \| ...` lines, the orchestrator's `row <n> reopened \| ...` and `row <n> escalated \| ...` lines |

Scoped commands travel in the task, not the ledger (the four-column table has no command column): `SCOPED_TEST_COMMANDS: <resolved commands>` holds the row's payload commands, resolved exactly as today; for the nit row, the union of its payloads' commands, each `cd <dir> &&` prefix kept verbatim; `none` when no runner or test file resolves.

No seed dispatch: every row arrives with its evidence pack, so the first dispatch is `target: <row>`. Description-target and reply payloads never become rows and keep today's compare-and-swap and claim-recheck paths. Persist `repair.wave.ledger` and `repair.wave.spec` (absolute paths) in the continuation record; validate both exist and parse at every re-entry under the record's own validation (`stuck - run record unreadable` otherwise), and carry them through `batch.md` `## Private handoff` so a fresh execute child resumes the same ledger and counters. Neither file is ever staged; both are deleted with the run record on every handled terminal exit (`post-selection-loop.md` `### Teardown`) and retained through `cleanup.md` and `show evidence` like any other run evidence.

### Row dispatch

Per eligible row, in review order, the orchestrator first applies Budgets below (exhaustion and escalation), then saves the row's `attempts`, the ledger's `iterations` as `i` and `git -C <worktree> rev-parse HEAD` as `HEAD_BEFORE`, writes `iterations: i + 1` and `pending: <row> | gatekeep | <HEAD_BEFORE>` to the ledger, and runs

```text
subagent({ agent: "loop-implementer", context: "fresh", async: false,
  cwd: <worktree>, output: <mktemp "${TMPDIR:-/tmp}/gatekeep-row.XXXXXX">, outputMode: "file-only",
  acceptance: { level: "none", reason: "the parent validates the commit and keeps the ledger" },
  [model: <implModel> on the escalated attempt only,]
  task: "<shared context block>\n\n<pi tail>\n\niteration: <i>\nspec: <absolute derived spec>\nledger: <absolute ledger>\nbase: <MB>\ntarget: <row>\nprevious decision: <row's latest admitted or reopened line, or none>\nhint: none\nLeg: gatekeep\nmapped original AC: row <n> -> AC <n> (<P#/L# ids>), leg gatekeep\nRules: <repo-relative path or none>\npending: <row> | gatekeep | <HEAD_BEFORE>\nSCOPED_TEST_COMMANDS: <commands>" })
```

`Rules:` lists `AGENTS.md` and the overrides file when present in the worktree, one line each, else `none`. `acceptance: none` keeps pi-cohort from demanding an acceptance report that the persona's decision-only reply cannot carry; `output:` follows `SKILL.md:42`'s per-dispatch `mktemp` rule. The pi tail (Harness below) tells the worker which second-slot prefixes route obstacles: `needs <what>` for a credential, another repo or infrastructure; `contract exception: <why>` for a fix that needs a contract change against the stored scope baseline.

**Admission.** After each return, read the commit rather than the reply, in this order:

1. Boundary: `git -C <worktree> status --porcelain` empty and `git -C <worktree> rev-list <HEAD_BEFORE>..HEAD --count` equal to 1. Any residue, or more than one commit, stops the round under the wave's existing residue stop: dispatch no further row, re-render the menu naming the row, leave attempts and the ledger unchanged, never discard changes.
2. Commit body: subject `loop: row <n> <done|failed>`; body lines 1-2 equal the dispatched `pending:` tuple and `iteration: <i + 1>`; a blank line; one four-column row `| <n> | <status> | <attempts> | <evidence> |` without a header, plus at most one extra row per other ledger row currently `open` closed `done` with attempts unchanged; a blank line; one decision line per serialized row matching `^row <k> (done|failed) \| .{1,200} \| .{1,200}$`, target first. Require attempts = saved attempts + 1 and the same status in subject, row and target decision.
3. Evidence: one runnable selective command up to the first unescaped semicolon, then at most three result lines; no `;`, `|`, `&&`; it selects a file, test id, filter or assertion; its runner appears in the task's `SCOPED_TEST_COMMANDS` or it is an asserting command; it differs from the ledger's `verification:`.
4. Diff: `git -C <worktree> diff <HEAD_BEFORE>..HEAD` changes at least one tracked file; an empty diff is a validation miss.

Admitted: the orchestrator writes the row (status, attempts, evidence) and admitted extras, appends the decision lines to `## Decisions`, clears `pending:`, and resets the row's consecutive-miss count. `done` -> the row waits for the round's reviewer; `failed` -> the row is eligible for its next attempt under Budgets with the admitted line as `previous decision`. A `failed` commit keeps the worker's partial work and test on the branch (the persona extends it on retry); nothing is discarded.

Validation miss (zero commits with a clean tree, a dispatch error without a commit, malformed subject/body/row/decision/evidence, wrong attempts, status disagreement, an extra for a row not `open`, or an empty diff): write the row `failed`, attempts = saved attempts + 1, evidence `attempt <n>: <concrete miss>`, clear `pending:`, use `previous decision: none` next. A second consecutive miss on the same row exhausts it (Budgets). A miss never charges a round.

Interrupted return (re-entry with `pending:` set): reconcile from the branch before anything else. A commit after `HEAD_BEFORE` whose body carries the pending tuple is admitted as if just returned; a clean tree with no such commit is one validation miss; a dirty tree is the residue stop. Never re-dispatch while `pending:` is set and never recreate the round checkpoint for the same attempt.

Round accounting: an admitted commit, `done` or `failed`, whose diff changes a tracked source file charges the round once under the existing "at least one source-changing commit" rule and sets the checkpoint's `counted`; a validation miss establishes no progress. Obstacle routing from a `failed` decision: a second slot opening `needs <what>` is the Exit check's `Helper open - needs <what>` row (`stuck - needs <what>`); one opening `contract exception: <why>` renders `### Contract decision`; both keep their current escalation paths. Loop-shaped result commits, including failed attempts, stay in PR history as the worker made them; the wave adds no squash or fixup machinery.

### Review before push

Unchanged in range and ancestry: one `wave-reviewer` over `<pushed_head>..HEAD` (the assessed `headRefOid`, or `pushed_head_after_replay` under a rewrite), so earlier unpushed repair commits stay inside the reviewed range; the initial step-4 review keeps `assessment.md` `## Prior-review ancestry` and `prior_review.commit..head`. `## Fix delta` and `## Re-review task` are built exactly as today, with closure lines under the rows' `P#`/`L#` ids.

Empty-round test: a round whose checkpoint ends with `counted` false (no admitted commit changed a tracked source file) skips the review and the push and persists through `post-selection-loop.md` `### No-progress obstacle` with each failed row's last decision line as its failed prerequisite; this replaces the HEAD-equals-`pre_wave_head` test, which no longer holds once failed attempts commit.

Closure aggregation: each row's required ids are the finding's contributor `P#`/`L#` ids, or every selected nit id for the nit row. After the reviewer pass, evaluate each row once over all its required ids. Any required id on an `open - <why>` line, or without a closure line, reopens the row: status `failed`, attempts unchanged, one appended `row <n> reopened | review: <unresolved ids> - <why, 200 chars> | <reviewer's why text, 200 chars>`; that line is the row's next `previous decision`, so the retry targets the unresolved ids and leaves resolved items alone. A row whose required ids all read `resolved` stays `done`. The orchestrator still marks nothing resolved itself; per-id outcomes are recorded under their ids as today.

Carried set unchanged: every `open` closure line of this wave's ids, every new Critical or Moderate finding inside `## Fix delta`, and every new Critical finding outside it. A new finding is minted a `P#`, appended as a derived-spec AC and a ledger row with its mapping, then dispatched through Row dispatch. Carried-set retries re-dispatch eligible rows serially in the same pre-push wave; push only when the carried set holds no Critical or Moderate.

### Budgets

Two caps bind, whichever a row hits first: the row's `allowance:` (`loopEngine.maxIterationsPerRow`) and the wave's `repair.rounds_cap` (`2 x closureReview.maxFixRounds`, unchanged). A row is exhausted at `attempts >= allowance` or after two consecutive validation misses: it is never dispatched again, keeps its history, and is reported under its ids as `open - <last decision line>`. Other eligible rows continue within the wave's existing budget. When no eligible row remains and the carried set still holds a Critical or Moderate, persist `stuck - no progress: row <n> exhausted (<ids>)` through `### No-progress obstacle` - quoting the last decision line when no reviewer ran this round - and exit through the loop's ordered Exit check with commits retained. Continuation never resets attempts.

Escalation is parent-owned (the persona selects no model): resolve `gauntlet_setting({ key: "escalationLoop" })` once at ledger write and retain `implModel`; require it only at the escalated dispatch. Before dispatching a row with no `row <n> escalated` line, compute `threshold = min(escalateAfter, allowance - 1)`; at pre-dispatch `attempts >= threshold`, require `implModel` (the resolver's main-loop fallback counts), append `row <n> escalated | implModel round | allowed attempts <allowance>` once, and pass `model: <implModel>` on that attempt only. With `implModel` undefined, dispatch nothing, leave attempts and the ledger unchanged, and exit through Exit check's obstacle row with `stuck - escalationLoop.implModel unavailable`; never record a fabricated `failed` attempt.

### Harness

pi: the row dispatch above. Claude Code: the native helper keeps the drafted payload task. The two task texts share one context block - absolute worktree path, the `git -C <worktree> rev-parse HEAD` head check, the `SCOPED_TEST_COMMANDS` line, the PR-edit limits (a fix never adds infrastructure, a dependency or a new module; an outside-repo failure gets the smallest in-repo workaround with its reason in one sentence; a skip never removes a test an AC row relies on), and the output path - followed by one harness-specific tail. The pi tail: the finding is the derived-spec AC the task maps; choose the fix; run the selective check; commit and reply under the persona's Companion result commit contract; open a `failed` second slot with `needs <what>` or `contract exception: <why>` when those apply. The Claude Code tail: apply the drafted payload; commit once with a subject naming the fix only when the scoped test passes or `SCOPED_TEST_COMMANDS` is `none`, otherwise discard the edits and return `open - <why>`; report the failing and passing runs. The shared block carries no commit subject, failure rule or reply shape and contains neither "never re-solve the finding" nor "apply the payload". `SKILL.md:42` names `loop-implementer` as the pi worker for file findings.

### Selective evidence

`SCOPED_TEST_COMMANDS` is the permitted runner scope; the single command the worker records is its evidence. For a `cd <dir> &&` runner the worker runs the runner from `<dir>` and records `<runner> <path>` with the path relative to `<dir>`; for several runners it records the one whose directory prefix matches the file it tested. For `none`, the worker takes the persona's trivial or assertion-only path and records a runnable asserting command that exits nonzero when the finding's claim fails (a `test -f`, `rg -q`, or equivalent); no valid asserting check -> the row returns `failed` naming that cause and stays open, and the pre-push reviewer remains its only gate. The full-suite ban is unchanged: never the resolved `verification command`, whatever a consumer sentence says.

### Verify-session guard

`extensions/phase-tracker.ts` counts fix rounds and refuses a lone top-level dispatch in a bound verify window by the exact agent name `implementer` (`isImplementerWave` and the fix-loop-window branches). To keep the wave's retained sentence true - "the verify-phase phase-tracker's `1 x maxFixRounds` accounting unchanged; refused dispatch exits `stuck - phase-tracker fix-round guard`" - the same window treats `loop-implementer` exactly as `implementer`: a result carrying a `loop-implementer` child counts one round, and the lone-dispatch and cap refusals match it. The window is unchanged (`verify` in progress with a `conformance-reviewer` result observed), so the canonical loop engine, which dispatches `loop-implementer` only during implement, and every other consumer keep their behavior. The cadence reminder is untouched. `doc/configuration.md`'s "Fix-loop dispatch shape" and "Fix-round cap" bullets name both agents; `extensions/phase-tracker.test.ts` gains one focused regression per refusal.

### Edit set

Remove: the per-payload `implementer` dispatch block in `fix-wave.md` `## Wave` (the "apply the course-authorized payload ... never to re-solve the finding" instruction, the per-payload commit rule, the per-payload report shape) as implementer-specific text, keeping the PR-edit limits sentence in the shared context block; the "fresh implementer" wording of the carried-set retry sentence and the HEAD-equals-`pre_wave_head` empty-round test in `## Review before push`; the word `implementer` for file payloads at `skills/gatekeep-pr/SKILL.md:42`, `reference/batch.md:41`, `reference/post-selection-loop.md:129`, `reference/findings.md:94` and `:98`, and `agents/pr-gatekeeper.md:21` ("Delegate tracked source edits and commits to implementer" -> to the fix wave's worker: `loop-implementer` for file findings, `implementer` for sync helpers).

Add: the Derived spec, Ledger, Row dispatch, Admission and Budgets blocks in `fix-wave.md` `## Wave`; the closure-aggregation and reopen paragraph in `## Review before push`; the shared context block plus the two harness tails; `loop-implementer` at the naming sentences above; the `needs`/`contract exception` second-slot mapping at `post-selection-loop.md:60-61` and the exhaustion obstacle under `### No-progress obstacle`; `repair.wave.ledger` and `repair.wave.spec` in the continuation record and `batch.md` `## Private handoff`; the `open - <last decision line>` text on a carried open blocker's item in the posted review body (`findings.md:100`), so the next run's `prior_review` carries the failed-attempt knowledge through the existing channel; the phase-tracker change and tests of Verify-session guard; `scripts/gatekeep-fix-loop-contract.test.mjs` wired into `scripts/ci.mjs`'s test list; a `doc/implement-engines.md` paragraph naming gatekeep-pr's fix wave as a loop-engine consumer on a companion ledger; `doc/configuration.md` lines stating `loopEngine.maxIterationsPerRow` and `closureReview.maxFixRounds` both bound the gatekeep wave and the guard bullets above; the `doc/personas.md` `pr-gatekeeper` pin paragraph (line 58, "delegates tracked source edits and commits to implementer") and the `loop-implementer` row naming the gatekeep fix wave; a `CHANGELOG.md` `## Unreleased` entry; updated facts in `eval/gatekeep-pr/samples/blockers-bare-fix/expected.md` (two `loop-implementer` rows, not two implementer helpers) and `samples/prior-review-delta/case.md:47` (the P2 attempt returns a `loop: row 2 failed` commit opening `needs an external dependency`, not an open return with no commit); the new `eval/gatekeep-pr` samples named in Tests.

Every edited `skills/**/*.md` stays under 50,000 bytes and 2,000 lines (`fix-wave.md` is 15,951 bytes today). Edits follow `/skill:forge-skill` authoring rules: imperative voice, minimal diff, no new conditionals beyond the one harness split.

## Errors and edge cases

- A `loop-implementer` return failing Admission's boundary check (residue or more than one commit) stops the round under the wave's existing residue stop, naming the row; a return failing the commit-body, evidence or diff checks is a validation miss charged once to the row.
- A row that reaches `allowance:` or two consecutive misses is exhausted: never re-dispatched, reported `open - <last decision line>`; other rows continue; the wave's rounds cap still bounds the round count independently.
- `escalationLoop.implModel` undefined on the threshold attempt dispatches nothing and exits `stuck - escalationLoop.implModel unavailable` with attempts unchanged; never a fabricated `failed` line.
- The ledger and derived spec are written only after a delivery course or terminal `fix nits` pick; a `post`-only run creates neither.
- An unreadable or malformed ledger or derived spec on re-entry exits `stuck - run record unreadable`, the same text as the record's own validation.
- A batched nit row with any unresolved nit is reopened as one row with the unresolved nit ids in its `reopened` line; nits are never split into separate rows mid-round.
- A reviewer `open` line whose id has no ledger row (a new in-delta or outside-delta Critical finding) mints a derived-spec AC and a row, never a decision line.
- A `failed` decision whose second slot opens `needs <what>` exits `stuck - needs <what>`; one opening `contract exception: <why>` renders Contract decision; neither counts a round.
- `gauntlet_setting` unavailable when writing the ledger stops the wave naming the missing tool; the allowance and threshold are never guessed.
- A fresh multi-PR execute child resumes the persisted ledger and spec paths from the private handoff with their attempts intact; a missing locator is `stuck - run record unreadable`.
- Claude Code: the native helper path is unchanged in behavior; the only textual change is the harness split of the tail.

## Tests

- pi delivery dispatches `loop-implementer` with `target: <row>`, `pending:`, `Leg: gatekeep`, `acceptance: none` and never `implementer` for a file finding - `eval/gatekeep-pr` sample `loop-worker`
- a `loop: row <n> failed` commit is admitted, charges the row's attempt, and leaves the round running; a reviewer `open` line becomes one `row <n> reopened |` decision with attempts unchanged and the row is the next carried-set dispatch - sample `loop-worker`
- one batched row for `fix nits`; a partially resolved batch is reopened once with only the unresolved ids - sample `nit-batch-row`
- description payload stays on the compare-and-swap path with no ledger row - sample `description-not-a-row`
- ledger and derived spec beside the run record and never staged - sample `loop-worker` (asserts the paths and the clean-tree check)
- row stops at `maxIterationsPerRow` or two misses, other rows continue, exhaustion obstacle when none remain; `implModel` undefined dispatches nothing - sample `row-exhaustion`
- deterministic adapter/persona compatibility: required companion task inputs, both result statuses admitted, attempts and `pending:` updates, the shared context block carrying neither "re-solve" nor "apply the payload" and no commit or reply rule, both harness tails present - `scripts/gatekeep-fix-loop-contract.test.mjs`, listed in `scripts/ci.mjs`'s `--test` set, run by `npm test`
- phase-tracker counts a `loop-implementer` result as a fix round and refuses a lone top-level `loop-implementer` dispatch in the bound verify window - `extensions/phase-tracker.test.ts`, run by `npm test`
- `agents/loop-implementer.md` and `skills/chase-bug/hotfix.md` byte-identical - `git diff --stat main -- agents/loop-implementer.md skills/chase-bug/hotfix.md` empty, in the conformance check
- `prior_review` selection and ancestry unchanged - `git diff --stat main -- skills/gatekeep-pr/verification-brief.md skills/gatekeep-pr/reference/assessment.md` empty, in the conformance check
- updated existing facts hold: `blockers-bare-fix` (two loop rows) and `prior-review-delta` (failed commit with `needs`) - selected samples, complementary narration evidence, not proof of admission
- skill size and lint - `npm test`
- wall-clock per finding for either worker - none: no baseline exists; Open questions

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: doc/implement-engines.md (architecture: gatekeep-pr's fix wave as a loop-engine consumer on a companion ledger); doc/configuration.md (tunable parameters: `maxIterationsPerRow` and `maxFixRounds` both bound the gatekeep wave; the fix-loop guard bullets name `loop-implementer` beside `implementer`); doc/personas.md (`pr-gatekeeper` pin delegates file findings to `loop-implementer`; the `loop-implementer` row names the gatekeep fix wave); CHANGELOG.md - `## Unreleased`
- Derived / memory docs invalidated: none

Materiality bar: `reference/documentation-impact.md`. `eval/README.md` dropped from the draft's candidates: no runner behavior changes. README unchanged: it does not name the worker.

## Out of scope

- Hotfix (`skills/chase-bug/hotfix.md`): already on `loop-implementer` with a companion ledger.
- A shared companion-ledger reference under `skills/loop-implementation/reference/` (approach 2): earns its place only when a third consumer appears.
- Pinning a model or thinking budget on either persona; `agents/loop-implementer.md` and `agents/implementer.md` unchanged.
- The canonical loop engine's budget semantics, its driver, and other loop consumers; the phase-tracker change is limited to the bound verify window's agent-name match.
- Running the loop duties inline on Claude Code (the hotfix `## Harness fallback` shape).
- Any change to prior-review selection, fix-delta ancestry, review range, multi-PR batching, sync, push, menus, or the `C#` comment ledger.
- Seed dispatches for rows.
- Squashing or rewriting loop-shaped result commits on the PR branch.

## Open questions

- Wall-clock per finding, loop row versus implementer payload: untimed. The first few delivery runs after the change answer it from telemetry; no AC depends on it.
