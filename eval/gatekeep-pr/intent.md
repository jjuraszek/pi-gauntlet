for: d6f3605059ce6fc3362994c1ab1ee32e5c08c2ce41c1bb6445d66b19976b8801

## Change
gatekeep-pr reads the merge-base overrides file's `## using-git-worktrees` section as its worktree contract: provisioning creates at `home:` through `create:` with `<name>` = `pr-<N>`, the digest records `destroy` from `destroy:`, and cleanup requires the `home:` ownership match before running `worktree.destroy` or a forced removal, printing `worktree: skipped - outside configured home, left at <path>` otherwise. The `## PR gate` `worktree wrapper:` key is gone. Every SKILL.md also gains the front-door sentence under Project overrides. Cleanup step 2 skips branch deletion after a failed destroy even when the checkout is gone.

Apply the shared menu-layout contract at report, decision-menu, and post-merge rendering boundaries, including numeric reply mapping before action.

## Expected to move
- cleanup-keyed-destroy-recorded/g1: fails -> holds - the ownership match is new.
- cleanup-keyed-outside-home/o1: fails -> holds - the baseline removes any created-or-landed tree.
- cleanup-keyed-outside-home/o2: fails -> holds - the branch stays checked out because the tree stays.
- cleanup-keyed-outside-home/o3: fails -> holds - same.
- cleanup-keyed-destroy-partial-failure/p2: fails -> holds - step 2 now skips the branch after a failed destroy.
- cleanup-keyed-destroy-partial-failure/p3: fails -> holds - same.
- menu-after-numbered-findings/layout: fails -> holds - generated options remain a separate rendered list.
- menu-after-numbered-findings/mapped-pick: fails -> holds - legacy reply 7 names option 4, reply, before posting.
