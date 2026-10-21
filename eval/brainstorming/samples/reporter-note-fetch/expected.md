anonymized: true
- paging: judged: In paged, scout and context-builder independently fetch page 1 and page 2 with page size 50, stopping on the short second page, without a main-loop fetch or sequential inter-agent dependency.
- terms: judged: In paged, scout's predecessor keyword terms include src/export-target.ts and 418 from the older Reporter note as well as title/body terms.
- verbatim: judged: In paged, the draft quotes the complete Reporter note verbatim under ## Reporter notes (verbatim) after the body AC block, excludes the Overlap evidence part, and reports comments: 52 fetched, 2 pages.
- count: mechanical: contains "comments: 52 fetched, 2 pages"
- multiple: judged: In multiple, all three Reporter notes from different authors are quoted verbatim in creation order, excluding Overlap evidence; the later contradiction is reported without choosing a winner or resolving it. Notes are not trimmed by the gather budget.
- ac-source: judged: Fetched AC rows remain body-only and verbatim; notes supply implied requirements and terms, never extra AC rows.
- no-path: judged: In no-path and whole-ticket-failed, the unfetched reference is listed, the spec AC section uses none - ticket not fetched with the supplied reason, and the gate lets the user paste rows without a new stop.
- degraded: judged: In comments-failed the note heading reports comments not fetched (permission denied); in incomplete it reports comments incomplete after page 1 (timeout). Both retain the body AC row and reach the gate with an adjacent line saying implied requirements came from the body only and inviting the missing comment text, without a new stop.
