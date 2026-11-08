// Mirror the runner's replacement rule so a raw hook return cannot hide data loss.
export function mergeToolResult(event, ret) {
  if (ret === undefined) return event;
  const merged = { ...event, ...ret };
  if (ret.content !== undefined && ret.structuredContent === undefined) {
    delete merged.structuredContent;
  }
  return merged;
}
