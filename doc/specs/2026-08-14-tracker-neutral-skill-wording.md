# Tracker-neutral skill wording

Neutralize the remaining Linear-as-canonical wording in shipped skill bodies so pi-gauntlet reads as ticket-tracker agnostic (Linear, Jira, GitHub Issues equally). Linear stays acceptable in explicit example lists; it stops being the default vocabulary for headings, filename conventions, and plan-header fields.

## Motivation

The repo is tracker-agnostic by design: `gatherer.md` handles Linear/Jira-style IDs and GitHub refs symmetrically, and consumer-specific tracker conventions are delegated to `.pi/gauntlet-overrides.md` (`gatherer.md:71`, `conformance-check.md:63`, `disposition-protocol.md:41`). But three shipped-skill spots still use Linear as the canonical term, plus three adjacent residues (`writing-plans/SKILL.md:22,243`, `finishing-a-development-branch/SKILL.md:181`). AGENTS.md's own rule: Linear/Jira references are OK as examples, never as canonical paths.

## Changes

Prose-only; no behavior, config, or dispatch-shape change. Three files.

### `skills/brainstorming/SKILL.md`

1. Heading (line 183): `## Linear Ticket Handling` -> `## Ticket Handling`.
   - Constraint: the new heading MUST retain "Ticket Handling" as a substring. The matching mechanism is the skill's own "Project overrides" contract (`skills/brainstorming/SKILL.md:385`: overrides sections apply "by name match, by topic ..., or by workflow convention"). Known consumer relying on it - `<consumer>/.pi/gauntlet-overrides.md:51`:

     ```markdown
     ## Linear Ticket Handling

     Treat a given ticket as guidance, not the sole source of truth - surface scope/AC deviations in the spec. ...
     ```

     `## Ticket Handling` keeps that section matching by name-substring and topic without consumer edits.
   - Section body is already generic ("When a ticket ID is given...") - unchanged.
2. Filename Convention (lines 216-217):
   - `With Linear ticket: YYYY-MM-DD-E-12345-<topic>.md` -> ``With ticket: `YYYY-MM-DD-<ticket-id>-<topic>.md` (e.g. `E-12345` for Linear; a filename-safe slug like `gh-123` for GitHub issue `#123`)``
   - `<ticket-id>` in the filename is a filename-safe slug of the tracker reference, not a prescribed normalization: Linear/Jira keys (`E-12345`, `ABC-123`) are already filename-safe and used verbatim; GitHub refs (`#123`, `owner/repo#123` per `gatherer.md:70-73`) contain filename-unsafe characters, so the `gh-123` form is illustrative slug prose only. Plan headers and commit messages use the tracker's native reference form, not the filename slug.
   - `Without Linear ticket: YYYY-MM-DD-<topic>.md` -> ``Without ticket: `YYYY-MM-DD-<topic>.md` ``

### `skills/writing-plans/SKILL.md`

3. Line 22: "same Linear ID (if any)" -> "same ticket ID (if any)".
4. Line 188 (plan header template): `**Linear:** `E-XXXX` (omit if no ticket)` -> `**Ticket:** `<ticket-id>` (omit if none)`.
5. Line 243 (commit example): `(ref E-XXXX)` -> `(ref <ticket-id>)`.

### `skills/finishing-a-development-branch/SKILL.md`

6. Line 181 (squash-commit example): `git commit -m "<imperative summary> (ref E-XXXX)"` -> `git commit -m "<imperative summary> (ref <ticket-id>)"`.

## Vocabulary decisions

- Field name is `**Ticket:**`, placeholder is `<ticket-id>` - matches the "ticket" vocabulary already used throughout the skills, including `gatherer.md`'s tracker-ID trigger rule. `**Issue:**`/`<issue-ref>` and `**Tracker:**`/`<tracker-id>` were considered and rejected (GitHub-flavored clash / awkward header line, respectively).
- Vendor names (Linear, Jira, GitHub Issues) remain wherever they are explicit example lists: `brainstorming/SKILL.md:77` (detection order), `gatherer.md:70-76` (trigger rule and its examples), and the new filename-convention `e.g.` clause.

## Out of scope

- `gatherer.md` trigger rule - already tracker-neutral (Linear/Jira ID form + GitHub refs, fetch-path-gated).
- All `.pi/gauntlet-overrides.md` delegation points (`disposition-protocol.md`, `conformance-check.md`, agent personas) - already generic.
- Runtime names `plan_tracker`/`phase_tracker` and the math sense of "linear" in `test-driven-development/reference/examples.md:57` - not issue-tracker prose.
- No new overrides pointer for filename/header conventions - the standard "Project overrides" block already delegates this (YAGNI).
- No consumer-repo edits: the consumer repo's overrides need no change (verified; see heading constraint above).

## Verification

- `rg -n "Linear" skills/` -> hits only in example lists (`brainstorming/SKILL.md` detection order, `gatherer.md` trigger rule/examples, filename `e.g.` clause) and `roasting-the-spec` if it has example lists; zero hits where Linear names a heading, field, or canonical convention.
- `rg -n "E-XXXX" skills/` -> zero hits; `rg -n "E-12345" skills/` -> only inside the filename convention's `e.g.` clause.
- Repo skill-genericity grep from AGENTS.md (company/user-path patterns) -> zero matches.
- `npm test` -> green (no version/CHANGELOG assertion touched; this is not a release commit).

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: none (skill bodies are implementation surface, not doc-impact entries; README does not reference the renamed heading or the `E-12345` pattern)
- Derived / memory docs invalidated: none

## Open questions

None.
