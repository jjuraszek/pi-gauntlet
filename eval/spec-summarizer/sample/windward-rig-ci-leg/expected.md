anonymized: true
# Expected facts: windward-rig-ci-leg

- f1: Windward operators encounter hook failures that existing automated checks never exercise on their operating system.
- f2: Every push and pull request gains Windward validation of the actual installed hook.
- f3: The new validation fails the workflow from day one rather than starting as advisory.
- f4: Windward validation deliberately excludes the full application test suite.
- f5: Completion requires the new validation to finish in under five minutes with a warm dependency cache.
- f6: Making the new check mandatory for merge requires a repository-setting change where required checks are configured.
