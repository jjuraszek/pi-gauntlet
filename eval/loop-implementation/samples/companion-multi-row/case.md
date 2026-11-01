bundle-: agents/loop-implementer.md

Act at companion return admission only. Do not execute Entry, seed, dispatch or verify. All snapshots are independent. The driver holds membership, Rules, paths /work/home and /work/companion and both bases. Both legs already have validated seeds. Report admission, home-ledger effects, operational previous decision and the post-return tool trace. Tools are unavailable; narrate the calls, not successful execution.

Saved home ledger: checks: commands, iterations: 6, allowance: 4, verification: npm test, seeded repo-a: yes, seeded repo-b: yes. Mapping assigns row 1 to repo-a (home), rows 2-5 to repo-b (companion). Row 1 is open attempts 0 evidence empty; row 2 is open attempts 0 evidence empty; row 3 is open attempts 0 evidence empty; row 4 is cut attempts 0 evidence deferred: later; row 5 is done attempts 1 evidence check-baseline; passed. Prior decisions contain the seed lines and the existing row 5 done line.

The driver saved home HEAD and a pre-dispatch ledger copy, then persisted iterations: 7 and pending: 2 | repo-b | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb. Home HEAD is unchanged and the only home dirt is that expected bump/tuple. Companion has a clean tree and exactly one new commit after bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb. The child never edited home. The commit subject is loop: row 2 done and its body is:

pending: 2 | repo-b | bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
iteration: 7

| 2 | done | 1 | check-primary; passed |
| 3 | done | 0 | check-extra; passed |

row 2 done | Added parser | lib/parser.mjs supplies the parser
row 3 done | Reused parser | extra.test.mjs covers the shared path

The check names are supplied bounded evidence. Do not decide whether they are executable commands; the parent validates evidence bounds, not command format.

1. Admit or reject that return. State which rows and decisions the single home-ledger commit writes, its subject, the pending and counter effects and the previous decision. Also decide the target-only variant, with row 3 and its decision omitted.

2. Change only the subject to loop: row 2 failed, target cells to failed attempts 1 evidence check-primary; assertion mismatch, and its line to row 2 failed | Assertion still fails | Try the boundary fixture next. Keep the extra unchanged and do not infer worker order. State admission and previous decision.

3. Use snapshot 1 for each independent invalid variant: (a) omit the extra's decision; (b) duplicate the extra's decision; (c) replace extra row 3 and its decision with home row 1; (d) add a row 5 decision but no row 5 cells; (e) change the extra's attempts to 1; (f) change the extra to failed with a matching failed decision; (g) put the extra's decision first. State each rejection and whether any claimed extra reaches the home ledger or tracker. For variant (a), distinguish the passed git boundary from the ordinary validation miss and describe the repair commit, target cells, pending removal, retained counters, non-target cells and decisions, refresh and consecutive-miss window. This is the first validation miss; stop before another dispatch.

4. Resume after snapshot 1's child commit but before the home recording commit. The durable ledger still has its pending tuple and iterations 7. Describe the saved-ledger binding, validation and home commit without another child dispatch. Then resume again after that home commit, where pending is absent. State whether rows or counters are applied again.

For all snapshots state whether any check, gate command or npm test runs at return admission, and when a later regression into an earlier done row surfaces. Keep the answer scoped to companion admission and recovery; no seed changes or row implementation.
