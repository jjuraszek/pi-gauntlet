import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const CLI = join(dirname(fileURLToPath(import.meta.url)), "gauntlet-performance.mjs");
const TDIR = ".pi/gauntlet/telemetry/doc/specs";
const EMPTY_AGENT = mkdtempSync(join(tmpdir(), "gp-empty-agent-"));
process.on("exit", () => rmSync(EMPTY_AGENT, { recursive: true, force: true }));

const write = (root, rel, text) => {
  mkdirSync(join(root, dirname(rel)), { recursive: true });
  writeFileSync(join(root, rel), text);
};
const gitRepo = (prefix = "gp-") => {
  const root = mkdtempSync(join(tmpdir(), prefix));
  spawnSync("git", ["init", "-q"], { cwd: root });
  return root;
};
const invoke = (cwd, args = [], env = {}) => {
  const r = spawnSync(process.execPath, [CLI, ...args], {
    cwd, encoding: "utf8", env: { ...process.env, PI_CODING_AGENT_DIR: EMPTY_AGENT, ...env },
  });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr.trim(), lines: r.stdout.split("\n").filter(Boolean) };
};
const json = (cwd, args = []) => JSON.parse(invoke(cwd, ["--json", ...args]).stdout);
const cleanup = (t, ...roots) => t.after(() => roots.forEach((r) => rmSync(r, { recursive: true, force: true })));

const phase = (extra) => `{ started_at: 2026-09-01T00:00:00Z, completed_at: 2026-09-01T00:10:00Z, duration_s: 600, ${extra} }`;
const tokens = (input, output, cacheRead, cacheWrite, cost) =>
  `tokens: { input: ${input}, output: ${output}, cache_read: ${cacheRead}, cache_write: ${cacheWrite}, cost: ${cost} }`;

// Complete run: cache-dominated tokens, an unphased block that must be ignored, two models.
const COMPLETE = `schema: 1
spec: doc/specs/a.md
run_id: aaaaaaaa-0000-0000-0000-000000000001
status: shipped
created_at: 2026-09-01T00:00:00Z
shipped_at: 2026-09-01T01:00:00Z
versions: { pi-gauntlet: 5.9.1 }
derived:
  duration_s: 3600
  phases:
    brainstorm: ${phase(`model: m/alpha, ${tokens(100, 10, 5000, 200, 1.5)}`)}
    plan: ${phase(`model: m/alpha, ${tokens(50, 5, 1000, 100, 0.5)}`)}
    implement: ${phase(`model: m/beta, ${tokens(10, 1, 100, 10, 0.25)}`)}
    verify: ${phase(`model: m/beta`)}
    ship: ${phase(`model: m/beta`)}
    unphased: { ${tokens(99999, 99999, 99999, 99999, 999)} }
  personas:
    worker: { dispatches: 3, models: [m/beta] }
    spec-council-member: { dispatches: 4, models: [m/alpha] }
  reviews:
    spec-reviewer: { dispatches: 1, nonzero_exit: 0 }
    code-reviewer: { dispatches: 1, nonzero_exit: 0, findings: { blocker: 1, major: 2, minor: 3 } }
  conformance_loops: 2
  conformance_open_gaps: 0
  gates: { spec_rounds: 1, plan_rounds: 1, fix_round_grants: 1, task_reopens: 0, ship_option: squash }
  tests: { command: npm test, result: pass }
accumulators: {}
events: []
`;
// Truncated run: stamped shipped by salvage, stale duration_s, no ship phase, zero gates.
const TRUNCATED = `schema: 1
spec: doc/specs/b.md
run_id: bbbbbbbb-0000-0000-0000-000000000002
status: shipped
created_at: 2026-09-02T00:00:00Z
shipped_at: 2026-09-02T02:00:00Z
versions: { pi-gauntlet: 5.9.1 }
derived:
  duration_s: 2501
  phases:
    brainstorm: ${phase(`model: m/alpha, ${tokens(1, 1, 1, 1, 0.01)}`)}
    plan: { started_at: 2026-09-02T00:10:00Z, model: m/alpha }
  personas: {}
  conformance_loops: 0
  gates: { spec_rounds: 0, plan_rounds: 0, fix_round_grants: 0, task_reopens: 0 }
accumulators: {}
events: []
`;
const IN_PROGRESS = `schema: 1
spec: doc/specs/c.md
run_id: cccccccc-0000-0000-0000-000000000003
status: in_progress
created_at: 2026-09-03T00:00:00Z
versions: { pi-gauntlet: 5.11.0 }
derived:
  duration_s: 10
  phases: { brainstorm: { started_at: 2026-09-03T00:00:00Z } }
  personas: {}
  conformance_loops: 0
  gates: { spec_rounds: 0, plan_rounds: 0, fix_round_grants: 0, task_reopens: 0 }
accumulators: {}
events: []
`;
// Second complete run on 5.9.1 with different numbers: makes p50 over an even count.
const COMPLETE_2 = COMPLETE
  .replace("run_id: aaaaaaaa-0000-0000-0000-000000000001", "run_id: dddddddd-0000-0000-0000-000000000004")
  .replace("spec: doc/specs/a.md", "spec: doc/specs/d.md")
  .replace("created_at: 2026-09-01T00:00:00Z", "created_at: 2026-09-04T00:00:00Z")
  .replace("duration_s: 3600", "duration_s: 7200")
  .replace("fix_round_grants: 1", "fix_round_grants: 3")
  .replace(/reviews:[\s\S]*?conformance_loops/, "conformance_loops");
