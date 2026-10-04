# forge-skill eval

Measures whether an edit to `skills/forge-skill/SKILL.md` makes a worker edit instruction files better. Outside `package.json#files`; model runs never happen in `scripts/ci.mjs` (it runs only `run.test.mjs` and the sample-shape check) (ci only lints this directory for provider/model literals and sample shape).

## One run

`node eval/forge-skill/run.mjs --skill-dir <path> --candidate-model <id> --reviewers <id>,<id> [--thinking <level>] [--out <dir>] [--sample <slug>]`

For every `sample/<slug>/`:

1. The fixture files from `case.md` are written into a fresh `mkdtemp` dir under `$TMPDIR`, committed with `git init`.
2. The worker runs `pi -p --model <candidate> --thinking <level> --tools read,edit,write --no-extensions --no-skills --skill <skill-dir> --no-context-files --no-session` in that dir with the prompt `/skill:forge-skill <edit request>`, then a blank line and `Files in this checkout: <fixture paths>` (the worker cannot list directories); the skill under test is the only skill loaded. 10-minute timeout.
3. The driver stages everything and captures `git diff --cached HEAD` plus every file with its line count.
4. Each reviewer runs `pi -p --model <reviewer> --no-tools ...` with `reviewer-prompt.md`, the fact list from `expected.md`, the request, the diff, and the files; it returns per-fact `yes`/`no`, one level, one rationale. A malformed reply is retried once with the parse error appended.
5. `<out>/<run-id>/<slug>.json` holds the record; `<out>/<run-id>/aggregate.json` the totals; the table prints to stdout. `--out` defaults to a `mkdtemp` dir under `$TMPDIR`. Scratch dirs are never deleted.

## Models

Model strings are arguments; nothing committed in this directory names a provider or model (`eval/` sits outside `scripts/model-literal-lint.mjs`'s scope because sibling targets commit results that carry model ids, so this is a convention here, not a lint). Both reviewers must differ. Authentication is the operator's `pi` auth; an unauthenticated model surfaces as `worker-failed` or `reviewer-invalid`, never as a pass.

## Aggregation

A fact is `kept` when every reviewer says yes, `lost` when every reviewer says no, `disputed` otherwise. A sample whose worker exits non-zero, times out, or produces an empty diff is `worker-failed` and every fact is `lost`. A reviewer whose reply fails to parse twice makes the sample `reviewer-invalid` and every fact `disputed`. Each record carries the skill dir's git SHA (`-dirty` suffix when the dir has uncommitted changes), a sha256 of the skill body, of `case.md` + `expected.md`, and of `reviewer-prompt.md`, every model string, the thinking level, and wall time.

## Comparing two runs

`node eval/forge-skill/run.mjs compare <baseline-aggregate.json> <candidate-aggregate.json>` pairs facts by sample slug and identical fact text. It refuses (exit 2) when the task hashes, reviewer-prompt hash, candidate model, thinking level, or reviewer list differ, when either side's skill SHA is `-dirty`, or when either side has a sample that is not `ok`. It fails (exit 1) when any paired fact moved from `kept` to `lost`; the kept-count totals never offset a regression. A dirty record is not evidence.

## Three pairs and the median

Run three baseline/candidate pairs per gate. One pair is one draw of a stochastic worker.

`node eval/forge-skill/run.mjs median <agg1.json> <agg2.json> <agg3.json> [<out.json>]` collapses one side into a single aggregate. The output defaults to `median.json` beside the first input; the command prints `median: <path>` after the table. Each fact takes the status at least two runs gave it, or `disputed` on a three-way split. Counts are recomputed and reviewer levels are concatenated across the three runs.

The command refuses (exit 2) unless exactly three aggregates share the skill SHA, skill hash, task hashes, reviewer-prompt hash, candidate model, thinking level, and reviewer list, and every sample is `ok`. Collapse the baseline and candidate sides separately, then run `compare` over the two median files.

## Adding a sample

Create `sample/<slug>/case.md` and `sample/<slug>/expected.md` and nothing else in that directory.

`case.md` is one or more fenced blocks whose info string is `file <path>` holding the fixture verbatim, then one block whose info string is `request`. Use a four-backtick fence when the fixture contains three-backtick fences.

`expected.md` is a list of `- ` bullets, each a must-hold fact stated as a checkable property of the diff or the resulting file. Never a golden output: model output varies, and a reference text would anchor reviewers.

## Facts move with the skill

`expected.md` states properties the current `SKILL.md` promises. A change to a forge-skill rule updates the affected facts in the same commit. A baseline run against an older skill is judged on the same facts, which is what makes the before/after delta visible.

## Deviations from `eval/README.md`

The repo convention landed first; this target keeps three deliberate differences, recorded in the spec's Component 2: samples are `case.md` (fixture files plus the fenced edit request) and `expected.md`, not `source.md`; raw results stay under `$TMPDIR` and the judgment is appended to the spec instead of committing `results/`; the driver is `run.mjs --skill-dir ...` plus `compare` and `median`, not `run --arm`.
