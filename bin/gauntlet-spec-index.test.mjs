import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, utimesSync, symlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { isolatedGitEnv } from "../extensions/test-support/git-env.mjs";

const CLI = join(dirname(fileURLToPath(import.meta.url)), "gauntlet-spec-index.mjs");
const EMPTY_AGENT = mkdtempSync(join(tmpdir(), "gsi-empty-agent-"));
const GIT_ENV = isolatedGitEnv(EMPTY_AGENT);
process.on("exit", () => rmSync(EMPTY_AGENT, { recursive: true, force: true }));
const git = (root, args, options = {}) => {
  const result = spawnSync("git", ["-c", "commit.gpgsign=false", ...args], {
    cwd: root, encoding: "utf8", ...options, env: { ...process.env, ...GIT_ENV, ...options.env },
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};
const telemetry = (root, path, text) => {
  const env = { GIT_INDEX_FILE: join(root, ".git/telemetry-index") };
  git(root, ["read-tree", "refs/telemetry/records"], { env });
  const blob = git(root, ["hash-object", "-w", "--stdin"], { input: text });
  git(root, ["update-index", "--add", "--cacheinfo", "100644", blob, `team/product/brainstorming/${path}`], { env });
  const tree = git(root, ["write-tree"], { env });
  const commit = git(root, ["commit-tree", tree, "-p", "refs/telemetry/records", "-m", "telemetry fixture"]);
  git(root, ["update-ref", "refs/telemetry/records", commit]);
};
const DRAFT = "# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing";
const HEADER = ["score", "path", "service", "title", "status", "shipped_at", "state", "files", "snippet"];
const DOCS_HEADER = ["score", "path", "title", "snippet"];
const docFiller = (n) => `# Filler ${n}\n\n## Design\n\nnothing of note here\n`;
const decoy = "# ptarmigan gannet decoy\n\n## ptarmigan gannet\n\nbody\n";
const docsRepo = () => {
  const root = gitRepo();
  write(root, "doc/guide.md", "# Guide\n\n## Configuring the ptarmigan gannet\n\nprose about setup\n");
  write(root, "README.md", "# Repo\n\nThe body mentions ptarmigan once.\n");
  for (let n = 1; n <= 4; n++) write(root, `doc/filler-${n}.md`, docFiller(n));
  for (const p of ["doc/specs/a.md", "docs/specs/b.md", "doc/plans/p.md", "docs/plans/q.md", "node_modules/x/doc/a.md", "build/doc/b.md", ".pi/gauntlet/n.md", ".worktrees/w/doc/g.md"]) write(root, p, decoy);
  write(root, ".gitignore", "build/\n");
  write(root, "doc/draft.md", `${DRAFT}\n\n## ptarmigan gannet\n`);
  commit(root);
  return root;
};
const docsPaths = (root) => withDb(root, (db) => db.prepare("SELECT path FROM docs ORDER BY path").all().map((r) => r.path));
const overrides = (root, globs) => write(root, ".pi/gauntlet-overrides.md", `## Issue tracker\ntracker: none\n\n## Spec index\n${globs.map((g) => `- docs: \`${g}\``).join("\n")}\n\n## release\nnothing\n`);

const write = (root, rel, text) => {
  mkdirSync(join(root, dirname(rel)), { recursive: true });
  writeFileSync(join(root, rel), text);
};

const gitRepo = () => {
  const root = mkdtempSync(join(tmpdir(), "gsi-"));
  git(root, ["init", "-q"]);
  git(root, ["remote", "add", "origin", "https://example.test/team/product.git"]);
  git(root, ["config", `url.${root}.insteadOf`, "https://example.test/team/product.git"]);
  const tree = git(root, ["mktree"], { input: "" });
  const tip = git(root, ["commit-tree", tree, "-m", "empty telemetry fixture"]);
  git(root, ["update-ref", "refs/telemetry/records", tip]);
  return root;
};
const commit = (root) => {
  git(root, ["add", "-A"]);
  git(root, ["commit", "-q", "-m", "fixture"]);
};
// Fillers keep the corpus large enough that two-document probe terms stay below N/2.
const filler = (n) => `# Filler ${n}\n\n**Goal:** filler goal ${n}.\n\n## Design\n\nnothing of note here\n`;
const boundaryRepo = (fillers) => {
  const root = gitRepo();
  const common = (n) => `# Plain spec ${n}\n\n**Goal:** plain goal ${n}.\n\nThe body mentions the common shared vocabulary.\n`;
  write(root, "doc/specs/strong.md", "# Strong heron ibis\n\n**Goal:** heron ibis jackal.\n\nbody\n");
  for (let n = 1; n <= 5; n++) write(root, `doc/specs/p${n}.md`, common(n));
  for (const f of fillers) write(root, `doc/specs/filler-${f}.md`, filler(f));
  commit(root);
  return root;
};
const NOTE = "too small for the confidence rule; no rows returned";

const repo = () => {
  const root = gitRepo();
  write(root, "doc/specs/a.md", "# Alpha zephyr widget\n\n**Goal:** rank the widget.\n\n## Design\n\nbody text\n");
  write(root, "svc-a/doc/specs/b.md", "# Beta service\n\n**Goal:** zephyr widget for the beta service.\n\nDeep in the body a zephyr appears.\n");
  for (const n of ["one", "two", "three", "four"]) write(root, `doc/specs/filler-${n}.md`, filler(n));
  write(root, ".worktrees/x/doc/specs/decoy1.md", "# zephyr widget decoy one\n");
  write(root, "build/doc/specs/decoy2.md", "# zephyr widget decoy two\n");
  write(root, "apps/svc/doc/specs/decoy3.md", "# zephyr widget decoy three\n");
  write(root, "doc/specs/draft.md", `${DRAFT}\n\nzephyr widget zephyr widget\n`);
  commit(root);
  return root;
};

const run = (cwd, args) => {
  const r = spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: "utf8", env: { ...process.env, ...GIT_ENV, PI_CODING_AGENT_DIR: EMPTY_AGENT } });
  const lines = r.stdout.split("\n").filter(Boolean);
  return { status: r.status, stderr: r.stderr, stdout: r.stdout, header: lines[0]?.split("\t"), rows: lines.slice(1).map((l) => l.split("\t")) };
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

