# Brainstorming replay eval

Target: `skills/brainstorming/SKILL.md`, checklist sections 3-5. Convention and shared rules: `../README.md`.

Measure evidence-backed challenge in two slices: the first message and the approaches message. Two cases require a named alternative; one requires keeping the as-asked design after checking the downstream consumer.

## One run

```bash
# baseline: the pre-edit skill, from an immutable reference
git show 2166283:skills/brainstorming/SKILL.md > "$TMPDIR/skill-baseline.md"
node eval/brainstorming/run.mjs run --arm baseline --persona "$TMPDIR/skill-baseline.md" \
  --candidate-model <candidate-id> --thinking <level> --reviewers <reviewer-a>,<reviewer-b> --out "$TMPDIR/eval-baseline"
# candidate: the worktree skill
node eval/brainstorming/run.mjs run --arm candidate --persona skills/brainstorming/SKILL.md \
  --candidate-model <candidate-id> --thinking <level> --reviewers <reviewer-a>,<reviewer-b> --out "$TMPDIR/eval-candidate"
node eval/brainstorming/run.mjs compare "$TMPDIR/eval-baseline" "$TMPDIR/eval-candidate"
```

The runner calls `pi -p` from a scratch cwd with no tools, skills, extensions, context files, or saved session. The system prompt is sections 3-5 of the supplied skill; the user prompt includes source.md and requests both messages assuming the recorded answers. Baseline strips the `Framing:` line from source.md; candidate retains it. Reviewers score only those two slices, using reviewer-prompt.md. No model has a default. `--thinking` sets the candidate's thinking level. `--only <slug>` is repeatable. `--out` defaults to a fresh directory under `$TMPDIR`.

Before any model call, the runner scans every sample file using `GAUNTLET_EVAL_DENYLIST`. A hit or invalid regex aborts with file and line, without printing the pattern; an unset variable or missing file prints `leak check: skipped (no denylist)`.

## Metrics and pass predicate

One JSON record per sample carries `arm`, `candidate_model`, reviewer ids, `persona_sha256` of the supplied SKILL.md text, input and revision hashes, verbatim `text`, `words`, `backtick_lines`, `path_tokens`, per-fact reviewer judgments, reviewer quality and rationale, and `aggregate` kept/disputed/lost counts. Failed calls write an error record.

Readable threshold: `readable`. Length cap: 900 words across both slices (two messages; the skill itself targets 300-500 words per design round, and a first message carrying a framing question plus an approaches message with `Pattern:` lines lands at 450-850 words on the retained samples). `compare` passes (exit 0) when no fact is rejected by every candidate reviewer (run-level unanimous-loss tolerance: 0), candidate quality stays at or above baseline for each reviewer and reaches `readable` for at least one reviewer, and candidate length stays within the cap. A split answer passes and is reported as disputed; every unanimously rejected fact is printed for human review. Exit 1 means a failed clause; exit 2 means missing arms, failed calls, twice-unparsed reviews, or mismatched samples, input hashes, or reviewer sets. `run` exits 0 after writing completed records or 2 if a call failed or a review remained unparsed; compare determines pass/fail. Usage errors exit 64; denylist errors exit 65. `--help` prints usage without network access.

## Samples and limits

There are 3 samples from three retained historical cases, below the convention's minimum of 5. The latest-run indicator and explicit-unit normalization cases require pivots; review-and-apply containment keeps the original scope. Sources were rewritten by hand into generic services, files, and records. Expected facts preserve the decisions, not an exact output. The anonymized metadata does not claim these historical sources were rewritten with the convention's LLM prompt.

Frozen fixtures remove live retrieval variance but cannot measure discovery or tool accuracy. Fixture files are illustrative stubs, not executable implementations. No model run is part of CI.

## Results

`results/` is retained with `.gitkeep`. The first authorized run's durable evidence belongs under `results/<run-id>/`, with both arms and the compare table. Later runs default to temporary directories.

## Add a sample

Add sample/<slug>/source.md and expected.md. Preserve the ask, gather draft including Framing, recorded answers, and inline fixture files. Put `anonymized: true` first in expected.md for anonymized samples, then the matching heading and four to six unique fact ids. Review the anonymization and oracle, update the sample-count assertion, and run `node --test eval/brainstorming/run.test.mjs`.

## Recorded runs

| run | candidate | reviewers | facts kept b / c | words b / c | compare |
|---|---|---|---|---|---|
| `results/2026-10-04-astra-high/` | the weaker-baseline driver, high thinking | two reviewer models | 6/6, 5/6, 3/6 baseline; 5/6 (1 disputed), 5/6, 6/6 candidate | 499-626 / 717-883 | fail: on `latest-run-indicator` the `framing` fact is lost by every reviewer in both arms and both reviewers rate the candidate `readable` against a `briefing` baseline; the other two samples pass, and on the negative sample the candidate recovers three facts the baseline lost |

Reading: on a frozen fixture with no tools, both arms recover most facts (the fixture hands the driver the evidence the live scout would have to find), so this eval measures message shape and discipline, not discovery; the live-tool replay that measured discovery is the gitignored harness described in the spec. The after-skill output is about 45 percent longer, which is the framing question plus one `Pattern:` line per approach. The lost `framing` fact is the next thing to look at: the candidate corrects the premise and names the provenance concern but does not pose it as the two-part question the fact requires.
