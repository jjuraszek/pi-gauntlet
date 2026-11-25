anonymized: true
- notice: mechanical: contains "spec approved for handoff only - run /skill:gauntlet #42"
- routes: judged: Brief, Process-state and Seed each identify the deferred spec PR and print the handoff-only stop with /skill:gauntlet #42 at entry check 6, before any tracker mutation or dispatch.
- unknown: judged: Bare tree stops and asks for the draft PR identifying this spec; it gives no numbered re-entry command and does not assume creation failed.
- published: judged: Published brainstorm stops and points to the create-only retry (option 4 to retry opening the draft PR), without a numbered re-entry command, PR creation, tracker restoration or brainstorm restart.
- exemption: judged: Grant all does not bypass deferred admission: this route gives the same create-only retry pointer as Published brainstorm, not a numbered command.
- ordered: judged: No route mutates phase_tracker or plan_tracker, runs verification, strips, seals, pushes, or continues after the stop. Explanatory statements of forbidden actions are not calls.
