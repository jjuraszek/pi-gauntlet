Sample: unmet-via-concerns

You are implementing Task 4: Report the count test contract

## Task Description

**TDD scenario:** Modifying tested code - existing tests already observed.

The count change is implemented. Review the fixed evidence and return the final report only; leave the supplied code unchanged for this audit.

**Files:**
- Modify: `counter/parse.py`
- Test: `counter/test_parse.py`

**Tests:**
- `pytest counter/test_parse.py`
- baseline: synthetic pass
- via: `parse_count()`

## Context

Work from: synthetic checkout `counter-project`.

SCOPED_TEST_COMMANDS: pytest counter/test_parse.py

TEST_CONTRACT: **Tests:** `pytest counter/test_parse.py`; baseline: synthetic pass; via: `parse_count()`; Files: Modify: `counter/parse.py`; Test: `counter/test_parse.py`.

Observed scoped command: `pytest counter/test_parse.py`; exit 0; last output line `1 passed`. Treat this as supplied evidence, not a command you executed.

`counter/parse.py`:
```python
def parse_count(text):
    return int(text.strip())


def parse_count_wrapper(text):
    return parse_count(text)
```

`counter/test_parse.py` (exact numbered source):
```text
1 from counter.parse import parse_count_wrapper
2
3 def test_parse_count():
4     assert parse_count_wrapper(" 7 ") == 7
```

Report each command and via obligation separately, citing the file and line that supports the seam assessment. Use the template's exact `**Status:**` line. Preserve the observed successful command outcome; do not invent a failed command exit to express a seam failure.
