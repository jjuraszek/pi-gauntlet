bundle+: skills/gauntlet/brainstorm/spec-pr.md
bundle+: skills/gauntlet/ship/ship.md
## Narrated handoff checkpoints
Override normal replay output: no tools exist. Narrate calls and printed lines in order, not claims of live execution. Render the initial gate once; subsequent labeled independent turns give deltas only. Stay within 1000 words total. Define shared command sequences once and refer to them by name in variant deltas; render both retry gates explicitly. Never repeat the success sequence for a variant.

Repository acme/widget, worktree /work/widget/.worktrees/spec-export, branch spec-export. The approved doc/specs/export.md has the literal first line ``# Export `pwd` receipts``. Goal: Repeated exports return one receipt. Amend-grant is none; no Engine yet. Its committed ## Legs has exactly one block: ### Leg: acme/widget, branch: spec-export, contract: with home: /work/widget/.worktrees/<name>, create: git worktree add <home> -b <branch>, destroy: git worktree remove <home> && git worktree prune, spec-dir: doc/specs; Rules: AGENTS.md; scope: none. This is a one-block control, not coordinated publication. Its Acceptance criteria body is `none - ticket not fetched (tracker unreachable)`: zero checkbox rows. Summary is "Repeated exports return one receipt." The initial spec commit audit is Applied: none / Deferred: none / Rejected: none. Council, lint, placeholder and predecessor passes succeeded. No PR subject. Start at the User Review Gate, not council.

The spec ends with this section:

```markdown
## Integration

Keep these labels on the receipt:

~~~text
EOF
End of receipt
~~~
```

Status returns Context: 12.0% of window; loopEngine resolves maxIterationsPerRow: 4.

Success: render gate, then bare reply 4. All git/gh calls succeed. gh defaultBranchRef is main, despite creation ref staging. The diff against origin/main is A doc/specs/export.md only. PR creation returns https://github.com/acme/widget/pull/42. Overrides home: /work/widget/.worktrees/<name>, no destroy wrapper; ownership matches and remove/prune succeed. After URL/completion, branch --show-current prints spec-export; ls-remote origin refs/heads/spec-export, tree HEAD and primary refs/heads/spec-export all read aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa. Removal/prune succeed; the tree is neither listed nor on disk and the branch still equals that SHA. Conditional update-ref deletion succeeds; read-back finds no ref. Show header persistence, base proof, the complete push/create commands and the exact body contents separately (show the transport used), URL/Continue line/completion/cleanup ordering and the exact removed/deleted report.

Independent reply deltas before any success: Flagged = `4 --fund-rounds=3`; Change = `4 but rename receipts to vouchers`; Audit = `3 4`. Explain writes vs re-gate and audit rendering.

Invalid diff: clean 4 amends successfully, origin/main diff is A doc/specs/export.md plus M src/export.ts from an earlier commit. Separately creation ref staging contributes M .gitignore. Both are invalid against origin/main: show offending lines and withheld row; do not push or remove.

Rejected push: clean spec-only proof, push prints "remote: permission denied". Keep amended commit/worktree and show retryable 4; no create or completion.

Create failure: push succeeds, create prints "GraphQL: unavailable". Pushed HEAD is aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa. Render the create-only retry gate independently for Context: 12.0% of window and Context: unknown, with the recommendation and withheld implementation approvals, no complete/cleanup. In each view, take bare `approve` as the equality retry: origin/spec-export equals that HEAD; show just echo/refresh/proof/create (success URL as above), never amend/push again. Independent replies `1` and `2` each get one clarifying question with no writes. Moved retry independently observes origin/spec-export bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb; report both full SHAs and stop.

Independent cleanup deltas after successful URL/completion (all observations above hold except the named difference): differing remote = bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb, tree/local tip remain aaaa; missing remote = ls-remote exit 2, empty output; moved branch = after removal local ref advances to bbbb, keep it. Safe keyed `workspace destroy spec-export --keep-branch` preserves the ref and removes the tree; perform gated ref deletion, no native removal. Guarded `workspace destroy spec-export --published-only` source removes the tree first and deletes the ref only at the pinned SHA; read-back finds neither tree nor branch, exit 0. Unguarded wrapper deletes the branch without a SHA check: refuse before execution. Host-owned /work/host/spec-export matches no home: retain both. Failed native removal prints "worktree is locked", read-back finds tree listed/on disk and branch present: retain both, print output. Use exact per-repo state reports, describe checked-out-at-another-path recovery for the retained host checkout. No plan, loop, or handoff brief.
