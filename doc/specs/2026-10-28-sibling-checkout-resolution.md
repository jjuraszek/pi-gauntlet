# shape-ticket: sibling lines name a repository, resolved beside the primary checkout

**Goal:** `## shape-ticket` `- sibling:` lines name a repository by clone URL instead of a local path; shape-ticket resolves each to `<primary checkout parent>/<name>`, verifies the checkout's identity, and reports a missing or wrong checkout with the exact path and clone command - never as a stop and never by cloning.
**Amend-grant:** every later spec amendment in this flow (corrected facts, paths, verification lines, and scope, acceptance-criteria, or public-contract edits alike) applies without asking; only a redraw (changed problem statement, component added, removed, or re-bounded) still stops for you, and the grant never stands in for a spec approval.
**Engine:** waves
**Predecessor:** `doc/specs/2026-10-23-shape-ticket-batch-repair-audit.md`, scope: `### Overrides contract` (the `- sibling: <path relative to the repo root>` grammar) and the `Sibling: <path> - not found` line in `## Errors and edge cases`.

## Problem

The `- sibling:` line under `## shape-ticket` in the gauntlet overrides file is `<path relative to the repo root>` (`skills/shape-ticket/SKILL.md:302`, `skills/shape-ticket/reference/repo-audit.md:11`, `README.md:334`). Its only reader is shape-ticket's repository audit, which passes the path to the audit scout; an absent directory renders `Sibling: <path> - not found` and the run continues (`repo-audit.md`, predecessor spec line 129). The overrides file is committed, so the line is shared by every member of a team, but it carries no remote: a member who has not cloned that repository gets a silent `not found` with no hint of what to clone or where. The user's ask was that the line should name a git repository rather than a checkout, with a sibling directory of the same name as the default location.

Two facts constrain the design. First, no skill, agent, or extension in this package clones a repository (zero `git clone` / `gh repo clone` uses; `git remote get-url origin` appears only to derive `owner/name` from an existing checkout at `repo-audit.md:81`, `brainstorming/reference/ticket-acceptance.md:7`, `brainstorming/reference/pr-subject.md:13`), so a clone fallback would be a new capability with network, auth, ref, and cleanup concerns. Second, shape-ticket anchors "repo root" on `git rev-parse --show-toplevel` (`repo-audit.md:5`), which inside a linked worktree returns the worktree directory, so a relative sibling path resolved there lands under `.worktrees/`; `home:` in `## using-git-worktrees` resolves against the primary checkout instead (`README.md:325`).

The user's "checkout shouldn't be mandatory if brainstorming doesn't touch this sibling repo" is a stated constraint: a missing sibling stays a report line, never a stop.

Framing: pivoted to identity-only - the line names the repository, resolution derives the location beside the primary checkout, a missing checkout is reported with what to clone and where; no clone capability (user reply B to the framing question). The path form is dropped as a breaking change (user: "not that much used right now so we can break it").

## Acceptance criteria

Drafted from the design, no ticket rows:

- [ ] With `- sibling: git@github.com:acme/viewer.git` under `## shape-ticket` and a checkout at `<primary parent>/viewer` whose origin is that repository, a shape-ticket audit run from a linked worktree of the primary reads `<primary parent>/viewer` and never a path under the worktree.
  in-scope
- [ ] With the same line and no directory at `<primary parent>/viewer`, the audit completes as a single-repo audit and the run's `Audit:` report (the no-op report, or the confirmation gate's `Audit:` block when a gate already opens) shows a `sibling:` line naming the URL, the expected path, and the `git clone <url> <path>` command.
  in-scope
- [ ] With the same line and a directory at `<primary parent>/viewer` whose origin is another repository, the audit does not read that directory and the run's `Audit:` report (the no-op report, or the confirmation gate's `Audit:` block when a gate already opens) shows a `sibling:` line naming the found identity and the expected identity.
  in-scope
- [ ] With `- sibling: git@example.test:team/viewer.git` and a checkout at `<primary parent>/viewer` whose origin is `https://example.test/team/viewer.git`, the audit treats the sibling as found.
  in-scope
- [ ] With the legacy line `- sibling: ../viewer`, the audit completes and the run's `Audit:` report (the no-op report, or the confirmation gate's `Audit:` block when a gate already opens) shows a `sibling:` line saying the value is not a clone URL and the accepted forms.
  in-scope

## Design

### Grammar

