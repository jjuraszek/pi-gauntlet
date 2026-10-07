import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, basename } from "node:path";

// Assemble the handle so the hygiene definition does not match itself.
export const OWNER = ["jjur", "aszek"].join("");
const USER_PATH = /\/Users\/[^/\s]+(?:\/[^\s]*)?/g;
const SECRETS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  /\bghp_[A-Za-z0-9]{20,}/g,
  /\bsk-[A-Za-z0-9]{20,}/g,
  /\bAKIA[A-Z0-9]{16}\b/g,
  /\bxoxb-[0-9A-Za-z-]{20,}/g,
];
const OWNER_OCCURRENCES = new RegExp(`github\\.com/${OWNER}/|${OWNER}/[A-Za-z0-9_.-]+#\\d+|${OWNER}`, "gi");

function redactOwner(line) {
  return line.replace(OWNER_OCCURRENCES, (match) =>
    match.toLowerCase() === OWNER ? "[redacted:owner-handle]" : match);
}

export function scanText(text, denylist = []) {
  const hits = [];
  text.split("\n").forEach((line, i) => {
    const n = i + 1;
    if (USER_PATH.test(line)) hits.push({ rule: "user-path", line: n });
    USER_PATH.lastIndex = 0;
    if (redactOwner(line) !== line) hits.push({ rule: "owner-handle", line: n });
    for (const re of SECRETS) {
      if (re.test(line)) hits.push({ rule: "secret", line: n });
      re.lastIndex = 0;
    }
    for (const d of denylist) {
      if (new RegExp(d, "i").test(line)) hits.push({ rule: "denylist", line: n });
    }
  });
  return hits;
}

export function redact(text, denylist = []) {
  let out = text.replace(USER_PATH, "[redacted:user-path]");
  for (const re of SECRETS) out = out.replace(re, "[redacted:secret]");
  for (const d of denylist) out = out.replace(new RegExp(d, "gi"), "[redacted:denylist]");
  return out.split("\n").map(redactOwner).join("\n");
}

function* walk(dir) {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

// The target is the first path segment under root.
export function scanTree(root, { denylists }) {
  const hits = [];
  for (const file of walk(root)) {
    const rel = relative(root, file);
    if (rel.startsWith("lib/") || rel.startsWith("lib\\")) continue;
    const target = rel.split("/")[0];
    for (const h of scanText(readFileSync(file, "utf8"), basename(file) === "target.json" ? [] : denylists[target] ?? [])) {
      hits.push({ ...h, where: `${rel}:${h.line}` });
    }
  }
  return hits;
}
