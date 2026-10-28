# Coordinated finish

## Activation and authority

Read the home spec's `## Legs` once at Step 1. Use the membership, portable identifiers, scope validation and path resolution in [the leg grammar](../../brainstorming/reference/legs.md). Resolve selected primaries from home's declared siblings and worktrees from the brief or recorded `home:` pattern. Validate branch, repository identity and each companion's full `**Home:**` tuple before acting. Admit a missing delivered worktree only through a validated receipt below.

Use recorded `contract:` lines for every spec with `## Legs`, including one member. Amend the home block and affected companion file before using a changed contract; do not reread overrides to replace it. For one member, return to the ordinary finish steps using that block's contract: keep exactly one `### Leg:`, no companion artifact, `legs:` brief block, receipt, `--leg` argument or companion loop. For no `## Legs`, use the ordinary home-only flow and Step 6's overrides reread.

For more than one member, apply the following steps instead of the home-only verification, delivery and cleanup mechanics. Keep Step 3.5's disposition protocol, the home's review policy, Step 4 menu and confirmations. Keep machine-local paths out of committed bodies and messages.

## Durable receipts

Keep one home-owned file per delivered leg at `<home git common dir>/gauntlet/receipts/<spec filename>/<repo>`, where `<home git common dir>` is `git -C <home worktree> rev-parse --path-format=absolute --git-common-dir` (the home primary's `.git`, e.g. `/work/repo-a/.git/gauntlet/receipts/shared.md/repo-b`) - never inside any worktree, so a removed home tree never takes a receipt with it. Include the full spec filename, including `.md`, and preserve repo path segments; create directories before writing. Git metadata is never tracked, so no exclude entry is needed. Treat them as flow restoration artifacts, not telemetry, approval evidence or proof without validation.

Write after each delivery attempt that produced a PR or squash commit, including failed post-squash verification:

```text
attempted-head: <full feature SHA attempted>
delivered: pr <url> <full delivered PR head> | squash <full squash SHA>
verification: passed | <actual verification failure>
```

Choose one `delivered:` alternative. Use `verification: passed` only for successful verification; preserve the error otherwise. Retain the selected spec path, recorded commands, membership and accepted task evidence before stripping the plan, and carry the receipt locations into the brief. On fresh-session retry admit a stripped plan only when every companion has a receipt; validate each receipt rather than inferring delivery from missing files. Recover commands from the spec's recorded contract, not the absent plan.

Before checkout-based verification and conformance fan-out, validate receipt identity against the selected spec, repo and recorded delivery choice; reconcile it with the selected action before delivery. Malformed, mismatched or unverifiable receipts leave the leg unlanded; stop on an unavailable boundary rather than creating duplicate delivery. Apply these proofs:

| Receipt | Required proof and retry action |
|---|---|
| PR | Fetch the receipt URL using `gh pr view <url> --json state,headRefOid` in its repository. Require `OPEN`, head equal to the attempted head, delivered head equal to attempted head, passed verification, and unchanged current feature head when the tree exists. A stale head must re-push the verified branch non-force and update the existing PR, not create another PR. Refresh and rewrite the receipt after success. A closed PR is not a validated skip; stop for disposition. |
| Squash | Require `verification: passed` and the squash SHA reachable from the primary's default branch: `git -C <primary> merge-base --is-ancestor <squash SHA> <default branch>` must exit 0. Confirm the current attempted feature head when available. For recorded failed post-squash verification, rerun verification, not squash, against the delivered primary state; rewrite the receipt on pass. Require the recorded squash to remain reachable and stop on unrelated primary movement requiring review. |

Never use feature-head ancestry as proof of squash delivery. Resolve the actual primary default branch, not an assumed `main`. Treat unexpected Git exits as errors, not negative proofs. Preserve receipts on every failure, including seal failure and cleanup refusal.

## Verification and closure - Steps 1 and 3.5

Exempt a leg with a validated receipt and a missing worktree from checkout-based verification and conformance. Run fresh checks for every unlanded leg; stop on a missing unlanded worktree. Handle failed-squash verification in the delivered primary through the receipt retry action above; replace feature-checkout checks with that primary verification even when the feature tree still exists.

Before Step 4, run every leg's recorded verification set with that leg's worktree as command cwd, except the receipt-proven exemptions above, then perform conformance review with that leg's `cwd`, Rules and owned AC rows. Use original AC indices from `scope:`; shared rows belong to each named owner and unclaimed rows default home. Apply Step 1's hard gate and skip proof independently per leg. Route fixes and commits through `git -C <owning worktree>`, never home's checkout for companion code.

Retain each present member's audited head and tree, including staged, unstaged and untracked state. Immediately before delivery compare them to the current checkout; re-verify and re-review every changed leg before its delivery. Apply the same freshness check after disposition fixes and minors fixes. Aggregate closure before presenting one menu; no leg bypasses open dispositions.

Apply leg-local `piGauntlet.verifyBeforeShip` evidence to commands targeting that checkout. Read each primary's `.pi/settings.json` by file and merge the preset using the existing settings rules; do not use home's `gauntlet_setting` result or home's successful test flag as companion evidence. Use the recorded verification set, including when a retry has no plan.

## Execute one choice - Steps 4 and 5

Apply one chosen action to companions in declared sibling order, then home. Preserve every PR, draft and keep worktree and branch. Keep reports all retained locations without strip, seal, delivery or cleanup.

For a PR-subject home, compose the supported existing home action with companion delivery: row 1 pushes and edits the existing home PR through its recipe, rows 2-3 retain the existing-PR disclosure and refusal rather than attempting a duplicate, and squash/keep/discard retain their existing disclosures and confirmations. Deliver companions before the supported home ship action; keep absorbed-PR closure authorization separate and unchanged. Do not start fan-out for a home action withheld by preflight.

For PR, draft and squash:

1. Validate existing receipts first. Skip only receipt-proven delivery. Check freshness for every unlanded leg before its delivery.
2. Deliver each companion: for PR/draft, push with `git -C <worktree> push -u origin <branch>`, then run `gh pr create` in that worktree's cwd, adding `--draft` on every draft create. On retry of an existing PR use its URL and edit rather than duplicate create. For squash, use the existing Option 3 primary checkout/pull/merge/commit recipe and run that leg's recorded post-squash commands in the primary. Write its receipt even when those commands fail. No companion plan strip or telemetry seal runs.
3. Collect complete companion results, including validated skips. Capture the spec path and evidence before the home plan strip. Run home's strip-and-seal block with repeated `--leg <repo>=<sha|pr-url>`, one per companion. Never seal partial results. Compare collected `{ repo, sha }` or `{ repo, pr }` entries with an existing seal's `legs:` set; differences stop naming stored and collected results. Retain all receipts when the bin fails and print its output. Never write companion `.pi/gauntlet/telemetry/`.
4. Deliver home through the selected existing recipe after successful sealing, without running a second seal lacking the companion arguments. For PR-subject row 1 retain the whole-PR base and all body-edit/closure rules. Write home's receipt, including post-squash failures. Run cleanup only for squash, after successful post-squash verification.

Put `Home: <repo> <shared branch> <home spec path>` in every companion PR body and squash message. Respect each leg's PR body style. List every companion PR URL in the home PR body (including the existing home PR's rework block), and every companion squash SHA in home's squash message.

