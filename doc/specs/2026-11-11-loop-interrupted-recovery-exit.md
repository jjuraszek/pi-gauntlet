# Loop engine: an interrupted return is a failed attempt, and approval authorizes every named action

**Goal:** Make the loop engine follow its own contract: a worker return that is not one clean commit is one failed attempt recovered under the row's allowance with no proof demand and no human turn, the recovery-incomplete stop and all paid-action accounting are removed, approving a spec authorizes every paid or external action it names for the whole flow, and the one stop that still offers `discard` says what `discard` does.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Predecessor:** `doc/specs/2026-11-06-loop-hands-free-boundaries.md` - superseded for the recovery proof (Design "Driver", recovery steps 1-3 and the `recovery incomplete` stop, and the stop clause of its interrupted-return acceptance row), for paid-action accounting (`ran <action> (<k> of <bound>)`, `bound spent:`, the flow-wide count in its persona and brainstorming rows and Design), and for the matching "Coordinated and resume owners", "Docs" and "Evals" clauses. Its single allowance, seed and verification repair counts, conformance funding, `unreachable:` routing, blocking-call bound and jobs-file format stay live.
**Predecessor:** `doc/specs/2026-10-28-gh-92-gauntlet-gate-line.md` - context only (the gate id `loop-implementation/discard-authorization` stays and now names one stop); nothing superseded.

## Problem

Two loop runs on 2026-11-11 stopped for a human where the loop contract promises to continue. In both the driver followed the rule text, and in both it then invented a menu the rules do not define.

**Incident 1 - a crashed worker (consumer repo, anonymized).** Under approval option 5 with allowance 10, one foreground `loop-implementer` child working row 2 ended after 123 turns and 141 tool calls with the harness error `Request aborted`, exit code 1 and a 0-byte return file. The worktree was dirty with that child's tracked and untracked files; the jobs file `${TMPDIR:-/tmp}/loop-<base SHA>-5.jobs` was absent. The driver rendered `Stopped: iteration 6 recovery incomplete - background launch history and external-action accounting remain unknown.` with invented options ("A) Allow a narrow exception to the loop's no-transcript-read rule ...", "B) Stop and preserve the worktree."). After the human authorized recovery it stopped again: `Your discard authorization does not establish those missing facts`, `Recommendation: Stop - the loop's required recovery evidence is missing; another approval cannot replace it.` After further insistence it hand-wrote a `loop: repair row 2` commit that no rule describes. Row 2 was at 3 of 10 attempts and 14 rows were untouched.

**Incident 2 - an approved eval (this repo).** Design round 2 approved the eval runner at "at most three runs each (24 runs), each at most ten model calls". The spec council found a run can reach fourteen calls, the applied spec then held every eval run, and the gate asked for a separate sentence approving fourteen calls. The human approved with a bare `5`. The driver dispatched row 4 with its own text in the `hint:` field ("No paid eval run is authorized: bare 5 did not approve the fourteen-call bound"), the row returned `unreachable: fourteen-call approval missing ...`, and the driver stopped with an invented A/B menu after 3 of 11 rows. The human's reply: "I've already approved spec which includes eval!"

**Original report and the human's rulings (verbatim, the session path elided).**

