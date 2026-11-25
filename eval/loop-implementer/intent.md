for: 2236cecf20ced69615e04e9b8c267fd150782aacfcb6d4de658612c3233ac50d

## Change
Read dispatched wording and ticket inputs for loop worker messages. Keep home attribution in the committed ledger's returned field and outside-ledger rows in the supplied checkout-local return file, written before the single code commit. Remove all dispatch state from messages. Select only home-plain-commit and companion-return-file for this edit.

## Expected to move
- home-plain-commit/ordinary-message: fails -> holds - Use a plain outcome subject and the dispatched ticket.
- home-plain-commit/clean-message: fails -> holds - Keep transport records out of both messages.
- home-plain-commit/home-attribution: fails -> holds - Replace returned and remove pending in the home row and seed commits while preserving the bumped count.
- companion-return-file/return-file: fails -> holds - Put attributed rows and decisions in the supplied file before committing.
- companion-return-file/message: fails -> holds - Keep machine state out of the commit message.

## Preserve
Keep spec-first reading, scoped RED/GREEN checks, explicit staging, one commit, clean status, bounded evidence and decision-only replies. Seed retains zero attempts and unreached empty rows; companion work preserves home, foreign and cut rows. Keep action authorization and process-ownership rules unchanged.

## Coverage
home-plain-commit covers an ordinary home return with a body ticket convention and a partial baseline seed with no ticket. companion-return-file covers one mapped companion row with a checkout-local return path and a conflicting teammate suggestion. These are tool-free traces, not live git or process recovery. Preserve unrelated sample records; this is partial coverage, not a target-wide pass. Local replay assertions are selected by scripts/commit-message-contract.test.mjs.