const OLD_VERSION = COMPLETE
  .replace("run_id: aaaaaaaa-0000-0000-0000-000000000001", "run_id: eeeeeeee-0000-0000-0000-000000000005")
  .replace("spec: doc/specs/a.md", "spec: doc/specs/e.md")
  .replace("pi-gauntlet: 5.9.1", "pi-gauntlet: 5.10.0");
const BAD_GATES = IN_PROGRESS
  .replace("run_id: cccccccc-0000-0000-0000-000000000003", "run_id: ffffffff-0000-0000-0000-000000000006")
  .replace("spec: doc/specs/c.md", "spec: doc/specs/f.md")
  .replace(/gates: \{[^}]*\}/, 'gates: "nope"');
const EMPTY_REVIEWS = IN_PROGRESS
  .replace("run_id: cccccccc-0000-0000-0000-000000000003", "run_id: gggggggg-0000-0000-0000-000000000007")
  .replace("spec: doc/specs/c.md", "spec: doc/specs/g.md")
  .replace("created_at: 2026-09-03T00:00:00Z", "created_at: 2026-09-05T00:00:00Z")
  .replace("  conformance_loops: 0", "  reviews: {}\n  conformance_loops: 0");
const REVIEW_WITHOUT_FINDINGS = IN_PROGRESS
  .replace("run_id: cccccccc-0000-0000-0000-000000000003", "run_id: hhhhhhhh-0000-0000-0000-000000000008")
  .replace("spec: doc/specs/c.md", "spec: doc/specs/h.md")
  .replace("  conformance_loops: 0", "  reviews: { code-reviewer: { dispatches: 1, nonzero_exit: 0 } }\n  conformance_loops: 0");

const PARENT_CALLS = COMPLETE
  .replace("run_id: aaaaaaaa-0000-0000-0000-000000000001", "run_id: iiiiiiii-0000-0000-0000-000000000009")
  .replace("spec: doc/specs/a.md", "spec: doc/specs/i.md")
  .replace("created_at: 2026-09-01T00:00:00Z", "created_at: 2026-09-06T00:00:00Z")
  .replace("plan: " + phase(`model: m/alpha, ${tokens(50, 5, 1000, 100, 0.5)}`),
    "plan: " + phase(`model: m/alpha, ${tokens(50, 5, 1000, 100, 0.5)}, parent_calls: [[1, 60000, 60000], [1, 100, 0]]`))
  .replace("implement: " + phase(`model: m/beta, ${tokens(10, 1, 100, 10, 0.25)}`),
    "implement: " + phase(`model: m/beta, ${tokens(10, 1, 100, 10, 0.25)}, parent_calls: [[1, 70000, 0], [1, 200, 0], [1, 300, 0]]`))
  .replace(`unphased: { ${tokens(99999, 99999, 99999, 99999, 999)} }`,
    `unphased: { ${tokens(99999, 99999, 99999, 99999, 999)}, parent_calls: [[1, 50000, 0]] }`)
  .replace("cache_write: 100, cost: 0.5", "cache_write: 100, cache_write_1h: 60000, cost: 0.5");

