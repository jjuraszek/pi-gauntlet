DESCRIPTION: Add render_label(name), stripping outer whitespace from nonempty labels, leaving empty labels empty, and preserving mixed case.
PLAN_OR_REQUIREMENTS: Approved spec excerpt follows. The test justifications cite the approved commitments they prove.

## Acceptance criteria
- AC1: render_label(name) returns the label with outer whitespace stripped.

## Design
- Keep: An empty label remains empty.

BASE_SHA: 3f1c2a9
HEAD_SHA: 8d04b7e
SCOPED_TEST_COMMANDS: none

Diff 3f1c2a9..8d04b7e:

```diff
--- /dev/null
+++ b/labels.py
@@ -0,0 +1,2 @@
+def render_label(name):
+    return name.strip()
--- /dev/null
+++ b/test_labels.py
@@ -0,0 +1,15 @@
+from labels import render_label
+
+
+def test_label_trims_outer_space():
+    # Acceptance criteria AC1: strip outer whitespace.
+    assert render_label(" label ") == "label"
+
+
+def test_label_keeps_empty():
+    # Design Keep: an empty label remains empty.
+    assert render_label("") == ""
+
+
+def test_label_keeps_mixed_case():
+    assert render_label("MiXeD") == "MiXeD"
```
