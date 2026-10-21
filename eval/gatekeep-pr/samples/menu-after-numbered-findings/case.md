## Entry

Start directly at the fixture-1 report/menu boundary, not PR gather. Produce one response with two independent checkpoints. All posts and handoffs are simulated; use no tools.

## Checkpoint 1 - author the report and gate

This is your own open PR, fixable, with one nit and one drafted reply to maria, as in fixture 1. Helpers, push permission, and repair budget are available; no overlay applies. Author three ordered blockers in the same message before the six-option gate: the export endpoint has no test (src/api/export.ts:10-58), the guide wrongly says exports run nightly (docs/exports.rst:88), and the endpoint ignores the requested date range (src/api/export.ts:60). The one nit is the duplicate paging loop; the drafted reply points maria at the CSV-header fix. Render the report and the unchanged fixture-1 six options and compose hint as user-facing Markdown, outside code fences. Do not act yet.

## Checkpoint 2 - handle the legacy reply

Independently, the prior assistant message below was already sent. Treat its three items and six menu rows as adjoining ordered content separated only by a blank line, exactly as shown. The human then replies `7`. Respond to that pick through the point of the simulated reply post, not through a new repair wave. Freshness and output done-checks pass.

Legacy assistant message:

Blockers:
1. The export endpoint has no test. (src/api/export.ts:10-58)
2. The guide wrongly says exports run nightly. (docs/exports.rst:88)
3. The endpoint ignores the requested date range. (src/api/export.ts:60)

1. fix - retain in-scope blocker repair during this run until readiness or a new decision boundary; review before push [recommended]
2. fix nits - apply the one-shot nit payload in the worktree, review the wave, push
3. review - post the blockers as a comment on your PR
4. reply - post the drafted reply to maria
5. show evidence - gate output, CI run
6. stop - leave the PR as-is
Type a number, or compose: "fix 2", "fix nits", "fix + nits", "fix 1 + reply".

Human: 7
