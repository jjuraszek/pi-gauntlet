# Spec summary at the user review gate

## Context

`skills/brainstorming/SKILL.md` ends at a single human gate: the user reviews a
freshly written, council-critiqued spec and green-lights plan + execution. In
practice the spec functions as a captain's log — the trace of decisions and
context that downstream LLM phases (`writing-plans`, `subagent-driven-development`,
the conformance gate) consume. Real specs run 15-30KB; a supervising human rarely
reads them in full before approving. Correctness is already carried by the critique
pass (spec council, here 4 members + chair) and by `verification-before-completion`
/ the conformance gate downstream. What the human gate lacks is a **tight, human-
readable projection of the spec sufficient to make the green-light decision** without
reading the whole document.

This spec adds that projection (**A**) and a surgical pressure to keep specs self-
contained so the projection is trustworthy (**C**).

`brainstorming/SKILL.md` is tracked against the obra/superpowers ancestor; its diff
must stay minimal and legible for re-sync. `roasting-the-spec` and the `agents/*.md`
personas are original (no obra ancestor) and may be edited freely.

### Ground truth: what a green-light decision needs

Section-heading frequency across a real-world consumer spec corpus (root + per-
service `doc/specs`) shows what mature specs are actually organized around. By
heading frequency the ranking is: `problem` dominates, then the scope cluster (`out
of scope` + `non-goals` + `scope`), then the decisions cluster (`decisions` / `key
design decisions` / `resolved decisions`), then the verification cluster (`testing`
/ `verification` / `acceptance criteria`), with `edge cases`, `rollout`, and `risks`
trailing. `open questions` also appears frequently — addressed below.

The decision layer (scope boundaries, key decisions + rejected alternatives, risk
surface, acceptance) dominates. A summary that lists only inputs/outputs/algorithm
tells the supervisor *what* is built but not *whether* to approve it. The summary
contract (Decision 4) is organized around the decision layer first.

`open questions` is **deliberately excluded** from the *summary contract*: a
spec that reaches this gate has already had its placeholders resolved (lint,
checklist item 8) and its ambiguities adjudicated (critique pass). A good spec
carries no open questions to the gate. This is **not** the same as hiding unresolved
items: brainstorming's existing gate already renders critique-pass "could-not-
resolve" ambiguities (`skills/brainstorming/SKILL.md`, the worker-flag surfacing
line) and the summary's own gap footer **adjacent to** the summary in the same gate
message. The summary stays a clean projection of a resolved spec; the residuals
ride beside it, not inside it (Decision 3).

## Decisions

1. **A new `spec-summarizer` agent produces the summary; no builtin fits.** It is a
   genuinely new shape: fresh context, read-only, spec-only input, human-prose
   output. `worker`/`planner`/`oracle` are `defaultContext: fork` (inherit the
   brainstorming conversation — destroys the spec-only faithfulness property) and
   emit code/plan/drift artifacts. `context-builder`/`scout` search the codebase
   (the opposite of spec-only). `spec-reviewer` emits per-requirement compliance
   verdicts against an implementation that does not exist yet.

2. **Spec-only input is a feature, not a limitation.** A cold reader who can produce
   a tight, complete summary from the spec alone proves the spec is self-contained.
   A thin or confused summary is a valid signal that the spec leans on un-captured
   context — surfaced, not papered over. The summarizer therefore gets `tools: read`
   only (cannot grep/explore), `defaultContext: fresh`, and **`inheritProjectContext:
   false`** (must not pull `AGENTS.md` — it reads only the spec file passed in the
   task). `inheritSkills: false`, `completionGuard: false`, `systemPromptMode:
   replace`.

3. **Ephemeral, folded into the existing gate — no new gate, nothing committed.** The
   summary is a decision aid for a human already supervising the flow. The summarizer
   returns the summary; brainstorming prints it **inside** the current User Review
   Gate message, above the existing "Spec written and committed..." line. The spec
   file is unchanged (stays a pure trace), so the faithfulness signal stays clean and
   the council-blessed, placeholder-scanned spec is not re-mutated. On a change
   request the summarizer re-runs cheaply.

4. **Adaptive contract, not a rigid template.** The summarizer is instructed to
   optimize for "what does a supervisor need to approve *this* spec," using a
   recommended checklist, **omit-empty** (a bugfix has no new endpoint; a refactor
   has no algorithm — emitting "N/A" violates the no-filler rule), and license to add
   a section the spec demands. Ordered decision-layer-first so the reader can stop
   early. Recommended sections:
   - Problem + idea (3-5 sentences).
   - Key decisions + notable rejected alternatives.
   - Scope: in / explicitly out (non-goals).
   - Risk surface: shared contracts, schema/migrations, irreversibility, rollout.
   - Inputs / conditions / UI / endpoints.
   - Outputs: new pages, comms protocols, DB/data changes.
   - Key changes to the current process.
   - Caveats / edge cases.
   - Algorithm: key mechanism + decision points, when the spec defines one — an
     example with explanation beats a step transcript; skip SQL/syntax.
   - Acceptance: how we'll know it's done, when the spec defines it.
   - Gap footer: external context the spec leans on but does not inline (the A side
     of A+C; see Decision 6).
   Baked-in rules: read ONLY the given spec; never infer beyond it; if it references
   something it does not contain, list it in the gap footer — do not invent it;
   tight, human-readable, no obvious statements.

