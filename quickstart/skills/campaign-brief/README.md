# campaign-brief skill

A Playbook that turns a one-line campaign idea into a complete, shippable campaign brief.

## What it does

You give Claude a one-sentence campaign idea. Claude writes a full brief (target audience, offer, channels, creative directions, timeline, KPIs, budget, open questions, non-goals) into your `~/Marketing/briefs/` folder.

## When to use it

- A founder Slacks you "can you put together a campaign for X by EOD"
- You're spinning up a new freelancer or agency and need a kickoff doc
- You're sketching a Q-plan and need 5 directions on the table fast

## How to invoke it

In Claude Code, type:

```
Run the campaign-brief skill. The campaign idea is: [your one-line idea].
```

Examples:
- `Run the campaign-brief skill. The campaign idea is: a 4-week awareness push for our spring product launch targeting first-time buyers.`
- `Run the campaign-brief skill. The campaign idea is: a referral program for power users who've been with us 6+ months.`

## Inputs

Just the one-line idea. Claude reads your `CLAUDE.md` for company context, ICP, and brand voice.

## Output

A Markdown file at `./briefs/YYYY-MM-DD-[short-slug].md` with this structure:
- Why we're running this
- Target audience
- Offer or angle
- Channel mix
- 3 creative directions (each with sample headlines in your voice)
- Week-by-week timeline
- KPIs and guardrails
- Budget assumptions
- Open questions
- What we're NOT doing

## How to make it better

The skill is only as good as your `CLAUDE.md`. Two upgrades that pay off immediately:

1. **Fill in the bracketed sections.** Company name, ICP, what you sell. Takes 3 minutes.
2. **Add 5-10 sample lines that sound like your brand.** Paste real headlines, subject lines, and tweets you've shipped. Claude pattern-matches voice from samples better than from descriptions.

## Customize it

Open `skills/campaign-brief/SKILL.md` and edit the output structure. Want a "Risks" section? Add it. Want to drop the budget section? Delete it. The skill file is yours.

## Troubleshooting

- **Brief feels generic.** Your `CLAUDE.md` is still on placeholders. Fill in the bracketed sections and add voice samples.
- **Claude wrote the brief in chat instead of saving a file.** Tell it: "Save the brief to ./briefs/ as we agreed. Don't print the full brief in chat."
- **Voice is off.** Add 3-5 of your own headlines to the "Sample lines that sound like us" section in `CLAUDE.md`. Re-run.

## Next skill to install

Once `campaign-brief` is working, try `seo-brief-builder` (drops in Module 2 of the curriculum). It does the same thing for an SEO target keyword.
