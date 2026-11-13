# Marking superseded specs

When the new spec replaces a prior spec — fully or in part — (from the draft's scout recon or the request), mark the predecessor. No mechanical sweep: grep or path-overlap hits never decide supersession.

- `edit` the predecessor spec (in the project's spec directory, per [Project Routing](../SKILL.md#project-routing)) to insert, after its title line and a blank line, one banner line per successor:

  ```markdown
  > **Superseded by:** [<repo-relative path to successor>](<href relative to THIS file>) - <scope>
  ```

- The visible label is the successor's repo-relative path; the href is computed relative to the predecessor's own directory (Markdown resolves links from the containing file). Same directory: `[doc/specs/B.md](./B.md)`.
- `<scope>` is the value after the ` - ` separator: `fully`, or the named superseded section(s), e.g. `"Settings resolution" section only`. The scope value itself carries no leading dash — the template above already supplies the separator.
- Banners are **append-only**: add below any existing supersession lines, formatted or free-form prose. One old spec may accumulate banners from multiple successors. No migration, no dedup.
- **No transitive rewrite**: if A points at B and B is later superseded by C, A keeps pointing at B; the reader hops.
- **Mark, never delete here.** Use housekeeping's [spec card](../../housekeeping/reference/card.md#card-template) for deletion; this step only marks.
- **Coverage limits**: unmarked does NOT mean current (code drift, abandoned designs, and partial ships produce no successor spec); marked does NOT mean dead (partial supersession leaves live sections).
- Predecessor in a **different service's spec directory**: out of scope — record it in the new spec's Open Questions instead of editing outside the write grant.
- **Override contract**: the gauntlet overrides file (see `../SKILL.md#project-overrides`) may replace the banner *syntax*; placement, append-only, no-transitive-rewrite, and mark-never-delete stay fixed. A syntax override entry must itself state the scout-citation guidance for its format (the shipped `gatherer.md` guidance names only the default banner).