test("S1: a repo with only docs/specs/ is indexed under the default dirs", (t) => {
  const root = gitRepo(); t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "docs/specs/a.md", "# Alpha zephyr widget\n\n**Goal:** rank the widget.\n");
  for (const n of ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]) write(root, `docs/specs/filler-${n}.md`, filler(n));
  commit(root);
  const r = run(root, ["--query", "zephyr widget"]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(paths(r), ["docs/specs/a.md"]);
});

test("S2: repo flowGuards.specDirs replaces the defaults for the specs corpus", (t) => {
  const root = gitRepo(); t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, ".pi/settings.json", JSON.stringify({ piGauntlet: { flowGuards: { specDirs: ["design/specs"] } } }));
  write(root, "design/specs/a.md", "# Alpha zephyr widget\n\n**Goal:** rank the widget.\n");
  write(root, "doc/specs/decoy.md", "# zephyr widget decoy\n");
  write(root, "docs/specs/decoy2.md", "# zephyr widget decoy two\n");
  for (const n of ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]) write(root, `design/specs/filler-${n}.md`, filler(n));
  commit(root);
  const r = run(root, ["--query", "zephyr widget"]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(paths(r), ["design/specs/a.md"]);
});

test("S3: docs corpus excludes configured spec and plan dirs by literal path components, including glob metacharacters", (t) => {
  const root = gitRepo(); t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, ".pi/settings.json", JSON.stringify({ piGauntlet: { flowGuards: { specDirs: ["docs/[draft]/specs"] } } }));
  write(root, "docs/[draft]/specs/s.md", decoy);
  write(root, "docs/[draft]/plans/p.md", decoy);
  write(root, "docs/guide.md", "# Guide\n\n## Configuring the ptarmigan gannet\n\nprose\n");
  for (let n = 1; n <= 4; n++) write(root, `docs/filler-${n}.md`, docFiller(n));
  commit(root);
  const r = run(root, ["--corpus", "docs", "--query", "ptarmigan gannet"]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(paths(r), ["docs/guide.md"]);
  const specs = run(root, ["--query", "ptarmigan gannet"]);
  assert.equal(specs.status, 0, specs.stderr);
  assert.ok(withDb(root, (db) => db.prepare("SELECT path FROM specs").all().map((x) => x.path)).includes("docs/[draft]/specs/s.md"));
});

test("1: corpus boundary, ordering, draft skip, git status clean, exclude written once", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const r1 = run(root, ["--query", "zephyr widget"]);
  assert.equal(r1.status, 0, r1.stderr);
  assert.deepEqual(paths(r1), ["doc/specs/a.md", "svc-a/doc/specs/b.md"]);
  assert.deepEqual(r1.rows.map((r) => r[2]), ["root", "svc-a"]);
  const status = git(root, ["status", "--porcelain"]);
  assert.equal(status, "");
  run(root, ["--query", "zephyr widget"]);
  const exclude = readFileSync(join(root, ".git/info/exclude"), "utf8");
  assert.equal(exclude.split("\n").filter((l) => l === "/.pi/gauntlet/index.sqlite*").length, 1);
});

test("2: title outranks goal; --limit 1", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  assert.deepEqual(paths(run(root, ["--query", "zephyr widget", "--limit", "1"])), ["doc/specs/a.md"]);
});

