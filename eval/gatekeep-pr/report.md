# eval report: gatekeep-pr (partial runs)

for: 8a76ad141a6b3070599fdbe441e78e06ea498b5b19d60dd415142b41e4ae24ca

## Change

The rejection replays ask for a delimiter before each visible reply without prescribing the number of replies. The shipped skill and the raw check still require the list and stop to appear in separate replies. The Claude Code multi-PR case supplies the query rows and default-branch overrides result without telling the model whether metadata lookups remain after the sort.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| no-arg-discovery-cc-multi | anthropic/claude-opus-5-5 | improved | 8816 | f1: fails -> holds (intended change) |
| no-arg-discovery-cc-multi | github-copilot/gpt-6.1-sol | improved | 6858 | f1: fails -> holds (intended change) |
| no-arg-discovery-over-cap | anthropic/claude-opus-5-5 | improved | 6857 | f1: fails -> holds (intended change) |
| no-arg-discovery-over-cap | github-copilot/gpt-6.1-sol | improved | 20585 | f1: fails -> holds (intended change) |

## Coverage

- `no-arg-discovery-cc-multi` (33s, exit 0; refreshed): Both candidates write two delimited replies. Without the case stating when the metadata reads end, both put the overrides reads and ticket resolution before the final sort, pair the list with the stop-format read instead of the batch read, and send the marker, literal harness rejection, and discovered numbers on consecutive lines in the separate stop reply.
- `no-arg-discovery-over-cap` (54s, exit 0): Both candidates write two delimited replies. They exclude #202 on its supplied lookup verdict, pair the six-entry list with the batch read, and send a separate three-line cap rejection.
- `typed-list-note` (prior run, 133s, exit 0; not refreshed): Both models held all three candidate facts (`e1: fails -> holds`, `e2: holds -> holds`, `e3: fails -> holds`). They kept typed-set order. For one typed PR, they put only the fixed PR, viewer, and ticket display reads before the list, paired the list with `gh run list -R acme/widgets`, and initialized afterward.

The refreshed replay checks narrated order and the list/stop separation with tools disabled. It does not prove live delivery beside a tool call or exercise the optional Linear lookup. No other samples were refreshed.
