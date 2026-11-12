# Legs

Use this reference as the portable membership, leg-block, and companion-file grammar.
Keep tracker and dispatch APIs unchanged.

## Settle membership before Worktree First

Read the home primary's first-found overrides file: `.pi/gauntlet-overrides.md`,
`gauntlet-overrides.md`, `doc/gauntlet-overrides.md`. Treat `## shape-ticket`
`- sibling: <clone url>` declarations as eligibility, not membership. Parse selected values
with shape-ticket's [shared parser](../../shape-ticket/reference/repo-audit.md);
use `PATH` = `<home PRIMARY parent>/<NAME>` as each companion primary.

Match only companions explicitly selected by the ask (repo identifier, `NAME`,
or declared clone URL) or the ticket's repo-group headings. Compare
case-insensitively, trailing `owner/name` of `IDENTITY` before `NAME`. Derive each companion's portable identifier
from the shared parser's trailing `owner/name` of `IDENTITY` for the validated stored origin
read with `git -C <primary> config --get remote.origin.url`. Derive the home's identifier
from `git -C <primary> remote get-url origin`'s `owner/name`, stripping `.git`;
without origin use `repo:` from that member's own first-found overrides
`## Issue tracker` section; without that value use the member's primary directory basename. Use the same identifier
in `### Leg:`, task `Leg:`, and brief `repo:` fields. For an ambiguous basename,
ask once before any creation; never guess. Order members home first, then selected siblings in declared order.
An existing PR alone never activates membership; PR home provisioning still uses
`using-git-worktrees/reference/pr-head.md`.

Match identifiers before any filesystem or git probe; probe only matching siblings,
or remaining declarations when nothing matches. Never probe unselected siblings. With no selected companion,
keep the single-member flow. Validate every selected declaration before creating
any tree: invalid configuration, missing `PATH`, not a checkout, no origin,
unparseable origin, wrong repo, or `PATH` equal to home stops naming the line.
Read origins with `git -C <PATH> config --get remote.origin.url` and compare the
full parsed `IDENTITY`; canonicalize paths before the home comparison. Keep these machine paths in working state and briefs, never in committed blocks.

## Resolve each member

| Field | Contract |
|---|---|
| `repo` | Portable identifier above; preserve one spelling everywhere |
| `primary` | Home checkout at brainstorm start, or selected sibling clone URL parsed to `<home PRIMARY parent>/<NAME>`; machine-local |
| `worktree` | Absolute `Worktree ready` result; machine-local |
| `branch` | One full caller `BRANCH` shared by all members |
| `name` | Shared `NAME`, derived from `BRANCH` by replacing `/` with `-` |
| `Rules:` | Repo-relative files from the rules walk below |

Read each primary's first-found overrides using the ladder above. Read its
`.pi/settings.json` by file and apply the existing preset rules in
`extensions/lib/gauntlet-settings.ts`: repo top-level piGauntlet keys replace
preset keys wholesale; absent keys fall through. Missing configuration uses defaults.
Keep flow policy (council, grants, tracker, response channels, finish choice and
home flow guards) under home `.pi/settings.json#piGauntlet` and home overrides.
Never use `gauntlet_setting` for companions or add a `piGauntlet.*` key.

### Record portable templates

Record only the contract fields authorized by the creator; never record a produced path:

| Creator | Recorded fields |
|---|---|
| Keyed `## using-git-worktrees` contract | Retain `home:`, `create:`, `destroy:`, including the keyed `.worktrees/<name>` default for omitted `home:`. |
| Owned built-in | Retain `.worktrees/<name>` as `home:`, with built-in `create:` and `destroy:`. |
| Native tool or discovered script, tree created by this flow | Record `create:` and `destroy:`; omit `home:`. |
| Tree the session was already inside, no keyed contract | Omit `home:` and `destroy:`; retain host ownership. |