`## shape-ticket` carries `- sibling: <clone url>` lines, ssh (`git@host:owner/name.git` or `ssh://git@host[:port]/owner/name.git`) or https (`https://host/owner/name.git`). One parser serves both the configured value and a checkout's stored origin URL:

| Step | Rule |
|---|---|
| accepted shapes | `<scheme>://[<userinfo>@]<host>[:<port>]/<path>` with scheme `ssh`, `https`, `http`, or `git`; scp-style `[<user>@]<host>:<path>` |
| not a clone URL | anything else: no host, no path segment, a local or `file://` path (`../viewer`, `/srv/git/viewer.git`, a bare word, an empty value) |
| `NAME` | last segment of `<path>`, `.git` stripped, URL case preserved |
| `IDENTITY` | `<host>/<path>` with scheme, userinfo, and port removed, scp `host:path` turned into `host/path`, a trailing `/` and `.git` stripped, then lowercased; the whole path compares at any depth (`gitlab.example/group/sub/name` is one identity) |
| `PATH` | `<PRIMARY parent>/<NAME>` |

Example for `git@github.com:acme/viewer.git`: `NAME` `viewer`, `IDENTITY` `github.com/acme/viewer`, `PATH` `/repos/viewer` when the primary is `/repos/pi-gauntlet`. `ssh://git@github.com:7999/acme/viewer.git`, `https://user@github.com/acme/viewer`, and `git@github.com:acme/viewer.git` all normalize to `github.com/acme/viewer`; the scheme is never compared.

A configured value that is not a clone URL renders the `not a clone url` outcome below and is skipped. The checkout side reads the stored URL with `git -C <PATH> config --get remote.origin.url`, never `git remote get-url origin`: `get-url` applies `url.<base>.insteadOf` rewrites, so a local rewrite would turn a correct checkout into `wrong repo`.

### Primary checkout anchor

`PRIMARY` is the path of the first `worktree <path>` entry in `git worktree list --porcelain` run from the current directory: Git lists the main worktree first, from the main checkout and from any linked worktree alike. The Git directory's location plays no part, so a primary whose Git directory lives elsewhere (`/repos/app` with its Git directory at `/store/git/app.git`) still anchors siblings beside `/repos/app`, and a submodule checkout (`/repos/app/vendor/lib`, Git directory `/repos/app/.git/modules/lib`) anchors beside `/repos/app/vendor/lib`, never under `.git/modules`. `repo-audit.md` "Prepare the run" uses `PRIMARY` for sibling resolution only; the ticket's own repository stays `git rev-parse --show-toplevel`. From `/repos/pi-gauntlet/.worktrees/x`, a sibling resolves to `/repos/viewer`, never `/repos/pi-gauntlet/.worktrees/viewer`.

Outside a checkout, `git worktree list` fails and the existing `audit unavailable (no repository)` path applies unchanged. When the command succeeds inside a checkout but yields no `worktree <path>` entry, every configured line renders `Sibling: <url> - unresolved: no primary checkout found; expected beside it as <NAME>` and the audit continues as a single-repo audit; nothing stops.

### Responsibilities

The parent (shape-ticket, "Prepare the run") owns resolution and classification; the scout owns reading. Per line the parent applies the checks in this order and stops at the first match, so each line gets exactly one of seven outcomes:

| Order | Outcome | Check | Passed to the scout |
|---|---|---|---|
| 1 | not a clone url | the value does not parse (no host or no path segment) | the pre-rendered `Sibling:` line below, copied verbatim |
| 2 | not found | nothing exists at `PATH` | the pre-rendered `Sibling:` line, copied verbatim |
| 3 | not a checkout | `PATH` exists (file or directory) and `git -C <PATH> rev-parse --show-toplevel` fails or prints a path other than `PATH` itself (a plain directory inside an enclosing repository is not a checkout) | the pre-rendered `Sibling:` line, copied verbatim |
| 4 | no origin | `PATH` is a checkout and `git -C <PATH> config --get remote.origin.url` exits nonzero | the pre-rendered `Sibling:` line, copied verbatim |
| 5 | unparseable origin | the stored origin URL exists and the parser yields no host (a local path, `file://`) | the pre-rendered `Sibling:` line, copied verbatim |
| 6 | wrong repo | the stored origin's `IDENTITY` differs from the configured `IDENTITY` | the pre-rendered `Sibling:` line, copied verbatim |
| 7 | found | the identities are equal | the absolute `PATH`, read the same way as the home repository |

Two lines that resolve to the same `PATH` each run the same checks and each render their own outcome; no duplicate detection exists.

