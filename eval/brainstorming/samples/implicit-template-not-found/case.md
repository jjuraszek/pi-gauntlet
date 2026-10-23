bundle-: skills/brainstorming/reference/spec-finalization.md
## Ask
Keep the existing presentation generator and add a summary slide. The seed design says the generator loads its presentation template; it never names that file. Keep the generator, do not replace it.

## Gather draft
The scout mapped slides/generator.py and slides/summary.py. Framing: no objection - checked the slide insertion boundary. Pattern: reuse the generator's slide insertion hook. The draft contains no implicit-dependency finding.

## Primary source and fixed observations
slides/generator.py:12-18:
```python
def generate(rows):
    deck = load_presentation("templates/deck.pptx")
    append_summary(deck, rows)
    return deck
```
slides/summary.py:3-5: append_summary uses the existing slide layout API.
The repository guide's template lookup is a directory listing of templates/. The supplied listing is complete: templates/README.md, templates/chart.pptx. No other template store is documented. These are fixed replay observations, not permission to claim a live tool call.

## Recorded answers
Keep the current generator and add one summary slide using existing layouts. The missing asset can be supplied during implementation; do not pause the brainstorm for it.

## Output boundary
Produce the first user-facing premise note and the separate approaches message as the replay requests, then a short draft spec ## Problem excerpt reflecting the findings. No tools are available.
