bundle-: skills/brainstorming/reference/ticket-acceptance.md
bundle+: skills/brainstorming/reference/amendment-surface.md
replay: continuation

## Narrated read actions
No tools: narrate intended actions, never claim execution. At an already-rendered approval gate, doc/specs/report.md has two single-outcome AC rows, Amend-grant none, no engine and no plan. Rows 1, 2, 3 and 4 are rendered; row 2 is recommended. The council audit is in the spec commit. The settings maxIterationsPerRow is 4.

Independently trace A `2 --fund-rounds=2`; B `loop engine --fund-rounds=2`; C `2`; D `2 --amends-stop --allowance=6`; E `2 --allowance=6`; and the waves control `1 --fund-rounds=2`. For accepted replies give exact persisted grant and engine values, ledger seed allowance, commit and HEAD checks, and phase/destination. State where an override is stored and render its literal carrier immediately before the loop invocation. For rejected replies show the response and state what changes. Do not repeat the full gate; report shared unchanged state once, and print one response per case ID.

Handle each reply below independently, not as a sequence. After M1 also handle a second invalid reply `2 --allowance=-2` and show whether state changed.

| Case | Reply | Available rows and recommendation, only when different |
|---|---|---|
| M1 | 2 --allowance=0 | |
| M2 | 1 --fund-rounds=-2 | |
| M3 | 1 --fund-rounds=three | |
| M4 | 2 --allowance=9007199254740992 | |
| M5 | 2 --allowance | |
| M6 | 1 --fund-rounds=03 | |
| M7 | 2 --allowance=6 --allowance=7 | |
| M8 | 1 --amends-stop --amends-stop | |
| M9 | 2 --ammends-stop | |
| W1 | 2 with an allowance of 6 | |
| W2 | approve, auto-apply amends | |
| W3 | plan engine, stop on amends | |
| S1 | 2; allowance 6 | |
| S2 | loop engine, allowance 6 | |
| S3 | 1; fund 2 fix rounds | |
| S4 | approve, fund 2 fix rounds | |
| S5 | 1 2 more fix rounds | |
| F1 | 1 --allowance=6 | |
| F2 | 3 --amends-stop | |
| F3 | draft PR --fund-rounds=2 | |
| F4 | approve --amends-stop | rows 1,2,3,4; recommend 4 |
| F5 | approve --allowance=6 | rows 1,2,3,4; recommend 1 |
| R1 | --allowance=6 | |
| R2 | 5 | |
| R3 | 6 | |
| R4 | 9 | |
| R5 | 2 | rows 1,3,4 (zero AC rows); recommend 1 |
| R6 | 4 | rows 1,2,3 (PR subject); recommend 2 |
| R7 | 3 | rows 1,2,4 (worker path); recommend 2 |
