| sample | words b/c | backtick lines b/c | path tokens b/c | kept/disputed/lost b | kept/disputed/lost c | quality b | quality c |
|---|---|---|---|---|---|---|---|
| deferred-with-ref | 31/54 | 0/2 | 0/6 | 3/0/2 | 5/0/0 | claude-opus-5-5=mixed gpt-6-astra=mixed | claude-opus-5-5=briefing gpt-6-astra=briefing |
| deviates | 45/75 | 4/4 | 0/2 | 3/0/2 | 5/0/0 | claude-opus-5-5=mixed gpt-6-astra=mixed | claude-opus-5-5=briefing gpt-6-astra=briefing |
| directional-dependency | 43/67 | 0/4 | 0/6 | 3/0/3 | 5/1/0 | claude-opus-5-5=mixed gpt-6-astra=engineer-only | claude-opus-5-5=briefing gpt-6-astra=briefing |
| in-scope-gap | 401/402 | 1/3 | 8/7 | 4/0/1 | 5/0/0 | claude-opus-5-5=readable gpt-6-astra=engineer-only | claude-opus-5-5=mixed gpt-6-astra=engineer-only |
| mixed | 469/499 | 4/3 | 10/17 | 3/1/2 | 5/1/0 | claude-opus-5-5=engineer-only gpt-6-astra=engineer-only | claude-opus-5-5=mixed gpt-6-astra=engineer-only |
| no-dispositions | 45/32 | 4/2 | 0/0 | 4/1/0 | 4/1/0 | claude-opus-5-5=briefing gpt-6-astra=readable | claude-opus-5-5=briefing gpt-6-astra=readable |

result: fail
fail: in-scope-gap: no reviewer quality reaches readable
fail: in-scope-gap: quality dropped readable -> mixed for anthropic/claude-opus-5-5
fail: mixed: no reviewer quality reaches readable
disputed: directional-dependency f5 (claude-opus-5-5: no)
disputed: mixed f4 (gpt-6-astra: no)
disputed: no-dispositions f2 (gpt-6-astra: no)
