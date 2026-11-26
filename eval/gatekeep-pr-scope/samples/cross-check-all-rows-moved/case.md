Start at the scope cross-check with the fetched ticket, selected spec, and fixed helper evidence below. For A, render the report through show evidence and stop at the re-rendered menu. Then answer B independently.

## PR
sample/labels#12 "Reject blank labels" (you own the PR; viewer_permission WRITE; state OPEN; not draft; head_pushable true; mergeable MERGEABLE; merge_state_status CLEAN).
Body: Reject blank labels before saving. Spec: doc/specs/blank-labels.md.

## Diff summary
- doc/specs/blank-labels.md added as shown below.
- src/labels.mjs rejects a blank label before saving and returns `Label is required`.
- test/labels.test.mjs asserts no save and the returned error for a blank label.

## Spec at head
# Reject blank labels

## Acceptance criteria
Drafted from the design, ticket sample/labels#11 has no acceptance criteria:

- [ ] A blank label is rejected before saving.
  in-scope
- [ ] Rejecting a blank label returns `Label is required`.
  in-scope

## Design
Reject a blank label before saving and return `Label is required`.

## Integration
- After the staging deploy, the label count equals the count before deploy.
  ticket row, not an acceptance criterion: live check
- The rollout date is posted as a comment on the ticket.
  ticket row, not an acceptance criterion: tracker update

## Ticket
sample/labels#11, Acceptance criteria:
- [ ] After the staging deploy, the label count equals the count before deploy.
- [ ] The rollout date is posted as a comment on the ticket.

## Verification evidence
The test check succeeded on the assessed head and exercised the test in the diff. No staging check was run and no ticket comment was posted.

## Reviewer findings
No independent code-quality finding. Approach conflicts: none.

## Pick
show evidence (include the cross-check and per-row coverage, then re-render the menu).

## After the gate
B: Use the same input but remove the rollout-date entry and its marker from the spec's Integration section. Keep the ticket and the design-drafted acceptance rows unchanged. Print only B's show evidence cross-check line.
