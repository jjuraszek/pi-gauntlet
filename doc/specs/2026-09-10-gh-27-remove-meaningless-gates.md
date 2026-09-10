# Remove meaningless human gates; define the post-approval amendment path

**Issue:** jjuraszek/pi-gauntlet#27 (with two deviations from its AC - see [Relation to issue #27](#relation-to-issue-27)).
**Goal:** every human stop in the brainstorm -> ship flow is one of: spec approval, ship disposition, the two design rounds, an approved-spec amendment approval, an in-flight `BLOCKED` / `NEEDS_CONTEXT` / reviewer escalation, or a human-channel write. Everything else is model-owned work. One defined path for changing an approved spec.

## Problem

Six gauntlet runs (Astra-dominant, 2026-09-06..09) show three recurring stops that never changed anything and one recurring event with no defined path:

| Stop | Occurrences | Answer | Class |
|---|---|---|---|
| "Does this replace a prior spec?" | 5 | "no" every time; verbatim pushback: "have you find any spec related? if not than no" | skill-mandated, never a decision |
| Per-section design approval (6+ sections) | every run | early sections changed scope (no-N+1, `user_edited` persistence, concurrency + rate-limit test); error/testing/docs sections were "yes"/"ok" | skill-mandated, granularity too fine |
| "May I split this spec line for `plan_check`?" | 2 | "don't ask, fmt is for you alone" | model-improvised; the trigger is a checker conflict |
| Material spec change after approval (persistence mechanism; sync pool -> async HTTPX) | 2 | improvised each time; one run edited + committed the spec and skipped critique/summary until the user intervened: "what about roast council and summary? follwo the gauntlet" | no defined path |

Current wording conflicts: `writing-plans` says the spec "is frozen once planning starts"; `subagent-driven-development` says the orchestrator may edit it mid-run and "re-run writing-plans' anchor-resolution check". Neither routes through the human.

The `plan_check` conflict: `quote-integrity` requires every code-span literal on a task's anchored spec lines to appear verbatim in the task body; `header-entrypoint` forbids the header entrypoint anywhere outside the header. A spec line carrying both a scoped command and the full-suite entrypoint fails once the entrypoint is quoted into the task body as written; the only exit today is a spec edit.

## Decision summary

| Item | Decision |
|---|---|
| Predecessor question | Removed. Scout names candidate predecessor(s) during recon (bounded procedure below); the model states the candidate in design round 1; approval without correction confirms it. "none" asks nothing. |
| Sweep prohibition | Reworded: grep or path-overlap hits never decide supersession; candidates come from the draft's scout recon or the request. Reading the spec directory is allowed. |
| Design presentation | Two rounds, exactly two design approvals. Round 1: architecture, components, data flow, predecessor statement. Round 2: errors/edge cases, testing, documentation impact. |
| `plan_check` conflict | Fixed in the checker: a required literal equal to the header entrypoint is satisfied by the header, not the task body. No spec-edit rule. |
| Post-approval amendment | One section, owned by `brainstorming`, executed in place (never by invoking the skill): spec diff + one-line impact -> user approves -> plan/tracker update + `plan_check` re-stamp. Redraw test decides amend vs restart. No critique/summary re-dispatch. |
| Red Flags | `brainstorming` and `subagent-driven-development` lists replaced by the exact 10-bullet lists below. |
| New machinery | None. No settings keys, no new tracker states, no new reference files. |

## Changes

### `skills/brainstorming/SKILL.md`

- Delete every per-section wording: Overview sentence fragment "present the design in 200-300-word sections, validating each" -> "present the design in two rounds"; checklist step 6 "in sections, get approval after each" -> "in two rounds, one approval each"; heading "### 6. Present the design in sections" -> "### 6. Present the design in two rounds"; Key Principles bullet "**Incremental validation** — present in sections, validate each." -> "**Two design rounds** — one approval per round."
- Section 6 body: replace "Sections of 200-300 words. Ask after each whether it looks right." with:
  - Round 1: architecture overview, components / responsibilities, data flow, and `supersedes <path>, <scope>` when the draft names a predecessor. Ask once. Approval without correction confirms the predecessor.
  - Round 2: error handling and edge cases, testing approach, `## Documentation impact`. Ask once.
  - Target 300-500 words per round. A revisit after feedback stays inside the same approval point.
