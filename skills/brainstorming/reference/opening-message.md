# Opening message

Use this wording for question one's message at checklist step 4, including fresh, redraw, restored, and unmarked spec-only PR entry. Apply [Menu layout](menu-layout.md) for the first-line rule. The relatedness question before provisioning belongs to `pr-subject.md`.

## Shape

```text
gauntlet: question

## Today
<how the affected part works now>

## The change
<what the request does to it, as something the user observes>

## What I checked
- Held: <one short sentence naming the held claims by role>
- Corrected: <the claim as stated>; <the fact>, so <the consequence for the design>.
- Not checked: <the claim> - <why it could not be checked>, so <what the design assumes or waits on>.

The framing holds: checked <things, named by what they do>.
<lead-in question>
A) <outcome>
B) <outcome>
Recommendation: <letter> - <why>
```

Keep the three titles in that order, with a blank line between sections. Give each body one short paragraph or one list. Use `##`: pi renders it as a bold title, while `###` keeps its hashes.

| Section | Write |
|---|---|
| `## Today` | Summarize how the affected part behaves now in one to three present-tense sentences total, combining related behaviors within a sentence. For a PR subject describe the PR's current state; on a redraw, the approved spec. |
| `## The change` | Summarize what the user observes once it ships in one to three sentences total, including any stated assumption in this section and combining related outcomes within a sentence. Put the held claims' consequence for the design here, not on the `Held:` line. For a ticket request, say what the ticket asks, without listing acceptance rows. Put an assumption made in place of a yes/no question last. |
| `## What I checked` | Group the held claims by role in one short `Held:` sentence; keep per-claim evidence in the draft. Give each corrected premise one `Corrected:` line stating the fact and its consequence for the design. Give each unverified premise, and a ticket gather could not fetch, one `Not checked:` line with the reason and what the design assumes or waits on. Use SKILL.md's premise paragraph to classify them. Omit labels with no entry. With no claims, write only `The design rests on no claims.` |

For a request that is only an unread ticket reference, make `## Today` and `## The change` one sentence each saying their content is not known until the ticket's content is supplied. Infer neither current behavior nor the requested change from the reference or repo recon. Keep the `Not checked:` line, the framing line, and the usual question slot; name the failed ticket fetch among the things checked in `The framing holds: checked ...`.

## Words and length

Name each part by what it does. Use a literal name when the user used it in the request or when it is the finding itself: a missing file, a failing input, a quoted ticket row. Name a lookup by what was looked at, such as `the supplied templates/ directory listing`. Keep file-and-line references, commit ids, tracker ids, and trace counts in the draft. A tracker id is not a literal name, even when the user typed it: use it only inside a command option such as `/skill:shape-ticket <ref>`; everywhere else, including an unfetched-ticket line, say `the ticket`.

Keep at most 220 words from the `## Today` line through the line before the first lettered option, both included. Exclude the marker and options. Count whitespace-delimited tokens containing a letter or digit: titles and labels count; `##` and `-` do not. Over the cap, cut `## Today` and `## The change` to one sentence each; keep `Held:` to its one short sentence. Only `Corrected:` lines, `Not checked:` lines, and an intact quoted ticket row in the question may then carry the message past 220: none of them is dropped, and the row stays intact.

## Framing and question

Write `The framing holds: checked <x>, <y>` with the checked things named by role, including a scout objection that yielded no alternative. For a concern, replace that line with the concern in one sentence, then offer `A) as framed`, `B) pivot: <named alternative> - <reason in everyday words>`, and `C) smaller or none: <what ships, or what happens if nothing ships>`, ending with `Recommendation: <letter> - <why>`. Put the root-cause alternative in B for a band-aid concern.

Use the question slot for one question: the framing question with a concern, otherwise the first ordinary question. Apply [Ticket acceptance - Cut question](ticket-acceptance.md#cut-question) and its trigger table for which question comes first, when a cut question takes the slot, and how its row is quoted.

Render the sections from the recon at hand; give anything it could not check a `Not checked:` line. Leave scout-failure flow to SKILL.md's `Framing:` record paragraph.

Open the next message after a later correction with one `Corrected:` line under the same register, with no section titles: the first line, or directly after the marker when the message has one.

## Worked examples

Holds:

```text
gauntlet: question

## Today
The export uses the saved column order for every download.

## The change
Users can choose a different order for one download. The saved order remains the default, so existing downloads stay the same.

## What I checked
- Held: The export reads the saved order, and the download form can pass a different order.

The framing holds: checked the saved order and the download form.
Where should users choose the order?
A) in the download form
B) in a separate preview
Recommendation: A - users can choose without leaving the download.
```

Concern:

```text
gauntlet: question

## Today
Every caller reads settings through the same resolver.

## The change
The request adds another settings file to supply a timeout override.

## What I checked
- Corrected: The draft says the resolver cannot accept overrides; it already accepts a timeout override, so the caller can pass it without another settings file.

Another settings file duplicates the existing read path. Which outcome should we pursue?
A) as framed
B) pivot: pass the override through the existing resolver - it already supports it
C) smaller or none: document the default and ship no setting
Recommendation: B - the existing resolver can handle the override.
```
