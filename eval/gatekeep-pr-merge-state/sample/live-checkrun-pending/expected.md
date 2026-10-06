anonymized: true
# Expected facts: live-checkrun-pending

- f1: The evidence resolves to pending because a check whose workflow run is still live binds the viewer.
- f2: The merge row is not offered and the reason names the live check as pending.
- f3: Wait is the first row and is recommended.
- f4: The non-blocked merge state does not override the live check.
