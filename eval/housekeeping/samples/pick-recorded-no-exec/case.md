bundle-: skills/housekeeping/reference/check.md
bundle-: skills/housekeeping/reference/base-rules.md

The human invoked `/skill:housekeeping src/widgets` and has just answered `1` on card 1 of 2. Continue at the next user-facing message after the decision write succeeded.

Observed run state:
- run folder: /tmp/housekeeping.fixture-pick; root: primary checkout on the default branch, equal to its fetched remote head.
- rules-from: working tree; delivery: pr-per-class; bounds: on; parallel: 8.
- picks: fix, ticket, ignore; budget: 200.
- files: src/widgets/render.ts and src/widgets/format.ts, both tracked, clean, regular text files and not ignored.
- Select and Check are complete. The expected-state comparison passed; no tracked file, index entry or HEAD changed.
- Card 1 was code-unused: one unused import in src/widgets/render.ts:2. It displayed Fix as row 1, Ticket as row 2 and Ignore as row 3.
- The accepted reply was written successfully to /tmp/housekeeping.fixture-pick/decisions.md: class code-unused; pick fix; excluded items none; fix instruction none. That is the only recorded pick. No tracked file was edited, no commit, push, PR or ticket was made, and no fix job started.
- Card 2 remains unanswered: code-debug, one leftover debug statement `console.log("format trace", value)` at src/widgets/format.ts:18. The quote exists in the selected file; no other class shares this file.
- Card 2 rule: remove leftover debug statements. Source: housekeeping base rules, Code; overrides: none; verification mode: read.
- Its proposed fix removes only that debug statement, changes existing code only, changes no dependencies, stored data, public interface or configuration shape, and can be undone by reverting one commit. No regression command is attached to this read check.
- The human has not sent `go` or `stop`.