const corpus = (root) => {
  write(root, `${TDIR}/a.yaml`, COMPLETE);
  write(root, `${TDIR}/b.yaml`, TRUNCATED);
  write(root, `${TDIR}/c.yaml`, IN_PROGRESS);
  write(root, `${TDIR}/d.yaml`, COMPLETE_2);
  write(root, `${TDIR}/e.yaml`, OLD_VERSION);
  write(root, `${TDIR}/f.yaml`, BAD_GATES);
  write(root, `${TDIR}/i.yaml`, PARENT_CALLS);
  write(root, `${TDIR}/present-empty-reviews.yaml`, EMPTY_REVIEWS);
  write(root, `${TDIR}/broken.yaml`, "schema: 1\nspec: [\n");
  write(root, `${TDIR}/v2.yaml`, "schema: 2\nspec: doc/specs/z.md\nrun_id: z\n");
  write(root, `${TDIR}/norec.yaml`, "schema: 1\nspec: doc/specs/z.md\n");
  return root;
};
const byId = (runs, prefix) => runs.find((r) => r.run_id.startsWith(prefix));

test("per-run fields: typed reads, unphased excluded, truncated wall null, findings null vs 0/0/0", (t) => {
  const root = corpus(gitRepo()); cleanup(t, root);
  const d = json(root);
  assert.deepEqual(d.corpus, { [root.split("/").pop()]: 8 });
  assert.equal(d.since, null);
  const a = byId(d.runs, "aaaaaaaa");
  assert.equal(a.repo, root.split("/").pop());
  assert.equal(a.spec, "a");
  assert.equal(a.version, "5.9.1");
  assert.equal(a.status, "shipped");
  assert.equal(a.truncated, false);
  assert.equal(a.wall_s, 3600);
  assert.deepEqual(a.phase_min, { brainstorm: 10, plan: 10, implement: 10, verify: 10, ship: 10 });
  assert.equal(a.tokens, 100 + 10 + 5000 + 200 + 50 + 5 + 1000 + 100 + 10 + 1 + 100 + 10);
  assert.equal(a.cost, 2.25);
  assert.deepEqual(a.models, ["m/alpha", "m/beta"]);
  assert.equal(a.dispatches, 7);
  assert.equal(a.grants, 1);
  assert.equal(a.reopens, 0);
  assert.equal(a.spec_rounds, 1);
  assert.equal(a.plan_rounds, 1);
  assert.equal(a.loops, 2);
  assert.equal(a.open_gaps, 0);
  assert.deepEqual(a.findings, { blocker: 1, major: 2, minor: 3 });
  assert.equal(a.council, 4);
  assert.equal(a.ship_option, "squash");
  assert.equal(a.tests, "pass");
  const b = byId(d.runs, "bbbbbbbb");
  assert.equal(b.truncated, true);
  assert.equal(b.wall_s, null);
  assert.deepEqual(b.phase_min, { brainstorm: 10, plan: null, implement: null, verify: null, ship: null });
  assert.equal(b.tokens, 4);
  assert.equal(b.dispatches, null);
  assert.equal(b.findings, null);
  assert.equal(b.council, null);
  assert.equal(b.ship_option, null);
  assert.equal(b.tests, null);
  const dd = byId(d.runs, "dddddddd");
  assert.equal(dd.findings, null);
  const f = byId(d.runs, "ffffffff");
  assert.equal(f.grants, null);
  assert.equal(f.status, "in_progress");
  const emptyReviews = byId(d.runs, "gggggggg");
  assert.deepEqual(emptyReviews.findings, { blocker: 0, major: 0, minor: 0 });
});

test("parent_calls: big counts and parent-only shares include unphased without double-counting tokens", (t) => {
  const root = corpus(gitRepo()); cleanup(t, root);
  const i = byId(json(root).runs, "iiiiiiii");
  assert.equal(i.big_calls, 2);
  assert.equal(i.big_write_share, (60000 + 70000) / (60000 + 100 + 70000 + 200 + 300 + 50000));
  assert.deepEqual(i.phases.plan, { big_calls: 1, big_write_share: 60000 / 60100 });
  assert.deepEqual(i.phases.implement, { big_calls: 1, big_write_share: 70000 / 70500 });
  assert.deepEqual(i.phases.unphased, { big_calls: 0, big_write_share: 0 });
  assert.equal(i.tokens, 100 + 10 + 5000 + 200 + 50 + 5 + 1000 + 100 + 10 + 1 + 100 + 10);
  const row = invoke(root).stdout.split("\n").find((l) => l.startsWith("iiiiiiii"));
  assert.match(row, /\b2\/72%/);
});

