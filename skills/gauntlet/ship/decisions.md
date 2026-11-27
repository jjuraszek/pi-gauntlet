# Decisions above the ship menu

Print one list at home, one entry per matching line, including repeats, in the order read. Leave out recovered steps and extra attempts. Omit the block when N = 0.

```
What the run decided on its own (N):
- <what> - <why>
- <missing data> was not available, so <what stood in> stood in; this is not proven on the data the ticket meant.
```

For an amendment, render `<title>: <what changed>` and use the evidence cell as the reason; for `none`, use the fifth cell instead. For a choice, use its two cells as facts, not as copy. Render a stand-in even when it is the only entry.

Use [everyday words](../../chase-bug/reference/verdict-report.md#register). Write both halves for the person who reported the problem: say what they can now do and why it mattered. Replace implementation terms with that effect: "open the same order on a second click", not "deduplicate requests". Restate entries without commit hashes or row, task or finding numbers. Aim for under 180 words, heading included. Shorten wording, keeping each choice and reason and each disclosure's missing data, replacement and lack of proof. Never drop or combine entries. When stand-in lines alone exceed the cap, print them all.