- Create: retain the keyed contract, native tool, discovered wrapper, or owned
  built-in command. Render discovered-script commands from the primary with the
  script's repo-relative path, `<name>` for shared NAME (branch with `/` replaced
  by `-`), and an explicit `<branch>` argument. Use that same NAME at continuation.
  Resolve other wrapper tokens from that leg's touched top-level directory; zero
  or several candidates ask once for that leg. Keep portable values, not machine
  paths, user names, or expanded folders. Require Step 4's branch read-back before
  recording a block; a script unable to take the branch gets no block on mismatch.
- Destroy: for a flow-created or keyed tree prefer the `## cleanup` worktree line,
  then `destroy:`, then owned built-in removal matching `home:`. Render native and
  script commands from the primary with portable tokens and the script's
  repo-relative path; set `<name>` at execution to the located tree's folder
  basename, not shared NAME. Include configured `subagents.worktreeTeardownHook`
  with pi-cohort's existing semantics. Never bypass a wrapper with `git worktree
  remove`; keep unmatched homes host-owned.
- Directories: resolve `flowGuards.specDirs` with the existing default
  `doc/specs`, `docs/specs`; derive plan directories with `planDirsFor`.
  Never read `planDirs` as settings input. Choose the leg's spec directory by the
  existing spec-location convention. Keep plan and ledger home-owned.
- Verification: retain commands from `## verification-before-completion` and
  `## PR gate`, plus merged `piGauntlet.verifyBeforeShip`. Preserve templates
  describing execution against the leg's worktree or primary.

