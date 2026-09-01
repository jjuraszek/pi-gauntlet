import assert from "node:assert/strict";
import test from "node:test";
import { checkPlan, sha256, type FsPort, type PlanCheckFinding } from "./plan-check.ts";

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

This task implements helperFn() for parsing.

### Task 2: Implement naming

**Spec:** doc/specs/fixture-spec.md § "Design" L4-L4

**Files:**
- Create: extensions/lib/fixture-task2.ts
- Modify: extensions/lib/fixture-other.ts

This task handles naming details.

## Wave 2 — Solo task

Solo: lone remaining task

### Task 3: Document banned token handling

**Spec:** doc/specs/fixture-spec.md § "Testing" L9

**Files:**
- Modify: extensions/lib/fixture-task3.ts

The literal TODO is intentionally documented here per spec quote-integrity requirement.

## Spec coverage

| anchor | requirement | owner |
|---|---|---|
| § "Design" L4-L6 | parser grammar basics | Task 1 |
| § "Design" L4-L4 | helper naming | Task 2 |
| § "Testing" L9-L9 | banned token literal handling | Task 3 |
| - | mechanical: wire test into CI | Task 2 |
| § "Other" L12-L13 | out of scope thing | waived: out of scope per spec |
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
  const findings = checkPlan(VALID_PLAN, SPEC_TEXT, alwaysTruePort());
  assert.deepEqual(findings, []);
});

test("no gauntlet grammar at all: emits both an absent-wave-headers and an absent-task-headers finding", () => {
  const plan = "# Just a plan\n\nSome prose with no wave or task headers at all.\n";
  const findings = checkPlan(plan, SPEC_TEXT, alwaysTruePort());
  const waveFindings = findings.filter((f) => f.reason.includes("wave headers"));
  const taskFindings = findings.filter((f) => f.reason.includes("task headers"));
  assert.equal(waveFindings.length, 1, "expected exactly one absent-wave-headers finding");
  assert.equal(taskFindings.length, 1, "expected exactly one absent-task-headers finding");
});

test("check 1 table-closure: task not covered by any Spec coverage row", () => {
  const mutated = VALID_PLAN.replace('| § "Testing" L9-L9 | banned token literal handling | Task 3 |\n', "");
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort());
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
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort());
  const tc = findingsFor(findings, "table-closure");
  assert.equal(tc.length, 1);
  assert.match(tc[0].reason, /no '## Spec coverage' table found/);
  assert.equal(tc[0].line, 0);
});

test("check 2 quote-integrity: required verbatim literal missing from owner task body", () => {
  const mutated = VALID_PLAN.replace(
    "This task implements helperFn() for parsing.",
    "This task implements the helper for parsing.",
  );
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort());
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
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort());
  const tc = findingsFor(findings, "table-closure");
  assert.ok(
    tc.some(
      (f) =>
        f.reason.includes("owner cell is not a 'Task <n>' list or 'waived: <reason>'") &&
        f.text.includes("Task 1 (see note)"),
    ),
    `expected an owner-cell malformed finding, got: ${JSON.stringify(tc)}`,
  );
  assert.ok(
    tc.some(
      (f) =>
        f.reason.includes("owner cell is not a 'Task <n>' list or 'waived: <reason>'") &&
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
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort());
  const tc = findingsFor(findings, "table-closure");
  assert.ok(
    tc.some((f) => f.reason.includes("owner cell is not a 'Task <n>' list or 'waived: <reason>'")),
    `expected an owner-cell malformed finding for empty waiver reason, got: ${JSON.stringify(tc)}`,
  );
  assert.ok(
    tc.some(
      (f) =>
        f.reason.includes("owner cell is not a 'Task <n>' list or 'waived: <reason>'") &&
        f.line === lineOf(mutated, '| § "Other" L12-L13 | out of scope thing | waived: |'),
    ),
    `expected the owner-cell malformed finding's line to point at the offending row, got: ${JSON.stringify(tc)}`,
  );
});

