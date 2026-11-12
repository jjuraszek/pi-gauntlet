bundle+: skills/brainstorming/reference/legs.md
The user approved the coordinated design. Worktree First and the rules walk have completed. Write the portable contract lines for the five legs below; do not invoke tools or advance to plan writing. Use one `### Leg:` block per member with branch and contract lines. Explain the name-token values for fresh creation versus later destruction. The supplied tool results are authoritative.

Shared branch is `feature/parser-fix`, shared NAME is `feature-parser-fix`. All members use `doc/specs`, `doc/plans`, `npm test`, and `Rules: AGENTS.md`. No absolute path may appear in a committed block.

| Leg | Creation facts |
|---|---|
| repo-keyed (home) | Declares keyed `home: .trees/<name>`, `create: git worktree add <home> -b <branch>`, `destroy: git worktree remove <home>`. The flow created this tree. |
| repo-default | No contract, wrapper, or native tool. The flow used the owned built-in `.worktrees/<name>` creation and removal. |
| repo-script | No keyed contract. Discovered repo-relative wrapper `script/worktree` accepts `create <subproject> <name> --branch <branch>` and `destroy <subproject> <name>`. The touched top-level directory uniquely resolves subproject to `pkg-x`. The flow ran `script/worktree create pkg-x feature-parser-fix --branch feature/parser-fix` from its primary. It reported `Worktree ready at /work/trees/renamed-parser-fix`; git lists that linked worktree on `refs/heads/feature/parser-fix`, and its checkout/common-dir identity and branch read-back pass. |
| repo-native | No keyed contract. The flow ran the native tool `treebox create feature-parser-fix --branch feature/parser-fix` from the primary; its matching removal is `treebox destroy <name>`. It reported `/work/native/slot-17`, listed by git on the shared branch with valid identity. |
| repo-host | The session was already inside this leg's tree before the flow. No keyed contract is declared and the flow ran no creator. The host owns it. |

The script and native tool choose their own folder names. Record contracts for what happened, not a proposed migration or a new overrides file. For repo-script, also state how a later stage finds the tree after its folder has been renamed again without changing its branch.
