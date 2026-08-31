# Package-owned `linear` skill with an explicit tracker off-switch (gh-17)

Ticket: https://github.com/jjuraszek/pi-gauntlet/issues/17

## Problem

Linearis knowledge is duplicated and drifting across pi-gauntlet's tracker-facing
skills:

- `skills/shape-ticket/SKILL.md` (lines ~223-231) and `skills/check-delivery/SKILL.md`
  (lines ~104-109) each carry their own `linearis` verb table.
- `skills/chase-bug/SKILL.md:255` documents a fabricated verb
  (`linearis comment <id> <draft>`; the real verb is `linearis issues discuss <id> --body`).
- The generic linearis failure-mode knowledge (comment-edit-is-rewrite, root-only
  reply, `@ID` non-resolution, inline image upload, single-value relation flags,
  positional `create` title) lives only in a consumer repo's local skill
  (`gridstrong/.agents/skills/linear/SKILL.md`), unreachable from package skills.

Additionally (net-new vs the issue as filed): consumers who do not use Linear have
no way to turn the integration off. Today "off" is only implicit - no `linearis`
binary - which still costs a detection probe and ask-once prompts. The user requires
an explicit, zero-probe opt-out.

## Decision summary

| Decision | Choice |
|---|---|
| Off-switch mechanism | Explicit `tracker:` key in the overrides `## Issue tracker` section (values: `linear`, `github`, `none`); no `settings.json` key anywhere |
| chase-bug scope | Full treatment: ladder honors `tracker:`, mechanics route to `/skill:linear` (verb fix subsumed) |
| Schema home | `skills/linear/SKILL.md` owns the full `## Issue tracker` schema (5 keys) and all linearis mechanics; consumer skills carry only a one-line ladder step + routing pointer |
| Duplication | Forbidden: linearis mechanics (verbs, flags, gotchas) live only in `skills/linear/`; consumer skills keep routing/detection references only (literal allowed-match list in AC 5) |
| Invocation mode | `skills/linear` stays model-invocable (no `disable-model-invocation` pin - the routing line depends on it); its body resolves overrides first, so loading it under `tracker: github`/`none` stops before any probe |
| Claude Code | `./skills/linear` added to the marketplace allowlist |
| Config documentation | README section + skill body spell out mandatory vs optional setup; no settings.json involvement |

## Design

### 1. New skill: `skills/linear/SKILL.md`

Frontmatter: `name: linear`; `description` triggering on tracker-ID mentions
(`<PREFIX>-<NUMBER>` forms), "check ticket X", Linear read/search/comment/update
requests, and routing from the tracker-facing skills; the description routes NEW
ticket authoring to `/skill:shape-ticket` (this skill owns only the create
mechanic), mirroring the sibling convention. **No `disable-model-invocation` pin** -
unlike the four explicit-invocation-only tracker skills, `linear` must stay
model-invocable or the "load `/skill:linear`" routing line from consumer skills
cannot fire; the spec pins this deliberately (README's auto/explicit split counts it
on the automatic side). Body contains no pi-bound tools (no `gauntlet_setting`, no
`phase_tracker`/`plan_tracker`, no `subagent`) so it works verbatim under Claude Code.

**Override resolution is the body's first step**: read the `## Issue tracker`
section before anything else; if `tracker:` resolves to a non-Linear value, announce
that Linear is off per overrides and stop - no `command -v linearis`, no auth call,
no ask. Loading the skill is not probing; the zero-probe guarantee holds even when a
stray ticket-ID mention auto-triggers it.

**Write gate**: on standalone invocation, every human-channel write (create, body
update, comment/reply, state change with visible effect) is gated on explicit user
confirmation of the exact text, per the repository gold rule. When routed from a
tracker-facing skill that already confirmed the exact payload, do not re-confirm an
unchanged payload; any payload this skill alters re-gates.

Body sections, in order:

