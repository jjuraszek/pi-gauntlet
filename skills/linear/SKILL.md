---
name: linear
description: Use when reading, searching, commenting on, editing, or managing Linear tickets via the `linearis` CLI - ticket IDs like ABC-123, "check ticket ABC-99", "move ABC-12 to done", or when a tracker-facing skill routes Linear mechanics here. Authoring a NEW ticket (structure, acceptance criteria) belongs to /skill:shape-ticket, which calls this skill's create mechanic.
---

# Linear

Before anything else, resolve overrides: read the gauntlet overrides file's
`## Issue tracker` section. If `tracker:` resolves to a non-Linear value, announce
that Linear is off per overrides and stop - no `command -v linearis`, no auth call,
no ask. An unknown or unparseable `tracker:` value never reaches setup either:
resolve it per the four-state table in section 2 (free-form mappings or ask) before
any probe. Loading this skill is not probing; the zero-probe guarantee holds even
when a stray ticket-ID mention auto-triggered it.

**Write gate.** On standalone invocation, every human-channel write (create, body
update, comment/reply, state change with visible effect) is gated on explicit user
confirmation of the exact text. When routed from a tracker-facing skill that already
confirmed the exact payload, do not re-confirm an unchanged payload; any payload
this skill alters re-gates.

## 1. Setup

Mandatory: `linearis` on PATH and authenticated (`linearis auth status`). Token
resolution order: `--api-token`, `LINEAR_API_TOKEN`, `~/.linearis/token`.

> **No `linearis` installed?** If `command -v linearis` fails, fall back to a
> **Linear MCP server** when the harness has one configured - its tools cover the
> same operations (read, list/search, comment, update status, create). Tool names
> vary by harness and by the server's configured name, so consult the harness's
> own tool list rather than hard-coding identifiers; the JSON/jq and command
> examples below are then guidance for the equivalent MCP call, not literal
> shell. pi-gauntlet ships no MCP setup; MCP is opportunistic.

No `linearis` and no MCP: report inability, never fabricate.

Optional: each `## Issue tracker` override key below, with its degradation.

## 2. `## Issue tracker` schema

This skill owns the full schema - all five keys, all optional:

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

`tracker:` matching is case-insensitive for the known values. Four states:

| `tracker:` state | Behavior |
|---|---|
| known value (`linear` / `github` / `none`) | Exclusive: no probing for other trackers, no ask, others never mentioned. `github` -> linearis never probed, this skill never proceeds past its override check. `none` -> tracker steps skipped; each consumer skill uses its documented no-tracker outcome. |
| unknown value (e.g. `jira`) | Exclusivity holds (no Linear/gh probing). If the same `## Issue tracker` section carries free-form command mappings for that tracker, use them; else say so and ask - never silently fall back to the detection ladder. |
| key absent | Consumer skills use their detection ladder, unchanged from today (including the linearis PATH+auth probe). |
| key present but unparseable | Treat as an off-switch attempt gone wrong: ask the user, never probe - a typoed off-switch must not silently re-enable detection. |

**Coexistence with the free-form `## Issue tracker` contract.** The five keys
compose with the pre-existing README custom-tracker command-mapping convention,
they don't replace it. `tracker:` adds exclusive selection; free-form verb mappings
keep working both without a `tracker:` key (ladder rung 1, as today) and as the
mechanics source for an unknown `tracker:` value.

**Conflicting config** (e.g. `tracker: github` plus populated Linear keys) is not an
error: `tracker:` wins, the other keys are inert. Malformed non-`tracker` keys are
treated as absent.

## 3. Quick reference

| Verb | Command | Notes |
|---|---|---|
| Read | `linearis issues read <id> --with-comments --with-comment-threads --with-attachments` | Add flags only for what you need - big tickets are slow. |
| Search | `linearis issues search "<query>"` | Case-sensitive. |
| List | `linearis issues list --assignee <who> --status <status> --team <default team> --parent <id>` | Filters compose; `--parent` lists sub-issues. |
| Create | `linearis issues create "<title>" --team <default team> [--parent-ticket <id>] --status <status>` | Title is positional (no `--title`); `--team` required; `--parent-ticket` for sub-issues; state an explicit `--status` rather than relying on the default. |
| Update | `linearis issues update <id> --status <status> --assignee <who> --labels <labels> --due-date <date> [relation flags]` | See gotcha (e) for relation flags. |
| Discuss | `linearis issues discuss <id> --body "<text>"` | Starts a new top-level comment thread. |
| Reply | `linearis issues reply <id> --body "<text>"` | Root comments only - see gotcha (b). |
| Edit | `linearis issues comment-edit <id> --body "<text>"` / `linearis issues edit-reply <id> --body "<text>"` | Full rewrite, no history - see gotcha (a). |
| Labels, teams, users, cycles | `linearis labels list`, `linearis teams list`, `linearis users list`, `linearis cycles list` | Use to resolve names to IDs; see id-cache convention. |
| Attachments | `linearis attachments create <id> --url <url>` | Link-only, no inline render - see gotcha (d). |
| Upload | `linearis files upload <path>` | Returns an `assetUrl` for inline embedding - see gotcha (d). |