test("3: incremental refresh updates only the edited row; delete removes rows", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  run(root, ["--query", "zephyr widget"]);
  const before = withDb(root, (database) => Object.fromEntries(database.prepare("SELECT path, mtime_ms, size FROM files").all().map((r) => [r.path, `${r.mtime_ms}:${r.size}`])));
  const b = join(root, "svc-a/doc/specs/b.md");
  writeFileSync(b, "# Beta service wombat kudu\n\n**Goal:** zephyr widget for the beta service.\n\nDeep in the body a zephyr appears.\n");
  utimesSync(b, new Date(), new Date(Date.now() + 5000));
  assert.deepEqual(paths(run(root, ["--query", "wombat kudu"])), ["svc-a/doc/specs/b.md"]);
  const after = withDb(root, (database) => Object.fromEntries(database.prepare("SELECT path, mtime_ms, size FROM files").all().map((r) => [r.path, `${r.mtime_ms}:${r.size}`])));
  assert.equal(after["doc/specs/a.md"], before["doc/specs/a.md"]);
  assert.notEqual(after["svc-a/doc/specs/b.md"], before["svc-a/doc/specs/b.md"]);
  const count = (root, sql, path) => withDb(root, (database) => Object.values(database.prepare(sql).get(path))[0]);
  assert.equal(count(root, "SELECT count(*) FROM specs WHERE path = ?", "svc-a/doc/specs/b.md"), 1);
  rmSync(b);
  run(root, ["--query", "zephyr widget"]);
  assert.equal(count(root, "SELECT count(*) FROM specs WHERE path = ?", "svc-a/doc/specs/b.md"), 0);
  assert.equal(count(root, "SELECT count(*) FROM files WHERE path = ?", "svc-a/doc/specs/b.md"), 0);
});

test("4: schema_version mismatch rebuilds the db", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  run(root, ["--query", "zephyr widget"]);
  withDb(root, (database) => database.prepare("UPDATE meta SET value = '999' WHERE key = 'schema_version'").run());
  const r = run(root, ["--query", "zephyr widget"]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(paths(r).length, 2);
  assert.equal(withDb(root, (database) => database.prepare("SELECT value FROM meta WHERE key = 'schema_version'").get().value), "3");
});

test("5: a non-SQLite database is rebuilt", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, ".pi/gauntlet/index.sqlite", "not a sqlite database");
  const r = run(root, ["--query", "zephyr widget"]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(paths(r), ["doc/specs/a.md", "svc-a/doc/specs/b.md"]);
  assert.equal(withDb(root, (database) => database.prepare("SELECT value FROM meta WHERE key = 'schema_version'").get().value), "3");
});

test("6: telemetry join is output-only and tolerant", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  run(root, ["--query", "zephyr widget"]);
  const filesBefore = withDb(root, (database) => JSON.stringify(database.prepare("SELECT * FROM files ORDER BY path").all()));
  write(root, "x", "x\n");
  write(root, "y", "y\n");
  telemetry(root, "doc/specs/a.yaml", "status: shipped\nshipped_at: 2026-09-17T10:00:00Z\nderived:\n  modified_files:\n    - x\n    - y\n");
  let r = run(root, ["--query", "zephyr widget"]);
  assert.deepEqual(r.rows[0].slice(4, 8), ["shipped", "2026-09-17T10:00:00Z", "live", "x;y"]);
  assert.equal(r.rows[0].length, 9);
  assert.equal(r.rows[1][7], "");
  assert.equal(withDb(root, (database) => JSON.stringify(database.prepare("SELECT * FROM files ORDER BY path").all())), filesBefore);
  telemetry(root, "doc/specs/a.yaml", "status: in_progress\nshipped_at: 2026-09-18T10:00:00Z\n");
  r = run(root, ["--query", "zephyr widget"]);
  assert.deepEqual(r.rows[0].slice(4, 8), ["in_progress", "2026-09-18T10:00:00Z", "live", "missing"]);
  telemetry(root, "doc/specs/a.yaml", "status: [unclosed\n");
  r = run(root, ["--query", "zephyr widget"]);
  assert.equal(r.status, 0);
  assert.deepEqual(r.rows[0].slice(4, 8), ["", "", "live", ""]);
  assert.match(r.stderr, /a\.yaml/);
});

test("6b: files cell is the AC fixture - present paths kept, gone paths dropped, no list is missing", (t) => {
  const root = gitRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/specs/a.md", "# Alpha quokka wallaby\n\n**Goal:** quokka.\n");
  write(root, "doc/specs/b.md", "# Beta quokka wallaby\n\n**Goal:** quokka too.\n");
  for (const n of ["one", "two", "three"]) write(root, `doc/specs/filler-${n}.md`, filler(n));
  write(root, "src/x.ts", "export {};\n");
  telemetry(root, "doc/specs/a.yaml", "status: shipped\nderived:\n  modified_files:\n    - src/x.ts\n    - src/gone.ts\n");
  telemetry(root, "doc/specs/b.yaml", "status: shipped\n");
  commit(root);
  const r = run(root, ["--query", "quokka wallaby"]);
  assert.equal(r.status, 0, r.stderr);
  const cells = Object.fromEntries(r.rows.map((row) => [row[1], row[7]]));
  assert.equal(cells["doc/specs/a.md"], "src/x.ts");
  assert.equal(cells["doc/specs/b.md"], "missing");
  for (const row of r.rows) assert.equal(row.length, 9);
});

