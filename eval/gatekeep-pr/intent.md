for: f281b72beb87fe9d38095d432088975c844a707f284e8cbf9014d3cf3492805a

## Change
Pin assess review posts to the assessed commit through REST, preserving the explicit pick, compare-and-swap, composed blocker body, and zero-blocker no-post behavior. Confirm the baseline only from an equal response commit_id; surface a mismatch without reposting. Exercise the own-PR COMMENTED baseline through the same bounded delta and closure mapping as a requested-changes review, retaining open prior items as blockers regardless of today's Minor severity. Preserve no-prior-review assessment and scoped delivery behavior.

## Expected to move
- course-assess-terminal/f1: fails -> holds - Use REST events rather than unpinned gh pr review for assess.
- course-assess-terminal/f5: fails -> holds - Pin the POST and confirm its returned commit against the assessed head.
- course-assess-terminal/f6: fails -> holds - Report mismatched response provenance without claiming a baseline or reposting.