The parent retains its pre-rendered lines for the run (beside the brief, under `<tmp>/<ref>/`) and passes them to the scout for verbatim copy into `audit.md` so the audit artifact stays complete. The scout brief's three sibling instructions change (see Add): the scout reads each supplied absolute `PATH` the same way as the root documents, emits one `Sibling:` line per supplied path (`<PATH> - none` or `<PATH> - leg: ...`), copies each supplied pre-rendered line verbatim, and writes `Sibling: none` only when no path and no line were supplied. The six-label output contract and the non-fatal handling of an unusable audit are unchanged.

The fold table gains one row: a report-only sibling outcome (every pre-rendered line) has no draft effect and renders `sibling: <line body after Sibling:>` in the `Audit:` report. The fold reads report-only lines from the parent's retained list, never from `audit.md`, so a missing, empty, or malformed audit still renders them beside `audit unavailable (<reason>)`. Report-only `sibling:` lines join the quiet-findings list: they ride on the no-op report and open no roast, gate, write, or question on their own; they appear in the confirmation gate's `Audit:` block only when another finding already opens that gate. The grounded-leg fold row runs its origin lookup against the parent's absolute `PATH` (the scout's found token is that path) and derives the tracker repository name from the same parsed stored origin as `owner/name` (the last two path segments).

### Data flow

Overrides file -> parent parse and resolve against `PRIMARY` -> `{found absolute paths, pre-rendered lines}` into the scout brief, with the pre-rendered lines also retained by the parent -> scout writes `Sibling:` lines (own legs plus verbatim copies) in `audit.md` -> fold: grounded legs from `audit.md`, report-only lines from the parent's retained list -> one `sibling:` line per configured URL in the run's `Audit:` report. A missing or wrong checkout is visible by URL and expected path on the no-op report or, when a gate already opens, in its `Audit:` block; it is never collapsed into `audit unavailable` and never opens a gate by itself.

### Documented convention, not an enforced scheme

The README row and `repo-audit.md` state in one sentence that siblings are expected beside the primary checkout under the repository's name, that a missing one is reported with the path to clone to and never blocks, and that the committed URL names the sibling in report lines and supplies the clone hint while identity comparison ignores the clone scheme - a teammate may clone with either scheme and the next run still matches. Nothing in the flow clones, fetches, or creates a sibling.

### Remove

- The path grammar sentence at `skills/shape-ticket/SKILL.md:302` (`- sibling: <path relative to the repo root>`).
- The `- sibling: <path relative to the repo root>` paragraph in `repo-audit.md` "Prepare the run".
- The three path-form scout instructions in `repo-audit.md`: the brief sentence "Read each configured sibling checkout the same way. Report an absent sibling as `<path> - not found`." (line 42), the brief sentence "Emit one Sibling line per configured relative path. ... not found for a missing checkout. Use Sibling: none for no configured paths." (line 50), and the `<path> - not found` alternative in the output template `Sibling:` line (line 62).
- The README `## shape-ticket` row text at `README.md:334`.
- The path-form `- sibling: ../viewer`, `../missing`, `../billing` lines, the `viewer remote origin` sentence, and the three supplied `Sibling: ../...` audit lines in `eval/shape-ticket/samples/audit-grounding/case.md`.

### Add

- The URL grammar, the shared parser table, the `NAME` / `IDENTITY` / `PATH` / `PRIMARY` derivation, the `git worktree list --porcelain` anchor with its no-primary report line, and the ordered seven-outcome table in `repo-audit.md` "Prepare the run", including the parent's retained pre-rendered list.
- Replacement scout brief sentences at the two removed sites: "Read each supplied sibling checkout path, an absolute path, the same way. Copy each supplied `Sibling:` line verbatim." and "Emit one Sibling line per supplied checkout path and one verbatim copy per supplied `Sibling:` line. Ground a leg only in an observable the ticket already states and the sibling can see; use none for no leg. Use Sibling: none when no path and no line are supplied."; the replacement template line `Sibling: none | <absolute path> - none | <absolute path> - leg: <observable the ticket already states that this repo can see, cited> | <supplied line, verbatim>`.
- The fold table row for report-only sibling outcomes, the parent-retained-list source for that row, the `sibling:` addition to the quiet-findings list, the `audit unavailable` row's note that parent `sibling:` lines still render, and the absolute-`PATH` wording in the grounded-leg row.
- The one-sentence grammar pointer at `skills/shape-ticket/SKILL.md:302` naming the clone-URL form and routing to `repo-audit.md`.
- The README `## shape-ticket` row rewritten for `- sibling: <clone url>` with the convention sentence; default stays `single-repo audit`.
- A supersession banner on `doc/specs/2026-10-23-shape-ticket-batch-repair-audit.md` for the predecessor scope.
- A `CHANGELOG.md` `## Unreleased` entry marked breaking: the path form is no longer accepted and renders `not a clone url`.
- Eval: `audit-grounding` gains a Prepare-the-run checkpoint and moves to the ssh URL form with an https stored origin; `audit-dispatch` gains one legacy `- sibling: ../viewer` line; new samples `sibling-primary-anchor` and `sibling-not-found-hint` with the supplied facts listed under Tests; `eval/shape-ticket/intent.md` and `eval/shape-ticket/README.md` updated.

