# Option 6 on a coordinated spec: one home draft PR, every companion branch pushed, re-gate re-provisions the legs

**Goal:** Make the User Review Gate's option 6 work for a spec with N>1 `## Legs` by pushing every companion branch and opening exactly one draft PR on home, let `brainstorming #N` on that PR recreate every companion worktree from `origin/<branch>` on any machine, and let the header-linked finish ship the run as N ready PRs - without changing how a list of N open PRs is admitted or reworked.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** waves

## Problem

Framing: pivoted to one home draft PR as the sole handle with every companion branch pushed at 6 - N draft PRs carrying one spec are noise; the home PR already says the run is coordinated; the home repo is never ambiguous because it is the PR's repo.

Option 6 (`skills/brainstorming/reference/spec-pr.md`, "Publish option 6") and coordinated runs (`skills/brainstorming/reference/legs.md`, `skills/finishing-a-development-branch/reference/legs.md`) landed in separate changes (#96, #99) and neither names the other. On a spec with N>1 `### Leg:` blocks, option 6 today amends the home spec, shape-checks the home diff, pushes the home branch, opens one draft PR, and removes the home worktree. The companion leg files were committed into companion worktrees at spec-writing (`spec-finalization.md`, "After the home commit, write and commit every companion leg file") but nothing pushes them: the companions' commits exist only on the machine that ran the brainstorm, so the handoff is not reconstructible by another person or account, and the gate never withholds row 6 for a coordinated spec.

Re-entry has the same gap from the other side. The marked re-gate (`pr-subject.md`, "Spec-PR classifier", row "Shape and marker pass") provisions only the home PR through `using-git-worktrees/reference/pr-head.md` and skips `brainstorming/SKILL.md` steps 3-11 including Worktree First, so no companion worktree is created. `pr-head.md` derives `ROOT` from the session's git common dir and stops on a branch checked out elsewhere; it has no clause for a caller-supplied `$ROOT`, which `using-git-worktrees/SKILL.md` Step 0 already accepts for coordinated members. Approval at the re-gate then writes `**Engine:**`/`**PR:**` into a spec whose `## Legs` names companions that have no live worktree; `writing-plans` resolves companion roots from the recorded `home:` pattern and stops on a missing tree.

At finish, the header-linked `**PR:**` route (`finishing-a-development-branch/reference/spec-pr.md`) runs its five-row menu on `$WORKTREE` alone, while coordinated delivery (`finishing-a-development-branch/reference/legs.md`) fans one ship choice out to companions first and home last, creating a PR per companion when no valid receipt exists. The two do not reference each other.

Premises verified in the loaded skills: the publish recipe is single-worktree (supported); finishing's `legs.md` already creates companion PRs and writes receipts per repo (supported); `pr-subject.md` admission rejects foreign-repo refs and routes N>1 refs to rework, and the marked route is reached only when N=1, shape passes, and `**Engine:** deferred` is in the header (supported); pr-head's provisioning rows - branch checked out elsewhere -> stop; selected home already on the branch -> ff-only reuse; no worktree + local branch -> ancestry proof then `update-ref` then add; no worktree + no local branch -> `git worktree add <home> <branch>` DWIM-tracking `origin/<branch>` - exist today, never use `-b`, and fall back to the built-in with `create: override skipped (contains -b)` when a `create:` wrapper carries `-b` (supported); `using-git-worktrees/SKILL.md` Step 0 routes only callers passing PR values to pr-head, so a companion caller without PR values needs a routing clause there (supported). Corrected: an earlier reading said companion worktrees are "left on disk" after 6; the defect is that their commits are never pushed. Unverified and resolved by design rather than lookup: whether the header-linked finish and coordinated delivery compose - this spec states the composition explicitly.

User decisions recorded during the questionary: one home draft PR is the sole handle (framing pivot B); the rework route for N open PRs stays byte-identical in behavior; the finish menu for this handle delivers N normal PRs (home readied, companions created); companions are provisioned at the re-gate through the same per-member `using-git-worktrees` invocation as a fresh run, taking pr-head's existing-branch rows because `origin/<branch>` already exists; the local branch may be absent on home and on every companion, so the no-local-branch DWIM row is the common case; approach 1 (extend the four references in place) over a dedicated companion reference; round 2 option A (reference, do not banner-supersede, the 2026-10-28 draft-PR spec).

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] On a spec whose `## Legs` has two or more blocks, a bare `6` reply at the User Review Gate pushes each companion's shared branch to its origin in declared order, then pushes home and opens exactly one draft PR on home; the message prints the companion branches pushed (`<repo> origin/<branch>`) and the single PR URL, and no companion PR is created.
  in-scope
