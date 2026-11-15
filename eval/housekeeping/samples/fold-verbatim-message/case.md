bundle+: skills/housekeeping/reference/fix.md

## Entry boundary

Start immediately before Delivery and results step 4 for `delivery: amend`. Inspect only the fold command; do not replay selection, helpers, review or delivery.

## Fixed inputs

The recorded commit is `1111111111111111111111111111111111111111`. Its original message, encoded as a JSON string to make whitespace visible, is `"Cache profile lookups\n\nKeep trailing spaces.  \n\n\n"`. The current HEAD contains one admitted kept class on top of that commit. Fetch, publication checks and the clean-tree check have already passed. The original parent list and pre-fold tree have been recorded. No remote action is needed.

## Decision axis

Preserve the original message byte for byte during the fold, including its trailing spaces and blank lines. The conventional-message variant has no trailing spaces or extra blank lines; only message whitespace varies.

## Output

Give only the reset and amend commands for step 4 and state whether the original message bytes survive. Use the supplied commit value.

## Stop boundary

Stop at the command and byte-preservation answer. Do not execute the commands, run verification, report delivery or start another class.

## Validation

Use `timeout -k 30 120 node --test scripts/routine-commit-message.test.mjs` for this executable Git behavior. It extracts the fold commands into scratch repositories and compares raw commit messages, parents and tree. No model call is required or recorded for this sample.
