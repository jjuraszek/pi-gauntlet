import type { ToolResultEvent, ToolResultEventResult } from "@earendil-works/pi-coding-agent";

export function appendToolWarning(
  event: ToolResultEvent,
  pending: Map<string, string>,
): ToolResultEventResult | undefined {
  const warning = pending.get(event.toolCallId);
  if (!warning) return;
  pending.delete(event.toolCallId);
  if (event.parentToolCallId) {
    const existing = pending.get(event.parentToolCallId);
    pending.set(event.parentToolCallId, existing ? `${existing}\n\n${warning}` : warning);
    return;
  }
  return {
    content: [{ type: "text", text: warning }, ...event.content],
    // Pi drops structuredContent when a content replacement omits it.
    ...(event.structuredContent !== undefined ? { structuredContent: event.structuredContent } : {}),
  };
}
