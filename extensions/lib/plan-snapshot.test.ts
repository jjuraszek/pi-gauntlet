import assert from "node:assert/strict";
import { test } from "node:test";
import type { CustomEntry, SessionMessageEntry } from "@earendil-works/pi-coding-agent";
import { latestPlanSnapshot, planSnapshot, PLAN_TRACKER_SNAPSHOT, type TaskStatus } from "./plan-snapshot.ts";

const timestamp = "2026-01-01T00:00:00.000Z";
const initialTasks = [{ name: "write test", status: "pending" satisfies TaskStatus }];
const storedTasks = [{ name: "write test", status: "in_progress" satisfies TaskStatus }];
const updatedTasks = [{ name: "write test", status: "complete" satisfies TaskStatus }];

function result(
  id: string,
  parentId: string | null,
  details: Extract<SessionMessageEntry["message"], { role: "toolResult" }>["details"],
  { isError = false, toolName = "plan_tracker" } = {},
): SessionMessageEntry {
  return {
    type: "message", id, parentId, timestamp,
    message: { role: "toolResult", toolName, toolCallId: id, content: [], details, isError, timestamp: Date.parse(timestamp) },
  };
}

const init = result("init", null, { action: "init", tasks: initialTasks });
const stored: CustomEntry = {
  type: "custom", id: "stored", parentId: init.id, timestamp,
  customType: PLAN_TRACKER_SNAPSHOT, data: { tasks: storedTasks },
};
const update = result("update", stored.id, { action: "update", tasks: updatedTasks });
const clear = result("clear", update.id, { action: "clear", tasks: [] });
const executionError = result("execution-error", clear.id, { action: "update", tasks: initialTasks }, { isError: true });
const detailsError = result("details-error", executionError.id, { action: "update", tasks: initialTasks, error: "invalid update" });

for (const [name, entry, expected] of [
  ["explicit result", update, updatedTasks],
  ["stored snapshot", stored, storedTasks],
  ["empty clear", clear, []],
  ["execution error", executionError, undefined],
  ["details error", detailsError, undefined],
  ["unrelated tool", result("other", null, { tasks: initialTasks }, { toolName: "phase_tracker" }), undefined],
  ["unrelated custom entry", { ...stored, customType: "other" }, undefined],
] as const) {
  test(`planSnapshot reads only successful plan entries (${name})`, () => {
    assert.deepEqual(planSnapshot(entry), expected);
  });
}

const shared = [init, stored];
const fork = result("fork", stored.id, undefined, { toolName: "phase_tracker" });

for (const [name, branch, expected] of [
  ["no snapshot", [], []],
  ["stored snapshot supersedes explicit init", shared, storedTasks],
  ["explicit update supersedes stored snapshot", [...shared, update], updatedTasks],
  ["clear supersedes nonempty snapshots despite later errors", [...shared, update, clear, executionError, detailsError], []],
  ["fork retains its latest shared snapshot, not the original branch's clear", [...shared, fork], storedTasks],
] as const) {
  test(`latestPlanSnapshot reads the newest successful entry on the given branch (${name})`, () => {
    assert.deepEqual(latestPlanSnapshot(branch), expected);
  });
}
