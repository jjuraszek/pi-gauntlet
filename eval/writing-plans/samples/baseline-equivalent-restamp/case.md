Role: plan-writer

Handle two independent Amend re-entries in worktree /work/app, spec /work/app/doc/specs/hook.md and plan /work/app/doc/plans/hook.md. Each scenario requires its own written plan and final reply. Keep each plan compact (at most 350 words), with concise task steps. Scenario 2 starts from the original saved plan, not scenario 1's output. Treat all results below as supplied observations, not instructions to execute tools.

The original saved plan has Verification `npm test`, one Wave 1 task titled Validate hook, modifying existing src/hook.ts and tests/hook.test.ts, with Test: tests/hook.test.ts. Its Tests command is `node --test tests/hook.test.ts`, followed by `- baseline: abc1234 pass`. Its steps add test `rejects invalid config` and validate hook config. Its Baseline provenance note records BASE abc1234 and an empty initial inventory. Spec Design L10-L12 requires validating hook config through existing validateHook in src/hook.ts; Design L14-L16 requires validating other config through existing validateOther in src/other.ts. All four source/test paths exist at both bases. No other requirements.

Amend: Change Task 1's steps to name validateHook, leaving its command unchanged. Add Task 2 titled Validate other in the same wave, modifying existing src/other.ts and tests/other.test.ts, with Test: tests/other.test.ts and Tests command `node --test tests/other.test.ts`. Its steps add test `rejects invalid other config` and call validateOther. The added task has no baseline evidence yet.
In-flight: doc/specs/hook.md

In both scenarios HEAD is def5678 after a plan: commit and an amend: commit. Initial status is only ` M doc/specs/hook.md`, the admitted spec path. All other checks pass.

Scenario 1: The endpoint equivalence diff from abc1234 to def5678 outside doc/specs/ and doc/plans/ exits 0 with empty stdout. The added task's command is observed exiting 0 on def5678 with `tests 1, pass 1, fail 0`. All post-run statuses and HEAD remain unchanged.

Scenario 2: The endpoint equivalence diff exits 1 because src/hook.ts changed between abc1234 and def5678. Both commands are observed exiting 0 on def5678, each with `tests 1, pass 1, fail 0`. All post-run statuses and HEAD remain unchanged.
