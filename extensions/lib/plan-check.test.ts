import assert from "node:assert/strict";
import test from "node:test";
import { checkPlan, renderManifest, sha256, type FsPort, type PlanCheckFinding } from "./plan-check.ts";

const ledgerSpec = `# Spec
## Acceptance criteria
- [ ] First
- [ ] Second
  deferred: #70
- [ ] Third
  venue: browser
## Design
- [ ] Not an AC
`;
const ledger = (rows = ["1 | open | 0 |", "2 | cut | 0 | deferred: #70", "3 | done | 2 | browser check passed"]) =>
  "# Ledger - loop engine\n**Spec:** `doc/specs/test.md`\nbase: abc\nverification: check\niterations: 0\n\n| row | status | attempts | evidence |\n|---|---|---|---|\n" + rows.map(r => `| ${r} |`).join("\n") + "\n\n## Decisions\n";

test("ledger admission bypasses task checks and permits empty open evidence", () => {
  for (const input of [ledger(), ledger().replace("iterations: 0\n", "iterations: 0\ncap: 97\n")]) {
    assert.deepEqual(checkPlan(input, ledgerSpec, { exists: () => false, glob: () => [] }).findings, []);
  }
});
for (const [name, rows] of Object.entries({
  missing: ["1 | open | 0 |"],
  extra: ["1 | open | 0 |", "2 | cut | 0 | deferred: #70", "3 | open | 0 |", "4 | open | 0 |"],
  duplicate: ["1 | open | 0 |", "1 | cut | 0 | deferred: #70", "3 | open | 0 |"],
  order: ["3 | open | 0 |", "2 | cut | 0 | deferred: #70", "1 | open | 0 |"],
  status: ["1 | closed | 0 | check", "2 | cut | 0 | deferred: #70", "3 | open | 0 |"],
  cutDefault: ["1 | cut | 0 | check", "2 | cut | 0 | deferred: #70", "3 | open | 0 |"],
  cutVenue: ["1 | open | 0 |", "2 | cut | 0 | deferred: #70", "3 | cut | 0 | check"],
  openDeferred: ["1 | open | 0 |", "2 | open | 0 |", "3 | open | 0 |"],
  attempts: ["1 | open | -1 |", "2 | cut | 0 | deferred: #70", "3 | open | 0 |"],
  fractional: ["1 | open | 1.5 |", "2 | cut | 0 | deferred: #70", "3 | open | 0 |"],
})) test(`ledger rejects ${name}`, () => {
  assert.ok(checkPlan(ledger(rows), ledgerSpec, { exists: () => false, glob: () => [] }).findings.length);
});
test("ledger discriminant is the exact first line", () => {
  for (const prefix of ["\n", " "]) assert.ok(checkPlan(prefix + ledger(), ledgerSpec, { exists: () => false, glob: () => [] }).findings.some(f => f.check === "input"));
});
for (const disposition of ["in-scope", "venue: browser", "deviates: alternate", "deferred: #70", "elsewhere: #71"]) {
  test(`ledger disposition ${disposition}`, () => {
    const cut = /^(deviates|deferred|elsewhere):/.test(disposition);
    const spec = `## Acceptance criteria\n- [ ] Works\n  ${disposition}\n`;
    assert.deepEqual(checkPlan(ledger([`1 | ${cut ? "cut" : "open"} | 0 | ${cut ? disposition : ""}`]), spec, { exists: () => false, glob: () => [] }).findings, []);
    assert.ok(checkPlan(ledger([`1 | ${cut ? "done" : "cut"} | 0 | check passed`]), spec, { exists: () => false, glob: () => [] }).findings.length);
  });
}
for (const status of ["done", "failed", "cut"]) test(`ledger empty evidence rejects ${status}`, () => {
  const spec = `## Acceptance criteria\n- [ ] Works\n${status === "cut" ? "  deferred: #70\n" : ""}`;
  assert.ok(checkPlan(ledger([`1 | ${status} | 0 |`]), spec, { exists: () => false, glob: () => [] }).findings.some(f => /evidence is required/.test(f.reason)));
});
for (const evidence of ["<check>", "TODO", "TBD", "etc.", "probably"]) {
  test(`ledger rejects non-open evidence ${JSON.stringify(evidence)}`, () => {
    assert.ok(checkPlan(ledger([`1 | failed | 1 | ${evidence}`, "2 | cut | 0 | deferred: #70", "3 | open | 0 |"]), ledgerSpec, { exists: () => false, glob: () => [] }).findings.length);
  });
}

test("ledger keeps nested checkboxes and the parent disposition in one AC row", () => {
  const spec = "## Acceptance criteria\n- [ ] Parent\n  - [ ] Nested detail\n  deferred: #70\n";
  assert.deepEqual(checkPlan(ledger(["1 | cut | 0 | deferred: #70"]), spec, { exists: () => false, glob: () => [] }).findings, []);
  assert.ok(checkPlan(ledger(["1 | open | 0 |"]), spec, { exists: () => false, glob: () => [] }).findings.some(f => /status does not match/.test(f.reason)));
});

for (const evidence of ["xxx", "[fill in]", "something like", "check; expected a\\|b; passed"]) {
  test(`ledger permits evidence outside the placeholder vocabulary ${JSON.stringify(evidence)}`, () => {
    assert.deepEqual(checkPlan(ledger([`1 | done | 1 | ${evidence}`, "2 | cut | 0 | deferred: #70", "3 | open | 0 |"]), ledgerSpec, { exists: () => false, glob: () => [] }).findings, []);
  });
}

const SPEC_TEXT = [
  "# Fixture Spec", // 1
  "", // 2
  "## Design", // 3
  "Line A.", // 4
  "This part defines `helperFn()` config.", // 5
  "Another line here.", // 6
  "", // 7
  "## Testing", // 8
  "This mentions `TODO` as a banned token example for exemption checking.", // 9
  "More text.", // 10
  "", // 11
  "## Other", // 12
  "Stuff.", // 13
  "", // 14
  "## Acceptance", // 15
  "Full suite passes: `npm run fixture-verify`.", // 16
].join("\n");

const VALID_PLAN = `# Fixture Plan

**Spec:** \`doc/specs/fixture-spec.md\`

**Verification:** npm run fixture-verify

---

## Wave 1 — Two parallel tasks

### Task 1: Implement helper

**Spec:** doc/specs/fixture-spec.md § "Design" L4-L6

**Files:**
- Create: extensions/lib/fixture-task1.ts
- Modify: extensions/lib/fixture-shared.ts
- Test: extensions/lib/fixture-task1.test.ts

**Tests:**
- \`node --test extensions/lib/fixture-task1.test.ts\`
- baseline: abc1234 pass
- via: \`helperFn()\`

This task implements helperFn() for parsing.

### Task 2: Implement naming

**Spec:** doc/specs/fixture-spec.md § "Design" L4-L4

**Files:**
- Create: extensions/lib/fixture-task2.ts
- Modify: extensions/lib/fixture-other.ts
- Test: extensions/lib/fixture-task2.test.ts

**Tests:**
- \`node --test extensions/lib/fixture-task2.test.ts\`
- baseline: abc1234 pass

This task handles naming details.

## Wave 2 — Solo task

### Task 3: Document banned token handling

**Spec:** doc/specs/fixture-spec.md § "Testing" L9

**Files:**
- Modify: extensions/lib/fixture-task3.ts
- Test: extensions/lib/fixture-task3.test.ts

**Tests:**
- \`node --test extensions/lib/fixture-task3.test.ts\`
- baseline: abc1234 pass

The literal TODO is intentionally documented here per spec quote-integrity requirement.

## Spec coverage

| anchor | requirement | owner |
|---|---|---|
| § "Design" L4-L6 | parser grammar basics | Task 1 |
| § "Design" L4-L4 | helper naming | Task 2 |
| § "Testing" L9-L9 | banned token literal handling | Task 3 |
| - | mechanical: wire test into CI | Task 2 |
| § "Other" L12-L13 | out of scope thing | waived: out of scope per spec |
| § "Acceptance" L16 | full suite passes | Verification |
`;

function alwaysTruePort(): FsPort {
  return {
    exists: () => true,
    glob: () => [],
  };
}

function lineOf(text: string, needle: string): number {
  const idx = text.split("\n").findIndex((l) => l.includes(needle));
  assert.notEqual(idx, -1, `expected to find a line containing ${JSON.stringify(needle)}`);
  return idx + 1;
}

function findingsFor(findings: PlanCheckFinding[], check: string): PlanCheckFinding[] {
  return findings.filter((f) => f.check === check);
}

test("valid fixture: checkPlan returns no findings (also covers the placeholder exemption case)", () => {
  const findings = checkPlan(VALID_PLAN, SPEC_TEXT, alwaysTruePort()).findings;
  assert.deepEqual(findings, []);
});

test("no gauntlet grammar at all: emits both an absent-wave-headers and an absent-task-headers finding", () => {
  const plan = "# Just a plan\n\nSome prose with no wave or task headers at all.\n";
  const findings = checkPlan(plan, SPEC_TEXT, alwaysTruePort()).findings;
  const waveFindings = findings.filter((f) => f.reason.includes("wave headers"));
  const taskFindings = findings.filter((f) => f.reason.includes("task headers"));
  assert.equal(waveFindings.length, 1, "expected exactly one absent-wave-headers finding");
  assert.equal(taskFindings.length, 1, "expected exactly one absent-task-headers finding");
});

test("check 1 table-closure: task not covered by any Spec coverage row", () => {
  const mutated = VALID_PLAN.replace('| § "Testing" L9-L9 | banned token literal handling | Task 3 |\n', "");
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  const tc = findingsFor(findings, "table-closure");
  assert.ok(
    tc.some((f) => f.reason.includes("Task 3") && f.reason.includes("does not appear as an owner")),
    `expected a table-closure finding about Task 3 not covered, got: ${JSON.stringify(tc)}`,
  );
  assert.ok(
    tc.some(
      (f) =>
        f.reason.includes("Task 3") &&
        f.line === lineOf(mutated, "### Task 3: Document banned token handling"),
    ),
    `expected the table-closure finding's line to point at Task 3's header, got: ${JSON.stringify(tc)}`,
  );
});

test("check 1 fail-closed: missing '## Spec coverage' table entirely", () => {
  const mutated = VALID_PLAN.slice(0, VALID_PLAN.indexOf("## Spec coverage"));
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  const tc = findingsFor(findings, "table-closure");
  assert.equal(tc.length, 1);
  assert.match(tc[0].reason, /no '## Spec coverage' table found/);
  assert.equal(tc[0].line, 0);
});

