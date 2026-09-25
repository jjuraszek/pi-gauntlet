import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, utimesSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const CLI = join(dirname(fileURLToPath(import.meta.url)), "gauntlet-spec-index.mjs");
const DRAFT = "# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing";

const write = (root, rel, text) => {
  mkdirSync(join(root, dirname(rel)), { recursive: true });
  writeFileSync(join(root, rel), text);
};

const repo = () => {
  const root = mkdtempSync(join(tmpdir(), "gsi-"));
  spawnSync("git", ["init", "-q"], { cwd: root });
  write(root, "doc/specs/a.md", "# Alpha zephyr widget\n\n**Goal:** rank the widget.\n\n## Design\n\nbody text\n");
  write(root, "svc-a/doc/specs/b.md", "# Beta service\n\n**Goal:** unrelated.\n\nDeep in the body a zephyr appears.\n");
  write(root, ".worktrees/x/doc/specs/decoy1.md", "# zephyr decoy one\n");
  write(root, "build/doc/specs/decoy2.md", "# zephyr decoy two\n");
  write(root, "apps/svc/doc/specs/decoy3.md", "# zephyr decoy three\n");
  write(root, "doc/specs/draft.md", `${DRAFT}\n\nzephyr zephyr zephyr\n`);
  spawnSync("git", ["add", "-A"], { cwd: root });
  spawnSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", "fixture"], { cwd: root });
  return root;
};

const run = (cwd, args) => {
  const r = spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: "utf8" });
  const lines = r.stdout.split("\n").filter(Boolean);
  return { status: r.status, stderr: r.stderr, header: lines[0]?.split("\t"), rows: lines.slice(1).map((l) => l.split("\t")) };
};
const paths = (res) => res.rows.map((r) => r[1]);
const withDb = (root, fn) => {
  const database = new DatabaseSync(join(root, ".pi/gauntlet/index.sqlite"));
  try {
    return fn(database);
  } finally {
    database.close();
  }
};

test("1: corpus boundary, ordering, draft skip, git status clean, exclude written once", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const r1 = run(root, ["--query", "zephyr"]);
  assert.equal(r1.status, 0, r1.stderr);
  assert.deepEqual(paths(r1), ["doc/specs/a.md", "svc-a/doc/specs/b.md"]);
  assert.deepEqual(r1.rows.map((r) => r[2]), ["root", "svc-a"]);
  const status = spawnSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" }).stdout;
  assert.equal(status, "");
  run(root, ["--query", "zephyr"]);
  const exclude = readFileSync(join(root, ".git/info/exclude"), "utf8");
  assert.equal(exclude.split("\n").filter((l) => l === "/.pi/gauntlet/index.sqlite*").length, 1);
});

test("2: title outranks body; --limit 1; default up to 10", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (let i = 0; i < 12; i++) write(root, `doc/specs/many-${i}.md`, `# Spec ${i}\n\nquokka\n`);
  assert.deepEqual(paths(run(root, ["--query", "zephyr", "--limit", "1"])), ["doc/specs/a.md"]);
  assert.equal(run(root, ["--query", "quokka"]).rows.length, 10);
});

test("3: incremental refresh updates only the edited row; delete removes rows", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  run(root, ["--query", "zephyr"]);
  const before = withDb(root, (database) => Object.fromEntries(database.prepare("SELECT path, mtime_ms, size FROM files").all().map((r) => [r.path, `${r.mtime_ms}:${r.size}`])));
  const b = join(root, "svc-a/doc/specs/b.md");
  writeFileSync(b, readFileSync(b, "utf8") + "\nwombat\n");
  utimesSync(b, new Date(), new Date(Date.now() + 5000));
  assert.deepEqual(paths(run(root, ["--query", "wombat"])), ["svc-a/doc/specs/b.md"]);
  const after = withDb(root, (database) => Object.fromEntries(database.prepare("SELECT path, mtime_ms, size FROM files").all().map((r) => [r.path, `${r.mtime_ms}:${r.size}`])));
  assert.equal(after["doc/specs/a.md"], before["doc/specs/a.md"]);
  assert.notEqual(after["svc-a/doc/specs/b.md"], before["svc-a/doc/specs/b.md"]);
  const count = (root, sql, path) => withDb(root, (database) => Object.values(database.prepare(sql).get(path))[0]);
  assert.equal(count(root, "SELECT count(*) FROM specs WHERE path = ?", "svc-a/doc/specs/b.md"), 1);
  rmSync(b);
  run(root, ["--query", "zephyr"]);
  assert.equal(count(root, "SELECT count(*) FROM specs WHERE path = ?", "svc-a/doc/specs/b.md"), 0);
  assert.equal(count(root, "SELECT count(*) FROM files WHERE path = ?", "svc-a/doc/specs/b.md"), 0);
});

