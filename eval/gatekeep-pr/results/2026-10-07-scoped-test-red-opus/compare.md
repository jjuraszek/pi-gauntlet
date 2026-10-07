| sample | words b/c | backtick lines b/c | path tokens b/c | kept/disputed/lost b | kept/disputed/lost c | quality b | quality c |
|---|---|---|---|---|---|---|---|
| conflict-free-sync | 805/703 | 54/50 | 36/27 | 5/0/0 | 5/0/0 | gpt-6-astra=faithful claude-fable-5-1:medium=exact | gpt-6-astra=partial claude-fable-5-1:medium=exact |
| conflicting-file-sync | 1002/876 | 53/57 | 45/48 | 5/0/0 | 5/0/0 | gpt-6-astra=faithful claude-fable-5-1:medium=exact | gpt-6-astra=faithful claude-fable-5-1:medium=exact |
| head-not-pushable | 354/412 | 16/20 | 2/3 | 3/1/0 | 4/0/0 | gpt-6-astra=partial claude-fable-5-1:medium=faithful | gpt-6-astra=faithful claude-fable-5-1:medium=faithful |
| helper-unavailable | 333/364 | 13/16 | 2/3 | 4/0/0 | 4/0/0 | gpt-6-astra=exact claude-fable-5-1:medium=exact | gpt-6-astra=faithful claude-fable-5-1:medium=faithful |
| no-flag-unchanged | 749/561 | 32/25 | 12/9 | 4/0/0 | 4/0/0 | gpt-6-astra=exact claude-fable-5-1:medium=faithful | gpt-6-astra=faithful claude-fable-5-1:medium=faithful |
| other-author-confirm | 716/676 | 39/30 | 15/15 | 3/1/0 | 3/1/0 | gpt-6-astra=partial claude-fable-5-1:medium=faithful | gpt-6-astra=partial claude-fable-5-1:medium=exact |
| red-ci-no-autofix | 926/925 | 49/47 | 28/30 | 3/1/0 | 3/1/0 | gpt-6-astra=partial claude-fable-5-1:medium=faithful | gpt-6-astra=partial claude-fable-5-1:medium=exact |
| scoped-test-red-sync | 839/1165 | 47/52 | 29/46 | 1/0/4 | 5/0/0 | gpt-6-astra=off-script claude-fable-5-1:medium=off-script | gpt-6-astra=exact claude-fable-5-1:medium=exact |

result: fail
fail: conflict-free-sync: quality dropped faithful -> partial for github-copilot/gpt-6-astra
fail: helper-unavailable: quality dropped exact -> faithful for github-copilot/gpt-6-astra
fail: helper-unavailable: quality dropped exact -> faithful for anthropic-fable/claude-fable-5-1:medium
fail: no-flag-unchanged: quality dropped exact -> faithful for github-copilot/gpt-6-astra
disputed: other-author-confirm f1 (gpt-6-astra: no)
disputed: red-ci-no-autofix f3 (gpt-6-astra: no)