test("check 2 quote-integrity: required verbatim literal missing from owner task body", () => {
  const mutated = VALID_PLAN.replace(
    "- via: `helperFn()`\n\nThis task implements helperFn() for parsing.",
    "- via: `parserSeam()`\n\nThis task implements the helper for parsing.",
  );
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  const qi = findingsFor(findings, "quote-integrity");
  assert.ok(
    qi.some((f) => f.reason.includes("helperFn()") && f.reason.includes("Task 1")),
    `expected a quote-integrity finding naming the missing literal, got: ${JSON.stringify(qi)}`,
  );
  assert.ok(
    qi.some((f) => f.line === lineOf(mutated, "parser grammar basics")),
    `expected the quote-integrity finding's line to point at the offending Spec coverage row, got: ${JSON.stringify(qi)}`,
  );
});

test("check 1 owner-cell grammar: trailing junk after a Task <n> list is malformed, not accepted", () => {
  const mutated = VALID_PLAN.replace(
    '| § "Design" L4-L6 | parser grammar basics | Task 1 |',
    '| § "Design" L4-L6 | parser grammar basics | Task 1 (see note) |',
  );
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  const tc = findingsFor(findings, "table-closure");
  assert.ok(
    tc.some(
      (f) =>
        f.reason.includes("owner cell is not a 'Task <n>' list, 'Verification', or 'waived: <reason>'") &&
        f.text.includes("Task 1 (see note)"),
    ),
    `expected an owner-cell malformed finding, got: ${JSON.stringify(tc)}`,
  );
  assert.ok(
    tc.some(
      (f) =>
        f.reason.includes("owner cell is not a 'Task <n>' list, 'Verification', or 'waived: <reason>'") &&
        f.line === lineOf(mutated, '| § "Design" L4-L6 | parser grammar basics | Task 1 (see note) |'),
    ),
    `expected the owner-cell malformed finding's line to point at the offending row, got: ${JSON.stringify(tc)}`,
  );
});

test("check 1 owner-cell grammar: empty waiver reason is malformed, not accepted as a waiver", () => {
  const mutated = VALID_PLAN.replace(
    '| § "Other" L12-L13 | out of scope thing | waived: out of scope per spec |',
    '| § "Other" L12-L13 | out of scope thing | waived: |',
  );
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  const tc = findingsFor(findings, "table-closure");
  assert.ok(
    tc.some((f) => f.reason.includes("owner cell is not a 'Task <n>' list, 'Verification', or 'waived: <reason>'")),
    `expected an owner-cell malformed finding for empty waiver reason, got: ${JSON.stringify(tc)}`,
  );
  assert.ok(
    tc.some(
      (f) =>
        f.reason.includes("owner cell is not a 'Task <n>' list, 'Verification', or 'waived: <reason>'") &&
        f.line === lineOf(mutated, '| § "Other" L12-L13 | out of scope thing | waived: |'),
    ),
    `expected the owner-cell malformed finding's line to point at the offending row, got: ${JSON.stringify(tc)}`,
  );
});

const WAIVED_ROW = '| § "Other" L12-L13 | out of scope thing | waived: out of scope per spec |';

test("check 9 waiver-literal: waived row whose requirement names a code literal fails", () => {
  const row = '| § "Other" L12-L13 | `protectedPaths: []` stays empty | waived: out of scope |';
  const mutated = VALID_PLAN.replace(WAIVED_ROW, row);
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  const wl = findingsFor(findings, "waiver-literal");
  assert.equal(wl.length, 1, `expected exactly one waiver-literal finding, got: ${JSON.stringify(wl)}`);
  assert.equal(wl[0].line, lineOf(mutated, row));
  assert.equal(wl[0].reason, "waived row names a code literal; waive only requirements that exclude work");
});

test("check 9 waiver-literal: same requirement owned by a task passes the whole plan", () => {
  let mutated = VALID_PLAN.replace(WAIVED_ROW, '| § "Other" L12-L13 | `protectedPaths: []` stays empty | Task 1 |');
  mutated = mutated.replace(
    '**Spec:** doc/specs/fixture-spec.md § "Design" L4-L6',
    '**Spec:** doc/specs/fixture-spec.md § "Design" L4-L6, § "Other" L12-L13',
  );
  assert.deepEqual(checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings, []);
});

test("check 9 waiver-literal: waived prose requirement without backticks passes the whole plan", () => {
  const mutated = VALID_PLAN.replace(
    WAIVED_ROW,
    '| § "Other" L12-L13 | do not add support for protectedPaths | waived: out of scope per spec |',
  );
  assert.deepEqual(checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings, []);
});

const VERIFICATION_ROW = '| § "Acceptance" L16 | full suite passes | Verification |';

function withRow(plan: string, row: string): string {
  return plan.replace(
    '| § "Other" L12-L13 | out of scope thing | waived: out of scope per spec |',
    `| § "Other" L12-L13 | out of scope thing | waived: out of scope per spec |\n${row}`,
  );
}

for (const owner of ["verification", "Verify", "VERIFICATION", "Task 1, Verification"]) {
  test(`Verification owner: '${owner}' is a malformed owner -> table-closure`, () => {
    const row = `| § "Acceptance" L16 | full suite passes | ${owner} |`;
    const findings = checkPlan(withRow(VALID_PLAN, row), SPEC_TEXT, alwaysTruePort()).findings;
    const tc = findingsFor(findings, "table-closure");
    assert.ok(
      tc.some(
        (f) =>
          f.reason === "owner cell is not a 'Task <n>' list, 'Verification', or 'waived: <reason>'" &&
          f.text === row,
      ),
      `expected orphan-owner finding for ${owner}, got: ${JSON.stringify(tc)}`,
    );
  });
}

test("Verification owner: unparseable anchor ('-') -> table-closure parseability reason", () => {
  const row = "| - | full suite passes | Verification |";
  const findings = checkPlan(withRow(VALID_PLAN, row), SPEC_TEXT, alwaysTruePort()).findings;
  const tc = findingsFor(findings, "table-closure");
  assert.ok(
    tc.some(
      (f) =>
        f.reason === 'requirement row anchor is not a parseable § "heading" L<n>-L<n> anchor' && f.text === row,
    ),
    `expected parseability finding, got: ${JSON.stringify(tc)}`,
  );
});

test("Verification owner: anchored lines without a backtick literal -> table-closure", () => {
  const row = '| § "Other" L13 | stuff | Verification |';
  const findings = checkPlan(withRow(VALID_PLAN, row), SPEC_TEXT, alwaysTruePort()).findings;
  const tc = findingsFor(findings, "table-closure");
  assert.ok(
    tc.some(
      (f) => f.reason === "Verification row has no backtick literal to check against the header" && f.text === row,
    ),
    `expected no-literal finding, got: ${JSON.stringify(tc)}`,
  );
});

test("Verification owner: mechanical row -> table-closure", () => {
  const row = "| - | mechanical: run the suite | Verification |";
  const findings = checkPlan(withRow(VALID_PLAN, row), SPEC_TEXT, alwaysTruePort()).findings;
  const tc = findingsFor(findings, "table-closure");
  assert.ok(
    tc.some((f) => f.reason === "mechanical row owner must be a Task <n>" && f.text === row),
    `expected mechanical-owner finding, got: ${JSON.stringify(tc)}`,
  );
});

test("table-closure: multi-owner row with unparseable anchor yields one parseability finding", () => {
  const row = "| L999 | naming details | Task 1, Task 2 |";
  const findings = checkPlan(withRow(VALID_PLAN, row), SPEC_TEXT, alwaysTruePort()).findings;
  const parseability = findingsFor(findings, "table-closure").filter(
    (f) => f.text === row && f.reason.includes("not a parseable"),
  );
  assert.equal(parseability.length, 1);
});

test("Verification owner: does not satisfy a task's coverage requirement", () => {
  const mutated = withRow(VALID_PLAN, VERIFICATION_ROW).replace(
    '| § "Testing" L9-L9 | banned token literal handling | Task 3 |\n',
    "",
  );
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  assert.ok(
    findingsFor(findings, "table-closure").some((f) =>
      f.reason.includes("Task 3 does not appear as an owner"),
    ),
  );
});

test("Verification quote-integrity: literal missing from header -> quote-integrity on the row", () => {
  const mutated = VALID_PLAN.replace("**Verification:** npm run fixture-verify", "**Verification:** npm run other");
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  const qi = findingsFor(findings, "quote-integrity");
  const row = '| § "Acceptance" L16 | full suite passes | Verification |';
  assert.ok(
    qi.some(
      (f) =>
        f.reason === "verification header does not contain the required verbatim literal `npm run fixture-verify`" &&
        f.text === row &&
        f.line === lineOf(mutated, row),
    ),
    `expected header-containment finding, got: ${JSON.stringify(qi)}`,
  );
});

test("Verification quote-integrity: multi-command header contains the literal", () => {
  const mutated = VALID_PLAN.replace(
    "**Verification:** npm run fixture-verify",
    "**Verification:** `npm run fixture-verify && npm run lint`",
  );
  assert.deepEqual(findingsFor(checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings, "quote-integrity"), []);
});

test("Verification quote-integrity: two-span header contains both literals", () => {
  const spec = SPEC_TEXT.replace(
    "Full suite passes: `npm run fixture-verify`.",
    "Full suite passes: `npm run fixture-verify` and `npm run lint`.",
  );
  const mutated = VALID_PLAN.replace(
    "**Verification:** npm run fixture-verify",
    "**Verification:** `npm run fixture-verify`, `npm run lint`",
  );
  assert.deepEqual(findingsFor(checkPlan(mutated, spec, alwaysTruePort()).findings, "quote-integrity"), []);
});

test("Verification quote-integrity: missing header -> quote-integrity per literal plus header-entrypoint", () => {
  const mutated = VALID_PLAN.replace("**Verification:** npm run fixture-verify\n", "");
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  assert.equal(
    findingsFor(findings, "quote-integrity").filter((f) => f.reason.includes("`npm run fixture-verify`")).length,
    1,
  );
  assert.ok(findingsFor(findings, "header-entrypoint").some((f) => f.reason.includes("missing header")));
});

test("Verification quote-integrity: task body containing the full header string still fails header-entrypoint", () => {
  const mutated = VALID_PLAN.replace(
    "This task handles naming details.",
    "This task handles naming details. Run npm run fixture-verify here.",
  );
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  assert.ok(findingsFor(findings, "header-entrypoint").some((f) => f.text.includes("Run npm run fixture-verify here")));
  assert.deepEqual(findingsFor(findings, "quote-integrity"), []);
});

