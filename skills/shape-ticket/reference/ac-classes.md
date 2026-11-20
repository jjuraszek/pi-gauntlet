# Acceptance criteria classes

| Class | Definition | Outcome after failed recovery |
|---|---|---|
| Wishful | better/worse claim, no baseline + target + measurement | **hard stop** - no write until the human supplies values or splits out discovery |
| Tautological | gates on a set this ticket itself produces ("top N", "the identified issues") | **hard stop** - enumerate today, or convert to a discovery ticket |
| Unspecified-but-binding | closure-gating word with no value ("acceptable latency") | file allowed, **park** in the tracker's not-ready state, missing value named |
| External-input dependency | yardstick another party must hand over first | **park**, blocker named; if resolving it is the assignee's own work, stays ready (over-fire guard) |
| Post-deployment | observable only with the change live in production | **relocate** to Post-deployment housekeeping, non-blocking; never an AC |
| Workflow-stage proof | sole observable is a delivery-pipeline stage - a CI or workflow run result, a pull request's title, body, state or review, a merge, or a full verification-suite run - not a behavior of the change | **drop**; retain the row's text in the Reporter note as `retired workflow-stage proof: <row text>`. Label every retained original containing a dropped stage clause, including AC uniqueness's split-row copy, with `retired workflow-stage proof:`; leave no unmarked duplicate. Remove only stage-proof rows or clauses. For this drop, copy surviving behavior text and untouched rows byte-for-byte even in substantive full-replacement repair; normalize checkbox syntax, not wording or setup/action framing |