- [ ] Before any push on 6, every member's diff against its own `origin/<default>` (each companion's leg file under its recorded `spec-dir:`, then home) is checked with the shared spec-only shape predicate in one preflight pass; a member that fails, home included, prints its name-status lines and redraws the gate with `Withheld: draft PR - <repo> diff against origin/<default> is not spec-only (<paths>)` in row 6's place with implementation approvals still offered, and no branch in any member has been pushed - including when the failing member is the last one checked.
  in-scope
- [ ] On 6 a companion whose branch has never been published (`git ls-remote --exit-code --heads origin <branch>` exits 2) is pushed; a companion push rejection prints the git output, names the companion, retains every checkout, and re-presents the gate with 6 retryable; on retry a companion whose `origin/<branch>` equals its HEAD is skipped with `already published`, and a companion whose `origin/<branch>` exists at a different commit stops printing both full SHAs and the already-published members, retains every checkout, and re-presents the gate with 6 retryable after the user resolves it by hand.
  in-scope
- [ ] After a successful 6 on a coordinated spec, every member's worktree is removed under its own recorded `contract:` ownership test with its branch preserved; a host-owned or failed removal is reported per member with path and command output and the remaining members still get their cleanup attempt.
  in-scope
- [ ] A spec with exactly one `## Legs` block behaves on 6 exactly as before this change: one shape check, one push, one draft PR, one cleanup, no companion lines in the message.
  in-scope
- [ ] `brainstorming #N` on a marked spec PR whose carried spec has N>1 `## Legs` blocks, run on a machine where no local `<branch>` exists in home or in any companion, provisions a worktree per companion at that repo's `home:` pattern checked out on `<branch>` tracking `origin/<branch>`, merge-syncs each with its `origin/<default>`, and renders the gate with options 1/2/4/5 (3 when the pinned audit exists) and `Withheld: draft PR - #N already exists`; the gate message lists every `Worktree ready at <path>` line, home first.
  in-scope
- [ ] At that re-gate every companion's `origin/<branch>` is required in a preflight that runs before any companion worktree is created or synced; a companion whose `origin/<branch>` is absent - including the last of three or more legs - stops with `origin/<branch> is missing in <repo>; on the machine that ran option 6, push <branch> from that companion's checkout, then rerun brainstorming #N` with no companion worktree created, the home worktree preserved; a `### Leg:` repo that matches no `- sibling:` declaration in the home overrides file read at `BASE_SHA` stops with `leg <repo> matches no sibling declaration in <overrides path>`; and a companion whose freshly resolved `home:` or `create:` differs from the block's recorded `contract:` line stops naming the repo, the recorded line, and the resolved value.
  in-scope
- [ ] At that re-gate a companion whose `<branch>` is already checked out at another path, whose local `<branch>` carries commits beyond `origin/<branch>` other than validated base-sync merges, or whose base merge is unresolved stops with pr-head's existing text for that case with the companion repo named; companions already provisioned in the same run are listed under `Preserved created legs:` and never removed; a rerun after such a stop, or after a by-hand base merge, admits a home or companion `<branch>` that is ahead of `origin/<branch>` only by merge commits whose second parent is on `origin/<default>`, reuses that tip without reset, and reports `Base sync recovered: <sha7>`.
  in-scope
- [ ] `brainstorming #N` on a marked spec PR with one `## Legs` block or no `## Legs`, and `brainstorming #12 #13` on two open PRs, behave exactly as before this change: the single-member re-gate provisions home only, and the two-PR list takes relatedness, rework provisioning, and `## Rework record` with no companion re-settle.
  in-scope
- [ ] Finishing a worktree whose spec header carries `**PR:**`, no `## Rework record`, and `## Legs` with N>1 blocks verifies every leg in its own worktree, delivers companions first and home last on rows 1 and 2, and seals home exactly once with one `--leg <repo>=<pr-url>` per companion after the companions are delivered: row 1 creates a ready PR per companion lacking a valid receipt and readies a receipt-proven companion that is still a draft, then seals, pushes home to `headRefName`, and runs `gh pr ready <N>`; row 2 creates draft companion PRs, leaves an already-ready companion as is, then seals, pushes home, and leaves it draft; the shipped summary lists `Shipped: <repo> pr <url>` per member with home last, and `gh pr ready` runs only after every companion is delivered.
  in-scope