test("Verification quote-integrity: task body containing only a sub-command of a multi-command header is not caught by header-entrypoint", () => {
  const mutated = VALID_PLAN.replace(
    "**Verification:** npm run fixture-verify",
    "**Verification:** `npm run fixture-verify && npm run lint`",
  ).replace("This task handles naming details.", "This task handles naming details. Run npm run fixture-verify here.");
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  assert.deepEqual(findingsFor(findings, "header-entrypoint"), []);
  assert.deepEqual(findingsFor(findings, "quote-integrity"), []);
});

const HE = (plan: string) => findingsFor(checkPlan(plan, SPEC_TEXT, alwaysTruePort()).findings, "header-entrypoint");
const WD = (plan: string) => findingsFor(checkPlan(plan, SPEC_TEXT, alwaysTruePort()).findings, "wave-file-disjointness");

test("header-entrypoint: Run: with backticked payload npm test under header npm test && npm run lint fails (regression for the hole)", () => {
  const mutated = VALID_PLAN.replace("**Verification:** npm run fixture-verify", "**Verification:** npm test && npm run lint")
    .replace("This task handles naming details.", "- [ ] **Step 1: verify**\n\n  Run: `npm test`\n  Expected: PASS");
  assert.ok(HE(mutated).some((f) => f.text.includes("Run: `npm test`")));
});

test("header-entrypoint: Run: npm test && echo ok fails", () => {
  const mutated = VALID_PLAN.replace("**Verification:** npm run fixture-verify", "**Verification:** npm test")
    .replace("This task handles naming details.", "Run: npm test && echo ok");
  assert.ok(HE(mutated).some((f) => f.text.includes("Run: npm test && echo ok")));
});

test("header-entrypoint: Run: npm test -- x.test.ts passes under bare and backticked header npm test", () => {
  for (const header of ["**Verification:** npm test", "**Verification:** `npm test`"]) {
    const mutated = VALID_PLAN.replace("**Verification:** npm run fixture-verify", header)
      .replace("This task handles naming details.", "Run: npm test -- x.test.ts");
    assert.deepEqual(HE(mutated), [], header);
  }
});

test("header-entrypoint: Run: line with two backtick spans - both are payload", () => {
  const mutated = VALID_PLAN.replace("This task handles naming details.", "Run: `echo a` then `npm run fixture-verify`");
  assert.equal(HE(mutated).length, 1);
});

test("header-entrypoint: Tests: bullets are judged by tests-block, not here", () => {
  const mutated = VALID_PLAN.replace(
    "**Tests:**\n- `node --test extensions/lib/fixture-task2.test.ts`",
    "**Tests:**\n- `npm run fixture-verify`",
  );
  assert.deepEqual(HE(mutated), []);
  assert.ok(findingsFor(checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings, "tests-block").some((f) => f.reason.includes("full-suite command")));
});

const withHappyPath = (plan: string, line: string) =>
  plan.replace("**Verification:** npm run fixture-verify", `**Verification:** npm run fixture-verify\n\n${line}`);
const HP = (plan: string) => findingsFor(checkPlan(plan, SPEC_TEXT, alwaysTruePort()).findings, "header-happy-path");

test("header-happy-path: line with label, backticked command, and (~5m) duration is accepted", () => {
  const plan = withHappyPath(VALID_PLAN, "**Happy path:** stack - `script/e2e-stack` (~5m)");
  assert.deepEqual(checkPlan(plan, SPEC_TEXT, alwaysTruePort()).findings, []);
});

test("header-happy-path: line without a duration is accepted", () => {
  const plan = withHappyPath(VALID_PLAN, "**Happy path:** stack - `script/e2e-stack`");
  assert.deepEqual(checkPlan(plan, SPEC_TEXT, alwaysTruePort()).findings, []);
});

test("header-happy-path: line without label, backticks, or a valid duration is malformed", () => {
  for (const line of [
    "**Happy path:** script/e2e-stack",
    "**Happy path:** stack - script/e2e-stack",
    "**Happy path:** `script/e2e-stack` (~5m)",
    "**Happy path:** stack - `script/e2e-stack` (~5d)",
    "**Happy path:** stack - `script/e2e-stack` (5m)",
  ]) {
    const findings = HP(withHappyPath(VALID_PLAN, line));
    assert.equal(findings.length, 1, line);
    assert.ok(findings[0].reason.includes("malformed **Happy path:** line"), line);
  }
});

test("header-happy-path: line after the --- separator is ignored", () => {
  const plan = VALID_PLAN.replace("\n---\n", "\n---\n\n**Happy path:** stack - `script/e2e-stack`\n");
  assert.deepEqual(HP(plan), []);
});

test("tests-block: Tests: bullet equal to the happy-path command is a full-suite command", () => {
  const plan = withHappyPath(VALID_PLAN, "**Happy path:** stack - `script/e2e-stack` (~5m)").replace(
    "**Tests:**\n- `node --test extensions/lib/fixture-task2.test.ts`",
    "**Tests:**\n- `script/e2e-stack`",
  );
  const tb = findingsFor(checkPlan(plan, SPEC_TEXT, alwaysTruePort()).findings, "tests-block");
  assert.ok(tb.some((f) => f.reason.includes("full-suite command")), JSON.stringify(tb));
});

test("header-entrypoint: Run: payload and free text repeating the happy-path command fail", () => {
  const base = withHappyPath(VALID_PLAN, "**Happy path:** stack - `script/e2e-stack` (~5m)");
  const run = base.replace("This task handles naming details.", "Run: `script/e2e-stack`");
  assert.ok(HE(run).some((f) => f.text.includes("Run: `script/e2e-stack`")));
  const prose = base.replace("This task handles naming details.", "Then run script/e2e-stack to confirm.");
  assert.ok(HE(prose).some((f) => f.text.includes("script/e2e-stack")));
});

test("table-closure: owner cell 'Happy path' is malformed under the existing reason", () => {
  const row = '| § "Acceptance" L16 | full suite passes | Happy path |';
  const plan = withHappyPath(withRow(VALID_PLAN, row), "**Happy path:** stack - `script/e2e-stack` (~5m)");
  const tc = findingsFor(checkPlan(plan, SPEC_TEXT, alwaysTruePort()).findings, "table-closure");
  assert.ok(tc.some((f) => f.reason === "owner cell is not a 'Task <n>' list, 'Verification', or 'waived: <reason>'" && f.text === row));
});

test("wave-file-disjointness: Test/Test allowed; Test vs Modify conflict; Modify/Modify conflict", () => {
  const shared = "- Test: extensions/lib/fixture-shared.test.ts\n";
  const testTest = VALID_PLAN.replace("- Test: extensions/lib/fixture-task1.test.ts\n", shared).replace("- Test: extensions/lib/fixture-task2.test.ts\n", shared)
    .replace("- `node --test extensions/lib/fixture-task1.test.ts`", "- `node --test extensions/lib/fixture-shared.test.ts`")
    .replace("- `node --test extensions/lib/fixture-task2.test.ts`", "- `node --test extensions/lib/fixture-shared.test.ts`");
  assert.deepEqual(WD(testTest), []);
  const testModify = VALID_PLAN.replace("- Test: extensions/lib/fixture-task2.test.ts\n", "- Test: extensions/lib/fixture-shared.ts\n")
    .replace("- `node --test extensions/lib/fixture-task2.test.ts`", "- `node --test extensions/lib/fixture-shared.ts`");
  assert.ok(WD(testModify).some((f) => f.reason.includes("fixture-shared.ts")));
  const modifyModify = VALID_PLAN.replace("- Modify: extensions/lib/fixture-other.ts", "- Modify: extensions/lib/fixture-shared.ts");
  assert.ok(WD(modifyModify).some((f) => f.reason.includes("fixture-shared.ts")));
});

test("Verification quote-integrity: task-owned literal check unchanged", () => {
  const mutated = VALID_PLAN.replace(
    "- via: `helperFn()`\n\nThis task implements helperFn() for parsing.",
    "- via: `parserSeam()`\n\nThis task implements the helper.",
  );
  const qi = findingsFor(checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings, "quote-integrity");
  assert.ok(qi.some((f) => f.reason.includes("Task 1 body does not contain the required verbatim literal `helperFn()`")));
});

const ENTRYPOINT_SPEC = [
  "# Fixture Spec", // 1
  "", // 2
  "## Testing", // 3
  "Run `node --test extensions/lib/plan-check.test.ts`; the full suite is `npm run verify-all`.", // 4
].join("\n");

const ENTRYPOINT_PLAN = `# Fixture Plan

**Spec:** \`doc/specs/fixture-spec.md\`

**Verification:** \`npm run verify-all\`

---

## Wave 1 — Solo

### Task 1: Scoped test

**Spec:** doc/specs/fixture-spec.md § "Testing" L4

**Files:**
- Modify: extensions/lib/fixture-task1.ts
- Test: extensions/lib/plan-check.test.ts

**Tests:**
- \`node --test extensions/lib/plan-check.test.ts\`
- baseline: abc1234 pass

Run node --test extensions/lib/plan-check.test.ts and confirm green.

## Spec coverage

| anchor | requirement | owner |
|---|---|---|
| § "Testing" L4 | scoped test run | Task 1 |
`;

test("quote-integrity: header entrypoint literal on an anchored line is satisfied by the header, not the task body", () => {
  const findings = checkPlan(ENTRYPOINT_PLAN, ENTRYPOINT_SPEC, alwaysTruePort()).findings;
  assert.deepEqual(findingsFor(findings, "quote-integrity"), []);
  assert.deepEqual(findingsFor(findings, "header-entrypoint"), []);
});

test("quote-integrity: scoped command on the same anchored line is still required in the task body", () => {
  const mutated = ENTRYPOINT_PLAN.replace(
    "- Test: extensions/lib/plan-check.test.ts\n\n**Tests:**\n- `node --test extensions/lib/plan-check.test.ts`\n- baseline: abc1234 pass\n\nRun node --test extensions/lib/plan-check.test.ts and confirm green.",
    "- Test: extensions/lib/other.test.ts\n\n**Tests:**\n- `node --test extensions/lib/other.test.ts`\n\nRun the scoped test and confirm green.",
  );
  const qi = findingsFor(checkPlan(mutated, ENTRYPOINT_SPEC, alwaysTruePort()).findings, "quote-integrity");
  assert.equal(qi.length, 1);
  assert.ok(qi[0].reason.includes("Task 1 body does not contain the required verbatim literal `node --test extensions/lib/plan-check.test.ts`"));
});

