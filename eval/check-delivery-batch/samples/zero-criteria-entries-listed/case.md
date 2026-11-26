The explicit invocation was `/skill:check-delivery #12 #15`. The parent has read both saved files. Roster order is sample/widget#12, sample/widget#15. Ticket 12 returned REPORT with a passing export check. Its ordinary confirmation gate has just been declined with `2`. No tracker writes have run.

Ticket 15's saved file:
## Handoff
status: Open
acs:
write: none
comment: none
status command: none
body edit: none
## Report
Not acceptance criteria:
- The operator clears the queue. (person step)
- After deploy, confirm that live orders appear in the dashboard. (live check)
STOPPED - cannot verify a ticket that asserts nothing

Show the next user-facing message only.
