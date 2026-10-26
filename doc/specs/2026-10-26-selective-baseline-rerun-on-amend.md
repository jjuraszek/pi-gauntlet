# Selective baseline rerun on amend

**Goal:** A plan-writer `Amend:` re-dispatch after commits that touched only the flow-owned spec and plan directories reruns only the commands the amendment changed; every other baseline bullet is retained and re-stamped to the current base.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** waves

Supersedes `doc/specs/2026-10-19-gh-72-settle-facts-before-implement.md`, D2 "same base" retention condition only: the retain rule (line 88), the "re-dispatch reruns changed-SHA commands" rows (lines 157/171), and the execution-only statements that depend on them. That spec stays live for everything else.

## Problem

The gauntlet commits as it goes: the spec commit, every `amend:` commit, and the `plan:` commit each move HEAD without touching source. Every baseline bullet records the HEAD it ran on (`- baseline: fd4be10e3 pass`), the writer retains a bullet only "for unchanged command text on the same base" (`skills/writing-plans/SKILL.md:284`, `agents/plan-writer.md:35`), and `plan_check` rejects a plan whose bullets carry more than one SHA (`extensions/lib/plan-check.ts:607`, `baseline SHAs differ`). So the "same base" condition can never hold across an amend, and every amend reruns the whole baseline. Observed: a 107-task plan amended four times cost 28, 29, 25 and 65+ minutes of plan-writer time (the last killed), while `git diff --stat fd4be10e3..47dbca3e4 -- . ':!docs/'` between the recorded SHA and the new base was empty.

The one-SHA checker rule is derived, not independently justified: the gh-72 spec (line 157) states the child never hits it because a re-dispatch reruns changed-SHA commands. No downstream consumer reads the SHA value - `subagent-driven-development/SKILL.md:46` and `implementer-prompt.md:21-23` carry baseline bullets verbatim as contract text and exclude them from the scoped test commands. The checker has an fs port only (`checkBaselineLines(parsed, fs: FsPort)`, `plan-check.ts:562`) and cannot judge tree equivalence.

Corrected premises from triage: keying reruns to the files a task's test touches is unsound (tests read transitive files); a blanket `docs/` exclusion is unsound (this repo's `npm test` reads `AGENTS.md`, `CHANGELOG.md`, `README.md`). The sound key is the whole tree outside the directories the flow itself commits into during planning: the spec directory and the plan directory already named in Baseline step 1. Telemetry is sealed at finish, after planning, and needs no exclusion.

Framing: kept - checked `plan-check.ts:562-610`, `writing-plans/SKILL.md:283-293`, `plan-writer.md:35,41`, gh-72 spec D2 lines 88/157/171, `subagent-driven-development/SKILL.md:46`, `implementer-prompt.md:21-23`.

Unverified: whether a consumer repo's tests read its spec or plan directory. Not checkable generically; the design reruns everything whenever equivalence cannot be proven, and accepts the spec/plan blind spot (the flow never commits test inputs there).

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] On an `Amend:` re-dispatch where the diff between a bullet's recorded SHA and the current BASE is empty outside the spec directory and the plan directory, and no admitted in-flight path lies outside those directories, the plan-writer rewrites that bullet's SHA to BASE without running its command, and the written plan passes `plan_check` with one SHA.
  in-scope
- [ ] On an `Amend:` re-dispatch where the diff between any recorded SHA and BASE is non-empty outside the spec and plan directories, the plan-writer reruns every baseline command, as today.
  in-scope
- [ ] When the equivalence check cannot run (recorded SHA does not resolve, git or jj error), the plan-writer reruns every baseline command and records no `retained` line.
  in-scope
- [ ] A bullet whose command text changed, has a missing or invalid bullet, or is covered by `Findings: rerun baseline`, is rerun regardless of tree equivalence.
  in-scope
- [ ] The plan-writer's baseline provenance note carries `retained <n> bullets: <recorded> -> <BASE>, tree-equivalent outside <spec dir>, <plan dir>` once per distinct recorded SHA it re-stamped.
  in-scope
- [ ] `eval/writing-plans/` gains a sample whose two scenarios exercise the first two rows above, `intent.md` describes the rule, and `node eval/run.mjs writing-plans` is run before finish.
  in-scope

## Design

Approach: writer-side rule. The judgment lives where every other baseline judgment lives (the plan-writer); the checker, plan grammar, and bullet regex are unchanged.

### Retention rule (`skills/writing-plans/SKILL.md`, Baseline step 2)

The rule applies to both existing re-dispatch kinds, `Findings:` and `Amend:`; `Findings: rerun baseline` always overrides retention. No separate Findings mechanism.

Current step-2 opening: "On Findings/Amend, retain a bullet only for unchanged command text on the same base; rerun commands with missing/invalid bullets, changed text, or different recorded SHA. `Findings: rerun baseline` reruns all commands. Never rewrite recorded SHAs without execution."

