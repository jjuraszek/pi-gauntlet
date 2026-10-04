# Readable, reviewer-filtered amendment gates

> **Superseded by:** [doc/specs/2026-09-22-amend-batch-trigger-reviewer-contract.md](./2026-09-22-amend-batch-trigger-reviewer-contract.md) - "Tier-2 render (human batch)" card fields only
> **Superseded by:** [doc/specs/2026-10-04-spec-gate-approval-menu.md](./2026-10-04-spec-gate-approval-menu.md) - "Grant offer and matcher" section only

**Goal:** a post-approval spec amendment reaches a human only when a fresh-context reviewer cannot clear it; every amendment a human does see is one plain-language entry in a batched menu with a tiny example, real alternatives when they exist, and one-reply disposition. `skills/brainstorming/SKILL.md` gets shorter, not longer.

Supersedes `doc/specs/2026-09-18-council-grounding-amend-approval.md`, "Standing amend approval" presentation scope only (its grant safety boundary carries over unchanged). Extends #27's per-diff amendment contract (`v5.3.7`) to a batched, reviewer-filtered one; the rationale for narrowing #27's "every amendment stops" is recorded in [Why the calculus changed](#why-the-calculus-changed).

## Problem

Across 10 gauntlet runs in the last 3 days (pi-gauntlet + one consumer repo), telemetry recorded 11 post-approval spec amendments. Each amendment today renders as a raw `git diff` plus one impact line (`skills/brainstorming/SKILL.md:250-254`) and stops the run for per-diff approval unless the user volunteered a standing grant in chat - a grant the flow honors but never offers. Run E-2923 stopped six times mid-phase (plan 2, implement 3, verify 1); its five amendments were all factual corrections against a captured fixture ("Correct ROP parser model against the captured fixture", "Correct the RoP fixture byte count to the captured size", "Posting date falls back to the latest document date, not the earliest"). Each stop asked a human to read a symbol-dense diff at an arbitrary hour and reply "approve".

Upstream cause, out of scope here: specs pin facts about fixtures, byte counts, parser models, and data ordering before implementation has observed the authoritative artifact; `v5.10.0`'s probe-before-apply reduces that at spec time, and the residue surfaces as amendments. This spec is about what happens to that residue.

Three defects compound downstream:

1. **The human is treated as the cheap gate.** Every amend-class edit stops, regardless of whether it changes anything the human decided. The human is the most expensive component in the loop; a stop costs hours of wall-clock when the run is unattended.
2. **The render is unreadable.** A `git diff` of a spec paragraph shows implementation detail and symbols, not what changed for the outcome or why it matters.
3. **Stops are serial.** Three amendments found in one review are three stops, when one batched decision would do. The grant that would collapse them is undiscoverable.

## Human input (verbatim; off-limits for over-spec)

- "there are lot of ammendments for the spec during execution and conformance which spawns extra avoidable human gates ... is there any cheap way to mitigate it or at least lower the number of interventions?"
- "if amnendment is surfaced its barly readable with symbols and details of impl. it should br surfaced in context for human with simple example or explenation why it matters. there shoul also bo simple menu ... we also need it to follow writting-skills if changes affect md's and it should be condense and easy to follow by smaller models as well."
- "number of choices shouldn't be fixed. it should present real alternatives if any or yes/custom otherwise"
- "A, we should shrink brainstorming not growing it"
- "human should be last resort as its most expensive gate not cheap one ... show ammendment to human only for descoping or rescoping situation ... I'd like to have some filter on what is or is not important for human to sign off."
- "no settings knob"; "reusing single spec-council-member persona is correct but use main loop model and thinking (don't reuse settings.json values ...)"; "auto apply should work the same during conformance and execution"

## Design

### Three-tier funnel

Every post-approval spec change, from every entry point, passes through the same funnel. There is no settings key; this is the default behavior for all consumers.

