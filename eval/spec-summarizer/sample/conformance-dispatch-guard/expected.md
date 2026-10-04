# Expected facts: conformance-dispatch-guard

- f1: Operators repairing conformance gaps can dispatch workers without isolation because the existing loop rules are only written guidance.
- f2: After the first conformance audit, verification will block lone repair workers.
- f3: The default repair budget increases from two rounds to three.
- f4: Reaching the repair budget blocks further repair dispatches.
- f5: Setting the repair budget to zero prevents all repair rounds.
- f6: Resuming a session retains the repair rounds already used.
