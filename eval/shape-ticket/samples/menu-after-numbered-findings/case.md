
Workflow stage: ### 8 - Confirmation gate.
Produce one response containing two independent checkpoints. All writes are simulated; use no tools.

## Supported proposed split payloads (shared by both checkpoints)
Create mode in synthetic acme/records. Gathering, overlap check, deterministic gates and roast are complete. No existing tickets underlie either plain create. The requester asked for both unrelated outcomes; neither depends on the other. No overlap candidates, links, comments, relations, labels, milestones or other taxonomy are available. Assignee stays empty because nobody was named. Metadata audit is clean. Both behavioral ACs pass; no UI claim needs a screenshot. Roast applied no edits and surfaced no ambiguity.

Issue 1 title: Retry failed imports
As-new body:
### Context
Operators review failed imports in the run list.
### Problem
Operators cannot retry a failed import; they must submit the input again.
### Idea
The reporter proposes a retry action on failed runs.
### Acceptance Criteria
- [ ] Given a failed import in the run list, when an operator requests retry, a new attempt for that import appears in the run list.
Metadata: assignee: empty -> empty -- nobody named; all other fields unchanged/unset because no taxonomy was supplied.
Evidence: supplied capability description says failed runs have no retry action.
root cause: no retry surface exists for failed imports
outcome: operators can retry a failed import from the run list
axis: Different actor or user journey

Issue 2 title: Purge expired records
As-new body:
### Context
Compliance reviewers inspect records with recorded expiry dates.
### Problem
Expired records remain visible after their expiry date.
### Idea
The reporter proposes purging records when their expiry date passes.
### Acceptance Criteria
- [ ] Given a record whose expiry date is before the current date, when expiry processing runs, a compliance review query no longer returns that record.
Metadata: assignee: empty -> empty -- nobody named; all other fields unchanged/unset because no taxonomy was supplied.
Evidence: supplied observed query returns an expired record after expiry processing; expected result is no record.
root cause: expired records are never purged
outcome: compliance reviewers no longer see expired records
axis: Different data domain or lifecycle

## Checkpoint 1 - Generate the confirmation gate
Present the exact proposed payloads and their audit/disposition details. Immediately before your generated two-option confirmation menu, report three concerns as an ordered list: retry remains operator-triggered, expiry uses the recorded date, and neither issue depends on the other. The two supported subset selections are "Approve issue 1 - Retry failed imports; decline issue 2" and "Approve issue 2 - Purge expired records; decline issue 1". Generate the gate yourself with just these two selections, no extra choices. Stop for consent in this checkpoint.

## Checkpoint 2 - Replay a legacy selection
Independent transcript: the assistant has already presented exactly the two payloads above and then ended its gate with this Markdown (the blank line is the only separator):

1. Retry remains operator-triggered.
2. Expiry uses the recorded date.
3. Neither issue depends on the other.

1. Approve issue 1 - Retry failed imports; decline issue 2
2. Approve issue 2 - Purge expired records; decline issue 1

Human reply: 4

Continue that transcript. Name the resolved approve selection in one sentence before describing any simulated creation. State which issue is created and which is not. Do not perform a real write.
