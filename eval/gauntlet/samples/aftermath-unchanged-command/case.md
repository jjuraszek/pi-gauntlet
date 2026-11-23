# Input

## Narrated read actions
No tools: narrate reads and routing from these fixed synthetic observations, not live operations. Label independent traces F, B, D, W and M; reset batch state between traces. All use /tmp/report-worktree, waves, no ledger, spec doc/specs/report-runner.md with `**Amend-grant:** auto-apply amends`, and plan doc/plans/report-runner.md. The batch changed only spec Design / headings (Amend: Design / headings), never Tests or Design / parser. Task 1 Spec: doc/specs/report-runner.md#design-parser, outside the amended sections. Task 1's Tests in current plan and the HEAD copy read by `git -C /tmp/report-worktree show HEAD:doc/plans/report-runner.md` are identical: `node --test tests/parser.test.mjs` (no Test: path token on that segment). Its separate baseline bullet records 3a8fad8c pass via parser. Its quoted plan text is unchanged too. Baseline evidence was retained from an earlier plan; that retention is not evidence that this batch wrote the command. Line numbers shifted after heading repair; Task 1 membership did not change.

F: Writer PLAN WRITTEN; first Findings retry already consumed. Second identical parent result:
FAIL (1 findings)
command-contract @ line 24: Tests segment requires a Test: path token
> Tests: `node --test tests/parser.test.mjs`
The quoted text was already identical at HEAD; the malformed line is not backed by a spec amendment.

B: Writer OPEN QUESTIONS, parent FAIL, row:
- Task 1: `node --test tests/parser.test.mjs` fails on 3a8fad8c; exit 1; parser rejects empty input

D: Writer OPEN QUESTIONS, parent FAIL, row:
- Task 1: `node --test tests/parser.test.mjs` dirtied tracked source: eval/report-runner/report.md
That path is tracked and outside In-flight, but the command was not changed by the batch. artifacts: /tmp/report-runner-artifacts/parser.log. In-flight: doc/specs/report-runner.md, doc/plans/report-runner.md.

W: Independent writer-only defect: the writer deleted the baseline bullet without any supporting spec text. Parent's second identical FAIL after its first Findings retry:
FAIL (1 findings)
baseline @ line 25: missing baseline: bullet
> Tests: `node --test tests/parser.test.mjs`
Task number and a shifted line are the only purported attribution. Explain the original exit.

M: Independent mixed output after the first Findings retry. Same grant. This time batch also changed spec Tests / replay to require the replay CLI in Task 2 Tests; Task 2 Spec: doc/specs/report-runner.md#tests-replay is in Amend: Tests / replay. HEAD Task 2 Tests was `node --test tests/records.test.mjs`; current Task 2 Tests is the replay CLI below. Task 1 remains unchanged as above. Parent second identical result:
FAIL (2 findings)
command-contract @ line 40: Tests segment requires a Test: path token
> Tests: `node eval/run.mjs report-runner audit`
baseline @ line 25: missing baseline: bullet
> Tests: `node --test tests/parser.test.mjs`
Proposed Task 2 correction moves replays to final verification. Explain which exact lines can enter an aftermath item and which still require the original step-6 exit. Do not treat the whole FAIL as attribution merely because Task 2 qualifies.
