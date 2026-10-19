A singleton code wave in /workspace/project has an accepted initial SR and passing scoped tests. WAVE_BASE_SHA is 1111111111111111111111111111111111111111; HEAD is initially that same commit. Its accepted patch was integrated using git apply --index. The staged deliverables are src/parse.mjs and new tests/parse.test.mjs. SCOPED_TEST_COMMANDS is `node --test tests/parse.test.mjs`. The full Task 1, Tests contract and Spec anchors at /workspace/project/doc/specs/numbers.md:8-10 are available.

Show the initial code-review payload and commands. Its full supplied report is:
Verdict: FIX_FIRST
Moderate: src/parse.mjs accepts an empty string as zero; reject it and add coverage in tests/error.test.mjs.
Behaviour-change: yes

Show the repair dispatch and tree captures relative to the initial CR. The one in-place repair worker returns DONE and reports COMMITTED at 2222222222222222222222222222222222222222: it fixed src/parse.mjs and added tests/error.test.mjs. HEAD has therefore moved. The repair's scoped test rerun passes. Show the repair-only delta and SR/CR ordering. At the SR boundary the supplied verdict is COMPLIANT; at the subsequent CR boundary it is SHIP. Show the final fold/commit and tracker completion only after those observations. Do not invent other findings. Explain what an empty repair delta would mean. Stay under 1000 words.
