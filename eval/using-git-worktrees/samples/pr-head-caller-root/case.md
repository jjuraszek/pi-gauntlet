bundle+: skills/using-git-worktrees/reference/pr-head.md

# Existing companion branch from caller root

These are independent synthetic observations, not successive mutations. No real tools or tracker calls. Give compact command/record legends and a row per run within the target word cap. Show stops and write boundaries, not only intentions.

Home is acme/widget at /work/widget; session is linked at /work/widget/.worktrees/other. Caller supplies ROOT=/work/helper, BRANCH=spec-export, REMOTE_BRANCH=existing for acme/helper, a companion in a coordinated marked-home run with two Legs. No PR array is supplied for this invocation. Home already provisioned at /work/widget/.worktrees/spec-export; preserve it on every failure. Companion preflight already validated its recorded contract. Its own .pi/settings.json uses defaults; its overrides resolve home: .worktrees/<name>. No submodule, wrapper or dirt unless stated. All command exits succeed except as specified. Define aliases for full SHAs: O=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa (origin/spec-export), B=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb (origin/trunk), A=cccccccccccccccccccccccccccccccccccccccc (local ancestor), R=dddddddddddddddddddddddddddddddddddddddd (recovered tip), X=eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee (race/unrelated tip). Positional gh repo view acme/helper returns defaultBranchRef.name=trunk. Fetch succeeds. No local branch or tree unless stated. Successful read-backs list /work/helper/.worktrees/spec-export on spec-export at O, and base is contained; recovery rows read back R instead. Every supplied observation overrides empty-output replay defaults.

| Run | Independent observations |
|---|---|
| absent | No local branch; unique origin/spec-export exists. |
| ancestor | Local branch at A; A ancestor of O; no tree. |
| reuse | Selected companion home on spec-export at A, clean; ff-only reaches O. |
| wrapper | create: helper create -b <branch> <name>; no local branch. |
| race | Add succeeds but selected tree HEAD=X, expected O. |
| elsewhere | spec-export checked out at /work/helper/.worktrees/foreign. |
| missing | Plain git -C /work/helper fetch origin exits 0 without pruning; stale local origin/spec-export still resolves to O despite deletion of the remote branch. git -C /work/helper ls-remote --exit-code --heads origin refs/heads/spec-export exits 2 with no matching head. |
| lookup-error | Independent of missing: plain git -C /work/helper fetch origin exits 0; local origin/spec-export resolves to O. git -C /work/helper ls-remote --exit-code --heads origin refs/heads/spec-export exits 128 with fatal: unable to access origin. |
| unresolved | Base merge conflicts in lib/a.ts; companion BASE_SHA overrides provide credential-free file-scoped runner `node --test lib/a.test.mjs`; helper fails; merge abort succeeds back to O, clean. |
| recover-tree | Selected home clean at R, O ancestor of R; first-parent O..R contains only R O B, B ancestor of origin/trunk; base merge no-op. |
| recover-add | Same proof as recover-tree but no worktree exists. |
| invalid-linear | Local tip X beyond O; walk contains X O (one parent). |
| invalid-parent | Local tip R beyond O; walk R O X; X is not ancestor of origin/trunk. |
| invalid-dirty | recover-tree proof but selected worktree has M lib/a.ts. |
| ordinary-control | Separate singleton PR home, no coordinated context: acme/widget#82, headRefName=spec-export, headRefOid=O, baseRefName=trunk, in-repo; local tip R beyond O with same base-merge proof. No recovery exemption. |

Show companion ROOT authority, default/base resolution, exact checkout rows, wrapper decision, sync/helper boundaries, original-head ancestry and affirmative read-back; emit no PR fields, refs or thread work for companions. Show what narrowly admits recovery and why each invalid proof stops. For the ordinary control show the unchanged PR ancestry stop.
