# Ledger - loop engine
**Spec:** `doc/specs/2026-11-12-repo-housekeeping-skill.md`
base: 92eb7a087670521a6117c5e39c06066de0a5bbc7
verification: npm test
checks: commands
iterations: 2
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | timeout -k 30 10 node --test eval/housekeeping/directory.test.mjs; 1 passed, 2 replay models satisfy all directory card facts; bound spent: eval directory-three-picks (1 of 3), ran eval directory-three-picks (1 of 3); selection conformance read only, no live Git or delivery actions |
| 2 | open | 0 | |
| 3 | open | 0 | |
| 4 | open | 0 | |
| 5 | open | 0 | |
| 6 | done | 0 | timeout -k 30 10 python3 -c 'assert all(all(s in __import__("pathlib").Path(p).read_text() for s in ss) for p,ss in [("skills/housekeeping/reference/check.md", ("REVIEW.md", "AGENTS.md", "CLAUDE.md", "every directory on the path to each selected file", "ARCHITECTURE.md", "README.md", "Follow these references one hop only", "Record sources read.", "With no repo sources, run base rules alone.")), ("skills/housekeeping/reference/card.md", ("the rule in everyday words and its source file",)), ("skills/housekeeping/SKILL.md", ("rule sources read",))])'; source discovery, optional defaults, card citations and source inventory present; documentation conformance only, no live checks |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | open | 0 | |
| 10 | open | 0 | |
| 11 | open | 0 | |
| 12 | open | 0 | |
| 13 | open | 0 | |
| 14 | done | 0 | timeout -k 30 10 python3 -c 'assert all(s in __import__("pathlib").Path("skills/housekeeping/SKILL.md").read_text().split("## 5. Report",1)[1].split("## Red Flags",1)[0] for s in ("Shared files:", "every path changed by two or more", "commits pushed", "files edited in place", "tickets filed and not filed", "ignored and not-decided classes", "open classes with reasons", "files not checked or not reviewed with reasons", "checks not run with reasons", "rule sources read", "prs,commits,edited,tickets,not-filed,ignored,not-decided,open", "Schedule no merge order."))'; all report lists and counter order present; documentation conformance only, no live report replay |
| 15 | open | 0 | timeout -k 30 10 python3 -c 'assert "disable-model-invocation: true" in __import__("pathlib").Path("skills/housekeeping/SKILL.md").read_text().split("---", 2)[1].splitlines() and "./skills/housekeeping" in __import__("json").loads(__import__("pathlib").Path(".claude-plugin/marketplace.json").read_text())["plugins"][0]["skills"]'; exit 1: skills/housekeeping/SKILL.md is missing; static registration check only, runtime loading untested; no paid or external action launched, no jobs file created |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1
row 1 done | Added directory selection and three-pick cards; bound spent: eval directory-three-picks (1 of 3); ran eval directory-three-picks (1 of 3); no live delivery ran. | Reuse eval/housekeeping/directory.test.mjs locally; exited-job spend records remain in ${TMPDIR:-/tmp}/loop-92eb7a087670521a6117c5e39c06066de0a5bbc7-1.jobs.
row 6 done | Confirmed source discovery, card citations and the closing source inventory by a scoped documentation assertion. | nothing new to build on
row 14 done | Confirmed report inventories, shared-file disclosure and counter order by a scoped documentation assertion. | nothing new to build on
