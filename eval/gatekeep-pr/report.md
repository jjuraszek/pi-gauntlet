# eval report: gatekeep-pr (partial runs)

for: 8a76ad141a6b3070599fdbe441e78e06ea498b5b19d60dd415142b41e4ae24ca

## Change

The typed-list replay supplies PR metadata rather than admission or ticket conclusions. It records each reply's attached call or `none`; Run B's typed PR URL is in `acme/gadgets` while origin is `acme/widgets`. The discovery replays ask what the skill does at admission without naming the decision, the number of replies, or their layout. The expectations still require the typed single-PR list to carry `gh run list` and the rejected discovery list and stop to appear in separate replies.

## Cells

| sample | model | verdict | judge ms | facts |
|---|---|---|---|---|
| typed-list-note | anthropic/claude-opus-5-5 | improved | 13340 | e1: fails -> holds (intended change); e2: holds -> holds (held); e3: fails -> holds (intended change) |
| typed-list-note | github-copilot/gpt-6.1-sol | improved | 10971 | e1: fails -> holds (intended change); e2: holds -> holds (held); e3: fails -> holds (intended change) |
| no-arg-discovery-cc-multi | anthropic/claude-opus-5-5 | improved | 6307 | f1: fails -> holds (intended change) |
| no-arg-discovery-cc-multi | github-copilot/gpt-6.1-sol | improved | 8046 | f1: fails -> holds (intended change) |
| no-arg-discovery-over-cap | anthropic/claude-opus-5-5 | improved | 10928 | f1: fails -> holds (intended change) |
| no-arg-discovery-over-cap | github-copilot/gpt-6.1-sol | improved | 6595 | f1: fails -> holds (intended change) |

## Coverage

- `typed-list-note` (83s, exit 0): Both candidates admit Run A, show the set in typed order, and continue without waiting. In Run B both put only the fixed PR, viewer, and ticket display reads before the list, pair the single-PR list with `gh run list -R acme/gadgets`, and initialize afterward.
- `no-arg-discovery-cc-multi` (33s, exit 0): Both candidates pair the sorted list with the stop-format read instead of the batch read, then send the marker, harness rejection, and discovered numbers on consecutive lines in a separate reply.
- `no-arg-discovery-over-cap` (44s, exit 0): Both candidates exclude #202 on its supplied lookup verdict, pair the six-entry list with the batch read, and send a separate three-line cap rejection.

The replays check narrated decisions and reply placement with tools disabled. They do not prove live delivery beside a tool call or exercise the optional Linear lookup. No other samples were refreshed.
