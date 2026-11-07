# Telemetry on a non-branch ref

**Goal:** Every gauntlet telemetry record is published to and read from `refs/telemetry/records` on `origin` (or `piGauntlet.telemetry.remote`), so a product repo shows no telemetry branch, no recent-pushes banner and no push-triggered workflow run; repos that already carry the `gauntlet/telemetry` branch move their records to the ref with a conflict-stopping, repeatable `--migrate-branch` and retire the branch only through an explicit, verified `--retire-branch`.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** loop
**Ticket:** #130 (jjuraszek/pi-gauntlet)
**Predecessor:** `doc/specs/2026-11-06-gh-124-telemetry-branch-leg-records.md` - supersedes the `gauntlet/telemetry` ref name in its "Branch library" clause and the `branches-ignore` workflow filter with its `scripts/ci.mjs` pins in "Removal of the tracked corpus and the guards"; its plumbing, readers, leg records and seal outcomes stay live.

## Problem

Since #124 every sealed run and every settled shape-ticket, gatekeep-pr or check-delivery session pushes a YAML record to the orphan branch `refs/heads/gauntlet/telemetry`, and every reader fetches it first. A branch is visible: GitHub lists it, raises the "had recent pushes" banner for whoever pushed, offers it in the PR compare list, and starts the `push` workflow unless the consumer repo adds `branches-ignore: ['gauntlet/telemetry']` - a line this repo's `scripts/ci.mjs:27-32` pins and `doc/configuration.md` tells consumers to copy. GitHub offers no setting to hide a branch's banner; the ticket rejects pushing as a bot identity and a separate repo by default.

The publisher never depends on the checkout: `extensions/lib/telemetry-branch.ts` fetches with `+refs/heads/gauntlet/telemetry:refs/remotes/<alias>/gauntlet/telemetry` (lines 42-43) and pushes `refs/heads/gauntlet/telemetry:refs/heads/gauntlet/telemetry` (line 88), so the destination is two constants. `src/bins/gauntlet-telemetry-seal.mjs:113-120` duplicates the tracking-ref choice. The three shipped bundles under `bin/` embed the literal. The existing `--migrate` imports checkout YAML and is not a ref migration (`seal.mjs:85-99`).

Two facts the ask depends on without naming them, checked during the questionary:

- GitHub's treatment of a push to `refs/telemetry/*` (accepted, no workflow run, no branch, no banner or compare entry) is not documented: the Actions `push` event page describes only branch and tag pushes with `branches`/`tags` filters. The ticket's first acceptance row makes it a manual scratch-repo check, and this spec names that check as the one external action in Design. It stays unverified until that step runs.
- The ticket's conflict-stopping migration cannot reuse the existing non-fast-forward replay unchanged: `telemetry-branch.ts:92-107` rebuilds each pending commit's delta on the fetched tip and overwrites same-path bytes last-writer-wins, with no same-path/different-bytes detection (`src/bins/gauntlet-telemetry-concurrency.test.mjs:202` pins "the later blob wins"). The migration needs its own record comparison (corrected premise).

Reproduced in this checkout: `refs/heads/gauntlet/telemetry` and `refs/remotes/origin/gauntlet/telemetry` both at `efa0d303`, no `refs/telemetry/*` locally or on origin, and only the default fetch refspec `+refs/heads/*:refs/remotes/origin/*`.

