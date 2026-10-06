# gatekeep-pr sync eval

Target: `skills/gatekeep-pr/SKILL.md` with `reference/sync.md` and `reference/decision-menu.md`, the step-2b `--rebase [base]` sync. Convention and shared rules: `eval/README.md`; driver shape: `eval/spec-gate/README.md`.

Measure instruction adherence: given a synthetic step-1 digest and an arguments line, the model narrates every command and helper dispatch from the end of step 2 through the first menu. Seven samples: a conflict-free sync onto an explicit base, a conflicting-file sync, red CI after the push (the menu offers `fix`, no automatic fix), a non-pushable head, another author's branch, a harness without helpers, and the same digest without the flag.

## One run

```bash
# baseline: the pre-edit skill, from an immutable commit (no reference/sync.md existed)
mkdir -p "$TMPDIR/gatekeep-baseline/reference"
git show 1048838:skills/gatekeep-pr/SKILL.md > "$TMPDIR/gatekeep-baseline/SKILL.md"
git show 1048838:skills/gatekeep-pr/reference/decision-menu.md > "$TMPDIR/gatekeep-baseline/reference/decision-menu.md"
node eval/gatekeep-pr/run.mjs run --arm baseline --persona "$TMPDIR/gatekeep-baseline" \
  --candidate-model "$EVAL_MODEL" --reviewers "$EVAL_REVIEWERS" --out "$TMPDIR/eval-baseline"
# candidate: the worktree skill directory
node eval/gatekeep-pr/run.mjs run --arm candidate --persona skills/gatekeep-pr \
  --candidate-model "$EVAL_MODEL" --reviewers "$EVAL_REVIEWERS" --out "$TMPDIR/eval-candidate"
node eval/gatekeep-pr/run.mjs compare "$TMPDIR/eval-baseline" "$TMPDIR/eval-candidate"
```

The runner calls `pi -p` from a scratch cwd with no tools, skills, extensions, context files, or saved session. `--persona` is a skill directory: the system prompt is its `SKILL.md`, `reference/decision-menu.md`, and `reference/sync.md` when present, joined by `---`. The user prompt is `source.md` plus the instruction to narrate the run in order and print the sync line and the first menu. No model has a default. `--only <slug>` is repeatable. `--out` defaults to a fresh directory under `$TMPDIR`. The leak check (`GAUNTLET_EVAL_DENYLIST`) runs before any model call.

## Metrics and pass predicate

Same record shape and exit codes as `../spec-gate/README.md`. Quality scale: `off-script`, `partial`, `faithful`, `exact`; readable threshold `faithful`. Length cap: 2000 words (the narration lists every command and dispatch, so it runs longer than a spec-gate briefing). Run-level unanimous-loss tolerance: 0. The baseline skill has no `--rebase`, so on the six flag samples the baseline arm loses facts by construction; those losses are expected and do not gate. `no-flag-unchanged` is the regression guard: the candidate must keep every one of its facts.

## Samples

`source.md` carries `## Digest` (the step-1 digest fields the sync reads, plus the outcomes the narration assumes) and `## Arguments` (the invocation). All data is synthetic: repository `orchard/ledger`, fictional logins, made-up SHAs. `expected.md` facts come from the spec's sample table (`doc/specs/2026-10-06-gh-58-gatekeep-pr-rebase-sync.md` section Tests), expanded to one checkable sentence each and approved by the user before the baseline arm.

## Add a sample

Add `sample/<slug>/source.md` with the two headings and `expected.md` with four to six unique fact ids, update the slug list in `run.test.mjs`, and run `node --test eval/gatekeep-pr/run.test.mjs`.

## Recorded runs

Each `results/<run-id>/` holds both arms' records and `compare.md`; the first run is committed, later runs stay under `$TMPDIR` unless they become the new baseline.

| run | facts approved | compare |
|---|---|---|
| `results/2026-10-06-rebase-sync-astra` | the seven `expected.md` files approved by the user before the baseline arm ran | `result: pass`; candidate kept 30/30 facts, baseline 10/30 by construction |
| `results/2026-10-06-rebase-sync-opus` | same approved facts, second narrator model | `result: pass`; candidate kept 30/30 facts, baseline 15/30 by construction |