test("check 3 anchor-resolution: ambiguous heading match (duplicate spec heading)", () => {
  const dupSpec = SPEC_TEXT.replace('## Testing', '## Design\n\nduplicate section body.\n\n## Testing');
  const findings = checkPlan(VALID_PLAN, dupSpec, alwaysTruePort());
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
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort());
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
  const findings = checkPlan(VALID_PLAN, SPEC_TEXT, port);
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
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort());
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
  const findings = checkPlan(mutated, SPEC_TEXT, port);
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
    "**Files:**\n- Modify: extensions/lib/fixture-task3.ts\n\n",
    "",
  );
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort());
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
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort());
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
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort());
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

test("check 7 solo-line: single-task wave missing its Solo: line", () => {
  const mutated = VALID_PLAN.replace("Solo: lone remaining task\n\n", "");
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort());
  const sl = findingsFor(findings, "solo-line");
  assert.equal(sl.length, 1);
  assert.match(sl[0].reason, /missing a 'Solo: <reason>' line/);
  assert.equal(sl[0].line, lineOf(mutated, "## Wave 2 — Solo task"));
});

test("check 8 header-entrypoint: verification entrypoint string reused outside the header", () => {
  const mutated = VALID_PLAN.replace(
    "This task handles naming details.",
    "This task handles naming details. Run `npm run fixture-verify` here too.",
  );
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort());
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
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort());
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

Solo: only task in this wave

### Task 1: Document banned token handling

**Spec:** doc/specs/exemption-spec.md § "Notes" L4

**Files:**
- Create: extensions/lib/exemption-task1.ts

The literal TODO is intentionally documented here per spec quote-integrity requirement.

## Spec coverage

| anchor | requirement | owner |
|---|---|---|
| § "Notes" L4-L4 | banned token literal handling | Task 1 |
`;

test("check 2/5 exemption: task body carrying the required verbatim TODO literal satisfies quote-integrity and exempts placeholder-scan", () => {
  const findings = checkPlan(EXEMPTION_PLAN, EXEMPTION_SPEC_TEXT, alwaysTruePort());
  assert.deepEqual(findings, []);
});

test("check 2/5 exemption negative: without the task body carrying the literal, quote-integrity fails and an unexempted TODO elsewhere trips placeholder-scan", () => {
  const mutated = EXEMPTION_PLAN.replace("## Wave 1 — Solo task", "## Wave 1 — TODO task").replace(
    "The literal TODO is intentionally documented here per spec quote-integrity requirement.",
    "This task implements the handling here.",
  );
  const findings = checkPlan(mutated, EXEMPTION_SPEC_TEXT, alwaysTruePort());
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

test("aggregate: independent mutations across three checks are all reported together", () => {
  let mutated = VALID_PLAN;
  mutated = mutated.replace("Solo: lone remaining task\n\n", "");
  mutated = mutated.replace(
    "This task implements helperFn() for parsing.",
    "This task implements the helper for parsing.",
  );
  mutated = mutated.replace(
    "- Modify: extensions/lib/fixture-other.ts",
    "- Modify: extensions/lib/fixture-shared.ts",
  );
  const findings = checkPlan(mutated, SPEC_TEXT, alwaysTruePort());
  assert.ok(findingsFor(findings, "solo-line").length > 0, "expected a solo-line finding");
  assert.ok(findingsFor(findings, "quote-integrity").length > 0, "expected a quote-integrity finding");
  assert.ok(findingsFor(findings, "wave-file-disjointness").length > 0, "expected a wave-file-disjointness finding");
});

test("grammarless plan: absent-structure findings do not short-circuit the catalog (placeholder-scan still runs)", () => {
  const grammarless = "# Not a plan\n\nJust some prose with a TODO in it.\n";
  const findings = checkPlan(grammarless, SPEC_TEXT, alwaysTruePort());
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
  assert.doesNotThrow(() => checkPlan("", SPEC_TEXT, alwaysTruePort()));
});

test("fail-closed: checkPlan never throws on a non-markdown garbage blob", () => {
  const garbage = "\u0000\u0001binary\ngarbage\tstuff \u{1F4A9} \"\"\"\n```unterminated fence";
  assert.doesNotThrow(() => checkPlan(garbage, SPEC_TEXT, alwaysTruePort()));
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
