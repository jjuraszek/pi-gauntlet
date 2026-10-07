# Universal eval driver, paired intent-aware judge, and `eval/_template`

**Goal:** Replace the eight per-target eval runners with one driver, one judge prompt, and one directory shape, so that a skill, persona, or prompt edit is checked unattended by two frozen replay models and one frozen judge that compares the before and after outputs against a committed intent, keeps only the newest records, and fails on any deviation the intent does not own.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Ticket:** jjuraszek/pi-gauntlet#50
**Supersedes:** `doc/specs/2026-10-04-spec-summary-briefing.md`, section "3. Eval: `eval/README.md` and `eval/spec-summarizer/`" only; `doc/specs/2026-10-04-forge-skill-persona-authoring.md`, "Component 2: `eval/forge-skill/`" and the three "Eval judgment" sections only; `doc/specs/2026-10-04-brainstorming-challenge-note-replay.md`, the `eval/brainstorming/` sample package only (its "6. Replay harness" section stays live).

## Problem

`eval/` holds 8 targets and 54 samples but no shared process. Seven `run.mjs` files are copies of `eval/gatekeep-pr/run.mjs` (48-93 changed lines each), `eval/forge-skill/run.mjs` is a different driver, every target has its own `reviewer-prompt.md`, and `scripts/ci.mjs:460` lists the eight test files by hand. Models are command-line arguments, baselines are produced by hand from `git show <sha>:<file>`, and the judge scores each arm on its own: it never sees the before and the after together, and it never knows what the edit meant to change, so an intended deviation and a regression look the same until a human reads `compare.md`. Every run adds a `results/<run-id>/` directory (about 920K committed).

The standing rule in `AGENTS.md` (`## Change process`, second paragraph) already requires an eval for a non-trivial edit under `skills/`, `agents/`, or a prompt file, but "non-trivial" has no boundary below "typo, formatting, dependency bump, release commit", so a meaning-preserving wording patch is formally in scope while the intent of the rule is behavior change.

Framing: kept. The scout's one objection - a copy-me `_template` would extend the duplicated-driver debt - is answered by the shape below: `_template` holds the per-target skeleton and no code.

Purpose of the eval, which fixes several decisions below: it is a change-safety check, not a current-state score. A change is expected to move the properties it names and nothing else; the models are frozen so that only the wording under test varies between runs.

## Acceptance criteria

Ticket jjuraszek/pi-gauntlet#50, "Acceptance criteria", rows verbatim:

- [ ] An eval-task set is committed under one documented repo path: one task for every directory in `skills/` at the landing commit, except skills on a committed exclusion list where each entry carries a one-line reason (human-only, side-effecting on git/PRs, pure orchestrator). Each task has fixed inputs, a scratch cwd fixture, an isolation recipe that requires no network beyond the runner's model-provider calls, a statement of how any subagent dispatch inside the task is handled (stubbed or real), a judge rubric, and a ceiling of 10 minutes wall time per task run at the baseline model. `rg -ni "jjuraszek|/Users/[^/]+"` over the set returns zero matches.
  deviates: coverage grows with changes, never retroactively - this ticket migrates the 8 existing targets and adds no new ones and no exclusion list. The row's per-task properties that survive are restated in Design: fixed inputs, scratch cwd for `kind: edit`, no network beyond model calls, no subagent dispatch (replay runs `pi -p` with no extensions), a 10-minute timeout per replay call, and the hygiene scan (owner handle allowed only inside URLs and ticket refs, as `scripts/ci.mjs` already does).
- [ ] The judge is a committed prompt file at a documented path outside `skills/` and `agents/`, dispatched only by the runner and absent from `.claude-plugin/marketplace.json`. It takes the task inputs, the rubric, and one candidate output, and returns one level from a labeled ordinal scale fixed in the prompt file - at most 5 levels, each defined by a plain-words description a human can apply without the rubric (e.g. `fails` / `partial` / `passes` / `exemplary`) - plus a one-line rationale, in a documented format.
  deviates: the judge is paired - it takes both outputs and the intent, not one candidate, and returns per-fact labels, a three-value verdict, and a feedback paragraph (Design, "Judge"). The committed-prompt, runner-only, and outside-marketplace parts are in scope: `eval/judge.md`.
