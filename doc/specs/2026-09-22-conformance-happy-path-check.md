# Project-declared happy-path run as conformance evidence

> **Superseded by:** [doc/specs/2026-09-23-workflow-verification-false-confidence.md](./2026-09-23-workflow-verification-false-confidence.md) - D3 execution procedure and Testing runtime coverage only.

**Goal:** Let a project declare end-to-end happy-path commands in its gauntlet overrides file, keyed by the repo paths they cover; the verify phase runs the applicable one once before the conformance audit and hands the transcript to the conformance reviewer as runtime evidence, so integration breaks between services surface before the PR instead of on staging.

## Problem

The conformance gate audits the diff against the spec and the original prompt. Its reviewer may run tests and quote output (`agents/conformance-reviewer.md:4,45`), and the parent runs the plan-header `**Verification:**` set before R0 and again at Convergence (`skills/verification-before-completion/reference/conformance-check.md:194`, `skills/subagent-driven-development/SKILL.md` "After All Tasks Complete" steps 1-2). Nothing in the flow knows that a project has a way to boot its services and drive one request end to end, so multi-service changes (a producer in one service, a consumer in another, a broker between) ship with green unit suites and break the first time the two ends meet on staging. The cost is a hotfix cycle per miss.

The overrides file already carries the project's full verification command, which `writing-plans` copies into the `**Verification:**` header (`skills/writing-plans/SKILL.md:157`), and the reviewer already cites command output as evidence. The missing piece is a declared happy-path command, a rule for when it applies, a place to run it, and a channel for its result to reach the audit.

## Acceptance criteria

none - no ticket

## Design

### D1. Overrides section

A project opts in with a `## Happy path` section in its gauntlet overrides file holding one table:

```markdown
## Happy path

| Row | Paths | Command | Timeout |
|---|---|---|---|
| dashboard | `dashboard/` | `script/e2e-dashboard` | 3m |
| excavation | `excavation/` | `cd excavation && make e2e` | 2m |
| cross-cutting | `dashboard/`, `excavation/`, `docker-compose.yml`, `Makefile` | `script/e2e-stack` | 5m |
```

- `Row` is a free label; `cross-cutting` is reserved: it applies when the change matches two or more non-`cross-cutting` rows, or when a path is inside its own `Paths` and inside no other row's `Paths`, and it takes precedence over a single matched row (so root compose files, Makefiles, and lockfiles a stack run depends on select it on their own, while a change inside one project row alone selects that row).
- `Paths` is a comma-separated list of repo-relative prefixes; a path is "inside" a row when it starts with one of them. Paths matching no row are ignored for selection and for the re-run test (D6).
- `Command` is repo-relative and runs through `bash -c`, so `cd`, `&&`, and env assignments work. It is self-contained and worktree-safe: it boots what it needs, drives one flow, exits, traps `TERM`/`INT` to tear down (containers are not in the process group, so the script owns their teardown), and writes only to gitignored paths or outside the worktree. pi-gauntlet knows nothing about brokers, compose files, or ports.
- `Timeout` is optional, grammar `\d+(s|m|h)`, default `10m`; a malformed cell falls back to the default and the header line omits the suffix.
- Exit code contract: `0` = passed; `75` (`EX_TEMPFAIL`) = environment unavailable (`not run`); `126` = not executable (`not run`); any other non-zero = failed.
- Host dependency: GNU `timeout` (`timeout` or `gtimeout` on PATH); named in the README contract.
- No section, or no matching row, leaves every downstream step exactly as today.

The contract text (table shape, prefix matching, `cross-cutting` semantics, exit codes, timeout grammar and default, worktree-safety and teardown requirements, host dependency) lives in `README.md`'s overrides-file contract.

### D2. Plan header line

`writing-plans` recon (the fixed scout template) reports the `## Happy path` table verbatim in its recon report. The plan writer selects the row at File Structure time, after `Files:` are known: `cross-cutting` when the union of `Files:` matches two or more non-`cross-cutting` rows, or a path inside `cross-cutting`'s own `Paths` and no other row's (absent -> no line); else the single matched non-`cross-cutting` row; none -> no line. The plan header gains one optional line directly under `**Verification:**`:

```markdown
**Happy path:** cross-cutting - `script/e2e-stack` (~5m)
```