1. **Setup surface.** Mandatory: `linearis` on PATH and authenticated
   (`linearis auth status`; token resolution order `--api-token`, `LINEAR_API_TOKEN`,
   `~/.linearis/token`). MCP fallback paragraph, inlined here as the complete text to
   write (adapted from the consumer-repo original):

   > **No `linearis` installed?** If `command -v linearis` fails, fall back to a
   > **Linear MCP server** when the harness has one configured - its tools cover the
   > same operations (read, list/search, comment, update status, create). Tool names
   > vary by harness and by the server's configured name, so consult the harness's
   > own tool list rather than hard-coding identifiers; the JSON/jq and command
   > examples below are then guidance for the equivalent MCP call, not literal
   > shell. pi-gauntlet ships no MCP setup; MCP is opportunistic.

   No linearis and no MCP: report inability, never fabricate. Optional: each
   `## Issue tracker` override key, with its degradation (next section).
2. **`## Issue tracker` schema** - the single home for all five keys, all optional:

   ```markdown
   ## Issue tracker
   - tracker: linear            # or github / none - exclusive tracker selection
   - workspace urlKey: acme
   - default team: ENG
   - self: dev@example.com
   - id cache: doc/cache/linear.md
   ```

   Absent-key behavior, per key:
   - `tracker` absent -> consumer skills use their detection ladder (unchanged today).
   - `workspace urlKey` absent -> ask the user once per session (needed only for
     issue-URL construction in authored bodies).
   - `default team` absent -> ask on first create.
   - `self` absent -> ask on first self-referential query (assignee-me, standup).
   - `id cache` absent -> skip cache lookups entirely (no cache behavior).

   Semantics of `tracker:` (documented here; the consumer skills' ladder step 0
   carries the same rule self-contained, since this skill must not load under
   non-Linear values). Value matching is **case-insensitive** for the known values.
   Four states:

   | `tracker:` state | Behavior |
   |---|---|
   | known value (`linear` / `github` / `none`) | Exclusive: no probing for other trackers, no ask, others never mentioned. `github` -> linearis never probed, `/skill:linear` never proceeds past its override check. `none` -> tracker steps skipped; each consumer skill uses its documented no-tracker outcome (see per-skill table in section 2). |
   | unknown value (e.g. `jira`) | Exclusivity holds (no Linear/gh probing). If the same `## Issue tracker` section carries free-form command mappings for that tracker (the pre-existing README contract), use them; else say so and ask - never silently fall back to the detection ladder. |
   | key absent | Consumer skills use their detection ladder, unchanged from today (including the linearis PATH+auth probe). |
   | key present but unparseable | Treat as an off-switch attempt gone wrong: ask the user, never probe - a typoed off-switch must not silently re-enable detection. |

   **Coexistence with the existing free-form `## Issue tracker` contract** (README
   "custom tracker" command-mapping section): the five keys compose with it, not
   replace it. `tracker:` adds exclusive selection; free-form verb mappings keep
   working both without a `tracker:` key (ladder rung 1, as today) and as the
   mechanics source for an unknown `tracker:` value. The README section is amended
   to state this (see Documentation).

   Conflicting config (`tracker: github` plus populated Linear keys) is not an
   error: `tracker:` wins, the other keys are inert. Malformed non-`tracker` keys
   are treated as absent.
3. **Quick-reference verb table** - read (`--with-comments`, `--with-comment-threads`,
   `--with-attachments`), search, list (assignee/status/team filters, `--parent`),
   create (title positional, `--team` required, `--parent-ticket` for sub-issues,
   explicit `--status`), update (status/assignee/labels/due-date/relations),
   discuss/reply/edit, labels/teams/users/cycles list, attachments, `files upload`.
   Workspace-specific values appear only as placeholders bound to the override keys
   (e.g. `--team <default team>`); no real urlKey, team prefix, or email anywhere.
4. **The six gotchas** (each a named rule):
   - Comment edit is a rewrite with no visible history - amend by fetching the old
     body and passing `OLD + "\n\n" + ADDITION`; surface the overwrite diff first.
   - `reply` targets must be root comments (`parentId: null`); non-root targets fail
     with a misleading validation error. To respond in-thread, resolve the reply's
     root thread (via `discussions`/`--with-comment-threads`) and `reply` to that
     root, or start a new `discuss` thread. `edit-reply` is NOT a reply fallback - it
     rewrites an existing reply; use it only for an explicitly requested edit of the
     caller's own reply, behind the rewrite-confirmation rule.
   - `@ABC-123` never resolves via the CLI/API - use the full issue URL
     (`https://linear.app/<workspace urlKey>/issue/<id>`), which unfurls to a native
     badge and records a relation.
   - Images go inline: `linearis files upload <path>` -> `![alt](<assetUrl>)` in the
     body; `attachments create` only links a URL and renders no image; read-returned
     asset URLs are short-lived signed JWTs - re-upload, never re-paste.
   - Relation flags on `create`/`update` (`--blocks`, `--blocked-by`, `--relates-to`,
     `--duplicate-of`) are single-value - repeating one in a call keeps only the last.
     For multiple relations in one call use `linearis issues relations add <id>` with
     its comma-separated flags; otherwise issue separate `update` calls.
   - `create`'s title is positional; there is no `--title` flag.
