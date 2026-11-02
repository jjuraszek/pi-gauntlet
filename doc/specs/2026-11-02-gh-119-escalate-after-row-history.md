# Loop engine: escalate after `loopEngine.escalateAfter` attempts and give each attempt its row's decision history

**Goal:** Decouple the loop engine's one escalated attempt per row from the row's allowance through a `loopEngine.escalateAfter` setting (default 3, clamped to the last allowed attempt), and have the fresh-context child read its target row's complete ordered decision history from the ledger before choosing an approach, without growing the dispatch payload.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Ticket:** jjuraszek/pi-gauntlet#119
**Predecessor:** `doc/specs/2026-11-01-gh-108-loop-single-allowance.md` - supersedes its Design "Escalation, hands free" first bullet (the `attempts == effective allowance - 1` predicate), the "apply the normal last-attempt predicate after retry or `rows +N`" clause it placed in the driver's escalation block (`skills/loop-implementation/SKILL.md:78`), and its two Errors rows that tie escalated-attempt recovery to the last attempt ("Escalated attempt admitted as a validation miss ... reaches the effective allowance, so the row stops under rule 2" and "attempts stay at effective allowance - 1", `:146-147`, carried into `SKILL.md:131`); its once-per-row identity, missing-model stop, verify-phase repair, allowance accounting, and everything else stay.
**Predecessor:** `doc/specs/2026-11-01-gh-110-loop-multi-row-close.md` - context only (multi-row returns, target `previous decision` selection, `failed` third-slot grammar); nothing superseded.

## Problem

The loop driver (`skills/loop-implementation/SKILL.md:76-78`) dispatches a row's escalated round, the one attempt that runs on `escalationLoop.implModel`, only when `attempts == effective allowance - 1`. With the default allowance 4 that is attempt 4; with an allowance of 10 the strong model first sees the row on attempt 10, after nine fresh-context attempts on the worker model that carry over one sentence of guidance each. The reporter's note records why that is wasteful: attempts 2..9 on the same model with one line of carryover add little, and the stagnation guards (two consecutive empty commits, two consecutive validation misses) catch only degenerate loops, not "confidently wrong in a new way each time".

Each child receives `previous decision: <latest admitted target line>` and `hint:` (`SKILL.md:89`), and its persona step 2 says only "Use `previous decision` and `hint` to avoid repeating work" (`agents/loop-implementer.md`). The ledger's `## Decisions` section holds every earlier `row <n> ...` line and the child already reads the whole ledger (persona step 1), but nothing tells it to use that history, so attempt 3 can repeat what attempt 1 ruled out.

