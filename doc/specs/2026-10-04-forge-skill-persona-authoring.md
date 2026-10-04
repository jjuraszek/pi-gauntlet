# forge-skill persona authoring rules with an eval harness

**Goal:** Make forge-skill's existing claim to own agent persona edits true by adding a `## Persona rules` section derived from how pi-cohort and Claude Code consume a persona file, and prove the edit helps with a committed eval harness (`eval/forge-skill/`) whose before/after judgment is appended to this spec.

**Supersedes:** `doc/specs/2026-09-30-forge-skill-rename-cc-exposure.md`, scope `### SKILL.md contract` body (gains `## Persona rules`, skill-only markers on three authoring rules and the Conventions table, persona branches in edit-procedure steps 4-5; the 120-line cap, the no-`reference/`-dir layout, and every other clause of that spec stay live).

## Problem

`skills/forge-skill/SKILL.md` (68 lines on `main` at `2166283`), `AGENTS.md` "Package rules", the shared AGENTS core block, and `README.md` all say skill, persona, and prompt edits follow `/skill:forge-skill`. The skill's body has no persona content: its Conventions table is skills-only (directory name, `/skill:` invocation, `reference/`, `/reload`), and three authoring rules are skill-only but unmarked - "Description is a trigger" (a persona description is a dispatch-routing label), "Never force-load / cross-reference by `/skill:name`" (pi-cohort dispatches personas with `inheritSkills: false`), and oversized-file extraction into `reference/` (pi-cohort loads only flat `agents/*.md`, so an extracted file is never read). A model editing `agents/*.md` under forge-skill today gets skill rules applied to a file consumed as a complete system prompt, and nothing about frontmatter pins, routing labels, output contracts, or tool narrowness.

No knowledge base for dense personas exists in the repo (`doc/personas.md` documents frontmatter knobs and thinking budgets, not prose) or in pi core (pi defines no agent-file format; personas are a pi-cohort concept). The verifiable canon is structural: pi-cohort `doc/agents-and-chains.md` ("Prompt assembly", "Agent frontmatter") - the body is the child's system prompt, `systemPromptMode: replace` by default, nothing else is assembled unless `inheritProjectContext`/`inheritSkills` opt in, `agentOverrides` fill only unset frontmatter fields; Claude Code subagent docs - the body replaces the default system prompt, `description` is a routing label kept short, unknown frontmatter fields are ignored. In-repo evidence of what works is the mandatory closing lines (`probed:`/`lean:`), bounded-scope sentences, and the ~30 string needles `scripts/ci.mjs:166-260` pins in persona bodies as cross-file contracts.

Without a measurement, a persona-rules edit to forge-skill is an opinion. Seven commits on `main` edited `agents/*.md` with a stated intent and a small diff (`ae3db49`, `d42a1b5`, `58cb847`, `3292be0`, `b411055`, `4fc66f6`, `ea0c83f`); four of them supply the persona fixtures and the edit intents below. A historical diff is intent, never a golden output.

## Acceptance criteria

none - no ticket

## Design

### Component 1: `skills/forge-skill/SKILL.md`

Body section order becomes: Overview, Conventions, Authoring rules, **Persona rules**, Edit procedure, Test (optional), Project overrides. The file stays at most 120 lines. Every added line follows the skill's own `## Authoring rules`.

**`## Persona rules`** states what a persona file is and the rules that follow from how it is consumed. Each rule is at most two sentences plus at most one example; the section links pi-cohort's frontmatter table and `doc/personas.md` rather than copying either.

| Rule | Content | Source |
|---|---|---|
| Whole prompt | The body is the entire system prompt: pi-cohort assembles no base prompt, AGENTS.md, or skills catalog unless `inherit*` opts in; Claude Code replaces its default prompt with it. Open with the role and why it exists, state the output contract the caller parses before any method; when the caller parses a closing line, keep it last. | pi-cohort `doc/agents-and-chains.md` "Prompt assembly"; Claude Code sub-agents doc |
| Routing label | `description` is the dispatch-routing label read by the orchestrator's agent list; one sentence naming when to dispatch and `Not for direct dispatch` when a skill owns the call. Never a summary of the body. | Claude Code doc (startup warning past 15k tokens of descriptions); `agents/*.md` existing markers |
| Frontmatter pin | Every untouched line stays byte-identical and frontmatter stays untouched unless the request names a knob - a frontmatter pin removes the matching `agentOverrides` knob (`doc/personas.md` "Frontmatter knobs"), and a line the edit rewrites follows the ASCII rule like any other; never pin `model`. | pi-cohort `src/agents/agents.ts` override merge; `doc/personas.md` |
| Narrow tools | `tools` and `inherit*` list the operations the job performs and nothing else (a reviewer keeps `bash` when its caller injects a scoped command). A non-implementing persona with `bash` sets `completionGuard: false`; an implementing persona keeps the guard (`agents/implementer.md` has `bash` and `completionGuard: true`). | pi-cohort `doc/agents-and-chains.md` "Tool and extension selection", `completionGuard` row |
| Contract strings | A sentence the caller parses (closing line, mode discriminator, verdict word) changes only together with its caller; `scripts/ci.mjs` pins them. | `scripts/ci.mjs:166-260` |
| No skill machinery | No `/skill:` cross-reference and no `reference/` extraction: a persona body is read whole and nothing beside it is loaded (frontmatter `skills:` injects named skills, which is a knob, not a file split). A persona over 500 lines splits by job into a second persona. | pi-cohort flat `agents/*.md` loading; `doc/agents-and-chains.md` frontmatter table |
| Reload | pi-cohort re-reads `agents/` on every dispatch (`src/runs/foreground/subagent-executor.ts` calls `discoverAgents` per run) - no reload step; Claude Code needs a new session. | pi-cohort source |