- [ ] Finishing a worktree whose spec header carries `**PR:**` and `## Rework record` (an N-PR rework), or `**PR:**` with one `## Legs` block, behaves exactly as before this change.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: coordinated-draft-pr
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test (scripts/ci.mjs: skill lint, eval structural lint, model-literal lint, instruction-size lint); node eval/run.mjs <target> for brainstorming, using-git-worktrees, finishing-a-development-branch after their SKILL.md or reference edits
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: README.md
Rules: CHANGELOG.md
Rules: .pi/gauntlet-overrides.md
Rules: doc/configuration.md
Rules: doc/personas.md
Rules: doc/install-internals.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: eval/README.md
Rules: .agents/skills/release/SKILL.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: AC 1, AC 2, AC 3, AC 4, AC 5, AC 6, AC 7, AC 8, AC 9, AC 10, AC 11
design: owns skills/brainstorming/reference/spec-pr.md, skills/brainstorming/reference/pr-subject.md, skills/using-git-worktrees/SKILL.md (Step 0 routing clause only), skills/using-git-worktrees/reference/pr-head.md, skills/finishing-a-development-branch/reference/spec-pr.md, README.md, CHANGELOG.md, and the eval samples named in Tests; observable outcomes are the eleven acceptance rows above.

## Design

Four existing references change in place, plus one routing clause in `skills/using-git-worktrees/SKILL.md` Step 0 so a companion caller can reach pr-head without PR values. No new file, no new spec field, no new settings key, no new persona. The run's reconstructible identity is `## Legs` (one `repo` per block, one shared `branch`) plus `origin/<branch>` in every member; the home draft PR is the single handle.

### Publish option 6 on a coordinated spec (`skills/brainstorming/reference/spec-pr.md`, "Publish option 6")

Add: a member loop around the existing recipe, split into a preflight pass that pushes nothing and a publication pass. On clean `6`, amend the home spec header as today (`**Amend-grant:** none`, `**Engine:** deferred`) in the home worktree only; companion leg files are not amended because the marker is read from the home spec. Read the member list from the committed home spec's `## Legs` in `legs.md` order; the live worktree paths come from the Worktree First results carried in working state.

Preflight, every member before any push, companions in declared order then home:

- Per companion: `DEFAULT=$(gh repo view <companion owner/name> --json defaultBranchRef -q .defaultBranchRef.name)` (positional repository; `repo view` takes no `-R`), require a nonempty name; `git -C <companion worktree> fetch origin "$DEFAULT"`; `git -C <companion worktree> diff --name-status origin/$DEFAULT...HEAD`; the shared shape predicate against that output with the companion's own directories: exactly one `A` at `<spec-dir>/<home spec filename>` where `<spec-dir>` is that block's recorded `spec-dir:` line, plus banner-only `M`s under the spec dirs resolved from that companion's `.pi/settings.json` read by file with the existing preset rules (default `doc/specs`, `docs/specs`) - never session `gauntlet_setting`, which is home-scoped. Then discover the companion's remote head with `git -C <companion worktree> ls-remote --exit-code --heads origin <branch>`: exit 0 prints the remote SHA (present), exit 2 is confirmed absence, any other exit is a command failure; never read a possibly stale `origin/<branch>` remote-tracking ref for this decision. For a present head run `git -C <companion worktree> fetch origin <branch>` and compare the fetched `origin/<branch>` with HEAD.
- Home last: the existing default resolution, fetch, and shape check.

Add: the per-member shape failure row, home included - print the offending name-status lines and `origin/$DEFAULT` for that member, retain every amended spec and checkout, redraw the gate with `Withheld: draft PR - <repo> diff against origin/<default> is not spec-only (<paths>)` replacing 6, and keep implementation approvals available as today. A `gh repo view`, `fetch`, or `ls-remote` command failure in preflight stops naming the member and the command output. Because preflight completes for every member before the first push, nothing has been pushed when either fires, whichever member fails.

Publication pass, companions first in declared order, home last. Per companion, from its preflight remote-head result: absent -> `git -C <companion worktree> push -u origin <branch>`; present and equal to HEAD -> skip with `already published`; present at another commit -> stop printing both full SHAs and the members already published in this pass, never force, never reconcile; retain every checkout and re-present the gate with 6 retryable once the user has resolved the mismatch by hand. Home last: the existing push, `gh pr create --draft`, URL, `phase_tracker complete`. A rejected companion push prints git output, names the member, retains all checkouts, re-presents with 6 retryable; the retry re-runs both passes, so already-published companions are skipped by the equality row. A home push or create failure keeps today's rows; published companions stay published and are listed in the message. The nothing-pushed guarantee covers preflight only; a failure during the publication pass retains and reports the earlier successful pushes.

Add: the message after a successful create prints one `pushed: <repo> origin/<branch>` line per companion before the PR URL.

