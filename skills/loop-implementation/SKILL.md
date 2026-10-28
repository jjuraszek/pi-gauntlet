---
name: loop-implementation
description: Use after approval selects the loop engine, or when resuming an acceptance-criteria ledger in the implement phase.
---

# Loop implementation

Run this driver in the main session. Carry the absolute implementation worktree path as a value; run git with `git -C "<worktree>"` and commands as `(cd "<worktree>" && <command>)`. Use the approved spec and resolved plan directory. Read the spec in full. Keep the original prompt for verify. Never initialize a task tracker or run reviewers inside implement.

## Entry

1. Read project overrides below. Resolve `gauntlet_setting({ key: "loopEngine" })` and retain `maxIterationsPerRow` (default 4). Stop on an unavailable settings tool.
2. Resolve verification once using this ordered table. Print `verification command: <command> (<source>)`.

| Observed configuration | Action |
|---|---|
| Overrides `## PR gate` contains `- verification command:` | Use that command; source PR gate. |
| Otherwise overrides has `## verification-before-completion` | Use its exactly one backticked command; zero or several is a configuration error. |
| Neither section supplies a command | Discover the project's test entrypoint from its actual manifest/build instructions; print discovery as source. Stop on an unresolved or ambiguous entrypoint. |

3. Call `phase_tracker({ action: "skip", phase: "plan", reason: "loop engine" })`.
4. Require a clean named-branch implementation worktree. Write `<resolved plan dir>/<spec stem>-ledger.md`. Use this grammar with literal values, not placeholders:

```markdown
# Ledger - loop engine
**Spec:** `doc/specs/example.md`
base: <HEAD SHA before skeleton>
verification: <resolved command>
iterations: 0
cap: <n>

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | open | 0 | |

## Decisions
```

Use the actual repo-relative spec path alone in the Spec header. Read base with `git -C "<worktree>" rev-parse HEAD`. Index every spec AC in order, including nested disposition lines without treating them as extra ACs; keep row text only in the spec. Initialize explicit/absent `in-scope` and `venue:` rows `open`, attempts 0, evidence empty. Initialize only `deviates:`, `deferred:`, `elsewhere:` rows `cut`, attempts 0, disposition text as evidence. Compute cap once as (rows not initialized cut) * maxIterationsPerRow + 1, including the seed dispatch. Write `cap:` immediately after `iterations: 0`: 24 non-cut rows at default 4 yield 97; all-cut yields 1 and exits through rule 1 without a seed dispatch. Later cuts, reopens and requirement-preserving amendments leave cap unchanged; redraw deletes the ledger and reseeds it. Serialize evidence in one physical table cell, result lines separated by semicolons, pipes escaped, plain text without angle markup.
5. Call `plan_check({ planPath: <ledger path> })`. Stop with findings as a configuration error. Commit the stamped skeleton as `loop: seed ledger`; call `phase_tracker({ action: "start", phase: "implement" })`.

For resume, use the admitted ledger, its base and verification command, and durable iterations and cap instead of overwriting it. Skip Entry step 1 for an admitted ledger; settings apply only to fresh seeding. Render rows, cap and decision history; stop on a dirty tree before dispatch.

## Before each dispatch

Read the ledger and require its `cap:` header before the ordered table, including before rule 1. On a missing header stop with `ledger has no cap: line - seeded under the old loopEngine contract`, even for a completed ledger; use the legacy grant below, never derive cap from settings. Count empty child commits and validation misses only after the latest `loop: retry row <n>` commit. Funding alone resets neither window. Preserve every row's attempts and the total iteration cap. Apply this ordered table, starting here after each return or human decision:

| Order | Observed state | Action |
|---|---|---|
| 1 | No `open` or `failed` row | Exit verification. All-cut and baseline-complete ledgers exit normally. |
| 2 | Unresolved row attempts at its allowance | Human stop. Exempt `done` and `cut`, including third-attempt success. |
| 3 | Last two child row commits both changed no file outside the ledger and no row status | Human stop, regardless of funding. Count child `loop: row ...` commits only, excluding seed and parent repair/retry/cut commits. A decision alone is not progress. |
| 4 | `iterations` >= `cap` | Human stop naming the header cap value and every open/failed row with its attempts, before dispatch and before verification. Seed and interrupted dispatches count. |
| 5 | Dispatch allowed | Select target by the priority below. |

Set row allowance to 3 + funded N, increased to the latest `row <n> retry` decision's `allowed attempts <m>` when larger. Recover spent funding per row as `max(0, attempts - 3)`; a mid-loop grant applies prospectively. Before dispatch on a funded row with attempts >= 3 and spent < N print `funded round <k> of <N> for row <n>`, with k = attempts - 3 + 1. Funding buys neither cap bypass nor empty-commit bypass nor an escalated model. Include `budget: <spent> of <N> spent` in funded stops.

Select `seed` until a validated `loop: seed evidence` commit with its `row 0 done` decision and evidence on every non-cut row survives on the branch, independently of `iterations`; otherwise select the still-unresolved human retry target, then the still-failed row named by the previous decision, then first failed row, then first open row. Use the latest operational `row <n> ...` decision for targeting and the child's `previous decision:` input, skipping cap grant history while retaining the entire Decisions section. Durable status beats a decision's suggestion. Keep the retry hint only for its target.

