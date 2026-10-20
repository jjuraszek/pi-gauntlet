A singleton code wave in /workspace/project starts clean at WAVE_BASE_SHA 1111111111111111111111111111111111111111. Task 1 Parse owns src/parse.mjs and tests/parse.test.mjs; its command is `node --test tests/parse.test.mjs`, with full task, Tests contract and Spec anchors /workspace/project/doc/specs/numbers.md:8-9 available. The tracker is in_progress. On pi-cohort 7.4.3 the initial implementation-to-SR chain returned DONE and COMPLIANT for its captured Artifacts patch /tmp/reports/task1.patch.

The PARENT integration command `git -C /workspace/project apply --index /tmp/reports/task1.patch` actually exited 1:
error: patch failed: src/parse.mjs:8
error: src/parse.mjs: patch does not apply
This is not a snapshot setup failure. Observed immediately afterward: git status --porcelain is empty, HEAD equals WAVE_BASE_SHA, and there are zero integrated patches.

Describe next actions, the retry's checkout/source and which gates are skipped. Then the bounded recovery attempts both fail: attempt 1 and attempt 2 each produce no accepted integrable patch, and each leaves the parent clean at the unchanged wave base. No retry succeeds. State the terminal outcome, tracker state, HEAD and whether another new wave resets the attempt budget. You may spec-review new retry patches if any are usable; do not invent a usable patch or accepted verdict. Stay under 900 words.