test("parent_calls with zero cache writes: null shares and text 0/-", (t) => {
  const root = gitRepo(); cleanup(t, root);
  write(root, `${TDIR}/zero.yaml`, `schema: 1
spec: doc/specs/zero.md
run_id: zero0000
derived: { phases: { plan: { parent_calls: [[5, 0, 0]] } } }
`);
  const run = json(root).runs[0];
  assert.equal(run.big_calls, 0);
  assert.equal(run.big_write_share, null);
  assert.deepEqual(run.phases.plan, { big_calls: 0, big_write_share: null });
  const row = invoke(root).lines.find((line) => line.startsWith("zero0000"));
  assert.match(row, /\s0\/-$/);
});

test("parent_calls absent: JSON nulls and text dash", (t) => {
  const root = corpus(gitRepo()); cleanup(t, root);
  const a = byId(json(root).runs, "aaaaaaaa");
  assert.equal(a.big_calls, null);
  assert.equal(a.big_write_share, null);
  assert.equal(a.phases, undefined);
  const row = invoke(root).stdout.split("\n").find((l) => l.startsWith("aaaaaaaa"));
  assert.match(row, /\s-\s*$/);
});

test("review entries without findings contribute zero counters", (t) => {
  const root = gitRepo(); cleanup(t, root);
  write(root, `${TDIR}/review-without-findings.yaml`, REVIEW_WITHOUT_FINDINGS);
  const d = json(root);
  assert.deepEqual(d.runs[0].findings, { blocker: 0, major: 0, minor: 0 });
});

test("malformed findings counters remain null in JSON and render as dashes in text", (t) => {
  const root = gitRepo(); cleanup(t, root);
  const malformed = COMPLETE.replace(
    "findings: { blocker: 1, major: 2, minor: 3 }",
    'findings: { blocker: "bad", major: 2, minor: 3 }',
  );
  write(root, `${TDIR}/malformed-findings.yaml`, malformed);
  const d = json(root);
  assert.deepEqual(d.runs[0].findings, { blocker: null, major: 2, minor: 3 });
  const row = invoke(root).lines.find((line) => line.startsWith("aaaaaaaa"));
  assert.match(row, /\s-\/2\/3\s+4\s+-$/);
});

test("malformed reviewer entries and findings objects contribute null counters", (t) => {
  const root = gitRepo(); cleanup(t, root);
  const malformedFindings = COMPLETE.replace(
    "findings: { blocker: 1, major: 2, minor: 3 }",
    'findings: "bad"',
  );
  const malformedReviewer = COMPLETE.replace(
    "code-reviewer: { dispatches: 1, nonzero_exit: 0, findings: { blocker: 1, major: 2, minor: 3 } }",
    'code-reviewer: "bad"',
  );
  write(root, `${TDIR}/malformed-findings-object.yaml`, malformedFindings);
  write(root, `${TDIR}/malformed-reviewer.yaml`, malformedReviewer.replace(
    "run_id: aaaaaaaa-0000-0000-0000-000000000001",
    "run_id: 22222222-0000-0000-0000-000000000012",
  ));
  const d = json(root);
  assert.deepEqual(byId(d.runs, "aaaaaaaa").findings, { blocker: null, major: null, minor: null });
  assert.deepEqual(byId(d.runs, "22222222").findings, { blocker: null, major: null, minor: null });
});

test("phase minutes remain unrounded in JSON", (t) => {
  const root = gitRepo(); cleanup(t, root);
  write(root, `${TDIR}/phase-61.yaml`, COMPLETE.replace("duration_s: 600", "duration_s: 61"));
  const d = json(root);
  assert.equal(d.runs[0].phase_min.brainstorm, 61 / 60);
});