test("6c: files cell edge cases - order, spaces kept, all gone, non-array, null record", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const yaml = "doc/specs/a.yaml";
  const files = () => run(root, ["--query", "zephyr widget"]).rows[0][7];
  write(root, "b.js", "");
  write(root, "a.js", "");
  write(root, "sp  aced.txt", "");
  telemetry(root, yaml, "status: shipped\nderived:\n  modified_files:\n    - a.js\n    - b.js\n");
  assert.equal(files(), "a.js;b.js");
  write(root, "tab\there.js", "");
  telemetry(root, yaml, 'status: shipped\nderived:\n  modified_files:\n    - a.js\n    - "tab\\there.js"\n');
  assert.equal(files(), "a.js;tab here.js");
  assert.equal(run(root, ["--query", "zephyr widget"]).rows[0].length, 9);
  telemetry(root, yaml, "status: shipped\nderived:\n  modified_files:\n    - 'sp  aced.txt'\n    - 7\n");
  assert.equal(files(), "sp  aced.txt");
  telemetry(root, yaml, "status: shipped\nderived:\n  modified_files:\n    - nope1\n    - nope2\n");
  assert.equal(files(), "");
  telemetry(root, yaml, 'status: shipped\nderived:\n  modified_files: "x"\n');
  assert.equal(files(), "missing");
  telemetry(root, yaml, "");
  assert.equal(files(), "");
  telemetry(root, yaml, "- a\n- b\n");
  assert.equal(files(), "");
});

test("7: query sanitising tolerates embedded quotes", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/specs/q.md", '# Quotes foo"bar ocelot\n\n**Goal:** "plain" ocelot words\n');
  let r = run(root, ["--query", 'foo"bar ocelot']);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(paths(r).includes("doc/specs/q.md"));
  r = run(root, ["--query", '"plain" ocelot']);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(paths(r).includes("doc/specs/q.md"));
});

test("8: one line per hit, nine tab-separated fields, whitespace collapsed", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/specs/t.md", "# Tab\tin\ttitle narwhal manatee\n\n**Goal:** narwhal manatee.\n\nbody narwhal\nline two\twith tab narwhal\r\nmore\n");
  const r = run(root, ["--query", "narwhal manatee"]);
  assert.deepEqual(r.header, HEADER);
  assert.equal(r.rows.length, 1);
  assert.equal(r.rows[0].length, 9);
  assert.equal(r.rows[0][3], "Tab in title narwhal manatee");
});

test("9: state is superseded only for a `- fully` banner in the title block", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const banner = "> **Superseded by:** [doc/specs/a.md](./a.md) - fully";
  write(root, "doc/specs/old-fully.md", `# Old kestrel marmot\n\n${banner}\n\n**Goal:** kestrel marmot.\n`);
  write(root, "doc/specs/old-trailing.md", `# Old trailing\n\n${banner} \n`);
  write(root, "doc/specs/blank-title.md", "# \n\nbody\n");
  write(root, "doc/specs/old-prose.md", `# Old two\n\n> Historical note kept for context.\n${banner}\n`);
  write(root, "doc/specs/old-section.md", '# Old three\n\n> **Superseded by:** [doc/specs/a.md](./a.md) - "Design" section only\n');
  write(root, "doc/specs/old-semicolon.md", `# Old four\n\n${banner}; see also b\n`);
  write(root, "doc/specs/old-fenced.md", `# Old five\n\n\`\`\`markdown\n${banner}\n\`\`\`\n`);
  write(root, "doc/specs/old-h2.md", `# Old six\n\n## History\n\n${banner}\n`);
  write(root, "doc/specs/old-h3.md", `# Old seven\n\n### Detail\n\n${banner}\n`);
  const r = run(root, ["--query", "kestrel marmot"]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.header, HEADER);
  assert.equal(r.header[6], "state");
  assert.deepEqual(paths(r), ["doc/specs/old-fully.md"]);
  assert.equal(r.rows[0][6], "superseded");
  const states = withDb(root, (database) => Object.fromEntries(database.prepare("SELECT path, state FROM specs WHERE path LIKE 'doc/specs/old-%'").all().map((row) => [row.path, row.state])));
  assert.deepEqual(states, {
    "doc/specs/old-fully.md": "superseded",
    "doc/specs/old-trailing.md": "live",
    "doc/specs/old-prose.md": "superseded",
    "doc/specs/old-section.md": "live",
    "doc/specs/old-semicolon.md": "live",
    "doc/specs/old-fenced.md": "live",
    "doc/specs/old-h2.md": "live",
    "doc/specs/old-h3.md": "superseded",
  });
  assert.equal(withDb(root, (database) => database.prepare("SELECT state FROM specs WHERE path = 'doc/specs/a.md'").get().state), "live");
  assert.equal(withDb(root, (database) => database.prepare("SELECT title FROM specs WHERE path = 'doc/specs/blank-title.md'").get().title), "blank-title");
});

test("10: usage errors exit 1, environment errors exit 2", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  assert.equal(run(root, []).status, 1);
  assert.equal(run(root, ["--query", "zephyr widget", "--limit", "0"]).status, 1);
  assert.equal(run(root, ["--query", "zephyr widget", "--limit", "x"]).status, 1);
  assert.equal(run(root, ["--query", "zephyr widget", "--json"]).status, 1);
  assert.equal(run(root, ["--query", "zephyr widget", "--exclude"]).status, 1);
  assert.equal(run(root, ["--query", "a"]).status, 1);
  const bare = mkdtempSync(join(tmpdir(), "gsi-bare-"));
  t.after(() => rmSync(bare, { recursive: true, force: true }));
  assert.equal(run(bare, ["--query", "zephyr widget"]).status, 2);
});

