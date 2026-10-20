# Skill read budget: read once, fit one read, trim the implementer prompt

**Goal:** A gauntlet run reads each skill reference and the overrides file once per session, reads every skill and persona file in a single `read` call, and dispatches implementers with a prompt that carries only what the persona does not.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Supersedes:** `doc/specs/2026-10-18-gh-70-wave-as-one-chain.md`, "D4. Version floor and preflight" section plus every clause that routes an older pi-cohort install to the plain-`tasks:` fallback instead of a stop (incl. L47); `doc/specs/2026-10-19-gh-71-drop-sequential-mode.md`, the N=1 older-runtime fallback requirement (L106). Each predecessor gets a supersession banner naming the clauses.

## Problem

Three read-cost leaks exist in the stage skills:

1. **Repeat reads.** `skills/brainstorming/SKILL.md` instructs a read of `reference/ticket-acceptance.md` at checklist steps 3, 4, and 8 and in its `## Ticket Handling` owner line (L151, "before gathering context or step-4/8 entry"). The spec behind that commit (`doc/specs/2026-10-01-brainstorming-user-entry-boundaries.md:84`) asked for one load before gathering ticket context; the step-4/8 widening was written to serve `gauntlet-resume`'s restore table (`skills/gauntlet-resume/SKILL.md:142`), which continues at the checklist anchor at step 4 or 8 in a fresh session and never opens `## Ticket Handling` itself. The shared "Project overrides" block, identical in 20 skills, re-reads the overrides file in every stage skill of one flow (brainstorm, plan, implement, finish). pi-condense's default `protectedPaths` (`**/skills/**/*.md`, `**/gauntlet-overrides.md`) keep only the newest read per path verbatim and stub the older ones, so a first-use read survives the session and each repeat is pure token cost; a restored session is the one case with nothing in context.
2. **One file over the read cap.** `skills/subagent-driven-development/SKILL.md` is 51,447 bytes, 414 lines; the `read` tool truncates at 50 KB / 2,000 lines, so the orchestrator receives it in two calls. About 2.1k of it is the pi-cohort version preflight (L180-191) and the plain-`tasks:` older-runtime fallback (L241-259, table row L269, clause L277); 5,454 bytes is the happy-path runner prose, shell block, and outcome table in `## After All Tasks Complete` step 3 (L317-377; L313-316 are steps 1-2, parent verification and whole-diff review, and stay), a verify-phase procedure read once per run. The preflight hardcodes `7.4.0` while `package.json` declares `>=7.4.1` and the newest published pi-cohort is 7.4.3: the floor has already drifted across three places.
3. **Redundant implementer prompt.** `skills/subagent-driven-development/implementer-prompt.md` (5,536 bytes) restates escalation, self-review, code-organization, and report-format prose that `agents/implementer.md` (`systemPromptMode: replace`) already carries; #47 (3292be0) moved reviewer conduct into personas and cut the two reviewer templates to "scope plus pointer" but left the implementer template whole.

Premises checked: the fallback is reachable, not dead - pi suppresses peer installation for managed packages (pi `docs/packages.md:88`; SDD L190 says the same), so a 7.3.x pi-cohort can sit beside this package; it is unsupported by the declared floor. Three deterministic tests pin current wording or content and move with the edit: `scripts/brainstorming-contract.test.mjs:58-69`, `scripts/wave-review.test.mjs:44,72-78`, and `scripts/happy-path-run.test.mjs:8-15,41-45` (extracts the `<!-- happy-path-shell -->` block from SKILL.md, executes it, and asserts the runner-error prose there; `scripts/ci.mjs:465` runs it). The request's 8.7k-per-prompt figure was not reproducible (telemetry records tokens, not characters); the template alone is 5.5k, so the pasted task text in that wave was about 3k - the smaller half.

