# Ledger - loop engine
**Spec:** `doc/specs/2026-11-04-check-delivery-multi-ticket.md`
base: d3aa93b651f89223161c6039446cd8af3ee3296c
verification: npm test
checks: commands
iterations: 6
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 1 | node -e '["gate-line-first", "menu-after-numbered-findings"].forEach(s => require("node:assert").strictEqual(require("node:child_process").spawnSync(process.execPath, ["eval/run.mjs", "check-delivery", s, "--base", "d3aa93b651f89223161c6039446cd8af3ee3296c"], {stdio: "inherit"}).status, 0))'; both selected samples unchanged; four model cells pass with all facts holding; single-ticket skill text unchanged from base |
| 2 | done | 1 | node eval/run.mjs check-delivery-batch batch-one-gate-per-turn --base d3aa93b651f89223161c6039446cd8af3ee3296c; 2 model cells improved with all 9 facts holding; first report and gate isolated in supplied order; dispatch and tracker calls require manual smoke |
| 3 | done | 1 | node -e '["batch-decline-isolates", "batch-approved-after-decline"].forEach(s => require("node:assert").strictEqual(require("node:child_process").spawnSync(process.execPath, ["eval/run.mjs", "check-delivery-batch", s, "--base", "d3aa93b651f89223161c6039446cd8af3ee3296c"], {stdio: "inherit"}).status, 0))'; 4 model cells improved with all 32 facts holding; decline leaves the next gate independent and subsequent approval advances the turn; tool writes are supplied observations and require manual smoke |
| 4 | done | 1 | node eval/run.mjs check-delivery-batch batch-approved-after-decline --base d3aa93b651f89223161c6039446cd8af3ee3296c; 2 current cached model cells improved with all 16 facts holding; approved outcome precedes next report under its gate marker; re-fetch and writes are supplied observations requiring manual smoke |
| 5 | done | 1 | node -e '((f,a)=>((s,p)=>[a.strictEqual(p.length,4),a.deepStrictEqual(s.split("\n").filter(l=>/^\x7c [1-4] \x7c/.test(l)).map(l=>l.split(String.fromCharCode(124)).at(-2).trim()),p),["before any tracker call or fetch", "Start the message with `gauntlet: stuck`", "first failed check", "reject the whole set with that one message and take no further action", "branch on its absence, not a harness name", "Match every whole token", "default 8", "never chunk it", "Checks 1-3 perform no tracker or git operation", "the only git read in admission", "Normalize `#N` to lowercase", "Normalize Linear keys and Linear URLs to the uppercase key", "match URLs through the end of the token"].forEach(t=>a.ok(s.includes(t),t))])(f.readFileSync("skills/check-delivery/reference/batch.md","utf8").split("## Shared prep")[0],f.readFileSync("doc/specs/2026-11-04-check-delivery-multi-ticket.md","utf8").split("\n").filter(l=>/^\x7c [1-4] \x7c/.test(l)).map(l=>l.split(String.fromCharCode(124)).at(-2).trim())))(require("node:fs"),require("node:assert"))'; exit 0; four ordered rejection lines match spec exactly and admission constraints are present; prose conformance only, tool behavior requires manual smoke |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | done | 0 | node -e '((s,a)=>[a.match(s,/^---\nname: delivery-checker\ndescription: .+Not for direct dispatch\./), a.deepStrictEqual(require("yaml").parse(s.split("---")[1]), {name:"delivery-checker", description:"Use for one ticket dispatched by check-delivery set mode. Not for direct dispatch.", tools:"read, grep, find, ls, bash, plan_tracker", defaultContext:"fresh", inheritProjectContext:true, inheritSkills:false, systemPromptMode:"replace", completionGuard:false})])(require("node:fs").readFileSync("agents/delivery-checker.md","utf8"),require("node:assert"))'; exit 0; CI name and description frontmatter checks and exact YAML fields pass; no extra tools or model/thinking pins |
| 10 | done | 0 | node -e '["skills/check-delivery/SKILL.md", "skills/check-delivery/reference/batch.md"].map(p => require("node:fs").readFileSync(p, "utf8")).forEach(s => [require("node:assert").ok(Buffer.byteLength(s) < 50000), require("node:assert").ok(s.split("\n").length - Number(s.endsWith("\n")) < 2000), require("node:assert").ok(!s.includes("Input is exactly one tracker ref"))])'; exit 0; both files below 50000 bytes and 2000 lines; obsolete single-ref sentence absent |

## Decisions
row 0 done | seeded 1 rows, closed 0 on baseline | row 10
row 1 done | Both single-ticket eval samples pass against the base with unchanged skill text and all facts holding. | nothing new to build on
row 2 done | Added fresh per-ticket dispatch and ordered parent turns with passing first-gate evals and updated docs. | Reuse skills/check-delivery/reference/batch.md and eval/check-delivery-batch for later turn and recovery checks.
row 9 done | Checked delivery-checker frontmatter against the exact tool list, context pins, and indirect-dispatch description. | nothing new to build on
row 10 done | Checked both instruction files stay below the byte and line caps and omit the obsolete single-ref constraint. | nothing new to build on
row 3 done | Added decline and subsequent approval evals with all 32 facts passing against existing set-turn instructions. | Reuse eval/check-delivery-batch's batch-decline-isolates and batch-approved-after-decline fixtures for later turn checks.
row 4 done | Confirmed the approved-turn sample passes all 16 facts with existing write-order instructions and a plain delivered outcome before the next report. | nothing new to build on
row 5 done | Checked all four ordered admission rejection lines against the spec and confirmed pre-call, normalization, and single-message constraints in existing prose. | nothing new to build on
