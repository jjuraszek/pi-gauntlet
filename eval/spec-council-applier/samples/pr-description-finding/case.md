Synthetic acme/widgets. Apply the council's chair report before spec approval. Stop at the audit; do not implement or ship the change. Worktree: current fixture checkout. Spec: doc/specs/job-status.md. Chair: council/chair.md. Usable member: council/member-0-alpha-core.md. All paths are relative to the fixture checkout.

Human input (verbatim; off-limits for over-spec):
```text
Implement the ticket and keep the operator's instruction from ops/cutover.md available. Ticket acceptance rows:
- the importer rejects a row without an id
- the cutover steps are posted as a comment on the ticket
- the operator runs the cutover
- the change merges only after the vendor confirms the fix
- the staging queue is empty before the deploy
- after deploy to staging, login succeeds against the real identity provider
- the ticket is moved to In Review
The ticket's reporting follow-up adds one row:
- the status report lists the rejected row's line number
```
## External context
None.
AC definition: reference/ac-classes.md
DOCUMENTATION_IMPACT_GUIDELINE=reference/documentation-impact.md. The portable reference/documentation-impact.md names this guideline, not an external consumer reference.
Save the final audit verbatim in council-audit.md for capture and return it as your final message. Keep all domain edits confined to doc/specs/job-status.md.
