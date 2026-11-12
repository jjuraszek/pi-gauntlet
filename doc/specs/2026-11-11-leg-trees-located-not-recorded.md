# Leg trees are located by branch; the draft-PR handoff leaves no local tree or branch

**Goal:** Every stage finds a coordinated leg's worktree by asking git which linked worktree of that repo holds the leg's branch, the spec records a `home:` only for a repo that declares one or uses the built-in folder, and the draft-PR option removes each leg's tree and local branch once the remote holds the same commit.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Predecessor:** `doc/specs/2026-10-28-multi-repo-coordinated-flow.md` - superseded for locating a leg's tree from recorded `home:` plus shared NAME ("Writing-plans and plan_check", "Handoff and resume", "Finishing") only; `doc/specs/2026-10-29-coordinated-draft-pr-handoff.md` - superseded for branch preservation after publication ("Publish option 6 on a coordinated spec") and the push-from-the-option-6-machine recovery ("Re-gate re-settles companions") only; `doc/specs/2026-10-28-spec-only-draft-pr.md` - superseded for the kept local branch in "Option 6 at the User Review Gate" cleanup only.

## Problem

A two-repo run handed off through the draft-PR option (gate row 6) and continued with `brainstorming #N` failed at `plan_check` with `invalid recorded branch or home pattern for <repo>`. The companion's leg block recorded a literal `home:` path. The companion repo creates worktrees with its own script, which names the folder by the script's name argument (`slug`) and the branch `<user>/<slug>`, so the folder is not the branch with `/` turned into `-`.

The user's follow-up asked that the draft-PR option create no worktree or clean up after itself, that continuation start from the draft PR instead of local state, that each repo's own worktree script run with the built-in strategy as fallback, that local branches be dropped too, and why the spec needs a disk reference to the tree at all.

Framing: pivoted to locating a leg's tree by its branch in `git -C <primary> worktree list --porcelain`, with `home:` recorded only for a repo that declares one - the folder computed from `home:` plus the flattened branch cannot match a tree a script placed under its own name (user reply `B` to the framing question).

### Checked claims