test("placeholder-scan: header entrypoint is not a required literal for the task (parity with quote-integrity)", () => {
  const findings = checkPlan(ENTRYPOINT_PLAN, ENTRYPOINT_SPEC, alwaysTruePort()).findings;
  assert.deepEqual(findingsFor(findings, "placeholder-scan"), []);
  assert.deepEqual(findings, []);
});

test("check 3 anchor-resolution: ambiguous heading match (duplicate spec heading)", () => {
  const dupSpec = SPEC_TEXT.replace('## Testing', '## Design\n\nduplicate section body.\n\n## Testing');
  const findings = checkPlan(VALID_PLAN, dupSpec, alwaysTruePort()).findings;
  const ar = findingsFor(findings, "anchor-resolution");
  assert.ok(
    ar.some((f) => f.reason.includes("ambiguous") && f.reason.includes('"Design"')),
    `expected an ambiguous-heading finding, got: ${JSON.stringify(ar)}`,
  );
  assert.ok(
    ar.some(
      (f) =>
        f.reason.includes("ambiguous") &&
        f.line === lineOf(VALID_PLAN, '**Spec:** doc/specs/fixture-spec.md § "Design" L4-L6'),
    ),
    `expected an ambiguous-heading finding whose line points at Task 1's **Spec:** anchor line, got: ${JSON.stringify(ar)}`,
  );
});

test("check 3 fail-closed: unparseable **Spec:** anchor line", () => {
  const mutated = VALID_PLAN.replace(
    '**Spec:** doc/specs/fixture-spec.md § "Design" L4-L6',
    "**Spec:** doc/specs/fixture-spec.md § Design without quotes or line numbers",
  );
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  const ar = findingsFor(findings, "anchor-resolution");
  assert.equal(ar.length, 1);
  assert.match(ar[0].reason, /unparseable/);
  assert.equal(ar[0].line, lineOf(mutated, "**Spec:** doc/specs/fixture-spec.md § Design without quotes"));
});

test("check 4 paths-exist: Modify: literal path does not exist", () => {
  const port: FsPort = {
    exists: (p) => p !== "extensions/lib/fixture-shared.ts",
    glob: () => [],
  };
  const findings = checkPlan(VALID_PLAN, SPEC_TEXT, port).findings;
  const pe = findingsFor(findings, "paths-exist");
  assert.ok(
    pe.some((f) => f.reason.includes("fixture-shared.ts") && f.reason.includes("does not exist")),
    `expected a paths-exist finding, got: ${JSON.stringify(pe)}`,
  );
  assert.ok(
    pe.some((f) => f.line === lineOf(VALID_PLAN, "- Modify: extensions/lib/fixture-shared.ts")),
    `expected the paths-exist finding's line to point at the offending Modify: entry, got: ${JSON.stringify(pe)}`,
  );
});

test("check 4 paths-exist: backtick-wrapped Modify: path is stripped before the existence check", () => {
  const mutated = VALID_PLAN.replace(
    "- Modify: extensions/lib/fixture-shared.ts",
    "- Modify: `extensions/lib/fixture-shared.ts`",
  );
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  assert.deepEqual(findingsFor(findings, "paths-exist"), []);
});

test("check 4 fail-closed: invalid glob (port throws)", () => {
  const mutated = VALID_PLAN.replace(
    "- Modify: extensions/lib/fixture-shared.ts",
    "- Modify: extensions/lib/fixture-*.ts",
  );
  const port: FsPort = {
    exists: () => true,
    glob: () => {
      throw new Error("bad pattern");
    },
  };
  const findings = checkPlan(mutated, SPEC_TEXT, port).findings;
  const pe = findingsFor(findings, "paths-exist");
  assert.ok(
    pe.some((f) => f.reason.includes("invalid") && f.reason.includes("bad pattern")),
    `expected an invalid-glob finding, got: ${JSON.stringify(pe)}`,
  );
  assert.ok(
    pe.some(
      (f) =>
        f.reason.includes("invalid") &&
        f.line === lineOf(mutated, "- Modify: extensions/lib/fixture-*.ts"),
    ),
    `expected the invalid-glob finding's line to point at the offending Modify: entry, got: ${JSON.stringify(pe)}`,
  );
});

test("check 4 fail-closed: task missing **Files:** block", () => {
  const mutated = VALID_PLAN.replace(
    "**Files:**\n- Modify: extensions/lib/fixture-task3.ts\n- Test: extensions/lib/fixture-task3.test.ts\n\n**Tests:**\n- `node --test extensions/lib/fixture-task3.test.ts`\n- baseline: abc1234 pass\n\n",
    "",
  );
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  const pe = findingsFor(findings, "paths-exist");
  assert.ok(
    pe.some((f) => f.reason.includes("missing a **Files:** block") && f.text.includes("Task 3")),
    `expected a missing-Files-block finding, got: ${JSON.stringify(pe)}`,
  );
  assert.ok(
    pe.some(
      (f) =>
        f.reason.includes("missing a **Files:** block") &&
        f.line === lineOf(mutated, "### Task 3: Document banned token handling"),
    ),
    `expected the missing-Files-block finding's line to point at Task 3's header, got: ${JSON.stringify(pe)}`,
  );
});

test("check 5 placeholder-scan: banned token flagged outside a required-literal span", () => {
  const mutated = VALID_PLAN.replace(
    "This task handles naming details.",
    "This task handles naming details. TODO clean this up.",
  );
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  const ps = findingsFor(findings, "placeholder-scan");
  assert.ok(
    ps.some((f) => f.reason.includes('"TODO"') && f.line === lineOf(mutated, "TODO clean this up")),
    `expected a placeholder-scan finding for the unexempted TODO, got: ${JSON.stringify(ps)}`,
  );
});

test("check 6 wave-file-disjointness: two tasks in the same wave declare the same file", () => {
  const mutated = VALID_PLAN.replace(
    "- Modify: extensions/lib/fixture-other.ts",
    "- Modify: extensions/lib/fixture-shared.ts",
  );
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  const wfd = findingsFor(findings, "wave-file-disjointness");
  assert.ok(
    wfd.some((f) => f.reason.includes("Task 1") && f.reason.includes("Task 2") && f.reason.includes("fixture-shared.ts")),
    `expected a wave-file-disjointness finding, got: ${JSON.stringify(wfd)}`,
  );
  assert.ok(
    wfd.some((f) => f.line === lineOf(mutated, "## Wave 1 — Two parallel tasks")),
    `expected the wave-file-disjointness finding's line to point at the offending wave header, got: ${JSON.stringify(wfd)}`,
  );
});

test("every-wave-singleton plan without Solo: lines passes; legacy Solo: lines are accepted silently", () => {
  const plan = VALID_PLAN.replace(
    "### Task 2: Implement naming",
    "## Wave 2 - Naming\n\n### Task 2: Implement naming",
  ).replace("## Wave 2 — Solo task", "## Wave 3 - Documentation");
  assert.deepEqual(checkPlan(plan, SPEC_TEXT, alwaysTruePort()).findings, []);
  const legacy = plan.replace("## Wave 2 - Naming", "## Wave 2 - Naming\n\nSolo: Task 2 depends on Wave 1");
  assert.deepEqual(checkPlan(legacy, SPEC_TEXT, alwaysTruePort()).findings, []);
});

test("check 8 header-entrypoint: verification entrypoint string reused outside the header", () => {
  const mutated = VALID_PLAN.replace(
    "This task handles naming details.",
    "This task handles naming details. Run `npm run fixture-verify` here too.",
  );
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  const he = findingsFor(findings, "header-entrypoint");
  assert.ok(
    he.some((f) => f.line === lineOf(mutated, "Run `npm run fixture-verify` here too")),
    `expected a header-entrypoint finding, got: ${JSON.stringify(he)}`,
  );
});

test("check 8 header-entrypoint: entrypoint text inside the '## Spec coverage' table is out of scope (not a wave/task body)", () => {
  const mutated = VALID_PLAN.replace(
    "parser grammar basics",
    "parser grammar basics npm run fixture-verify",
  );
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  assert.deepEqual(findingsFor(findings, "header-entrypoint"), []);
});

const EXEMPTION_SPEC_TEXT = [
  "# Exemption Spec", // 1
  "", // 2
  "## Notes", // 3
  "This mentions `TODO` as a banned placeholder example.", // 4
].join("\n");

const EXEMPTION_PLAN = `# Exemption Plan

**Spec:** \`doc/specs/exemption-spec.md\`

**Verification:** npm run exemption-verify

---

## Wave 1 — Solo task

### Task 1: Document banned token handling

**Spec:** doc/specs/exemption-spec.md § "Notes" L4

**Files:**
- Create: extensions/lib/exemption-task1.ts
- Test: extensions/lib/exemption-task1.test.ts

**Tests:**
- \`node --test extensions/lib/exemption-task1.test.ts\`
- baseline: abc1234 pass

The literal TODO is intentionally documented here per spec quote-integrity requirement.

## Spec coverage

| anchor | requirement | owner |
|---|---|---|
| § "Notes" L4-L4 | banned token literal handling | Task 1 |
`;

test("check 2/5 exemption: task body carrying the required verbatim TODO literal satisfies quote-integrity and exempts placeholder-scan", () => {
  const findings = checkPlan(EXEMPTION_PLAN, EXEMPTION_SPEC_TEXT, alwaysTruePort()).findings;
  assert.deepEqual(findings, []);
});

test("check 2/5 exemption negative: without the task body carrying the literal, quote-integrity fails and an unexempted TODO elsewhere trips placeholder-scan", () => {
  const mutated = EXEMPTION_PLAN.replace("## Wave 1 — Solo task", "## Wave 1 — TODO task").replace(
    "The literal TODO is intentionally documented here per spec quote-integrity requirement.",
    "This task implements the handling here.",
  );
  const findings = checkPlan(mutated, EXEMPTION_SPEC_TEXT, alwaysTruePort()).findings;
  const qi = findingsFor(findings, "quote-integrity");
  const ps = findingsFor(findings, "placeholder-scan");
  assert.ok(
    qi.some((f) => f.reason.includes("TODO") && f.reason.includes("Task 1")),
    `expected a quote-integrity finding for the missing literal, got: ${JSON.stringify(qi)}`,
  );
  assert.ok(
    qi.some(
      (f) =>
        f.reason.includes("TODO") &&
        f.line === lineOf(mutated, '| § "Notes" L4-L4 | banned token literal handling | Task 1 |'),
    ),
    `expected the quote-integrity finding's line to point at the offending Spec coverage row, got: ${JSON.stringify(qi)}`,
  );
  assert.ok(
    ps.some((f) => f.reason.includes('"TODO"') && f.line === lineOf(mutated, "## Wave 1 — TODO task")),
    `expected an unexempted placeholder-scan finding on the wave header, got: ${JSON.stringify(ps)}`,
  );
});

