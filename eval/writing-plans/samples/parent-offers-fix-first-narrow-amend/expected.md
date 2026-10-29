- failure: judged: The parent names Task 1, node --test tests/hook.test.ts and exit 1 as the base failure.
- menu: judged: The parent offers fix-first, narrow, and amend, one option per line, followed by a Recommendation line.
- pause: judged: The parent waits for the human without plan_tracker init, stamping or marking plan complete; plan stays in_progress with substep retained.

- grant-narrow: judged: Variant A acknowledges took recommendation: narrow and re-dispatches plan-writer with Findings Task 1 Tests: narrow to hook-config, reruns baseline and parent check without asking for the filter.
- grant-amend: judged: Variant B acknowledges took recommendation: amend and enters amendment section 5 with parent-owned spec edits and writer-only plan repair.
- grant-fix-first: judged: Variant C acknowledges took recommendation: fix-first and enters shape-ticket with only its own write gate, without inventing ticket authorization or completing the plan.
- grant-wait: judged: Variants D and E wait: none and narrow without a concrete filter cannot auto-continue.
- aftermath: judged: Variant F uses the same grant-aware narrow hook-config writer redispatch for the unchanged-command failure, not a new attributable spec item; it preserves dirty-path protections, two-item limit, repeat-evidence exit and attempts/iteration/cap budget, never restoring the protected plan path automatically.
