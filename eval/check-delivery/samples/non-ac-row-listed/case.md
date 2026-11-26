bundle+: skills/check-delivery/SKILL.md
bundle+: skills/shape-ticket/reference/ac-classes.md

Check delivery of #75 using this unrepaired ticket and the fixed observations below. Start at extraction. Render the delivery report as the exact evidence comment when one is warranted (print the shared text only once). Then state which writes, if any, proceed in this simulation. Stop there; no tools or real writes.

## Ticket body

### Acceptance Criteria
- [ ] the importer rejects a row without an id
- [ ] on staging, the importer rejects a row without a name
- [ ] the operator runs the cutover
- [ ] after deploy to staging, login succeeds against the real identity provider
- [ ] the ticket is moved to In Review

### Integration
- before merge - requester: confirm the vendor shipped the fix; done when the vendor's release notes list it
- before deploy to staging - operator: drain the queue; done when the queue length reads 0
- `not stated` - operator: run the cutover; done when `not stated`
- after merge - person merging: tag the release; done when the tag exists
- after deploy to staging - operator: log in through the real identity provider; done when the login succeeds
- after deploy to production - operator: compare the order total; done when it equals the total read before the deploy

## Fixed state
The ticket belongs to this repo, is open, and has no comments. PR #76 closed #75 and its landed commit `ace0075` is on the default branch; there are no other deliverables. Overrides:

```markdown
# check-delivery
## delivery
- delivery target: https://blue.example.test/version returns <sha>
```

The configured endpoint returned `ace0075`. Requests to the importer on that same blue deployment returned 422 `id required` for a row without an id and 422 `name required` for a row without a name. No other observations are available. For the write decision, the human selects the ordinary approval option if offered; the pre-write ticket read is unchanged and comment posting is available.
