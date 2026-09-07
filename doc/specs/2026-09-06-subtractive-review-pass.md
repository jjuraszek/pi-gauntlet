# Subtractive review pass: `over-spec` council kind + closure-gate removal

## Problem

The critique pipeline is monotonic-add. Council members hunt gaps, the chair clusters them, the parent applies them, `writing-plans` turns every surviving clause into an owned task, and downstream reviewers treat the approved spec as binding. No step asks "is this clause more than the problem needs" while it is still cheap to cut.

Observed (gridstrong-dashboard session `2026-09-06T12-49-54`, branch `plant-file-tree-json`): a "return the folder tree as JSON like the HTML view" request produced a 279-line spec after a 19-cluster council round (all dispositions `apply`), and 37 files / +2733 lines - 8 app files vs 23 test files. Post-plan trimming (`-1231`, then `-1008` lines) happened only after the surface had been built and reviewed.

Root cause in this repo:

- `agents/spec-council-member.md:49` - closed kinds `gap, oversimplification, ambiguity, scope, not-actionable, external-ref, other`. Nothing means "more than needed"; `scope` is undefined and used for under-scope.
- `agents/conformance-reviewer.md:36` flags only surface with **no** origin requirement (`UNAUTHORIZED`, `origin: none (scope creep)`). Spec-mandated surface the prompt never needed is extracted as an `Rn` at step 1 and reads `DELIVERED`.
- `skills/verification-before-completion/reference/conformance-check.md:99-101` rule 2 - `UNAUTHORIZED` always defers to the finish gate regardless of `recommended:`, so even an obvious removal costs a human decision.

