# Plan fidelity: spec anchors, verbatim quotes, mechanical coverage (gh-13)

Ticket: [jjuraszek/pi-gauntlet#13](https://github.com/jjuraszek/pi-gauntlet/issues/13)

## Problem

The spec -> plan -> per-wave review pipeline has two lossy failure modes at the plan hop, both invisible to per-wave review until the expensive conformance gate:

1. **Paraphrase loss.** Plan tasks summarize literal spec requirements; the spec-reviewer (SR) contract treats the plan task as the contract, so SR passes a compliant-looking paraphrase even when it drops an exact string (observed: spec required literal `timeout 30`, task said "timeout/gtimeout ladder", SR passed, conformance flagged PARTIAL).
2. **Coverage loss.** A spec requirement absent from every plan task produces no diff hunk anywhere; a per-diff reviewer structurally cannot flag the absence of a change nobody asked for.

Each drop triggers a full rescue wave (fix implementer + SR + CR + conformance re-audit). Observed in 2 of the last 3 gauntlet runs on this repo.

## Decisions (from brainstorming)

- **SR contract binding: spec+task** (issue deferred this; decided here). The spec is the **sole authority** - human-approved and council-roasted. The plan is a lossy projection of the spec into isolated, executable units for smaller models; the task never wins a dispute. The task's *anchors* (not its prose) define the slice of spec the task owns, which is SR's scope boundary.
- **Style: prose rules + exact check recipes inline** (house style: one imperative sentence naming the command shape and pass condition, like the existing "Grep the task body for the header's command string - expect zero hits"). No shipped lint script, no CI parser, no new machinery.
- **SR never edits the plan.** SR is structurally read-only; corrections ride the existing fix loop. A divergent task is reported as a finding quoting the spec literal, so the fix re-dispatch carries the authoritative wording.
- **Keep plan-writing lean.** The task template grows exactly one line; the quote rule is one bullet; the checks live in Self-Review where checks already live. Imperative, conditional-free, condensed single-meaning wording throughout.
- **Partial supersession** of `doc/specs/2026-07-06-parallel-wave-spec-reviewer-dispatch.md` - SR contract scope only; its dispatch mechanics (fresh context, per-accepted-patch fan-out, diff-based review) stay live.

## Design

### 1. `skills/writing-plans/SKILL.md` - five touch points

**1a. Task Structure template: spec anchor line.** Add one required line after `**TDD scenario:**`:

```markdown
**Spec:** doc/specs/<file>.md § "<heading>" L<start>-L<end>
```

- Multiple anchors: comma-separated on the same line (`§ "A" L10-L18, § "C" L40-L44`). The path is the plan header's `**Spec:**` path; task anchors refine it (single spec per plan, as today). Task-level anchor lines are distinguished from the plan header's `**Spec:**` path line by the `§` marker - checks key on `§`, so the header line is never matched.
- Anchors are captured once against the gated spec at plan-writing time. The spec is frozen once planning starts; the orchestrator is the spec's only writer during execution, so no out-of-band-edit detector exists or is needed. One guard rides in SDD (see 2c).
- A task with no anchorable requirement (pure-mechanics chore) **omits the `**Spec:**` line entirely** (never `**Spec:** none`) and MUST appear in the coverage table as a mechanical-task row (see 1c) - silence is never valid.

**1b. No Placeholders: verbatim-quote rule.** One new ❌ bullet: paraphrasing an exact-string requirement instead of quoting it. Exact-string requirements are literals the spec fixes byte-for-byte: setting keys, error messages, banner/format strings, command names and invocations, API shapes. These are transcribed into task text as backtick-quoted spec literals, never summarized. Includes the issue-mandated bad->good example:

- ❌ task says "timeout/gtimeout ladder" — spec requires the literal `timeout 30`; quote it: `` `timeout 30` ``.

Spec-side template literals - backtick spans in the spec containing `<placeholder>` angle-bracket segments - are templates the plan instantiates, not exact-string requirements; they are exempt from the quote-integrity check (1d check 1).

**1c. New `## Spec coverage` plan section.** Documented alongside Task Structure; physically placed and authored **last** in the plan document, after all Task sections (owner IDs do not exist earlier). Built by an **extraction-first pass**: walk the spec top to bottom and write one row per normative requirement **before** assigning owners - every Design imperative (Add/Remove/Keep/Replace-style directives, not any fixed lexical form), every Edge-cases rule, every Acceptance criterion, every Out-of-scope entry, and every non-none Documentation-impact entry. Then assign owners. Two row kinds:

```markdown
## Spec coverage

| anchor | requirement (short) | owner |
|---|---|---|
| § "Design" L34-L37 | anchor line in task template | Task 2 |
| § "Edge cases" L120 | stale anchor = blocking SR finding | Task 4, Task 5 |
| § "Out of scope" L131 | fix-round anchoring | waived: out of scope per spec |
| - | mechanical: release commit | Task 7 |
```

(Anchor values above are illustrative format examples, not live references into this spec.)

- **Requirement rows**: anchor + short requirement + owner = task-ID list, or `waived: <reason>` **only when the spec itself marks the item out of scope**. A waiver on an in-scope normative requirement is a Self-Review **failure** (check 3), not a warning - `writing-plans` has no human plan-review gate and auto-invokes execution, so nothing downstream would catch it.
- **Mechanical-task rows**: anchor `-`, requirement `mechanical: <short>`, owner = the task ID. One such row per anchor-less task.
- The table is plan-authoring-time only - it is not passed to implementer/SR dispatches.

**1d. Self-Review: replace the prose "Spec coverage" bullet with four mechanical checks.** The existing section-granularity bullet ("Does every spec section map to one or more tasks?") is removed and subsumed. Each check is one imperative sentence + command shape + pass condition:

1. **Quote integrity (spec -> task direction):** for every non-waived requirement row, extract each backtick-quoted literal inside the row's anchored spec lines (strip the backticks; skip `<placeholder>` template spans per 1b) and `grep -F` it against the owning task's body - zero misses. Planner-authored backticks elsewhere in tasks (commands, code fences) are never scanned; the input set is spec-side literals only.
2. **Anchor resolution:** for every task-level anchor (a `**Spec:**` line carrying `§`; the plan header's path line is exempt), the quoted heading text matches an ATX heading in the spec file and `L<start>-L<end>` is in-bounds, non-empty, and lies within that heading's section - zero unresolved anchors. Verify with `grep -n '^#'` + a scoped `sed -n`.
3. **Table closure, three legs:** (i) every row's owner is a task-ID list, a spec-authorized `waived: <reason>`, or a mechanical-task row; (ii) every `### Task N` heading appears in >=1 row; (iii) every requirement row's anchor is contained in the anchor set of each listed owner task's `**Spec:**` line. Zero orphans, zero waived in-scope normative rows, zero row-vs-owner anchor mismatches.
4. **Paths exist:** every `Modify:` path in `Files:` blocks passes `test -f` after stripping any trailing `:line[-line]` suffix; a `Modify:` glob must expand to >=1 match; `Create:` and `Test:` paths are exempt unless the `Test:` path is also listed under `Modify:`. Zero missing.

Also reword the Self-Review intro sentence ("run three checks yourself" at the top of what is already a longer list) to drop the count: "run these checks yourself".

No human gate: these are self-run by the planning agent before declaring the plan complete, same execution model as the rest of Self-Review. The extraction-first pass in 1c is the semantic half (enumerate requirements from the spec); checks 1-4 are mechanical only downstream of it.

### 2. `skills/subagent-driven-development/SKILL.md` - SR contract

**2a. Contract statement (single source: the prompt template; SKILL.md steps reference it).** Three touch points, all carrying the same payload rule - the SR dispatch passes task text, patch diff, **absolute spec path, and the task's `**Spec:**` anchors**; SR reads the anchored ranges from the spec file itself, excerpts are never inlined by the orchestrator (inlining would reintroduce a transcription hop):

- Sequential step 3.
- Parallel-wave step 3 (its payload list currently reads "task text, the returned patch diff, and the absolute spec path" - add the anchors).
- The `## Dispatch` code sketch (currently `task: "<diff range + spec excerpt + ask: does this match?>"` - the contradiction of this rule; rewrite to `<task text + patch diff + absolute spec path + task's Spec: anchors>`).

**2b. Authority hierarchy (stated once, in the prompt template):**

- **Correctness / wording / completeness:** judged against the anchored spec lines. The spec wins every dispute.
- **Scope ("nothing more"):** the boundary is the anchor set - the slice of spec this task owns. Diff work outside the anchored slice is flagged **out-of-anchor-slice** (named to avoid colliding with the persona's existing `[OUT_OF_SCOPE]` label, which means "spec-declared non-goal") even if task prose mentioned it.
- **Plan transcription gap:** spec-required work inside the anchored slice that is **missing from the diff** because the task prose omitted it - the requirement still binds (the spec authorized it), flag it. This label covers the missing case only; work present in the diff, spec-authorized but unmentioned by task prose, is compliant - note it as a plan-fidelity remark outside the `F1..Fn` finding stream, never as a finding.
- **Task-vs-spec divergence** (task says X, anchored spec says Y): unconditional flag; the finding quotes the spec literal with spec `file:line` so the fix re-dispatch carries authoritative wording. Never silently trust the task; never silently substitute the spec either - the flag is the mechanism. **Closure condition:** the finding closes when the current patch conforms to the anchored spec - re-reviews judge the diff against the spec, not the stale task prose, so a divergence already corrected in the diff is not re-flagged (and thus never feeds a false `STAGNANT` escalation).
- **Anchor-less tasks** (no `**Spec:**` line - waived-mechanical per the plan's coverage table): the task text alone is SR's contract; no anchor slice exists, so no out-of-anchor-slice or transcription-gap flagging - only nothing-extra-vs-the-chore review. Stated in the prompt template and both SDD step-3 paths.
- Divergence findings use the existing `F1..Fn` finding grammar (a finding kind by prose label, not a new schema); `Parallel-safe:` and `TRAJECTORY:` grammars are untouched.

**2c. Guards (one sentence each in SKILL.md):**

- The spec is frozen at plan time and the orchestrator is its only writer during execution; if the orchestrator does edit it mid-run, re-run writing-plans' anchor-resolution check (1d check 2) before the next wave.
- SR unable to read the spec at a cited anchor (missing file, unresolvable heading/range): blocking finding - the contract is spec+task or stop, never silent fallback to task-only review. (Anchor-less tasks are not this case - they have task-text-only scope by design, per 2b.)

**2d. Boundaries preserved:** the "plan is the contract; execute it" autonomy line (no-pause-and-ask, `SKILL.md:36`) is a different concern and is NOT edited. Implementer dispatch is unchanged - implementers still receive only task text and never read the spec; task self-sufficiency is what the verbatim-quote rule guarantees. Fix-loop budgets, trajectory rules, wave mechanics, conformance gate: all unchanged.

### 3. `skills/subagent-driven-development/spec-reviewer-prompt.md`

The template gains a `## Spec Authority` section carrying the anchor list placeholder and the 2b hierarchy rules; the task-as-sole-contract framing ("What Was Requested" = the whole contract) is reworded to name the task as a derivative of the spec. The section carries one **load-bearing hard override** (the persona file is out of scope for edits, and its system prompt says "extract a flat list of every requirement" / "flag any requirement from the spec that is missing" - whole-spec instincts that must not leak into per-task review): *requirements in scope are ONLY the cited anchor ranges; do not extract, review, or flag the rest of the spec file.* Finding taxonomy gains the **plan transcription gap** and **out-of-anchor-slice** labels as prose categories under the existing Missing/Extra/Misunderstanding sections. The `Parallel-safe:` grammar block and its identity-pin comment with `agents/conformance-reviewer.md` are byte-untouched.

### 4. Supersession banner

`doc/specs/2026-07-06-parallel-wave-spec-reviewer-dispatch.md` gets, after its title line and a blank line:

```markdown
> **Superseded by:** [doc/specs/2026-08-23-gh-13-plan-fidelity-anchors.md](./2026-08-23-gh-13-plan-fidelity-anchors.md) - SR contract scope only
```

## Edge cases

- **Anchor-less task:** allowed only for mechanics; omits the `**Spec:**` line entirely; must carry a mechanical-task coverage row (1a/1c); SR contract is task-text-only (2b). Silence invalid.
- **Waived requirement:** valid only when the spec itself marks the item out of scope; a waiver on an in-scope normative requirement fails Self-Review check 3 (1c/1d).
- **Stale anchor at SR time:** blocking finding, no guessing (2c).
- **Spec-side template literals:** `<placeholder>`-bearing backtick spans are exempt from quote integrity (1b/1d check 1).
- **Shared requirement across tasks:** one row, multiple task IDs; the row's anchor must be in every listed owner's anchor set (1d check 3iii).
- **Corrected divergence at re-review:** judged against the diff, not stale task prose; not re-flagged, no false `STAGNANT` (2b).
- **Sequential/parallel parity:** identical contract in both modes; the prompt template is the single source (2a).

## Out of scope

- Fix-round task anchoring (fix tasks are authored ad hoc in SDD fix waves, not via the writing-plans template) - independent follow-up ticket per the issue; this change does not depend on it.
- `agents/spec-reviewer.md` persona edit - the whole-spec instincts in its system prompt are neutralized by the load-bearing anchor-scope override in the prompt template (section 3), not by editing the persona.
- Automatic detection of out-of-band spec edits during execution - the orchestrator is the spec's only writer in a gauntlet run (2c handles the orchestrator's own edits).
- conformance-reviewer cost/cadence, `scripts/ci.mjs` parsers, any shipped lint script or extension.
- Richer coverage tooling (CI plan schema, requirement IDs in specs) - the table keys on anchors, no spec-side ID scheme.

## Testing / verification

- `npm test` (`scripts/ci.mjs`) green - no new CI hooks.
- Genericness grep from AGENTS.md over `skills/` - zero matches.
- Diff file list confined to `skills/writing-plans/`, `skills/subagent-driven-development/`, and the two spec docs (this file + the 07-06 banner) - verified at finish (issue AC #5; spec docs are the gauntlet's own artifacts, not skill surface).
- Consistency: the SR contract hierarchy appears once in `spec-reviewer-prompt.md`; SKILL.md steps and the Dispatch sketch reference/summarize it without inlining excerpts; the `Parallel-safe:` identity-pin comment is byte-identical before/after.
- Banner href resolves to this file.
- The mechanical checks are exercised by the first real plan that rides them - no executable test for skill semantics exists; accepted.

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: none
- Derived / memory docs invalidated: none

Skill bodies are implementation surface, not doc-impact entries; README and AGENTS.md do not describe the task template or SR contract at this granularity; no agent frontmatter changes.

## Acceptance criteria (from the issue, with decisions applied)

1. `writing-plans/SKILL.md` requires a spec anchor (path + section + line range, captured against the gated spec at plan-writing time) on every task in its task template, with the anchor-less-task rule (omit the line, mechanical-task coverage row).
2. `writing-plans/SKILL.md` contains the verbatim-quote rule with one bad->good example (paraphrase vs quoted literal) and the template-literal exemption.
3. `writing-plans/SKILL.md` requires the extraction-first `## Spec coverage` table and the four self-run mechanical checks (quote integrity spec->task, anchor resolution with the `§`/header distinction, three-leg table closure failing in-scope waivers, paths-exist with suffix/glob/Test: handling), replacing the prose section-level coverage bullet and the "three checks" intro count, introducing no human gate.
4. `subagent-driven-development/SKILL.md` (sequential step 3, parallel step 3, `## Dispatch` sketch) and `spec-reviewer-prompt.md` name the spec+task contract with the spec-wins authority hierarchy, the unconditional divergence-flag rule with its closure condition, the anchor-less task-text-only case, and the load-bearing anchor-scope override.
5. Diff file list confined per Out of scope / Testing above.
6. `doc/specs/2026-07-06-parallel-wave-spec-reviewer-dispatch.md` carries the partial-supersession banner.