test("aggregate: independent mutations across two checks are all reported together", () => {
  let mutated = VALID_PLAN;
  mutated = mutated.replace(
    "- via: `helperFn()`\n\nThis task implements helperFn() for parsing.",
    "- via: `parserSeam()`\n\nThis task implements the helper for parsing.",
  );
  mutated = mutated.replace(
    "- Modify: extensions/lib/fixture-other.ts",
    "- Modify: extensions/lib/fixture-shared.ts",
  );
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort()).findings;
  assert.ok(findingsFor(findings, "quote-integrity").length > 0, "expected a quote-integrity finding");
  assert.ok(findingsFor(findings, "wave-file-disjointness").length > 0, "expected a wave-file-disjointness finding");
});

test("grammarless plan: absent-structure findings do not short-circuit the catalog (placeholder-scan still runs)", () => {
  const grammarless = "# Not a plan\n\nJust some prose with a TODO in it.\n";
  const findings = checkPlan(grammarless, SPEC_TEXT, alwaysTruePort()).findings;
  const input = findingsFor(findings, "input");
  assert.ok(
    input.some((f) => f.reason.includes("no wave headers found")),
    `expected an absent-wave-structure finding, got: ${JSON.stringify(input)}`,
  );
  assert.ok(
    input.some((f) => f.reason.includes("no task headers found")),
    `expected an absent-task-structure finding, got: ${JSON.stringify(input)}`,
  );
  const ps = findingsFor(findings, "placeholder-scan");
  assert.ok(
    ps.some((f) => f.reason.includes('"TODO"')),
    `expected placeholder-scan to still run over a grammarless plan, got: ${JSON.stringify(ps)}`,
  );
});

test("fail-closed: checkPlan never throws on an empty string", () => {
  assert.doesNotThrow(() => checkPlan("", SPEC_TEXT, alwaysTruePort()).findings);
});

test("fail-closed: checkPlan never throws on a non-markdown garbage blob", () => {
  const garbage = "\u0000\u0001binary\ngarbage\tstuff \u{1F4A9} \"\"\"\n```unterminated fence";
  assert.doesNotThrow(() => checkPlan(garbage, SPEC_TEXT, alwaysTruePort()).findings);
});

