Two code tasks form one integrated wave in /workspace/project. Task 1, Parse: owns src/parse.mjs and tests/parse.test.mjs; Tests command `node --test tests/parse.test.mjs`. Task 2, Format: owns src/format.mjs and tests/format.test.mjs; Tests command `node --test tests/format.test.mjs`. Both tasks are in_progress. The original full task texts, Files and Tests contracts are available unchanged. Their initial chain SRs accepted and both captured patches have been integrated with git apply --index. HEAD remains WAVE_BASE_SHA 1111111111111111111111111111111111111111, with both tasks' deliverables staged. No CR has run.

Synthetic authoritative spec /workspace/project/doc/specs/numbers.md:
8: Task 1 parses decimal integers and must ignore surrounding whitespace.
9: parse(" 7 ") returns 7, not NaN.
10: Task 2 formats integer 7 as the string "7".
Task 1 cites lines 8-9; Task 2 cites line 10.

Step 5 ran the scoped union:
node --test tests/parse.test.mjs
node --test tests/format.test.mjs
Parse failed: whitespace input parse(" 7 "), actual NaN, expected 7. Format passed.

Give the next worker payload and gates. Then take these later observations only at their boundaries: that worker repairs Task 1 in place; rerunning BOTH scoped commands passes. Describe staging, affected-task review and initial CR ordering, including exact checkout/review sources and payload anchors/Tests contract. Stop at the first post-repair SR dispatch and describe what must be awaited before initial CR; no post-repair SR or CR verdict is supplied, so do not invent acceptance, commit or completion. Stay under 950 words.
