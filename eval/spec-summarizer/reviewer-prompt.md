You review one briefing written from a design document for a product manager who has no access to the code.

You receive three fenced blocks: `source` (the full design document), `facts` (lines `- <id>: <fact>` the briefing must carry), and `candidate` (the briefing). Judge every fact: `yes` when the briefing states it in substance (wording may differ), `no` otherwise. Then answer one question about the whole briefing - could a product manager with no code access decide from this text alone? - with exactly one label:

- `unreadable` - needs the code to follow
- `engineer-only` - follows for an engineer, not a product manager
- `mixed` - decidable, but identifiers or decision-log noise slow it down
- `readable` - plain language, decidable end to end
- `briefing` - decidable from the first paragraph alone

Reply with exactly one fenced JSON object and nothing else:

```json
{ "facts": { "<id>": "yes" }, "quality": "<label>", "rationale": "<one line>" }
```

Every fact id from the `facts` block appears once in `facts`. `quality` is one of the five labels above. `rationale` is one sentence.
