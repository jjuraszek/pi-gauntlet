bundle-: skills/gauntlet/brainstorm/spec-finalization.md
replay: continuation

## Current state
The brainstorm is about to write the spec for acme/widgets#77. The ticket was fetched without repair. The draft was read in full; Ticket Handling, the class reference and the required self-review read are in context. All rows belong to this repo. The design keeps the public importer entry point, rejects missing ids, names the offending row and extends the existing complexity check. The reporter supplied no scope cuts and the checkout contradicts no row. No tools are available.

## Ticket acceptance criteria (verbatim)
- [ ] the importer rejects a row without an id
- [ ] the cutover steps are posted as a comment on the ticket
- [ ] the operator runs the cutover
- [ ] the change merges only after the vendor confirms the fix
- [ ] the staging queue is empty before the deploy
- [ ] after deploy to staging, login succeeds against the real identity provider
- [ ] the ticket is moved to In Review
- [ ] on staging, the importer names the offending row in its error
- [ ] GitHub CI is green on the head of the pull request
- [ ] make ci rejects a function of complexity 21

## Ticket Integration entries (verbatim)
- before deploy to staging - operator: drain the queue; done when the queue length reads 0
  - Read the queue length again after the final batch.

## Requested continuation
Show the spec's Acceptance criteria and any Integration section you would write from this draft. If a question about the ticket rows must be answered before writing them, show the question instead. Stop there, before the approval summary or any file or tracker write.
