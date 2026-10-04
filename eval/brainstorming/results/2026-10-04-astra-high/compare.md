| sample | words b/c | backtick lines b/c | path tokens b/c | kept/disputed/lost b | kept/disputed/lost c | quality b | quality c |
|---|---|---|---|---|---|---|---|
| explicit-unit-normalization | 499/883 | 2/9 | 8/19 | 6/0/0 | 5/1/0 | kimi-k3=briefing claude-fable-5-1=readable | kimi-k3=briefing claude-fable-5-1=readable |
| latest-run-indicator | 575/717 | 4/4 | 5/10 | 5/0/1 | 5/0/1 | kimi-k3=briefing claude-fable-5-1=briefing | kimi-k3=readable claude-fable-5-1=readable |
| review-and-apply-containment | 626/815 | 3/7 | 6/16 | 3/1/2 | 6/0/0 | kimi-k3=readable claude-fable-5-1=readable | kimi-k3=briefing claude-fable-5-1=readable |

result: fail
fail: latest-run-indicator: quality dropped briefing -> readable for github-copilot/kimi-k3
fail: latest-run-indicator: quality dropped briefing -> readable for anthropic-fable/claude-fable-5-1
fail: latest-run-indicator: fact framing lost by every reviewer
disputed: explicit-unit-normalization framing (claude-fable-5-1: no)