The row label rides on the line so D3 and D6 can find the row's `Paths` without reverse-mapping the command. This is the plan-time default and the `plan_check` anchor; D3 re-derives the row from the real diff at run time.

Like `Verification`, the command appears only on this header line, never in a task's `Tests:` or `Run:` block, and never as free text in wave scope. The `Spec coverage` table never names `Happy path` as an owner: coverage is inferred at audit time (D5), never declared in the plan.

`plan_check` (`extensions/lib/plan-check.ts`) accepts the line when present: `**Happy path:** <label> - <command in backticks>` with optional ` (~<duration>)`. Checks added: malformed line fails; a task `Tests:` segment equal to the happy-path command fails as full-suite; `checkHeaderEntrypoint` extends to the happy-path command so `Run:` lines and free text in wave scope fail as for `Verification`. A coverage-table owner cell `Happy path` is already `ownerMalformed` under the existing "owner cell is not ..." reason - no code change, one pinning test. Absence of the line is never a failure.

### D3. Parent run before R0

In `skills/subagent-driven-development/SKILL.md` "After All Tasks Complete", the happy-path run is the first action of step 3, after step 2's whole-diff review is accepted and the full `Verification` set is green on the HEAD to be audited. The parent:

1. Binds `HP_DIR=$(mktemp -d)` first. Re-derives the applicable row from `git -C "<worktree>" diff --name-only <base>..HEAD` (`<base>` = the branch point) with the D2 rule (no `cross-cutting` row when it would be selected -> no run, no outcome line). Runs the diff-derived row; when it differs from the header line, records `row: <diff-derived> (header: <label>)` in `summary.txt`.
2. Pre-checks: binds `TO=$(command -v timeout || command -v gtimeout)` -> else `not run - no timeout binary`; the command's first token after any leading `NAME=value` assignments resolves via `(cd "<abs worktree path>" && bash -c 'command -v <token>')` -> else `not run - command not found`. A pre-check failure still writes `$HP_DIR/summary.txt` with only the outcome, `head:`, and `row:` lines (no blank line, no tail - there is no `transcript.log`) and counts as a run for the D4 input and the D7 sentinel.
3. Snapshots `git -C "<worktree>" status --porcelain --untracked-files=all`, then runs, with `HP_CMD` holding the row's command verbatim:

```bash
(cd "<abs worktree path>" && "$TO" -k 30s <duration> bash -c "$HP_CMD") >"$HP_DIR/transcript.log" 2>&1
EXIT=$?
```

4. Re-snapshots status; a difference is `failed - dirtied worktree: <paths>` regardless of exit code; the listed paths are never staged or committed as deliverables - untracked residue is removed and tracked residue restored (`git -C "<worktree>" checkout -- <paths>`) before the conformance dispatch, so the tree is clean when the audit-time input rule runs. Then classifies the outcome per the table and writes the summary:

```bash
{ echo "<outcome line per table>"; echo "head: $(git -C "<abs worktree path>" rev-parse HEAD)"; echo "row: <label>"; echo; tail -n 200 "$HP_DIR/transcript.log"; } >"$HP_DIR/summary.txt"
```

| Condition | Outcome line |
|---|---|
| worktree differs after run | `happy-path: failed - dirtied worktree: <paths>` |
| exit 0, worktree clean | `happy-path: passed` |
| exit 75 | `happy-path: not run - environment unavailable: <last line of transcript.log>` |
| exit 124, or 137 after the `-k` kill | `happy-path: failed - timed out after <duration>` |
| exit 126 | `happy-path: not run - not executable` |
| pre-check failed | `happy-path: not run - <reason>` |
| any other non-zero | `happy-path: failed (exit <n>)` |
| no header line and no diff-derived row | no run, no outcome line |

A timeout is `failed`, not `not run`: the canonical cross-service break (a consumer that never receives the message) manifests as a hang, and the reviewer must see it. `not run` is reserved for cases where the command never executed. The full `transcript.log` stays in `$HP_DIR` for the human; the reviewer receives `summary.txt` only. A `failed` or `not run` outcome never stops the flow and never becomes a repair item at this step - it is evidence for the audit.

