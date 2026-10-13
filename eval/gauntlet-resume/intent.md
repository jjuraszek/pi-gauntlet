for: f43a3707f86c30c658cd2e984e6d4996299b166432d45670a080b3890be64019

## Change
On a plan_check FAIL during a restore, resume classifies every finding against the Plan repair table, edits only citations (anchors, missing literals, dead Modify rows of complete tasks, renamed Test paths), re-runs plan_check up to three rounds, commits the plan alone as "resume: plan citation repair - <n> findings" when it was tracked and clean, prints a "Repaired plan:" receipt, and continues the restore with the task list verbatim. A finding outside the table, or one surviving three rounds, stops before any write with a "Repair stopped:" line. Before the change every FAIL stopped the restore.

## Expected to move
- quote-integrity-drift/f1: fails -> holds - the baseline stops on FAIL and edits nothing
- quote-integrity-drift/f2: fails -> holds - the baseline never commits
- quote-integrity-drift/f3: fails -> holds - the baseline never reaches skip plan
- quote-integrity-drift/f4: fails -> holds - the receipt line is new
- quote-integrity-drift/f5: fails -> holds - the baseline stops
- verification-literal-drift/f1: fails -> holds - the baseline edits nothing
- verification-literal-drift/f2: fails -> holds - the baseline never commits
- verification-literal-drift/f3: fails -> holds - the baseline stops
- verification-literal-drift/f4: fails -> holds - the receipt line is new
- paths-exist-from-deleted-files/f1: fails -> holds - the baseline edits nothing
- paths-exist-from-deleted-files/f3: fails -> holds - the baseline never calls init
- paths-exist-from-deleted-files/f4: fails -> holds - the receipt line is new
- paths-exist-from-deleted-files/f5: fails -> holds - the baseline never commits
- pending-owner-stops/f1: fails -> holds - the Repair stopped line is new
- absent-owner-stops/f1: fails -> holds - the Repair stopped line is new
- quote-integrity-drift/f6: fails -> holds - the baseline never re-runs plan_check
- paths-exist-from-deleted-files/f2: fails -> holds - the baseline may propose a Delete: kind; the candidate drops rows only
- pending-owner-stops/f2: fails -> holds - the baseline never names the pending owner
- absent-owner-stops/f3: fails -> holds - the baseline never states the plan file is unchanged
- staged-plan-stays-uncommitted/f1: fails -> holds - the baseline never checks plan cleanliness
- staged-plan-stays-uncommitted/f2: fails -> holds - the baseline stops on FAIL and never reaches the commit decision
- staged-plan-stays-uncommitted/f3: fails -> holds - the baseline stops on FAIL
- staged-plan-stays-uncommitted/f4: fails -> holds - the receipt line is new
