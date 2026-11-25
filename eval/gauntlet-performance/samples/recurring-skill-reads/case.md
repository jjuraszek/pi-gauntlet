# Input

The human invoked /skill:gauntlet-performance. Bash showed only the tail of the CLI output, with a truncation notice naming a saved digest. These are the observed bounded reads of that saved output, in order. The second page matches the visible tail. No menu choice has been made.

Page 1:

```text
corpus: catalog=2
runs (2)
run_id    repo          spec          version  status   wall  grants  big
6320d345  demo/catalog  export-index  2.4.0    shipped  34m   3       2/79%
44418c32  demo/catalog  label-index   2.4.0    shipped  18m   0       1/74%

skill reads: run=6320d345-5166-45f1-b7b0-31bc5f232854 coverage=complete total_bytes=80000
path                                               bytes  reads  share
pi-gauntlet:skills/gauntlet/legs.md  66000  6      82.5%
pi-gauntlet:skills/gauntlet/plan/plan.md           14000  1      17.5%
```

Page 2 (end of saved output):

```text
skill reads: run=44418c32-9395-4db4-b24f-d53090163b87 coverage=complete total_bytes=60000
path                                               bytes  reads  share
pi-gauntlet:skills/gauntlet/legs.md  48000  4      80.0%
pi-gauntlet:skills/gauntlet/SKILL.md           12000  1      20.0%

by version
repo          version  n  shipped  truncated  wall p50/max  grants p50/max  models
demo/catalog  2.4.0    2  2        0          26m/34m       1.5/3           worker:2
council
no council data in selected records
```

Render the reply that waits for the human's choice.
