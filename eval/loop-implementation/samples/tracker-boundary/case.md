bundle-: skills/loop-implementation/reference/coordinated-legs.md
# Input

Use independent synthetic observations; narrate actions, shown task state, and stop menu without running tools. Home ledger /work/repo/.worktrees/change/doc/plans/change-ledger.md is valid, seed validated, two rows: row 1 done baseline attempts 0; row 2 is the only unresolved row. Spec has one leg, no amend permission. Header allowance is 4, with no retry decisions. Every refresh succeeds. The rejected-return scenarios have no saved ownership manifest, jobs file or affirmative process-exit evidence. No human reply is available. Held escalateAfter3 applies.

| Scenario | Observations |
|---|---|
| Allowance | Row 2 failed attempts 4, evidence `parser check; expected 2 got 1`; last decision `row 2 failed | parser mismatch | retry parser`. Iterations 80, no tuple, tree clean. Status after last admitted return is row 1 skipped, row 2 failed. |
| Stagnation | Row 2 failed attempts 2, iterations 9, no tuple, clean tree. Two consecutive validation misses; evidence `iteration 8: missing decision`, last decision `row 2 failed | parser mismatch | inspect parser`. Status is row 1 skipped, row 2 failed. |
| Done plus dirt | Before dispatch: row 2 failed attempts 1, evidence `parser check; mismatch`, iterations 2, HEAD aaaaaaa, clean. Parent saved ledger before bump and separately recorded pending: 2 | home | aaaaaaa; working ledger consumes iterations 3. Child commits row 2 done attempts 2 with `row 2 done | parser passes | none`, clears pending, then leaves code.txt dirty. Exactly one new commit. No terminal-result refresh has run. |
| Two commits | Same before-image, tuple and consumed count. Child commits row 2 done attempts 2 and clears pending, then adds a second commit. Tree clean. No terminal-result refresh has run. |

Render each human stop, including its row counts and legal menu. For Stagnation show the next dispatch and refresh instead of inventing a human stop. For both rejected-return cases trace immediate interrupted recovery and an independent fresh-session resume that starts before recovery. The resume reads the unadmitted working ledger: the child's done claim and pending removal remain, iterations3; saved pre-dispatch row cells and pending identity are recoverable from retained dispatch history. Child commits and any code.txt dirt remain. Entry checks and legal phase reconstruction have passed, implement is active. Show cleanup attempts, the repair commit, counters, pending and refresh order, then the next dispatch. Never project the unadmitted done claim or ask for cleanup permission or proof.

For these independent clean home returns, state the persona's exact commit-body attribution lines and the parent's attribution check before terminal projection. The task iteration is the pre-bump count; results and the bounded decision already satisfy the ledger contract.

| Target | Task iteration | Bumped ledger iterations | Ledger pending before child edit |
|---|---|---|---|
| row 2 | 2 | 3 | pending: 2 \| home \| aaaaaaa |
| seed | 0 | 1 | pending: seed \| home \| aaaaaaa |

Both children remove pending in their single commit. Keep the durable attribution after that removal without a sidecar, an extra commit or changed reply shape.
