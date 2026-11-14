for: f54e2413a44940d93f3077bc7e0258a5a1ad01754ef51232252b28c1b492ef98

## Change

Route row 4 to spec-only draft-PR publication with Amend-grant none and Engine deferred. Preserve the default-branch diff proof, non-force push, draft creation, URL-before-completion order and ownership-based cleanup. Print the fresh-session Continue line after the URL. On create failure, recommend only retry row 4 regardless of context; bare approve echoes and retries create without another amend or push, while engine digits get one question and no writes.

Keep row 4 available on a zero-row gate by omitting row 2 and its flags. Update option-6-handoff to row-4 replies and add low/unknown-context retry and Continue facts while retaining its zero-row, single-member subject and cleanup variants. Run only spec-gate/option-6-handoff against base 855e872a42f9cac7a795704f3e0b383b182950ab. This replay checks narrated calls, not live publication or cleanup. Preserve every other sample record; coverage is partial.

## Expected to move
- option-6-handoff/menu: fails -> holds - A zero-row gate offers 1, 3 and 4 with no loop allowance line.
- option-6-handoff/persistence: fails -> holds - Row 4 selects deferred publication, not loop implementation.
- option-6-handoff/publication: fails -> holds - Row 4 publishes only after the spec-only proof.
- option-6-handoff/retry-menu: fails -> holds - The create-only retry keeps row 4 recommended and accepts bare approve.
- option-6-handoff/continue: fails -> holds - The URL is followed by the fresh-session continuation instruction.