## Dispatch

Record `HEAD_BEFORE`, copy the ledger text, and take i from the current iterations count. Increment `iterations:` before dispatch in the working tree so the child's commit persists it. Create a unique absolute output path with `mktemp` outside the repository. Dispatch exactly one foreground child in the main implementation worktree, not a nested worktree:

```text
subagent({ agent: "loop-implementer", context: "fresh", async: false,
  cwd: <absolute implementation worktree>, output: <unique absolute temp path>,
  outputMode: "file-only",
  acceptance: { level: "none", reason: "the parent validates the ledger and the commit" },
  task: "iteration: <i>\nspec: <absolute spec path>\nledger: <absolute ledger path>\nbase: <base SHA>\ntarget: <row number or seed>\nprevious decision: <new conforming line or none>\nhint: <human hint or none>" })
```

For `target: seed`, explicitly instruct the child to apply its seed contract even when iteration is greater than 0; carry that instruction in the existing `hint` field. Keep the actual consumed count in `iteration`.

Omit the model override; let the persona override or parent inheritance resolve it. Carry effects only: one file-reference return, one ledger read, git boundary checks. Never read a child transcript or carry reasoning history. Stop on dispatch error or an async handle; never poll, join or relaunch.

## Validate the return

1. Require empty `git -C "<worktree>" status --porcelain` and exactly 1 from `git -C "<worktree>" rev-list HEAD_BEFORE..HEAD --count`. On dirty/zero/multiple commits stop, preserving changes and commits. Use `Stopped: iteration <i> left the tree dirty` or `Stopped: iteration <i> added <k> commits`. Read the ledger from HEAD only after this boundary passes.
2. Validate by dispatched `target`, not iteration number, against the saved copy using this table. Preserve headers including cap and the bumped iterations, row identifiers and prior decisions.

| Target | Required changes | Miss |
|---|---|---|
| Seed | All attempts stay 0; only `open` -> `done` status transitions; every non-cut row gets evidence; cut rows unchanged; exactly one new `row 0 done | seeded <k> rows, closed <m> on baseline | <first row to take>` decision. Partial and complete baseline closure both pass. Never `failed`. | Human stop; never automatic seed retry. |
| Ordinary | Exactly the target row's mutable cells change: status `done` or `failed`, attempts +1, nonempty bounded evidence. Other rows unchanged. Exactly one NEW bounded decision appended, consistent with target and status. | Parent repair below. |

Require ordinary decision grammar `^row <target> (done|failed) \| .{1,200} \| .{1,200}$`; an old conforming line is not a new line. Require check name plus at most three result lines in evidence, serialized with semicolons and escaped pipes as in the persona. Reject wrong targets, foreign cells, missing/malformed/new-extra decisions and changed headers.

On an ordinary miss restore every non-target row, headers (including the saved cap) and prior decisions from the saved copy, retaining the incremented iterations. Set the target `failed`, attempts = saved attempts +1, evidence = `iteration <i>: <concrete miss>`. Remove malformed appended decisions and commit `loop: repair row <n>`. Set previous decision to `none`; otherwise use the new conforming line. Two consecutive validation misses stop because the child is not following the contract. A conforming return resets the consecutive-miss count; parent repair commits do not count toward child-only empty stagnation.

## Exit verification

Run the ledger's `verification:` command exactly once foreground in the worktree. Failure: human stop `Stopped: verification failed with every row closed`, Problem quoting failing output. Preserve closed rows: no reopening and no automatic rerun. Further work requires a human decision. Success: record verified HEAD and clean status; call `phase_tracker({ action: "complete", phase: "implement" })`, then continue immediately below.

## Human stop

Read and apply [menu-layout](../brainstorming/reference/menu-layout.md). Start the message with `gauntlet: question` at every human stop, including the discard/reset authorization ask for a dirty or commit-boundary return. Put it alone on the first output line, followed by a newline before the stop text, without a driver-state preamble, wrapper or code fence. These decisions are neither done nor stuck outcomes.

Leave implement active. Use one screen of plain words: `Stopped on row <n> (<row text>)` for row failures, or the concrete boundary/cap/verification header above. `Problem:` quotes the evidence cell verbatim, identifying the actual spec/code contradiction, failing assertion/output or missing capability, and quotes the last decision line. Include funding budget only when funded. At every stop print `Preserve every row's attempts and the total iteration cap.` Omit round history, model escalation and reasoning traces.

Offer these concrete actions. Offer `cap +N` only at a clean cap or legacy missing-cap stop; dirty-tree and commit-boundary stops keep discard authorization and never offer `cap +N`. When both the row allowance and total cap are exhausted, list independent funding and cap offers despite rule 2 priority. Take separate replies: funding follows the spec's `**Amend-grant:**` contract, cap follows the row below; define no combined syntax.

