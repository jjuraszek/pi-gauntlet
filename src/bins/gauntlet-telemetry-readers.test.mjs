import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const branch = new URL("../../extensions/lib/telemetry-branch.ts", import.meta.url).href;
const extension = new URL("../../extensions/telemetry.ts", import.meta.url).href;
const settings = new URL("../../extensions/lib/gauntlet-settings.ts", import.meta.url).href;
const ref = "refs/telemetry/records";
const prefix = "team/product/brainstorming/";
const record = (name) => `schema: 1\nspec: doc/specs/${name}.md\nrun_id: ${name}\nstatus: shipped\ncreated_at: 2026-01-01\nshipped_at: 2026-01-02\nderived:\n  modified_files: [code.txt]\n`;

function fixture(central = false) {
  const scratch = mkdtempSync(join(tmpdir(), "telemetry-readers-"));
  let root = join(scratch, "product");
  const remote = join(scratch, "remote.git");
  const agent = join(scratch, "agent");
  mkdirSync(root); mkdirSync(agent);
  const env = { ...process.env, PI_SUBAGENT_DEPTH: "0", PI_CODING_AGENT_DIR: agent,
    GIT_CONFIG_GLOBAL: join(scratch, "gitconfig"), GIT_CONFIG_NOSYSTEM: "1",
    GIT_AUTHOR_NAME: "test", GIT_AUTHOR_EMAIL: "test@example.test", GIT_COMMITTER_NAME: "test", GIT_COMMITTER_EMAIL: "test@example.test" };
  writeFileSync(env.GIT_CONFIG_GLOBAL, "");
  const run = (binary, args, extra = {}) => {
    const r = spawnSync(binary, args, { cwd: root, env: { ...env, ...extra }, encoding: "utf8", timeout: 45_000 });
    assert.equal(r.status, 0, `${binary} ${args.join(" ")}: ${r.stderr}`);
    return r;
  };
  const git = (...args) => run("git", args).stdout.trim();
  git("init", "-b", "main"); git("init", "--bare", remote);
  git("remote", "add", "origin", "https://example.test/team/product.git");
  git("config", `url.${remote}.insteadOf`, "https://example.test/team/product.git");
  const write = (path, text) => { mkdirSync(dirname(join(root, path)), { recursive: true }); writeFileSync(join(root, path), text); };
  write("code.txt", "code\n");
  for (const name of ["a", "b"]) write(`doc/specs/${name}.md`, "# Zephyr widget\n\n**Goal:** zephyr widget\n");
  for (let n = 0; n < 10; n++) write(`doc/specs/filler${n}.md`, `# Filler ${n}\n`);
  git("add", "."); git("-c", "commit.gpgsign=false", "commit", "-m", "initial");
  const configure = (enabled = true) => write(".pi/settings.json", JSON.stringify({ piGauntlet: { telemetry: { enabled, ...(central ? { remote } : {}) } } }));
  configure();
  const target = central ? remote : "origin";
  const evaluate = (code, extra) => run(process.execPath, ["--no-warnings", "--experimental-loader", new URL("../../extensions/test-support/pi-stubs.mjs", import.meta.url).pathname, "--input-type=module", "--eval", code], extra);
  const sync = (names) => JSON.parse(evaluate(`import { syncTelemetryBranch } from ${JSON.stringify(branch)}; console.log(JSON.stringify(syncTelemetryBranch(process.cwd(), new Map(${JSON.stringify(names.map((name) => [`${prefix}doc/specs/${name}.yaml`, record(name)]))}), ${JSON.stringify(target)})));`).stdout);
  const read = (extra) => JSON.parse(evaluate(`import { readTelemetryBranch } from ${JSON.stringify(branch)}; console.log(JSON.stringify(readTelemetryBranch(process.cwd(), { remote: ${JSON.stringify(target)}, prefix: ${JSON.stringify(prefix)} })));`, extra).stdout);
  const consumer = (name, extra) => {
    if (name === "guard") return evaluate(`
      import register, { realDeps } from ${JSON.stringify(extension)};
      import { resolveTelemetry, planDirsFor } from ${JSON.stringify(settings)};
      const handlers = new Map(), notices = [];
      const telemetry = resolveTelemetry(JSON.parse((await import('node:fs')).readFileSync('.pi/settings.json', 'utf8')).piGauntlet);
      register({ on: (name, fn) => handlers.set(name, [...(handlers.get(name) ?? []), fn]), sendMessage: m => notices.push(m.content) }, { ...realDeps, settings: () => ({ telemetry, specDirs: ['doc/specs'], planDirs: planDirsFor(['doc/specs']), errors: [], versions: {} }) });
      const ctx = { cwd: process.cwd(), sessionManager: { getSessionId: () => 'reader', getBranch: () => [] }, ui: { notify: text => notices.push(text) } };
      const emit = async (name, event) => {
        let result;
        for (const handler of handlers.get(name) ?? []) {
          const next = await handler(event, ctx);
          if (name === 'tool_call' && next) {
            result = next;
            if (result.block) return result;
          }
        }
        return result;
      };
      await emit('session_start', {});
      const phases = Object.fromEntries(['brainstorm', 'plan', 'implement', 'verify', 'ship'].map(p => [p, { status: p === 'brainstorm' ? 'in_progress' : 'pending' }]));
      await emit('tool_result', { toolName: 'phase_tracker', isError: false, details: { action: 'start', phases } });
      const results = [];
      for (const spec of ['a', 'b', 'a']) results.push(await emit('tool_call', { toolName: 'write', input: { path: 'doc/specs/' + spec + '.md' } }));
      console.log(JSON.stringify({ results, notices }));
    `, extra);
    const cli = new URL(`./gauntlet-${name}.mjs`, import.meta.url).pathname;
    return run(process.execPath, [cli, ...(name === "performance" ? ["--json"] : ["--query", "zephyr widget"])], extra);
  };
  const freshClone = () => {
    git("push", "origin", "main");
    const clone = join(scratch, "reader");
    git("clone", "--branch", "main", remote, clone);
    root = clone;
    git("remote", "set-url", "origin", "https://example.test/team/product.git");
    git("config", `url.${remote}.insteadOf`, "https://example.test/team/product.git");
    configure();
  };
  return { scratch, root, remote, target, env, run, git, write, configure, sync, read, consumer, freshClone };
}