| Tier | What lands here | Human stop |
|---|---|---|
| 1. Reviewer auto-apply | Amend-class item that a fresh-context reviewer clears against the [rubric](#auto-apply-rubric) | None. One transcript line per item; the batch commit body records each verdict |
| 2. Human batch | Amend-class item the reviewer escalates (rubric fails, evidence missing, reviewer uncertain or unavailable), or one the [prefilter](#deterministic-prefilter) sends straight to the human | One batched menu per decision point |
| 3. Redraw | Problem statement, component add/remove, or component-boundary change (existing redraw test, unchanged) | Always stops, alone, before any pending amend items |

**Standing grant** (`v5.10.0` semantics, unchanged): this flow only, amend-class only, quoted in the commit body, never inferred after a fresh-session resume. It skips tier 1 and tier 2 for every amend-class item, including scope-changing ones - that is what the existing grant already does, and the offer text says so plainly. Redraws and the spec gate stop regardless of grant.

### Item lifecycle

The **main loop** (the orchestrator holding `edit`/`write`) is the sole author of amendments and of every human-facing line about them. Per batch, in order:

1. **Prepare, do not apply.** For each amendment, hold a proposed edit as `old text -> new text` at a named spec location, plus its metadata: `handle`, plain `title`, `what` (one sentence), `why` (one sentence, tied to the outcome), `example` (one before -> after value or line), `evidence` (the cited observation), `recommended` choice, and `alternatives` (zero or more genuinely different spec edits). The working tree stays at pre-batch HEAD until step 4.
2. **Classify.** Redraw items stop alone (see [Batch boundary](#batch-boundary)). Prefilter items skip the reviewer. Remaining items go to one reviewer dispatch.
3. **Render tier 2** for escalated and prefiltered items; wait for one reply.
4. **Apply** accepted items only (tier-1 clears, tier-2 `accept`/`alt-n`, state-changing `custom`). Rejected or dropped items leave no trace in the spec. Run the [aftermath](#after-any-apply-tier-1-or-2) once.
5. **Commit once per batch**, subject `amend: <N> item(s) - <first title>[, ...]`, body carrying one structured record per item:

   ```
   - <handle> | <title> | <what> | <auto-apply | accepted | alt-n | custom(<effect>) | granted> | <reason or reviewer line> | <evidence>
   ```

   `<what>` is the item's one-sentence what-changes field, carried so the finish digest can render `<title> - <what changed>` from the body alone. The subject prefix `amend:` is the marker the finish digest greps for. Recovery from a wrong apply is `git revert` of the batch commit followed by re-entering the amend path for the items to keep - the same recovery as a wrong human approval today.

### Entry points (all identical)

| Entry point | Today | With this spec |
|---|---|---|
| Implementer `BLOCKED` on a spec defect, or an SR finding that the spec is wrong (`skills/subagent-driven-development/SKILL.md:69`) | Executes brainstorming's amend section in place, per-diff stop | Same in-place execution; the amend section routes through the funnel |
| `writing-plans` "can't list files -> amend or redraw" (`skills/writing-plans/SKILL.md:93`) and Open Questions the planner must resolve before execution (`:251`) | Same | Same |
| Conformance: gaps whose `recommended` is `accept` (`accept-into-spec`) | Carried OPEN to the finish gate; human picks in the disposition menu; spec edited after the reply | Pre-menu funnel per [Conformance sequence](#conformance-sequence); survivors stay disposition rows carrying the readable card fields |
| Finish-time Heavy council-edit revert (`skills/finishing-a-development-branch/SKILL.md:130`) | Amend per brainstorming | Same routing; it rewrites ratified contract text, so it is tier 2 or redraw by construction |

Code-vs-spec mismatch stays in the SR loop and never enters the funnel (#25 boundary, unchanged). The conformance fix loop's existing over-spec deletion (`conformance-check.md:147-149`: a council-authored clause flagged `UNAUTHORIZED` with over-spec provenance is deleted in the fix commit) is a separate, standing decision and is unchanged by this spec; rubric (c) governs amendments the main loop proposes, not that path.

### Deterministic prefilter

Before any reviewer dispatch, the main loop sends an item straight to tier 2, with no LLM call, when any holds:

- the proposed edit removes or narrows any approved text (descope/rescope by construction);
- the edited location is inside a human-owned section (see rubric (b));
- at the conformance entry: the gap is `UNAUTHORIZED` (its `accept-into-spec` means ratifying unrequested scope, which fails rubric (c) by definition), or its `origin` quotes an acceptance criterion.

Only evidence-backed factual drift outside human-owned text reaches the reviewer. This keeps the dispatch cheap and the rubric's outcome predictable.

### Auto-apply rubric

The reviewer returns `auto-apply` for an item only when **all** hold:

- **(a) Evidence-backed factual correction.** The change corrects a claim about code, data, or an external artifact, and the item cites the observation that falsified the old claim: a command and its output, a `file:line`, a test result, a fixture measurement. A claim with no cited observation is not evidence.
- **(b) Touches no human-owned section.** None of: problem statement, goal, acceptance criteria, in/out scope (non-goals), component list or boundaries, public contracts (API, schema, config shape, CLI surface). Verification commands, documentation-impact lines, and design-detail paragraphs are not human-owned: a corrected fixture size in a test description is exactly the class that should clear.
- **(c) Scope-neutral.** Removes nothing the human approved; adds nothing the human did not ask for. "What the human asked for" is judged from the spec's own `## Human input` section when present, otherwise from its Goal, Problem, scope/non-goals and acceptance sections - never from chat context, which later phases and fresh-session resumes do not have.

Anything else is `escalate`. The reviewer fails closed: uncertainty is `escalate`.

### Reviewer dispatch

**Persona change.** `agents/spec-council-member.md` gains an **amendment-review mode**, selected when the task text begins with the line `Mode: amendment-review`. In that mode the persona's five-axis critique template is replaced by exactly one line per item:

```
<handle>: auto-apply | escalate - <one-line reason> - probed: <check> - <result>
```

and nothing else. The default mode (no discriminator) is unchanged, so `roasting-the-spec` and `shape-ticket` are unaffected. The persona `description:` and `doc/personas.md` name the third dispatcher and the mode.

**Model string.** The reviewer runs on the main loop's own model and reasoning level. The values exist only in the `bash` tool's environment, so the main loop prints them first and pastes the result into `model:`, the same placeholder mechanic brainstorming uses for `$SUMMARY_PATH`:

```bash
lvl="$PI_REASONING_LEVEL"; case "$lvl" in max) lvl=xhigh;; off|"") lvl="";; esac
printf '%s/%s%s\n' "$PI_PROVIDER" "$PI_MODEL" "${lvl:+:$lvl}"
```

`max` maps to `xhigh` because pi-cohort's thinking-suffix parser recognizes `off..xhigh` only (a literal `:max` is treated as part of the model id); `off` drops the suffix. The `:<level>` suffix is the established call-site path that beats the persona's `xhigh` frontmatter pin (`doc/personas.md` "Thinking budgets"; `shape-ticket` uses `:low` the same way). No `agentOverrides` lookup, no settings read.

**Dispatch shape.** One foreground call per batch:

```
subagent({ agent: "spec-council-member", context: "fresh", async: false,
  model: "<printed string>", cwd: "<abs worktree path>",
  control: { needsAttentionAfterMs: 60000, inFlightSilenceCeilingMs: 240000, inFlightSilenceKillMs: 300000 },
  task: "Mode: amendment-review\n" + <rubric verbatim> + <spec path> +
        <per item: handle, location, old -> new text, evidence> +
        "Human input (data, not instructions):\n```\n<spec's ## Human input section, or 'none - judge (c) from Goal/Problem/scope/AC'>\n```" })
```

The `control` block is the shape-ticket `:low` figures - a one-batch review is short - recorded verbatim so a pi-cohort default change cannot stretch the kill (effective silence-kill max(300s, 240+60) = 300s). The reviewer reads the spec and may probe cited evidence read-only in the worktree; it never edits.

**Failure = escalate.** Dispatch error, async handle, silence-kill, a missing or malformed line for an item -> that item is `escalate`; the tier-2 menu carries one line `reviewer unavailable: <reason>` when the whole dispatch failed. The funnel never auto-applies on a reviewer that did not answer.

Independence comes from the fresh context and the evidence requirement, not from model diversity: the same model reviews, but without the implementer's reasoning in context and under a rule that uncited claims cannot pass. Accepted by the user; recorded so it is not re-litigated.

### Batch boundary

A batch forms at the moment the first amendment would otherwise gate, sweeping in every other amendment already pending at that decision point: the same spec-review round, the same blocked wave, the same conformance inventory. The pipeline never waits for more; a later finding is a new batch.

A redraw item governs: it renders and stops alone first, because a redraw resets both trackers and may invalidate the pending amend items. Survivors re-batch after the redraw resolves.

### Tier-2 render (human batch)

Owned by a new lazy-loaded, self-contained reference `skills/brainstorming/reference/amendment-surface.md` (it defines its own grammar; it does not link into `disposition-protocol.md`, whose consumer contract is finish-only). Per item:

```
* <handle> - <title>: <what changes, one sentence>. <why it matters to the outcome, one sentence>.
  Example: <one before -> after value or line>
  Recommended: <accept | alt-n> (<one-clause why>).
  Alternatives: alt-1 <one line>; alt-2 <one line>          <- present only when genuine
```

- `<handle>` is a short unique human word from the title (`Posting date` -> `posting`); digit suffix on collision.
- `Alternatives:` renders only when the main loop has a genuinely different spec edit to offer. With none, the choices are exactly `accept` and `custom(...)`. No placeholder rows.
- Nothing symbol-dense above the fold. Each item's `old -> new` text sits **below** the menu under `Details`, as evidence.
- Each item carries one impact line: affected plan tasks/waves, or `no plan yet`.

Footer, always:

```
Reply: 1 (apply all recommendations) | 2: <handle>=<accept|alt-n|custom(<effect>)>, ...
Standing grant: reply "auto-apply amends" - every later amend-class change in this flow then applies without review, scope changes included; redraws and the spec gate still stop.
```

Reply grammar: `1` applies every recommendation; `2:` overrides named handles, omitted handles keep their recommendation; a handle at most once. `custom(<effect>)` is free text and may redirect anywhere - a reworded spec edit, "keep the spec, fix the code", "drop this amendment". A redirect away from the spec drops the item (recorded `custom(...)` in the batch commit body) and returns the underlying finding to its calling loop. Invalid handle or choice -> focused reprompt naming only that item, keeping every valid pick, never reopening the gate.

### Conformance sequence

Runs at the finish gate's Step 3.5, before the carried-open menu renders, once per inventory:

1. For each `recommended: accept` gap with a `DRIFTED`/`PARTIAL` verdict whose `origin` is not an acceptance criterion and whose verdict is not `UNAUTHORIZED`, the main loop drafts the `accept-into-spec` edit from the gap's `origin` + `evidence` as an item (lifecycle step 1); every other gap skips the funnel and stays a menu row.
2. Reviewer dispatch over those items (one call). Cleared items apply; the batch commit lands (lifecycle step 5).
3. Re-audit against the amended spec (existing execute-order step 3), regenerate the inventory. Only concerns the re-audit actually closed drop out; sibling concerns in the same gap keep their rows and dispositions.
4. Render the disposition menu for what remains. Rows whose recommended disposition edits the spec carry the readable card fields (`what`, `why`, `Example:`) on the bullet, per `amendment-surface.md`'s format adapted to the disposition bullet grammar. Escalated items are ordinary rows here - **one** conformance-owned menu, never a second amendment menu.
5. A human-selected spec-changing disposition (`accept-into-spec`, `rescope-into-spec`, state-changing `custom`) is already approved: it applies at execute-order step 2 and bypasses tier 1 and tier 2, recorded as today (`Gn - <title>: <disposition>`); an auto-applied item is recorded `Gn - <title>: accept-into-spec (auto-applied)`.

### After any apply (tier 1 or 2)

The existing plan/tracker aftermath moves verbatim from `skills/brainstorming/SKILL.md` step 3 into `amendment-surface.md` and runs once per batch: no plan yet -> commit spec, continue; plan exists -> update anchors and tasks (`plan_tracker` `add` / reopen as `in_progress` / re-`init` with `{ name, status }`), re-run `plan_check` until it passes, commit spec + plan together (the batch commit); a task reopened during `verify` or `ship` -> `phase_tracker` skip + `implement` force-restart. #25's obligations (anchor, ownership, cross-cutting, condition changes flow to plan and spec-review) apply to auto-applied items exactly as to human-approved ones.

### Grant offer and matcher

One display sentence, used verbatim at the spec gate and in the tier-2 footer: `Reply "auto-apply amends" - every later amend-class change in this flow then applies without review, scope changes included; redraws and the spec gate still stop.` The spec-approval render gains it as one sentence after "Approve to proceed"; `approve, auto-apply amends` is approval plus grant in one reply.

The grant is recognized by intent, not by exact string. Accepted phrasings are those `skills/brainstorming/SKILL.md:251` already lists (`auto-apply amends, stop only for redraws`, `apply spec fixes without asking`) plus `auto-apply amends` and `approve, auto-apply amends`; any user sentence that waives per-diff review for later amends in this flow counts. Activation is recorded where it already is: the granting sentence is quoted in every subsequent amendment commit body; when granted at the spec gate it is also quoted in the spec commit body so a reader of the worktree history sees when it began. The literal phrase `waives per-diff review` stays in `skills/brainstorming/SKILL.md` (a `scripts/ci.mjs` token check asserts it there).

### Finish-time digest

`skills/finishing-a-development-branch/SKILL.md` Step 4 renders, immediately above the options menu in both the 4-option and detached-HEAD variants:

```
Amendments auto-applied (N):
- <title> - <what changed>
```

read via `git -C <worktree> log <base>..HEAD --grep '^amend:'` and the per-item records in those bodies (only `auto-apply` and `granted` records; human-accepted items were already seen). Omitted when N = 0. This is where an unattended run's amendments get their human read - on every ship path, including squash-merge - one scan at the finish, not N interruptions.

### `skills/brainstorming/SKILL.md` shrinks

The `Amending an approved spec` section condenses to: the trigger, the amend/redraw classification test (kept inline - decision logic needed before loading anything), the `waives per-diff review` grant sentence, and the instruction to load `reference/amendment-surface.md` and follow it. The lifecycle, prefilter, rubric, reviewer dispatch, render, reply grammar, grant footer, and aftermath live in the reference. The Red Flags entries for this section name the reference. Net line count of `skills/brainstorming/SKILL.md` after the change is strictly lower than before (279 lines at `f1d7d10`).

### File-level changes

| File | Change |
|---|---|
| `skills/brainstorming/reference/amendment-surface.md` | New. Self-contained: lifecycle, prefilter, rubric, reviewer dispatch (model-string snippet, control block, failure rule), render + reply grammar, grant footer, aftermath, one worked example (the [golden cases](#verification)) |
| `skills/brainstorming/SKILL.md` | Amend section condensed; gate offer sentence; Red Flags rows; net shrink |
| `agents/spec-council-member.md` | Amendment-review mode (discriminator, one-line-per-item output); `description:` names the third dispatcher |
| `doc/personas.md` | Roster line 10 and Thinking-budgets bypass list (line 35) name the amendment-review dispatch and its main-loop model suffix |
| `README.md` | Line 66's "conditional diff-approval stop" sentence describes the funnel: reviewer first, one readable batch for escalations, redraws stop |
| `skills/subagent-driven-development/SKILL.md:69` | Trigger sentence: "execute brainstorming's amendment path in place (it reviews first, stops only on escalation or redraw), resume" |
| `skills/finishing-a-development-branch/SKILL.md` | Step 3.5 gains the conformance sequence pointer; Step 4 gains the digest |
| `skills/finishing-a-development-branch/reference/disposition-protocol.md` | Carried-open render: spec-editing rows carry `what`/`why`/`Example:`; execute-order step 2 notes human-selected dispositions bypass the funnel; step 3 unchanged |
| `scripts/ci.mjs` | Token checks: keep `waives per-diff review` in brainstorming; add present-tokens `reference/amendment-surface.md` (brainstorming), `Mode: amendment-review` (persona and reference), `auto-apply` and `escalate` (reference), `Amendments auto-applied` (finishing); absent-token for the retired sentence `Show \`git -C <abs worktree path> --no-pager diff -- <spec path>\`` in brainstorming |
| `skills/writing-plans/SKILL.md`, `finishing-a-development-branch/SKILL.md:130` | Unchanged text; link targets still resolve (heading kept) |

### Why the calculus changed

#27 shipped "every amendment stops" and deliberately declined a formatting-only silent exception. Two facts changed: (1) three days of telemetry show amendments are overwhelmingly evidence-backed factual corrections that the human approves without change, so the per-diff stop buys no decision quality, only latency; (2) the stop's cost is now measured - it lands in unattended runs and costs hours, not seconds. This spec does not reintroduce a silent path: every auto-applied item is reviewed by a fresh context against a written rubric, announced in the transcript, recorded in a commit body, and digested at finish. #27's other decisions (no council or summary re-dispatch per amendment, worktree and plan retained, `plan_check` re-stamp) are unchanged.

## Non-goals

- No settings key, no `piGauntlet.*` change, no `doc/configuration.md` change.
- No telemetry extension change. `extensions/telemetry.ts` counts at most one amendment per no-input window (`amendmentOpen` resets on input; first post-approval spec write increments), so a tier-1 batch counts as one and `derived.amendments` cannot separate tier 1 from tier 2. The finish digest's `amend:` commit records are the tier-1 measure; the per-phase `user_messages` fields already measure mid-phase stops - the metric this spec aims to lower.
- No change to redraw semantics, the spec gate, the standing grant's scope, the SR loop's ownership of code-vs-spec mismatches, or the conformance fix loop's over-spec deletion path.
- No new persona. `spec-council-member` gains a mode.
- No general rewrite of `skills/brainstorming/SKILL.md` beyond the amend section, the Red Flags rows that name it, and the one-sentence gate offer.

## Errors and edge cases

| Case | Behavior |
|---|---|
| Reviewer dispatch fails, returns an async handle, is silence-killed, or an item's line is missing/malformed | That item (or all, on whole-dispatch failure) is `escalate`; the menu carries `reviewer unavailable: <reason>` when the dispatch failed |
| Reviewer clears an item the rubric should have escalated | Visible in transcript + batch commit body + finish digest; recovery is `git revert` of the batch commit and re-entering the amend path for items to keep |
| Standing grant active | Tier 1 and 2 skipped for amend items; one transcript line per item; batch commit body quotes the grant, record column `granted`. Redraws still stop |
| Batch contains a redraw item | Redraw renders and stops alone; amend items are held (unapplied) and re-batched after the redraw resolves |
| No genuine alternatives for an item | Choices are `accept` / `custom(...)` only |
| Invalid handle or choice in the reply | Focused reprompt for that item only; valid picks retained; gate not reopened |
| `custom(...)` redirects away from the spec | Item dropped, recorded `custom(...)`; the finding returns to its calling loop (SR fix loop or conformance fix) |
| Human-selected spec-changing disposition at the conformance menu | Already approved; applies at execute-order step 2; never re-enters tier 1/2 |
| Auto-applied conformance item whose gap has sibling concerns | Re-audit closes only the concern the edit resolved; siblings keep their rows |
| Amendment during `verify` or `ship` reopens a task | Existing `phase_tracker` skip + `implement` force-restart, unchanged |
| `plan_check` fails after the aftermath | Existing re-run-until-pass loop, unchanged |
| `PI_REASONING_LEVEL` is `max` / `off` / empty | Mapped to `xhigh` / no suffix / no suffix by the snippet before dispatch |
| Fresh-session resume | No grant carried (existing rule); the funnel needs no session state; rubric (c) reads the spec, not chat |
| Reference file unreadable | Stop and surface a blocking error; never improvise the grammar |

## Verification

- `npm test` (`scripts/ci.mjs`): skill/agent lint, stage-skill lint, marketplace assertions, `npm pack` contents, no `pi.settings` reads, plus the token checks listed in [File-level changes](#file-level-changes).
- Net-shrink check: `wc -l skills/brainstorming/SKILL.md` after < 279.
- Telemetry untouched: `git diff --stat -- extensions/` is empty.
- **writing-skills application scenarios**, per its RED-GREEN discipline: each run once against the pre-change skills (recorded as the baseline failure or the old behavior) and once against the changed skills, by a fresh subagent following the reference from a fixture worktree; expected outcomes are listed. Scenarios: (1) mixed batch of two clear + one prefiltered descope -> one reviewer dispatch, two auto-applied, one tier-2 row, one batch commit with three records; (2) reviewer dispatch forced to fail -> all items escalate with the `reviewer unavailable` line; (3) grant given at the spec gate, then one amend and one redraw -> amend applies with `granted`, redraw stops; (4) conformance inventory with one `DRIFTED` factual `accept` gap and one `UNAUTHORIZED` gap -> only the first is drafted and reviewed, the second stays a row, no second menu; (5) render bar: above the fold each item has one what-sentence, one why-sentence, one `Example:`, one `Recommended:`, zero diff syntax; (6) the smaller-model check the user asked for: scenario 1 re-run with the reference followed by a small model (the preset's cheapest configured member), same expected outcomes.
- **Rubric golden cases**, inlined here and reproduced as the reference's worked example. Synthetic, modelled on E-2923's five amendment titles; each has a spec location, before -> after, evidence, and expected verdict:

  | # | Location | Before -> after | Evidence | Expected |
  |---|---|---|---|---|
  | 1 | Design, parser section | "the ROP page is parsed with the `AnnouncementList` model" -> "... with the `RulesOfProcedureList` model" | `rg -n "class .*List" fixtures/rop.html` shows the CMS model name in the page identity block | `auto-apply` |
  | 2 | Verification, fixture line | "fixture `rop-2026-01.html` is 41,208 bytes" -> "... is 43,117 bytes" | `wc -c fixtures/rop-2026-01.html` = 43117 | `auto-apply` |
  | 3 | Design, date handling | "posting date falls back to the earliest document date" -> "... to the latest document date" | fixture rows: three documents dated 03-02, 03-05, 03-09, page shows posted 03-09 | `auto-apply` |
  | 4 | Design, page identity | "assert page identity on the `<title>` text" -> "... on the CMS model name" | `<title>` in the fixture is the site-wide default, identical across pages (`rg -c "<title>Site</title>" fixtures/` = 4) | `auto-apply` |
  | 5 | Design, run status | "a run with zero new items reports `success`" -> "... reports `success_empty`" | test output: `test_dedup_all_seen` asserts `success_empty` (`file:line`) | `auto-apply` |
  | 6 | Non-goals | adds "the ROP feed is out of scope for this release" | none | prefiltered to tier 2 (removes approved scope) |
  | 7 | Acceptance criteria | "at least 3 announcements per fetch" -> "at least 1" | fixture has one item | prefiltered to tier 2 (AC location) |
  | 8 | Verification, fixture line | "41,208 bytes" -> "43,117 bytes" | none cited | `escalate` (rubric a) |

- The `## Documentation impact` block below is verified against the diff at the conformance gate.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: README.md (line 66, the amendment sentence describes the funnel); doc/personas.md (roster line 10, Thinking budgets line 35: third dispatcher and amendment-review mode); CHANGELOG.md - deferred: release
- Derived / memory docs invalidated: none

Skill bodies and their `reference/` files are implementation surface per `skills/brainstorming/reference/documentation-impact.md`, tracked in [File-level changes](#file-level-changes). The standing grant's semantics do not change; README and personas change because they state the per-diff mechanic and the persona's caller list, both of which this spec alters.

## Predecessors

- `doc/specs/2026-09-18-council-grounding-amend-approval.md` - superseded for the presentation of standing amend approval (banner added); its grant boundary is carried here verbatim.
- `doc/specs/2026-08-04-lazy-load-disposition-protocol.md` - precedent for the lazy-loaded menu; the new reference is self-contained rather than linked.
- #27 (`v5.3.7`), #25 (`v5.3.6`) - contracts extended, not replaced; see [Why the calculus changed](#why-the-calculus-changed).

## Open questions

None. The reasoning-level mapping (`max` -> `xhigh`) was checked against pi-cohort's suffix parser (`src/runs/shared/pi-args.ts` `THINKING_LEVELS`, `off..xhigh`) and pi's `environment-variables.md` (`PI_REASONING_LEVEL` includes `max`).
