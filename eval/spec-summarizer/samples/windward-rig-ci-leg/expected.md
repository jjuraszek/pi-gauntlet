anonymized: true
- f1: judged: Windward operators encounter hook failures that existing automated checks never exercise on their operating system.
- f2: judged: Every push and pull request gains Windward validation of the actual installed hook.
- f3: judged: The new validation fails the workflow from day one rather than starting as advisory.
- f4: judged: Windward validation deliberately excludes the full application test suite.
- f5: judged: Completion requires the new validation to finish in under five minutes with a warm dependency cache.
- f6: judged: Making the new check mandatory for merge requires a repository-setting change where required checks are configured.
- m1: mechanical: lacks "/Users"