for (const central of [false, true]) {
  for (const consumer of ["performance", "spec-index", "guard"]) {
    test(`${consumer} refreshes ${central ? "configured remote" : "origin"}, serves cached records offline and warns once`, () => {
      const f = fixture(central);
      assert.equal(f.sync(["a", "b"]).ok, true);
      f.freshClone();
      const fetchSpec = "+refs/heads/*:refs/remotes/origin/*";
      assert.equal(f.git("config", "--get-all", "remote.origin.fetch"), fetchSpec);
      assert.equal(f.git("for-each-ref", "refs/telemetry/"), "", "a default clone must not fetch telemetry");
      const branches = f.git("branch", "--list", "--all");
      const check = (result) => {
        if (consumer === "performance") assert.deepEqual(JSON.parse(result.stdout).runs.map(r => r.run_id).sort(), ["a", "b"]);
        else if (consumer === "spec-index") {
          const rows = result.stdout.trimEnd().split("\n").slice(1).map(line => line.split("\t"));
          assert.deepEqual(rows.map(row => row[1]).sort(), ["doc/specs/a.md", "doc/specs/b.md"]);
          for (const row of rows) assert.deepEqual(row.slice(4, 8), ["shipped", "2026-01-02", "live", "code.txt"]);
        } else assert.deepEqual(JSON.parse(result.stdout).results.map(r => r?.block), [true, true, true]);
      };
      const trace = join(f.scratch, "online.trace");
      const online = f.consumer(consumer, { GIT_TRACE: trace });
      check(online);
      assert.equal((readFileSync(trace, "utf8").match(/built-in: git fetch /g) ?? []).length, 1);
      assert.equal(f.git("rev-parse", `refs/telemetry/fetched/${central ? "telemetry" : "origin"}`), f.git("--git-dir", f.remote, "rev-parse", ref));
      assert.equal(f.git("branch", "--list", "--all"), branches, "refresh must not create local or remote-tracking branches");
      assert.equal(f.git("config", "--get-all", "remote.origin.fetch"), fetchSpec);
      f.git("config", `url.${join(f.scratch, "missing.git")}.insteadOf`, central ? f.remote : "https://example.test/team/product.git");
      if (!central) f.git("config", "--unset-all", `url.${f.remote}.insteadOf`);
      const offline = f.consumer(consumer);
      check(offline);
      const warning = consumer === "guard" ? JSON.parse(offline.stdout).notices.join("\n") : offline.stderr;
      assert.match(warning, /(?:fetch|refresh).*failed/i);
      assert.equal((warning.match(/(?:warning:|telemetry guard unavailable:)/g) ?? []).length, 1);
      f.git("update-ref", "-d", `refs/telemetry/fetched/${central ? "telemetry" : "origin"}`);
      const empty = f.consumer(consumer);
      if (consumer === "performance") assert.equal(JSON.parse(empty.stdout).runs.length, 0);
      else if (consumer === "guard") assert.deepEqual(JSON.parse(empty.stdout).results, [null, null, null]);
      else assert.doesNotMatch(empty.stdout, /\tshipped\t/);
      assert.match(consumer === "guard" ? JSON.parse(empty.stdout).notices.join("\n") : empty.stderr, /no telemetry ref fetched yet/);
    });
  }
}

