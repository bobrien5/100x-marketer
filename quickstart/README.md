# 10-Minute First Win

You will install Claude Code, drop in a starter Brief and one skill, and produce a real, shippable marketing campaign brief in under 10 minutes. No coding. No MCP setup yet. That comes in Module 2.

If you get stuck at any step, post in `#install-help` in the [free 100x Marketer community](https://www.skool.com/100x-marketer). We answer in under an hour during US business hours.

---

## What you'll have at the end

A polished, ready-to-ship campaign brief in your `~/Marketing/` folder. Real Markdown. Real structure. Something you'd send to a freelancer or paste into Notion right now.

**Time:** 10 minutes
**Cost:** Free (uses Anthropic's free tier or your existing Claude Pro plan)
**Required:** A Mac or a Windows machine. That's it.

---

## Step 1: Install Claude Code (3 minutes)

Claude Code is a terminal app from Anthropic. Don't worry about the word "terminal." You'll type one prompt in plain English and read the output.

**Mac:**
1. Open the Terminal app (Spotlight: Cmd+Space, type "Terminal")
2. Paste this and press Enter:
   ```bash
   curl -fsSL https://claude.ai/install.sh | bash
   ```
3. Type `claude` and press Enter. Sign in with your Anthropic account when prompted.

**Windows:**
1. Open PowerShell
2. Paste this and press Enter:
   ```powershell
   irm https://claude.ai/install.ps1 | iex
   ```
3. Type `claude` and press Enter. Sign in.

If you don't have an Anthropic account, create one at [claude.ai](https://claude.ai). The free tier works for this walkthrough.

**You'll know it worked when:** you see a `>` prompt waiting for input.

---

## Step 2: Set up your Marketing folder (2 minutes)

We're going to make a folder called `Marketing` in your home directory. Claude Code will work out of this folder.

In the same Terminal/PowerShell window, paste this:

```bash
mkdir -p ~/Marketing/skills/campaign-brief && cd ~/Marketing
curl -fsSL https://raw.githubusercontent.com/bobrien5/100x-marketer/main/quickstart/CLAUDE.md -o CLAUDE.md
curl -fsSL https://raw.githubusercontent.com/bobrien5/100x-marketer/main/quickstart/skills/campaign-brief/SKILL.md -o skills/campaign-brief/SKILL.md
```

This pulls two files from our public GitHub:
- `CLAUDE.md` (the Brief: tells Claude how to act as your marketing operator)
- `skills/campaign-brief/SKILL.md` (the Playbook: a recipe for producing a campaign brief)

**You'll know it worked when:** running `ls` shows `CLAUDE.md` and a `skills` folder.

---

## Step 3: Open the Brief and customize 3 lines (3 minutes)

Open the `CLAUDE.md` file in any text editor. (TextEdit on Mac, Notepad on Windows. Or VS Code if you have it.)

You'll see a starter Brief. Find these three lines near the top and replace them with your real info:

```
- **Company:** [COMPANY NAME]
- **What we sell:** [one-sentence product description]
- **ICP:** [who buys it, what they pay, what their alternative is]
```

Save the file.

**That's the only customization you need for the first win.** The rest of the Brief is pre-filled with sensible defaults you can edit later.

---

## Step 4: Run the skill (2 minutes)

Back in Terminal, you should still be in `~/Marketing`. Start Claude Code:

```bash
claude
```

Now type this prompt and press Enter:

```
Run the campaign-brief skill. The campaign idea is: a 4-week awareness push for our spring product launch targeting first-time buyers. Goal is qualified pipeline.
```

Replace the campaign idea with your own real idea if you have one. (A real one is more fun to read. But the example works fine.)

Claude will read your `CLAUDE.md`, follow the `campaign-brief` skill, and write a full campaign brief into `~/Marketing/briefs/`.

**You'll know it worked when:** Claude says it wrote a file and tells you the filename. Open it. Read it. Send it to a friend.

---

## What just happened

You installed Claude Code (the operator), gave it a Brief (the role), and a Skill (the playbook). One prompt produced a real artifact. That's the entire 100x Marketer model in one workflow.

This is the smallest possible version of the system. From here, every module of the curriculum adds:
- More skills (more jobs you can hand off)
- More MCPs (more tools Claude can touch directly: Notion, Gmail, GA4, Publer)
- More guardrails (hooks that enforce your brand voice automatically)

## Next steps

1. **Post your output** in [`#wins` in the community](https://www.skool.com/100x-marketer). We feature one win per week in the newsletter.
2. **Edit your `CLAUDE.md`.** Add 5 sample lines of your real brand voice. The skill output gets noticeably better.
3. **Module 2 (free):** Add the Notion MCP. Now Claude can write briefs directly to your Notion content calendar.

Got stuck? Post in `#install-help`. Be specific: paste the line you ran and the error message. We'll get you running.

Ship it.