**`## Conventions`** gains one lead sentence: `Skills only; persona conventions are in ## Persona rules.`

**`## Authoring rules`** marks the three skill-only rules with a leading `Skills only:` on the sentence that owns each (Description is a trigger; Oversized file; Never force-load). The Low conditionality rule's third-branch clause becomes `a third goes into a table, or for a skill a reference/ file`. No second list; the shared rules carry no marker.

**`## Edit procedure`** step 4 becomes `Run wc -l; over 500 lines, a skill extracts per the oversized-file rule, a persona splits by job.` Step 5 becomes `Skill, pi: run /reload. Persona, pi: nothing. Claude Code: start a new session.`

**`## Test (optional)`** gains one row: for a persona, the baseline worker is `worker` with the pre-edit body appended to the task and the loaded worker is the edited persona dispatched by name (`subagent({ agent: "<name>", context: "fresh", task })`); pi-cohort re-reads `agents/` per dispatch, so the pre-edit body is captured before the edit.

### Component 2: `eval/forge-skill/`

Layout:

```
eval/forge-skill/
  README.md
  reviewer-prompt.md
  run.mjs
  run.test.mjs
  sample/<slug>/case.md
  sample/<slug>/expected.md
```

`eval/` is outside `package.json#files`, never run from `scripts/ci.mjs`, and `rg -ni "jjuraszek|/Users/[^/]+" eval/` returns zero matches. `scripts/model-literal-lint.mjs` `SCOPE_DIRS` gains `eval` so no model or provider literal is committed there. No `eval/README.md` exists on `main`; this spec's README binds, and whichever of this change or the sibling `eval/spec-summarizer/` lands second reconciles its README with the first.

**`README.md`** owns the process: what one run does, how models are passed, how results aggregate, how to add a sample, and the rule that `expected.md` moves in the same commit as any forge-skill rule change (facts state properties the skill promises after that change; a baseline run against an older skill is judged on the same facts, which is what makes the delta visible).

**`reviewer-prompt.md`** is one reviewer's job only. Inputs: the must-hold list, the edit request, the unified diff, every file present after the run (path order, each fenced with its path), and the driver's line count per file. Output, as one fenced JSON block, exactly:

```json
{ "votes": ["yes", "no", "yes"], "level": "acceptable", "rationale": "one sentence" }
```

`votes` is in fact-list order and has one entry per fact; `level` is one of the five labels below. Scale (5 levels, plain words): `wrong` (requested change absent or file broken), `blunt` (change present, collateral edits or rule violations), `acceptable` (change present, one rule slip), `clean` (change present, every fact holds), `exemplary` (clean and the added text is tighter than the request asked). It never mentions other reviewers or the driver.

**`run.mjs`** contract: `node eval/forge-skill/run.mjs --skill-dir <path> --candidate-model <id> --reviewers <id>,<id> [--out <dir>] [--sample <slug>]`. No committed default for any model. Per sample it:

1. Mints `mkdtemp` under `$TMPDIR` for the scratch cwd; materializes every fixture file from `case.md` at the path its fence names; `git init` + one commit.
2. Runs the worker: `pi -p --model <candidate> --thinking <level> --tools read,edit,write --no-extensions --no-skills --skill <skill-dir> --no-context-files --no-session` with cwd = scratch and the prompt `/skill:forge-skill <edit request from case.md>` followed by a blank line and `Files in this checkout: <the fixture paths from case.md, comma-separated>` (the worker has no directory listing with `--tools read,edit,write`, so the request alone leaves it guessing paths). pi expands `/skill:` only at the start of the prompt (`dist/core/agent-session.js` `_expandSkillCommand`), so the body is injected deterministically; with `--no-skills` pi loads exactly the `--skill` paths and treats a directory holding `SKILL.md` as a skill root. The baseline run points `--skill-dir` at a `git worktree` of `main`'s `skills/forge-skill`; the candidate run at the branch's. The worker has no shell; the driver computes line counts.
3. Captures `git add -A && git diff --cached HEAD` (added, modified, deleted paths included) and every file present after the run with its `wc -l`.
4. Runs each reviewer: `pi -p --model <reviewer> --no-tools --no-extensions --no-skills --no-context-files --no-session` with `reviewer-prompt.md` + the fact list from `expected.md` + the edit request + the diff + the files + line counts; parses the JSON block; one retry with the parse error appended.
5. Writes `<out>/<run-id>/<slug>.json` and `<out>/<run-id>/aggregate.json`; `--out` defaults to `mkdtemp` under `$TMPDIR`; prints the aggregate table.

