# implementer eval

This target tests whether the implementer persona, dispatched with the SDD implementer template, extends an existing test and builds minimal synthetic input instead of adding new test functions over a heavy fixture, within a 600-word cap.

| Skill file | Loaded content |
|---|---|
| `agents/implementer.md` | Body without frontmatter |
| `skills/subagent-driven-development/implementer-prompt.md` | Whole file |

Process, commands, and record schema: eval/README.md.

## Baseline triage

Read by hand from `results/<sample>/baseline.json`. Rows for facts reworded after the baseline run come from the `before` values in `results/<sample>/candidate.json`. The replies contain only added or changed code, so omitted existing tests are kept unless the reply replaces them.

| Sample | Fact | anthropic/claude-opus-5-5 | github-copilot/gpt-6.1-sol |
|---|---|---|---|
| extend-existing-test | f1 | holds | fails |
| extend-existing-test | f2 | holds | holds |
| extend-existing-test | f3 | holds | holds |
| extend-existing-test | m1 | holds | holds |
| heavy-json-fixture | f1 | fails | fails |
| heavy-json-fixture | f2 | holds | holds |
| heavy-json-fixture | f3 | fails | fails |
| heavy-json-fixture | m1 | holds | holds |

Both samples initially held every fact on both models. The extend-existing-test sample removes the `ids=` hint. The heavy-json-fixture sample adds fixture-backed last-record, missing-account, and invalid-date tests and describes the existing rejection-test pattern. Adding fixture-backed tests alone did not expose a failure; the rejection-pattern context did.

The baseline replies contain 14 and 5 words for extend-existing-test, and 38 and 49 words for heavy-json-fixture, respectively.

## Word cap

Longest valid reply across both arms: 49 words; `wordCap` set to 600.