for (const rejected of [false, true]) {
  test(`refresh ${rejected ? "retains" : "pushes and refetches"} every pending record and reads only the fetched ref`, () => {
    const f = fixture();
    f.git("remote", "set-url", "--push", "origin", join(f.scratch, "offline.git"));
    assert.equal(f.sync(["a"]).ok, false);
    assert.equal(f.sync(["b"]).ok, false);
    const offline = f.read();
    assert.deepEqual(offline.records, []);
    assert.match(offline.warning, /no telemetry ref fetched yet/);
    f.git("config", "--unset-all", "remote.origin.pushurl");
    if (rejected) writeFileSync(join(f.remote, "hooks/pre-receive"), "#!/bin/sh\necho denied >&2\nexit 1\n", { mode: 0o755 });
    const result = f.read();
    assert.equal(result.records.length, rejected ? 0 : 2);
    if (rejected) assert.match(result.warning, /telemetry: not pushed/);
    else {
      assert.equal(result.warning, undefined);
      assert.deepEqual(result.records.map(r => r.bytes), [record("a"), record("b")]);
    }
    assert.equal(f.git("ls-tree", "-r", "--name-only", ref).split("\n").length, 2);
  });
}

test("explicit --dir reads fixtures without fetching and disabled consumers do no branch IO", () => {
  const f = fixture();
  f.write("fixtures/a.yaml", record("a"));
  const cli = new URL("./gauntlet-performance.mjs", import.meta.url).pathname;
  const trace = join(f.scratch, "bare.trace");
  writeFileSync(trace, "");
  const result = f.run(process.execPath, [cli, "--dir", join(f.root, "fixtures"), "--json"], { GIT_TRACE: trace });
  assert.equal(JSON.parse(result.stdout).runs.length, 1);
  assert.doesNotMatch(readFileSync(trace, "utf8"), /git (?:fetch|push)/);
  f.configure(false);
  for (const consumer of ["performance", "spec-index", "guard"]) {
    const log = join(f.scratch, `${consumer}.trace`);
    // Guarantee a trace exists even if the disabled guard never invokes git.
    writeFileSync(log, "");
    f.consumer(consumer, { GIT_TRACE: log });
    assert.doesNotMatch(readFileSync(log, "utf8"), /git (?:fetch|push|ls-tree|cat-file)/);
  }
});

test("unreachable refresh is bounded by the git runner timeout", () => {
  const f = fixture();
  const shim = join(f.scratch, "shim"); mkdirSync(shim);
  writeFileSync(join(shim, "git"), `#!${process.execPath}\nif (process.argv[2] === 'fetch') setTimeout(() => {}, 60000); else { const r = require('node:child_process').spawnSync('git', process.argv.slice(2), { env: { ...process.env, PATH: ${JSON.stringify(f.env.PATH)} }, encoding: 'utf8' }); process.stdout.write(r.stdout); process.stderr.write(r.stderr); process.exit(r.status ?? 1); }\n`, { mode: 0o755 });
  const start = Date.now();
  const result = f.read({ PATH: `${shim}:${f.env.PATH}` });
  assert.ok(Date.now() - start < 15000, "fetch must stop at the 10-second bound");
  assert.deepEqual(result.records, []);
  assert.match(result.warning, /timed out/);
});
