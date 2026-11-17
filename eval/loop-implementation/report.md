# loop-implementation eval report

for: 9e96b8fd0325765ea9c8cbec26fb6133da34a1998fb5c99308ad18d17c20e49c

## Scope

Selected ticket #158 loop-admission and recovery samples, including the four samples whose assembly gains `reference/restore-loop.md`. Every listed sample ran baseline-only and comparison against `09c9f4e1`. `reference/empty-child-stagnation.md` is no longer incorrectly declared new: that file exists at the baseline. This is sample-scoped coverage, not a target-wide pass. C5-C7 remain unselected.

The four recovery fixtures use the current sentence subjects, ledger-held repair decisions and checkout-local companion return file instead of retired machine commit subjects/body records. `leg-resume` no longer claims the baseline is skipped. Current return-file attribution failures remain ordinary post-boundary validation misses; interrupted home boundaries retain common interrupted recovery. The four recovery cases also add `bundle+: skills/finishing-a-development-branch/reference/commit-message.md`: their facts quote the bookkeeping subjects that file owns and the driver reads it for all commit wording, so without it neither arm could know them. Both arms reran on the new assembly. No safety fact was removed and no word cap changed. `skills/gauntlet-resume/reference/restore-loop.md` then gained one sentence for `gauntlet-resume` `ledger-tracker-verify` ("On `interrupted`, first validate the entire `<pre-dispatch HEAD>..HEAD` range, never just its last commit."), so the four recovery cases' candidate arms reran once more against their baselines; `returned-line-admission` drops that file with `bundle-` and its record is unchanged.

Model columns show runner verdict and candidate facts held/total in its recorded judgment. An `unchanged` or `improved` verdict is not a claim that every expected fact holds. Sample-scoped baseline and candidate JSON files under `results/<sample>/` are the evidence.

| Sample | anthropic/claude-opus-5-5 | github-copilot/gpt-6.1-sol |
|---|---|---|
| returned-line-admission | improved; 7/7 | improved; 7/7 |
| companion-interrupted-recovery | unchanged; 7/7 | unchanged; 7/7 |
| interrupted-child-redispatch | improved; 10/10 | unchanged; 10/10 |
| leg-resume | unchanged; 4/4 | improved; 4/4 |
| verify-repair-count | unchanged; 8/8 | unchanged; 8/8 |

## Findings

- No fact that holds in the baseline arm fails in the candidate arm in any recorded judgment of the five samples; both models hold every fact of every sample in the candidate arm.
- `companion-interrupted-recovery` and `verify-repair-count`, gpt-6.1-sol: the first candidate reply on the current text was `inconclusive` (`owned`: no separate identity recheck before TERM; `exhaustion`: the stop template did not restate that verify stays active). Each confirmation replay held the fact and each one rerun holds every fact. `skills/loop-implementation/SKILL.md` and `reference/interrupted-recovery.md` carry both rules in both assemblies; `reference/interrupted-recovery.md` is byte-identical to `09c9f4e1`.
- `interrupted-child-redispatch`: both models hold 10/10. Opus is `improved` on `interruptions` because this judgment fails the saved baseline reply on the async-handle clause; `skills/loop-implementation/SKILL.md` carries "An async handle still stops; never poll or join it." unchanged from `09c9f4e1` in both assemblies. The move is not an intended one.
- `leg-resume`: both models hold 4/4. gpt-6.1-sol is `improved` on all four facts because the saved baseline reply read the case's ledger summary, which names no `returned:` line, as selecting the commit-body decoder that `09c9f4e1` still carried; the candidate reply takes the current route. The moves are not intended ones.
- The four recovery cases do not state a `returned:` header for their ledgers; both arms read them as current-format ledgers.
- `returned-line-admission`: both models hold 7/7 and `missing-line` moves as intended. `scripts/loop-home-admission.test.mjs` still fails one assertion for Opus: section B must contain the literal `| 1 | failed | 1 | iteration 2: interrupted - wrong attribution |`. Six Opus candidate replays on the current text state the same cells as a bullet (`row 1: failed | 1 | iteration 2: interrupted - wrong attribution`), and so does the Opus baseline reply on the `09c9f4e1` text (`Row 1 is set to failed, attempts 1, evidence iteration 2: interrupted - wrong attribution`). `reference/interrupted-recovery.md` step 3 is byte-identical at both commits and names the cells, not a rendering. The gpt-6.1-sol reply satisfies every literal. The test and result files were not hand-edited.

## Reproduction

Run `EVAL_CONCURRENCY=2 node eval/run.mjs loop-implementation <sample> --base 09c9f4e1 --baseline-only`, then the same command without `--baseline-only`, selecting only a sample listed above. `companion-interrupted-recovery` and `verify-repair-count` each used one rerun of the gpt-6.1-sol candidate cell on the current input; `returned-line-admission` reran its Opus cell five times without the literal row. Reproduce the deterministic failure with `timeout -k 30 240 node --test scripts/loop-engine-contract.test.mjs`.
