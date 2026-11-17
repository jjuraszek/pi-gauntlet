# gauntlet-resume eval report

for: cac2fd24472bb56415c0ff6a3027cacec468fb49c0b053ea5485292d06f6dd44

## Scope

Selected ticket #158 regression samples, the three C3 current-stage samples and the five C4 coordinated stops. Every listed sample ran baseline-only and comparison against `09c9f4e1`. This is sample-scoped coverage, not a target-wide pass. C5-C7 remain unselected. Records of every unselected sample are historical: they predate the reference split, are stale against the current files and were not rerun. The four target intent files describe this change and are bound to the current bundle-free assembly.

Model columns show the runner verdict and candidate facts held/total in its recorded judgment. An `unchanged` or `improved` verdict is not a claim that every expected fact holds. Sample-scoped baseline and candidate JSON files under `results/<sample>/` are the evidence.

| Sample | anthropic/claude-opus-5-5 | github-copilot/gpt-6.1-sol |
|---|---|---|
| legs-ok | unchanged; 1/1 | unchanged; 1/1 |
| ledger-tracker-verify | unchanged; 6/6 | unchanged; 5/6 |
| clean-pass-unchanged | unchanged; 3/3 | unchanged; 3/3 |
| pending-owner-stops | unchanged; 4/4 | unchanged; 4/4 |
| loop-ledger-brief | unchanged; 6/6 | improved; 6/6 |
| ledger-tracker-recovery | improved; 6/6 | unchanged; 6/6 |
| returned-line-recovery | unchanged; 1/1 | unchanged; 1/1 |
| baseline-upgrade-preserves-statuses | unchanged; 3/3 | unchanged; 3/3 |
| legs-receipt | unchanged; 2/2 | unchanged; 2/2 |
| old-ledger-stops | improved; 3/3 | improved; 3/3 |
| current-brainstorm-brief | unchanged; 3/3 | unchanged; 3/3 |
| current-plan-brief | unchanged; 3/3 | unchanged; 3/3 |
| current-ship-brief | unchanged; 3/3 | unchanged; 3/3 |
| legs-membership | unchanged; 1/1 | unchanged; 1/1 |
| legs-wrong-primary | unchanged; 1/1 | unchanged; 1/1 |
| legs-home-mismatch | unchanged; 1/1 | unchanged; 1/1 |
| legs-missing | unchanged; 4/4 | unchanged; 4/4 |
| legs-wrong-repo | unchanged; 1/1 | unchanged; 1/1 |

## Findings

- No fact that holds in the baseline arm fails in the candidate arm in any recorded judgment of the eighteen samples.
- `legs-ok`: its case no longer drops `reference/reconstruction.md`, which the route reads; the base brief-contract rule "Announce per-leg HEAD and dirty drift against live trees without stopping; identify each leg" lives in `reference/coordinated.md`.
- `ledger-tracker-verify`, fixture: the F and F-repair saved task list now reads row1 complete, row2 skipped, G1 failed, G2 in_progress, Conformance review failed, G3 pending, Conformance repair pending. The earlier order put pending G3 ahead of failed Conformance review, a list `plan_tracker` rejects (`extensions/plan-tracker.ts`: pending tasks must trail every started or finished task) and the handoff producer therefore cannot write. The `mixed-verify` fact quotes the new order; no other fact changed. Both arms reran on the new case.
- `ledger-tracker-verify`, `ambiguous-home-history`: on the unchanged instruction files the gpt-6.1-sol candidate reply lost this fact in the primary judgment and in its confirmation replay, because case J's `interrupted` answer no longer stated the full-range validation. At `09c9f4e1` the assembly carried that rule twice: the current-format sentence "confirmed interrupted runs the driver's interrupted recovery against S and its before-image without another bump", kept unchanged, and the row `reference/reconstruction.md:234`, "Confirmed interrupted | Validate the entire `<pre-dispatch HEAD>..HEAD` range, never just `HEAD^..HEAD` ...", which stood in the removed `### Legacy pending recovery` block and had no remaining owner. `reference/restore-loop.md` `## Pending recovery` now carries it again as one sentence: "On `interrupted`, first validate the entire `<pre-dispatch HEAD>..HEAD` range, never just its last commit." On that text both models hold the fact: in the `interrupted` answer Opus validates the entire tuple-SHA..HEAD range "against the before-image" and gpt-6.1-sol writes "validate the entire range, read interrupted-recovery and jobs identity, terminate only matching recorded jobs".
- `ledger-tracker-verify`, gpt-6.1-sol: `labels` fails in both arms. Neither reply prints cut row 2 with its criterion description; this predates the change.
- The restored sentence changes the instruction hash of all eighteen samples, so all eighteen candidate arms reran against their existing baselines. Three gpt-6.1-sol cells came back `inconclusive` or `regressed` on the first run and hold every fact on their one rerun; both assemblies carry the rule in each case:
  - `loop-ledger-brief`: `consumer` and `verify-ledger`. The first reply took the unsupported-format stop as the primary outcome: "The supplied ledger does not include a `returned:` line. Taken as the complete observed header, it fails ledger admission". The case lists the ledger headers in prose and names no `returned:` line; it is unchanged from `09c9f4e1`.
  - `ledger-tracker-recovery`: `settled-repair`; case E did not repeat the allowance render. The confirmation replay held it.
  - `legs-ok`: `drift`; the reply stopped narrating after the drift notice. The confirmation replay held it.
- `ledger-tracker-recovery` (Opus, `rejected-return`) and `loop-ledger-brief` (gpt-6.1-sol, `verify-ledger`) are `improved` because the saved baseline reply misses a fact the candidate reply holds; neither fact is an intended move.
- `old-ledger-stops`: `missing-returned` and `cap-first` move from fails to holds as intended.

## Reproduction

Run `EVAL_CONCURRENCY=2 node eval/run.mjs gauntlet-resume <sample> --base 09c9f4e1 --baseline-only`, then the same command without `--baseline-only`, selecting only a sample listed above. `loop-ledger-brief`, `ledger-tracker-recovery` and `legs-ok` each used one rerun of the gpt-6.1-sol candidate cell on the current input. The tool-observed trace `tool-traces/results/ledger.json` with `ledger.jsonl` predates the restored sentence and needs a recapture from a primary session.