Framing: pivoted on part 3 to persona-owned conduct for `implementer-prompt.md` (the #47 pattern) - plan path plus task line range was rejected because it saves the smaller half, adds a read per dispatch, leaks sibling tasks against the gh-27 isolation rule (SDD L388, `doc/specs/2026-09-10-gh-27-remove-meaningless-gates.md:94`), and drifts when the plan is edited mid-run. Parts 1 and 2 kept as framed.

## Acceptance criteria

none - no ticket

## Design

### D1. Read once: brainstorming and the shared overrides block

`skills/brainstorming/SKILL.md`:

- Checklist step 3 keeps "read [Ticket Handling](#ticket-handling), then follow `gatherer.md`".
- Checklist steps 4 and 8 replace their unconditional "read [Ticket Handling]" clause with a first-use condition: "if `reference/ticket-acceptance.md` is not already in context this session (restored entry, or a redraw after a fresh start), read [Ticket Handling](#ticket-handling) before the rest of this step". `gauntlet-resume` (`skills/gauntlet-resume/SKILL.md:142`) lands on the checklist at step 4 or 8 and never opens the owner section, so the condition lives on the steps themselves.
- The `## Ticket Handling` owner line becomes: "Read [Ticket Handling](reference/ticket-acceptance.md) at first use - before gathering context, even with no ticket. Steps 4 and 8 carry the same read behind an in-context check so a restored session (`gauntlet-resume` routes there) loads it once; a same-session redraw or a second brainstorm in one session reuses the content already in context. Unreadable -> stop with a blocking error, never reconstruct from memory."
- The `## Amending an approved spec` redraw sentence: "resume at checklist step 4 with the approved spec as the draft (steps 2-3 skipped); step 4's first-use check covers the read". A same-session redraw executes in place and does not re-read.

The shared "Project overrides" block in all 20 skills gains one clause after "first found wins - read it": "once per session - a skill that already has the file's content in context from an earlier skill's read skips the read; a restored session has nothing in context and reads it". `skills/forge-skill/SKILL.md`'s own block (L84, the copy source for new skills) carries the same text so future skills inherit it. No lint pins the 20 copies equal today and none is added; the edit is one mechanical replacement of the shared sentence across all 20 files, and the plan's verification counts 20 matches of the new clause and 0 of the old sentence.

`scripts/brainstorming-contract.test.mjs:58-69` moves to the new wording: step 3 still carries the read before "then follow"; steps 4 and 8 carry the conditional read ("not already in context this session"); the owner line matches "at first use" and "restored session".

### D2. SDD fits one read

`skills/subagent-driven-development/SKILL.md`:

- **Preflight.** The L180-191 block is replaced by one guard the parent runs once per implement phase before the first wave: resolve the installed pi-cohort directory and pi-gauntlet's own directory from `pi list` - each package is a source line followed by a more-indented path line; the source is printed verbatim (`npm:pi-gauntlet@7.19.0`, a local path, ` (filtered)` suffix), so the lookup walks source/path pairs and selects the path whose `package.json` `name` is the wanted package (the shipped `grep -A1 'pi-cohort$'` matches the path line too and returns the next package's name line); the preflight fixture's stubbed `pi list` reproduces that layout with another package listed after pi-cohort - read `peerDependencies["pi-cohort"]` from pi-gauntlet's `package.json`, read pi-cohort's `package.json` `version`. The accepted peer format is `>=X.Y.Z`; the bare `X.Y.Z` is the floor. Compare the three numeric components of floor and installed version. Installed below floor -> stop and report `pi-cohort >= X.Y.Z required, found <version>` (bare floor, never `>= >=7.4.3`); pi-cohort not resolvable or `pi list` fails -> `pi-cohort not installed`; pi-gauntlet's `package.json` unreadable or its peer value not of the form `>=X.Y.Z` -> `cannot read peer floor`; installed `version` not `X.Y.Z` -> `cannot parse pi-cohort version <value>`. Every error stops before any dispatch; there is no fallback path. No version number appears in the skill text.
- **Fallback removed.** The "Older-runtime fallback only" fan-out block (L241-259), the "Older-runtime fallback" table row (L269), and the "and older-runtime fallback" clause (L277) are deleted. L258's pointer ("For the fan-out + worktree + patch-integration + conflict mechanics, see `dispatching-parallel-agents`") still serves the retained one-entry `tasks` re-dispatches and in-place repairs and moves under `## Dispatch`. `## Spec-review snapshots` and `### Chain stopped or failed` stay inline unchanged; the snapshot path still serves sibling patches retained after a chain stop or error and fix-round re-reviews.
- **Happy-path runner extracted.** Step 3's happy-path text (the "Happy-path run" lead paragraph through the paragraph ending "Never split the shell block across calls.", including the `<!-- happy-path-shell -->` block and the outcome table; L317-377 today, the semantic boundary is authoritative) moves verbatim to `skills/subagent-driven-development/reference/happy-path-run.md`. Steps 1-2 stay inline. Step 3 keeps: the trigger condition (header `**Happy path:**` line or a diff-selected row), one sentence "`read` `reference/happy-path-run.md` at its absolute path and follow it; unreadable -> stop with a blocking error", and the handoff sentence that passes `Happy path: <abs path to summary.txt> (<outcome>)` into the conformance dispatch. `reference/` is a new directory for this skill; the flat sibling files (`implementer-prompt.md`, `spec-reviewer-prompt.md`, `code-quality-reviewer-prompt.md`, `stop-note.md`) stay where they are.
- Expected size after the three edits: about 45k bytes (51,447 minus the removed blocks is about 43.9k before the replacement preflight and step-3 stub). The size lint in D4 is the binding check, not this estimate.

