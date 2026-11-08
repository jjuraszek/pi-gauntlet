import type { ToolResultEvent, ToolResultEventResult } from "@earendil-works/pi-coding-agent";

export function prependWarning(event: ToolResultEvent, text: string): ToolResultEventResult {
  return {
    content: [{ type: "text", text }, ...(event.content ?? [])],
    // Pi drops structuredContent when a content replacement omits it.
    structuredContent: event.structuredContent,
  };
}

export function createPendingWarnings() {
  const pending = new Map<string, string>();
  const add = (id: string, text: string) => {
    const prior = pending.get(id);
    pending.set(id, prior ? `${prior}\n\n${text}` : text);
  };
  return {
    add,
    take(id: string): string | undefined {
      const text = pending.get(id);
      pending.delete(id);
      return text;
    },
    deliver(event: ToolResultEvent, text: string): ToolResultEventResult | undefined {
      if (event.parentToolCallId) {
        add(event.parentToolCallId, text);
        return undefined;
      }
      return prependWarning(event, text);
    },
    clear() {
      pending.clear();
    },
  };
}
