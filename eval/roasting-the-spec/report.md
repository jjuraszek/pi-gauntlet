# eval report: roasting-the-spec (partial run: chair-file-only)

for: aa8ace0c2d8b4fd80c1ce608805e7ccd6066f3829d41e29c81ff4c37d2f0bd87

wall: 22s

refresh: complete; sample: chair-file-only; models: anthropic/claude-opus-5-5, github-copilot/gpt-6.1-sol
audit: [candidate.json](results/chair-file-only/candidate.json)

## Change

Preserve review and approval gates while finalization adds the Legs section and companion-file contract.

Move council findings transport to file-only member and chair outputs, require direct chair reads from explicit paths, and delegate spec application to the fresh applier. Parent checks structure and audit counts, rereads the spec first, restores before retry or abort, and cleans only attributable paths against the absolute worktree root while preserving the single user gate. Cases prescribe actions without claiming real execution.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| chair-file-only | anthropic/claude-opus-5-5 | unchanged | 21532 | chair-file-output: holds -> holds (intended but unchanged); direct-read-input: holds -> holds (intended but unchanged); complete-report: holds -> holds (intended but unchanged); chair-retry: holds -> holds (intended but unchanged); single-coverage: holds -> holds (intended but unchanged) |
| chair-file-only | github-copilot/gpt-6.1-sol | unchanged | 14600 | chair-file-output: holds -> holds (intended but unchanged); direct-read-input: holds -> holds (intended but unchanged); complete-report: holds -> holds (intended but unchanged); chair-retry: holds -> holds (intended but unchanged); single-coverage: holds -> holds (intended but unchanged) |

## Feedback

- chair-file-only / anthropic/claude-opus-5-5: After keeps every fact Before kept: both dispatch objects pair output with outputMode file-only, omit reads, run foreground in the worktree with the 300000/600000/900000 controls; the task names only the alpha-core path, uses single-member wording, carries the coverage line and kill diagnostic, preserves the verbatim human input and the Amend-grant/documentation-impact protections; usability is judged by test -s plus the two header greps rather than tool text, with a same-model verbatim retry, an inherited-model fallback for an unreachable gamma/chair, and a second-failure abort to the gate with no counts line. Two spots were weakened though not broken: After dropped Before's explicit sentence 'The member critique contents are NOT included in this task' (leaving only 'the path above is your only member input'), and it dropped the 'consensus:, lean:, clusters:, resolved: template' enumeration from the output instruction, saying only 'complete report'. Restoring those two phrases in the task string costs nothing against the Change and makes direct-read-input and complete-report unambiguous for a child that does not share the parent's context.
- chair-file-only / github-copilot/gpt-6.1-sol: No fact moved between Before and After: both dispatch objects pair output /tmp/council-widgets/chair.md with outputMode "file-only", omit reads, use the explicit worktree cwd with 300000/600000/900000 controls, tell the chair its inputs are not preloaded and must be read directly from the named member path with no find/grep/ls discovery, demand the entire consensus:/lean:/clusters:/resolved: report in the file, judge usability by test -s plus the two header greps rather than tool success text, retry once same-model with the task verbatim (inherited-model retry only for an unreachable configured model), abort to the existing gate on second failure, and keep findings out of the parent while preserving the 1-of-2 coverage line, the beta kill diagnostic, the verbatim human input, and the Amend-grant and documentation-impact protections. After's rendering as a literal JSON object rather than a JS variable is equivalent in content; the one tightening worth keeping in future revisions is Before's explicit note that the `/tmp/acme/widgets-main` parent cwd must not be inherited, which After only implies through the explicit cwd field—adding that sentence back would make the foreground-cwd requirement unambiguous without affecting any other fact.

exit: 0
