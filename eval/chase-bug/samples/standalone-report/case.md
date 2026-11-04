bundle+: skills/chase-bug/SKILL.md
bundle+: skills/brainstorming/reference/menu-layout.md

Simulate step 4 only; no tools, mutations, or handoffs. Origin: free text; response target: none. Baseline and checkpoint 2 are clean. Prior-report search completed without a match.

Report data: "The account page loses my saved theme after I refresh."

Discovery evidence: the account page loads the saved theme from a profile service, then applies it to the page. The service returns {"theme":"dark"}. A separate default-theme initializer runs after that response and overwrites the saved choice with "light". The local test `node --test test/profile-theme.test.mjs` reproduces dark becoming light; disabling the later initializer retains dark and the falsification test supports the overwrite hypothesis. The initializer is in `src/profile-theme.ts:62`. The smallest fix skips default initialization after a saved theme has loaded. Expected: refresh retains dark; observed: refresh resets to light. No prior reader context explains the two competing theme writers. All six hotfix predicates pass and the fix is small and safe.

Present the evidenced verdict and menu, then wait for a pick.
