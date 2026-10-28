for: 634a35921c946e620e25fc1c346ec40870ce54fa60528c38c78cadabf9d4cdaf

## Change
Render the step-4 story, reporter draft, and terminal summary in one skill-local Verdict shape: three unfenced plain sentences under 80 words, with role-named components, visible proof, trailing citations, and a next step. Preserve menu separation, numeric mapping, eligibility, and reporter confirmation.

The returned-ticket-link/returned-reference and returned-ticket-link/no-new-creation facts remain held. The menu-after-numbered-findings/layout and menu-after-numbered-findings/mapped-pick facts remain held. Both baselines hold prose-verdict-above-menu/under-80-words and prose-verdict-above-menu/menu-intact. The returned-ticket-link/under-80-words baseline outcomes are mixed: the first replay model exceeds the limit, while the second already holds. The returned-ticket-link/no-fence fact stays held for the second replay model; the first baseline unexpectedly fences the summary, so that model needs an improvement rather than a held outcome. Neither baseline satisfies the new three-sentence or plain-reader requirements. Both checkpoint drafts request browser and version, but neither does so in sentence three.

## Expected to move
- returned-ticket-link/no-labels: fails -> holds - Both baseline summaries use labeled fields.
- returned-ticket-link/under-80-words: fails -> holds - Baseline outcomes are mixed: shorten the first model's summary while preserving the second model's held outcome.
- returned-ticket-link/no-fence: fails -> holds - Baseline outcomes are mixed: the first replay model fences the summary, while the second already holds and must stay held.
- returned-ticket-link/three-sentences: fails -> holds - Both baseline summaries use more than three sentences.
- returned-ticket-link/plain-reader: fails -> holds - Both baseline summaries introduce code by file rather than role and lead evidence with the citation.
- prose-verdict-above-menu/no-fence: fails -> holds - Both baseline drafts are fenced; the first also fences the story.
- prose-verdict-above-menu/no-labels: fails -> holds - Both baseline outputs use story and draft labels.
- prose-verdict-above-menu/three-sentences: fails -> holds - Neither baseline uses three sentences in each required span.
- prose-verdict-above-menu/plain-reader: fails -> holds - Baseline proof fields and draft evidence do not consistently attach trailing citations to role-named claims.
- prose-verdict-above-menu/draft-asks-reporter: fails -> holds - Preserve the browser/version request and confirmation while moving the request to sentence three.
