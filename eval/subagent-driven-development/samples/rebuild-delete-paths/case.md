The owning checkout is /workspace/project, absolute planPath /workspace/project/doc/plans/feature.md, authoritative Spec /workspace/project/doc/specs/feature.md. WAVE_BASE_SHA is 1111111111111111111111111111111111111111. Treat all observations below as fixed synthetic input, not commands you ran.

Task 1's repair delta failed git apply --index after its first FIX_FIRST review. Task 2's accepted changes remain staged. The parent is about to rebuild Task 1. Its manifest files are:
- Create: tests/new.test.mjs:1-20
- Test: tests/new.test.mjs:21
- Modify: src/parse.mjs:5-12
- Test: src/parse.mjs:20
- Delete: src/retired.mjs:1-8
- Delete: src/never-shipped.mjs:1

Both Delete paths are absent in the integrated tree. At WAVE_BASE_SHA, src/retired.mjs contains the original adapter; src/never-shipped.mjs did not exist. The supplied result of a base-tree listing restricted to those two paths is exactly:

src/retired.mjs

Task 2 owns src/format.mjs and its staged content must survive. Show Task 1's rebuild path partition and the concrete git commands in order, through restoring the integrated tree. Name the source of the Delete split and strip line annotations before git sees any path. Stop before the repair-base snapshot or any dispatch; do not invent execution results.
