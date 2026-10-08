for: a11bdb95c7e66816bd3a5a14919efab496fd2d4299ea43d5b113997d50725f5e

## Change
`fix` applies open blockers only and is offered only while one exists; `fix nits` is its own verb whose payloads are drafted at the pick; each wave helper gets a scoped test command resolved from the merge-base overrides or AGENTS.md, never the verification command; the pre-push reviewer lists only the wave's own findings and the next round carries open closure lines, in-delta Critical/Moderate, and outside-delta Critical findings.

## Expected to move
- nits-only-ready/n1: fails -> holds - the baseline offers `fix` on a nit-only PR
- nits-only-ready/n2: fails -> holds - the baseline has no `fix nits` row
- nits-only-ready/n3: fails -> holds - the baseline prints no nit count line
- nits-only-ready/n4: fails -> holds - the baseline drafts nit payloads before any pick
- blockers-bare-fix/b2: fails -> holds - the baseline drafts nit payloads at step 5
- blockers-bare-fix/b3: fails -> holds - the baseline names a test file, not a resolved command
- wave-closure-retry/w1: fails -> holds - the baseline lists the whole pre-wave findings list
- wave-closure-retry/w2: fails -> holds - the baseline carries every new Critical or Moderate and mints no P#
- wave-closure-retry/w3: fails -> holds - the baseline has no show-evidence-only disposition for an outside-delta Minor
