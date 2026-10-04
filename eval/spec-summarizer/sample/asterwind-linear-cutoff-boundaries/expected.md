anonymized: true
# Expected facts: asterwind-linear-cutoff-boundaries

- f1: Safeguard users receive incorrect curves because a sloping withstand boundary is reduced to a single point.
- f2: A sloping boundary will be checked across its whole length rather than at a single point.
- f3: Existing point boundaries retain their current behavior.
- f4: Changing a saved ramp to a point removes its second endpoint.
- f5: A tighter standalone cutoff must not be removed merely because a ramp covers the same magnitude.
- f6: The change is complete when a source ramp survives extraction through to a straight segment on the safeguard chart.