The parent runs sub-steps 3-4 (snapshot, run, re-snapshot, classify, summary) in one bash call, or substitutes the literal `HP_DIR` and `TO` values into each later command: shell variables do not survive between tool calls.

### D4. Reviewer input

The conformance-check dispatch (`conformance-check.md` "Dispatch a fresh reviewer") gains a fourth input after spec, prompt, and diff:

```
Happy path: <abs path to $HP_DIR/summary.txt> (<outcome>)
```

`<outcome>` is the outcome line without its `happy-path: ` prefix.

Omitted when no run happened. The ad-hoc conformance path in `finishing-a-development-branch` (no plan, no header) never runs a happy path and never passes this input.

### D5. Reviewer rule

`agents/conformance-reviewer.md` gains:

- In the evidence step: read the happy-path summary as runtime evidence; never run the happy-path command yourself - the transcript is the only runtime evidence. Transcript evidence is cited as `<abs summary path>:<line>`, a third form beside `file:line` and `absent`.
- On `passed`: cite transcript lines when they confirm an AC or Design clause.
- On `failed`: gap only the rows the run demonstrably exercised and failed, verdict `PARTIAL`, `evidence:` quoting the failing transcript lines, `origin:` the row's clause per the existing "origin quote or it isn't a gap" rule. When the failing component lies outside the audited diff (pre-existing breakage), the gap is `recommended: rescope` with the transcript as evidence, never `fix` - the fix loop must not spend capped rounds on code the change never owned.
- On `not run`: audit from code as today.
- Output format gains one line after `Origin drift`: `Happy path: passed | failed - attributed to G<n>,... | failed - unattributable | not run - <reason>`; omitted when no summary was passed. `failed - unattributable` is the case where no origin clause ties to the failure: no gap card is emitted, and the line carries the signal.

Coverage is the reviewer's inference; no AC-to-happy-path mapping exists in the spec or plan grammar.

### D6. Fix-round re-run rule

In the fix loop (`conformance-check.md` "Per round"), before the delta re-audit, when the prior audit received a happy-path input: if `$HP_DIR` no longer exists (finish-time `fix-now` in a resumed session), re-derive the row per D3 step 1 from the overrides table, then re-run D3 when `git -C "<worktree>" diff --name-only <audited-base>..HEAD` contains a path inside that row's `Paths` or an open gap's `evidence:` cites the summary path, else pass `not run - no prior transcript`. Otherwise re-run D3 into a fresh `$HP_DIR` when either:

- `git -C "<worktree>" diff --name-only <head from current summary.txt>..HEAD` contains a path inside the current row's `Paths` (the `head:` line is the diff base, so changes from skipped rounds accumulate into the next comparison);
- an open gap's `evidence:` cites the summary path.

Otherwise pass the previous summary unchanged. When a re-run's outcome differs from the previous one, the delta re-audit scope extends to every row whose `evidence:` cites the summary. Rounds touching only paths outside every row never re-run.

### D7. Closure sentinel and finish render

The `## Closure / conformance` block (`conformance-check.md` "Closure block", `subagent-driven-development/SKILL.md` step 4, `finishing-a-development-branch/SKILL.md` freshness precondition) gains an optional third sentinel line after `audited-base:`, carrying the value of the reviewer's `Happy path:` line of the final audit (the text after `Happy path: `):

```
happy-path: passed | failed - attributed to G<n>,... | failed - unattributable | not run - <reason>
```

Present exactly when a run happened; not a concern card, so the sentinel count is unaffected. `finishing-a-development-branch` Step 3.5 prints the line under its verdict line in both the zero-gap fast path and the carried-open render, as one informational non-blocking line (same shape as the `auto-applied fix commits` line). The PR body is unchanged: it describes the change, not its validation.

### D8. Out of scope

- Any project-side script, compose file, broker setup, LLM mocking, or per-worktree port/queue isolation. The overrides contract states the command must be worktree-safe; achieving that is the project's work.
- A `settings.json#piGauntlet.*` key. The command is skill-consumed prose, so it lives in the overrides file like `Verification`.
- AC-level declaration of what the happy path proves (rejected in favour of D5 inference; revisit as an amendment if inference proves too loose).
- Running the happy path in `verify-before-ship` or `gatekeep-pr`; ship evidence stays CI.
- Surfacing the outcome in the PR body.