`scripts/wave-review.test.mjs`: the L44 assertion that a plain `tasks:` fallback block exists is removed; L72-78 asserts the new preflight (matches `peerDependencies` and `pi-cohort >= ` and precedes the first dispatch); a new assertion checks that `read` of `reference/happy-path-run.md` appears in `## After All Tasks Complete` before the conformance-reviewer dispatch, and that the `<!-- happy-path-shell -->` marker lives in the reference file and not in SKILL.md.

`scripts/happy-path-run.test.mjs`: its `readFileSync` of SKILL.md (L8-9) and the runner-error prose assertion (L41-45) re-point at `skills/subagent-driven-development/reference/happy-path-run.md`; every execution scenario (exit codes, `summary.txt`, timeout) stays as is.

`eval/subagent-driven-development/target.json`: adds `reference/happy-path-run.md` to `skillFiles` and extends the SKILL.md slice to include `## After All Tasks Complete` (through `## Red Flags`, or via `bundle+`) so the step-3 read sentence and the conformance handoff are in the assembled prompt, not only the runner. **Baseline for the before/after run:** `eval/lib/replay.mjs:36-45,68-70` and `eval/run.mjs:185-225` assemble both arms from the same `skillFiles` paths and refuse (exit 2) a baseline ref that lacks a file. The plan lands a preparatory commit first that adds `reference/happy-path-run.md` as a verbatim copy while SKILL.md still carries the inline block and the old behavior; the full SDD target run uses `--base <that commit>`. The finished implementation is never its own baseline.

### D3. Implementer template: scope plus pointer

`skills/subagent-driven-development/implementer-prompt.md` keeps, in this order: the task text paste (the verbatim `[FULL TEXT of task from plan - paste it here, don't make subagent read file]` slot and its rule; file ownership stays inside the pasted `Files:` block - the template has no owned-files line and gains none), `SCOPED_TEST_COMMANDS: [...]`, `TEST_CONTRACT: [...]`, the two task-contract consumption sentences from L49-50 (tests call the `via:` seam directly; create every `Create:` path at exactly that path), the test-contract report lines from L113-119 (one `met`/`unmet` line per `SCOPED_TEST_COMMANDS` command with evidence; any unmet -> `DONE_WITH_CONCERNS`), the exact `**Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT` line with its one-line meanings (SDD L267 recovers the prose `**Status:**` and the chain `stopOn` includes `DONE_WITH_CONCERNS`), and one pointer sentence: "Conduct (TDD scenarios, test economy, scope discipline, escalation, report shape) is your persona; this prompt carries only the task and its test scope."

Deleted: the escalation, self-review checklist, and code-organization paragraphs (persona conduct, `agents/implementer.md` owns them), and the "Commit your work" instruction (SDD step 7 folds uncommitted changes with `add -A`; the wave commits, not the implementer). Context and Before You Begin: lines that restate the task's context (spec path, plan path, worktree) are task context and stay; lines that restate persona conduct are deleted. `agents/implementer.md` is unchanged; its frontmatter is byte-identical.

SDD's derivation of `SCOPED_TEST_COMMANDS` and `TEST_CONTRACT` from the task's `**Tests:**`/`**Files:**` blocks (SKILL.md L46) and the test-scope red flag (L388) are untouched. `plan_check` parses plan headers only (`extensions/lib/plan-check.ts:171-177`) and never reads a dispatch prompt, so the verify phase sees the same inputs.

### D4. Enforcement in `scripts/ci.mjs`

Two checks join the existing lint list:

