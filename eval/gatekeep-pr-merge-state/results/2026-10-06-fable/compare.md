| sample | words b/c | backtick lines b/c | path tokens b/c | kept/disputed/lost b | kept/disputed/lost c | quality b | quality c |
|---|---|---|---|---|---|---|---|
| bound-viewer-green-ci | 211/398 | 3/10 | 3/4 | 2/0/3 | 5/0/0 | claude-opus-5-5=cluttered gpt-6-astra=cluttered | claude-opus-5-5=cluttered gpt-6-astra=cluttered |
| exempt-viewer-status-pending | 269/271 | 8/11 | 1/6 | 2/0/3 | 4/1/0 | claude-opus-5-5=cluttered gpt-6-astra=cluttered | claude-opus-5-5=readable gpt-6-astra=cluttered |
| flip-after-update-branch | 513/412 | 10/9 | 0/9 | 1/1/3 | 5/0/0 | claude-opus-5-5=cluttered gpt-6-astra=cluttered | claude-opus-5-5=cluttered gpt-6-astra=cluttered |
| live-checkrun-pending | 211/332 | 6/7 | 0/0 | 3/1/0 | 4/0/0 | claude-opus-5-5=readable gpt-6-astra=cluttered | claude-opus-5-5=cluttered gpt-6-astra=cluttered |
| same-head-flip | 478/401 | 15/6 | 2/1 | 3/0/1 | 3/1/0 | claude-opus-5-5=cluttered gpt-6-astra=cluttered | claude-opus-5-5=cluttered gpt-6-astra=cluttered |
| unknown-after-repoll | 303/340 | 11/9 | 0/1 | 3/0/1 | 4/0/0 | claude-opus-5-5=cluttered gpt-6-astra=cluttered | claude-opus-5-5=cluttered gpt-6-astra=cluttered |

result: fail
fail: bound-viewer-green-ci: no reviewer quality reaches readable
fail: flip-after-update-branch: no reviewer quality reaches readable
fail: live-checkrun-pending: no reviewer quality reaches readable
fail: live-checkrun-pending: quality dropped readable -> cluttered for anthropic/claude-opus-5-5
fail: same-head-flip: no reviewer quality reaches readable
fail: unknown-after-repoll: no reviewer quality reaches readable
disputed: exempt-viewer-status-pending f3 (gpt-6-astra: no)
disputed: same-head-flip f4 (gpt-6-astra: no)
