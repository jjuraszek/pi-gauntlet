import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const seal = new URL("./gauntlet-telemetry-seal.mjs", import.meta.url).pathname;
const library = new URL("../../extensions/lib/telemetry-branch.ts", import.meta.url).href;
const ref = "refs/heads/gauntlet/telemetry";
const prefix = "team/product/brainstorming/doc/specs/";

function fixture() {
  const scratch = mkdtempSync(join(tmpdir(), "telemetry-concurrency-"));
  const origin = join(scratch, "origin.git");
  const first = join(scratch, "first");
  const second = join(scratch, "second");
  const agent = join(scratch, "agent");
  mkdirSync(first);
  mkdirSync(agent);
  const env = {
    ...process.env, PI_CODING_AGENT_DIR: agent,
    GIT_CONFIG_GLOBAL: join(scratch, "gitconfig"), GIT_CONFIG_NOSYSTEM: "1",
    GIT_AUTHOR_NAME: "test", GIT_AUTHOR_EMAIL: "test@example.test",
    GIT_COMMITTER_NAME: "test", GIT_COMMITTER_EMAIL: "test@example.test",
  };
  writeFileSync(env.GIT_CONFIG_GLOBAL, "");
  const run = (root, binary, args, extra = {}) => {
    const result = spawnSync(binary, args, { cwd: root, env: { ...env, ...extra }, encoding: "utf8", timeout: 30_000 });
    assert.equal(result.status, 0, `${binary} ${args.join(" ")}: ${result.stderr}`);
    return result;
  };
  const git = (root, ...args) => run(root, "git", ["-c", "commit.gpgsign=false", ...args]).stdout.trim();
  git(scratch, "init", "--bare", origin);
  git(first, "init", "-b", "main");
  writeFileSync(join(first, "file.txt"), "base\n");
  git(first, "add", ".");
  git(first, "commit", "-m", "initial");
  git(first, "remote", "add", "origin", origin);
  git(first, "push", "origin", "main");
  git(scratch, "clone", "-b", "main", origin, second);
  for (const root of [first, second]) {
    git(root, "remote", "set-url", "origin", "https://example.test/team/product.git");
    git(root, "config", `url.${origin}.insteadOf`, "https://example.test/team/product.git");
  }
  const args = (root, name) => [seal, "--worktree", root, "--option", "pr", "--base", "main", "--spec", `doc/specs/${name}.md`];
  const prepare = (root, name) => {
    const dir = join(root, ".git/gauntlet/telemetry/doc/specs");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${name}.yaml`), `schema: 1\nspec: doc/specs/${name}.md\nrun_id: ${name}\nstatus: in_progress\ncreated_at: 2026-01-01\n`);
  };
  const sealRun = (root, name, extra = {}) => {
    prepare(root, name);
    return run(root, process.execPath, args(root, name), extra);
  };
  const sync = (root, writes = [], extra = {}) => JSON.parse(run(root, process.execPath, ["--input-type=module", "--eval",
    `import { syncTelemetryBranch } from ${JSON.stringify(library)}; console.log(JSON.stringify(syncTelemetryBranch(process.cwd(), new Map(${JSON.stringify(writes)}))));`,
  ], extra).stdout);
  const records = (root) => git(root, "ls-tree", "-r", "--name-only", ref).split("\n");
  return { scratch, origin, first, second, env, run, git, args, prepare, sealRun, sync, records };
}

test("seal with no file or blob reports no telemetry run", () => {
  const f = fixture();
  assert.equal(f.run(f.first, process.execPath, f.args(f.first, "missing")).stdout, "no telemetry run\n");
});

test("seal skips an unparseable file without changing it", () => {
  const f = fixture();
  f.prepare(f.first, "current");
  const source = join(f.first, ".git/gauntlet/telemetry/doc/specs/current.yaml");
  writeFileSync(source, "not a record\n");
  const result = f.run(f.first, process.execPath, f.args(f.first, "current"));
  assert.equal(result.stdout, `telemetry: skipped (unparseable record ${realpathSync(source)})\n`);
  assert.equal(readFileSync(source, "utf8"), "not a record\n");
});

for (const existing of [false, true]) {
  test(`failed seal commit retains its stamped file ${existing ? "with an older tip" : "on first use"}`, () => {
    const f = fixture();
    if (existing) f.sealRun(f.first, "older");
    f.prepare(f.first, "current");
    const source = join(f.first, ".git/gauntlet/telemetry/doc/specs/current.yaml");
    const extra = { GIT_AUTHOR_NAME: "", GIT_AUTHOR_EMAIL: "", GIT_COMMITTER_NAME: "", GIT_COMMITTER_EMAIL: "" };
    const result = f.run(f.first, process.execPath, f.args(f.first, "current"), extra);
    assert.match(result.stdout, /telemetry: not pushed \(.+\); record kept at /);
    const stamped = readFileSync(source, "utf8");
    assert.match(stamped, /status: shipped/);
    const synced = f.sync(f.first, [[`${prefix}current.yaml`, stamped]], extra);
    assert.equal(synced.committed, false, "an older tip does not hold the current bytes");
    assert.equal(synced.ok, false);
    assert.match(f.run(f.first, process.execPath, f.args(f.first, "current")).stdout, /^sealed /);
    assert.equal(existsSync(source), false);
    assert.equal(f.git(f.origin, "show", `${ref}:${prefix}current.yaml`) + "\n", stamped, "retry must not re-stamp");
  });
}

test("failed seal push leaves the branch authoritative for retry", () => {
  const f = fixture();
  f.prepare(f.first, "current");
  const source = join(f.first, ".git/gauntlet/telemetry/doc/specs/current.yaml");
  writeFileSync(join(f.origin, "hooks/pre-receive"), "#!/bin/sh\nexit 1\n", { mode: 0o755 });
  const result = f.run(f.first, process.execPath, f.args(f.first, "current"));
  assert.match(result.stdout, /^telemetry: not pushed \(/);
  assert.ok(result.stdout.endsWith(`); record kept at ${prefix}current.yaml\n`));
  assert.equal(existsSync(source), false, "a failed push keeps bytes on the local branch, not in the file");
  const tip = f.git(f.first, "rev-parse", ref);
  assert.match(f.run(f.first, process.execPath, f.args(f.first, "current")).stdout, /^telemetry: not pushed \(/);
  assert.equal(f.git(f.first, "rev-parse", ref), tip);
  rmSync(join(f.origin, "hooks/pre-receive"));
  assert.match(f.run(f.first, process.execPath, f.args(f.first, "current")).stdout, /^already sealed /);
  assert.equal(f.git(f.origin, "rev-parse", ref), tip);
});

for (const existing of [true, false]) {
  test(`seal retries a ${existing ? "shared-tip" : "first-use orphan"} race without force`, () => {
    const f = fixture();
    if (existing) {
      f.sealRun(f.first, "baseline");
      f.git(f.second, "fetch", "origin", `${ref}:refs/remotes/origin/gauntlet/telemetry`);
    }
    f.prepare(f.first, "first");
    const shim = join(f.scratch, "shim");
    const marker = join(f.scratch, "race-pending");
    const pushes = join(f.scratch, "push-results");
    mkdirSync(shim);
    writeFileSync(marker, "");
    // Advance origin after the loser's fetch but before its push advertises refs.
    writeFileSync(join(shim, "git"), `#!${process.execPath}
const { spawnSync } = require('node:child_process');
const { existsSync, unlinkSync, appendFileSync } = require('node:fs');
const args = process.argv.slice(2);
if (args[0] === 'push' && existsSync(${JSON.stringify(marker)})) {
  unlinkSync(${JSON.stringify(marker)});
  const winner = spawnSync(${JSON.stringify(process.execPath)}, ${JSON.stringify(f.args(f.first, "first"))}, { env: { ...${JSON.stringify(f.env)}, GIT_TRACE: '0' }, encoding: 'utf8' });
  if (winner.status !== 0) process.exit(1);
}
const result = spawnSync('git', args, { env: { ...process.env, PATH: ${JSON.stringify(f.env.PATH)} }, input: require('node:fs').readFileSync(0), encoding: 'utf8' });
if (args[0] === 'push') appendFileSync(${JSON.stringify(pushes)}, result.stdout + result.stderr);
process.stdout.write(result.stdout);
process.stderr.write(result.stderr);
process.exit(result.status ?? 1);
`, { mode: 0o755 });
    const trace = join(f.scratch, "race.trace");
    const result = f.sealRun(f.second, "second", { GIT_TRACE: trace, PATH: `${shim}:${f.env.PATH}` });
    assert.match(result.stdout, /^sealed /);
    assert.doesNotMatch(result.stdout + result.stderr, /not pushed|sync failed/);
    const log = readFileSync(trace, "utf8");
    assert.equal((log.match(/built-in: git push origin /g) ?? []).length, 2, "one rejected push and one retry");
    assert.doesNotMatch(log, /git push .*--force|git push .*\+refs/);
    assert.match(readFileSync(pushes, "utf8"), /\[rejected\].*(?:fetch first|non-fast-forward)/);
    assert.deepEqual(f.records(f.origin), (existing ? ["baseline", "first", "second"] : ["first", "second"]).map((name) => `${prefix}${name}.yaml`));
    assert.equal(f.git(f.second, "rev-parse", ref), f.git(f.origin, "rev-parse", ref));
    assert.equal(f.git(f.origin, "rev-list", "--count", ref), existing ? "3" : "2", "one replay commit, not a merge");
  });
}

for (const recovery of ["refresh", "seal", "leg"]) {
  test(`failed replay retains every stranded record for the next ${recovery}`, () => {
    const f = fixture();
    f.sealRun(f.first, "baseline");
    f.git(f.second, "fetch", "origin", `${ref}:${ref}`);
    // Keep product identity while making both fetch and push unavailable.
    f.git(f.second, "config", "--unset-all", `url.${f.origin}.insteadOf`);
    const offline = join(f.scratch, "offline.git");
    f.git(f.second, "config", `url.${offline}.insteadOf`, "https://example.test/team/product.git");
    for (const name of ["pending-one", "pending-two"]) {
      const result = f.sealRun(f.second, name);
      assert.ok(result.stdout.startsWith("telemetry: not pushed ("));
      assert.ok(result.stdout.endsWith(`); record kept at ${prefix}${name}.yaml\n`));
    }
    const stranded = f.git(f.second, "rev-parse", ref);
    f.sealRun(f.first, "remote-new");
    f.git(f.second, "config", "--unset-all", `url.${offline}.insteadOf`);
    f.git(f.second, "config", `url.${f.origin}.insteadOf`, "https://example.test/team/product.git");
    const reject = join(f.origin, "hooks/pre-receive");
    writeFileSync(reject, "#!/bin/sh\necho rejected-for-test >&2\nexit 1\n", { mode: 0o755 });
    const trace = join(f.scratch, "failure.trace");
    const failure = f.sync(f.second, [], { GIT_TRACE: trace });
    assert.equal(failure.ok, false);
    assert.equal(failure.committed, true);
    assert.equal(failure.pushed, false);
    assert.equal((readFileSync(trace, "utf8").match(/built-in: git push origin /g) ?? []).length, 2);
    assert.notEqual(f.git(f.second, "rev-parse", ref), stranded, "pending commits were replayed before the second rejection");
    const expected = ["baseline", "pending-one", "pending-two", "remote-new"].map((name) => `${prefix}${name}.yaml`);
    assert.deepEqual(f.records(f.second), expected);
    assert.equal(f.git(f.second, "rev-list", "--count", ref), "4");
    rmSync(reject);
    if (recovery === "seal") {
      assert.match(f.sealRun(f.second, "next").stdout, /^sealed /);
      expected.push(`${prefix}next.yaml`);
    } else {
      const writes = recovery === "leg" ? [["team/product/shape-ticket/session.yaml", "skill: shape-ticket\n"]] : [];
      assert.equal(f.sync(f.second, writes).ok, true);
      expected.push(...writes.map(([path]) => path));
    }
    assert.deepEqual(f.records(f.origin), expected.sort());
    assert.equal(f.git(f.second, "rev-parse", ref), f.git(f.origin, "rev-parse", ref));
  });
}

test("replay applies only each pending commit's changes, and the later blob wins", () => {
  const f = fixture();
  const path = `${prefix}shared.yaml`;
  assert.equal(f.sync(f.first, [[path, "original\n"]]).ok, true);
  f.git(f.second, "fetch", "origin", `${ref}:${ref}`);
  f.git(f.second, "remote", "set-url", "--push", "origin", join(f.scratch, "offline.git"));
  assert.equal(f.sync(f.second, [[path, "local-one\n"]]).ok, false);
  assert.equal(f.sync(f.second, [[path, "local-two\n"]]).ok, false);
  assert.equal(f.sync(f.first, [[path, "remote\n"], [`${prefix}remote.yaml`, "keep me\n"]]).ok, true);
  f.git(f.second, "config", "--unset-all", "remote.origin.pushurl");
  assert.equal(f.sync(f.second).ok, true);
  assert.equal(f.git(f.origin, "show", `${ref}:${path}`), "local-two");
  assert.equal(f.git(f.origin, "show", `${ref}:${prefix}remote.yaml`), "keep me");
  assert.equal(f.git(f.origin, "rev-list", "--count", ref), "4");
});
