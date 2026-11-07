import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const seal = new URL("./gauntlet-telemetry-seal.mjs", import.meta.url).pathname;
const legacy = "refs/heads/gauntlet/telemetry";
const destination = "refs/telemetry/records";
const path = name => `team/product/brainstorming/doc/specs/${name}.yaml`;

function fixture(custom = false) {
  const scratch = mkdtempSync(join(tmpdir(), "telemetry-ref-migration-"));
  const root = join(scratch, "product");
  const remote = join(scratch, "remote.git");
  const agent = join(scratch, "agent");
  mkdirSync(root); mkdirSync(agent);
  const env = { ...process.env, PI_CODING_AGENT_DIR: agent,
    GIT_CONFIG_GLOBAL: join(scratch, "gitconfig"), GIT_CONFIG_NOSYSTEM: "1",
    GIT_AUTHOR_NAME: "test", GIT_AUTHOR_EMAIL: "test@example.test",
    GIT_COMMITTER_NAME: "test", GIT_COMMITTER_EMAIL: "test@example.test" };
  writeFileSync(env.GIT_CONFIG_GLOBAL, "");
  const run = (binary, args, options = {}) => spawnSync(binary, args, {
    cwd: root, env, encoding: "utf8", timeout: 30_000, ...options,
  });
  const git = (...args) => {
    const result = run("git", ["-c", "commit.gpgsign=false", ...args]);
    assert.equal(result.status, 0, `${args.join(" ")}: ${result.stderr}`);
    return result.stdout.trim();
  };
  git("init", "-b", "main"); git("init", "--bare", remote);
  git("commit", "--allow-empty", "-m", "initial");
  git("remote", "add", "origin", remote);
  if (custom) {
    const origin = join(scratch, "origin.git");
    git("init", "--bare", origin); git("remote", "set-url", "origin", origin);
    mkdirSync(join(root, ".pi"));
    writeFileSync(join(root, ".pi/settings.json"), JSON.stringify({ piGauntlet: { telemetry: { remote } } }));
  }
  const commit = (records, parent) => {
    const options = { env: { ...env, GIT_INDEX_FILE: join(scratch, "record-index") } };
    const plumbing = (args, input) => {
      const result = run("git", args, { ...options, input });
      assert.equal(result.status, 0, result.stderr);
      return result.stdout.trim();
    };
    plumbing(parent ? ["read-tree", parent] : ["read-tree", "--empty"]);
    for (const [name, bytes] of records) {
      const blob = plumbing(["hash-object", "-w", "--stdin"], bytes);
      plumbing(["update-index", "--add", "--cacheinfo", "100644", blob, name]);
    }
    return plumbing(["-c", "commit.gpgsign=false", "commit-tree", plumbing(["write-tree"]), ...(parent ? ["-p", parent] : []), "-m", "records"]);
  };
  const publish = (ref, oid) => git("push", remote, `${oid}:${ref}`);
  const remoteTip = ref => git("--git-dir", remote, "rev-parse", ref);
  const records = ref => git("--git-dir", remote, "ls-tree", "-r", ref);
  const cli = (flag, extra = {}) => run(process.execPath, [seal, flag], { env: { ...env, ...extra } });
  return { scratch, root, remote, env, run, git, commit, publish, remoteTip, records, cli };
}

function intercept(f, body) {
  const dir = join(f.scratch, "shim");
  mkdirSync(dir);
  const realGit = spawnSync("which", ["git"], { encoding: "utf8" }).stdout.trim();
  const script = join(dir, "git");
  writeFileSync(script, `#!${process.execPath}
const { spawnSync } = require("node:child_process");
const args = process.argv.slice(2);
const git = ${JSON.stringify(realGit)};
${body}
const result = spawnSync(git, args, { stdio: "inherit", env: process.env });
process.exit(result.status ?? 1);
`);
  chmodSync(script, 0o755);
  return { PATH: `${dir}:${process.env.PATH}` };
}

