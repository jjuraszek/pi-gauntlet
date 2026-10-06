Review one rendered closure block and Step 3.5 render against its frozen spec, reviewer report, and expected facts.

Mark each fact yes only when the candidate states it in substance. A decision item counts only when it is rendered as a disposition bullet or concern card. A sentinel line counts only when it appears inside the closure block in the stated position. An informational line counts only when the candidate neither counts it in N nor asks for a disposition on it.

Use these ordered quality labels: unreadable (cannot follow), engineer-only (reviewer rows and evidence with no closure sentinel or no clear decision state), mixed (sentinel present but the deferred/deviates line, the decision cards, or the Step 3.5 render contradict each other or are duplicated), readable (a closure block opening with the sentinel, each informational line printed once inside the closure block and once in the Step 3.5 render, in its stated position, decision cards only for open concerns, and the Step 3.5 render ending at Step 4's first line), briefing (readable, and an operator can tell from the first screen whether anything needs a decision and which rows were settled by the spec).

A line that appears once in the closure block and once in the Step 3.5 render is not a duplicate; a line repeated inside either of them is.

Reply with exactly one fenced JSON object and nothing else:

```json
{ "facts": { "<id>": "yes" }, "quality": "<label>", "rationale": "<one line>" }
```

Every fact id from the `facts` block appears once in `facts`. `quality` is one of the five labels above. `rationale` is one sentence.
