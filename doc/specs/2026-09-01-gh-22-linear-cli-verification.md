# gh-22: Linear skill CLI-invocation correction and drift resistance

Ticket: [jjuraszek/pi-gauntlet#22](https://github.com/jjuraszek/pi-gauntlet/issues/22)
Verified against: `linearis 2026.7.0`, swept 2026-09-01.

## Context

`skills/linear/SKILL.md` is the single home for Linear mechanics in this package
(`doc/specs/2026-08-31-gh-17-linear-skill.md`); consumer skills (`shape-ticket`,
`check-delivery`, `chase-bug`) route to it rather than restating verbs. Its section 3
quick-reference table is a hand-written snapshot of the `linearis` CLI surface, with no
mechanism keeping it aligned with the installed binary.

## Problem

The snapshot has drifted. The reported defect is one row, but an executed sweep of every
`linearis` invocation in the file against `--help` found seven mismatches, three of which are
prose claims in section 4, not just table text. A wrong invocation in a mechanics skill is worse than an
absent one: the agent runs it, gets a usage error, and has no rule telling it the skill is
the stale party.

## Goals

1. Every `linearis` command path, positional, and flag in `skills/linear/SKILL.md` matches
   the installed CLI's `--help`, including the prose in section 4 that narrates those
   invocations.
2. The skill degrades gracefully when the snapshot drifts again: it consults the installed
   CLI, prefers it, and reports the drift to the user.

## Non-goals

- No restructuring of the skill (sections, ownership, override schema) - gh-17's design stands.
- No CI check diffing the table against `--help`. (`--help` needs only the binary, not a token -
  verified with `LINEAR_API_TOKEN` unset - so the rationale is installation/version stability in
  CI, not auth.)
- No auto-repair of the skill file at runtime. Drift is reported, never silently patched.
- No changes to consumer skills. `skills/chase-bug/SKILL.md:267`
  (`linearis issues discuss <id> --body <draft>`) was swept and is correct.

## Sweep evidence (executed CLI only)

Source of truth: `linearis <path> --help` executed locally on 2026-09-01, `linearis --version`
= `2026.7.0`. No context7, no web docs, no model memory - per ticket AC4.

Mismatches found (line numbers against pre-change `skills/linear/SKILL.md`):

| Line | Documented | `--help` (verbatim usage line) |
|---|---|---|
| 91 | `issues comment-edit <id> --body` | subcommand absent; `Usage: linearis issues edit [options] <comment>` - "edit a root discussion or reply comment" |
| 91 | `issues edit-reply <id> --body` | `Usage: linearis issues edit-reply [options] <reply>` |
| 90 | `issues reply <id> --body` | `Usage: linearis issues reply [options] <thread>` + "Important: `<thread>` must be a root discussion thread ID." |
| 125 | gotcha (e) implies `relations add` shares the `create`/`update` relation flags | `Usage: linearis issues relations add [options] <issue>` with `--blocks / --related / --duplicate / --similar` (each comma-separated). No `--blocked-by`. |
| 94 | `files upload <path>` | `Usage: linearis files upload [options] <file>` |
| 93 | `attachments create <id> --url <url>` | `Usage: linearis attachments create [options] [issue]`; positional optional, `--issue <issue>` alias; `--url` valid |
| 117 | gotcha (d): `linearis files upload <path>` | same `<file>` positional as line 94 - the second occurrence of that mismatch |

Swept and confirmed correct (no edit): `issues read` (`--with-comments`,
`--with-comment-threads`, `--with-attachments`), `issues search`, `issues list`
(`--assignee/--status/--team/--parent`; `--status` requires `--team`), `issues create`
(positional title, required `--team`, `--parent-ticket`, `--status`), `issues update`
(`--status/--assignee/--labels/--due-date` plus relation flags
`--blocks/--blocked-by/--relates-to/--duplicate-of/--similar-to` and `--remove-relation`),
`issues discuss <issue>`, `labels|teams|users|cycles|projects list`, `auth status`,
`linearis usage`, `linearis issues usage`.

One retained claim is **behavior-asserted, not help-verified**: gotcha (e)'s "repeated relation
flags keep only the last value" on `create`/`update`. `--help` shows the flags but not repeat
semantics; the claim is carried from gh-17's observed behavior and is labelled as such in the
skill.

Implementation re-runs this sweep against the edited file and records the result; this table
is the record for the ticket's transcript requirement.

## Design

### A. Corrections in section 3 (quick reference)

| Verb | Corrected command |
|---|---|
| Reply | `linearis issues reply <thread> --body "<text>"` - `<thread>` is a root discussion thread ID, not an issue ID |
| Edit | `linearis issues edit <comment> --body "<text>"` / `linearis issues edit-reply <reply> --body "<text>"` |
| Attachments | `linearis attachments create [<issue>] --url <url>` - positional optional, `--issue` alias |
| Upload | `linearis files upload <file>` |

(`attachments create`'s `--issue` alias is documented in the table's Notes column; gotcha (d) is
about rendering, not syntax, and does not repeat it.)

### B. Corrections in section 4 (prose the sweep contradicts)

- **Gotcha (b)** is restated in the CLI's vocabulary: `reply`'s target is a **root discussion
  thread ID**; a non-root target fails with a misleading validation error. Resolution path
  (`--with-comment-threads` / discussions, or start a new `discuss` thread) is unchanged, as is
  the clause that `edit-reply` is not a reply fallback.
- **Gotcha (d)** keeps its rendering content unchanged; only its invocation is corrected to
  `linearis files upload <file>` (the line-117 occurrence of the line-94 mismatch).
- **Gotcha (e)** is split into two distinct flag sets rather than one: `create`/`update` take
  single-value `--blocks/--blocked-by/--relates-to/--duplicate-of/--similar-to` (last value
  wins if repeated); `relations add <issue>` takes a **different, smaller** comma-separated set
  `--blocks/--related/--duplicate/--similar` with **no `--blocked-by`** - express that direction
  by inverting the relation or using `update`. `update --remove-relation` is named. The
  last-value-wins clause is retained but marked as observed behavior, not `--help`-derived.
- **Section 8's `Reply validation error` row** adopts the same vocabulary: the target is not a
  root discussion thread.

### C. Drift resistance (distributed across existing anchors)

Placement is deliberate: an obligation that fires at setup is written in the setup section, not
collected into a new mid-file section the agent reads after it has already acted.

**Section 1 (setup)** - `linearis` on PATH + authenticated becomes the *preferred* path, not a
precondition for the session. One rule, stated identically here and in the edge-case table:
**MCP is the fallback for a missing binary only** (`command -v linearis` fails), unchanged from
today. An installed-but-unauthenticated `linearis` reports the auth failure and continues
degraded - it does not silently reroute to MCP, because the user's fix is to re-auth. Neither
path hard-stops the agent; Linear functionality is crippled, the run is not blocked. When `linearis` is present and authenticated, run `linearis issues usage` **once per
session** before the first issue operation and treat its output as ground truth over the
section 3 table.

Ordering guard: the sweep sits **inside** the branch that already probes, strictly after the
preamble gauntlet-overrides check (the unnumbered block before section 1). `tracker: github | none | <unknown>` still means zero
probing - no `command -v`, no `auth status`, no sweep. The rule adds no new probe surface and
cannot re-enable a disabled tracker.

**Section 3** - one visible line under the table (visible text, not an HTML comment: Claude
Code renders this skill too):

> Snapshot verified against `linearis 2026.7.0` (2026-09-01). The installed CLI's
> `usage`/`--help` is ground truth; when they disagree, follow the CLI and tell the user this
> table is stale.

**Section 8 (failure modes)** - one backstop row for the domains `issues usage` does not cover
(`attachments`, `files`, `labels`, `teams`, `users`, `cycles`, `projects`, `auth`):

| Symptom | Cause | Fix |
|---|---|---|
| Parser-shape failure on a documented invocation: unknown command/option, unexpected argument | Section 3's snapshot may have drifted from the installed CLI | Re-read that subcommand's `--help`; report the row stale **only if** help actually contradicts it, then follow help |

The trigger is deliberately narrow. Data, auth, status-name, and root-thread validation errors
already have their own rows and are **not** drift - misrouting them to "the skill is stale"
would misdiagnose ordinary failures.

Cost: one extra local CLI call per session, on the Linear path only.

## Error and edge cases

| Case | Behavior |
|---|---|
| `linearis` absent | Existing MCP fallback; no sweep; no hard stop. |
| `linearis` present, `auth status` fails | Report, continue degraded; no sweep, and no MCP reroute (MCP covers a missing binary only - see section 1). |
| `issues usage` errors or returns nothing | Note once that the table is unverified this session; continue with the table. |
| MCP path in use | Sweep skipped - `usage` is a CLI concept the MCP server does not expose. |
| Overrides set a non-Linear `tracker:` | Skill stops at the preamble override check; sweep never reached. |
| Drift found mid-session | Follow `--help`, complete the operation, report which row is stale. Never edit the skill file to "fix" it during a run. |

## Deviations from the ticket's acceptance criteria

The ticket's four acceptance criteria, verbatim:

1. "`rg -n "comment-edit" --glob '!CHANGELOG.md'` at the pi-gauntlet repo root returns zero
   matches"
2. "The Edit row in `skills/linear/SKILL.md` documents `linearis issues edit <comment> --body
   "<text>"` (positional `<comment>` as shown by `linearis issues edit --help`) and still lists
   `linearis issues edit-reply <id> --body "<text>"`"
3. "Every `linearis` subcommand path, positional argument, and flag referenced anywhere in
   `skills/linear/SKILL.md` appears in the installed CLI's `--help` output for that command
   path; the verification transcript (`--help` outputs plus the CLI version) is attached to this
   ticket, and any mismatch found is fixed in the skill within this ticket"
4. "The sweep's source of truth is the executed CLI only - no context7, web documentation, or
   model memory is cited as verification evidence"

Deviations, surfaced per the brainstorming ticket-handling rule; the ticket is guidance, the CLI
and the user's decisions govern.

1. **AC1** (`rg -n "comment-edit" --glob '!CHANGELOG.md'` returns zero) is unachievable as
   literally written and was already false before this change: `doc/specs/2026-08-31-gh-17-linear-skill.md`
   records `comment-edit-is-rewrite` as history, and this spec quotes the defect. Immutable
   records are not the guidance surface. The check applied instead:
   `rg -n "comment-edit" skills/` returns zero matches.
2. **AC2** asks the Edit row to "still list `linearis issues edit-reply <id>`". The executed help
   names that positional `<reply>`, and AC3/AC4 make the CLI authoritative; the row uses
   `<reply>`. `edit-reply` itself is retained, as AC2 requires, along with the gh-17 "full
   rewrite, no history" note.
3. **AC3** asks for the transcript "attached to this ticket". Per the user's decision at the
   brainstorming gate, the record lives in this spec (dated, version-stamped) and is summarized
   in the commit body; no comment is posted to issue #22. Any later ticket comment remains a
   gated human-channel write.

## Testing

No harness exists for skill prose; verification is executed transcript plus static checks.

1. `npm test` (`scripts/ci.mjs`) passes. The linear skill is already in the Claude Code
   allowlist and `linear.md` is ref-excluded at `scripts/ci.mjs:257`; no new `.md` reference is
   introduced, so the marketplace surface is unchanged.
2. Generic-skill grep from `AGENTS.md` over `skills/`, with this repo's concrete patterns
   substituted for the fork placeholders: `rg -ni "jjuraszek|/Users/[^/]+" skills/` - zero
   matches.
3. **Re-run the sweep against the edited file**: for every `linearis` invocation the skill
   documents, execute that subcommand's `--help` and diff command path, positionals, and flags.
   Pass = zero mismatches. Record the CLI version with the result.
4. `rg -n "comment-edit" skills/` returns zero matches (AC1 as scoped above).
5. Read-through of the three consumer skills confirms no **new or duplicated** Linear mechanics
   landed in them (gh-17 invariant). The one pre-existing allowed match,
   `skills/chase-bug/SKILL.md:267`, stays as a routing example.

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md:265` (`linear` setup described as "mandatory -
  `linearis` installed and authenticated") contradicts the relaxed section 1 and is reworded to
  preferred-not-required
- Derived / memory docs invalidated: none (`AGENTS.md` describes the skill's existence and its
  marketplace exposure; neither changes)

`skills/linear/SKILL.md` is the deliverable itself - implementation surface, not a doc-impact
entry - per the materiality bar at `skills/brainstorming/reference/documentation-impact.md`.

CHANGELOG: deferred to the release commit. Semver read: **patch** (defect fix plus a
non-breaking advisory rule).

## Open questions

None blocking. One accepted residual: the stamp records the version swept on the author's
machine, so a consumer on a different `linearis` build relies on the section 1 sweep and the
section 8 backstop rather than the stamp being true for them - which is exactly what those two
rules exist for.