| Claim | Lookup | Result |
|---|---|---|
| `plan_check` locates a companion tree only as recorded `home:` with `<name>` replaced by the branch, `/` -> `-` | `extensions/phase-tracker.ts:1026-1035`; scratch two-repo fixture (repo `team/sib`, branch `user/slug`) run through `plan_check` three times | Held. Literal `home:` -> `invalid recorded branch or home pattern for team/sib`; `home: ../sib-worktrees/<name>` with the tree at `slug` -> `cannot resolve worktree for team/sib`; tree moved to `user-slug` -> `PASS`. No draft PR was involved in the fixture: a fresh two-repo run fails the same way. |
| The ship check uses the same formula | `extensions/verify-before-ship.ts:196-215` | Held. `coordinatedMember` compares the target checkout with `resolve(primary, home.replace("<name>", branch.replaceAll("/", "-")))`; a mismatch silently loads the checkout's settings instead of the primary's. |
| Both checks date from the coordinated multi-repo change | `git blame` on both ranges | Held. Commit `33e4e719` (#99). |
| The literal `home:` came from a missing rule, not a typo | `skills/brainstorming/reference/legs.md:43-59`; the consumer repo's keyless `## using-git-worktrees` section and its worktree script | Held. `legs.md` says to retain the discovered wrapper but gives no rule that yields a `home:` pattern for a legacy-path wrapper. |
| "No `home:` line can pass" for a script-placed repo (triage) | fixture case 3; the consumer script's existing-branch mode | Corrected. A tree in the folder named after the flattened branch passes with `home: ../<dir>/<name>`, and that script accepts such a name when also given `--branch`. A tree the script already placed under its own name still cannot pass without destroy and recreate; the reported continuation did exactly that by hand and dropped the tree's dev and test databases. |
| The draft-PR option "should clean after" | `skills/brainstorming/reference/spec-pr.md` "Publish option 6", "Coordinated publication passes"; the reported run | Held, already shipped. Both trees were removed; both branches were kept locally and on origin. |
| The draft-PR option "should never create worktree at all" | `skills/brainstorming/SKILL.md` "Worktree First"; `reference/spec-finalization.md` gate row 6 | Corrected. Row 6 is picked at the approval gate, after the spec is committed in its tree; removal after publication is the reachable half. |
| "Fresh continue should fetch draft PR" | `reference/pr-subject.md` marked classifier; `reference/spec-pr.md` "Coordinated marked settlement"; `skills/using-git-worktrees/reference/pr-head.md` companion mode | Held, already shipped. Home provisions from the PR head; each companion from `origin/<branch>`. A kept local branch is fast-forwarded and a tree at another path stops the run. |
| Each repo's own script runs, built-in as fallback | `skills/using-git-worktrees/SKILL.md` Step 0 and Steps 1a, 1b, 2; `reference/pr-head.md` "Companion identity and provisioning", "Provision the exact head" | Corrected. Held for fresh creation only. A continuation caller (`REMOTE_BRANCH=existing`) follows pr-head companion mode instead of Steps 0, 1 and 1a and never reaches Step 1b's discovered script: it runs an overrides `create:` that has no `-b`/`-B`, else built-in `git worktree add "<home>"` with the home defaulting to `.worktrees/<flattened branch>`. Design "Provisioning at continuation" closes this. |
| Continuation works with no local branch | `doc/specs/2026-10-29-coordinated-draft-pr-handoff.md:186,194`; pr-head.md "Provision the exact head" DWIM row; the consumer script's existing-branch path accepts a remote-only branch | Held. |
| Why branches are kept after the draft-PR option | `doc/specs/2026-10-29-coordinated-draft-pr-handoff.md:31,37,151` | Held as a recorded predecessor decision: the missing-remote stop pushes again from the local branch on the machine that ran option 6. The user chose to delete the branch once the remote holds the same commit (reply `B` to question 2) and accepted that the flow can no longer restore a remote branch someone deletes later. |
| A locate-by-branch rule already exists | `skills/gauntlet-resume/reference/seed.md:20-24` | Held. Seed step 5 reads `worktree list --porcelain` and takes the block on the branch, "layout-agnostic". |
| A coordinated member always has its branch checked out in a worktree git lists | `skills/using-git-worktrees/SKILL.md` Step 4 coordinated row | Held. `Worktree ready` requires the listed path and `branch --show-current` equal to `$BRANCH`; a detached-HEAD jj workspace never passes, so a branch lookup loses no admitted leg. |
| `plan_check` already reads `worktree list --porcelain` | `extensions/phase-tracker.ts:979-980` | Held, for the home primary. |
| The ship check needs no folder | `extensions/verify-before-ship.ts:196-215,243-246` | Held. `coordinatedMember(target, primary)` already holds the target checkout and its primary. |
| `home:` is also the ownership test before destroy | `skills/finishing-a-development-branch/SKILL.md` Step 6; `reference/legs.md:72`; `reference/spec-pr.md` cleanup | Held. A recorded contract without `home:` falls to "no match -> host-owned" today, so a script-placed leg's recorded `destroy:` would never run without a new case. |
| Why the spec records the contract | `doc/specs/2026-10-28-multi-repo-coordinated-flow.md:85` | Held as a recorded decision: the recorded block is the single authority at finish. This spec keeps it. |
| A tree mid-rebase is still listed on its branch | scratch repo, conflicting `git rebase`, then `git worktree list --porcelain` and `git branch --show-current` | Corrected. The block reads `detached` and `--show-current` prints nothing. |
| A tree folder deleted by hand drops out of the list | same scratch repo, `rm -rf` the tree | Corrected. The block stays with its `branch` line and a `prunable` line. |
| A tree the user made is never removed (round 1 wording) | `skills/using-git-worktrees/SKILL.md` Step 1; pr-head.md provisioning rows | Corrected. Fresh creation stops on a branch collision. Continuation today reuses a tree on the leg's branch only at the selected home and stops on one at another path; under this design a block without `home:` reuses the one tree git lists on the branch (Design "Provisioning at continuation"), and the recorded `destroy:` later removes it, as for a `home:` leg today. |
| The continuation hit a contract-drift stop | the continuation session | Corrected. It ran the drift comparison and found none; `plan_check` was the only stop. |
| Wording tests bound to the folder rule | `rg` over `scripts/*.test.mjs`, `extensions/*.test.ts`; council probe of `scripts/wave-review.test.mjs:45` and `scripts/finish-verification.test.mjs:253` | Corrected. Two assertions: `scripts/brief-contract-lint.test.mjs:227`, and `scripts/wave-review.test.mjs:45`, which requires the tokens `home:` and `NAME` in `plan-contract.md`. A third test bounds the edit: `scripts/finish-verification.test.mjs:253` requires `skills/finishing-a-development-branch/SKILL.md` under 500 lines, and the file is at 499 lines / 47,967 bytes. |
| An eval run makes at most ten model calls | `eval/run.mjs:138-151,335-359`; `eval/lib/run.test.mjs:429-445` | Corrected. `judge()` makes up to two attempts per judgment, confirmation judgments included, so a cold run can reach fourteen calls; the test expects `replay 4, judge 6, confirm 2`. The runner has no call ceiling. See Design "Actions". |
| Other repos' worktree scripts | none available | Not checked. Only one consumer script was read; the design assumes any script that takes a branch. |
| The continuation's recreate result | the continuation session | Not checked. The transcript ends at the create command. |
| jj workspaces end to end | not run | Not checked. See Out of scope. |

Implicit dependencies: scratch two-repo `plan_check` fixture - built and run during triage - found. Scratch rebase and deleted-folder repo - built and run before round 2 - found. Eval runner `node eval/run.mjs` and the eight samples below - `eval/README.md`, sample directories listed - found.

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] Given a two-leg spec whose companion `team/sib` has branch `user/slug` checked out in a linked worktree at `../sib-worktrees/slug`, `plan_check` on a plan with a task in that leg passes and resolves the task's paths inside that tree, whether the leg block records no `home:`, a literal `home:` path, or a `home:` pattern that does not match the folder.
  in-scope
- [ ] Given the same spec with no single linked checkout on the leg's branch (none; only the companion primary holds it; the tree is detached; the listed folder is not a checkout; two worktrees hold it), `plan_check` fails with a `cannot resolve worktree for team/sib: ...` reason that names the branch, the folder, or the count.
  in-scope