Workspace values above (`<default team>`, `<who>`, etc.) are placeholders bound to
the override keys in section 2 - never a real urlKey, team prefix, or email.

## 4. Gotchas

a. **Comment edit is a rewrite, no visible history.** To amend rather than replace,
   fetch the old body and pass `OLD + "\n\n" + ADDITION`; surface the overwrite diff
   to the user before pushing.

b. **`reply` targets must be root comments** (`parentId: null`). A non-root target
   fails with a misleading validation error. To respond in-thread, resolve the
   thread's root via `discussions`/`--with-comment-threads` and `reply` to that
   root, or start a new `discuss` thread instead. `edit-reply` is NOT a reply
   fallback - it rewrites an existing reply. Use it only for an explicitly
   requested edit of the caller's own reply, behind the rewrite-confirmation rule
   in (a).

c. **`@ABC-123` never resolves via the CLI/API.** Use the full issue URL
   `https://linear.app/<workspace urlKey>/issue/<id>`, which unfurls to a native
   badge and records a relation. A literal `@ID` in a body stays literal text.

d. **Images go inline, links don't render.** `linearis files upload <path>` ->
   `![alt](<assetUrl>)` in the body embeds the image. `attachments create` only
   links a URL and renders no image. Asset URLs returned by a `read` are
   short-lived signed JWTs - re-upload for a fresh one, never re-paste an old one.

e. **Relation flags are single-value.** `--blocks`, `--blocked-by`, `--relates-to`,
   `--duplicate-of` on `create`/`update` keep only the last value if repeated in one
   call. For multiple relations in one call, use
   `linearis issues relations add <id>` with its comma-separated flags; otherwise
   issue separate `update` calls.

f. **`create`'s title is positional.** There is no `--title` flag.

## 5. Multi-line bodies

Write the body to a temp file and pass it as `"$(cat FILE)"`, with a quoted heredoc
delimiter if a heredoc is used to produce the file. Inline heredoc-in-arg
(embedding a heredoc directly inside a CLI argument) fails intermittently.

## 6. ID-cache convention

Active only when `id cache:` is set; its value is a repo-relative markdown file.

- **Row contract:** one table per entity kind (teams, users, projects); each row is
  display name/key + ID; rows are sorted within their table. A missing or empty
  file means every lookup is a miss, and the first write-back creates the
  structure.
- **Lookup:** check the cache before any `linearis teams list` / `users list` /
  `projects list` resolution. On a miss, resolve via the narrowest list command and
  add the row. On a rejected/stale cached ID, re-resolve and update or remove the
  row.
- **Write timing by caller:** standalone invocation writes the row and reports it.
  A calling workflow that requires a clean checkout or forbids repo edits (e.g.
  read-only discovery) uses the resolved value and reports the exact pending row
  without writing it. An unwritable cache -> complete the operation and report the
  failed write-back.

## 7. Output format and safety

Operational/data subcommands emit JSON - pipe to `jq`, don't assume column output.
`usage` subcommands emit plaintext help.

Safety rules, in addition to the write gate above:

- Confirm destructive ops (delete, archive, comment rewrite, bulk changes > 3
  items).
- Never paste tokens.
- Never rewrite an issue description unasked.

## 8. Failure modes

| Symptom | Cause | Fix |
|---|---|---|
| 401 | Not authenticated / expired token | `linearis auth status`; re-auth. |
| Issue not found | Wrong workspace, or issue archived | Confirm workspace; check archived state. |
| Status not found | Status name doesn't match the team's workflow states | List the team's states before setting one. |
| Missing `--team` error on create | `--team` is required | Supply `--team <default team>`. |
| Search returns nothing unexpected | Search is case-sensitive | Retry with matching case. |
| Cannot edit a comment | Comment belongs to another user | Reply instead of editing. |
| Reply validation error | Target is not a root comment | See gotcha (b). |
| `@ID` shows as literal text | `@ABC-123` mentions don't resolve | Use the full issue URL (gotcha c). |
| Read is slow | Big ticket with many comments/attachments | Drop `--with-*` flags not needed. |

## 9. Discovery pointers

`linearis usage`, each domain's own `usage` subcommand (e.g.
`linearis issues usage`), and Linear's LLM docs index `https://linear.app/llms.txt`
for product behavior the CLI doesn't expose.

## Project overrides

If a gauntlet overrides file exists - checked in order: `.pi/gauntlet-overrides.md`, `<repo root>/gauntlet-overrides.md`, `<repo root>/doc/gauntlet-overrides.md`; first found wins - read it. Any sections relevant to this skill - by name match, by topic (routing, verification, worktrees, etc.), or by workflow convention - override or extend the instructions above. Project-local `AGENTS.md` is already in context - check it for project-specific routing tables, service paths, and verification commands. `## Issue tracker` is the named extension point for this skill.