- Section "3. Understand the idea" (checklist step 4): delete "Ask once whether the design replaces a prior spec, fully or in part, so the supersession event is captured before spec-writing (see [Marking superseded specs](#marking-superseded-specs))."
- `Marking superseded specs`: "and you **already know which one** (from the questionary, the draft, or the request)" -> "(from the draft's scout recon or the request)"; "Never search, sweep, or audit the spec corpus for candidates: marking is event-driven authorial knowledge only." -> "No mechanical sweep: grep or path-overlap hits never decide supersession." Rest of the section unchanged.
- New section `## Amending an approved spec`, placed after `User Review Gate`:

  ```markdown
  ## Amending an approved spec

  Execute this section in place from any later phase. Do not invoke `/skill:brainstorming` (its entry resets both trackers). Worktree, spec commits, and plan survive.

  1. Edit the spec. Show `git --no-pager diff -- <spec path>` and one line of impact (affected plan tasks / waves, or "no plan yet").
  2. Wait for approval. Change request -> revise, re-show.
  3. No plan yet -> commit the spec; continue. Plan exists -> update affected anchors and tasks: `plan_tracker` `add` for new tasks, `update` for changed ones; anchor-changed completed tasks go back to `pending` and re-run the task loop. A removed task is deleted from the plan; then re-`init` the tracker with the remaining tasks in wave order and `update` every already-completed task back to `complete` (the only permitted `init` after handoff; never `clear`). Re-run `plan_check` until it passes, commit spec + plan together; continue. A task reopened while `verify` or `ship` is in progress: `phase_tracker({ action: "skip", phase: "<current>", reason: "amendment reopened Task N" })`, then `phase_tracker({ action: "start", phase: "implement", force: true })`; later phases re-enter with `force: true` and rerun in full.

  Redraw test: the diff changes the problem statement, adds or removes a component, or moves a component boundary -> redraw. A change inside one component (a persistence mechanism, a worker's HTTP client, dropping a fallback and its task) -> amend. State the call in the same message as the diff; the user overrides either way.

  Redraw: keep the worktree and the approved spec file. `plan_tracker({ action: "clear" })`, `phase_tracker({ action: "reset" })`, `phase_tracker({ action: "start", phase: "brainstorm" })`, delete the plan file, resume at checklist step 4 with the approved spec as the draft (steps 2-3 skipped). Spec-writing overwrites it; the full gate follows.
  ```

- `User Review Gate`: one sentence after the approval paragraph: "Post-approval changes follow [Amending an approved spec](#amending-an-approved-spec)."
- `## Red Flags — STOP`: replace the list with exactly these 10 bullets:
  1. Writing or editing anything outside `doc/specs/` while this skill is active.
  2. Overwriting the draft without reading it in full in the same turn, or using `edit` for the spec-writing overwrite.
  3. Dispatching lint, critique, council, or summarizer while the spec file's line 1 is the context-draft marker.
  4. Running the scope or ambiguity checks inline instead of dispatching the critique pass.
  5. Reaching the gate after a failed or skipped critique pass, or without re-running the placeholder scan on the applied spec.
  6. Composing the gate without the summary `Read` as the last content-producing call, or paraphrasing the summary instead of pasting it verbatim.
  7. Inserting a human stop between gather dispatch and questionary question one.
  8. Running, deploying, or validating the proposed change before approval.
  9. Proceeding to `/skill:writing-plans` before the user approves the spec, or invoking `/skill:brainstorming` to amend an approved spec.
  10. Writing a replacement spec without the known predecessor's banner, or offering a multi-spec split that fails `../shape-ticket/reference/split-axes.md`.