- [ ] After a passing `plan_check` on that spec, a test or ship command run in the companion's linked checkout on `user/slug` at `../sib-worktrees/slug` is judged with the companion primary's verify-before-ship settings; a linked checkout of that repo on another branch or with a detached HEAD is judged with its own checkout's settings.
  in-scope
- [ ] A coordinated brainstorm whose companion tree is created by that repo's discovered worktree script writes a leg block with `create:` and `destroy:` and no `home:` line, while a member with a keyed contract or built-in creation still records `home:`.
  in-scope
- [ ] After the draft-PR option prints the PR URL for a one-member spec whose remote branch is at the tree's commit, the tree is removed, the local branch is deleted, and the report reads `<repo>: removed <path>, deleted <branch>`.
  in-scope
- [ ] After the draft-PR option prints the PR URL for a coordinated spec, each leg is cleaned companions first, then home; a leg whose remote branch differs, is missing or cannot be read, or whose tree is host-owned, keeps its tree and branch and is reported as `<repo>: kept <path> and <branch> - <reason>`; a leg whose destroy command fails is reported with the tree and branch state read back after the command; and the remaining legs are still cleaned.
  in-scope
- [ ] `brainstorming #N` on a marked draft PR whose companion leg block records no `home:` provisions that companion without a contract-drift stop when its recorded `create:` equals the template derived from that repo's discovered worktree script: it reuses the one tree git lists on the leg's branch, or else runs that script's existing-branch form.
  in-scope
- [ ] `brainstorming #N` with a companion's `origin/<branch>` missing stops naming the repo and branch; the stop offers `git push -u origin <branch>` only when a local branch holding the leg file exists on this machine, and otherwise says the remote branch must be restored and that nothing is regenerated.
  in-scope
- [ ] Squash or discard on a spec whose leg block records `destroy:` and no `home:` runs that command from the leg's primary on the tree git lists for the leg's branch, with `<name>` set to that tree's folder name, then deletes the branch; a block with neither `home:` nor `destroy:` is reported host-owned with tree and branch kept.
  in-scope
- [ ] Plan writing for a coordinated spec whose companion tree sits in a script-placed folder resolves that leg's `Modify:`, `Create:`, `Test:` and `Delete:` paths in the tree git lists for the leg's branch.
  in-scope
- [ ] Resume with a brief whose companion location is absent looks for the tree by the leg's branch in the declared primary; when none is found the stop names the repo, the branch and the empty lookup, and states that the lookup authorizes no recreation, receipt or approval.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: leg-trees-located-not-recorded
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: `npm test` (runs `scripts/ci.mjs`); scoped `node --test extensions/phase-tracker.test.ts extensions/verify-before-ship.test.ts scripts/brief-contract-lint.test.mjs scripts/wave-review.test.mjs scripts/finish-verification.test.mjs`; selected eval samples through `node eval/run.mjs <target> <sample>` as bounded in Design "Actions"
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: doc/install-internals.md
Rules: eval/README.md
Rules: .agents/skills/release/SKILL.md
Rules: .pi/gauntlet-overrides.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7, AC 8, AC 9, AC 10, AC 11
design: owns `extensions/phase-tracker.ts`, `extensions/verify-before-ship.ts`, their two test files, `scripts/brief-contract-lint.test.mjs`, `scripts/wave-review.test.mjs`, the skill files named under Design "Remove" and "Add", the eight eval samples and six `intent.md` files named under Tests, `README.md`, `CHANGELOG.md`, and the three predecessor banners; observable outcomes are the eleven AC rows.

## Design

supersedes `doc/specs/2026-10-28-multi-repo-coordinated-flow.md`, locating a leg's tree from recorded `home:` plus shared NAME; supersedes `doc/specs/2026-10-29-coordinated-draft-pr-handoff.md`, branch preservation after publication and the push-from-the-option-6-machine recovery; supersedes `doc/specs/2026-10-28-spec-only-draft-pr.md`, the kept local branch in option-6 cleanup.

### Location rule