Replacement, same position (two branches: proof holds, proof fails; the rerun triggers stay in the existing table row below):

> On Findings/Amend, before any command runs, prove tree equivalence once per distinct recorded SHA in the plan: `git -C "<abs worktree path>" diff --quiet <recorded> <BASE> -- . ':!<spec dir>/' ':!<plan dir>/'` exits 0 (plain jj: `jj -R "<abs worktree path>" diff --from <recorded> --to <BASE> --summary` exits 0 and its stdout is empty after dropping every entry whose paths all lie under `<spec dir>/` or `<plan dir>/`; an entry that does not parse as `<status> <path>` fails the proof). Every proof holds and no admitted in-flight path lies outside those directories -> rewrite every bullet with unchanged command text from its recorded SHA to BASE without execution and append `retained <n> bullets: <recorded> -> <BASE>, tree-equivalent outside <spec dir>, <plan dir>` to the step-1 provenance note. Any proof fails (non-zero exit, unresolvable SHA, git or jj error, non-empty filtered output, admitted in-flight path outside both directories) -> rerun every command and retain nothing. `Findings: rerun baseline` reruns all commands. Never rewrite recorded SHAs without execution or a recorded tree-equivalence.

The step-2 table gains one row:

| Command anchors/selectors | Baseline action |
|---|---|
| Bullet with changed command text, or missing/invalid bullet, on any re-dispatch | Rerun regardless of equivalence; the retained bullets keep their `skipped` and ` - artifacts:` forms per step 1. |

`<spec dir>` and `<plan dir>` are the worktree-relative directories of the spec path and plan path the writer was dispatched with, written as git pathspecs with a trailing `/` so the exclusion stops at the directory boundary - the same directories step 1 already uses for allowed in-flight paths. Stderr is never part of the filtered evidence. The writer has no `gauntlet_setting` tool and needs none. No new Open Questions row form; a failed proof is a rerun, never a finding.

Dependent execution-only statements, edited in the same change so no live sentence contradicts the rule:

