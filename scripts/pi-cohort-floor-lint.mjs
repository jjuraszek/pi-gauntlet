import { readFileSync } from "node:fs";
import { join } from "node:path";

export function lintPiCohortFloor(root) {
  let peer;
  let readme;
  try {
    peer = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).peerDependencies?.["pi-cohort"] ?? "missing";
  } catch (error) {
    peer = error.code === "ENOENT" ? "missing" : "unreadable";
  }
  try {
    const content = readFileSync(join(root, "README.md"), "utf8");
    readme = content.match(/^\s*- \[pi-cohort\]\([^\n)]+\)\s+>=\s*(\S+)/m)?.[1] ?? "missing";
  } catch (error) {
    readme = error.code === "ENOENT" ? "missing" : "unreadable";
  }
  const floor = typeof peer === "string" ? peer.match(/^>=(\d+\.\d+\.\d+)$/)?.[1] : undefined;
  if (floor && /^\d+\.\d+\.\d+$/.test(readme) && floor === readme) return [];
  return [`pi-cohort floor: package.json peerDependencies["pi-cohort"]=${JSON.stringify(peer)}; README.md install floor=${JSON.stringify(readme)}. Require >=X.Y.Z in package.json and the same X.Y.Z in README.md.`];
}