Add: cleanup loops members home-last, applying finishing Step 6's ownership test to each member's recorded `contract:` lines (`home:` match -> built-in remove/prune or `destroy:`, branch preserved; no match -> host-owned, report path). A failed or host-owned removal is reported per member with path and command output and does not stop the other members' cleanup. The existing branch-deletion prohibition applies per member.

A single-member spec (exactly one block) takes every existing step verbatim: the loop has one member, no `pushed:` line, no per-member prefixes.

### Re-gate re-settles companions (`skills/brainstorming/reference/pr-subject.md`, "Spec-PR classifier", row "Shape and marker pass"; `skills/brainstorming/reference/spec-pr.md`, "Re-gate a marked spec PR")

Admission and classification are unchanged: `brainstorming #N` resolves one open PR in this checkout, shape passes, marker present. The classifier reads the carried spec's `## Legs` block count from the same `git show <headRefOid>:<spec path>` it reads the marker from. Absent `## Legs` (a marked PR from before #99) or exactly one block -> single-member: home provisions through pr-head with `SYNC=merge` and everything continues as today. N>1 -> home provisions through pr-head with `SYNC=merge` plus the coordinated base-sync recovery below, then, after home's Step 4 report and before the gate render, three phases:

1. Settle: re-settle companions per `legs.md`'s "Settle membership" using the home overrides file read at `BASE_SHA` (`git show <BASE_SHA>:<overrides path>`, first-found ladder), matching each `### Leg:` repo identifier against `- sibling:` declarations and resolving `PATH` = `<home primary parent>/<NAME>`; validate every companion (`PATH` exists, is a checkout, origin identity matches, not equal to home).
2. Preflight, every companion before any companion worktree or branch is created or synced: `git -C <PATH> fetch origin` (a remote-tracking ref update is permitted here; `worktree add`, `update-ref` on `refs/heads/*`, and merges are not); require `origin/<branch>` to exist, else the missing-remote stop; resolve that repo's current `home:` and `create:` as `using-git-worktrees` Step 1a does (its own overrides file and `.pi/settings.json` read by file) and compare them with the block's recorded `contract:` lines; on any difference stop with `contract drift for <repo>: recorded <key>: <recorded value>, resolved <current value>; amend the recorded contract or restore the repo convention, then rerun brainstorming #N`. Never provision at either value silently: the recorded contract is amended through `legs.md`'s existing amendment rule (home block and the affected companion file rewritten and committed together), so one reconciled contract drives provisioning here, planning's root resolution, and finish cleanup.
3. Provision, per companion in block order: invoke `/skill:using-git-worktrees` with explicit `$ROOT` = companion primary, `$BRANCH` = the shared branch, and the companion caller mode below; carry each `Worktree ready at <path>` line; print them home first in the gate message. Companions get no `refs/gauntlet/pre-rework/*` ref, no PR fields, no thread fetch, no `MEMBER_HEADS` entry. pr-head's own `origin/<branch>` check stays as a race backstop; when it fires after preflight passed, it lists `Preserved created legs:`.

Coordinated base-sync recovery (N>1 only; the single-member path keeps pr-head's checks verbatim): a rerun after a later-leg stop, or after the user merged the base by hand, finds home's or a companion's local `<branch>` ahead of `origin/<branch>` by its base merge, which pr-head's ancestry and carries-commits-beyond stops would reject. Before those stops, when `origin/<branch>` is an ancestor of the local `refs/heads/<branch>` tip, walk `git -C "$ROOT" log --first-parent --format='%H %P' origin/<branch>..refs/heads/<branch>`; admit the tip only when the walk is nonempty, every entry is a two-parent merge, and every second parent satisfies `git -C "$ROOT" merge-base --is-ancestor <second parent> origin/<baseRefName>`; require a clean existing worktree. Then reuse that tip without reset, `update-ref`, or `-b` (the existing-worktree row, or `git -C "$ROOT" worktree add "<home>" <branch>` when no tree exists), run the merge sync as usual (it records `merge: no-op` when the base is already contained), and add `Base sync recovered: <sha7>` to that member's read-back. Any other commit beyond `origin/<branch>` takes pr-head's existing stop naming the repo; local commits are never reset or discarded.

Stops, all before any companion worktree is created unless marked as a provisioning stop: a `### Leg:` repo matching no declaration -> `leg <repo> matches no sibling declaration in <overrides path>`; an invalid declaration -> `legs.md`'s existing stop text; a companion whose `origin/<branch>` is absent after `fetch origin` -> `origin/<branch> is missing in <repo>; on the machine that ran option 6, push <branch> from that companion's checkout, then rerun brainstorming #N`; contract drift -> the drift stop above; (provisioning stop) an unresolved companion merge -> `base merge unresolved for <repo> (<files>) - merge origin/<base> by hand in <worktree> and rerun brainstorming #N`. Every provisioning stop lists `Preserved created legs:` per `using-git-worktrees` Step 4 and never removes a tree; a rerun reuses a tree already on `<branch>` through pr-head's existing-worktree row and the recovery above.

Missing-remote recovery is a user procedure on the originating machine, not a flow route: option 6 is withheld at the re-gate and a fresh machine has no companion checkout to push from. The stop text names the only recovery: on the machine that ran option 6, in that companion's checkout (the worktree if cleanup left it, else the primary's local `<branch>`), verify `git log -1 --format=%H refs/heads/<branch> -- <spec-dir>/<home spec filename>` shows the leg-file commit (the primary may sit on its default branch, so the log names the retained branch and checks nothing out), `git push -u origin <branch>`, then rerun `brainstorming #N`. When that commit no longer exists on any machine, the published handle is incomplete and continuation stops; this spec adds no companion-artifact regeneration and no second handoff route.

