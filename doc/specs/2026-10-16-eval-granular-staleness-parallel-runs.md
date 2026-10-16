# Eval: per-sample assembly subsets and bounded parallel replay

> **Superseded by:** [doc/specs/2026-10-16-gh-64-refresh-disputed-judgments.md](./2026-10-16-gh-64-refresh-disputed-judgments.md) - Component 2 persistence/cancellation and Report and CLI additions, only for explicit judgment refresh and bounded refresh-audit retention.

**Goal:** A skill edit costs the eval only the cells whose prompt it changes, and the cells it does cost run concurrently - the full-target `report.md` stays the committed evidence while a cold `gatekeep-pr` pass takes about the sum of its cell walls divided by the pool size (roughly 4x faster at the default pool of 4) and a reference-file edit replays only the samples that kept that file.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Supersedes:** `doc/specs/2026-10-07-gh-50-universal-eval-template.md`, sections "Replay" (assembly inputs) and "Records and report" (freshness identity, runner loop); the template, judge, intent, refusal, and CI contracts stand.

## Problem

`node eval/run.mjs <target>` is required for every behavior-changing edit under `skills/`, `agents/`, or a prompt file (`AGENTS.md` "Change process"). Two things make it cost the arithmetic sum of every model call:

1. **Serial execution.** Every replay and judge call goes through `spawnSync("pi", ...)` (`eval/run.mjs:20`), inside one plan loop (`eval/run.mjs:189-203`) and one execution loop over samples (`eval/run.mjs:207-243`). A mocked run of 44 calls x 300 ms took 13.5 s wall for 13.2 s of calls: zero overlap. Committed `gatekeep-pr` records hold 172 replay cells whose walls sum to 3890 s (baseline arm) and 4337 s (candidate arm), average 48 s, max 173 s; judge calls are not timed. Session logs for this repo show full runs of 1200-1743 s and per-sample runs of 250-300 s.
2. **Whole-target staleness.** `skillSha` hashes the entire target assembly (`eval/run.mjs` `identity`, keyed in `eval/lib/records.mjs:4-9`). `eval/gatekeep-pr/target.json` concatenates 9 whole files for all 43 samples, so one edit to `reference/sync.md` (read only under `--rebase`, step 2b) stales all 43 candidate cells even though only the 8 samples whose digest carries `--rebase` can change.

Session evidence from 2026-10-13 shows the full run is what caught "the fix created new regressions" on untouched samples, so the full-target run stays the committed evidence; it has to become cheap rather than optional.

Framing: pivoted to "keep full-target evidence, make it cheap" - the request's "full run never" was reframed, with the user's agreement, as "a full run is never what one edit costs".

## Acceptance criteria

none - no ticket

## Design

### Component 1 - per-sample assembly subsets

A `case.md` may carry leading `bundle-: <path>` lines beside the existing `bundle+: <path>` lines (`eval/lib/replay.mjs:48-56` `parseCase`). `bundle-` removes the `target.json` `skillFiles` entry whose `path` equals `<path>` from that sample's assembly. The parser returns `{ bundle, drop, text }`; `assemble` receives the filtered `skillFiles` list for the sample.

Exactness rule: the model receives the subset, and `skillSha` keeps hashing exactly the text sent (`identity` is unchanged). No new logic lands in `records.mjs`: an edit to a dropped file leaves that sample's `skillSha` byte-identical, so the stored cell is reused by the existing `cellReusable` check; an edit to a kept file changes it and the cell is replayed. The record proves what the model saw; it does not prove that the dropped text was irrelevant to the sample - that judgment is the keep rule below, reviewable in the plan.

Token effect: each affected replay prompt shrinks by the dropped files' text, so a sample that drops three of nine reference files sends roughly a third fewer system-prompt tokens per cell.

**Intent binding and judgment freshness.** The intent `for:` SHA keeps binding to the full bundle-free assembly (`eval/README.md` "Records"), so one `intent.md` still covers the whole target and any `skillFiles` edit still refuses until `for:` is updated. To keep that bump from staling every judgment, `intentSha` (`eval/run.mjs:232`) becomes the hash of the intent text with its `for:` line removed - the judge receives only `## Change` and `## Expected to move` (`intentParsed`), never the `for:` line, so the new key is the judge's actual input. A `for:`-only bump therefore reuses every stored judgment whose outputs are unchanged. This recomputation changes `intentSha` once for every committed record; the first run after this ships re-judges stored cells (no replay) and the next commit carries the new values.

**Reuse observable.** The CLI completion line gains the call counts of that invocation: `<target>: <worst> (report.md written; replay <n>, judge <n>, confirm <n>, wall <s>s)`; `--baseline-only` prints `baseline seeded (replay <n>, wall <s>s)` or `baseline fresh`. A sample reused end-to-end contributes zero to all three counts.

Lint (`eval/lib/lint.mjs`, refusal before any spawn, exit 2):

