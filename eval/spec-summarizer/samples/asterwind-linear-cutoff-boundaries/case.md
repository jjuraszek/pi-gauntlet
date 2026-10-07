# K-4412: Linear (ramp) V/F cutoff boundaries, end-to-end

## Problem

V/F safeguard boundaries are modeled today as flat scalar points: each
`VoltageCutoffCapability` / `FrequencyCutoffCapability` row (quarry) and each
`PresetBoundary` row (console) carries a single `(value, delay)`. A
boundary whose withstand time **ramps linearly across a voltage band** cannot
be represented. The canonical case is AsterWind 3MW-140/150 (Ref-0310256 r04,
Table 5 note 3): the `20-70%` LVRT band is a single ramp from
`1.0s @ 0.20pu` to `3.0s @ 0.70pu`. The current single-point schema forces this
ramp to collapse to one mis-picked point, dropping the slope and producing a
wrong safeguard curve.

This spec adds a discriminated **point | linear** boundary shape across the two
services that own this data: quarry (extraction + deterministic transform +
HareQueue response) and console (storage + evaluation + render). A linear shape
is two endpoints describing a straight withstand-vs-magnitude segment. The shape
is typed and extensible so a future third shape (e.g. an inverse-time curve) can
be added without altering the point or linear shapes.

**Not in scope:** policy-bot and any MallardDB contract -- cutoff capabilities flow
quarry -> HareQueue extraction response -> console importer, never through
`conformance.mallarddb`. No changes to lc_volt/lc_freq/react_ref boundaries or the
existing `slope_rate` column (see Section 8).

## Acceptance criteria

1. The AsterWind r04 LVRT table extracts as **9 single-point boundaries + 1 linear
   segment** (the `20-70% -> 1.0-3.0s` ramp), with the `0-20% -> 0.20pu @ 1.0s`
   band point absorbed into the segment's far endpoint by on-curve dedup.
2. Boundary shape is a **typed discriminator** (`shape` enum, values `point` /
   `linear`), not a boolean `is_ramp`. A third shape is addable by adding its own
   nullable columns/fields without touching point or linear semantics.
3. Existing point boundaries (all current fixtures and stored rows) are
   unchanged: `shape` defaults to `point`, far-endpoint fields null/absent.
4. The console renders a linear boundary as a line segment between its
   endpoints, and conformance evaluation tests the **segment** against the
   GRC-114 envelope (not a single sampled point).
5. The ModelWeave `Literal` shape enum and the Trackway `*_TYPES` constant stay in
   lockstep, enforced by a parity spec.
6. An invalid boundary cannot persist: a `linear` row missing an endpoint or
   with `value_outer == value`, or a `point` row carrying far fields, is rejected
   by both model validation and a DB check constraint.

   **Ratified deviation (2026-08-16):** `shape` is *derived* from far-endpoint
   presence in a `before_validation` (`value_outer`/`delay_outer` present -> `linear`,
   else `point`), so the discriminator can never disagree with the endpoints and
   the two-phase quarry import (row saved before far endpoints are prefilled)
   composes naturally. Consequence: "linear without endpoints" is *coerced to
   point* rather than *rejected*, and "point with far fields" becomes *linear*.
   The invalid persisted states AC-6 names remain unrepresentable (a half-
   specified ramp -- exactly one far field, or `value_outer == value` -- is still
   rejected by validation + DB check). Intent preserved; mechanism is derive +
   reject-the-half-specified, not reject-everything.

   **Amendment (2026-11-15, K-7085):** one exception to pure derivation - an
   explicit edit switching a *persisted* row to `point` clears its far
   endpoints instead of deriving back to `linear`. The autosaved apparatus
   form submits every field, so the stale far endpoints rode along with the
   requested `point` shape and the derivation silently flipped the row back.
   Two-phase quarry prefill is unaffected (it fills blank columns only
   and never assigns `shape`, which is NOT NULL DEFAULT 'point'), as are new
   records (pure endpoint derivation). Accepting a quarry candidate that
   sets `shape: "point"` on a persisted row goes through the same exception:
   the far endpoints are cleared and the accepted shape applies, where before
   the accept silently left the row `linear`.

