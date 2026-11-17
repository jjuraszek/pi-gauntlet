# gauntlet-resume eval report

for: cac2fd24472bb56415c0ff6a3027cacec468fb49c0b053ea5485292d06f6dd44

## Scope

Selected ticket #158 regression samples, the three C3 current-stage samples and the five C4 coordinated stops. Every listed sample ran baseline-only and comparison against `09c9f4e1`. This is sample-scoped coverage, not a target-wide pass. C5-C7 remain unselected. Records of every unselected sample are historical: they predate the reference split, are stale against the current files and were not rerun. The four target intent files describe this change and are bound to the current bundle-free assembly.

Model columns show the runner verdict and candidate facts held/total in its recorded judgment. An `unchanged` or `improved` verdict is not a claim that every expected fact holds. Sample-scoped baseline and candidate JSON files under `results/<sample>/` are the evidence.

| Sample | anthropic/claude-opus-5-5 | github-copilot/gpt-6.1-sol |
|---|---|---|
| legs-ok | unchanged; 1/1 | unchanged; 1/1 |
| ledger-tracker-verify | unchanged; 6/6 | unchanged; 6/6 |
| clean-pass-unchanged | unchanged; 3/3 | unchanged; 3/3 |
| pending-owner-stops | unchanged; 4/4 | unchanged; 4/4 |
| loop-ledger-brief | unchanged; 6/6 | unchanged; 6/6 |
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
- `ledger-tracker-verify`, `labels`, fixture: case K now asks what the producer wrote for the saved rows and supplies the observed refresh status of cut row 2, `row 2 | Reject malformed allowance replies`, beside the row 3 status it already supplied. That is the line the tracker writes: `extensions/plan-tracker.ts` adds the `<attempts>/<allowance>: ` prefix only when the row status is not `cut`. Neither instruction assembly defines how a refreshed row is labeled, and a no-tools replay cannot observe the tracker, so the clause "cut row2 retains its criterion description without an attempt prefix" had no source in the earlier case; the gpt-6.1-sol replies then omitted the row or printed `row 2 | <current display description>` in both arms. `expected.md` is unchanged. The case changed, so both arms reran: baseline-only first, then the comparison. Both models now hold `labels` in both arms.
- `ledger-tracker-verify`, replies on the final case: gpt-6.1-sol holds 6/6 on its first reply. The first Opus candidate reply was `inconclusive` on `settled-home-verify` (case I listed ancestry and the byte-identical ledger without restating that attribution comes from the committed `returned:` tuple; the confirmation replay held all six); the one rerun holds 6/6. `reference/restore-loop.md` `## Pending recovery` carries that rule in the candidate assembly.
- `ledger-tracker-verify`, two earlier K wordings were replayed and discarded. Asking for "every observed status row after the refresh" without supplying the row 2 status let one Opus reply render `row 2 | <attempts>/6: Reject malformed allowance replies` and another run to 1813 words against the 1800 cap. Supplying the row 2 status without asking for the producer left the gpt-6.1-sol candidate reply and its confirmation replay silent on the producer clause of `labels`, which the baseline reply stated.
- The restored sentence changes the instruction hash of all eighteen samples, so all eighteen candidate arms reran against their existing baselines. Of the fifteen records still from that run, one gpt-6.1-sol cell came back `inconclusive` on the first reply and holds every fact on its one rerun; both assemblies carry the rule:
  - `legs-ok`: `drift`; the reply stopped narrating after the drift notice. The confirmation replay held it.
- `skills/loop-implementation/SKILL.md` then lost five clauses that named a ledger conversion, a legacy grant or a migrated row. `ledger-tracker-verify`, `ledger-tracker-recovery` and `loop-ledger-brief` bundle that file, so their candidate arms reran; the other fifteen samples do not assemble it and their records are unchanged.
- `ledger-tracker-recovery`: both models hold 6/6 on the first reply. Opus is `improved` on `rejected-return` because the saved baseline reply misses a fact the candidate reply holds; the fact is not an intended move.
- `loop-ledger-brief`, fixture: the case listed the ledger headers in prose with no `returned:` line, so its ledger was an unsupported format under the changed text while the case also said every entry check had passed. The `09c9f4e1` reply converted that ledger; candidate replies spent their opening on the admission stop. On the unchanged case the gpt-6.1-sol candidate reply and its confirmation replay both lost `verify-ledger`, each on a different clause (the re-init of a saved task list; the retained finishing step). The header list now reads "exactly one settled returned: tuple and no pending:", a ledger the current driver writes after an admitted return. `expected.md` is unchanged. Both arms reran: baseline-only first, then the comparison.
- `loop-ledger-brief`, replies on the repaired case: gpt-6.1-sol holds 6/6 on its first reply. The first Opus candidate reply was `inconclusive` on `verify-ledger` (its verify/ship section said "Render the ledger state" without naming the allowance; the confirmation replay held all six); the one rerun holds 6/6. `reference/restore-loop.md` step 8 ("Render the allowance header, rows, iterations, attempts, effective allowances and all decisions from disk") carries the rule in the candidate assembly, as `reference/reconstruction.md` does at `09c9f4e1`.
- `old-ledger-stops`: `missing-returned` and `cap-first` move from fails to holds as intended.

## Reproduction

Run `EVAL_CONCURRENCY=2 node eval/run.mjs gauntlet-resume <sample> --base 09c9f4e1 --baseline-only`, then the same command without `--baseline-only`, selecting only a sample listed above. `legs-ok` used one rerun of its gpt-6.1-sol candidate cell; `ledger-tracker-verify` and `loop-ledger-brief` each used one rerun of the Opus candidate cell on the final case. The tool-observed trace `tool-traces/results/ledger.json` with `ledger.jsonl` was recaptured from a primary session after the restored sentence landed; `ledger.json` records the SHA-256 of the four instruction files that session read, `reference/restore-loop.md` among them, and `scripts/resume-read-traces.test.mjs` checks those hashes against the current files. The trace is tool-call evidence from one session, separate from the text replays above.
