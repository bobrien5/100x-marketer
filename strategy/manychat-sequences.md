# ManyChat sequences for 100x Marketer

Three keyword-triggered DM flows for the existing reels, plus a universal welcome flow for first-time DMers regardless of keyword. Copy is voice-compliant per `brand/BRAND_VOICE.md` (no em dashes, no banned words, conversational length).

When you build these in ManyChat, paste these blocks directly into the message editor. Replace `{skool_url}` and `{newsletter_signup_url}` with real URLs once those exist. Replace `{install_video_url}` with the 30-second install demo we'll record from one of our reels.

---

## Universal welcome (fires once per user, on first DM regardless of keyword)

Set this as a one-time message that runs before the keyword payload, only on first contact.

```
Hey, glad you're here. I'm Brendan. I run 100x Marketer.

I send 1 actual marketing skill per week (free), and I run a community
where solo marketers ship with Claude Code without writing a line of code.

Two quick things before I send you the skill you came for:

1. What's your email? I'll send you the install file plus the next
   skill on Monday. No spam ever.

2. What's the #1 marketing job you wish a skill would do for you?
   One sentence is fine.
```

**ManyChat config notes:**
- Use a custom field `email_captured` (boolean). Set to true when the user sends a valid-looking email.
- If the user sends both pieces of info in one message, parse and save both. ManyChat's regex match for email works fine.
- If they only send one, ask for the other once. If they ignore the second ask, move on. Don't gate the skill behind it.

---

## Keyword sequence: `STRATEGIST`

**Trigger:** comment `STRATEGIST` on the pause-copy-prompt reel, OR DM `STRATEGIST` directly.

**Step 1 (immediate auto-reply on the comment):**

```
Sent it to your DMs 👀

(Check the message request folder if it doesn't show up in 30 seconds)
```

**Step 2 (DM, opens after they DM):**
First-timers get the universal welcome above. Returning users skip to step 3.

**Step 3 (DM, after email captured OR after universal welcome runs):**

```
Here's the content-strategist skill you commented for.

⚙️ Install (60 seconds):
1. Open Claude Code
2. Drop these two files into ~/.claude/skills/content-strategist/
   • SKILL.md
   • references/brand-profile.md
3. Fill in brand-profile.md with your company info (10 fields)
4. Type: "Run the content-strategist skill"

It scans your competitors, pulls trending hooks, and pitches you 3
ready-to-shoot content briefs. Every Monday morning.

📎 Files: {download_url}
🎬 30-second install demo: {install_video_url}

Hit me back if anything breaks.
```

**Step 4 (DM, day 2):**

```
Quick check, did the strategist skill work for you?

If yes: nice. The next move is letting it write the actual scripts
(not just briefs). I can drop that one too.

If no: reply with what broke. Half my skills get smoother because
of replies like yours.
```

**Step 5 (DM + email, day 5):**

```
The skill that writes the script from the brief is dropping Monday.

It also lives free in the 100x Marketer community along with every
skill I've ever shipped:

→ {skool_url}

50+ solo marketers in there already. Free, no upsell.
```

**Step 6 (DM + email, day 7):**

```
Last note from me:

If you want to see how I actually use these skills, I do a live build
every Friday in the community. Recorded for anyone who can't make it.

→ {skool_url}

That's it. I'll send the next skill Monday in the newsletter.
```

---

## Keyword sequence: `PUBLER`

**Trigger:** comment `PUBLER` on the cancelled-Hootsuite reel.

**Step 1 (auto-reply on comment):**

```
Sent it 📨 (check your DMs in 30 seconds)
```

**Step 2:** universal welcome if first-time, otherwise skip.

**Step 3 (DM, after email):**

```
Here's the schedule-42-posts skill that replaced my Hootsuite.

It reads my brand voice from a file, pulls last week's top-performing
posts from Publer, drafts the next week, and schedules everything.
11 minutes start to finish.

⚙️ Install:
1. Open Claude Code in your marketing folder
2. Drop the skill files into ~/.claude/skills/publer-scheduler/
3. Add the Publer MCP (instructions in the README)
4. Type: "Run my Monday content"

📎 Files: {download_url}
🎬 30-second install demo: {install_video_url}

Note: this needs a Publer account ($14/mo, way cheaper than Hootsuite).
Use my link if you want a free trial: {publer_affiliate_url}

Hit me back if anything breaks.
```

**Step 4-6:** same nurture pattern as STRATEGIST, but reference posts and Publer instead of briefs.

---

## Keyword sequence: `BRIEF`

**Trigger:** comment `BRIEF` on the 4-things-Claude-setup reel.

**Step 1 (auto-reply on comment):**

```
Sent it 📨
```

**Step 2:** universal welcome if first-time.

**Step 3 (DM, after email):**

```
Here's the starter CLAUDE.md template + the 4-mental-model cheatsheet.

This is the file that turns Claude Code from a chatbot into your
marketing operator. The 4 parts:

1. The Brief (this file)
2. The Tool Belt (your MCPs)
3. The Playbook (your skills)
4. The Guardrails (your hooks)

⚙️ Install:
1. Make a folder called Marketing/ on your Desktop
2. Drop CLAUDE.md inside it
3. Open the folder in Claude Code
4. Replace the [BRACKETED] fields with your real info

📎 Files: {download_url}
🎬 The full 10-minute setup walkthrough: {quickstart_url}

Hit me back when you're set up — I want to see what you build first.
```

**Step 4-6:** same pattern. Day 5 message specifically pitches "now plug in your first skill" and links Skool for the Skills Library.

---

## Sequence rules (apply to all)

1. **One ask at a time.** Never two CTAs in one message.
2. **No emoji spam.** One per message max, used to signal what kind of action (📎 file, 🎬 video, 👀 attention).
3. **Always identify as Brendan.** First-person, not brand voice. The reader thinks they're talking to a human.
4. **Skool link goes in 3+ messages.** Days 5, 7, and any time someone replies positively. Repetition without nagging.
5. **Reply paths are real.** When someone DMs back, ManyChat tags them as "engaged" and pauses the auto-sequence. Brendan replies personally for the first 100 leads. After that, batch reply on Mondays.

---

## ManyChat tags / custom fields to create

- `email_captured` (boolean)
- `keyword_entered` (text: STRATEGIST / PUBLER / BRIEF / etc.)
- `top_marketing_job` (text, free-form, captured from welcome question 2)
- `skool_joined` (boolean, set manually or via Skool webhook if we set it up)
- `engaged_user` (boolean, true if they reply to any DM)
- `paid_member` (boolean, set manually when someone joins paid tier)

These let us segment: "all engaged users who haven't joined Skool" → send a personal Brendan DM. "All STRATEGIST leads who joined Skool but haven't posted" → drop them into the office hours invite.

---

## Setup order

1. Create ManyChat Pro account ($15/mo). Connect IG.
2. Build the universal welcome flow first.
3. Build STRATEGIST sequence as the template.
4. Clone STRATEGIST → swap copy + payload for PUBLER and BRIEF.
5. Test by commenting the keywords on the reels yourself, refine copy based on what feels off.
6. Push reels with the keyword CTA in caption + spoken in video.

Estimated build time: 2-3 hours for all three sequences once skill files are packaged.