| Condition | Message |
|---|---|
| `bundle-` path not in `target.json` `skillFiles[].path` | `<sample>: bundle- <path> not in skillFiles` |
| `bundle-` removes every `skillFiles` entry | `<sample>: bundle- leaves an empty assembly` |
| `bundle-` on `kind: edit` | `<sample>: bundle- not allowed for kind edit` (sibling of the `bundle+` rule at `eval/lib/lint.mjs:39`) |
| same path in `bundle+` and `bundle-` | `<sample>: <path> in both bundle+ and bundle-` |

A `bundle-` path missing at `--base` is not an error: the sample never reads it.

**First consumer and keep rule.** Every `eval/gatekeep-pr/samples/*/case.md` gains `bundle-` lines. A sample keeps a reference file when any of its `expected.md` facts belongs to a workflow step whose `skills/gatekeep-pr/SKILL.md` row reads that file (the step table and blocker-list owners name their reference file; `rg -n 'reference/' skills/gatekeep-pr/SKILL.md`), or when the author is unsure; `SKILL.md` is never dropped. The plan lists every sample's kept files with a one-line justification each, so the assignment is reviewable; a sample whose facts span the whole workflow keeps everything. The 14 other targets are untouched: a sample without `bundle-` assembles exactly as today, so its committed replay records stay reusable.

### Component 2 - bounded parallel replay

`defaultSpawn` becomes an async adapter built on `child_process.execFile` (which takes `timeout: 600000` and `maxBuffer: 64 MiB` like `spawnSync`; `input` is written to `child.stdin` and the stream is ended). The adapter resolves exactly once with the same `{ status, stdout | stderr, wallMs }` shape, maps a timeout to `stderr: "timeout"` and a `maxBuffer` overflow to `stderr: "maxBuffer exceeded"`, and kills the child on cancellation. `replay()`, `judge()`, `confirm()`, and `runTarget()` become async; the CLI awaits `runTarget`.

A pool with concurrency `EVAL_CONCURRENCY` (default `4`; a value that is not a positive integer refuses with `EVAL_CONCURRENCY must be a positive integer, got <v>`, exit 2) bounds the number of `pi` children alive at once. The pooled unit is one adapter call: a slot is acquired right before the child starts and released when it exits. `replay()`, `judge()` (including its retry attempt), and `confirm()` are orchestration that await pooled calls and never hold a slot while waiting, so a judge awaiting its confirmation replay cannot exhaust the pool and `EVAL_CONCURRENCY=1` runs every call in a strict sequence without deadlock.

Scheduling: every (sample, model, arm) replay cell is independent and is submitted at once; each (sample, model) judgment awaits its own baseline and candidate outputs; `confirm()` keeps re-replaying a `regressed` cell. Plan building (hashes, hygiene, intent check, lint, refusals) stays synchronous and complete before the first child starts, so every refusal is still exit 2 with zero spawns.

Records write once per sample after its last judgment, through `writeChanged`, so finished samples are checkpointed while the run continues. Record rows and report rows are ordered by sample name, then by `MODELS.replay` order, never by completion, so diffs stay stable.

One cell's failure (adapter error, timeout, overflow) records `status: error` for that cell only; sibling cells finish, the report lists it, and the exit code stays 1. No fail-fast: a flaky cell must not discard forty finished ones.

Cancellation (SIGINT): queued work is dropped, running children receive SIGTERM, records already written for completed samples stay, in-flight samples write nothing, `report.md` is not written, exit is non-zero. A rerun reuses the completed samples.

### Report and CLI additions

`eval/lib/report.mjs` gains a run-level `wall: <seconds>` line under the title and a judge `wallMs` column. `judge[model].wallMs` is the sum of that judgment's attempt durations; a confirmation judgment's timing lives on `confirmation.judgeWallMs`. Both are optional record fields; `JUDGE_KEYS` is unchanged, so a record without them is still current. A zero-spawn invocation (every cell and judgment reused) does not rewrite `report.md`, so cached reruns leave the committed evidence byte-identical; its wall time is printed on the CLI line only.

### Unchanged

`target.json` shape, `skillFiles[].slice`/`sliceTo`, record paths, exit codes, the two frozen replay models and the judge, `AGENTS.md` "Change process" requirement of a committed full-target `report.md`, and `scripts/ci.mjs` (never calls a model).

## Errors and edge cases

- The four lint refusals above and the `EVAL_CONCURRENCY` refusal all fire before any model call.
- A sample with no `bundle-` lines behaves byte-for-byte as today.
- `EVAL_CONCURRENCY=1` reproduces today's strict sequence, including through a confirmation replay and a judge retry; the pool test asserts it.
- Provider rate limits at concurrency 4: a rate-limited `pi` call returns non-zero and lands as `status: error` for that cell, visible in the report; the user lowers `EVAL_CONCURRENCY` and reruns, and reuse picks up the finished cells. No retry logic is added.
- A `--base` ref lacking a kept file still refuses with the existing `use --base <ref>` message; a dropped file is not read for that sample.
- Ctrl-C after sample A completed while sample B is in flight: A's records are on disk, B has none, no `report.md`, exit non-zero.

