import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { chmodSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import { parse } from "yaml";
import registerTelemetry, { realDeps, type Deps } from "./telemetry.ts";
import { resolveTelemetry } from "./lib/gauntlet-settings.ts";
import { syncTelemetryBranch, TELEMETRY_REF } from "./lib/telemetry-branch.ts";

const originalDepth = process.env.PI_SUBAGENT_DEPTH;
process.env.PI_SUBAGENT_DEPTH = "0";
after(() => {
  if (originalDepth === undefined) delete process.env.PI_SUBAGENT_DEPTH;
  else process.env.PI_SUBAGENT_DEPTH = originalDepth;
});

function session(root: string, deps: Deps) {
  const handlers = new Map<string, ((event: any, ctx: any) => unknown)[]>();
  const transcript: any[] = [];
  registerTelemetry({
    on: (name: string, handler: (event: any, ctx: any) => unknown) => handlers.set(name, [...(handlers.get(name) ?? []), handler]),
    sendMessage: (message: unknown) => transcript.push(message),
  } as any, deps);
  const ctx = { cwd: root, sessionManager: { getBranch: () => [], getSessionId: () => "failure-session" } };
  const emit = async (name: string, event: unknown = {}) => {
    for (const handler of handlers.get(name) ?? []) await handler(event, ctx);
  };
  const say = async (text: string) => {
    const message = { role: "assistant", content: [{ type: "text", text }], usage: { input: 12, output: 4, cost: 0.125 } };
    transcript.push(message);
    await emit("message_end", { message });
    return message;
  };
  return { emit, say, transcript };
}

const settings = (enabled: boolean) => ({
  telemetry: resolveTelemetry({ telemetry: { enabled } }), specDirs: [], planDirs: [], errors: [], versions: { "pi-gauntlet": "8.2.1" },
});

for (const [skill, marker, row] of [
  ["shape-ticket", "done", "#42: written"],
  ["gatekeep-pr", "stuck", "#9@abc123: stuck - checks failed"],
  ["check-delivery", "done", "#42: declined"],
]) {
  test(`${skill} disabled performs no file writes, fetches or pushes`, async () => {
    const calls: unknown[] = [];
    const forbidden = (...args: unknown[]): never => {
      calls.push(args);
      throw new Error("disabled telemetry attempted I/O");
    };
    const h = session(tmpdir(), {
      fs: { readFile: forbidden, exists: forbidden, writeFile: forbidden, rename: forbidden, mkdirp: forbidden, unlink: forbidden },
      git: forbidden, jj: forbidden, telemetryRepo: forbidden, readTelemetryBranch: forbidden, syncTelemetryBranch: forbidden,
      now: () => "2026-11-06T12:34:56Z", settings: () => settings(false),
    });
    await h.emit("session_start");
    await h.emit("input", { source: "interactive", text: `/skill:${skill}` });
    await h.emit("before_agent_start", { messageType: "user", prompt: `<skill name="${skill}" location="/package/skills/${skill}/SKILL.md">` });
    await h.emit("tool_result", { toolName: "read", input: { path: `/package/skills/${skill}/SKILL.md` }, isError: false });
    const message = await h.say(`gauntlet: ${marker} settled\n${row}`);
    await h.emit("agent_settled", { aborted: false });
    await h.emit("session_shutdown");
    assert.deepEqual(calls, []);
    assert.deepEqual(h.transcript, [message]);
  });

  test(`${skill} rejected push preserves settlement and local record with one retry`, async () => {
    const scratch = mkdtempSync(join(tmpdir(), "telemetry-leg-failure-"));
    const root = join(scratch, "product");
    const origin = join(scratch, "origin.git");
    mkdirSync(root);
    const git = (cwd: string, ...args: string[]) => execFileSync("git", ["-C", cwd, "-c", "commit.gpgsign=false", ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
    git(scratch, "init", "--bare", origin);
    git(root, "init", "-b", "feature/example");
    git(root, "config", "user.name", "Leg Tester");
    git(root, "config", "user.email", "leg@example.test");
    git(root, "remote", "add", "origin", "https://example.test/team/product.git");
    git(root, "config", `url.${origin}.insteadOf`, "https://example.test/team/product.git");
    writeFileSync(join(root, "file.txt"), "base\n");
    git(root, "add", "file.txt");
    git(root, "commit", "-m", "initial");
    const head = git(root, "rev-parse", "HEAD");
    const index = readFileSync(join(root, ".git/index"));
    assert.equal(syncTelemetryBranch(root, new Map([["team/product/seed.yaml", "seed: true\n"]])).pushed, true);
    const remoteBefore = git(origin, "rev-parse", TELEMETRY_REF);
    const pushLog = join(scratch, "pushes");
    const fetchLog = join(scratch, "fetches");
    const hook = join(origin, "hooks/pre-receive");
    writeFileSync(hook, `#!/bin/sh\necho push >> '${pushLog}'\necho 'rejected by fixture' >&2\nexit 1\n`);
    chmodSync(hook, 0o755);
    const upload = join(scratch, "upload-pack");
    writeFileSync(upload, `#!/bin/sh\necho fetch >> '${fetchLog}'\nexec git-upload-pack "$@"\n`);
    chmodSync(upload, 0o755);
    git(root, "config", "remote.origin.uploadpack", `'${upload}'`);
    const h = session(root, { ...realDeps, now: () => "2026-11-06T12:34:56Z", settings: () => settings(true) });
    await h.emit("session_start");
    await h.emit("input", { source: "interactive", text: `/skill:${skill}` });
    const text = `gauntlet: ${marker} settled\n${row}`;
    const message = await h.say(text);
    await h.emit("agent_settled", { aborted: false });
    await h.emit("agent_settled", { aborted: false });
    await h.emit("session_shutdown");
    assert.equal(readFileSync(pushLog, "utf8"), "push\npush\n", "initial push and exactly one retry");
    assert.equal(readFileSync(fetchLog, "utf8"), "fetch\nfetch\n", "initial fetch and exactly one replay refresh");
    assert.equal(h.transcript.length, 2);
    assert.deepEqual(h.transcript[0], message);
    assert.equal(message.content[0].text, text, "telemetry must not rewrite the menu outcome");
    assert.equal(h.transcript[1].customType, "telemetry-warning");
    assert.equal(h.transcript[1].display, true);
    assert.match(h.transcript[1].content, /^telemetry: not pushed \(remote: rejected by fixture\s*\)$/);
    const path = `team/product/${skill}/20261106T123456Z-failure-session.yaml`;
    const bytes = git(root, "show", `${TELEMETRY_REF}:${path}`);
    const record = parse(bytes);
    assert.equal(record.cost, 0.125);
    assert.equal(record.items[0].outcome, row.slice(row.indexOf(": ") + 2));
    assert.equal(git(origin, "rev-parse", TELEMETRY_REF), remoteBefore);
    assert.equal(git(root, "rev-parse", "HEAD"), head);
    assert.deepEqual(readFileSync(join(root, ".git/index")), index);
    assert.equal(readFileSync(join(root, "file.txt"), "utf8"), "base\n");
    writeFileSync(hook, "#!/bin/sh\nexit 0\n");
    assert.equal(syncTelemetryBranch(root, new Map()).pushed, true, "next push recovers the retained record without a new settlement");
    assert.equal(git(origin, "show", `${TELEMETRY_REF}:${path}`), bytes);
  });
}
