for: 8afe6505fb8b5a59ec412ea35f941a0ffa5fff87ac6126272ff08fbdbee5d1bc

## Change
Admit in-scope implementation and proof simplifications only with a named sufficient alternative, while preserving explicit human choices, required behavior, coverage, and safety. Assess unprotected failures after the proposed action; keep severity and adds anchored to the original clause. Detect in-scope excess rather than restricting over-spec to unrelated extras; existing scope and human-input protections remain controls.

## Expected to move
- in-scope-excess/implementation-shrink: fails -> holds - a sufficient direct handoff qualifies even though the implementation is in scope
- in-scope-excess/proof-shrink: fails -> holds - existing encoder and retained HTTP coverage qualify instead of duplicate simulator proof
