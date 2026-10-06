| sample | words b/c | backtick lines b/c | path tokens b/c | kept/disputed/lost b | kept/disputed/lost c | quality b | quality c |
|---|---|---|---|---|---|---|---|
| deferred-with-ref | 180/119 | 0/0 | 9/3 | 3/0/3 | 6/0/0 | claude-opus-5-5=readable gpt-6-astra=readable | claude-opus-5-5=briefing gpt-6-astra=readable |
| deferred-without-ref | 183/152 | 0/0 | 8/4 | 2/0/3 | 5/0/0 | claude-opus-5-5=readable gpt-6-astra=briefing | claude-opus-5-5=briefing gpt-6-astra=briefing |
| deviates | 141/145 | 0/0 | 6/2 | 1/0/4 | 5/0/0 | claude-opus-5-5=readable gpt-6-astra=readable | claude-opus-5-5=briefing gpt-6-astra=readable |
| directional-dependency | 437/394 | 5/6 | 16/3 | 3/0/2 | 5/0/0 | claude-opus-5-5=readable gpt-6-astra=readable | claude-opus-5-5=briefing gpt-6-astra=readable |
| mixed-coverage | 205/136 | 0/0 | 9/3 | 1/0/4 | 5/0/0 | claude-opus-5-5=readable gpt-6-astra=readable | claude-opus-5-5=briefing gpt-6-astra=readable |
| no-spec-quality | 135/82 | 0/0 | 4/1 | 3/0/2 | 5/0/0 | claude-opus-5-5=briefing gpt-6-astra=briefing | claude-opus-5-5=briefing gpt-6-astra=briefing |
| post-merge-menu | 244/441 | 2/6 | 7/13 | 1/0/3 | 4/0/0 | claude-opus-5-5=mixed gpt-6-astra=mixed | claude-opus-5-5=briefing gpt-6-astra=mixed |
| ticket-drifted | 469/321 | 0/1 | 32/14 | 1/0/5 | 5/1/0 | claude-opus-5-5=readable gpt-6-astra=mixed | claude-opus-5-5=briefing gpt-6-astra=readable |

result: pass
disputed: ticket-drifted f5 (claude-opus-5-5: no)