for (const custom of [false, true]) {
  test(`branch migration is lossless and repeatable on ${custom ? "configured remote" : "origin"}`, () => {
    const f = fixture(custom);
    const first = f.commit([[path("old"), "schema: 1\n\n"], [path("odd name"), Buffer.from([0, 255, 10])]]);
    f.publish(legacy, first);
    const checkout = [f.git("rev-parse", "HEAD"), f.git("write-tree"), f.git("status", "--porcelain")];
    const trace = join(f.scratch, "copy.trace");
    let result = f.cli("--migrate-branch", { GIT_TRACE: trace });
    assert.equal(result.status, 0, result.stderr);
    const copied = f.remoteTip(destination);
    assert.equal(copied, first, "first copy preserves history and authorship");
    assert.equal(f.records(destination), f.records(legacy), "first carry preserves paths and bytes");
    assert.match(readFileSync(trace, "utf8"), /--force-with-lease=refs\/telemetry\/records: /);
    assert.equal(f.remoteTip(legacy), first, "migration never deletes the branch");
    result = f.cli("--migrate-branch");
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /carried: 0 records/);
    assert.equal(f.remoteTip(destination), copied, "repeat creates no commit");

    const late = f.commit([[path("late"), "old client\n"]], first);
    f.publish(legacy, late);
    result = f.cli("--retire-branch");
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout + result.stderr, /not carried: team\/product\/brainstorming\/doc\/specs\/late.yaml/);
    assert.equal(f.remoteTip(legacy), late);
    result = f.cli("--migrate-branch");
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /carried: 1 records/);
    assert.equal(f.records(destination), f.records(legacy), "late carry uses legacy OID, not overwritten FETCH_HEAD");
    const carried = f.remoteTip(destination);
    assert.equal(f.git("--git-dir", f.remote, "rev-parse", `${destination}^`), copied);
    assert.equal(f.cli("--migrate-branch").status, 0);
    assert.equal(f.remoteTip(destination), carried);
    assert.deepEqual([f.git("rev-parse", "HEAD"), f.git("write-tree"), f.git("status", "--porcelain")], checkout);
    assert.equal(f.git("branch", "--list", "gauntlet/telemetry"), "");
    if (custom) assert.equal(f.git("ls-remote", "origin"), "", "origin receives nothing");
  });
}

for (const existing of [false, true]) {
  test(`migration unions legacy sources with ${existing ? "an existing" : "no"} destination`, () => {
    const f = fixture();
    const empty = f.cli("--migrate-branch");
    assert.equal(empty.status, 0, empty.stderr);
    assert.match(empty.stdout, /nothing to migrate/);
    const local = f.commit([[path("local [copy]"), "local bytes\n"]]);
    f.git("update-ref", legacy, local);
    const remote = f.commit([[path("remote"), "remote bytes\n"]]);
    f.publish(legacy, remote);
    const dest = f.commit([[path("new"), "destination bytes\n"]]);
    if (existing) f.publish(destination, dest);
    const result = f.cli("--migrate-branch");
    assert.equal(result.status, 0, result.stderr);
    const expected = [["local [copy]", "local bytes"], ["remote", "remote bytes"], ...(existing ? [["new", "destination bytes"]] : [])];
    for (const [name, bytes] of expected) {
      assert.equal(f.git("--git-dir", f.remote, "show", `${destination}:${path(name)}`), bytes);
    }
    assert.equal(f.git("rev-parse", legacy), local);
    assert.equal(f.remoteTip(legacy), remote);
    assert.equal(f.git("--git-dir", f.remote, "rev-parse", `${destination}^`), existing ? dest : remote);
  });
}

