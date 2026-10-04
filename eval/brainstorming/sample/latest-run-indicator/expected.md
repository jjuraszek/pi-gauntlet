anonymized: true
# Expected facts: latest-run-indicator
- framing: The first message questions whether a workspace-wide revision on a file or item would imply false provenance and whether a revision-only badge omits the required date.
- pivot: The approaches include persisting svc-a's release identity on the run and deriving file and item provenance from existing joins rather than stamping those records or showing only a producer revision.
- surfaces: The chosen design keeps the document card, file tooltip, and root item badge with quiet styling and browser-local date-time alongside the version.
- selection: Each surface pairs date and revision from the same latest succeeded persisted run at its own grain: workspace, file placement, or last touch on the root and its descendants.
- missing: A missing producer revision displays unknown version rather than borrowing another run's revision, and rendering never calls svc-b.
- release: The release tag is shown only when the stored svc-a revision matches the producer revision, while historical runs without release identity show the producer revision alone or unknown version.
