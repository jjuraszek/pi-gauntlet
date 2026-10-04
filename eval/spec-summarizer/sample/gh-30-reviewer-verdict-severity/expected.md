# Expected facts: gh-30-reviewer-verdict-severity

- f1: Review users receive inconsistent merge recommendations when a report contains only moderate findings.
- f2: A critical or moderate finding will always require fixes before merge.
- f3: Minor-only findings do not block merge.
- f4: The reviewer can still refuse a change that must not land regardless of finding severity.
- f5: The change is complete when reviewer recommendations match the blocking policy the workflows already enforce.