- Report: "`<session file>` has stomped on unexplainable issue. recommendation was stop due to procedural issues. it was clearly not following loop engine and couldn't find sollution which it should automatically. loop engine is simple engine. and this was far from simple"
- Request: "we need to address both sides in minimal gauntlet" (the stop's entry condition and its missing exit).
- "it should be simple design - loop is single step which needs to deliver. if its not delivering for few times in a row escalation model is used, if agent go rouge and not deliver anything at all it doesn't mean that you need to escalate to human but operate under your budget of retries. to much special handling cases (conditionality) will make this process worst!"
- "A, I don't care about already paid toll! If spec for example requires some eval to be runned and I accepted the spec you shouldn't stop either. [...] this change/gauntlet is about following loop engine contract! don't escalate to human almost never! only contract change or exhausted rounds justify it"
- "what about option 4 vs 5? some spec changes still fits 5 without human intervention"

Framing: pivoted to "an interrupted return is a failed attempt; recover and retry under the budget with no proof demand" - the human's replies above. The brainstorm opened on defining a proof from signals the driver has and keeping a stop for an observed second writer; that special case is withdrawn.

**Checked claims.**

| Claim | Source | Result |
|---|---|---|
| A reset needs retained dispatch and write provenance for every changed path and commit; a clean `HEAD_BEFORE` and one dispatched child prove no ownership | `skills/loop-implementation/reference/interrupted-recovery.md:5`, `skills/loop-implementation/SKILL.md:86` | held |
| An absent or empty jobs file means no jobs only with retained evidence that the child launched no background work | `interrupted-recovery.md:6` | held |
| Uncertain action execution with no attributable reservation stops with `action execution uncertain` | `skills/loop-implementation/reference/action-spend.md:5` | held |
| Nothing produces write provenance or no-launch evidence; a failed sync child returns exit code, error text, run id and an artifacts path | scout read of pi-cohort `src/shared/types.ts:423-453`, `src/runs/foreground/subagent-executor.ts:2136-2162`; the incident run's metadata | held (pi-cohort source read by the scout only) |
| The worker appends a background job's line immediately after launch, so a worker that dies in that instant leaves a job with no record | `agents/loop-implementer.md:68-70` | held - corrects the chase, which read a missing jobs file as "nothing started"; the human ruled that such a job is covered by the retry budget |
| No file defines the discard menu or what happens after `discard` | `interrupted-recovery.md:10` ("menu below", the file ends), `SKILL.md:136-147` | held |
| The predecessor's approved acceptance row already promises "the driver recovers without a human turn"; the proof demand was added beside it in Design | `doc/specs/2026-11-06-loop-hands-free-boundaries.md:33`, `:109` | held - this change removes a contradiction inside that spec |
| Before PR #126 an interrupted return was a human stop with a discard ask | `git show 6b3b3d22^:skills/loop-implementation/SKILL.md` | held - a revert is not the reuse-only option |
| Chase sizing "three sentences, one scored example" | scout grep, main-loop reads | corrected - the proof demand is repeated in `interrupted-recovery.md`, `SKILL.md:86,174-175`, `action-spend.md:5`, `coordinated-legs.md:29`, `gauntlet-resume/reference/reconstruction.md:101,119,124`, three docs, deterministic tests and 23 scored samples |
| The count that caused incident 2's hold comes from the round-2 rule to name each action's "count for the whole flow" and authorize "within those bounds" | `skills/brainstorming/SKILL.md:139`, predecessor rows `:43,49` | held |
| Under the amend grant the written rule cuts an `unreachable:` row without asking, so the contract's own path would have dropped the approved eval row | `skills/loop-implementation/reference/unreachable-returns.md:9-13` | held |
| Action accounting has no extension code; it is prose, tests and scored samples | `rg` over `extensions src scripts` excluding tests | held |
| `skills/brainstorming/reference/amendment-surface.md` carries lines matching the count rule | `rg` for the accounting terms | corrected - it carries none of the count rule; design round 1 listed it for that in error. It is edited only for the reopened-row continuation (Design 2, `amendment-surface.md:172`) |
| Under option 5 an amendment that reopens a done row during verify still stops for a new authorization | `skills/loop-implementation/SKILL.md:180`, `skills/brainstorming/reference/amendment-surface.md:172` (both render `Stopped: row <n> reopened by amendment during verify` regardless of the grant) | held - Design 2 lets the standing grant run the row |
| The recovery file's opening applies recovery "only below the numbered target's effective allowance or the seed repair-count allowance" | `interrupted-recovery.md:3` | held - the gate leaves the last allowed attempt unrecovered and uncharged; Design 1 removes it |
| Seed and verification repair counts are read from landed `loop: repair seed` / `loop: repair verification` commits (plus one unmatched `pending: verify` tuple), and `HEAD_BEFORE` is recorded anew at every dispatch | `skills/loop-implementation/SKILL.md:86,105,118,173` | held - a repair commit that cannot land charges nothing and an unrestored HEAD would become the next base; Design 1's failure pass covers both |
| Stop text outside the quoted removals still names the old contract | `SKILL.md:134` (`commit-boundary, interrupted-dispatch`, `rejected-return stops`), `SKILL.md:174-175`, `coordinated-legs.md:17,35` (`ownership-fenced recovery`, `stop on other dirt`, unrelated-movement and attribution-mismatch stops), `reconstruction.md:97-102,124-125`, `README.md` loop paragraph, `doc/configuration.md:65,151,153,157,163`, `doc/implement-engines.md:72,74,82,84,90`, `doc/gate-contract.md:148,152` | held - Design 2, 4 and 6 name them |
| `node eval/run.mjs` lints `"new": true` `skillFiles` entries against the baseline and refuses a file that exists there | `eval/README.md:53`, `eval/loop-implementation/target.json:15,19,23`, `eval/brainstorming/target.json:13`; member lint run against `git merge-base HEAD origin/main` | held - every `loop-implementation` and `brainstorming` sample is refused until the flags go (Design 7) |
| `gauntlet-resume` samples `interrupted-ownership` and `migration-recovery` bundle the driver and `coordinated-legs.md` only | their `case.md:1-2` | held - Design 7 adds `interrupted-recovery.md` |
| `gauntlet-resume/ledger-tracker-recovery` expects the removed stops | its `expected.md:3-4` (`rejected-return`, `interrupted`) | held - Design 7 migrates it |
| The gate id `loop-implementation/discard-authorization` is also the ask for a dirty tree with no dispatch pending | `doc/gate-contract.md:34`, `SKILL.md:132,134`, `eval/loop-implementation/samples/human-stop-counts/case.md:17`, `eval/gauntlet-resume/samples/legacy-cap-brief/case.md:8` | corrected - round 1 said the gate entry is deleted; the stop the human kept in round 2 uses it, so the id stays for that one stop |
| "Still unknown: stop without mutation" belongs to the question asked when no tuple is on disk and later commits or dirt follow a child commit | `skills/gauntlet-resume/reference/reconstruction.md:112-120` | corrected - round 2 said this rule is replaced; it sits in the no-dispatch-pending family the human kept, so it stays |
| Option 4 stops for amendments, option 5 applies them without asking, a redraw stops under both | `skills/loop-implementation/SKILL.md` Human stop, `skills/brainstorming/reference/spec-finalization.md` gate rows 2 and 5 | held |
| `CHANGELOG.md` has no `## Unreleased` heading on this branch | read of its first lines | held - top heading is `## v8.4.9 - 2026-11-11` |

Implicit dependencies: none missing - traced the jobs-file path, the persona's controller protocol, the gate-contract lint (`scripts/gate-contract-lint.mjs`), the eval runner contract (`eval/README.md` "Iterating on a skill edit") and pi-cohort's sync failure shape. Not checkable in this checkout: the runtime artifacts of the two incident runs, read during the chase.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] When a loop worker's return is not one clean attributed commit - a dispatch error, a non-DONE reply, a silence kill, a dirty tree, zero commits or several commits - the driver recovers with no human turn under approval options 4 and 5 alike: it terminates the jobs the worker listed, resets the checkout to the pre-dispatch commit, removes untracked non-ignored files, commits `loop: repair row <n>` with the row `failed`, attempts +1 and evidence `iteration <i>: interrupted - <reason>`, and takes the next ordered-table action in the same turn.
  in-scope
- [ ] That recovery asks for no proof of who wrote the tree or which jobs ran: for a worker that ended with `Request aborted`, an empty return file and no jobs file, the driver resets and redispatches the row as in the row above and renders no stop.
  in-scope
- [ ] A listed job whose live process does not match its recorded start identity, command and group leader is not signaled and recovery continues; a job still alive after `KILL`, or files still present after the reset, do not stop the run, and the next return is validated as usual.
  in-scope
- [ ] An interrupted seed dispatch recovers by the same steps with a `loop: repair seed` commit that leaves every row unchanged and counts once against the seed count.
  in-scope
- [ ] An interrupted verification repair recovers by the same steps with an empty `loop: repair verification` marker that consumes its reserved repair, then reruns the failing checkout's gate pairs.
  in-scope
- [ ] An interrupted companion dispatch resets the companion checkout and the home checkout to their saved commits and writes the repair commit in home only, incrementing only the target row's attempts.
  in-scope
- [ ] A resumed session that finds a `pending:` tuple on disk admits one clean attributed commit as before and recovers any other state by the same steps, with no second iterations bump and no human turn; when the human answers the existing admission question with "interrupted", the same steps run with no proof demand.
  in-scope
- [ ] A dirty tree with no `pending:` tuple, found at entry or on resume, renders `Stopped: dirty tree with no dispatch pending`, lists the dirty paths and offers `discard` or stop; a typed `discard` resets that checkout to its HEAD, removes untracked non-ignored files and resumes the entry or restore sequence the stop suspended (ledger seeding at fresh entry; eligible migration, then dispatch or verification, on resume), and any other reply changes nothing.
  in-scope
- [ ] The loop worker runs a paid or external action that an acceptance row or Design names, without asking, on every attempt that needs it, including a retry after an interrupted attempt that already ran it; a count or a deferral to a later approval written beside the action does not withhold it, and the worker writes no `ran <action> (<k> of <bound>)` or `bound spent:` record to the ledger, the jobs file or a commit body.
  in-scope
