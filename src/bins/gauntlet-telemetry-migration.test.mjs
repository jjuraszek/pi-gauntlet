import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { parseRecord } from "../../extensions/lib/telemetry-record.ts";

const sourceRoot = new URL("../../", import.meta.url).pathname;
const ref = "refs/telemetry/records";
const prefix = "team/product/brainstorming/";
const legacyDir = ".pi/gauntlet/telemetry";
const record = (id, repo) => `schema: 1\nspec: doc/specs/${id}.md\nrun_id: ${id}\nstatus: shipped\ncreated_at: 2026-01-01\nshipped_at: 2026-01-02\n${repo ? `repo: ${repo}\n` : ""}versions: {pi-gauntlet: 1.0.0}\nderived:\n  modified_files: [code.txt, gone.txt]\n  council:\n    members: {model: {dispatches: 1}}\n`;

function fixture(shipped = false) {
  const scratch = mkdtempSync(join(tmpdir(), "telemetry-migration-"));
  const root = join(scratch, "product");
  const remote = join(scratch, "remote.git");
  const agent = join(scratch, "agent");
  mkdirSync(root); mkdirSync(agent);
  const env = { ...process.env, PI_CODING_AGENT_DIR: agent,
    GIT_CONFIG_GLOBAL: join(scratch, "gitconfig"), GIT_CONFIG_NOSYSTEM: "1",
    GIT_AUTHOR_NAME: "test", GIT_AUTHOR_EMAIL: "test@example.test", GIT_COMMITTER_NAME: "test", GIT_COMMITTER_EMAIL: "test@example.test" };
  writeFileSync(env.GIT_CONFIG_GLOBAL, "");
  const run = (binary, args, extra = {}) => {
    const result = spawnSync(binary, args, { cwd: root, env: { ...env, ...extra }, encoding: "utf8", timeout: 60_000 });
    assert.equal(result.status, 0, `${binary} ${args.join(" ")}: ${result.stderr}`);
    return result;
  };
  const git = (...args) => run("git", args).stdout.trim();
  const cli = (name, args, extra) => run(process.execPath, [join(sourceRoot, shipped ? "bin" : "src/bins", `gauntlet-${name}.mjs`), ...args], extra);
  const write = (path, text) => { mkdirSync(dirname(join(root, path)), { recursive: true }); writeFileSync(join(root, path), text); };
  git("init", "-b", "main"); git("init", "--bare", remote);
  git("remote", "add", "origin", "https://example.test/team/product.git");
  git("config", `url.${remote}.insteadOf`, "https://example.test/team/product.git");
  write("code.txt", "code\n"); git("add", "."); git("-c", "commit.gpgsign=false", "commit", "-m", "initial");
  return { scratch, root, remote, git, cli, write };
}

for (const custom of [false, true]) {
  test(`migration ${custom ? "with an explicit directory" : "with the default directory"} copies schema-1 records once without changing source files or the checkout`, () => {
    const f = fixture(custom);
    const dir = custom ? "archive" : legacyDir;
    const args = ["--migrate", ...(custom ? [dir] : [])];
    const originals = new Map([ ["doc/specs/old.yaml", record("old")], ["doc/specs/known.yaml", record("known", "prior/project")] ]);
    for (const [path, bytes] of originals) f.write(`${dir}/${path}`, bytes);
    f.write(`${dir}/broken.yaml`, "schema: [");
    f.write(`${dir}/other.yaml`, "schema: 2\nspec: other\nrun_id: other\n");
    f.write(`${dir}/ignored.txt`, record("ignored"));
    f.write("code.txt", "staged change\n"); f.git("add", "code.txt");
    const before = [f.git("rev-parse", "HEAD"), f.git("write-tree"), f.git("status", "--porcelain")];
    const localHeads = f.git("show-ref", "--heads");
    assert.match(f.cli("telemetry-seal", args).stdout, /migrated 2 records/);
    const tip = f.git("rev-parse", ref);
    assert.equal(f.git("show-ref", "--heads"), localHeads, "migration must not create a local branch");
    assert.equal(f.git("ls-remote", "--heads", "origin"), "", "migration must not create a remote branch");
    assert.equal(f.git("ls-remote", "origin", "refs/telemetry/*"), `${tip}\t${ref}`);
    assert.equal(f.git("--git-dir", f.remote, "rev-parse", ref), tip);
    assert.deepEqual(f.git("ls-tree", "-r", "--name-only", ref).split("\n"), [...originals.keys()].sort().map(p => prefix + p));
    for (const [path, bytes] of originals) {
      const migrated = parseRecord(f.git("show", `${ref}:${prefix}${path}`));
      assert.deepEqual(migrated, { ...parseRecord(bytes), repo: path.endsWith("known.yaml") ? "prior/project" : "team/product" });
      assert.equal(readFileSync(join(f.root, dir, path), "utf8"), bytes);
    }
    assert.deepEqual([f.git("rev-parse", "HEAD"), f.git("write-tree"), f.git("status", "--porcelain")], before);
    f.cli("telemetry-seal", args);
    assert.equal(f.git("rev-parse", ref), tip, "second migration must not add a commit");
    assert.equal(f.git("--git-dir", f.remote, "rev-parse", ref), tip);
  });
}

