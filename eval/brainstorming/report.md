# eval report: brainstorming (partial run: seven F4 samples)

for: 65abe58528f169348439b67695efa230f2300fdcc1a132548d4ce2ee6976dcb1

exit: 0

## Change

Migrate only loop-gate, engine-waves, grant-budget-reply, spec-pr-regate-legs, spec-pr-unmarked, spec-pr-publish-legs and drafted-ac-rows. Preserve their original subjects and non-gate assertions. Rows are 1 plan engine, 2 loop engine, 3 council explanation, 4 draft PR. Bare engine approvals grant amendments; --amends-stop opts out. Preserve PR-subject withholding and home-only published persistence.

This is selected tool-free narration, not live Git/GitHub execution or a target-wide pass. Reuse valid replays when only judgments change. Preserve unrelated results and the prior spec-pr-regate rows below.

## Cells

Facts are primary candidate facts. Exit is the sample command's exit code, shared by its two model rows.

| Sample | Replay model | Verdict | Facts held | Exit |
|---|---|---|---|---|
| loop-gate | anthropic/claude-opus-5-5 | improved | 5/5 | 0 |
| loop-gate | github-copilot/gpt-6.1-sol | improved | 5/5 | 0 |
| engine-waves | anthropic/claude-opus-5-5 | improved | 5/5 | 0 |
| engine-waves | github-copilot/gpt-6.1-sol | improved | 5/5 | 0 |
| grant-budget-reply | anthropic/claude-opus-5-5 | improved | 2/2 | 0 |
| grant-budget-reply | github-copilot/gpt-6.1-sol | improved | 2/2 | 0 |
| spec-pr-regate-legs | anthropic/claude-opus-5-5 | improved | 10/10 | 0 |
| spec-pr-regate-legs | github-copilot/gpt-6.1-sol | improved | 10/10 | 0 |
| spec-pr-unmarked | anthropic/claude-opus-5-5 | improved | 10/10 | 0 |
| spec-pr-unmarked | github-copilot/gpt-6.1-sol | improved | 10/10 | 0 |
| spec-pr-publish-legs | anthropic/claude-opus-5-5 | improved | 13/13 | 0 |
| spec-pr-publish-legs | github-copilot/gpt-6.1-sol | unchanged | 13/13 | 0 |
| drafted-ac-rows | anthropic/claude-opus-5-5 | improved | 5/5 | 0 |
| drafted-ac-rows | github-copilot/gpt-6.1-sol | improved | 5/5 | 0 |

## Commands and observed output

Final runs used `node eval/run.mjs brainstorming <sample>` for exactly the samples below. Their baseline-only runs preceded candidate replay after each case edit. Independent spec-gate work ran concurrently; brainstorming samples never overlapped.

```text
loop-gate: brainstorming: improved (report.md written; replay 0, judge 2, confirm 0, wall 17s)
engine-waves: brainstorming: improved (report.md written; replay 0, judge 2, confirm 0, wall 14s)
grant-budget-reply: brainstorming: improved (report.md written; replay 0, judge 2, confirm 0, wall 14s)
spec-pr-regate-legs: brainstorming: improved (report.md written; replay 2, judge 2, confirm 0, wall 137s)
spec-pr-unmarked: brainstorming: improved (report.md written; replay 0, judge 2, confirm 0, wall 18s)
spec-pr-publish-legs: brainstorming: unchanged (report.md written; replay 0, judge 2, confirm 0, wall 40s)
drafted-ac-rows: brainstorming: improved (report.md written; replay 0, judge 2, confirm 0, wall 13s)
```

Full replies, judgments, identity hashes and feedback are in each selected sample's `results/<sample>/{baseline,candidate}.json`.

## Repair notes

- loop-gate now has two observable ticket rows and a numeric context observation; its zero-row control withholds only loop row 2 and its flags. The drafted control renders all four rows.
- engine-waves now uses bare 1 and 1 --amends-stop as its two waves controls; the council/change/token/malformed controls remain.
- grant-budget-reply already used rows 1/2/3/4, but its draft-PR sentence lacked the required fresh-session command and its token-only fact still demanded a full gate re-render. Align both with Design 1 and 4; keep the exact funded grant assertion.
- spec-pr-regate-legs and spec-pr-unmarked retain their provisioning and published-commit assertions while using rows 1/2/3 and the full default grant on 1. Regate's large checkpoint case needed compact narration within the existing target cap and explicit preservation of omitted-home/script predicates after observed failures; no fact was removed or waived.
- spec-pr-publish-legs uses reply/retry 4, retains every cleanup checkpoint, and requests literal outcome lines rather than compressed prose. Its success fact's ambiguous "both markers, deferred, no Engine" was read by a judge as PR-body markers. Clarify it using `skills/brainstorming/reference/spec-pr.md`: the body is the verbatim summary, the home header reads Amend-grant none / Engine deferred, and neither engine starts. No body markers are required by the source.
- drafted-ac-rows retains all five provenance scenarios and supplies context/settings for the empty-ticket four-row gate.
- Intent updates remove the historical remote-only accepted variance and stale selected-sample expected-move numbering. Refresh judgments against the final intent without replaying unchanged valid outputs.

There are no remaining failed candidate facts in these seven samples. Heavy checkpoint inputs remain intact because their original publication/provisioning assertions require the full scenarios. No skill or implementation source changed.

## Retained prior partial report rows (not rerun)

Prior report for: e52a382ac514f9b538c6028dc3b67a9a3ee44db9f69a63e2b5bbc90877ccdaba

These rows are preserved evidence, not current coverage.

| Sample | Replay model | Verdict | Replay ms | Facts moved |
|---|---|---|---|---|
| spec-pr-regate | anthropic/claude-opus-5-5 | improved | 20996 | single-member: holds -> holds (held); classifier: holds -> holds (held); skips: holds -> holds (held); gate: fails -> holds (intended change); audit: fails -> holds (intended change); change: holds -> holds (held); approvals: fails -> holds (intended change); flags: fails -> holds (intended change); hidden: fails -> holds (held); unresolved: holds -> holds (held) |
| spec-pr-regate | github-copilot/gpt-6.1-sol | improved | 23001 | single-member: holds -> holds (held); classifier: holds -> holds (held); skips: holds -> holds (held); gate: fails -> holds (intended change); audit: fails -> holds (intended change); change: holds -> holds (held); approvals: fails -> holds (intended change); flags: fails -> holds (intended change); hidden: fails -> holds (held); unresolved: holds -> holds (held) |