- [ ] The driver has no stop for a spent action bound: a failed return whose first result segment starts `bound spent:` takes the ordinary failed-attempt path, and no dispatch, admission or repair reads or copies action records.
  in-scope
- [ ] Brainstorming's design round 2 names every paid or external action with its runner and inputs and no count, says that approving the design authorizes each named action for the whole flow, and writes no hold that makes a named action wait for a later approval; an action the design does not name is stated as unreachable until it is explicitly added.
  in-scope
- [ ] `doc/gate-contract.md`, `doc/configuration.md`, `doc/implement-engines.md` and the README's loop paragraph describe the recovery steps above, the stops that remain under option 4 and under option 5 as listed in Design 2, the dirty-tree stop's `discard` reply, and approval as the authorization for every named action, with no mention of recovery proof, the recovery-incomplete stop, action records or spent bounds.
  in-scope
- [ ] Each sample that Design 7 lists as migrated expects the outcome Design 7 states for it - recovery and a retry under the allowance for an interrupted return, the dirty-tree stop where no dispatch is pending - and none expects a recovery-incomplete stop or a discard stop for an interrupted return.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: loop-interrupted-recovery-exit
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: `npm test` (runs `scripts/ci.mjs`: skill lint, instruction-size lint, gate-contract lint, contract tests, eval structural lint and hygiene); selected model evals `node eval/run.mjs <target> <sample>` for the samples named in Design 7
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: doc/personas.md
Rules: doc/configuration.md
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
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7, AC 8, AC 9, AC 10, AC 11, AC 12, AC 13
design: owns every path named in Design 1-7 under `skills/loop-implementation/`, `skills/gauntlet-resume/reference/`, `skills/brainstorming/SKILL.md`, `skills/brainstorming/reference/amendment-surface.md`, `agents/loop-implementer.md`, `doc/`, `README.md`, `CHANGELOG.md`, `scripts/*.test.mjs` and `eval/`.

## Design

supersedes `doc/specs/2026-11-06-loop-hands-free-boundaries.md`, the recovery proof, the recovery-incomplete stop and paid-action accounting, as scoped in the header.

Every skill, persona and reference edit below follows `/skill:forge-skill`: imperative voice, minimal diff, no new branch where a sentence can be deleted. The change removes text in every instruction file it touches; no file grows past the instruction-size limit.

### 1. One recovery rule - `skills/loop-implementation/reference/interrupted-recovery.md`

An interrupted return is a dispatch error, a non-DONE reply, a silence kill, a dirty tree, or zero or several commits after `HEAD_BEFORE`. It is one failed attempt. The file keeps its opening classification, loses the opening's allowance gate, and becomes three unconditional steps. Recovery always runs and always charges the consumed attempt, including on the last allowed attempt; the existing row rule 2 or seed exhaustion rule then stops without another dispatch.

1. Jobs. Read `${TMPDIR:-/tmp}/loop-<base SHA>-<iteration i>.jobs`; an absent or empty file means no jobs. For each process line `<pid> <process-start-identity> <command>` whose live process matches the recorded start identity and command and whose `ps -o pgid= -p <pid>` equals the pid, send `kill -TERM -- -<pid>`, wait at most 10 s, recheck the same three values, and send `kill -KILL -- -<pid>` to a surviving group only when all three still match; a failed recheck skips that line and recovery continues. Skip a line that does not match or whose identity is unavailable. Signal neither the driver's shells nor unrecorded processes. Print `terminated <k> child jobs` when k > 0, then delete the jobs file.
2. Reset. Run `git -C "<worktree>" reset --hard HEAD_BEFORE`, then `git -C "<worktree>" clean -fd` (ignored files stay). Continue whatever `status --porcelain` shows afterwards.
3. Repair. Write the ledger from the saved copy with `iterations:` = saved +1 and no `pending:`. Stage and commit only the ledger path; the repair commit's parent is `HEAD_BEFORE`. For a numbered target set only that row `failed`, attempts = saved attempts +1, evidence `iteration <i>: interrupted - <reason>` with the existing reasons (`killed after silence`, `dispatch error: <text>`, `dirty tree`, `<k> commits`, `non-DONE`); commit `loop: repair row <n>`; refresh; return to the ordered table, where rule 2 stops a row at its allowance. For seed leave every row cell and decision unchanged, commit `loop: repair seed` with `seed interrupted: <reason>` in the body, refresh and apply the seed count. Never append a fabricated child decision.

Failure pass (one rule for row, seed and verification repair). When `git -C "<worktree>" rev-parse HEAD` differs from `HEAD_BEFORE` after step 2, or the step 3 commit is not written, dispatch nothing and run steps 2-3 again from the saved copy. Each such pass counts one more against the same allowance - the row's effective allowance, the seed count or the verification repair count - held with the saved copy while no commit can land, so the consumed attempt is never lost. The passes end when a ledger-only repair commit lands on `HEAD_BEFORE`, recording the one consumed attempt as step 3 states, or when the held count reaches the allowance, where the existing row, seed or verification exhaustion stop renders with that count. A HEAD that is not such a landed repair commit is never recorded as the next dispatch's `HEAD_BEFORE`. No other stop exists for a git failure.

Remove:
- From the opening: "only below the numbered target's effective allowance or the seed repair-count allowance; at exhaustion take rule 2 or the seed stop without another dispatch".
- Step 1 "Establish exclusive checkout provenance" in full, including "Missing provenance, concurrent or unattributed writes take the recovery-incomplete stop" and the action-spend read.
- "Treat an absent or empty file as no jobs only with retained evidence that the child launched no background work", "Unavailable identity or mismatch stops without signaling", "An already exited job needs affirmative exit evidence", "require `kill -0 <pid>` to fail", and the rule that the jobs file is deleted only after confirmed exit and durable action accounting.
- "Require empty `status --porcelain` and 0 from `rev-list HEAD_BEFORE..HEAD --count`" as a precondition of the repair.
- Every "retained action records" clause in the ledger and commit-body steps, and "preserve action-record lines under action-spend durability".
- The closing paragraph: `Stopped: iteration <i> recovery incomplete - <what>`, its reason list and the "discard-authorization menu below".
- "Keep an unrecoverable before-image or ambiguous attribution at the recovery stop with state preserved" (in a live session the before-image is the saved copy; resume keeps its own stop, Design 4).

Add: none beyond the three steps and the failure pass above, which reuse the file's existing commands and commit subjects.

Beyond the failure pass's HEAD check the driver makes no cleanliness check between a recovery and the next dispatch. Files written by a job that escaped step 1 surface at the next return as a dirty tree, which is another failed attempt; the allowance ends the sequence at the existing row stop.