### `skills/brainstorming/gatherer.md`

- Scout template gains, before the "Open questions" instruction: "Predecessor check: list the project's spec directory, read titles and `**Goal:**` lines, open at most five whose topic matches this request, and name any whose design this request replaces or amends with the section(s) affected - `Predecessor: <path>, <scope>` - or `Predecessor: none`. Judge by topic; shared file paths never decide."
- Draft assembly: the answer stays inside `## Codebase recon` (no new section).

### `skills/writing-plans/SKILL.md`

- Anchor rules sentence "Anchors are captured once against the gated spec at plan-writing time — the spec is frozen once planning starts." -> "Anchors are captured against the gated spec at plan-writing time; a change to the approved spec follows brainstorming's [Amending an approved spec](../brainstorming/SKILL.md#amending-an-approved-spec), executed in place."
- `## Boundaries`: add "- Edit the approved spec: only via brainstorming's [Amending an approved spec](../brainstorming/SKILL.md#amending-an-approved-spec)".
- "If you can't list the files, the spec isn't ready. Send it back to `/skill:brainstorming`." -> "If you can't list the files, the spec isn't ready: amend or redraw per brainstorming's [Amending an approved spec](../brainstorming/SKILL.md#amending-an-approved-spec)."
- Red Flags unchanged.

### `skills/subagent-driven-development/SKILL.md`

- Sentence "The spec is frozen at plan time and the orchestrator is its only writer during execution; if you do edit it mid-run, re-run writing-plans' anchor-resolution check before the next wave." -> "The orchestrator is the spec's only writer during execution. Amendment trigger: implementer `BLOCKED` citing a spec defect, or a review finding showing the spec (not the code) is wrong -> pause the fix loop, execute brainstorming's [Amending an approved spec](../brainstorming/SKILL.md#amending-an-approved-spec) in place, resume. Code-vs-spec mismatch stays in the SR loop." Keep the SR-blocking-finding sentence that follows.
- `## Red Flags — STOP`: replace the list with exactly these 10 bullets:
  1. Writing code yourself instead of dispatching.
  2. Pausing between tasks for anything other than `NEEDS_CONTEXT`, `BLOCKED`, a fix-loop escalation, a workflow warning, or a spec amendment.
  3. Dispatching parallel implementers on overlapping files, on a shared mutable runtime resource, or without `worktree: true`.
  4. Making a subagent read the plan, inlining spec excerpts to the spec reviewer, or dispatching without a `SCOPED_TEST_COMMANDS` value.
  5. Dispatching `code-reviewer` before every in-scope spec-review verdict is ✅, or per task inside a wave.
  6. Moving to the next task with either review still showing issues, or skipping the `Implementer Status` parse.
  7. Dispatching fix 3 without a reviewer-emitted `CONVERGING` verdict, or continuing past `STAGNANT` instead of escalating.
  8. Running the full verification entrypoint during the implement phase.
  9. Dispatching a repair before reopening the plan-task indices that own its files, whole-diff CR before parent verification passes, or conformance before the CR result is accepted.
  10. Polling, joining, or relaunching an unexpectedly asynchronous dispatch, or starting on main without explicit user consent.

### `skills/finishing-a-development-branch/SKILL.md`

- Heavy revert row "Amend spec → re-approve → regenerate affected plan/code → re-run verify before ship" -> "Amend spec per brainstorming's [Amending an approved spec](../brainstorming/SKILL.md#amending-an-approved-spec) → regenerate affected plan/code → re-run verify before ship".

### `extensions/lib/plan-check.ts`

- Enforcement edit in `checkQuoteIntegrity`: for non-verification rows, a literal equal to `parsed.header.verificationText` with backticks stripped (when non-empty) is removed from `literals` before the task-body check - the header already proves it. Verification rows unchanged.
- `computeRequiredLiteralsPerTask` drops the same literal, for `checkPlaceholderScan` parity only.
- `checkHeaderEntrypoint` unchanged. The plan template backticks the header entrypoint (`writing-plans` header line `**Verification:**`), so an unbackticked header sharing a prefix with a scoped task command is off-template and out of scope.

