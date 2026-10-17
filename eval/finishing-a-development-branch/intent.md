for: c62e8914c9b61cc41095da4963091eb73afaeaa2fe807738747975550beb141b

## Change
Step 6 reads the overrides file's `## using-git-worktrees` section at finish time. With a keyed contract it matches `$WORKTREE` against `home:` with `<name>` matched inside one path segment, runs `destroy:` with the recovered name or the built-in `git worktree remove` + `prune`, and keeps the branch when `destroy:` fails; a non-matching path is host-owned. Without a section the legacy three homes decide, unchanged. Successful keyed cleanup explicitly continues to `git -C "$PRIMARY" branch -D "$FEATURE"`, with no built-in remove or prune after a successful `destroy:`.

## Expected to move
- no-section-dot-worktrees-removed/w1: fails -> holds - the explicit branch -D continuation also settles the legacy .worktrees/ removal narration.
- no-section-sibling-host-owned/s2: fails -> holds - same.
- home-match-builtin-remove/b1: fails -> holds - the ownership match is new.
- home-match-builtin-remove/b2: fails -> holds - the baseline reports a sibling path host-owned.
- home-match-builtin-remove/b3: fails -> holds - same.
- home-match-destroy-recovered-name/r1: fails -> holds - the baseline hardcodes script/worktree destroy with the directory basename.
- home-match-destroy-recovered-name/r2: fails -> holds - same.
- home-match-destroy-recovered-name/r4: fails -> holds - the quoting rule is new.
- destroy-failure/f1: fails -> holds - the baseline reports a sibling path host-owned and never runs destroy.
- destroy-failure/f2: fails -> holds - the no-force rule is new.
- destroy-failure/f3: fails -> holds - the baseline never runs the destroy command.
