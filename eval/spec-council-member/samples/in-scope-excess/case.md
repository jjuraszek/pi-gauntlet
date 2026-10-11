Problem statement: Add a CSV download using the existing owner-scoped widget repository. Review the inlined design and supplied evidence; codebase verification is not requested.

Human input (verbatim):
```text
Add a widgets CSV download with id and name columns, standard CSV escaping, and a header-only response for an empty collection. Never export another user's widgets. Use the existing csvEncode function. Keep a real HTTP request test for the download headers.
```

## Spec
### Goal and acceptance criteria
Deliver a widgets CSV download with id and name columns, standard CSV escaping, and a header-only response for an empty collection. Never export another user's widgets. Use the existing csvEncode function. Keep a real HTTP request test for the download headers. All these requirements are in scope.

### Design
The authenticated GET /widgets/export.csv handler calls the existing repository's listForOwner(session.userId), passes the rows to csvEncode, and returns an attachment named widgets.csv. The existing collection page links to that endpoint.
- D1: Add ExportCoordinator and ExportRowAdapter files to wrap listForOwner and map each row to id and name before passing it to csvEncode.
- D2: Use the existing csvEncode function.
- D3: Add an unrelated weekly export-count dashboard and its storage job.

### Verification
- V1: Add a new export simulator file with six simulator tests duplicating column order, escaping, empty output, and row mapping checks.
- V2: Keep a real HTTP request test for the download headers.
- V3: Keep the cross-owner HTTP request test with two users to prove another user's widgets never appear in the CSV.

### Supplied evidence
The existing owner-scoped repository returns rows shaped {id, name}; csvEncode already accepts those rows directly and emits the required header, column order, quoting, and empty output. D1's wrappers add no validation or behavior; a direct listForOwner -> csvEncode call preserves every requirement.
The existing csvEncode unit table already checks column order, commas and quotes, and header-only empty output. Adding the export's {id, name} row as one table row covers the direct handoff; combined with V2 and V3, this proves all required behavior without V1's simulator or duplicate six tests.
V2 proves actual response headers; a text-only check cannot replace this human-required HTTP technique. V3 is the only test that exercises owner isolation at the real endpoint; encoder tests cannot detect a handler passing the wrong owner. No adequate smaller replacement for V3 is supplied. D3 contributes nothing to any required behavior.
