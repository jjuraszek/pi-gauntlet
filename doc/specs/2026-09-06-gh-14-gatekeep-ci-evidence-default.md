# gatekeep-pr: green exact-head CI evidence as the default, local verification as fallback

Ticket: [jjuraszek/pi-gauntlet#14](https://github.com/jjuraszek/pi-gauntlet/issues/14)

## Context

`gatekeep-pr` gathers `status_checks` for the assessed `headRefOid` (verification-brief.md Section A) and then **unconditionally** runs the repo's local verification command (SKILL.md Phase 3 -> verification-brief.md Section B). Green CI on the exact head never substitutes today; the local full run duplicates already-authoritative CI results and can replace them with workstation-specific noise. Consumer precedent: gridstrong's `## PR gate` overrides already hand-roll CI-first in prose (`verification evidence:` key); this change upstreams that as the shipped default.

Sibling-skill audit (recorded so the question doesn't resurface): no other shipped skill has this shape. `verification-before-completion` and `finishing-a-development-branch` run pre-push/pre-PR where no exact-head remote CI can exist yet (and the verify phase is the intended remaining full-suite venue); `requesting-code-review` runs no suite; `check-delivery` assumes CI already ran but never inspects check results and never runs tests. gatekeep-pr is structurally unique: it is the only skill operating on an already-existing PR whose CI already ran.

## Change

Prose-only, three files: `skills/gatekeep-pr/SKILL.md`, `skills/gatekeep-pr/verification-brief.md`, `README.md` (`## PR gate` schema plus the skill-inventory blurb at ~line 72, which today says gatekeep-pr runs the project's verification command - reworded to CI-first with local fallback). Per the authoring constraint, the edits are condensed and declarative: all branching collapses into one flat decision table; no conditional prose woven through phases.

### 1. Evidence resolution table (verification-brief.md, top of Section B)

A normative "Evidence resolution" table becomes the single rule for whether Section B's local command runs. It is the executable-verification substitute in this prose-contract repo (no skill-path test harness): reviewers and the conformance gate check against it. Section B's local-command protocol (safety contract, timeout, credentials skip, raw-tail evidence) is unchanged and runs only when the table says **fallback**.

Inputs come from Section A's existing `gh pr view` call - no second fetch. One digest schema change: `status_checks` gains a `url` field per check (CheckRun `detailsUrl` / StatusContext `targetUrl`, already present in the fetched payload), so the CI claim can cite the run; when the payload omits it, the claim records `url: unavailable` instead of disqualifying the check. Section A also gains one normative mapping sentence: GraphQL enums are case-folded; a StatusContext's `state` is its conclusion, with `ERROR` blocking and `PENDING` pending; `ci checks:` matches check name, workflow name, or status context, trimmed, case-insensitive.

- **Resolved check set** = checks named by `ci checks:` if configured, else all checks on the assessed `headRefOid`.
- **Conclusion semantics**: `success` satisfies; `failure`/`timed_out`/`action_required`/`error` block; `neutral`/`skipped`/`cancelled`/`stale`/`startup_failure` are inert; a check with `status != completed` is pending; a completed check with a missing/unreadable conclusion cannot satisfy (fail-safe).

Row precedence is top-down: the first matching row wins.

| Path | Trigger | Action | Evidence recorded |
|---|---|---|---|
| Opt-out | `local verification: always` in `## PR gate` | Run local command unconditionally (today's behavior); a Failed-CI block below still applies independently | Local, as today |
| Failed CI | Any blocking conclusion in resolved set | Blocks: mints a `P#` (Phase 4 change - today only required-check failures block; under this table any resolved-set failure does). A green local run never overrides it. Only an explicit human CI-infrastructure-broken disposition (a third disposition beside flaky/real, offered in the same menu) triggers the fallback run; merge stays withheld until the fallback produces green evidence | The disposition, recorded alongside the fallback result |
| CI-sufficient | >=1 `success` in resolved set | Skip local run | CI claim: check name(s), conclusion, assessed SHA, run URL |
| Pending | Zero `success` and >=1 pending check in resolved set | Evidence decision waits until the set reaches a completed conclusion - never a fallback trigger, never an evidence-less merge; merge is withheld as missing evidence until the table re-resolves | n/a (waiting) |
| Fallback | No checks on assessed head, or zero `success` with none pending (all inert / fail-safe) | Run local command (Section B, unchanged) | Local command + raw tail, existing provenance rules |
| Stale head | Head advances (fix wave push) - cross-run: within one gather the rollup is structurally same-head | All prior evidence (CI or local) is stale; re-resolve this table for the new head before merge is offered | Fresh evidence for the new head |

CI-sufficient predicate, stated once (the table rows above implement exactly this): **>=1 completed `success`, zero blocking conclusions, no opt-out.** Pending checks are excluded from the predicate - they neither satisfy nor veto it.

Decision independence (the mixed case, decided): the evidence decision ("run local?") and the merge decision ("can this merge?") are separate consumers of the same `status_checks` data. A green non-required check satisfies evidence even while a pending required check blocks merge under the existing wait rule. The only evidence-path wait is the Pending row's zero-success case.

### 1a. Verifier output and claim-check (verification-brief.md Section B)

- The Verifier output schema becomes source-discriminated: `source: ci` (check names, conclusions, assessed SHA, urls - no `command`/`raw_tail`) or `source: local` (today's shape, unchanged). Local provenance/raw-tail rules bind only to `source: local`.
- The material-claim check always runs, on both sources: on the CI path it dispositions test claims against the recorded CI evidence and the diff.
- The "missing evidence blocks merge" / `result: not run` edge case is rescoped to the fallback and opt-out rows only - a table-sanctioned skip is not missing evidence. The Section B edge-case bullet saying `not run` blocks merge is amended accordingly (it is part of this change's edit list, not just the table).

### 2. SKILL.md edits

- **Phase 3** shrinks to: resolve verification evidence per the Section B table; run the local command only on a fallback/opt-out row. The current unconditional "run Section B" sentence is replaced, not annotated. The skill's intro sentence ("runs the project's own verification command") is reworded to CI-first with local fallback.
- **Phase 4 claim wording**, parallel to the local path's "reproduced locally under the project's documented verification command": the CI path claims exactly `verified by CI: <check name(s)> succeeded on <sha> (run <url>)` - never phrased as local reproduction, never implying the local command ran. The verdict's evidence line names its source (CI claim or local command + exit code).
- **Missing-evidence rule**: green exact-head CI is valid evidence, not merge-blocking "not run". `result: not run` still blocks when the table required a fallback run that didn't happen.
- **Phase 4 changes** (deliberate, not "untouched"): any blocking conclusion in the resolved set mints a `P#` (today: required checks only); the disposition menu gains CI-infrastructure-broken as a third option beside flaky/real, whose selection triggers the fallback run and holds merge until it is green. CAS head check and post-selection loop: untouched.

### 3. Overrides schema (README `## PR gate` + SKILL.md configuration resolution)

Two new optional keys, flat like the existing ones, loaded from the base branch like the rest:

- `local verification: always` - opt-out; absent = CI-first (the new default).
- `ci checks: <comma-separated check names>` - narrows the resolved set; absent = all checks on the assessed head.

No `settings.json` key; per-repo prose config like the rest of the PR gate block.

## Edge cases

- A completed check with missing/unreadable conclusion: fail safe - cannot satisfy; missing `required` means treated as non-required (otherwise no-protection repos could never be CI-sufficient); missing `url` degrades the claim to `url: unavailable`, never disqualifies.
- Repos with no branch protection (no required checks - the common case): any green check satisfies; nothing waits.
- All checks still pending, zero successes: Pending row - evidence decision waits; no fallback, no evidence-less merge.
- `requires credentials: true` + green CI: CI-sufficient path applies; the credentials skip-with-report only arises on fallback.
- CI-sufficient is still read-only and consent-gated: no auto-merge, no posting, no menu change.

## Out of scope

- `verification-before-completion` / conformance review full runs (intended venue, per ticket).
- `finishing-a-development-branch` pre-PR and post-squash runs: no PR-head CI exists at those points, so the "duplication" shape cannot occur - acknowledged here so it isn't reopened.
- `check-delivery` (never runs suites).
- Mapping checks to affected projects; treating deployment/environment claims as verified by green CI; missing/misconfigured fallback command behavior.
- gridstrong consumer cleanup: its `verification evidence:` override line becomes redundant post-ship; its per-project narrowing maps to `ci checks:`. One-line follow-up in that repo.

## Acceptance criteria (from #14, all mechanical)

1. Resolved set has >=1 completed `success`, zero blocking conclusions, no opt-out -> no local run; satisfying checks + assessed SHA + run URL reported as evidence; no missing-evidence merge block.
2. Checks absent, or zero successes with none pending -> local command runs under existing provenance/cleanliness rules; pending is never a fallback trigger (zero-success + pending -> the evidence decision waits).
3. `failure`/`timed_out`/`action_required` blocks under P# rules; local green cannot override; only an explicit CI-infrastructure-broken disposition triggers fallback, recorded with the fallback result.
4. Head advances -> old evidence stops satisfying; fresh evidence (CI or fallback) required before merge is offered.
5. `local verification: always` -> today's unconditional-local behavior, unchanged.
6. SKILL.md Phase 3, verification-brief.md Section B, README `## PR gate` all define green exact-head CI as valid evidence.
7. verification-brief.md carries the normative decision table (six paths above, trigger -> outcome).

## Testing

Prose-only change. Verification: `npm test` (scripts/ci.mjs - frontmatter, reference integrity, marketplace pins) plus the AGENTS.md genericity grep over `skills/`. No skill-path test harness exists; the decision table is the reviewable test surface (AC 7).

## Documentation impact

- Feature / user-facing docs introduced: none
- Materially amended existing docs: `skills/gatekeep-pr/SKILL.md`, `skills/gatekeep-pr/verification-brief.md`, `README.md` (`## PR gate` schema + skill-inventory blurb)
- Derived / memory docs invalidated: none
