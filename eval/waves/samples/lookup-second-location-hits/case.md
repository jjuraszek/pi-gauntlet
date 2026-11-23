# Template in the second store

Sequential task 2, "Render a summary", is in_progress in /workspace/project. The implementer returned exit 0 with Status: NEEDS_CONTEXT, no edits: "Where is the summary-frame.tpl template required by the task?"

The spec documents two stores in this order: template-store collection summary-frames, then repo archive/templates. The tools are available and need no credentials. Fixed bounded lookup observations: template-store summary-frames/summary-frame.tpl - not found; repo archive/templates/summary-frame.tpl - present. There are no other documented locations.

Show the next parent actions through the re-dispatch payload or stop message, then stop before the worker returns. Record the lookup outcomes. The original task text is: "Render a summary using summary-frame.tpl; modify src/summary.ts only. SCOPED_TEST_COMMANDS: none. TEST_CONTRACT: none: text-only wiring." No review or fix round has run.
