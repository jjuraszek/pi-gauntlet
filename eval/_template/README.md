# Adding an eval target or sample

Copy this directory to `eval/<target>/` and edit in this order.

| File | Fill with |
|---|---|
| `target.json` | `kind` (`text`: the skill text is the system prompt and the reply is judged; `edit`: the worker edits a copy of `samples/<name>/fixture/` and the diff plus resulting tree is judged), `skillFiles` (repo-relative, in order; text kind only: optional `slice`/`sliceTo` heading prefixes or `body: true`; edit files must sit under the first file's directory), `assembly` (`concat` or `headed`), `wordCap` (`text` only), optional `denylist` (regexes that must not appear in this target's files or outputs) |
| `replay.md` | `kind: text` only: the instruction prepended to every `case.md` as the user turn; unused for edits |
| `samples/<name>/case.md` | the fixed input; `<name>` states the property under test (`council-dispatch-after-lint`, never `case-3`); for `kind: text` only, optional `bundle+: <repo path>` lines at the top add files to the skill assembly for this sample; for edits, the user turn is `/skill:<name> <request>` with the request from `case.md` plus the fixture file list |
| `samples/<name>/expected.md` | one fact per line, `- <id>: judged: <sentence>` or `- <id>: mechanical: contains "x" \| lacks "x" \| matches /re/flags`; optional first line `anonymized: true` |
| `samples/<name>/fixture/` | `edit` kind only: the files the worker edits |
| `intent.md` | leave as the stub until you change the skill; then write `for: <skillSha>` (the driver prints it), `## Change`, and `## Expected to move` |
| `README.md` | what the target tests and which skill files it loads |

Anonymization is a hard rule: a sample may start from private material, but what lands here is anonymized or rewritten as simpler synthetic text, and never contains a secret, an absolute macOS home-directory path, or the repo owner's handle outside a URL or ticket ref. The driver refuses to run on a hit.

Then `node eval/run.mjs <target> --baseline-only` seeds `results/<sample>/baseline.json` for the new sample(s) from the skill text at the merge-base with `origin/main` (or `--base <ref>`); commit them. Process and record schema: `eval/README.md`.
