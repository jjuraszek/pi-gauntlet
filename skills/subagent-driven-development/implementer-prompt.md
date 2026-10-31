# Implementer Subagent Prompt Template

Use this template when dispatching an implementer subagent.

```
Dispatch a subagent with this prompt:
  description: "Implement Task N: [task name]"
  prompt: |
    You are implementing the selected task sections.

    planPath: [absolute plan path]
    anchor: "### Task N:"
    anchors: [use instead of anchor for a multi-task repair]
    Spec: [absolute authoritative home spec path]
    Work from: [worker checkout]

    SCOPED_TEST_COMMANDS: [dispatch-supplied scoped command values verbatim | none]

    Read the selected task sections, Spec anchors, Tests:/via: and Files: Create:/Test: paths yourself. Derive Rules from the task and home-spec leg as your persona directs. Tests call the via: seam directly, not a wrapper or its internals. Create every Create: path at exactly that path.

    ## Context

    [Dependencies and task-specific clarifications; for a dependent task, previous task's status line and report path]
    Implementer report: [previous task report path when applicable]

    ## Previous review report (re-review trigger)

    [Repair only: prior review report path; omit this section on initial implementation]
    Read the saved report yourself before repairing. Read any failing scoped-gate output from its supplied file path.

    Report test-contract evidence: one line per SCOPED_TEST_COMMANDS command - `met` (exit 0; quote the last output line) or `unmet <reason>`;
    one line per via: - `met <test file:line calling it>` or `unmet <reason>`; `none` when the block is `none:`.
    Any `unmet` -> `DONE_WITH_CONCERNS`.

    **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
    DONE: Implemented and scoped tests pass.
    DONE_WITH_CONCERNS: Implemented, with a deviation, risk, or unmet test contract.
    BLOCKED: Cannot complete the task.
    NEEDS_CONTEXT: Need information not provided.

    Keep the report layout and emit structured output matching the persona contract and report status, copying exactly the dispatched anchor or anchors in every status. On an unreadable plan/anchor report BLOCKED with that identity, anchorUnreadable and the required Reasoning line; follow the persona's blocked-message rule.

    Conduct (TDD scenarios, test economy, scope discipline, escalation, report shape) is your persona; this prompt carries only the task and its test scope.
```
