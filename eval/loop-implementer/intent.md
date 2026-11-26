for: 89eb76aa7103050792694e76edabd1fbb4140659854ff32ffa54ad4bba43902d

## Change
Select mixed-migration-row only. Check whether the worker closes a mixed row on local proof instead of running the live migration or treating its missing credential as a blocker. A wording check cannot show how the worker interprets the live clause. This replay covers that decision, not a real migration.

## Earlier comparisons
Read dispatched wording and ticket inputs for loop worker messages. Keep home attribution in the committed ledger's returned field and outside-ledger rows in the supplied checkout-local return file, written before the single code commit. Remove all dispatch state from messages. Select only home-plain-commit and companion-return-file for this edit.

The loop driver's seed-dispositions replay includes this persona and checks that no Integration entry becomes worker work. The standalone persona replies below are retained evidence from their earlier revision, not a replay of the new boundary.

## Expected to move
- mixed-migration-row/live-available: fails -> holds - Leave the live obligation outside the worker's actions even with credentials.
- mixed-migration-row/live-unavailable: fails -> holds - Close on local proof without the release credential.
- home-plain-commit/ordinary-message: fails -> holds - Use a plain outcome subject and the dispatched ticket.
- home-plain-commit/clean-message: fails -> holds - Keep transport records out of both messages.
- home-plain-commit/home-attribution: fails -> holds - Replace returned and remove pending in the home row and seed commits while preserving the bumped count.
- companion-return-file/return-file: fails -> holds - Put attributed rows and decisions in the supplied file before committing.
- companion-return-file/message: fails -> holds - Keep machine state out of the commit message.

## Preserve
Keep spec-first reading, scoped RED/GREEN checks, explicit staging, one commit, clean status, bounded evidence and decision-only replies. Seed retains zero attempts and unreached empty rows; companion work preserves home, foreign and cut rows. Keep named proof actions authorized and preserve process ownership rules.

## Coverage
home-plain-commit covers an ordinary home return with a body ticket convention and a partial baseline seed with no ticket. companion-return-file covers one mapped companion row with a checkout-local return path and a conflicting teammate suggestion. These are tool-free traces, not live git or process recovery. Preserve unrelated sample records; this is partial coverage, not a target-wide pass. Local replay assertions are selected by scripts/commit-message-contract.test.mjs.
