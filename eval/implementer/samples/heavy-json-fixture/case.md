You are implementing Task 5: Reject a record posted in the future

## Task Description

**TDD scenario:** Modifying tested code - run existing tests first

**Files:**
- Modify: `ledger/importer.py`
- Test: `ledger/importer_test.py`

**Tests:**
- `pytest ledger/importer_test.py`
- via: `import_record()`

Behavior: `import_record(record, today)` raises `ImportRejected("posted_on is in the future")` when `record["posted_on"]` parses to a date after `today`. Records posted on or before `today` import as before.

SCOPED_TEST_COMMANDS: pytest ledger/importer_test.py

TEST_CONTRACT: Tests: `pytest ledger/importer_test.py`; via: `import_record()`; Test: `ledger/importer_test.py`

## Context

The existing rejection tests all start from the first fixture record and override the field under test. Add the future-date regression alongside those rejection tests.

`ledger/importer.py` (current):

```python
from dataclasses import dataclass
from datetime import date
from decimal import Decimal


class ImportRejected(ValueError):
    pass


@dataclass(frozen=True)
class Entry:
    account: str
    amount: Decimal
    posted_on: date
    memo: str


def import_record(record: dict, today: date) -> Entry:
    if not record.get("account"):
        raise ImportRejected("account is empty")
    return Entry(
        account=record["account"],
        amount=Decimal(record["amount"]),
        posted_on=date.fromisoformat(record["posted_on"]),
        memo=record.get("memo", ""),
    )
```

`ledger/importer_test.py` (current):

```python
import json
from datetime import date
from decimal import Decimal

import pytest

from ledger.importer import ImportRejected, import_record

TODAY = date(2026, 3, 1)


def test_imports_first_record():
    with open("fixtures/ledger_400.json") as f:
        records = json.load(f)
    entry = import_record(records[0], TODAY)
    assert entry.account == "4010"
    assert entry.amount == Decimal("125.00")


def test_imports_every_record():
    with open("fixtures/ledger_400.json") as f:
        records = json.load(f)
    entries = [import_record(r, TODAY) for r in records]
    assert len(entries) == 400


def test_imports_last_record():
    with open("fixtures/ledger_400.json") as f:
        records = json.load(f)
    entry = import_record(records[-1], TODAY)
    assert entry.posted_on <= TODAY


def test_rejects_empty_account():
    with open("fixtures/ledger_400.json") as f:
        records = json.load(f)
    record = dict(records[0], account="")
    with pytest.raises(ImportRejected):
        import_record(record, TODAY)


def test_rejects_missing_account():
    with open("fixtures/ledger_400.json") as f:
        records = json.load(f)
    record = dict(records[0])
    del record["account"]
    with pytest.raises(ImportRejected):
        import_record(record, TODAY)


def test_rejects_invalid_posted_on():
    with open("fixtures/ledger_400.json") as f:
        records = json.load(f)
    record = dict(records[0], posted_on="not-a-date")
    with pytest.raises(ValueError):
        import_record(record, TODAY)
```

`fixtures/ledger_400.json` is a 400-record array (about 60 KB); every record has the keys `account`, `amount`, `posted_on` (ISO date, all in 2025 or early 2026), `memo`. Its first record is `{"account": "4010", "amount": "125.00", "posted_on": "2026-01-15", "memo": "opening"}`. The file is not reproduced here.
