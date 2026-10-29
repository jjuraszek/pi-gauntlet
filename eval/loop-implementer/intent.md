for: 374f35f2442344b021322de281f958db1975af5aae9a35bc6d4160aa3f79c368

## Change
Use the supplied leg base and home-owned ledger when implementing a mapped AC row; preserve existing iteration and tuple facts.

Key the multirow seeding exception on target seed rather than iteration 0. A human-authorized interrupted-seed recovery can seed multiple baseline rows at consumed iteration 1 with attempts 0 while retaining the iterations count. Ordinary row targets still change only their own row. Preserve bounded evidence, spec-first reads, and the single-commit decision contract.

## Expected to move
- seed-recovery/multirow-seed: fails -> holds - Target seed owns the exception even at a consumed nonzero iteration.
