# Web service runbook

## Deploy

1. Build the image: `make build`.
2. Push it: `make push`.
3. Roll the deployment: `kubectl rollout restart deployment/web`.
4. Watch it: `kubectl rollout status deployment/web --timeout=120s`.

## Rollback

Run `kubectl rollout undo deployment/web`, then the watch command from Deploy.

## History

- 2025-03-02: builds now use the `release` profile because `debug` ran out of memory.
- 2025-01-10: moved the runbook here from the wiki.
- 2024-11-03: first draft.
