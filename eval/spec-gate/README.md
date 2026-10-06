# Spec-gate render eval

Target: `skills/brainstorming/reference/spec-finalization.md`, the `## User Review Gate` section. Convention and shared rules: `../README.md`.

Measure what the user sees at the gate: the briefing, the council line, the menu, and the handling of one reply. Five samples: a full council return, a partial-coverage return, an all-`none` return, the worker path, and a `3` reply.

## One run

```bash
# baseline: the pre-edit reference, from an immutable commit
git show 5eef2af:skills/brainstorming/reference/spec-finalization.md > "$TMPDIR/gate-baseline.md"
node eval/spec-gate/run.mjs run --arm baseline --persona "$TMPDIR/gate-baseline.md" \
  --candidate-model <candidate-id> --thinking <level> --reviewers <reviewer-a>,<reviewer-b> --out "$TMPDIR/eval-baseline"
# candidate: the worktree reference
node eval/spec-gate/run.mjs run --arm candidate --persona skills/brainstorming/reference/spec-finalization.md \
  --candidate-model <candidate-id> --thinking <level> --reviewers <reviewer-a>,<reviewer-b> --out "$TMPDIR/eval-candidate"
node eval/spec-gate/run.mjs compare "$TMPDIR/eval-baseline" "$TMPDIR/eval-candidate"
```

The runner calls `pi -p` from a scratch cwd with no tools, skills, extensions, context files, or saved session. The system prompt is the `## User Review Gate` section of the supplied reference; the user prompt is `source.md` plus the instruction to render the gate and handle the reply. No model has a default. `--only <slug>` is repeatable. `--out` defaults to a fresh directory under `$TMPDIR`. The leak check (`GAUNTLET_EVAL_DENYLIST`) runs before any model call.

## Metrics and pass predicate

Same record shape and exit codes as `../brainstorming/README.md`. Readable threshold: `readable`. Length cap: 1200 words (a `3` reply reprints the audit and the whole gate). Run-level unanimous-loss tolerance: 0.

## Samples

`source.md` carries `## Briefing`, `## Critique pass return`, `## Spec commit`, `## User reply`. The baseline reference has no row 3, so on `row-3-reply` the baseline treats `3` as prose; that arm's lost facts are expected and do not gate.

## Add a sample

Add `sample/<slug>/source.md` with the four headings and `expected.md` with four to six unique fact ids, update the slug list in `run.test.mjs`, and run `node --test eval/spec-gate/run.test.mjs`.

## Recorded runs

Each `results/<run-id>/` holds both arms' records and `compare.md`; the first run is committed, later runs stay under `$TMPDIR` unless they become the new baseline.

| run | facts approved | compare |
|---|---|---|
| `results/2026-10-05-astra-high` | the five `expected.md` files at commit `4552cf3`, approved by the user in the brainstorm session before the baseline arm ran | `result: pass`; candidate kept 5/5 facts on every sample, baseline 2-3/5 on the four council-path samples |