test("11: AC1 fixture - exactly the strong row; no-match and all-common queries return header only", (t) => {
  const root = gitRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const common = (n) => `# Plain spec ${n}\n\n**Goal:** plain goal ${n}.\n\nThe body mentions the common shared vocabulary.\n`;
  write(root, "doc/specs/strong.md", "# Strong heron ibis\n\n**Goal:** heron ibis jackal.\n\nbody\n");
  for (let n = 1; n <= 5; n++) write(root, `doc/specs/p${n}.md`, common(n));
  commit(root);
  const strong = run(root, ["--query", "heron ibis jackal common", "--limit", "10"]);
  assert.equal(strong.status, 0, strong.stderr);
  assert.deepEqual(paths(strong), ["doc/specs/strong.md"]);
  for (const q of ["yeti unicorn", "common shared"]) {
    const r = run(root, ["--query", q]);
    assert.equal(r.status, 0, r.stderr);
    assert.deepEqual(r.header, HEADER);
    assert.deepEqual(r.rows, []);
  }
});

test("12: evidence identity - stem variants of one word are one term", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/specs/cfg.md", "# Configuration lemur index\n\n**Goal:** configure the lemur index.\n\nbody\n");
  for (const q of ["configuration configuration", "Configuration configure", "index indexing"]) {
    const r = run(root, ["--query", q]);
    assert.equal(r.status, 0, r.stderr);
    assert.deepEqual(r.rows, [], q);
  }
  assert.deepEqual(paths(run(root, ["--query", "configuration lemur"])), ["doc/specs/cfg.md"]);
});

test("13: ratio - a row far below the best live score is dropped; an equal pair is kept", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/specs/r1.md", "# Otter pangolin vole yak emu dingo\n\n**Goal:** otter pangolin vole yak emu dingo.\n\nbody\n");
  write(root, "doc/specs/r2.md", "# Otter pangolin service\n\n**Goal:** otter pangolin.\n\nbody\n");
  write(root, "doc/specs/weak-super.md", "# Otter pangolin service archive\n\n> **Superseded by:** [doc/specs/r1.md](./r1.md) - fully\n\n**Goal:** otter pangolin.\n\nbody\n");
  write(root, "doc/specs/e1.md", "# Quail raccoon\n\n**Goal:** quail raccoon.\n\nbody\n");
  write(root, "doc/specs/e2.md", "# Quail raccoon\n\n**Goal:** quail raccoon.\n\nbody\n");
  const r = run(root, ["--query", "otter pangolin vole yak emu dingo"]);
  assert.deepEqual(paths(r), ["doc/specs/r1.md"]);
  const pair = run(root, ["--query", "quail raccoon"]);
  assert.deepEqual(paths(pair).sort(), ["doc/specs/e1.md", "doc/specs/e2.md"]);
  assert.equal(pair.rows[0][0], pair.rows[1][0]);
});

test("14: superseded rows sort after live rows and never set the ratio bar", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/specs/old.md", "# Otter pangolin vole yak emu dingo\n\n> **Superseded by:** [doc/specs/new.md](./new.md) - fully\n\n**Goal:** otter pangolin vole yak emu dingo.\n");
  write(root, "doc/specs/new.md", "# Otter pangolin service\n\n**Goal:** otter pangolin.\n\nbody\n");
  const r = run(root, ["--query", "otter pangolin vole yak emu dingo"]);
  assert.deepEqual(paths(r), ["doc/specs/new.md", "doc/specs/old.md"]);
  assert.deepEqual(r.rows.map((row) => row[6]), ["live", "superseded"]);
  assert.ok(Math.abs(Number(r.rows[1][0])) > Math.abs(Number(r.rows[0][0])));
  assert.deepEqual(paths(run(root, ["--query", "otter pangolin vole yak emu dingo", "--limit", "1"])), ["doc/specs/new.md"]);
  assert.deepEqual(paths(run(root, ["--query", "vole yak"])), ["doc/specs/old.md"]);
});

test("15: --exclude removes a path before the filter so it never sets the bar", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/specs/self.md", "# Sloth tapir vole yak emu dingo\n\n**Goal:** sloth tapir vole yak emu dingo.\n\nbody\n");
  write(root, "doc/specs/pred.md", "# Sloth tapir service\n\n**Goal:** sloth tapir.\n\nbody\n");
  const q = ["--query", "sloth tapir vole yak emu dingo"];
  assert.deepEqual(paths(run(root, q)), ["doc/specs/self.md"]);
  assert.deepEqual(paths(run(root, [...q, "--exclude", "doc/specs/self.md"])), ["doc/specs/pred.md"]);
  assert.deepEqual(paths(run(root, [...q, "--exclude", "doc/specs/nope.md"])), ["doc/specs/self.md"]);
});