## Architecture overview

```
PDF -> [quarry LLM extraction]  faithful rows incl. explicit ramp endpoints
    -> [quarry deterministic transform]  partition + near/far + on-curve dedup
    -> [HareQueue extraction response]  inline-provenance-wrapped fields
    -> [console import job]  -> preset_boundaries (shape + far columns)
    -> [console eval + render]  segment-aware
```

Keystone decision (locked): a boundary's shape is carried by a **`shape`
discriminator enum + typed `value_outer` / `delay_outer` columns**, mirrored on the
quarry wire models. **Not** JSONB (contradicts the deliberately-normalized
preset_* subsystem; see `console/doc/design_patterns.md` #7), **not**
the `quantity_field` composite (that pattern is for unit-bearing values, not a
second endpoint), **not** the existing `slope_rate` column (a live slope field for
lc_volt/lc_freq/react_ref; see Section 8). The near endpoint reuses the existing
`value` / `delay` columns; only the far endpoint is new (asymmetric by design,
Section 4).

## 1. Quarry extraction schema (LLM, faithful transcription)

Extend `VoltageCutoffCapability` and `FrequencyCutoffCapability`
(`quarry/src/parts/limit_capability.py`) with:

- `shape: Literal["point", "linear"] = "point"`
- `value_outer: float | None = None`  -- far-endpoint magnitude
- `delay_outer: float | None = None`  -- far-endpoint withstand time (s)

**Far-endpoint unit metadata.** `value_outer` carries the same `origin_unit`
metadata as the existing `cutoff_boundary` field, and `delay_outer` mirrors
`hold_time`. Without it the LLM can transcribe the band edges as `20` / `70`
(percent, as printed in r04 Table 3) while `value` is stored as `0.20` pu,
silently mixing units across the two endpoints of one segment. The far endpoint
is read-time-projected to pu identically to the near endpoint (the
`measure_swap` `{magnitude, unit}` pattern), so a percent-printed far edge
normalizes to the same scale as the near edge.

The LLM emits `shape="linear"` with both far fields **only when the source
explicitly presents a ramp / withstand-range** (e.g. r04 Table 5 note 3:
Slope between 1.0 s at 20 % and 3.0 s at 70 %, or a withstand cell printed as a range
`1.0 - 3.0`). Discrete staircase bands stay single points exactly as today. All
endpoint numbers (`0.20 / 0.70 / 1.0 / 3.0`) appear verbatim in the source, so
every field is citable and survives the citation guard
(`quarry/src/ai/verify/sentinel.py`) by normal substring grounding.

Rationale for one discriminated row over a sibling band collection: the wire and
console already gain `shape` + far fields, so a separate band collection would
re-introduce a parallel schema, a merge step, and the bidirectional-leak risk
(a row landing in the wrong collection). One discriminated row eliminates all
three. The LLM setting `shape` is faithful transcription, not inference, because
the document explicitly labels the ramp; the transform (Section 2) validates it
and downgrades a mis-stated linear row to a point.

## 2. Quarry deterministic transform (`finalize_pass`)

Runs after extraction, before the response is published. Follows the existing
`_normalize_cutoff_rt` / `_build_raised_provenance` precedent (information-based
dedup + explicit deterministic promotion with synthesized provenance).

**Direction is required for a linear row.** Near/far selection depends on which
side of nominal the band sits, so a `linear` row must carry `direction`; both
endpoints must lie on the same side of nominal. A row whose endpoints straddle
nominal (a crossing band) is invalid as a single segment and is downgraded to a
point on the near endpoint.

**Step ordering.** Near/far selection runs **first** and fixes which endpoint
lands in `value` / `delay` vs `value_outer` / `delay_outer`; validation then acts on
the already-selected pair.

**Near/far endpoint selection (per direction).** Under-voltage / under-frequency
read toward zero, so the near endpoint (the one stored in `value` / `delay`,
nearer nominal) is the higher-magnitude / longer-time edge; the far endpoint is
the lower edge. Over-voltage / over-frequency read upward, so the near endpoint
is the lower-magnitude edge. AsterWind LVRT ramp: near `= 0.70pu @ 3.0s`,
far `= 0.20pu @ 1.0s`.

**Validation of linear rows.** A `linear` row must have `value_outer != value`
and both endpoints citable (a two-endpoint segment is monotonic in time by
construction, so there is no separate withstand-monotonicity check that can
fail). A row failing validation is downgraded to a `point` (keeping the near
endpoint) or dropped if the near endpoint itself is uncitable.

**On-curve dedup (the core reconciliation).** For each `linear` row, any
single-point cutoff in the same `axis` + `direction` **and same `action`** whose
`(value, delay)` lies on the segment's linear interpolation within tolerance is
**dropped** -- it is either an interior point the LLM sampled off a stated ramp,
or a coincident band edge (the `0-20% -> 0.20pu @ 1.0s` point, which equals the
ramp's far endpoint). The `action` match is required: an Allowing or other
non-Cutoff point coincident with a Cutoff segment is a distinct safeguard element
and must not be silently absorbed by an action-mismatched segment.
This is what produces AC-1's "9 points + 1 segment". A point that is **off** the
line (e.g. same magnitude but a *shorter* delay) is a distinct, more-binding
safeguard element and is **kept** -- precedence is by conservatism, never by
shape, so a tighter standalone cutoff is never silently relaxed.

**On-curve test.** With near `(v_n, t_n)` and far `(v_f, t_f)`, a point
`(v, t)` is on the curve when:

```
v is within [min(v_n,v_f) - value_band, max(v_n,v_f) + value_band]
and  |t - interp(v)| <= delay_band
where interp(v) = t_n + (t_f - t_n) * (v - v_n) / (v_f - v_n)
```

The segment is parameterized as **delay as a function of magnitude**
(`t = interp(v)`); magnitude is the independent axis throughout extraction,
storage, eval and render.

**Tolerance, derived from the source data.** In r04 the finest boundary grid
step is `0.05 pu` and the finest withstand precision is `0.001 s`. Tolerances are
set well inside the finest real feature so genuinely-distinct bands never merge:

- `value_band = 0.005 pu` (one tenth of the 0.05 pu grid)
- `delay_band = max(0.01 s, 1% of interp(v))`

These constants live as named module-level values in the transform with the
derivation in a comment, not magic numbers at the call site.

**Provenance.** Surviving rows keep their real citations. A merged / promoted
endpoint uses the existing synthesized-fact pattern
(`_build_raised_provenance`), so the guard accepts it via the confidence path
rather than substring grounding.

## 3. Quarry output (HareQueue extraction response)

Cutoff capabilities serialize to `{ENV}-quarry-response` as inline-provenance-
wrapped fields under `volt_cutoff_boundaries` / `freq_cutoff_boundaries`
(`quarry/doc/WIRE_CONTRACT.md`, Output Format / Apparatus Item). The three new
fields flow into those response objects, each inline-wrapped with its own
provenance. `shape` defaults `point` and the far fields are null/absent for point
rows, so the envelope stays backward-compatible for every existing consumer.
Update `quarry/doc/WIRE_CONTRACT.md` to document the new fields and the
point-default contract.

## 4. Console storage

Migration on `preset_boundaries`:

- `shape` -- string discriminator, NOT NULL, default `point`; backfill all
  existing rows to `point`.
- `value_outer` -- `numeric(10,4)`, nullable.
- `delay_outer` -- `numeric(10,4)`, nullable.

`PresetBoundary` (`console/app/models/preset_boundary.rb`):

- New `SHAPE_TYPES = %w[point linear]` constant (mirrors the ModelWeave `Literal`;
  parity enforced per AC-5).
- `anchor_field` stays `:value`; `quarry_lookup_fields` stays
  `[:value, :delay]` -- the near endpoint remains the identity / dedup anchor, so
  the import walker is untouched.
- AttributesDSL: add `field :shape`, `field :value_outer`, `field :delay_outer` so the
  new columns are first-class model fields (parity with the existing
  `value`/`delay`/`slope_rate` field declarations).
- `VISIBLE_FIELDS` gains `value_outer` / `delay_outer` on the `volt_cutoff` and
  `freq_cutoff` field arrays **unconditionally** (not per-row): the field set is a
  static per-boundary-type map, so the far fields are always displayed for cutoff
  types and simply render blank on `point` rows. Per-row shape branching in the
  field map is out of scope.

**Integrity (validations + DB check constraints).** Both layers enforce the
shape contract so an invalid boundary cannot persist:

- `shape` constrained to `SHAPE_TYPES` (Trackway inclusion + DB check).
- `linear` requires both `value_outer` and `delay_outer` present and
  `value_outer != value`.
- `point` requires `value_outer` and `delay_outer` null.
- `delay` and `delay_outer` (when present) `>= 0`.

Validations live on the model; the equivalent DB check constraints ride in the
migration so a bad row cannot be inserted out-of-band.

**Asymmetric naming is deliberate.** The near endpoint reuses the existing
`value` / `delay` columns rather than renaming to `value_near` / `delay_near`.
This keeps every existing point row a valid near endpoint with zero primary-
column backfill, preserves the `value` / `delay` identity + dedup anchors, and
keeps `value` / `delay` meaning "the binding cutoff boundary and its delay"
whether the row is a point or the near end of a segment. A symmetric rename would
touch every existing point row, `anchor_field`, the import walker key,
`VISIBLE_FIELDS`, and all current point call sites for a cosmetic gain;
rejected.

Import: `console/app/jobs/process_quarry_results_job.rb` ->
`QuarryCandidate` maps `shape` / `value_outer` / `delay_outer` into
`preset_boundaries` alongside the existing `value` / `delay`.

## 5. Console evaluation + render

Both consumers currently treat every boundary as a discrete point and build
sorted `(value, delay, action)` arrays:

- `collect_all_cutoff_points` -- collects cutoff points for conformance analysis.
- `boundary_cutoff_curve` -- builds `{ov: [...], uv: [...]}` arrays for the chart.
- `cutoff_outside_standard_envelope?` / `freq_cutoff_outside_frt` -- iterate points
  against the GRC-114 envelope.
- `SafeguardChartBuilder#boundary_points` and
  `PlotConfig::SafeguardComposite#assemble_stage_points` -- build the rendered chart
  series, today as a **step** curve with an asymptote at each point's delay.

These become **shape-aware**: a `point` row contributes its single endpoint as
today; a `linear` row contributes the **segment** `near -> far`.

**Render contract.** Point tiers keep the existing step + asymptote rendering
unchanged. A `linear` tier renders as a plain straight line series between its
two endpoints (`(value, delay)` -> `(value_outer, delay_outer)`) -- no step, no
asymptote. `boundary_points` / `assemble_stage_points` branch on `shape` to emit the
line series for linear tiers while leaving the point-tier step logic intact.

**Segment-vs-envelope evaluation.** For a linear row evaluated against the
GRC-114 envelope (a piecewise set of magnitude zones `[lo, hi)` each with a
required ride-through `duration`):

1. Intersect the segment's magnitude interval `[min(v,v_far), max(v,v_far)]`
   with each envelope zone's `[lo, hi)`.
2. For each non-empty overlap, interpolate the segment delay at both overlap
   ends (`interp(v)` from Section 2) and take the minimum delay over the overlap.
3. The segment **violates** a finite-duration zone when that minimum delay is
   `< required_duration` for the zone; it violates the **continuous** zone on any
   non-empty overlap (a cutoff inside the continuous band is non-conformant
   regardless of delay).

This replaces "sample one point" with "test the whole segment", so a ramp that
dips below the required withstand anywhere in a zone is caught.

## 6. Edge cases

- **Continuous-band edge collision (`58.003` / `62.003`).** The `+0.003` nudge in
  the reference frequency preset is a chart-display hack to separate a cutoff from
  the continuous band at the same value. **Decision:** store the *real* edge value
  (`58.0` / `62.0`); a cutoff point and a continuous ride-through point may share a
  magnitude. Eval and render must tolerate a cutoff and a continuous point at the
  same value (drop the epsilon nudge). Render handling of the shared value is
  flagged for the console render owner.
- **Reference value fix.** r04 Table 4's last HVRT row is `145-155% -> 0.041s`;
  the ticket's worked example said `0.04`. The reference preset uses **0.041**.
- **`ASW_LAND...r1` fixture.** A wind-generator model-list / position document with no
  voltage or frequency table -- structurally cutoff-free. No rebaseline; it stays
  point-free and unaffected.

## 7. Testing

**Quarry:**
- Golden fixture from r04 producing the 9 points + 1 linear segment (AC-1).
- Transform unit tests: near/far selection per direction; on-curve dedup absorbs
  the `0-20%` band point; keep-both for an off-curve (more-binding) point;
  keep-both for an action-mismatched coincident point; validation downgrade of a
  malformed linear row to a point; downgrade of a nominal-crossing band.
- Unit test: a far edge printed in percent (`20` / `70`) normalizes to the same
  pu scale as the near endpoint via `origin_unit` projection.
- Guard citability test: linear endpoints survive (substring grounding); a
  synthesized merged endpoint survives via the confidence path.

**Console:**
- Model spec: `shape` enum constrained to `SHAPE_TYPES`; far columns nullable;
  point default; integrity validations reject linear-missing-endpoint,
  `value_outer == value`, and point-with-far-fields (AC-6).
- DB constraint spec: the same invalid states are rejected at insert (out-of-band
  write cannot bypass the model).
- Eval spec: a linear boundary is judged conformant/non-conformant by segment-vs-
  envelope (overlap + interpolated-min-delay per zone; continuous-zone any
  overlap), distinct from sampling either endpoint alone.
- Render spec: a linear tier renders as a straight line between endpoints; point
  tiers keep step + asymptote unchanged.
- `VISIBLE_FIELDS` spec: far fields present on cutoff-type field arrays, blank on
  point rows.
- Enum-parity spec: ModelWeave `Literal` values == Trackway `SHAPE_TYPES` (AC-5).
- Migration / backfill spec: existing rows become `shape = point` with null far
  fields.

**Cross-layer:**
- End-to-end golden: r04 extraction -> HareQueue extraction response -> import job
  -> `preset_boundaries`, asserting the 9-points-plus-segment shape lands and
  renders. Runs through the HareQueue response the importer consumes (no MallardDB).

## 8. Why `slope_rate` is not reused

`preset_boundaries.slope_rate` (`numeric(10,4)`) is a live, generic **slope**
field used by the lc_volt, lc_freq (temporary cessation) and react_ref (reactive
reference) boundary types -- a rate of change (pu/s, MW/min), not a second
endpoint. A slope alone cannot bound a withstand segment (no far endpoint), and
overloading it would conflate two meanings and break those three types. The
linear shape uses dedicated `value_outer` / `delay_outer` columns instead.

## Open questions

None. The three prior decisions (extraction representation = LLM fills shape+far
with transform validation; continuous-edge = real value; `ASW_LAND r1` = cutoff-
free, no rebaseline) are resolved above.

## Ratified deviations (post-implementation, 2026-08-16)

- **AC-6 derive-not-reject** (see AC-6 above): shape derived from far-endpoint
  presence; invalid persisted states stay unrepresentable via coercion + half-
  specified rejection.
- **AC-1 enforced as a transform unit test, not a live-LLM golden.** The
  `validation/rotor_unit/*.json` fixtures are offline eval artifacts consumed by
  `script/appraise.py` (live LLM + VCS-ignored source PDF), not part of `make
  test`. AC-1's "9 points + 1 segment" is therefore pinned as a deterministic
  unit test over `normalize_linear_voltage_limits` fed the faithful r04 Table 3/4
  transcription (`limit_capability_test.py::test_r04_voltage_cutoffs_yield_nine_points_and_one_segment`),
  plus per-hop tests across the stack. This is the "4c" decision taken during
  implementation: the deterministic transform is what the codebase controls; the
  LLM's shape emission is prompt-guided, not CI-assertable.
