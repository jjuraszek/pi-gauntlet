for: 2c404cac0f6b6730d59c12dc7f86de5db211119c518ff85c135a933f0ef522bc

## Change
gatekeep-pr reads the merge-base overrides file's `## using-git-worktrees` section as its worktree contract: provisioning creates at `home:` through `create:` with `<name>` = `pr-<N>`, the digest records `destroy` from `destroy:`, and cleanup requires the `home:` ownership match before running `worktree.destroy` or a forced removal, printing `worktree: skipped - outside configured home, left at <path>` otherwise. The `## PR gate` `worktree wrapper:` key is gone. Every SKILL.md also gains the front-door sentence under Project overrides. Cleanup step 2 skips branch deletion after a failed destroy even when the checkout is gone.

## Expected to move
- cleanup-keyed-destroy-recorded/g1: fails -> holds - the ownership match is new.
- cleanup-keyed-outside-home/o1: fails -> holds - the baseline removes any created-or-landed tree.
- cleanup-keyed-outside-home/o2: fails -> holds - the branch stays checked out because the tree stays.
- cleanup-keyed-outside-home/o3: fails -> holds - same.
- cleanup-keyed-destroy-partial-failure/p2: fails -> holds - step 2 now skips the branch after a failed destroy.
- cleanup-keyed-destroy-partial-failure/p3: fails -> holds - same.
