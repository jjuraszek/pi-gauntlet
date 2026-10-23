for: d5e46c2a218348f8350e8a8e5f10cdbc9478e966a6aff9cb08b653fc4c0eca94

## Change
Require seed completion independently of consumed dispatch count after human-authorized interrupted-seed cleanup. Reuse target seed, the seed evidence commit, decision and row evidence; dispatch the actual iteration with a seed-contract hint and validate by target. Preserve attempts, iterations, cap and explicit cleanup authorization. Keep explicit human retry's fresh stagnation windows unchanged.

## Expected to move
- commit-boundary/seed-recovery: fails -> holds - Authorized seed recovery must seed all open rows before ordinary row work without resetting the consumed count.
