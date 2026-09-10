import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { chmodSync, mkdtempSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const skill = readFileSync(new URL("../skills/linear/SKILL.md", import.meta.url), "utf8");
const match = skill.match(/<!-- linear-download-recovery:start -->\n```bash\n([\s\S]*?)\n```\n<!-- linear-download-recovery:end -->/);
assert.ok(match, "Linear skill must contain the executable download-recovery snippet");

const dir = mkdtempSync(join(tmpdir(), "linear-download-doc-"));
const pkg = join(dir, "linearis");
mkdirSync(join(pkg, "dist", "common"), { recursive: true });
writeFileSync(join(pkg, "package.json"), '{"type":"module"}\n');
writeFileSync(join(pkg, "dist", "main.js"), "#!/usr/bin/env node\n");
chmodSync(join(pkg, "dist", "main.js"), 0o755);
writeFileSync(join(pkg, "dist", "common", "auth.js"), 'export const getApiToken = () => "synthetic-personal-key";\n');
const preload = join(dir, "mock-fetch.mjs");
writeFileSync(preload, `
globalThis.fetch = async (url, options) => {
  if (String(url) !== "https://uploads.linear.app/example/file") throw new Error("unexpected URL");
  if (options.redirect !== "error") throw new Error("redirects must be rejected");
  if (options.headers.Authorization !== "synthetic-personal-key") throw new Error("credential must be resolved and sent bare");
  return new Response(new Uint8Array([80, 68, 70]), { status: 200 });
};
`);
const output = join(dir, "attachment.pdf");
const command = match[1]
  .replace("https://uploads.linear.app/...", "https://uploads.linear.app/example/file")
  .replace("/tmp/attachment", output);
const result = execFileSync("bash", ["-c", command], {
  env: { ...process.env, LINEARIS_BIN: join(pkg, "dist", "main.js"), NODE_OPTIONS: `--import=${preload}` },
  encoding: "utf8",
});
assert.equal(readFileSync(output, "utf8"), "PDF");
assert.equal(statSync(output).size, 3);
assert.ok(!result.includes("synthetic-personal-key"), "recovery must not print the credential");
const foreignHostCommand = match[1]
  .replace("https://uploads.linear.app/...", "https://example.com/file")
  .replace("/tmp/attachment", join(dir, "bad"));
assert.throws(() => execFileSync("bash", ["-c", foreignHostCommand], {
  env: { ...process.env, LINEARIS_BIN: join(pkg, "dist", "main.js"), NODE_OPTIONS: `--import=${preload}` },
  stdio: "pipe",
}), /Command failed/);
console.log("PASS: documented Linear download recovery resolves a bare key, rejects foreign hosts, and verifies bytes");
