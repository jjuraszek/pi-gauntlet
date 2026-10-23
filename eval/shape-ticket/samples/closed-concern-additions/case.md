bundle-: skills/shape-ticket/reference/repo-audit.md
bundle+: skills/shape-ticket/reference/overlap-check.md

Workflow stage: step 4 Draft followed by the AC integrity gate.

## Mode
Create. Gathering and overlap discovery are complete. Use only the supplied evidence to recommend the ticket action, draft any useful proposed payload, and give the gate report in at most 600 words. No live search or writes are available.

## Ask
Fix the report checker skipping invalid rows after a blank row. Apply the same behavior to its companion checker, define empty-input behavior, and document the rule.

## Reviewed existing ticket
Reference: acme/checkers#42. Workflow: completed, a documented terminal state.
Title: Report validation stops at blank rows
Context: People checking reports need all invalid rows reported.
Problem: A blank row stops validation, leaving later invalid rows unreported. A report with a blank row followed by an invalid row demonstrates the failure.
Idea: The reporter proposes continuing validation after blank rows.
Acceptance Criteria:
- [x] Given a blank row followed by an invalid row, checking the report reports the invalid row.
- [x] Given invalid rows before and after a blank row, checking the report reports both invalid rows.
Discussion: The ticket was closed after those regression examples passed. The source review confirms that this ticket covers the repeated defect in the ask. Companion-checker parity, empty-input behavior, and documentation are compatible same-concern additions not specified in the existing body. No intentional separation is recorded.

## Evidence limits
The incoming ask supplies no new run, version, reproduction result, or evidence that distinguishes a new regression after completion. Empty-input behavior has not been chosen. No other candidate or independent user outcome is evidenced. Do not invent tracker mutations or verified test results.
