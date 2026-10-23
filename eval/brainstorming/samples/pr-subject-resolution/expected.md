anonymized: true
- ordered: judged: PR lookup completes before any issue lookup, never reversed or parallel; a successful PR classification does not also take the issue path.
- open: judged: Open takes only the PR-head path on fix/retry (including the draft), with a pr-55 filename from title, not a fresh branch; it carries PR intent into Problem and none - no ticket into ACs.
- issue: judged: Issue reaches issue lookup only after not-a-PR and retains the existing ticket path and verbatim ticket AC row, without PR handling.
- neither: judged: Neither stops with the one-line neither-PR-nor-issue error naming #57 and acme/widget, before provisioning.
- mention: judged: Mention stays free text with context-builder for #55 and never takes PR provisioning.
- foreign: judged: Foreign stops before provisioning and names both other/widget and acme/widget.
- binding: judged: Bound selects #12 from title before body's first line, preserves #12 ACs, names #13 as Problem context, ignores branch and closingIssuesReferences #99 for binding, and retains the bound-ticket filename rule.
