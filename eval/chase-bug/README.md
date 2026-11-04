# chase-bug eval

Tests report rendering at the verdict gate, the reporter draft, and the terminal
summary. This no-tool text target does not prove live triage, tracker retrieval,
approval, writes, or hotfix execution.

| Skill file | Slice |
|---|---|
| `skills/chase-bug/SKILL.md` | Step 5 through before Quick Reference |
| `skills/chase-bug/reference/verdict-report.md` | Whole file; candidate-only at the comparison base |

Gate samples additionally bundle the whole skill and shared menu-layout reference.
The whole-reply cap is 700 words; each checkpoint's report has its own
under-180-word fact and five-source-line Context cap.

| Sample | Coverage |
|---|---|
| `prose-verdict-above-menu` | Real-bug gate and cannot-replicate reporter draft, confirmation outside the report |
| `sectioned-report-order` | Real-bug and cannot-replicate gates, heading choice, caps, list discipline, menu endings |
| `returned-ticket-link` | Terminal summary preserves the returned existing ticket and claims no creation |
| `nov3-replay` | Anonymized duplicate CI scan and missing-font-character cases, actual baseline/candidate comparison |
| `server-cache-owner` | Yesterday's prices from the service's own stored response; first-use cache explanation names its server-side owner |
| `standalone-report` | Saved theme overwritten on refresh; standalone symptom, mechanism, and literal fix |
| `plain-reader-first-use` | Real-bug gate, cannot-replicate reporter draft, and not-a-bug summary; first-use explanations, citations, and standalone readability |
| `gate-line-first` | Gate marker before report text |
| `menu-after-numbered-findings` | Numeric selection after an earlier numbered findings list |

Run one selected sample with `node eval/run.mjs chase-bug sectioned-report-order
--base 78e63174692a261a5864a27b17f8ba3727a388aa` (one shell line). Process and
record schema: [`eval/README.md`](../README.md).

Recheck committed evidence without model calls using
`node eval/chase-bug/check-report.mjs sectioned-report-order`. The checker requires
a real sample, current assembled inputs, successful nonempty baseline/candidate
cells, current judgments, and every candidate fact to hold. It reruns mechanical
facts and rejects stale records. It does not replace reading the model outputs.

The runner's report contains the last compared sample. Its partial-coverage note
names the selected records and any samples not rerun; it is not a target-wide pass.