The gate renders as today. Approval 1/2/4/5 persists `**Engine:**`, `**Amend-grant:**`, and `**PR:**` on home only as a new commit; companion leg files are untouched by approval. A change request at this re-gate takes today's revise-and-commit row on home and, when the revision touches Problem, shared Design, Errors and edge cases, Out of scope, a clause binding a companion, or a `### Leg:` block, rewrites and commits the affected companion files in their live worktrees per `legs.md` before the summarizer re-dispatch; the amendment is not complete while a carried part disagrees. Planning and both engines read live companion worktrees through `## Legs` as they already do.

### Companion caller mode (`skills/using-git-worktrees/SKILL.md` Step 0; `skills/using-git-worktrees/reference/pr-head.md`)

Add to `using-git-worktrees/SKILL.md` Step 0, beside the existing PR-values routing sentence: a caller passing `$ROOT`, `$BRANCH`, and the marker `REMOTE_BRANCH=existing` (a coordinated companion whose `origin/<branch>` already exists) reads pr-head.md and follows its companion mode instead of Steps 0, 1, and 1a; Step 1's `show-ref` branch-collision preflight and Step 1a's `-b` creation never run for that caller. Every other caller keeps today's routing, so a fresh coordinated run still creates companion branches with `-b`.

Add to pr-head.md a companion mode, branched before every step that reads PR fields: there is no PR array, `headRefOid`, `MEMBER_HEADS`, or `PRE_REWORK_HEAD`. Use `$ROOT` as `ROOT`, derive nothing from the session's git common dir, and apply Step 0's submodule guard against `$ROOT`. The branch is `$BRANCH`; run `git -C "$ROOT" fetch origin`; require `origin/<branch>` to exist, else the missing-remote stop; `ORIGINAL_HEAD=$(git -C "$ROOT" rev-parse origin/<branch>)` stands in for `headRefOid` in every check; `baseRefName` is `gh repo view <owner/name> --json defaultBranchRef -q .defaultBranchRef.name` (positional repository, nonempty required) and `BASE_SHA=$(git -C "$ROOT" rev-parse origin/<baseRefName>)`. Resolve `home:` and `create:` as Step 1a does from that repo's own overrides file and `.pi/settings.json` read by file (the re-gate preflight has already proven they equal the recorded contract). Skip the cross-repository and PR-head-unreachable stops and the thread fetch; keep the checked-out-elsewhere stop against `<branch>` and, after the coordinated base-sync recovery above, the ancestry stop against `origin/<branch>`. Apply the existing provisioning rows in their existing order: selected home already on `<branch>` -> Step 3's dirty-tree ask, `git -C "$WORKTREE" merge --ff-only origin/<branch>`, HEAD must equal `ORIGINAL_HEAD` or the recovered tip; no worktree + local branch -> ancestry proof, `update-ref`, then add; no worktree + no local branch -> `git -C "$ROOT" worktree add "<home>" <branch>` with DWIM tracking; never `-b`. Keep pr-head's `create:` rule verbatim on this path: run the wrapper only when its template takes `<branch>` as an existing branch with neither `-b` nor `-B`; otherwise run the built-in DWIM checkout and add `create: override skipped (contains -b)` to the report, so a repo whose `create:` spells the default `-b` form (this spec's own `contract:` does) is still re-provisioned. Require post-create HEAD equal to `ORIGINAL_HEAD` or the recovered tip; on a race leave the tree and stop naming its path and both SHAs. Then run the merge sync against `origin/<baseRefName>` through the existing "Merge the fetched base" recipe: a clean merge records `merge: <sha7>`; conflicts dispatch the existing fresh foreground implementer helper with `cwd` the companion worktree and SCOPED_TEST_COMMANDS read from that companion's own overrides file at its own `BASE_SHA` (`git -C "$ROOT" show <BASE_SHA>:<overrides path>`); a failed helper aborts and records `merge: unresolved - <files>`, which the re-gate turns into the by-hand stop naming the repo. Validate with `git -C "$WORKTREE" merge-base --is-ancestor <ORIGINAL_HEAD> HEAD`. Emit Step 4's coordinated-member read-back (`worktree list --porcelain` shows the path, `branch --show-current` equals `$BRANCH`, then `Worktree ready at <path>`), not the `PR:`/`Pre-rework head:` report. Skip pre-rework refs and every stop text that cites a PR number.