Framing: kept - checked the publisher refspecs and replay (`telemetry-branch.ts:42-43,88,92-107`), the seal's duplicated tracking-ref pick and checkout-YAML `--migrate` (`seal.mjs:85-99,113-120`), the reader (`telemetry-branch.ts:119-140`) and guard (`extensions/telemetry.ts:319-336,785-792`) paths, `scripts/ci.mjs:27-32`, the three bundles, the GitHub Actions `push` event doc, and the ticket's recorded rejection of bot identity and separate-repo-by-default (adopted from #130).

## Acceptance criteria

Ticket #130, "Acceptance criteria", rows verbatim:

- [ ] Not a branch on the host (manual check, first): in a scratch GitHub repo whose push-triggered workflow has no `branches-ignore` entry, a telemetry push to the new ref is accepted, no workflow run starts for that push, `gh api repos/<owner>/<name>/branches` does not list the ref, and the pushing identity sees no recent-pushes banner for it and no telemetry entry in the pull-request compare list afterwards.
  venue: scratch GitHub repo - a human runs the Design "Host check" commands once before implementation; the observed `gh run list` and `branches` output and the banner/compare absence are the evidence
- [ ] New destination: with telemetry enabled, seal a gauntlet run in a scratch git repo that has an `origin`. The record lands at the unchanged `<owner>/<name>/brainstorming/<spec path with .md replaced by .yaml>` path on the new ref on `origin`; `git ls-remote --heads origin` lists no `gauntlet/telemetry` branch and no new branch, `git ls-remote origin 'refs/telemetry/*'` lists the ref, and no local branch is created in the checkout. The same holds for a leg record published at settlement and for `--migrate` of checkout records.
  in-scope
- [ ] Separate repo unchanged: with `piGauntlet.telemetry.remote` set to a second scratch repo URL, the same seal publishes the ref only to that remote and pushes nothing to `origin`.
  in-scope
- [ ] Readers need no extra git config: in a fresh clone whose only fetch refspec is the default `+refs/heads/*:refs/remotes/origin/*`, gauntlet-performance, gauntlet-spec-index and the brainstorm shipped-spec guard fetch the new ref and read every record on it; the fetched copy lives in a local ref that is not a branch (`git branch --list` shows no telemetry entry). The reader-failure behavior documented today stays: a failed fetch serves the last fetched ref with a warning, and no fetched ref yields an empty corpus with a warning.
  in-scope
- [ ] Concurrency and stranded commits unchanged: the non-fast-forward fetch-and-replay retry, the race when two writers create the ref for the first time, the stranded-commit push on the next refresh, and the `telemetry: not pushed (<reason>)` outcome behave as documented today, against the new ref; the existing tests for these cases pass re-pointed at it.
  in-scope
- [ ] Documented procedure: `doc/configuration.md` carries a ref-migration section for a repo that already has the `gauntlet/telemetry` branch, in the order a team runs it (upgrade every machine, migrate, then remove the branch and the CI exclusion), covering the remote branch, each clone's local branch and remote-tracking ref, the `branches-ignore` line in consumer workflows, and the `telemetry.remote` case; a reader following it from a repo that has the branch ends with every record on the new ref and no telemetry branch on the remote.
  in-scope
- [ ] Repeatable and lossless: in a scratch remote that carries a `gauntlet/telemetry` branch with records, after the procedure the new ref holds every record the branch held (same paths, same bytes; shared history with the branch is allowed); running it a second time adds no commit; and after an older client pushes one more record to the old branch, running it again carries that record onto the new ref too, with nothing removed.
  in-scope
- [ ] Conflicts stop, never overwrite: when the old branch, an unpushed local branch and the new ref carry different bytes at the same record path, the procedure stops with a report naming the path and the refs involved, keeps every source ref in place, and the branch-removal step cannot run until the conflict is resolved.
  in-scope
- [ ] Branch removal is explicit and ordered: the procedure never deletes the old branch before the new ref holds everything the branch held; a clone that migrates while its local branch still has commits the remote lacks carries them to the new ref first.
  in-scope
- [ ] Nothing left pinning the branch: this repo's docs (`doc/configuration.md` telemetry section and its "Keep telemetry pushes out of CI" advice, `README.md`), the brainstorming and finishing-a-development-branch skills, the gauntlet-resume seed reference, the `scripts/ci.mjs` lints and `scripts/finish-verification.test.mjs`, the eval samples that name the branch, the settings-resolver warning and the brainstorm guard reason all name the new ref; `scripts/ci.mjs` no longer requires `branches-ignore` in `.github/workflows/test.yml`; the shipped `bin/` bundles are rebuilt with the change; `CHANGELOG.md` and `doc/specs/` history stays as written.
  in-scope

## Legs

### Leg: jjuraszek/pi-gauntlet
branch: gh-130-telemetry-non-branch-ref
contract:
- create: git worktree add <home> -b <branch>
- destroy: git worktree remove <home> && git worktree prune
- home: .worktrees/<name>
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: `npm test` (runs `scripts/ci.mjs`) in the worktree; `npm run build:bins` before committing a change under `src/bins/` or `extensions/lib/`; the skill and seed edits are meaning-preserving (they only replace the retired branch name with `refs/telemetry/records`, a corrected ref name under AGENTS.md "Change process"), so no eval sample runs - the commit body states the exemption and the three sample dirs are literal-sweep targets only
Rules: AGENTS.md
Rules: AGENTS.core.md
Rules: doc/personas.md
Rules: doc/configuration.md
Rules: eval/README.md
Rules: doc/install-internals.md
Rules: .agents/skills/release/SKILL.md
Rules: doc/gate-contract.md
Rules: doc/implement-engines.md
Rules: README.md
Rules: CHANGELOG.md
Rules: .pi/gauntlet-overrides.md
Rules: skills/gauntlet-handoff/SKILL.md
Rules: skills/gauntlet-resume/SKILL.md
Rules: skills/gauntlet-resume/reference/brief-contract.md
Rules: skills/brainstorming/reference/legs.md
Rules: skills/finishing-a-development-branch/reference/legs.md
scope: none
design: owns every path in Design's Remove/Add lists; observable outcomes are the ten acceptance rows above

## Design

### Host check (external action, runs once before implementation)

Runner: the human, once, after approval and before the first implementation task; no paid service, one disposable private GitHub repo. Commands, in a scratch directory:

```bash
gh repo create <owner>/gauntlet-ref-check --private --clone
cd gauntlet-ref-check
mkdir -p .github/workflows && printf 'on: push\njobs:\n  noop:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo hi\n' > .github/workflows/push.yml
git add -A && git commit -qm init && git push -u origin HEAD
blob=$(git hash-object -w --stdin </dev/null)
tree=$(printf '100644 blob %s\trecord.yaml\n' "$blob" | git mktree)
commit=$(git commit-tree "$tree" -m telemetry)
git push origin "$commit":refs/telemetry/records
sleep 30; gh run list --limit 5            # expect: only the init push run
gh api repos/<owner>/gauntlet-ref-check/branches --jq '.[].name'   # expect: the default branch only
# open the repo page: no "recent pushes" banner; open "New pull request": no telemetry entry in the compare list
gh repo delete <owner>/gauntlet-ref-check --yes
```

The observed output is AC 1's evidence. If the push is rejected or a run starts, implementation does not start: the design premise fails and the user decides the next step (there is no assumed fallback). Design names no other paid or external action; the implementation loop treats any action not named here as unreachable, and adding one needs separate explicit authorization. Model dispatches inside the gauntlet flow (council, reviewers, implementers) are the flow's own and not external actions.

### Ref layout

`extensions/lib/telemetry-branch.ts` keeps owning every ref name:

| Constant | Today | After |
|---|---|---|
| `TELEMETRY_REF` (remote destination and local pending tip) | `refs/heads/gauntlet/telemetry` | `refs/telemetry/records` |
| `trackingRef(remote)` (fetched copy), now exported | `refs/remotes/origin/gauntlet/telemetry` / `refs/remotes/telemetry/gauntlet/telemetry` | `refs/telemetry/fetched/origin` / `refs/telemetry/fetched/telemetry` |

Nothing lands under `refs/heads/` or `refs/remotes/`, so `git branch`, `git branch -r`, the default fetch refspec and the GitHub branch UI never see it. The fetch stays `+<TELEMETRY_REF>:<trackingRef>` and the push `<TELEMETRY_REF>:<TELEMETRY_REF>`. `syncTelemetryBranch`, its pending-commit `rev-list`, the one-retry delta replay, `readTelemetryBranch`, the two reader bins, `extensions/telemetry.ts`'s shipped-spec guard and `extensions/lib/telemetry-leg.ts`'s settlement writer follow the constants and keep their code. The seal's `branchBlob` (`gauntlet-telemetry-seal.mjs:113-120`) calls the exported `trackingRef` with `o.remote ?? "origin"` instead of rebuilding the name (settings resolve `telemetry.remote` to `undefined` by default, which `branchBlob` already treats as `origin`; `trackingRef(undefined)` would pick the `telemetry` alias). The `telemetry.remote` URL path keeps the `telemetry` alias and its URL fetch/push. `git fetch --prune` never touches `refs/telemetry/fetched/*`: it lies outside every configured refspec.

### Record comparison

New export in `telemetry-branch.ts`: `compareRecords(root, sources, destination)`. `sources` is a list of snapshots `{ label, oid }` - immutable commit OIDs resolved once, with the ref label (`<remote>/refs/heads/gauntlet/telemetry`, `refs/heads/gauntlet/telemetry`) kept for messages only; `destination` is `{ label, oid }` or `{ label, oid: null }` for a confirmed-absent ref, read as the empty tree. It runs `git ls-tree -r` once per non-null snapshot and returns `{ conflicts: { path, a, b }[], missing: { path, source }[] }`: `conflicts` is every path that any two snapshots (a source pair, or a source and the destination) both hold with different blob ids; `missing` is every path a source holds and the destination lacks. Paths are compared whole; blob identity is the byte test. Both migration flags run this preflight over every source and the destination together before any publication.

Migration never goes through `syncTelemetryBranch`'s fetch-and-replay (it overwrites same-path bytes last-writer-wins, `telemetry-branch.ts:92-107`). Every migration push carries an expected-value lease on the destination OID the preflight compared (`--force-with-lease=refs/telemetry/records:<dest>`; an empty expectation when the destination was confirmed absent, so the ref must not exist). A lease rejection prints git's stderr and `destination changed since comparison - re-run --migrate-branch`, exits 1 and writes nothing; the run is repeatable. Ordinary seal and leg publication keep the existing replay.

### `--migrate-branch` (seal bin)

New flag on `gauntlet-telemetry-seal`, exclusive with the run-seal options and `--migrate`; root and remote resolve exactly as for `--migrate`. Legacy branch name `refs/heads/gauntlet/telemetry` is a module constant used only by the two migration flags.

1. Discover the legacy branch: `git ls-remote --exit-code <remote> refs/heads/gauntlet/telemetry` (a URL remote by URL; the same exit contract the brainstorming spec-pr and pr-head references already use). Exit 0: present - `git fetch --no-tags <remote> refs/heads/gauntlet/telemetry` and immediately resolve `legacy = git rev-parse FETCH_HEAD`; every later step uses that OID, never `FETCH_HEAD` (step 3's fetch overwrites it). Exit 2: confirmed absent. Any other exit, or a fetch failure (no remote, auth, transport): print git's stderr, exit 1, nothing written. Absence is never inferred from stderr text.
2. Local source: `local = git rev-parse --verify refs/heads/gauntlet/telemetry` when the branch exists. No source at all: print `nothing to migrate` and exit 0.
3. Discover the destination the same way: `git ls-remote --exit-code <remote> refs/telemetry/records`. Exit 0: fetch it into `trackingRef(remote)` - this fetch must succeed in this invocation - and resolve `dest = git rev-parse <trackingRef>`. Exit 2: confirmed absent, `dest = null` (empty tree). Any other exit or a fetch failure: stderr, exit 1, nothing written. A pre-existing `trackingRef(remote)` is never discovery proof for either flag; the readers' last-fetched fallback stays theirs.
4. Preflight: `compareRecords(root, [legacy, local], dest)` over whichever sources exist. Any conflict: print one line per pair, `conflict: <path> differs between <a> and <b>`, write nothing, exit 1.
5. Publish, bound to `dest`:
   - `dest` is null and `legacy` exists: `git push <remote> --force-with-lease=refs/telemetry/records: <legacy>:refs/telemetry/records` - a server-side ref copy, zero record bytes moved, history and authorship intact (allowed by row 7's "shared history"). On success `dest = legacy` and the local source's `missing` paths continue below. This is the whole first run in the common case.
   - When `missing` is non-empty: build one commit whose parent is `dest` (none when `dest` is null) from the destination tree plus every missing path's bytes from its source, using the commit-building helpers `syncTelemetryBranch` uses but not its fetch-and-replay, and push it with the lease on `dest`. Print `carried: <n> records from <labels>`. Nothing missing prints `carried: 0 records` and creates no commit.
   - Lease rejection (another migrator or seal moved or created the destination since step 3): the rule under Record comparison - stderr, `destination changed since comparison - re-run --migrate-branch`, exit 1, nothing written or deleted. Transport or auth failure: stderr, exit 1. Neither path falls through to replay.

### `--retire-branch` (seal bin)

Same root/remote resolution and steps 1-3 (fresh discovery of both refs; a cached `trackingRef` is never proof). No remote legacy source: print `nothing to retire` and exit 0. Run step 4's preflight over every source and `dest`; on any `conflict:` line, or any `missing` path - printed as `not carried: <path>`, which with `dest` null is every source path - exit 1 and delete nothing. Otherwise delete with a lease on the verified tip: `git push <remote> --force-with-lease=refs/heads/gauntlet/telemetry:<legacy> :refs/heads/gauntlet/telemetry`. A lease rejection (an old client pushed between verification and deletion) leaves the branch intact, prints git's stderr and `gauntlet/telemetry moved since verification - re-run --migrate-branch then --retire-branch`, and exits 1. On success print `retired: gauntlet/telemetry on <remote>` and the local cleanup commands for the operator to run in each clone:

```
if git show-ref --verify --quiet refs/heads/gauntlet/telemetry; then git branch -D gauntlet/telemetry; fi
git update-ref -d refs/remotes/origin/gauntlet/telemetry
```

(`origin` is replaced by the resolved alias.) The guard skips the local branch only when it is absent, so a genuine `branch -D` or `update-ref -d` error still surfaces. The tool never deletes a local branch or tracking ref.

### CI, lints and literals

- `.github/workflows/test.yml` drops `branches-ignore`; the whole workflow-filter check in `scripts/ci.mjs:27-33` (the `branches-ignore` requirement, the combined-`branches` rejection and its closing brace) is deleted.
- `scripts/ci.mjs` gains one lint for references to the retired branch, not the bare substring: the patterns `refs/heads/gauntlet/telemetry`, ``orphan `gauntlet/telemetry` branch``, ``gauntlet/telemetry` branch``, ``fetch `gauntlet/telemetry` `` and `branches-ignore` may appear only in `CHANGELOG.md`, `doc/specs/**`, `eval/**/results/**`, `eval/**/report.md` and `eval/**/intent.md` (recorded evidence), `doc/configuration.md`'s migration section (the heading named below), `extensions/lib/telemetry-branch.ts`, `src/bins/gauntlet-telemetry-seal.mjs`, `src/bins/gauntlet-telemetry-ref-migration.test.mjs`, the three `bin/*.mjs` bundles (which embed the migration code), and `scripts/ci.mjs` itself. Every other hit fails `npm test`. The filesystem store keeps its name and its assertions untouched: `.pi/gauntlet/telemetry` (`DEFAULT_TELEMETRY_DIR`, `scripts/ci.mjs:364-365`, `reference/legs.md:54`'s companion-path prohibition), `<git-common-dir>/gauntlet/telemetry/` and `.jj/gauntlet/telemetry/` (`doc/configuration.md:286`, `seed.md:16`, `scripts/finish-verification.test.mjs:108-109`, the lifecycle tests).
- `scripts/ci.mjs:367` and `:370` assert ``the `refs/telemetry/records` ref`` where they assert ``orphan `gauntlet/telemetry` branch``; `scripts/finish-verification.test.mjs:103` and `:105` do the same, `:110` follows the rewritten `seed.md:16` fetch sentence (``fetch `refs/telemetry/records` from `telemetry.remote` ``), and `:118`'s `/branches-ignore/` match on `doc/configuration.md` becomes a match on the migration heading.
- Every other retired-branch reference moves to `refs/telemetry/records`: `README.md:102` Architecture paragraph and `README.md:173` ("refreshes the configured `gauntlet/telemetry` branch"), `doc/configuration.md` telemetry section (the "Keep telemetry pushes out of CI" advice is removed, not reworded), `skills/brainstorming/SKILL.md` Worktree First, `skills/finishing-a-development-branch/SKILL.md` lines 229, 245, 349 and 453 (Common Mistakes included) - `reference/legs.md:54` stays as is, it names the checkout path, not the branch - `skills/gauntlet-resume/reference/seed.md:16` fetch sentence, `extensions/lib/gauntlet-settings.ts:243` retired-`telemetry.dir` warning, `extensions/telemetry.ts:792` `guardReason` argument, and the eval samples under `eval/brainstorming/samples/telemetry-branch-deliverable`, `eval/finishing-a-development-branch/samples/telemetry-branch-seal`, `eval/gauntlet-resume/samples/telemetry-branch-seed` (`case.md` and `expected.md`; `report.md`, `intent.md` and `results/` stay as recorded). These skill and seed edits replace a ref name and keep every instruction's meaning: the meaning-preserving exemption in AGENTS.md "Change process" applies, the commit body says so, and no eval sample runs.
- `npm run build:bins` regenerates `bin/gauntlet-telemetry-seal.mjs`, `bin/gauntlet-performance.mjs`, `bin/gauntlet-spec-index.mjs`.

### Documented procedure (`doc/configuration.md`, new `#### Moving off the gauntlet/telemetry branch` under `### telemetry`)

An h4 under `### telemetry` (`doc/configuration.md:284`), a sibling of `#### Migrating checkout records`; an h3 would be a sibling extension outside the section row 6 names. Order, as a team runs it: (1) upgrade every machine to a release carrying this change; (2) immediately after, in one up-to-date clone run `node bin/gauntlet-telemetry-seal.mjs --migrate-branch`, then repeat in every clone whose `git branch --list gauntlet/telemetry` is non-empty (carries local-only commits) - the section says plainly that upgraded readers and the brainstorm shipped-spec guard read only `refs/telemetry/records`, so every legacy record is invisible to them until this carry completes, and that a seal in that window creates the destination, after which `--migrate-branch` takes the checked carry path instead of the server-side copy, losing nothing; (3) run `--retire-branch` once; (4) run the printed local cleanup (conditional branch delete, then the tracking-ref delete) in each clone; (5) delete `branches-ignore: ['gauntlet/telemetry']` from the consumer workflow. The `telemetry.remote` case: the same commands, with the configured remote resolved by the tool. Recovery for an old client that recreated the branch after retirement, or for a retire lease rejection: re-run `--migrate-branch` then `--retire-branch`. Conflict recovery: inspect the named paths on the named refs, remove or rename the wrong copy on the source branch with ordinary git, re-run.

### Post-deployment housekeeping (tracked, non-blocking)

After release: run `--migrate-branch` and `--retire-branch` on jjuraszek/pi-gauntlet itself, then in each consumer repo after its machines upgrade. Operational follow-on, not an acceptance row.

Remove: `branches-ignore` in `.github/workflows/test.yml`; `scripts/ci.mjs:27-33`; the seal's `branchBlob` tracking-ref duplication; every retired-branch reference outside the lint allowlist above (filesystem-store paths stay).
Add: new values for `TELEMETRY_REF` and `trackingRef`, `trackingRef` exported; `compareRecords`; the leased migration publish path; `--migrate-branch` and `--retire-branch` with usage lines in the seal; the one ci.mjs retired-branch lint; the migration section in `doc/configuration.md`; `src/bins/gauntlet-telemetry-ref-migration.test.mjs`; rebuilt `bin/*.mjs`; one CHANGELOG `## Unreleased` bullet (historical entries untouched; promotion to a version heading is the release's).

## Errors and edge cases

- Legacy branch absent on the remote (`ls-remote --exit-code` exit 2: already retired, never existed): `--migrate-branch` continues with the local branch only (against an absent destination that is the empty tree, so a local-only carry creates the ref) or prints `nothing to migrate`; `--retire-branch` prints `nothing to retire`; both exit 0.
- Remote unreachable or unauthenticated at either discovery or fetch: git's stderr, exit 1, no ref written or deleted; a stale `trackingRef` is never substituted (readers keep their last-fetched fallback).
- Conflicts are all listed, not just the first, including a source pair that differs at a path the destination lacks and conflicts against an absent destination; both flags exit 1 without touching any ref.
- Destination moved or created between discovery and push (another migrator, a seal): lease rejection, stderr, exit 1, nothing written, run repeatable; migration never replays. Ordinary seal and leg publication keep the one-retry replay and `telemetry: not pushed (<reason>)` as today.
- Legacy branch moved between verification and deletion: retire lease rejection, branch intact, exit 1, re-run migrate then retire.
- Fresh repo or legacy-only remote before migration: a new client's fetch of `refs/telemetry/records` finds nothing; `readTelemetryBranch` warns `no telemetry ref fetched yet` as today and the first seal creates the ref (first-use race behavior unchanged).
- Old client (pre-release bundle) pushes to the branch after retirement: the branch reappears; the documented recovery is re-running migrate then retire. No runtime detection.
- Local legacy branch missing in a clone: the normal case, not reported; the printed cleanup skips `branch -D` for it.
- `--migrate-branch` and `--retire-branch` combined with each other, with `--migrate`, or with the run-seal options: the existing `usage()`, exit 1, as the seal does for conflicting options today (`gauntlet-telemetry-seal.mjs:15-19`).

## Tests

- Row 1 (host accepts, no run, no branch, no banner) - none: human-run Host check; evidence is the observed output.
- Row 2 (record on `refs/telemetry/records`, no branch, no local branch) - `src/bins/gauntlet-telemetry-seal-branch.test.mjs`: bare remote lists `refs/telemetry/records`, `ls-remote --heads` empty of telemetry, `git branch --list` empty; same assertions for the settlement writer in `extensions/telemetry-leg.test.ts` and for `--migrate` in `src/bins/gauntlet-telemetry-migration.test.mjs`.
- Row 3 (separate remote only) - `gauntlet-telemetry-seal-branch.test.mjs` separate-remote case: origin has no `refs/telemetry/*`.
- Row 4 (readers with default refspec, fetched copy not a branch, failure behavior) - `src/bins/gauntlet-telemetry-readers.test.mjs`: fresh clone with default refspec reads every record; `refs/telemetry/fetched/origin` exists, `git branch --list` empty; existing offline-cache and empty-corpus warning tests re-pointed.
- Row 5 (concurrency, first-use race, stranded push, not-pushed outcome) - `src/bins/gauntlet-telemetry-concurrency.test.mjs` existing cases re-pointed at the new ref.
- Row 6 (documented procedure) - `scripts/finish-verification.test.mjs`: `doc/configuration.md` contains the `#### Moving off the gauntlet/telemetry branch` heading under `### telemetry`, the ordered steps and the upgrade-window sentence; `README.md` names `refs/telemetry/records`.
- Row 7 (repeatable and lossless) - new `src/bins/gauntlet-telemetry-ref-migration.test.mjs`: first run copies the ref server-side under the empty-expectation lease (same tip); second run prints `carried: 0 records`, no new commit; old-client push to the branch then third run, with the destination already present, carries the one record from the legacy OID (not `FETCH_HEAD`), nothing removed; `--retire-branch` run after that old-client push and before the third run exits 1 with `not carried:` for the remote-only record.
- Row 8 (conflicts stop) - same file: divergent bytes at one path across remote branch, local branch and new ref -> one `conflict:` line per pair, exit 1, all three refs unchanged; the same with the destination absent (remote branch and local branch differ at a path, nothing published, no `refs/telemetry/records` created); a source pair differing at a path the existing destination lacks -> `conflict:`, nothing published; `--retire-branch` under each setup exits 1 and the branch survives.
- Row 9 (ordered removal, local-only commits carried) - same file: `--retire-branch` with the destination absent prints `not carried: <path>` for every source path and deletes nothing; after `--migrate-branch` in the clone with local-only commits the record is on the new ref and retire deletes the branch, printing the cleanup commands; a local branch with no remote branch and no destination carries into a new ref; the branch advanced between verification and deletion -> lease rejection, branch intact, exit 1.
- Migration races - same file: destination advanced by another writer between discovery and the carry push -> lease rejection, the other writer's bytes survive, exit 1, retire stays blocked until a re-run carries; destination created by another writer before the first-copy push -> rejection, exit 1, nothing replayed.
- Discovery failures - same file: unreachable remote at legacy discovery, at destination discovery, and at the destination fetch -> stderr, exit 1, nothing written; a stale `refs/telemetry/fetched/<alias>` present before the run is not used as proof. Separate from the no-source no-op.
- Row 10 (nothing pins the branch) - the ci.mjs retired-branch lint; `finish-verification.test.mjs:103,105,110,118` re-targeted; the existing bin-freshness check for rebuilt bundles; `branches-ignore` absent from `test.yml` is the lint's own hit list; the filesystem-store assertions (`ci.mjs:364-365`, `finish-verification.test.mjs:108-109`) still pass unchanged.
- `compareRecords` unit (missing, source-destination conflict, source-source conflict with the path absent from the destination, null destination as empty tree, identical) - `extensions/lib/telemetry-branch.test.ts`.
- Absent legacy branch -> `nothing to migrate` / `nothing to retire`, exit 0 - `gauntlet-telemetry-ref-migration.test.mjs`.
- Conflicting flag combinations -> exit 1 - `src/bins/gauntlet-telemetry-seal.test.mjs` (the existing status-1 assertion extended to the two new flags).
- Old client recreating the branch after retirement -> covered by Row 7's third run; the recovery is the same command sequence.
- `git fetch --prune` keeps `refs/telemetry/fetched/*` - none: git refspec semantics, not this code.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `doc/configuration.md` `### telemetry` (ref name; new `#### Moving off the gauntlet/telemetry branch` subsection - operations/runbook category); `README.md` `## Architecture` and the `gauntlet-performance` paragraph (ref name - derived drift); `CHANGELOG.md` one `## Unreleased` bullet lands with this change (historical entries untouched; only the promotion to a version heading waits for the release)
- Derived / memory docs invalidated: `skills/brainstorming/SKILL.md` Worktree First, `skills/finishing-a-development-branch/SKILL.md` lines 229, 245, 349, 453 (Common Mistakes included; `reference/legs.md:54` names the checkout path and stays), `skills/gauntlet-resume/reference/seed.md` fetch line, the three eval samples naming the branch - implementation surface, listed for the plan's file sweep

Citation: `reference/documentation-impact.md`.

## Out of scope

- Bot identity, draft-PR workaround, telemetry-only repo by default, hiding the fetched copy beyond keeping it out of `refs/heads`/`refs/remotes`, Keep As-Is/Discard recording, author-email opt-out (ticket exclusions).
- Runtime detection of a recreated legacy branch.
- Automated deletion of local branches or tracking refs.
- Rewriting historical `CHANGELOG.md` entries, `doc/specs/`, or recorded eval results, reports and intents (the `## Unreleased` bullet is the one CHANGELOG addition).
- Running the migration on this repo or consumers (post-deployment housekeeping).

## Open questions

- None blocking. The Host check result is recorded by the human in chat before implementation starts; a failure stops the flow for a decision.