test("sha256 is deterministic and content-sensitive", () => {
  const a = sha256(new TextEncoder().encode("hello"));
  const b = sha256(new TextEncoder().encode("hello"));
  const c = sha256(new TextEncoder().encode("hello!"));
  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.equal(a, "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
});

test("sha256 returns lowercase hex of the expected length", () => {
  const digest = sha256(new TextEncoder().encode(""));
  assert.equal(digest.length, 64);
  assert.match(digest, /^[0-9a-f]+$/);
});

const T2_TESTS = "**Tests:**\n- `node --test extensions/lib/fixture-task2.test.ts`\n";
const T2_FILES_TEST = "- Test: extensions/lib/fixture-task2.test.ts\n";

function tb(plan: string, spec = SPEC_TEXT, fs: FsPort = alwaysTruePort()): PlanCheckFinding[] {
  return findingsFor(checkPlan(plan, spec, fs).findings, "tests-block");
}

test("tests-block: block missing when a task has no **Tests:**", () => {
  const mutated = VALID_PLAN.replace(T2_TESTS, "");
  assert.ok(tb(mutated).some((f) => f.reason.includes("block missing") && f.reason.includes("Task 2")));
});

test("tests-block: block missing when **Files:** is absent", () => {
  const mutated = VALID_PLAN.replace(
    "**Files:**\n- Create: extensions/lib/fixture-task2.ts\n- Modify: extensions/lib/fixture-other.ts\n" + T2_FILES_TEST + "\n" + T2_TESTS,
    "",
  );
  const f = tb(mutated);
  assert.ok(f.some((x) => x.reason.includes("block missing") && x.reason.includes("Task 2")));
});

test("tests-block: misplaced block (before Files:) fires without block missing", () => {
  const mutated = VALID_PLAN.replace(
    "**Files:**\n- Create: extensions/lib/fixture-task2.ts",
    T2_TESTS + "\n**Files:**\n- Create: extensions/lib/fixture-task2.ts",
  ).replace("\n" + T2_TESTS + "\nThis task handles naming details.", "\nThis task handles naming details.");
  const f = tb(mutated);
  assert.ok(f.some((x) => x.reason.includes("misplaced")));
  assert.ok(!f.some((x) => x.reason.includes("block missing")));
});

test("tests-block: duplicated **Tests:** heading is misplaced", () => {
  const mutated = VALID_PLAN.replace("This task handles naming details.", T2_TESTS + "\nThis task handles naming details.");
  assert.ok(tb(mutated).some((x) => x.reason.includes("misplaced")));
});

test("tests-block: text after the heading is misplaced, not missing", () => {
  const mutated = VALID_PLAN.replace("**Tests:**\n- `node --test extensions/lib/fixture-task2.test.ts`", "**Tests:** see below\n- `node --test extensions/lib/fixture-task2.test.ts`");
  const f = tb(mutated);
  assert.ok(f.some((x) => x.reason.includes("misplaced")));
  assert.ok(!f.some((x) => x.reason.includes("block missing")));
});

test("tests-block: a Delete: bullet before **Tests:** is legal", () => {
  const mutated = VALID_PLAN.replace(T2_FILES_TEST, T2_FILES_TEST + "- Delete: extensions/lib/fixture-legacy.ts\n");
  assert.deepEqual(tb(mutated), []);
});

test("tests-block: block empty (via: alone)", () => {
  const mutated = VALID_PLAN.replace(T2_TESTS, "**Tests:**\n- via: `naming()`\n");
  assert.ok(tb(mutated).some((x) => x.reason.includes("block empty")));
});

test("tests-block: malformed bullet after a valid one; block continues; a - [ ] step terminates", () => {
  const mutated = VALID_PLAN.replace(
    T2_TESTS,
    T2_TESTS + "- node --test x\n- via: `naming()`\n- [ ] **Step 1: nothing**\n",
  );
  const f = tb(mutated);
  assert.equal(f.filter((x) => x.reason.includes("malformed")).length, 1);
  assert.ok(!f.some((x) => x.reason.includes("block empty")));
});

test("tests-block: none: with a command, none: with via:, two none: -> contradictory", () => {
  for (const block of [
    "**Tests:**\n- none: docs\n- `node --test extensions/lib/fixture-task2.test.ts`\n",
    "**Tests:**\n- none: docs\n- via: `naming()`\n",
    "**Tests:**\n- none: docs\n- none: config\n",
  ]) {
    const mutated = VALID_PLAN.replace(T2_TESTS, block);
    assert.ok(tb(mutated).some((x) => x.reason.includes("contradictory")), block);
  }
});

test("tests-block: none: while a Test: path is declared -> unused Test: path", () => {
  const mutated = VALID_PLAN.replace(T2_TESTS, "**Tests:**\n- none: docs\n");
  assert.ok(tb(mutated).some((x) => x.reason.includes("unused `Test:` path")));
});

test("tests-block: none: docs, config with no Test: path is valid", () => {
  const mutated = VALID_PLAN.replace(T2_FILES_TEST, "").replace(T2_TESTS, "**Tests:**\n- none: docs, config\n");
  assert.deepEqual(tb(mutated), []);
});

test("tests-block: via: with commands passes", () => {
  const mutated = VALID_PLAN.replace(T2_TESTS, T2_TESTS + "- via: `naming()` - the seam\n");
  assert.deepEqual(tb(mutated), []);
});

test("tests-block: unknown Test: path unless it exists or another task Create:s it", () => {
  const fs: FsPort = { exists: () => false, glob: () => [] };
  assert.ok(tb(VALID_PLAN, SPEC_TEXT, fs).some((x) => x.reason.includes("unknown `Test:` path")));
  const created = VALID_PLAN.replace(
    "- Create: extensions/lib/fixture-task1.ts",
    "- Create: extensions/lib/fixture-task1.ts\n- Create: extensions/lib/fixture-task1.test.ts\n- Create: extensions/lib/fixture-task2.test.ts\n- Create: extensions/lib/fixture-task3.test.ts",
  );
  assert.deepEqual(tb(created, SPEC_TEXT, fs), []);
});

test("tests-block: segment without a Test: token is not anchored", () => {
  const mutated = VALID_PLAN.replace(T2_TESTS, "**Tests:**\n- `node --test extensions/lib/fixture-task2.test.ts && echo done`\n");
  assert.ok(tb(mutated).some((x) => x.reason.includes("not anchored")));
});

test("tests-block: pipe segment equal to a header segment; tee log has no anchor", () => {
  const mutated = VALID_PLAN.replace("**Verification:** npm run fixture-verify", "**Verification:** npm test")
    .replace(T2_FILES_TEST, "- Test: x.test.ts\n")
    .replace(T2_TESTS, "**Tests:**\n- `npm test | tee log && node --test x.test.ts`\n");
  const f = tb(mutated);
  assert.ok(f.some((x) => x.reason.includes("full-suite command") && x.reason.includes("npm test")));
  assert.ok(f.some((x) => x.reason.includes("not anchored") && x.reason.includes("tee log")));
});

test("tests-block: broadening selectors tests/ and tests/*.py fail; Test: value tests/ never anchors", () => {
  const dir = VALID_PLAN.replace(T2_TESTS, "**Tests:**\n- `node --test extensions/lib/fixture-task2.test.ts tests/`\n");
  assert.ok(tb(dir).some((x) => x.reason.includes("broadening")));
  const glob = VALID_PLAN.replace(T2_TESTS, "**Tests:**\n- `node --test extensions/lib/fixture-task2.test.ts tests/*.py`\n");
  assert.ok(tb(glob).some((x) => x.reason.includes("broadening")));
  const dirAnchor = VALID_PLAN.replace(T2_FILES_TEST, "- Test: tests/\n").replace(
    T2_TESTS,
    "**Tests:**\n- `node --test tests/`\n",
  );
  assert.ok(tb(dirAnchor).some((x) => x.reason.includes("not anchored")));
});

test("tests-block: unsupported shell (cd, sh -c, bash -c, eval, $( )", () => {
  for (const cmd of [
    "cd pkg && pytest tests/a.py",
    "sh -c 'node --test extensions/lib/fixture-task2.test.ts'",
    "bash -c 'node --test extensions/lib/fixture-task2.test.ts'",
    "eval node --test extensions/lib/fixture-task2.test.ts",
    "node --test $(echo extensions/lib/fixture-task2.test.ts)",
  ]) {
    const mutated = VALID_PLAN.replace(T2_TESTS, "**Tests:**\n- `" + cmd + "`\n");
    assert.ok(tb(mutated).some((x) => x.reason.includes("unsupported shell")), cmd);
  }
});

test("tests-block: segment equal to a header segment (bare, &&, comma-listed, trailing prose, a && b)", () => {
  for (const header of [
    "**Verification:** npm test",
    "**Verification:** `npm test`",
    "**Verification:** npm test && npm run lint",
    "**Verification:** `npm test`, `npm run lint`",
    "**Verification:** `npm test` (bundles lint)",
  ]) {
    const mutated = VALID_PLAN.replace("**Verification:** npm run fixture-verify", header).replace(
      T2_TESTS,
      "**Tests:**\n- `npm run lint`\n- `npm test`\n",
    );
    const f = tb(mutated);
    assert.ok(f.some((x) => x.reason.includes("full-suite command") && x.text === "- `npm test`"), header);
    if (header.includes("npm run lint")) assert.ok(f.some((x) => x.reason.includes("full-suite command") && x.text.includes("lint")), header);
  }
  const ab = VALID_PLAN.replace("**Verification:** npm run fixture-verify", "**Verification:** a && b").replace(T2_TESTS, "**Tests:**\n- `b`\n");
  assert.ok(tb(ab).some((x) => x.reason.includes("full-suite command")));
});

test("tests-block: npm test -- x.test.ts passes under header npm test (bare and backticked); the header segment npm test alone fails", () => {
  for (const header of ["**Verification:** npm test", "**Verification:** `npm test`"]) {
    const ok = VALID_PLAN.replace("**Verification:** npm run fixture-verify", header)
      .replace(T2_FILES_TEST, "- Test: x.test.ts\n")
      .replace(T2_TESTS, "**Tests:**\n- `npm test -- x.test.ts`\n");
    assert.deepEqual(tb(ok, SPEC_TEXT, alwaysTruePort()), [], header);
  }
});

test("tests-block: header segment that is itself scoped is still rejected as a bullet", () => {
  const mutated = VALID_PLAN.replace("**Verification:** npm run fixture-verify", "**Verification:** node --test x.test.ts && npm run lint")
    .replace(T2_FILES_TEST, "- Test: x.test.ts\n")
    .replace(T2_TESTS, "**Tests:**\n- `node --test x.test.ts`\n");
  assert.ok(tb(mutated).some((x) => x.reason.includes("full-suite command")));
});

test("tests-block: passing forms - multi-path, ::filter -v, -k name, -- passthrough, line-suffixed Test:", () => {
  const multi = VALID_PLAN.replace(T2_TESTS, "**Tests:**\n- `node --test extensions/lib/fixture-task2.test.ts extensions/lib/fixture-task1.test.ts`\n")
    .replace(T2_FILES_TEST, T2_FILES_TEST + "- Test: extensions/lib/fixture-task1.test.ts\n");
  assert.deepEqual(tb(multi), []);
  const filt = VALID_PLAN.replace(T2_FILES_TEST, "- Test: tests/a.py\n").replace(T2_TESTS, "**Tests:**\n- `pytest tests/a.py::test_x -v -k name --filter x`\n");
  assert.deepEqual(tb(filt), []);
  const passthrough = VALID_PLAN.replace(T2_TESTS, "**Tests:**\n- `npm run fixture-verify -- extensions/lib/fixture-task2.test.ts`\n");
  assert.deepEqual(tb(passthrough), []);
  const suffixed = VALID_PLAN.replace(T2_FILES_TEST, "- Test: extensions/lib/fixture-task2.test.ts:10-20\n");
  assert.deepEqual(tb(suffixed), []);
});

test("tests-block: no path normalization - ./x and x differ, as in Files:", () => {
  const mutated = VALID_PLAN.replace(T2_FILES_TEST, "- Test: ./extensions/lib/fixture-task2.test.ts\n");
  assert.ok(tb(mutated).some((x) => x.reason.includes("not anchored")));
});

const BASELINE = "- baseline: abc1234 pass";
const localBaseline = (plan: string) => plan.replace("---", "**Baseline policy:** implement-local\n---");
const T1_COMMAND = "node --test extensions/lib/fixture-task1.test.ts";
const T1_PATH = "extensions/lib/fixture-task1.test.ts";
const baselineFindings = (plan: string) => findingsFor(checkPlan(plan, SPEC_TEXT, alwaysTruePort()).findings, "baseline-line");

for (const [name, evidence] of [
  ["pass", BASELINE],
  ["pass artifacts", BASELINE + " - artifacts: coverage.json, report.txt"],
  ["via", BASELINE + " via `" + T1_COMMAND + "`"],
  ["via artifacts", BASELINE + " via `" + T1_COMMAND + "` - artifacts: coverage.json"],
] ) {
  test(`baseline-line accepts ${name}`, () => {
    assert.deepEqual(baselineFindings(VALID_PLAN.replace(BASELINE, evidence)), []);
  });
}

for (const [name, evidence, reason] of [
  ["missing", "", `Task 1: command \`${T1_COMMAND}\` has no baseline: bullet`],
  ["bad sha", "- baseline: ABC1234 pass", "Task 1: baseline: bullet malformed:"],
  ["short sha", "- baseline: abc123 pass", "Task 1: baseline: bullet malformed:"],
  ["long sha", "- baseline: " + "a".repeat(41) + " pass", "Task 1: baseline: bullet malformed:"],
  ["bad result", "- baseline: abc1234 fail", "Task 1: baseline: bullet malformed:"],
  ["empty base command", BASELINE + " via `   `", "Task 1: baseline: bullet malformed:"],
  ["separator-only base command", BASELINE + " via ` ; `", "Task 1: baseline: bullet malformed:"],
  ["misplaced", "- via: seam\n" + BASELINE, "Task 1: baseline: not directly after its command"],
  ["duplicate", BASELINE + "\n" + BASELINE, "Task 1: baseline: not directly after its command"],
  ["sha mismatch", "- baseline: def5678 pass", "baseline SHAs differ: def5678, abc1234"],
  ["skip existing", `- baseline: abc1234 skipped - ${T1_PATH} created by this task`, `Task 1: baseline: skipped but \`${T1_PATH}\` is not a Create: path`],
  ["via unanchored", BASELINE + " via `echo hi`", `Task 1: baseline: pass via \`echo hi\` segment \`echo hi\` anchors no existing Test: path`],
  ["via unanchored compound", BASELINE + " via `" + T1_COMMAND + " && echo hi`", "anchors no existing Test: path"],
]) {
  test(`baseline-line rejects ${name}`, () => {
    if (name !== "sha mismatch") assert.ok(baselineFindings(localBaseline(VALID_PLAN.replace(BASELINE, evidence))).some(f => f.reason.includes(reason)));
    const findings = baselineFindings(VALID_PLAN.replace(BASELINE, evidence));
    assert.ok(findings.some(f => f.reason.includes(reason)), JSON.stringify(findings));
  });
}

test("implement-local baseline retains mixed historical evidence without changing ordinary checks", () => {
  const plan = VALID_PLAN.replace(BASELINE, "- baseline: def5678 pass via `" + T1_COMMAND + "` - artifacts: scratch.log");
  assert.ok(baselineFindings(plan).length);
  assert.deepEqual(baselineFindings(localBaseline(plan)), []);
  assert.deepEqual(checkPlan(localBaseline(legPlan().replace("def5678 pass", "fed9876 pass")), legPlanSpec, alwaysTruePort()).findings, []);
});
for (const [name, active] of [["fenced-only", false], ["active with fenced example", true]] as const) {
  test(`baseline policy ignores ${name}`, () => {
    const mixed = VALID_PLAN.replace(BASELINE, "- baseline: def5678 pass");
    const plan = active ? localBaseline(mixed) : mixed;
    for (const example of ["```markdown\n**Baseline policy:** implement-local\n```\n", "```markdown\n**Baseline policy:** other\n```\n"]) {
      for (const withExample of [plan.replace("---", example + "---"), plan + "\n" + example]) {
        const findings = baselineFindings(withExample);
        if (active) assert.deepEqual(findings, []);
        else assert.ok(findings.some(f => f.reason.includes("baseline SHAs differ")), JSON.stringify(findings));
      }
    }
  });
}
for (const policy of ["", "other", "implement-local\n**Baseline policy:** implement-local"]) {
  test(`baseline policy rejects ${JSON.stringify(policy)}`, () => {
    assert.ok(baselineFindings(VALID_PLAN.replace("---", `**Baseline policy:** ${policy}\n---`)).length);
  });
}
test("implement-local baseline distinguishes existing-created anchors and retained skips", () => {
  const created = localBaseline(VALID_PLAN.replace("- Test: " + T1_PATH, "- Create: " + T1_PATH + "\n- Test: " + T1_PATH));
  assert.deepEqual(baselineFindings(created.replace(BASELINE, BASELINE + " via `" + T1_COMMAND + "`")), []);
  const skipped = `- baseline: abc1234 skipped - ${T1_PATH} created by this task`;
  assert.ok(baselineFindings(created.replace(BASELINE, skipped)).length);
  const retained = created.replace(BASELINE, skipped).replace("---", `Baseline provenance: retained home | ${T1_COMMAND} | ${skipped.slice(12)}\n---`);
  assert.deepEqual(baselineFindings(retained), []);
  assert.ok(baselineFindings(retained.replace("retained home", "retained foreign")).length);
  assert.deepEqual(checkPlan(created.replace(BASELINE, skipped), SPEC_TEXT, { exists: p => p !== T1_PATH, glob: () => [] }).findings.filter(f => f.check === "baseline-line"), []);
});

test("baseline-line accepts 40-character SHAs and introduced-selector base commands", () => {
  assert.deepEqual(baselineFindings(VALID_PLAN.replaceAll("abc1234", "a".repeat(40))), []);
  const plan = VALID_PLAN.replace(`- \`${T1_COMMAND}\``, `- \`${T1_COMMAND}::new_case\``)
    .replace(BASELINE, BASELINE + " via `" + T1_COMMAND + "`");
  assert.deepEqual(baselineFindings(plan), []);
});

test("baseline-line pass via rejects created tokens outside this task's Test paths", () => {
  const plan = VALID_PLAN.replace(BASELINE, BASELINE + " via `" + T1_COMMAND + " extensions/lib/fixture-task2.ts`");
  assert.ok(baselineFindings(plan).some(f => f.reason.includes("anchors Create: path extensions/lib/fixture-task2.ts")));
});

test("baseline-line validates skipped anchor sets and derived surviving segments", () => {
  const created = VALID_PLAN.replace("- Create: extensions/lib/fixture-task1.ts", `- Create: ${T1_PATH}`);
  const skipped = `- baseline: abc1234 skipped - ${T1_PATH} created by this task`;
  assert.deepEqual(baselineFindings(created.replace(BASELINE, skipped)), []);
  assert.ok(baselineFindings(created.replace(BASELINE, BASELINE + " via `" + T1_COMMAND + "`" )).some(f => f.reason.includes("anchors Create: path " + T1_PATH)));
  for (const list of ["other.test.ts", `${T1_PATH}, other.test.ts`]) {
    assert.ok(baselineFindings(created.replace(BASELINE, `- baseline: abc1234 skipped - ${list} created by this task`)).length);
  }
  const compound = created.replace(`- \`${T1_COMMAND}\``, `- \`${T1_COMMAND} && node --test extensions/lib/fixture-task2.test.ts\``)
    .replace(`- Test: ${T1_PATH}`, `- Test: ${T1_PATH}\n- Test: extensions/lib/fixture-task2.test.ts`);
  assert.deepEqual(baselineFindings(compound.replace(BASELINE, BASELINE + " via `node --test extensions/lib/fixture-task2.test.ts`")), []);
  assert.ok(baselineFindings(compound.replace(BASELINE, skipped)).length);
  const allCreated = compound.replace("- Create: extensions/lib/fixture-task1.ts", "- Create: extensions/lib/fixture-task2.test.ts")
    .replace("- Create: extensions/lib/fixture-task2.ts", "- Create: extensions/lib/fixture-task2.test.ts");
  const bothSkipped = `- baseline: abc1234 skipped - ${T1_PATH}, extensions/lib/fixture-task2.test.ts created by this task`;
  assert.deepEqual(baselineFindings(allCreated.replace(BASELINE, bothSkipped)), []);
  assert.ok(baselineFindings(allCreated.replace(BASELINE, skipped)).length);
  const none = VALID_PLAN.replace(`- \`${T1_COMMAND}\``, "- none: docs");
  assert.ok(baselineFindings(none).some(f => f.reason === "Task 1: baseline: under a none: task"));
});

const FAILURE_ROW = `- Task 1: \`${T1_COMMAND}\` fails on abc1234 (exit 2): assertion failed`;
for (const [name, body, count, malformed] of [
  ["absent", "", 0, false],
  ["sentinel", "- none", 0, false],
  ["failure", FAILURE_ROW, 1, false],
  ["global then failure", "- Baseline: worktree dirty on abc1234: source.ts\n" + FAILURE_ROW, 2, false],
  ["contract", "- Task 1: unresolved caller contract", 1, false],
  ["prose", "Not resolved", 1, true],
  ["table", "| question | owner |", 1, true],
  ["continuations", FAILURE_ROW + "\n  ran: `node --test original.ts`\n  blocked: Task 2 `node --test next.ts`\n  ```text\n  TODO etc.\n  ```", 1, false],
] as const) {
  test(`open-questions ${name}`, () => {
    const plan = VALID_PLAN + (body ? "\n## Open Questions\n\n" + body + "\n" : "");
    const findings = checkPlan(plan, SPEC_TEXT, alwaysTruePort()).findings;
    const questions = findingsFor(findings, "open-questions");
    assert.equal(questions.length, count);
    if (malformed) assert.equal(questions[0].reason, "## Open Questions malformed: expected `- ` rows or `- none`");
    if (body.includes(FAILURE_ROW)) assert.ok(questions.some(f => f.reason === "plan has open questions: " + FAILURE_ROW));
    assert.deepEqual(findingsFor(findings, "placeholder-scan"), []);
  });
}

test("placeholder-scan masks only valid question output, not authored fences or continuations", () => {
  for (const text of ["```\nTODO\n```", "## Open Questions\n  ```\n  TODO\n  ```", "## Open Questions\n- TODO unresolved", "## Open Questions\n" + FAILURE_ROW + "\n  ```\n  TODO", "## Open Questions\n" + FAILURE_ROW + "\n  ```\nTODO\n  ```", "## Open Questions\n" + FAILURE_ROW + "\n  ran: `TODO`", "## Open Questions\n" + FAILURE_ROW + "\n  blocked: TODO"]) {
    assert.ok(findingsFor(checkPlan(VALID_PLAN + "\n" + text, SPEC_TEXT, alwaysTruePort()).findings, "placeholder-scan").length);
  }
});

test("tests-block: fenced **Tests:** lines are ignored", () => {
  const mutated = VALID_PLAN.replace(
    "This task handles naming details.",
    "This task handles naming details.\n\n```markdown\n**Tests:**\n- none: docs\n```",
  );
  assert.deepEqual(tb(mutated), []);
});

const coordinatedSpec = ledgerSpec + `\n## Legs
### Leg: repo-a
branch: feature/run
scope: AC 1, AC 2
### Leg: repo-b
branch: feature/run
scope: AC 1
`;
const coordinatedLedger = () => ledger(["1 | open | 0 |", "2 | open | 0 |", "3 | cut | 0 | deferred: #70", "4 | open | 0 |"])
  .replace("base: abc", "base: abc1234\nbase repo-a: abc1234\nbase repo-b: def5678\nseeded repo-a: no\nseeded repo-b: no\ncap: 20")
  + "\n## Leg mapping\n| row | ac | leg |\n|---|---|---|\n| 1 | 1 | repo-a |\n| 2 | 1 | repo-b |\n| 3 | 2 | repo-a |\n| 4 | 3 | repo-a |\n";
const emptyPort: FsPort = { exists: () => false, glob: () => [] };
test("coordinated ledger expands shared ownership and defaults unlisted ACs home", () => {
  assert.deepEqual(checkPlan(coordinatedLedger(), coordinatedSpec, emptyPort).findings, []);
});
for (const scope of ["", "scope: AC 1\nscope: AC 2", "scope: AC 1, AC 1", "scope: AC 0", "scope: AC -1", "scope: AC 1.5", "scope: AC 4", "scope: 1", "scope: AC 1-2", "scope: AC 1,", "scope: none, AC 1"]) {
  test(`coordinated scope rejects ${JSON.stringify(scope)}`, () => {
    assert.ok(checkPlan(coordinatedLedger(), coordinatedSpec.replace("scope: AC 1, AC 2", scope), emptyPort).findings.some(f => f.check === "leg-scope"));
  });
}
for (const [name, change] of Object.entries({
  missingMapping: (s: string) => s.replace("| 2 | 1 | repo-b |\n", ""),
  duplicateMapping: (s: string) => s + "| 2 | 1 | repo-b |\n",
  wrongOrder: (s: string) => s.replace("| 1 | 1 | repo-a |", "| 1 | 1 | repo-b |"),
  foreignBase: (s: string) => s + "base stranger: abc1234\n",
  missingSeed: (s: string) => s.replace("seeded repo-b: no\n", ""),
  invalidCap: (s: string) => s.replace("cap: 20", "cap: 0"),
  homePending: (s: string) => s + "pending: 1 | repo-a | abc1234\n",
  foreignTarget: (s: string) => s + "pending: 3 | repo-b | abc1234\n",
  duplicatePending: (s: string) => s + "pending: seed | repo-b | abc1234\npending: seed | repo-b | abc1234\n",
})) test(`coordinated ledger rejects ${name}`, () => {
  assert.ok(checkPlan(change(coordinatedLedger()), coordinatedSpec, emptyPort).findings.length);
});
test("coordinated ledger admits partial seeds, recovery tuples and later cap grants", () => {
  for (const target of ["2", "seed"]) assert.deepEqual(checkPlan(coordinatedLedger().replace("seeded repo-a: no", "seeded repo-a: yes").replace("cap: 20", "cap: 99") + `pending: ${target} | REPO-B | abc1234\n`, coordinatedSpec, emptyPort).findings, []);
});

const legPlanSpec = SPEC_TEXT + "\n## Legs\n### Leg: repo-a\nscope: none\n### Leg: repo-b\nscope: none\n";
const legPlan = () => VALID_PLAN.replace("---", "Baseline repo-a: abc1234\nBaseline repo-b: def5678\n---")
  .replace("### Task 2: Implement naming", "## Wave 3 - Companion\n\n### Task 2: Implement naming\nLeg: REPO-B")
  .replace("- baseline: abc1234 pass\n\nThis task handles", "- baseline: def5678 pass\n\nThis task handles");
test("plan accepts distinct leg baselines, case-insensitive membership and absent home Leg", () => {
  const probes: (string | undefined)[] = [];
  assert.deepEqual(checkPlan(legPlan(), legPlanSpec, { exists: (_p, leg) => { probes.push(leg); return true; }, glob: () => [] }).findings, []);
  assert.ok(probes.includes("repo-b"));
  assert.ok(probes.includes("repo-a"));
});
test("wrong-leg baseline and mixed-leg waves fail", () => {
  assert.ok(checkPlan(legPlan().replace("def5678 pass", "abc1234 pass"), legPlanSpec, alwaysTruePort()).findings.some(f => f.check === "baseline-line"));
  assert.ok(checkPlan(legPlan().replace("## Wave 3 - Companion\n\n", ""), legPlanSpec, alwaysTruePort()).findings.some(f => f.check === "wave-leg"));
});
test("implement-local baseline keeps leg declarations and cross-leg ownership mandatory", () => {
  for (const [name, plan] of [
    ["missing", legPlan().replace("Baseline repo-a: abc1234\n", "")],
    ["duplicate", legPlan().replace("Baseline repo-a: abc1234", "Baseline repo-a: abc1234\nBaseline repo-a: abc1234")],
    ["foreign", legPlan().replace("Baseline repo-a: abc1234", "Baseline stranger: abc1234")],
    ["cross-leg create", legPlan().replaceAll("extensions/lib/fixture-task2.test.ts", "extensions/lib/fixture-task1.ts").replace("def5678 pass", "def5678 skipped - extensions/lib/fixture-task1.ts created by this task")],
  ]) assert.ok(checkPlan(localBaseline(plan), legPlanSpec, alwaysTruePort()).findings.some(f => f.check === "baseline-line"), name);
});
test("unknown legs fail before filesystem probing", () => {
  const probes: string[] = [];
  assert.ok(checkPlan(legPlan().replace("Leg: REPO-B", "Leg: stranger"), legPlanSpec, { exists: (p) => { probes.push(p); return true; }, glob: () => [] }).findings.some(f => f.check === "leg-unknown"));
  assert.deepEqual(probes, []);
});
test("cross-leg creates do not supply Test paths or skipped baseline evidence", () => {
  const plan = legPlan().replaceAll("extensions/lib/fixture-task2.test.ts", "extensions/lib/fixture-task1.ts").replace("def5678 pass", "def5678 skipped - extensions/lib/fixture-task1.ts created by this task");
  const findings = checkPlan(plan, legPlanSpec, { exists: p => p !== "extensions/lib/fixture-task1.ts", glob: () => [] }).findings;
  assert.ok(findings.some(f => f.check === "tests-block" && /unknown/.test(f.reason)));
  assert.ok(findings.some(f => f.check === "baseline-line" && /not a Create/.test(f.reason)));
});
test("identical paths across legs do not overlap even in rejected mixed waves", () => {
  const plan = legPlan().replace("## Wave 3 - Companion\n\n", "").replaceAll("fixture-other.ts", "fixture-shared.ts");
  assert.deepEqual(checkPlan(plan, legPlanSpec, alwaysTruePort()).findings.filter(f => f.check === "wave-file-disjointness"), []);
});

for (const [name, change] of Object.entries({
  duplicateBase: (s: string) => s + "base repo-b: def5678\n",
  malformedSha: (s: string) => s.replace("base repo-b: def5678", "base repo-b: not-a-sha"),
  baseMismatch: (s: string) => s.replace("base: abc1234", "base: bbb1234"),
  invalidSeed: (s: string) => s.replace("seeded repo-a: no", "seeded repo-a: maybe"),
  duplicateSeed: (s: string) => s + "seeded repo-b: yes\n",
  negativeIterations: (s: string) => s.replace("iterations: 0", "iterations: -1"),
  unsafeIterations: (s: string) => s.replace("iterations: 0", "iterations: 9007199254740992"),
  fractionalCap: (s: string) => s.replace("cap: 20", "cap: 1.5"),
  unsafeCap: (s: string) => s.replace("cap: 20", "cap: 9007199254740992"),
  malformedPending: (s: string) => s + "pending: 2 | repo-b | not-a-sha\n",
  unknownPending: (s: string) => s + "pending: seed | stranger | abc1234\n",
  nonexistentPending: (s: string) => s + "pending: 99 | repo-b | abc1234\n",
  nonexistentAC: (s: string) => s.replace("| 4 | 3 | repo-a |", "| 4 | 4 | repo-a |"),
  duplicatePair: (s: string) => s.replace("| 2 | 1 | repo-b |", "| 2 | 1 | repo-a |"),
  unknownMapping: (s: string) => s.replace("| 2 | 1 | repo-b |", "| 2 | 1 | stranger |"),
  disposition: (s: string) => s.replace("| 3 | cut | 0 | deferred: #70 |", "| 3 | open | 0 | |"),
})) test(`coordinated metadata rejects ${name}`, () => {
  assert.ok(checkPlan(change(coordinatedLedger()), coordinatedSpec, emptyPort).findings.length);
});
test("scope textual order does not change original AC or member order, and design claims no ownership", () => {
  const spec = coordinatedSpec.replace("scope: AC 1, AC 2", "scope: AC 2, AC 1\ndesign: AC 3 touches lib/other.ts");
  assert.deepEqual(checkPlan(coordinatedLedger().replace("| 4 | open | 0 | |", "| 4 | done | 1 | checked a\\|b |"), spec, emptyPort).findings, []);
});
test("scope none defaults all original ACs home, preserving cut numbering and ignoring nested checks", () => {
  const spec = coordinatedSpec.replace("- [ ] First", "- [ ] First\n  - [ ] Nested").replace("scope: AC 1, AC 2", "scope: none").replace("scope: AC 1\n", "scope: none\n");
  const input = coordinatedLedger().replace("| 2 | open | 0 | |\n", "").replace("| 3 | cut", "| 2 | cut").replace("| 4 | open", "| 3 | open")
    .replace("| 2 | 1 | repo-b |\n", "").replace("| 3 | 2 | repo-a |", "| 2 | 2 | repo-a |").replace("| 4 | 3 | repo-a |", "| 3 | 3 | repo-a |");
  assert.deepEqual(checkPlan(input, spec, emptyPort).findings, []);
});
test("single-member ledger preserves legacy headers and four-column bytes", () => {
  assert.deepEqual(checkPlan(ledger(), ledgerSpec + "\n## Legs\n### Leg: repo-a\n", emptyPort).findings, []);
});
test("leg-local globs and plain Files: resolve at each normalized leg", () => {
  const calls: string[] = [];
  const plan = legPlan().replaceAll("**Files:**", "Files:").replace("Modify: extensions/lib/fixture-other.ts", "Modify: extensions/lib/companion-*.ts");
  assert.deepEqual(checkPlan(plan, legPlanSpec, { exists: () => true, glob: (pattern, leg) => { calls.push(`${leg}:${pattern}`); return ["extensions/lib/companion-one.ts"]; } }).findings, []);
  assert.deepEqual(calls, ["repo-b:extensions/lib/companion-*.ts"]);
});
test("coordinated scope counts only original unfenced top-level AC rows", () => {
  const spec = coordinatedSpec.replace("- [ ] First", "```text\n- [ ] Example, not an AC\n```\n- [ ] First");
  assert.deepEqual(checkPlan(coordinatedLedger(), spec, emptyPort).findings, []);
  assert.ok(checkPlan(coordinatedLedger(), spec.replace("scope: AC 1\n", "scope: AC 4\n"), emptyPort).findings.some(f => f.check === "leg-scope"));
});
test("coordinated ledger rejects duplicate mapping sections", () => {
  const input = coordinatedLedger();
  assert.ok(checkPlan(input + input.slice(input.indexOf("## Leg mapping")), coordinatedSpec, emptyPort).findings.length);
});


test("manifest preserves ordered task data and optional coordination fields", () => {
  const plan = VALID_PLAN.replaceAll("Task 1", "Task 4").replaceAll("Task 2", "Task 9")
    .replace("Implement helper", 'Implement | "helper"')
    .replace("extensions/lib/fixture-shared.ts", 'extensions/lib/"shared".ts:12-14')
    .replace("This task implements", 'Orchestrator: persist the measured value into Task 9\nOrchestrator: ignored second line\nThis task implements')
    .replace("## Wave 1 — Two parallel tasks", "## Wave 1 - Two parallel tasks (in-place)")
    .replace("- via: `helperFn()`", "- via: `helperFn()`\n- `node extensions/lib/fixture-task1.test.ts; node extensions/lib/fixture-task1.test.ts | node extensions/lib/fixture-task1.test.ts`\n- baseline: abc1234 pass");
  const result = checkPlan(plan, SPEC_TEXT, alwaysTruePort());
  assert.deepEqual(result.findings, []);
  assert.equal(result.ledger, false);
  assert.ok(result.parsed);
  const [header, ...lines] = renderManifest(result.parsed, '/repo/plan.md', '/repo/spec.md').split("\n");
  assert.equal(header, 'manifest: /repo/plan.md | spec: /repo/spec.md | tasks: 3 | waves: 2');
  const tasks = lines.map(line => JSON.parse(line));
  assert.deepEqual(Object.keys(tasks[0]), ['task', 'wave', 'mode', 'heading', 'files', 'tests', 'orchestrator']);
  assert.equal(tasks[0].task, 4);
  assert.equal(tasks[0].wave, 1);
  assert.equal(tasks[0].mode, 'in-place');
  assert.equal(tasks[0].heading, 'Implement | "helper"');
  assert.deepEqual(tasks[0].files, [
    { kind: 'Create', path: 'extensions/lib/fixture-task1.ts' },
    { kind: 'Modify', path: 'extensions/lib/"shared".ts:12-14' },
    { kind: 'Test', path: 'extensions/lib/fixture-task1.test.ts' },
  ]);
  assert.deepEqual(tasks[0].tests, ['node --test extensions/lib/fixture-task1.test.ts', 'node extensions/lib/fixture-task1.test.ts; node extensions/lib/fixture-task1.test.ts | node extensions/lib/fixture-task1.test.ts']);
  assert.equal(tasks[0].orchestrator, 'persist the measured value into Task 9');
  assert.equal(tasks[1].task, 9);
  assert.ok(!('orchestrator' in tasks[1]));
  assert.ok(!('leg' in tasks[0]));
  assert.ok(!('mode' in tasks[2]));
});

test("manifest uses normalized legs and omits unmarked prose and no-tests commands", () => {
  const result = checkPlan(legPlan(), legPlanSpec, alwaysTruePort());
  assert.deepEqual(result.findings, []);
  assert.ok(result.parsed);
  const tasks = renderManifest(result.parsed, '/repo/plan.md', '/repo/spec.md').split('\n').slice(1).map(line => JSON.parse(line));
  assert.deepEqual(tasks.map(t => t.leg), ['repo-a', 'repo-b', 'repo-a']);
  const plan = '# Plan\n**Verification:** all-checks\n---\n## Wave 1 - Docs\n### Task 9: Docs\n**Files:**\n- Modify: README.md\n**Tests:**\n- none: docs\nPrimary: persist the value\n## Spec coverage\n| anchor | requirement | owner |\n|---|---|---|\n| - | mechanical: docs | Task 9 |';
  const noTests = checkPlan(plan, '', alwaysTruePort());
  assert.deepEqual(noTests.findings, []);
  assert.ok(noTests.parsed);
  assert.deepEqual(JSON.parse(renderManifest(noTests.parsed, '/p', '/s').split('\n')[1]), { task: 9, wave: 1, heading: 'Docs', files: [{kind: 'Modify', path: 'README.md'}], tests: [] });
  assert.equal(checkPlan(ledger(), ledgerSpec, emptyPort).ledger, true);
});
