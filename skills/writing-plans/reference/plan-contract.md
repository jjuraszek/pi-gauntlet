# Plan contract

The grammar `plan_check` enforces. Each section names its check(s). Findings resolve in `writing-plans` Self-Review: fix, re-run.

## Waves and tasks

A wave is a maximal set of tasks that have no ordering dependency on each other, own pairwise-disjoint files, and contend on no shared mutable runtime resource (same DB/schema, port, fixture file, external service, shared temp path).

- Tasks nest under `## Wave N — <label>` headers; `### Task N` headers sit inside a wave.

## Files (`wave-file-disjointness`, `paths-exist`)

**File-ownership contract.** The per-task `**Files:**` block *is* the ownership declaration — no new syntax. Rule: **within a wave, the union of every task's declared paths must be pairwise disjoint.** Globs are allowed for `Modify` when exact paths are unknown, but must not overlap another same-wave task's paths. A task that must touch another's file belongs in a later wave.

`Test:` entries are run anchors, not ownership: `Test`/`Test` on the same path across same-wave tasks is allowed; `Test` vs another task's `Create`/`Modify` is a conflict; writer/writer stays a conflict. `Modify:` paths must exist.

## Spec anchors (`anchor-resolution`)

**Anchor rules.** The task's `**Spec:**` line cites the plan header's spec path; multiple anchors sit comma-separated on one line (`§ "A" L10-L18, § "C" L40-L44`). Checks key on the `§` marker, so the header's path-only `**Spec:**` line is never matched. Anchors are captured against the gated spec at plan-writing time; a change to the approved spec follows brainstorming's [Amending an approved spec](../../brainstorming/SKILL.md#amending-an-approved-spec), executed in place. A task with no anchorable requirement (pure-mechanics chore) omits the `**Spec:**` line entirely (never `**Spec:** none`) and carries a mechanical-task row in `## Spec coverage` — silence is never valid.

## Tests (`tests-block`)

Every `### Task N` carries a `**Tests:**` block: the bare line `**Tests:**` directly after the last `Files:` entry (blank lines allowed). Bullets, in either form:

- `- ` + backtick + command + backtick - one scoped test command; `- via: <entry point>` - the seam the tests call directly (function, route, CLI, module - e.g. `each_finding`), zero or more
- `- none: <category>` - the task runs no tests; `<category>` is free text derived from the project (docs, config, fixtures, generated assets, ...); exactly one, and no `- Test:` path in `Files:`

Absence is never valid. A `- [ ]` step or any non-bullet line ends the block. `via:` and `none:` are unchecked beyond form.

Commands run from the repo root. Each command is split into segments on `&&`, `||`, `;`, `|`; every segment must contain, as a whitespace-delimited token, a `Test:` path of the same task (the path alone, or followed by `::`, `#`, or `:` and a filter). A `Test:` value containing `*`, `?`, `[` or ending in `/` never anchors; any other argument token with those shapes is a broadening selector and fails. `cd `, `sh -c`, `bash -c`, `eval `, `$(` are unsupported. Each `Test:` path must exist or be a `Create:` path of some task. A segment equal to a header `**Verification:**` segment is a full-suite command and fails. Runners with no file-addressable form are out of scope (`go test ./pkg -run X`, `mvn -Dtest=`).

## Solo line (`solo-line`)

A wave with one task carries, directly under its `## Wave N — <label>` header, the line `Solo: <reason>`. The reason names the blocking task/wave, the contended runtime resource, or `lone remaining task`. Presence is checked here; validity is `writing-plans` Self-Review.

## Header-only entrypoint (`header-entrypoint`)

The `**Verification:**` line is the **only** place the full verification entrypoint may appear — never in any task or wave step. The verify phase reads it from the plan instead of re-deriving it; execution runs scoped commands only.

The header value's backtick spans (else the raw value) are split on `&&`, `||`, `;`, `,` into segments. No `Run:` step payload segment and no `Tests:` bullet segment may equal a header segment; prose inside waves may not contain the whole header value.

## Spec coverage table (`table-closure`, `waiver-literal`)

Every plan ends with a `## Spec coverage` section — authored last, placed after all Task sections (owner IDs do not exist earlier). Closure both ways: every `### Task N` appears as an owner in some row; every row's owner task exists.

```markdown
## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Design" L34-L37 | anchor line in task template | Task 2 |
| § "Edge cases" L120 | stale anchor = blocking SR finding | Task 4, Task 5 |
| § "Testing" L84 | checker fixtures: `node --test extensions/lib/plan-check.test.ts` | Task 3 |
| § "Acceptance" L88 | full suite passes: `npm test` | Verification |
| § "Out of scope" L131 | fix-round anchoring | waived: out of scope per spec |
| - | mechanical: release commit | Task 7 |
```

**Requirement rows:** anchor + short requirement + owner = task-ID list, or `Verification`, or `waived: <reason>`. A `waived:` row whose requirement cell contains an inline code span fails `waiver-literal`.

**`Verification` owner:** use for a requirement the header `**Verification:**` command proves. Write the exact string `Verification`, alone. Quote only literals contained in that header. Anchor the single requirement line. Keep scoped commands task-owned.

**Mechanical-task rows:** anchor `-`, requirement `mechanical: <short>`, owner = the task ID. One such row per anchor-less task.

## Placeholders and quote integrity (`placeholder-scan`, `quote-integrity`)

- ❌ "timeout/gtimeout ladder" when the spec fixes the literal `timeout 30` — never paraphrase an exact-string requirement (setting keys, error messages, banner/format strings, command names and invocations, API shapes); transcribe it as a backtick-quoted spec literal: `timeout 30`. Spec-side backtick spans containing `<placeholder>` segments are templates the plan instantiates, not exact-string requirements — exempt from quote integrity.
- ❌ `[fill in]`, `<example>`, `xxx` markers anywhere in the doc.

The banned token list is `BANNED_TOKENS` in `extensions/lib/plan-check.ts`; a token inside a literal the anchored spec requires is exempt.
