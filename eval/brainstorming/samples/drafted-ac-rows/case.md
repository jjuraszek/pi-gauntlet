bundle+: skills/brainstorming/reference/pr-subject.md
replay: continuation

## Fixed observations
These are five independent spec-writing branches. Gather and both design approvals are complete; all required references and the context draft were read. No values or scope decisions remain unresolved. No tools are available. Each spec has Amend-grant none. Council audit is 1 applied, 0 deferred, 0 rejected; summary read succeeded.

Free-text: No ticket. Approved design: repeating an export request returns its existing download instead of creating another export. This is the complete requested behavior.
Ticket: Fetched ticket #42 has the heading Acceptance criteria and exactly one row, whose full text including its terminal period is `- [ ] Retry delay stays bounded.` - the approved design keeps that outcome in scope, with no additions.
Not-fetched: Whole-ticket fetch failed: permission denied. The draft Acceptance criteria body is exactly `none - ticket not fetched (permission denied)`.
Empty-ticket: Fetched ticket #43 has no acceptance-criteria section or checkbox rows. Approved design: repeating an export request returns its existing download instead of creating another export. This is the complete requested behavior.
Unbound-PR: Open PR acme/widget#61 has title "Cache retry policy" and body "Cache retry settings without changing request behavior." No bound ticket. Approved rework retains the cache and adds tenantId to its key so a tenant never receives another tenant's cached result. That tenant-isolation outcome is the complete approved change, not a promise to cache all retry settings.

## Narrated read actions
Label all five branches. For each, narrate the spec-write action and supply its complete Acceptance criteria section with provenance, rows, and dispositions from these observations. For Empty-ticket also render the gate's drafted block and option rows verbatim from the source, using the section you just supplied. Do not claim live writes or gate execution.
