import type { SessionEntry } from "@earendil-works/pi-coding-agent";

export const PLAN_TRACKER_SNAPSHOT = "plan-tracker-snapshot";
export const MAX_STORED_LIST_BYTES = 32768;
export const TASK_STATUSES = ["pending", "in_progress", "complete", "failed", "skipped"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];
export interface Task { name: string; status: TaskStatus; label?: string; }

export function snapshotTasks(payload: unknown): Task[] | undefined {
  const details = payload as { tasks?: Task[]; error?: string } | undefined;
  if (!details?.error && Array.isArray(details?.tasks)) return details.tasks;
}

export function planSnapshot(entry: SessionEntry): Task[] | undefined {
  if (entry.type === "custom" && entry.customType === PLAN_TRACKER_SNAPSHOT) {
    return snapshotTasks(entry.data);
  } else if (entry.type === "message" && entry.message.role === "toolResult" &&
      entry.message.toolName === "plan_tracker" && !entry.message.isError) {
    return snapshotTasks(entry.message.details);
  }
}

export function latestPlanSnapshot(branch: readonly SessionEntry[]): Task[] {
  for (let i = branch.length - 1; i >= 0; i--) {
    const tasks = planSnapshot(branch[i]);
    if (tasks) return tasks;
  }
  return [];
}
