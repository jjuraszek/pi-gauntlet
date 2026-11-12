for: 6b0dd2600ab5f0adf5c13bede90d78051579d935fc9eb3bcf9abd3095516a068

## Change

Introduce a human-only housekeeping walk whose run record fixes selection and delivery. Directory cards offer Fix, Ticket and Ignore, promise a separate pull request per fixed class and wait for the walk to finish before execution. Selection excludes ignored paths and uncommitted directory files; only validated findings reach a card. The selected replay covers the directory card checkpoint, not live selection or delivery.

## Expected to move