Inspiration only: [ponytail](https://github.com/dietrichgebert/ponytail) - one-axis subtractive review grammar, mandatory scored close, first-class "nothing to cut" verdict. Its deletion-first aggressiveness and its code-specific ladder are **not** transferred.

## Goals

1. A council member can name a spec clause as excess, with evidence, and the parent can cut it before the plan exists.
2. Every member report affirmatively states whether it found anything to cut, so the kind cannot silently go unused.
3. The closure gate catches spec-laundered excess the council missed, and removes obvious cases without a human round-trip.
4. Zero new agents, verdicts, dispositions, origin formats, or settings keys. Conformance-reviewer changes are minimal - it is the most valuable gate and its coverage focus must not dilute.

## Non-goals

- Prose terseness in specs (covered by communication-style rules; not this axis).
- A subtractive pass for the worker (non-council) critique path.
- Changes to `spec-reviewer`, `code-reviewer` (already carries `delete`/`yagni`/`shrink` tags at wave level), `writing-plans`, `plan_check`, `finishing-a-development-branch` (render or `reference/disposition-protocol.md`), the `UNAUTHORIZED` origin literal, the disposition availability table, or the token mapping.
- Arguing down anything a human wrote verbatim.

## Design

### D1. The `over-spec` predicate (shared by council and closure)

A clause is `over-spec` only when **all three** hold:

1. It is obviously outside the stated problem.
2. No human input requires it. Human input = the verbatim original prompt, ticket ACs, questionary answers, and user chat - and, at closure, any human decision the spec records (e.g. "user chose X"). Verbatim human input is off-limits.
3. It is not necessary to deliver the feature correctly. LLM-discovered necessities pass this leg and are **not** findings.

Any leg failing -> not a finding. Necessity beats leanness. When leg 2 cannot be established from the input the reviewer actually holds, the clause is not over-spec.

Example - legitimate finding: spec says "S6: compute a `checksum` over child names, expose `meta.checksum`, add a reconciliation job flagging mismatches"; prompt said "return the folder tree as JSON like the HTML view"; nothing else in the spec depends on S6. Example - non-finding: spec adds `format: false` on three compliance route mounts; nobody asked, but without it `.json` suffixes 404 on those mounts, so the JSON view cannot be delivered (leg 3 fails).

### D2. `spec-council-member` (`agents/spec-council-member.md`)

- Kinds list gains `over-spec` (eighth entry) and one defining sentence for the pair: `scope` = under-scope / wrong problem; excess is `over-spec` only.
- A paragraph defines D1, the off-limits rule, and the necessity-beats-leanness rule, followed by the D1 example pair (finding vs non-finding).
- `over-spec` bullet grammar (one line):

  ```
  - [major|minor] over-spec @ "<quoted spec clause>" — no human input requires this (closest human input: "<quote>" | none); adds: <M> files / <N> tests / <K> ACs; if cut, unprotected: <failure | nothing> → cut | shrink to <replacement>
  ```

  Severity: `major` when the clause buys >= 1 new file or >= 3 tests, `minor` below. Never `blocker` - an unneeded clause never makes a spec unsound. `adds:` is the member's estimate of the surface the clause mandates; `unprotected:` names the failure that goes uncaught if cut - `nothing` is itself the evidence. The human-input quote is drawn from the verbatim human input the dispatch passes (D4) - never from the spec's own prose.
- Output template gains a mandatory last line. The `findings:` header is retained per the existing convention (bullets omitted when none); `lean:` is always the line immediately after the header or its last bullet:

  ```
  lean: nothing to cut | <N> over-spec findings above
  ```

  `N` = count of `over-spec` bullets. `lean: nothing to cut` is a legitimate, expected answer for a tight spec.

Full template after the change:

```
verdict: sound | needs-work | unsound
addresses-problem: yes | partial | no — <why>
findings:
- [blocker|major|minor] <kind> @ <section or quote> — <problem> → <suggested edit>
lean: nothing to cut | <N> over-spec findings above
```

### D3. `spec-council-synthesizer` (`agents/spec-council-synthesizer.md`)

- Preserve the kind: cluster theme prefixed `over-spec:` (same rationale paragraph as `external-ref:` - the parent branches on the prefix). The cluster text carries the surviving bullet's `adds:` and `unprotected:` values verbatim (when members disagree, the maximum `adds:` and the most specific `unprotected:`), so the parent's audit line has its numbers.
- Adjudication rule: an `over-spec` cluster loses only to a finding that **rebuts D1 leg 3** - shows the clause is load-bearing, i.e. cutting it causes a product or delivery failure. A spec-quality defect on the excess clause (unnamed algorithm, missing AC, ambiguity) does **not** protect it; the cut resolves that finding, recorded in `resolved:`.
- Normalization, not strictness: a bullet that quotes a spec clause and states cut/shrink intent is kept even if `adds:` or `unprotected:` is missing (chair marks the value `unstated`). Drop only bullets whose quoted clause is verbatim human input (leg 2, checked against the human input the dispatch passes) or that quote no clause at all; one line each in `resolved:`.
- A `lean:` count that disagrees with the bullet count is noted in `resolved:` and the bullets are used; not a rejection.
- Output gains one mandatory line after `consensus:`:

  ```
  lean: <k> of <n> members found nothing to cut
  ```

### D4. `roasting-the-spec` (`skills/roasting-the-spec/SKILL.md`)

- Member dispatch task text gains a fenced block, passed by brainstorming: `Human input (verbatim; off-limits for over-spec): <original prompt> / <ticket AC snapshot, if any> / <questionary answers that changed scope>`. The chair task text carries the same block. This is the only source members and chair may quote for leg 2.
- Usable-critique probe (section 1): a member file is usable iff non-empty AND has `^verdict:`, `^addresses-problem:`, **and** `^lean:`. Missing `lean:` -> the existing one-shot targeted retry; still missing -> not usable, counted in `Coverage:`. Regex only, never content.
- Chair usability probe (section 2): `^consensus:` **and** `^lean:`; same retry rule as today.
- Step 3 apply: an `over-spec:` cluster decided `apply` is executed as deletion or shrink of the quoted clause **and** any AC / testing-approach line that exists only for it. Audit line formats: `Applied: over-spec: <clause> -> cut (was adds: M files / N tests / K ACs)` or `Applied: over-spec: <clause> -> shrunk to <replacement> (was adds: ...)`. `defer`/`reject` unchanged.
- Brainstorming's gate, revert valve, commit-body audit: unchanged - a cut is an applied council edit like any other. Brainstorming's invocation of this skill supplies the human-input block (one added sentence in `skills/brainstorming/SKILL.md`'s Spec Council section).

`skills/shape-ticket/SKILL.md` item 7 (its own copy of the usable-critique probe) gains `^lean:` - one line. Shape-ticket passes the raw ask as the human-input block.

### D5. Closure gate (`agents/conformance-reviewer.md`, `reference/conformance-check.md`)

Minimal: no new origin literal, no availability-table or token-mapping change, no `rescope` for this case. The over-spec provenance rides in `evidence:`.

**`agents/conformance-reviewer.md`**

- Step 1 (extract requirements) gains one reclassification sentence: a spec clause satisfying D1 against the human input you hold (verbatim prompt, ticket, human decisions the spec records) is **not** an `Rn`; it is reported once, as an `UNAUTHORIZED` row - never as `DELIVERED`, never also as origin drift. This is the one exception to "spec is canonical" and to the "if you catch yourself writing 'this could be cleaner', stop" guard - the test is D1, not taste.
- Step 4 ("Flag the unrequested") gains one sentence: `UNAUTHORIZED` covers both surface with no origin at all and spec-laundered excess per D1; the `origin` literal stays `none (scope creep)` for both, and for the spec-laundered case `evidence:` opens with `spec "<section>" - "<clause>" (over-spec)` followed by the surface (`files, specs`) and the unprotected failure. Necessity beats leanness: a clause another `Rn` needs to be delivered is not over-spec even if unrequested.
- Output example gains one `UNAUTHORIZED` row of the over-spec shape next to the existing `none (scope creep)` example.
- `recommended:` rule for **every** `UNAUTHORIZED` row (replaces the current harmless/otherwise rule):
  - `fix` only when removal is **contained** and leg 2 is established: containment = no other `Rn`'s `evidence` `file:line` lives in the code/test/helper files being deleted (the spec clause itself never un-contains). The row lists the deletions and the `Rn` rows unaffected. For the over-spec shape the deletions include the spec clause/AC line.
  - otherwise `accept`, with a human-voice, example-driven recommendation in `remediation`: what it costs, where it came from, what breaks if cut and what already covers that, then "I'd cut it / I'd keep it" with the condition that flips it. A bare provenance line is not a recommendation. `accept` for the over-spec shape means: keep code and clause; no spec write.
- "Propose, do not dispose" rule: the deferral list becomes `accept`/`rescope` (drop `UNAUTHORIZED` - it now follows `recommended:`).
- `rescope` note and Fields table: unchanged (`rescope` inapplicable to `UNAUTHORIZED`; origin literal `none (scope creep)`).

**`reference/conformance-check.md`**

- Delete disposition rule 2 (`UNAUTHORIZED` always defers). Rule 3 becomes "every remaining gap": `recommended: fix` -> fix loop (same preconditions), `accept`/`rescope` -> carried OPEN. The fast-path sentence drops "none `UNAUTHORIZED`"; the "any other mix carries the `accept`/`rescope`/`UNAUTHORIZED` gaps OPEN" sentence (~:117) and the closure-block sentence "carried OPEN as a deferred gap - `accept`/`rescope`/`UNAUTHORIZED`" (~:349) drop `UNAUTHORIZED`.
- Fix-loop dispatch (round step 2): for an `UNAUTHORIZED` `fix` whose `evidence` opens with the over-spec provenance, the orchestrator adds the spec path to the gap's `touched-files` so the implementer deletes the surface **and** the clause/AC line in the same fix commit; the re-audit then has no `Rn` for it and no `MISSING` echo.
- Concern decomposition (`:256-257`), concern-card template (`:421`), checklist (`:475`), availability table (`:279-283`), token mapping (`:304-306`): unchanged - the origin literal is unchanged, and `rescope` stays unavailable for `UNAUTHORIZED`.

Untouched: coverage rule for genuine `Rn`, drift check, `CONFORMS`/`GAPS` computation, fix-loop cap/preconditions, finish-gate render (`(rescope N/A: scope creep)` parenthetical stays correct), `UNAUTHORIZED` question text, phase-tracker parsing.

### D6. Flows

Spec path (S6 example from D1):

1. Member A: `- [major] over-spec @ "S6 ... reconciliation job" — no human input requires this (closest human input: "return the folder tree as JSON like the HTML view"); adds: 2 files / 6 tests / 1 AC; if cut, unprotected: nothing - a stale tree already hits the existing not_found path → cut`; closes `lean: 1 over-spec findings above`. Member B: `lean: nothing to cut`. Member C: `gap` on S6 ("checksum algorithm unnamed").
2. Chair: `over-spec: S6 checksum/reconciliation — adds: 2 files / 6 tests / 1 AC; unprotected: nothing` cluster; C's gap is a spec-quality defect, not a leg-3 rebuttal, so it resolves by the cut (`resolved:`); `lean: 1 of 3 members found nothing to cut`.
3. Parent applies: deletes S6 and its AC line. `Applied: over-spec: S6 checksum/reconciliation -> cut (was adds: 2 files / 6 tests / 1 AC)`.
4. Gate shows the audit; user may `revert applied council edit S6`. Plan never gets an S6 task.

Closure path (council missed it, S6 shipped): at step 1 the reviewer sees S6, finds no human input requiring it and no other requirement depending on `checksum.rb`/`reconcile_job.rb`, and does not list it as an `Rn`. Row: `[UNAUTHORIZED] G1: checksum + reconciliation - origin: none (scope creep) - evidence: spec "S6" - "..." (over-spec); checksum.rb, reconcile_job.rb, 6 specs; no Rn evidence in these files; unprotected: nothing - remediation: delete both files + specs, drop S6 (recommended: fix)`. Fix wave removes code and clause; finish gate lists the fix in the `auto-applied fix commits: <G1: SHA> (revertable)` index. Had `R4` cited `checksum.rb:12` as evidence: `recommended: accept` + "I'd keep it: R4 fails without it; cut only if R4 gets its own lookup".

## Edge cases

- Member omits `lean:` -> probe fails -> one retry -> else not usable (`Coverage:`). Chair omits `lean:` -> same retry rule as an unusable chair.
- `over-spec` vs another finding on the same clause -> the other finding wins only if it rebuts leg 3 (D3).
- Member quotes verbatim human input as the clause -> chair drops it; parent never sees it.
- Human input not passed to the council (caller omitted the block) -> members cannot establish leg 2 -> `lean: nothing to cut` is the correct output. Brainstorming always passes it.
- Closure reviewer holds only spec + prompt (+ ticket fallback); a human decision recorded in the spec satisfies leg 2. Leg 2 uncertain -> not over-spec, `Rn` as today.
- Worker (no council) path -> no spec-time `over-spec`; closure backstop still runs. Accepted.
- User reverts an applied cut at the gate -> normal change request; summarizer re-dispatched.
- Closure `recommended: fix` but the fix-wave implementer finds a hidden dependency -> reports BLOCKED per existing rules; gap carried OPEN to the finish gate as `accept`. No new path.
- `shape-ticket` `:low` roasts: `lean:` enforced by its own probe (D4); `lean: nothing to cut` is the common answer for a ticket body.
- Over-spec `fix` removes the spec clause in the same commit (spec path in `touched-files`) -> re-audit has no requirement to mark `MISSING`.

## Acceptance criteria

1. `agents/spec-council-member.md` lists `over-spec` in the kinds enum with the `scope`-vs-`over-spec` sentence, defines D1 with the example pair, specifies the one-line bullet grammar with `closest human input:`, `adds:`, and `unprotected:`, states the `findings:`-header-then-`lean:` order, and ends its template with a mandatory `lean:` line.
2. `agents/spec-council-synthesizer.md` preserves `over-spec:` as a cluster prefix carrying `adds:`/`unprotected:`, states the leg-3-rebuttal-only adjudication rule, normalizes incomplete `over-spec` bullets and drops only human-verbatim / no-clause ones into `resolved:`, and emits a mandatory `lean: <k> of <n> members found nothing to cut`.
3. `skills/roasting-the-spec/SKILL.md` passes the verbatim human-input block to members and chair, requires `^lean:` in both the member and chair usability probes, and defines the `over-spec` apply (clause + dependent AC/test-line removal) with both `-> cut` and `-> shrunk to` audit formats. `skills/brainstorming/SKILL.md` Spec Council section says brainstorming supplies the block. `skills/shape-ticket/SKILL.md` item 7 requires `^lean:`.
4. `agents/conformance-reviewer.md` step 1 carries the D1 reclassification sentence (over-spec clause is not an `Rn`, reported once as `UNAUTHORIZED`, exception to spec-canonical and the "cleaner" guard); step 4 defines the over-spec `evidence:` shape with the origin literal unchanged; the `recommended:` rule for every `UNAUTHORIZED` row is containment + leg-2-established for `fix`, else `accept` with the human-voice recommendation; the deferral list no longer includes `UNAUTHORIZED`; the output example shows one over-spec row.
5. `reference/conformance-check.md` has no rule making `UNAUTHORIZED` always defer, no `UNAUTHORIZED` in the two carried-OPEN sentences, and the fix-loop dispatch step adds the spec path to `touched-files` for over-spec `fix` gaps. Decomposition, concern card, checklist, availability table, and token mapping are byte-identical.
6. `scripts/ci.mjs` asserts the token presence/absence in AC 1-5 (see Testing).
7. `README.md`, `doc/personas.md`, `AGENTS.md`, `CHANGELOG.md` updated per Documentation impact.
8. A live `roasting-the-spec` run over a deliberately padded copy of a past spec, with the human-input block supplied, yields at least one `over-spec:` cluster and a chair `lean:` tally (recorded as a manual verify step in the plan, not automated).

## Testing approach

Prose surfaces; tests are `scripts/ci.mjs` string assertions in the style of the existing stale-token scan (`ci.mjs:136-152`):

- present: `over-spec` and a `^lean:` template line in `spec-council-member.md`; `over-spec:` and `lean:` in `spec-council-synthesizer.md`; `lean:` in both probe sentences of `roasting-the-spec/SKILL.md` and in `shape-ticket/SKILL.md` item 7; `Human input (verbatim` in `roasting-the-spec/SKILL.md`; `(over-spec)` in `conformance-reviewer.md`; `touched-files` + `over-spec` in the same paragraph of `conformance-check.md`.
- absent: "always** defers to the finish gate" in `conformance-check.md`; "`accept`/`rescope`/`UNAUTHORIZED`" in both `conformance-check.md` and `conformance-reviewer.md`; "harmless → `accept`" in `conformance-reviewer.md`.
- unchanged (assert still present): "keep `origin: none (scope creep)` verbatim" and "Unavailable: scope creep has no origin requirement to defer" in `conformance-check.md`; "use the literal `none (scope creep)`" in `conformance-reviewer.md`.
- `npm test` green; `check-agents-core.mjs` unchanged.
- Live: AC 8.

## Documentation impact
- Feature / user-facing docs introduced: none
- Materially amended existing docs: `README.md` (glossary "Spec council" row: mentions the `over-spec` cut + `lean:` tally; step 4 sentence: `UNAUTHORIZED` rows follow their recommendation, contained removals auto-run), `doc/personas.md` (`spec-council-member`, `spec-council-synthesizer`, `conformance-reviewer` one-liners), `CHANGELOG.md`
- Derived / memory docs invalidated: `AGENTS.md` agents section (conformance-reviewer paragraph - add one clause on over-spec reclassification and `recommended:`-driven `UNAUTHORIZED`); `skills/verification-before-completion/reference/conformance-check.md` disposition partition

## Open questions

None.