- **Size lint.** Every file matching `skills/**/*.md` and `agents/*.md` must be under 50,000 bytes and under 2,000 lines. Failure names the file, its byte count, and its line count. Implemented in `scripts/skill-size-lint.mjs` with a unit test (`scripts/skill-size-lint.test.mjs`) using an oversized fixture in a temp dir.
- **Floor lint.** `package.json` `peerDependencies["pi-cohort"]` must be `>=X.Y.Z` and `README.md:125`'s install line must name the same `X.Y.Z`. The two existing declarations are the only copies; no third file. Failure names both values. No network call in CI. Implemented in `scripts/pi-cohort-floor-lint.mjs` with `scripts/pi-cohort-floor-lint.test.mjs` (mismatched fixture fails, matching passes).

Newest-released floor: `.agents/skills/release/SKILL.md` "Pair with pi-cohort" (L110) gains a step that runs `npm view pi-cohort version` and refuses the release when that value exceeds the declared floor; the fix is to set `package.json` and `README.md:125` to the newest version in the same edit before releasing. `package.json` and `README.md:125` move to `>=7.4.3` now.

### D5. Evals

Behavior changes under `eval/<target>/` per `eval/README.md`; each target's `intent.md` gains a paragraph naming the new samples and the assembly change (which bumps `for:` and replays every sample of that target).

Assembly: `eval/brainstorming/target.json` extends its slices to include `## Ticket Handling` (the owner line) and the `## Project overrides` block; the `overrides-read-once` case bundles a second stage skill's overrides block (e.g. `writing-plans`) so the cross-stage skip is observable. `eval/subagent-driven-development/target.json` per D2.

Replay: the harness has no tools (`eval/brainstorming/replay.md`, `eval/subagent-driven-development/replay.md`, `eval/implementer/replay.md`), so the read-once and happy-path samples get a sample-specific replay contract: fixed observations ("`reference/ticket-acceptance.md` is in context from step 3" / "not in context; session restored at step 8") and an ordered narrated list of `read` and dispatch actions. The must-hold is the narrated `read` and its position, never reconstructed shell or file contents; an unreadable reference is narrated as a stop. The `trimmed-template-tdd-holds` sample's replay permits the `**Status:**` line and the scoped-command evidence lines; the existing implementer samples keep their output contract (test code only).

| Target | Sample | Must hold |
|---|---|---|
| `eval/brainstorming` | `ticket-read-once` | fresh entry: exactly one narrated `read` of `reference/ticket-acceptance.md`, at step 3 before question one; none at steps 4 and 8 |
| `eval/brainstorming` | `restored-step-8-reads-ticket` | restored entry at step 8 (observation: nothing in context): `read` of `reference/ticket-acceptance.md` at step 8 before the lint |
| `eval/brainstorming` | `same-session-redraw-reuses-ticket` | redraw from the approval gate in the same session (observation: content in context since step 3): no `read`; the ticket rules still apply at step 4 |
| `eval/brainstorming` | `overrides-read-once` | second stage skill in the same session with the overrides content in context: no second `read`; the conventions still apply; when the observation says "unsure whether it is in context", the sample expects a read (the clause is a skip, not a prohibition) |
| `eval/subagent-driven-development` | `old-cohort-preflight-stops` | installed pi-cohort 7.3.1, floor from `package.json` `>=7.4.3`: stop with `pi-cohort >= 7.4.3 required, found 7.3.1`; no plain-`tasks:` implementer dispatch |
| `eval/subagent-driven-development` | `happy-path-reference-read` | plan header carries `**Happy path:**`: narrated `read` of `reference/happy-path-run.md` precedes any runner action; the conformance dispatch carries the `Happy path:` line |
| `eval/subagent-driven-development` | `chain-wave-dispatch`, `chain-stop-blocked`, `singleton-apply-failure` (existing) | premises move from 7.4.0 to the declared floor or newer; chain facts unchanged |
| `eval/subagent-driven-development` | `all-singleton-waves` (existing) | premise moves to the floor or newer; the "how would 7.3.1 supply spec review" question expects a stop, not a fallback |
| `eval/subagent-driven-development` | `patch-review-snapshot` (existing) | premise recast from "7.3.1 fallback" to an accepted sibling patch retained after a chain stop; the `task-spec-review` expectation names the snapshot path, not the older-runtime alternative |
| `eval/implementer` | `trimmed-template-tdd-holds` | a task dispatched through the short template: test written before source, `SCOPED_TEST_COMMANDS` honored, `**Status:**` line emitted |
| `eval/implementer` | `unmet-via-concerns` | scoped commands pass but a `via:` seam obligation is unmet: the report shows that command `unmet` with evidence and `**Status:** DONE_WITH_CONCERNS` |

