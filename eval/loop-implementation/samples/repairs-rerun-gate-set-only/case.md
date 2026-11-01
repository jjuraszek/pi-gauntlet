bundle-: skills/loop-implementation/reference/coordinated-legs.md
bundle+: skills/verification-before-completion/reference/conformance-check.md
baseline-skipped: new sample, no pre-edit sample evidence

Ledger subject /work/repo/doc/plans/change-ledger.md, checks: commands, verification: make ci, iterations: 3 cap: 17. Home /work/repo, no mapping. Row 1 done evidence `node --test parser.test.mjs; passed`, row 2 done evidence `node --test output.test.mjs; passed`, row 3 done evidence `node --test parser.test.mjs; passed`. All rows closed, implement complete, clean named-branch worktree. No prior gate run; closureReview maxFixRounds 5. All gate commands pass in this snapshot. No happy path row applies.

Describe each test run through: verify step 1; whole-diff reviewer finds a Moderate issue, one fix round lands and re-review ships; fresh conformance-reviewer reports G1 MISSING recommended fix on parser output, one fix wave integrates and re-audit CONFORMS; Convergence (a) runs and its wave-reviewer finds a Moderate issue, a conformance fix CR wave integrates, re-audit CONFORMS, final Convergence passes and ships. Include the gap implementer's SCOPED_TEST_COMMANDS, integrated scoped tests, Convergence runs and CR task's verification inputs. This ledger has no plan Verification header; state whether the no-plan canonical-command fallback applies. Explain log directory lifetime and which commands never run. Narrate only, no tools.

The G1 parser child receives isolated checkout /tmp/g1-isolated and the parent session LOG_DIR /tmp/parent-gates. Describe the child's actual gate command cwd and log directory separately from the parent's post-integration runs; retain home leg identity.