| Human choice | Durable action |
|---|---|
| Raise cap (`cap +N`) | Parse anchored `cap +<n>` with `<n>` matching `[1-9][0-9]*` and a token boundary (end, whitespace or `\|`); reject `cap +50x`. Trim the optional remainder and optional leading pipe into the words cell. Append `cap +<n> \| <words>` under `## Decisions`; bare `cap +50` writes `cap +50 \|`. Raise the old header cap by N, or set a missing cap to durable iterations + N. Write a missing `cap:` directly after `iterations:`. Commit both changes exactly once as parent `loop: raise cap`, leaving iterations and all attempts unchanged; return to the ordered table. Malformed `cap +0`, `cap +x`, `cap -5` asks once; a second invalid reply holds the same stop with no commit. |
| Retry with hint | Append `row <n> retry | <hint> | allowed attempts <attempts + 1>`, commit `loop: retry row <n>`, resume checks with that target/hint. Never reset attempts or iterations. |
| Amend | Follow `/skill:brainstorming` amendment surface; cut only through an approved disposition amendment. Reconcile ledger and spec in one commit. |
| Stop | Keep phase implement and preserve branch state. |

Serialize the bare decision as `cap +50 |` with an empty words cell. A cap grant resets neither window (empty-child or validation-miss); exclude `loop: raise cap` from child-commit counting. Only retry starts new windows.

For dirty/commit-boundary retry, ask the human to authorize discarding uncommitted changes/resetting to last valid commit. Preserve consumed dispatch count: set iterations to restored HEAD's value +1 before the next normal bump. An interrupted dispatch consumes the same count; recover it from disk/branch rather than silently repeating iteration 0.

For ledger amendments use its line-1 discriminant: no plan writer, plan_check or task-tracker lifecycle. Approved deviates/deferred/elsewhere becomes `cut` with disposition evidence; requirement-preserving amendments leave rows unchanged; a re-bounded done row becomes `open` with `reopened by amendment`. Preserve attempts, iterations and cap. Commit spec + ledger as `loop: cut row <n>` or `loop: amend`. Option 4 stops for amendments, option 5 auto-applies amends, redraw always stops and deletes the ledger with the plan. Never cut automatically.

## After the loop

Read SDD's `After All Tasks Complete`, `../subagent-driven-development/reference/happy-path-run.md`, and `../verification-before-completion/reference/conformance-check.md` IN FULL now with read. Stop on an unreadable reference; do not reconstruct it. Execute this continuation, not the waves engine or a generic verification skill:

0. Call `phase_tracker({ action: "start", phase: "verify" })`.
1. Parent full verification uses the ledger command. Reuse the passing exit run only when HEAD and clean/no-change worktree still match. Commit verification-produced tracked changes. Any repair invalidates that run: rerun the full command successfully before the next gate. No task reopen/update is awaited.
2. Dispatch foreground whole-diff `code-reviewer` per `/skill:requesting-code-review`, from ledger base through committed HEAD, with `SCOPED_TEST_COMMANDS: none`. Apply its fix rounds. Rerun full verification after every repair before re-review/next gate. Carry final SHIP Minor lines verbatim as `whole-diff minors:`, or `whole-diff minors: none`.
3. Run happy path per the fully read reference when overrides has `## Happy path` or the diff selects a row; use the diff-derived row, not a plan header. Pass summary and outcome to the separate fresh `conformance-reviewer`, along with spec path, verbatim original prompt and full diff. Use spec AC rows against the ledger as the checklist. Follow the reference's partition, concern decomposition, fix rounds and Convergence with the ledger command replacing plan Verification. Keep durable Gn identities in reports, without plan_tracker initialization or lifecycle updates. Rerun full verification after repairs. Resolve closureReview settings and reviewer dispatch per the reference. Reviews happen only after complete implement; none inside the iteration loop.
4. Complete verify only on current CONFORMS or valid carried-open deferred inventory per the reference. A started positive-cap fix loop blocking/failing/exhausting with an open fix gap stops, never completes verify. Summarize rows closed, iterations consumed, files changed, test counts and review verdict. Emit exact `## Closure / conformance` schema from the reference: `status: CONFORMS (0 open)` or `status: GAPS (N open)`, then `audited-base: <full HEAD SHA>`, happy-path exactly when run, Deferred/deviates per spec exactly when applicable, all gap/concern fields unchanged, auto-applied fix commits index and whole-diff minors. Read its whole-diff-minors companion when directed. Never rename fields.
5. Immediately invoke `/skill:finishing-a-development-branch <abs worktree path>`. Its menu is the human gate; do not add a ready-to-finish prompt.

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it once per session - a skill that already has the file's content in context from an earlier skill's read skips the read; a restored session has nothing in context and reads it. Read and apply `## conventions` whenever present, without a relevance judgment. Give this skill's named section precedence over conflicting `## conventions` rules. Use other relevant sections - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - to override or extend the instructions above. Project-local `AGENTS.md` is already in context - check it for project-specific routing tables, service paths, and verification commands.

The recognized headings, their readers, and the rules an override cannot change are listed in the [configuration front door](../../README.md#project-specific-overrides); an override extends or replaces the step it names and never lifts this skill's HARD CONSTRAINT or MUST text.
