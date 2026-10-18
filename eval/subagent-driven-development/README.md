# Subagent-driven development review sources

Check that pre-integration spec reviews read each task's applied patch in an isolated snapshot, while integrated code reviews read staged and unstaged work against the wave base. Preserve committed sequential reviews and the review-before-commit gate.

The target loads the execution portion of `skills/subagent-driven-development/SKILL.md`, its implementer and quality-review templates, and the requesting-code-review skill/template. Text replays test dispatch decisions; `scripts/wave-review.test.mjs` executes the shipped shell recipes against real Git fixtures.

All inputs are synthetic. Run `node eval/run.mjs subagent-driven-development` per `eval/README.md`.
