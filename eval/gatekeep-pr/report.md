# eval report: gatekeep-pr (partial runs)

for: 8a76ad141a6b3070599fdbe441e78e06ea498b5b19d60dd415142b41e4ae24ca

## Change

Route a discovered set back through set admission on pi only. On Claude Code, use the stop-format read to carry the visible list, then send the rejection as three consecutive lines. The typed replay supplies the PR view URL as an observation, not a repository-source instruction. The rejection replays delimit the trace and replies without scripting their contents.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| no-arg-discovery-cc-multi | anthropic/claude-opus-5-5 | improved | 9458 | f1: fails -> holds (intended change) |
| no-arg-discovery-cc-multi | github-copilot/gpt-6.1-sol | improved | 5814 | f1: fails -> holds (intended change) |
| no-arg-discovery-over-cap | anthropic/claude-opus-5-5 | improved | 8393 | f1: fails -> holds (intended change) |
| no-arg-discovery-over-cap | github-copilot/gpt-6.1-sol | improved | 10130 | f1: fails -> holds (intended change) |
| typed-list-note | anthropic/claude-opus-5-5 | improved | 10821 | e1: fails -> holds (intended change); e2: holds -> holds (held); e3: fails -> holds (intended change) |
| typed-list-note | github-copilot/gpt-6.1-sol | improved | 10799 | e1: fails -> holds (intended change); e2: holds -> holds (held); e3: fails -> holds (intended change) |

## Coverage

- `no-arg-discovery-cc-multi` (34s, exit 0): Both models resolve tickets before sorting, pair the list with the stop-format read instead of the batch read, and send the marker, literal harness rejection, and discovered numbers on consecutive lines.
- `no-arg-discovery-over-cap` (36s, exit 0): Both models exclude #202 on its supplied lookup verdict, pair the six-entry list with the batch read, and send a separate three-line cap rejection.
- `typed-list-note` (133s, exit 0): Both models keep typed-set order. For the single PR they show only the fixed PR, viewer, and ticket display reads before the list, pair the list with `gh run list -R acme/widgets`, and initialize afterward.

The replays check narrated order and visible reply text with tools disabled. They do not prove live delivery beside a tool call or exercise the optional Linear lookup. No other samples were refreshed.
