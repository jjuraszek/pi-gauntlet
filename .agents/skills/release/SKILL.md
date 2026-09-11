---
name: release
description: Use when asked to release, publish, bump the version, or cut a tag for jjuraszek/pi-gauntlet.
---

# Release

`pi-gauntlet` publishes to **npm** (public, unscoped); the `pi-package` keyword
lists it on `https://pi.dev/packages/pi-gauntlet`. Users install with
`pi install npm:pi-gauntlet`.

The release is **tag-driven and CI-executed**: pushing a `vX.Y.Z` tag triggers
`.github/workflows/release.yml`, which gates on `tag == package.json`, runs
`npm test` (`scripts/ci.mjs`, which also asserts `package.json` version == top
`## vX.Y.Z` CHANGELOG heading), and runs `npm publish --provenance --access public` via
**OIDC trusted publishing**. The local flow assigns the version and pushes the
tag; **never run `npm publish` by hand.**

All mechanics live in `.agents/skills/release/scripts/release.sh`. Its CONFIG
header is the only block that differs from the sibling pi-* copies - keep the
rest byte-identical.

## Boundaries

- Reads: git log/tags, `package.json`, `CHANGELOG.md`, pi `settings.json` files.
- Writes: `CHANGELOG.md` heading, `package.json` version, one `Release X.Y.Z`
  commit, the `vX.Y.Z` tag; `settings.json` pins only via `sync-presets --apply`.
- Never: `npm publish`, consumer project files, `~/.pi/**/settings.json`
  without `--apply` being authorized.

## Bump policy

`v<major>.<minor>.<patch>`; `package.json` `version` mirrors the tag without `v`.

| Level | When |
|---|---|
| `patch` | fixes, skill/agent/extension prose, non-breaking internal changes |
| `minor` | new skill, agent, or extension |
| `major` | skill/agent rename, breaking config-schema change (settings-key rename, package rename), extension API removal |

## Process

**Level named in the request** ("release patch") - that is the approval. Run
step 2 directly; no proposal, no re-confirmation. An explicit version ("cut
6.1.0"): set `package.json` to it, commit, run `current`.

**Level not named** - step 1 once, then step 2 with the level the user picks.

### 1. Propose

```bash
bash .agents/skills/release/scripts/release.sh propose
```

Present the commits, the heuristic level, and the resulting `X.Y.Z` with a
one-line rationale tied to specific commits. Wait for the pick.

### 2. Release

Release notes must already sit under `## Unreleased` in `CHANGELOG.md`,
committed. If missing, write them from the commits since the last tag (flat
dated bullets, matching the file; `(#N)` on ticket-linked bullets), commit,
then run:

```bash
bash .agents/skills/release/scripts/release.sh patch      # or minor / major
bash .agents/skills/release/scripts/release.sh --dry-run patch
bash .agents/skills/release/scripts/release.sh current    # package.json already set; still promotes Unreleased
```

The script requires `main` and a clean tree, promotes `## Unreleased` to
`## vX.Y.Z - <date>`, sets `package.json`, commits `Release X.Y.Z`, runs
`npm test`, creates the annotated tag, pushes `main` + tag, then runs
`verify`. Any failed check exits with the reason - report it, don't work
around it.

### 3. Verify

Runs automatically after the push. Standalone:

```bash
bash .agents/skills/release/scripts/release.sh verify           # package.json version
bash .agents/skills/release/scripts/release.sh verify 5.5.2
```

Watches the release workflow to a terminal state, polls
`npm view pi-gauntlet@X.Y.Z version` until live, then checks the pi.dev catalog.
Success means `npm view` printed the version. pi.dev lags npm by minutes to
hours - report crawl lag, do not loop on it.

### 4. Follow-ups named in the same instruction

Run after step 3 prints the version, no further confirmation:

- close a ticket: `gh issue close <n> --comment "<text>"` - "relevant ticket"
  is the `(#N)` ref in the promoted CHANGELOG section; the comment is that
  section plus the npm version line. Stop only if several refs are present and
  none is named.
- `sync-presets --apply` when the instruction asks for it; otherwise report-only:

```bash
bash .agents/skills/release/scripts/release.sh sync-presets            # report
bash .agents/skills/release/scripts/release.sh sync-presets --apply    # rewrite same-form npm pins
```

Scans `settings.json` under `~/.pi` and this repo's parent tree. Same-form npm
pins (`npm:pi-gauntlet@<old>`) are bumped; git-tag pins and stale `pi-superpowers`
names are reported for manual migration, never auto-rewritten.

## Pair with pi-cohort

pi-gauntlet depends on [pi-cohort](https://github.com/jjuraszek/pi-cohort)
(`subagent()`). They version independently but **release together whenever
dispatch semantics change**: a skill relying on a new pi-cohort dispatch shape
ships alongside the pi-cohort release that provides it, and the README
peer-dependency minimum bumps in the same pi-gauntlet release.

## Safety checks (enforced by the script)

- clean working tree, on `main`
- `## Unreleased` present and non-empty, or top heading already `X.Y.Z`
- target `vX.Y.Z` tag does not exist
- `npm test` passes

## Red Flags - STOP

- about to run `npm publish` locally
- picked a level the user neither named nor approved
- reported success without `npm view pi-gauntlet@X.Y.Z` printing the version
- retrying the pi.dev fetch "until it appears"
- `sync-presets --apply` without the instruction asking for it
- working around a failed safety check instead of reporting it

## First-time npm setup (one-off)

Register `pi-gauntlet` as a trusted publisher on npmjs.com: Settings -> Trusted
Publishing -> GitHub Actions publisher for repo `jjuraszek/pi-gauntlet`, workflow
`release.yml`. Until then the publish step fails with 403.