### 2. Driver - `skills/loop-implementation/SKILL.md`

Remove:
- `## Driver holds`: "retained dispatch/write provenance" from the permitted reads.
- `## Before each dispatch` and `## Validate the return`: both "Read [action-spend durability] ... in full now" sentences.
- `## Dispatch`: "Retain dispatch/write provenance and background-launch records for ## Interrupted recovery; a clean boundary and one child alone never establish exclusive ownership."
- `## Human stop`: "The recovery-incomplete stop keeps discard authorization only, never budget offers" and "At recovery incomplete, ask for explicit discard authorization naming the unresolved ownership or cleanup; a budget reply authorizes no discard."
- `## Human stop`: "commit-boundary, interrupted-dispatch" from the list of stops that print row counts ("including allowance, missing-model, dirty-tree, commit-boundary, interrupted-dispatch and exit-verification stops"), and "Use restored pre-dispatch row cells at rejected-return stops, not unadmitted child results." Several commits, no commit and a rejected return are interrupted returns under Design 1, not stops.
- `## After the loop` step 1: "retain dispatch/write and background-launch provenance", "Require retained launch/no-launch evidence and the jobs records in ## Interrupted recovery", the action-spend sentence ("Apply [action-spend durability] ... require action-spend records after tuple/iteration in the repair commit body"), and "On missing provenance, ambiguous attribution/before-image or failed cleanup, retain state at the recovery-incomplete stop; the pending reservation remains consumed."
- `## After the loop` step 1, the old verification-recovery continuation in full: "apply ## Interrupted recovery steps 1-3 to the failing checkout, not its numbered-row/seed budget or step 4", "Preserve the saved row cells and already-consumed iteration; after owned jobs exit and the boundary is clean, clear pending in an empty `loop: repair verification` marker (no repair code), with tuple, iteration and interruption reason in its body" and "For companions require unchanged home HEAD and expected-only dirt, and write the marker only in home." The replacement is the interrupted-repair rule below.
- Every remaining mention of provenance, ownership fences, the recovery-incomplete stop, retained recovery stops, and commit-boundary, interrupted-dispatch or rejected-return stops in this file. The only recovery-related stops it keeps are the dirty-tree stop below and resume's missing-history stops and admission question (Design 4).
- The file `skills/loop-implementation/reference/action-spend.md`.

Add, in `## Human stop`:
- The dirty-tree stop, replacing the removed recovery-incomplete sentences and narrowing the marker sentence ("including the discard/reset authorization ask for a dirty or commit-boundary return" becomes "including the discard ask for a dirty tree with no dispatch pending"): a non-empty `status --porcelain` with no `pending:` tuple, found at entry step 4 or on resume, renders `Stopped: dirty tree with no dispatch pending`, lists the dirty paths, and offers `discard` or Stop only, never budget offers. On a typed `discard` run `git -C "<checkout>" reset --hard HEAD` and `git -C "<checkout>" clean -fd`, then resume the sequence the stop suspended: at fresh entry continue Entry step 4's ledger write and step 5 (`plan_check`, `loop: seed ledger`, implement start, refresh); on a restore finish eligible migration, final allowance validation and the refresh, then continue at `## Before each dispatch` in implement or `## After the loop` step 1 in verify. Never jump to the ordered table before a ledger is seeded and admitted. Any other reply preserves the tree and keeps the stop open.
- One closing rule: render only the stops this skill and its references name; every other failed dispatch is a failed attempt under the allowance. Never invent a stop, a menu, an option or an approval the spec's gate did not ask for, and never write a ruling on what the spec authorizes into a task's `hint:` field.

`## After the loop` step 1 keeps its repair dispatch and its marker; the repair task injects the persona's step-5 action authorization (Design 5) and the Evidence command paragraphs, with no accounting. Interrupted-repair rule, replacing the removed continuation: on a killed, error, non-DONE, dirty, zero/multiple-commit or invalid repair return, read `${TMPDIR:-/tmp}/loop-<failing leg's base SHA>-<pre-bump iteration>.jobs` (the identity the repair task was given, not home's base) and apply Design 1 steps 1-2 to the failing checkout at its saved HEAD; for a companion leg also reset home to the saved home HEAD as in Design 4. Then write exactly one empty `loop: repair verification` marker in home - no repair code; the ledger with saved row cells, the already-consumed iteration and no `pending:`; tuple, iteration and interruption reason in its body - with no second bump, and rerun the failing checkout's gate pairs. A non-empty `status --porcelain` after the reset blocks neither the marker nor the rerun. Design 1's failure pass applies with the verification repair count.

`## After the loop` step 3, the reopened-row continuation ("On an approved re-bound (`reopened by amendment`), refresh and stop with `Stopped: row <n> reopened by amendment during verify` ..."), and its twin in `skills/brainstorming/reference/amendment-surface.md` aftermath ("During verify, stop on a re-bound row ..."): under amend permission (approval option 5) the applied amendment needs no second authorization. Refresh, then apply the normal `## Before each dispatch` boundaries, `## Dispatch`, `## Validate the return` and refresh with verify still active and no phase reset, within the row's remaining effective allowance; close the row on disk and rerun step 1 before verify continues. A reopened row already at its effective allowance takes rule 2's row stop. Without amend permission (option 4) the stop and its authorize-or-stop offer stay as written. Redraw gates are unchanged.

Stops this change keeps or touches. The table is not the driver's whole stop set: guards this change leaves alone (a missing capability or unreadable reference, a malformed `**Amend-grant:**`, an unresolved verification entrypoint, repeated-evidence amendment handling, a refresh that fails or leaves implement active) keep their current text. The table goes into the docs named in Design 6, not into `SKILL.md`; the closing rule above is the exhaustive authority for what the driver may render.

