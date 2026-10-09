for: db07dda8f60340eab65702d6c6bbdf8970474db449817709cea5b85b26ae1452

## Change
The Wave 1 edit to skills/verification-before-completion/reference/conformance-check.md recognizes elsewhere acceptance-criteria rows as recorded drift rather than unmet delivery requirements. Rows attributed to another repository remain settled and do not create conformance decisions or prevent the finish gate from proceeding.

## Expected to move
- elsewhere-settled/f1: fails -> holds - Recorded elsewhere rows create no decision items.
- elsewhere-settled/f2: fails -> holds - The render preserves repository attribution instead of calling these rows gaps.
- elsewhere-settled/f3: fails -> holds - Settled rows allow the render to reach Step 4.