test("disabled migration does no branch IO and rejected migration retains the batch for retry", () => {
  const f = fixture();
  f.write(`${legacyDir}/doc/specs/old.yaml`, record("old"));
  f.write(".pi/settings.json", JSON.stringify({ piGauntlet: { telemetry: { enabled: false } } }));
  const trace = join(f.scratch, "disabled.trace");
  writeFileSync(trace, "");
  assert.match(f.cli("telemetry-seal", ["--migrate"], { GIT_TRACE: trace }).stdout, /telemetry disabled/);
  assert.doesNotMatch(readFileSync(trace, "utf8"), /git (?:fetch|push|hash-object|commit-tree|update-ref)/);
  f.write(".pi/settings.json", "{}");
  f.git("remote", "set-url", "--push", "origin", join(f.scratch, "offline.git"));
  assert.match(f.cli("telemetry-seal", ["--migrate"]).stdout, /telemetry: not pushed/);
  const tip = f.git("rev-parse", ref);
  assert.equal(parseRecord(f.git("show", `${ref}:${prefix}doc/specs/old.yaml`)).repo, "team/product");
  assert.equal(readFileSync(join(f.root, legacyDir, "doc/specs/old.yaml"), "utf8"), record("old"));
  f.git("config", "--unset-all", "remote.origin.pushurl");
  f.cli("telemetry-seal", ["--migrate"]);
  assert.equal(f.git("--git-dir", f.remote, "rev-parse", ref), tip);
});

test("legacy and stamped records remain in separate repo groups in every performance table", () => {
  const f = fixture();
  for (const [id, repo] of [["old", undefined], ["other-old", undefined], ["known", "team/product"]]) f.write(`fixtures/${id}.yaml`, record(id, repo));
  const args = ["--dir", "fixtures"];
  const result = JSON.parse(f.cli("performance", [...args, "--json"]).stdout);
  assert.deepEqual(result.runs.map(r => [r.run_id, r.repo]), [["known", "team/product"], ["old", "unknown repo"], ["other-old", "unknown repo"]]);
  assert.deepEqual(result.by_version.map(r => [r.repo, r.n]), [["team/product", 1], ["unknown repo", 2]]);
  assert.deepEqual(result.council.map(r => [r.repo, r.runs]).sort(), [["team/product", 1], ["unknown repo", 2]]);
  const text = f.cli("performance", args).stdout;
  for (const section of [text.split("by version\n")[1].split("\ncouncil\n")[0], text.split("\ncouncil\n")[1]]) {
    assert.match(section, /unknown repo/);
    assert.match(section, /team\/product/);
  }
});

test("migration preserves the files column bytes for the committed checkout corpus", t => {
  const f = fixture();
  const sources = new Map([["doc/specs/example.yaml", record("example")]]);
  const listed = spawnSync("git", ["ls-files", "-z", "--", legacyDir], { cwd: sourceRoot, encoding: "utf8", timeout: 10_000 });
  assert.equal(listed.status, 0, listed.stderr);
  for (const path of listed.stdout.split("\0").filter(path => path.endsWith(".yaml"))) {
    sources.set(relative(legacyDir, path), readFileSync(join(sourceRoot, path), "utf8"));
  }
  const expected = new Map();
  const query = [];
  let i = 0;
  for (const [path, bytes] of sources) {
    const rec = parseRecord(bytes);
    if (!rec) continue;
    f.write(`${legacyDir}/${path}`, bytes);
    const spec = path.replace(/\.yaml$/, ".md");
    // Equal-length unique titles select every record under the index's confidence rule.
    const terms = `Amber${String(i).padStart(4, "0")} Cobalt${String(i++).padStart(4, "0")}`;
    f.write(spec, `# ${terms}\n`); query.push(terms);
    const files = rec.derived.modified_files;
    if (Array.isArray(files)) for (const name of files) {
      if (typeof name === "string" && existsSync(join(sourceRoot, name)) && !existsSync(join(f.root, name))) f.write(name, "existing\n");
    }
    expected.set(spec, Array.isArray(files) ? files.filter(name => typeof name === "string" && (name === "code.txt" || existsSync(join(sourceRoot, name)))).join(";").replace(/[\t\r\n]+/g, " ") : "missing");
  }
  // More than two documents keep the synthetic record selectable after corpus retirement.
  for (let n = 0; n < 3; n++) f.write(`doc/specs/filler${n}.md`, `# Filler ${n}\n`);
  f.cli("telemetry-seal", ["--migrate"]);
  const output = f.cli("spec-index", ["--query", query.join(" "), "--limit", String(expected.size)]).stdout;
  const actual = output.trimEnd().split("\n").slice(1).map(line => { const columns = line.split("\t"); return [columns[1], columns[7]]; });
  const project = entries => [...entries].sort(([a], [b]) => a.localeCompare(b)).map(([path, files]) => `${path}\t${files}\n`).join("");
  assert.equal(project(actual), project(expected), "files column output must be byte-identical to the working-tree record projection");
  assert.equal(f.git("ls-tree", "-r", "--name-only", ref).split("\n").length, expected.size);
  t.diagnostic(`${expected.size} records copied with byte-identical files columns`);
});