`case.md` grammar: one or more fenced blocks whose info string is `file <path>` holding the fixture file verbatim, then one fenced block with info string `request` holding the edit request. Example:

````markdown
```file agents/code-reviewer.md
---
name: code-reviewer
...
```
```request
Align the verdict with severity in the body; the description is out of scope.
```
````

Result record per sample. GitHub #50 AC 3 asks for: judge score and rationale, judge model string, model string under evaluation, content hash of task inputs + rubric, content hash of the judge prompt, the skill directory's git SHA, telemetry-shaped metrics (tokens, cost, wall), and refusal to compute a delta across differing task/rubric or judge-prompt hashes. This record keeps all of those with two stated deviations: two reviewers instead of one judge (`reviewers[]` instead of `judgeModel`), and `wallMs` only (tokens and cost are not read from `pi -p`). Fields: `sample`, `skillDir`, `skillSha` (`git -C <skill-dir> rev-parse HEAD`, suffixed `-dirty` when `git status --porcelain -- <skill-dir>` is non-empty), `skillHash` (sha256 of the skill body), `taskHash` (sha256 of `case.md` + `expected.md`), `reviewerPromptHash` (sha256 of `reviewer-prompt.md`), `candidateModel`, `thinking`, `reviewers[]` each `{ model, votes[], level, rationale, status }`, `diff`, `files[]` each `{ path, lines }`, `wallMs`, `status` in `ok | worker-failed | reviewer-invalid`, `facts[]` each `{ text, status }` with status `kept | disputed | lost`.

Aggregation is arithmetic: a fact is `kept` when every reviewer says yes, `lost` when every reviewer says no, `disputed` otherwise. `worker-failed` marks every fact `lost`; `reviewer-invalid` (after the retry) marks every fact `disputed`. `aggregate.json` carries, per sample, `status` and the `facts[]` with text, plus run-level totals, every model string, `thinking`, `skillSha`, `skillHash`, and both input hashes.

Regression comparison: `node eval/forge-skill/run.mjs compare <baseline-aggregate.json> <candidate-aggregate.json>` pairs facts by sample slug and identical fact text, refuses (exit 2) when `taskHash`, `reviewerPromptHash`, `candidateModel`, `thinking`, or the reviewer list differs, when either side carries a `-dirty` SHA, or when either side has any sample whose `status` is not `ok`, and fails (exit 1) when any paired fact moved from `kept` to `lost`. Equal kept-counts with one fact lost and another gained is a failure, not a tie.

**Samples** (ten; `case.md` per the grammar above; `expected.md` holds must-hold facts only, one bullet each, never a golden output; the six `persona-*` slugs are the **persona subset** - four historical edits a decent skill already handles, plus two constructed requests whose correct edit depends on a persona rule the skill-only wording lacks):

| Slug | Kind | Fixture | Edit request | Sample-specific facts (beside the shared set) |
|---|---|---|---|---|
| `minimal-diff-one-line` | skill | a 40-line skill with a numbered edit procedure whose red flag restates one step's cap | change one step's cap and the red flag that restates it | exactly two hunks, both naming the new cap; no other line changed |
| `oversized-skill-extraction` | skill | a 540-line skill that stays over 500 after the edit | add a rule to one section | `reference/<topic>.md` created and a one-line pointer left at the owning step, or file under 500 lines |
| `reference-file-edit` | skill | `SKILL.md` + `reference/checks.md` | tighten a rule that lives in the reference file | only `reference/checks.md` changed; `SKILL.md` untouched |
| `prohibition-to-recipe` | skill | a 60-line skill | "stop the model from adding summaries at the end" | the added sentence states what the output is; no added line starts with `Never`, `Do not`, `Avoid` |
| `persona-frontmatter-preserved` | persona | `agents/code-reviewer.md` at `58cb847^` | "align the verdict with severity in the body; the description is out of scope" (body half of `58cb847`, whose landed diff also edited `description`) | frontmatter bytes identical; the verdict sentence names Critical and Moderate as blocking; closing contract line unchanged |
| `persona-imperative-rewrite` | persona | `agents/spec-council-member.md` at `ae3db49^` | rewrite the over-spec rules imperative and short, no semantic change (intent of `ae3db49`) | no `should`/`consider` in added lines; only the over-spec section changed; the set of facts that section states is unchanged (replaces the shared owning-sentence fact for this sample) |
| `persona-one-line-addition` | persona | `agents/code-reviewer.md` at `b411055^` | on re-review, state only the delta since the previous review (the `code-reviewer.md` hunk of `b411055`) | at most two added lines; the added line names re-review and delta; description unchanged |
| `persona-contract-change` | persona | `agents/spec-reviewer.md` at `3292be0^` | drop the HTML comment that couples this file's grammar to another file (the `spec-reviewer.md` hunk of `3292be0`) | the comment is gone; no other line changed; no `/skill:` reference added |
| `persona-inline-not-skill` | persona | `agents/spec-council-synthesizer.md` at `2166283` | "add one rule to the body: when adjudicating severity, apply the requesting-code-review skill's calibration - Critical only for bugs, data loss, security, or broken functionality; anything a reviewer would not block a PR over is not Critical" | the calibration is stated in the body as a sentence naming those four conditions; no `/skill:` reference and no skill name in the added lines; frontmatter byte-identical |
| `persona-thinking-knob-no-model` | persona | `agents/spec-summarizer.md` at `2166283` | "this summarizer needs more reasoning room: raise its thinking budget to high and pin it to the strongest model" | frontmatter gains exactly one line, `thinking: high`; no `model:` key anywhere; body byte-identical; description unchanged |

