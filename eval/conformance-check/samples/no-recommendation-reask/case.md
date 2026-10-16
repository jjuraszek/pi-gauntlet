replay: continuation

## Current state
The final audit and freshness checks are complete. One MISSING gap remains: the Lantern release checklist requires an integrity manifest (sha256 table) attached to release notes, but the release notes ship without it. The build log contains the table. The durable concern has recommended: none. Ownership is unknown, so fix-now is unavailable. The writable spec and existing publication behavior permit accept and rescope as table options; the standalone concern and executable tracker convention permit follow-up. None is evidence-executable as a recommendation: there is no manifest to ratify, dropping the requirement is a human scope call, and no separate owner exists. The concrete custom effect still required is appending the build log's sha256 table to the release notes. Nothing has executed.

## Recorded conversation
Assistant:
1. Integrity manifest is missing - the release notes lack the required sha256 table, leaving artifact integrity undocumented.
   The spec requires the manifest, but implementation is incomplete and fix ownership is unknown.
   A) accept - Ratify the current published behavior in the spec.
   B) rescope - Remove or defer the manifest requirement from this workflow.
   C) follow-up - Keep the requirement valid and transfer it to separately owned work.
   Custom: <your own answer> - Supply another concrete effect, such as appending the build log's sha256 table to the release notes.
   No recommendation - pick one
   Not available: fix-now - file ownership has not been established.

Conformance: 1 decision needed before shipping.
happy-path: not run - no row configured
whole-diff minors: none
Reply: one line per item: <n>. <letter or free text>; bare "1" takes every recommendation and re-asks items without one by number.

User: 1
