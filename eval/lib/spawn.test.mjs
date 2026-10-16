import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnCommand, limiter } from "./spawn.mjs";

const node = (script, options = {}) => spawnCommand(process.execPath, ["-e", script], options);
const tick = () => new Promise((resolve) => setImmediate(resolve));

test("stdin content reaches the child and is ended; stdout and wallMs are returned", async () => {
  const result = await node("let s='';process.stdin.on('data',(d)=>s+=d).on('end',()=>process.stdout.write('got '+s+' end'))", { input: "ping" });
  assert.deepEqual([result.status, result.stdout], ["ok", "got ping end"]);
  assert.equal(typeof result.wallMs, "number");
  assert.ok(result.wallMs >= 0);
});
test("non-zero exit maps to status error with stderr, else exit <n>", async () => {
  for (const [script, reason] of [
    ["process.stderr.write('bad');process.exit(3)", "bad"],
    ["process.exit(4)", "exit 4"],
  ]) {
    const { status, stderr, wallMs } = await node(script);
    assert.deepEqual([status, stderr], ["error", reason]);
    assert.equal(typeof wallMs, "number");
  }
});
test("empty stdout maps to empty output", async () => {
  const { status, stderr } = await node("");
  assert.deepEqual([status, stderr], ["error", "empty output"]);
});
test("output over maxBuffer maps to maxBuffer exceeded", async () => {
  const { status, stderr } = await node("process.stdout.write('x'.repeat(4096))", { maxBuffer: 1024 });
  assert.deepEqual([status, stderr], ["error", "maxBuffer exceeded"]);
});
test("timeout kills the child and maps to timeout", async () => {
  const { status, stderr } = await node("setTimeout(()=>{},5000)", { timeout: 200 });
  assert.deepEqual([status, stderr], ["error", "timeout"]);
});
test("abort kills a sleeping child and maps to aborted", async () => {
  const controller = new AbortController();
  const pending = node("setTimeout(()=>{},5000)", { signal: controller.signal });
  setTimeout(() => controller.abort(), 50);
  const { status, stderr } = await pending;
  assert.deepEqual([status, stderr], ["error", "aborted"]);
});
test("abort and subsequent child close settle the result exactly once", async () => {
  const controller = new AbortController();
  let settlements = 0;
  const pending = node("process.stdout.write('ready');setTimeout(()=>process.exit(3),5000)", { signal: controller.signal }).then((result) => {
    settlements++;
    return result;
  });
  controller.abort();
  const result = await pending;
  assert.deepEqual([result.status, result.stderr], ["error", "aborted"]);
  await tick();
  assert.equal(settlements, 1);
  await new Promise((resolve) => setTimeout(resolve, 100));
  assert.equal(settlements, 1);
});
test("a missing command resolves to an error instead of throwing", async () => {
  const { status, stderr } = await spawnCommand("definitely-not-a-command-xyz", [], {});
  assert.equal(status, "error");
  assert.match(stderr, /ENOENT/);
});
test("limiter runs at most limit jobs at once and returns each result", async () => {
  const run = limiter(2);
  let inFlight = 0, peak = 0;
  const release = [];
  const job = (n) => run(() => new Promise((resolve) => {
    inFlight++;
    peak = Math.max(peak, inFlight);
    release.push(() => { inFlight--; resolve(n); });
  }));
  const results = Promise.all([job(1), job(2), job(3)]);
  await tick();
  assert.equal(inFlight, 2);
  release.shift()();
  await tick();
  assert.equal(inFlight, 2);
  while (release.length) { release.shift()(); await tick(); }
  assert.deepEqual(await results, [1, 2, 3]);
  assert.equal(peak, 2);
});
test("limiter propagates a rejected job and keeps serving", async () => {
  const run = limiter(1);
  await assert.rejects(run(() => Promise.reject(new Error("nope"))), /nope/);
  assert.equal(await run(() => Promise.resolve(7)), 7);
});