Remove: nothing. The home path reads exactly as before.

### Finish composes the header-linked menu with coordinated delivery (`skills/finishing-a-development-branch/reference/spec-pr.md`)

Add, in the header-linked route: when `## Legs` has N>1 blocks, rows 1 and 2 compose `finishing-a-development-branch/reference/legs.md`'s coordinated delivery with the header-linked home push in this order; the standalone header-linked recipe (home-only full verification, seal before push) does not run on this route.

1. Verification and closure take `legs.md` "Verification and closure - Steps 1 and 3.5": every leg's recorded verification set with its own worktree as cwd, per-leg conformance against its Rules and owned AC rows, receipt-proven exemptions; this replaces the header-linked home-only verification rather than adding to it.
2. Companions first in block order per `legs.md` "Execute one choice" steps 1-2: validate receipts, push `origin <branch>`, `gh pr create` in that worktree (`--draft` on row 2), write the receipt; no companion plan strip or seal. On this route reconcile live draft status with the chosen row even for a valid receipt: query `gh pr view <url> --json state,headRefOid,isDraft`; row 1 runs `gh pr ready <url>` on a companion that is still a draft before home delivery and refreshes the receipt; row 2 leaves an already-ready companion as is and never converts ready to draft.
3. Home strip-and-seal exactly once, after every companion result (including validated skips) is collected: `--option pr --base origin/<baseRefName>` with the selected spec and one `--leg <repo>=<pr-url>` per companion. A seal failure stops with `Not shipped: <home repo> <bin output>`, home unpushed, receipts retained; never seal partial results, never run a second seal.
4. The existing non-force home push `git -C "$WORKTREE" push --no-follow-tags origin HEAD:refs/heads/<headRefName>`, then on row 1 only `gh pr ready <N> -R <owner/repo>`.

Rows 3-5 keep their coordinated semantics unchanged. The home PR body is preserved as today; `legs.md`'s "home body lists companion URLs" rule does not apply on this route. The consequence for reviewers is stated, not fixed: the home PR, the sole handle, names no companion PR; the companion URLs appear only in the shipped summary (`Shipped: <repo> pr <url>` per member, home last), which the user keeps for cross-repo review because receipts are removed after home delivery, while each companion PR body still carries its `Home:` line back to home. No PR-body mutation is added for this. The existing stops stay: `**Engine:** deferred` -> `spec approved for handoff only - run brainstorming #N`; home PR not OPEN -> `PR #N is <state>; the branch cannot be pushed to it.`; a companion receipt whose PR is closed -> `legs.md`'s disposition stop; a companion `gh pr create` or `gh pr ready` failure (including a duplicate PR opened by hand) -> `legs.md`'s `Not shipped: <repo> <reason>` with home not pushed.

Precedence is unchanged: `## Rework record` present -> the rework route, never this one; `**PR:**` with one `## Legs` block, or a legacy spec without `## Legs` -> today's five-row single-worktree path.

### Documentation

Amend `README.md`: in workflow step 1 (the paragraph describing option 6), add that on a coordinated spec it pushes every companion branch and opens one draft PR on home, and that `brainstorming #N` re-provisions companions from origin; in workflow step 5 (the finish), add that the header-linked rows deliver companions first and seal home once with every companion PR. Under `### Multi-repo runs`, extend the sentence `Handoff carries every member in the brief's \`legs:\` block.` so it also covers the draft-PR handle (one home draft PR, companion branches on origin, no brief). `CHANGELOG.md` gets its `## Unreleased` entry in this change, because the release skill promotes notes that already sit under `## Unreleased` and does not write them.

## Errors and edge cases

