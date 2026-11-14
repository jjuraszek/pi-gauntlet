for: 8b65e167301569e59ea6977c0bb1e0099fe49fe3151238db6cdc6629af06ed8a

## Change

Resolve bare `approve` from the just-rendered recommendation and print `Taking "approve" as option <n> - <label>` before applying the selected row's bare-digit action. Retain the rendered recommendation rather than recomputing it. Plan and loop approvals inherit the default amendment grant; draft-PR approval publishes and stops instead of starting implementation.

Extend all-none with grounded loop-gate observations and independent plan and draft-PR continuation snapshots. Run only spec-gate/all-none against base 855e872a42f9cac7a795704f3e0b383b182950ab. This text replay checks the echo and narrated actions, not live persistence or publication. Preserve other sample records; coverage is partial. Keep scripts/brainstorming-bare-approve.test.mjs beside its deterministic contract siblings; paid replay stays outside CI.

## Expected to move
- all-none/f5: fails -> holds - Bare approve follows recommended loop with an echo and the default grant rather than granting nothing.
- all-none/plan: fails -> holds - A rendered plan recommendation resolves approve to row 1 with the echo and default grant.
- all-none/draft: fails -> holds - A rendered draft-PR recommendation resolves approve to row 4 with the echo and publication stop.