Invoke using-git-worktrees once per member with explicit `$ROOT` = primary and
`$BRANCH` = shared branch; require the affirmative read-back in
[Step 4](../../using-git-worktrees/SKILL.md#step-4--report-location).
Carry every `Worktree ready at <path>` result, home
first. On any failure stop naming repo and branch and list already-created legs;
leave them preserved, never auto-remove them.

## Locate a leg tree

Keep the home leg at the session's home worktree. For a companion, read
`git -C <leg primary> worktree list --porcelain` and select the linked block
carrying `branch refs/heads/<recorded branch>`; exclude the first (primary) block.
Locate by branch regardless of a recorded `home:`; never expand `home:` or shared
NAME into a lookup path or record the returned path in the spec.

Validate the selected path: require it to exist, its checkout toplevel to equal
its realpath, the checkout to differ from the primary, and its canonical
`--git-common-dir` to equal the primary's. Treat a listed block as retained
administration, not proof of a live checkout.

| Result | Action |
|---|---|
| Exactly one matching block, identity passes | Use its `worktree` path for all later admission, plan paths, and provisioning reuse. |
| No matching block | Stop: `cannot resolve worktree for <repo>: no worktree holds <branch>`. Only continuation provisioning may proceed by creating a tree. |
| Several matching blocks | Stop: `cannot resolve worktree for <repo>: <n> worktrees hold <branch>`. |
| Selected path fails identity | Stop: `cannot resolve worktree for <repo>: <path> is not a checkout`. |

For cleanup lookup failures, run no destroy command and delete no branch for
that leg; report the repo, branch and reason without an invented path, then
continue with remaining legs. Apply this rule to plan writing, finishing,
draft-PR cleanup and continuation, and resume's absent companion locations.
Use it also when loop-implementation seed or authorized restore and bare-worktree
gauntlet-resume capture companion paths without a brief `legs:` location.
Keep receipt admission of missing delivered trees unchanged.

## Gather rules

Dispatch one scout per leg with its worktree as `cwd`. Collect root `AGENTS.md`
and `CLAUDE.md` when present; walk root through every touched directory and
collect those filenames on the path. For a touch in `repo-a/pkg-x`, include
`repo-a/pkg-x/AGENTS.md`, not rules from untouched `pkg-y`.
Read every local documentation link in those walked files, including prose,
bullets, and tables, exactly one hop. Resolve targets relative to the linking
file and require them to stay inside the leg. Dedupe files by `realpath` so a
symlinked `CLAUDE.md` counts once. Linked documents contribute no further links.
Emit `Rules: <repo-relative path>` for each file and `Rules: missing: <path>` for
unresolved or outside-leg targets; never invent their contents. Without touched
paths, retain root rules and emit `Rules: root only - paths unresolved`; the
plan-writer's touched-path walk fills the task rules later. Every leg block
carries at least one `Rules:` line; a block with no rules walk result carries
`Rules: root only - paths unresolved`, never an omitted key or a deferral note.

## Home block and companion files

Place `## Legs` after `## Acceptance criteria` and optional `## Rework record`.
Write one block per member, home first. Use repo-relative rules and design paths;
the following shows the field grammar, not configuration values to copy:

```markdown
## Legs

### Leg: repo-a
branch: feature/shared-change
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: <resolved portable verification templates and policy>
Rules: AGENTS.md
Rules: pkg-x/AGENTS.md
scope: AC 1, AC 3
design: <owned paths, observable outcomes, and clauses binding this leg>
```

For a no-`home:` variant, apply the creator-specific omissions in
[Record portable templates](#record-portable-templates) to this template.

### Scope grammar and validation

Write exactly one `scope:` line in each block: `scope: none` or a comma-separated
list of `AC <index>` entries, as in the template. Use one-based original AC indices, including cut rows;
count checkbox rows in their original order, not ledger entries or disposition-filtered rows.
Repeat shared indices in each owning leg; indices unlisted across all legs default home.
When all legs say `scope: none`, every original AC defaults home.
Never infer ownership from `design:` prose or paths: `design: implements AC 2`
does not claim AC 2 without an explicit scope entry. Put owned paths and
observable outcomes in `design:` instead.

Before committing home or companion artifacts, validate every block against the
original AC count. Reject missing or duplicate scope lines, duplicate indices within one leg,
malformed lists, and nonexistent original indices; the same index in different legs is valid.
Use these rejection cases as the boundary checks:

| Invalid line | Reason |
|---|---|
| `scope: AC 0` | Zero is not one-based |
| `scope: AC 1.5` | Fractional index |
| `scope: AC 1-3` | Range rather than individual indices |
| `scope: 1` | Bare number without `AC ` |
| `scope: AC 1,` | Trailing comma / empty entry |
| `scope: none, AC 1` | Mixed sentinel and list |
| `scope: AC 1, AC 1` | Duplicate within one leg |
| `scope: AC 4` with only three original ACs | Nonexistent original index |

Reject empty values, negative indices and any other entry not matching
`AC [1-9][0-9]*`, separated by comma and space. Preserve scope indices on
disposition-only amendments, including cuts; validate again before the amendment commit.
Keep this grammar here; consumers refer to it rather than inventing ownership rules.

Keep shared Design, Errors and edge cases, and Out of scope outside `## Legs`;
those clauses bind every member. Assign member ticket groups `in-scope` and name
their ownership through original AC indices in `scope:`. Unmatched groups retain ticket-acceptance's
`this repo / elsewhere / repair` question; `elsewhere:` creates no leg.

Commit home first using spec-finalization's existing gate and audit. Then write
one companion file per companion in its own spec directory with the home's
filename. Use `git -C <companion worktree>` to add and commit that file:

```markdown
# <home spec title>

**Home:** <home repo> <shared branch> <home repo-relative spec path>

## Problem
<home Problem copied verbatim>

## Decisions
<shared Design, Errors and edge cases, Out of scope, and clauses naming this
repo or its owned paths in design, copied from home>

### Leg: repo-b
<that companion's entire block verbatim>
```

Rewrite and commit affected companion files in the same amendment when Problem,
shared decisions, repo-binding clauses, or their block changes. Do not call an
amendment complete while a carried part disagrees.

Treat recorded `contract:` lines as authority for every spec with `## Legs`,
including one-member specs. This replaces finishing Step 6's creation-time
reread rule; legacy specs without `## Legs` retain the finish-time reread and
mean home-only. Amend a recorded contract before a later stage uses a change.

For one member add exactly one block only: no companion artifact, no `legs:`
brief block, no `--leg`, no receipt, and no companion loop.
