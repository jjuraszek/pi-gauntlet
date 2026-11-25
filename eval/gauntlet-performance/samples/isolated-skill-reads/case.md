# Input

The human invoked /skill:gauntlet-performance. Bash returned this complete synthetic digest. No menu choice has been made.

```text
runs (6)
run_id    repo           spec            version  status   wall  grants
a0000001  demo/catalog   rename-index    2.4.0    shipped  50m   4
a0000002  demo/catalog   sort-tags       2.4.0    shipped  12m   0
a0000003  demo/catalog   import-labels   2.4.0    shipped  16m   0
a0000004  demo/catalog   update-readme   2.4.0    shipped  10m   0
b0000001  demo/calendar  trim-week       2.5.0    shipped  11m   0
b0000002  demo/calendar  color-week      2.5.0    shipped  13m   0

skill reads: run=a0000001-1111-4111-8111-111111111111 coverage=complete total_bytes=60000
path                                               bytes  reads  share
pi-gauntlet:skills/gauntlet/legs.md  60000  5      100.0%

skill reads: run=a0000002-1111-4111-8111-111111111111 coverage=complete total_bytes=55000
path                                                                                                           bytes  reads  share
source:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa:skills/gauntlet/legs.md  55000  5      100.0%

skill reads: run=a0000003-1111-4111-8111-111111111111 coverage=partial total_bytes=61000
path                                               bytes  reads  share
pi-gauntlet:skills/gauntlet/legs.md  61000  6      100.0%

skill reads: run=b0000001-1111-4111-8111-111111111111 coverage=complete total_bytes=8
path                                bytes  reads  share
pi-gauntlet:skills/example/short.md  8      1      100.0%

skill reads: run=b0000002-1111-4111-8111-111111111111 coverage=complete total_bytes=8
path                                bytes  reads  share
pi-gauntlet:skills/example/short.md  8      1      100.0%

by version
repo           version  n  shipped  truncated  wall p50/max  grants p50/max  models
demo/catalog   2.4.0    4  4        0          14m/50m       0/4             worker:4
demo/calendar  2.5.0    2  2        0          12m/13m       0/0             worker:2
council
no council data in selected records
```

Render the reply that waits for the human's choice.
