bundle+: skills/brainstorming/reference/pr-subject.md
replay: continuation
## State
Spec-writing follows completed gather, questionary, and both approved design rounds for open PR acme/widget#62. Required references are read. Produce only Problem, Acceptance criteria, and Rework record sections.
Title: "Remove audit logging requirement"
Body: "Audit events are optional; remove the emitter."
No bound ticket. Pre-rework head: 3333333333333333333333333333333333333333
Base: main @ aaaaaaa - merge: ccccccc (clean).

## Gathered draft facts
The PR changes AGENTS.md to say audit events are optional and removes the event emission in src/update.ts. The base-SHA AGENTS.md text, fetched by git show, requires one audit event per successful update. The same rule existed at fork point. Worktree AGENTS.md after clean merge says optional because it includes the PR edit. The smallest repair restores the existing emitter call and governing rule text; the user chose that repair, not a replacement emitter. Preserve all original commits. The claim "Audit events are optional" is dropped. Framing: kept.
Thread RT62 at src/update.ts:8 asks to restore audit events; reply confirms the existing emitter is sufficient. Proposed disposition fix. No merge exceptions; no scoped tests ran (clean merge).
