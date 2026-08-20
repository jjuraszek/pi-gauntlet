#!/usr/bin/env node
// Repo validator. Runs in CI on every push and as the release gate.
// No external deps: uses only Node built-ins so `npm test` needs no install.
//
// Usage:
//   node scripts/ci.mjs                      # validate repo
//   node scripts/ci.mjs --expect-version X   # also assert package.json == X (tag gate)

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const R = (p) => join(root, p);

const errors = [];
const fail = (msg) => errors.push(msg);
const ok = (msg) => console.log(`  ok  ${msg}`);

const expectIdx = process.argv.indexOf("--expect-version");
const expectVersion = expectIdx !== -1 ? process.argv[expectIdx + 1] : null;

// ---- package.json ----------------------------------------------------------
const pkg = JSON.parse(readFileSync(R("package.json"), "utf8"));

if (!pkg.name) fail("package.json: missing name");
if (!/^\d+\.\d+\.\d+/.test(pkg.version || "")) fail(`package.json: bad version "${pkg.version}"`);
if (pkg.private) fail("package.json: private:true would block publish");
if (!pkg.license) fail("package.json: missing license field");
if (!existsSync(R("LICENSE"))) fail("LICENSE file missing");
if (!existsSync(R("README.md"))) fail("README.md missing (npm shows it on the package page)");

const keywords = pkg.keywords || [];
if (!keywords.includes("pi-package"))
  fail('package.json: keywords must include "pi-package" (drives pi.dev/packages discovery)');
else ok('keyword "pi-package" present');

// files allowlist must ship what the postinstall persona copy needs
const files = pkg.files || [];
if (files.length === 0) {
  fail("package.json: no files allowlist (tarball would ship everything)");
} else {
  for (const need of ["agents", "bin"]) {
    if (!files.includes(need))
      fail(`package.json: files allowlist missing "${need}" (postinstall persona copy would break on npm install)`);
  }
  if (files.includes("agents") && files.includes("bin")) ok("files allowlist ships agents/ + bin/");
}