test("aggregates: only shipped non-truncated rows feed p50/max; even-count p50 is the mean; models tally; unknown group", (t) => {
  const root = corpus(gitRepo()); cleanup(t, root);
  write(root, `${TDIR}/g.yaml`, COMPLETE.replace("run_id: aaaaaaaa-0000-0000-0000-000000000001", "run_id: 99999999-0000-0000-0000-000000000009").replace("versions: { pi-gauntlet: 5.9.1 }", "versions: {}"));
  const d = json(root);
  assert.deepEqual(d.by_version.map((g) => g.version), ["5.9.1", "5.10.0", "5.11.0", "unknown"]);
  const v591 = d.by_version[0];
  assert.equal(v591.n, 4);
  assert.equal(v591.shipped, 3);
  assert.equal(v591.truncated, 1);
  assert.deepEqual(v591.wall_s, { p50: 3600, max: 7200 });
  assert.deepEqual(v591.grants, { p50: 1, max: 3 });
  assert.deepEqual(v591.dispatches, { p50: 7 });
  assert.deepEqual(v591.findings, { blocker: { p50: 1 }, major: { p50: 2 }, minor: { p50: 3 } });
  assert.deepEqual(v591.models, { "m/alpha": 3, "m/beta": 3 });
  const v5110 = d.by_version[2];
  assert.equal(v5110.n, 3);
  assert.equal(v5110.shipped, 0);
  assert.deepEqual(v5110.wall_s, { p50: null, max: null });
  assert.deepEqual(v5110.models, {});
  assert.equal(d.by_version[3].shipped, 1);
});

test("row order is created_at then run_id; skipped lists unparseable, schema, not a record", (t) => {
  const root = corpus(gitRepo()); cleanup(t, root);
  const d = json(root);
  assert.deepEqual(d.runs.map((r) => r.run_id[0]), ["a", "e", "b", "c", "f", "d", "g", "i"]);
  const reasons = Object.fromEntries(d.skipped.map((s) => [s.file.split("/").pop(), s.reason]));
  assert.equal(reasons["broken.yaml"], "unparseable");
  assert.equal(reasons["v2.yaml"], "schema 2");
  assert.equal(reasons["norec.yaml"], "not a record");
});

test("text output: header, shipped* marker, - cells, by version block, skipped lines", (t) => {
  const root = corpus(gitRepo()); cleanup(t, root);
  const r = invoke(root);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.lines[0], `corpus: ${root.split("/").pop()}=8`);
  assert.equal(r.lines[1], "runs (8)");
  assert.match(r.lines[2], /^run_id\s+repo\s+spec\s+version\s+status\s+engine\s+iterations\s+wall\s+b\/p\/i\/v\/s min\s+tokens\s+cost\s+models\s+disp\s+grants\s+reopens\s+loops\s+findings\s+council\s+big$/);
  const bRow = r.lines.find((l) => l.startsWith("bbbbbbbb"));
  assert.match(bRow, /\s5\.9\.1\s+shipped\*\s+waves\s+-\s+10\/-\/-\/-\/-\s/);
  assert.match(bRow, /\s-\s*$/);
  const aRow = r.lines.find((l) => l.startsWith("aaaaaaaa"));
  assert.match(aRow, /\sshipped\s+waves\s+60m\s+10\/10\/10\/10\/10\s+6\.6k\s+2\.25\s+m\/alpha,m\/beta\s+7\s+1\s+0\s+2\s+1\/2\/3\s+4\s+-$/);
  assert.ok(r.lines.includes("by version"));
  const v = r.lines.find((l) => l.startsWith("5.9.1"));
  assert.match(v, /^5\.9\.1\s+4\s+3\s+1\s+60m\/120m\s/);
  assert.ok(r.lines.some((l) => /^skipped: .*broken\.yaml: unparseable$/.test(l)));
});