## Errors and edge cases

Every outcome is a report line; the audit continues as a single-repo audit for that line and nothing stops. The clone hint single-quotes both the URL and the destination (an embedded `'` becomes `'\''`) so the command stays usable when the primary's parent contains spaces or shell metacharacters.

| Case | Rendered `Sibling:` line |
|---|---|
| nothing at `PATH` | `Sibling: git@github.com:acme/viewer.git - not found: expected at /repos/viewer; clone with git clone 'git@github.com:acme/viewer.git' '/repos/viewer'` |
| `PATH` exists, not a git checkout (plain directory or a file, including a plain directory inside an enclosing repository whose top level is not `PATH`) | `Sibling: git@github.com:acme/viewer.git - /repos/viewer is not a git checkout, expected github.com/acme/viewer` |
| checkout with no `origin` remote | `Sibling: git@github.com:acme/viewer.git - /repos/viewer has no origin remote, expected github.com/acme/viewer` |
| checkout whose stored origin is not a clone URL | `Sibling: git@github.com:acme/viewer.git - /repos/viewer origin /srv/git/viewer.git is not a clone url, expected github.com/acme/viewer` |
| checkout whose origin is another repository | `Sibling: git@github.com:acme/viewer.git - /repos/viewer is github.com/acme/viewer-legacy, expected github.com/acme/viewer` |
| value is not a clone URL (including the legacy path form) | `Sibling: ../viewer - not a clone url; use git@host:owner/name.git or https://host/owner/name.git` |
| inside a checkout, `git worktree list --porcelain` yields no `worktree` entry | `Sibling: git@github.com:acme/viewer.git - unresolved: no primary checkout found; expected beside it as viewer` |
| `git worktree list` fails (outside a checkout) | existing `audit unavailable (no repository)`, unchanged |
| ssh and https forms of one repository, with or without userinfo, port, or `.git` | identical `IDENTITY`; found |
| checkout cloned through a `url.<base>.insteadOf` rewrite | the stored `remote.origin.url` is compared, so the rewrite does not change the outcome |
| scout audit missing, empty, or malformed | `audit unavailable (<reason>)` plus every parent-retained `sibling:` line, unchanged |

The `not a clone url` line is the migration message for every existing path-form line; no separate migration notice exists.

## Tests

Skill-text change; evals per `eval/README.md`, structural lint through `npm test`. Run the implementation task's deterministic structural checks before and after the instruction edit. Run behavioral replay through the full target during final verification, after both new samples exist; its historical baseline arm supplies the before-edit comparison for all four named samples. Preserve the driver's generated records and report as verification deliverables. Keep model replay out of planning baselines, which require source-clean checks. The target is a tool-free text replay, so each sample supplies its Git-layout facts inline and asserts the paths and lines the reply writes into the scout brief and the `Audit:` report.

