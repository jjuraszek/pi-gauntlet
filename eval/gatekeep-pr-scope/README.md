# gatekeep-pr scope-contract eval

Target: `skills/gatekeep-pr/` - `SKILL.md`, `verification-brief.md`, and `reference/*.md`. Convention and shared rules: `../README.md`.

Measure the step 5-7 report, numbered menu, and handling of one pick against eight frozen digests.

## One run

```bash
mkdir -p "$TMPDIR/gk-base" && git archive f4a11ee skills | tar -x -C "$TMPDIR/gk-base"
node eval/gatekeep-pr-scope/run.mjs run --arm baseline --persona "$TMPDIR/gk-base" \
  --candidate-model <candidate-id> --thinking <level> --reviewers <reviewer-a>,<reviewer-b> --out "$TMPDIR/gk-baseline"
node eval/gatekeep-pr-scope/run.mjs run --arm candidate --persona . \
  --candidate-model <candidate-id> --thinking <level> --reviewers <reviewer-a>,<reviewer-b> --out "$TMPDIR/gk-candidate"
node eval/gatekeep-pr-scope/run.mjs compare "$TMPDIR/gk-baseline" "$TMPDIR/gk-candidate"
```

The runner calls `pi -p` from a scratch cwd with no tools, skills, extensions, context files, or saved session. `--persona` is a snapshot root. The system prompt bundles the skill files in `BUNDLE` order (`SKILL.md`, then `verification-brief.md`), then `reference/*.md` sorted, then one `bundle+:` file when a sample names it. `directional-dependency` appends `skills/check-delivery/SKILL.md`. The user prompt is the digest body plus the instruction to render the report, menu, and pick handling. The input hash uses the raw source, including the `bundle+:` line.

The sibling target `eval/conformance-check/` bundles `conformance-check.md` plus the Step 3.5 slice of `finishing-a-development-branch/SKILL.md` instead.

No model has a default. `--only <slug>` is repeatable. `--out` defaults to a fresh directory under `$TMPDIR`. The leak check (`GAUNTLET_EVAL_DENYLIST`) runs before any model call.

## Metrics and pass predicate

Same record shape and exit codes as `../brainstorming/README.md`. Readable threshold: `readable`. Length cap: 1200 words. Run-level unanimous-loss tolerance: 0. The baseline arm's lost facts on deferral samples are the expected finding and do not gate.

## Samples

The eight samples are `deferred-with-ref`, `deferred-without-ref`, `deviates`, `directional-dependency`, `mixed-coverage`, `no-spec-quality`, `post-merge-menu`, and `ticket-drifted`.

Each `source.md` carries `## PR`, `## Diff summary`, `## Spec at head`, `## Ticket`, `## Verification evidence`, `## Reviewer findings`, and `## Pick`. A leading `bundle+:` line names at most one additional repo-relative skill file.

## Add a sample

Add `sample/<slug>/source.md` with the digest headings and `expected.md` with four to six unique fact ids, update the slug list in `run.test.mjs`, and run `node --test eval/gatekeep-pr-scope/run.test.mjs`.

## Recorded runs

Each `results/<run-id>/` holds both arms' records and `compare.md`; the first run is committed, later runs stay under `$TMPDIR` unless they become the new baseline.

| run | facts approved | compare |
|---|---|---|
| `results/2026-10-06-gpt-6-astra` | `9981320` (candidate `github-copilot/gpt-6-astra:high`, reviewers `anthropic/claude-opus-5-5`, `github-copilot/gpt-6-astra`; baseline `c166142`; facts and fixture corrections judged by the orchestrator under the user's instruction "judge results yourself", recorded in that commit) | pass - candidate kept 44/46 facts, baseline 15/46; one disputed fact (`ticket-drifted` f5) |
