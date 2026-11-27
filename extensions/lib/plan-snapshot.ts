import type { SessionEntry } from "@earendil-works/pi-coding-agent";

export const PLAN_TRACKER_SNAPSHOT = "plan-tracker-snapshot";
export const TASK_STATUSES = ["pending", "in_progress", "complete", "failed", "skipped"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];
export interface Task { name: string; status: TaskStatus; label?: string; }

export function planSnapshot(entry: SessionEntry): Task[] | undefined {
  let payload: unknown;
  if (entry.type === "custom" && entry.customType === PLAN_TRACKER_SNAPSHOT) {
    payload = entry.data;
  } else if (entry.type === "message" && entry.message.role === "toolResult" &&
      entry.message.toolName === "plan_tracker" && !entry.message.isError) {
    payload = entry.message.details;
  }
  const details = payload as { tasks?: Task[]; error?: string } | undefined;
  if (!details?.error && Array.isArray(details?.tasks)) return details.tasks;
}

export function latestPlanSnapshot(branch: readonly SessionEntry[]): Task[] {
  for (let i = branch.length - 1; i >= 0; i--) {
    const tasks = planSnapshot(branch[i]);
    if (tasks) return tasks;
  }
  return [];
}
