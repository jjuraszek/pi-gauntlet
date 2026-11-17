# loop-implementation eval report

for: b4428316608fae1f305dd325c777ff1c8229b6b7ae9ca84086670fa661fd6dbe

## Scope

Selected ticket #158 loop-admission and recovery samples, including the four samples whose assembly gains `reference/restore-loop.md`. Every listed sample ran baseline-only and comparison against `09c9f4e1`. `reference/empty-child-stagnation.md` is no longer incorrectly declared new: that file exists at the baseline. This is sample-scoped coverage, not a target-wide pass. C5-C7 remain unselected.

The four recovery fixtures use the current sentence subjects, ledger-held repair decisions and checkout-local companion return file instead of retired machine commit subjects/body records. `leg-resume` no longer claims the baseline is skipped. Current return-file attribution failures remain ordinary post-boundary validation misses; interrupted home boundaries retain common interrupted recovery. No safety fact was removed, no word cap changed and no instruction file changed.

Model columns show runner verdict and candidate facts held/total in its recorded judgment. An `unchanged` or `improved` verdict is not a claim that every expected fact holds. Sample-scoped baseline and candidate JSON files under `results/<sample>/` are the evidence.

| Sample | anthropic/claude-opus-5-5 | github-copilot/gpt-6.1-sol |
|---|---|---|
| returned-line-admission | improved; 7/7 | improved; 7/7 |
| companion-interrupted-recovery | unchanged; 7/7 | unchanged; 4/7 |
| interrupted-child-redispatch | unchanged; 9/10 | inconclusive; 5/10 |
| leg-resume | improved; 3/4 | improved; 2/4 |
| verify-repair-count | improved; 7/8 | unchanged; 8/8 |

## Findings

- `companion-interrupted-recovery`: gpt-6.1-sol still fails `repair`, `admission` and `seed` in both arms. The relative unchanged verdict does not prove those recovery facts.
- `interrupted-child-redispatch`: Opus still fails `interruptions`. gpt-6.1-sol's primary judgment fails `row-budget`, `companion-resume`, `seed`, `aborted` and `driver-scope`; its successful confirmation disagrees on `driver-scope`. One `--refresh-judgments` run leaves the verdict inconclusive. The current record has no replay error.
- `leg-resume`: Opus still fails `preserved-continuation`; gpt-6.1-sol still fails `read-before-recovery-and-dirty-stop` and `exactly-once-parent-recording`. Both relative verdicts improve, but the complete safety scenario remains unproven.
- `verify-repair-count`: Opus still fails `interruptions` despite an improved relative verdict. gpt-6.1-sol holds all eight facts.
- The scoped `scripts/loop-engine-contract.test.mjs` run fails its historical saved-reply subtests in `scripts/loop-home-admission.test.mjs:124-125`: refreshed `returned-line-admission` replies preserve the judged facts but do not preserve the hard-coded `## B.` heading/table rendering. Opus prints the exact interrupted evidence as a bullet; gpt-6.1-sol prints a different B heading. The test and result files were not hand-edited to hide this failure.

## Reproduction

After diagnosing the red behavior, run `EVAL_CONCURRENCY=2 node eval/run.mjs loop-implementation <sample> --base 09c9f4e1 --baseline-only`, then the same command without `--baseline-only`, selecting only a sample listed above. The interrupted-child judgment refresh was already used once on the current input. Reproduce the deterministic failure with `timeout -k 30 240 node --test scripts/loop-engine-contract.test.mjs`.
