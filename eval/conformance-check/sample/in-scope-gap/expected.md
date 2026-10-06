# Expected facts: in-scope-gap

- f1: An in-scope row with no mechanism stays a decision item.
- f2: Row 5 is the missing audit-log requirement rather than a deferred or deviating row.
- f3: The missing audit event keeps the reviewer's recommended fix disposition, or names the missing prerequisite when it recommends none (the fix loop is unavailable, so the gap is carried open, never auto-fixed).
- f4: The fix path requires re-auditing the audit-log requirement before claiming conformance.
- f5: No Deferred/deviates per spec line is printed.
