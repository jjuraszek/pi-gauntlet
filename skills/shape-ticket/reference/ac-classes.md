# Acceptance criteria and Integration

An acceptance criterion states a functionality or a constraint the change delivers: what is observed, not how it is built. One row may cover several scenarios of one functionality. It holds when the files at the delivered commit make it true and a check run in a checkout of that commit shows it.

Everything else asked around the change is an `Integration` entry. An entry is one list item in its source's words, never judged and never blocking.

## Entry kinds

Name the nearest kind to explain why a row is an entry. The definition is the boundary, even when no kind names an obligation exactly.

| Kind | Example |
|---|---|
| `person step` | the operator runs the cutover |
| `merge or deploy condition` | the change merges only after the vendor confirms the fix |
| `environment state` | the staging queue is empty before the deploy; a deploy or a data move that happens outside the change |
| `live check` | after deploy to staging, login succeeds against the real identity provider; after the cutover, no production order carries the legacy status |
| `tracker update` | the ticket is moved to In Review; the cutover steps are posted as a comment on the ticket |
| `pipeline result` | a CI or workflow run result, a pull request's title, body, state or review, a merge, or a full verification-suite run; commit message text |

## Sorting rules

1. Keep a functionality that handles an environment name, pull-request text or a pipeline as an acceptance criterion. A workflow file can itself deliver the requested behavior.
2. Keep a mixed row as one acceptance criterion for its functionality alone. Only the external observation or obligation is an entry; keep every literal that defines the functionality, such as `production` in a script's rejection rule.
3. When in doubt whether files deliver the functionality, keep the row as an acceptance criterion. Doubt about which kind names an entry is not that doubt.
4. Sort a check the same way in production as in any other environment.

## Acceptance criteria classes

| Class | Definition | Outcome after failed recovery |
|---|---|---|
| Wishful | better/worse claim, no baseline + target + measurement | **hard stop** - no write until the human supplies values or splits out discovery |
| Tautological | gates on a set this ticket itself produces ("top N", "the identified issues") | **hard stop** - enumerate today, or convert to a discovery ticket |
| Unspecified-but-binding | closure-gating word with no value ("acceptable latency") | file allowed, **park** in the tracker's not-ready state, missing value named |
| External-input dependency | yardstick another party must hand over first | **park**, blocker named; if resolving it is the assignee's own work, stays ready (over-fire guard) |
