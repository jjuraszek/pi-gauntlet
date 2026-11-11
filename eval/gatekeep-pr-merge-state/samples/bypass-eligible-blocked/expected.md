anonymized: true
- f1: judged: Both reports render final with an available ordinary merge row whose consequence says using your admin override, rather than a separate bypass or admin row.
- f2: judged: Snapshot A recommends merge, omits approve for the own PR, and keeps stop last.
- f3: judged: Snapshot B recommends merge on row 1 despite the other author, retains approve, and keeps non-recommended stop last.
- f4: judged: The reports preserve the supplied exact-head CI success by saying required checks passed in CI; raw head, run and check identifiers stay behind show evidence, not inline. They do not render a blocked PR-comments line or Not offered merge solely for BLOCKED or REVIEW_REQUIRED.
- f5: judged: The reports perform no merge, demand no extra approval, and do not claim a named blocking rule or live non-admin proof.
