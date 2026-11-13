# Base rules

Use these fixed rules as check data; each id names one issue class.

| Id | Kind | Rule |
|---|---|---|
| code-dead | Code | Remove dead, unreachable and commented-out code. |
| code-debug | Code | Remove leftover debug statements. |
| code-unused | Code | Remove unused imports, variables and modules with no caller. |
| code-duplicate | Code | Reuse an existing helper instead of duplicating its logic or another function of the same shape. |
| code-guards | Code | Validate at the owning boundary without repeating the same guard or adding fallbacks for impossible branches. |
| code-suppression | Code | Give a reason for each lint or type suppression. |
| code-reference | Code | Refer only to APIs, paths, columns and commands that exist. |
| code-secret | Code | Keep secrets out of files. |
| test-behavior | Tests | Assert behavior with assertions that can fail. |
| test-subject | Tests | Keep tests only while their subjects exist. |
| test-skip | Tests | Give a reason for each skipped test. |
| test-command | Tests | Pass the documented test command for the selection. |
| doc-current | Docs | Describe only behavior, paths and commands the code has. |
| doc-history | Docs | Keep current-state docs free of planned-work and history text, and remove superseded docs with no reader. |
| doc-comment | Docs | Keep comments free of code restatement, task context and references to removed things. |
| doc-conflict | Docs | State a rule at its owner rather than duplicating it in disagreeing places. |
| spec-superseded | Specs | Remove a spec whose title block carries a fully-superseded banner. |
| instruction-reference | Skills, commands, prompts | Name only paths, commands, tools and skills that exist. |
| instruction-frontmatter | Skills, commands, prompts | Include a name and description in frontmatter. |
