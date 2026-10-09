for: c88452a1a4d0e6d7331d498c44d55b40dcf95d02b5e07dc2da7959e8ead8bbef

## Change
The assembly now includes ticket-acceptance.md: scope cuts come only through the cut question and the user's answer, never from author preference or implementation difficulty. Repo groups assign other repos' rows elsewhere without asking, unmatched groups require an attribution question, wrong rows require the ordered cut question with recommendation A or D, and cancelled repair returns to that question with the row unchanged.

## Expected to move
- human-raised-drop/f1: fails -> holds - A human-raised drop triggers the ordered cut question.
- human-raised-drop/f2: fails -> holds - Only A or D can be recommended for a human-raised drop.
- human-raised-drop/f3: fails -> holds - A drop request authorizes no cut before the cut question is answered.
- cut-without-human-words/f1: fails -> holds - Difficulty alone does not authorize cuts.
- cut-without-human-words/f2: fails -> holds - A hard row alone does not trigger the cut question.
- cut-without-human-words/f3: fails -> holds - Repo groups settle attribution without asking.
- other-repo-group/f1: fails -> holds - The mailer group names the delivering repo.
- other-repo-group/f2: fails -> holds - Settled attribution needs no question.
- other-repo-group/f3: fails -> holds - Repo attribution belongs in dispositions, not spec headings.
- unmatched-group-asked/f1: fails -> holds - Unknown groups require the attribution question.
- unmatched-group-asked/f2: fails -> holds - Unknown groups cannot be assigned silently.
- wrong-row-cut-question/f1: fails -> holds - Wrong rows trigger the ordered cut question.
- wrong-row-cut-question/f2: fails -> holds - Only A or D can be recommended.
- wrong-row-cut-question/f3: fails -> holds - Repair names the ticket-specific skill invocation.
- repair-cancelled/f1: fails -> holds - Cancelled repair returns to the unchanged row's question.
- repair-cancelled/f2: fails -> holds - Cancellation authorizes no cut.
