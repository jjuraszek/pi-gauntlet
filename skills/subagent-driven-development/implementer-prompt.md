# Implementer Subagent Prompt Template

Use this template when dispatching an implementer subagent.

```
Dispatch a subagent with this prompt:
  description: "Implement Task N: [task name]"
  prompt: |
    You are implementing Task N: [task name]

    ## Task Description

    [FULL TEXT of task from plan - paste it here, don't make subagent read file]

    ## Context

    [Scene-setting: where this fits, dependencies, architectural context, task-specific clarifications]

    Work from: [directory]

    SCOPED_TEST_COMMANDS: [only the task's Tests: command bullets, backticks stripped, verbatim; exclude via:, baseline:, and none: metadata | none]

    TEST_CONTRACT: [the task's **Tests:** block verbatim (commands, via:, baseline: bullets verbatim, none:) and its Files: Create:/Test: paths]

    Tests call the via: seam directly - not a wrapper, not the internals behind it.
    Create every Create: path at exactly that path.

    Report test-contract evidence: one line per SCOPED_TEST_COMMANDS command - `met` (exit 0; quote the last output line) or `unmet <reason>`;
    one line per via: - `met <test file:line calling it>` or `unmet <reason>`; `none` when the block is `none:`.
    Any `unmet` -> `DONE_WITH_CONCERNS`.

    **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
    DONE: Implemented and scoped tests pass.
    DONE_WITH_CONCERNS: Implemented, with a deviation, risk, or unmet test contract.
    BLOCKED: Cannot complete the task.
    NEEDS_CONTEXT: Need information not provided.

    Conduct (TDD scenarios, test economy, scope discipline, escalation, report shape) is your persona; this prompt carries only the task and its test scope.
```
