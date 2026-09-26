  import assert from "node:assert/strict";
  import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
  import { tmpdir } from "node:os";
  import { join } from "node:path";
  import { after, test } from "node:test";
  import registerTelemetry, { realFs, replayBranch, type Deps, type GitResult } from "./telemetry.ts";
  import { DEFAULT_TELEMETRY_BUCKETS } from "./lib/gauntlet-settings.ts";
  import { emptyAccumulators, parseRecord, serializeRecord } from "./lib/telemetry-record.ts";
  import { guardReason } from "./lib/telemetry-ship.ts";


  const originalDepth = process.env.PI_SUBAGENT_DEPTH;
  process.env.PI_SUBAGENT_DEPTH = "0";
  const tempDirs: string[] = [];
  after(() => {
    for (const d of tempDirs) rmSync(d, { recursive: true, force: true });
    if (originalDepth === undefined) delete process.env.PI_SUBAGENT_DEPTH;
    else process.env.PI_SUBAGENT_DEPTH = originalDepth;
  });

  type Handler = (event: any, ctx: any) => unknown;

  function harness(o: { branch?: unknown[]; enabled?: boolean; gitFail?: (args: string[], cwd: string) => GitResult | undefined; jjWorkspace?: boolean; jjFail?: (args: string[], cwd: string) => GitResult | undefined; cwdSub?: string; sessionId?: string; model?: { provider: string; id: string }; thinkingLevel?: string; contextTokens?: number | null; telemetryWarning?: string; telemetryDir?: string } = {}) {
    const root = mkdtempSync(join(tmpdir(), "telemetry-test-"));
    tempDirs.push(root);
    mkdirSync(join(root, "doc/specs"), { recursive: true });
    mkdirSync(join(root, "doc/plans"), { recursive: true });
    mkdirSync(join(root, ".worktrees/x/doc/specs"), { recursive: true });
    const handlers = new Map<string, Handler[]>();
    const gitCalls: string[][] = [];
    const gitCwds: string[] = [];
    const jjCalls: string[][] = [];
    const readFileCalls: string[] = [];
    let clock = Date.parse("2026-09-17T10:00:00Z");
    const deps: Deps = {
      fs: { ...realFs, readFile: (p) => { readFileCalls.push(p); return realFs.readFile(p); } },
      now: () => new Date((clock += 1000)).toISOString().replace(/\.\d{3}Z$/, "Z"),
      git: async (args, cwd) => {
        gitCalls.push(args);
        gitCwds.push(cwd);
        const forced = o.gitFail?.(args, cwd);
        if (forced) return forced;
        if (args[0] === "rev-parse" && args.includes("--git-common-dir") && !args.includes("--show-toplevel")) {
          const primary = /^(.*\/\.worktrees\/[^/]+)(\/|$)/.test(cwd) ? cwd.replace(/\/\.worktrees\/.*$/, "") : cwd === root || cwd.startsWith(root + "/") ? root : cwd.replace(/\/(?:doc|\.pi)(?:\/.*)?$/, "");
          return { code: 0, stdout: `${primary}/.git\n`, stderr: "" };
        }
        if (args[0] === "rev-parse" && args.includes("--path-format=absolute")) {
          const wt = /^(.*\/\.worktrees\/[^/]+)(\/|$)/.exec(cwd)?.[1];
          const primary = cwd === root || cwd.startsWith(root + "/") ? root : cwd.replace(/\/(?:doc|\.pi)(?:\/.*)?$/, "");
          const toplevel = wt ?? primary;
          const gitDir = wt ? `${primary}/.git/worktrees/${wt.split("/").pop()}` : `${primary}/.git`;
          return { code: 0, stdout: `${toplevel}\n${gitDir}\n${primary}/.git\n`, stderr: "" };
        }
        if (args[0] === "rev-parse" && args.includes("--abbrev-ref")) return { code: 0, stdout: "gh-33\n", stderr: "" };
        if (args[0] === "config") return { code: 0, stdout: (args[1] === "user.name" ? "Tester" : "t@example.com") + "\n", stderr: "" };
        if (args[0] === "ls-files") return { code: 0, stdout: "", stderr: "" };
        return { code: 0, stdout: "", stderr: "" };
      },
      settings: () => ({ telemetry: { enabled: o.enabled ?? true, dir: o.telemetryDir ?? ".pi/gauntlet/telemetry", buckets: DEFAULT_TELEMETRY_BUCKETS, warning: o.telemetryWarning }, errors: [], agentOverrides: { implementer: { model: "p/x" } }, versions: { pi: "0.85.1" } }),
      // A plain jj workspace: `jj root` answers the temp root while git rev-parse fails.
      jj: async (args, cwd) => {
        jjCalls.push(args);
        const forced = o.jjFail?.(args, cwd);
        if (forced) return forced;
        if (!o.jjWorkspace) return { code: 1, stdout: "", stderr: "jj stub: not a jj workspace" };
        return shipJj(args, root);
      },
    };
    let branch = o.branch ?? [];
    const ctx = {
      cwd: o.cwdSub ? join(root, o.cwdSub) : root,
      sessionManager: { getBranch: () => branch, getSessionId: () => o.sessionId ?? "s1" },
      model: o.model ?? { provider: "p", id: "m" },
      thinkingLevel: o.thinkingLevel ?? "high",
      getContextUsage: () => ({ tokens: o.contextTokens === undefined ? 1234 : o.contextTokens, contextWindow: 200000, percent: 1 }),
    };
    const pi = { on: (name: string, h: Handler) => handlers.set(name, [...(handlers.get(name) ?? []), h]) };
    registerTelemetry(pi as any, deps);
    const emit = async (name: string, event: unknown) => {
      const out: unknown[] = [];
      for (const h of handlers.get(name) ?? []) out.push(await h(event, ctx));
      return out;
    };
    const recordPath = (spec = "doc/specs/a.md") => join(ctx.cwd, ".pi/gauntlet/telemetry", spec.replace(/\.md$/, ".yaml"));
    const readRecord = (spec?: string) => parseRecord(readFileSync(recordPath(spec), "utf8"))!;
    const gitWrites = () => gitCalls.filter((a) => a[0] === "add" || a[0] === "commit");
    const excludeFile = () => join(root, ".git/info/exclude");
    const bash = async (id: string, command: string, isError = false) => {
      await emit("tool_call", { toolName: "bash", toolCallId: id, input: { command } });
      await emit("tool_result", { toolName: "bash", toolCallId: id, input: { command }, content: [], isError, details: undefined });
    };
    const phaseResult = (action: string, phases: Record<string, unknown>) => emit("tool_result", { toolName: "phase_tracker", toolCallId: "pt", input: {}, content: [], isError: false, details: { action, phases } });
    const writeSpec = async (rel: string, body = "# Spec\n") => {
      writeFileSync(join(root, rel), body);
      await emit("tool_call", { toolName: "write", toolCallId: "w", input: { path: rel, content: body } });
      return emit("tool_result", { toolName: "write", toolCallId: "w", input: { path: rel, content: body }, content: [], isError: false, details: undefined });
    };
    return { root, handlers, emit, gitCalls, gitCwds, jjCalls, readFileCalls, gitWrites, excludeFile, bash, recordPath, readRecord, phaseResult, writeSpec, setBranch: (b: unknown[]) => (branch = b), ctx };
  }

  const P = (over: Record<string, string> = {}) => Object.fromEntries(["brainstorm", "plan", "implement", "verify", "ship"].map((p) => [p, { status: over[p] ?? "pending" }]));

  const JJ_PATCH = [
    "diff --git a/src/a.ts b/src/a.ts",
    "index 1111111..2222222 100644",
    "--- a/src/a.ts",
    "+++ b/src/a.ts",
    "@@ -1,4 +1,12 @@",
    ...Array.from({ length: 10 }, (_, i) => `+added ${i}`),
    "-removed 1",
    "-removed 2",
    " context",
    "diff --git a/test/a.test.ts b/test/a.test.ts",
    "new file mode 100644",
    "index 0000000..3333333",
    "--- /dev/null",
    "+++ b/test/a.test.ts",
    "@@ -0,0 +1,5 @@",
    ...Array.from({ length: 5 }, (_, i) => `+t ${i}`),
    "",
  ].join("\n");

  function shipJj(args: string[], root: string): GitResult {
    if (args[0] === "root") return { code: 0, stdout: root + "\n", stderr: "" };
    if (args.includes("--count")) return { code: 0, stdout: args.some((a) => a.includes('files(~glob:".pi/gauntlet/telemetry/**")')) ? "2\n" : "3\n", stderr: "" };
    if (args.includes("log")) return { code: 0, stdout: "jjbase0001\n", stderr: "" };
    if (args.includes("diff")) return { code: 0, stdout: JJ_PATCH, stderr: "" };
    return { code: 1, stdout: "", stderr: `jj stub: unexpected call ${args.join(" ")}` };
  }

  test("enabled: false registers handlers that no-op", async () => {
    const h = harness({ enabled: false });
    await h.emit("session_start", { type: "session_start", reason: "startup" });
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/a.md");
    assert.equal(existsSync(h.recordPath()), false);
    assert.equal(h.gitWrites().length, 0);
  });

  test("PI_SUBAGENT_DEPTH=1 no-ops every handler", async () => {
    process.env.PI_SUBAGENT_DEPTH = "1";
    try {
      const h = harness();
      await h.phaseResult("start", P({ brainstorm: "in_progress" }));
      await h.writeSpec("doc/specs/a.md");
      assert.equal(existsSync(h.recordPath()), false);
    } finally {
      process.env.PI_SUBAGENT_DEPTH = "0";
    }
  });

  test("bind on first spec write flushes buffered phase event, mints run_id, writes the exclude line, never stages or commits", async () => {
    const h = harness();
    await h.emit("session_start", { type: "session_start", reason: "startup" });
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    assert.equal(existsSync(h.recordPath()), false);
    await h.writeSpec("doc/specs/a.md", "# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing\n");
    const rec = h.readRecord();
    assert.match(rec.run_id, /^[0-9a-f-]{36}$/);
    assert.equal(rec.spec, "doc/specs/a.md");
    assert.equal(rec.branch, "gh-33");
    assert.deepEqual(rec.sessions, ["s1"]);
    assert.deepEqual(rec.author, { name: "Tester", email: "t@example.com" });
    assert.deepEqual(rec.versions, { pi: "0.85.1" });
    assert.deepEqual(rec.agent_overrides, { implementer: { model: "p/x" } });
    assert.equal(rec.events[0].kind, "phase");
    assert.equal(rec.created_at, rec.events[0].ts);
    assert.equal((rec.events[0] as any).model, "p/m");
    assert.equal((rec.events[0] as any).thinking, "high");
    assert.equal(rec.derived.spec_writes.brainstorm?.count, 1);
    await h.phaseResult("substep", P({ brainstorm: "in_progress" }));
    await h.phaseResult("complete", P({ brainstorm: "complete" }));
    const rec2 = h.readRecord();
    assert.equal(rec2.approved_at, rec2.events.at(-1)!.ts);
    assert.equal(h.gitWrites().length, 0, "the recorder never runs git add or git commit");
    assert.equal(readFileSync(h.excludeFile(), "utf8"), ".pi/gauntlet/telemetry/\n");
    await h.phaseResult("reset", P());
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/a.md", "# Spec again\n");
    assert.equal(readFileSync(h.excludeFile(), "utf8"), ".pi/gauntlet/telemetry/\n", "exclude line is written once after rebind");
  });

  test("bind derives approved_at from a buffered brainstorm completion", async () => {
    const h = harness();
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.phaseResult("complete", P({ brainstorm: "complete" }));
    await h.phaseResult("start", P({ brainstorm: "complete", plan: "in_progress" }));
    await h.writeSpec("doc/specs/a.md");
    const rec = h.readRecord();
    assert.equal(rec.events.length, 3);
    assert.equal(rec.approved_at, rec.events[1].ts);
  });

  test("armed plan_check and bound shutdown flush the record without git add or commit", async () => {
    const h = harness();
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    assert.equal(h.gitWrites().length, 0);
    await h.writeSpec("doc/specs/a.md");
    assert.equal(h.gitWrites().length, 0);
    await h.emit("tool_result", { toolName: "plan_check", toolCallId: "pc", input: {}, content: [], isError: false, details: { status: "pass", specPath: join(h.root, "doc/specs/a.md"), planPath: join(h.root, "doc/plans/a.md") } });
    assert.equal(h.gitWrites().length, 0);
    await h.emit("session_shutdown", { type: "session_shutdown", reason: "quit" });
    assert.equal(h.gitWrites().length, 0);
    const rec = h.readRecord();
    assert.deepEqual(Object.keys(rec.accumulators), ["total"]);
  });

  test("session shutdown before binding writes nothing", async () => {
    const h = harness();
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.emit("session_shutdown", { type: "session_shutdown", reason: "quit" });
    assert.equal(existsSync(join(h.root, ".pi")), false);
    assert.equal(h.gitWrites().length, 0);
  });

  test("replayBranch uses the last successful phase snapshot, plan pass, and paired successful spec write", () => {
    const successfulPhases = P({ brainstorm: "complete", plan: "in_progress" });
    const ignoredPhases = P({ brainstorm: "complete", plan: "complete" });
    const replay = replayBranch([
      { type: "message", message: { role: "toolResult", toolName: "phase_tracker", details: { action: "start", phases: P({ brainstorm: "in_progress" }) } } },
      { type: "message", message: { role: "toolResult", toolName: "phase_tracker", details: { action: "start", phases: successfulPhases } } },
      { type: "message", message: { role: "toolResult", toolName: "phase_tracker", details: { phases: ignoredPhases, error: "failed" } } },
      { type: "message", message: { role: "toolResult", toolName: "plan_check", details: { status: "pass", specPath: "/repo/doc/specs/old.md" } } },
      { type: "message", message: { role: "toolResult", toolName: "plan_check", details: { status: "fail", specPath: "/repo/doc/specs/ignored.md" } } },
      { type: "message", message: { role: "toolResult", toolName: "plan_check", details: { status: "pass", specPath: "/repo/doc/specs/a.md" } } },
      { type: "message", message: { role: "assistant", content: [
        { type: "toolCall", id: "w1", name: "write", arguments: { path: "doc/specs/a.md" } },
        { type: "toolCall", id: "w2", name: "write", arguments: { path: "README.md" } },
        { type: "toolCall", id: "w3", name: "write", arguments: { path: "doc/specs/failed.md" } },
      ] } },
      { type: "message", message: { role: "toolResult", toolName: "write", toolCallId: "w1", isError: false } },
      { type: "message", message: { role: "toolResult", toolName: "write", toolCallId: "w2", isError: false } },
      { type: "message", message: { role: "toolResult", toolName: "write", toolCallId: "w3", isError: true } },
    ]);
    assert.deepEqual(replay.phases, successfulPhases);
    assert.equal(replay.gauntletEntered, true);
    assert.equal(replay.planCheckSpec, "/repo/doc/specs/a.md");
    assert.equal(replay.lastSpecWrite, "doc/specs/a.md");
  });

  test("replayBranch: candidates are only taken while armed; reset clears them; edit counts; skip brainstorm resume: binds", () => {
    const write = (id: string, path: string, tool = "write") => [
      { type: "message", message: { role: "assistant", content: [{ type: "toolCall", id, name: tool, arguments: { path } }] } },
      { type: "message", message: { role: "toolResult", toolName: tool, toolCallId: id, isError: false } },
    ];
    const unarmed = replayBranch([
      ...write("w1", "doc/specs/a.md"),
      { type: "message", message: { role: "toolResult", toolName: "plan_check", details: { status: "pass", specPath: "/repo/doc/specs/a.md" } } },
    ]);
    assert.equal(unarmed.gauntletEntered, false);
    assert.equal(unarmed.lastSpecWrite, undefined);
    assert.equal(unarmed.planCheckSpec, undefined);
    const armed = replayBranch([
      ...write("w0", "doc/specs/before.md"),
      { type: "message", message: { role: "toolResult", toolName: "phase_tracker", details: { action: "start", phases: P({ brainstorm: "in_progress" }) } } },
      ...write("w1", "doc/specs/a.md", "edit"),
    ]);
    assert.deepEqual([armed.gauntletEntered, armed.lastSpecWrite], [true, "doc/specs/a.md"]);
    const reset = replayBranch([
      { type: "message", message: { role: "toolResult", toolName: "phase_tracker", details: { action: "start", phases: P({ brainstorm: "in_progress" }) } } },
      ...write("w1", "doc/specs/a.md"),
      { type: "message", message: { role: "toolResult", toolName: "phase_tracker", details: { action: "reset", phases: P() } } },
    ]);
    assert.deepEqual([reset.gauntletEntered, reset.lastSpecWrite], [false, undefined]);
    const resumed = replayBranch([
      { type: "message", message: { role: "toolResult", toolName: "phase_tracker", details: { action: "start", phases: P({ brainstorm: "in_progress" }) } } },
      { type: "message", message: { role: "toolResult", toolName: "phase_tracker", details: { action: "skip", phases: { ...P({ brainstorm: "skipped" }), brainstorm: { status: "skipped", reason: "resume: /repo/doc/specs/a.md" } } } } },
    ]);
    assert.deepEqual([resumed.gauntletEntered, resumed.lastSpecWrite], [true, "/repo/doc/specs/a.md"]);
  });

  test("session_start replay binds from plan_check details with no spec write, extends sessions, preserves run_id", async () => {
    const first = harness();
    await first.phaseResult("start", P({ brainstorm: "in_progress" }));
    await first.writeSpec("doc/specs/a.md");
    const runId = first.readRecord().run_id;
    const second = harness({ sessionId: "s2", branch: [
      { type: "message", message: { role: "toolResult", toolName: "phase_tracker", toolCallId: "0", isError: false, details: { action: "start", phases: P({ brainstorm: "in_progress" }) } } },
      { type: "message", message: { role: "toolResult", toolName: "phase_tracker", toolCallId: "1", isError: false, details: { action: "skip", phases: P({ brainstorm: "skipped", plan: "in_progress" }) } } },
      { type: "message", message: { role: "toolResult", toolName: "plan_check", toolCallId: "2", isError: false, details: { status: "pass", planPath: join(first.root, "doc/plans/a.md"), specPath: join(first.root, "doc/specs/a.md"), planSha256: "x", specSha256: "y" } } },
    ] });
    // point the second harness at the first root
    second.ctx.cwd = first.root;
    await second.emit("session_start", { type: "session_start", reason: "resume" });
    const rec = parseRecord(readFileSync(first.recordPath(), "utf8"))!;
    assert.equal(rec.run_id, runId);
    assert.deepEqual(rec.sessions, ["s1", "s2"]);
    assert.equal(rec.events.length, 1, "replay emits no duplicate events");
  });

  test("rename at spec-writing: write to a new spec while the bound one is a draft rebinds and moves the record", async () => {
    const h = harness();
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/draft.md", "# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing\n");
    const runId = h.readRecord("doc/specs/draft.md").run_id;
    await h.writeSpec("doc/specs/final.md", "# Final\n");
    assert.equal(existsSync(h.recordPath("doc/specs/draft.md")), false);
    const rec = h.readRecord("doc/specs/final.md");
    assert.equal(rec.run_id, runId);
    assert.equal(rec.spec, "doc/specs/final.md");
    assert.ok(rec.events.some((e) => e.kind === "spec_renamed"));
    await h.phaseResult("complete", P({ brainstorm: "complete" }));
    assert.equal(h.gitWrites().length, 0);
  });

  test("rename refuses an untracked destination collision and keeps the draft binding", async () => {
    const h = harness();
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/draft.md", "# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing\n");
    writeFileSync(h.recordPath("doc/specs/final.md"), "existing\n");
    await h.writeSpec("doc/specs/final.md", "# Final\n");
    const rec = h.readRecord("doc/specs/draft.md");
    assert.equal(rec.spec, "doc/specs/draft.md");
    assert.equal(readFileSync(h.recordPath("doc/specs/final.md"), "utf8"), "existing\n");
    assert.deepEqual(rec.events.filter((e) => e.kind === "warning").map((e: any) => e.message), ["record move skipped: .pi/gauntlet/telemetry/doc/specs/final.yaml already exists"]);
  });

  test("rename refuses a tracked destination collision and keeps the draft binding", async () => {
    const h = harness({ gitFail: (args) => args[0] === "ls-files" && args.at(-1)?.endsWith("final.yaml") ? { code: 0, stdout: args.at(-1)! + "\n", stderr: "" } : undefined });
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/draft.md", "# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing\n");
    writeFileSync(h.recordPath("doc/specs/final.md"), "tracked existing\n");
    await h.writeSpec("doc/specs/final.md", "# Final\n");
    const rec = h.readRecord("doc/specs/draft.md");
    assert.equal(rec.spec, "doc/specs/draft.md");
    assert.equal(readFileSync(h.recordPath("doc/specs/final.md"), "utf8"), "tracked existing\n");
    assert.ok(rec.events.some((e) => e.kind === "warning" && (e as any).message.endsWith("already exists")));
  });

  test("telemetry resolver warning is emitted once while its fallback directory is used", async () => {
    const message = "telemetry.dir must be a non-empty path relative to the git toplevel; using the default";
    const h = harness({ telemetryWarning: message, telemetryDir: ".pi/gauntlet/telemetry" });
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/a.md");
    await h.writeSpec("doc/specs/a.md", "# Again\n");
    assert.equal(existsSync(h.recordPath()), true);
    assert.deepEqual(h.readRecord().events.filter((e) => e.kind === "warning").map((e: any) => e.message), [message]);
  });

  test("phase reset unbinds; the next write to the same path continues the same record", async () => {
    const h = harness();
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/a.md");
    const runId = h.readRecord().run_id;
    await h.phaseResult("reset", P());
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/a.md");
    const rec = h.readRecord();
    assert.equal(rec.run_id, runId);
    assert.deepEqual(rec.events.map((e) => e.kind), ["phase", "phase", "phase"]);
    assert.equal((rec.events[1] as any).action, "reset");
  });

  test("a spec outside any checkout warns once bound; nothing is written for it", async () => {
    const outside = mkdtempSync(join(tmpdir(), "telemetry-outside-"));
    tempDirs.push(outside);
    const outsideSpec = join(outside, "doc/specs/outside.md");
    const nogit = harness({ gitFail: (args, cwd) => (args[0] === "rev-parse" && cwd.startsWith(outside) ? { code: 128, stdout: "", stderr: "fatal: not a git repository" } : undefined) });
    await nogit.phaseResult("start", P({ brainstorm: "in_progress" }));
    await nogit.emit("tool_result", { toolName: "write", toolCallId: "outside", input: { path: outsideSpec }, content: [], isError: false, details: undefined });
    await nogit.writeSpec("doc/specs/a.md");
    assert.deepEqual(nogit.readRecord().events.filter((e) => e.kind === "warning").map((e: any) => e.message), [`spec ${outsideSpec} is outside a git checkout; telemetry not recorded`]);
  });

  test("failed git-common-dir lookup warns in the record", async () => {
    const h = harness({ gitFail: (args) => args.includes("--git-common-dir") && !args.includes("--show-toplevel") ? { code: 1, stdout: "", stderr: "unsupported flag\nmore detail" } : undefined });
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/a.md");
    assert.deepEqual(h.readRecord().events.filter((e) => e.kind === "warning").map((e: any) => e.message), ["exclude skipped: git rev-parse --git-common-dir failed: unsupported flag"]);
  });

  test("jj-bound checkout: record is written with no warning, no exclude line, and no git add/commit", async () => {
    const h = harness({
      jjWorkspace: true,
      gitFail: (args) =>
        args[0] === "rev-parse" && args.includes("--path-format=absolute")
          ? { code: 128, stdout: "", stderr: "fatal: not a git repository" }
          : undefined,
    });
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/a.md");
    await h.phaseResult("complete", P({ brainstorm: "complete" }));
    const rec = h.readRecord();
    assert.deepEqual(rec.events.filter((e) => e.kind === "warning"), []);
    assert.equal(h.gitWrites().length, 0);
    assert.equal(existsSync(h.excludeFile()), false);
  });

  test("a sealed spec in another checkout leaves the current spec bound", async () => {
    const h = harness();
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/a.md");
    const wt = join(h.root, ".worktrees/x");
    const sealedPath = join(wt, ".pi/gauntlet/telemetry/doc/specs/b.yaml");
    mkdirSync(join(wt, ".pi/gauntlet/telemetry/doc/specs"), { recursive: true });
    writeFileSync(sealedPath, serializeRecord({ ...h.readRecord(), spec: "doc/specs/b.md", status: "shipped", shipped_at: "2026-09-17T18:00:00Z" }));
    const before = readFileSync(sealedPath, "utf8");
    await h.emit("tool_result", { toolName: "write", toolCallId: "w", input: { path: join(wt, "doc/specs/b.md"), content: "# B\n" }, content: [], isError: false, details: undefined });
    await h.phaseResult("complete", P({ brainstorm: "complete" }));
    assert.ok(h.readRecord().events.some((e) => e.kind === "phase" && e.action === "complete"));
    assert.equal(readFileSync(sealedPath, "utf8"), before);
  });

  test("worktree spec from a primary cwd: record keyed under the worktree, exclude written to the common dir (AC 8)", async () => {
    const h = harness();
    await h.emit("session_start", { type: "session_start", reason: "startup" });
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec(".worktrees/x/doc/specs/a.md");
    const wt = join(h.root, ".worktrees/x");
    assert.ok(existsSync(join(wt, ".pi/gauntlet/telemetry/doc/specs/a.yaml")), "record lives under the worktree toplevel");
    assert.equal(existsSync(join(h.root, ".pi/gauntlet")), false, "nothing written under the primary checkout");
    assert.ok(h.gitCwds.every((c) => c === wt || c.startsWith(wt + "/")), "no git call runs in the primary");
    assert.equal(h.gitWrites().length, 0);
    assert.equal(readFileSync(join(h.root, ".git/info/exclude"), "utf8"), ".pi/gauntlet/telemetry/\n", "exclude lands in the primary's common dir");
  });

  test("a spec in another checkout is a fresh bind, never a git mv", async () => {
    for (const tool of ["write", "edit"] as const) {
      const h = harness();
      await h.phaseResult("start", P({ brainstorm: "in_progress" }));
      await h.writeSpec(".worktrees/x/doc/specs/a.md", "# CONTEXT DRAFT - NOT A SPEC - fully replaced at spec-writing\n");
      if (tool === "write") {
        await h.writeSpec("doc/specs/a.md");
      } else {
        writeFileSync(join(h.root, "doc/specs/a.md"), "# Spec\n");
        await h.emit("tool_result", { toolName: "edit", toolCallId: "e", input: { path: "doc/specs/a.md", oldText: "# Old\n", newText: "# Spec\n" }, content: [], isError: false, details: undefined });
      }
      assert.ok(existsSync(h.recordPath("doc/specs/a.md")), `primary record created for ${tool}`);
      assert.ok(existsSync(join(h.root, ".worktrees/x/.pi/gauntlet/telemetry/doc/specs/a.yaml")), `worktree record left in place for ${tool}`);
      assert.equal(h.gitCalls.some((a) => a[0] === "mv"), false);
      assert.equal(h.readRecord("doc/specs/a.md").events.some((e) => e.kind === "spec_renamed"), false);
    }
  });

  test("second session rehydrates all derived accumulators with exactly total and live blocks", async () => {
    const h = harness({ contextTokens: 4321 });
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/a.md");
    await h.phaseResult("complete", P({ brainstorm: "complete" }));
    await h.phaseResult("start", P({ brainstorm: "complete", plan: "in_progress" }));
    await h.emit("input", { type: "input", text: "approve", source: "interactive" });
    await h.emit("message_end", { type: "message_end", message: { role: "assistant", usage: usage(10, 2) } });
    await h.emit("tool_result", subagentResult([{ agent: "implementer", exitCode: 0, model: "p/i", usage: usage(20, 3) }]));
    await h.emit("turn_end", { type: "turn_end", turnIndex: 1, message: {}, toolResults: [] });
    await h.emit("session_compact", { type: "session_compact", reason: "threshold" });
    await h.writeSpec("doc/specs/a.md", "# amended\n");
    await h.phaseResult("complete", P({ brainstorm: "complete", plan: "complete" }));
    await h.phaseResult("start", P({ brainstorm: "complete", plan: "complete", implement: "in_progress" }));
    await h.emit("tool_result", { toolName: "plan_tracker", toolCallId: "pt", input: {}, content: [], isError: false, details: { action: "update", tasks: [{ name: "done", status: "complete" }, { name: "skip", status: "skipped" }] } });
    await h.emit("session_shutdown", { type: "session_shutdown", reason: "quit" });
    let rec = h.readRecord();
    assert.deepEqual(Object.keys(rec.accumulators), ["total"]);
    rec.accumulators.dead = { ...emptyAccumulators(), amendments: 5 };
    writeFileSync(h.recordPath(), serializeRecord(rec));

    const h2 = harness({ sessionId: "s2" });
    h2.ctx.cwd = h.root;
    await h2.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h2.phaseResult("start", P({ brainstorm: "complete", plan: "in_progress" }));
    await h2.writeSpec("doc/specs/a.md");
    rec = h2.readRecord();
    assert.deepEqual(Object.keys(rec.accumulators).sort(), ["s2", "total"]);
    assert.equal(rec.derived.phases.plan?.user_messages, 1);
    assert.equal(rec.derived.phases.plan?.peak_context, 4321);
    assert.equal(rec.derived.phases.plan?.compactions, 1);
    assert.deepEqual(rec.derived.personas.implementer?.tokens, { input: 20, output: 3, cache_read: 0, cache_write: 0, cost: 0 });
    assert.deepEqual(rec.derived.plan, { tasks: 2, complete: 1, failed: 0, skipped: 1 });
    assert.equal(rec.derived.amendments, 7);
  });

  const usage = (input: number, output = 0, cost = 0) => ({ input, output, cacheRead: 0, cacheWrite: 0, totalTokens: input + output, cost: { input: cost, output: 0, cacheRead: 0, cacheWrite: 0, total: cost } });

  test("pre-binding observations merge into the bound record in event order", async () => {
    const h = harness();
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.emit("tool_result", subagentResult([{ agent: "scout", exitCode: 0, usage: usage(10) }]));
    await h.emit("model_select", { type: "model_select", model: { provider: "p", id: "next" } });
    await h.emit("tool_result", { toolName: "plan_check", toolCallId: "pc", input: {}, content: [], isError: false, details: { status: "fail" } });
    const planResult = (status: string, id: string) => h.emit("tool_result", { toolName: "plan_tracker", toolCallId: id, input: { action: "update" }, content: [], isError: false, details: { action: "update", tasks: [{ name: "a", status }] } });
    await planResult("complete", "pt1");
    await planResult("in_progress", "pt2");
    await h.writeSpec("doc/specs/a.md");
    await h.emit("session_shutdown", { type: "session_shutdown", reason: "quit" });
    const rec = h.readRecord();
    assert.equal(rec.derived.personas.scout.dispatches, 1);
    assert.equal(rec.derived.personas.scout.tokens?.input, 10);
    assert.equal(rec.derived.gates.plan_rounds, 1);
    assert.equal(rec.derived.gates.task_reopens, 1);
    assert.equal(rec.events.filter((e) => e.kind === "gate" && (e as any).gate === "task_reopen").length, 1);
    assert.deepEqual(rec.events.map((e) => e.kind), ["phase", "dispatch", "config_change", "plan_check", "gate"]);
  });

  test("pre-binding observations are discarded on shutdown without a telemetry file", async () => {
    const h = harness();
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.emit("tool_result", subagentResult([{ agent: "scout", exitCode: 0, usage: usage(10) }]));
    await h.emit("model_select", { type: "model_select", model: { provider: "p", id: "next" } });
    await h.emit("tool_result", { toolName: "plan_check", toolCallId: "pc", input: {}, content: [], isError: false, details: { status: "fail" } });
    await h.emit("session_shutdown", { type: "session_shutdown", reason: "quit" });
    assert.equal(existsSync(join(h.root, ".pi/gauntlet/telemetry")), false);
  });

  async function boundInPlan(over: Parameters<typeof harness>[0] = {}) {
    const h = harness(over);
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/a.md");
    await h.phaseResult("complete", P({ brainstorm: "complete" }));
    await h.phaseResult("start", P({ brainstorm: "complete", plan: "in_progress" }));
    return h;
  }

  const subagentResult = (results: unknown[], content = "") => ({ toolName: "subagent", toolCallId: "sa", input: {}, content: [{ type: "text", text: content }], isError: false, details: { results } });

  test("subagent results: dispatch events, persona tokens, spec_rounds, reviews, conformance_loops; async results: [] contribute nothing", async () => {
    const h = await boundInPlan();
    await h.emit("tool_result", subagentResult([
      { agent: "implementer", exitCode: 0, model: "p/impl:high", usage: usage(100, 10, 1) },
      { agent: "implementer", exitCode: 1, model: "p/impl:high", usage: usage(50, 5, 0.5) },
      { agent: "spec-summarizer", exitCode: 0, model: "p/s", usage: usage(1) },
      { agent: "code-reviewer", exitCode: 0, model: "p/r", usage: usage(1) },
    ], "- [major] a\n- [minor] b\n- [minor] c"));
    await h.emit("tool_result", subagentResult([]));
    const rec = h.readRecord();
    const dispatches = rec.events.filter((e) => e.kind === "dispatch") as any[];
    assert.equal(dispatches.length, 4);
    assert.deepEqual(dispatches[0], { ts: dispatches[0].ts, session: "s1", phase: "plan", kind: "dispatch", agent: "implementer", model: "p/impl:high" });
    assert.equal(dispatches[1].exit, 1);
    assert.deepEqual(rec.derived.personas.implementer, { dispatches: 2, models: ["p/impl:high"], tokens: { input: 150, output: 15, cache_read: 0, cache_write: 0, cost: 1.5 } });
    assert.equal(rec.derived.gates.spec_rounds, 1);
    assert.deepEqual(rec.derived.reviews?.["code-reviewer"], { dispatches: 1, nonzero_exit: 0, findings: { blocker: 0, major: 1, minor: 2 } });
    assert.equal(rec.derived.conformance_loops, 0);
    assert.deepEqual(rec.derived.phases.plan?.tokens, { input: 152, output: 15, cache_read: 0, cache_write: 0, cost: 1.5 });
  });

  test("conformance-reviewer during verify counts loops and retains the latest open gap count", async () => {
    const h = await boundInPlan();
    await h.phaseResult("complete", P({ brainstorm: "complete", plan: "complete" }));
    await h.phaseResult("start", P({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "in_progress" }));
    await h.emit("tool_result", subagentResult([{ agent: "conformance-reviewer", exitCode: 0, usage: usage(1) }], "Conformance verdict: GAPS\nG1:\n  verdict: MISSING\nG2:\n  verdict: PARTIAL"));
    assert.equal(h.readRecord().derived.conformance_open_gaps, 2);
    await h.emit("tool_result", subagentResult([{ agent: "conformance-reviewer", exitCode: 2, usage: usage(1) }], "Conformance verdict: CONFORMS"));
    const rec = h.readRecord();
    assert.equal(rec.derived.conformance_loops, 2);
    assert.equal(rec.derived.conformance_open_gaps, 0);
    assert.equal(rec.derived.reviews?.["conformance-reviewer"]?.nonzero_exit, 1);
  });

  test("message_end sums assistant usage into the in-progress phase (unphased outside); turn_end tracks peak_context; compaction counts", async () => {
    const h = await boundInPlan({ contextTokens: 5000 });
    await h.emit("message_end", { type: "message_end", message: { role: "assistant", usage: usage(10, 2, 0.1) } });
    await h.emit("message_end", { type: "message_end", message: { role: "user" } });
    await h.emit("message_end", { type: "message_end", message: { role: "assistant", usage: usage(0) } });
    await h.emit("turn_end", { type: "turn_end", turnIndex: 1, message: {}, toolResults: [] });
    await h.emit("session_compact", { type: "session_compact", reason: "threshold" });
    await h.phaseResult("complete", P({ brainstorm: "complete", plan: "complete" }));
    await h.emit("message_end", { type: "message_end", message: { role: "assistant", usage: usage(3) } });
    await h.emit("session_shutdown", { type: "session_shutdown", reason: "quit" });
    const rec = h.readRecord();
    assert.deepEqual(rec.derived.phases.plan?.tokens, { input: 10, output: 2, cache_read: 0, cache_write: 0, cost: 0.1 });
    assert.equal(rec.derived.phases.plan?.peak_context, 5000);
    assert.equal(rec.derived.phases.plan?.compactions, 1);
    assert.deepEqual(rec.derived.phases.unphased?.tokens, { input: 3, output: 0, cache_read: 0, cache_write: 0, cost: 0 });
  });

  test("getContextUsage null tokens -> peak_context omitted", async () => {
    const h = await boundInPlan({ contextTokens: null });
    await h.emit("turn_end", { type: "turn_end", turnIndex: 1, message: {}, toolResults: [] });
    await h.emit("session_shutdown", { type: "session_shutdown", reason: "quit" });
    assert.equal("peak_context" in (h.readRecord().derived.phases.plan ?? {}), false);
  });

  test("input counts user_messages only for plan|implement|verify|ship, only interactive non-slash text", async () => {
    const h = harness();
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/a.md");
    await h.emit("input", { type: "input", text: "hello", source: "interactive" });
    await h.phaseResult("complete", P({ brainstorm: "complete" }));
    await h.phaseResult("start", P({ brainstorm: "complete", plan: "in_progress" }));
    await h.emit("input", { type: "input", text: "approve", source: "interactive" });
    await h.emit("input", { type: "input", text: "/skill:x", source: "interactive" });
    await h.emit("input", { type: "input", text: "auto", source: "extension" });
    await h.emit("input", { type: "input", text: "rpc", source: "rpc" });
    await h.emit("session_shutdown", { type: "session_shutdown", reason: "quit" });
    const rec = h.readRecord();
    assert.equal(rec.derived.phases.plan?.user_messages, 2);
    assert.equal("user_messages" in (rec.derived.phases.brainstorm ?? {}), false);
  });

  test("model_select / thinking_level_select mid-phase emit config_change", async () => {
    const h = await boundInPlan();
    await h.emit("model_select", { type: "model_select", model: { provider: "q", id: "n" }, previousModel: undefined, source: "set" });
    await h.emit("thinking_level_select", { type: "thinking_level_select", level: "low", previousLevel: "high" });
    const cc = h.readRecord().events.filter((e) => e.kind === "config_change") as any[];
    assert.deepEqual(cc.map((e) => [e.model, e.thinking]), [["q/n", undefined], [undefined, "low"]]);
  });

  test("plan_tracker: reopen counts task_reopens; all-terminal snapshot auto-completes implement and records plan totals", async () => {
    const h = await boundInPlan();
    await h.phaseResult("complete", P({ brainstorm: "complete", plan: "complete" }));
    await h.phaseResult("start", P({ brainstorm: "complete", plan: "complete", implement: "in_progress" }));
    const pt = (action: string, tasks: { name: string; status: string }[], id = "pt1") => h.emit("tool_result", { toolName: "plan_tracker", toolCallId: id, input: { action }, content: [], isError: false, details: { action, tasks } });
    await pt("init", [{ name: "a", status: "pending" }, { name: "b", status: "pending" }]);
    await pt("update", [{ name: "a", status: "complete" }, { name: "b", status: "pending" }]);
    await pt("update", [{ name: "a", status: "in_progress" }, { name: "b", status: "pending" }]);
    let rec = h.readRecord();
    assert.equal(rec.derived.gates.task_reopens, 1);
    assert.ok(rec.events.some((e) => e.kind === "gate" && (e as any).gate === "task_reopen"));
    await pt("update", [{ name: "a", status: "complete" }, { name: "b", status: "skipped" }]);
    rec = h.readRecord();
    assert.deepEqual(rec.derived.plan, { tasks: 2, complete: 1, failed: 0, skipped: 1 });
    assert.ok(rec.events.some((e) => e.kind === "phase" && (e as any).action === "complete" && (e as any).name === "implement"));
    assert.equal(rec.derived.phases.implement?.completed_at !== undefined, true);
  });

  test("grant_fix_rounds emits a gate event and counts fix_round_grants", async () => {
    const h = await boundInPlan();
    await h.emit("tool_result", { toolName: "phase_tracker", toolCallId: "g", input: {}, content: [], isError: false, details: { action: "grant_fix_rounds", rounds: 2, phases: P({ brainstorm: "complete", plan: "in_progress" }) } });
    const rec = h.readRecord();
    assert.equal(rec.derived.gates.fix_round_grants, 1);
    assert.deepEqual(rec.events.filter((e) => e.kind === "gate").map((e: any) => [e.gate, e.rounds]), [["fix_round_grant", 2]]);
  });

  test("spec writes: spec_writes per phase, amendments coalesce until an input event, post-ship edits warn, banner edits count nothing, links refresh", async () => {
    const h = await boundInPlan();
    await h.writeSpec("doc/specs/a.md", "# A\n\n> **Supersedes:** [doc/specs/old.md](./old.md)\n");
    await h.writeSpec("doc/specs/a.md", "# A v3\n");
    let rec = h.readRecord();
    assert.equal(rec.derived.spec_writes.plan?.count, 2);
    assert.equal(rec.derived.spec_writes.brainstorm?.count, 1);
    assert.equal(rec.derived.amendments, 1, "two writes with no input between them = one amendment");
    assert.equal(rec.supersedes, undefined);
    await h.emit("input", { type: "input", text: "change x", source: "interactive" });
    await h.writeSpec("doc/specs/a.md", "# A v4\n");
    assert.equal(h.readRecord().derived.amendments, 2);
    // predecessor banner edit on another spec: supersedes gains it, nothing else counted
    writeFileSync(join(h.root, "doc/specs/pred.md"), "# Pred\n\n> **Superseded by:** [doc/specs/a.md](./a.md) - fully\n");
    const editInput = { path: "doc/specs/pred.md", edits: [{ oldText: "# Pred\n", newText: "# Pred\n\n> **Superseded by:** [doc/specs/a.md](./a.md) - fully\n" }] };
    await h.emit("tool_result", { toolName: "edit", toolCallId: "e", input: editInput, content: [], isError: false, details: { diff: "", patch: "" } });
    rec = h.readRecord();
    assert.deepEqual(rec.supersedes, ["doc/specs/pred.md"]);
    assert.equal(rec.spec, "doc/specs/a.md");
    await h.writeSpec("doc/specs/a.md", "# A without banners\n");
    assert.deepEqual(h.readRecord().supersedes, ["doc/specs/pred.md"]);
    // post-ship edit warns without changing the sealed record
    rec.status = "shipped";
    rec.shipped_at = "2026-09-17T12:00:00Z";
    writeFileSync(h.recordPath(), serializeRecord(rec));
    const before = readFileSync(h.recordPath(), "utf8");
    const h2 = harness();
    h2.ctx.cwd = h.root;
    await h2.phaseResult("start", P({ brainstorm: "in_progress" }));
    const [blocked] = await h2.emit("tool_call", { toolName: "write", toolCallId: "w", input: { path: "doc/specs/a.md" } });
    assert.deepEqual(blocked, { block: true, reason: guardReason("doc/specs/a.md", rec.shipped_at, ".pi/gauntlet/telemetry/doc/specs/a.yaml") });
    assert.equal(readFileSync(h.recordPath(), "utf8"), before);
    assert.equal(h.readRecord().derived.spec_edits_after_ship, 0);
  });

  test("a sealed record is skipped at bind and a later spec starts a fresh run", async () => {
    const first = harness();
    await first.phaseResult("start", P({ brainstorm: "in_progress" }));
    await first.writeSpec("doc/specs/old.md");
    const sealed = { ...first.readRecord("doc/specs/old.md"), status: "shipped" as const, shipped_at: "2026-09-17T18:00:00Z" };
    writeFileSync(first.recordPath("doc/specs/old.md"), serializeRecord(sealed));
    const before = readFileSync(first.recordPath("doc/specs/old.md"), "utf8");
    const h = harness({ sessionId: "s2" });
    h.ctx.cwd = first.root;
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/old.md");
    assert.equal(readFileSync(first.recordPath("doc/specs/old.md"), "utf8"), before);
    assert.equal(existsSync(h.excludeFile()), false);
    await h.writeSpec("doc/specs/new.md");
    assert.deepEqual(parseRecord(readFileSync(first.recordPath("doc/specs/new.md"), "utf8"))!.sessions, ["s2"]);
  });

  test("rehydration drops a body-only supersedes link removed by the new session's first write", async () => {
    const first = await boundInPlan();
    await first.writeSpec("doc/specs/a.md", "# A\n\n> **Supersedes:** doc/specs/old.md\n");

    const second = harness({ sessionId: "s2" });
    second.ctx.cwd = first.root;
    await second.phaseResult("start", P({ brainstorm: "in_progress" }));
    await second.phaseResult("start", P({ brainstorm: "complete", plan: "in_progress" }));
    const body = "# A without banners\n";
    writeFileSync(join(first.root, "doc/specs/a.md"), body);
    await second.emit("tool_call", { toolName: "write", toolCallId: "w", input: { path: "doc/specs/a.md", content: body } });
    await second.emit("tool_result", { toolName: "write", toolCallId: "w", input: { path: "doc/specs/a.md", content: body }, content: [], isError: false, details: undefined });

    assert.equal(second.readRecord().supersedes, undefined);
  });

  test("rehydration does not read a traversal-valued supersedes link outside the repository", async () => {
    const first = await boundInPlan();
    await first.writeSpec("doc/specs/a.md", "# A\n\n> **Supersedes:** ../../../../dev/zero\n");

    const second = harness({ sessionId: "s2", branch: [
      { type: "message", message: { role: "toolResult", toolName: "plan_check", toolCallId: "2", isError: false, details: { status: "pass", specPath: join(first.root, "doc/specs/a.md") } } },
    ] });
    second.ctx.cwd = first.root;
    await second.emit("session_start", { type: "session_start", reason: "resume" });

    assert.ok(second.readFileCalls.every((p) => p === first.root || p.startsWith(first.root + "/")));
    assert.deepEqual(second.readRecord().supersedes, ["../../../../dev/zero"]);
  });

  test("rehydration retains a predecessor link that also appeared in the bound spec body", async () => {
    const first = await boundInPlan();
    const predecessor = "# Old\n\n> **Superseded by:** [doc/specs/a.md](./a.md)\n";
    writeFileSync(join(first.root, "doc/specs/old.md"), predecessor);
    await first.writeSpec("doc/specs/a.md", "# A\n\n> **Supersedes:** doc/specs/old.md\n");

    const second = harness({ sessionId: "s2", branch: [
      { type: "message", message: { role: "toolResult", toolName: "phase_tracker", toolCallId: "1", isError: false, details: { action: "start", phases: P({ brainstorm: "in_progress" }) } } },
      { type: "message", message: { role: "toolResult", toolName: "phase_tracker", details: { action: "start", phases: P({ brainstorm: "complete", plan: "in_progress" }) } } },
      { type: "message", message: { role: "toolResult", toolName: "plan_check", toolCallId: "2", isError: false, details: { status: "pass", planPath: join(first.root, "doc/plans/a.md"), specPath: join(first.root, "doc/specs/a.md"), planSha256: "x", specSha256: "y" } } },
    ] });
    second.ctx.cwd = first.root;
    await second.emit("session_start", { type: "session_start", reason: "resume" });
    const body = "# A without banners\n";
    writeFileSync(join(first.root, "doc/specs/a.md"), body);
    await second.emit("tool_call", { toolName: "write", toolCallId: "w", input: { path: "doc/specs/a.md", content: body } });
    await second.emit("tool_result", { toolName: "write", toolCallId: "w", input: { path: "doc/specs/a.md", content: body }, content: [], isError: false, details: undefined });

    assert.deepEqual(second.readRecord().supersedes, ["doc/specs/old.md"]);
  });

  test("last matched test command during verify/ship records derived.tests from the bash result", async () => {
    const h = await boundInPlan();
    await h.phaseResult("complete", P({ brainstorm: "complete", plan: "complete" }));
    await h.phaseResult("start", P({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "in_progress" }));
    const bash = async (id: string, command: string, isError: boolean) => {
      await h.emit("tool_call", { toolName: "bash", toolCallId: id, input: { command } });
      await h.emit("tool_result", { toolName: "bash", toolCallId: id, input: { command }, content: [], isError, details: undefined });
    };
    await bash("b1", "cd x && npm test", true);
    assert.deepEqual(h.readRecord().derived.tests, { command: "npm test", result: "fail" });
    await bash("b2", "npm test", false);
    await bash("b3", "ls", true);
    assert.deepEqual(h.readRecord().derived.tests, { command: "npm test", result: "pass" });
  });

  async function boundInShip() {
    const h = harness();
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/a.md");
    await h.phaseResult("complete", P({ brainstorm: "complete" }));
    await h.phaseResult("start", P({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "complete", ship: "in_progress" }));
    return h;
  }

  test("ship-phase git commands leave the record untouched: no ship event, no shipped_at, no git add/commit, not frozen", async () => {
    const h = await boundInShip();
    const before = readFileSync(h.recordPath(), "utf8");
    await h.bash("s1", "git push -u origin HEAD");
    await h.bash("s2", "gh pr create --fill");
    await h.bash("s3", "git merge --squash gh-33");
    await h.bash("d1", "git worktree remove .worktrees/gh-33 && git branch -D gh-33");
    assert.equal(readFileSync(h.recordPath(), "utf8"), before);
    const rec = h.readRecord();
    assert.equal(rec.status, "in_progress");
    assert.equal(rec.shipped_at, undefined);
    assert.equal(rec.events.some((e) => e.kind === "ship"), false);
    assert.equal(h.gitWrites().length, 0);
    assert.deepEqual(h.jjCalls, []);
    await h.phaseResult("complete", P({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "complete", ship: "complete" }));
    assert.equal(h.readRecord().status, "in_progress", "git keep path no longer stamps; the seal bin owns shipped_at");
  });

  test("a sealed on-disk record freezes the recorder: shutdown does not overwrite it", async () => {
    const h = await boundInShip();
    const sealed = { ...h.readRecord(), status: "shipped" as const, shipped_at: "2026-09-17T18:00:00Z" };
    writeFileSync(h.recordPath(), serializeRecord(sealed));
    const before = readFileSync(h.recordPath(), "utf8");
    await h.emit("session_compact", { type: "session_compact", reason: "manual" });
    await h.emit("session_shutdown", { type: "session_shutdown", reason: "quit" });
    assert.equal(readFileSync(h.recordPath(), "utf8"), before);
  });

  test("a frozen record cannot bind another spec through plan_check or another checkout write", async () => {
    const h = await boundInShip();
    writeFileSync(h.recordPath(), serializeRecord({ ...h.readRecord(), status: "shipped", shipped_at: "2026-09-17T18:00:00Z" }));
    const before = readFileSync(h.recordPath());
    await h.emit("session_compact", { type: "session_compact", reason: "manual" });
    await h.emit("tool_result", { toolName: "plan_check", toolCallId: "pc", input: {}, content: [], isError: false, details: { status: "pass", specPath: join(h.root, "doc/specs/b.md"), planPath: join(h.root, "doc/plans/b.md") } });
    await h.writeSpec("doc/specs/b.md");
    await h.writeSpec(".worktrees/x/doc/specs/b.md");
    assert.equal(existsSync(h.recordPath("doc/specs/b.md")), false);
    assert.equal(existsSync(join(h.root, ".worktrees/x/.pi/gauntlet/telemetry/doc/specs/b.yaml")), false);
    assert.deepEqual(readFileSync(h.recordPath()), before);
  });

  test("marker down: spec writes, plan_check passes, and phase events create no file and buffer nothing", async () => {
    const h = harness();
    await h.writeSpec("doc/specs/a.md");
    await h.emit("tool_result", { toolName: "plan_check", toolCallId: "pc", input: {}, content: [], isError: false, details: { status: "pass", specPath: join(h.root, "doc/specs/a.md"), planPath: join(h.root, "doc/plans/a.md") } });
    await h.emit("tool_result", { toolName: "subagent", toolCallId: "sa", input: {}, content: [{ type: "text", text: "" }], isError: false, details: { results: [{ agent: "worker", exitCode: 0, model: "p/m", usage: { input: 10, output: 5, cacheRead: 0, cacheWrite: 0, cost: 0.1 } }] } });
    assert.equal(existsSync(join(h.root, ".pi")), false);
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/a.md");
    const rec = h.readRecord();
    assert.deepEqual(rec.events.map((e) => e.kind), ["phase"], "nothing from before arming is charged to the run");
    assert.deepEqual(rec.derived.personas, {});
    assert.equal(rec.derived.gates.plan_rounds, 0);
  });

  test("skip brainstorm with reason resume: <spec> binds to the existing spec and reloads its record", async () => {
    const first = harness();
    await first.phaseResult("start", P({ brainstorm: "in_progress" }));
    await first.writeSpec("doc/specs/a.md");
    const runId = first.readRecord().run_id;
    const second = harness({ sessionId: "s2" });
    second.ctx.cwd = first.root;
    await second.phaseResult("start", P({ brainstorm: "in_progress" }));
    await second.phaseResult("skip", { ...P({ brainstorm: "skipped" }), brainstorm: { status: "skipped", reason: `resume: ${join(first.root, "doc/specs/a.md")}` } });
    const rec = parseRecord(readFileSync(first.recordPath(), "utf8"))!;
    assert.equal(rec.run_id, runId);
    assert.deepEqual(rec.sessions, ["s1", "s2"]);
    assert.equal(rec.approved_at, rec.events.at(-1)!.ts);
  });

  test("reset then a new spec binds a fresh run with an empty buffer; the old record is untouched", async () => {
    const h = harness();
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/a.md");
    await h.phaseResult("reset", P());
    const aBefore = readFileSync(h.recordPath("doc/specs/a.md"), "utf8");
    await h.emit("tool_result", { toolName: "subagent", toolCallId: "sa", input: {}, content: [{ type: "text", text: "" }], isError: false, details: { results: [{ agent: "worker", exitCode: 0, model: "p/m", usage: { input: 10, output: 5, cacheRead: 0, cacheWrite: 0, cost: 0.1 } }] } });
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/b.md");
    const b = h.readRecord("doc/specs/b.md");
    assert.deepEqual(b.events.map((e) => e.kind), ["phase"]);
    assert.deepEqual(b.derived.personas, {});
    assert.equal(readFileSync(h.recordPath("doc/specs/a.md"), "utf8"), aBefore);
  });

  test("session_tree flushes observations and clears abandoned plan tracker state", async () => {
    const h = await boundInPlan({ contextTokens: 4321 });
    await h.emit("input", { type: "input", text: "review", source: "interactive" });
    await h.emit("message_end", { type: "message_end", message: { role: "assistant", usage: usage(10) } });
    await h.emit("turn_end", { type: "turn_end" });
    await h.emit("tool_result", { toolName: "plan_tracker", input: {}, details: { action: "update", tasks: [{ status: "complete" }] }, isError: false });
    h.setBranch([]);
    await h.emit("session_tree", { type: "session_tree" });
    const rec = h.readRecord();
    assert.equal(rec.derived.phases.plan?.user_messages, 1);
    assert.equal(rec.derived.phases.plan?.tokens?.input, 10);
    assert.equal(rec.derived.phases.plan?.peak_context, 4321);
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/b.md");
    await h.emit("tool_result", { toolName: "plan_tracker", input: {}, details: { action: "update", tasks: [{ status: "in_progress" }] }, isError: false });
    assert.equal(h.readRecord("doc/specs/b.md").derived.gates.task_reopens, 0);
  });

  test("session_switch reconstructs marker and binding from the target branch", async () => {
    const first = harness();
    await first.phaseResult("start", P({ brainstorm: "in_progress" }));
    await first.writeSpec("doc/specs/a.md");
    const h = harness({ sessionId: "s2", branch: [] });
    h.ctx.cwd = first.root;
    await h.emit("session_start", { type: "session_start", reason: "startup" });
    assert.equal(parseRecord(readFileSync(first.recordPath(), "utf8"))!.sessions.includes("s2"), false, "unarmed branch does not bind");
    h.setBranch([
      { type: "message", message: { role: "toolResult", toolName: "phase_tracker", toolCallId: "1", isError: false, details: { action: "start", phases: P({ brainstorm: "in_progress" }) } } },
      { type: "message", message: { role: "assistant", content: [{ type: "toolCall", id: "w1", name: "write", arguments: { path: join(first.root, "doc/specs/a.md") } }] } },
      { type: "message", message: { role: "toolResult", toolName: "write", toolCallId: "w1", isError: false } },
    ]);
    await h.emit("session_switch", { type: "session_switch", reason: "switch" });
    assert.deepEqual(parseRecord(readFileSync(first.recordPath(), "utf8"))!.sessions, ["s1", "s2"]);
  });

  async function boundInJjShip(jjFail?: (args: string[]) => GitResult | undefined) {
    const h = harness({
      jjWorkspace: true,
      jjFail: jjFail ? (args) => jjFail(args) : undefined,
      gitFail: (args) => (args[0] === "rev-parse" && args.includes("--path-format=absolute") ? { code: 128, stdout: "", stderr: "fatal: not a git repository" } : undefined),
    });
    await h.phaseResult("start", P({ brainstorm: "in_progress" }));
    await h.writeSpec("doc/specs/a.md");
    await h.phaseResult("complete", P({ brainstorm: "complete" }));
    await h.phaseResult("start", P({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "complete", ship: "in_progress" }));
    await h.phaseResult("complete", P({ brainstorm: "complete", plan: "complete", implement: "complete", verify: "complete", ship: "complete" }));
    return h;
  }

  const diffWarnings = (h: { readRecord: () => ReturnType<typeof parseRecord> }) =>
    h.readRecord()!.events.filter((e) => e.kind === "warning").map((e: any) => e.message as string).filter((m) => m.startsWith("diff omitted"));

  const isBaseLog = (args: string[]) => args.includes("log") && !args.includes("--count");

  test("jj ship (AC 1): keep path derives modified_files and diff through jj with pinned output flags", async () => {
    const h = await boundInJjShip();
    const rec = h.readRecord();
    assert.equal(rec.status, "shipped");
    assert.equal(rec.derived.gates.ship_option, "keep");
    const beforeWrite = readFileSync(h.recordPath(), "utf8");
    const out = await h.writeSpec("doc/specs/a.md");
    assert.deepEqual(out.filter(Boolean), [{ content: [{ type: "text", text: `⚠️ spec shipped at ${rec.shipped_at}; write a follow-up spec that supersedes it` }] }]);
    assert.equal(readFileSync(h.recordPath(), "utf8"), beforeWrite);
    assert.equal(h.readRecord().derived.spec_edits_after_ship, 0);
    assert.deepEqual(rec.derived.modified_files, ["src/a.ts", "test/a.test.ts"]);
    assert.deepEqual(rec.derived.diff, { base: "jjbase0001", commits: 2, buckets: { code: { files: 1, insertions: 10, deletions: 2 }, test: { files: 1, insertions: 5, deletions: 0 } } });
    assert.deepEqual(diffWarnings(h), []);
    const diffSteps = h.jjCalls.filter((a) => a[0] !== "root");
    assert.equal(diffSteps.length, 3);
    assert.ok(diffSteps.every((a) => a.includes("--color=never")));
    assert.deepEqual(diffSteps[1].slice(0, 4), ["--color=never", "--config", "diff.git.show-path-prefix=true", "diff"]);
    assert.ok(diffSteps[0].some((a) => a.includes("fork_point(") && a.includes("~ root() & ::")));
    const before = readFileSync(h.recordPath(), "utf8");
    await h.emit("session_compact", { type: "session_compact", reason: "manual" });
    await h.emit("session_shutdown", { type: "session_shutdown", reason: "quit" });
    assert.equal(readFileSync(h.recordPath(), "utf8"), before, "sealed on disk => frozen");
  });

  test("jj ship (AC 2): empty mainline -> jj-named warning, both derived fields absent, record written", async () => {
    const h = await boundInJjShip((args) => (isBaseLog(args) ? { code: 0, stdout: "", stderr: "" } : undefined));
    const rec = h.readRecord();
    assert.equal(rec.status, "shipped");
    assert.equal(rec.derived.diff, undefined);
    assert.equal(rec.derived.modified_files, undefined);
    assert.deepEqual(diffWarnings(h), ["diff omitted: jj mainline unresolved (trunk() is root(); no main/master bookmark)"]);
  });

  test("jj ship: jj diff nonzero exit -> first stderr line in the warning", async () => {
    const h = await boundInJjShip((args) => (args.includes("diff") ? { code: 1, stdout: "", stderr: "Error: Revision `jjbase0001` doesn't exist\nHint: try jj log\n" } : undefined));
    assert.deepEqual(diffWarnings(h), ["diff omitted: jj diff failed: Error: Revision `jjbase0001` doesn't exist"]);
    assert.equal(h.readRecord().derived.diff, undefined);
  });

  test("jj ship: ENOENT-shaped runner result (empty stderr) -> 'unknown error'", async () => {
    const h = await boundInJjShip((args) => (isBaseLog(args) ? { code: 127, stdout: "", stderr: "" } : undefined));
    assert.deepEqual(diffWarnings(h), ["diff omitted: jj log failed: unknown error"]);
    assert.equal(h.readRecord().status, "shipped");
  });

  test("jj ship: unparseable patch -> warning, neither field set", async () => {
    const h = await boundInJjShip((args) => (args.includes("diff") ? { code: 0, stdout: "not a patch\n", stderr: "" } : undefined));
    assert.deepEqual(diffWarnings(h), ["diff omitted: jj diff unparseable"]);
    const rec = h.readRecord();
    assert.equal(rec.derived.diff, undefined);
    assert.equal(rec.derived.modified_files, undefined);
  });

  test("jj ship: malformed patch header -> warning, neither field set, record shipped", async () => {
    const h = await boundInJjShip((args) => (args.includes("diff") ? { code: 0, stdout: "diff --git c/x b/x\n", stderr: "" } : undefined));
    assert.deepEqual(diffWarnings(h), ["diff omitted: jj diff unparseable"]);
    const rec = h.readRecord();
    assert.equal(rec.status, "shipped");
    assert.equal(rec.derived.diff, undefined);
    assert.equal(rec.derived.modified_files, undefined);
  });

  test("jj ship: --count failure -> jj log warning, no derived diff", async () => {
    const h = await boundInJjShip((args) => (args.includes("--count") ? { code: 1, stdout: "", stderr: "Error: invalid revset\nHint: check the mainline\n" } : undefined));
    assert.deepEqual(diffWarnings(h), ["diff omitted: jj log failed: Error: invalid revset"]);
    const rec = h.readRecord();
    assert.equal(rec.status, "shipped");
    assert.equal(rec.derived.diff, undefined);
    assert.equal(rec.derived.modified_files, undefined);
  });

  test("jj ship: unparseable --count -> warning with the raw output", async () => {
    const h = await boundInJjShip((args) => (args.includes("--count") ? { code: 0, stdout: "abc\n", stderr: "" } : undefined));
    assert.deepEqual(diffWarnings(h), ["diff omitted: jj log --count unparseable: abc"]);
    assert.equal(h.readRecord().derived.diff, undefined);
  });

  test("guard: write to a shipped spec during brainstorm is blocked before any state change; edit passes; other phases pass", async () => {
    const h = await boundInShip();
    writeFileSync(h.recordPath(), serializeRecord({ ...h.readRecord(), status: "shipped", shipped_at: "2026-09-17T18:00:00Z" }));
    const before = readFileSync(h.recordPath(), "utf8");
    const h2 = harness();
    h2.ctx.cwd = h.root;
    await h2.phaseResult("start", P({ brainstorm: "in_progress" }));
    const [blocked] = await h2.emit("tool_call", { toolName: "write", toolCallId: "w1", input: { path: "doc/specs/a.md", content: "# again" } });
    assert.deepEqual(blocked, { block: true, reason: guardReason("doc/specs/a.md", h.readRecord().shipped_at!, ".pi/gauntlet/telemetry/doc/specs/a.yaml") });
    assert.equal(readFileSync(h.recordPath(), "utf8"), before, "shipped record byte-identical");
    const [editPass] = await h2.emit("tool_call", { toolName: "edit", toolCallId: "e1", input: { path: "doc/specs/a.md", edits: [] } });
    assert.equal(editPass, undefined);
    const [otherPass] = await h2.emit("tool_call", { toolName: "write", toolCallId: "w2", input: { path: "doc/specs/b.md", content: "# new" } });
    assert.equal(otherPass, undefined);
    const h3 = harness();
    h3.ctx.cwd = h.root;
    await h3.phaseResult("start", P({ brainstorm: "complete", plan: "in_progress" }));
    const [planPass] = await h3.emit("tool_call", { toolName: "write", toolCallId: "w3", input: { path: "doc/specs/a.md", content: "# again" } });
    assert.equal(planPass, undefined);
  });