Framing: kept - checked `skills/loop-implementation/SKILL.md:76-78` (equality rule), `:89` (payload fields), `agents/loop-implementer.md` Procedure 1-2 (full ledger read; step 2 names only `previous decision` and `hint`), `extensions/lib/gauntlet-settings.ts:96-108` (`resolveLoopEngine` pattern), `doc/configuration.md:85` ("only active" sentence), `scripts/loop-engine-contract.test.mjs:92-118` (pins the last-attempt text), `extensions/lib/plan-check.ts:1208-1210` (header rule), both eval targets, and `skills/chase-bug/hotfix.md:232-254` (hotfix's own last-attempt rule). The scout's third-slot polarity objection yielded a row reading (Design), not an alternative framing.

Corrected premises carried from the questionary:

- The ticket's Context says each attempt "works one row". Since #118 a return may close same-leg extras; attempts, escalation and history are scoped to the numbered target, and multi-row returns stay as they are.
- AC 4 says the `failed` third slot is "an approach not to repeat". The slot grammar (`agents/loop-implementer.md:18`) lets it carry either "what not to redo" or "what to try differently"; the child reads it with its polarity preserved (Design, "Child reads its row's history").
- The `gauntlet_setting` tool lives in `extensions/phase-tracker.ts:890-923`; the ticket's `extensions/gauntlet-settings.ts` does not exist. The resolver `extensions/lib/gauntlet-settings.ts` is as named.
- Unverified: live `node eval/run.mjs` runs need model credentials and were not exercised during recon; the named samples run at the finish.

## Human input

Questionary answers, verbatim from the brainstorm:

- Q1 (where does escalateAfter live during a run?) -> C: resolved once at Entry beside maxIterationsPerRow, held in driver memory like the amend grant; user added "no refresh" - never re-resolved inside the loop; a fresh-session restore resolves it at the restore read.
- Q2 (AC 4 third-slot reading) -> B: the child reads the row's prior lines oldest first as ordered guidance - avoid what they say not to redo, follow what they say to try - and never repeats an approach already ruled out; slot grammar unchanged.
- Q3 (equality vs at-or-above) -> B: the first unspent dispatch with attempts >= min(escalateAfter, effective allowance - 1) escalates; identical to equality on every normal path; a row found past the threshold unspent gets its round on the next attempt.
- Approach chosen: 1 (in place, reuse-only). Round 1 and round 2 of the design approved as presented.
- Reporter note (ticket comment): semantics for `escalateAfter: k` - the attempt dispatched when the row's attempts counter already equals k runs on implModel; when k >= effective allowance - 1 the escalated attempt is the last allowed one. A proposed AC about naming escalation status in human stops was removed as unrequested.

## Acceptance criteria

Ticket jjuraszek/pi-gauntlet#119, Acceptance criteria, rows verbatim:

- [ ] `gauntlet_setting({ key: "loopEngine" })` returns `escalateAfter` beside `maxIterationsPerRow`: missing means 3, integers are floored at 1, and a non-integer value falls back to 3 with a warning naming `loopEngine.escalateAfter`, mirroring the `maxIterationsPerRow` handling in `extensions/lib/gauntlet-settings.ts` (unit test in `extensions/lib/gauntlet-settings.test.ts`).
  in-scope
- [ ] For a numbered target with no durable `row <n> escalated` decision, the driver escalates the attempt whose pre-dispatch attempts count equals `min(escalateAfter, effective allowance - 1)`: that attempt is dispatched with `model: <implModel>` and recorded as `row <n> escalated | implModel round | allowed attempts <effective allowance>`; with defaults (allowance 4, escalateAfter 3) the escalated attempt is attempt 4, exactly today's behavior, and allowance 1 still escalates the first attempt.
  in-scope
- [ ] Attempts after the escalated one, up to the effective allowance, run on the ordinary worker model with no model override; escalation stays spent once per row across `retry <n>`, `rows +N`, and resume (eval sample: allowance 10, escalateAfter 3 -> attempt 4 escalated, attempts 5-10 on the worker, stop at 10 of 10).
  in-scope
- [ ] `agents/loop-implementer.md` directs the child to read every `row <n> ...` decision line for its target row from the ledger's `## Decisions` section, oldest first, before choosing an approach, and to treat the third slot of each of that row's `failed` lines (the decision line is `row <n> <done|failed> | <what was done> | <reusable artifacts for done, retry guidance for failed>`) as an approach not to repeat; the driver's `previous decision:` field stays the latest admitted line and the dispatch payload does not grow.
  in-scope
- [ ] A new `eval/loop-implementation` sample has a target row with two prior `failed` lines (attempt 1 rejecting approach X, attempt 2 with a different latest guidance) and another row's `failed` line; its expected facts hold that the child names X as not to retry, orders its own row's history oldest first, and does not use the other row's guidance.
  in-scope
- [ ] `doc/configuration.md` documents `loopEngine.escalateAfter` beside `maxIterationsPerRow` and no longer calls `maxIterationsPerRow` the only active `loopEngine.*` setting; `skills/loop-implementation/SKILL.md` holds the new rules; `node eval/run.mjs loop-implementation <sample>` passes for `escalated-row-attempt`, `spent-row-escalation`, `last-attempt-model-boundary`, the new allowance-10 sample, and the new history sample, with coverage reported as those samples, not target-wide.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-119-escalate-after-row-history
contract:
- create: git worktree add .worktrees/<name> -b <branch>
- destroy: git worktree remove .worktrees/<name> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test (AGENTS.md Testing); npm run build:bins after any extensions/lib/ edit; node eval/run.mjs <target> <sample> for the samples named in Tests
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: .pi/gauntlet-overrides.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: doc/implement-engines.md
Rules: eval/README.md
Rules: README.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6
design: owns every path in Design; observable outcomes are the six AC rows above

## Design

Two rules move, nothing new is constructed: the resolver gains a field in the shape it already has, the driver's threshold paragraph changes its predicate, and the child persona's step 2 names the ledger lines it already reads.

### Settings resolver

`extensions/lib/gauntlet-settings.ts`: the inline `PiGauntlet.loopEngine` input shape (`loopEngine?: { maxIterationsPerRow?: unknown; maxIterations?: unknown }`, `:14`) gains `escalateAfter?: unknown`, and `resolveLoopEngine`'s inline return type (`:96`) becomes `{ maxIterationsPerRow: number; escalateAfter: number; warning: string | undefined }`; no named settings interface is introduced. `escalateAfter` resolves exactly as `maxIterationsPerRow` does: an integer is floored at 1 (`0` and negatives become 1 silently), an absent key means 3, a defined non-integer (`"3"`, `2.5`, `null`) means 3 plus the warning `loopEngine.escalateAfter must be an integer; using default 3`, joined to any other loop-engine warning with `; ` through the existing `joinWarn`, after the removed-`maxIterations` warning and after the `maxIterationsPerRow` warning. The repo `loopEngine` object still replaces the preset object wholesale. `gauntlet_setting({ key: "loopEngine" })` in `extensions/phase-tracker.ts` returns the extra field through the existing path; no tool code changes. `npm run build:bins` regenerates the committed bundles.

Remove or replace (each site's replacement is in the subsection named):
- `doc/configuration.md:85`'s sentence calling `maxIterationsPerRow` the only active `loopEngine.*` setting.
- `skills/loop-implementation/SKILL.md:68` "apply the last-attempt escalation check" -> "apply the escalation threshold check"; `:76` the `attempts == effective allowance - 1` predicate paragraph (Driver: threshold rule); `:78` "dispatch that last allowed attempt", "including a new last allowed attempt", and "With no marker and recoverable history, apply the normal last-attempt predicate after retry or `rows +N`" (Driver: threshold rule); `:131` the escalated-rejection and admitted-miss arithmetic (Driver: recovery after an escalated round); `:47` "Skip Entry step 1 for an admitted ledger; settings apply only to fresh seeding" (Driver: restore).
- `skills/gauntlet-resume/reference/reconstruction.md:96` "Skip Entry step 1 entirely" and `:98` "With an existing allowance, use it without settings resolution or a migration commit" (Driver: restore); `doc/implement-engines.md:60` "without re-reading loop settings".
- the contract-test tokens pinning that text: `scripts/loop-engine-contract.test.mjs:92-118` (threshold block), `:128-138` (spent-escalation and Human stop recovery tokens), `:657` and `:672` (`last allowed attempt` in `doc/configuration.md` and `doc/personas.md`), and `scripts/brief-contract-lint.test.mjs:87,99` (the two reconstruction sentences); replaced by the tokens in Tests.
- last-attempt escalation statements in `doc/configuration.md:61,63,75,129`, `doc/personas.md:9`, `doc/implement-engines.md:84`, `README.md:42` (Documentation impact).

Add:
- `escalateAfter?: unknown` in the inline `PiGauntlet.loopEngine` shape and `escalateAfter: number` in `resolveLoopEngine`'s return, with its unit-test cases in `extensions/lib/gauntlet-settings.test.ts` and the tool-level deep-equality case in `extensions/phase-tracker.test.ts`.
- Entry capture, the restore-boundary capture, the threshold rule and the recovery rule in `skills/loop-implementation/SKILL.md` (below); the narrowed restore sentences in `skills/gauntlet-resume/reference/reconstruction.md` step 4.
- the history clause in `agents/loop-implementer.md` Procedure step 2 (below).
- `doc/configuration.md` loop-engine row for `escalateAfter` and the corrected escalation sentences; corrected sentences in `doc/personas.md`, `doc/implement-engines.md` and `README.md`, plus the `README.md` settings-inventory row (Documentation impact).
- `eval/loop-implementation/samples/allowance-10-escalate-after` and `eval/loop-implementation/samples/row-history-guidance`; `eval/loop-implementer/samples/row-history-guidance`; rewritten facts in `eval/loop-implementation/samples/spent-row-escalation` (`unspent`), `row-budget-actions` (`missing`, case snapshot 6), `legacy-cap` (`legacy`) and `eval/gauntlet-resume/samples/durable-cap` (`idempotent`); the affected targets' `intent.md` updated.
- regenerated `bin/*.mjs` bundles.

### Driver: Entry holds the threshold

`skills/loop-implementation/SKILL.md` Entry step 1 retains `escalateAfter` beside `maxIterationsPerRow` from the same `gauntlet_setting({ key: "loopEngine" })` call. The value is held in driver memory for the run like the decoded amend grant: it is never written to the ledger, never printed, never a `plan_check` header, never re-resolved inside the loop - not per dispatch, and not after an amendment commit's grant re-decode. A settings edit therefore takes effect at the next fresh-session resume, not mid-run. Entry's existing "stop on an unavailable settings tool" covers the resolver being unreachable at Entry; there is no new in-loop stop.

### Driver: restore captures the threshold once

A fresh-session restore has no held value. It resolves `escalateAfter` exactly once at the authorized-restore boundary where `SKILL.md:21` re-decodes the grant - the same point `reconstruction.md` step 4 ("Shared allowance boundary") passes through on bare-worktree and brief routes alike - with one `gauntlet_setting({ key: "loopEngine" })` call. Legacy migration (step 4.2) reuses that single read for `maxIterationsPerRow` instead of making its own; with an existing `allowance:` the read supplies `escalateAfter` only and the ledger allowance stays authoritative, with no migration commit and no reseeding. The no-settings sentences narrow to allowance reseeding: `SKILL.md:47` becomes "Skip Entry step 1's allowance seeding for an admitted ledger; the allowance setting applies only to fresh seeding, and the restore boundary resolves `escalateAfter` once"; `reconstruction.md:96` "Skip Entry step 1 entirely" becomes "Skip Entry step 1's allowance seeding" and `:98` "use it without settings resolution or a migration commit" becomes "use it without allowance resolution or a migration commit"; `doc/implement-engines.md:60` "without re-reading loop settings" becomes "without re-reading the allowance setting". With the settings tool unavailable at that boundary, stop before any dispatch using the migration stop's form, `cannot resolve escalation threshold: settings tool unavailable (loopEngine.escalateAfter)`; never hold a default inside the loop and never refresh later. The resume route still enters the loop at `Before each dispatch`; nothing else about restore order (pending recovery, migration, final validation, refresh) changes.

### Driver: threshold rule replaces the last-attempt rule

In "Before each dispatch", the paragraph beginning "For a numbered target at attempts == effective allowance - 1" becomes:

For a numbered target with no durable `row <n> escalated` decision, compute `threshold = min(escalateAfter, effective allowance - 1)` from the held `escalateAfter` and the row's effective allowance (header allowance plus one per `row <n> retry` line, unchanged). When the row's pre-dispatch attempts >= threshold, this dispatch is the escalated round: resolve `gauntlet_setting({ key: "escalationLoop" })` under option 4 and option 5 alike, require its non-empty `implModel` (including the resolver's main-loop fallback), append `row <n> escalated | implModel round | allowed attempts <effective allowance>`, commit parent `loop: escalate row <n>`, print `escalated round for row <n>`, and dispatch that attempt with `model: <implModel>`. Three clauses of the existing block change wording with the predicate: ordered-table rule 4 reads "apply the escalation threshold check" (`:68`); "dispatch that last allowed attempt" becomes "dispatch that attempt"; "including a new last allowed attempt" becomes "including every attempt up to a raised effective allowance"; and "With no marker and recoverable history, apply the normal last-attempt predicate after retry or `rows +N`" becomes "With no marker and recoverable history, apply the threshold predicate after retry or `rows +N`". The missing-model sentence's "leave attempts at effective allowance - 1" becomes "leave attempts unchanged". Every other sentence of the existing block stays: `Problem: escalationLoop.implModel unavailable` stops before dispatch with attempts unchanged and no marker; the parent commit starts no stagnation window; the escalated round is one of the allowed attempts, never an extra; identity is recovered from `## Decisions` on every dispatch and resume, survives retry, `rows +N`, amendments and resume, and once spent no later attempt carries a model override and no second marker is written; dispatch errors, non-DONE and validation failures consume it.

### Driver: recovery after an escalated round

The Human stop recovery sentences at `SKILL.md:131` assumed the escalated round was the last attempt; they now hold for any attempt. Boundary rejection (dirty, zero or multiple commits) never increments attempts: an escalated rejection leaves attempts at the pre-dispatch count and the `row <n> escalated` decision spent, so after authorized discard/reset the driver dispatches the row on the worker model with no retry or `rows +N` required, subject to the normal boundaries. An admitted validation miss on the escalated round increments attempts by exactly one through `loop: repair row <n>`, retains the spent decision, and returns to the ordered table: a row that reaches its effective allowance stops under rule 2 as today; a row still below it gets its next attempt on the worker model. Exhaustion (rule 2) and stagnation (rule 3) keep their precedence over rule 4 and their windows are unchanged; with defaults the escalated round is still the last attempt, so an admitted miss still exhausts the row exactly as the predecessor describes.

Consequences the rule fixes:

- Defaults (allowance 4, `escalateAfter` 3): threshold 3, escalated attempt is attempt 4 - today's behavior.
- Allowance 1: threshold `min(3, 0)` = 0, the only attempt escalates - today's behavior.
- Allowance 10, `escalateAfter` 3: attempt 4 escalates; attempts 5-10 run on the worker with no model override; the row stops at 10 of 10.
- `escalateAfter` >= effective allowance - 1: clamps to the last allowed attempt.
- `rows +N` before escalation: the clamp moves with the new effective allowance (allowance 2 raised to 10 with `escalateAfter` 3 escalates attempt 4, not attempt 2). A row already at the threshold escalates on its next dispatch regardless of the raise: `spent-row-escalation` snapshot 5 (attempts 3, allowance 4 raised to 5, no marker, model now resolves) escalates the attempts-3 dispatch immediately with one `allowed attempts 5` marker, and when it fails the following attempts-4 dispatch runs on the worker with no override; the snapshot's migrated row (attempts 4, effective allowance 5 after retry, no marker) still escalates its next dispatch because attempts >= threshold. After escalation: no effect on the model.
- Missing-model stop at the threshold: `rows +N` and `retry <n>` no longer move the escalated round away. With attempts 3, allowance 4 and no marker, `rows +1` gives threshold `min(3, 4)` = 3, so the next dispatch is again the escalated round and stops again with `Problem: escalationLoop.implModel unavailable` while the model stays unresolved; budget replies do not bypass the missing-model requirement. The human configures a model (a resolvable `implModel` or main-loop fallback), amends, or stops; the stop still offers retry and `rows +N` because they are valid budget actions, they just do not make the next attempt an ordinary one (`row-budget-actions` snapshot 6, rewritten).
- `retry <n>` on a spent row: worker model, no second marker. On an unspent row at or past the threshold: that retried attempt is the escalated round.
- Escalated round rejected at the boundary or admitted as a miss before the last attempt (allowance 10, attempt 4): see "Driver: recovery after an escalated round" - rejection keeps attempts 3 and recovery dispatches attempt 4 on the worker; an admitted miss sets attempts 4 and attempt 5 runs on the worker; both keep the single marker.
- `>=` rather than `==`: a row found unspent with attempts already past the threshold (a fresh-session restore after `escalateAfter` was lowered, or a pre-#114 ledger migrated through `loop: migrate allowance`) escalates on its next dispatch instead of never. On every path where the driver has observed the row from attempt 0 the two predicates fire on the same attempt. This is the reading of AC 2's "equals".

Hard boundaries keep precedence: rules 1-3 of the ordered table (complete, exhausted, stagnant) are evaluated before the threshold, as today.

### Child reads its row's history

`agents/loop-implementer.md` Procedure step 2 gains, before "Use `previous decision` and `hint`": read every `row <n> ...` line for the target row from `## Decisions`, oldest first, before choosing an approach, and take them as ordered guidance - avoid what a `failed` line's third slot says not to redo, follow what it says to try differently, and never repeat an approach a prior line of this row rules out. Lines of other rows are not guidance for this row. `retry` and `escalated` lines of the row are part of its history and are read in the same pass: the retry hint is guidance; the `row <n> escalated` marker is historical evidence that the row's one escalated round is spent, not a signal about the current attempt's model (the marker survives later worker attempts and rejected escalated returns, and the payload carries no model field), so the child never infers from it that it is the strong-model round. `previous decision` stays the latest admitted target line and remains the tie-break for "most recent". The third-slot grammar at `agents/loop-implementer.md:18` is unchanged - no `avoid:`/`try:` token, no narrowing of `failed` lines to negatives. This is the reading of AC 4's "an approach not to repeat". The dispatch payload fields at `SKILL.md:89` are unchanged; done extras in the same return need no history read.

### Data flow

Setting -> `resolveLoopEngine` -> Entry (or restore-boundary) memory -> ordered-table rule 4 threshold decision -> `row <n> escalated` marker in `## Decisions` -> child reads the row's ordered history, marker included, from the ledger on disk. Nothing new crosses the parent/child boundary.

### Hotfix

`skills/chase-bug/hotfix.md:232-254` keeps its own `attempts == allowance - 1` escalation; `escalateAfter` binds the loop driver only (Out of scope).

## Errors and edge cases

| Case | Behavior |
|---|---|
| `escalateAfter` is `"3"`, `2.5`, or `null` | 3 with warning `loopEngine.escalateAfter must be an integer; using default 3`, joined after any `maxIterationsPerRow` warning |
| `escalateAfter` is `0` or negative | floored to 1 silently, as the allowance is |
| Both `maxIterationsPerRow` and `escalateAfter` malformed | both warnings, `maxIterationsPerRow` first, `; `-joined |
| Settings tool unavailable at Entry | existing Entry stop; nothing new inside the loop |
| Settings tool unavailable at the fresh-session restore boundary | stop before any dispatch with `cannot resolve escalation threshold: settings tool unavailable (loopEngine.escalateAfter)`; no in-loop default |
| `implModel` undefined at the threshold | existing `Problem: escalationLoop.implModel unavailable` stop; attempts unchanged, no marker; `rows +N` / `retry` leave the row at the threshold, so the next dispatch stops again until a model resolves |
| Row found past the threshold and unspent (restore after a lowered setting, migrated ledger) | next dispatch is the escalated round; never two markers |
| `rows +N` / `retry` interactions | per the Consequences list in Design |
| Target row has no prior lines (first attempt) | history read is a no-op |
| Other rows' `failed` lines | not guidance for the target row |
| Escalated-round rejection at the commit boundary | attempts stay at the pre-dispatch count, identity stays spent, recovery dispatches on the worker model with no retry or `rows +N` needed |
| Escalated round admitted as a validation miss | attempts = saved + 1 through `loop: repair row <n>`, identity stays spent, back to the ordered table: rule 2 stops at the effective allowance, otherwise the next attempt runs on the worker |

## Tests

- AC 1 default 3, floor at 1, non-integer warning text, warning order with `maxIterationsPerRow` - `extensions/lib/gauntlet-settings.test.ts` (new table cases beside the `maxIterationsPerRow` ones); tool returns the field - `extensions/phase-tracker.test.ts` loopEngine deep-equality case.
- AC 2 threshold rule text present, equality text absent, clamp and allowance-1 sentences present - `scripts/loop-engine-contract.test.mjs` (tokens at lines 92-118 rewritten: `min(escalateAfter, effective allowance - 1)`, `attempts >= threshold`, `apply the escalation threshold check`, `leave attempts unchanged`; absence of `attempts == effective allowance - 1`, `last-attempt escalation check`, `dispatch that last allowed attempt`); attempt-4 escalation at defaults and allowance-1 escalation - existing `eval/loop-implementation/samples/escalated-row-attempt` and `last-attempt-model-boundary`.
- AC 3 attempt 4 escalated at allowance 10, attempts 5-10 worker, stop at 10 of 10, plus early escalated recovery (a boundary-rejected escalated attempt 4 keeps attempts 3 and recovers on the worker; an admitted-miss escalated attempt 4 sets attempts 4 and attempt 5 runs on the worker; one marker throughout) - new `eval/loop-implementation/samples/allowance-10-escalate-after`; spent identity across retry, `rows +N`, resume - existing `spent-row-escalation` (its `unspent` fact rewritten to the Consequences sequence: attempts-3 dispatch escalates immediately after the raise to 5, the following attempts-4 dispatch is the worker, the migrated attempts-4 / effective-allowance-5 row still escalates its next dispatch); spent-escalation and recovery tokens - `scripts/loop-engine-contract.test.mjs:128-138` rewritten (`including every attempt up to a raised effective allowance`, `apply the threshold predicate after retry or `rows +N``, `leaves attempts at the pre-dispatch count`, `increments attempts by exactly one`, `returns to the ordered table`; absence of `including a new last allowed attempt`, `normal last-attempt predicate`, `attempts at effective allowance - 1`, `to the effective allowance and stops under rule 2`).
- AC 4 persona history clause present, marker described as spent history only, payload unchanged - `scripts/loop-engine-contract.test.mjs` token for the step-2 sentence, absence of `strong-model round` in `agents/loop-implementer.md`, and the unchanged `previous decision: <new conforming line or none>` payload line.
- AC 5 child names X as not to retry, orders own history oldest first, ignores the other row's guidance - new `eval/loop-implementation/samples/row-history-guidance`: the case has two labeled parts, first the driver dispatching the target row (replay role unchanged), then "now act as the dispatched `loop-implementer` child under the bundled persona" reading the ledger; expected facts split by role - driver facts: payload fields unchanged, `previous decision:` is the latest admitted target line, no diagnosis of the prior failures; child facts: names X as not to retry, lists its own row's lines oldest first, does not use the other row's third slot. New `eval/loop-implementer/samples/row-history-guidance` (child target, direct) carries the same child facts.
- AC 6 `doc/configuration.md` names `escalateAfter` and no longer says "only active" - `scripts/loop-engine-contract.test.mjs` assertion; the `last allowed attempt` tokens at `:657` (`doc/configuration.md`) and `:672` (`doc/personas.md`) survive only inside the clamp sentence ("clamped to the last allowed attempt") and the hotfix sentence, with a new `escalateAfter` token for each file; the samples named below run at the finish with `node eval/run.mjs <target> <sample>`, reported as those samples.
- Past-threshold unspent row escalates (`>=`) - `scripts/loop-engine-contract.test.mjs` token for the Consequences sentence; no eval: no migrated-ledger fixture exists and a text rule does not warrant building one.
- Missing-model stop is not bypassed by budget replies - `eval/loop-implementation/samples/row-budget-actions` case snapshot 6 and its `missing` fact rewritten: `rows +1` raises the header to 5 without changing attempts 3 or iterations 10, escalation stays unspent, and the next dispatch is again the escalated round, which stops again until a model resolves; the sample runs at the finish.
- Restore captures `escalateAfter` once, allowance untouched - `scripts/brief-contract-lint.test.mjs:87,99` tokens rewritten to the narrowed reconstruction sentences (`Skip Entry step 1's allowance seeding`, `use it without allowance resolution or a migration commit`); `scripts/loop-engine-contract.test.mjs` token for the restore-boundary stop text; `eval/loop-implementation/samples/legacy-cap` `legacy` fact rewritten ("resume does not remigrate or re-resolve the allowance; its single `loopEngine` read supplies `escalateAfter` only") and `eval/gauntlet-resume/samples/durable-cap` `idempotent` fact rewritten ("does not re-resolve the allowance or make another migration commit"); both samples run at the finish as restored-capture evidence, with unchanged in-session settings covered by `allowance-10-escalate-after` (no re-resolution between dispatches).
- Row with no history - none: the clause is a no-op there, exercised by every existing sample.
- Bundle freshness after the resolver edit - `npm test` (bin bundle freshness check).

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` - Loop engine row for `escalateAfter` beside `:85` (operations / tunable parameter: default, clamp, the `>=` catch-up rationale), and the four last-attempt statements now wrong: `:61` "loop uses `implModel` for each row's last allowed attempt" (loop: the threshold attempt; hotfix's "with `implModel` on the last allowed attempt" in the same paragraph stays true and stays), `:63` "A row stops before its last attempt" (before its escalated attempt), `:75` persona-table "The last allowed attempt passes resolved `escalationLoop.implModel`; both the loop driver and hotfix use this rule" (loop passes it on the threshold attempt; hotfix on its last allowed attempt), `:129` "its last allowed attempt escalates once" (the attempt at `min(escalateAfter, effective allowance - 1)` escalates once, clamped to the last allowed attempt); `doc/personas.md:9` "for the row's last allowed attempt" (for the row's escalation-threshold attempt, clamped to the last allowed attempt); `doc/implement-engines.md:84` "the last allowed attempt and exit-verification repair pass the resolved `escalationLoop.implModel`" (the threshold attempt and the exit-verification repair) and `:60` restore sentence (Driver: restore); `README.md:42` in "What a run looks like" (not "Configuring the gates") - "the last allowed attempt escalates once per row" (attempt `escalateAfter + 1`, default 4, clamped to the last allowed attempt, escalates once per row), and a `loopEngine.escalateAfter` row in the "Configuring the gates" settings inventory beside `loopEngine.maxIterationsPerRow` (`:619`): `3` (floor `1`), "escalated attempt index, clamped to the last allowed attempt", linking the configuration.md loop-engine section; `CHANGELOG.md` - deferred: release
- Derived / memory docs invalidated: none

Materiality bar: `reference/documentation-impact.md`. Skill and persona bodies are implementation surface, listed in Design, not here.

## Out of scope

- A per-run `escalateAfter` override on the approval reply (ticket body).
- Condition-based escalation such as after two consecutive `failed` lines (ticket body; the reporter note's "left open" alternative is not adopted here).
- The removed AC about naming escalation status in human stop messages; stop display is unchanged.
- Hotfix's escalation rule (`skills/chase-bug/hotfix.md`).
- Any change to multi-row returns, seed behavior, allowance accounting, `plan_check`, or the ledger header grammar.
- A `history:` payload field; the child reads the ledger it already has.
- Printing `escalateAfter` at Entry or in stops; the value is held, not displayed.

## Open questions

None.