## Tests

`eval/lib/run.test.mjs` (node:test, injected `spawn` seam kept; every runner test migrates to `await runTarget(...)`, and the existing spawn-throws cleanup test adopts the per-cell `status: error` contract):

- Pool overlap: concurrency 2, spawn stub resolving on controlled promises; assert two cells in flight and the third waits until one resolves. Concurrency 1 with a `regressed` cell (confirmation replay + second judgment) and a judge retry: assert strict sequence and completion.
- Staleness: target with two `skillFiles` and two samples, sample B carrying `bundle-` on file 2; run, edit file 2, update `intent.md` `for:` to the new assembly SHA, run again; assert sample A replays and re-judges while sample B contributes zero replay, judge, and confirm calls (the stub counts every call type).
- Intent key: a `for:`-only change to `intent.md` leaves every stored judgment current; a `## Change` edit stales them.
- Lint: each of the four `bundle-` refusal messages, exit 2, zero spawns.
- `EVAL_CONCURRENCY=abc`: refusal message, exit 2.
- Error isolation: one spawn rejects, assert the other cells' records are written and exit is 1.
- Cancellation: SIGINT after one sample's records are written while another is in flight; assert the completed records remain, no record for the in-flight sample, no `report.md`.
- Report: `wall:` line present after a run with spawns; a zero-spawn run leaves `report.md` byte-identical; judge `wallMs` column present; a record lacking judge `wallMs` is still judged current; rows ordered by sample then `MODELS.replay`.
- Existing tests (baseline fresh, stub intent, wordCap, partial title, promotion) pass after the async migration.

New `eval/lib/spawn.test.mjs` exercises the real adapter with deterministic local `node -e` children, no model calls: stdin content reaches the child and is ended; non-zero exit maps to `status: error` with `exit <n>`; empty stdout maps to `empty output`; output over `maxBuffer` maps to `maxBuffer exceeded`; `timeout` kills the child and maps to `timeout`; cancellation kills a sleeping child; each case settles exactly once.

`eval/lib/lint.test.mjs`: the `bundle-` rules alongside the existing `bundle+` edit-kind rule.

**Real-model proof** after implementation, before finish, on the unedited `skills/gatekeep-pr` with `EVAL_CONCURRENCY=4`:

1. After the `bundle-` lines land, `node eval/run.mjs gatekeep-pr --baseline-only --base <merge-base SHA>`: cold, 86 replay cells. The CLI wall must be under `3890 s / 4 x 1.25 = 1216 s` (the committed baseline-arm walls divided by the pool plus 25% slack).
2. Set `intent.md` `for:` to the new assembly SHA, then `node eval/run.mjs gatekeep-pr`: cold candidate arm (86 replays) plus 86 judgments. Record the CLI counts and wall; the bound is `(4337 s + judge sum) / 4 x 1.25`, where the judge sum comes from this run's new `judge[model].wallMs` values - the first measured judge timings in the repo. The committed `report.md` carries the `wall:` line.
3. Verdicts: baseline and candidate prompts are identical per sample, so the expected outcome is `unchanged` on every cell; a `regressed` row that `confirm()` does not reproduce lands as `inconclusive` and is reviewed against the sample's facts in the plan's finish notes; a `regressed` row that reproduces is a real finding about model nondeterminism on that sample and blocks the finish until explained.
4. Granular rerun: append one sentence to `skills/gatekeep-pr/reference/sync.md`, update `for:`, run; the CLI counts show replay equal to twice the number of samples that kept `sync.md` (16 for the 8 `--rebase` samples), judge equal to that same number of cells, and zero for the rest. Revert the sentence and `for:` afterward.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `eval/README.md` - "Iterating on a skill edit" (a reference-file edit re-runs only samples that kept the file; `bundle-` lines and the keep rule; prompt shrink per dropped file; `--baseline-only` seeding after adding `bundle-` lines; timing numbers; operations/procedure), "Records" (`skillSha` hashes the sample's own assembly after `bundle+`/`bundle-`; `intentSha` excludes the `for:` line; major definition), usage block (`EVAL_CONCURRENCY`, default 4, when to lower it; the CLI counts line; tunable parameter); `CHANGELOG.md` - deferred: release
- Derived / memory docs invalidated: `AGENTS.md` "Change process" - the per-sample-partial-run sentence is reworded to name the subset mechanism; `doc/specs/2026-10-07-gh-50-universal-eval-template.md` - supersession banner for the "Replay" and "Records and report" sections

Materiality bar: `reference/documentation-impact.md`.

## Out of scope

- Token or cost accounting in records (only `wallMs` exists; cost lives in pi session logs).
- Dropping the second replay model or the confirmation replay (models are frozen by design).
- A mechanical check that the committed `report.md` is a full-target report (stays `AGENTS.md` prose).
- `bundle-` lines for targets other than `gatekeep-pr`.
- Retry on rate-limited cells.

## Open questions

none
