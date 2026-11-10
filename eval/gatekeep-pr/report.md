# eval report: gatekeep-pr (partial run: plain-report)

for: ee511dd29d8410964d128d3cfa650e8006872e397f48888252d14eecb3f40080

wall: 58s

## Change

Replace gatekeep-pr's labeled report and evidence lines with whole-sentence prose that preserves scope, role, prior-review and sync facts, concrete findings and one standing sentence before the choices. Translate internal vocabulary and field/value pairs in reports and menus; keep full evidence behind show evidence and distinguish CI from local verification. Preserve numeric selection, recommendation ordering and machine markers. Keep assess's consequence free of self-approval promises and retain the recommendation tag in the final menu. Keep head, prior-review and sync SHAs and raw check fields out of report prose, including obstacles; retain those records under show evidence without losing prior-review or sync outcomes.

Select only plain-report for this increment. Its three snapshots cover a repairable report with a running required check and prior sync, a clean CI-backed final report, and a GitHub-blocked obstacle with no local repair. Other saved samples are historical evidence, not current coverage. This text-only replay makes no live PR, tracker or cleanup calls.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| plain-report | anthropic/claude-opus-5-5 | improved | 25831 | prose: fails -> holds (intended change); role: fails -> holds (unplanned improvement); sync: fails -> holds (intended change); scope: holds -> holds (held); findings: holds -> holds (held); standing: fails -> holds (intended change); language: fails -> holds (intended change); choices: fails -> holds (intended change) |
| plain-report | github-copilot/gpt-6.1-sol | improved | 25296 | prose: fails -> holds (intended change); role: fails -> holds (unplanned improvement); sync: fails -> holds (intended change); scope: holds -> holds (held); findings: holds -> holds (held); standing: fails -> holds (intended change); language: fails -> holds (intended change); choices: fails -> holds (intended change) |

## Feedback

- plain-report / anthropic/claude-opus-5-5: After moves every targeted fact without losing any that Before kept: scope rows, reviewer role with alex excluded, the 2-of-3 prior-review count (and C's no-commits-since note without the SHA that Before leaked), the rebase/conflict outcome in prose, both blockers with export_header, the nit, maria's comment and reply, a single standing sentence before each menu, CI-not-local evidence in B and C, and the recommendation on row 1 under each marker. Two small spots are worth watching so they don't regress into jargon in future edits: C's 'you have no admin override available' is a reasonable translation of bypass_eligible=false but is the closest thing to an invented rule, so keep it phrased as an observation rather than naming a policy; and A's '(comment-73)' and 'until merge is offered' are tolerable as locator/menu language but could be softened to 'in her thread on the PR' and 'until the PR can be merged' if a reader ever flags them as internal vocabulary.
- plain-report / github-copilot/gpt-6.1-sol: After keeps every fact Before kept and moves prose, sync, standing, language and choices to holds; role also moves because Before's obstacle report printed the prior-review SHA ("no commits since 9c1e4f2") while After says "no commits since that review". Scope and findings were already preserved and survive the rewrite intact. Two wording spots are worth tightening even though they do not break a fact: "resolving one conflict stop in src/export.ts" leaks the internal "stop" term where "resolving one conflict" reads cleaner, and C's deliver row ("add 4 repair attempts and 4 sync attempts, with 0 used and 4 additional attempts allowed for each") says the same thing three ways and would be clearer as "retry after GitHub permits merging, with up to 4 repair and 4 sync attempts allowed". Otherwise the After wording delivers the Change: labeled fields and fenced evidence are gone, standing is a single sentence directly above the numbered choices, the recommendation sits on row 1 under each preserved marker, and B and C attribute verification to CI rather than local runs.

exit: 0