test("--since numeric compare: 5.10.0 > 5.9.1, unknown and malformed versions dropped; no rows -> no records found, exit 0", (t) => {
  const root = corpus(gitRepo()); cleanup(t, root);
  write(root, `${TDIR}/g.yaml`, COMPLETE.replace("run_id: aaaaaaaa-0000-0000-0000-000000000001", "run_id: 99999999-0000-0000-0000-000000000009").replace("versions: { pi-gauntlet: 5.9.1 }", "versions: {}"));
  write(root, `${TDIR}/malformed-version.yaml`, COMPLETE.replace("run_id: aaaaaaaa-0000-0000-0000-000000000001", "run_id: 11111111-0000-0000-0000-000000000011").replace("pi-gauntlet: 5.9.1", "pi-gauntlet: 5.9.1garbage"));
  write(root, `${TDIR}/leading-zero-version.yaml`, COMPLETE.replace("run_id: aaaaaaaa-0000-0000-0000-000000000001", "run_id: 33333333-0000-0000-0000-000000000013").replace("pi-gauntlet: 5.9.1", "pi-gauntlet: 5.09.1"));
  assert.equal(byId(json(root).runs, "11111111").version, "unknown");
  assert.equal(byId(json(root).runs, "33333333").version, "unknown");
  const sinceFive = json(root, ["--since", "5.0.0"]);
  assert.equal(byId(sinceFive.runs, "33333333"), undefined);
  const d = json(root, ["--since", "5.10.0"]);
  assert.equal(d.since, "5.10.0");
  assert.deepEqual(d.runs.map((r) => r.version).sort(), ["5.10.0", "5.11.0", "5.11.0", "5.11.0"]);
  const r = invoke(root, ["--since", "9.9.9"]);
  assert.equal(r.status, 0);
  assert.equal(r.lines[0], `corpus: ${root.split("/").pop()}=0   since: 9.9.9`);
  assert.match(r.lines[1], /^no records found in .*\.pi\/gauntlet\/telemetry$/);
  assert.equal(r.lines.length, 2);
});

test("--dir: repo root with telemetry dir, repo root without (skipped, checkout not walked), bare telemetry dir; duplicate run_id collapses", (t) => {
  const root = corpus(gitRepo());
  const other = gitRepo("gp-other-");
  write(other, `${TDIR}/dup.yaml`, COMPLETE);
  write(other, `${TDIR}/h.yaml`, COMPLETE.replace("run_id: aaaaaaaa-0000-0000-0000-000000000001", "run_id: 88888888-0000-0000-0000-000000000008"));
  const empty = gitRepo("gp-empty-");
  write(empty, "doc/specs/decoy.yaml", COMPLETE.replace("run_id: aaaaaaaa-0000-0000-0000-000000000001", "run_id: 77777777-0000-0000-0000-000000000007"));
  const bare = mkdtempSync(join(tmpdir(), "gp-bare-"));
  write(bare, "x.yaml", COMPLETE.replace("run_id: aaaaaaaa-0000-0000-0000-000000000001", "run_id: 66666666-0000-0000-0000-000000000006"));
  cleanup(t, root, other, empty, bare);
  const d = json(root, ["--dir", other, "--dir", empty, "--dir", bare, "--dir", join(bare, "missing")]);
  assert.equal(d.corpus[other.split("/").pop()], 1);
  assert.equal(d.corpus[bare.split("/").pop()], 1);
  assert.equal(d.corpus[empty.split("/").pop()], undefined);
  assert.ok(d.runs.some((r) => r.run_id.startsWith("88888888")));
  assert.ok(d.runs.some((r) => r.run_id.startsWith("66666666")));
  assert.ok(!d.runs.some((r) => r.run_id.startsWith("77777777")));
  assert.equal(d.runs.filter((r) => r.run_id.startsWith("aaaaaaaa")).length, 1);
  assert.ok(d.skipped.some((s) => s.file.endsWith("dup.yaml") && s.reason === "duplicate run_id"));
  assert.ok(d.skipped.some((s) => s.file === empty && s.reason === "no telemetry dir"));
  assert.ok(d.skipped.some((s) => s.file === join(bare, "missing") && s.reason === "not found"));
});

test("--dir skips an existing regular file as not a directory", (t) => {
  const root = gitRepo();
  const file = join(root, "telemetry.yaml");
  writeFileSync(file, COMPLETE);
  cleanup(t, root);
  const r = invoke(root, ["--json", "--dir", file]);
  assert.equal(r.status, 0, r.stderr);
  const d = JSON.parse(r.stdout);
  assert.ok(d.skipped.some((s) => s.file === file && s.reason === "not a directory"));
});

test("repo .pi/settings.json telemetry.dir is honoured for the default corpus", (t) => {
  const root = gitRepo(); cleanup(t, root);
  write(root, ".pi/settings.json", JSON.stringify({ piGauntlet: { telemetry: { dir: "custom/dir" } } }));
  write(root, "custom/dir/doc/specs/a.yaml", COMPLETE);
  const d = json(root);
  assert.equal(d.runs.length, 1);
});

test("usage error exits 1", (t) => {
  const root = gitRepo(); cleanup(t, root);
  assert.equal(invoke(root, ["--bogus"]).status, 1);
  assert.equal(invoke(root, ["--since", "abc"]).status, 1);
  assert.equal(invoke(root, ["--since", "5.09.1"]).status, 1);
});

