# Claude Code skill marketplace for the three tracker-facing skills (gh-11)

Ticket: jjuraszek/pi-gauntlet#11. Supersedes nothing - the #8/#9/#10 specs created
the skills and remain current; this spec only adds a distribution channel.

## Context

`shape-ticket` (#8), `gatekeep-pr` (#9), and `check-delivery` (#10) shipped as
harness-portable by design: every pi-specific mechanic they touch
(`plan_tracker`, `gauntlet_setting`, `subagent()`, pi-cohort personas) carries
inline fallback language, and their frontmatter uses only Claude-Code-legal
fields (`name`, `description`, `disable-model-invocation`, `argument-hint`).
Issue #11 (comment 2, the authoritative rescope) asks to expose exactly these
three skills to Claude Code via a plugin marketplace `skills` allowlist -
in-place, no copies, no body rewrites - plus docs and a settings snippet so
consumer repos can enable them via `.claude/settings.json`.

## Portability audit verdict (discharges #11 AC "language validated")

All three skills pass as-is. **Zero skill-body edits ship with this change.**
Discharging passages, citable without the ticket: shape-ticket `SKILL.md:175`
(resolve `gauntlet_setting` only when the tool exists) and `:180` (runtime
conditional naming Claude Code as the native-facility fallback); gatekeep-pr
`SKILL.md:88` (plain-checklist fallback for `plan_tracker`) and `:182`
(inline-first: orchestrator runs every phase itself, no subagent system
required); check-delivery `SKILL.md:113-121` (tracker absence is never a hard
stop). Each candidate edit was evaluated and rejected during design:

| Candidate edit | Decision | Rationale |
|---|---|---|
| Name Claude Code in gatekeep-pr / check-delivery fallback prose (parity with shape-ticket) | Rejected | "On a harness without `plan_tracker`" is evaluated by the model against its own tools; naming CC adds nothing functional |
| Soften gatekeep-pr's `using-git-worktrees` pointer | Rejected | Target skill exists upstream in obra/superpowers (which the CC audience runs), and the load-bearing convention (gitignore-first) is restated inline |
| Add `CLAUDE.md` next to `AGENTS.md` in the overrides footers | Rejected | Handled in docs instead: README advises `ln -s AGENTS.md CLAUDE.md` in consumer repos |
| Neutralize `/skill:...` syntax in descriptions/bodies | Rejected | CC never parses that string as a command; the model resolves prose skill references by name. User-typed invocation uses the plugin-namespaced form regardless of body text |

Cross-file reference audit: every file read the three bodies perform stays inside
the skill's own directory (`shape-ticket/reference/split-axes.md`,
`gatekeep-pr/verification-brief.md`, `gatekeep-pr/review-baseline.md`). No file
path points into a non-exposed skill; references to `roasting-the-spec` and
`using-git-worktrees` are prose mentions only. Even a future cross-skill file ref
would resolve: the plugin source is the repo root, so CC's plugin cache contains
the full tree - only skill *registration* is limited by the allowlist.

Capability audit: no degradation is fixable by widening the allowlist. Roast
depth (shape-ticket) and reviewer-persona depth (gatekeep-pr) are bound to pi
runtime tools (`gauntlet_setting`, pi-cohort model injection, agent personas),
not to skill availability; exposing `roasting-the-spec` would ship a skill whose
defining mechanic cannot run on CC. The 3-skill set is final for this change.

## Design

### 1. `.claude-plugin/marketplace.json` (new, repo root)

Marketplace `pi-gauntlet`, single plugin `gauntlet`, `source: "./"` (repo root),
`strict: false` (marketplace entry is self-sufficient; no `plugin.json`, keeping
the repo root clean). Exact content:

```json
{
  "name": "pi-gauntlet",
  "description": "Selective Claude Code exposure of pi-gauntlet's tracker-facing skills.",
  "owner": { "name": "jjuraszek", "url": "https://github.com/jjuraszek" },
  "plugins": [
    {
      "name": "gauntlet",
      "source": "./",
      "strict": false,
      "description": "Tracker-facing workflow skills from pi-gauntlet: shape-ticket, gatekeep-pr, check-delivery. Harness-portable; the rest of pi-gauntlet is pi-only.",
      "skills": [
        "./skills/shape-ticket",
        "./skills/gatekeep-pr",
        "./skills/check-delivery"
      ]
    }
  ]
}
```

The top-level `description` is present because some validator profiles require
it.

Load-bearing semantics, quoted from Claude Code's plugin-marketplaces /
plugins-reference docs (code.claude.com/docs, fetched 2026-08-20) so the rule is
verifiable without re-fetching: "With a marketplace-root `source`, the listed
paths are the complete set for that entry, and other directories in the shared
`skills/` folder don't load. Listing `./skills/` itself, or the plugin root,
keeps the full scan. If none of the listed paths exist, the default scan runs
instead." So: the other 13 skill directories do not load; the allowlist must
name specific subdirectories (never `./skills/`); and `source: "./"` +
`strict: false` are the two fields the exclusivity rests on. Adding a skill
later is a one-line array append. Invocation on CC: `/gauntlet:shape-ticket`
(or bare `/shape-ticket` when unambiguous); settings key:
`"gauntlet@pi-gauntlet"`.