### `extensions/lib/plan-check.test.ts`

Fixture: header `**Verification:** \`npm run verify-all\``; spec line anchored by Task 1: "Run `node --test extensions/lib/plan-check.test.ts`; the full suite is `npm run verify-all`."

- Task 1 body contains `node --test extensions/lib/plan-check.test.ts` only -> no `quote-integrity`, no `header-entrypoint` finding.
- Task 1 body omits the scoped command -> one `quote-integrity` finding naming `node --test extensions/lib/plan-check.test.ts`.
- Same fixture -> `placeholder-scan` treats the entrypoint as not required by Task 1 (no exemption-driven placeholder finding).

### `scripts/ci.mjs`

- Presence: `skills/brainstorming/SKILL.md` contains `## Amending an approved spec`; `skills/writing-plans/SKILL.md`, `skills/subagent-driven-development/SKILL.md`, `skills/finishing-a-development-branch/SKILL.md` each contain `#amending-an-approved-spec`.
- Absence: `skills/brainstorming/SKILL.md` contains none of `Ask once whether the design replaces`, `get approval after each`, `validate each`, `Ask after each`, `200-300-word sections`; `skills/writing-plans/SKILL.md` no longer contains `the spec is frozen once planning starts`.
- No Red Flags count assertion in CI; the count is a verify-time command (Testing).

### `doc/specs/2026-07-30-spec-supersession-default-marking.md`

- After the title line: `> **Superseded by:** [doc/specs/2026-09-10-gh-27-remove-meaningless-gates.md](./2026-09-10-gh-27-remove-meaningless-gates.md) - "Decision summary" Trigger row only`.

### `README.md`

- "event-driven only — gauntlet never sweeps historical specs" -> "candidates come from brainstorming's scout recon, never a mechanical sweep".
- After the gate 1 / gate 2 paragraph: "Changing an approved spec later is a conditional diff-approval stop (brainstorming's `Amending an approved spec`), not a third numbered gate."

### `CHANGELOG.md`

- `## [Unreleased]` entry: predecessor question removed (scout-driven candidates); two design rounds; amendment path; `plan_check` `quote-integrity` entrypoint exemption; Red Flags lists replaced; `(#27)`.

## Flow walk-through

Supersession: prompt -> scout runs the bounded predecessor check -> `Predecessor: <path>, <scope>` or `Predecessor: none` in the draft -> design round 1 states it -> user corrects or approves -> banner written at spec-writing (step 7). Zero questions when none.

Amendment during implementation: implementer `BLOCKED` on a spec defect -> orchestrator edits the spec -> diff + impact -> user approves -> anchors and `plan_tracker` updated, `plan_check` passes, commit -> next wave. The implement-start stamp check (`extensions/phase-tracker.ts` hash comparison) already rejects a stale stamp at `implement` start; mid-implement re-stamping is by this path, unguarded at runtime as today.

Observed cases classified: JSONB-patch persistence change -> amend (inside one component); sync pool -> async HTTPX worker -> amend (inside one component, dependency swap). Redraw is reserved for problem-statement or component-boundary changes.

## Edge cases

- Scout names a wrong predecessor: user corrects in round 1; no banner. Scout misses one: existing coverage limit ("unmarked does NOT mean current") stands; the user may name it any time before spec-writing.
- Amendment invalidates a completed task: it goes back to `pending` and re-runs the task loop (SR against the amended anchors) before the next wave; whole-diff CR and conformance at verify are the backstop. Amendment removes a task: earlier waves stay committed; only the tracker list is rebuilt.
- Amend vs redraw is the model's call by the redraw test, stated in the same message as the diff; the user overrides either way.
- Entrypoint exemption is exact-literal only: other code spans on the same spec line remain required in the task body. A spec line whose only literal is the entrypoint yields an empty required set and passes as today's zero-literal rows do.
- Verification rows keep full quote-integrity: the header must contain every literal on their anchored lines.

