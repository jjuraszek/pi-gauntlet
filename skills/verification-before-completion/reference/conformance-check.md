# Deliverable Conformance Check

Tests passing proves the code runs. It does **not** prove the code does what was
asked. This check confronts deliverables (code **and** docs) against the
requirements.

## Dispatch a fresh reviewer (primary path)

The main session built the thing — it has confirmation bias. Delegate the check
to a fresh-context reviewer (`code-reviewer`) that reads the requirements vs the
diff cold. It cannot see session history, so pass in:

- The **spec** (path).
- The **original prompt** (verbatim — it holds inline requirements + any ticket ref).
- The **diff** to audit (code + docs).

Self-checking in the main session is the fallback when delegation isn't possible.

## Source of truth (priority order)

| Order | Source | Why |
|---|---|---|
| 1 | The written spec (`doc/specs/…`) | Canonical. Brainstorm already fetched the ticket, reconciled its ACs, recorded deviations here. |
| 2 | Original prompt | Catches inline requirements never folded into the spec. |
| 3 | Re-fetch the ticket | **Fallback only**, when no spec exists. Skip when a spec exists — the live ticket may have drifted. |

Project's issue-tracker skill (for the fallback) is named in `.pi/superpowers-overrides.md`.

## Drift = red flag

Spec vs prompt/ticket disagree → **STOP and reconcile**, do not absorb silently.

- Intentional, recorded deviation → spec wins (it was review-gated).
- Unrecorded divergence → spec silently dropped/altered a requirement = conformance
  failure. Fix spec or code, re-verify. No completion claim over unreconciled drift.

## Coverage rule

Default (~90%): **1 ticket = 1 spec = code covering every AC.** "Every AC" =
explicit acceptance criteria **+** implicit notes in ticket body and comments.
Ticket and solution must end in sync.

Multi-spec effort → allowed **only if the spec explicitly says** it covers a
defined subset and names the deferred ACs. Silent partial coverage = failure.

## Checklist

- [ ] Located canonical requirements (spec → prompt → ticket fallback)
- [ ] Enumerated every requirement: explicit ACs + implicit notes + inline prompt reqs
- [ ] Checked spec ↔ prompt/ticket drift; reconciled any divergence
- [ ] Each requirement mapped to where it's satisfied (code/doc) + evidence
- [ ] Multi-spec? Subset declared in spec; deferred ACs noted as out of scope
- [ ] Gaps reported, or all rows satisfied

Can't check all boxes (or unreconciled drift)? Not complete. Report the gap.
