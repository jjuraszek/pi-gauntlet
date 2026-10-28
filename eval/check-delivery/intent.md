for: abe104947ba8857759d24a70eb0322cffed3b750bae2672d1dfc77d7ef2ada95

## Change
Add the numbered delivery approval gate and cite the shared menu layout and reply rule while retaining typed yes and the existing write boundary.

Mark confirmation before evidence and exact payloads with the exact confirmation-gate id. Mark ending and STOP reports while keeping Delivered: first in tracker comments, without a gauntlet line in human-channel payloads.

## Expected to move
- gate-line-first/first-line: fails -> holds - Use the exact confirmation-gate id first.
- gate-line-first/gate-first: fails -> holds - Keep the evidence and exact payload below the gate, with Delivered: first inside the comment.
- menu-after-numbered-findings/layout: fails -> holds - Generate a separated two-choice gate after findings.
- menu-after-numbered-findings/mapped-pick: fails -> holds - Echo approval by label before simulated writes.
- menu-after-numbered-findings/plain-yes: holds -> holds - Retain explicit typed approval without numeric mapping.