5. **`model` and `thinking` unset (preset-supplied), matching `worker`.**
   Summarization is not reasoning-heavy like the council. The persona carries no
   `model:` and no `thinking:`; the dispatch passes no `model:`. Consumers may set
   `subagents.agentOverrides.spec-summarizer.model` (unset → inherits the main loop).

6. **C: the critique pass flags load-bearing external refs; the parent inlines them
   — flag-not-inline.** Council members are read-only critics by contract and
   usually lack the ticket anyway; only the parent (which fetched the ticket during
   brainstorming) can inline external AC/ticket text. So the critique pass *judges
   and flags*, the parent *inlines* through the existing disposition / edit mechanism
   before the summary runs. This keeps the disposition gate, the user approval, and
   parallel-edit safety intact. By the time the summarizer runs, A's gap footer
   trends empty — the healthy signal.

7. **C touches three spots (the flag must survive the whole council path);
   `roasting-the-spec/SKILL.md` is untouched.** The council member already flags
   un-inlined load-bearing context under axis 2 (logical gaps, "data that appears
   from nowhere"). The naive "two spots" version (member persona + brainstorming)
   silently fails on the council path: the chair (`spec-council-synthesizer`) emits
   `clusters: - [severity] <theme>` with **no `<kind>` field**, so an `external-ref`
   finding is absorbed into generic cluster prose and the parent cannot detect it.
   C therefore touches:
   1. **`agents/spec-council-member.md`** — one sentence in axis 2 + `external-ref`
      added to the `<kind>` enum.
   2. **`agents/spec-council-synthesizer.md`** — instruct the chair to surface any
      member `external-ref` finding as a **distinct labeled cluster** (theme
      prefixed `external-ref:`) so it survives synthesis and the parent can
      pattern-match it.
   3. **`skills/brainstorming/SKILL.md`** — an explicit step: after the critique
      pass returns, scan the chair clusters (or the worker return summary) for
      `external-ref` flags and inline the referenced context (parent has the ticket)
      before dispatching the summarizer.
   The no-council fallback `worker` path needs no synthesizer hop — the worker
   returns its flag directly to the parent — so the same brainstorming scan step
   covers both paths. `roasting-the-spec/SKILL.md` owns no critique axes (the
   personas do) and needs no edit.

8. **Summarizer failure does not block the gate.** The summary is an aid, not a gate.
   If the dispatch fails, brainstorming reaches the gate with a one-line "summary
   generation failed" note; the human reads the spec directly or asks for a retry.

## Order of operations (within brainstorming, after the critique pass)

1. Critique pass returns (council dispositions, or worker fixes).
2. Parent scans the critique return for `external-ref` flags (chair clusters whose
   theme is prefixed `external-ref:`, or the worker return summary) and inlines the
   referenced context it has (C) via the normal disposition / edit path.
3. Re-run placeholder scan (existing checklist item 10).
4. Dispatch `spec-summarizer` (fresh, `cwd` = worktree, task = read spec at abs path,
   emit summary per the adaptive contract).
5. Parent folds the returned summary into the existing User Review Gate message; any
   gap-footer entries are surfaced there for the human to decide.
6. User approves → `/skill:writing-plans`. Change request → revise, re-dispatch the
   summarizer.

## Edit plan

### `agents/spec-summarizer.md` (new)

Frontmatter: `name`, `description` (state: dispatched only by brainstorming's gate
step; not for direct dispatch), `tools: read`, `defaultContext: fresh`,
`inheritProjectContext: false`, `inheritSkills: false`, `completionGuard: false`,
`systemPromptMode: replace`. No `model:`, no `thinking:` (Decision 5). `tools: read`
is sufficient because the dispatch captures the return value inline — it uses **no
`output:` path** (which would require `bash`, per the council-member precedent).

Body = the summary contract from Decision 4: role (cold reader, spec-only), the
adaptive recommended-section checklist with omit-empty + decision-layer-first
ordering, the algorithm/example guidance, and the gap-footer rule. Explicit
prohibition on reading anything but the given spec or inferring beyond it. Final
line: "Output the summary as your final text response" (no file write).

### `skills/brainstorming/SKILL.md` (obra-tracked — minimal, surgical)

- **Checklist** — insert a new item between current 10 (re-run placeholder scan) and
  11 (user review gate). Final numbering: 10 = Re-run placeholder scan (unchanged),
  **11 = Generate spec summary (new)**, 12 = User review gate (was 11), 13 =
  Transition (was 12). Update the intro/terminal-state line only as needed (the gate
  remains the terminal human state).
- **Critique-return scan (C)** — in the order-of-operations / critique section, add an
  explicit step: after the critique pass returns and before re-running the
  placeholder scan, the parent scans the chair clusters (theme prefixed
  `external-ref:`) or the worker return summary for external-ref flags and inlines
  the referenced context it has (the ticket fetched during brainstorming).
- **User Review Gate section** — render the returned summary above the existing
  "Spec written and committed to ..." block; state explicitly this is part of the
  existing gate, not a new one, and that any critique-pass-unresolved ambiguities +
  gap-footer entries render adjacent to it (the worker-flag surfacing line already
  present). Include the dispatch snippet (mirrors the worker snippet; `agent:
  "spec-summarizer"`, `context: "fresh"`, `cwd:` = worktree abs path, no `model:`,
  no `output:`). Note the failure fallback (Decision 8).
- **Spec Self-Review / critique (worker fallback) snippet** — add one check line to
  the worker task: external refs — flag load-bearing external context (ticket ACs,
  commit SHAs, docs) the spec references but does not inline; recommend inlining
  (do not fetch).
- **Red flags** — add: `About to reach the user gate without rendering the spec-only
  summary`.

### `agents/spec-council-member.md` (original — edit freely)

- Axis 2 (logical gaps): one sentence — a load-bearing reference to external context
  (ticket AC, commit SHA, doc) that the spec does not inline is a gap; flag it for
  inlining.
- `<kind>` enum: add `external-ref` (→ gap, oversimplification, ambiguity, scope,
  not-actionable, external-ref, other).

### `agents/spec-council-synthesizer.md` (original — edit freely)

- One sentence: when any member raises an `external-ref` finding, emit it as a
  distinct cluster with the theme prefixed `external-ref:`, so the flag survives
  synthesis (the cluster format has no `<kind>` field) and the parent can
  pattern-match it for inlining. Without this, C silently fails on the council path.

### `README.md`

Document the `spec-summarizer` agent (role, dispatched by brainstorming's gate step)
and the `subagents.agentOverrides.spec-summarizer.model` knob. Update the stale
agent-count references now that a seventh agent ships: "**6 subagent personas**",
"symlinks the six agent files", "the six personas" → seven/7.

### `AGENTS.md`

- "Six agents ship in `agents/`" → seven; add `spec-summarizer` to the list, noting
  it is dispatched only by brainstorming's gate step.
- Add a `spec-summarizer` column/row to the knobs table: `tools: read`, `thinking:`
  unset, `defaultContext: fresh`, `inheritProjectContext: false`, `inheritSkills:
  false`, `completionGuard: false`.
- Add one line documenting the `external-ref` finding kind for `spec-council-member`.

### `CHANGELOG.md` + `package.json`

Minor bump (new agent + new brainstorming behavior).

## Out of scope

- **Persisted summary** (committed sidecar `*.summary.md` or `## Summary` prepended
  into the spec). Explicitly dropped: it mutates the council-blessed spec, can drift,
  and muddies the faithfulness test. Ephemeral only (Decision 3). A later spec may
  add PR/conformance-gate consumption if wanted.
- **Council members inlining the spec directly.** Rejected — breaks the read-only
  contract, the disposition/user-approval gate, and parallel-edit safety; members
  usually lack the ticket. Flag-not-inline only (Decision 6).
- **`roasting-the-spec/SKILL.md` edits.** The council personas own the axes and
  cluster format (Decision 7); the skill's gating/dispatch logic is unchanged.
- **Open-questions section in the summary.** Excluded by design (see Context).
- **Summarizer fetching external refs / reading the codebase.** Spec-only is the
  whole point (Decision 2).

## Verification

- `rg -ni "<company-placeholders>" skills/ agents/` per AGENTS.md → zero matches
  (generic-skill/agent lint).
- `agents/spec-summarizer.md` frontmatter matches Decision 2/5: `tools: read`,
  `defaultContext: fresh`, `inheritProjectContext: false`, no `model:`, no
  `thinking:`.
- `skills/brainstorming/SKILL.md`: the obra-tracked diff is minimal — one new
  checklist item + renumbering, the gate-render paragraph + dispatch snippet, the
  one-line worker external-ref check, and one red flag. No unrelated rewrites.
- `agents/spec-council-member.md`: `external-ref` present in the `<kind>` enum; one
  added sentence in axis 2; output template otherwise byte-identical.
- `agents/spec-council-synthesizer.md`: the `external-ref:`-prefixed-cluster
  instruction is present (the flag survives synthesis); cluster format otherwise
  unchanged.
- `skills/brainstorming/SKILL.md`: final checklist numbering is 10 scan / 11 summary
  / 12 gate / 13 transition; the critique-return external-ref scan step is present.
- `rg -n "6 subagent personas|six agent files|six personas" README.md` → zero stale
  occurrences after the bump.
- `AGENTS.md` agent count reads seven and the knobs table has the `spec-summarizer`
  entry.
- Manual read-through: the summarizer body is unambiguous about spec-only +
  omit-empty + decision-layer-first, and the gate section makes clear no new gate is
  introduced.
- `git --no-pager grep -n "spec-summarizer" -- README.md AGENTS.md` → both reference
  it.