test("16: punctuation splits into distinct evidence terms and query order does not change rows", (t) => {
  const root = gitRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/specs/cfg.md", "# Configuration lemur index\n\n**Goal:** configure the lemur index.\n\nbody\n");
  write(root, "doc/specs/cf.md", "# Config file lynx\n\n**Goal:** config file.\n\nbody\n");
  for (let n = 1; n <= 5; n++) write(root, `doc/specs/p${n}.md`, `# Plain spec ${n}\n\n**Goal:** plain goal ${n}.\n\nthe plain body\n`);
  commit(root);
  const common = run(root, ["--query", "the-lemur"]);
  assert.equal(common.status, 0, common.stderr);
  assert.deepEqual(common.header, HEADER);
  assert.deepEqual(common.rows, []);
  const distinct = run(root, ["--query", "configuration-lemur"]);
  assert.equal(distinct.status, 0, distinct.stderr);
  assert.deepEqual(paths(distinct), ["doc/specs/cfg.md"]);
  assert.deepEqual(paths(run(root, ["--query", "config config-file"])), paths(run(root, ["--query", "config-file config"])));
});

test("21: three-spec corpus, no match - header only plus the small-corpus note", (t) => {
  const root = gitRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const n of ["one", "two", "three"]) write(root, `doc/specs/filler-${n}.md`, filler(n));
  commit(root);
  const r = run(root, ["--query", "yeti unicorn"]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.header, HEADER);
  assert.deepEqual(r.rows, []);
  assert.equal(r.stderr, `gauntlet-spec-index: specs corpus has 3 documents - ${NOTE}\n`);
});

test("22: MIN_CORPUS boundary - note at N = 9, silent at N = 10, rows unaffected", (t) => {
  const root = boundaryRepo(["one", "two", "three"]);
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const nine = run(root, ["--query", "yeti unicorn"]);
  assert.equal(nine.status, 0, nine.stderr);
  assert.deepEqual(nine.rows, []);
  assert.equal(nine.stderr, `gauntlet-spec-index: specs corpus has 9 documents - ${NOTE}\n`);
  write(root, "doc/specs/filler-four.md", filler("four"));
  commit(root);
  for (const q of ["yeti unicorn", "common shared"]) {
    const r = run(root, ["--query", q]);
    assert.equal(r.status, 0, r.stderr);
    assert.deepEqual(r.header, HEADER);
    assert.deepEqual(r.rows, []);
    assert.equal(r.stderr, "");
  }
  const strong = run(root, ["--query", "heron ibis jackal common", "--limit", "10"]);
  assert.equal(strong.status, 0, strong.stderr);
  assert.deepEqual(paths(strong), ["doc/specs/strong.md"]);
  assert.equal(strong.stderr, "");
});

test("23: n is the table count before --exclude", (t) => {
  const root = boundaryRepo(["one", "two", "three", "four"]);
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const r = run(root, ["--query", "yeti unicorn", "--exclude", "doc/specs/p1.md"]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.header, HEADER);
  assert.deepEqual(r.rows, []);
  assert.equal(r.stderr, "");
});

test("D1: --corpus specs and omitted --corpus are byte-identical; nine columns", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const plain = run(root, ["--query", "zephyr widget"]);
  const explicit = run(root, ["--query", "zephyr widget", "--corpus", "specs"]);
  assert.equal(explicit.status, 0, explicit.stderr);
  assert.equal(explicit.stdout, plain.stdout);
  assert.deepEqual(explicit.header, HEADER);
});

test("D11: unknown --corpus exits 1 with usage", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const r = run(root, ["--query", "zephyr widget", "--corpus", "notes"]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /usage:/);
  assert.equal(run(root, ["--query", "zephyr widget", "--corpus"]).status, 1);
});

test("D12: a schema 2 cache is rebuilt to 3 with both tables present", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  run(root, ["--query", "zephyr widget"]);
  withDb(root, (database) => database.prepare("UPDATE meta SET value = '2' WHERE key = 'schema_version'").run());
  const r = run(root, ["--query", "zephyr widget"]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(withDb(root, (database) => database.prepare("SELECT value FROM meta WHERE key = 'schema_version'").get().value), "3");
  const tables = withDb(root, (database) => database.prepare("SELECT name FROM sqlite_master WHERE name IN ('specs', 'docs') ORDER BY name").all().map((row) => row.name));
  assert.deepEqual(tables, ["docs", "specs"]);
  const cols = withDb(root, (database) => database.prepare("PRAGMA table_info(files)").all().map((row) => row.name));
  assert.deepEqual(cols, ["corpus", "path", "mtime_ms", "size"]);
});

test("D10-specs: a `## ` line inside a code fence is not a heading", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/specs/fenced.md", "# Fenced pelican\n\n**Goal:** pelican.\n\n```markdown\n## Not a heading pelican\n```\n\n## Real heading\n");
  run(root, ["--query", "zephyr widget"]);
  const h = withDb(root, (database) => database.prepare("SELECT headings FROM specs WHERE path = 'doc/specs/fenced.md'").get().headings);
  assert.equal(h, "Real heading");
});

