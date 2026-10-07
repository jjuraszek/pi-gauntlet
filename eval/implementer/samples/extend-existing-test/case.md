You are implementing Task 3: Parse amounts with a thousands separator

## Task Description

**TDD scenario:** Modifying tested code - run existing tests first

**Files:**
- Modify: `ledger/importer.py`
- Test: `ledger/importer_test.py`

**Tests:**
- `pytest ledger/importer_test.py`
- via: `parse_amount()`

Behavior: `parse_amount("1,250.00")` returns `Decimal("1250.00")`. A thousands separator is a comma between digit groups. Plain decimals, negative amounts, integers, and the empty-string rejection are unchanged.

SCOPED_TEST_COMMANDS: pytest ledger/importer_test.py

TEST_CONTRACT: Tests: `pytest ledger/importer_test.py`; via: `parse_amount()`; Test: `ledger/importer_test.py`

## Context

`ledger/importer.py` (current):

```python
from decimal import Decimal, InvalidOperation


class ImportRejected(ValueError):
    pass


def parse_amount(text: str) -> Decimal:
    if text == "":
        raise ImportRejected("amount is empty")
    try:
        return Decimal(text)
    except InvalidOperation as e:
        raise ImportRejected(f"bad amount {text!r}") from e
```

`ledger/importer_test.py` (current):

```python
from decimal import Decimal

import pytest

from ledger.importer import ImportRejected, parse_amount

CASES = [
    ("plain", "12.50", Decimal("12.50")),
    ("negative", "-3.00", Decimal("-3.00")),
    ("integer", "7", Decimal("7")),
]


@pytest.mark.parametrize("name,text,expected", CASES)
def test_parses_amount(name, text, expected):
    assert parse_amount(text) == expected


def test_rejects_empty_amount():
    with pytest.raises(ImportRejected):
        parse_amount("")
```