// pi skills resolve from a non-empty directory
const skillEntries = pkg.pi?.skills;
if (!Array.isArray(skillEntries) || skillEntries.length === 0) {
  fail("package.json: pi.skills missing");
} else {
  for (const rel of skillEntries) {
    const dir = R(rel.replace(/^\.\//, ""));
    if (!existsSync(dir) || !statSync(dir).isDirectory()) fail(`package.json: pi.skills points at missing dir ${rel}`);
    else if (readdirSync(dir).length === 0) fail(`package.json: pi.skills dir ${rel} is empty`);
  }
}

// Extension entrypoints are explicit so Pi never auto-discovers tests or helpers.
const expectedExtensions = [
  "./extensions/phase-tracker.ts",
  "./extensions/plan-tracker.ts",
  "./extensions/verify-before-ship.ts",
];
const extensionEntries = pkg.pi?.extensions;
if (!Array.isArray(extensionEntries) || extensionEntries.length === 0) {
  fail("package.json: pi.extensions missing");
} else {
  const actual = [...extensionEntries].sort();
  const expected = [...expectedExtensions].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`package.json: pi.extensions must be exactly ${expectedExtensions.join(", ")} (got ${extensionEntries.join(", ")})`);
  }
  for (const rel of extensionEntries) {
    const file = R(rel.replace(/^\.\//, ""));
    if (!/\.(ts|js)$/.test(rel) || !existsSync(file) || !statSync(file).isFile()) {
      fail(`package.json: pi.extensions points at invalid extension file ${rel}`);
    }
  }
}
ok("pi manifest resources resolve");

// ---- version consistency: package.json == CHANGELOG top ==------------------
const changelog = readFileSync(R("CHANGELOG.md"), "utf8");
const clMatch = changelog.match(/^##\s+v(\d+\.\d+\.\d+)/m);
if (!clMatch) fail("CHANGELOG.md: no `## vX.Y.Z` heading found");
else if (clMatch[1] !== pkg.version)
  fail(`version drift: package.json ${pkg.version} != CHANGELOG top v${clMatch[1]}`);
else ok(`version aligned: ${pkg.version} == CHANGELOG top`);

if (expectVersion && expectVersion !== pkg.version)
  fail(`tag/version drift: pushed tag v${expectVersion} != package.json ${pkg.version}`);
else if (expectVersion) ok(`tag matches package.json (${pkg.version})`);

// ---- shared AGENTS core: AGENTS.md region == AGENTS.core.md ----------------
{
  const norm = (s) => s.replace(/\r\n/g, "\n").trim();
  const core = norm(readFileSync(R("AGENTS.core.md"), "utf8"));
  const agents = readFileSync(R("AGENTS.md"), "utf8");
  const b = agents.indexOf("<!-- agents-core:begin");
  const e = agents.indexOf("<!-- agents-core:end");
  if (b === -1 || e === -1) fail("AGENTS.md: missing agents-core begin/end markers");
  else if (norm(agents.slice(agents.indexOf("\n", b) + 1, e)) !== core)
    fail("AGENTS.md shared core drifted from AGENTS.core.md (run: node scripts/check-agents-core.mjs --fix)");
  else ok("AGENTS.md shared core matches AGENTS.core.md");
}

// ---- frontmatter on every skill + agent ------------------------------------
const hasFrontmatter = (file, required) => {
  const txt = readFileSync(file, "utf8");
  const m = txt.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return `no YAML frontmatter`;
  for (const field of required) if (!new RegExp(`^${field}:`, "m").test(m[1])) return `missing "${field}"`;
  return null;
};

for (const d of readdirSync(R("skills"))) {
  const skill = R(`skills/${d}/SKILL.md`);
  if (!existsSync(skill)) { fail(`skills/${d}: no SKILL.md`); continue; }
  const err = hasFrontmatter(skill, ["name", "description"]);
  if (err) fail(`skills/${d}/SKILL.md: ${err}`);
}
ok(`${readdirSync(R("skills")).length} skills have frontmatter`);

const agents = readdirSync(R("agents")).filter((f) => f.endsWith(".md"));
for (const a of agents) {
  const err = hasFrontmatter(R(`agents/${a}`), ["name", "description"]);
  if (err) fail(`agents/${a}: ${err}`);
}
ok(`${agents.length} agents have frontmatter`);

// ---- stale rename tokens (post-v4 regression guard) ------------------------
// "superpowers" alone is legit lineage; these renamed identifiers are not.
const forbidden = ["piSuperpowers", "PI_SUPERPOWERS_AGENT_DIR", "superpowers-overrides", "@jjuraszek/pi-superpowers"];
const scanDirs = ["skills", "extensions", "agents", "bin"];
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
});
const hits = [];
for (const base of scanDirs) {
  for (const file of walk(R(base))) {
    const txt = readFileSync(file, "utf8");
    for (const tok of forbidden) if (txt.includes(tok)) hits.push(`${file.replace(root + "/", "")}: "${tok}"`);
  }
}
if (hits.length) fail("stale rename tokens found:\n    " + hits.join("\n    "));
else ok("no stale rename tokens in skills/extensions/agents/bin");

// ---- extension syntax (type-stripped parse) --------------------------------
for (const f of walk(R("extensions")).filter((f) => f.endsWith(".ts"))) {
  try {
    execFileSync(process.execPath, ["--experimental-strip-types", "--check", f], { stdio: "pipe" });
  } catch (e) {
    fail(`${f.replace(root + "/", "")}: syntax error\n    ${String(e.stderr || e).split("\n").slice(0, 3).join("\n    ")}`);
  }
}
ok("extensions parse clean (incl. lib/)");

// ---- resolver unit tests ---------------------------------------------------
try {
  execFileSync(
    process.execPath,
    [
      "--experimental-loader",
      R("extensions/test-support/pi-stubs.mjs"),
      "--test",
      R("extensions/lib/gauntlet-settings.test.ts"),
      R("extensions/lib/phase-tracker-helpers.test.ts"),
      R("extensions/plan-tracker.test.ts"),
      R("extensions/phase-tracker.test.ts"),
      R("extensions/verify-before-ship.test.ts"),
    ],
    { stdio: "pipe" },
  );
  ok("resolver unit tests pass");
} catch (e) {
  fail(`resolver unit tests failed:\n    ${String(e.stdout || e.stderr || e).split("\n").slice(0, 20).join("\n    ")}`);
}

// ---- no ad-hoc settings reads ----------------------------------------------
{
  const offenders = walk(R("extensions"))
    .filter((f) => f.endsWith(".ts"))
    .filter((f) => readFileSync(f, "utf8").includes("pi.settings"))
    .map((f) => f.replace(root + "/", ""));
  if (offenders.length) fail("pi.settings read found (route through the gauntlet-settings helper):\n    " + offenders.join("\n    "));
  else ok("no pi.settings reads in extensions");
}

// ---- Claude Code marketplace (.claude-plugin/) -------------------------------
// Guards the gh-11 allowlist: entries must be specific existing skill dirs with
// valid SKILL.md (existence-checked, not count-hardcoded); scan-leak paths
// (".", "./", "./skills", "./skills/") are banned; exclusivity rests on
// source:"./" + strict:false.
{
  const mpErrorsBefore = errors.length;
  const mpPath = R(".claude-plugin/marketplace.json");
  if (!existsSync(mpPath)) {
    fail(".claude-plugin/marketplace.json missing");
  } else {
    let mp = null;
    let parsed = false;
    try {
      mp = JSON.parse(readFileSync(mpPath, "utf8"));
      parsed = true;
    } catch (e) {
      fail(`.claude-plugin/marketplace.json: invalid JSON (${e.message})`);
    }
    if (parsed && (mp === null || typeof mp !== "object" || Array.isArray(mp))) {
      fail("marketplace.json: must be a JSON object");
      mp = null;
    }
    if (mp) {
      if (mp.name !== "pi-gauntlet") fail(`marketplace.json: name must be "pi-gauntlet" (got ${JSON.stringify(mp.name)})`);
      if (!mp.owner || !mp.owner.name) fail("marketplace.json: missing owner.name");
      if (!mp.description) fail("marketplace.json: missing description");
      const plugins = Array.isArray(mp.plugins) ? mp.plugins : [];
      if (plugins.length !== 1) fail(`marketplace.json: expected exactly 1 plugin, got ${plugins.length}`);
      const plugin = plugins[0] || {};
      if (plugin.name !== "gauntlet") fail(`marketplace.json: plugin name must be "gauntlet" (got ${JSON.stringify(plugin.name)})`);
      if (plugin.source !== "./") fail(`marketplace.json: plugin source must be "./" (got ${JSON.stringify(plugin.source)})`);
      if (plugin.strict !== false) fail("marketplace.json: plugin strict must be false");
      if (!Array.isArray(plugin.agents) || plugin.agents.length !== 0) fail("marketplace.json: plugin agents must be [] (suppresses the default agents/ scan - pi personas are not CC plugin agents)");
      const mpSkills = Array.isArray(plugin.skills) ? plugin.skills : [];
      if (mpSkills.length === 0) fail("marketplace.json: plugin skills must be a non-empty array");
      // These entries re-enable Claude Code's full scan and would leak all skills.
      const scanLeaks = new Set([".", "./", "./skills", "./skills/"]);
      const skillDirs = [];
      for (const entry of mpSkills) {
        if (scanLeaks.has(entry)) {
          fail(`marketplace.json: skills entry "${entry}" would re-enable the full scan (allowlist must name specific skill dirs)`);
          continue;
        }
        const dir = R(entry.replace(/^\.\//, ""));
        if (!existsSync(dir) || !statSync(dir).isDirectory()) {
          fail(`marketplace.json: skills path ${entry} is not a directory`);
          continue;
        }
        const skillFile = join(dir, "SKILL.md");
        if (!existsSync(skillFile)) {
          fail(`marketplace.json: ${entry} has no SKILL.md`);
          continue;
        }
        const err = hasFrontmatter(skillFile, ["name", "description"]);
        if (err) fail(`marketplace.json: ${entry}/SKILL.md: ${err}`);
        else skillDirs.push(dir);
      }
      // Bundle-local reference integrity: every .md path a bundled file mentions
      // must resolve against that file's own directory. Excluded: consumer-repo
      // placeholders that intentionally don't exist here.
      const refExcludedBasenames = new Set(["REVIEW.md", "AGENTS.md", "CLAUDE.md", "SKILL.md", "gauntlet-overrides.md"]);
      const brokenRefs = [];
      for (const dir of skillDirs) {
        for (const file of walk(dir).filter((f) => f.endsWith(".md"))) {
          const txt = readFileSync(file, "utf8");
          for (const m of txt.matchAll(/[A-Za-z0-9_.][A-Za-z0-9_./-]*\.md\b/g)) {
            const ref = m[0].replace(/^\.\//, "");
            const base = ref.split("/").at(-1);
            if (refExcludedBasenames.has(base)) continue;
            if (!existsSync(join(dirname(file), ref))) brokenRefs.push(`${file.replace(root + "/", "")}: "${ref}"`);
          }
        }
      }
      if (brokenRefs.length) fail("marketplace.json: broken bundle-local .md refs:\n    " + brokenRefs.join("\n    "));
      if (errors.length === mpErrorsBefore) {
        ok(`marketplace allowlist valid (${mpSkills.length} skills), bundle refs resolve`);
      }
    }
  }
}

// ---- npm pack contents -----------------------------------------------------
try {
  const out = execFileSync("npm", ["pack", "--dry-run", "--json"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  const packed = JSON.parse(out)[0].files.map((f) => f.path);
  for (const need of ["extensions/lib/gauntlet-settings.ts", "extensions/lib/gauntlet-settings-loader.ts"]) {
    if (!packed.includes(need)) fail(`npm pack: ${need} missing from tarball (extension would fail to load at runtime)`);
  }
  if (!packed.some((f) => f.startsWith("agents/"))) fail("npm pack: no agents/ in tarball");
  if (!packed.some((f) => f.startsWith("bin/"))) fail("npm pack: no bin/ in tarball");
  if (packed.some((f) => f.startsWith("doc/"))) fail("npm pack: doc/ leaked into tarball");
  if (packed.some((f) => f.startsWith(".claude-plugin/"))) fail("npm pack: .claude-plugin/ leaked into tarball (Claude Code marketplace is source-only)");
  ok(`npm pack: ${packed.length} files, agents/ + bin/ present, no doc/ leak`);
} catch (e) {
  fail(`npm pack failed: ${String(e.stderr || e).split("\n")[0]}`);
}

// ---- report ----------------------------------------------------------------
if (errors.length) {
  console.error(`\nFAIL (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`\nPASS: repo valid${expectVersion ? ` for release v${expectVersion}` : ""}`);
