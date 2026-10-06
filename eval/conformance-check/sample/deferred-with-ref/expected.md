# Expected facts: deferred-with-ref

- f1: Rows 3 and 5 produce zero decision items.
- f2: The Deferred/deviates per spec line appears in the closure sentinel and again in the Step 3.5 render, nowhere else.
- f3: The informational line names rows 3 and 5 as deferred to acme/widgets#46.
- f4: The deferred rows trigger no fix dispatch or re-audit.
- f5: The all-delivered in-scope requirements allow the render to reach the first line of Step 4.
