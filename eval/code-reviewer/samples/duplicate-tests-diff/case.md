DESCRIPTION: Task 2 added `import_record` and its tests.
PLAN_OR_REQUIREMENTS: Task 2 - `import_record(record, today)` returns an Entry with account, amount, and posted_on taken from the record.
BASE_SHA: 3f1c2a9
HEAD_SHA: 8d04b7e
SCOPED_TEST_COMMANDS: none

Diff 3f1c2a9..8d04b7e:

```diff
--- a/ledger/importer_test.py
+++ b/ledger/importer_test.py
@@ -1,8 +1,34 @@
 from datetime import date
 from decimal import Decimal

 import pytest

-from ledger.importer import ImportRejected, parse_amount
+from ledger.importer import ImportRejected, import_record, parse_amount
+
+TODAY = date(2026, 3, 1)
+RECORD = {"account": "4010", "amount": "125.00", "posted_on": "2026-01-15", "memo": "opening"}
+
+
+def test_import_sets_account():
+    entry = import_record(RECORD, TODAY)
+    assert entry.account == "4010"
+
+
+def test_import_sets_amount():
+    entry = import_record(RECORD, TODAY)
+    assert entry.amount == Decimal("125.00")
+
+
+def test_import_sets_posted_on():
+    entry = import_record(RECORD, TODAY)
+    assert entry.posted_on == date(2026, 1, 15)
+
+
+def test_import_rejects_empty_account():
+    with pytest.raises(ImportRejected):
+        import_record(dict(RECORD, account=""), TODAY)
```

`ledger/importer.py` after the change:

```python
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
