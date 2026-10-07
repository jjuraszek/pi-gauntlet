DESCRIPTION: Task 6 added validation feedback to the ledger import form.
PLAN_OR_REQUIREMENTS: Task 6 - submitting the import form with an empty account, a negative amount, or a future posted_on re-renders the form with the model's error message and creates no LedgerImport.
BASE_SHA: c71e9a2
HEAD_SHA: e2a7f10
SCOPED_TEST_COMMANDS: none

Diff c71e9a2..e2a7f10:

```diff
--- /dev/null
+++ b/spec/system/ledger_imports_spec.rb
@@ -0,0 +1,38 @@
+require "rails_helper"
+
+RSpec.describe "Ledger import form", type: :system, js: true do
+  before { visit new_ledger_import_path }
+
+  it "rejects an empty account" do
+    fill_in "Account", with: ""
+    fill_in "Amount", with: "10.00"
+    fill_in "Posted on", with: "2026-01-15"
+    click_button "Import"
+    expect(LedgerImport.count).to eq(0)
+    expect(page).to have_content("Account can't be blank")
+  end
+
+  it "rejects a negative amount" do
+    fill_in "Account", with: "4010"
+    fill_in "Amount", with: "-10.00"
+    fill_in "Posted on", with: "2026-01-15"
+    click_button "Import"
+    expect(LedgerImport.count).to eq(0)
+    expect(page).to have_content("Amount must be greater than 0")
+  end
+
+  it "rejects a future posted_on" do
+    fill_in "Account", with: "4010"
+    fill_in "Amount", with: "10.00"
+    fill_in "Posted on", with: "2099-01-01"
+    click_button "Import"
+    expect(LedgerImport.count).to eq(0)
+    expect(page).to have_content("Posted on can't be in the future")
+  end
+end
--- a/app/views/ledger_imports/_form.html.erb
+++ b/app/views/ledger_imports/_form.html.erb
@@ -1,4 +1,7 @@
 <%= form_with model: @ledger_import do |f| %>
+  <% if @ledger_import.errors.any? %>
+    <ul class="errors"><% @ledger_import.errors.full_messages.each do |m| %><li><%= m %></li><% end %></ul>
+  <% end %>
   <%= f.text_field :account %>
   <%= f.text_field :amount %>
   <%= f.date_field :posted_on %>
```

Existing specs, unchanged by this diff:

`spec/models/ledger_import_spec.rb` validates presence of `account`, `amount` greater than 0, and `posted_on` not after today, each with its error message.

`spec/requests/ledger_imports_spec.rb` posts an invalid record to `ledger_imports_path`, expects status 422, expects `LedgerImport.count` unchanged, and expects the response body to include the error message.
