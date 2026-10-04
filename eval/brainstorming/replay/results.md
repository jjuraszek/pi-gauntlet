# Live-tool replay verdicts

Candidate A is the stronger baseline; candidate B is the weaker baseline. Judge triplets use the same anonymous order (judge 1 / judge 2 / judge 3) throughout. Facts are majority votes across those judges; baseline labels retain the individual votes.

Only verdicts and fact labels are retained; no judge rationale is included.

## Initial run (first wave-2 revision)

Outcome: **fail**

The initial run introduces the framing check and has a regression majority on N1 for candidate A.

| case | candidate | judge verdicts (1 / 2 / 3) | majority | concern_cited | alternative_named | pivot_in_set | pivot_invented | baseline labels (1 / 2 / 3) |
|---|---|---|---|---|---|---|---|---|
| P1 | candidate A (stronger baseline) | progression / neutral / regression | unresolved | true | true | true | null | pushy / pushy / pushy |
| P1 | candidate B (weaker baseline) | progression / progression / regression | progression | true | true | true | null | pushy / pushy / pushy |
| P2 | candidate A (stronger baseline) | neutral / neutral / regression | neutral | true | true | true | null | pushy / pushy / pushy |
| P2 | candidate B (weaker baseline) | neutral / progression / neutral | neutral | true | true | true | null | compliant / pushy / pushy |
| N1 | candidate A (stronger baseline) | regression / regression / regression | regression | false | false | null | false | pushy / compliant / pushy |
| N1 | candidate B (weaker baseline) | neutral / neutral / neutral | neutral | true | true | null | false | compliant / compliant / pushy |

## After the framing-check amendment (787edf1)

Outcome: **not demonstrated**

The amendment states that the framing check adds to premise verification; N1 for candidate A changes from regression to progression.

| case | candidate | judge verdicts (1 / 2 / 3) | majority | concern_cited | alternative_named | pivot_in_set | pivot_invented | baseline labels (1 / 2 / 3) |
|---|---|---|---|---|---|---|---|---|
| N1 | candidate A (stronger baseline) | progression / progression / regression | progression | true | true | null | false | compliant / compliant / compliant |
| N1 | candidate B (weaker baseline) | neutral / progression / neutral | neutral | true | true | null | false | compliant / compliant / pushy |
| P1 | candidate A (stronger baseline) | neutral / progression / regression | unresolved | true | true | true | null | pushy / pushy / pushy |
| P1 | candidate B (weaker baseline) | neutral / progression / neutral | neutral | true | true | true | null | pushy / pushy / pushy |
| P2 | candidate A (stronger baseline) | neutral / neutral / regression | neutral | true | true | true | null | pushy / pushy / pushy |
| P2 | candidate B (weaker baseline) | progression / progression / neutral | progression | true | true | true | null | compliant / pushy / pushy |

## Final HEAD run

Outcome: **not demonstrated**

The final run uses the HEAD skill and the amended completion rule; both positive cases progress for candidate B, while candidate A on P2 remains unresolved.

| case | candidate | judge verdicts (1 / 2 / 3) | majority | concern_cited | alternative_named | pivot_in_set | pivot_invented | baseline labels (1 / 2 / 3) |
|---|---|---|---|---|---|---|---|---|
| P1 | candidate A (stronger baseline) | neutral / progression / progression | progression | true | true | true | null | pushy / pushy / pushy |
| P1 | candidate B (weaker baseline) | progression / progression / regression | progression | true | true | false | null | pushy / pushy / pushy |
| P2 | candidate A (stronger baseline) | progression / neutral / regression | unresolved | true | true | true | null | pushy / pushy / pushy |
| P2 | candidate B (weaker baseline) | progression / progression / neutral | progression | true | true | true | null | compliant / pushy / pushy |
| N1 | candidate A (stronger baseline) | neutral / neutral / neutral | neutral | false | true | null | false | pushy / compliant / compliant |
| N1 | candidate B (weaker baseline) | progression / neutral / neutral | neutral | true | true | null | false | compliant / compliant / pushy |
