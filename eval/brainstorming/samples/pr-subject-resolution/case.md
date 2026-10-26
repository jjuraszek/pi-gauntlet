bundle+: skills/brainstorming/reference/pr-subject.md
## Fixed observations
The GitHub tracker is acme/widget; origin is git@github.com:acme/widget.git.
These are independent fresh, explicitly authorized entries, with both trackers reset.
All required resources are readable. No live CLI calls are available.

Open: prompt "  #55  ". PR lookup returns OPEN (draft true), URL https://github.com/acme/widget/pull/55, title "Repair retry backoff", body "Keep the existing retry implementation.", headRefName fix/retry, headRefOid 1111111111111111111111111111111111111111, baseRefName main, in-repo. No tracker reference occurs in title/body. Issue lookup would also succeed for this PR number if called.
For Open's later spec-writing stage, both design rounds are approved: failed requests retry with a bounded delay; successful requests do not retry. These are the complete agreed rework outcomes, with no unresolved values. Keep this later design distinct from early subject classification.
Issue: prompt "#56". PR lookup says not a PR; issue lookup succeeds with title "Repair retry backoff" and body AC row "- [ ] Retry delay stays bounded."
Neither: prompt "#57". Both lookups say not found.
Mention: prompt "make the retry logic work like #55 did". The reference is only a mention.
Foreign: prompt "other/widget#55". PR lookup returns OPEN, URL https://github.com/other/widget/pull/55, branch fix/retry, in-repo in other/widget.
Bound: prompt "#58 keep retries". PR lookup returns OPEN in acme/widget, title "Repair #12 retry", first body line "Follow #13 for timeout context"; ticket #12 has one AC row "- [ ] Retry delay stays bounded." Ticket #13 is readable but has different timeout ACs. Branch fix/issue-99 and closingIssuesReferences #99 exist.

Trailing context: prompt "#12 fix the retry path, see #13 for context". #12 is OPEN in acme/widget, non-fork, base main; all required fetches succeed. #13 is context text only, with no lookup observation.

## Narrated read actions
Label each independent branch. Narrate ordered classification and the single chosen path, including stops before provisioning. For open and bound, name branch and filename shape, Problem intent/context and AC source. For Open, distinguish early classification from later spec-writing and supply the later Acceptance criteria section from the approved rework design. For issue, describe the unchanged ticket path. Do not execute tools or invent a human gate. These are narrated actions, not live integration evidence.