Not shipped via npm: `.claude-plugin/` stays out of `package.json#files`.
Consumers reach the marketplace through the GitHub source; the npm tarball, the
pi manifest, and pi's skill discovery are untouched. Pi behavior is
byte-identical - pi never reads `.claude-plugin/`.

### 2. `scripts/ci.mjs` drift guard (new check, runs in existing `npm test`)

Asserts, failing the build on violation:

1. `.claude-plugin/marketplace.json` parses as JSON and has `name`, `owner`, a
   top-level `description`, and exactly one entry in `plugins`; that entry has
   `source === "./"`, `strict === false`, and a non-empty `skills` array that
   contains neither `"./skills/"` nor `"."` (either would re-enable the full
   scan and leak all 16 skills). These two fields are what the allowlist
   exclusivity rests on - flipping either must turn ci red.
2. Every path in that entry's `skills` array exists on disk and contains a
   `SKILL.md` whose frontmatter passes the existing name/description validation.
   Existence-checked, not hardcoded to the three names - a future allowlist
   append needs no ci change; a rename/move of an allowlisted skill turns ci red.
3. Bundle-local reference integrity for the allowlisted skills. Extraction rule:
   from each allowlisted skill's `SKILL.md` and its sibling `.md` files, collect
   backticked relative paths ending in `.md` (and `reference/...` paths) and
   resolve them against the mentioning file's own directory. Exclusion set
   (consumer-repo placeholders that intentionally do not exist in this repo,
   never resolved): `REVIEW.md`, `AGENTS.md`, `CLAUDE.md`, `SKILL.md`
   self-mentions, and the three overrides-ladder paths
   (`.pi/gauntlet-overrides.md`, `gauntlet-overrides.md`,
   `doc/gauntlet-overrides.md`). Everything else must resolve - guards
   supporting-file renames (`verification-brief.md`, `review-baseline.md`,
   `reference/split-axes.md`) and any future cross-skill file ref.
4. `npm pack` continues to exclude `.claude-plugin/` (extend the existing pack
   assertions with a negative check).

### 3. README section: "Use from Claude Code"

Placed after the pi Install section, before the overrides documentation.
Contents, in order:

1. **What is exposed and why** - one honest paragraph: these 3 skills are
   harness-portable by design (fallbacks named in-body) and are the supported
   set for this change. Not exposed, in two classes stated separately: (a)
   genuinely pi-bound surface - the full gated pipeline (brainstorming ->
   writing-plans -> subagent-driven-development -> verify -> finish), the spec
   council, the conformance gate, flow guards, verify-before-ship, and all
   `piGauntlet.*` settings, which depend on pi extensions (phase/plan trackers,
   `gauntlet_setting`, pi-cohort dispatch); (b) runtime-neutral skills
   (`systematic-debugging`, `receiving-code-review`, `using-git-worktrees`)
   that are out of scope for this change, not incompatible - re-adding any is a
   one-line allowlist append. Link obra/superpowers for CC-native methodology
   equivalents.
2. **Consumer setup snippet** for the consumer repo's `.claude/settings.json`:

   ```json
   {
     "extraKnownMarketplaces": {
       "pi-gauntlet": {
         "source": { "source": "github", "repo": "jjuraszek/pi-gauntlet" }
       }
     },
     "enabledPlugins": { "gauntlet@pi-gauntlet": true }
   }
   ```

   Note that a `"ref"` may be added to pin a tag; the default tracks the default
   branch. Note also CC's whole-entry settings precedence (no field-level merge)
   for teams layering managed settings. State the register/enable/install
   distinction explicitly: `extraKnownMarketplaces` registers the marketplace
   and `enabledPlugins` records enablement intent; if a fresh machine shows the
   plugin as known-but-not-installed, one explicit
   `/plugin install gauntlet@pi-gauntlet` completes the setup (the cookbook
   covers this). Alternative surfacing path, one line:
   `/plugin marketplace add jjuraszek/pi-gauntlet` then install, for users who
   prefer not to touch settings.json.
3. **Project instructions**: recommend `ln -s AGENTS.md CLAUDE.md` in the
   consumer repo so one instructions file serves both harnesses. The gauntlet
   overrides ladder (`.pi/gauntlet-overrides.md` -> `gauntlet-overrides.md` ->
   `doc/gauntlet-overrides.md`) works unchanged on CC - it is a plain file read.
4. **Folder-trust gotcha**: the marketplace auto-activates only after the user
   trusts *that exact repo folder* in interactive Claude Code; trusting a parent
   folder, `claude -p`, or SDK runs in untrusted folders silently skip
   `extraKnownMarketplaces` with no error.
5. **Smoke-test cookbook** - the numbered, copy-paste procedure below, verbatim.