## Explicitly rejected

- Formatting-only silent spec edit rule in `writing-plans` (issue AC 3): removes the response, not the trigger; adds a conditional exception to "frozen". Replaced by the checker fix.
- Re-running brainstorming steps 9-12 on amendment (issue AC 4): council critique is a whole-spec instrument; the human reasons better about a diff than a fresh 9KB summary. Redraw -> restart instead.
- Title/path matching of predecessor candidates (issue AC 1): issue #4's roast simulated a path-overlap grep on two corpora: 5-22 hits per spec, ~73% driven by one hub file, blind to the 20% of specs citing no paths and to total replacements by construction. Judgment over bounded reading, not matching.
- One design round or zero: early rounds changed scope in 4 of 6 runs; the user chose two rounds, round 2 is the last look before spec-writing.
- Runtime guard on mid-implement spec edits: no new machinery; the diff-approval path plus `plan_check` re-stamp is the contract.
- Strict-prefix exemption in `checkHeaderEntrypoint` for unbackticked headers: off-template.
- CI Red Flags count assertion; `writing-plans` Red Flags rewrite (already 7 bullets).

## Relation to issue #27

Issue AC, verbatim substance:

1. `skills/brainstorming/SKILL.md` step 3 removes the standalone "ask once whether the design replaces a prior spec" instruction. `skills/brainstorming/gatherer.md` lists topic-matching candidate predecessor specs in the draft; brainstorming asks only if that list is non-empty.
2. Brainstorming defines exactly two approval points and names their covered sections. Keep 200-300-word sections; do not imply approval after every section.
3. `skills/writing-plans/SKILL.md` explicitly allows formatting-only approved-spec edits needed for `plan_check` (line splits, whitespace, list markers; no wording change), without prompting. Commit them with the plan. Its frozen-spec sentence links to this exception.
4. `writing-plans` and `subagent-driven-development` each define, or link to, the same non-formatting post-approval amendment path. `brainstorming` gate section links it too. It pauses downstream work and reruns brainstorming steps 9-12; it does not reset the worktree or discard the plan.
5. Brainstorming and SDD Red Flags each have at most 10 bullets. Each is one sentence naming the prohibited action, not an "About to X without Y" construction.
6. `rg -ni "gridstrong|customer-ops|/Users/[^/]+" skills/` is empty; `npm test` passes.
7. CHANGELOG lists all five changes.

Disposition: AC 1 met via bounded scout judgment (not title/path matching); the candidate is stated in round 1 rather than asked separately. AC 2 met; the 200-300-word cap becomes a 300-500 per-round target. AC 3 replaced by the checker fix. AC 4 met with diff approval instead of a steps 9-12 re-run; redraw covers large changes. AC 5, 6, 7 met.

## Testing

- `extensions/lib/plan-check.test.ts`: the three cases above; existing `quote-integrity` and `header-entrypoint` cases stay green.
- Full suite via the repo entrypoint, run once at verify time.
- Generic-content check `rg -ni "gridstrong|customer-ops|/Users/[^/]+" skills/` returns nothing.
- Red Flags count: `awk '/^## Red Flags/{f=1;next} /^## /{f=0} f&&/^- /{n++} END{print n}' skills/brainstorming/SKILL.md` and the same for `skills/subagent-driven-development/SKILL.md` each print 10.
- Design approvals: `rg -c "Ask once\." skills/brainstorming/SKILL.md` prints 2.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (sweep wording; amendment-stop sentence), `CHANGELOG.md`
- Derived / memory docs invalidated: `doc/specs/2026-07-30-spec-supersession-default-marking.md` (partial supersession banner, Trigger row); `AGENTS.md` none (does not describe gate granularity)

## Semver

Patch: wording and a checker relaxation; no rename, no settings change.

## Open questions

None.
