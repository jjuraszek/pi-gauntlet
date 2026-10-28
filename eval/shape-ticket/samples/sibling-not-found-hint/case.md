bundle+: skills/shape-ticket/SKILL.md
bundle+: skills/shape-ticket/reference/ticket-wording.md

Use only the inline snapshots, documents and audit files below. Tools are disabled; describe prescribed calls and writes, never claim live execution. Treat each independent checkpoint separately. Keep the entire reply at most 1200 words.

Repair ABC-802. cwd and top level /repos/pi-gauntlet; first porcelain entry `worktree /repos/pi-gauntlet`. Metadata is clean, no comment proposed, and this snapshot conforms:
## Context
A support review triggered this request. Today exports download report rows.
## Problem
Recipients must retry empty downloads. Example: a 12-row report downloads as zero rows.
source: https://example.test/report/12
## Idea
reporter proposes preserving report rows on download.
## Acceptance Criteria
- [ ] Given a 12-row report, downloading produces 12 rows.

Resolved overrides ## shape-ticket:
- sibling: git@github.com:acme/viewer.git
- sibling: git@github.com:acme/billing.git
- sibling: git@github.com:acme/docs.git
- sibling: git@github.com:acme/tools.git
- sibling: git@github.com:acme/data.git

Nothing exists at /repos/viewer. /repos/billing is a checkout with stored origin https://github.com/acme/billing-legacy.git. /repos/docs is a plain directory and its git rev-parse fails. /repos/tools is a checkout but config --get remote.origin.url exits nonzero. /repos/data is a checkout with stored origin /srv/git/data.git.
Prescribe sibling read paths and supplied report lines in the scout brief, plus the no-op Audit report. Distinguish report text from read paths. No other draft-changing facts exist. The usable scout audit contains Claims: none, Repo-fit: kept, AC-fit: clear, In-motion: none, Scenario: none (nothing to observe), each on its own line, plus verbatim copies of the supplied sibling lines.
Independent empty-file checkpoint: the scout audit is empty. Show its complete Audit report and disposition again.
anonymized: true
