## Examples and rationalizations

Read this when applying the AC integrity gate (drafting, repairing, or adjudicating a hard-stop/park/relocate outcome). The bad->good ticket body exemplar (self-containment) lives in `ticket-wording.md` - not duplicated here.

### Bad -> good AC examples

**Wishful**

- Bad: `- [ ] Search is noticeably faster`
- Good: `- [ ] p95 search latency <= 300ms (baseline 520ms, measured <date> via the request-timing dashboard)`

**Tautological**

- Bad: `- [ ] The identified flaky tests are fixed`
- Good (discovery conversion): `- [ ] A list of tests failing intermittently over the last 30 CI runs is linked, with per-test failure rates`

**Unspecified-but-binding**

- Bad: `- [ ] Import completes in acceptable time`
- Good: `- [ ] Importing a 10k-row CSV completes in under 60s`

**Discovery pair** (bad ticket -> good ticket, not just a bad->good AC)

- Bad ticket: `Investigate checkout performance` - unbounded, no artifact.
- Good ticket: `Discovery: capture checkout-flow latency baseline`, with ACs:
  - `- [ ] p50/p95 for the 3 checkout steps captured, method documented`
  - `- [ ] go/no-go decision on optimization work recorded with rationale`

### Rationalization table

| Excuse | Reality |
|---|---|
| "The baseline is obviously about X" | A number with no citable source today is a guess - ask, or convert to discovery |
| "The AC is clear from context" | If you cannot name the observation that ticks the box, nobody can - name it or park |
| "Skip evidence, the change is trivial" | Evidence is what lets someone other than the author tick the box |
| "The reporter's fix IS the ticket" | The fix is a sketch in Idea; the ticket is the observable outcome |
| "Park it quietly so the gate passes" | Parking without naming the missing value hides the defect it exists to surface |
| "Split by layer to keep tickets small" | Layers are not deliverables - apply the split test in `split-axes.md` or keep one ticket |
| "Write it now, the human said it twice" | Repetition is not confirmation - the gate needs an explicit yes on the presented diff |
| "shortest body / our docs say dense" | Density norms bind docs, not ticket prose; compression starts only after the self-containment test passes |