test("D2: docs include defaults and fixed exclusions", (t) => {
  const root = docsRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const r = run(root, ["--corpus", "docs", "--query", "ptarmigan gannet"]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.header, DOCS_HEADER);
  assert.deepEqual(paths(r), ["doc/guide.md"]);
  assert.equal(r.rows[0].length, 4);
  assert.deepEqual(docsPaths(root), ["README.md", ...[1, 2, 3, 4].map((n) => `doc/filler-${n}.md`), "doc/guide.md"]);
  overrides(root, [".pi/**/*.md", ".worktrees/**/*.md", "doc/**/*.md"]);
  assert.equal(run(root, ["--corpus", "docs", "--query", "ptarmigan gannet"]).status, 0);
  assert.deepEqual(docsPaths(root), [".pi/gauntlet-overrides.md", ...[1, 2, 3, 4].map((n) => `doc/filler-${n}.md`), "doc/guide.md"]);
  const two = gitRepo();
  t.after(() => rmSync(two, { recursive: true, force: true }));
  write(two, "doc/x.md", decoy);
  write(two, "doc/y.md", decoy);
  commit(two);
  const tiny = run(two, ["--corpus", "docs", "--query", "ptarmigan gannet"]);
  assert.equal(tiny.status, 0, tiny.stderr);
  assert.deepEqual(tiny.header, DOCS_HEADER);
  assert.deepEqual(tiny.rows, []);
  assert.equal(tiny.stderr, `gauntlet-spec-index: docs corpus has 2 documents - ${NOTE}\n`);
});

test("D3: shared confidence rejects common body-only hits", (t) => {
  const root = gitRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/strong.md", "# Strong heron ibis\n\n## jackal\n\nbody\n");
  for (let n = 1; n <= 5; n++) write(root, `doc/p${n}.md`, `# Plain doc ${n}\n\nThe body mentions the common shared vocabulary.\n`);
  commit(root);
  const r = run(root, ["--corpus", "docs", "--query", "heron ibis jackal common", "--limit", "10"]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(paths(r), ["doc/strong.md"]);
});

test("D4: no cross-corpus leakage", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/guide.md", "# zephyr widget guide\n\n## zephyr widget\n");
  for (let n = 1; n <= 4; n++) write(root, `doc/filler-${n}.md`, docFiller(n));
  assert.deepEqual(paths(run(root, ["--query", "zephyr widget"])), ["doc/specs/a.md", "svc-a/doc/specs/b.md"]);
  const docs = run(root, ["--corpus", "docs", "--query", "zephyr widget"]);
  assert.deepEqual(paths(docs), ["doc/guide.md"]);
  assert.deepEqual(docs.header, DOCS_HEADER);
});

test("D5: independent cache refresh in both directions", (t) => {
  const root = repo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/guide.md", "# Guide\n\n## zephyr widget\n");
  run(root, ["--query", "zephyr widget"]);
  run(root, ["--corpus", "docs", "--query", "zephyr widget"]);
  const files = () => withDb(root, (db) => Object.fromEntries(db.prepare("SELECT corpus, path, mtime_ms FROM files").all().map((r) => [`${r.corpus}:${r.path}`, r.mtime_ms])));
  const before = files();
  utimesSync(join(root, "doc/specs/a.md"), new Date(), new Date(Date.now() + 5000));
  run(root, ["--corpus", "docs", "--query", "zephyr widget"]);
  assert.deepEqual(files(), before);
  run(root, ["--query", "zephyr widget"]);
  assert.notEqual(files()["specs:doc/specs/a.md"], before["specs:doc/specs/a.md"]);
  assert.equal(files()["docs:doc/guide.md"], before["docs:doc/guide.md"]);
  assert.deepEqual(docsPaths(root), ["doc/guide.md"]);
});

test("D6: overrides replace defaults but cannot bypass exclusions", (t) => {
  const root = docsRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "notes/a.md", decoy);
  write(root, "CONTRIBUTING.md", decoy);
  write(root, "svc/CONTRIBUTING.md", decoy);
  write(root, "svc/doc/inner.md", decoy);
  commit(root);
  const search = () => run(root, ["--corpus", "docs", "--query", "ptarmigan gannet"]);
  overrides(root, ["notes/**/*.md"]);
  assert.equal(search().status, 0);
  assert.deepEqual(docsPaths(root), ["notes/a.md"]);
  overrides(root, ["**/*.md"]);
  assert.equal(search().status, 0);
  const all = docsPaths(root);
  for (const p of ["doc/specs/a.md", "docs/specs/b.md", "doc/plans/p.md", "docs/plans/q.md", "node_modules/x/doc/a.md", "build/doc/b.md", "doc/draft.md", ".pi/gauntlet/n.md", ".worktrees/w/doc/g.md"]) assert.ok(!all.includes(p), p);
  assert.ok(all.includes("doc/guide.md"));
  overrides(root, ["CONTRIBUTING.md"]);
  assert.equal(search().status, 0);
  assert.deepEqual(docsPaths(root), ["CONTRIBUTING.md", "svc/CONTRIBUTING.md"]);
  write(root, ".pi/gauntlet-overrides.md", "## Spec index\n\nno bullets here\n");
  assert.equal(search().status, 0);
  assert.ok(docsPaths(root).includes("doc/guide.md"));
  assert.ok(docsPaths(root).includes("svc/doc/inner.md"));
});

