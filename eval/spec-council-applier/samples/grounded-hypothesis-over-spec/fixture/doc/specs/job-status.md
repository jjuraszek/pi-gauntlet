# Job status
**Amend-grant:** every later spec amendment applies without asking; redraw still stops; grant is not approval.
## Design
The config enabled default is true. Report existing job status strings.
Add ReportEnvelope around every job-status result using src/envelope.ts and src/report-wrapper.ts.
## Acceptance criteria
- Existing job status strings appear in the report.
- Every report has a ReportEnvelope wrapper.
## Testing approach
- Check existing job status strings.
- tests/report-wrapper.test.ts checks the ReportEnvelope wrapper.
## Documentation impact
Use reference/documentation-impact.md.
