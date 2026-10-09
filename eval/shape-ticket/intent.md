for: 21b2e112d649e02d4cec6f4908aa89134bd971a0983e89fe07a4882877e3cd81

## Change
The repo-group template attributes Acceptance Criteria rows to one named repo group per repo when the Idea names multiple repos. The venue-free rule removes environment names from AC rows while preserving setup, action, observable results, and supplied measurements; post-deployment housekeeping stays non-blocking.

## Expected to move
- multi-repo-groups/f1: fails -> holds - The template renders a group for each named repo.
- multi-repo-groups/f2: fails -> holds - Repo groups attribute emailing to mailer and the button and columns to widgets.
- multi-repo-groups/f3: fails -> holds - AC rows omit verification venues.
- venue-stripped/f1: fails -> holds - Repair preserves the supplied target and baseline without the environment.
- venue-stripped/f3: fails -> holds - The venue-free rule excludes environment names from every AC row.