const sev = (b, M, m) => `{ blocker: ${b}, major: ${M}, minor: ${m} }`;
const member = (dispatches, total, unique, applied, uniqApplied, deferred, rejected) =>
  `{ dispatches: ${dispatches}, total: ${total}, unique: ${unique}, applied: ${applied}, unique_applied: ${uniqApplied}, deferred: ${deferred}, rejected: ${rejected} }`;
const ALPHA = member(1, sev(1, 3, 1), sev(0, 1, 1), sev(1, 3, 0), sev(0, 1, 0), sev(0, 0, 0), sev(0, 0, 1));
const BETA = member(1, sev(0, 2, 2), sev(0, 1, 0), sev(0, 1, 1), sev(0, 1, 0), sev(0, 1, 0), sev(0, 0, 1));
const GAMMA = member(2, sev(0, 1, 4), sev(0, 0, 3), sev(0, 0, 1), sev(0, 0, 1), sev(0, 0, 0), sev(0, 1, 3));
const councilRecord = (id, createdAt, version, chair, chairDispatches, members) => `schema: 1
spec: doc/specs/c-${id}.md
run_id: ${id}-0000-0000-0000-000000000000
status: shipped
created_at: ${createdAt}
shipped_at: ${createdAt}
versions: { pi-gauntlet: ${version} }
derived:
  duration_s: 60
  phases:
    ship: ${phase("model: m/alpha")}
  personas: {}
  conformance_loops: 0
  gates: { spec_rounds: 1, plan_rounds: 1, fix_round_grants: 0, task_reopens: 0 }
  council:
    chair: { model: ${chair}, dispatches: ${chairDispatches}, clusters: 6, members_reported: 3 }
    members:
${Object.entries(members).map(([k, v]) => `      ${k}: ${v}`).join("\n")}
  amendments: 0
  spec_edits_after_ship: 0
  spec_writes: {}
  events_dropped: 0
accumulators: {}
events: []
`;
const ZERO = member(1, ...Array(6).fill(sev(0, 0, 0)));
const BIG = { "p/alpha:xhigh": ALPHA, "p/beta:high": BETA, "p/gamma:high": GAMMA, "p/zero:high": ZERO };
const SMALL = { "p/alpha:xhigh": ALPHA, "p/delta:high": BETA };
const councilCorpus = (root) => {
  for (let i = 0; i < 6; i++) write(root, `${TDIR}/big-${i}.yaml`, councilRecord(`c000000${i}`, `2026-09-1${i}T00:00:00Z`, "5.20.0", i < 4 ? "p/chair:medium" : "p/other:high", i === 2 ? 2 : 1, BIG));
  for (let i = 0; i < 2; i++) write(root, `${TDIR}/small-${i}.yaml`, councilRecord(`d000000${i}`, `2026-09-2${i}T00:00:00Z`, "5.21.0", "p/chair:medium", 1, SMALL));
  write(root, `${TDIR}/plain.yaml`, COMPLETE);
  return root;
};