test("D6b: overrides file resolution order", (t) => {
  const root = docsRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/gauntlet-overrides.md", "## Spec index\n- docs: `notes/**/*.md`\n");
  write(root, "notes/a.md", decoy);
  const search = () => run(root, ["--corpus", "docs", "--query", "ptarmigan gannet"]);
  assert.equal(search().status, 0);
  assert.deepEqual(docsPaths(root), ["notes/a.md"]);
  write(root, "gauntlet-overrides.md", "## Spec index\n- docs: `other/**/*.md`\n");
  write(root, "other/b.md", decoy);
  assert.equal(search().status, 0);
  assert.deepEqual(docsPaths(root), ["other/b.md"]);
  overrides(root, ["doc/**/*.md"]);
  assert.equal(search().status, 0);
  assert.deepEqual(docsPaths(root), ["doc/filler-1.md", "doc/filler-2.md", "doc/filler-3.md", "doc/filler-4.md", "doc/gauntlet-overrides.md", "doc/guide.md"]);
});

test("D7: heading hits are strong, body-only hits are not", (t) => {
  const root = gitRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/h.md", "# H\n\n## Setup\n\n## Feeding the kudu wombat\n\nprose\n");
  write(root, "doc/b.md", "# B\n\n## Setup\n\nkudu wombat in the body only\n");
  for (let n = 1; n <= 4; n++) write(root, `doc/filler-${n}.md`, docFiller(n));
  commit(root);
  const r = run(root, ["--corpus", "docs", "--query", "kudu wombat"]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(paths(r), ["doc/h.md"]);
});

test("D8: snippet selects heading line or body fallback", (t) => {
  const root = gitRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const longHeading = "Feeding the wandering herds across twelve distant valleys before finally finding the kudu wombat";
  write(root, "doc/h.md", `# H\n\n## Setup\n\n## ${longHeading}\n\nprose\n`);
  write(root, "doc/t.md", "# lynx ocelot title\n\n## Unrelated\n\nbody says lynx ocelot here\n");
  for (let n = 1; n <= 4; n++) write(root, `doc/filler-${n}.md`, docFiller(n));
  commit(root);
  const heading = run(root, ["--corpus", "docs", "--query", "kudu wombat"]);
  assert.deepEqual(paths(heading), ["doc/h.md"]);
  assert.equal(heading.rows[0][3], longHeading);
  const body = run(root, ["--corpus", "docs", "--query", "lynx ocelot"]);
  assert.deepEqual(paths(body), ["doc/t.md"]);
  assert.match(body.rows[0][3], /body says lynx ocelot/);
  assert.doesNotMatch(body.rows[0][3], /[\u0001\u0002]/);
});

test("D9: deleted files and symlinks are skipped, stale rows removed", (t) => {
  const root = docsRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/gone.md", "# Gone\n\n## ptarmigan gannet\n");
  commit(root);
  run(root, ["--corpus", "docs", "--query", "ptarmigan gannet"]);
  assert.ok(docsPaths(root).includes("doc/gone.md"));
  rmSync(join(root, "doc/gone.md"));
  symlinkSync(join(root, "doc/specs/a.md"), join(root, "doc/link.md"));
  symlinkSync(join(root, "doc/nowhere.md"), join(root, "doc/dangling.md"));
  const r = run(root, ["--corpus", "docs", "--query", "ptarmigan gannet"]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(paths(r), ["doc/guide.md"]);
  for (const p of ["doc/gone.md", "doc/link.md", "doc/dangling.md"]) assert.ok(!docsPaths(root).includes(p), p);
  assert.equal(withDb(root, (db) => db.prepare("SELECT count(*) AS c FROM files WHERE corpus = 'docs' AND path = 'doc/gone.md'").get().c), 0);
});

test("D10: fenced headings and shorter nested fences are ignored", (t) => {
  const root = docsRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/f.md", "# F\n\n```\n## kudu wombat\n```\n\nbody\n");
  write(root, "doc/nested.md", "# N\n\n````markdown\n```js\n## inner heading\n```\n## still fenced\n````\n");
  run(root, ["--corpus", "docs", "--query", "ptarmigan gannet"]);
  for (const p of ["doc/f.md", "doc/nested.md"]) assert.equal(withDb(root, (db) => db.prepare("SELECT headings FROM docs WHERE path = ?").get(p).headings), "");
});

test("D13: five-document docs corpus with rare heading terms returns rows and no note", (t) => {
  const root = gitRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "doc/strong.md", "# Strong doc\n\n## heron ibis\n\n## jackal\n\nbody\n");
  for (let n = 1; n <= 4; n++) write(root, `doc/p${n}.md`, `# Plain doc ${n}\n\nThe body mentions the common shared vocabulary.\n`);
  commit(root);
  const r = run(root, ["--corpus", "docs", "--query", "heron ibis jackal common", "--limit", "10"]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(paths(r), ["doc/strong.md"]);
  assert.equal(r.stderr, "");
});
