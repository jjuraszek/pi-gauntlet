bundle+: skills/using-git-worktrees/reference/pr-head.md

# Existing companion branch recovery from caller root

These are independent synthetic observations, not successive mutations. No real tools or tracker calls. Use compact command/record legends and a row per run, at most 1000 words total. Budget: shared legends 400 words; at most 80 words per row; closing records 100 words. Show stops and write boundaries, not only intentions. Define full SHA aliases once and use them in commands and records; do not repeat shared commands per row.

Home is acme/widget at /work/widget; session is linked at /work/widget/.worktrees/other. Caller supplies ROOT=/work/helper, BRANCH=spec-export, REMOTE_BRANCH=existing for acme/helper, a companion in a coordinated marked-home run with two Legs. No PR array is supplied for this invocation. Home already provisioned at /work/widget/.worktrees/spec-export; preserve it on every failure. Companion preflight already validated its recorded contract. Its own .pi/settings.json uses defaults; its overrides resolve home: .worktrees/<name>. No submodule, wrapper or dirt unless stated. All command exits succeed except as specified. Define aliases for full SHAs: O=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa (origin/spec-export), B=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb (origin/trunk), A=cccccccccccccccccccccccccccccccccccccccc (local ancestor), R=dddddddddddddddddddddddddddddddddddddddd (recovered tip), X=eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee (unrelated tip). Positional gh repo view acme/helper returns defaultBranchRef.name=trunk. Fetch succeeds. No local branch or tree unless stated. Successful read-backs list /work/helper/.worktrees/spec-export on spec-export at R, and base is contained. Every supplied observation overrides empty-output replay defaults.

| Run | Independent observations |
|---|---|
| recover-tree | Selected home clean at R, O ancestor of R; first-parent O..R contains only R O B, B ancestor of origin/trunk; base merge no-op. |
| recover-add | Same proof as recover-tree but no worktree exists. |
| invalid-linear | Local tip X beyond O; walk contains X O (one parent). |
| invalid-parent | Local tip R beyond O; walk R O X; X is not ancestor of origin/trunk. |
| invalid-dirty | recover-tree proof but selected worktree has M lib/a.ts. |
| ordinary-control | Separate singleton PR home, no coordinated context: acme/widget#82, headRefName=spec-export, headRefOid=O, baseRefName=trunk, in-repo; local tip R beyond O with same base-merge proof. No recovery exemption. |

Show companion ROOT authority, default/base resolution, original-head ancestry and affirmative read-back; emit no PR fields, refs or thread work for companions. Show what narrowly admits recovery and why each invalid proof stops. For the ordinary control show the unchanged PR ancestry stop.