## Errors and edge cases

- Header present, script missing from the branch -> pre-check fails, `not run - command not found`; never a gap.
- `timeout -k 30s` sends `TERM` then `KILL`; a script that does not trap `TERM` leaves its stack up - the next run's exit 75 surfaces it, and the contract names the trap requirement.
- Untracked or tracked residue in the worktree after the run is `failed - dirtied worktree` and is cleaned before the conformance dispatch, so the closure freshness rule never fires on happy-path artifacts at finish.
- Summary bounded to header lines plus a 200-line tail so the reviewer's input stays small.
- Two worktrees running the happy path concurrently on shared ports or queues: pi-gauntlet does not serialize; the overrides contract tells authors the command must be safe from any worktree.
- Happy path fails in a component the diff never touched: D5 - `rescope` when an origin clause ties to it, `failed - unattributable` otherwise; visible in the closure sentinel and the Step 3.5 render.
- Plan-time row differs from diff-derived row (repairs touched an unplanned project): D3 runs the diff-derived row and records the mismatch.
- `plan_check` on a plan written before this change: no header line, no checks fire.

## Testing

- `extensions/lib/plan-check.test.ts`: header line accepted with and without `(~5m)`; line without label or backticks rejected; task `Tests:` segment equal to the happy-path command rejected as full-suite; wave `Run:` line and free text containing the command rejected by `checkHeaderEntrypoint`; coverage owner cell `Happy path` rejected (pinning test, existing reason); plan without the line passes unchanged.
- `scripts/ci.mjs` skill lint and stage-skill lint cover the skill text (the parent runs the command in the `(cd "<worktree>" && ...)` subshell form the stage skills already use; no bare `cd`).
- No extension executes the command, so no runtime test.

## Surfaces changed

| Surface | Change |
|---|---|
| `README.md` overrides contract; README verify narrative (step 4) | `## Happy path` section contract; gate order gains the happy-path run before the conformance gate |
| `skills/writing-plans/SKILL.md`, `reference/plan-contract.md` | recon reports the table; File Structure row selection; `**Happy path:**` header line; header-only rule |
| `extensions/lib/plan-check.ts` + test | D2 checks |
| `skills/subagent-driven-development/SKILL.md` | D3 run as first action of step 3; step 4 sentinel line |
| `skills/verification-before-completion/reference/conformance-check.md` | D4 input, D6 re-run rule, D7 sentinel line |
| `agents/conformance-reviewer.md` | D5 clauses and output line |
| `skills/finishing-a-development-branch/SKILL.md` | D7 Step 3.5 render; freshness precondition mentions the optional third line |
| `CHANGELOG.md` | Unreleased entry |

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (overrides-file contract: `## Happy path` section; verify-step narrative gains the happy-path run); `CHANGELOG.md` (Unreleased entry)
- Derived / memory docs invalidated: none (`doc/configuration.md` untouched - no new settings key; skill and persona bodies are implementation surface)

Per `reference/documentation-impact.md`.

## Open questions

none

## Appended during questionary

- Q1 -> (b): happy-path declared as a per-project table in the overrides file; a row applies when the diff touches that project, `cross-cutting` when two or more.
- Q2 -> (b): the parent runs it once before R0 and passes the transcript path as a fourth reviewer input.
- Q3 -> (c): fix rounds re-run only when the round diff touches a covered project - env setup/teardown is expensive.
- Q4 -> (b): "not run" is distinct from "failed"; the happy path is optional, a hotfix mitigation, never a mandatory gate.
- Q5 -> (b): no formal AC-to-happy-path mapping; the reviewer infers coverage from transcript and ACs.
- Approach 1 (sibling of `Verification`) chosen over folding into `Verification` (loses AC linkage, reruns every round) and reviewer-runs-it (wrong tool for process supervision, no timeout owner).
- Predecessor check: `doc/specs/2026-09-13-lean-conformance-loop.md` owns the Convergence full-run rows (D4/D5 there); this spec adds a parallel evidence step before R0 and does not change Convergence. `doc/specs/2026-09-06-gh-24-final-verification-ownership.md` owns `Verification`-owned coverage rows; this spec deliberately gives `Happy path` no owner role. Predecessor: none.
