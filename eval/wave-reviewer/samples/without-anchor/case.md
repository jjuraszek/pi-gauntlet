Sample: without-anchor

Review dispatch with no planPath, anchors, or Spec anchors:
WHAT_WAS_IMPLEMENTED: Add render_label(name).
DESCRIPTION: Strip outer whitespace, leave empty labels empty, and preserve mixed case.
PLAN_OR_REQUIREMENTS: Approved spec excerpt below. Summary-only behavior is not a new commitment.
BASE_SHA: 3f1c2a9
HEAD_SHA: 8d04b7e
SCOPED_TEST_COMMANDS: none

## Acceptance criteria
- AC1: render_label(name) returns the label with outer whitespace stripped.

## Design
- Keep: An empty label remains empty.

Diff: labels.py and test_labels.py added. The following are their complete contents.

labels.py:
1: `def render_label(name):`
2: `    return name.strip()`

test_labels.py:
1: `from labels import render_label`
2:
3: `def test_label_trims_outer_space():`
4: `    # Acceptance criteria AC1: strip outer whitespace.`
5: `    assert render_label(" label ") == "label"`
6:
7: `def test_label_trims_same_input_again():`
8: `    # Acceptance criteria AC1: strip outer whitespace.`
9: `    assert render_label(" label ") == "label"`
10:
11: `def test_label_keeps_empty():`
12: `    # Design Keep: an empty label remains empty.`
13: `    assert render_label("") == ""`

No mixed-case test was added. This is an initial review, not a re-review. Produce the report and structured output with the persona's calibrated test-economy severity.
