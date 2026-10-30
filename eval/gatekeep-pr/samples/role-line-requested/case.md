## Arguments

`123`

## Digest

Pi harness; origin git@github.com:acme/widgets.git; branch has unrelated PR 999. Explicit PR123 is open, non-draft; head abc1234 is unchanged throughout all labeled snapshots. No rebase, no blockers/nits/comments, WRITE, merge state CLEAN, CI test green on abc1234. Scope source PR, Delivers: validate widget input. No course selected. Render a fresh report and menu for each snapshot, not a joined hypothetical role. `reviews` history below is not pending requests. Each refresh succeeds unless the viewer read is explicitly unreadable.

A: viewer alex, author alex. Step 1 reviewRequests [] and historical reviews robin APPROVED. Pre-menu refresh reviewRequests in API order: [{"__typename":"User","login":"alex"},{"__typename":"User","login":"robin"},{"__typename":"Team","name":"Reviewers","slug":"acme/reviewers"}]. Stale self-request persists.

B: viewer alex, author sam. Step 1 requests robin only. Refresh requests [{"__typename":"User","login":"ALEx"},{"__typename":"Team","name":"Reviewers","slug":"acme/reviewers"},{"__typename":"User","login":"robin"}]. History includes an old alex COMMENTED review, not a pending signal.

C: continue B after alex posts a review; same head. Refreshed requests [{"__typename":"Team","name":"Reviewers","slug":"acme/reviewers"},{"__typename":"User","login":"robin"}]; history now also includes alex APPROVED.

D: continue C, same head; request pat added before robin: [{"__typename":"User","login":"pat"},{"__typename":"Team","name":"Reviewers","slug":"acme/reviewers"},{"__typename":"User","login":"robin"}].

E: continue D, same head; robin removed: [{"__typename":"User","login":"pat"},{"__typename":"Team","name":"Reviewers","slug":"acme/reviewers"}]. History still includes robin APPROVED and alex APPROVED.

F: viewer read fails, identity unreadable, author sam. Refreshed requests [{"__typename":"User"},{"__typename":"Team","name":"Reviewers"},{"__typename":"User","login":"alex"}].

G: viewer alex, author sam, refreshed requests []; history includes alex APPROVED.

H: viewer alex, author alex, refreshed requests [].

I: viewer alex, author sam, refreshed requests [{"__typename":"User","login":"ALEx"}].

Separate batch-parent rendering observation only, no dispatch: supplied child report text is exactly:
Delivers: preserve widget labels.
Role: requested reviewer (also requested: robin, acme/reviewers)
Verdict: mergeable - CI green on the assessed head (test)


## Entry

Start after step 2 for each labeled snapshot; apply the supplied same-head pre-menu refresh and render each report/menu. Then print the supplied batch child report verbatim as a parent would, without dispatching or inventing a persona task. Narrate only; these are synthetic text-only command observations, not tool execution.