Publish (6):
- Shape failure in any member, home included, even the last one checked: per-member withheld line, implementation approvals still offered, nothing pushed (preflight completes for every member before the first push).
- Companion branch never published (`ls-remote --exit-code --heads` exits 2): pushed in the publication pass; a fetch of that branch is never attempted, so its absence is not a fetch failure.
- Companion push rejected: git output, member named, all checkouts retained, 6 retryable; retry skips companions whose `origin/<branch>` == HEAD.
- Companion `origin/<branch>` already exists at another commit: stop printing both full SHAs and the already-published members; never force, never push over foreign history; checkouts retained; gate re-presented with 6 retryable after by-hand resolution.
- Home push or create failure: today's rows; companions already published stay published and are listed.
- Cleanup failure in one member: reported with path and output; other members still cleaned; branches preserved everywhere.
- `gh repo view`, `fetch`, or `ls-remote` command failure for a member in preflight: stop naming the member and the command output; nothing pushed. The same failure during the publication pass retains and reports earlier pushes.

Re-gate:
- No `## Legs`: single-member path, home only, as today.
- `## Legs` unparseable (missing `repo`, `branch`, or `contract:` lines): stop naming the block; home preserved.
- `### Leg:` repo with no matching `- sibling:` declaration at `BASE_SHA`: `leg <repo> matches no sibling declaration in <overrides path>`.
- Companion `PATH` missing, not a checkout, wrong origin identity, or equal to home: `legs.md`'s existing stop text.
- Companion `origin/<branch>` absent, in any position including the last of three or more legs: the missing-remote stop from preflight, no companion worktree created; recovery is the originating-machine push procedure, and an unrecoverable companion commit means the handle is incomplete and continuation stops.
- Companion `home:` or `create:` resolved today differs from the recorded `contract:` line: the contract-drift stop before any companion write; one reconciled contract after the amendment.
- Companion `<branch>` checked out elsewhere, or local `<branch>` carrying commits beyond `origin/<branch>` that are not validated base-sync merges: pr-head's existing stops naming the companion repo; never reset.
- Home or companion `<branch>` ahead of `origin/<branch>` only by base-sync merge commits (earlier partial run, or a by-hand merge after the unresolved stop): recovered, `Base sync recovered: <sha7>`, no reset.
- Companion merge unresolved after the helper: the by-hand stop naming the companion.
- Any stop after some companions are provisioned: `Preserved created legs:` listed, nothing removed; a rerun reuses trees already on `<branch>`.
- Companion `create:` wrapper containing `-b`/`-B`: pr-head's existing fallback - built-in DWIM checkout plus `create: override skipped (contains -b)` in the report; never a stop.
- Change request at the re-gate touching shared or companion-binding content: affected companion files rewritten and committed in their live worktrees before re-presenting; approval alone commits home only.

Finish:
- Companion receipt with a closed PR: `legs.md`'s disposition stop.
- Companion receipt valid but PR still a draft on row 1 (a partial row-2 run retried as row 1): `gh pr ready` on that companion before home delivery; row 2 on an already-ready companion changes nothing.
- Companion `gh pr create` or `gh pr ready` failure (duplicate opened by hand, auth, network): `Not shipped: <repo> <reason>`, home not pushed, receipts retained for the delivered companions.
- Home seal failure after companions delivered: `Not shipped: <home repo> <bin output>`, home not pushed, companions stay shipped, receipts retained; no second seal.
- Home `gh pr ready` failure after push: today's header-linked failure row; companions stay shipped and the summary says so.
- Legacy header-linked spec without `## Legs`: today's path unchanged.

Rework-route guard: `pr-subject.md` admission is untouched. N open PRs stay rework; foreign-repo refs stay rejected; the companion re-settle runs only after shape and marker both pass, so a rework subject never reaches it.

## Tests