A leg's tree is the one linked worktree of the leg's primary whose block in `git -C <leg primary> worktree list --porcelain` carries `branch refs/heads/<recorded branch>`. The primary's own block (the first) never counts. A listed block is retained administration, not proof of what sits at the path now, so the selected `worktree` path must also pass the identity check `plan_check` runs today: the path exists, `checkoutOf(<path>).toplevel` equals `realpathSync(<path>)`, the checkout is not the primary, and its `--git-common-dir` equals the leg primary's. A path that was deleted, that resolves through a parent checkout, or that another repository now occupies fails the check. `skills/brainstorming/reference/legs.md` owns this rule; every consumer that has to find a tree cites it instead of restating it. The home leg keeps its current resolution (the session's home worktree).

| Lookup result | Non-cleanup consumer | Cleanup consumer (finish Step 6, coordinated cleanup, draft-PR cleanup) |
|---|---|---|
| Exactly one block, identity check passes | That path is the leg's root for every later step: admission checks, plan-path checks, provisioning reuse. | That path is the tree the ownership rule acts on. |
| No block, several blocks, or a failed identity check | Stop naming the repo with the matching reason under Errors and edge cases. Only Provisioning at continuation proceeds on `no worktree holds <branch>`, by creating the tree. | Run no `destroy:` and delete no branch for that leg; report the repo, the branch and the reason, never an invented path; continue with the remaining legs. |

| Consumer | Change |
|---|---|
| `plan_check` (`extensions/phase-tracker.ts:1026-1035`) | After the sibling primary resolves, read that primary's worktree list and apply the rule, keeping the existing `checkoutOf` and common-dir comparison on the selected path; the located path is the leg root for `FsPort`. |
| Ship check (`extensions/verify-before-ship.ts:196-215`) | Membership-check exception: it already holds the target checkout, so it selects no tree and does not use the unique-worktree rule. `coordinatedMember(target, primary)` is true for a companion when the repo matches a leg and `git -C <target> branch --show-current` equals that leg's `branch:`. Two checkouts on one branch are each judged members; `plan_check` is the stage that rejects that state. |
| `skills/writing-plans/SKILL.md`, `reference/plan-contract.md` | Resolve each member's checkout by the rule; a failed lookup stops plan writing with the reason. |
| `skills/finishing-a-development-branch/reference/legs.md` | Activation, discard listing and cleanup use a brief path only when it is the checkout the rule finds for the leg's branch; otherwise they use the rule's result. For a failed lookup the discard listing prints the reason in place of a path. Receipt admission of a missing delivered tree is unchanged. |
| `skills/gauntlet-resume/reference/brief-contract.md` | A companion location the brief records as `missing` is looked up by the rule; a found tree becomes the companion worktree for the remaining admission checks (common dir, live branch, `**Home:**` tuple). A brief's explicit `worktree:` path keeps today's validation as recorded. |
| `skills/brainstorming/reference/spec-pr.md` draft-PR cleanup | Companion trees come from the rule, not the carried Worktree First path (Draft-PR cleanup). |
| `skills/brainstorming/reference/spec-pr.md` settlement step 4, `skills/using-git-worktrees/reference/pr-head.md` companion mode | A block without `home:` selects its tree by the rule (Provisioning at continuation). |
| `loop-implementation` seed and authorized restore; bare-worktree `gauntlet-resume` | Both capture companion checkout paths with no brief `legs:` path to read. `legs.md` names them as consumers of the rule; their own files state no folder formula and are not edited. |

### Recorded leg block

| Creator of the tree | Recorded `contract:` lines |
|---|---|
| Keyed `## using-git-worktrees` contract (declared `home:` or its `.worktrees/<name>` default) | `home:`, `create:`, `destroy:` as today |
| Owned built-in (`.worktrees/<name>`) | `home:`, `create:`, `destroy:` as today |
| Native tool or discovered script (legacy path), tree created by this flow | `create:` and `destroy:`; no `home:` |
| Tree the session was already inside, no keyed contract | neither `home:` nor `destroy:` |

A path the creator produced is never recorded.

Templates for a discovered script (rules in `legs.md` "Record portable templates"):

- `create:` and `destroy:` are the commands run from the primary, written with the script's repo-relative path, `<name>` where the script takes the tree name, and every other token resolved to a portable value by the existing wrapper-token rule. No machine path, user name or expanded folder appears.
- `create:` passes the shared branch as an explicit `<branch>` argument, so the branch never depends on what the script derives from the name. A script that cannot be given the branch fails Step 4's existing read-back (`branch --show-current` equal to `$BRANCH`) at fresh creation and gets no block.
- `<name>` in `create:` is the shared NAME (the branch with `/` -> `-`) at fresh creation and at continuation, the value the keyed path and pr-head already use. `<name>` in `destroy:` is the located tree's folder basename (Cleanup ownership). The folder the script makes is located by branch and never read back into the spec.

Marked settlement's drift comparison (settlement step 2):

| Recorded block | Current value compared |
|---|---|
| `create:` of a keyed contract or the built-in | Step 1a's resolved `create:`, as today. |
| `create:` of a discovered script | The template that the discovery fresh creation uses (Step 1b: native tool, then the wrapper found from `AGENTS.md`, the repo root, `script/` or `bin/`) yields in the companion primary now, rendered by the rules above - not the Step 1a built-in default. |
| `home:` recorded | The resolved `home:`. When the current rule yields none this is contract drift with the resolved value `absent`: `contract drift for <repo>: recorded home: <value>, resolved absent; ...` (the existing stop text). |
| No `home:` recorded | `home:` is not compared. |

The remedy for a script-placed leg that an already-published spec records with a `home:` line is a user-approved amendment that drops `home:` from the home spec's leg block and from the companion file together, through the existing home-plus-companion reconciliation path; after it the no-`home:` rows apply. Nothing rewrites the line automatically, and until the amendment a `home:` block keeps today's ownership behavior.

### Provisioning at continuation

Marked settlement step 4 and pr-head companion mode provision a leg whose block records no `home:` by the rows below; the home leg of a marked continuation whose block records no `home:` follows the same rows in pr-head's home provisioning. A block with `home:` keeps every existing row, including the checked-out-at-another-path stop and the `create: override skipped (contains -b)` built-in at `<home>`. Unmarked PR subjects keep pr-head unchanged.

| State of a no-`home:` leg | Action |
|---|---|
| The location rule finds its tree | That tree is the selected tree: the existing dirty-tree ask, `merge --ff-only origin/<branch>` and exact-head check run in it. The checked-out-at-another-path stop does not apply. |
| The lookup fails with any reason other than `no worktree holds <branch>` | Stop naming repo and branch with that reason; create nothing. |
| No tree; the script in the recorded `create:` has a form that checks out an existing branch | After the existing ancestry proof and `update-ref` for a local branch, run that form from the primary with `<name>` = the shared NAME and `<branch>` = the branch, never `-b`/`-B`. A non-zero exit stops with its output; no built-in fallback. Then locate the tree by the rule and require HEAD equal to the published head, as today. |
| No tree; that script cannot check out an existing branch | Stop before any write: `cannot provision <repo>: <script> cannot check out existing branch <branch>`. No built-in tree is created for a block whose `destroy:` is that script's. |

Built-in existing-branch creation remains the path for a block that records the built-in `create:`, that is, a repo with no script or native tool.

### Cleanup ownership for a recorded block

| Block | Finish Step 6, coordinated cleanup, and draft-PR cleanup |
|---|---|
| Has `home:` | Today's pattern match, `destroy:` or built-in removal, unchanged. |
| No `home:`, has `destroy:` | Run `destroy:` from the leg's primary against the located tree: `<name>` -> that tree's folder basename (the value the single-repo script path already passes), `<branch>` -> the recorded branch, other tokens resolved from context or asked once. No `git worktree remove` fallback on any outcome. After the command, whatever its exit, read back whether `worktree list --porcelain` still lists the tree, whether its folder is still on disk, and whether `refs/heads/<branch>` exists; the tree is removed only when it is neither listed nor on disk. Removed -> finish continues to its existing `git -C <primary> branch -D <branch>` step (draft-PR cleanup uses its own gated deletion). Not removed -> the branch is kept. The report states what the read-back found. |
| Neither | Host-owned: remove nothing, keep the branch, report it. |

Legacy specs without `## Legs` keep the finish-time overrides reread.

Placement: this table lives in `skills/finishing-a-development-branch/reference/legs.md`. `SKILL.md` Step 6 gets a short citation in its existing recorded-contract sentence, and Step 6 item 1's `home:` absent -> `$PRIMARY/.worktrees/<name>` default is limited to the legacy overrides reread, so a recorded block without `home:` never falls to "no match". The edit keeps `SKILL.md` under its enforced 500 lines and 50,000 bytes.

### Draft-PR cleanup

Applies to the one-block recipe, the legacy recipe for a spec without `## Legs`, and the coordinated passes alike, after the PR URL prints and the brainstorm phase completes; companions in declared order, then home. Bind four values per leg before step 1:

| Value | Spec with `## Legs` | Legacy spec without `## Legs` |
|---|---|---|
| `<repo>`, `<branch>` | The block's identifier and `branch:`. | The repository and branch "Publish option 6" pushed. |
| `<primary>` | Home: the session's primary. Companion: its declared sibling primary. | The session's primary. |
| `<tree>` | Home: the session's home worktree. Companion: the location rule, not the carried Worktree First path. | The recipe's `<worktree>`. |
| Ownership | The cleanup-ownership table. | Finish Step 6's overrides reread, as today. |

A companion whose lookup fails, including a tree already gone from disk, has no `<tree>`: run no `destroy:`, delete no branch, report the lookup reason, and continue with the next leg.

1. Gate. Require `git -C <tree> branch --show-current` to print `<branch>`. Read `git -C <tree> ls-remote --exit-code --heads origin refs/heads/<branch>`, `git -C <tree> rev-parse HEAD` and `git -C <primary> rev-parse refs/heads/<branch>`. `ls-remote` exit 0 with all three SHAs equal pins that SHA. A tree on another branch or detached, exit 2 (the remote branch is absent and the output is empty), any other non-zero exit, or unequal SHAs keeps tree and branch.
2. Remove the tree by its ownership rule; no `git worktree remove` fallback after a refused or failed wrapper. A destroy command that deletes the branch itself needs protection equal to step 4: its source deletes the branch only after the tree is gone, and only at the pinned commit or behind a check that refuses a tip the remote does not hold. A source that deletes the branch unconditionally is refused before it runs, and the leg keeps tree and branch.
3. Read back, whatever the command's exit: whether `git -C <primary> worktree list --porcelain` still lists `<tree>`, whether the folder is still on disk, and `git -C <primary> rev-parse -q --verify refs/heads/<branch>`. The tree is removed only when it is neither listed nor on disk. `git worktree remove` can succeed before `git worktree prune` fails, and a wrapper can fail after removing the tree or the branch, so the exit code alone decides nothing.
4. Delete the branch only when step 3 confirmed the tree removed and the ref still exists. A ref that no longer equals the pinned SHA is kept and reported as moved. Otherwise run `git -C <primary> update-ref -d refs/heads/<branch> <pinned SHA>`, which deletes only a ref still at that SHA. Never `git branch -D`.
5. Report one line per leg from the state steps 3 and 4 read, never from an exit code:

| State read back | Line |
|---|---|
| Tree removed, branch deleted | `<repo>: removed <path>, deleted <branch>` |
| Tree and branch both remain | `<repo>: kept <path> and <branch> - <reason>` |
| Tree removed, branch remains | `<repo>: removed <path>, branch <branch> kept - <reason>` |
| Tree remains, branch gone (a wrapper deleted it before failing) | `<repo>: kept <path>, branch <branch> deleted - <output>` |
| Companion lookup failed | `<repo>: kept <branch> - <lookup reason>` |

Reasons when both remain: `tree is on <current branch or detached>, not <branch>`; `origin/<branch> is at <sha>, tree is at <sha>`; `<branch> is at <sha>, tree is at <sha>`; `origin/<branch> is missing`; `remote lookup failed: <output>`; `host-owned`; `destroy deletes <branch> unguarded`; `removal failed: <output>`. Reasons when only the branch remains: `<branch> moved to <sha>`, or the `update-ref` output. A destroy command that exits non-zero while the read-back shows the tree removed proceeds to step 4 and appends ` - destroy exited <code>: <output>` to its line.

Every leg is attempted regardless of another leg's outcome. A kept tree that sits outside a `home:` block's resolved home keeps the existing warning that a later `brainstorming #N` stops on a branch checked out at another path; a kept tree of a block without `home:` is reused by that continuation (Provisioning at continuation). A failed PR creation runs no cleanup, as today.

### Missing remote at continuation

Marked settlement step 3 and pr-head companion mode keep the `ls-remote` exit-2 stop and print `origin/<branch> is missing in <repo>`. Append the existing push recovery (`git push -u origin <branch>`, then rerun `brainstorming #N`) only when `git -C <primary> log -1 --format=%H refs/heads/<branch> -- <spec-dir>/<home spec filename>` prints a commit. That command prints nothing both when `refs/heads/<branch>` does not exist and when the branch exists without the leg-file commit; both cases, and a branch whose tip is an unrelated commit, take the other ending: no local branch on this machine holds the leg file; restore `origin/<branch>` from a clone that still has it and rerun; nothing is regenerated.

### Remove

- In `extensions/phase-tracker.ts`: delete the leg `home:` extraction, the `<name>` count and stray-token validation, the `legRoot = resolve(..., home.replace("<name>", ...))` computation, and the reason `invalid recorded branch or home pattern for <repo>`. The `checkoutOf` test and the `expected`/`actual` common-dir comparison stay, applied to the path the lookup selects.
- In `extensions/verify-before-ship.ts`: delete the `home:` extraction and the path equation inside `coordinatedMember`.
- In `skills/writing-plans/SKILL.md` and `skills/writing-plans/reference/plan-contract.md`: delete "recorded `home:` with shared `NAME`"; in `scripts/wave-review.test.mjs` delete the `'home:'` and `'NAME'` tokens from the `plan-contract.md` assertion.
- In `skills/finishing-a-development-branch/reference/legs.md`: delete "or recorded `home:` pattern" (activation) and "the recorded `home:` pattern expanded for this branch" (discard listing).
- In `skills/gauntlet-resume/reference/brief-contract.md`: delete the two sentences that derive an absent location from recorded `home:` and shared NAME and render that derivation in the stop; delete the matching assertion in `scripts/brief-contract-lint.test.mjs`.
- In `skills/brainstorming/reference/spec-pr.md`: delete "Disable every branch-deletion step ... Never delete the local branch" (one-block cleanup); "leave its branch intact" and "Keep branches everywhere, including after owned built-in remove/prune" (coordinated cleanup); replace "Verify every wrapper preserves its branch before execution; refuse unsafe wrappers without native fallback" with the guarded-deletion rule of Draft-PR cleanup step 2, which still refuses an unguarded wrapper without native fallback; the unconditional "on the machine that ran option 6, push `<branch>`" recovery in settlement step 3.
- In `skills/using-git-worktrees/reference/pr-head.md`: delete the same unconditional recovery sentence in companion mode.
- In five eval samples' `expected.md`: delete the facts asserting the removed behavior, as listed under Tests, including the `cleanup` facts of `spec-gate/option-6-handoff` and `brainstorming/spec-pr-publish-legs`; in those two samples' `case.md` delete the inputs that require every branch kept or a branch-deleting wrapper refused outright.

### Add

- In `extensions/phase-tracker.ts`: add the per-companion worktree-list read, block selection by the location rule followed by the retained identity check, and the four reasons under Errors and edge cases.
- In `extensions/verify-before-ship.ts`: add the current-branch comparison.
- In `skills/brainstorming/reference/legs.md`: add the location rule with its lookup-result table and its named consumers (including `loop-implementation` seed and restore and bare-worktree resume), the recorded-block table and the discovered-script template rules in "Record portable templates", and a no-`home:` variant note beside the template block.
- In `skills/brainstorming/reference/spec-pr.md`: add the draft-PR cleanup bindings, steps and report lines to both recipes; to settlement step 2 the drift comparison table ("`home:` only when recorded", the discovery-derived `create:`, `resolved absent`) and the amendment remedy; to step 3 the conditional recovery; to step 4 the no-`home:` provisioning rows.
- In `skills/using-git-worktrees/reference/pr-head.md`: add the conditional recovery and the no-`home:` provisioning rows for companion mode and a marked home.
- In `skills/finishing-a-development-branch/reference/legs.md` cleanup: add the cleanup-ownership table with its no-`home:` rows and read-back. In `skills/finishing-a-development-branch/SKILL.md` Step 6: add only the short citation and the legacy-only limit on item 1's default, per Cleanup ownership "Placement".
- In `skills/writing-plans/SKILL.md`, `reference/plan-contract.md`, `skills/finishing-a-development-branch/reference/legs.md`, `skills/gauntlet-resume/reference/brief-contract.md`: add a citation of the location rule where the removed wording stood; in `scripts/brief-contract-lint.test.mjs` add the assertion on the new stop wording; in `scripts/wave-review.test.mjs` add the assertion on the branch-location citation in `plan-contract.md`.
- In `extensions/phase-tracker.test.ts` and `extensions/verify-before-ship.test.ts`: add the cases under Tests; change the `home:`-computed fixtures that no longer describe the lookup.
- Under `eval/`: add three samples, change five, and write `intent.md` for the six targets (`brainstorming`, `spec-gate`, `using-git-worktrees`, `finishing-a-development-branch`, `writing-plans`, `gauntlet-resume`) with the sample-scoped `report.md` evidence.
- `README.md` "Multi-repo runs", the README workflow step 1 sentence "The branch stays; a gauntlet-owned worktree is removed, ...", and a `CHANGELOG.md` `## Unreleased` entry, per Documentation impact.
- One supersession banner in each of the three predecessor specs.

### Actions

The only paid or external action is the eval runner: `node eval/run.mjs <target> <sample>` with the repo's configured replay models and judge, on the eight samples named under Tests, at most three runs per sample across seed, rows, repairs and finish, except `brainstorming/spec-pr-regate-legs`, which has five (26 runs). No target-wide or cross-target sweep runs.

Per-run call bound: fourteen model calls, including the runner's retry of a failed or malformed judge reply and confirmation judgments. The user's spec approval includes the selected evals at this documented bound, reaffirmed after the redundant approval stop. Keep the eight-sample and per-sample run limits above across the whole flow; no additional per-step approval is required. The user raised `brainstorming/spec-pr-regate-legs` from three runs to five after its third run left the continuation gate's worktree inventory incomplete in one replayed response.

Design approval authorizes these runs within the approved bounds with no per-step prompt. The loop treats any paid or external action without a clause here as unreachable; adding one needs separate explicit authorization.

## Errors and edge cases

- `branch:` missing from a companion block: `plan_check` fails `invalid recorded branch for <repo>`.
- No linked worktree block on the branch, including when only the primary holds it or the tree is detached (mid-rebase): `cannot resolve worktree for <repo>: no worktree holds <branch>`.
- The selected block's folder is missing, is not a checkout rooted there (deleted by hand, `prunable`, resolves through a parent checkout), or holds another repository (its git common dir differs from the primary's): `cannot resolve worktree for <repo>: <path> is not a checkout`.
- More than one linked block on the branch: `cannot resolve worktree for <repo>: <n> worktrees hold <branch>`.
- A prose consumer whose lookup fails: plan writing, finish activation, resume admission and continuation provisioning stop with the same reasons; cleanup runs no `destroy:` and no branch deletion for that leg, reports `<repo>: kept <branch> - <reason>` and continues.
- Ship check, companion tree detached: not a member; that checkout's own settings apply until the branch is checked out again.
- A spec that already records a `home:` not matching its tree: both checks pass; cleanup keeps today's behavior for a `home:` block (no match -> host-owned and reported; a `home:` without `<name>` stops naming the line); marked settlement stops with contract drift `resolved absent` when the repo's current rule yields no `home:`. The remedy is the user-approved amendment that drops `home:` from the home block and the companion file (Recorded leg block).
- Draft-PR cleanup, remote: `ls-remote` exit 2 is reported `origin/<branch> is missing`, any other non-zero exit `remote lookup failed: <output>`; both keep tree and branch.
- Draft-PR cleanup, tree not on the branch (detached, another branch) or local tip unequal to the tree HEAD: tree and branch kept.
- Draft-PR cleanup, branch advanced after the gate: the tree's removal is reported as read back, the branch is kept and reported `<branch> moved to <sha>`.
- Draft-PR and finish cleanup, destroy exits non-zero after removing the tree (remove succeeded, prune failed) or after a wrapper removed the branch: the report states the tree and branch state read back, not `kept` by default; no native fallback runs.
- Draft-PR cleanup, a guarded destroy script already deleted the branch: step 4 has nothing to delete. An unguarded branch-deleting script is refused before it runs.
- Continuation, a no-`home:` block whose script cannot check out an existing branch: stop naming repo, script and branch; no built-in tree.
- Missing remote at continuation with no local branch, or with a local branch that lacks the leg-file commit: the stop tells the user to restore the remote branch; no push is offered and nothing is regenerated.

