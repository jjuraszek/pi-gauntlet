# loop-implementation eval report

for: 3ca045af9001d9f49ef5893a38b04c88f09ed4675cb82770cc47154f10c8dc07

## Scope

Selected ticket #158 loop-admission and recovery samples, including the four samples whose assembly gains `reference/restore-loop.md`. Every listed sample ran baseline-only and comparison against `09c9f4e1`. `reference/empty-child-stagnation.md` is no longer incorrectly declared new: that file exists at the baseline. This is sample-scoped coverage, not a target-wide pass. C5-C7 remain unselected.

The four recovery fixtures use the current sentence subjects, ledger-held repair decisions and checkout-local companion return file instead of retired machine commit subjects/body records. `leg-resume` no longer claims the baseline is skipped. Current return-file attribution failures remain ordinary post-boundary validation misses; interrupted home boundaries retain common interrupted recovery. The four recovery cases also add `bundle+: skills/finishing-a-development-branch/reference/commit-message.md`: their facts quote the bookkeeping subjects that file owns and the driver reads it for all commit wording, so without it neither arm could know them. Both arms reran on the new assembly. No safety fact was removed and no word cap changed. `skills/gauntlet-resume/reference/restore-loop.md` then gained one sentence for `gauntlet-resume` `ledger-tracker-verify` ("On `interrupted`, first validate the entire `<pre-dispatch HEAD>..HEAD` range, never just its last commit."), so the four recovery cases' candidate arms reran once more against their baselines; `returned-line-admission` drops that file with `bundle-` and its record is unchanged. `skills/loop-implementation/SKILL.md` then lost five clauses that named a ledger conversion, a legacy grant or a migrated row, which changes the candidate assembly of all five samples, so all five candidate arms reran against their existing `09c9f4e1` baselines; no case, fact or word cap changed in this target.

Model columns show runner verdict and candidate facts held/total in its recorded judgment. An `unchanged` or `improved` verdict is not a claim that every expected fact holds. Sample-scoped baseline and candidate JSON files under `results/<sample>/` are the evidence.

| Sample | anthropic/claude-opus-5-5 | github-copilot/gpt-6.1-sol |
|---|---|---|
| returned-line-admission | improved; 7/7 | improved; 7/7 |
| companion-interrupted-recovery | unchanged; 7/7 | unchanged; 7/7 |
| interrupted-child-redispatch | improved; 10/10 | unchanged; 10/10 |
| leg-resume | unchanged; 4/4 | improved; 3/4 |
| verify-repair-count | unchanged; 8/8 | unchanged; 8/8 |

## Findings

- No fact that holds in the baseline arm fails in the candidate arm in any recorded judgment of the five samples. Both models hold every fact in the candidate arm of four samples; `leg-resume` holds 4/4 for Opus and 3/4 for gpt-6.1-sol.
- `companion-interrupted-recovery` and `verify-repair-count`: both models hold every fact on the first candidate reply on the current text.
- `interrupted-child-redispatch`: both models hold 10/10. Opus is `improved` on `interruptions` because this judgment fails the saved baseline reply on the async-handle clause; `skills/loop-implementation/SKILL.md` carries "An async handle still stops; never poll or join it." unchanged from `09c9f4e1` in both assemblies. The move is not an intended one. The first Opus candidate reply on the current text ran to 2703 words against the 2600 cap and was recorded as an error; the runner replayed that errored cell on the next invocation and the saved reply has 2196 words.
- `leg-resume`: Opus holds 4/4. gpt-6.1-sol holds 3/4 and is `improved`: the saved baseline reply fails all four facts because it read the case's ledger summary, which names no `returned:` line, as selecting the commit-body decoder that `09c9f4e1` still carried, and the candidate reply takes the current route. `read-before-recovery-and-dirty-stop` fails in both arms: two consecutive gpt-6.1-sol candidate replies on the current text list their reads as overrides, settings, spec, `amendment-surface.md`, `coordinated-legs.md` and never narrate reading the loop driver first, which the fact requires as its own conjunct. `skills/gauntlet-resume/reference/restore-loop.md` step 5 ("Read `/skill:loop-implementation`.") carries that read in the candidate assembly, as `reference/reconstruction.md` step 4 does at `09c9f4e1`; the gpt-6.1-sol reply saved before the five-clause removal held that fact. The three moves are not intended ones.
- The four recovery cases do not state a `returned:` header for their ledgers; both arms read them as current-format ledgers.
- `returned-line-admission`: both models hold 7/7 and `missing-line` moves as intended. `scripts/loop-home-admission.test.mjs` passes on both saved candidate replies. It pins the recovery values, not their rendering: section B must carry row 1 with the cells `failed`, `1` and `iteration 2: interrupted - wrong attribution` as a table row or a `row 1:` line, the decision `repair row 1 | interrupted - wrong attribution | iteration 3` and `returned: none`; a case section starts at a `## B` heading with any punctuation (the saved gpt-6.1-sol reply writes `## B — Interrupted recovery; next target is row 1`). `reference/interrupted-recovery.md` step 3 is byte-identical to `09c9f4e1` and names the cells, not a rendering. That test is orchestrator validation of two saved replies; the model evidence is the judged facts in `results/returned-line-admission/`. The result files were not hand-edited.

## Reproduction

Run `EVAL_CONCURRENCY=2 node eval/run.mjs loop-implementation <sample> --base 09c9f4e1 --baseline-only`, then the same command without `--baseline-only`, selecting only a sample listed above. On the current text `interrupted-child-redispatch` replayed its Opus candidate cell once after the over-cap reply, and `leg-resume` replayed its gpt-6.1-sol candidate cell once with the same outcome. Check the saved `returned-line-admission` replies with `timeout -k 30 240 node --test scripts/loop-home-admission.test.mjs`.
