# How We Teach: The 100x Marketer Method

The audience is smart marketers, not engineers. They've never opened a terminal. They've never seen a Markdown file. They use Notion and Google Docs.

Our method has to make Claude Code feel less like programming and more like configuring a smart intern. This document is the playbook for every video, every skill, every curriculum module, every install doc.

---

## The Core Mental Model We Sell

We reframe Claude Code into four objects a marketer can hold in their head:

| What it really is | What we call it | Marketer analogy |
|---|---|---|
| `CLAUDE.md` | **The Brief** | The onboarding doc you'd give a new hire |
| Skills | **The Playbook** | A SOP for a recurring task |
| Hooks | **The Guardrails** | Brand voice rules and approval gates |
| MCPs | **The Tool Belt** | Their access to Notion, Gmail, GA4, Publer, etc. |

We never say "MCP" without saying "tool belt" the first time. We never say "CLAUDE.md" without saying "brief" the first time. After that, we use the real names. We're upgrading their vocabulary on purpose.

## The Four-Step Setup We Teach

Every workflow we ship follows the same 4-step build. Marketers learn to think in this shape so they can build their own.

### Step 1: Write the Brief
What is this assistant's role? Who do they work for? What's the brand voice? What can they touch? Output: a `CLAUDE.md`.

### Step 2: Plug in the Tool Belt
Which MCPs does this assistant need to do the job? Output: a `~/.claude/settings.json` with the right MCPs configured.

### Step 3: Write the Playbook
What's the recurring task? What are the inputs? What's the desired output? Output: a skill in `~/.claude/skills/[skill-name]/SKILL.md`.

### Step 4: Set the Guardrails
What should never happen? What needs approval? Output: hooks in `settings.json`.

Every video, every skill, every module follows this shape. Repetition is the curriculum.

---

## The First-Win Doctrine

The single biggest threat to this business is install friction. A marketer who doesn't get a working output in their first 10 minutes is gone forever.

**Every onboarding flow must produce a real output in under 10 minutes.** Not "you've installed something." A real, useful artifact. A drafted email. A weekly report. A list of 10 SEO keywords. Something they screenshot and send to a friend.

Rules for the first-win flow:

1. **One command to install.** We give them a curl-able install script. No Homebrew tutorials, no "first install Node.js." If we can't bundle it, we hide it.
2. **One MCP active.** Don't make them auth Notion + Gmail + GA4 on day one. Pick one. Notion is the safest first choice (everyone has it).
3. **One skill runs.** Pre-configured. They type one prompt and get one output.
4. **The output is shareable.** It should be something a marketer would actually post in Slack to their team.

If the first win takes longer than 10 minutes, we re-engineer the flow before we ship more videos.

---

## How We Teach Inside Videos

### The Demo-First Rule
Show the output in the first 15 seconds. Always. Marketers don't watch tutorials to learn the tool. They watch to see if the result is worth the install.

Order of every long-form video:
1. **The result** (0-30s). The finished thing. The polished output.
2. **The pain** (30-60s). What this used to take. Why it sucked.
3. **The build** (1-8 min). The 4 steps. Brief, Tool Belt, Playbook, Guardrails.
4. **The receipt** (8-10 min). Run it live. Show the time stamp.
5. **The give** (10-12 min). Where to grab it. (The free Skool.)

### The "Pause and Copy" Cue
Every time we show a prompt or a config block on screen, we say: "Pause. Copy this."

This trains the audience that the videos are operational, not theoretical. They start to take notes. The clips also auto-generate: "this is the prompt" close-up = a perfect Reel.

### The Transparency Rule
Show the failures. When Claude misfires, leave it in the cut. Then show the fix. The audience trusts you more when you don't pretend everything is one-shot.

---

## How We Teach Inside Skills

A skill is a teaching artifact, not just a tool. Every skill we ship has:

```
~/.claude/skills/skill-name/
├── SKILL.md          # The playbook (Claude reads this)
├── README.md         # Plain-English guide for the marketer
├── EXAMPLE.md        # A real run, with real output
└── PROMPT.md         # The exact prompt to invoke it
```

The `README.md` is the teaching layer. It explains:
- What this skill does in one sentence
- Which MCPs it needs
- The 3 inputs the marketer has to provide
- What the output looks like
- 1-2 customization tips

Marketers should be able to read the README and modify the SKILL.md without us.

---

## How We Teach Inside the Curriculum (Paid Tier)

The Marketing OS curriculum is 12 modules. Each module follows this template:

### Module shape (every module is the same)

1. **The Job** (5 min video). One marketing job (e.g. "weekly reporting"). What it usually takes. Why it sucks.
2. **The Stack** (10 min video). The MCPs and skills involved. The Brief / Tool Belt / Playbook / Guardrails for this job.
3. **The Build** (20-30 min video). Build it together, on screen.
4. **The Templates** (download bundle). CLAUDE.md template + skill files + sample data.
5. **The Homework** (1 task). Apply it to their real workflow. Post the result in #wins.
6. **The Office Hours** (live, recorded). Brendan reviews 5-10 member submissions.

The cadence trains a habit. By module 4, they're not waiting for the build video to start configuring. By module 8, they're shipping their own skills and posting them.

---

## How We Teach in Short-Form

Short-form has 30-60 seconds. We can't teach in that window. We teach the **idea**, not the build.

The job of a short-form post is to install one of these ideas:
- "There's a thing called a skill that runs my Monday report."
- "The reason mine sounds like me is a hook that blocks em dashes."
- "Notion MCP means Claude can read and write my Notion directly."

Every short-form post is a single idea, repeated until it's vocabulary. We don't try to fit a tutorial into 60 seconds. We seed concepts that pay off when they hit the long-form video or the skill download.

---

## What We Don't Teach

- **Programming.** We don't teach JavaScript, Python, bash, regex, or anything that smells like code class. If a skill needs a script, we ship the script pre-written.
- **Prompt engineering theory.** We don't lecture on chain-of-thought, few-shot, role prompting. We just show prompts that work.
- **AI hype.** We don't teach why AI matters. The audience is past that.
- **General Claude.** We don't teach "how to use Claude." We teach how to run Claude Code as a marketing operator.

---

## Tone Inside Teaching

- We assume competence. We don't say "don't worry, it's easy." We say "here's the line, paste it."
- We name the friction. "Yes, this part is annoying. Here's why we still do it."
- We don't apologize for the tool. We shape the workflow to hide its rough edges.
- We never end a teaching beat with "and that's it!" We end with a result. "There's the report. Took 14 seconds."

---

## The Litmus Test

Before publishing any teaching content (video, skill, module, post), ask:

1. Could a smart marketer who's never opened a terminal follow this?
2. Is there a real artifact they walk away with?
3. Does it follow the Brief / Tool Belt / Playbook / Guardrails shape?
4. Did I show the output before the build?
5. Did I tell them where to grab it?

If yes to all five: ship.
