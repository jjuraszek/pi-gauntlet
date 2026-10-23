bundle+: skills/brainstorming/reference/pr-subject.md
replay: continuation
## State
Both design rounds approved a minimal repair for open PR acme/widget#63. Gather and questionary are complete; all required references are read. Return only Problem, Acceptance criteria, and Rework record sections of the replacement spec, not a new questionary.
Title: "Bound retries #20"
Body: "Retry requests with the existing loop."
Bound ticket #20 body AC: - [ ] Retry attempts never exceed three.
Pre-rework head: 4444444444444444444444444444444444444444
Base: main @ aaaaaaa - merge: no-op (head contains origin/main).

## Gathered draft facts
The base-SHA rules require at most three attempts. Existing loop is correct except two lines: initialize attempts to 0 instead of 1 and use attempts < 3 instead of attempts <= 3. These two edits satisfy the rule and ticket; no rewrite or replacement abstraction is required. Preserve original commits and retry loop. Framing: kept. Claim "attempts already bounded to three" is false and must be dropped pending repair.
Thread RT63 at src/retry.ts:4 asks for the bound; proposed disposition fix. Thread RT64 at src/retry.ts:9 asks for a scheduler rewrite; proposed disposition decline: existing loop plus two-line repair satisfies the rule.
No scoped tests ran: no-op merge. No contract exceptions.
