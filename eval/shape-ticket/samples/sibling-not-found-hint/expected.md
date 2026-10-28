anonymized: true
- hint: judged: Missing viewer reports expected at /repos/viewer and git clone 'git@github.com:acme/viewer.git' '/repos/viewer'; the command is a hint, never executed.
- wrong-repo: judged: Reports /repos/billing is github.com/acme/billing-legacy, expected github.com/acme/billing; billing is absent from scout read paths, even though its path appears in report text.
- not-checkout: judged: Reports /repos/docs is not a git checkout (top level /repos, not /repos/docs) despite the enclosing origin matching, and supplies no docs read path.
- no-origin: judged: Reports /repos/tools has no origin remote and supplies no tools read path.
- unparseable-origin: judged: Reports /repos/data origin /srv/git/data.git is not a clone url and supplies no data read path.
- quiet: judged: All five sibling lines render on the conforming no-op report; none causes a draft, roast, gate, write, question or block; no rejected checkout is read.
- empty-audit: judged: Independent empty checkpoint renders audit unavailable (empty file) and all five same sibling report lines from parent retention, with no gate or retry.
