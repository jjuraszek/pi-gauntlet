for: 0240364f18178794b26741f902c1975b1a7ed05475c9eabfa19b2c19dba08ca7

## Change

Separate spec candidates from the content-check file list using the session's flow-guard dirs, with the default dirs on harnesses without that tool. Skip plan folders, keep specs outside the file budget, and route them only to the spec-superseded rule. Exclude both folders from content commands and helpers, and continue a specs-only selection through Check. Deterministic source assertions cover this selection change; no rendered card or report checkpoint changes here, and no model replay is claimed.

## Expected to move
