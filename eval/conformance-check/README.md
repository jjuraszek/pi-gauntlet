# Conformance-check render eval

Target: `skills/verification-before-completion/reference/conformance-check.md`, `skills/finishing-a-development-branch/reference/disposition-protocol.md`, then the Steps 3.5-4 slice of `skills/finishing-a-development-branch/SKILL.md` (from `### Step 3.5` up to but not including `### Step 5`, or EOF when Step 5 is absent). Convention and shared rules: `../README.md`. The sibling `../gatekeep-pr/` bundles `SKILL.md`, `verification-brief.md`, and `reference/*.md` instead.

Measure the durable closure block and the finishing Step 3.5 render the operator sees. Six samples cover deferred items with references, deviations, directional dependencies, in-scope gaps, mixed dispositions, and no dispositions.

## One run

```bash
# baseline: the pre-edit skills, from an immutable commit
mkdir -p "$TMPDIR/cc-base" && git archive f4a11ee skills | tar -x -C "$TMPDIR/cc-base"
node eval/conformance-check/run.mjs run --arm baseline --persona "$TMPDIR/cc-base" \
  --candidate-model <candidate-id> --thinking <level> --reviewers <reviewer-a>,<reviewer-b> --out "$TMPDIR/cc-baseline"
# candidate: the worktree skills
node eval/conformance-check/run.mjs run --arm candidate --persona . \
  --candidate-model <candidate-id> --thinking <level> --reviewers <reviewer-a>,<reviewer-b> --out "$TMPDIR/cc-candidate"
node eval/conformance-check/run.mjs compare "$TMPDIR/cc-baseline" "$TMPDIR/cc-candidate"
```

The runner calls `pi -p` from a scratch cwd with no tools, skills, extensions, context files, or saved session. The system prompt bundles the conformance reference, the disposition protocol, then the Steps 3.5-4 slice from the supplied snapshot root, including Revert semantics and Step 4; `####` subheadings never end the slice. The slice renders under `# skills/finishing-a-development-branch/SKILL.md (Steps 3.5-4)`. An optional leading `bundle+: <relative-path>` line in `source.md` adds one file from that root; it is stripped from the candidate user prompt but retained in the input hash. The user prompt is the remaining source plus the instruction to render closure and Step 3.5 through the first line of Step 4's options. No model has a default. `--only <slug>` is repeatable. `--out` defaults to a fresh directory under `$TMPDIR`. The leak check (`GAUNTLET_EVAL_DENYLIST`) runs before any model call.

## Metrics and pass predicate

Same record shape and exit codes as `../README.md`. Readable threshold: `readable`. Length cap: 1500 words. Run-level unanimous-loss tolerance: 0.

## Samples

Each `sample/<slug>/source.md` carries `## Spec`, `## Reviewer report`, and `## Diff summary`; `expected.md` carries four to six unique must-hold facts. The slugs are `deferred-with-ref`, `deviates`, `directional-dependency`, `in-scope-gap`, `mixed`, and `no-dispositions`.

## Add a sample

Add `sample/<slug>/source.md` with the three headings and `expected.md` with four to six unique fact ids, update the slug list in `run.test.mjs`, and run `node --test eval/conformance-check/run.test.mjs`.

The driver files are `README.md`, `reviewer-prompt.md`, `run.mjs`, and `run.test.mjs`.

## Recorded runs

Each `results/<run-id>/` holds both arms' records and `compare.md`; the first run is committed, later runs stay under `$TMPDIR` unless they become the new baseline.

| run | facts approved | compare |
|---|---|---|
| `results/2026-10-06-gpt-6-astra` | `77af18f` (candidate `github-copilot/gpt-6-astra:high`, reviewers `anthropic/claude-opus-5-5`, `github-copilot/gpt-6-astra`; baseline `f4a11ee` skills tree; facts and fixture corrections judged by the orchestrator under the user's instruction "judge results yourself", recorded in that commit) | facts: candidate 29/32 kept (3 disputed, 0 lost) vs baseline 20/32 (2 disputed, 10 lost), every sample at or above baseline; the four CONFORMS-path samples score `briefing`. `result: fail` on the readability bar for the two GAPS-path samples (`in-scope-gap`, `mixed`): the candidate keeps 10/11 facts (baseline 7/11) and renders the carried-open card the skill prescribes under `maxFixRounds: 0`, but reviewers grade the no-tools render `mixed`/`engineer-only` (an "Other options" line, Step 4 withheld); the `in-scope-gap` readable -> mixed drop for one reviewer comes from the shared `Other options per item: ...` template in `finishing-a-development-branch` Step 3.5, which #59 did not touch - the baseline printing a narrower line was model variance. The readability bar is not a #59 claim; a GAPS render fixture with a human-graded reference is the follow-up |
