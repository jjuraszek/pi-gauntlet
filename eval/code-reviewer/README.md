# code-reviewer eval

This target tests whether the code-reviewer persona, dispatched with the requesting-code-review template, files declinable shrink findings on duplicated, oversized, or wrong-layer tests and a Critical on lost coverage, within a 700-word cap.

| Skill file | Loaded content |
|---|---|
| `agents/code-reviewer.md` | Body without frontmatter |
| `skills/requesting-code-review/code-reviewer.md` | Whole file |

Process, commands, and record schema: eval/README.md.

## Baseline triage

Read by hand from `results/<sample>/baseline.json`. Rows for facts reworded after the baseline run come from the `before` values in `results/<sample>/candidate.json`. Held facts remain preservation checks in `expected.md`. All replies fit the 700-word cap; the longest is 418 words. No sample needs sharpening: each has a judged fact that fails at baseline.

| Sample | Fact | anthropic/claude-opus-5-5 | github-copilot/gpt-6.1-sol |
|---|---|---|---|
| duplicate-tests-diff | f1 | holds | fails |
| duplicate-tests-diff | f2 | holds | fails |
| duplicate-tests-diff | f3 | fails | holds |
| duplicate-tests-diff | m1 | holds | holds |
| duplicate-tests-diff | m2 | holds | holds |
| oversized-fixture-diff | f1 | holds | holds |
| oversized-fixture-diff | f2 | fails | fails |
| oversized-fixture-diff | m1 | fails | fails |
| oversized-fixture-diff | m2 | holds | holds |
| oversized-fixture-diff | m3 | holds | holds |
| wrong-layer-rspec | f1 | fails | fails |
| wrong-layer-rspec | f2 | holds | holds |
| wrong-layer-rspec | f3 | holds | holds |
| wrong-layer-rspec | m1 | holds | holds |
| wrong-layer-rspec | m2 | holds | holds |

The duplicate-tests-diff Opus reply proposes one Entry equality covering all three fields (f1 holds); its consolidation finding is Minor (f2 holds), but it also asks for additional amount/date/missing-key tests (f3 fails). The GPT reply has no consolidation finding (f1 and f2 fail). Both oversized-fixture-diff replies identify lost posted_on coverage as Moderate rather than Critical (f2 fails). Both wrong-layer-rspec replies omit the shrink finding (f1 fails).

Candidate: wrong-layer-rspec f1 stays fails on gpt-6.1-sol; the shrink finding names the model and request owners but proposes deleting every browser example instead of keeping one for the error rendering.

## Word cap

Longest valid reply across both arms: 448 words; `wordCap` set to 700.
