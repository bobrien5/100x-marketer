---
name: campaign-brief
description: Turns a one-line campaign idea into a complete, shippable marketing campaign brief. Writes the brief as a Markdown file in ./briefs/.
---

# campaign-brief

You write a complete marketing campaign brief from a short prompt. The output is a Markdown file in `./briefs/` that the operator can ship directly to a freelancer, agency, or internal team.

## Inputs

The user provides a one-line campaign idea. Examples:
- "A 4-week awareness push for our spring product launch targeting first-time buyers."
- "An always-on retargeting campaign for cart abandoners."
- "A partnership-driven launch for our new tier with 5 creator collaborators."

If the campaign idea is genuinely ambiguous (e.g. just "a campaign for spring"), ask ONE clarifying question. Otherwise, infer reasonable assumptions and proceed.

## What to read first

Read `CLAUDE.md` in the working directory. Pull from it:
- Company name, what they sell, ICP
- Brand voice rules and sample lines
- Banned words list

If the operator's CLAUDE.md still has placeholder text like `[COMPANY NAME]`, write the brief generically and add a note at the top: "Fill in the bracketed sections in CLAUDE.md for tighter outputs next time."

## Output structure

Write the brief to `./briefs/[YYYY-MM-DD]-[short-slug].md`. Create the `briefs/` folder if it doesn't exist.

The brief uses this exact structure. Don't add or remove sections.

```markdown
# [Campaign Name]

**One-line summary.**

## Why we're running this
- Business goal (what changes if this works)
- Strategic rationale (why now, why this audience)

## Target audience
- Primary persona (1-3 sentences)
- Where they spend time (channels, communities, publications)
- The job they're trying to do
- The objection we have to overcome

## Offer or angle
- The hook (the one thing we say that makes them stop)
- The promise (what they get)
- The proof (why they should believe it)

## Channel mix
List 3-5 channels with a one-line role for each. Format:
- **Channel:** what it does in this campaign

## Creative directions
3 distinct creative directions. For each:
- **Direction name:** the angle in one line
- **Sample headline:** a real headline written in our brand voice
- **Sample subhead or first line:** continuation, also in voice
- **Visual treatment:** one sentence on how it looks

## Timeline
A week-by-week plan from kickoff to wrap. Use a table:

| Week | Focus | Deliverables |
|------|-------|--------------|
| 1 | ... | ... |

## KPIs and what we measure
- Primary metric (the one we'll be judged on)
- 2-3 secondary metrics
- A guardrail metric we don't want to hurt

## Budget assumptions
- A working budget range with a sensible split across channels
- Note any assumptions that should be challenged

## Open questions for the operator
3-5 specific questions whose answers would sharpen the brief. Be concrete.

## What we're NOT doing
3-5 explicit non-goals. Useful for keeping scope tight.
```

## Voice rules (apply throughout)

- Follow every rule in `CLAUDE.md` Writing Style Rules.
- The brief itself is internal. Match the operator's voice in any **sample copy** you write inside the brief (headlines, subheads, body lines).
- For the structural sections (audience, KPIs, timeline), use clear, plain English.

## Quality bar

Before saving, check:
1. Does this brief give a freelancer enough to start tomorrow without a kickoff call?
2. Is every sample headline in voice (no banned words, no em dashes)?
3. Are the KPIs specific and measurable?
4. Are the open questions actually useful, or filler?

If any answer is no, revise.

## After saving

Print to the chat:
1. The full path of the brief you wrote
2. A 2-line summary of what's inside
3. Any open questions the operator should answer to tighten v2

Don't restate the entire brief in the chat. The file is the artifact.
