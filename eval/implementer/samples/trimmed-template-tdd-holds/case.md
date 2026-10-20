Sample: trimmed-template-tdd-holds

You are implementing Task 2: Accept surrounding spaces in a count

## Task Description

**TDD scenario:** Modifying tested code - run existing tests first.

Behavior: make `parse_count(" 7 ")` return 7 while preserving plain counts.

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

`counter/parse.py`:
```python
def parse_count(text):
    if not text.isdigit():
        raise ValueError("not a count")
    return int(text)
```

`counter/test_parse.py` (line numbers start at the import):
```python
from counter.parse import parse_count
import pytest

CASES = [("plain", "7", 7)]

@pytest.mark.parametrize("name,text,expected", CASES)
def test_parse_count(name, text, expected):
    assert parse_count(text) == expected
```

Narrate the work order and show the changed code and final report using only these fixed observations, not claimed tool execution. Each invocation below is the same supplied scoped command:
- Existing tests, before any edit: exit 0, last output line `1 passed`.
- After extending CASES with the spaces row, before production edit: exit 1, last output line `1 failed, 1 passed`; the new row raises ValueError("not a count").
- After the minimal production edit: exit 0, last output line `2 passed`.
- Final verification after review: exit 0, last output line `2 passed`.

Use these observations as supplied evidence. Include test-contract command and direct-seam evidence plus the exact `**Status:**` line required by the template. Do not propose extra commands.
