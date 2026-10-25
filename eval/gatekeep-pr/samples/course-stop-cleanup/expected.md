anonymized: true
- f1: judged: A and B remove created and reused owned non-primary tracked-clean fully pushed worktrees, including untracked tmp.out, from primary using recorded destroy.
- f2: judged: C keeps the unpushed tree and names the discard decision; D keeps tracked dirt; E keeps foreign-home and F ambiguous trees, each with its reason.
- f3: judged: Non-final stop runs no branch deletion, base sync, release or close-ticket override and grants no merge consequence.
- f4: judged: Only this PR record/helper/log files are retired after safe stop handling; no sibling or primary checkout is removed.
