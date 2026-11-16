# Conformance reviewer eval

Load the body of `agents/conformance-reviewer.md` as a headed text assembly. Each synthetic sample supplies the spec, verbatim prompt, diff and delivered-file evidence inline, without tools.

| Sample | Must hold |
|---|---|
| legs-verification-line | Return CONFORMS for two delivered behaviors and committed regenerated bundles; omit the PR gate and ship-evidence clauses, but give the file clause its own DELIVERED row. |
| stage-only-sentences | With no pull request, omit standalone stage sentences across Design, Errors and edge cases, and Tests; keep delivered behavior and return CONFORMS without skip notes or UNAUTHORIZED rows. |
| mixed-row | With an open pull request, keep one DELIVERED requirement per mixed acceptance row, quote only behavior, omit standalone stage sentences and return CONFORMS. |
| prompt-stage-sentence | Omit the prompt-only CI sentence without a requirement, drift entry or skip note; retain the missing prompt-only lowercase behavior and missing Tests file as gaps with their prompt and spec file-clause origins, exclude only the suite-run clause and return GAPS. |
| ci-step-is-the-change | On both arms, return GAPS with recommended: fix for an undeleted browser-install step and a missing regenerated bundle on a leg verification line; quote each file requirement as origin. |
| post-merge-action | Omit the after-merge admin secret-creation step and commit-message sentence everywhere, with no row, drift or skip note; keep delivered trimming behavior and return CONFORMS. |

Run only a selected sample: `node eval/run.mjs conformance-reviewer <sample> --base <ref>`. Model replays test semantic classification and report omission; token assertions alone cannot prove those behaviors. Replay saved evidence locally with `node --test eval/conformance-reviewer/legs-verification-line.test.mjs`, `node --test eval/conformance-reviewer/stage-exclusion.test.mjs` or `node --test eval/conformance-reviewer/prompt-stage-sentence.test.mjs`. Check the unchanged file-gap behavior with `node --test eval/conformance-reviewer/ci-step-is-the-change.test.mjs`.

Coverage is partial: these samples check mixed leg verification lines, standalone stage sentences, mixed acceptance rows, prompt omissions, missing Tests and CI-file changes, after-merge operator steps and commit-message text. They do not cover other operator timings or production-only observations. Records retain each sample's evidence; `report.md` contains only the latest comparison run. Freshness and fact-label rules are in `eval/README.md`.

Current persona and intent evidence covers all six samples: `legs-verification-line`, `stage-only-sentences`, `mixed-row`, `prompt-stage-sentence`, `ci-step-is-the-change` and `post-merge-action`.