test("4: schema_version mismatch rebuilds the db", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  run(root, ["--query", "zephyr"]);
  withDb(root, (database) => database.prepare("UPDATE meta SET value = '999' WHERE key = 'schema_version'").run());
  const r = run(root, ["--query", "zephyr"]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(paths(r).length, 2);
  assert.equal(withDb(root, (database) => database.prepare("SELECT value FROM meta WHERE key = 'schema_version'").get().value), "1");
});

test("5: a non-SQLite database is rebuilt", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, ".pi/gauntlet/index.sqlite", "not a sqlite database");
  const r = run(root, ["--query", "zephyr"]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(paths(r), ["doc/specs/a.md", "svc-a/doc/specs/b.md"]);
  assert.equal(withDb(root, (database) => database.prepare("SELECT value FROM meta WHERE key = 'schema_version'").get().value), "1");
});

test("6: telemetry join is output-only and tolerant", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  run(root, ["--query", "zephyr"]);
  const filesBefore = withDb(root, (database) => JSON.stringify(database.prepare("SELECT * FROM files ORDER BY path").all()));
  write(root, "x", "x\n");
  write(root, "y", "y\n");
  write(root, ".pi/gauntlet/telemetry/doc/specs/a.yaml", "status: shipped\nshipped_at: 2026-09-17T10:00:00Z\nderived:\n  modified_files:\n    - x\n    - y\n");
  let r = run(root, ["--query", "zephyr"]);
  assert.deepEqual(r.rows[0].slice(4, 7), ["shipped", "2026-09-17T10:00:00Z", "x;y"]);
  assert.equal(r.rows[0].length, 8);
  assert.equal(r.rows[1][6], "");
  assert.equal(withDb(root, (database) => JSON.stringify(database.prepare("SELECT * FROM files ORDER BY path").all())), filesBefore);
  write(root, ".pi/gauntlet/telemetry/doc/specs/a.yaml", "status: in_progress\nshipped_at: 2026-09-18T10:00:00Z\n");
  r = run(root, ["--query", "zephyr"]);
  assert.deepEqual(r.rows[0].slice(4, 7), ["in_progress", "2026-09-18T10:00:00Z", "missing"]);
  write(root, ".pi/gauntlet/telemetry/doc/specs/a.yaml", "status: [unclosed\n");
  r = run(root, ["--query", "zephyr"]);
  assert.equal(r.status, 0);
  assert.deepEqual(r.rows[0].slice(4, 7), ["", "", ""]);
  assert.match(r.stderr, /a\.yaml/);
});

