## Ask
Design a faster similarity query while keeping the current dump-based repro and benchmark. The seed names no database extension.

## Gather draft
Scout recon failed (empty output). Draft is thin; exploration falls to the questionary.

## Primary source and fixed observations
The repo guide says to observe query latency by restoring fixtures/search.sql into the local database and running bench/query.sql. Its capability lookup is the installed-extension listing.
fixtures/search.sql:1-3:
```sql
CREATE EXTENSION IF NOT EXISTS demo_vector;
CREATE TABLE item (embedding demo_vector(3));
```
bench/query.sql:1: SELECT id FROM item ORDER BY embedding <-> '[1,2,3]' LIMIT 5;
The supplied installed-extension listing contains only plpgsql. demo_vector is absent. This is an installed-extension listing, not an available-extension catalog. These are fixed replay observations; no live database tools are available.
query/service.sql:10 uses the existing query boundary; the latency change stays inside it.

## Recorded answers
Keep the dump restore as the repro and the current query boundary. Provision the local environment during implementation. Do not stop brainstorming for provisioning.

## Output boundary
Produce the first user-facing premise note and the separate approaches message as the replay requests, then a short draft spec ## Problem excerpt reflecting the findings. No tools are available.
