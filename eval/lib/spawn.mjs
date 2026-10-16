import { execFile } from "node:child_process";

export function spawnCommand(command, args, { cwd, input, signal, timeout = 600000, maxBuffer = 64 * 1024 * 1024 } = {}) {
  const start = Date.now();
  return new Promise((resolve) => {
    const child = execFile(command, args, { cwd, encoding: "utf8", timeout, maxBuffer, signal }, (error, stdout, stderr) => {
      const wallMs = Date.now() - start;
      if (!error && stdout?.trim()) return resolve({ status: "ok", stdout, wallMs });
      let reason;
      if (!error) reason = "empty output";
      else if (error.name === "AbortError") reason = "aborted";
      else if (error.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER") reason = "maxBuffer exceeded";
      else if (error.killed && error.signal === "SIGTERM") reason = "timeout";
      else if (typeof error.code === "number") reason = stderr?.trim() || `exit ${error.code}`;
      else reason = String(error);
      resolve({ status: "error", stderr: reason, wallMs });
    });
    // A child can exit before consuming stdin; its exit result owns the error.
    child.stdin.on("error", () => {});
    child.stdin.end(input ?? "");
  });
}

export function limiter(limit) {
  let active = 0;
  const queue = [];
  const next = () => {
    if (active >= limit || queue.length === 0) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    Promise.resolve().then(fn).then(resolve, reject).finally(() => { active--; next(); });
  };
  return (fn) => new Promise((resolve, reject) => { queue.push({ fn, resolve, reject }); next(); });
}
