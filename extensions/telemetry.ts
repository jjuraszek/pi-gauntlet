  /**
   * Telemetry extension (#33): records one committed YAML record per gauntlet run,
   * keyed by spec path, from pi events alone (no skill cooperation), and blocks
   * `write` into an already-shipped spec while brainstorm is in progress.
   * Pure helpers: extensions/lib/telemetry-*.ts. The default export takes a `deps`
   * seam ({ fs, git, now, settings }) for the harness tests.
   */

  import { execFile } from "node:child_process";
  import { randomUUID } from "node:crypto";
  import * as nodeFs from "node:fs";
  import { dirname, isAbsolute, join, posix, resolve } from "node:path";
  import * as piRuntime from "@earendil-works/pi-coding-agent";
  import { SettingsManager, getAgentDir } from "@earendil-works/pi-coding-agent";
  import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
  import { DEFAULT_TEST_COMMANDS, resolveTelemetry, settingsErrorWarning, type TelemetryResolved } from "./lib/gauntlet-settings.ts";
  import { loadGauntletSettings } from "./lib/gauntlet-settings-loader.ts";
  import { checkoutOf } from "./lib/checkout.ts";
  import { CONTEXT_DRAFT_MARKER } from "./lib/phase-tracker-helpers.ts";
  import { sha256 } from "./lib/plan-check.ts";
  import { SUPERSEDED_BY_RE, aggregateNumstat, isPlanPath, isSpecPath, isSupersededByBanner, matchDiscardStatement, matchShipStatement, matchTestStatement, parseSpecLinks, planSpecHeader, recordPathFor, repoRelativeToolPath, toPosix, truncateCommand } from "./lib/telemetry-paths.ts";
  import { COUNTED_USER_PHASES, REVIEWER_AGENTS, countFindings, countOpenGaps, hasReopen, insertedText, planTotals, textOf, usageToTokens } from "./lib/telemetry-collect.ts";
  import { addTokens, capEvents, compact, currentPhase, derive, diffPhases, emptyAccumulators, emptyPhases, foldAccumulators, implementAutoCompletes, liveShipEvent, newRecord, parseRecord, serializeRecord, type Accumulators, type BaseEvent, type PhaseAcc, type PhaseKey, type PhaseMap, type TelemetryEvent, type TelemetryRecord, type Tokens } from "./lib/telemetry-record.ts";
  import { BASE_REFS, guardReason, modifiedFilesFrom } from "./lib/telemetry-ship.ts";

  // ---- deps seam -------------------------------------------------------------------

  export interface FsPort {
    readFile(p: string): string | undefined;
    writeFile(p: string, text: string): void;
    rename(from: string, to: string): void;
    mkdirp(p: string): void;
    exists(p: string): boolean;
    unlink(p: string): void;
  }
  export interface GitResult {
    code: number;
    stdout: string;
    stderr: string;
  }
  export interface SettingsSnapshot {
    telemetry: TelemetryResolved;
    errors: string[];
    agentOverrides?: Record<string, unknown>;
    versions: Record<string, string>;
    testCommands?: string[];
  }
  export interface Deps {
    fs: FsPort;
    git: (args: string[], cwd: string) => Promise<GitResult>;
    // Optional jj override for tests; production resolves plain jj workspaces via jjSync.
    jj?: (args: string[], cwd: string) => GitResult | Promise<GitResult>;
    now: () => string;
    settings: (cwd: string) => SettingsSnapshot;
  }

  export const realFs: FsPort = {
    readFile: (p) => {
      try {
        return nodeFs.readFileSync(p, "utf8");
      } catch {
        return undefined;
      }
    },
    writeFile: (p, text) => nodeFs.writeFileSync(p, text),
    rename: (a, b) => nodeFs.renameSync(a, b),
    mkdirp: (p) => nodeFs.mkdirSync(p, { recursive: true }),
    exists: (p) => nodeFs.existsSync(p),
    unlink: (p) => nodeFs.rmSync(p, { force: true }),
  };

  // Bounded, never throws.
  export const realGit = (args: string[], cwd: string): Promise<GitResult> =>
    new Promise((res) => {
      execFile("git", args, { cwd, timeout: 10_000, encoding: "utf8" }, (err, stdout, stderr) => {
        const code = err ? (typeof (err as { code?: unknown }).code === "number" ? ((err as { code: number }).code) : 1) : 0;
        res({ code, stdout: String(stdout ?? ""), stderr: String(stderr ?? err?.message ?? "") });
      });
    });

  const isoNow = (): string => new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

  const readPkgVersion = (p: string): string | undefined => {
    try {
      const v = JSON.parse(nodeFs.readFileSync(p, "utf8")).version;
      return typeof v === "string" ? v : undefined;
    } catch {
      return undefined;
    }
  };

  function realVersions(): Record<string, string> {
    const out: Record<string, string> = {};
    const piVersion = (piRuntime as { VERSION?: unknown }).VERSION;
    if (typeof piVersion === "string") out.pi = piVersion;
    const self = readPkgVersion(join(dirname(new URL(import.meta.url).pathname), "..", "package.json"));
    if (self) out["pi-gauntlet"] = self;
    for (const pkg of ["pi-cohort", "pi-quiver", "pi-condense"]) {
      const v = readPkgVersion(join(getAgentDir(), "npm", "node_modules", pkg, "package.json"));
      if (v) out[pkg] = v;
    }
    return out;
  }

  function realSettings(cwd: string): SettingsSnapshot {
    const { gauntlet, errors, root } = loadGauntletSettings(cwd);
    const telemetry = resolveTelemetry(gauntlet);
    const sm = SettingsManager.create(root, getAgentDir());
    const layer = (s: unknown) => ((s as { subagents?: { agentOverrides?: unknown } })?.subagents?.agentOverrides ?? undefined) as Record<string, unknown> | undefined;
    const preset = layer(sm.getGlobalSettings());
    const repo = layer(sm.getProjectSettings());
    const agentOverrides = preset || repo ? { ...(preset ?? {}), ...(repo ?? {}) } : undefined;
    const rawCmds = gauntlet.verifyBeforeShip?.testCommands;
    const testCommands = Array.isArray(rawCmds) && rawCmds.length > 0 && rawCmds.every((c) => typeof c === "string" && c.trim()) ? (rawCmds as string[]) : undefined;
    return { telemetry, errors, agentOverrides, versions: realVersions(), testCommands };
  }

  export const realDeps: Deps = { fs: realFs, git: realGit, now: isoNow, settings: realSettings };

  // ---- replay ------------------------------------------------------------------------

  interface ReplayResult {
    phases: PhaseMap;
    planCheckSpec?: string; // absolute
    lastSpecWrite?: string; // as passed to the tool
  }

  // Walks the session branch like phase-tracker.ts: successful phase_tracker results
  // set the phase map; plan_check pass specPath and successful spec writes feed binding.
  // Silent: no events are emitted (each was already flushed when it happened).
  export function replayBranch(entries: Iterable<unknown>): ReplayResult {
    const out: ReplayResult = { phases: emptyPhases() };
    const calls = new Map<string, { name: string; args: unknown }>();
    for (const raw of entries) {
      const entry = raw as { type?: string; message?: { role?: string; content?: unknown; toolName?: string; toolCallId?: string; isError?: boolean; details?: unknown } };
      if (entry.type !== "message" || !entry.message) continue;
      const msg = entry.message;
      if (msg.role === "assistant" && Array.isArray(msg.content)) {
        for (const c of msg.content as { type?: string; id?: string; name?: string; arguments?: unknown }[])
          if (c?.type === "toolCall" && c.id && c.name) calls.set(c.id, { name: c.name, args: c.arguments });
        continue;
      }
      if (msg.role !== "toolResult") continue;
      if (msg.toolName === "phase_tracker") {
        const d = msg.details as { phases?: PhaseMap; error?: string } | undefined;
        if (d?.phases && !d.error) out.phases = d.phases;
      } else if (msg.toolName === "plan_check") {
        const d = msg.details as { status?: string; specPath?: string } | undefined;
        if (d?.status === "pass" && typeof d.specPath === "string") out.planCheckSpec = d.specPath;
      } else if (msg.toolName === "write" && !msg.isError && msg.toolCallId) {
        const p = (calls.get(msg.toolCallId)?.args as { path?: unknown } | undefined)?.path;
        if (typeof p === "string" && isSpecPath(toPosix(p))) out.lastSpecWrite = p;
      }
    }
    return out;
  }

  // ---- extension -----------------------------------------------------------------------

  const isSubagentChild = (): boolean => Number(process.env.PI_SUBAGENT_DEPTH ?? "0") > 0;

  export default function (pi: ExtensionAPI, deps: Deps = realDeps) {
    let phases: PhaseMap = emptyPhases();
    let toplevel: string | undefined; // toplevel of the bound record's checkout; undefined until bind
    let checkoutVia: "git" | "jj" | undefined; // which binary resolved toplevel; undefined until bind
    let boundSpec: string | undefined; // repo-relative
    let record: TelemetryRecord | undefined;
    const predecessorLinks = new Set<string>();
    let recordRel: string | undefined; // repo-relative record path
    let oldRecordRel: string | undefined; // pending rename partner for the next commit
    let buffer: TelemetryEvent[] = [];
    let pending: Accumulators = emptyAccumulators();
    let lastCommitted = "";
    let frozen = false;
    let settingsWarned = false;
    let notGitWarned = false;
    let sessionId = "";

    // Per-event settings read; undefined => this event is a no-op.
    const enabledSettings = (ctx: ExtensionContext): SettingsSnapshot | undefined => {
      if (isSubagentChild()) return undefined;
      const s = deps.settings(ctx.cwd);
      if (!s.telemetry.enabled) return undefined;
      return s;
    };

    // Resolves a tool path (relative to ctx.cwd or absolute) to its owning checkout and
    // checkout-relative key. undefined outside any checkout.
    const locate = async (ctx: ExtensionContext, p: string): Promise<{ toplevel: string; rel: string; via: "git" | "jj" } | undefined> => {
      const candidateAbs = isAbsolute(p) ? p : resolve(ctx.cwd, p);
      const co = await checkoutOf(candidateAbs, deps.git, deps.jj);
      const rel = co ? repoRelativeToolPath(co.toplevel, ctx.cwd, p) : undefined;
      return co && rel ? { toplevel: co.toplevel, rel, via: co.via } : undefined;
    };

    const live = (): Accumulators => record
      ? (record.accumulators[sessionId] ??= emptyAccumulators())
      : pending;

    const abs = (rel: string): string => join(toplevel!, rel);
    const phaseNow = (): PhaseKey => currentPhase(phases);

    const pushEvent = (e: Omit<TelemetryEvent, "ts" | "session" | "phase"> & Partial<BaseEvent>): TelemetryEvent => {
      const full = { ts: deps.now(), session: sessionId, phase: phaseNow(), ...e } as TelemetryEvent;
      if (record) record.events.push(full);
      else buffer.push(full);
      return full;
    };

    const warn = (message: string) => pushEvent({ kind: "warning", message });

    // ---- record store ----
    const writeRecord = () => {
      if (!record || !recordRel || frozen) return;
      if (!toplevel || !deps.fs.exists(toplevel)) {
        frozen = true;
        return;
      }
      const capped = capEvents(record.events);
      if (capped.dropped) {
        record.events = capped.events;
        live().events_dropped += capped.dropped;
      }
      record.derived = derive(record, deps.now());
      const target = abs(recordRel);
      try {
        deps.fs.mkdirp(dirname(target));
        deps.fs.writeFile(target + ".tmp", serializeRecord(record));
        deps.fs.rename(target + ".tmp", target);
      } catch (e) {
        pushEvent({ kind: "warning", message: `record write failed: ${String((e as Error).message ?? e).split("\n")[0]}` });
      }
    };

    const commitRecord = async () => {
      if (!record || !recordRel || frozen || !toplevel) return;
      if (checkoutVia === "jj") {
        // A jj-bound checkout has no .git to commit into; say so once per session instead
        // of failing `git commit` at every checkpoint.
        if (!notGitWarned) {
          notGitWarned = true;
          warn("record written, not committed: not a git checkout");
        }
        return;
      }
      const text = deps.fs.readFile(abs(recordRel)) ?? "";
      if (text === lastCommitted) return;
      const paths = [recordRel, ...(oldRecordRel ? [oldRecordRel] : [])];
      const add = await deps.git(["add", "-f", "--", ...paths], toplevel!);
      let commit = add.code === 0 ? await deps.git(["commit", "-q", "-m", `telemetry: ${record.spec}`, "--", ...paths], toplevel!) : add;
      if (commit.code !== 0 && /index\.lock/.test(commit.stderr)) {
        await new Promise((r) => setTimeout(r, 200));
        commit = await deps.git(["commit", "-q", "-m", `telemetry: ${record.spec}`, "--", ...paths], toplevel!);
      }
      if (commit.code !== 0) {
        warn(`git commit failed: ${(commit.stderr.trim().split("\n")[0] || "unknown error")}`);
        writeRecord();
        return;
      }
      lastCommitted = text;
    };

    // Write point = every event / accumulator change on a boundary; checkpoint = also commit.
    const flush = async (checkpoint: boolean) => {
      if (!record) return;
      writeRecord();
      if (checkpoint) await commitRecord();
    };

    let currentDir = "";

    const loadOrCreate = (specRel: string): TelemetryRecord => {
      const rel = recordPathFor(currentDir, specRel);
      const existing = deps.fs.readFile(abs(rel));
      const parsed = existing ? parseRecord(existing) : undefined;
      if (parsed) {
        // fold stale live blocks (sessions that died without shutdown) into total
        for (const k of Object.keys(parsed.accumulators)) {
          if (k === "total" || k === sessionId) continue;
          parsed.accumulators.total = foldAccumulators(parsed.accumulators.total ?? emptyAccumulators(), parsed.accumulators[k]);
          delete parsed.accumulators[k];
        }
        if (!parsed.sessions.includes(sessionId)) parsed.sessions.push(sessionId);
        parsed.spec = specRel;
        return parsed;
      }
      return newRecord({ spec: specRel, session: sessionId, now: buffer[0]?.ts ?? deps.now(), runId: randomUUID() });
    };

    const bind = async (specRel: string, snap: SettingsSnapshot, specToplevel: string, via: "git" | "jj") => {
      toplevel = specToplevel;
      checkoutVia = via;
      currentDir = snap.telemetry.dir;
      boundSpec = specRel;
      recordRel = recordPathFor(currentDir, specRel);
      predecessorLinks.clear();
      record = loadOrCreate(specRel);
      for (const link of record.supersedes ?? []) {
        if (!isSafeSpecLink(link)) continue;
        const predecessor = deps.fs.readFile(abs(link));
        if (predecessor !== undefined && isSupersededByBanner(predecessor, record.spec)) predecessorLinks.add(link);
      }
      if (!record.author || !record.branch) {
        const [name, email, branch] = await Promise.all([
          deps.git(["config", "user.name"], toplevel!),
          deps.git(["config", "user.email"], toplevel!),
          deps.git(["rev-parse", "--abbrev-ref", "HEAD"], toplevel!),
        ]);
        const author = compact({ name: name.stdout.trim() || undefined, email: email.stdout.trim() || undefined });
        if (Object.keys(author).length) record.author ??= author;
        if (branch.code === 0 && branch.stdout.trim()) record.branch ??= branch.stdout.trim();
      }
      if (Object.keys(snap.versions).length) record.versions ??= snap.versions;
      if (snap.agentOverrides) record.agent_overrides ??= snap.agentOverrides;
      record.events.push(...buffer);
      record.accumulators[sessionId] = foldAccumulators(pending, record.accumulators[sessionId] ?? emptyAccumulators());
      pending = emptyAccumulators();
      const approval = record.events.find((e) => e.kind === "phase" && e.name === "brainstorm" && (e.action === "complete" || e.action === "skip"));
      if (approval) record.approved_at ??= approval.ts;
      buffer = [];
      if (!settingsWarned && (snap.errors.length || snap.telemetry.warning)) {
        settingsWarned = true;
        if (snap.errors.length) warn(settingsErrorWarning(snap.errors));
        if (snap.telemetry.warning) warn(snap.telemetry.warning);
      }
      refreshLinks();
    };

    const unbind = () => {
      toplevel = undefined;
      checkoutVia = undefined;
      boundSpec = undefined;
      record = undefined;
      recordRel = undefined;
      oldRecordRel = undefined;
      lastCommitted = "";
      frozen = false;
    };

    const isSafeSpecLink = (link: string): boolean => {
      const normalized = posix.normalize(link);
      return isSpecPath(link) && !posix.isAbsolute(link) && normalized !== ".." && !normalized.startsWith("../");
    };

    const refreshLinks = () => {
      if (!record || !boundSpec) return;
      const body = deps.fs.readFile(abs(boundSpec));
      if (body === undefined) return;
      const links = parseSpecLinks(body);
      const supersedes = [...new Set([...links.supersedes, ...predecessorLinks])];
      record.supersedes = supersedes.length ? supersedes : undefined;
      record.fixes = links.fixes.length ? links.fixes : undefined;
    };

    const isDraftOrMissing = (specRel: string): boolean => {
      const body = deps.fs.readFile(abs(specRel));
      return body === undefined || body.split("\n")[0] === CONTEXT_DRAFT_MARKER;
    };

    const rebind = async (newSpec: string): Promise<boolean> => {
      const from = recordRel!;
      const to = recordPathFor(currentDir, newSpec);
      if (deps.fs.exists(abs(to))) {
        warn(`record move skipped: ${to} already exists`);
        return false;
      }
      const trackedResult = await deps.git(["ls-files", "--error-unmatch", "--", from], toplevel!);
      const tracked = trackedResult.code === 0 && trackedResult.stdout.trim() !== "";
      try {
        deps.fs.mkdirp(dirname(abs(to)));
        if (tracked) {
          const mv = await deps.git(["mv", "--", from, to], toplevel!);
          if (mv.code !== 0) deps.fs.rename(abs(from), abs(to));
        } else deps.fs.rename(abs(from), abs(to));
      } catch (e) {
        warn(`record move failed: ${String((e as Error).message ?? e).split("\n")[0]}`);
        return false;
      }
      pushEvent({ kind: "spec_renamed", from: boundSpec!, to: newSpec });
      oldRecordRel = from;
      boundSpec = newSpec;
      recordRel = to;
      record!.spec = newSpec;
      lastCommitted = "";
      return true;
    };

    // ---- phase mirror ----
    const applyPhaseDetails = async (details: { action?: string; phases?: PhaseMap; error?: string; rounds?: number } | undefined, snap: SettingsSnapshot) => {
      if (!details?.phases || details.error) return;
      const transitions = diffPhases(phases, details.phases, details.action ?? "");
      if (details.action === "grant_fix_rounds") {
        live().gates.fix_round_grants += 1;
        pushEvent({ kind: "gate", gate: "fix_round_grant", rounds: typeof details.rounds === "number" ? details.rounds : undefined });
        await flush(false);
      }
      for (const t of transitions) {
        const model = ctxModel();
        const e = pushEvent(
          t.action === "start"
            ? { kind: "phase", action: "start", name: t.name, model, thinking: ctxThinking() }
            : t.action === "reset"
              ? { kind: "phase", action: "reset" }
              : { kind: "phase", action: t.action, name: t.name },
        );
        phases = details.phases;
        if (record && t.name === "brainstorm" && (t.action === "complete" || t.action === "skip")) record.approved_at ??= e.ts;
        if (record && t.name === "ship" && t.action === "complete") await onShipKeep(snap);
        await flush(true);
        if (t.action === "reset") unbind();
      }
      phases = details.phases;
    };

    let lastCtx: ExtensionContext | undefined;
    const ctxModel = (): string | undefined => (lastCtx?.model ? `${lastCtx.model.provider}/${lastCtx.model.id}` : undefined);
    const ctxThinking = (): string | undefined => lastCtx?.thinkingLevel;

    // Keep-branch ship: shipped_at at `phase complete ship`. Defined in block 3.
    let onShipKeep: (snap: SettingsSnapshot) => Promise<void>;

    // ---- handlers ----
    pi.on("session_start", async (_event, ctx) => {
      lastCtx = ctx;
      const snap = enabledSettings(ctx);
      if (!snap) return;
      sessionId = ctx.sessionManager.getSessionId();
      currentDir = snap.telemetry.dir;
      const replay = replayBranch(ctx.sessionManager.getBranch());
      phases = replay.phases;
      const candidate = replay.planCheckSpec ?? replay.lastSpecWrite;
      const loc = candidate ? await locate(ctx, candidate) : undefined;
      if (loc && isSpecPath(loc.rel)) {
        await bind(loc.rel, snap, loc.toplevel, loc.via);
        await flush(false);
      }
    });

    pi.on("session_shutdown", async (_event, ctx) => {
      const snap = enabledSettings(ctx);
      if (!snap || !record) return;
      const liveBlock = record.accumulators[sessionId];
      if (liveBlock) {
        record.accumulators.total = foldAccumulators(record.accumulators.total ?? emptyAccumulators(), liveBlock);
        delete record.accumulators[sessionId];
      }
      await flush(true);
    });

    pi.on("tool_result", async (event, ctx) => {
      lastCtx = ctx;
      const snap = enabledSettings(ctx);
      if (!snap) return undefined;
      if (!sessionId) sessionId = ctx.sessionManager.getSessionId();
      if (event.toolName === "phase_tracker" && !event.isError) {
        await applyPhaseDetails(event.details as never, snap);
        return undefined;
      }
      if (event.toolName === "plan_check" && !event.isError) {
        const d = event.details as { status?: string; specPath?: string; planPath?: string } | undefined;
        const specLoc = d?.specPath ? await locate(ctx, d.specPath) : undefined;
        const planLoc = d?.planPath ? await locate(ctx, d.planPath) : undefined;
        const spec = specLoc?.rel;
        const plan = planLoc?.rel;
        const pass = d?.status === "pass";
        if (pass && specLoc && (specLoc.rel !== boundSpec || specLoc.toplevel !== toplevel)) {
          if (record) unbind();
          await bind(specLoc.rel, snap, specLoc.toplevel, specLoc.via);
        }
        live().gates.plan_rounds += 1;
        pushEvent({ kind: "plan_check", pass, spec, plan });
        await flush(pass);
        return undefined;
      }
      if ((event.toolName === "write" || event.toolName === "edit" || event.toolName === "read") && !event.isError) {
        const rawPath = (event.input as { path?: unknown }).path;
        const loc = typeof rawPath === "string" ? await locate(ctx, rawPath) : undefined;
        if (!loc) {
          if (typeof rawPath === "string" && isSpecPath(toPosix(rawPath))) warn(`spec ${rawPath} is outside a git checkout; telemetry not recorded`);
          return undefined;
        }
        return onSpecInteraction(event.toolName, loc, event, snap);
      }
      if (event.toolName === "subagent" && !event.isError) {
        await onSubagentResult(event.details, event.content);
        return undefined;
      }
      if (event.toolName === "plan_tracker" && !event.isError) {
        await onPlanTracker(event.details, snap);
        return undefined;
      }
      if (event.toolName === "bash") {
        if (pendingShip && pendingShip.id === event.toolCallId) {
          pendingShip = undefined;
          if (event.isError) {
            pushEvent({ kind: "ship_failed" });
            clearShipState();
            await flush(false);
          } else {
            frozen = true;
          }
        }
        const matched = pendingTest.get(event.toolCallId);
        if (matched && record) {
          pendingTest.delete(event.toolCallId);
          record.derived.tests = { command: truncateCommand(matched), result: event.isError ? "fail" : "pass" };
          await flush(false);
        }
        return undefined;
      }

      return undefined;
    });

    // Binding + spec-write bookkeeping; the bound-spec hooks are defined in block 2.
    const onSpecInteraction = async (tool: "write" | "edit" | "read", loc: { toplevel: string; rel: string; via: "git" | "jj" }, event: { input: unknown; content: unknown[] }, snap: SettingsSnapshot): Promise<unknown> => {
      const rel = loc.rel;
      if (!boundSpec) {
        if ((tool === "write" || tool === "edit") && isSpecPath(rel)) {
          await bind(rel, snap, loc.toplevel, loc.via);
          const patch = onBoundSpecWrite(tool, rel, event);
          await flush(true);
          return patch;
        } else if (isPlanPath(rel)) {
          const spec = planSpecHeader(deps.fs.readFile(join(loc.toplevel, rel)) ?? "");
          const specRel = spec ? repoRelativeToolPath(loc.toplevel, loc.toplevel, spec) : undefined;
          if (specRel && deps.fs.exists(join(loc.toplevel, specRel))) {
            await bind(specRel, snap, loc.toplevel, loc.via);
            await flush(true);
          }
        }
        return undefined;
      }
      if (loc.toplevel !== toplevel) {
        // Another checkout: a fresh run, never a rename of this record.
        if ((tool === "write" || tool === "edit") && isSpecPath(rel)) {
          unbind();
          await bind(rel, snap, loc.toplevel, loc.via);
          const patch = onBoundSpecWrite(tool, rel, event);
          await flush(true);
          return patch;
        }
        return undefined;
      }
      if (tool === "read") return undefined;
      if (rel === boundSpec) {
        const patch = onBoundSpecWrite(tool, rel, event);
        await flush(false);
        return patch;
      }
      if (tool === "write" && isSpecPath(rel) && phases.brainstorm.status === "in_progress" && isDraftOrMissing(boundSpec)) {
        if (await rebind(rel)) onBoundSpecWrite(tool, rel, event);
        await flush(true);
        return undefined;
      }
      if (tool === "edit" && isSpecPath(rel)) {
        onOtherSpecEdit(rel, event);
        await flush(false);
      }
      return undefined;
    };

    // Defined in block 2.
    let onBoundSpecWrite: (tool: "write" | "edit", rel: string, event: { input: unknown; content: unknown[] }) => unknown;
    let onOtherSpecEdit: (rel: string, event: { input: unknown }) => void;

    let amendmentOpen = false;
    let lastPlanTasks: { status: string }[] | undefined;
    const pendingTest = new Map<string, string>(); // toolCallId -> matched statement

    const phaseAcc = (k: PhaseKey = phaseNow()): PhaseAcc => (live().phases[k] ??= {});

    const addPhaseTokens = (t: Tokens | undefined, k: PhaseKey = phaseNow()) => {
      if (!t) return;
      const acc = phaseAcc(k);
      acc.tokens = addTokens(acc.tokens, t);
    };

    const onSubagentResult = async (details: unknown, content: unknown) => {
      const results = (details as { results?: unknown[] } | undefined)?.results;
      if (!Array.isArray(results) || results.length === 0) return;
      const acc = live();
      const text = textOf(content);
      for (const raw of results) {
        const r = raw as { agent?: unknown; exitCode?: unknown; model?: unknown; usage?: unknown };
        const agent = typeof r.agent === "string" ? r.agent : "unknown";
        const exit = typeof r.exitCode === "number" ? r.exitCode : undefined;
        const model = typeof r.model === "string" ? r.model : undefined;
        pushEvent({ kind: "dispatch", agent, model, exit: exit === 0 ? undefined : exit });
        const tokens = usageToTokens(r.usage);
        addPhaseTokens(tokens);
        const persona = (acc.personas[agent] ??= { dispatches: 0, models: [] });
        persona.dispatches += 1;
        if (model && !persona.models.includes(model)) persona.models.push(model);
        if (tokens) persona.tokens = addTokens(persona.tokens, tokens);
        if (agent === "spec-summarizer") acc.gates.spec_rounds += 1;
        if (REVIEWER_AGENTS.has(agent)) {
          const review = (acc.reviews[agent] ??= { dispatches: 0, nonzero_exit: 0 });
          review.dispatches += 1;
          if (exit !== undefined && exit !== 0) review.nonzero_exit += 1;
          const findings = countFindings(text);
          if (findings) {
            review.findings ??= { blocker: 0, major: 0, minor: 0 };
            review.findings.blocker += findings.blocker;
            review.findings.major += findings.major;
            review.findings.minor += findings.minor;
          }
          if (agent === "conformance-reviewer") {
            if (phases.verify.status === "in_progress") acc.conformance_loops += 1;
            const openGaps = countOpenGaps(text);
            if (openGaps !== undefined) acc.conformance_open_gaps = openGaps;
          }
        }
      }
      await flush(false);
    };

    const onPlanTracker = async (details: unknown, snap: SettingsSnapshot) => {
      const d = details as { tasks?: { name?: string; status: string }[]; error?: string; action?: string } | undefined;
      if (!d || d.error || !Array.isArray(d.tasks)) return;
      if (d.action === "update" && hasReopen(lastPlanTasks, d.tasks)) {
        live().gates.task_reopens += 1;
        pushEvent({ kind: "gate", gate: "task_reopen" });
      }
      lastPlanTasks = d.tasks;
      if (record && implementAutoCompletes(phases, d.tasks)) {
        record.derived.plan = planTotals(d.tasks);
        const next: PhaseMap = { ...phases, implement: { status: "complete" } };
        await applyPhaseDetails({ action: "complete", phases: next }, snap);
        return;
      }
      if (record) await flush(false);
    };

    let pendingShip: { id: string; option: "squash" | "pr" | "discard" } | undefined;

    const computeDiff = async (snap: SettingsSnapshot) => {
      if (!record || !toplevel) return;
      let baseRef: string | undefined;
      for (const ref of BASE_REFS) {
        if ((await deps.git(["rev-parse", "--verify", "--quiet", ref], toplevel!)).code === 0) {
          baseRef = ref;
          break;
        }
      }
      if (!baseRef) {
        warn("diff omitted: no base ref among origin/HEAD, main, master");
        return;
      }
      const mb = await deps.git(["merge-base", "HEAD", baseRef], toplevel!);
      if (mb.code !== 0 || !mb.stdout.trim()) {
        warn(`diff omitted: merge-base failed: ${mb.stderr.trim().split("\n")[0]}`);
        return;
      }
      const base = mb.stdout.trim();
      const names = await deps.git(["diff", "--name-only", `${base}...HEAD`], toplevel!);
      const files = modifiedFilesFrom(names.stdout, record.spec, currentDir);
      const numstat = await deps.git(["diff", "--numstat", `${base}...HEAD`], toplevel!);
      const count = await deps.git(["rev-list", "--count", "--invert-grep", "--grep=^telemetry: ", `${base}..HEAD`], toplevel!);
      record.derived.modified_files = files;
      record.derived.diff = { base, commits: Number(count.stdout.trim()) || 0, buckets: aggregateNumstat(numstat.stdout, new Set(files), snap.telemetry.buckets) };
    };

    const clearShipState = () => {
      if (!record) return;
      record.shipped_at = undefined;
      record.abandoned_at = undefined;
      record.status = "in_progress";
      record.derived.diff = undefined;
      record.derived.modified_files = undefined;
    };

    const shipAttempt = async (option: "squash" | "pr" | "keep" | "discard", command: string | undefined, snap: SettingsSnapshot) => {
      if (!record) return;
      const ts = deps.now();
      if (option === "discard") {
        record.status = "abandoned";
        record.abandoned_at = ts;
      } else {
        record.status = "shipped";
        record.shipped_at = ts;
        await computeDiff(snap);
      }
      pushEvent({ kind: "ship", option, command: command ? truncateCommand(command) : undefined });
      await flush(true);
    };

    onShipKeep = async (snap) => {
      if (!record || liveShipEvent(record.events)) return;
      await shipAttempt("keep", undefined, snap);
    };

    pi.on("tool_call", async (event, ctx) => {
      lastCtx = ctx;
      const snap = enabledSettings(ctx);
      if (!snap) return undefined;
      if (event.toolName === "write") {
        const rawPath = (event.input as { path?: unknown }).path;
        if (typeof rawPath === "string" && phases.brainstorm.status === "in_progress") {
          const loc = await locate(ctx, rawPath);
          if (loc && isSpecPath(loc.rel)) {
            const recRel = recordPathFor(snap.telemetry.dir, loc.rel);
            const existing = deps.fs.readFile(join(loc.toplevel, recRel));
            const parsed = existing ? parseRecord(existing) : undefined;
            if (parsed?.shipped_at) return { block: true, reason: guardReason(loc.rel, parsed.shipped_at, recRel) };
          }
        }
        return undefined;
      }
      if (event.toolName === "bash") {
        const command = String((event.input as { command?: unknown }).command ?? "");
        if (record && !frozen && phases.ship.status === "in_progress" && !liveShipEvent(record.events)) {
          const ship = matchShipStatement(command);
          if (ship) {
            pendingShip = { id: event.toolCallId, option: ship.option };
            await shipAttempt(ship.option, ship.statement, snap);
            return undefined;
          }
          const discard = matchDiscardStatement(command);
          if (discard) {
            pendingShip = { id: event.toolCallId, option: "discard" };
            await shipAttempt("discard", discard, snap);
            return undefined;
          }
        }
        if (record && (phases.verify.status === "in_progress" || phases.ship.status === "in_progress")) {
          const statement = matchTestStatement(command, snap.testCommands ?? DEFAULT_TEST_COMMANDS);
          if (statement) pendingTest.set(event.toolCallId, statement);
        }
      }
      return undefined;
    });
    pi.on("message_end", async (event, ctx) => {
      lastCtx = ctx;
      if (!enabledSettings(ctx)) return;
      const msg = event.message as { role?: string; usage?: unknown };
      if (msg.role !== "assistant") return;
      addPhaseTokens(usageToTokens(msg.usage));
    });

    pi.on("turn_end", async (_event, ctx) => {
      if (!enabledSettings(ctx)) return;
      const tokens = ctx.getContextUsage?.()?.tokens;
      if (typeof tokens !== "number") return;
      const acc = phaseAcc();
      acc.peak_context = Math.max(acc.peak_context ?? 0, tokens);
    });

    pi.on("input", async (event, ctx) => {
      if (!enabledSettings(ctx)) return undefined;
      amendmentOpen = false;
      if (!record || event.source === "extension" || event.text.trimStart().startsWith("/")) return undefined;
      const k = phaseNow();
      if (COUNTED_USER_PHASES.has(k)) {
        const acc = phaseAcc(k);
        acc.user_messages = (acc.user_messages ?? 0) + 1;
      }
      return undefined;
    });

    pi.on("model_select", async (event, ctx) => {
      lastCtx = ctx;
      if (!enabledSettings(ctx) || phaseNow() === "unphased") return;
      pushEvent({ kind: "config_change", model: `${event.model.provider}/${event.model.id}` });
      await flush(false);
    });

    pi.on("thinking_level_select", async (event, ctx) => {
      lastCtx = ctx;
      if (!enabledSettings(ctx) || phaseNow() === "unphased") return;
      pushEvent({ kind: "config_change", thinking: String(event.level) });
      await flush(false);
    });

    pi.on("session_compact", async (_event, ctx) => {
      if (!enabledSettings(ctx)) return;
      const acc = phaseAcc();
      acc.compactions = (acc.compactions ?? 0) + 1;
      await flush(false);
    });

    onBoundSpecWrite = (tool, rel, event) => {
      if (!record) return undefined;
      if (tool === "edit" && SUPERSEDED_BY_RE.test(insertedText(event.input))) return undefined;
      const body = deps.fs.readFile(abs(rel));
      if (body === undefined) return undefined;
      const acc = live();
      const k = phaseNow();
      const cur = acc.spec_writes[k] ?? { count: 0, last_sha256: "" };
      acc.spec_writes[k] = { count: cur.count + 1, last_sha256: sha256(new TextEncoder().encode(body)) };
      refreshLinks();
      if (record.shipped_at) {
        acc.spec_edits_after_ship += 1;
        const warning = `⚠️ spec shipped at ${record.shipped_at}; write a follow-up spec that supersedes it`;
        return { content: [{ type: "text" as const, text: warning }, ...(event.content as { type: string }[])] };
      }
      if (record.approved_at && !amendmentOpen) {
        acc.amendments += 1;
        amendmentOpen = true;
      }
      return undefined;
    };

    onOtherSpecEdit = (rel, event) => {
      if (!record || !boundSpec || !isSafeSpecLink(rel)) return;
      if (!isSupersededByBanner(insertedText(event.input), boundSpec)) return;
      predecessorLinks.add(rel);
      refreshLinks();
    };

}