## Tests

- Script-placed folder passes `plan_check` with no `home:`, a literal `home:`, and a non-matching pattern - `extensions/phase-tracker.test.ts`
- `plan_check` fails by name for no tree, primary-only, detached, folder-not-a-checkout, a stale registered path that another repository's checkout now occupies, and two trees (`git worktree add --force`) - `extensions/phase-tracker.test.ts`
- `plan_check` fails `invalid recorded branch` for a block without `branch:` - `extensions/phase-tracker.test.ts`
- A script-placed companion checkout on the leg's branch loads the primary's settings; another branch and a detached tree load their own - `extensions/verify-before-ship.test.ts`
- Mid-rebase ship-check settings - none: same code path as the detached-tree case
- Leg block for a script-created companion has `create:` and `destroy:` and no `home:`; keyed member keeps `home:` - new sample `brainstorming/multi-repo-script-placed-leg`
- One-member draft-PR cleanup removes the tree and deletes the branch after the gate - `spec-gate/option-6-handoff`: replace the `completion` and `cleanup` facts (branch retained, safe wrapper preserves branch, unsafe wrapper not run, no variant deletes the branch) and the `case.md` cleanup inputs; supply the post-URL `ls-remote` SHA, tree HEAD and local tip for the successful deletion and for one differing-SHA retention; cover `origin/<branch> is missing`, a branch that advances during cleanup (kept, reported as moved), a guarded branch-deleting wrapper that runs and an unguarded one that is refused
- Coordinated draft-PR cleanup: per-leg order, keep-and-report for differing remote and host-owned, read-back reports for remove-success/prune-failure and a wrapper that fails after deleting the branch, a failed companion lookup reported without a path, remaining legs still cleaned - `brainstorming/spec-pr-publish-legs`: replace the `success` fact on preserving local branches and the `cleanup` fact (refuse every branch-deleting wrapper, preserve every branch) and the `case.md` checkpoint H inputs; supply the post-URL remote SHA, tree HEAD and local tip observations per leg
- Continuation with a no-`home:` block provisions without a drift stop when the discovered-script template matches, reusing the one tree git lists on the branch; a recorded `home:` against a current rule with none stops `resolved absent`; missing remote offers the push only when the file-scoped log prints a commit, for both no local branch and a branch without the leg-file commit - `brainstorming/spec-pr-regate-legs` (replace the `missing-remote` fact)
- Companion mode for a no-`home:` block: a tree git lists on the branch is the selected tree with no another-path stop, no tree runs the script's existing-branch form, and a script that cannot check out an existing branch stops naming the repo with no built-in tree; the missing remote stop is conditional on the leg-file commit - `using-git-worktrees/pr-head-caller-root` (replace the `missing` fact)
- Cleanup of a block with `destroy:` and no `home:` runs the command on the located tree with the folder name, reads back the tree before continuing to the existing branch deletion, and reports a non-zero exit by the state read back; a failed lookup runs nothing; a block with neither is host-owned - new sample `finishing-a-development-branch/legs-script-placed-cleanup`
- Finish `SKILL.md` stays under 500 lines - none: existing assertion in `scripts/finish-verification.test.mjs`
- Plan paths for a companion resolve in the tree git lists - new sample `writing-plans/leg-checkout-by-branch`, and `scripts/wave-review.test.mjs` (replace the `home:` and `NAME` token assertions on `plan-contract.md` with the branch-location citation)
- Resume looks up a `missing` companion by branch; a found tree becomes the companion worktree for the remaining admission checks; its stop names repo, branch and the empty lookup; a brief's explicit path keeps its validation - `gauntlet-resume/legs-missing` (replace the `stop` fact on recorded home and shared NAME), and `scripts/brief-contract-lint.test.mjs`
- A spec recording a non-matching `home:`: cleanup unchanged - none: existing samples `no-section-sibling-host-owned` and `home-match-destroy-recovered-name` already cover the `home:` rows, which this spec does not edit

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` "Multi-repo runs" - communication contract and recovery step: where a leg's tree is found, that the draft-PR option deletes local branches once the remote holds the same commit, the recovery this drops, and that it now supersedes part of the spec-only draft-PR design; `README.md` workflow step 1, the option-6 sentence "The branch stays; a gauntlet-owned worktree is removed, a host-owned checkout is reported and left" - same contract: the local branch is deleted once the remote is confirmed at the same commit, for one-member and coordinated runs alike; `CHANGELOG.md` `## Unreleased` - procedure change
- Derived / memory docs invalidated: none

The materiality bar is `reference/documentation-impact.md`.

## Out of scope

- Creating no worktree before the gate: the spec is committed in its tree before row 6 is offered.
- Removing `create:`/`destroy:` from the spec and rereading each repo's rules at every use (approach 3); the recorded block stays the authority.
- Recording the folder a script chose (approach 2).
- Locating a jj workspace whose git HEAD stays detached; such a tree is not admitted as a coordinated member today.
- `gatekeep-pr` cleanup, which reads the overrides file, not a recorded leg block.
- Rewriting `home:` lines in already-approved specs automatically; they pass the checks unchanged, and the remedy for a script-placed leg is the user-approved amendment under Design "Recorded leg block".
- Restoring a remote branch deleted after the handoff from a deleted local branch.

## Open questions

None. The user reaffirmed that spec approval includes the evals; Design "Actions" records their fourteen-call bound.
