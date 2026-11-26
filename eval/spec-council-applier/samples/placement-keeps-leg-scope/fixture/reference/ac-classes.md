# Acceptance criteria and Integration

An acceptance criterion states a functionality or a constraint the change delivers: what is observed, not how it is built. One row may cover several scenarios of one functionality. It holds when the files at the delivered commit make it true and a check run in a checkout of that commit shows it.

Everything else asked around the change is an `Integration` entry. An entry is one list item in its source's words, never judged and never blocking.

## Entry kinds

| Kind | Example |
|---|---|
| `person step` | the operator runs the cutover |
