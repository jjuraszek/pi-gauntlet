for: 9dbeca74c143fb10e7b0301db438c900f9d11204fec55b9fe01dcf92f4f209d6

## Change
The plan phase no longer has the main loop dispatch a scout, read its draft, write the plan, and fix plan_check findings itself. The parent dispatches one fresh plan-writer child with the spec, plan, and worktree paths and the acceptance-none line, runs plan_check once for the stamp, re-dispatches once with the verbatim FAIL as a Findings: block when the child and parent checks disagree, and reads the finished plan once before plan_tracker init.

## Expected to move
- parent-fail-redispatches-once/f1: fails -> holds - the baseline never surfaces the FAIL lines; it stops asking for skill text before any dispatch
- fresh-child-authors-plan/f1: fails -> holds - the baseline dispatches scout; "plan-writer" never appears
- fresh-child-authors-plan/f3: fails -> holds - the baseline has no plan-writer dispatch
- fresh-child-authors-plan/f4: fails -> holds - the baseline halts at the scout draft and never reaches the parent plan_check
- fresh-child-authors-plan/f5: fails -> holds - the baseline writes the plan in the parent
- fresh-child-authors-plan/f6: fails -> holds - the baseline never reads a finished plan or initializes the tracker
- parent-fail-redispatches-once/f2: fails -> holds - the baseline fixes findings in the parent
- parent-fail-redispatches-once/f3: fails -> holds - the baseline keeps fixing until the 3-round bound