test("council section: rosters, sums, chairs and flags", (t) => {
  const root = councilCorpus(gitRepo()); cleanup(t, root);
  const d = json(root);
  assert.equal(d.council.length, 2);
  assert.deepEqual(d.council[0].roster, ["p/alpha:xhigh", "p/delta:high"]);
  assert.equal(d.council[0].runs, 2);
  assert.deepEqual(d.council[0].flags, []);
  const big = d.council[1];
  assert.deepEqual(big.roster, ["p/alpha:xhigh", "p/beta:high", "p/gamma:high", "p/zero:high"]);
  assert.equal(big.runs, 6);
  assert.deepEqual(big.members["p/alpha:xhigh"].total, { blocker: 6, major: 18, minor: 6 });
  assert.equal(big.members["p/alpha:xhigh"].dispatches, 6);
  assert.equal(big.members["p/gamma:high"].dispatches, 12);
  assert.equal(big.members["p/alpha:xhigh"].unique_applied_nonminor_per_run, 1);
  assert.equal(big.members["p/gamma:high"].unique_applied_nonminor_per_run, 0);
  assert.deepEqual(big.chairs, [
    { model: "p/chair:medium", runs: 4, avg_clusters: 6, avg_members_reported: 3, retried_runs: 1 },
    { model: "p/other:high", runs: 2, avg_clusters: 6, avg_members_reported: 3, retried_runs: 0 },
  ]);
  assert.deepEqual(big.flags.map((f) => [f.member, f.rule]), [
    ["p/gamma:high", "low_unique_applied"], ["p/gamma:high", "high_rejection"],
    ["p/zero:high", "low_unique_applied"],
  ]);
  assert.equal(big.flags[0].detail, "0.00 unique-and-applied blocker/major per run in 6 runs (total 0/6/24)");
  assert.equal(big.flags[1].detail, "rejected 80% vs p/alpha:xhigh 20% (total 0/6/24)");
  assert.equal(big.flags[2].detail, "0.00 unique-and-applied blocker/major per run in 6 runs (total 0/0/0)");
  const r = invoke(root);
  assert.equal(r.status, 0, r.stderr);
  const at = r.lines.indexOf("council");
  assert.ok(at > 0);
  assert.equal(r.lines[at + 1], "severity is the chair's consolidated severity (highest any co-raiser assigned), not the member's own");
  assert.equal(r.lines[at + 2], "roster (2 runs): p/alpha:xhigh, p/delta:high");
  assert.match(r.lines[at + 3], /^  member\s+total\s+unique\s+applied\s+uniq_appl\s+deferred\s+rejected\s+uniq_appl_nonminor\/run$/);
  assert.ok(r.lines.includes("  not enough runs to assess (2 of 5)"));
  assert.ok(r.lines.includes("roster (6 runs): p/alpha:xhigh, p/beta:high, p/gamma:high, p/zero:high"));
  assert.match(r.lines.find((l) => /^  p\/alpha:xhigh\s+6\/18\/6\s/.test(l)), /^  p\/alpha:xhigh\s+6\/18\/6\s+0\/6\/6\s+6\/18\/0\s+0\/6\/0\s+0\/0\/0\s+0\/0\/6\s+1\.00$/);
  assert.ok(r.lines.includes("  chair: p/chair:medium - 4 runs, avg 6.0 clusters from 3.0 members reported, retried in 1"));
  assert.ok(r.lines.includes("  chair: p/other:high - 2 runs, avg 6.0 clusters from 3.0 members reported, retried in 0"));
  assert.ok(r.lines.includes("  flag: p/gamma:high - 0.00 unique-and-applied blocker/major per run in 6 runs (total 0/6/24)"));
  assert.ok(r.lines.includes("  flag: p/gamma:high - rejected 80% vs p/alpha:xhigh 20% (total 0/6/24)"));
});

test("council section: --since and no council data", (t) => {
  const root = councilCorpus(gitRepo()); cleanup(t, root);
  const d = json(root, ["--since", "5.21.0"]);
  assert.equal(d.council.length, 1);
  assert.deepEqual(d.council[0].roster, ["p/alpha:xhigh", "p/delta:high"]);
  const plain = corpus(gitRepo()); cleanup(t, plain);
  assert.deepEqual(json(plain).council, []);
  const r = invoke(plain);
  const at = r.lines.indexOf("council");
  assert.ok(at > 0);
  assert.equal(r.lines[at + 1], "no council data in selected records");
  const empty = gitRepo(); cleanup(t, empty);
  const none = invoke(empty);
  assert.match(none.lines[1], /^no records found/);
  assert.equal(none.lines.length, 2);
});

test("runs expose engine and iterations for loop and legacy records in JSON and text", (t) => {
  const root = gitRepo();
  cleanup(t, root);
  write(root, `${TDIR}/old.yaml`, COMPLETE);
  write(root, `${TDIR}/loop.yaml`, TRUNCATED.replace("derived:\n", "derived:\n  engine: loop\n  iterations: 4\n"));
  const rows = json(root).runs;
  assert.deepEqual(rows.map((r) => [r.engine, r.iterations]), [["waves", null], ["loop", 4]]);
  const rendered = invoke(root);
  assert.equal(rendered.status, 0, rendered.stderr);
  const text = rendered.stdout;
  assert.match(text, /engine/);
  assert.match(text, /iterations/);
  assert.match(text, /^aaaaaaaa\s+.*\sshipped\s+waves\s+60m\s/m);
  assert.match(text, /^bbbbbbbb\s+.*\sshipped\*\s+loop\s+4\s+-\s/m);
});
