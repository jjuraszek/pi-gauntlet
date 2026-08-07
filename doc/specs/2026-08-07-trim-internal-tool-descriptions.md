# Trim internal tool descriptions (gauntlet_setting, phase_tracker)

## Context

`extensions/phase-tracker.ts` registers two gauntlet-internal tools, `gauntlet_setting` and `phase_tracker`, whose multi-clause descriptions ship in the tool list on every request. Both self-declare as internal ("Not for ad-hoc use" / "invoked by skills"), and every call site is a skill body (`brainstorming`, `writing-plans`, `subagent-driven-development`, `verification-before-completion`, `roasting-the-spec`, `finishing-a-development-branch`, `test-driven-development`) that is loaded into context at call time and carries concrete invocation examples. The descriptive payload is therefore duplicated on every request for no correctness benefit: ~120-200 tokens/request of pure overhead (the two strings shrink from 59 to 11 and 87 to 15 words respectively; ~120 tokens by word count, up to ~200 amortized across tool-list shipments).

`plan_tracker` (`extensions/plan-tracker.ts`) is explicitly **out of scope**: its long description ("Do NOT use for brainstorming, research, or planning checklists...") deters the model's ambient TODO-list reflex, which fires when no skill is loaded - that deterrent must stay always-visible.

## Change

Two string replacements in `extensions/phase-tracker.ts`, nothing else.

### gauntlet_setting description (currently lines 564-568)

Current (4 clauses: internal marker, resolution semantics, per-key return shapes, deterrent):

> "Gauntlet-internal, invoked by skills: resolve a merged piGauntlet.* setting (repo .pi/settings.json over the agent preset). Returns the resolved value as a JSON block in the result content - specCouncil yields the council-vs-worker verdict, closureReview yields the conformance-gate model/enforce/maxFixRounds. Not for ad-hoc use."

New:

> "Resolve merged piGauntlet.* settings (repo over preset); for skill use only."

The per-key return shapes already live in the consuming skills (`brainstorming` documents the `specCouncil` verdict object; `verification-before-completion` documents `closureReview`), and the `key` param description retains "merged repo-over-preset". "For skill use only" is the single deterrent clause - this tool has no plausible ambient-misuse mode, so one clause suffices.

### phase_tracker description (string literal currently at lines 587-590; `description:` key at 586)

Current (action enumeration + gate-arming explanation + ad-hoc warning + deterrent):

> "Track workflow phase progress (brainstorm → plan → implement → verify → ship). Actions: start (mark phase in_progress), complete (mark phase complete), skip (mark phase skipped with reason), status (show all phases), reset (clear all phases), substep (set/clear a substep label on an in_progress phase). Drives gauntlet-flow enforcement entered via brainstorming; the closure gate, closure-model guard, and flow guards arm only when brainstorming started the flow. Ad-hoc start verify/start implement calls do not arm the gates. Not for ad-hoc use."

New:

> "Track workflow phase progress (brainstorm → plan → implement → verify → ship); ad-hoc calls do not arm gates. Not for ad-hoc use."

The action enumeration is redundant with the schema: the `action` enum's self-evident names plus the `phase`/`reason`/`substep` param descriptions (phase-tracker.ts:191/196/206) and the concrete call examples in the skill bodies carry the per-action semantics. Two deterrent clauses are kept deliberately: "ad-hoc calls do not arm gates" tells the model an ad-hoc call is *ineffective* (deterring "start verify to arm the gate" misuse), "Not for ad-hoc use" tells it the call is *unwanted* - they deter different failure modes for ~5 tokens.

### Unchanged

- All parameter schemas and parameter descriptions on both tools (they carry call-correctness semantics - `force`, `substep`, `reason` - not present in every calling skill).
- `plan_tracker` in full.
- Tool names, labels, behavior, settings keys, and all skill bodies.

## Non-goals / out of scope

- Trimming parameter descriptions (savings ~30 tokens, risk of malformed calls).
- Moving the cut prose into a reference doc (it already lives in the calling skill bodies listed in Context; a third copy violates single-source).
- Any change to `plan_tracker` or to skills.

## Verification

- `npm test` (`scripts/ci.mjs`) - the existing gate. It asserts resolver behavior, the `pi.settings` ban, and pack shape; it does not (and should not) assert on description prose, so no test changes.
- Post-edit sanity (run after the edit to confirm): `rg -n "Not for ad-hoc use" extensions/` returns exactly one match (phase_tracker's trimmed tail); `rg -n "Do NOT use for brainstorming" extensions/plan-tracker.ts` still matches (plan_tracker untouched).

## Edge cases

- The two descriptions are the only always-visible surface documenting the phase arrow and the gate-arming caveat outside skill bodies. The phase arrow survives whole; the caveat survives in reduced form (the ad-hoc-ineffectiveness half only) - the positive arming mechanism ("gates arm only when brainstorming started the flow") is deliberately dropped from the tool surface and relies on skill-body coverage.
- No code, test, README, or AGENTS.md content quotes the description strings, so no ripple edits (verified by recon: `scripts/ci.mjs` has no description assertions; AGENTS.md's extensions table names the tools without quoting descriptions).
- This is extension-surface prose only - no cross-repo contract (dispatch shape, cost channel, settings keys) changes, so no sibling-repo doc updates.

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: none (README documents config keys, not tool descriptions; CHANGELOG entry rides the next release commit per release skill, not this change)
- Derived / memory docs invalidated: none
