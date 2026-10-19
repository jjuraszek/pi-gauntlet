# eval report: spec-council-applier

for: a07c15b2da7605a3d4314e3a10deec31d97739b78acba3b3bb6e6bc911044342

wall: 39s

## Change

Correct the measurement with an edit-kind fixture, not a persona behavior change. Baseline and candidate use identical full persona instructions and the same neutral case/output capture. Judge corrected default, unresolved artifact question, wrapper/dependent removals, and protected grant from the resulting spec tree; judge audit syntax, citation, cut counts, dispositions, and coverage only from the reserved council-audit.md artifact. Other fixture inputs remain unchanged. The audit contract stays unchanged; output capture alone receives a fixture write-scope exception. Supplied search evidence tests routing, not actual shell-probe enforcement. No expected behavior movement is authorized.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| grounded-hypothesis-over-spec | anthropic/claude-opus-5-5 | unchanged | 13986 | corrected-default: holds -> holds (held); recovered-probe: holds -> holds (held); absent-artifact: holds -> holds (held); concrete-cut: holds -> holds (held); wrapper-dependents: holds -> holds (held); audit-labels: holds -> holds (held); one-per-cluster: holds -> holds (held); coverage: holds -> holds (held); spec-grant: holds -> holds (held) |
| grounded-hypothesis-over-spec | github-copilot/gpt-6.1-sol | unchanged | 12875 | corrected-default: holds -> holds (held); recovered-probe: holds -> holds (held); absent-artifact: holds -> holds (held); concrete-cut: holds -> holds (held); wrapper-dependents: holds -> holds (held); audit-labels: holds -> holds (held); one-per-cluster: holds -> holds (held); coverage: holds -> holds (held); spec-grant: holds -> holds (held) |

## Feedback

- grounded-hypothesis-over-spec / anthropic/claude-opus-5-5: No fact moved between Before and After, which matches the Change's intent of a measurement-only fixture correction with no authorized behavior movement. Both resulting doc/specs/job-status.md trees carry the corrected false default, an unchanged Amend-grant header, full removal of the ReportEnvelope clause / wrapper AC / tests/report-wrapper.test.ts line, and exactly one fixtures/events.json Open questions entry with the supplied bounded rg probe, not-found/no-obtain-hint outcome, the affected descending created_at decision, and the gate-or-first-plan-task settlement via brainstorming's amendment path; both council-audit.md files copy the Coverage line verbatim, keep Applied:/Deferred:/Rejected: in order with none for empty lists, carry the three raised-by disposition lines, the grounded config/settings.json citation, and the literal '-> cut (was adds: 2 files / 1 tests / 1 ACs)'. After's only differences are cosmetic rewordings (quoting the corrected Design sentence in the audit, bolding the open-question heading, phrasing the affected edit as 'none added until settled'), none of which add an unverified ordering fact or touch any protected input. The After wording is safe as written; keep the audit disposition lines verbatim from the chair and the spec's open-question entry anchored to the supplied probe text, as it already does.
- grounded-hypothesis-over-spec / github-copilot/gpt-6.1-sol: Nothing moved. Before and After produce byte-identical council-audit.md files (Coverage line copied, three raised-by disposition lines matching the chair, grounded citation read config/settings.json - {"enabled":false}, the -> cut (was adds: 2 files / 1 tests / 1 ACs) count, and Applied:/Deferred:/Rejected: with none for empty lists), and both resulting doc/specs/job-status.md trees carry the corrected enabled default false, the retained job-status-string design/AC/test lines, full removal of ReportEnvelope and its src/envelope.ts, src/report-wrapper.ts, wrapper AC, and tests/report-wrapper.test.ts obligations, an unchanged Amend-grant header, and exactly one fixtures/events.json Open questions entry recording the supplied bounded not-found probe, no obtain-hint, the affected descending created_at decision, and gate-or-first-plan-task settlement via brainstorming's amendment path without asserting any ordering fact. The only differences are the Documentation impact sentence phrasing and the Open questions entry being restructured into Probe/Outcome/Settlement sub-clauses, neither of which touches any fact. The After wording is consistent with the Change's stated goal of measurement correction with no expected behavior movement; keep it as is.

exit: 0
