# Ledger - loop engine
**Spec:** `doc/specs/2026-11-04-chase-bug-elevator-report.md`
base: 78e63174692a261a5864a27b17f8ba3727a388aa
verification: npm test
checks: commands
iterations: 3
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | node eval/chase-bug/check-report.mjs standalone-report; 2 current baseline/candidate model pairs; all 8 candidate facts hold |
| 2 | done | 0 | node eval/chase-bug/check-report.mjs sectioned-report-order; 2 current model pairs; all 8 candidate facts hold; negative gate cites failed repro and missing dataset size |
| 3 | done | 0 | node -e 'process.exit(["prose-verdict-above-menu","returned-ticket-link"].every(s=>require("node:child_process").spawnSync(process.execPath,["eval/chase-bug/check-report.mjs",s],{stdio:"inherit"}).status===0)?0:1)'; 4 current model pairs; all 16 candidate facts hold; draft and terminal-summary readability inspected |
| 4 | done | 1 | node eval/chase-bug/check-report.mjs plain-reader-first-use; 2 current model pairs; all 6 candidate facts hold; gate, draft and not-a-bug summary explain first-use terms |
| 5 | done | 0 | node eval/chase-bug/check-report.mjs sectioned-report-order; both models pass under-cap; Context stays within five source lines and reports below 180 words |
| 6 | done | 0 | node eval/chase-bug/check-report.mjs sectioned-report-order; both models pass lists-earn-place; each section uses one short paragraph |
| 7 | done | 0 | node -e 'a=require("node:assert/strict"),f=require("node:fs"),a.ok(f.readFileSync("skills/chase-bug/SKILL.md","utf8").includes("fault story (a two-sentence prose rendering of What is broken and Why")),a.ok(f.readFileSync("skills/chase-bug/reference/verdict-report.md","utf8").includes("one paragraph without headings or list")),a.ok(f.readFileSync("skills/chase-bug/hotfix.md","utf8").includes("\x3cfault story\x3e"))'; passed handoff and commit-placeholder assertions; no hotfix execution |
| 8 | done | 0 | node eval/chase-bug/check-report.mjs nov3-replay; 2 current model pairs; candidate section-order and plain-reader hold on both; baseline section-order fails on both and plain-reader holds on both |
| 9 | done | 0 | node -e '[["skills/chase-bug/SKILL.md",500],["skills/chase-bug/reference/verdict-report.md",2000]].forEach(([p,cap]) => (s => require("node:assert").ok([Buffer.byteLength(s) < 50000, s.split("\n").length - Number(s.endsWith("\n")) < cap].every(Boolean), p))(require("node:fs").readFileSync(p,"utf8")))'; both size assertions pass; SKILL.md 454 lines and 24583 bytes; reference 161 lines and 7346 bytes |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 1: add the report contract and its selected behavioral check
row 1 done | Added the sectioned verdict contract and verified both replay models against a saved-theme bug. | Reuse verdict-report.md for report rendering and check-report.mjs for cached sample evidence.
row 7 done | Kept the hotfix fault story as two prose sentences derived from What and Why, separate from displayed sections. | Reuse SKILL.md's handoff field with hotfix.md's existing commit placeholder.
row 3 done | Routed drafts, summaries, and hotfix returns through the shared report with delivery wrappers outside it. | Reuse prose-verdict-above-menu and returned-ticket-link records to check draft and summary rendering.
row 2 done | Verified the negative gate's What happens next section, missing-input fact, and unchanged discovery-ticket menu. | Reuse sectioned-report-order for real-bug and cannot-replicate gate checks.
row 5 done | Checked Context's five-line cap and the report's under-180-word cap in both gate variants. | nothing new to build on
row 6 done | Checked that sections use one paragraph or a justified list rather than mixing forms. | nothing new to build on
row 8 done | Replayed the duplicate CI scan and missing-font-character cases, recording actual baseline and passing candidate outcomes. | Reuse nov3-replay's anonymized cases and committed baseline/candidate records for before-and-after checks.
row 9 done | Checked the skill's extraction threshold and both instruction files' byte and line limits. | nothing new to build on
row 4 done | Translated first-use jargon in reports and verified gate, draft and not-a-bug summary readability on both replay models. | Reuse plain-reader-first-use with check-report.mjs and verdict-report.md's translation table; report.md records six-sample partial coverage.