test("6b: files cell is the AC fixture - present paths kept, gone paths dropped, no list is missing", (t) => {
  const root = mkdtempSync(join(tmpdir(), "gsi-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  spawnSync("git", ["init", "-q"], { cwd: root });
  write(root, "doc/specs/a.md", "# Alpha quokka\n\n**Goal:** quokka.\n");
  write(root, "doc/specs/b.md", "# Beta quokka\n\n**Goal:** quokka too.\n");
  write(root, "src/x.ts", "export {};\n");
  write(root, ".pi/gauntlet/telemetry/doc/specs/a.yaml", "status: shipped\nderived:\n  modified_files:\n    - src/x.ts\n    - src/gone.ts\n");
  write(root, ".pi/gauntlet/telemetry/doc/specs/b.yaml", "status: shipped\n");
  spawnSync("git", ["add", "-A"], { cwd: root });
  spawnSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", "fixture"], { cwd: root });
  const r = run(root, ["--query", "quokka"]);
  assert.equal(r.status, 0, r.stderr);
  const cells = Object.fromEntries(r.rows.map((row) => [row[1], row[6]]));
  assert.equal(cells["doc/specs/a.md"], "src/x.ts");
  assert.equal(cells["doc/specs/b.md"], "missing");
  for (const row of r.rows) assert.equal(row.length, 8);
});

test("6c: files cell edge cases - order, spaces kept, all gone, non-array, null record", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const yaml = ".pi/gauntlet/telemetry/doc/specs/a.yaml";
  const files = () => run(root, ["--query", "zephyr"]).rows[0][6];
  write(root, "b.js", "");
  write(root, "a.js", "");
  write(root, "sp  aced.txt", "");
  write(root, yaml, "status: shipped\nderived:\n  modified_files:\n    - a.js\n    - b.js\n");
  assert.equal(files(), "a.js;b.js");
  write(root, "tab\there.js", "");
  write(root, yaml, 'status: shipped\nderived:\n  modified_files:\n    - a.js\n    - "tab\\there.js"\n');
  assert.equal(files(), "a.js;tab here.js");
  assert.equal(run(root, ["--query", "zephyr"]).rows[0].length, 8);
  write(root, yaml, "status: shipped\nderived:\n  modified_files:\n    - 'sp  aced.txt'\n    - 7\n");
  assert.equal(files(), "sp  aced.txt");
  write(root, yaml, "status: shipped\nderived:\n  modified_files:\n    - nope1\n    - nope2\n");
  assert.equal(files(), "");
  write(root, yaml, 'status: shipped\nderived:\n  modified_files: "x"\n');
  assert.equal(files(), "missing");
  write(root, yaml, "");
  assert.equal(files(), "");
  write(root, yaml, "- a\n- b\n");
  assert.equal(files(), "");
});

test("7: query sanitising tolerates embedded quotes", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/specs/q.md", '# Quotes\n\nfoo"bar and "plain" words\n');
  let r = run(root, ["--query", 'foo"bar']);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(paths(r).includes("doc/specs/q.md"));
  r = run(root, ["--query", '"plain"']);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(paths(r).includes("doc/specs/q.md"));
});

test("8: one line per hit, eight tab-separated fields, whitespace collapsed", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/specs/t.md", "# Tab\tin\ttitle narwhal\n\nbody narwhal\nline two\twith tab narwhal\r\nmore\n");
  const r = run(root, ["--query", "narwhal"]);
  assert.equal(r.header.length, 8);
  assert.equal(r.rows.length, 1);
  assert.equal(r.rows[0].length, 8);
  assert.equal(r.rows[0][3], "Tab in title narwhal");
});

test("9: supersession banner is plain body text", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/specs/old.md", "# Old\n\n> **Superseded by:** [doc/specs/a.md](./a.md) - fully\n\nplatypus\n");
  const r = run(root, ["--query", "Superseded"]);
  assert.deepEqual(paths(r), ["doc/specs/old.md"]);
  assert.deepEqual(r.rows[0].slice(4, 7), ["", "", ""]);
  assert.deepEqual(r.header, ["score", "path", "service", "title", "status", "shipped_at", "files", "snippet"]);
});

test("10: usage errors exit 1, environment errors exit 2", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  assert.equal(run(root, []).status, 1);
  assert.equal(run(root, ["--query", "zephyr", "--limit", "0"]).status, 1);
  assert.equal(run(root, ["--query", "zephyr", "--limit", "x"]).status, 1);
  assert.equal(run(root, ["--query", "zephyr", "--json"]).status, 1);
  assert.equal(run(root, ["--query", "a"]).status, 1);
  const bare = mkdtempSync(join(tmpdir(), "gsi-bare-"));
  t.after(() => rmSync(bare, { recursive: true, force: true }));
  assert.equal(run(bare, ["--query", "zephyr"]).status, 2);
});