### 4. Smoke-test cookbook (README content and the manual verification procedure)

```markdown
1. Create a scratch repo and add the marketplace config:

       mkdir -p /tmp/cc-smoke/.claude && cd /tmp/cc-smoke && git init
       cat > .claude/settings.json <<'EOF'
       {
         "extraKnownMarketplaces": {
           "pi-gauntlet": {
             "source": { "source": "github", "repo": "jjuraszek/pi-gauntlet" }
           }
         },
         "enabledPlugins": { "gauntlet@pi-gauntlet": true }
       }
       EOF

2. Start Claude Code interactively in that directory: `claude`
3. When prompted, trust the folder (this exact folder - trust is what activates
   the marketplace; there is no separate marketplace prompt).
4. Run `/plugin` and confirm: marketplace `pi-gauntlet` is listed, plugin
   `gauntlet` is enabled. If it shows as known but not installed, run
   `/plugin install gauntlet@pi-gauntlet` and re-check (registration,
   installation, and enablement are distinct steps in Claude Code).
5. Confirm exactly three skills are registered under the plugin (via the
   `/plugin` details view): shape-ticket, gatekeep-pr, check-delivery.
6. Invoke `/gauntlet:shape-ticket` with a deliberately two-concern ask (e.g.
   "shape a ticket: CSV import for operators, plus a partner-facing status
   API") so the skill deterministically consults its
   `reference/split-axes.md` before proposing a split. Expected: skill
   activates, reads the reference file, reaches its tracker capability ladder
   without erroring on missing pi tools. Stop at the first human gate; write
   nothing to any tracker.
7. Invoke `/gauntlet:gatekeep-pr` in the scratch repo (which has no PR).
   Expected: the skill activates and stops at its configuration/verification
   ladder reporting nothing to gate - no error about missing pi tools, no
   mutation.
8. Invoke `/gauntlet:check-delivery` with no deliverable reference. Expected:
   the skill activates and asks for / reports a missing deliverable set - a
   reported skip, not a pass, and no pi-tool error.
9. Negative check: type `/gauntlet:brainstorming`. Expected: no such skill -
   the allowlist excluded it.
10. Optional validator pass: `claude plugin validate .` from a checkout of
    pi-gauntlet (strict mode if available). Expected: no schema errors.
```

Evidence from one run of this cookbook (step 4-7 observations) is pasted into
the implementing PR. If the marketplace fails to appear at step 4, the likely
cause is folder trust (step 3) - see the gotcha above.

### 5. `AGENTS.md` update

One short addition to the packaging conventions: `.claude-plugin/` exists, is
Claude-Code-only surface (marketplace allowlisting the three tracker-facing
skills in-place), is excluded from the npm tarball, and is guarded by
`scripts/ci.mjs`. Skill counts elsewhere in `AGENTS.md` are unchanged (nothing
is added or removed from `skills/`).

## Edge cases

- Allowlisted skill dir renamed/moved -> ci check 2 fails.
- Supporting file renamed -> ci check 3 fails.
- `.claude-plugin/` accidentally added to `package.json#files` -> ci check 4 fails.
- Untrusted folder / non-interactive run -> marketplace silently inactive;
  documented (README item 4), not fixable from this repo.
- Consumer pins a `ref` -> they own staleness; default snippet tracks the
  default branch.
- All allowlisted paths missing at once -> Claude Code's documented fallback
  runs the *default scan*, exposing all 16 skills. Unreachable from this repo's
  own tree (ci check 2 blocks the merge that would cause it); residual risk is
  a consumer pinned to a hand-crafted broken ref.
- Fresh machine where settings-driven enablement does not auto-install ->
  explicit `/plugin install gauntlet@pi-gauntlet` (documented in README and
  cookbook step 4).

## Testing approach

- Automated: the four ci assertions above, in the existing `npm test` entrypoint
  (`scripts/ci.mjs`), so `test.yml` and `release.yml` inherit them.
- Manual, one-time: the smoke-test cookbook, run against this branch (use a
  `"source": {"source": "github", "repo": "jjuraszek/pi-gauntlet", "ref": "<branch>"}`
  variant, or a local directory source:
  `"source": {"source": "directory", "path": "<abs worktree path>"}`) with
  evidence from steps 4-10 in the PR.

## Documentation impact

- Feature / user-facing docs introduced: none (new README *section*, not a new doc)
- Materially amended existing docs: `README.md` ("Use from Claude Code" section)
- Derived / memory docs invalidated: `AGENTS.md` (packaging conventions: `.claude-plugin/` surface)

## Out of scope

- Any skill-body or frontmatter edit (audit above: none needed).
- Exposing additional skills, stripped copies, or agent personas (killed in
  #11's roast; re-adding a skill later is a one-line allowlist append).
- claude.ai / Skills API upload compatibility (CC plugin marketplace only;
  `disable-model-invocation` / `argument-hint` are CC extensions and stay).
- npm distribution of the marketplace.