- `eval/shape-ticket/samples/sibling-primary-anchor` - supplied facts: cwd `/repos/pi-gauntlet/.worktrees/x`; `git rev-parse --show-toplevel` prints `/repos/pi-gauntlet/.worktrees/x`; `git worktree list --porcelain` first entry `worktree /repos/pi-gauntlet`; line `- sibling: git@github.com:acme/viewer.git`; `/repos/viewer` stored origin `https://github.com/acme/viewer.git`. Must hold: the scout brief carries `/repos/viewer`; the reply never mentions `/repos/pi-gauntlet/.worktrees/viewer`; the home audit still reads `/repos/pi-gauntlet/.worktrees/x`. Independent checkpoints: a primary `/repos/app` whose Git directory is `/store/git/app.git` resolves the sibling to `/repos/viewer`, never `/store/viewer`; a submodule checkout at `/repos/app/vendor/lib` (Git directory `/repos/app/.git/modules/lib`, first `worktree` entry `/repos/app/vendor/lib`) resolves to `/repos/app/vendor/viewer`, never `/repos/app/.git/modules/viewer`; a `worktree list` output with no `worktree` entry renders the `unresolved: no primary checkout found` line and continues.
- `eval/shape-ticket/samples/sibling-not-found-hint` - supplied facts: primary `/repos/pi-gauntlet`; lines `git@github.com:acme/viewer.git` (nothing at `/repos/viewer`), `git@github.com:acme/billing.git` (`/repos/billing` stored origin `https://github.com/acme/billing-legacy.git`), `git@github.com:acme/docs.git` (`/repos/docs` is a plain directory inside an enclosing checkout whose top level is `/repos` and whose stored origin is `git@github.com:acme/docs.git`), `git@github.com:acme/tools.git` (`/repos/tools` is a checkout with no `origin` remote), `git@github.com:acme/data.git` (`/repos/data` stored origin `/srv/git/data.git`); the ticket conforms and nothing else is draft-changing. Must hold: the not-found line carries `expected at /repos/viewer` and `git clone 'git@github.com:acme/viewer.git' '/repos/viewer'`; `/repos/billing is github.com/acme/billing-legacy, expected github.com/acme/billing` and the scout brief carries no `/repos/billing`; `/repos/docs is not a git checkout`; `/repos/tools has no origin remote`; `/repos/data origin /srv/git/data.git is not a clone url`; all five `sibling:` lines ride on the no-op report and no confirmation gate opens. Independent checkpoint: the scout audit file is empty - the report shows `audit unavailable (empty file)` and the same five `sibling:` lines.
- `eval/shape-ticket/samples/audit-grounding` - supplied facts: cwd `/repos/reports/.worktrees/abc-701`; first `worktree` entry `/repos/reports`; lines `git@example.test:team/viewer.git`, `git@example.test:team/missing.git`, `git@example.test:team/billing.git`; `/repos/viewer` stored origin `https://example.test/team/viewer.git`; `/repos/billing` stored origin `git@example.test:team/billing.git`; nothing at `/repos/missing`. New Prepare-the-run checkpoint, before the replayed audit: the scout brief receives `/repos/viewer` and `/repos/billing` as found paths and the pre-rendered `missing` not-found line; the ssh-configured, https-cloned viewer is found. The supplied audit lines become `Sibling: /repos/viewer - leg: opening a receipt shows its report ID, src/receipt.ts:9`, `Sibling: git@example.test:team/missing.git - not found: expected at /repos/missing; clone with git clone 'git@example.test:team/missing.git' '/repos/missing'`, `Sibling: /repos/billing - none`; the existing `sibling` expected fact adds that the viewer leg groups under `team/viewer` from the stored origin and the missing line renders as `sibling:` with no group.
- `eval/shape-ticket/samples/audit-dispatch` - add `- sibling: ../viewer`; must hold: every brief carries the pre-rendered `Sibling: ../viewer - not a clone url; use git@host:owner/name.git or https://host/owner/name.git` and no sibling path; ABC-601 (missing audit) and ABC-602 (empty audit) still report that `sibling:` line beside `audit unavailable (<reason>)`.
- README row, CHANGELOG heading, eval structure - `npm test` (`scripts/ci.mjs`)

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` `## shape-ticket` overrides row (communication contract between the overrides file and the audit); `CHANGELOG.md` `## Unreleased` breaking entry (major procedures / conventions: the committed overrides line changes form)
- Derived / memory docs invalidated: `doc/specs/2026-10-23-shape-ticket-batch-repair-audit.md` (supersession banner on `### Overrides contract` and the `Sibling:` not-found line); `eval/shape-ticket/intent.md` and `eval/shape-ticket/README.md` where they describe the path form

`doc/configuration.md` gains no row: it covers `piGauntlet.*` settings keys, and the README named-section table is the overrides front door.

## Out of scope

- Cloning, fetching, or creating a sibling checkout; any network or credential use.
- A location override (`- sibling: <url> at <path>`) for layouts where siblings do not sit beside the primary.
- Discovering siblings by scanning the primary's parent directory.
- Changes to the multi-repo coordinated flow draft; it inherits this grammar when it lands.
- Backward compatibility for the path form.

## Open questions

None.