| Stop | Option 4 | Option 5 |
|---|---|---|
| A row's attempts reach its effective allowance; seed repairs reach the allowance; the escalation model is unavailable for a row's escalated round, at any point in the run | stops (retry, `rows +N`, amend, stop) | same |
| Verification repairs reach the allowance; the escalation model is unavailable for a verification repair | stops (amend, stop) | same |
| Conformance fix-round cap | stops at the cap | funded up to the allowance, then stops |
| A spec amendment, including an `unreachable:` cut | as today: the amendment reviewer applies evidence-backed factual corrections, every other amendment stops for review | applies with no human turn |
| A row reopened by an applied amendment during verify | stops (authorize the row's return, stop) | runs the row within its remaining allowance with no human turn |
| A redraw | stops | stops |
| The run cannot start: a missing `checks:` or `allowance:` ledger line, an unavailable settings tool, `plan_check` findings at seed | stops | stops |
| A dirty tree with no dispatch pending; on resume also the admission question and the missing-history stops (an unrecoverable pre-dispatch ledger; with no tuple on disk, a child commit whose attribution cannot be read) | stops | stops |
| A dispatch that returns an async handle despite `async: false` | stops | stops |

### 3. `skills/loop-implementation/reference/unreachable-returns.md`

Remove the `^bound spent: .+$` table row and the sentence "Keep action counts and authorization bounds unchanged by retry or `rows +N`; only an approved amendment can raise an action's bound." A first result segment starting `bound spent:` now matches "Neither" and returns to the ordered table. The `unreachable:` row, the `venue:` exception and the amendment action are unchanged.

### 4. Companion and resume

One rule for every entry point: a recoverable `pending:` tuple with its ledger before-image is authoritative. The only admissible state is one clean commit after the tuple HEAD whose attribution matches; every other state - a wrongly attributed commit, several commits, no commit, dirt in the selected checkout, home dirt beyond the expected bump and tuple, home commits after the saved home HEAD - is an interrupted return and takes Design 1 with no human turn. `iterations:` becomes the before-image value +1 exactly once: the bump already on disk is that +1, and recovery adds no second one.

`skills/loop-implementation/reference/coordinated-legs.md`, `## Companion return validation`: for an interrupted companion boundary apply Design 1 to the companion checkout at its `HEAD_BEFORE` with its base/iteration jobs file, reset home to the saved home HEAD, restore the saved home ledger with the consumed iteration, clear pending and commit `loop: repair row <n>` or `loop: repair seed` in home only; increment only the numbered target's attempts once. Remove "exclusive companion checkout/write provenance, accounted-for writers and matching jobs-file process identity before signaling or reset", "require confirmed job exits and clean/zero-commit observations", and "Missing provenance, missing before-image, unexpected home changes, unresolved cleanup or ambiguous attribution stops with state preserved, not a reset based on commit timing." Admission of a clean companion commit keeps its existing checks.

Same file, `## Resume` and `### Companion commit admission`: "stop on other dirt", "keep unrelated movement and attribution mismatch as state-preserving stops" and "preserve pending and stop on unrelated movement or attribution mismatch" become the rule above (route to Design 1), and both "ownership-fenced recovery" phrases become plain references to `## Companion return validation`'s interrupted recovery. The admission recipe still requires unchanged home HEAD and expected-only home dirt to admit; failing that requirement is an interrupted return, not a stop.

`skills/gauntlet-resume/reference/reconstruction.md`:
- Ledger restore step and `### Pending recovery`: a `pending:` tuple on disk with anything other than one clean attributed commit goes through Design 1 against the tuple HEAD and its ledger before-image, with `iterations:` at the before-image value +1 exactly once - the on-disk bump, never a further increment. Remove "require exclusive checkout provenance and confirmed owned-job exits before any reset", "Report unresolved cleanup or ownership with the driver's recovery-incomplete header ... and discard-authorization menu", "Require exclusive checkout provenance and verified process identity/exit before reset", "Preserve every change at recovery incomplete when ownership or cleanup is unresolved", the "ownership-fenced" qualifiers, and in the companion row "unresolved ownership/cleanup".
- Reconstruction gates that fire before recovery: in step 4.1 "On unrecoverable attribution or before-image, stop before refresh" narrows to an unrecoverable before-image or tuple; in the home row "Unrelated movement, attribution mismatch or an unrecoverable before-image stops without redispatch or double counting" and in the companion row "preserve state on unrelated movement, attribution mismatch, unrecoverable before-image" keep only the unrecoverable before-image. With a tuple on disk, attribution mismatch and unrelated movement take Design 1.
- Retained-stop wording: step 4.2 "with no retained recovery stop" and "Defer migration through any retained recovery stop or dirty tree", and step 4.3 "For a retained recovery stop or unresolved dirty tree", name only the dirty-tree stop of Design 2 and the missing-history stops. Step 5's "Render a row whose `pending:` tuple is restored or retained as `row <n> in_progress (pending tuple restored)`" applies only at a missing-history stop, the one place a tuple stays on disk.
- Admission question: the question text and its three outcomes stay. Its message also lists the commits in `<pre-dispatch HEAD>..HEAD` and the dirty paths, and says that answering `interrupted` discards them through `reset --hard <pre-dispatch HEAD>` and `clean -fd`.
- Admission table: "Confirmed interrupted" applies Design 1 to the whole `<pre-dispatch HEAD>..HEAD` range; remove "Confirmation that admission was interrupted proves no ownership of later writes ... Missing evidence preserves child and unrelated changes at recovery incomplete". "Confirmed settled" and "Still unknown" are unchanged.
- Migration deferral: "any retained recovery stop or dirty tree" becomes the dirty-tree stop of Design 2; after `discard` reaches a clean tuple-free tree, migration runs before the next dispatch or verification as today.
- Unchanged: the missing-history stops, which name the commit and the failed check - an unrecoverable before-image or tuple, and, with no tuple on disk, a home child commit whose attribution is missing, malformed or mismatched or whose pre-dispatch bytes are unavailable - and the no-tuple admission question's "Confirmed settled" and "Still unknown" outcomes.

### 5. Worker - `agents/loop-implementer.md`

Remove:
- Output contract: "Put action accounting inside the first sentence, not in a third slot."
- Step 5: the two opening sentences on repeating carried records; the whole clause "; an approved spec clause in an acceptance row or Design must name its bound (runner, inputs, count per flow)", so the sentence ends at "Apply the action rules below before any paid or external action."; every sentence from "Read all earlier decision lines, evidence cells, `loop: repair` commit bodies" through "rather than infer zero spend"; the table row "Named action's count exhausted"; "count below bound", the `ran <action> (<k> of <bound>)` instruction and "Put the same record in the evidence result line" from the first table row.
- Target seed: "human-authorized" in "After a human-authorized recovery discards an interrupted seed"; "and durable accounting" and "record action spends in the seeded evidence, preserving the fixed seed decision below".

Add, in step 5's first table row: an action that an acceptance row or Design names, with its prerequisites present, is authorized for the whole flow by the spec's approval - run it without asking on every attempt that needs it; a count, or wording that defers it to a later approval, written beside the action does not withhold it. The rest of that row ("Reuse its output for local rechecks rather than spending it again") and the `unreachable:` row are unchanged.

Unchanged: the Evidence command section, including "Never record a paid or external action as the evidence's first segment" and the child's own job launch, cancel and cleanup protocol.

### 6. Brainstorming and docs

`skills/brainstorming/SKILL.md` section 6, the round-2 paid-action paragraph becomes: name every paid or external action needed for implementation or verification in Design with its runner and inputs; state that approving the design authorizes every named action for the whole flow across seed, rows, repairs and finish, with no count and no per-step prompt; never write a hold that makes a named action wait for a later approval; state that the loop treats an action without such a clause as unreachable, and require separate explicit authorization to add an unnamed action to Design. Remove "and count for the whole flow" and "within those bounds".

`skills/brainstorming/reference/amendment-surface.md`, ledger aftermath: the sentence "During verify, stop on a re-bound row with `Stopped: row <n> reopened by amendment during verify`; keep verify active and offer authorization to return that row to ledger implementation or stop" applies only without amend permission; under the standing grant the row returns to the driver's `## Dispatch` and `## Validate the return` as Design 2 states. Nothing else in that file changes.

Docs, present tense. Each named clause is replaced, and every touched section ends with no mention of recovery proof, ownership fences, the recovery-incomplete stop, action records or spent bounds; all of them state Design 1, named-action authorization and the Design 2 stops in the same words:
- `doc/gate-contract.md`: the loop-stop paragraph ("Interrupted child or pending recovery continues without a human turn only after proven checkout ownership ... A budget reply authorizes no discard.") states Design 1 in two sentences and the dirty-tree stop with its `discard` reply; the verification-repair paragraph keeps its counts; the gate inventory row `loop-implementation/discard-authorization` stays; the `bound spent:` sentence of the unreachable paragraph is removed.
- `doc/configuration.md`: in the amend-grant paragraph "unresolved recovery" leaves the list of retained stops and "interrupted returns take ownership-fenced recovery" becomes Design 1; in "Loop engine operations" the allowance sentence loses "nor permission to discard unknown work"; the interrupted-return paragraph states Design 1, including the failure pass, and carries the Design 2 stop table; the verification-repair paragraph replaces "ownership-fenced interrupted recovery" with the interrupted-repair rule of Design 2; the resume paragraph's "free of recovery stops" becomes the dirty-tree and missing-history stops; the paid-action paragraph states approval as authorization for every named action, the `unreachable:` route for unnamed ones, and no counts or records; the tracker paragraph's "A ledger row reopened by amendment instead requires an authorized ledger return" states the option-4 stop and the option-5 continuation.
- `doc/implement-engines.md` "Stops, models and telemetry": "interrupted returns use the ownership-fenced recovery below" becomes Design 1; the retained-stop list loses "incomplete recovery" and "spent named-action bounds"; the verification-repair paragraph replaces "takes ownership-fenced recovery" and "incomplete recovery preserves the counted reservation" with the interrupted-repair rule; the interrupted-return paragraph states Design 1 and carries the Design 2 stop table; the paid-action paragraph loses the flow-wide count, the `ran <action> (<k> of <bound>)` record and "`bound spent:` instead stops the row under either option, never cuts it". In the amendment-aftermath paragraph "A done row reopened during verify stops with `Stopped: row <n> reopened by amendment during verify`" states the option-4 stop and the option-5 continuation.
- `README.md`: in workflow step 2 "Redraws, exhausted bounds and unproven recovery still stop." becomes "Redraws and exhausted bounds still stop."; in the loop paragraph "Interrupted returns spend attempts after ownership-fenced recovery: the driver confirms owned jobs exited before resetting the checkout; unknown ownership or failed cleanup requires a human decision." becomes one sentence stating Design 1 (the driver ends listed jobs, resets the checkout and charges one attempt, with no human turn).
- `CHANGELOG.md`: a new `## Unreleased` section naming the removed recovery-incomplete stop, the removed action accounting and `bound spent:` stop, the dirty-tree `discard` reply, and the authorization rule.

### 7. Tests and evals

Deterministic tests assert the new text and the absence of the old: `scripts/loop-engine-contract.test.mjs` (the recovery tests at "interrupted ordinary and seed returns", "companion recovery", "reconstruction fences interrupted recovery", "human stop counts", and the verification-repair test; also "terminal home results refresh only after admission and retain pending on boundary stops", which pins `exclusive checkout provenance`; "row budget replies preserve counters and reject malformed grants without writes" and "retired loop budgets yield to durable shared allowance and keep waves decoding", which pin the recovery-incomplete sentence; "configuration-allowance: binding documentation describes the single allowance", a docs test whose token `discard authorization only` is replaced by the Design 6 wording; and "verify owns the gate set, bounded repair and authorized ledger re-bound", which gains the option-5 reopened-row continuation beside the option-4 stop), `scripts/loop-implementer-actions.test.mjs` (delete "a successful capture survives interrupted seed and row recovery without a second spend"; rewrite the other two without counts or records), `scripts/loop-unreachable-cut.test.mjs` (drop the `bound spent` pattern), `scripts/loop-verification-repair.test.mjs`, `scripts/loop-boundary-integration.test.mjs` and `scripts/brief-contract-lint.test.mjs` (drop the provenance and recovery-incomplete tokens), `scripts/brainstorming-contract.test.mjs` (the paid-action paragraph).

Evals follow `eval/README.md` "Iterating on a skill edit". Remove `skills/loop-implementation/reference/action-spend.md` from `eval/loop-implementation/target.json` `skillFiles` and from any `bundle` line naming it.

Runner prerequisite amendment (row 13 evidence): the configured judge `anthropic-fable/claude-fable-5-1` is absent from `pi --list-models`; `anthropic-fable/claude-fable-5-2` is registered. Replace that judge id in the existing `eval/lib/models.mjs` constant and its directly affected tests/docs with the registered successor. Keep replay models and thinking unchanged. Re-seed selected baselines with the same judge as candidates; preserve existing records and report the model change, never compare scores across different judges. This changes the verification prerequisite inside the existing eval component, not an acceptance row or the eval runner's boundaries. Keep row 13 in scope and its attempt count intact.

Runner prerequisites, before the first selected run: the runner refuses a `"new": true` `skillFiles` entry whose file exists at the baseline. Remove the stale `"new": true` flag from `skills/loop-implementation/reference/unreachable-returns.md` and `skills/loop-implementation/reference/interrupted-recovery.md` in `eval/loop-implementation/target.json` and from `skills/brainstorming/reference/opening-message.md` in `eval/brainstorming/target.json`. Add `bundle+: skills/loop-implementation/reference/interrupted-recovery.md` to the `case.md` of `gauntlet-resume/interrupted-ownership` and `gauntlet-resume/migration-recovery`, whose replays must state the recovery commands Design 4 now delegates to that file. Then re-seed the baseline arm of every sample whose assembly these edits change with `node eval/run.mjs <target> <sample> --baseline-only`, one sample per invocation, as `eval/README.md` "Iterating on a skill edit" prescribes, before its candidate run.

Rewrite each target's `intent.md` (`for:` line, change statement, `## Expected to move` lines for every rewritten fact) for `loop-implementation`, `loop-implementer`, `gauntlet-resume` and `brainstorming`, and update each target's `README.md` sample table where a sample's description changes.

Core samples, rewritten and run:

| Target / sample | Change | Must-hold facts |
|---|---|---|
| `loop-implementation/interrupted-child-redispatch` | Variants A-F rewritten to Design 1; new variant G: the worker ended `Request aborted`, the return file is empty, no jobs file exists; new variant H: `git reset` exits nonzero with the worker's commits still on the branch and the repair commit fails; new variant I: the approved spec names a paid action, the human approved with a bare `5`, and the next row is dispatched | `owned`: A terminates the matching listed group, resets, commits `loop: repair row 1` with attempts +1 and redispatches. `identity`: B does not signal the mismatched leader and still recovers. `provenance` (rewritten): C recovers although another writer touched the tree, and renders no stop. `interruptions`: D recovers every interrupted shape with its reason and one attempt. `aborted` (new): G recovers and redispatches with no stop and no question. `git-failure` (new): H dispatches nothing from the unrestored HEAD, repeats reset and repair under the same allowance, lands a ledger-only repair commit on `HEAD_BEFORE` when git recovers, and otherwise renders only the ordinary row stop at the allowance. `driver-scope` (extended): in I the dispatch carries `hint: none` or only a retry, rule-3 or seed hint, and the driver renders no authorization stop, menu or question. `row-budget`, `companion-resume`, `seed` aligned to the same rule |
| `loop-implementation/seed-interrupted-count` | Variant D recovers | `count` unchanged in outcome; `ownership` (rewritten): D commits `loop: repair seed` and redispatches below the seed count |
| `loop-implementation/companion-interrupted-recovery` | Variant C recovers | `owned`: resets repo-b and home, repair in home only. `unsafe` (rewritten): C's mismatched job is skipped and recovery completes with one attempts charge |
| `loop-implementation/verify-repair-count` | Snapshot 2 recovers without proof; new snapshot 5: an applied amendment reopens a done row during verify, once under option 5 and once under option 4 | `interruptions` (rewritten): the interrupted repair reads the failing leg's jobs file, writes one empty marker with the already-consumed iteration, consumes the reserved repair and reruns the gate pairs although files remain after the reset; no state is retained at a stop. `reopened` (new): under option 5 the row is dispatched within its remaining allowance with no stop and step 1 reruns after it closes; under option 4 the driver renders `Stopped: row <n> reopened by amendment during verify` |
| `loop-implementation/unreachable-cut` | Snapshot 3 loses its stop | `spent` (rewritten): a `bound spent:` first result takes the ordinary failed-attempt path. `matching`: an unadmitted dirty return recovers, and no marker from it authorizes a cut |
| `loop-implementer/silence-bound-and-unreachable` | Variants D, E, I, J rewritten; new variant K: Design names the action with a count and a note that it awaits a later approval | `named-action`: A runs the action with no record. `unreachable`: B and C unchanged. `rerun` (replaces `spent-bound`, `flow-count`, `interrupted-spend`, `durable-reservation`): D, E, I and J run the named action again when the row needs it and write no `ran`/`bound spent` record. `named-runs` (new): K runs the action and does not mark it unreachable. `bounded-contract` without the accounting clause; the other facts unchanged |
| `loop-implementer/seed-recovery` | Case text loses "human authorized" | existing facts unchanged in outcome |
| `loop-implementer/seed-evidence-carry` | Carried records removed | the row closes on the local replay without repeating any action record |
| `gauntlet-resume/interrupted-ownership` | Variant B recovers; variant C's case text loses "including which checkout is never reset"; `bundle+` gains `interrupted-recovery.md` | `home`: A recovers with no proof demand. `ownership` (rewritten): B resets, commits the repair with the consumed iteration and continues; no recovery-incomplete stop. `companion` (rewritten): C resets repo-b to its tuple HEAD and home to the saved home HEAD, writes the repair in home only with iterations 8 (before-image 7 +1, once), and never resets repo-c; the old "never resets home" expectation is removed |
| `brainstorming/design-names-paid-actions` | Count facts rewritten | `flow-bound` (rewritten): round 2 names runner and inputs, proposes no count and says approval authorizes each named action for the whole flow. `unnamed-unreachable`: an action without a clause is unreachable. The other facts unchanged |

Migrated samples, expected facts aligned to Design 1 and run once each: `loop-implementation` `allowance-10-escalate-after` (`rejection`), `commit-boundary` (`contract`), `exit-repair-capability` (`spent`), `exit-verification-escalates` (`boundaries`), `human-stop-counts` (variants E and F recover; D keeps the dirty-tree stop), `multi-row-return` (`boundary`), `row-budget-actions` (variant 5's first half becomes the dirty-tree stop), `seed-retry` (`boundary`), `spent-row-escalation` (`rejection`), `tracker-boundary` (`immediate`, `resume`), `legacy-cap` (variant E), `gate-line-first` (its case becomes the dirty-tree stop with no dispatch pending, with a second variant at fresh entry before any ledger exists; `authorization` expects `discard` or stop, and after a typed `discard` at fresh entry the reset, the clean and then Entry step 4's ledger write and step 5, never the ordered table); `gauntlet-resume` `migration-recovery` (variants B and D, each a pending tuple with a non-admissible return, recover and then migrate - facts `dirty`, `interrupted`; `bundle+` gains `interrupted-recovery.md`) and `ledger-tracker-recovery` (facts `rejected-return` and `interrupted`: a tuple on disk with a dirty, several-commit or zero-commit return recovers through Design 1 with the consumed iteration and no interrupted-dispatch stop; with no tuple on disk the admission question of Design 4 stays, and its `interrupted` answer runs Design 1). Not edited: `leg-resume`, `tracker-verify`, `legacy-cap-brief`, `ledger-tracker-verify`.

Paid and external actions for the whole flow (seed, rows, repairs, finish):

| Action | Runner | Inputs | Count |
|---|---|---|---|
| Model eval run | `node eval/run.mjs <target> <sample>`, including `--baseline-only` seeding | every sample named in this section, one sample per invocation, never target-wide | no limit - as many runs as the rows, their retries and repairs need |

Approving this spec authorizes these runs; no later approval is needed and no row waits for one. Any other paid or external action is unreachable. The committed evidence is the selected sample records and each target's partial `report.md`, naming the samples run and the remaining coverage limit.

## Errors and edge cases

- A listed job's live process does not match its record, or its identity cannot be read: the line is skipped, nothing is signaled for it, recovery continues.
- A job survives `KILL`, or an unrecorded job keeps writing: recovery completes; the next return is dirty and counts as another failed attempt.
- `git reset` leaves HEAD off `HEAD_BEFORE`, or the repair commit is not written: Design 1's failure pass - no dispatch from that HEAD, reset and repair again under the same allowance, and the existing row, seed or verification exhaustion stop when the count reaches it. `git clean` failing with HEAD restored: the ledger-only repair commit is written and the leftover files surface at the next return.
- The crashed worker left commits: the reset removes them.
- An interrupted return on the last allowed attempt: the repair sets attempts to the allowance and rule 2 renders the ordinary row stop with retry and `rows +N`.
- An interrupted escalated round: the escalation stays spent, as today.
- A resumed session with a pending tuple and several commits, a wrongly attributed commit, dirt or no commit: Design 1, no second bump.
- A resumed session with no tuple and later commits or dirt after a child commit: the existing admission question with its three outcomes; its message names the range and paths that `interrupted` discards.
- A worker returns `unreachable:` for an action the spec names: the worker contract of Design 5 is the guard against it; the return still follows the unchanged routing, including the cut under the amend grant, and the driver adds no spec read and no authorization check.
- An old ledger carrying `ran ...` or `bound spent:` text in evidence or decisions: read as plain text; nothing counts it.
- A spec that still writes a count or a hold beside a named action: the worker runs the action.
- A named action whose credential or environment is absent: `unreachable: <what> - <where>`, unchanged.
- A dirty-tree stop answered with a budget reply or anything other than `discard` or stop: nothing changes and the stop stays open.
- A retry re-runs a paid action that already ran: accepted; the row allowance is the only bound on spend.

## Tests

- AC 1 recovery steps and repair commit - `scripts/loop-engine-contract.test.mjs` (interrupted ordinary and seed returns); `eval/loop-implementation/samples/interrupted-child-redispatch` facts `owned`, `interruptions`, `row-budget`.
- AC 2 no proof demand - `interrupted-child-redispatch` facts `aborted`, `provenance`; absence of the proof and stop wording - `scripts/loop-engine-contract.test.mjs`.
- AC 3 mismatched and surviving jobs - `interrupted-child-redispatch` fact `identity`; step wording - `scripts/loop-engine-contract.test.mjs`. A live process surviving `KILL` - none: replays are tool-free.
- AC 4 seed - `eval/loop-implementation/samples/seed-interrupted-count` facts `count`, `ownership`; `eval/loop-implementer/samples/seed-recovery`.
- AC 5 verification repair - `eval/loop-implementation/samples/verify-repair-count` fact `interruptions`; `scripts/loop-verification-repair.test.mjs`.
- Option-5 reopened row during verify (Design 2) - `verify-repair-count` fact `reopened`; `scripts/loop-engine-contract.test.mjs` ("verify owns the gate set, bounded repair and authorized ledger re-bound"); the option-4 stop - `scripts/brief-contract-lint.test.mjs`.
- AC 6 companion - `eval/loop-implementation/samples/companion-interrupted-recovery` facts `owned`, `unsafe`; `scripts/loop-engine-contract.test.mjs` (companion recovery).
- AC 7 resume - `eval/gauntlet-resume/samples/interrupted-ownership` facts `home`, `ownership`, `companion`; `migration-recovery` facts `dirty`, `interrupted`; `ledger-tracker-recovery` facts `rejected-return`, `interrupted`; `scripts/brief-contract-lint.test.mjs`.
- AC 8 dirty-tree stop and `discard` - `eval/loop-implementation/samples/gate-line-first` fact `authorization`; `human-stop-counts` variant D; a budget reply at the stop - `eval/loop-implementation/samples/row-budget-actions` variant 5 (fact `boundaries`) and `scripts/loop-engine-contract.test.mjs` ("row budget replies preserve counters and reject malformed grants without writes"); stop wording - `scripts/loop-engine-contract.test.mjs`; gate inventory - `scripts/gate-contract-lint.mjs` through `npm test`. The reset itself - none: replays are tool-free.
- AC 9 worker runs named actions, no records - `eval/loop-implementer/samples/silence-bound-and-unreachable` facts `named-action`, `rerun`, `named-runs`, `unreachable`; `seed-evidence-carry`; `scripts/loop-implementer-actions.test.mjs`.
- AC 10 no spent-bound stop, no action records in the driver - `eval/loop-implementation/samples/unreachable-cut` facts `spent`, `matching`; no authorization stop or hint for an approved named action - `interrupted-child-redispatch` fact `driver-scope` (variant I); `scripts/loop-unreachable-cut.test.mjs`; absence of `action-spend.md` and its read sites - `scripts/loop-engine-contract.test.mjs`.
- AC 11 round-2 authorization wording - `eval/brainstorming/samples/design-names-paid-actions` facts `flow-bound`, `unnamed-unreachable`; `scripts/brainstorming-contract.test.mjs`.
- AC 12 docs - `scripts/loop-engine-contract.test.mjs` ("configuration-allowance: binding documentation describes the single allowance") pins the Design 6 wording and the absence of the old tokens; the gate inventory row - `scripts/gate-contract-lint.mjs`; the remaining prose is read at conformance.
- AC 13 migrated samples - each sample listed as migrated in Design 7, run once.
- "Never invent a stop" rule - `scripts/loop-engine-contract.test.mjs` pins the sentence; live behavior - `interrupted-child-redispatch` fact `aborted` (no question, no menu).
- `git reset` and repair-commit failure - `interrupted-child-redispatch` fact `git-failure` (variant H).
- Old-ledger text - none: no selected sample exercises it.
- Instruction files under 50,000 bytes and 2,000 lines - `scripts/skill-size-lint.mjs` through `npm test`.

## Documentation impact

Applied per `reference/documentation-impact.md`.

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/gate-contract.md` (communication contract: the loop stops a program can meet and the `discard` reply); `doc/configuration.md` and `doc/implement-engines.md` (operations: recovery and the stops that remain; procedures: paid-action authorization); `README.md` (workflow step 2 and loop paragraph); `CHANGELOG.md` - `## Unreleased` entry (communication contract: a stop and a record format are removed)
- Derived / memory docs invalidated: `eval/loop-implementation/README.md`, `eval/loop-implementer/README.md`, `eval/gauntlet-resume/README.md`, `eval/brainstorming/README.md` (sample tables)

## Out of scope

- The dispatch-returns-an-async-handle stop and the unrecoverable-history stops: unchanged. The resume admission question keeps its question and three outcomes; only its message gains the discarded range (Design 4).
- The `unreachable:` routing and its automatic cut under the amend grant.
- The worker's own background-job launch, cancel and cleanup protocol, and the jobs-file line format.
- A proof or monitor of who wrote the worktree, a pre-launch job record, or a process scan before the reset.
- Keeping a crashed worker's partial work for the next attempt.
- The waves engine (`/skill:subagent-driven-development`) and its fix-round funding.
- Extension code: no `extensions/` or `src/bins/` file changes.

## Open questions

None.