for (const pair of [["remote legacy", "destination"], ["local legacy", "destination"], ["remote legacy", "local legacy"]]) {
  test(`migration rejects conflicting bytes in ${pair.join(" and ")}`, () => {
    const f = fixture();
    for (const [index, label] of pair.entries()) {
      const oid = f.commit([[path("conflict"), `variant ${index}\n`]]);
      if (label === "local legacy") f.git("update-ref", legacy, oid);
      else f.publish(label === "remote legacy" ? legacy : destination, oid);
    }
    const refs = f.git("ls-remote", f.remote);
    const localRefs = f.git("show-ref");
    const trace = join(f.scratch, "conflict.trace");
    const result = f.cli("--migrate-branch", { GIT_TRACE: trace });
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, /conflict: team\/product\/brainstorming\/doc\/specs\/conflict.yaml/);
    for (const label of pair) assert.ok(result.stderr.includes(label), result.stderr);
    assert.equal(f.git("ls-remote", f.remote), refs);
    for (const line of localRefs.split("\n")) assert.ok(f.git("show-ref").includes(line));
    assert.doesNotMatch(readFileSync(trace, "utf8"), /built-in: git (push|commit-tree)/);
  });
}

for (const stage of ["ls-remote", "fetch", "push"]) {
  test(`migration fails closed on ${stage} transport failure`, () => {
    const f = fixture();
    const source = f.commit([[path("old"), "bytes\n"]]);
    f.publish(legacy, source);
    const env = intercept(f, `if (args[0] === ${JSON.stringify(stage)}) { console.error("simulated transport failure"); process.exit(7); }`);
    const result = f.cli("--migrate-branch", env);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, /simulated transport failure/);
    assert.equal(f.remoteTip(legacy), source);
    assert.equal(f.git("ls-remote", f.remote, destination), "");
  });
}

for (const custom of [false, true]) {
  test(`retirement deletes only the verified remote branch on ${custom ? "configured remote" : "origin"}`, () => {
    const f = fixture(custom);
    const source = f.commit([[path("old"), "bytes\n"]]);
    f.publish(legacy, source);
    f.git("update-ref", legacy, source);
    f.git("update-ref", "refs/remotes/origin/gauntlet/telemetry", source);
    assert.equal(f.cli("--migrate-branch").status, 0);
    const dest = f.remoteTip(destination);
    const trace = join(f.scratch, "retire.trace");
    const result = f.cli("--retire-branch", { GIT_TRACE: trace });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /retired: gauntlet\/telemetry on /);
    assert.ok(result.stdout.includes(`if git show-ref --verify --quiet ${legacy}; then git branch -D gauntlet/telemetry; fi`));
    assert.ok(result.stdout.includes(`git update-ref -d refs/remotes/${custom ? "telemetry" : "origin"}/gauntlet/telemetry`));
    assert.ok(readFileSync(trace, "utf8").includes(`--force-with-lease=${legacy}:${source}`));
    assert.equal(f.git("ls-remote", f.remote, legacy), "");
    assert.equal(f.remoteTip(destination), dest);
    assert.equal(f.git("rev-parse", legacy), source);
    assert.equal(f.git("rev-parse", "refs/remotes/origin/gauntlet/telemetry"), source);
    const again = f.cli("--retire-branch");
    assert.equal(again.status, 0, again.stderr);
    assert.match(again.stdout, /nothing to retire/);
    f.publish(legacy, source);
    assert.equal(f.cli("--migrate-branch").status, 0);
    assert.equal(f.cli("--retire-branch").status, 0);
  });
}

for (const variant of ["absent destination", "different bytes", "local-only missing", "local-only conflict"]) {
  test(`retirement rejects ${variant} instead of trusting cached or local records`, () => {
    const f = fixture();
    const source = f.commit([[path("old"), "bytes\n"]]);
    f.publish(legacy, source);
    f.git("update-ref", destination, source);
    f.git("update-ref", "refs/telemetry/fetched/origin", source);
    if (variant !== "absent destination") f.publish(destination,
      variant === "different bytes" ? f.commit([[path("old"), "different\n"]]) : source);
    if (variant.startsWith("local-only")) f.git("update-ref", legacy,
      f.commit([[path(variant.endsWith("conflict") ? "old" : "local"), "local bytes\n"]], source));
    const refs = f.git("ls-remote", f.remote);
    const result = f.cli("--retire-branch");
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, variant.endsWith("conflict") || variant === "different bytes" ? /conflict:/ : /not carried:/);
    assert.equal(f.git("ls-remote", f.remote), refs);
  });
}

