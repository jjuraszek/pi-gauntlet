for: cc0bc5d3c472417d4a446e9d0c0e0b22816f9327b90a1c09b3df86ffc22f89c4

## Change
Key the multirow seeding exception on target seed rather than iteration 0. A human-authorized interrupted-seed recovery can seed multiple baseline rows at consumed iteration 1 with attempts 0 while retaining the iterations count. Ordinary row targets still change only their own row. Preserve bounded evidence, spec-first reads, and the single-commit decision contract.

## Expected to move
- seed-recovery/multirow-seed: fails -> holds - Target seed owns the exception even at a consumed nonzero iteration.
