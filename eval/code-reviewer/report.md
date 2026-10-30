# eval report: code-reviewer (partial run: anchored-task)

for: 5d62497a3e7b6bce814ad9ee058c6edcfd584923be1095cb0aa53e25dad8aaab

wall: 19s

## Change

Load anchored SDD wave tasks as a union from the plan, derive Spec/Files/Tests and combined Rules, and read implementer and prior review reports by path. Add the SDD-local prompt to the headed assembly while retaining the external inline template and legacy replay behavior. Mirror SHIP/FIX_FIRST/REJECT, finding metadata and the Behaviour-change footer into structured output; reject unreadable anchors with their identity. Preserve severity, test-economy and trajectory semantics.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| anchored-task | anthropic/claude-opus-5-5 | improved | 18490 | next-read: holds -> holds (intended but unchanged); rules: fails -> fails (intended but unchanged); finding: holds -> holds (held); behaviour: fails -> holds (intended change); ownership: fails -> holds (intended change); commands: holds -> holds (held) |
| anchored-task | github-copilot/gpt-6.1-sol | improved | 14465 | next-read: holds -> holds (intended but unchanged); rules: fails -> fails (intended but unchanged); finding: holds -> holds (held); behaviour: fails -> holds (intended change); ownership: fails -> holds (intended change); commands: holds -> holds (held) |

## Feedback

- anchored-task / anthropic/claude-opus-5-5: After successfully delivers the structured mirroring (behaviourChange true, findingCount 1, maxSeverity, verbatim Parallel-safe line, touchedTasks [4]) and adds the missing leg derivation ("No task names an explicit Leg:, so the first entry, ### Leg: project, applies"), which Before lacked. But the rules fact still fails in After for a different reason: Before at least listed /workspace/project/task-rules.md and /workspace/project/home-rules.md as absolute paths in its observations_consumed, establishing resolution, whereas After refers only to "the rules files" and bare filenames and never states where they resolve. To keep every fact Before kept while delivering the Change, have the Rules bullet (or the next-read list) spell out the absolute paths or say explicitly that both task-rules.md and home-rules.md resolve in /workspace/project, alongside the filenames and the first-leg derivation for both tasks.
- anchored-task / github-copilot/gpt-6.1-sol: After regresses nothing Before kept: the plan read still targets exactly Task 4 and Task 5 while excluding Task 40 and the next wave, the Critical F1 at flag.mjs:1 with FIX_FIRST survives, and the no-commands statement is intact. After also gains behaviour and ownership because the structured block now carries boolean behaviourChange true, touchedTasks [4], findingCount 1, maxSeverity and the verbatim 'Parallel-safe: F1 disjoint' line, whereas Before only had a string 'yes' and owner_tasks. The one fact that failed in both and still fails is rules: After says only 'both rules files', which the fact explicitly disallows. To deliver the Change's 'combined Rules' derivation, add a sentence like: 'Rules: task-rules.md (named by Tasks 4 and 5) plus home-rules.md, taken from the first spec leg (Leg: project) because neither task names a Leg; both resolve to /workspace/project/task-rules.md and /workspace/project/home-rules.md.' Everything else in After can stay as written.

exit: 0
