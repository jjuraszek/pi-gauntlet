# Split axes: when one request becomes N artifacts

Consumed by `shape-ticket` (one ticket vs N), `brainstorming` (one spec vs N), and
`writing-plans` (scope check). One artifact is the default; a split must pass every
test below.

## Scope

This test governs **tickets and specs**. PR and plan decomposition is owned by
`writing-plans`; one ticket normally ships as one PR. A ticket carrying too many
concerns is split by this test - never by splitting its PRs, and never by layer.

## Identity test (a) - one concern or two

Two slices are **one** concern when either holds:

- they remediate the same precipitating failure (one trigger, one incident, one
  missing capability), however many components must change; or
- landing one makes the other's stated outcome true, moot, or unobservable.

A slice is **distinct** only if it remains independently user-valuable when every
sibling is never done, and answers a different top-level need from the source
request. Complementary cause statements are one cause: "A emits something B rejects"
and "B mishandles what A emits" describe one trigger from two vantage points.
Rewording a component's internal step as a "cause" does not create a second concern.

For feature and improvement work there is no root cause, so (a) reduces to the
counterfactual: would each slice still be worth doing alone, and would the requester
call them two different things? This is a judgment call and is labeled as one - it
is weaker than the bug-side test, not a mechanical check in disguise.

## Outcome test (b)

Each slice names an outcome a **user** observes. An outcome scoped to a component's
output ("the exporter emits a recognized identifier") is an internal step, not a
slice outcome - if a slice's headline outcome or AC is phrased at a component
boundary, it is an internal step renamed, and the slices merge.

## Closed axis list (c)

| Axis | Passes | Fails |
|---|---|---|
| Different actor or user journey | Operator bulk-import UX vs. installer first-run onboarding - different people, neither waits on the other | "API for the operator, UI for the operator" - one journey, two layers |
| Different data domain or lifecycle | Ingest correctness vs. retention/expiry policy - different data questions, separately valuable | "Write path vs. read path of the same record" - one lifecycle, two halves |
| Separable release timing | Only with documented topology + a real A-before-B schedule (see precondition below) | "Service A ships from a different repo than service B" - boundary without schedule or topology |
| Genuinely different problem statements sharing code | Two unrelated reported defects that happen to live in one file | One defect whose fix spans two files |
| `other - <justification>` | Never auto-qualifies; explicit human approval, and it may not restate or proxy a Never axis | "other - the fix is split across tiers" |

## Never an axis

Where the fix lives; which service, package, repo, or deployable the diff touches;
which layer (API, UI, DB, worker, ingest, job); which team owns it; "keep tickets
small". A single feature, bug, concern, or improvement routinely cuts through many
layers - normal, not a decomposition signal. Two slices sharing one concern are one
artifact however cleanly the code divides. A Never-axis failure is not waivable by
rewording; it is waivable only by evidence that the classification was factually
wrong.

## Discovery-conversion exemption

A discovery/delivery pair produced by the AC integrity gate's hard-stop conversion
is **not** an audit-detected split and is not subject to this test: one concern
deliberately sequenced by missing knowledge, with the delivery ticket linked and
parked not-ready. The exemption covers exactly that forced pair - it is not a
template for voluntary splits.

## Release-timing precondition (fail closed)

`axis: separable release timing` is available **only** when the resolved gauntlet
overrides file documents a `## Deployment` section stating independent ship
cadences, **and** the slices have a real schedule separation (A lands and is
verified before B starts), **and** each slice is independently verifiable
end-to-end. No inference from CI workflow files, no ask-and-assume: an undocumented
or monolithic topology makes the axis **unavailable** and the split fails closed to
one artifact. The skill may offer to document the topology in overrides; it may not
treat an in-session answer as the documented fact.

## Fixtures

```
Fixture 1 - relabeled layer split (must fail)
  slice 1: root cause: producer emits an unrecognized identifier
           outcome: the producer emits a recognized identifier
           axis: different data domain or lifecycle
  slice 2: root cause: consumer discards the whole run on one bad record
           outcome: the import run completes
           axis: different actor or user journey
  rejected by: identity test (a) - one precipitating failure described from two
  vantage points; slice 1's outcome is a component-boundary step under (b).
  correct result: one ticket, phased AC groups (identifier fix, then resilience).

Fixture 2 - deployable boundary (must fail)
  two slices differing only in which service/repo the diff touches, axis:
  separable release timing.
  rejected by: Never-axis list plus the release-timing precondition (no documented
  `## Deployment`, no A-before-B schedule).

Fixture 3 - legitimate split (must pass)
  slice 1: root cause: no retry surface exists for failed imports
           outcome: an operator can retry a failed import from the run list
           axis: different actor or user journey
  slice 2: root cause: expired records are never purged
           outcome: a compliance reviewer sees records disappear after the
                    retention window
           axis: different data domain or lifecycle
  passes: distinct triggers, each independently valuable if the other is never
  done, user-observable outcomes, non-locational axes.
```