On the first delivery, verification or seal failure, stop fan-out and preserve delivered work and receipts. Print actual results, including validated skips, in member order:

```text
Shipped: <repo> <sha|pr> ...
Not shipped: <repo> <reason> ...
```

A squash with failed post-verification belongs under Not shipped with its created SHA and error; do not conceal the commit. Include home when not delivered and every untouched remaining companion. Perform no rollback. A fresh-session retry validates the same receipts before continuing.

## Discard and recorded cleanup - Steps 5 and 6

List every member's branch, commit count, and worktree path as a resolved absolute path (the brief's or the recorded `home:` pattern expanded for this branch, e.g. `/work/repo-b/.worktrees/feature-shared-change`; never a pattern or placeholder) before one typed `discard` confirmation. Obtain exact confirmation once for the run, then clean every member, home included, through its recorded contract; a companion refusal never withholds another member's recorded teardown. Do not strip or seal for discard.

For cleanup, use the recorded `## cleanup` worktree command, else `destroy:`, with the configured teardown hook using pi-cohort's existing semantics, else the owned built-in matched against that leg's recorded `home:`. Execute from that leg's primary. Expand recorded `<name>` and `<branch>` as single shell words using Step 6's escaping and ownership proof; resolve other tokens before execution. Never use `git worktree remove` past a wrapper or hook failure. Leave unmatched host-owned trees and their branches preserved.

Clean companions in declared order, then home. Report a refusal as that leg's `failed` line, leave the tree intact, and continue the remaining cleanup attempts and the remaining report lines. A refusal stops only that leg: every other member's recorded contract, home's included, still runs from its own primary; home is never preserved on a companion's behalf. Delete a branch only after successful removal of its worktree. Run prune only for successful owned built-in removal, not after a wrapper. Report each repo's actual removed, preserved or failed state.

Remove receipts only after home delivery and all required cleanup succeed, and report that removal in one explicit line (`Home delivery and required cleanup succeeded; receipts removed`). Receipts live in the home primary's git dir, so worktree removal never touches them; when any required cleanup failed, report `receipts retained - required cleanup failed` and leave every receipt in place for the retry. PR/draft success has no cleanup requirement and preserves every worktree, so its receipts are removed right after the home PR lands. Keep retains receipts for later validation. Mark ship complete only after the chosen action succeeds for every member; never mark discard as shipped.