- [ ] A runner committed at a documented repo path executes one named skill task against one `provider/model:thinking` string and writes one result record whose schema is documented next to the eval set. The record carries: judge score and rationale, judge model string, model string under evaluation, content hash of the task inputs + rubric, content hash of the judge prompt, the skill directory's git SHA, and the telemetry-shaped derived metrics (tokens, cost, wall). The runner refuses to report a delta between two records whose task/rubric or judge-prompt hashes differ and says a new baseline is required.
  deviates: models are frozen constants, not an argument, and the record carries wall time but no tokens or cost (Open question 1). Everything else in the row is in scope: `eval/run.mjs`, the record schema in `eval/README.md`, hashes of inputs, facts, and judge prompt, the skill-file sha, and the refusal rule (a stale baseline is rerun, not compared).
- [ ] The judge model string is `anthropic-fable/claude-fable-5-1:medium` for the whole baseline and is recorded in every result; the cells whose evaluated model is `anthropic-fable/claude-fable-5-1` (a spec-council member in pi-balanced) are flagged `self-judged: true` in their records.
  deviates: judge id and its recording are in scope; no `self-judged` flag, because the replay set is Opus and GPT only and no cell is judged by its own model.
- [ ] A snapshot of pi-balanced's role -> model + thinking assignments as of the baseline date is committed next to the baseline, including how an unset thinking level was resolved (provider default, recorded as such).
  deviates: no preset sweep; the three model ids and the `medium` thinking level are constants in `eval/lib/models.mjs` and are recorded in every record.
- [ ] Baseline committed under version control: every non-excluded skill task x every distinct model + thinking string in that snapshot, each cell run 3 times.
  deviates: the committed baseline is every migrated sample x the two replay models x one run (Design, "Migration").
- [ ] Judge stability recorded separately from candidate variability: the judge re-scores one saved candidate output per cell 3 times, and the committed stability report shows judge-only level agreement and candidate-run level spread per cell side by side. The report states the stability decision rule (metric and threshold) before the sweep is run, then records the go/no-go on using the judge as a ship gate against that rule, with rationale.
  deviates: no stability sweep; one judge call per sample per replay model, and disagreement between the two replay models is shown in the report with the worse verdict winning.
- [ ] `.pi/gauntlet-overrides.md` gains a verification rule: a change under `skills/<name>/` runs that skill's eval task in every baseline cell for that skill and reports the level per cell next to the modal level of the 3 baseline runs and flags any cell that dropped a level.
  deviates: the rule lands in `AGENTS.md` `## Change process` (the behavior test, Design, "Policy"), not the overrides file, because it is a repo convention and not a skill override; the cells are the two frozen replay models and the report shows per-fact labels, not levels.

## Design

### Layout

```
eval/
  README.md                  the process: what a run does, how to add a target or sample, record schema, hygiene rule
  run.mjs                    the only driver; CLI: node eval/run.mjs <target> [<sample>] [--baseline-only]
  judge.md                   the only judge prompt
  anonymize-prompt.md        unchanged
  lib/
    models.mjs               the three frozen model ids and the thinking level
    replay.mjs               runs one arm for one sample (text or edit kind)
    judge.mjs                builds the judge call, parses its JSON block
    records.mjs              read/write records, freshness decision
    checks.mjs               mechanical checks: hashes, word cap, mechanical facts
    hygiene.mjs              the one hygiene definition (patterns, exemptions, scope)
    intent.mjs               intent.md parsing, stub detection, for: check
    report.mjs               renders report.md from records
    lint.mjs                 structural lint: every target matches the template shape
    *.test.mjs               node:test, no model calls
  _template/
    README.md                how to add a target or a sample; restates the anonymization rule
    target.json              kind, skill files, word cap
    replay.md                the per-target instruction prepended to every case.md as the user turn
    intent.md                stub with the two required headings
    samples/<sample-name>/
      case.md                the replay input for this sample
      expected.md            must-hold facts, one per line, each tagged mechanical: or judged:
      fixture/               kind: edit only; files the worker edits
  <target>/                  same shape as _template, plus:
    results/<sample>/baseline.json
    results/<sample>/candidate.json
    report.md                newest judge report, overwritten each run
  brainstorming/replay/      untouched except its README link to the renamed samples/ path; outside the template and the lint
```

