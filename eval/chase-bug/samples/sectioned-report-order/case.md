bundle+: skills/chase-bug/SKILL.md
bundle+: skills/brainstorming/reference/menu-layout.md

Produce two independent step-4 gate messages, separated by --- and nothing else. All writes and handoffs are simulated; do not run tools.

## Checkpoint 1 - Confirmed real bug

The origin is free text, with a response target explicitly set to a Slack channel mid-chase. Baseline and pre-menu check are clean. Prior-report search completed without a match. Requesting /widgets/ returns page not found (404) instead of the expected widgets page (200); /widgets works. The part matching URLs to pages compares paths exactly at src/router.ts:88. A local request test reproduced the failure; temporarily ignoring the trailing slash made it pass, supporting the exact-match explanation. Nothing was blocked. The fix strips the trailing slash in one comparison. All six hotfix predicates pass. Generate the verdict gate with hotfix recommended and stop for a pick.

## Checkpoint 2 - Cannot replicate

Independently triage a GitHub issue saying a chart disappears after refresh. The documented reproduction steps with the supplied small fixture render the chart in Chrome and Firefox, both with clean profiles. A cache hypothesis was ruled out by clearing it; no other hypothesis survives. The cause is unknown. The report omits the dataset size from the failing run, which is needed to continue. Prior-report search completed without a match. All tracked-file checks are clean. Generate the negative-verdict gate, preserving its discovery-ticket option. Do not draft a response or run a handoff.
