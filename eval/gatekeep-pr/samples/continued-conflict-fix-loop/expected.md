anonymized: true
- f1: judged: The initial mixed base/file pass spends one round before its first mutation.
- f2: judged: The second newly needed pre-push base resolution receives a fresh helper and review without another merge-base pick and spends a second round.
- f3: judged: The later source-verified P3 receives a reviewed repair under broad fix consent without another fix pick and spends the third round.
- f4: judged: No poll runs inside the fix loop; the single bounded watch runs only after Blockers are empty.
- f5: judged: Final readiness uses successful evidence on the final pushed head, not prior-head evidence.
- f6: judged: P2 is not repaired.
- f7: judged: The final ready menu is rendered without executing merge or approval.
