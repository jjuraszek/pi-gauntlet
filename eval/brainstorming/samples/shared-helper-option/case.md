bundle-: skills/brainstorming/reference/spec-finalization.md
## Ask
Brainstorm letting the report job post to a requested channel while preserving notification retries and the default channel for other callers.

## Gather draft
lib/notify.ts#post owns formatting and retries but fixes the channel to general. jobs/report.ts inlines the same formatting and retry loop to send to reports. jobs/digest.ts calls post with only a message and must retain the general default. Primary code and both caller paths were traced successfully; no extra loader or runtime dependency is involved. Framing: holds - the shared helper is the owning notification path and can support the requested channel without replacing its callers. Docs touched: none. No ticket.

## Recorded answers
Assistant: The framing holds: I checked lib/notify.ts#post and traced jobs/report.ts's inline send and jobs/digest.ts's default-channel call; both use the same formatting and retry contract, with no additional dependencies.
User: Keep that framing.
Q: Caller compatibility? A: A backward-compatible optional channel argument is allowed; preserve retries and existing default-channel calls.
Q: Must this introduce a new notification service? A: No. Report delivery to its requested channel is the outcome; choose ownership without adding a service.
Q: Other viable approach? A: A required channel argument with explicit general at existing call sites is allowed too, but compare its caller blast radius against the optional argument. Do not spend another turn clarifying; present the distinct approaches now.

## Fixture files
### lib/notify.ts
```typescript
export async function post(message: string) {
  const body = JSON.stringify({ channel: "general", text: `[notice] ${message}` });
  for (let attempt = 0; attempt < 2; attempt++) {
    try { await fetch("https://notify.invalid/post", { method: "POST", body }); return; }
    catch (error) { if (attempt === 1) throw error; }
  }
}
```
### jobs/report.ts
```typescript
export async function report(message: string, channel: string) {
  const body = JSON.stringify({ channel, text: `[notice] ${message}` });
  for (let attempt = 0; attempt < 2; attempt++) {
    try { await fetch("https://notify.invalid/post", { method: "POST", body }); return; }
    catch (error) { if (attempt === 1) throw error; }
  }
}
```
### jobs/digest.ts
```typescript
import { post } from "../lib/notify";
export const digest = () => post("Daily digest");
```