The eight targets keep their names: `brainstorming`, `conformance-check`, `forge-skill`, `gatekeep-pr`, `gatekeep-pr-merge-state`, `gatekeep-pr-scope`, `spec-gate`, `spec-summarizer`. A sample name states the property under test (`council-dispatch-after-lint`, not `case-3`); the judge is told to score that property and nothing else.

### `target.json`

```json
{
  "kind": "text",
  "skillFiles": [
    { "path": "skills/gatekeep-pr/SKILL.md" },
    { "path": "skills/gatekeep-pr/reference/sync.md" },
    { "path": "skills/gatekeep-pr/reference/decision-menu.md" }
  ],
  "assembly": "headed",
  "wordCap": 2000
}
```

`kind` is `text` or `edit` and applies to every sample of the target. `skillFiles` lists the repo-relative files that form the skill under test, in order; an entry may carry `"slice": "<heading>"` (from that `##`/`###` heading line, through the next heading of the same or higher level, exclusive) with an optional `"sliceTo": "<heading>"` (end before that heading line instead, so a slice can span sibling sections), or `"body": true` (strip YAML frontmatter). Headings match on their line prefix (`### 3` matches `### 3. Understand the idea`). For `text` the assembled text is the system prompt; `assembly` is `concat` (join the slices with one blank line) or `headed` (join with a `# <path>` line before each file, the conformance-check case). For `edit` the entries carry no `slice`/`sliceTo`/`body` (the lint rejects them) and the files are materialized whole into a scratch skill directory under their path relative to the first entry's directory (the lint rejects an entry outside it) handed to the worker (`--skill <dir>`; the skill name resolves from frontmatter, so the directory name is free). A `text` sample may add files for itself with `bundle+: <repo path>` lines at the top of `case.md` (the lint rejects them under `edit`, whose user turn is the request alone) (at most one today: `gatekeep-pr-scope/directional-dependency` adds `skills/check-delivery/SKILL.md`); the driver strips those lines from the user turn and appends the files to the assembly for both arms. The existing brainstorming baseline-only `Framing:` strip is retired: the two arms differ only in the skill text.

`skillSha` is the sha256 of the assembled skill text (plus the `bundle+` files, in list order), never a commit sha. `wordCap` is the only numeric tunable; it is a mechanical check on `text` outputs and is ignored for `edit`. Quality labels, readable thresholds, and lost tolerances from the old drivers are gone: the paired judge replaces the quality scale, and tolerance is zero because the intent, not a number, owns deviations.

Migration table, from the loaders at HEAD:

