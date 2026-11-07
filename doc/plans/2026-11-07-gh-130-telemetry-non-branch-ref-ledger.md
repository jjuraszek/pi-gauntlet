# Ledger - loop engine
**Spec:** `doc/specs/2026-11-07-gh-130-telemetry-non-branch-ref.md`
base: 62a7baef6ae1f118b5c923348ce25c79d22c5e73
verification: npm test
checks: commands
iterations: 4
allowance: 10

| row | status | attempts | evidence |
|---|---|---|---|
| 1 | done | 0 | timeout -k 30 10 python3 -c 'exec("import json,re\nfrom pathlib import Path\np=Path(\"/var/folders/ww/xlm_qdzd2vn1k7gb4gs8kh8w0000gn/T/tmp.n17Cp2ydbA\")\nrefs={ref:sha for sha,ref in (line.split() for line in (p/\"refs.txt\").read_text().splitlines())}\nassert set(refs)=={\"refs/heads/main\",\"refs/telemetry/records\"}\nassert refs[\"refs/heads/main\"]!=refs[\"refs/telemetry/records\"]\nruns=json.loads((p/\"runs-final.json\").read_text())\nassert len(runs)==1\nassert all(runs[0][key]==value for key,value in dict(event=\"push\",status=\"completed\",conclusion=\"success\",headSha=refs[\"refs/heads/main\"]).items())\nassert (p/\"branches-final.txt\").read_text().splitlines()==[\"main\"]\nhome=(p/\"home-ui.txt\").read_text()\ncompare=(p/\"compare-ui.txt\").read_text()\nassert all(\"Open user navigation menu\" in text for text in [home,compare])\nassert \"1 Branch\" in home\nassert all(text not in home.lower() for text in [\"had recent pushes\",\"compare & pull request\",\"compare and pull request\",\"telemetry\"])\nassert \"Choose a head ref\" in compare\nassert re.findall(r\"menuitemradio \\\"([^\\\"]+)\\\"\",compare)==[\"main default\"]\nassert \"telemetry\" not in compare.lower()\nprint(\"Host proof replay passed: ref accepted, no telemetry workflow, no banner or branch/compare entry\")")'; ran host check (1 of 1); parent-captured proof replay passed: ref accepted, only init-main push workflow ran; signed-in UI has no recent-push banner and branch/compare lists contain only main |
| 2 | done | 1 | timeout -k 30 180 node --experimental-loader ./extensions/test-support/pi-stubs.mjs --test src/bins/gauntlet-telemetry-seal-branch.test.mjs src/bins/gauntlet-telemetry-migration.test.mjs extensions/telemetry-leg.test.ts; 16 passed, 0 failed; seal, settlement and checkout migration publish unchanged paths without new local or remote branches |
| 3 | done | 0 | timeout -k 30 180 node --test src/bins/gauntlet-telemetry-seal-branch.test.mjs; 3 passed, 0 failed; configured URL receives refs/telemetry/records while origin refs and remote configuration remain unchanged |
| 4 | done | 1 | timeout -k 30 180 node --test src/bins/gauntlet-telemetry-readers.test.mjs; 10 passed, 0 failed; fresh default clones read both records through all three consumers without adding branches or fetch configuration; offline cached and empty-corpus warnings preserved |
| 5 | done | 1 | timeout -k 30 180 node --test src/bins/gauntlet-telemetry-concurrency.test.mjs; 11 passed, 0 failed; shared-tip and first-use races retry without force, stranded records recover on refresh, seal and leg publication; not-pushed outcomes and last-writer-wins replay preserved |
| 6 | open | 0 | |
| 7 | open | 0 | |
| 8 | open | 0 | |
| 9 | open | 0 | |
| 10 | open | 0 | |

## Decisions
row 0 done | seeded 1 rows, closed 1 on baseline | row 2
row 2 done | Moved publication and fetched tips outside branch namespaces, reused the tracking helper in seal retries, rebuilt bins and passed 16 tests. | Reuse TELEMETRY_REF and exported trackingRef in extensions/lib/telemetry-branch.ts for migration and reader checks.
row 3 done | Verified that the configured URL receives the new ref without changing origin refs or remote configuration in the existing seal fixture. | nothing new to build on
row 4 done | Strengthened reader tests with fresh default clones, both records and branch invariance, repointed old ref assertions and passed 10 tests. | Reuse freshClone and the consumer matrix in src/bins/gauntlet-telemetry-readers.test.mjs to check origin, configured remotes and offline fallback.
row 5 done | Repointed concurrency fixtures to the new destination and fetched ref, passed all 11 tests and rebuilt bins without changes. | Reuse src/bins/gauntlet-telemetry-concurrency.test.mjs for race injection, push rejection and stranded-record recovery checks on the new ref.
