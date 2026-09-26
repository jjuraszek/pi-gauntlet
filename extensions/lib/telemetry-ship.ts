// Pure ship-time helpers for the telemetry extension: diff file filter and guard block reason.

export const guardReason = (spec: string, shippedAt: string, recordRel: string): string =>
  `spec ${spec} shipped at ${shippedAt} (record ${recordRel}). Write a new date-slugged spec that supersedes it instead of reusing this file.`;

// derived.modified_files: `git diff --name-only <base>...HEAD` output minus the bound
// spec, doc/plans/**, and <dir>/**; sorted repo-relative paths (renames -> new path).
export function modifiedFilesFrom(nameOnly: string, spec: string, dir: string): string[] {
  const dirPrefix = dir.replace(/\/+$/, "") + "/";
  return nameOnly
    .split("\n")
    .filter((f) => f && f !== spec && !/(^|\/)doc\/plans\//.test(f) && !f.startsWith(dirPrefix))
    .sort();
}