5. **Multi-line bodies** - write to a temp file, pass `"$(cat FILE)"` with a quoted
   heredoc delimiter; inline heredoc-in-arg fails intermittently.
6. **ID-cache convention** - active only when `id cache:` is set; the key's value is
   a repo-relative markdown file. Row contract: one table per entity kind (teams,
   users, projects), each row = display name/key + ID, rows sorted within their
   table; a missing or empty file means every lookup is a miss and the first
   write-back creates the structure. Behavior: check the cache before any
   `linearis teams list`/`users list`/`projects list` resolution; on miss, resolve
   via the narrowest list command and add the row; on a rejected/stale cached ID,
   re-resolve and update or remove the row. Write timing by caller: standalone
   invocation writes the row and reports it; when the calling workflow requires a
   clean checkout or forbids repo edits (e.g. chase-bug's read-only discovery),
   use the resolved value and report the exact pending row without writing; on an
   unwritable cache, complete the operation and report the failed write-back.
7. **JSON output note** - operational/data subcommands emit JSON (pipe to `jq`;
   don't assume column output); `usage` subcommands emit plaintext help. Safety
   rules: confirm destructive ops (delete/archive/comment rewrite, bulk >3), never
   paste tokens, never rewrite an issue description unasked - in addition to the
   standalone write gate above.
8. **Failure-mode table** - 401/auth, issue-not-found (workspace/archived),
   status-not-found (list team states), missing `--team`, case-sensitive search,
   cannot-edit-others'-comments, reply validation error, literal `@ID` text,
   slow big-ticket reads.
9. **Discovery pointers** - `linearis usage`, per-domain `usage` subcommands, and
   Linear's LLM docs index `https://linear.app/llms.txt` for product behavior the
   CLI doesn't expose.
10. **"Project overrides" trailer** - the standard 3-location ladder, in the
    chase-bug style that names its extension points: `## Issue tracker` is this
    skill's named extension point (the sibling trailers are not byte-identical, so
    the spec names the variant rather than saying "verbatim").

Explicitly not ported from the gridstrong skill: workspace identity (urlKey
`gridstrong`, team `E`), the hardcoded `doc/cache/linear.md` ownership prose (the
path is now the `id cache` key's value), `.agents/skills/linear/lib/linearis.sh`
references (repo-local script, stays in gridstrong), gridstrong-sized full-refresh
limits, and gridstrong-specific routing lines.

### 2. Consumer-skill changes (shape-ticket, check-delivery, chase-bug)

Each tracker-facing skill keeps its Linear knowledge to routing/selection only -
verb tables, flags, and failure modes move out. Two shared elements:

- **Ladder step 0** (inserted before the existing rung 1 of each ladder), carrying
  the `tracker:` rule self-contained (it cannot rely on `/skill:linear`, which must
  not load for non-Linear values): "If the overrides `## Issue tracker` section has
  a `tracker:` key (case-insensitive), that tracker is exclusive - no probing for
  others, no ask, others never mentioned. `none` -> skip tracker steps (this skill's
  no-tracker outcome below). Unknown value -> exclusive; use free-form command
  mappings in the same section if present, else ask. Unparseable `tracker:` line ->
  ask, never probe." This step is a compact rule, not a one-liner; duplicating the
  routing rule across the three ladders is accepted - the no-duplication constraint
  covers linearis *mechanics*, which stay in `skills/linear/`.
- **Routing line** (replacing each rung 3's inline linearis *description*, not its
  detection): "Tracker resolves to Linear -> load `/skill:linear` before the first
  `linearis` call; all verbs, flags, and failure modes live there." **Rung 3 keeps
  its zero-config Linear detection** (linearis binary on PATH + cheap auth read, and
  the `ABC-123` vs `#N` ref-style inference) - deleting it would leave nothing for
  the routing line to fire on in an unconfigured Linear repo. Only the verb rows and
  flag documentation are removed.

Per-consumer `tracker: none` / selected-but-unavailable outcomes (existing
degradation conventions, now named):

| Skill | `tracker: none` | selected tracker unavailable (e.g. `tracker: linear`, no linearis/MCP) |
|---|---|---|
| shape-ticket | run the full authoring pipeline; emit the finished title/body/metadata for manual filing (its existing no-verb degradation), reported as not filed | stop after authoring; emit for manual filing; report the unavailable backend - no fall-through, no ask about other trackers |
| check-delivery | delivery verification is tracker-bound: report the run as skipped-no-tracker (its existing no-target convention) | missing read capability = its existing STOP; missing write = its existing degrade-to-manual |
| chase-bug | prior-report search declared not completed; response channel degrades to manual copy-paste | same |

Per-skill specifics:

- **shape-ticket**: the `linearis` column of the "Default verb table" is removed
  (table becomes gh-only; gh verbs unchanged); the `linearis create requires --team`
  line is deleted (owned by the linear skill's schema); rung 3 of the capability
  ladder drops its inline linearis probe description in favor of the routing line.
  The tracker-agnostic contract paragraph (read/write/comment/search/native-ref) and
  all degradation behavior (no-comment-verb -> manual emission) stay untouched.
- **check-delivery**: same treatment of its "Zero-config verb table" (gh column
  stays); the hard-stop-on-missing-read and degrade-write-to-manual semantics stay
  untouched; ladder rung 3's `linearis` mention is replaced by the routing line.
- **chase-bug**: prior-report-search ladder (step 2) and response-channel ladder
  (step 5) both gain ladder step 0; the `## Response channels` example line
  `linear-ticket: linearis comment <id> <draft>` becomes
  `linear-ticket: linearis issues discuss <id> --body <draft> (mechanics: /skill:linear)`;
  the default response-channel ladder's "tracker ticket origin + a tool/CLI for it"
  rung routes Linear origins through `/skill:linear`.

The human-channel write gates (exact-text confirmation before posting) remain in the
consumer skills; when routed from them, `/skill:linear` executes only
already-confirmed text without re-gating. Standalone invocation carries its own
exact-text gate (section 1).

### 2b. Gatherer off-switch compliance

`skills/brainstorming/gatherer.md`'s context-builder trigger treats any tracker
tool/MCP on PATH as a "fetch path" and never consults `tracker:` - so a
`tracker: github` repo with a globally installed linearis would still fetch
Linear-shaped IDs, leaking through the off-switch. In scope (one-line fix): the
trigger rule's fetch-path definition is amended to exclude trackers ruled out by an
overrides `tracker:` key (an ID for an excluded tracker is listed as an unfetched
ref, the existing no-fetch-path behavior). This is the only brainstorming/gatherer
edit; the rest of their tracker behavior is untouched.

### 3. Marketplace and CI

- `.claude-plugin/marketplace.json`: append `"./skills/linear"` to
  `plugins[0].skills` and mention it in the plugin `description` string alongside the
  existing four. `scripts/ci.mjs` needs no change - it validates any allowlisted
  entry generically (directory exists, `SKILL.md` frontmatter, bundle-local `.md`
  reference integrity) and hardcodes no skill count.
- Claude Code exposure qualifies under the AGENTS.md harness-fallback rule: the skill
  body is CLI/bash + the MCP fallback paragraph, with zero pi-bound tools.

### 4. Documentation

- **README.md**: skill-catalog entry for `linear`; a short setup subsection
  (mandatory: linearis installed + authenticated, or an MCP fallback; optional: the
  five `## Issue tracker` override keys - pointer to the skill body for the schema,
  documented once there); the "Use from Claude Code" section's skill list gains
  `linear` (now five exposed skills). Specific stale lines to amend: the catalog
  tally/split ("**16 skills** ... Twelve activate automatically ... Four more are
  explicit-invocation-only" - becomes 17, with `linear` on the automatic side), the
  Claude Code smoke-test step ("Confirm exactly four skills are registered" ->
  five), and the existing `## Issue tracker` custom-tracker contract section
  (amended with the coexistence rule from Design 1.2, not replaced).
- **AGENTS.md**: amend the marketplace paragraph ("exactly four skills" -> five, and
  the allowlist widening criterion example) and the skills-coverage tally
  ("total shipped skills: 16" -> 17; `linear` joins the original-skills list).
- **CHANGELOG.md**: minor-release entry (new skill + off-switch + consumer-skill
  slimming + marketplace exposure).

## Not in scope

- Consumer-repo slimming (gridstrong's local `linear` skill, its overrides
  `## Issue tracker` migration to the five-key schema, `linearis.sh`) - explicitly
  deferred by issue #17 to per-repo follow-ups. Until then gridstrong's repo-local
  `linear` skill shadows/coexists with the package one; that interaction is accepted
  and resolved by the follow-up, not here.
- Brainstorming/gatherer tracker behavior beyond the one-line fetch-path amendment
  in section 2b (their broader routing and degradation are untouched).
- Runtime behavioral tests of the off-switch (e.g. a logging-stub `linearis`
  asserting zero invocations): prose skills are verified by static inspection in
  this repo; no test harness for skill-body runtime behavior exists or is added.
- Reimplementing linearis, GraphQL clients, or shipping any script - rejected by the
  issue; linearis stays the CLI dependency.
- Any `settings.json`/`piGauntlet.*` key - config lives solely in the gauntlet
  overrides file.
- `gatekeep-pr`: it has no tracker verb table; untouched.

## Acceptance criteria

1. `skills/linear/SKILL.md` exists, covers the six gotchas plus verb reference,
   multi-line body pattern, ID-cache convention, failure-mode table, MCP fallback,
   and the standard overrides trailer.
2. The skill body contains no workspace-specific values (no real urlKey, team
   prefix, or user email) and documents all five `## Issue tracker` keys with the
   per-key absent behavior listed above, including the `tracker:` exclusivity
   semantics (`linear` / `github` / `none` / unknown-value ask).
3. shape-ticket's and check-delivery's verb tables contain no `linearis`
   invocations; both ladders carry step 0 and the routing line; gh verbs unchanged.
4. chase-bug's ladders carry step 0; its response-channel example uses the real
   verb routed through `/skill:linear`; no other linearis mechanics remain in it.
5. Duplication grep contract - `rg -n "linearis" skills/` outside `skills/linear/`
   matches ONLY this literal allowed list: shape-ticket - routing line + rung 3's
   detection mention; check-delivery - routing line + rung 3's detection mention;
   chase-bug - routing line + the `## Response channels` example line
   (`linear-ticket: linearis issues discuss <id> --body <draft> (mechanics: /skill:linear)`).
   No verb tables, flag documentation, or failure modes outside `skills/linear/`.
   (Step-0 text contains no `linearis` token and never matches.)
6. `.claude-plugin/marketplace.json` `plugins[0].skills` includes `./skills/linear`;
   `npm test` (`scripts/ci.mjs`) passes.
7. Genericity grep from AGENTS.md (`rg -ni "gridstrong|jjuraszek|/Users/[^/]+" skills/`)
   returns zero matches.
8. README, AGENTS.md, and CHANGELOG amendments from the Documentation section land in
   the same change, including README's catalog tally/split, Claude Code smoke-test
   count, and `## Issue tracker` coexistence amendment.
9. `skills/brainstorming/gatherer.md`'s fetch-path definition excludes trackers
   ruled out by an overrides `tracker:` key (section 2b).

## Testing approach

Static verification only (prose-skill change, repo convention):

- `npm test` - marketplace allowlist + frontmatter + bundle-local `.md` refs.
- The genericity grep (AC 7) and duplication grep (AC 5), both repeatable by the
  conformance gate.
- Post-merge manual smoke in a Linear-enabled consumer: one `linearis issues read`
  through the package skill confirming override-key resolution (not a gate for this
  repo's CI).

## Documentation impact

- Feature / user-facing docs introduced: `skills/linear/SKILL.md` (the skill body is
  the feature); README `linear` catalog entry + setup subsection
- Materially amended existing docs: `README.md` (catalog, setup, Claude Code list),
  `CHANGELOG.md` (minor release entry)
- Derived / memory docs invalidated: `AGENTS.md` (marketplace "exactly four skills"
  paragraph; "total shipped skills: 16" tally)