for (const stage of ["ls-remote", "fetch", "push"]) {
  test(`retirement fails closed on ${stage} failure despite a cached destination`, () => {
    const f = fixture();
    const source = f.commit([[path("old"), "bytes\n"]]);
    f.publish(legacy, source); f.publish(destination, source);
    f.git("update-ref", "refs/telemetry/fetched/origin", source);
    const env = intercept(f, `if (args.includes(${JSON.stringify(stage)}) && (args.includes("push") || args.some(arg => arg.includes(${JSON.stringify(destination)})))) { console.error("simulated destination failure"); process.exit(7); }`);
    const result = f.cli("--retire-branch", env);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, /simulated destination failure/);
    assert.equal(f.remoteTip(legacy), source);
    assert.equal(f.remoteTip(destination), source);
  });
}

test("branch flags reject other modes and seal options", () => {
  const f = fixture();
  for (const mode of ["--migrate-branch", "--retire-branch"]) {
    for (const other of [[mode === "--migrate-branch" ? "--retire-branch" : "--migrate-branch"], ["--migrate"], ["--option", "pr"], ["--base", "HEAD"], ["--spec", "doc/specs/x.md"], ["--leg", "org/repo=abcdef0"]]) {
      const result = f.run(process.execPath, [seal, mode, ...other]);
      assert.equal(result.status, 1, result.stdout + result.stderr);
      assert.match(result.stderr, /usage:/);
    }
  }
});

test("retirement lease leaves a late old-client push intact", () => {
  const f = fixture();
  const source = f.commit([[path("old"), "bytes\n"]]);
  f.publish(legacy, source); f.publish(destination, source);
  const late = f.commit([[path("late"), "late bytes\n"]], source);
  f.publish("refs/test/late", late);
  const env = intercept(f, `if (args.includes("push")) spawnSync(git, ["--git-dir", ${JSON.stringify(f.remote)}, "update-ref", ${JSON.stringify(legacy)}, ${JSON.stringify(late)}]);`);
  const result = f.cli("--retire-branch", env);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /stale info/);
  assert.match(result.stderr, /gauntlet\/telemetry moved since verification - re-run --migrate-branch then --retire-branch/);
  assert.equal(f.remoteTip(legacy), late);
  assert.equal(f.remoteTip(destination), source);
});

for (const existing of [false, true]) {
  test(`migration lease rejects a concurrent ${existing ? "update" : "creation"} without replay`, () => {
    const f = fixture();
    const source = f.commit([[path("old"), "old\n"]]);
    f.publish(legacy, source);
    if (existing) f.publish(destination, f.commit([[path("new"), "new\n"]]));
    const racer = f.commit([[path("racer"), "concurrent bytes\n"]]);
    f.publish("refs/test/racer", racer);
    const env = intercept(f, `if (args[0] === "push") spawnSync(git, ["--git-dir", ${JSON.stringify(f.remote)}, "update-ref", ${JSON.stringify(destination)}, ${JSON.stringify(racer)}]);`);
    const trace = join(f.scratch, "race.trace");
    const result = f.cli("--migrate-branch", { ...env, GIT_TRACE: trace });
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, /stale info/);
    assert.match(result.stderr, /re-run --migrate-branch/);
    assert.equal(f.remoteTip(destination), racer);
    assert.equal(f.remoteTip(legacy), source);
    assert.equal(readFileSync(trace, "utf8").split("\n").filter(line => /built-in: git push/.test(line)).length, 1);
  });
}
