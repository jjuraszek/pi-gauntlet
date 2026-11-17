# finishing-a-development-branch eval report

for: 0b33e80b6e55e743612dd0a68371ad83fe996f6db03302a13fe1bc6eab8d3f4e

## Scope

Selected ticket #158 finishing-recovery samples with moved owner files. Both samples ran baseline-only and comparison against `09c9f4e1`. `reference/commit-message.md` is no longer incorrectly declared new: that file exists at the baseline. This is sample-scoped coverage, not a target-wide pass. C5-C7 remain unselected.

Model columns show runner verdict and candidate facts held/total in its recorded judgment. An `unchanged` verdict is not a claim that every expected fact holds. Sample-scoped baseline and candidate JSON files under `results/<sample>/` are the evidence.

| Sample | anthropic/claude-opus-5-5 | github-copilot/gpt-6.1-sol |
|---|---|---|
| ledger-pending-return | unchanged; 6/6 | inconclusive; 5/6 |
| ledger-post-strip | regressed; 4/5 | regressed; 3/5 |

## Findings

- `ledger-pending-return`: the gpt-6.1-sol primary judgment fails `once`; its confirmation holds the fact. One `--refresh-judgments` run leaves the verdict inconclusive. The primary reply says "refresh once" without explicitly naming the absolute ledger path and the absence of a child rerun. No instruction or expected fact changed to hide the disagreement.
- `ledger-post-strip`: Opus regresses on `logs`; the candidate does not visibly retain gate output inline. gpt-6.1-sol's primary judgment regresses on `squash` and `failed-receipt`; its candidate uses unresolved primary-path placeholders instead of `/work/repo-a` and `/work/repo-b` for the post-strip gates and retry. Its confirmation holds `squash` but still fails `failed-receipt`. Both model cells retain a confirmed regression and remain unresolved.

## Reproduction

After repairing or diagnosing the red behavior, run `EVAL_CONCURRENCY=2 node eval/run.mjs finishing-a-development-branch <sample> --base 09c9f4e1 --baseline-only`, then the same command without `--baseline-only`, selecting only a sample listed above. The pending-return judgment refresh was already used once on the current input.
