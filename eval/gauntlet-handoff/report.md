# eval report: gauntlet-handoff

for: 5e499dbd632ea06a5eded75a8a25a5a1eee68dcf6b5ca2279dc1077c20db1a90

wall: 47s

## Change

Cover explicit run-home binding after companion-last dispatch, unchanged core Repo state grammar and ordered process-state legs before gate history, including missing-tree receipt metadata and one-member omission. These are intended fact movements, not observed model results. Parent verification runs the full target; this task runs deterministic structural and assembly checks only.
Cover coordinated-flow membership, recorded per-leg contracts, checkout-local rules and dispatch, home-bound handoff/admission, receipt-validated delivery retries and single-member/legacy identity. Synthetic text replays narrate supplied file/tool observations; they do not prove live runtime execution. Preserve existing facts and accepted variance. New cases use per-sample bundle additions for full procedures omitted by legacy slices; legacy cases retain their original bundle selections. Runtime leg/baseline/wave validation remains in extensions/lib/plan-check.test.ts, brief drift in scripts/brief-contract-lint.test.mjs, and seal acceptance in the source and shipped CLI tests. Parent verification must run model comparisons for every affected target and gauntlet-handoff; no model evidence is generated here.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| multi-repo | anthropic/claude-opus-5-5 | improved | 16394 | home: fails -> holds (intended change); layout: fails -> holds (intended change); missing: fails -> holds (intended change); single: holds -> holds (intended but unchanged) |
| multi-repo | github-copilot/gpt-6.1-sol | improved | 24332 | home: fails -> holds (intended change); layout: fails -> holds (intended change); missing: fails -> holds (intended change); single: holds -> holds (intended but unchanged) |

## Feedback

- multi-repo / anthropic/claude-opus-5-5: After moves home, layout and missing to holds by (1) stating in Step 2 that it explicitly supplies `Run worktree: /work/repo-a/.worktrees/feature-shared-change` through cohort's snapshot clause while keeping the six core headings and the `## Repo state` field names unchanged, (2) appending the verbatim tracker outputs, `Active task: W2: reader`, the single PR pair, then a `legs:` block with repo-a first and the gate-history line as the terminal line, and (3) recording repo-b as `worktree: missing`, `HEAD: cccc…`, `dirty: unavailable` with the receipt path listed as metadata rather than as proof of delivery. Before already held single (its Run 2 emitted no legs block, companion file, receipt, `--leg` or companion loop and left the core untouched), and After preserves that by stating the single-member brief carries no coordinated block and the `Run worktree:` clause is not required; keep that explicit omission sentence in Run 2 and avoid any phrasing that would imply the `legs:` grammar bleeds into the cohort core or that the receipt path confirms delivery, which are the two places this wording could regress.
- multi-repo / github-copilot/gpt-6.1-sol: After delivers the intended movement: step 3 now literally passes `Run worktree: /work/repo-a/.worktrees/feature-shared-change` alongside `--key` and states the core snapshot stays repo-a-bound while keeping the six-heading core and worktree/branch/HEAD/dirty names (home), the tail orders Phases/Plan, `Active task: W2: reader`, PR pair, `legs:` with repo-a first, then the terminal gate-history line (layout), and repo-b is recorded as `worktree: missing`, last HEAD cccc…, `dirty: unavailable`, with the receipt path carried and explicitly 'not treated as proof of delivery' (missing). Before failed all three because it never supplied a Run worktree line and emitted no legs block at all. Single held in both: Before's independent run already omitted legs/receipt/repo-b, and After's omits the coordinated block, writes no second file, and authors no core. Two things to watch in After: the single-member section carries the coordinated run's PR/Pre-rework pair over via 'other supplied observations unchanged', which Before deliberately refused to do—if independence of runs is an accepted invariant, say the pair is only emitted when that run's own rework record supplies it; and the final report block dropped the `Handoff written:` prefix, which Before kept. Adding an explicit sentence in the single-member section that no `--leg` flag or companion loop is invoked would make the single fact's coverage unambiguous rather than implicit.

exit: 0