- 6 on a two-leg spec whose companion branch has no remote yet (`ls-remote --exit-code` exits 2) pushes the companion first, home last, opens one draft PR, prints one `pushed:` line, removes both worktrees - `eval/brainstorming/samples/spec-pr-publish-legs/case.md`
- 6 with a companion whose diff is not spec-only redraws with the per-member withheld line and pushes nothing - same sample, second branch
- 6 on a three-leg spec where the last member checked (home) fails shape redraws with the home withheld line, keeps 1/2/4/5, and has pushed no companion - same sample, third branch
- 6 retry after a companion push rejection skips the published companion and pushes the rest - same sample, fourth branch
- 6 with a companion `origin/<branch>` at a foreign commit stops with both SHAs and the already-published list, retains checkouts, re-presents with 6 - same sample, fifth branch
- 6 on a single-member spec is unchanged (no `pushed:` line, one push) - existing `eval/spec-gate/samples/option-6-handoff`, must-hold fact added
- `brainstorming #N` on a two-leg marked PR with no local branches anywhere provisions both worktrees through the DWIM row, merge-syncs each, renders the gate with both `Worktree ready at` lines home first - `eval/brainstorming/samples/spec-pr-regate-legs/case.md`
- re-gate on a three-leg marked PR whose last companion is missing `origin/<branch>` stops with the missing-remote text from preflight with no companion worktree created, home preserved - same sample, second branch
- re-gate with a leg matching no sibling declaration stops with the no-declaration text before any companion write - same sample, third branch
- re-gate where a companion's current `home:` differs from the recorded `contract:` stops with the contract-drift text before any companion write - same sample, fourth branch
- re-gate rerun after a non-no-op home base merge and a later-leg stop recovers home's tip (`Base sync recovered:`), and the same after a by-hand companion merge following the unresolved stop; a companion with an unrelated local commit still takes pr-head's stop - same sample, fifth branch
- re-gate change request touching shared Design rewrites and commits the companion file in its live worktree before re-presenting; plain approval commits home only - same sample, sixth branch
- re-gate on a single-member marked PR, and on a marked PR without `## Legs`, unchanged - existing `eval/brainstorming/samples/spec-pr-regate`, must-hold facts added
- `brainstorming #12 #13` on two open PRs takes rework with no companion re-settle - existing `eval/brainstorming/samples/pr-list-per-pr-attribution`, must-hold fact added
- using-git-worktrees with caller `$ROOT`, `$BRANCH`, `REMOTE_BRANCH=existing`, no local branch routes through Step 0 to pr-head's companion mode, takes the DWIM row, never `-b`, emits the coordinated read-back and no `PR:` line; with a local branch behind origin takes the ancestry + `update-ref` row; with a tree already on `<branch>` takes the ff-only reuse row; with `create: helper create -b <branch> <name>` runs the built-in and reports `create: override skipped (contains -b)` - `eval/using-git-worktrees/samples/pr-head-caller-root/case.md` (`bundle+: skills/using-git-worktrees/reference/pr-head.md`; `SKILL.md` is in the target's `skillFiles`, so its Step 0 clause is exercised)
- pr-head home path unchanged - existing `eval/using-git-worktrees/samples/pr-head`, must-hold fact added
- finish row 1 on a header-linked two-leg spec verifies both legs in their own worktrees, creates the companion PR, seals home once with `--leg <repo>=<pr-url>`, pushes home, runs `gh pr ready` last - `eval/finishing-a-development-branch/samples/spec-pr-menu-legs/case.md`
- finish row 2 leaves every PR draft and runs no `gh pr ready` - same sample, second branch
- finish row 1 after a partial row 2 (companion draft receipt valid, home undelivered) readies the companion draft before home delivery; row 2 after a row-1 companion leaves it ready - same sample, third branch
- finish with a home seal failure after the companion PR exists leaves home unpushed and the receipt retained - same sample, fourth branch
- finish on a header-linked spec with a `## Rework record` is unchanged - existing `eval/finishing-a-development-branch/samples/pr-subject-push`, must-hold fact added
- finish on a header-linked single-leg spec is unchanged - existing `eval/finishing-a-development-branch/samples/spec-pr-menu`, must-hold fact added
- every new sample passes eval structural lint - none: `scripts/ci.mjs` runs it under `npm test`

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` - workflow step 1 (option 6) and step 5 (finish) (major procedures: the coordinated handoff and ship procedure a teammate needs to pick up the PR without reading the skill); `CHANGELOG.md` - `## Unreleased` entry in this change
- Derived / memory docs invalidated: `README.md` `### Multi-repo runs` handoff sentence (`Handoff carries every member in the brief's \`legs:\` block.` now also covers the draft-PR handle); `doc/specs/2026-10-28-spec-only-draft-pr.md` Out of scope row "PR lists (N>1) containing a spec PR" - that row stays true (lists still take rework); this spec extends the single-PR handle to coordinated runs and references, not supersedes, that spec

## Out of scope

- One draft PR per companion at option 6; companion PR identity recorded in the spec.
- `brainstorming <companion-owner/repo>#N` as a continuation entry; admission stays home-only and foreign refs stay rejected.
- Changes to `pr-subject.md` admission, relatedness, or the rework route; `## Rework record` semantics.
- `gauntlet-resume` or `gauntlet-handoff` changes; option 6 still produces no brief.
- Receipts written at option 6; publication is not delivery and finish verifies every leg as today.
- Rollback of published companion branches after a home push or create failure.
- Telemetry, settings keys, personas, extensions, bins.

## Open questions

- None.