Shared facts in every `expected.md`, stated as checkable properties of the diff: the requested change is present; no added line contains `should`, `consider`, `you may want to`, or `it is recommended` (the authoring rule's own word list - a word test, because "every line is imperative" splits reviewers on declarative fallback clauses); no added nuance clause (`unless`, `when appropriate`, `if needed`, `as necessary`); only the sentence(s) owning the rule changed, nothing restated elsewhere; ASCII only in added and modified lines (a modified line is an added line in the diff, so converting its punctuation to ASCII is expected, not collateral; untouched fixture bytes stay as they are). Skill samples add: the file is under 500 lines or extraction happened. Persona samples add: frontmatter byte-identical to the fixture (the fixture may carry a non-ASCII description; the fact is identity, not ASCII); no `reference/` file created; no `/skill:` reference added. The persona-only facts are what the persona rules add; the baseline is judged on them too, which is the delta Component 3 measures. The set does not claim to exercise every persona rule (no fixture is over 500 lines).

### Component 3: proof at conformance

Three paired runs (baseline, candidate) happen inside this flow; a single pair is one draw of a stochastic worker, and the first pairs showed a single em-dash conversion deciding the outcome. Model roles are a decision recorded here (the user named three models; the brainstorm's question offered one candidate plus two reviewers): candidate `anthropic/claude-opus-5-5`; reviewers `github-copilot/gpt-6-astra` and the session's main model string. The worker `--thinking` level is chosen at the baseline run and recorded; the candidate run uses the same value. Baseline: `--skill-dir` at a `git worktree` of `main` (`2166283`), judged against the branch's `expected.md`. Candidate: `--skill-dir` at the branch after the forge-skill edit, same `expected.md`. The delta is exactly the facts the persona rules add plus any change on shared facts.

Per side, the three aggregates collapse into one median aggregate with `node eval/forge-skill/run.mjs median <a1> <a2> <a3>`: a fact's median status is the status at least two of the three runs gave it, else `disputed`; `median` refuses (exit 2) when the inputs differ in `skillSha`, `skillHash`, `taskHashes`, `reviewerPromptHash`, `candidateModel`, `thinking`, or reviewer list, or when any input has a sample that is not `ok`; a sample's `levels` in the median are the three runs' level lists concatenated.

A run counts as evidence only when all ten samples have `status: ok` and the skill SHA is clean; a run with a `worker-failed` or `reviewer-invalid` sample is rerun in full (same models, same thinking) before judging - a failure on one side can never be the improvement. The aggregate goes into this spec under a new `## Eval judgment` section (appended, never rewritten): one table per median aggregate with `sample | kept | disputed | lost | levels`, each side's per-run totals and median totals, both skill SHAs, the three model strings, the thinking level, the three hashes, and the exit status of `compare` over the two median aggregates. Raw records stay under `$TMPDIR`. The conformance reviewer checks that the section exists, names both SHAs and the model strings, that six runs were `ok`, and that `compare` over the medians exited 0 (no persona or skill fact moved from `kept` to `lost` at the median). The persona subset's kept-count delta is recorded, not gated: with a strong candidate model the rules may measurably neither help nor hurt, and that is the finding. A median regression is a `BLOCKED:` finding, not a pass; no fourth pair to improve the draw.

### Component 4: lint and docs

`scripts/ci.mjs` gains two deterministic checks: `eval` present in `SCOPE_DIRS` and the model-literal lint passes over it; every `eval/forge-skill/sample/*` directory holds exactly `case.md` and `expected.md`. The 120-line cap and the `## Persona rules` position are verified in the plan's verification step (`wc -l`, `rg -n '^## '`), not in ci.

Docs: `AGENTS.md` "Package rules" bullet on skill/persona/prompt edits names forge-skill's `## Persona rules` for personas and gains an "Eval" bullet (`eval/` is outside the package, never run from ci, `expected.md` moves with the skill); `AGENTS.md` Routing gains a row for `eval/forge-skill/README.md`; `README.md` gains an eval section; `doc/personas.md` "Frontmatter knobs" gains a one-line pointer to forge-skill's `## Persona rules`; the predecessor spec gets the supersession banner; `CHANGELOG.md` `## Unreleased` entry.

## Errors and edge cases

- `run.mjs` exits non-zero with the usage line when `--skill-dir`, `--candidate-model`, or `--reviewers` is missing, when `--reviewers` has fewer than two distinct strings, or when `<skill-dir>/SKILL.md` is absent.
- A skill dir not inside a git checkout fails before any dispatch: the SHA is part of the record contract.
- A worker invocation that exits non-zero, times out (10 minutes per sample), or yields an empty diff records `worker-failed` with the captured stderr and continues with the next sample.
- A reviewer reply with no JSON block, a vote count different from the fact count, or a level outside the scale is retried once with the parse error appended; a second failure records `reviewer-invalid` for that reviewer and the sample's facts are `disputed`.
- Scratch dirs are never deleted by `run.mjs`; the record names each path.
- A `-dirty` SHA is recorded, and the README states that a dirty record is not evidence; `compare` refuses a dirty side.
- The `oversized-skill-extraction` fixture stays over 500 lines after the requested addition so the extraction fact is exercised; its fact is the two-branch form the authoring rule itself allows.
- At the first run there is no earlier `expected.md`, so every fact is new and the before/after is the kept-count delta; `compare` still binds on the facts identical across the two runs (all of them in this flow).
- Historical fixtures are taken verbatim at the parent commit, non-ASCII bytes included; the persona fact is frontmatter identity, so the worker is not rewarded for touching lines it was not asked to.
- `pi -p` resolves models through the operator's auth; an unauthenticated model string surfaces as `worker-failed`/`reviewer-invalid` with the `pi` stderr, never as a silent pass.

## Tests

- `eval/forge-skill/run.test.mjs` (`node --test`, run by hand and in the plan's verification step, never from `ci.mjs`): argument validation (missing flags, duplicate reviewers, missing `SKILL.md`); `case.md` materialization (two files, nested path); worker capture (an added untracked file appears in the diff and in `files[]`); reviewer input assembly (the edit request and every file are present); reviewer-reply parser (valid; one vote short; unknown level; no JSON block); aggregation (kept/disputed/lost across two reviewers; `worker-failed` -> all lost; `reviewer-invalid` -> all disputed); `compare` (pairing by slug + text; kept->lost exits 1; equal counts with one lost and one gained exits 1; `taskHash`, `reviewerPromptHash`, model, thinking, dirty, or non-`ok` sample refuses with exit 2). The `pi` invocations are behind one injectable function so the tests run without a model.
- `scripts/ci.mjs`: the two checks in Component 4, plus the existing frontmatter, stale-token, `pi.settings`, marketplace, pack, and version checks continue to pass; the `rg -ni "jjuraszek|/Users/[^/]+"` scan over `skills/` and `eval/`, filtered through `rg -v "github.com/jjuraszek/pi-cohort"` as in `AGENTS.md`, returns zero matches.
- Judged proof: the two runs and the `## Eval judgment` section as in Component 3.

## Documentation impact

Per `reference/documentation-impact.md`.

- Feature / user-facing docs introduced: `eval/forge-skill/README.md` - process contract for the eval (major procedures: one run, model passing, aggregation, adding a sample, `expected.md` moves with the skill)
- Materially amended existing docs: `AGENTS.md` - Package rules (conventions: forge-skill owns personas with persona-specific rules; `eval/` is outside the package and never run from ci); `README.md` - new eval section (major procedures); `doc/personas.md` - "Frontmatter knobs" pointer to forge-skill `## Persona rules` (conventions); `CHANGELOG.md` - `## Unreleased` entry (ships with the change)
- Derived / memory docs invalidated: `doc/specs/2026-09-30-forge-skill-rename-cc-exposure.md` - supersession banner, scope `### SKILL.md contract`; `AGENTS.md` Routing table - row for the eval README

## Out of scope

- Prompt templates and slash commands: forge-skill's description keeps its claim; no content is added for them.
- Implementing GitHub #50 (per-skill eval tasks, runner-only judge, scored baseline, telemetry metrics); only the result-record shape is aligned.
- Retro-fitting existing personas (field order, the two non-ASCII descriptions, `conformance-reviewer.md` size); surfaced, not fixed.
- New `ci.mjs` lint of persona frontmatter keys, `thinking` enum, or name == filename.
- A Claude Code persona conventions table; the persona rules carry the two harness facts they need and no more.
- Committing eval results anywhere; the judgment table in this spec is the only committed trace.

## Open questions

- No external dense-persona methodology was fetched (Anthropic prompt-engineering guide); the persona rules rest on the harness facts cited above and the eval decides whether they help. A later spec may add rules from fetched guidance, moving `expected.md` with them.

## Eval judgment (superseded - candidate eab5afd, before the ASCII clause)

Superseded by the judgment below; kept as history.

Three paired runs on 2026-10-04, candidate `anthropic/claude-opus-5-5`, reviewers `github-copilot/gpt-6-astra` and `anthropic-fable/claude-fable-5-1`, thinking `medium`, reviewer-prompt hash `5694611a1c5815242a54604e87be874a66e988c07f5f60a8511e362c5752f081`, task hashes as in the records. Per-run totals (kept/disputed/lost): baseline 93/3/4, 95/2/3, 94/2/4; candidate 95/2/3, 93/2/5, 94/2/4. Every run was 10 of 10 samples `ok` on a clean skill SHA.

### Baseline median - skill SHA `2166283`, skill hash `681f54c22285d172a5e5071081138a8cc4cce91ca56db2fe8e132cfb68f0fa6f`

| sample | kept | disputed | lost | levels |
|---|---|---|---|---|
| minimal-diff-one-line | 6 | 0 | 3 | blunt, blunt, blunt, blunt, blunt, blunt |
| oversized-skill-extraction | 9 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-contract-change | 11 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-frontmatter-preserved | 10 | 0 | 1 | acceptable, blunt, clean, clean, acceptable, acceptable |
| persona-imperative-rewrite | 11 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-inline-not-skill | 9 | 1 | 0 | acceptable, exemplary, acceptable, clean, acceptable, clean |
| persona-one-line-addition | 11 | 0 | 0 | clean, exemplary, clean, clean, clean, clean |
| persona-thinking-knob-no-model | 9 | 1 | 0 | acceptable, clean, acceptable, clean, acceptable, clean |
| prohibition-to-recipe | 9 | 0 | 0 | exemplary, clean, clean, clean, exemplary, clean |
| reference-file-edit | 9 | 0 | 0 | clean, clean, clean, exemplary, clean, exemplary |
| total | 94 | 2 | 4 | |

### Candidate median - skill SHA `eab5afd` (the branch commit whose `skills/forge-skill/SKILL.md` is byte-identical to the shipped file; the SHA is fixed across the three runs by a detached worktree), skill hash `7ab6f67af59a4e6d327eab37b31a04a5bd9c78cd33e2bb7503cf17e6b40e7e5a`

| sample | kept | disputed | lost | levels |
|---|---|---|---|---|
| minimal-diff-one-line | 6 | 0 | 3 | blunt, blunt, blunt, blunt, blunt, blunt |
| oversized-skill-extraction | 9 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-contract-change | 11 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-frontmatter-preserved | 10 | 0 | 1 | clean, clean, blunt, blunt, acceptable, acceptable |
| persona-imperative-rewrite | 11 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-inline-not-skill | 9 | 1 | 0 | acceptable, clean, acceptable, clean, acceptable, exemplary |
| persona-one-line-addition | 11 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-thinking-knob-no-model | 9 | 1 | 0 | acceptable, clean, acceptable, clean, acceptable, clean |
| prohibition-to-recipe | 9 | 0 | 0 | exemplary, clean, exemplary, clean, exemplary, clean |
| reference-file-edit | 9 | 0 | 0 | exemplary, exemplary, clean, exemplary, clean, exemplary |
| total | 94 | 2 | 4 | |

Persona subset kept (median): baseline 61 -> candidate 61 of 64 (recorded, not gated). `compare` over the medians: exit 0; moved facts: none. The median-level non-kept facts are identical on both sides: `minimal-diff-one-line` loses three facts because every draw also rewrote the "A paragraph over 120 words." red flag (a shared-rule reading, not a persona matter); `persona-frontmatter-preserved` loses the ASCII fact because every draw kept the fixture's em-dashes in the rewritten severity rows; `persona-inline-not-skill` and `persona-thinking-knob-no-model` each carry one reviewer dispute (whether the inlined bar must say "Critical" where the persona's vocabulary is `blocker`; whether refusing to pin `model` means the request is "present"). Finding: with this candidate model the `## Persona rules` text does not hurt and does not measurably help on these ten samples; the two constructed rule-exercising requests were handled correctly by both skills in every draw. Two earlier single pairs (before the three-pair criterion) tied 40 -> 40 of 44 and 60 -> 60 of 64 with one fact each moving in opposite directions, which is what motivated the median. Raw records under `$TMPDIR` (not committed).

## Eval judgment (candidate ec84d42, superseded - skill reworded for the two-sentence rule; see the judgment below)

Three paired runs on 2026-10-04, candidate `anthropic/claude-opus-5-5`, reviewers `github-copilot/gpt-6-astra` and `anthropic-fable/claude-fable-5-1`, thinking `medium`, reviewer-prompt hash `5694611a1c5815242a54604e87be874a66e988c07f5f60a8511e362c5752f081`. Per-run totals (kept/disputed/lost): baseline 93/2/5, 94/2/4, 94/2/4; candidate 95/2/3, 95/2/3, 94/2/4. Every run was 10 of 10 samples `ok` on a clean skill SHA. Task hashes (sha256 of `case.md` + `expected.md`, identical on both sides):

| sample | taskHash |
|---|---|
| `minimal-diff-one-line` | `73decf241d2afac396481840a6584b10fd0326be830e0a457bc7ac466fc0f4eb` |
| `oversized-skill-extraction` | `56a6badb2f8d53c153ea0133d65fe5d8952a1074ac5f772549dc99f5b8ec5479` |
| `persona-contract-change` | `659e663dc25aaedb3efbc4d904c6020dd1fd5861de141ee6f18b359334529aef` |
| `persona-frontmatter-preserved` | `c2399e9f8edb1989081ea0cb0382da6e66c8551784cdb3f2e53c350107ba453f` |
| `persona-imperative-rewrite` | `22fc9389c6a35050b483a777598118ff9b7eacdade3bf390545895209c8db88c` |
| `persona-inline-not-skill` | `d9a9a7dcbeb932c9e575bb86416366edd18e52617f7c6b247fcee2a08877cf1c` |
| `persona-one-line-addition` | `58d6ecabd9c5244a5395925f7459b826d64723d5f870e0f7beb36f7f9b52678f` |
| `persona-thinking-knob-no-model` | `0d0b1e9af5014b553e584f5439ce11f43cb71b0744916e61450a548638ab1bc5` |
| `prohibition-to-recipe` | `48f2b323a4f951ca1d24f9affb25204638334b1961f42f2a30aab2ec7783186d` |
| `reference-file-edit` | `84fa6af17f47db8cb779ac2d1e7d4e29d4cff73db0f2e9471f84197a81b0b582` |

### Baseline median - skill SHA `2166283`, skill hash `681f54c22285d172a5e5071081138a8cc4cce91ca56db2fe8e132cfb68f0fa6f`

| sample | kept | disputed | lost | levels |
|---|---|---|---|---|
| minimal-diff-one-line | 6 | 0 | 3 | blunt, blunt, blunt, blunt, blunt, blunt |
| oversized-skill-extraction | 9 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-contract-change | 11 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-frontmatter-preserved | 9 | 0 | 2 | blunt, blunt, acceptable, acceptable, acceptable, acceptable |
| persona-imperative-rewrite | 11 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-inline-not-skill | 9 | 1 | 0 | acceptable, exemplary, acceptable, clean, acceptable, clean |
| persona-one-line-addition | 11 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-thinking-knob-no-model | 9 | 1 | 0 | acceptable, clean, acceptable, clean, acceptable, clean |
| prohibition-to-recipe | 9 | 0 | 0 | exemplary, clean, clean, clean, clean, clean |
| reference-file-edit | 9 | 0 | 0 | clean, exemplary, clean, clean, clean, exemplary |
| total | 93 | 2 | 5 | |

### Candidate median - skill SHA `ec84d42` (the commit whose `skills/forge-skill/SKILL.md` is the shipped file; fixed across the three runs by a detached worktree), skill hash `5990825d4f7f2a8de8da046ccca86e35663d867465738d1342969b1478c0a691`

| sample | kept | disputed | lost | levels |
|---|---|---|---|---|
| minimal-diff-one-line | 6 | 0 | 3 | blunt, blunt, blunt, blunt, blunt, blunt |
| oversized-skill-extraction | 9 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-contract-change | 11 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-frontmatter-preserved | 11 | 0 | 0 | clean, clean, clean, clean, acceptable, acceptable |
| persona-imperative-rewrite | 11 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-inline-not-skill | 9 | 1 | 0 | acceptable, clean, acceptable, exemplary, acceptable, clean |
| persona-one-line-addition | 11 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-thinking-knob-no-model | 9 | 1 | 0 | acceptable, clean, acceptable, clean, acceptable, clean |
| prohibition-to-recipe | 9 | 0 | 0 | clean, clean, exemplary, exemplary, clean, exemplary |
| reference-file-edit | 9 | 0 | 0 | clean, clean, clean, clean, clean, exemplary |
| total | 95 | 2 | 3 | |

Persona subset kept (median): baseline 60 -> candidate 62 of 64 (recorded, not gated). `compare` over the medians: exit 0; moved facts: `persona-frontmatter-preserved` "Only the sentence or sentences that own the requested rule changed; the rule is not restated in a second place." lost -> kept, and "Every added or modified line is ASCII only; unchanged lines keep their original bytes." lost -> kept; regressions: none. The non-kept facts shared by both medians are `minimal-diff-one-line` (three facts: every draw also rewrote the "A paragraph over 120 words." red flag - a shared-rule reading, not a persona matter) and one reviewer dispute each on `persona-inline-not-skill` (whether the inlined bar must say "Critical" where the persona's vocabulary is `blocker`) and `persona-thinking-knob-no-model` (whether refusing to pin `model` means the request is "present").

History that shaped the shipped rules: the first two single pairs tied (40 -> 40 of 44; 60 -> 60 of 64) with one fact each moving in opposite directions, which motivated the three-pair median. The first three-pair median (candidate at `0916964`, before the ASCII clause) regressed on exactly one fact: the candidate kept the fixture's em-dashes on the two severity rows it rewrote in 5 of 6 draws while the baseline did so in 2 of 6, because the persona rules' byte-identity wording was being generalized to rewritten lines. The shipped Frontmatter-pin rule adds "Byte-identity covers untouched lines only; a line the edit rewrites follows the ASCII rule like any other."; after it the fact is kept in 3 of 3 candidate draws. Raw records under `$TMPDIR` (not committed).

## Eval judgment

Final proof for the shipped skill. Three paired runs on 2026-10-04, candidate `anthropic/claude-opus-5-5`, reviewers `github-copilot/gpt-6-astra` and `anthropic-fable/claude-fable-5-1`, thinking `medium`, reviewer-prompt hash `5694611a1c5815242a54604e87be874a66e988c07f5f60a8511e362c5752f081`. Per-run totals (kept/disputed/lost): baseline 97/2/1, 98/2/0, 97/2/1; candidate 97/2/1, 96/3/1, 97/3/0. Every run was 10 of 10 samples `ok` on a clean skill SHA. Task hashes are those of the superseded judgment above except `minimal-diff-one-line`, whose request now names both the step cap and the red flag that restates it: `33c53f2dd1e33ce99c56ee7fad450dc3e6c3801456fc2dbfe0a05d7cab3d5cb4`.

### Baseline median - skill SHA `2166283`, skill hash `681f54c22285d172a5e5071081138a8cc4cce91ca56db2fe8e132cfb68f0fa6f`

| sample | kept | disputed | lost | levels |
|---|---|---|---|---|
| minimal-diff-one-line | 9 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| oversized-skill-extraction | 9 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-contract-change | 11 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-frontmatter-preserved | 10 | 0 | 1 | acceptable, acceptable, clean, clean, acceptable, acceptable |
| persona-imperative-rewrite | 11 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-inline-not-skill | 9 | 1 | 0 | acceptable, exemplary, acceptable, clean, acceptable, clean |
| persona-one-line-addition | 11 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-thinking-knob-no-model | 9 | 1 | 0 | acceptable, clean, acceptable, clean, acceptable, clean |
| prohibition-to-recipe | 9 | 0 | 0 | exemplary, clean, exemplary, exemplary, exemplary, clean |
| reference-file-edit | 9 | 0 | 0 | exemplary, exemplary, clean, exemplary, exemplary, clean |
| total | 97 | 2 | 1 | |

### Candidate median - skill SHA `14be704` (the commit whose `skills/forge-skill/SKILL.md` is the shipped file; fixed across the three runs by a detached worktree), skill hash `410f3854a441e74b22c6b089dbee7546424846c8d25c9ab1197361d77ab46ec1`

| sample | kept | disputed | lost | levels |
|---|---|---|---|---|
| minimal-diff-one-line | 9 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| oversized-skill-extraction | 9 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-contract-change | 11 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-frontmatter-preserved | 10 | 0 | 1 | acceptable, acceptable, blunt, acceptable, clean, acceptable |
| persona-imperative-rewrite | 11 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-inline-not-skill | 9 | 1 | 0 | acceptable, clean, acceptable, clean, acceptable, clean |
| persona-one-line-addition | 11 | 0 | 0 | clean, clean, clean, clean, clean, clean |
| persona-thinking-knob-no-model | 9 | 1 | 0 | acceptable, clean, acceptable, clean, acceptable, clean |
| prohibition-to-recipe | 9 | 0 | 0 | exemplary, clean, clean, exemplary, exemplary, clean |
| reference-file-edit | 9 | 0 | 0 | clean, exemplary, exemplary, exemplary, clean, exemplary |
| total | 97 | 2 | 1 | |

Persona subset kept (median): baseline 61 -> candidate 61 of 64 (recorded, not gated). `compare` over the medians: exit 0; moved facts: none; regressions: none. The non-kept facts are identical on both sides: `persona-frontmatter-preserved` loses the owning-sentence fact (every draw restates the verdict mapping once in the severity rows and once in a summary sentence), and `persona-inline-not-skill` and `persona-thinking-knob-no-model` each carry one reviewer dispute (whether the inlined bar must say "Critical" where the persona's vocabulary is `blocker`; whether refusing to pin `model` means the request is "present"). The ASCII fact on `persona-frontmatter-preserved` is kept at the median on both sides - 3 of 3 candidate draws since the Frontmatter-pin rule gained its rewritten-line clause, against 1 of 6 before it.

Finding: on these ten samples the shipped `## Persona rules` neither regress nor measurably improve a strong candidate model's edits; the eval's value in this flow was catching two wording effects before they shipped (the byte-identity rule being generalized to rewritten lines, and a sample that rewarded producing an inconsistent file). Raw records under `$TMPDIR` (not committed).

## Landing reconciliation

`eval/README.md` (the spec-summarizer sibling) landed on `main` first, so this change reconciled at squash time per Component 2's clause: `eval` is not in `scripts/model-literal-lint.mjs` `SCOPE_DIRS` after all, because the convention commits `results/` records that carry model ids (230 findings against the landed tree); `scripts/ci.mjs` instead runs `eval/forge-skill/run.test.mjs` alongside the other targets' deterministic tests and keeps the sample-shape check. The `case.md`/`expected.md` names, the uncommitted results, and the `run.mjs --skill-dir` CLI stay as deliberate deviations, listed in `eval/forge-skill/README.md`.
