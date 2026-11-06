import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { parse, stringify } from "yaml";
import { trackerRefs } from "../../extensions/lib/telemetry-branch.ts";
import { settlementItems } from "../../extensions/lib/telemetry-leg.ts";

const cli = new URL("./gauntlet-performance.mjs", import.meta.url).pathname;
const invoke = (file, args, env = process.env) => {
  const result = spawnSync(process.execPath, [file, ...args], { encoding: "utf8", env, timeout: 30000 });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
};
const repo = "team/product";
const ticket = key => ({ kind: "ticket", key, outcome: "written" });
const pr = (key, ref) => ({ kind: "pr", key, ticket: ref, outcome: "approved" });
const leg = (skill, session, cost, items, ts = "2026-11-06T12:00:00Z") => ({ repo, skill, session, cost, items, ts, gauntlet_version: "8.2.1" });
const run = (run_id, cost, tickets) => ({ schema: 1, repo, spec: `${run_id}.md`, run_id, sessions: [run_id], tickets, derived: { phases: { implement: { tokens: { cost } } } } });
const corpus = records => {
  const dir = mkdtempSync(join(tmpdir(), "rollup-"));
  records.forEach((record, i) => writeFileSync(join(dir, `${i}.yaml`), stringify(record)));
  return dir;
};
const find = (rows, key, owner = repo) => rows.find(row => row.repo === owner && row.key === key);

