# Per-task test contract with mechanical scope check (gh-28)

**Ticket:** [jjuraszek/pi-gauntlet#28](https://github.com/jjuraszek/pi-gauntlet/issues/28)

## Problem

Evidence (#28, 8508 subagent runs): first-pass `NEEDS_REWORK` on terra 45% (n=765); 32% of 999 SR findings are test/fixture requirements (fixture at the wrong path, test calling the assessor directly instead of the spec-named entry point `each_finding`); each miss costs ~5 min of re-dispatch + re-review. The implementer is never told the task's test contract.

Implementers receive a plan task and `SCOPED_TEST_COMMANDS`, but the plan has no defined place those commands come from: `writing-plans` embeds them in step `Run:` lines, `plan_check` does not parse steps, and the SDD parent fishes them out of prose (`skills/subagent-driven-development/SKILL.md:58`). The "every code-touching wave declares a scoped test command" rule (`skills/writing-plans/SKILL.md:137`, `:301`) is Self-Review judgment only. `header-entrypoint` (`extensions/lib/plan-check.ts:778-817`) bans only the exact header `**Verification:**` string inside waves, so with header `npm test && npm run lint` a task step `npm test` passes. Nothing mechanically proves a task's tests are selective, and nothing mechanically rejects a full-suite run during implementation.

Separately, `skills/writing-plans/SKILL.md` (~3.8k words) interleaves the mechanical grammar `plan_check` enforces with process guidance across four sections; the check list is restated in `doc/configuration.md:63`, and the check count in `README.md:74` and the tool description (`extensions/phase-tracker.ts:700`).

Deviation from #28: the issue's three-field block (test files / fixtures / entry point) is replaced by commands anchored to declared `Test:` paths (mechanically checkable for selectivity) plus `via:` bullets for the entry point; fixture paths are `Files:` `Create:` entries, verified by the SR rule below. The issue's heading-line literal `**Tests:** none (<reason>)` and its `.md` heuristic are superseded by the `- none: <category>` bullet (questionary decision). The per-item report is kept in condensed form.

## Design

### Tests block (plan grammar)

Every `### Task N` carries a `**Tests:**` block. Fenced lines are skipped throughout (`Tests:` parse and `Run:` scan; the current `Files:` loop is not masked, do not copy it).

Position: after the last `Files:` entry line (`^- \w+: ` following `**Files:**`, so `Delete:` bullets count), skipping blank lines, the next line is exactly `**Tests:**`.

Bullets: following lines, blank lines skipped. A line starting `- ` and not `- [ ]` is a candidate bullet and must match one of:

- a command in single backticks, nothing else on the line (`- ` + backtick + command + backtick) - one command
- `^- via: (\S.*)$` - entry point under test
- `^- none: (\S.*)$` - no tests

Any other line (`- [ ]` step, non-bullet text, next heading) ends the block. A candidate matching none of the three is a malformed bullet; the block continues.

Form: >=1 command bullets plus zero or more `via:`, or exactly one `none:`.

```markdown
**Tests:**
- `node --test extensions/lib/plan-check.test.ts`
- via: `checkPlan()` - `tests-block` findings
```

```markdown
**Tests:**
- none: docs
```

- `- via: <entry point>`: the seam the tests call directly (function, route, CLI, module - e.g. `each_finding`), free text after the prefix. Unchecked by `plan_check` beyond form; rendered verbatim to implementer and SR. Authoring rule (`writing-plans` Self-Review, judgment): when the anchored spec names the thing under test, the task carries a `via:` naming it; fixture destinations the spec names go under `Files:` `Create:`.
- `- none: <category>`: the task runs no tests. `<category>` is free text; the plan writer derives it from project context (docs, config, fixtures, generated assets, ...). No closed list anywhere. A `none:` task declares no `- Test:` path.
- Unlike `**Spec:**`, absence is never valid: a task with no tests states `- none: <category>`.
- Commands run from the plan's repo root (the dispatch cwd, where `Files:` paths resolve). Shell that moves or hides execution is unsupported: `cd `, `sh -c`/`bash -c`, `eval `, `$(`.
- Command anchoring is per segment. Segments = `norm(command)` split on `&&`, `||`, `;`, `|`. Every segment contains a `Test:` path of the same task as an argument token: whitespace-delimited, equal to the path or the path followed by `::`, `#`, or `:` and a filter (`tests/a.py::test_x`). Path = the `Test:` value with backticks and any `:L-L` suffix stripped, as `Files:` parsing does today. A `Test:` value containing `*`, `?`, `[` or ending in `/` never anchors. Any other argument token containing `*`, `?`, `[` or ending in `/` is a broadening selector and fails. Other flags are free (`-v`, `-k name`, `--filter x`).
- Runners that cannot address a file (`go test ./pkg -run X`, `mvn -Dtest=`) have no anchored form; use the runner's file-list form where one exists. Out of scope otherwise.
- `Test:` entries are run anchors, not ownership. Typed overlap in `wave-file-disjointness`: `Test`/`Test` on the same path is allowed; `Test` vs another task's `Create`/`Modify` is a conflict; writer/writer stays a conflict. Each `Test:` path must exist or be a `Create:` path of some task in the plan.
- `Run:` step lines are not checked against the block; the block wins when they differ. `Run:` lines are still checked against the header entrypoint (below).

### `plan_check` changes (`extensions/lib/plan-check.ts`)

Parser: `Task.tests` (commands), `Task.testsVia` (`via:` remainders), `Task.testsNone` (the `none:` remainder), all line-numbered, parsed per the grammar above.

Shared normalization `norm(s)`: strip backticks, collapse whitespace, trim. Header segments: the header `**Verification:**` value's backtick spans when any exist, else the raw value; each `norm`ed and split on `&&`, `||`, `;`, `,`; empty segments dropped. `Run:` payload: lines matching `^\s*(- \[ \] )?Run:\s*(.*)$` inside wave scope; payload = every backtick span if any, else the remainder; segments as for commands.

New check `tests-block`, one finding per violation, naming the task and line:

| condition | finding |
|---|---|
| no `**Tests:**` at the grammar position (also when `**Files:**` is absent) | block missing |
| `**Tests:**` elsewhere, duplicated, or with text after it on the heading line (suppresses block missing) | misplaced block |
| no command bullet and no `none:` | block empty |
| candidate bullet matches none of the three patterns | malformed bullet |
| `none:` with a command or `via:`, or more than one `none:` | contradictory block |
| `none:` while the task declares any `- Test:` path | unused `Test:` path |
| `Test:` path neither exists (`FsPort.exists`) nor is a `Create:` path of any task | unknown `Test:` path |
| command contains unsupported shell (`cd `, `sh -c`, `bash -c`, `eval `, `$(`) | unsupported shell |
| a segment has no `Test:` path token of the same task | segment not anchored |
| an argument token is a broadening selector | broadening selector |
| a segment equals a header segment | full-suite command in task |

So under header `npm test && npm run lint`: `npm test -- x.test.ts` is legal; `npm test`, `npm test | tee log && node --test x.test.ts`, `pytest tests/a.py tests/`, `cd pkg && pytest tests/a.py` are not.

`header-entrypoint`: the existing whole-header substring scan (`plan-check.ts:815-825`) keeps its prose role but skips executable lines (`Run:` lines and `Tests:` bullets); executable lines are judged by segment equality only - any `Run:` payload segment equal to a header segment is a finding. Bare and backticked headers behave identically. Check name unchanged; the prose test (`plan-check.test.ts:357`) stays.

`fileEntries()` (`plan-check.ts:690-695`) keeps `Test:` entries but tags kind; the disjointness comparison applies the typed rule above. `paths-exist` is unchanged (`Modify:` only).

`checkPlan` runs `tests-block` alongside the existing checks. No new setting, no new stamp mechanism, no change to `extensions/phase-tracker.ts` logic; its `plan_check` tool description drops the literal `9 mechanical checks` in favor of `mechanical checks`.

Findings resolve inside the existing self-fix loop (`writing-plans` Self-Review: fix, re-run). No new escalation path or human gate. The pre-existing 3-round Open Question halt in that loop is retained unchanged; reworking it is out of scope (conformance G1, accepted).

### Read-side consumers

`SCOPED_TEST_COMMANDS` = the task's `Tests:` command bullets, backticks stripped, one per line; `none:` -> `none`; wave = union. `via:` bullets and `Test:` paths are contract, not commands: they ride with the task text, never in `SCOPED_TEST_COMMANDS`.

- `skills/subagent-driven-development/SKILL.md`: every "plan-declared commands" site reads the block - sequential dispatch `:58`, fix fan-out `:76`, re-dispatch `:80`, wave test gate `:181`, wave CR union `:182`, implement-phase ban (Red Flags `:243` dispatch without `SCOPED_TEST_COMMANDS`, `:246` full entrypoint during implement). Independence check `:177` applies the typed overlap rule (`Test`/`Test` is not overlap). SR dispatch sites `:60`, `:78`, `:80`, `:179` and the `// spec compliance` dispatch example `:143`: pass the task's `**Tests:**` block and `- Test:` paths as contract; the "SR carries no test commands" wording stays true. Doc-only task (`:62`) and doc-only wave (`:185`) keep the existing "every file documentation-only" judgment for the CR skip. `skills/verification-before-completion/reference/conformance-check.md:153` ("gap-relevant plan-declared commands") is unchanged by reference.
- `skills/subagent-driven-development/implementer-prompt.md:41` and `code-quality-reviewer-prompt.md:17`: the placeholder description names the source (`the task's Tests: bullets`); "Run ONLY these commands. Never run a repo-wide suite" unchanged. Implementer prompt: tests call the `via:` seam directly, not a wrapper or the internals behind it; `Create:` paths are created at exactly those paths. Report: one line per command - `met` (ran, exit 0, last output line quoted) or `unmet <reason>`; one line per `via:` - `met <test file:line calling it>` or `unmet <reason>`; `none` when the block is `none:`. Any `unmet` -> `DONE_WITH_CONCERNS`.
- `skills/subagent-driven-development/spec-reviewer-prompt.md` and `agents/spec-reviewer.md` (lockstep comment `:16`), changed together: the `Tests:` block, `via:`, and `Files:` paths supplement the binding contract where the anchored spec is silent; the anchored spec wins a conflict, and the divergence is reported once against the plan, not against code corrected to the spec. Findings: a `Create:` path absent from the diff or created elsewhere; a test that does not call the `via:` entry point; a `Tests:` block the diff contradicts. No diff-touch requirement for existing files. SR stays read-only; no execution.
- `skills/test-driven-development/SKILL.md:120`, `:124`, `:179`: "scoped commands" -> "the task's `Tests:` commands".

### Extraction: `skills/writing-plans/reference/plan-contract.md`

New file: the grammar `plan_check` enforces, text moved from `SKILL.md` with no rewording beyond what the Tests block requires. Sections and the checks they cover:

| section | checks |
|---|---|
| Files | `wave-file-disjointness`, `paths-exist` |
| Spec anchors | `anchor-resolution` |
| Tests | `tests-block` |
| Solo line | `solo-line` |
| Header-only entrypoint | `header-entrypoint` |
| Spec coverage table | `table-closure`, `waiver-literal` |
| Placeholders and quote integrity | `placeholder-scan`, `quote-integrity` |

`SKILL.md` keeps process, the inline task template (with `Tests:`), the wave example, and judgment rules, and points to the reference from Wave Grouping, Task Structure, Spec Coverage, No Placeholders, and the Self-Review checker bullet. `SKILL.md` retains the literal `is never waivable` (pinned by `scripts/ci.mjs:174`). `README.md:74` and `doc/configuration.md:63` drop the check count/enumeration and link the reference.

### Rule inventory (no-drop guarantee)

Every normative rule in the moved sections, today's location, destination. `ref` = `reference/plan-contract.md`; `skill` = `SKILL.md`; `both` = grammar in ref, judgment/process in skill.

| # | rule | source (`skills/writing-plans/SKILL.md`) | destination |
|---|---|---|---|
| 1 | wave = no ordering dependency + pairwise-disjoint files + no shared runtime resource | L127 | both |
| 2 | `## Wave N — <label>` / `### Task N` nesting | L129 | ref |
| 3 | single-task wave needs `Solo: <reason>` naming blocker, resource, or `lone remaining task`; category-only fails | L130 | both (presence: ref; validity: skill) |
| 4 | pure dependency chain = one task per wave, each with `Solo:` | L131 | skill |
| 5 | each wave after the first states its dependency on prior waves | L132 | skill |
| 6 | `Files:` is the ownership declaration; same-wave union pairwise disjoint; `Modify` globs allowed, may not overlap; cross-owner touch -> later wave; typed overlap (`Test`/`Test` allowed, `Test` vs `Create`/`Modify` conflicts) | L134 | ref |
| 7 | every code-creating/modifying task declares a `Test:` path and an executable `Tests:` command; `none:` only when no tests apply; anchoring is presence, not coverage; a spec-named seam becomes `via:`, a spec-named fixture path becomes `Create:` | L136, L300 | both (grammar: ref `Tests`; judgment: skill Self-Review) |
| 8 | runtime-resource disjointness; inline note on the later wave | L138, L301 | skill |
| 9 | doc tasks are real tasks; task-local ride along; cross-cutting -> trailing doc-only wave | L140 | skill |
| 10 | doc-wave collision: same-file doc tasks merge | L142 | skill |
| 11 | header template; `**Verification:**` is the only place for the full entrypoint, never in task/wave steps | L175-L195 | both |
| 12 | `- [ ]` checkbox steps | L199 | skill |
| 13 | task template; every code task red -> green -> fmt/lint -> commit; doc-only omit | L201-L251 | skill (template gains `Tests:`) |
| 14 | anchor rules: `§` marker, comma-separated anchors, header path line never matched, amendment path (brainstorming `Amending an approved spec`, in place), anchorless task omits `**Spec:**` (never `none`) and carries a mechanical row | L253 | ref |
| 15 | plan ends with `## Spec coverage`, authored last | L257 | ref |
| 16 | extraction-first: one row per normative requirement (Design imperatives, Edge cases, Acceptance, Out of scope, non-none Documentation impact), then owners, then re-walk | L257 | skill |
| 17 | table example | L259-L270 | ref |
| 18 | requirement rows: anchor + short + owner (`Task n` list, `Verification`, `waived: <reason>`); waiver only for out-of-scope excluding work; inline code span `is never waivable` | L272, L303 | both (grammar + waiver literal: ref; authorization incl. the pinned literal: skill) |
| 19 | cross-cutting requirement lists every deciding task | L272 | skill |
| 20 | `Verification` owner: exact string alone; only header literals; single anchored line; scoped commands task-owned | L273, L304 | both |
| 21 | mechanical rows: anchor `-`, `mechanical: <short>`, one per anchorless task | L274 | ref |
| 22 | table is authoring-time only, never passed to dispatches | L275 | skill |
| 23 | closure both ways: every `### Task N` appears as an owner; every row's owner task exists | checker semantics (`plan-check.test.ts:110`) | ref |
| 24 | quote integrity: never paraphrase an exact-string requirement; `<placeholder>` spans exempt | L285 | ref |
| 25 | placeholder markers `[fill in]`, `<example>`, `xxx` | L288 | ref |
| 26 | remaining No Placeholders bullets | L281-L284, L286-L287, L289-L290 | skill |
| 27 | run `plan_check`, fix, re-run; 3 surviving rounds -> Open Question | L297 | skill (check list -> pointer to ref) |
| 28 | code-vs-anchor sanity | L298 | skill |
| 29 | type / API consistency | L299 | skill |
| 30 | solo-reason validity | L302 | skill |
| 31 | documentation-impact mapping | L305 | skill |
| 32 | genuinely open decision -> explicit Open Questions section, resolve before execution | L291 | skill |
| 33 | run the checker, then the judgment checks yourself - not a subagent dispatch | L295 | skill |

## Edge cases

- `Test:` path declared, `none:` declared -> unused `Test:` path.
- `Test:` value `tests/` or `tests/*.py` -> never anchors; command token `tests/` beside a valid anchor -> broadening selector.
- `- Test: x.test.ts:10-20` -> suffix stripped before anchoring, as for `Modify:`.
- Same-wave A `{Modify X, Test X}` and B `{Test X}` -> conflict (reader vs writer); A `{Test X}` and B `{Test X}` -> allowed.
- `Test:` path that no task creates and that does not exist -> unknown `Test:` path (positive proof is never vacuous).
- Header is a single entrypoint (`npm test`, bare or backticked) -> one segment; bullet `npm test` fails, `npm test -- x.test.ts` passes either way.
- Header value: backticked `npm test` followed by prose (bundles lint) -> segments from the backtick span only: `npm test`.
- Header value: backticked `npm test`, backticked `npm run lint`, comma-separated -> two segments.
- Header segment is itself scoped (`node --test x.test.ts && npm run lint`) -> a bullet equal to it is rejected; the header is the full set by definition.
- `npm test | tee log && node --test x.test.ts` -> segment `npm test` equals a header segment -> fails; also `tee log` has no anchor.
- `Run:` line with two backtick spans -> both spans are payload.
- Fmt/lint commands in `Tests:` -> allowed only if every segment names a `Test:` path; no lint-vs-test classification.
- `- none: docs, config` -> valid; only the `none: ` prefix and non-empty remainder are checked.
- Previously stamped plans lacking `Tests:` fail on re-check; historical, never re-stamped. No migration.
- No path normalization: `./x` and `x` differ, as in `Files:` today.

## Out of scope

- Implementer-side enforcement (bash hook, `completionGuard`) of the command list - pi-cohort territory.
- Classifying commands as test vs lint, or any command denylist / settings key.
- Checking `Run:` step lines against the `Tests:` block.
- Changes to `verify-before-ship`, `scripts/ci.mjs`, or the verify-phase full run.
- Parsing shell: separators are split textually; quoted separators (`-k "a && b"`) are split too and fail closed.
- Runners without a file-addressable form (`go test ./pkg -run X`, `mvn -Dtest=`).

## Testing

`extensions/lib/plan-check.test.ts`, existing style (`test(...)`, `findingsFor(findings, "<check>")`, fixture + `replace()` mutation helpers). Zero-finding fixtures updated: `VALID_PLAN` (`:24`) - Tasks 1-2 each gain a disjoint `- Test:` entry and an anchored bullet; Task 3 modifies `extensions/lib/fixture-task3.ts`, so it gains a `- Test:` entry and an anchored bullet too; `EXEMPTION_PLAN` (`:612`) gains a `Tests:` block; `extensions/phase-tracker.test.ts` `FIXTURE_PLAN` (`:692`, header `npm test`) gains `- Test:` entries and anchored bullets (never a bare `npm test`). `replace()`-based mutations that key on `Files:` text keep the `Tests:` block intact.

`tests-block` cases: `via:` with commands passes; `via:` with `none:` fails; `via:` alone fails (block empty); block missing (also with `**Files:**` absent); misplaced (before `Files:`, duplicated, text after heading) fires without block missing; `Delete:` bullet before `**Tests:**` is legal; malformed candidate (`- node --test x`, no backticks) after a valid bullet -> malformed, block continues, following `- [ ]` step terminates cleanly; `none:` + command; two `none:`; `none:` with a `Test:` path; unknown `Test:` path vs `Create:`d-by-another-task path passes; segment without a `Test:` token; broadening token `tests/` and `tests/*.py`; unsupported shell `cd pkg && pytest tests/a.py`; segment equal to a header segment (header `a && b`, bullet `b`); `npm test | tee log && node --test x.test.ts` under header `npm test`; comma-listed header; header with trailing prose; passing: multi-path bullet, `tests/a.py::test_x -v`, `-k name`, `- none: docs, config`, line-suffixed `Test:` entry.

`header-entrypoint` cases: `Run:` with backticked payload `npm test` under header `npm test && npm run lint` fails (regression for the hole); `Run: npm test && echo ok` fails; `Run: npm test -- x.test.ts` passes under bare and backticked header `npm test`; prose mention of the whole header still fails (`plan-check.test.ts:357` unchanged).

`wave-file-disjointness` cases: `Test`/`Test` -> no finding; `Test` vs `Modify` -> finding; `Modify`/`Modify` -> finding. SDD `:177` wording mirrors the same three.

Scoped command for the checker tasks: `node --test extensions/lib/plan-check.test.ts`.

Extraction: for each inventory row with destination `ref` or `both`, `rg -F '<distinctive literal>' skills/writing-plans/reference/plan-contract.md` matches; `rg -F "is never waivable" skills/writing-plans/SKILL.md` matches; the AGENTS.md project-specific grep over `skills/` matches nothing.

Docs: `rg -n "9 (mechanical|deterministic)" README.md doc/configuration.md extensions/` matches nothing.

## Acceptance

- `plan_check` on a plan with a task lacking `**Tests:**` reports a `tests-block` finding; on the updated fixtures reports none.
- `plan_check` reports a finding for any `Tests:` command segment or `Run:` payload segment equal to a header `**Verification:**` segment; and, for `Tests:` commands only, for a segment without a `Test:` path token, a broadening selector, unsupported shell, or an unknown `Test:` path.
- `skills/writing-plans/reference/plan-contract.md` exists; every inventory row's rule text is present at its destination.
- `skills/writing-plans/SKILL.md` task template contains `**Tests:**`.
- `skills/subagent-driven-development/SKILL.md` sources `SCOPED_TEST_COMMANDS` from the `Tests:` block at every listed site; `:177` applies the typed overlap rule; CR skip unchanged.
- `agents/spec-reviewer.md` and `spec-reviewer-prompt.md` both carry the supplement/spec-wins rule; the implementer report format is in `implementer-prompt.md`.
- `node scripts/ci.mjs` passes.

## Documentation impact
- Feature / user-facing docs introduced: `skills/writing-plans/reference/plan-contract.md`
- Materially amended existing docs: `README.md` (L74: check count replaced by one short sentence linking the reference; stays human-readable), `doc/configuration.md` (L63: enumeration replaced by a link), `CHANGELOG.md` (new `## [Unreleased]` section)
- Derived / memory docs invalidated: none (no new settings key; `AGENTS.md` extensions table unchanged)
