for: fe358e7663fd355de996c77d65f132ac020aa311733e3cd6be4e5dfc2a223dfd

## Change

Keep reports, menus and posted payloads unfenced. Remove the coverage template's fence without changing its heading, informational line or checkbox rows. Apply the shared wording rules to review findings and thread replies: trailing file/line locators in reviews, plain replies without internal fields or ids. Keep posting authority, freshness checks and protocol strings unchanged.

Select only plain-payloads for this increment. It exercises a selected review, a selected thread reply and a selected coverage comment as independent text-only snapshots, with no live PR or tracker write. Preserve all earlier sample results as historical evidence.

## Expected to move

- plain-payloads/fences: fails -> holds - Render posted bodies as text instead of fenced examples.
- plain-payloads/coverage: fails -> holds - Preserve the coverage block verbatim without a wrapper.

## Validation boundary

Require all five candidate facts on both replay models, regardless of comparative verdict. scripts/gatekeep-plain-payloads.test.mjs checks the shared no-fence contract, the coverage template, and saved plain-report and plain-payloads outputs. Tests sit beside existing script siblings; no slow-test tier applies to these local assertions. The plain-report snapshots are reused locally, not rerun. Other samples and live posting are not covered. The runner assembles both arms from the working-tree skillFiles list, so any later removal of decision-menu.md limits baseline comparison; absolute candidate facts, not direction alone, determine success.
