# Loop implementer behavior eval

Load the body of `agents/loop-implementer.md` followed by the diagnostic simulation adapter in `replay.md` as the system prompt. The adapter scopes the persona's reply-only rule to the simulated reply so the trace remains observable. Use synthetic text snapshots and simulated tool traces because the text harness has no tools and the edit harness cannot run bash or validate commits.

| Sample | Contract |
|---|---|
| read-and-scope | Read the whole spec before the ledger or code, inspect the diff stat, and open only target-file hunks. |
| row-and-evidence | Keep non-target rows intact, bound failure evidence, and apply the multi-row seed exception without changing cut rows or attempts. |
| commit-contract | Stage owned changes, commit once, check a clean tree, and reply with only the appended decision. |

The row-and-evidence sample has two independent snapshots: a regular failed iteration and a seed iteration. Neither depends on another sample. These fixtures test decisions and emitted commands, not real filesystem or git effects. The runner writes records under `results/` and the target-wide summary to `report.md`; `records.jsonl` indexes the committed run outcome.