| target | kind | skillFiles | assembly | old transformation and its disposition |
|---|---|---|---|---|
| brainstorming | text | `skills/brainstorming/SKILL.md` slice `### 3` sliceTo `### 6` (today's `sliceSkill` range) | concat | baseline-only `Framing:` strip retired; facts re-validated at the migration baseline |
| conformance-check | text | `skills/verification-before-completion/reference/conformance-check.md`, `skills/finishing-a-development-branch/reference/disposition-protocol.md`, `skills/finishing-a-development-branch/SKILL.md` slice `### Step 3.5` sliceTo `### Step 5` (today's `bundle` order) | headed | unchanged |
| forge-skill | edit | `skills/forge-skill/SKILL.md` | n/a | fenced `file <path>` blocks in `case.md` become `fixture/` files; request stays in `case.md` |
| gatekeep-pr | text | `skills/gatekeep-pr/SKILL.md`, `reference/sync.md`, `reference/decision-menu.md` | concat | unchanged |
| gatekeep-pr-merge-state | text | the five files today's loader lists | concat | unchanged |
| gatekeep-pr-scope | text | `skills/gatekeep-pr/SKILL.md`, `skills/gatekeep-pr/verification-brief.md`, then every `skills/gatekeep-pr/reference/*.md` in sorted order (listed explicitly, no glob) | headed | `bundle+` kept as above |
| spec-gate | text | `skills/brainstorming/reference/spec-finalization.md` slice `## User Review Gate` | concat | unchanged |
| spec-summarizer | text | `agents/spec-summarizer.md` body | concat | unchanged (today's `stripFrontmatter`) |

The implementer fills the `gatekeep-pr-merge-state` and `gatekeep-pr-scope` rows from `loadPersona` in those two drivers; the plan task names each file.

### `intent.md`

```markdown
for: <skillSha of the candidate assembly this intent describes>

## Change
<one paragraph: what the edit means to alter in the agent's behavior>

## Expected to move
- <sample>/<fact id>: <holds|fails> -> <holds|fails> - <why>
```

One file per target, overwritten by whoever edits the skill, committed with the change. The driver parses `## Expected to move` itself (one bullet per allowed transition, fact referenced by id, direction stated) and hands the judge the parsed list plus the `## Change` paragraph. The driver refuses the candidate arm when the file is the `_template` stub, lacks a heading, has an unparseable bullet, or when `for:` does not equal the current candidate `skillSha` of the bundle-free assembly (the target's `skillFiles` alone, without any sample's `bundle+` files, so one value fits every sample) - so a skill edit that forgets to rewrite the intent is refused rather than inheriting the previous list; the driver prints the current `skillSha` in the refusal so the author can paste it. `--baseline-only` ignores the file so a new sample can be seeded. No history is kept in the file - git holds it.

### `expected.md`

Line 1 may be `anonymized: true` (metadata, kept by migration; 11 samples carry it). Then one fact per `- ` line: `- <id>: judged: <plain sentence>` or `- <id>: mechanical: <check>` where `<check>` is `contains "<literal>"`, `lacks "<literal>"`, or `matches /<regex>/<flags>`; `contains`/`lacks` are substring tests on the whole output, `matches` is a JavaScript regex test. Mechanical facts are checked in code per replay model and never sent to the judge; judged facts are the judge's input. Ids are stable within a sample and unique. The lint checks only `- ` lines; any other non-blank line after line 1 is an error, and a file with no fact lines is an error.

### Replay

Both replay models run every sample: `anthropic/claude-opus-5-5` and `github-copilot/gpt-6.1-sol`, thinking `medium`, as `pi -p --no-skills --no-extensions --no-context-files --no-session`, 10-minute timeout per call (the same timeout applies to every judge call). The system prompt goes through `--system-prompt <tmpfile>`; the user turn (`replay.md` + `case.md` minus `bundle+` lines) goes through stdin, verbatim - never `@file`, which wraps the content in a `<file name="<absolute path>">` tag and leaks the path into the prompt.

`kind: text`: `--no-tools`; the output is the reply text.

`kind: edit`: the driver copies `samples/<name>/fixture/` to `mktemp -d`, runs `git init`, `git add -A`, `git commit -m fixture`, materializes the arm's `skillFiles` into a second scratch dir, and runs the worker in the fixture dir with `--tools read,edit,write --skill <scratch skill dir>` and the user turn `/skill:<name> <request>` plus the fixture file list; after the worker exits the driver runs `git add -A` and captures `git diff --cached HEAD` (so new files count), the resulting tree (every file's path, line count, and content), and removes both scratch dirs. The judged artifact is the diff plus the resulting tree, because facts such as "every SKILL.md stays under 500 lines" or "the check appears exactly once across files" need evidence outside the changed hunks. A worker exit without a diff is `error` for that cell. The forge-skill samples' fenced `file <path>` blocks become real files under `fixture/`; `case.md` keeps the request.

Baseline arm: the driver reads `skillFiles` (and `bundle+` files) at `--base <ref>`, default `git merge-base HEAD origin/main`, with `git show <base>:<path>`; the candidate arm reads the working tree. A dirty working tree never blocks a baseline run: `git show` reads the ref, not the tree, so the normal flow (edit the skill, add a sample, run the driver) seeds the new sample's baseline on the committed text while the candidate arm sees the edit.

Replay identity, per sample and per replay model: `skillSha`, `inputSha` (`replay.md` + `case.md` + `bundle+` paths + the fixture tree hashed in sorted path order), `kind`, `assembly`, and the replay model id and thinking level. A stored cell is reusable when every identity field matches and its `status` is `ok`; a cell with `status: error` is rerun. A stored `baseline.json` is fresh when all of its cells are reusable; otherwise the stale or failed cells rerun. On any run, a stored `candidate.json` whose `skillSha` equals the current base `skillSha` is promoted to `baseline.json` first, with its `judge` block removed. A sample added with a change has no record, so its baseline runs on the pre-change text while the others reuse theirs. Changes to `expected.md`, `judge.md`, or `intent.md` never trigger a replay; they trigger a new judgment over the stored outputs (next section).

### Judge

One call per sample per replay model on `anthropic-fable/claude-fable-5-1`, thinking `medium`, prompt `eval/judge.md`, input: `case.md`, the judged facts, the `## Change` paragraph and the parsed `## Expected to move` list, the baseline output, the candidate output (for `edit`: request, fixture tree before, and for each arm the diff and the resulting tree). The judge runs only when both arms of the cell have `status: ok`. It returns one fenced JSON block:

```json
{
  "facts": { "<id>": { "before": "holds" | "fails", "after": "holds" | "fails" } },
  "feedback": "<one paragraph aimed at the candidate wording>"
}
```

The driver derives the labels - the judge reports outcomes, the code applies the intent:

| before -> after | in `Expected to move` with that direction | label |
|---|---|---|
| same | - | `held` (both hold) or `pre-existing` (both fail) |
| moved | yes | `intended change` |
| holds -> fails | no, or listed with the opposite direction | `regression` |
| fails -> holds | no | `unexplained change` |

A listed transition that did not happen is `intended but unchanged`. Cell verdict: `regressed` on any `regression` or `unexplained change`; `improved` when at least one `intended change` and nothing else moved; otherwise `unchanged`; `error` when either arm or the judge failed (timeout, malformed JSON after one retry). Mechanical facts get `before`/`after` from code and go through the same table. Sample verdict across the two replay models is the worse under `error > regressed > unchanged > improved`; the report shows both cells.

Noise rule: a single sample per arm from a model at `medium` can flip a fact by chance. When a cell's verdict is `regressed`, the driver reruns that cell's candidate arm once and rejudges; the label stands when it reproduces, otherwise the cell is `inconclusive` (ranked between `error` and `regressed`, non-passing), and the second observation stays in the record under `judge[model].confirmation` (the record schema below). Noise is never resolved by widening `intent.md`.

The judge prompt restates the before/after outcome question in plain words so a human can apply it without the driver, which is the part of ticket AC 2 that survives.

### Records and report

`results/<sample>/{baseline,candidate}.json`, one per arm, newest only:

```json
{
  "sample": "council-dispatch-after-lint",
  "arm": "candidate",
  "kind": "text",
  "assembly": "concat",
  "skillSha": "<sha256 of the assembled skill text>",
  "inputSha": "<sha256 of replay.md + case.md + bundle+ paths + sorted fixture tree>",
  "repoSha": "<git HEAD>",
  "models": { "replay": ["anthropic/claude-opus-5-5", "github-copilot/gpt-6.1-sol"], "judge": "anthropic-fable/claude-fable-5-1", "thinking": "medium" },
  "outputs": {
    "<replay model>": { "status": "ok" | "error", "error": "<reason or absent>", "text": "...", "tree": { "<path>": { "lines": 0, "content": "..." } }, "words": 0, "wallMs": 0, "mechanical": { "<fact id>": "holds" | "fails" } }
  },
  "judge": {
    "<replay model>": {
      "factsSha": "<sha256 of expected.md>", "judgePromptSha": "<sha256 of eval/judge.md>", "intentSha": "<sha256 of intent.md>",
      "baselineOutputSha": "<sha256>", "candidateOutputSha": "<sha256>",
      "facts": { "<id>": { "before": "holds", "after": "fails", "label": "regression" } },
      "verdict": "regressed", "feedback": "...", "confirmation": { "text": "...", "facts": {} }
    }
  }
}
```

`tree` exists only for `edit`. `baseline.json` carries no `judge` block (the judge runs on pairs). A judgment is current when its `factsSha`, `judgePromptSha`, `intentSha`, and both output shas equal the present values; otherwise the driver rejudges the stored outputs without replaying.

`report.md` per target, overwritten each run, carries the `## Change` paragraph and `for:` sha, then one row per sample and replay model with the verdict, the per-fact `before -> after` and label, and the feedback paragraph, and a final `exit: 0|1` line. A run with a `<sample>` argument renders only that sample and titles the report `partial run: <sample>`; rows for samples not run in this invocation are never rendered from stored judgments, so a partial report can never read as a target-wide pass. Exit is non-zero on any `regressed`, `inconclusive`, or `error` cell.

### Mechanical checks (code, before the judge)

Output non-empty (`text`) or diff non-empty (`edit`); words <= `wordCap` (`text` only); mechanical facts; hygiene scan. The hygiene definition lives once, in `eval/lib/hygiene.mjs`, with three predicates: `/Users/<name>` paths; the owner handle outside `github.com/<owner>/` URLs and `<owner>/<repo>#N` refs; token-shaped secrets with boundaries (`-----BEGIN [A-Z ]*PRIVATE KEY-----`, `\bghp_[A-Za-z0-9]{20,}`, `\bsk-[A-Za-z0-9]{20,}`, `\bAKIA[A-Z0-9]{16}\b`, `\bxoxb-[0-9A-Za-z-]{20,}`) - bare prefixes are not enough, since `task-bound` contains `sk-`. A target may add `"denylist": ["<regex>", ...]` to `target.json`; migration moves the consumer-project tokens that `scripts/ci.mjs` scans under `eval/brainstorming/` and `eval/gatekeep-pr-merge-state/` into those two targets' denylists, and the per-target external denylist file of the old `leakCheck` is retired. The scan covers every file under `eval/` except `eval/lib/**` (where the patterns and their positive test fixtures live), plus model outputs at run time. A hit on a sample is a hard fail before any model call; a hit in an output fails the cell and the output is stored redacted.

### Refusals

- `intent.md` missing, stub, heading missing, unparseable bullet, or `for:` not equal to the candidate `skillSha` -> no candidate arm.
- Structural lint failure (missing `case.md`/`expected.md`, untagged or malformed fact line, `edit` without `fixture/`, unknown `kind` or `assembly`) -> exit before any model call.
- No `--base` and no `origin/main` -> refuse the baseline arm with that reason.
- Models are constants; the CLI has no model flag.

### CI (`scripts/ci.mjs`)

In the test invocation at line 460, replace only the eight `eval/*/run.test.mjs` arguments with a glob over `eval/lib/*.test.mjs`; `scripts/happy-path-run.test.mjs`, `scripts/gatekeep-comment-reconcile.test.mjs`, and `scripts/brainstorming-contract.test.mjs` stay. Replace the forge-skill-only shape check (527-543) with `eval/lib/lint.mjs` over every target except `brainstorming/replay`, plus `_template` itself. Replace the inline hygiene scan (165-176) with a call into `eval/lib/hygiene.mjs` over the same scope, so there is one definition; `execFileSync` does not expand globs, so `scripts/ci.mjs` lists `eval/lib/*.test.mjs` through `readdirSync`. `eval/` stays outside `package.json#files` and outside `model-literal-lint`; the lint's success message that claims eval coverage is corrected.

### `eval/_template`

A target is added by copying `_template` to `eval/<target>/`, filling `target.json` and `replay.md`, adding samples, and writing `intent.md`. The template passes its own structural lint (it is a valid target with one placeholder sample `example-property` that the lint treats as template-only). It holds no script.

### Migration

For each of the eight targets: `sample/` -> `samples/`, `source.md` -> `case.md` (the `bundle+` line stays at the top), the per-target user-prompt constant -> `replay.md`, `expected.md` facts tagged (`judged:` by default; the existing backtick-line and path-token checks become `mechanical:` facts where a target had them; `anonymized: true` stays on line 1), `target.json` written per the migration table, `intent.md` stub, `README.md` reduced to what the target tests and which skill files it loads; `run.mjs`, `run.test.mjs`, `reviewer-prompt.md`, and `results/<run-id>/` deleted. forge-skill's `case.md` fixtures move into `fixture/`.

Baseline sweep, last step before the finish: rebase the branch onto `origin/main`, verify `git merge-base HEAD origin/main` equals `origin/main`, run `node eval/run.mjs <target> --baseline-only` for every target, and commit the 54 `baseline.json` files; each carries `skillSha` equal to the assembled skill text at that base. Every sample then has a fresh baseline after merge and the next skill change runs only its candidate arm. This is the one model-calling step: 54 samples x 2 replay models.

### Policy

`AGENTS.md` `## Change process`, second paragraph, becomes:

> An edit under `skills/`, `agents/`, or a prompt file that changes what the agent does or says to the user creates or extends `eval/<target>/` per [`eval/README.md`](eval/README.md), adds a sample exercising the changed behavior when the target already exists, writes the target's `intent.md`, and runs `node eval/run.mjs <target>` before the finish; the brainstorm spec names the samples and their must-hold facts. Wording that keeps every instruction's meaning (synonyms, punctuation, reflowing, a corrected path) is exempt; the commit body states which of the two the edit is, and the conformance check in `/skill:verification-before-completion` reads that statement and the committed `eval/<target>/report.md`. The trivial-edit exemptions above stay unchanged, and `extensions/`, `src/bins/`, and `scripts/` stay on `npm test`.

There is no PR gate on `main` (`.pi/gauntlet-overrides.md` `## Release`), so the conformance check is the enforcing step and no runtime gate is added. `## Testing` names the `eval/lib` glob and structural lint. The `## Package rules` Evals bullet drops the forge-skill sentence.

`AGENTS.core.md` bumps to v9 with one rule under `## Ground Truth Before Reasoning`: tickets, specs, and eval samples carry no private or proprietary data and no secrets; material that originates in a private repo is anonymized or replaced by simpler synthetic text before it lands. In this repo both `agents-core:begin`/`end` marker lines in `AGENTS.md` are edited to `v9` by hand, then `node scripts/check-agents-core.mjs --fix` copies the body (`--fix` preserves the markers). The three siblings are synced at release time per `.pi/gauntlet-overrides.md` `## Release` (copy, bump markers, `--fix`, commit, push in each), not in this change.

## Errors and edge cases

- Replay or judge call fails, times out, or returns empty -> that cell is `error` with the reason in the record; other cells continue; exit non-zero; the next run reruns only the failed cells.
- Judge disagreement between replay models -> both shown, worse verdict wins (`error > inconclusive > regressed > unchanged > improved`).
- Both arms fail a fact -> `pre-existing`, not `regression`; the report shows it so a standing gap stays visible.
- A listed transition that did not happen -> `intended but unchanged`, listed in the report so an edit that did not take effect is visible.
- `--baseline-only` with every cell reusable -> no call, exit 0 with "baseline fresh"; a matching `candidate.json` is promoted in this mode too.
- `expected.md`, `judge.md`, or `intent.md` changed since the last judgment -> rejudge from stored outputs, no replay.
- A hygiene hit in model output never reaches the committed record: the record stores the redacted text and the cell fails.

## Tests

`eval/lib/*.test.mjs`, run by `scripts/ci.mjs`, no model call:

- `records.test.mjs`: replay-identity reuse table (each identity field, `status: error` reruns, a `kind`/`assembly`-only change invalidates); judgment-currency table (facts/judge/intent/output shas); promotion strips `judge`. Promotion in both driver modes and partial-run row selection are driver behavior, covered by `run.test.mjs` (Task 10 of the plan).
- `judge.test.mjs`: JSON block parsing, retry on malformed, label derivation table including opposite-direction intent -> `regression` and fails -> holds unlisted -> `unexplained change`, `intended but unchanged`, verdict order, confirmation rerun -> `inconclusive` when the label does not reproduce.
- `intent.test.mjs`: stub detection, `for:` mismatch refusal, bullet grammar (valid, malformed, unknown fact id).
- `checks.test.mjs`: word cap (`text` only), mechanical grammar (`contains`, `lacks`, `matches`, malformed), `expected.md` parsing with and without `anonymized: true`.
- `hygiene.test.mjs`: each predicate positive; the URL and ticket-ref exemptions; `task-bound` and `task-contract` do not match; `denylist` from `target.json`; `eval/lib/**` excluded from scope.
- `replay.test.mjs`: assembly for `concat`, `headed`, `slice`, `sliceTo` (the brainstorming slice ends before `### 6` and contains `### 5`; the conformance slice contains `### Step 4`), `body`, and `bundle+` (the `directional-dependency` sample's assembled input contains `skills/check-delivery/SKILL.md`); argument lists for both kinds without spawning; for `edit`, fixture commit, worker-created untracked file present in `git diff --cached HEAD`, resulting tree captured; dirty working tree plus a new sample: baseline reads `git show <base>:` content, candidate reads the tree.
- `report.test.mjs`: render from fixture records, only the given rows render, partial-run title, exit line.
- `lint.test.mjs`: every committed target and `_template` pass; a fixture target missing `fixture/` under `kind: edit` fails.

Acceptance of the migration itself: `npm test` green.

Migration acceptance, beyond the suite: 54 committed `baseline.json` files whose `skillSha` equals the assembled skill text at `origin/main` at landing; `node eval/run.mjs <target>` for any target exits 2 with `intent: intent.md is the template stub` and runs no candidate arm; `node eval/run.mjs <target> --baseline-only` exits 0 with "baseline fresh".

## Documentation impact
- Feature / user-facing docs introduced: `eval/_template/README.md` - the procedure for adding a target or sample (major procedures / conventions)
- Materially amended existing docs: `eval/README.md` - rewritten around the single driver, paired judge, record schema, newest-only records, and the anonymization rule (major procedures; architecture); `AGENTS.md` - `## Change process` behavior test, `## Testing` eval glob, `## Package rules` Evals bullet (major procedures); `AGENTS.core.md` v9 - the no-private-data rule (security, data-access); `README.md` `## Evals` - the per-target runner commands and the forge-skill deviation paragraph are replaced by the single-driver command (major procedures); `CHANGELOG.md` - one entry under `## Unreleased`, promoted to a version heading by the release flow (major procedures)
- Derived / memory docs invalidated: the eight `eval/<target>/README.md` files (they describe their own runner, recorded-runs tables, and result dirs); `AGENTS.md` routing row "Measure a forge-skill edit against the eval samples" now points at `eval/README.md`; `doc/specs/2026-10-04-spec-summary-briefing.md`, `doc/specs/2026-10-04-forge-skill-persona-authoring.md`, `doc/specs/2026-10-04-brainstorming-challenge-note-replay.md` carry supersession banners for their eval sections

Materiality bar: `reference/documentation-impact.md`.

## Out of scope

- New targets or samples beyond the 54 migrated; coverage grows with future changes.
- A runtime gate that blocks a PR on the eval exit code; the PR gate reads the committed `report.md` and the commit body's behavior/wording statement.
- `eval/brainstorming/replay/` (private live-tool harness).
- Judge stability sweeps, preset snapshots, and the pi-balanced cell matrix from the ticket.
- Copying `AGENTS.core.md` v9 into pi-quiver, pi-cohort, pi-condense: done at release per `.pi/gauntlet-overrides.md` `## Release`.
- Rewriting ticket #50's body to match this spec: a follow-up through `/skill:shape-ticket` after approval, carrying the dispositions above.
- Token and cost per call: `pi -p --mode json` exposes usage, so this is a scope decision, not a limitation; the record carries `wallMs` only.
- `report.md` for a target with zero candidate runs: the migration commits none; the first candidate run creates it.
