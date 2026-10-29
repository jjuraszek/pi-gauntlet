for: 5d62497a3e7b6bce814ad9ee058c6edcfd584923be1095cb0aa53e25dad8aaab

## Change
Load anchored SDD wave tasks as a union from the plan, derive Spec/Files/Tests and combined Rules, and read implementer and prior review reports by path. Add the SDD-local prompt to the headed assembly while retaining the external inline template and legacy replay behavior. Mirror SHIP/FIX_FIRST/REJECT, finding metadata and the Behaviour-change footer into structured output; reject unreadable anchors with their identity. Preserve severity, test-economy and trajectory semantics.

## Expected to move
- anchored-task/next-read: fails -> holds - The reviewer reads both selected tasks itself.
- anchored-task/rules: fails -> holds - The reviewer derives combined task/home-leg Rules.
- anchored-task/behaviour: fails -> holds - Structured behaviourChange mirrors the footer.
- anchored-task/ownership: fails -> holds - Findings carry task ownership and partition metadata.
- unreadable-anchor/reject: fails -> holds - An unreadable member rejects the union review.
- unreadable-anchor/identity: fails -> holds - JSON identifies the exact unreadable anchor.
