for: 71d84d8b0445a755f89926c0fb2706f2c373fba8ef3a5416c75261dde14ee89a

## Change
Clarify the overlap reference's repeated-defect rule: completion plus compatible same-concern additions does not justify a duplicate without evidence distinguishing a new regression. The closed-concern-additions sample alone bundles that reference and checks supplied-evidence recommendations, allowing useful existing-ticket additions or no write while retaining create-anyway as an override. Its pre-fix baseline already recommends the existing concern, so this is a guard rather than a forced failing baseline. The target's bundle-free draft slice and both older samples' facts remain unchanged.

## Expected to move
- closed-concern-additions/existing-concern: fails -> holds - Prevent completion plus compatible additions from justifying a duplicate; a baseline that already holds remains a guard.
