bundle+: skills/brainstorming/reference/legs.md
bundle+: skills/gauntlet-resume/reference/reconstruction.md
baseline-skipped: new sample, no pre-edit sample evidence

# Input

Start explicitly at reconstruction.md "Spec with ledger" step 4, implement stage, after human confirmation, entry checks and ordered tracker restoration have passed. Narrate the supplied synthetic file/tool observations and prescribed actions; do not execute tools.

Home worktree /work/repo-a/.worktrees/feature-shared-change, companion /work/repo-b/.worktrees/feature-shared-change. Absolute home spec /work/repo-a/.worktrees/feature-shared-change/doc/specs/shared.md; ledger /work/repo-a/.worktrees/feature-shared-change/doc/plans/shared.md. Spec ## Legs has two ### Leg: blocks, repo-a then repo-b, both on branch feature/shared-change; identities, recorded contracts, companion Home tuple and stable mapping already validated. AC 1 shared by both, AC 2 home only. Mapping: row 1 = AC 1 repo-a, row 2 = AC 1 repo-b, row 3 = AC 2 repo-a. Each member's Rules is AGENTS.md. Both seeds validated; own bases aaaaaaa/bbbbbbb. Home HEAD aaaaaaa; companion pre-dispatch HEAD bbbbbbb.

Durable ledger line 1 is # Ledger - loop engine, Spec header points to the home spec, base aaaaaaa, verification make check, checks: commands, base repo-a: aaaaaaa, seeded repo-a: yes, base repo-b: bbbbbbb, seeded repo-b: yes, iterations: 3, cap: 14, pending: 2 | repo-b | bbbbbbb. Row 1 done attempts 0 evidence baseline check passed; row 2 open attempts 0 evidence parser check failing; row 3 open attempts 0 evidence serializer check failing. Leg mapping is unchanged. Last committed home ledger differs only in iterations: 2 and absent pending: line; all rows, headers, mapping and prior decisions otherwise identical. Home porcelain M doc/plans/shared.md is the only dirt and matches exactly the consumed iteration bump and pending tuple against that committed ledger. No discard/reset authorization is given. The extracted coordinated reference is readable in full.

Companion is clean with exactly one new commit ddddddd after bbbbbbb, subject loop: row 2 done. Its body contains exactly:

```text
pending: 2 | repo-b | bbbbbbb
iteration: 3
| 2 | done | 1 | parser check; passed |
row 2 done | parser check passed | next row 3
```

Home HEAD remains aaaaaaa. Recover this interrupted companion return before continuation. Enumerate all prescribed file reads in execution order, then show expected-dirt admission, validation, the one parent recording commit and resulting ledger, and continue at Before each dispatch. Stop the narration there before a subsequent dispatch; describe no new child execution.
