# Import status

## Design
Reject empty imports and count rejected imports in the report.

## Integration

## Acceptance criteria
- [ ] the operator starts the cutover
  in-scope
- [ ] the importer rejects empty input
  in-scope
- [ ] the report counts rejected imports
  in-scope

## Legs

### Leg: orchard/importer
branch: import-status
contract:
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test
Rules: AGENTS.md
scope: AC 2
design: Reject empty imports in src/import.mjs.

### Leg: orchard/reports
branch: import-status
contract:
- spec-dir: doc/specs
- plan-dir: doc/plans
- verification: npm test
Rules: AGENTS.md
scope: AC 3
design: Count rejected imports in src/report.mjs.