- Baseline introduction "Never author baseline evidence without execution." gains "or a recorded tree-equivalence" (re-stamping is not authoring: the result is the retained run's).
- Step 3's rerun list "(changed command text, missing/invalid bullet, different base, or `Findings: rerun baseline`)" becomes "(changed command text, missing/invalid bullet, failed equivalence proof, or `Findings: rerun baseline`)".

### Provenance record

The `retained <n> bullets: ...` line is appended to the step-1 baseline provenance note the writer already records; that note is the sole location. No new plan section, no new plan or commit-body audit field, no change to `plan-contract.md` or `plan_check` (neither knows a provenance section today; replayed writers already place the step-1 note in the plan as a `## Baseline provenance` block, and this spec does not move it).

### Persona (`agents/plan-writer.md`)

Body only; frontmatter byte-identical. Step 5's restatement of the retention rule ("retain evidence only for unchanged commands on that same base, rerun missing, invalid, changed-command or changed-SHA evidence ... Never rewrite SHAs without execution") becomes: retain evidence for unchanged commands whose recorded SHA is BASE or proven tree-equivalent to it per the skill's Baseline step 2; rerun missing, invalid, or changed-command evidence, and everything when any proof fails; never rewrite SHAs without execution or a recorded tree-equivalence. Step 6's "only by Baseline execution" stays: a re-stamp is a Baseline pass outcome, not an authored repair. The bash-scope sentence at line 41 ("only for Baseline provenance (`git rev-parse`, `git status --porcelain`, ...)") adds `git diff --quiet` and the jj `diff --from/--to --summary` form so the allowlist matches the rule.

### Predecessor banner (`doc/specs/2026-10-19-gh-72-settle-facts-before-implement.md`)

Per `reference/superseding.md`: one banner line after the title, `> **Superseded by:** [doc/specs/2026-10-26-selective-baseline-rerun-on-amend.md](./2026-10-26-selective-baseline-rerun-on-amend.md) - D2 "same base" retention condition (retain rule, rows 157/171, dependent execution-only statements) only`. Predecessor text is preserved; unrelated commitments stay live.

### Unchanged

- `extensions/lib/plan-check.ts:607` and its tests: a re-stamped plan carries one SHA.
- `skills/writing-plans/reference/plan-contract.md:30` ("every baseline SHA in the plan must match") stays true.
- `skills/brainstorming/reference/amendment-surface.md` section 5: dispatches `Amend:` and does not restate the SHA rule.
- `skills/gauntlet-resume/reference/brief-contract.md:170-186`: `Findings: rerun baseline` after a rebase or merge stays rerun-all.
- `doc/configuration.md:177` (`plan_check` finding list including "differing SHAs"): still accurate.

### Data flow on an amend

An earlier batch (`plan:` commit, then an `amend:` commit touching only `doc/specs/`) moved HEAD `fd4be10e3` -> `47dbca3e4`; the 105 existing bullets read `fd4be10e3`. The parent applies the current amendment to the spec, leaves it uncommitted, and dispatches `plan-writer` with `Amend:` and `In-flight: doc/specs/<spec>.md`. Writer reads `BASE=47dbca3e4`, admits the in-flight spec path (inside the spec directory), runs the equivalence diff once for `fd4be10e3`, exit 0, rewrites 105 SHAs, runs only the commands for tasks with changed text or missing bullets, writes the `retained 105 bullets: fd4be10e3 -> 47dbca3e4, ...` line, `plan_check` passes, replies `PLAN WRITTEN`. The parent runs its own `plan_check`, then commits spec plus plan as the batch commit.

## Errors and edge cases

- Equivalence is evaluated once, before any command runs, against the step-1 BASE. Step 3's post-run reread still detects a moved HEAD as contamination; no re-evaluation mid-run.
- A plan with bullets at two recorded SHAs: each is proven independently, but retention is all-or-nothing: every proof must hold before any bullet is re-stamped; one failed proof reruns every command with no `retained` line.
- A recorded short SHA that no longer resolves (rebased or squashed history): rerun all.
- A non-empty endpoint diff outside the spec and plan directories (a commit touching `AGENTS.md`, `CHANGELOG.md`, `README.md`, or any other path): not equivalent, rerun all. A change committed and exactly reverted between the two endpoints leaves an empty diff and is equivalent; the proof compares endpoint trees, never walks history.
- An admitted in-flight path outside the spec and plan directories (doc-only edits step 1 allows): the commit-to-commit proof does not cover the working tree, so the proof fails and every command reruns. Source in-flight edits keep step 1's `in-flight source edits` block; nothing runs.
- jj: a summary entry naming a path outside both directories, or an entry that does not parse as `<status> <path>`, fails the proof; a non-zero exit fails it regardless of stdout.
- `Findings: rerun baseline`: the explicit override wins; no re-stamping.
- Accepted blind spot: a test that reads the spec or plan directory would not trigger a rerun. The flow never commits test inputs there.

## Tests

Skill and persona bodies have no unit tests; the eval is the test. `eval/writing-plans` is a `kind: text` target: the replay has no tools, cannot run checkouts, baseline commands, or `plan_check`, and does not load `agents/plan-writer.md`; the sample judges the writer's retention decision and provenance from supplied observations, in the style of `baseline-artifact-rerun`. This target does not exercise the persona allowlist edit; its bundle is not widened for that.

New sample `eval/writing-plans/samples/baseline-equivalent-restamp/` with one `case.md` (no `bundle-` lines: the default slices carry Self-Review) describing two scenarios as observed results, each answered separately:

1. Plan bullets read `baseline: abc1234 pass`; HEAD is now `def5678` after a `plan:` and an `amend:` commit; `Amend:` dispatch changes one task's steps (test command unchanged) and adds one task; `In-flight:` lists only the spec path; the supplied equivalence diff exits 0; the added task's command exits 0 with a one-test summary. Must hold (`expected.md`): every pre-existing bullet reads `def5678`; the provenance note contains `retained <n> bullets: abc1234 -> def5678`; the added task carries fresh evidence; the plan reads as one-SHA.
2. Same, with the supplied diff exiting 1 (a `src/` path changed) and every command observed passing on `def5678`. Must hold: every bullet reads `def5678` as rerun evidence; no `retained` line.

`eval/writing-plans/intent.md` gains a paragraph for the rule and `## Expected to move` lines for the new facts. `node eval/run.mjs writing-plans` runs before finish; `eval/writing-plans/report.md` is committed. `npm test` covers skill lint, instruction size, and the model-literal ban.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: CHANGELOG.md - deferred: release
- Derived / memory docs invalidated: none

Skill and persona bodies are implementation surface. `doc/implement-engines.md` was the scout's other `Docs touched:` candidate; it does not state the retention rule, so it does not clear the bar in `reference/documentation-impact.md`. The gh-72 spec takes the supersession banner above, not a content edit.

## Out of scope

- Per-task or per-file rerun keying (unsound; user chose all-or-nothing).
- Partial retention when proofs disagree across recorded SHAs (user chose all-or-nothing).
- A git port in `plan_check` or acceptance of mixed SHAs by the checker.
- Changing when the flow commits (spec, amend, plan) to avoid moving HEAD.
- Excluding `CHANGELOG.md` or other docs the flow does not commit during planning.
- An audit field in the plan file or commit body for the re-stamp; the provenance note is the record.

## Open questions

- Accepted, not blocking: a consumer repo whose tests read its spec or plan directory gets a false retention. Not checkable generically; revisit only if a repo reports it.