`node eval/run.mjs <target>` runs for the three targets before the finish (SDD with `--base` per D2); the committed `report.md` is the conformance evidence. Any SDD case naming a pi-cohort version names one at or above the package floor or expects the stop.

## Errors and edge cases

| Condition | Behavior |
|---|---|
| pi-cohort below the peer floor | SDD preflight stops: `pi-cohort >= X.Y.Z required, found <version>`; no wave dispatch, no fallback |
| pi-cohort not resolvable via `pi list`, or `pi list` fails | stop: `pi-cohort not installed` |
| pi-gauntlet `package.json` unreadable, or peer value not `>=X.Y.Z` | stop: `cannot read peer floor` |
| installed pi-cohort `version` not `X.Y.Z` | stop: `cannot parse pi-cohort version <value>` |
| `reference/happy-path-run.md` unreadable | stop the verify step with a blocking error; never reconstruct the shell block |
| Restored session at brainstorm step 4 or 8 | step's first-use check finds nothing in context and reads `ticket-acceptance.md` there |
| Same-session redraw or second brainstorm | content already in context; no re-read |
| Stage skill unsure whether the overrides file is in context | reads it - the clause is a skip, not a prohibition; a repeat read costs little, a missing read costs a wrong convention |
| pi-cohort publishes after a pi-gauntlet release | floor lint stays green (it compares the two in-repo copies); the next `/skill:release` run's `npm view` check refuses until `package.json` and `README.md:125` move to the newest version |
| A skill grows past 50,000 bytes or 2,000 lines | `npm test` fails naming the file; the author extracts to `reference/` |
| Happy-path move | verbatim: outcome table, exit codes, `summary.txt` contract unchanged; `conformance-check.md` and `finishing-a-development-branch` Step 3.5 see identical inputs |

## Tests

Deterministic (`npm test` via `scripts/ci.mjs`):

- `scripts/brainstorming-contract.test.mjs` - D1 wording at steps 3/4/8 (conditional read at 4/8) and the owner line.
- `scripts/wave-review.test.mjs` - D2 preflight text present, fallback block absent, mechanics pointer under `## Dispatch`, happy-path reference read before the conformance dispatch, shell marker only in the reference file.
- `scripts/happy-path-run.test.mjs` - shell block and error prose loaded from `reference/happy-path-run.md`; all execution scenarios retained.
- `scripts/skill-size-lint.test.mjs` - oversized fixture fails, in-range passes.
- `scripts/pi-cohort-floor-lint.test.mjs` - `package.json`/`README.md` mismatch fails, match passes.
- `rg -c` sweep in the plan's verification - 20 files carry the new clause, 0 carry the old "first found wins - read it." sentence without it.

Eval: the samples in D5 (new and migrated), full runs of all three targets.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (install floor line L125: `>= 7.4.3`, pinned to the newest pi-cohort at each release - operations / tunable parameters); `AGENTS.md` Testing paragraph (the size lint and floor lint join the `npm test` list - major procedures); `.agents/skills/release/SKILL.md` "Pair with pi-cohort" item (`npm view pi-cohort version` check and the two-copy bump - major procedures); `CHANGELOG.md - deferred: release`
- Derived / memory docs invalidated: `doc/specs/2026-10-18-gh-70-wave-as-one-chain.md` and `doc/specs/2026-10-19-gh-71-drop-sequential-mode.md` carry supersession banners naming the fallback and floor clauses. `doc/personas.md` does not describe the implementer template's prose sections (checked: no match for the template, self-review, escalation, or report format under the implementer) - no change.

## Out of scope

- Moving `### Chain stopped or failed` out of SDD (stays inline; the orchestrator needs it mid-wave).
- A global "read every reference once" rule in the shared block (approach C of the part-1 question, declined).
- Any change to `agents/implementer.md` body or frontmatter.
- A runtime floor check outside SDD (extensions do not verify the pi-cohort version).
- Relying on pi-condense stubbing as the fix (approach 3, declined: pi-gauntlet has no code coupling with pi-condense).
- A re-read exception for an overrides file edited mid-session (outside the first-use / restored-session rule).
