# Spec council member eval

Loads the body of `agents/spec-council-member.md` in a headed text assembly. Synthetic specs check scope-cut provenance, repo attribution, ticket row placement, and conforming coverage.

| Sample | Must hold |
|---|---|
| unprovenanced-deferred | A deferred 60s row without a human cut answer is a scope blocker. |
| self-minted-spec-path | A follow-up spec path does not supply human provenance. |
| human-answered-cut | A quoted cut question and answer permit the deferred row. |
| elsewhere-under-own-group | Own-repo columns cannot be attributed elsewhere; the mailer row can. |
| non-criterion-row-flagged | Report both misplaced rows as scope blockers; the mixed criterion and other Integration entries are not findings. |
| flat-conforming | Full widgets coverage and settled mailer attribution need no scope finding on any acceptance-criteria row or its disposition. |

Run `node eval/run.mjs spec-council-member non-criterion-row-flagged` to check placement. Records and the latest report live beside these samples; see `eval/README.md` for freshness and fact-label rules.
