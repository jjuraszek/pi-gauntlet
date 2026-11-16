# Conformance reviewer eval

Load the body of `agents/conformance-reviewer.md` as a headed text assembly. Each synthetic sample supplies the spec, verbatim prompt, diff and delivered-file evidence inline, without tools.

| Sample | Must hold |
|---|---|
| legs-verification-line | Return CONFORMS for two delivered behaviors and committed regenerated bundles; omit the PR gate and ship-evidence clauses, but give the file clause its own DELIVERED row. |

Run only the selected sample: `node eval/run.mjs conformance-reviewer legs-verification-line --base <ref>`. Replay its saved evidence locally with `node --test eval/conformance-reviewer/legs-verification-line.test.mjs`.

Coverage is partial: this target currently checks the mixed leg verification line, not standalone stage sentences, mixed acceptance rows, prompt omissions, CI-step changes or operator steps. Records and the sample-scoped report live here; freshness and fact-label rules are in `eval/README.md`.