test("ticket and PR costs join runs, split batches and isolate repos in text and JSON", () => {
  const dir = corpus([
    run("one", 6, ["#1", "#2"]), run("two", 3, ["team/product#1"]),
    leg("shape-ticket", "shape", 2, [ticket("#1"), ticket(undefined)]),
    leg("check-delivery", "delivery", 2, [ticket("https://example.test/team/product/issues/1"), ticket("#2")]),
    leg("gatekeep-pr", "z", 4, [pr("#10@aaaa", "#1"), pr("#11@bbbb", "#1")], "2026-11-07T12:00:00Z"),
    leg("gatekeep-pr", "a", 1, [pr("#10@cccc", "#1")], "2026-11-07T12:00:00Z"),
    leg("gatekeep-pr", "orphan", 3, [pr("#12@dddd")]),
    leg("gatekeep-pr", "no-run", 1, [pr("#13@eeee", "#3")]),
    run("unjoined", 5, []),
    { ...run("one", 99, ["#1"]), repo: "other/product" },
    { ...leg("shape-ticket", "legacy", 7, [ticket("OLD-1")]), repo: undefined },
  ]);
  const digest = JSON.parse(invoke(cli, ["--dir", dir, "--json"]));
  assert.deepEqual(JSON.parse(invoke(new URL("../../bin/gauntlet-performance.mjs", import.meta.url).pathname, ["--dir", dir, "--json"])), digest);
  const one = find(digest.tickets, `${repo}#1`);
  assert.deepEqual([one.shape, one.run, one.gatekeep, one.delivery, one.total], [1, 6, 5, 1, 13]);
  const two = find(digest.tickets, `${repo}#2`);
  assert.deepEqual([two.shape, two.run, two.gatekeep, two.delivery, two.total], [null, 3, null, 1, 4]);
  const ten = find(digest.prs, `${repo}#10`);
  assert.deepEqual([ten.run, ten.round_costs, ten.total], [3, [1, 2], 6]);
  assert.deepEqual(ten.rounds.map(round => round.session), ["a", "z"]);
  assert.equal(find(digest.prs, `${repo}#11`).run, 3);
  assert.equal(find(digest.prs, `${repo}#12`).run, null);
  assert.equal(find(digest.prs, `${repo}#13`).run, null);
  assert.equal(find(digest.tickets, "other/product#1", "other/product").run, 99);
  assert.equal(find(digest.tickets, "OLD-1", "unknown repo").shape, 7);
  assert.deepEqual(digest.unattributed.map(row => [row.key, row.total]).sort(), [[`${repo}#12`, 3], ["shape", 1], ["unjoined", 5]].sort());
  const text = invoke(cli, ["--dir", dir]);
  assert.match(text, /ticket\s+rounds\s+shape\s+run\s+gatekeep\s+delivery\s+total/);
  assert.match(text, /PR\s+rounds\s+run\s+round 1\s+round 2\s+total/);
  assert.match(text, /team\/product#2\s+0\s+-\s+3\.00\s+-\s+1\.00\s+4\.00/);
  assert.match(text, /team\/product#13\s+1\s+-\s+1\.00\s+-\s+1\.00/);
  assert.match(text, /costs: batch and multi-ticket records are split equally across their items; the rounding remainder lands on the last row/);
});

test("three-way shares stay unrounded in JSON and conserve cents across keyed and unattributed rows", () => {
  const dir = corpus([
    leg("shape-ticket", "mixed", 1, [ticket("#1"), ticket("#2"), ticket(undefined)]),
    run("split", 1, ["#1", "#2", "#3"]),
    leg("gatekeep-pr", "batch", 1, [pr("#10@aa", "#3"), pr("#11@bb", "#3"), pr("#12@cc", "#3")]),
    leg("check-delivery", "empty", 2, []),
  ]);
  const digest = JSON.parse(invoke(cli, ["--dir", dir, "--json"]));
  assert.equal(find(digest.tickets, `${repo}#1`).shape, 1 / 3);
  assert.equal(find(digest.unattributed, "mixed").shape, 1 / 3);
  assert.equal(find(digest.unattributed, "empty").delivery, 2);
  assert.equal(find(digest.prs, `${repo}#10`).run, 1 / 9);
  const text = invoke(cli, ["--dir", dir]);
  assert.match(text, /mixed\s+0\.34\s+-\s+-\s+-\s+0\.34/);
  assert.match(text, /team\/product#3\s+0\s+-\s+0\.34\s+1\.00\s+-\s+1\.34/);
  assert.match(text, /team\/product#12\s+1\s+0\.12\s+0\.34\s+0\.46/);
});

test("fractional records for one ticket aggregate before text rounding", () => {
  const dir = corpus([
    leg("shape-ticket", "first", 0.004, [ticket("#1")]),
    leg("shape-ticket", "second", 0.004, [ticket("#1")]),
    run("first", 0.004, ["#1"]), run("second", 0.004, ["#1"]),
    leg("gatekeep-pr", "first", 0.004, [pr("#10@aa", "#1")]),
    leg("gatekeep-pr", "second", 0.004, [pr("#10@bb", "#1")]),
  ]);
  for (const file of [cli, new URL("../../bin/gauntlet-performance.mjs", import.meta.url).pathname]) {
    const digest = JSON.parse(invoke(file, ["--dir", dir, "--json"]));
    const row = find(digest.tickets, `${repo}#1`);
    assert.equal(row.shape, 0.008);
    assert.equal(row.run, 0.008);
    const text = invoke(file, ["--dir", dir]);
    const cells = text.split("\n").find(line => line.includes(`${repo}#1`)).trim().split(/\s+/);
    assert.deepEqual(cells.slice(3), [row.shape.toFixed(2), row.run.toFixed(2), row.gatekeep.toFixed(2), "-", row.total.toFixed(2)]);
    const pull = find(digest.prs, `${repo}#10`);
    const prCells = text.split("\n").find(line => line.includes(`${repo}#10`)).trim().split(/\s+/);
    assert.deepEqual(prCells.slice(3), [pull.run, ...pull.round_costs, pull.total].map(cost => cost.toFixed(2)));
  }
});

test("seal and settlement share tracker refs without treating ordinary URLs as tickets", () => {
  for (const [text, expected] of [
    ["gh-12", "#12"], ["E-12345", "E-12345"], ["#12", "#12"],
    ["team/product#12", "team/product#12"],
    ["https://example.test/team/product/issues/12", "https://example.test/team/product/issues/12"],
    ["https://linear.app/team/issue/ENG-12/title", "https://linear.app/team/issue/ENG-12/title"],
  ]) {
    assert.deepEqual(trackerRefs(`Refs (${text}), then ${text}.`), [expected]);
    assert.equal(settlementItems("shape-ticket", `gauntlet: done settled\n${expected}: written`)[0].key, expected);
  }
  assert.deepEqual(trackerRefs("Docs https://example.test/guide and https://example.test/#12"), []);
});

test("seal stamps ticket refs from spec, branch and sealed commit bodies for rollup", () => {
  const root = mkdtempSync(join(tmpdir(), "rollup-seal-"));
  const env = { ...process.env, GIT_CONFIG_GLOBAL: join(root, "config"), GIT_CONFIG_NOSYSTEM: "1", GIT_AUTHOR_NAME: "test", GIT_AUTHOR_EMAIL: "test@example.test", GIT_COMMITTER_NAME: "test", GIT_COMMITTER_EMAIL: "test@example.test", PI_CODING_AGENT_DIR: join(root, "agent") };
  writeFileSync(env.GIT_CONFIG_GLOBAL, "");
  mkdirSync(env.PI_CODING_AGENT_DIR);
  const git = (...args) => {
    const result = spawnSync("git", ["-C", root, "-c", "commit.gpgsign=false", ...args], { encoding: "utf8", env });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  git("init", "-b", "main");
  git("init", "--bare", join(root, "origin.git"));
  git("remote", "add", "origin", "https://example.test/team/product.git");
  git("config", `url.${join(root, "origin.git")}.insteadOf`, "https://example.test/team/product.git");
  git("commit", "--allow-empty", "-m", "base #999");
  git("switch", "-c", "feature/ENG-2");
  const spec = "doc/specs/2026-11-06-gh-1-example.md";
  mkdirSync(join(root, "doc/specs"), { recursive: true });
  writeFileSync(join(root, spec), "example");
  git("add", spec);
  git("commit", "-m", "implement", "-m", "Refs #3 team/product#4 https://example.test/team/product/issues/5 https://linear.app/team/issue/ENG-6/title Docs https://example.test/guide");
  const pending = join(root, ".git/gauntlet/telemetry", spec.replace(/md$/, "yaml"));
  mkdirSync(join(root, ".git/gauntlet/telemetry/doc/specs"), { recursive: true });
  writeFileSync(pending, stringify({ schema: 1, spec, branch: "feature/ENG-2", run_id: "sealed", status: "in_progress", created_at: "2026-11-06T00:00:00Z", sessions: ["session"], accumulators: { session: { phases: { implement: { tokens: { input: 1, output: 1, cache_read: 0, cache_write: 0, cost: 6 } } } } } }));
  invoke(new URL("./gauntlet-telemetry-seal.mjs", import.meta.url).pathname, ["--worktree", root, "--option", "pr", "--base", "main", "--spec", spec], env);
  const record = parse(git("show", `gauntlet/telemetry:team/product/brainstorming/${spec.replace(/md$/, "yaml")}`));
  assert.equal(record.repo, repo);
  assert.deepEqual(record.tickets, ["#1", "ENG-2", "#3", "team/product#4", "https://example.test/team/product/issues/5", "https://linear.app/team/issue/ENG-6/title"]);
  const digest = JSON.parse(invoke(cli, ["--dir", corpus([record]), "--json"]));
  assert.equal(digest.tickets.length, 6);
  assert.ok(digest.tickets.every(row => row.run === 1));
});
