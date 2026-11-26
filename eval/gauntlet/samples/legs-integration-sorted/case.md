bundle+: skills/gauntlet/legs.md
bundle+: skills/gauntlet/brainstorm/spec-finalization.md
replay: continuation

The approved brainstorm is ready to write its spec from a grouped ticket fetched without repair. All required references and the draft are read. Home is `labels`, its selected companion is `label-cli`, and `label-web` is a known repo outside this change. Repo identities and membership are confirmed; there are no other scope cuts. The ticket is #42. The design trims labels in the CLI and does not change the web client. Use branch `label-trim` and home spec `doc/specs/label-trim.md`. No tools are available.

## Ticket Acceptance Criteria (verbatim)

### labels
- [ ] CI is green on the PR head

### label-cli
- [ ] the CLI trims spaces around labels

### label-web
- [ ] on staging, the web client lowercases labels

## Ticket Integration (verbatim)

- before release - operator: announce the change; done when the release note is posted
  - Use the release thread.

## Requested continuation

Show the home spec's Acceptance criteria, Integration and leg scopes, then the companion file's Integration. Stop before any write.
