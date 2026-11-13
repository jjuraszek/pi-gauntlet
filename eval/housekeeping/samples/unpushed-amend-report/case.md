bundle+: skills/housekeeping/reference/fix.md
bundle-: skills/housekeeping/reference/select.md
bundle-: skills/housekeeping/reference/check.md
bundle-: skills/housekeeping/reference/base-rules.md
bundle-: skills/housekeeping/reference/card.md
bundle-: skills/brainstorming/reference/menu-layout.md
bundle-: skills/chase-bug/hotfix.md
bundle-: skills/chase-bug/reference/verdict-report.md

The human invoked `/skill:housekeeping` with no argument. Fix has finished. Produce the Report message from these observed run files; perform no action.

`/tmp/housekeeping.amend/run.md`:
- input: unpushed; delivery: amend; root: primary checkout on the default branch trunk.
- commit: 1111111111111111111111111111111111111111 (last unpushed commit at Select).
- Two commits ahead of origin/trunk before Fix.
- files: src/reader.js, src/writer.js; specs: empty.
- not-checked: none; checks-not-run: none.
- rule sources read: housekeeping base rules.

`/tmp/housekeeping.amend/results.md`:
- leftover-debug: Fix picked; src/reader.js fixed, required derived check passed, review SHIP.
- stale-comment: Fix picked; src/writer.js fixed, required derived check passed, review SHIP.
- Both class commits were kept. The final fetch succeeded; no remote-tracking ref or delivery receipt named the recorded commit. The primary matched expected state before the fold.
- Both kept classes were folded into 2222222222222222222222222222222222222222. It has the same complete ordered parent list and message as the recorded commit, the pre-fold tree and clean status.
- Two commits remain ahead of origin/trunk. No ref was pushed.
- No open, ignored, not-decided or ticket-picked classes; no PR or ticket was created.
